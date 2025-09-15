const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  stock: {
    type: Number,
    min: 0,
    default: 0,
  },
  sku: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  },
}, { _id: false });

const productReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, "Review title cannot exceed 100 characters"],
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [1000, "Review comment cannot exceed 1000 characters"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  helpful: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["protein", "supplements", "equipment", "apparel", "accessories", "nutrition", "fitness"],
      lowercase: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
      lowercase: true,
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    costPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    weight: {
      value: {
        type: Number,
        min: 0,
      },
      unit: {
        type: String,
        enum: ["g", "kg", "lb", "oz"],
        default: "g",
      },
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      unit: {
        type: String,
        enum: ["cm", "in"],
        default: "cm",
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft", "archived"],
      default: "active",
      index: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "hidden"],
      default: "public",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    features: [{
      type: String,
      trim: true,
    }],
    ingredients: [{
      type: String,
      trim: true,
    }],
    nutritionalInfo: {
      calories: { type: Number, min: 0 },
      protein: { type: Number, min: 0 },
      carbs: { type: Number, min: 0 },
      fat: { type: Number, min: 0 },
      fiber: { type: Number, min: 0 },
      sugar: { type: Number, min: 0 },
      sodium: { type: Number, min: 0 },
    },
    images: [{
      url: {
        type: String,
        required: true,
      },
      alt: {
        type: String,
        trim: true,
      },
      isPrimary: {
        type: Boolean,
        default: false,
      },
    }],
    variants: [productVariantSchema],
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    seo: {
      title: {
        type: String,
        trim: true,
        maxlength: [60, "SEO title cannot exceed 60 characters"],
      },
      description: {
        type: String,
        trim: true,
        maxlength: [160, "SEO description cannot exceed 160 characters"],
      },
      keywords: [{
        type: String,
        trim: true,
        lowercase: true,
      }],
    },
    sales: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviews: [productReviewSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    saleStartDate: {
      type: Date,
    },
    saleEndDate: {
      type: Date,
    },
    relatedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for primary image
productSchema.virtual("primaryImage").get(function () {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images[0] ? this.images[0].url : null);
});

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual("stockStatus").get(function () {
  if (this.stock === 0) return "out_of_stock";
  if (this.stock <= this.lowStockThreshold) return "low_stock";
  return "in_stock";
});

// Virtual for is on sale
productSchema.virtual("isCurrentlyOnSale").get(function () {
  if (!this.isOnSale) return false;
  const now = new Date();
  if (this.saleStartDate && now < this.saleStartDate) return false;
  if (this.saleEndDate && now > this.saleEndDate) return false;
  return true;
});

// Indexes for better query performance
productSchema.index({ name: "text", description: "text", tags: "text", brand: "text" });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ status: 1, visibility: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ sales: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isOnSale: 1 });
productSchema.index({ slug: 1 });

// Pre-save middleware to generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Pre-save middleware to calculate average rating
productSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
    this.reviewCount = this.reviews.length;
  }
  next();
});

// Pre-save middleware to generate SKU if not provided
productSchema.pre("save", async function (next) {
  if (this.isNew && !this.sku) {
    const count = await this.constructor.countDocuments();
    this.sku = `${this.category.toUpperCase()}-${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

// Instance method to add review
productSchema.methods.addReview = function (userId, rating, title, comment) {
  // Remove existing review by same user
  this.reviews = this.reviews.filter(review => review.user.toString() !== userId.toString());
  
  // Add new review
  this.reviews.push({
    user: userId,
    rating,
    title,
    comment,
  });
  
  return this.save();
};

// Instance method to update stock
productSchema.methods.updateStock = function (quantity, operation = "subtract") {
  if (operation === "subtract") {
    this.stock = Math.max(0, this.stock - quantity);
  } else if (operation === "add") {
    this.stock += quantity;
  } else if (operation === "set") {
    this.stock = quantity;
  }
  
  return this.save();
};

// Instance method to check if in stock
productSchema.methods.isInStock = function (quantity = 1) {
  return this.stock >= quantity;
};

// Static method to get featured products
productSchema.statics.getFeatured = function (limit = 10) {
  return this.find({ 
    status: "active", 
    visibility: "public", 
    isFeatured: true 
  }).limit(limit);
};

// Static method to get products on sale
productSchema.statics.getOnSale = function (limit = 10) {
  const now = new Date();
  return this.find({
    status: "active",
    visibility: "public",
    isOnSale: true,
    $or: [
      { saleStartDate: { $lte: now } },
      { saleStartDate: { $exists: false } }
    ],
    $or: [
      { saleEndDate: { $gte: now } },
      { saleEndDate: { $exists: false } }
    ]
  }).limit(limit);
};

// Static method to get low stock products
productSchema.statics.getLowStock = function () {
  return this.find({
    $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    status: "active"
  });
};

// Static method to search products
productSchema.statics.search = function (query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    rating,
    inStock,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 20
  } = options;

  const searchQuery = { status: "active", visibility: "public" };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  if (category) searchQuery.category = category;
  if (minPrice || maxPrice) {
    searchQuery.price = {};
    if (minPrice) searchQuery.price.$gte = minPrice;
    if (maxPrice) searchQuery.price.$lte = maxPrice;
  }
  if (rating) searchQuery.averageRating = { $gte: rating };
  if (inStock) searchQuery.stock = { $gt: 0 };

  const sortObj = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  return this.find(searchQuery)
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit);
};

module.exports = mongoose.model("Product", productSchema);
