const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  getProducts, getProductById,
  createProduct, updateProduct, deleteProduct
} = require("../controllers/productController");

router.get("/", getProducts);            // Public
router.get("/:id", getProductById);      // Public
router.post("/", protect, adminOnly, createProduct);    // Admin only
router.put("/:id", protect, adminOnly, updateProduct);  // Admin only
router.delete("/:id", protect, adminOnly, deleteProduct); // Admin only

module.exports = router;