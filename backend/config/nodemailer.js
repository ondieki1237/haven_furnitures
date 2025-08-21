const nodemailer = require("nodemailer")

// Create email transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  Email credentials not configured. Email functionality will be disabled.")
    return null
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

const transporter = createTransporter()

// Email templates
const emailTemplates = {
  customerInquiry: (data) => ({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to business email
    subject: `New Customer Inquiry - ${data.productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B4513;">New Customer Inquiry - Haven Furnitures</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
        </div>
        
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Product Interest</h3>
          <p><strong>Product:</strong> ${data.productName}</p>
          <p><strong>Category:</strong> ${data.category}</p>
          <p><strong>Price:</strong> $${data.price}</p>
        </div>
        
        ${
          data.message
            ? `
        <div style="background-color: #fff8dc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Customer Message</h3>
          <p style="line-height: 1.6;">${data.message}</p>
        </div>
        `
            : ""
        }
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">
            This inquiry was submitted through the Haven Furnitures website.<br>
            Please respond to the customer within 24 hours.
          </p>
        </div>
      </div>
    `,
  }),

  customerConfirmation: (data) => ({
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: "Thank you for your inquiry - Haven Furnitures",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B4513;">Thank You for Your Inquiry!</h2>
        
        <p>Dear ${data.name},</p>
        
        <p>Thank you for your interest in our <strong>${data.productName}</strong>. We have received your inquiry and will get back to you within 24 hours.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Your Inquiry Details</h3>
          <p><strong>Product:</strong> ${data.productName}</p>
          <p><strong>Category:</strong> ${data.category}</p>
          <p><strong>Price:</strong> $${data.price}</p>
        </div>
        
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Visit Our Store</h3>
          <p><strong>Business Hours:</strong></p>
          <ul style="line-height: 1.8;">
            <li>Monday - Saturday: 8:00 AM - 7:00 PM</li>
            <li>Sunday: 12:00 PM - 6:00 PM</li>
          </ul>
        </div>
        
        <p>We look forward to helping you find the perfect furniture for your home!</p>
        
        <p>Best regards,<br>
        <strong>Haven Furnitures Team</strong></p>
      </div>
    `,
  }),
}

// Send email function
const sendEmail = async (template, data) => {
  if (!transporter) {
    console.log("📧 Email would be sent:", template, data)
    return { success: false, message: "Email service not configured" }
  }

  try {
    const emailOptions = emailTemplates[template](data)
    await transporter.sendMail(emailOptions)
    console.log(`✅ Email sent successfully: ${template}`)
    return { success: true, message: "Email sent successfully" }
  } catch (error) {
    console.error("❌ Email sending failed:", error.message)
    return { success: false, message: "Failed to send email", error: error.message }
  }
}

module.exports = {
  sendEmail,
  emailTemplates,
}
