import mongoose, { type Document, Schema } from "mongoose"

export interface IInterest extends Document {
  name: string
  email: string
  phone?: string
  message?: string
  productName?: string
  productId?: string
  createdAt: Date
}

const InterestSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Please provide a valid email address",
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || /^[+]?[1-9][\d]{0,15}$/.test(v),
        message: "Please provide a valid phone number",
      },
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    productName: {
      type: String,
      trim: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Index for admin queries
InterestSchema.index({ createdAt: -1 })
InterestSchema.index({ email: 1 })

export default mongoose.models.Interest || mongoose.model<IInterest>("Interest", InterestSchema)
