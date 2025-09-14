const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../Controllers/orderController");

const router = express.Router();

router.post("/", createOrder);       // Create new order
router.get("/", getOrders);          // Get all orders
router.get("/:id", getOrderById);    // Get single order
router.put("/:id", updateOrder);     // Update order
router.delete("/:id", deleteOrder);  // Delete order

module.exports = router;
