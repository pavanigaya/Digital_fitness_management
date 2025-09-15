const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { verifyToken } = require("../utils/auth");

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check for token in cookies
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      // Verify token
      const decoded = verifyToken(token);
      
      // Get user from token
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "No user found with this token",
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account has been deactivated",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }

    next();
  };
};

// Require admin role
const requireAdmin = authorize("admin");

// Require admin or trainer role
const requireAdminOrTrainer = authorize("admin", "trainer");

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select("-password");
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we don't fail the request
        console.log("Invalid token in optional auth:", error.message);
      }
    }

    next();
  } catch (error) {
    next();
  }
};

// Check if user owns resource or is admin
const checkOwnershipOrAdmin = (resourceUserIdField = "user") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    // Admin can access everything
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Not authorized to access this resource",
    });
  };
};

// Rate limiting for authentication attempts
const authRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old attempts
    if (attempts.has(key)) {
      const userAttempts = attempts.get(key).filter(time => time > windowStart);
      attempts.set(key, userAttempts);
    }

    const userAttempts = attempts.get(key) || [];
    
    if (userAttempts.length >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: "Too many authentication attempts. Please try again later.",
      });
    }

    // Add current attempt
    userAttempts.push(now);
    attempts.set(key, userAttempts);

    next();
  };
};

module.exports = {
  protect,
  authorize,
  requireAdmin,
  requireAdminOrTrainer,
  optionalAuth,
  checkOwnershipOrAdmin,
  authRateLimit,
};
