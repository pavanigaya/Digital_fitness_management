const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["general", "workout-plan", "product", "service", "bug-report", "feature-request"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: function() {
        return this.type === "workout-plan" || this.type === "product" || this.type === "service";
      },
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      // Can reference different models based on type
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "closed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    adminResponse: {
      message: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      respondedAt: Date,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
feedbackSchema.index({ user: 1, type: 1 });
feedbackSchema.index({ status: 1, priority: 1 });
feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
