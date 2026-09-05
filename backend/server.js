require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const connectDB = require("./db");

const app = express();

const PORT = 5000;

const JWT_SECRET = process.env.JWT_SECRET;

let db;

app.use(cors());
app.use(express.json());


// ======================================================
// JWT AUTHENTICATION
// ======================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT error:", error.message);

    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
}


// ======================================================
// ADMIN MIDDLEWARE
// ======================================================

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
}


// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {
  res.send("Maanya Traders Backend is Running!");
});


// ======================================================
// GET ALL PRODUCTS
// ======================================================

app.get("/api/products", async (req, res) => {
  try {
    const products = await db
      .collection("products")
      .find({})
      .toArray();

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});


// ======================================================
// REGISTER
// ======================================================

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      email: email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
        isAdmin: false,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Something went wrong during registration",
    });
  }
});


// ======================================================
// LOGIN
// ======================================================

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        isAdmin: user.isAdmin || false,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Something went wrong during login",
    });
  }
});


// ======================================================
// GET SINGLE PRODUCT
// ======================================================

app.get("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await db.collection("products").findOne({
      id: id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
});


// ======================================================
// CREATE ORDER
// ======================================================

app.post("/api/orders", async (req, res) => {
  try {
    const { customer, products, total, userId } = req.body;

    if (!customer || !products || products.length === 0) {
      return res.status(400).json({
        message: "Order details are required",
      });
    }

    const newOrder = {
      userId,
      customer,
      products,
      total,
      status: "Placed",
      createdAt: new Date(),
    };

    const result = await db
      .collection("orders")
      .insertOne(newOrder);

    res.status(201).json({
      message: "Order placed successfully",
      order: {
        ...newOrder,
        id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error("Order error:", error);

    res.status(500).json({
      message: "Failed to place order",
    });
  }
});


// ======================================================
// USER'S ORDERS
// ======================================================

app.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await db
      .collection("orders")
      .find({
        userId: userId,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});


// ======================================================
// ADMIN - ADD PRODUCT
// ======================================================

app.post(
  "/api/products",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { name, price, category, image } = req.body;

      if (!name || !price || !category || !image) {
        return res.status(400).json({
          message: "All product fields are required",
        });
      }

      const productsCollection = db.collection("products");

      const lastProduct = await productsCollection
        .find({})
        .sort({
          id: -1,
        })
        .limit(1)
        .toArray();

      const newId =
        lastProduct.length > 0
          ? Number(lastProduct[0].id) + 1
          : 1;

      const newProduct = {
        id: newId,
        name,
        price: Number(price),
        category,
        image,
        createdAt: new Date(),
      };

      const result = await productsCollection.insertOne(
        newProduct
      );

      res.status(201).json({
        message: "Product added successfully",
        product: {
          ...newProduct,
          _id: result.insertedId,
        },
      });
    } catch (error) {
      console.error("Add product error:", error);

      res.status(500).json({
        message: "Failed to add product",
      });
    }
  }
);


// ======================================================
// ADMIN - EDIT PRODUCT
// ======================================================

app.put(
  "/api/products/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const {
        name,
        price,
        category,
        image,
      } = req.body;

      if (!name || !price || !category || !image) {
        return res.status(400).json({
          message: "All product fields are required",
        });
      }

      const updatedProduct = {
        name,
        price: Number(price),
        category,
        image,
        updatedAt: new Date(),
      };

      const result = await db
        .collection("products")
        .updateOne(
          {
            id: id,
          },
          {
            $set: updatedProduct,
          }
        );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product updated successfully",
      });
    } catch (error) {
      console.error("Update product error:", error);

      res.status(500).json({
        message: "Failed to update product",
      });
    }
  }
);


// ======================================================
// ADMIN - DELETE PRODUCT
// ======================================================

app.delete(
  "/api/products/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const result = await db
        .collection("products")
        .deleteOne({
          id: id,
        });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Delete product error:", error);

      res.status(500).json({
        message: "Failed to delete product",
      });
    }
  }
);


// ======================================================
// ADMIN - GET ALL ORDERS
// ======================================================

app.get(
  "/api/admin/orders",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const orders = await db
        .collection("orders")
        .find({})
        .sort({
          createdAt: -1,
        })
        .toArray();

      res.json(orders);
    } catch (error) {
      console.error("Admin orders error:", error);

      res.status(500).json({
        message: "Failed to fetch orders",
      });
    }
  }
);


// ======================================================
// ADMIN - UPDATE ORDER STATUS
// ======================================================

app.put(
  "/api/admin/orders/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const orderId = req.params.id;

      const { status } = req.body;

      const allowedStatuses = [
        "Placed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      if (!ObjectId.isValid(orderId)) {
        return res.status(400).json({
          message: "Invalid order ID",
        });
      }

      const result = await db
        .collection("orders")
        .updateOne(
          {
            _id: new ObjectId(orderId),
          },
          {
            $set: {
              status,
              updatedAt: new Date(),
            },
          }
        );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message: "Order status updated successfully",
      });
    } catch (error) {
      console.error(
        "Order status update error:",
        error
      );

      res.status(500).json({
        message: "Failed to update order status",
      });
    }
  }
);


// ======================================================
// START SERVER
// ======================================================

async function startServer() {
  try {
    db = await connectDB();

    console.log(
      "Database selected:",
      db.databaseName
    );

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );
  }
}

startServer();