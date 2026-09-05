require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();

    console.log("MongoDB connected successfully");

    return client.db("maanya-traders");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

module.exports = connectDB;