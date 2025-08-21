import mongoose, { type Document, Schema } from "mongoose"

export interface IProduct extends Document {
  name: string
  price: number
  description: string
  category: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "living-room",
        "bedroom",
        "dining",
        "office",
        "new-arrivals",
        "sale",
        "promotion",
        "bogo",
        "sofas",
        "beds",
        "dining-sets",
        "tv-stands",
        "shoe-racks",
      ],
      lowercase: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Product image is required"],
      validate: {
        validator: (v: string) => /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v) || v.includes("cloudinary.com"),
        message: "Please provide a valid image URL",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Index for search functionality
ProductSchema.index({ name: "text", description: "text", category: "text" })
ProductSchema.index({ category: 1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ createdAt: -1 })

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
