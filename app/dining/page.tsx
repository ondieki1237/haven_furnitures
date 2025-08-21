"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Search, ArrowLeft } from "lucide-react"
import { InterestForm } from "@/components/interest-form"
import Link from "next/link"
import { api, type Product as BackendProduct } from "@/lib/api"

type Product = BackendProduct

export default function DiningPage() {
  const [adminProducts, setAdminProducts] = useState<Product[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.getProducts({ category: "dining-sets" })
        if (res.success && res.data) setAdminProducts(res.data)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  const sampleProducts = [
    {
      id: "dr-1",
      name: "Oak Dining Table",
      price: 234560,
      description: "Solid oak dining table seats 6-8 people with natural wood finish",
      image: "solid oak dining table with natural wood grain",
      rating: 4.9,
      reviews: 167,
      badge: "Best Seller",
    },
    {
      id: "dr-2",
      name: "Dining Chair Set",
      price: 156780,
      description: "Set of 6 upholstered dining chairs with wooden legs and comfortable padding",
      image: "modern dining chairs with fabric upholstery",
      rating: 4.7,
      reviews: 134,
    },
    {
      id: "dr-3",
      name: "Buffet Cabinet",
      price: 189450,
      description: "Modern sideboard with storage compartments and wine rack",
      image: "contemporary dining room buffet with storage",
      rating: 4.6,
      reviews: 89,
      badge: "New",
    },
    {
      id: "dr-4",
      name: "Bar Cart",
      price: 78900,
      description: "Mobile bar cart with glass shelves and gold-finished frame",
      image: "modern bar cart with glass shelves and wheels",
      rating: 4.5,
      reviews: 67,
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
              Dining Collection
            </h2>
            <p className="text-lg text-muted-foreground mb-6 font-serif leading-relaxed animate-in fade-in-50 duration-1000 delay-400">
              Create memorable dining experiences with our elegant tables, chairs, and dining room accessories.
            </p>
            <div className="flex items-center space-x-4 animate-in slide-in-from-bottom duration-1000 delay-600">
              <Badge variant="secondary" className="text-sm font-serif">
                65+ Items Available
              </Badge>
              <Badge variant="outline" className="text-sm font-serif">
                Custom Sizes
              </Badge>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block animate-in slide-in-from-right duration-1200 delay-300">
          <img
            src="/images/dining-hero.png"
            alt="Modern dining room furniture"
            className="h-full w-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProducts.map((product, index) => (
              <Card
                key={product._id}
                className={`group cursor-pointer hover:shadow-xl transition-all duration-500 border-border hover:border-primary/20 animate-in slide-in-from-bottom duration-700 delay-${((index % 4) + 1) * 100} hover:-translate-y-3`}
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
                    <p className="text-sm text-muted-foreground mb-3 font-serif line-clamp-2">{product.description}</p>
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
                        KSH {product.price.toLocaleString()}
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
                        productId={product._id}
                        productName={product.name}
                        productPrice={product.price.toString()}
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
          <p className="text-sm text-muted-foreground mt-4 font-serif">Showing 4 of 65+ dining items</p>
        </div>
      </section>
    </div>
  )
}
