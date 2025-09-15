const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getLowStock,
  bulkUpdateStock,
  addReview,
  getFeaturedProducts,
  getProductsOnSale,
  searchProducts,
  updateStock,
  getProductAnalytics,
} = require("../Controllers/productController");
const { protect, requireAdmin, optionalAuth } = require("../middleware/auth");
const { validateProduct, validateObjectId, validatePagination } = require("../middleware/validation");

const router = express.Router();

// Public routes
router.get("/", validatePagination, getProducts);
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/on-sale", getProductsOnSale);
router.get("/slug/:slug", getProductBySlug);
// This route must be last to avoid matching other routes
router.get("/:id", validateObjectId, getProductById);

// Protected routes (authenticated users)
router.use(protect);

router.post("/:productId/reviews", addReview); // Add product review
router.get("/:productId/analytics", getProductAnalytics); // Get product analytics

// Admin routes
router.use(requireAdmin);

router.post("/", validateProduct, createProduct);
router.get("/low-stock", getLowStock);
router.put("/:id", validateObjectId, validateProduct, updateProduct);
router.put("/:productId/stock", validateObjectId, updateStock); // Update individual product stock
router.put("/bulk/stock", bulkUpdateStock);
router.delete("/:id", validateObjectId, deleteProduct);

module.exports = router;
