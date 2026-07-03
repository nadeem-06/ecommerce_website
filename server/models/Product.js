const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 }, // How many available
  imageUrl: { type: String },          // Cloudinary URL
  rating: { type: Number, default: 0 }
}, { timestamps: true });

// This enables full-text search on name and description
// Interview point: "I added text indexes so search queries
// hit the index instead of scanning every document"
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);