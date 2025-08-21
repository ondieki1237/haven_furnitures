const express = require("express")
const cloudinary = require("../config/cloudinary")
const upload = require("../middleware/upload")

const router = express.Router()

// POST /api/upload/image - Upload image to Cloudinary
router.post("/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" })
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.log("Cloudinary not configured, using placeholder image")
      return res.json({
        success: true,
        url: "/abstract-geometric-shapes.png",
        public_id: "demo_placeholder",
      })
    }

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "haven-furnitures",
            transformation: [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }, { format: "auto" }],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )
        .end(req.file.buffer)
    })

    res.json({
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    })
  } catch (error) {
    console.error("Upload processing error:", error)

    // Fallback to placeholder if Cloudinary fails
    res.json({
      success: true,
      url: "/abstract-geometric-shapes.png",
      public_id: "demo_placeholder",
    })
  }
})

// DELETE /api/upload/image - Delete image from Cloudinary
router.delete("/image", async (req, res) => {
  try {
    const { public_id } = req.body

    if (!public_id || public_id === "demo_placeholder") {
      return res.json({ success: true, message: "No image to delete" })
    }

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      await cloudinary.uploader.destroy(public_id)
    }

    res.json({
      success: true,
      message: "Image deleted successfully",
    })
  } catch (error) {
    console.error("Delete processing error:", error)
    res.status(500).json({ success: false, message: "Delete failed" })
  }
})

module.exports = router
