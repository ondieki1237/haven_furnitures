const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: {
        values: [
          "sofa sets",
          "coffee tables",
          "stools",
          "consoles",
          "dressing mirror",
          "dinning sets",
          "beds",
          "tv stands",
          "shoe racks",
          "wall drobes",
          "kids beds"
        ],
        message: "Category must be one of: sofa sets, coffee tables, stools, consoles, dressing mirror, dinning sets, beds, tv stands, shoe racks, wall drobes, kids beds",
      },
    },
    imageUrl: {
      type: String,
      required: [true, "Product image is required"],
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better search performance
productSchema.index({ name: "text", description: "text", category: "text" });
productSchema.index({ category: 1 });
productSchema.index({ featured: -1, createdAt: -1 });
productSchema.index({ inStock: 1 });

module.exports = mongoose.model("Product", productSchema);