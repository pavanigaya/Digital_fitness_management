// backend/routes/workoutPlanRoutes.js
const express = require("express");
const router = express.Router();
const {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  toggleStatus,
} = require("../Controllers/workoutPlanController");

router.get("/", getPlans);
router.get("/:id", getPlanById);
router.post("/", createPlan);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);
router.patch("/:id/toggle-status", toggleStatus);

module.exports = router;
