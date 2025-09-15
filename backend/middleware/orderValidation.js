const Order = require("../models/Order");
const Product = require("../models/product");

// Middleware to validate order status transitions
const validateOrderStatusTransition = (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;

  // Valid status transitions
  const validTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: ["returned"],
    cancelled: [],
    returned: [],
  };

  // Get current order status
  Order.findById(id)
    .then(order => {
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const currentStatus = order.status;
      
      if (!validTransitions[currentStatus]?.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot change status from ${currentStatus} to ${status}`,
          validTransitions: validTransitions[currentStatus] || [],
        });
      }

      req.order = order;
      next();
    })
    .catch(err => {
      console.error("Order status validation error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to validate order status",
      });
    });
};

// Middleware to check if order can be cancelled
const validateOrderCancellation = (req, res, next) => {
  const { id } = req.params;

  Order.findById(id)
    .then(order => {
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      if (!order.canBeCancelled()) {
        return res.status(400).json({
          success: false,
          message: "Order cannot be cancelled at this stage",
          currentStatus: order.status,
        });
      }

      req.order = order;
      next();
    })
    .catch(err => {
      console.error("Order cancellation validation error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to validate order cancellation",
      });
    });
};

// Middleware to validate order ownership
const validateOrderOwnership = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  Order.findById(id)
    .then(order => {
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Admin can access any order
      if (userRole === "admin") {
        req.order = order;
        return next();
      }

      // Users can only access their own orders
      if (order.user.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only access your own orders.",
        });
      }

      req.order = order;
      next();
    })
    .catch(err => {
      console.error("Order ownership validation error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to validate order ownership",
      });
    });
};

module.exports = {
  validateOrderStatusTransition,
  validateOrderCancellation,
  validateOrderOwnership,
};
