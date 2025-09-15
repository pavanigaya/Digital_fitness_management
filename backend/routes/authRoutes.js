const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../Controllers/authController");
const { protect, authRateLimit } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", authRateLimit(5, 15 * 60 * 1000), register); // 5 attempts per 15 minutes
router.post("/login", authRateLimit(5, 15 * 60 * 1000), login); // 5 attempts per 15 minutes
router.post("/refresh", refreshToken);
router.post("/forgot-password", authRateLimit(3, 15 * 60 * 1000), forgotPassword); // 3 attempts per 15 minutes
router.put("/reset-password/:token", resetPassword);

// Protected routes
router.use(protect); // All routes below this middleware are protected
router.get("/me", getMe);
router.post("/logout", logout);
router.put("/change-password", changePassword);

module.exports = router;
