import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Interest from "@/models/Interest"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const skip = (page - 1) * limit
    const interests = await Interest.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("productId", "name price")
      .lean()

    const total = await Interest.countDocuments({})

    return NextResponse.json({
      success: true,
      data: interests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching interests:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch interests" }, { status: 500 })
  }
}
