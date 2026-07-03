const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number // Store price at time of order — price can change later
    }
  ],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  // Order moves through these stages
  status: {
    type: String,
    enum: ["placed", "confirmed", "shipped", "delivered"],
    default: "placed"
  },
  // Razorpay gives us this after successful payment
  paymentId: { type: String },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);