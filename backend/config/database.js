const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://bellarinseth:DaazSgZl1PPmAK1F@cluster0.iaroxm6.mongodb.net/haven-furnitures",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("❌ Database connection error:", error.message)
    process.exit(1)
  }
}

module.exports = connectDB
