const mongoose = require("mongoose");

const workoutSessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1,
  },
  exercises: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sets: {
      type: Number,
      min: 1,
    },
    reps: {
      type: String, // e.g., "8-12", "30 seconds"
      trim: true,
    },
    weight: {
      type: String, // e.g., "bodyweight", "10-15 lbs"
      trim: true,
    },
    rest: {
      type: Number, // in seconds
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  }],
  order: {
    type: Number,
    required: true,
  },
}, { _id: false });

const workoutReviewSchema = new mongoose.Schema({
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
  completed: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
}, {
  timestamps: true,
});

const workoutPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Workout plan name is required"],
      trim: true,
      unique: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    duration: {
      value: {
        type: Number,
        required: true,
        min: 1,
      },
      unit: {
        type: String,
        enum: ["days", "weeks", "months"],
        default: "weeks",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
      required: true,
    },
    category: {
      type: String,
      enum: ["strength", "cardio", "flexibility", "weight-loss", "muscle-gain", "endurance", "sports-specific", "rehabilitation", "general-fitness"],
      required: true,
    },
    goals: [{
      type: String,
      enum: ["weight-loss", "muscle-gain", "endurance", "strength", "flexibility", "general-fitness", "sports-performance", "rehabilitation"],
    }],
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainerInfo: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      bio: {
        type: String,
        trim: true,
      },
      certifications: [{
        type: String,
        trim: true,
      }],
      experience: {
        type: Number, // years
        min: 0,
      },
      profileImage: {
        type: String,
      },
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 10,
      default: 1,
    },
    equipment: [{
      name: {
        type: String,
        required: true,
        trim: true,
      },
      required: {
        type: Boolean,
        default: true,
      },
      alternatives: [{
        type: String,
        trim: true,
      }],
    }],
    sessions: [workoutSessionSchema],
    schedule: {
      type: String,
      enum: ["daily", "weekly", "custom"],
      default: "weekly",
    },
    frequency: {
      type: Number, // sessions per week
      min: 1,
      max: 7,
      default: 3,
    },
    maxMembers: {
      type: Number,
      min: 1,
      default: 100,
    },
    activeMembers: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft", "archived"],
      default: "active",
      index: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "members-only"],
      default: "public",
    },
    features: [{
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      included: {
        type: Boolean,
        default: true,
      },
    }],
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
    videos: [{
      title: {
        type: String,
        required: true,
        trim: true,
      },
      url: {
        type: String,
        required: true,
      },
      duration: {
        type: Number, // in seconds
        min: 0,
      },
      thumbnail: {
        type: String,
      },
    }],
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    reviews: [workoutReviewSchema],
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
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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
    prerequisites: [{
      type: String,
      trim: true,
    }],
    warnings: [{
      type: String,
      trim: true,
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
workoutPlanSchema.virtual("primaryImage").get(function () {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images[0] ? this.images[0].url : null);
});

// Virtual for discount percentage
workoutPlanSchema.virtual("discountPercentage").get(function () {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

// Virtual for duration in days
workoutPlanSchema.virtual("durationInDays").get(function () {
  const { value, unit } = this.duration;
  switch (unit) {
    case "days":
      return value;
    case "weeks":
      return value * 7;
    case "months":
      return value * 30;
    default:
      return value;
  }
});

// Virtual for is on sale
workoutPlanSchema.virtual("isCurrentlyOnSale").get(function () {
  if (!this.isOnSale) return false;
  const now = new Date();
  if (this.saleStartDate && now < this.saleStartDate) return false;
  if (this.saleEndDate && now > this.saleEndDate) return false;
  return true;
});

// Virtual for availability
workoutPlanSchema.virtual("isAvailable").get(function () {
  return this.status === "active" && this.activeMembers < this.maxMembers;
});

// Indexes for better query performance
workoutPlanSchema.index({ name: "text", description: "text", tags: "text" });
workoutPlanSchema.index({ category: 1, level: 1 });
workoutPlanSchema.index({ status: 1, visibility: 1 });
workoutPlanSchema.index({ price: 1 });
workoutPlanSchema.index({ averageRating: -1 });
workoutPlanSchema.index({ activeMembers: -1 });
workoutPlanSchema.index({ createdAt: -1 });
workoutPlanSchema.index({ isFeatured: 1 });
workoutPlanSchema.index({ isOnSale: 1 });
workoutPlanSchema.index({ slug: 1 });
workoutPlanSchema.index({ trainer: 1 });

// Pre-save middleware to generate slug
workoutPlanSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Pre-save middleware to calculate average rating
workoutPlanSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
    this.reviewCount = this.reviews.length;
  }
  next();
});

// Instance method to add review
workoutPlanSchema.methods.addReview = function (userId, rating, title, comment) {
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

// Instance method to add member
workoutPlanSchema.methods.addMember = function () {
  if (this.activeMembers < this.maxMembers) {
    this.activeMembers += 1;
    return this.save();
  }
  throw new Error("Workout plan is at maximum capacity");
};

// Instance method to remove member
workoutPlanSchema.methods.removeMember = function () {
  if (this.activeMembers > 0) {
    this.activeMembers -= 1;
    return this.save();
  }
};

// Instance method to check if user can join
workoutPlanSchema.methods.canJoin = function (user) {
  if (this.status !== "active") return false;
  if (this.activeMembers >= this.maxMembers) return false;
  if (this.visibility === "private") return false;
  return true;
};

// Static method to get featured plans
workoutPlanSchema.statics.getFeatured = function (limit = 10) {
  return this.find({ 
    status: "active", 
    visibility: "public", 
    isFeatured: true 
  }).limit(limit);
};

// Static method to get plans on sale
workoutPlanSchema.statics.getOnSale = function (limit = 10) {
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

// Static method to search plans
workoutPlanSchema.statics.search = function (query, options = {}) {
  const {
    category,
    level,
    minPrice,
    maxPrice,
    rating,
    available,
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
  if (level) searchQuery.level = level;
  if (minPrice || maxPrice) {
    searchQuery.price = {};
    if (minPrice) searchQuery.price.$gte = minPrice;
    if (maxPrice) searchQuery.price.$lte = maxPrice;
  }
  if (rating) searchQuery.averageRating = { $gte: rating };
  if (available) {
    searchQuery.$expr = { $lt: ["$activeMembers", "$maxMembers"] };
  }

  const sortObj = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  return this.find(searchQuery)
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit);
};

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);
