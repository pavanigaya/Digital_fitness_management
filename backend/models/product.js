const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Optional human-friendly code/SKU (not the Mongo _id)
    sku: { type: String, trim: true, unique: true, sparse: true },

    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["protein", "supplements", "equipment", "apparel", "accessories"],
      lowercase: true,
    },
    price: { type: Number, required: true, min: 0 },

    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 10, min: 0 },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    sales: { type: Number, default: 0, min: 0 },

    images: [{ type: String }],
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

// Simple text index for search
productSchema.index({ name: "text", category: "text", sku: "text" });

module.exports = mongoose.model("Product", productSchema);
