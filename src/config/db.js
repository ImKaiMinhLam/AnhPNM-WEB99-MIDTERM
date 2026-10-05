const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });

  console.log("MongoDB connected");
}

module.exports = connectDB;
