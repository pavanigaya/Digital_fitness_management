const Product = require("../models/product");

// Middleware to check product availability
const checkProductAvailability = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
        status: product.status,
      });
    }

    if (!product.isInStock(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
        available: product.stock,
        requested: quantity,
      });
    }

    req.product = product;
    next();
  } catch (err) {
    console.error("Product availability check error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to check product availability",
    });
  }
};

// Middleware to validate multiple products for order
const validateOrderProducts = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    const validatedItems = [];
    const errors = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        errors.push(`Product with ID ${item.product} not found`);
        continue;
      }

      if (product.status !== "active") {
        errors.push(`Product ${product.name} is not available`);
        continue;
      }

      if (!product.isInStock(item.quantity)) {
        errors.push(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        continue;
      }

      validatedItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        image: product.primaryImage,
        category: product.category,
        price: product.price,
        quantity: item.quantity,
        totalPrice: product.price * item.quantity,
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Product validation failed",
        errors,
      });
    }

    req.validatedItems = validatedItems;
    next();
  } catch (err) {
    console.error("Order products validation error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to validate order products",
    });
  }
};

// Middleware to check if product can be reviewed
const validateProductReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Cannot review inactive product",
      });
    }

    // Check if user has already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === userId.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    req.product = product;
    next();
  } catch (err) {
    console.error("Product review validation error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to validate product review",
    });
  }
};

// Middleware to validate product ownership (for admin/trainer)
const validateProductOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Admin can access any product
    if (userRole === "admin") {
      req.product = product;
      return next();
    }

    // Only creator can modify their product
    if (product.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only modify products you created.",
      });
    }

    req.product = product;
    next();
  } catch (err) {
    console.error("Product ownership validation error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to validate product ownership",
    });
  }
};

module.exports = {
  checkProductAvailability,
  validateOrderProducts,
  validateProductReview,
  validateProductOwnership,
};
