const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    name: "iPhone 15",
    price: 70000,
    category: "Mobile",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiDEwRlO8iG6SSEjdrLg8yhR9_TmXs4bpfP56TNRb1aw&s=10",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    price: 65000,
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
  },
  {
    id: 3,
    name: "MacBook Air",
    price: 90000,
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  },
];

app.get("/", (req, res) => {
    res.send("Maanya Traders Backend is Running!");
  });
  
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
  
    const product = products.find((product) => product.id === id);
  
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
  
    res.json(product);
  });
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});