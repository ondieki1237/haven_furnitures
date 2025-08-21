"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Search, Filter, ArrowLeft } from "lucide-react"
import { InterestForm } from "@/components/interest-form"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  imageUrl: string
  createdAt: string
}

export default function LivingRoomPage() {
  const [adminProducts, setAdminProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    const savedProducts = localStorage.getItem("haven_products")
    if (savedProducts) {
      const products = JSON.parse(savedProducts)
      setAdminProducts(products.filter((p: Product) => p.category === "living-room"))
    }
  }, [])

  // Sample living room products to show when no admin products exist
  const sampleProducts = [
    {
      id: "lr-1",
      name: "Modern Sectional Sofa",
      price: 324870,
      description: "Spacious L-shaped sectional with premium fabric upholstery and deep cushions",
      image: "modern gray sectional sofa with chaise lounge",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
    },
    {
      id: "lr-2",
      name: "Glass Coffee Table",
      price: 89250,
      description: "Contemporary tempered glass coffee table with chrome legs",
      image: "modern glass coffee table with metal frame",
      rating: 4.6,
      reviews: 89,
    },
    {
      id: "lr-3",
      name: "Accent Armchair",
      price: 156780,
      description: "Comfortable accent chair with wooden legs and fabric upholstery",
      image: "modern accent chair in neutral fabric",
      rating: 4.7,
      reviews: 67,
      badge: "New",
    },
    {
      id: "lr-4",
      name: "Entertainment Center",
      price: 234560,
      description: "Wall-mounted TV unit with storage compartments and cable management",
      image: "modern wall mounted entertainment center",
      rating: 4.5,
      reviews: 45,
    },
    {
      id: "lr-5",
      name: "Floor Lamp Set",
      price: 67890,
      description: "Set of 2 modern floor lamps with adjustable height and warm LED lighting",
      image: "contemporary floor lamps with adjustable heads",
      rating: 4.9,
      reviews: 156,
    },
    {
      id: "lr-6",
      name: "Ottoman Storage Bench",
      price: 78900,
      description: "Multi-functional ottoman with hidden storage and soft cushioned top",
      image: "modern storage ottoman in neutral color",
      rating: 4.4,
      reviews: 78,
    },
  ]

  const allProducts = adminProducts.length > 0 ? adminProducts : sampleProducts

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-200">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary font-sans hover:scale-105 transition-transform duration-300 cursor-pointer">
                  Haven Furnitures
                </h1>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-200">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-200">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-200">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-background via-muted/50 to-accent/30 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl animate-in slide-in-from-left duration-1000">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-sans leading-tight animate-in fade-in-50 duration-1000 delay-200">
              Living Room Collection
            </h2>
            <p className="text-lg text-muted-foreground mb-6 font-serif leading-relaxed animate-in fade-in-50 duration-1000 delay-400">
              Create the perfect gathering space with our curated selection of sofas, tables, and accent pieces.
            </p>
            <div className="flex items-center space-x-4 animate-in slide-in-from-bottom duration-1000 delay-600">
              <Badge variant="secondary" className="text-sm font-serif">
                120+ Items Available
              </Badge>
              <Badge variant="outline" className="text-sm font-serif">
                Free Delivery
              </Badge>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block animate-in slide-in-from-right duration-1200 delay-300">
          <img
            src="/images/living-room-hero.png"
            alt="Modern living room furniture"
            className="h-full w-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
          />
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="py-6 bg-muted/20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in-50 duration-600">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="font-serif hover:scale-105 transition-transform duration-200 bg-transparent"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <span className="text-sm text-muted-foreground font-serif">
                Showing {allProducts.length} of 120+ products
              </span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground font-serif focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProducts.map((product, index) => (
              <Card
                key={product.id}
                className={`group cursor-pointer hover:shadow-xl transition-all duration-500 border-border hover:border-primary/20 animate-in slide-in-from-bottom duration-700 delay-${((index % 6) + 1) * 100} hover:-translate-y-3`}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={
                        adminProducts.length > 0
                          ? product.imageUrl || `/placeholder.svg?height=400&width=400&query=${product.name}`
                          : `/placeholder.svg?height=400&width=400&query=${product.image}`
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.badge && (
                      <Badge
                        className={`absolute top-4 left-4 font-serif animate-in zoom-in-50 duration-500 delay-300 ${
                          product.badge === "Sale"
                            ? "bg-destructive"
                            : product.badge === "New"
                              ? "bg-accent text-accent-foreground"
                              : "bg-primary"
                        }`}
                      >
                        {product.badge}
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-foreground mb-2 font-sans group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3 font-serif line-clamp-2">
                      {adminProducts.length > 0 ? product.description : product.description}
                    </p>
                    {product.rating && (
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 transition-colors duration-200 ${i < Math.floor(product.rating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground ml-2 font-serif">({product.reviews})</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-primary font-sans">
                        KSH {adminProducts.length > 0 ? product.price.toLocaleString() : product.price.toLocaleString()}
                      </span>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 font-serif hover:scale-105 transition-transform duration-200"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <InterestForm
                        productId={product.id}
                        productName={product.name}
                        productPrice={(adminProducts.length > 0 ? product.price : product.price).toString()}
                        triggerClassName="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Load More */}
      <section className="py-8 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Button
            size="lg"
            variant="outline"
            className="font-serif hover:scale-105 transition-transform duration-200 animate-in fade-in-50 duration-600 bg-transparent"
          >
            Load More Products
          </Button>
          <p className="text-sm text-muted-foreground mt-4 font-serif">Showing 6 of 120+ living room items</p>
        </div>
      </section>
    </div>
  )
}
