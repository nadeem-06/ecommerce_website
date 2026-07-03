const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  placeOrder, getMyOrders,
  getAllOrders, updateOrderStatus
} = require("../controllers/orderController");

router.post("/", protect, placeOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;