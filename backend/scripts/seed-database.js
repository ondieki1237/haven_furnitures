const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Product = require("../models/Product")

// Load environment variables
dotenv.config()

const sampleProducts = [
  {
    name: "Modern 3-Seater Sofa",
    description:
      "Comfortable and stylish 3-seater sofa perfect for any living room. Features premium fabric upholstery and solid wood frame.",
    price: 899.99,
    category: "sofas",
    imageUrl: "/modern-3-seater-sofa.png",
    inStock: true,
    featured: true,
  },
  {
    name: "Queen Size Platform Bed",
    description:
      "Minimalist platform bed with built-in nightstands. Crafted from sustainable oak wood with a natural finish.",
    price: 1299.99,
    category: "beds",
    imageUrl: "/queen-platform-bed-oak.png",
    inStock: true,
    featured: true,
  },
  {
    name: "6-Piece Dining Set",
    description:
      "Complete dining set including table and 6 chairs. Perfect for family gatherings with elegant design and durable construction.",
    price: 1599.99,
    category: "dining-sets",
    imageUrl: "/six-piece-dining-set.png",
    inStock: true,
    featured: false,
  },
  {
    name: "Modern TV Stand",
    description: "Sleek TV stand with cable management and storage compartments. Supports TVs up to 65 inches.",
    price: 399.99,
    category: "tv-stands",
    imageUrl: "/modern-tv-stand.png",
    inStock: true,
    featured: false,
  },
  {
    name: "5-Tier Shoe Rack",
    description: "Space-saving shoe rack that holds up to 25 pairs. Made from durable bamboo with a natural finish.",
    price: 79.99,
    category: "shoe-racks",
    imageUrl: "/placeholder-1vy5m.png",
    inStock: true,
    featured: false,
  },
  {
    name: "L-Shaped Sectional Sofa",
    description:
      "Spacious L-shaped sectional perfect for large living rooms. Features reversible chaise and premium cushioning.",
    price: 1499.99,
    category: "sofas",
    imageUrl: "/gray-l-shaped-sectional.png",
    inStock: true,
    featured: true,
  },
  {
    name: "King Size Storage Bed",
    description:
      "King size bed with built-in storage drawers. Maximize your bedroom space with this functional and stylish bed.",
    price: 1799.99,
    category: "beds",
    imageUrl: "/placeholder-p19rj.png",
    inStock: false,
    featured: false,
  },
  {
    name: "Compact 4-Seater Dining Set",
    description:
      "Perfect for small spaces. Includes round table and 4 matching chairs with comfortable cushioned seats.",
    price: 699.99,
    category: "dining-sets",
    imageUrl: "/compact-round-dining-set.png",
    inStock: true,
    featured: false,
  },
]

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://bellarinseth:DaazSgZl1PPmAK1F@cluster0.iaroxm6.mongodb.net/haven-furnitures",
    )

    console.log("✅ Connected to MongoDB")

    // Clear existing products
    await Product.deleteMany({})
    console.log("🗑️  Cleared existing products")

    // Insert sample products
    const products = await Product.insertMany(sampleProducts)
    console.log(`✅ Inserted ${products.length} sample products`)

    console.log("\n📦 Sample Products Added:")
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`)
    })

    console.log("\n🎉 Database seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    await mongoose.connection.close()
    console.log("🔌 Database connection closed")
  }
}

// Run the seed function
seedDatabase()
