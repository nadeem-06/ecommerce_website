const Cart = require("../models/Cart");

// GET /api/cart
const getCart = async (req, res) => {
  try {
    // populate() replaces productId with actual product data
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate("items.productId");
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/cart — add item
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      // First time — create new cart for this user
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      // Already in cart — just increase quantity
      existingItem.quantity += quantity;
    } else {
      // New product — add to cart
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/cart/:productId — remove item
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    // Filter out the item to remove
    cart.items = cart.items.filter(
      item => item.productId.toString() !== req.params.productId
    );
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/cart — clear entire cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };