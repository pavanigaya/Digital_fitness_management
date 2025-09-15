const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  getOrdersByStatus,
  deleteOrder,
} = require("../Controllers/orderController");
const { protect, requireAdmin, checkOwnershipOrAdmin } = require("../middleware/auth");
const { validateOrder, validateObjectId, validatePagination } = require("../middleware/validation");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Customer routes
router.post("/", validateOrder, createOrder);
router.get("/my-orders", validatePagination, getOrders); // Get user's own orders
router.get("/stats", getOrderStats); // Get user's order statistics
router.get("/status/:status", validatePagination, getOrdersByStatus); // Get orders by status
router.get("/:id", validateObjectId, checkOwnershipOrAdmin("user"), getOrderById);
router.put("/:id/cancel", validateObjectId, cancelOrder); // Cancel order

// Admin routes
router.use(requireAdmin);
router.get("/", validatePagination, getOrders); // Get all orders (admin only)
router.get("/stats", getOrderStats); // Get all order statistics (admin only)
router.put("/:id", validateObjectId, updateOrder);
router.put("/:id/status", validateObjectId, updateOrderStatus); // Update order status
router.delete("/:id", validateObjectId, deleteOrder);

module.exports = router;
