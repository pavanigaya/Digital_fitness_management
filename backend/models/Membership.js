const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    durationUnit: {
      type: String,
      enum: ["days", "weeks", "months", "years"],
      default: "months",
    },
    features: [{
      name: {
        type: String,
        required: true,
      },
      description: String,
      included: {
        type: Boolean,
        default: true,
      },
    }],
    maxWorkoutPlans: {
      type: Number,
      default: 0, // 0 means unlimited
    },
    personalTrainingSessions: {
      type: Number,
      default: 0,
    },
    nutritionConsultation: {
      type: Boolean,
      default: false,
    },
    prioritySupport: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
membershipSchema.index({ isActive: 1, sortOrder: 1 });
membershipSchema.index({ price: 1 });

module.exports = mongoose.model("Membership", membershipSchema);
