const { body, param, query, validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  
  body("phone")
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),
  
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date of birth")
    .custom((value) => {
      if (new Date(value) >= new Date()) {
        throw new Error("Date of birth must be in the past");
      }
      return true;
    }),
  
  body("gender")
    .optional()
    .isIn(["male", "female", "other", "prefer-not-to-say"])
    .withMessage("Please provide a valid gender"),
  
  body("fitnessLevel")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Please provide a valid fitness level"),
  
  body("goals")
    .optional()
    .isArray()
    .withMessage("Goals must be an array"),
  
  body("goals.*")
    .optional()
    .isIn(["weight-loss", "muscle-gain", "endurance", "strength", "flexibility", "general-fitness"])
    .withMessage("Please provide valid goals"),
  
  handleValidationErrors,
];

const validateUserLogin = [
  body("emailOrUsername")
    .notEmpty()
    .withMessage("Email or username is required"),
  
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  
  handleValidationErrors,
];

const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("New password must contain at least one uppercase letter, one lowercase letter, and one number"),
  
  handleValidationErrors,
];

// Product validation rules
const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 200 })
    .withMessage("Product name cannot exceed 200 characters"),
  
  body("category")
    .isIn(["protein", "supplements", "equipment", "apparel", "accessories"])
    .withMessage("Please provide a valid category"),
  
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),
  
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  
  body("lowStockThreshold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Low stock threshold must be a non-negative integer"),
  
  body("status")
    .optional()
    .isIn(["active", "inactive", "draft", "archived"])
    .withMessage("Status must be one of: active, inactive, draft, archived"),
  
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  
  handleValidationErrors,
];

// Order validation rules
const validateOrder = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  
  body("items.*.product")
    .notEmpty()
    .withMessage("Product ID is required for each item"),
  
  body("items.*.name")
    .notEmpty()
    .withMessage("Product name is required for each item"),
  
  body("items.*.price")
    .isNumeric()
    .withMessage("Price must be a number for each item")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0 for each item"),
  
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer for each item"),
  
  body("items.*.totalPrice")
    .isNumeric()
    .withMessage("Total price must be a number for each item")
    .isFloat({ min: 0 })
    .withMessage("Total price must be greater than or equal to 0 for each item"),
  
  body("shippingInfo.fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),
  
  body("shippingInfo.email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  
  body("shippingInfo.phone")
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),
  
  body("shippingInfo.address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),
  
  body("shippingInfo.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),
  
  body("shippingInfo.postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required"),
  
  body("paymentMethod")
    .isIn(["card", "cash"])
    .withMessage("Payment method must be either card or cash"),
  
  body("totalPrice")
    .isNumeric()
    .withMessage("Total price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Total price must be greater than or equal to 0"),
  
  handleValidationErrors,
];

// Workout plan validation rules
const validateWorkoutPlan = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Workout plan name is required")
    .isLength({ max: 200 })
    .withMessage("Workout plan name cannot exceed 200 characters"),
  
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  
  body("duration.value")
    .isNumeric()
    .withMessage("Duration value must be a number")
    .isInt({ min: 1 })
    .withMessage("Duration value must be at least 1"),
  
  body("duration.unit")
    .isIn(["days", "weeks", "months"])
    .withMessage("Duration unit must be days, weeks, or months"),
  
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),
  
  body("level")
    .isIn(["beginner", "intermediate", "advanced", "expert"])
    .withMessage("Level must be beginner, intermediate, advanced, or expert"),
  
  body("category")
    .isIn(["strength", "cardio", "flexibility", "weight-loss", "muscle-gain", "endurance", "sports-specific", "rehabilitation", "general-fitness"])
    .withMessage("Category must be one of the valid categories"),
  
  body("trainer")
    .isMongoId()
    .withMessage("Trainer must be a valid user ID"),
  
  body("trainerInfo.name")
    .trim()
    .notEmpty()
    .withMessage("Trainer name is required"),
  
  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),
  
  body("features.*.name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Feature name is required"),
  
  handleValidationErrors,
];

// Feedback validation rules
const validateFeedback = [
  body("type")
    .isIn(["general", "workout-plan", "product", "service", "bug-report", "feature-request"])
    .withMessage("Please provide a valid feedback type"),
  
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ max: 200 })
    .withMessage("Subject cannot exceed 200 characters"),
  
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 2000 })
    .withMessage("Message cannot exceed 2000 characters"),
  
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  
  handleValidationErrors,
];

// ID parameter validation
const validateObjectId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ID format"),
  
  handleValidationErrors,
];

// Pagination validation
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validatePasswordChange,
  validateProduct,
  validateOrder,
  validateWorkoutPlan,
  validateFeedback,
  validateObjectId,
  validatePagination,
};
