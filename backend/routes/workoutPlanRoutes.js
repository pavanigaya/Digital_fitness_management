const express = require("express");
const {
  createPlan,
  getPlans,
  getPlanById,
  getPlanBySlug,
  updatePlan,
  deletePlan,
  toggleStatus,
  addReview,
  joinPlan,
  leavePlan,
  getFeaturedPlans,
  getPlansOnSale,
  searchPlans,
  getPlanAnalytics,
} = require("../Controllers/workoutPlanController");
const { protect, requireAdmin, requireAdminOrTrainer } = require("../middleware/auth");
const { validateWorkoutPlan, validateObjectId, validatePagination } = require("../middleware/validation");

const router = express.Router();

// Public routes
router.get("/", validatePagination, getPlans);
router.get("/search", searchPlans);
router.get("/featured", getFeaturedPlans);
router.get("/on-sale", getPlansOnSale);
router.get("/slug/:slug", getPlanBySlug);
router.get("/:id", validateObjectId, getPlanById);

// Protected routes (authenticated users)
router.use(protect);

router.post("/:planId/reviews", addReview); // Add workout plan review
router.post("/:planId/join", joinPlan); // Join workout plan
router.post("/:planId/leave", leavePlan); // Leave workout plan
router.get("/:planId/analytics", getPlanAnalytics); // Get plan analytics

// Admin and trainer routes
router.use(requireAdminOrTrainer);

router.post("/", validateWorkoutPlan, createPlan);
router.put("/:id", validateObjectId, validateWorkoutPlan, updatePlan);
router.delete("/:id", validateObjectId, deletePlan);
router.patch("/:id/toggle-status", validateObjectId, toggleStatus);

module.exports = router;
