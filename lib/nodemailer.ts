import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "demo@example.com",
    pass: process.env.EMAIL_PASS || "demo-password",
  },
})

export default transporter
