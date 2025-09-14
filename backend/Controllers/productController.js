const Product = require("../models/product");

// Create
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (err) {
    return res.status(400).json({ message: err.message });
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
    // req.body = [{id, stock}, ...]
    const ops = (req.body || []).map((p) => ({
      updateOne: {
        filter: { _id: p.id },
        update: { $set: { stock: p.stock } },
      },
    }));

    if (!ops.length) {
      return res.status(400).json({ message: "No items to update" });
    }

    const result = await Product.bulkWrite(ops);
    return res.json({ matched: result.matchedCount, modified: result.modifiedCount });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
