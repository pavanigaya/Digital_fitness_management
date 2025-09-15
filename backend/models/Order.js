const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sku: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

const shippingInfoSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, "Full name cannot exceed 100 characters"],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, "Address cannot exceed 200 characters"],
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, "City cannot exceed 50 characters"],
  },
  state: {
    type: String,
    trim: true,
    maxlength: [50, "State cannot exceed 50 characters"],
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, "Postal code cannot exceed 20 characters"],
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: "US",
    maxlength: [50, "Country cannot exceed 50 characters"],
  },
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [orderItemSchema],
    shippingInfo: shippingInfoSchema,
    billingInfo: {
      type: shippingInfoSchema,
      default: function() {
        return this.shippingInfo;
      },
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash", "paypal", "stripe", "apple_pay", "google_pay"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      default: "pending",
    },
    paymentId: {
      type: String,
      trim: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
      index: true,
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    trackingUrl: {
      type: String,
      trim: true,
    },
    estimatedDelivery: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    isGift: {
      type: Boolean,
      default: false,
    },
    giftMessage: {
      type: String,
      trim: true,
      maxlength: [200, "Gift message cannot exceed 200 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for order age
orderSchema.virtual("ageInDays").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for order summary
orderSchema.virtual("summary").get(function () {
  return {
    orderNumber: this.orderNumber,
    status: this.status,
    totalPrice: this.totalPrice,
    itemCount: this.items.length,
    createdAt: this.createdAt,
  };
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ "shippingInfo.email": 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre("save", function (next) {
  if (this.isModified("items") || this.isModified("subtotal") || this.isModified("tax") || this.isModified("shippingCost") || this.isModified("discount")) {
    this.subtotal = this.items.reduce((total, item) => total + item.totalPrice, 0);
    this.totalPrice = this.subtotal + this.tax + this.shippingCost - this.discount;
  }
  next();
});

// Instance method to update status
orderSchema.methods.updateStatus = function (newStatus, additionalData = {}) {
  this.status = newStatus;
  
  if (newStatus === "delivered") {
    this.deliveredAt = new Date();
  } else if (newStatus === "cancelled") {
    this.cancelledAt = new Date();
    if (additionalData.reason) {
      this.cancellationReason = additionalData.reason;
    }
  }
  
  return this.save();
};

// Instance method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function () {
  return ["pending", "confirmed", "processing"].includes(this.status);
};

// Instance method to check if order can be returned
orderSchema.methods.canBeReturned = function () {
  if (this.status !== "delivered") return false;
  if (!this.deliveredAt) return false;
  
  const daysSinceDelivery = Math.floor((Date.now() - this.deliveredAt) / (1000 * 60 * 60 * 24));
  return daysSinceDelivery <= 30; // 30-day return policy
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function (userId = null, dateRange = null) {
  const match = {};
  if (userId) match.user = userId;
  if (dateRange) {
    match.createdAt = {
      $gte: dateRange.start,
      $lte: dateRange.end,
    };
  }

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
        averageOrderValue: { $avg: "$totalPrice" },
        statusCounts: {
          $push: "$status",
        },
      },
    },
  ]);

  return stats[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    statusCounts: [],
  };
};

module.exports = mongoose.model("Order", orderSchema);
