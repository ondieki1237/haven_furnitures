# Haven Furnitures Backend API

A Node.js/Express backend API for the Haven Furnitures e-commerce platform.

## Features

- 🛋️ Complete furniture product management (CRUD operations)
- 🔍 Advanced search and filtering
- 📸 Image upload with Cloudinary integration
- 📧 Customer inquiry handling with email notifications
- 🗄️ MongoDB database with Mongoose ODM
- 🔒 Security middleware (Helmet, CORS, Rate limiting)
- ✅ Input validation and error handling

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment setup:**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Start production server:**
   \`\`\`bash
   npm start
   \`\`\`

## API Endpoints

### Products
- `GET /api/products` - Get all products (with search/filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Customer Interests
- `POST /api/interests` - Submit customer inquiry
- `GET /api/interests` - Get all inquiries (admin)

### File Upload
- `POST /api/upload/image` - Upload product image
- `DELETE /api/upload/image` - Delete image

### Health Check
- `GET /api/health` - API status check

## Environment Variables

See `.env.example` for all required environment variables.

## Business Hours
- Monday - Saturday: 8:00 AM - 7:00 PM
- Sunday: 12:00 PM - 6:00 PM

## Product Categories
- Sofas
- Beds  
- Dining Sets
- TV Stands
- Shoe Racks
