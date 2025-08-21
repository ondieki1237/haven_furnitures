import { type NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function DELETE(request: NextRequest) {
  try {
    const { public_id } = await request.json()

    if (!public_id || public_id === "demo_placeholder") {
      return NextResponse.json({ success: true, message: "No image to delete" })
    }

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      await cloudinary.uploader.destroy(public_id)
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    })
  } catch (error) {
    console.error("Delete processing error:", error)
    return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 })
  }
}
