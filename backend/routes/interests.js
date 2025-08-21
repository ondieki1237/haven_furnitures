const express = require("express")
const Interest = require("../models/Interest")
const Product = require("../models/Product")
const { validateInterest } = require("../middleware/validation")
const { sendEmail } = require("../config/nodemailer")

const router = express.Router()

// GET /api/interests - Get all interests (admin)
router.get("/", async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const interests = await Interest.find({})
      .sort({ createdAt: -1 })
      .limit(Number.parseInt(limit))
      .skip(skip)
      .populate("productId", "name price category")
      .lean()

    const total = await Interest.countDocuments({})

    res.json({
      success: true,
      data: interests,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
    })
  } catch (error) {
    console.error("Error fetching interests:", error)
    res.status(500).json({ success: false, message: "Failed to fetch interests" })
  }
})

// POST /api/interests - Submit customer interest
router.post("/", validateInterest, async (req, res) => {
  try {
    const { name, email, phone, productId, message } = req.body

    // Get product details for email
    const product = await Product.findById(productId).lean()
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    // Create interest record
    const interest = new Interest({
      name,
      email,
      phone,
      message,
      productName: product.name,
      productId: product._id,
    })

    await interest.save()

    // Send email notifications
    const emailData = {
      name,
      email,
      phone,
      message,
      productName: product.name,
      category: product.category,
      price: product.price,
    }

    // Send email to business
    await sendEmail("customerInquiry", emailData)

    // Send confirmation email to customer
    await sendEmail("customerConfirmation", emailData)

    res.status(201).json({
      success: true,
      message: "Interest submitted successfully",
      data: interest,
    })
  } catch (error) {
    console.error("Error processing interest:", error)
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message })
    }
    res.status(500).json({ success: false, message: "Failed to process interest" })
  }
})

module.exports = router
