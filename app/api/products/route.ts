import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const query: any = {}

    // Filter by category
    if (category && category !== "all") {
      query.category = category
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit
    const products = await Product.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip).lean()

    const total = await Product.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, price, description, category, imageUrl } = body

    // Validation
    if (!name || !price || !description || !category || !imageUrl) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      return NextResponse.json({ success: false, message: "Invalid price" }, { status: 400 })
    }

    const product = new Product({
      name,
      price: Number(price),
      description,
      category,
      imageUrl,
    })

    await product.save()

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: product,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    if (error.name === "ValidationError") {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: "Failed to create product" }, { status: 500 })
  }
}
