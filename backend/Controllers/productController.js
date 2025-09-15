const Product = require("../models/product");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(400).json({
      success: false,
      message: "Failed to create product",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Read (list) with search/filter/sort/pagination
exports.getProducts = async (req, res) => {
  try {
    const {
      search = "",
      category,
      status,
      minPrice,
      maxPrice,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const q = {};
    if (search) {
      q.$text = { $search: search };
    }
    if (category && category !== "all") q.category = category.toLowerCase();
    if (status) q.status = status;
    if (minPrice || maxPrice) {
      q.price = {};
      if (minPrice) q.price.$gte = Number(minPrice);
      if (maxPrice) q.price.$lte = Number(maxPrice);
    }

    const sortObj = { [sort]: order === "asc" ? 1 : -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, count] = await Promise.all([
      Product.find(q).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(q),
    ]);

    return res.json({
      items,
      page: Number(page),
      limit: Number(limit),
      total: count,
      totalPages: Math.ceil(count / Number(limit)) || 1,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Read single
exports.getProductById = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });
    return res.json(prod);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Update
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Delete
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Low-stock list
exports.getLowStock = async (req, res) => {
  try {
    const items = await Product.find({
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    }).sort({ stock: 1 });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Bulk stock update (e.g., after shipment)
exports.bulkUpdateStock = async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products provided for bulk update",
      });
    }

    const ops = products.map((p) => ({
      updateOne: {
        filter: { _id: p.id },
        update: { 
          $set: { 
            stock: p.stock,
            updatedBy: req.user._id,
          } 
        },
      },
    }));

    const result = await Product.bulkWrite(ops);
    
    res.json({
      success: true,
      message: "Stock updated successfully",
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount,
      },
    });
  } catch (err) {
    console.error("Bulk update stock error:", err);
    res.status(400).json({
      success: false,
      message: "Failed to update stock",
    });
  }
};

// Add Product Review
exports.addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.addReview(req.user._id, rating, title, comment);

    res.json({
      success: true,
      message: "Review added successfully",
      data: product,
    });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(400).json({
      success: false,
      message: "Failed to add review",
    });
  }
};

// Get Featured Products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await Product.getFeatured(Number(limit));

    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    console.error("Get featured products error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve featured products",
    });
  }
};

// Get Products on Sale
exports.getProductsOnSale = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await Product.getOnSale(Number(limit));

    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    console.error("Get products on sale error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products on sale",
    });
  }
};

// Search Products
exports.searchProducts = async (req, res) => {
  try {
    const {
      q: query,
      category,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const options = {
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rating: rating ? Number(rating) : undefined,
      inStock: inStock === "true",
      sortBy,
      sortOrder,
      page: Number(page),
      limit: Number(limit),
    };

    const products = await Product.search(query, options);
    const total = await Product.countDocuments({
      status: "active",
      visibility: "public",
      ...(query ? { $text: { $search: query } } : {}),
      ...(category ? { category } : {}),
      ...(minPrice || maxPrice ? {
        price: {
          ...(minPrice ? { $gte: Number(minPrice) } : {}),
          ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
        }
      } : {}),
      ...(rating ? { averageRating: { $gte: Number(rating) } } : {}),
      ...(inStock === "true" ? { stock: { $gt: 0 } } : {}),
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (err) {
    console.error("Search products error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to search products",
    });
  }
};

// Get Product by Slug
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.error("Get product by slug error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
    });
  }
};

// Update Product Stock
exports.updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, operation = "set" } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.updateStock(quantity, operation);

    res.json({
      success: true,
      message: "Stock updated successfully",
      data: product,
    });
  } catch (err) {
    console.error("Update stock error:", err);
    res.status(400).json({
      success: false,
      message: "Failed to update stock",
    });
  }
};

// Get Product Analytics
exports.getProductAnalytics = async (req, res) => {
  try {
    const { productId } = req.params;
    const { startDate, endDate } = req.query;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const analytics = {
      views: product.views,
      sales: product.sales,
      averageRating: product.averageRating,
      reviewCount: product.reviewCount,
      stockStatus: product.stockStatus,
      isOnSale: product.isCurrentlyOnSale,
      discountPercentage: product.discountPercentage,
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (err) {
    console.error("Get product analytics error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product analytics",
    });
  }
};
