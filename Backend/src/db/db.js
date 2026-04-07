const mongoose = require("mongoose");

async function connectDb() {
  try {
    console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "chatnova", // 🔥 IMPORTANT FIX
      serverSelectionTimeoutMS: 10000,
      family: 4
    });

    console.log("✅ MongoDB connected");
    console.log("📦 DB NAME:", mongoose.connection.name);

  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
}

module.exports = connectDb;