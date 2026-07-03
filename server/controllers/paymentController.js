const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const crypto = require("crypto"); // Built into Node — no install needed

// Initialize Razorpay with your keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// POST /api/payment/create-order
// Frontend calls this first to get a Razorpay order ID
const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in paise (₹1 = 100 paise)

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/payment/verify
// Called after Razorpay payment succeeds
// Verifies the payment is genuine using signature
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId // Our DB order ID
    } = req.body;

    // Create expected signature using our secret
    // Interview point: "Signature verification proves the
    // payment came from Razorpay, not a fake request"
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Payment is genuine — mark order as paid
    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      paymentId: razorpay_payment_id,
      status: "confirmed"
    });

    // Clear user's cart after successful payment
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.json({ message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentOrder, verifyPayment };