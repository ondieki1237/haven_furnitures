import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Interest from "@/models/Interest"
import transporter from "@/lib/nodemailer"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { customerName, customerEmail, customerPhone, customerLocation, productId, productName, productPrice } =
      await request.json()

    const interest = new Interest({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      message: customerLocation ? `Location: ${customerLocation}` : undefined,
      productName,
      productId: productId || undefined,
    })

    await interest.save()

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `New Interest: ${productName || "General Inquiry"}`,
          html: `
            <h2>New Customer Interest</h2>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Phone:</strong> ${customerPhone || "Not provided"}</p>
            <p><strong>Location:</strong> ${customerLocation || "Not provided"}</p>
            ${productName ? `<p><strong>Product:</strong> ${productName}</p>` : ""}
            ${productPrice ? `<p><strong>Price:</strong> $${productPrice}</p>` : ""}
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          `,
        })
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Interest recorded successfully",
    })
  } catch (error) {
    console.error("Error processing interest form:", error)
    return NextResponse.json({ success: false, message: "Failed to process request" }, { status: 500 })
  }
}
