const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Name is compulsory
  },
  email: {
    type: String,
    required: true,
    unique: true // No two users with same email
  },
  password: {
    type: String,
    required: true // Stored as hash, never plain text
  },
  role: {
    type: String,
    enum: ["user", "admin"], // Only these two values allowed
    default: "user"          // Everyone is "user" by default
  }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model("User", userSchema);