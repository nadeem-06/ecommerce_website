const mongoose = require("mongoose");

// This function connects our app to MongoDB
const connectDB = async () => {
  try {
    // MONGO_URI comes from your .env file
    // No fallback to localhost — if URI is missing, it should fail loudly
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1); // Stop the server if DB fails — don't run without a database
  }
};

module.exports = connectDB;