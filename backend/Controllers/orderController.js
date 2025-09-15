const Order = require("../models/Order");
const Product = require("../models/product");

// CREATE Order
const createOrder = async (req, res) => {
  try {
    const { items, shippingInfo, billingInfo, paymentMethod, notes, isGift, giftMessage } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // Check product availability and calculate totals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product} not found`,
        });
      }

      if (!product.isInStock(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku || '',
        image: product.primaryImage || '',
        category: product.category,
        price: product.price,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${String(orderCount + 1).padStart(4, "0")}`;

    // Create order data
    const orderData = {
      orderNumber,
      user: req.user._id,
      items: validatedItems,
      shippingInfo,
      billingInfo: billingInfo || shippingInfo,
      paymentMethod,
      subtotal,
      totalPrice: subtotal, // Will be calculated with tax/shipping in pre-save
      notes,
      isGift: isGift || false,
      giftMessage,
    };

    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
    const order = await Order.create(orderData);

    // Update product stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity, sales: item.quantity } }
      );
    }

    // Populate user data for response
    await order.populate("user", "firstName lastName email");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// READ All Orders (admin) or User's Orders
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, sort = "createdAt", order = "desc" } = req.query;
    
    let query = {};
    
    // If user is not admin, only show their orders
    if (req.user.role !== "admin") {
      query.user = req.user._id;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    const sortObj = { [sort]: order === "asc" ? 1 : -1 };
    const skip = (Number(page) - 1) * Number(limit);
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "firstName lastName email")
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// READ Single Order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("items.product", "name sku images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error("Get order by ID error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order",
    });
  }
};

// UPDATE Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, trackingUrl, notes } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Validate status transition
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: ["returned"],
      cancelled: [],
      returned: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    // Update order
    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (trackingUrl) updateData.trackingUrl = trackingUrl;
    if (notes) updateData.notes = notes;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true }
    ).populate("user", "firstName lastName email");

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

// CANCEL Order
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
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
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity, sales: -item.quantity } }
      );
    }

    // Update order status
    await order.updateStatus("cancelled", { reason });

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};

// GET Order Statistics
const getOrderStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.role === "admin" ? null : req.user._id;

    const dateRange = startDate && endDate ? {
      start: new Date(startDate),
      end: new Date(endDate),
    } : null;

    const stats = await Order.getOrderStats(userId, dateRange);

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error("Get order stats error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order statistics",
    });
  }
};

// GET Orders by Status
const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const query = { status };
    if (req.user.role !== "admin") {
      query.user = req.user._id;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (err) {
    console.error("Get orders by status error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
    });
  }
};

// UPDATE Order (general update)
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.user;
    delete updateData.orderNumber;
    delete updateData.totalPrice;
    delete updateData.subtotal;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true }
    ).populate("user", "firstName lastName email");

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};

// DELETE Order
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only allow deletion of pending or cancelled orders
    if (!["pending", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Only pending or cancelled orders can be deleted",
      });
    }

    await Order.findByIdAndDelete(orderId);

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  getOrdersByStatus,
  deleteOrder,
};
