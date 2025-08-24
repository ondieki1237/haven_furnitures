const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Newsletter" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Newsletter Subscription",
      text: `New subscriber: ${email}`,
      html: `<h3>New Subscriber</h3><p>Email: ${email}</p>`,
    });

    await transporter.sendMail({
      from: `"Haven Furnitures" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for subscribing!",
      text: "Thank you for subscribing to Haven Furnitures newsletter.",
      html: `<h3>Thank you for subscribing!</h3><p>You'll now receive updates on new arrivals and exclusive offers.</p>`,
    });

    res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

module.exports = router;