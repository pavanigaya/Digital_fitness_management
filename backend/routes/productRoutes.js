const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStock,
  bulkUpdateStock,
} = require("../Controllers/productController");

const router = express.Router();

// (Optional) simple admin guard placeholder
// Replace with real auth middleware when you add auth/JWT
const requireAdmin = (req, res, next) => {
  // Example: if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};

// CRUD
router.post("/", requireAdmin, createProduct);
router.get("/", getProducts);
router.get("/low-stock", requireAdmin, getLowStock);
router.get("/:id", getProductById);
router.put("/:id", requireAdmin, updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

// Bulk stock updates
router.put("/bulk/stock", requireAdmin, bulkUpdateStock);

module.exports = router;
