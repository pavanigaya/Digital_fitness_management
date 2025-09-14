// backend/models/WorkoutPlan.js
const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    duration: { type: String, required: true }, // e.g., "12 weeks"
    price: { type: Number, required: true, min: 0 },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    trainer: { type: String, required: true, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    activeMembers: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    features: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);
