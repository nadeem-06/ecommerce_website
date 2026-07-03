const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  // Each cart belongs to one user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // Items is an array — each item has a product and quantity
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);