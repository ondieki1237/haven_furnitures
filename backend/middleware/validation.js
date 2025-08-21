const { body, validationResult } = require("express-validator")

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }
  next()
}

// Product validation rules
const validateProduct = [
  body("name").trim().isLength({ min: 1, max: 100 }).withMessage("Product name is required (1-100 characters)"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description is required (10-1000 characters)"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category").isIn(["sofas", "beds", "dining-sets", "tv-stands", "shoe-racks"]).withMessage("Invalid category"),
  body("inStock").isBoolean().withMessage("Stock status must be boolean"),
  body("featured").optional().isBoolean().withMessage("Featured status must be boolean"),
  handleValidationErrors,
]

// Interest validation rules
const validateInterest = [
  body("name").trim().isLength({ min: 1, max: 50 }).withMessage("Name is required (1-50 characters)"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("phone")
    .trim()
    .matches(/^[+]?[1-9][\d]{0,15}$/)
    .withMessage("Valid phone number is required"),
  body("productId").isMongoId().withMessage("Valid product ID is required"),
  body("message").optional().trim().isLength({ max: 500 }).withMessage("Message too long (max 500 characters)"),
  handleValidationErrors,
]

module.exports = {
  validateProduct,
  validateInterest,
  handleValidationErrors,
}
