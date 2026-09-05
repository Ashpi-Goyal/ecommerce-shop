const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://MaanyaTraders:maanyadb@maanya-traders.dod8oec.mongodb.net/?appName=maanya-traders";

const client = new MongoClient(uri);

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

async function seedProducts() {
  try {
    await client.connect();

    const db = client.db("maanya-traders");

    const productsCollection = db.collection("products");

    await productsCollection.deleteMany({});

    const result = await productsCollection.insertMany(products);

    console.log(`${result.insertedCount} products inserted successfully`);
  } catch (error) {
    console.error("Error inserting products:", error);
  } finally {
    await client.close();
  }
}

seedProducts();