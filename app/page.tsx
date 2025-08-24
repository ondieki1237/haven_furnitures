"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Search, Menu, User, Sparkles, X } from "lucide-react"
import { InterestForm } from "@/components/interest-form"
import { SearchDropdown } from "@/components/search-dropdown"
import Link from "next/link"
import { api, type Product as BackendProduct } from "@/lib/api"
import { useRouter } from "next/navigation"

type Product = BackendProduct

export default function HomePage() {
  const [adminProducts, setAdminProducts] = useState<Product[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [cart, setCart] = useState<Product[]>([])
  const [showCart, setShowCart] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const router = useRouter()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Fetch products
  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.getProducts()
        if (res.success && res.data) setAdminProducts(res.data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoaded(true)
      }
    })()
  }, [])

  const newArrivals: Product[] = []
  const saleProducts: Product[] = []
  const featuredProducts = adminProducts.slice(0, 6) // Show latest 6 products

  // Add to cart handler
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id)
      if (exists) return prev // Prevent duplicates
      return [...prev, product]
    })
  }

  // Remove from cart handler
  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((p) => p._id !== productId))
  }

  // Toggle cart modal
  const toggleCart = () => {
    setShowCart(!showCart)
  }

  // Newsletter subscription handler
  const handleNewsletterSubscribe = async () => {
    setNewsletterLoading(true);
    setNewsletterMsg("");
    try {
      const res = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterMsg("🎉 Subscription successful! Check your email.");
        setNewsletterEmail("");
      } else {
        setNewsletterMsg(data.message || "❌ Subscription failed");
      }
    } catch {
      setNewsletterMsg("⚠️ Something went wrong");
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-background transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      {showSearch && <SearchDropdown onClose={() => setShowSearch(false)} />}

      {/* Cart Modal */}
      {showCart && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-end"
          onClick={() => setShowCart(false)} // Close modal on overlay click
        >
          <div
            className="bg-background w-full max-w-md h-full p-6 overflow-y-auto shadow-xl animate-in slide-in-from-right duration-500"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the cart from closing it
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground font-sans">Your Cart</h2>
              <Button variant="ghost" size="icon" onClick={toggleCart}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            {cart.length === 0 ? (
              <p className="text-muted-foreground font-serif text-center">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 border-b pb-4">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground font-sans">{item.name}</h4>
                      <p className="text-sm text-muted-foreground font-serif">${item.price}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveFromCart(item._id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="mt-6">
                  <p className="text-lg font-bold text-foreground font-sans">
                    Total: ${cart.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2)}
                  </p>
                  <InterestForm
                    productId={cart.map(item => item._id).join(",")}
                    productName={cart.map(item => item.name).join(", ")}
                    productPrice={cart.reduce((sum, item) => sum + Number(item.price), 0).toString()}
                    triggerClassName="w-full mt-4 bg-primary hover:bg-primary/90"
                    cartProducts={cart}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b border-border animate-in slide-in-from-top duration-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary font-sans hover:scale-110 transition-all duration-500 cursor-pointer animate-in fade-in-50 duration-700 hover:text-primary/80 relative group">
                  Haven
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </h1>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  href="/living-room"
                  className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-500 font-serif hover:scale-110 animate-in fade-in-50 duration-700 delay-100 relative group overflow-hidden"
                >
                  Living Room
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/bedroom"
                  className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-500 font-serif hover:scale-110 animate-in fade-in-50 duration-700 delay-200 relative group overflow-hidden"
                >
                  Bedroom
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/dining"
                  className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-500 font-serif hover:scale-110 animate-in fade-in-50 duration-700 delay-300 relative group overflow-hidden"
                >
                  Dining
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/office"
                  className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-500 font-serif hover:scale-110 animate-in fade-in-50 duration-700 delay-400 relative group overflow-hidden"
                >
                  Office
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/admin"
                  className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-500 font-serif hover:scale-110 animate-in fade-in-50 duration-700 delay-500 relative group overflow-hidden"
                >
                  Admin
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="hover:scale-125 transition-all duration-300 hover:bg-primary/10 hover:rotate-12"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-125 transition-all duration-300 hover:bg-primary/10 hover:text-red-500"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-125 transition-all duration-300 hover:bg-primary/10 hover:-rotate-12 relative"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-2 py-0.5 font-bold shadow">
                    {cart.length}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-125 transition-all duration-300 hover:bg-primary/10"
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:scale-125 transition-all duration-300 hover:bg-primary/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
<section className="relative h-[600px] sm:h-[700px] bg-background overflow-hidden">
  {/* Background Image and Overlay */}
  <div className="absolute inset-0">
    <img
      src="/hero.png"
      alt="Luxury furniture showcase"
      className="w-full h-full object-cover object-center opacity-80"
    />
    <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent"></div>
  </div>
  {/* Subtle Radial Gradient for Depth */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,90,43,0.15),transparent_60%)]"></div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center">
    {/* Content Container */}
    <div className="max-w-2xl space-y-6 sm:space-y-8 z-10 animate-in slide-in-from-left duration-1000">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-sans text-white tracking-tight">
  Elevate Your Space with{" "}
  <span className="text-brown-600 animate-in fade-in-50 duration-1000 delay-200">Luxury</span>
  <br />
  Embrace{" "}
  <span className="text-white animate-in fade-in-50 duration-1000 delay-300">Timeless Simplicity</span>
</h1>


        
      <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/90 font-serif leading-relaxed max-w-md animate-in fade-in-50 duration-1000 delay-400">
        Discover our curated collection of premium furniture, blending exquisite design with unparalleled comfort.
      </p>
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom duration-1000 delay-500">
        <Button
          size="lg"
          className="bg-brown-600 text-white hover:bg-brown-700 font-serif font-bold tracking-wide px-6 sm:px-8 py-3 rounded-xl border-2 border-brown-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-brown-800/50 relative overflow-hidden group"
          onClick={() => router.push("/living-room")}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          Shop Now
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="px-6 sm:px-8 py-3 rounded-xl border-brown-400 text-brown-600 hover:bg-brown-100/50 hover:border-brown-500 transition-all duration-300 hover:scale-105"
          onClick={() => router.push("/about")}
        >
          About Us
        </Button>
      </div>
      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6 text-center sm:text-left animate-in fade-in-50 duration-1000 delay-600">
        <div>
          <h4 className="font-semibold text-base sm:text-lg text-primary-foreground">Quality</h4>
          <p className="text-sm text-primary-foreground/80 font-serif">Unmatched Craftsmanship</p>
        </div>
        <div>
          <h4 className="font-semibold text-base sm:text-lg text-primary-foreground">Style</h4>
          <p className="text-sm text-primary-foreground/80 font-serif">Modern Elegance</p>
        </div>
        <div>
          <h4 className="font-semibold text-base sm:text-lg text-primary-foreground">Comfort</h4>
          <p className="text-sm text-primary-foreground/80 font-serif">Ultimate Relaxation</p>
        </div>
      </div>
    </div>
  </div>
</section>

      {newArrivals.length > 0 && (
        <section className="py-16 bg-accent/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(139,90,43,0.02)_50%,transparent_75%)] bg-[length:60px_60px] animate-pulse"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12 animate-in fade-in-50 duration-800">
              <h3 className="text-3xl font-bold text-foreground mb-4 font-sans relative inline-block">
                New Arrivals
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
              </h3>
              <p className="text-muted-foreground font-serif">Fresh additions to our premium collection</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newArrivals.map((product, index) => (
                <Card
                  key={product._id}
                  className={`group cursor-pointer hover:shadow-2xl transition-all duration-700 border-border hover:border-primary/30 animate-in slide-in-from-bottom duration-700 delay-${(index + 1) * 150} hover:-translate-y-4 hover:rotate-1 relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="p-0 relative">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={
                          product.imageUrl ||
                          `/abstract-geometric-shapes.png?height=400&width=400&query=${product.name || "/placeholder.svg"}`
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                      />
                      <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground font-serif animate-in zoom-in-50 duration-500 delay-300 hover:scale-110 transition-transform duration-300">
                        New
                      </Badge>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-125 hover:bg-red-50 hover:text-red-500"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-foreground mb-2 font-sans group-hover:text-primary transition-colors duration-500">
                        {product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3 font-serif line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-primary font-sans group-hover:scale-110 transition-transform duration-300">
                          ${product.price}
                        </span>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 font-serif hover:scale-110 transition-all duration-300 hover:shadow-lg relative overflow-hidden group/btn"
                          onClick={() => handleAddToCart(product)}
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
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
      )}

      {saleProducts.length > 0 && (
        <section className="py-16 bg-destructive/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-in fade-in-50 duration-800">
              <h3 className="text-3xl font-bold text-foreground mb-4 font-sans">Special Offers</h3>
              <p className="text-muted-foreground font-serif">Limited time deals and exclusive promotions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {saleProducts.map((product, index) => (
                <Card
                  key={product._id}
                  className={`group cursor-pointer hover:shadow-xl transition-all duration-500 border-border hover:border-primary/20 animate-in slide-in-from-bottom duration-700 delay-${(index + 1) * 150} hover:-translate-y-3`}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={
                          product.imageUrl ||
                          `/abstract-geometric-shapes.png?height=400&width=400&query=${product.name || "/placeholder.svg"}`
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge
                        className={`absolute top-4 left-4 font-serif animate-in zoom-in-50 duration-500 delay-300 ${
                          product.category === "bogo" ? "bg-green-600" : "bg-destructive"
                        }`}
                      >
                        {product.category === "bogo" ? "BOGO" : product.category === "promotion" ? "Special" : "Sale"}
                      </Badge>
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
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-primary font-sans">${product.price}</span>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 font-serif hover:scale-105 transition-transform duration-200"
                          onClick={() => handleAddToCart(product)}
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
      )}

      {/* Featured Categories */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-in fade-in-50 duration-800">
            <h3 className="text-4xl font-bold text-primary mb-4 font-sans relative inline-block tracking-tight">
              Shop by Category
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </h3>
            <p className="text-lg text-muted-foreground font-serif">Find the perfect pieces for every room in your home</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              { name: "Living Room", image: "/livingroom.png", items: "120+ items", href: "/living-room", color: "from-amber-200 to-amber-100" },
              { name: "Bedroom", image: "/bed.png", items: "85+ items", href: "/bedroom", color: "from-amber-100 to-amber-50" },
              { name: "Dining", image: "/dining.png", items: "65+ items", href: "/dining", color: "from-accent to-primary/10" },
              { name: "Office", image: "/office.png", items: "45+ items", href: "/office", color: "from-primary/10 to-accent/10" },
            ].map((category, index) => (
              <Link key={category.name} href={category.href}>
                <Card
                  className={`
                    group cursor-pointer border-none shadow-lg hover:shadow-2xl transition-all duration-500
                    rounded-3xl overflow-hidden bg-gradient-to-br ${category.color}
                    hover:scale-105 animate-in slide-in-from-bottom duration-600 delay-${(index + 1) * 100}
                    relative
                  `}
                >
                  <CardContent className="p-0 relative">
                    <div className="aspect-square overflow-hidden rounded-t-3xl relative">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/10">
                        <div className="bg-white/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-200 shadow-lg">
                          <span className="text-3xl">
                            {index === 0 ? "🛋️" : index === 1 ? "🛏️" : index === 2 ? "🍽️" : "💼"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 text-center">
                      <h4 className="text-2xl font-semibold text-primary mb-2 font-sans group-hover:text-amber-700 transition-colors duration-500">
                        {category.name}
                      </h4>
                      <p className="text-base text-muted-foreground font-serif group-hover:text-foreground transition-colors duration-300">
                        {category.items}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-in fade-in-50 duration-800">
            <h3 className="text-3xl font-bold text-foreground mb-4 font-sans">Featured Products</h3>
            <p className="text-muted-foreground font-serif">
              {featuredProducts.length > 0
                ? "Latest additions from our admin"
                : "Handpicked favorites from our latest collection"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0
              ? featuredProducts.map((product, index) => (
                  <Card
                    key={product._id}
                    className={`group cursor-pointer hover:shadow-xl transition-all duration-500 border-border hover:border-primary/20 animate-in slide-in-from-bottom duration-700 delay-${(index + 1) * 150} hover:-translate-y-3`}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={
                            product.imageUrl ||
                            `/abstract-geometric-shapes.png?height=400&width=400&query=${product.name || "/placeholder.svg"}`
                          }
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
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
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-primary font-sans">${product.price}</span>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 font-serif hover:scale-105 transition-transform duration-200"
                            onClick={() => handleAddToCart(product)}
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
                ))
              : [
                  {
                    _id: "default-1",
                    name: "Modern Sectional Sofa",
                    price: 2499,
                    description: "A stylish and comfortable sectional sofa",
                    image: "modern gray sectional sofa",
                    rating: 4.8,
                    reviews: 124,
                    badge: "Best Seller",
                  },
                  {
                    _id: "default-2",
                    name: "Oak Dining Table",
                    price: 1299,
                    description: "Solid oak dining table with modern design",
                    image: "solid oak dining table with modern design",
                    rating: 4.9,
                    reviews: 89,
                    badge: "New",
                  },
                  {
                    _id: "default-3",
                    name: "Ergonomic Office Chair",
                    price: 599,
                    description: "Modern ergonomic office chair in black",
                    image: "modern ergonomic office chair in black",
                    rating: 4.7,
                    reviews: 156,
                    badge: "Sale",
                  },
                ].map((product, index) => (
                  <Card
                    key={product._id}
                    className={`group cursor-pointer hover:shadow-xl transition-all duration-500 border-border hover:border-primary/20 animate-in slide-in-from-bottom duration-700 delay-${(index + 1) * 150} hover:-translate-y-3`}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={`/abstract-geometric-shapes.png?key=22dnw&height=400&width=400&query=${product.image}`}
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
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary font-sans">${product.price}</span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 font-serif hover:scale-105 transition-transform duration-200"
                            onClick={() => handleAddToCart(product)}
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

      {/* Newsletter */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)] animate-pulse delay-1000"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in fade-in-50 duration-800 relative">
          <h3 className="text-3xl font-bold text-primary-foreground mb-4 font-sans animate-in slide-in-from-top duration-600 hover:scale-105 transition-transform duration-300">
            Stay Updated
          </h3>
          <p className="text-primary-foreground/90 mb-8 font-serif animate-in fade-in-50 duration-800 delay-200">
            Get the latest updates on new arrivals and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-in slide-in-from-bottom duration-800 delay-400">
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-foreground/20 font-serif transition-all duration-500 focus:scale-105 hover:shadow-lg"
            />
            <Button
              variant="secondary"
              size="lg"
              className="font-serif hover:scale-110 transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
              onClick={handleNewsletterSubscribe}
              disabled={newsletterLoading}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              {newsletterLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
          {newsletterMsg && (
            <p className="text-primary-foreground mt-4">{newsletterMsg}</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-8">
            <div className="animate-in fade-in-50 duration-600">
              <h4 className="text-lg font-bold text-foreground mb-4 font-sans">Haven Furnitures</h4>
              <p className="text-muted-foreground font-serif">
                Creating beautiful spaces with premium furniture since 2020.
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <h5 className="font-semibold text-foreground mb-2 font-sans text-sm">Business Hours</h5>
                <div className="text-sm text-muted-foreground font-serif space-y-1">
                  <p>Mon - Sat: 8:00 AM - 7:00 PM</p>
                  <p>Sunday: 12:00 PM - 6:00 PM</p>
                </div>
              </div>
            </div>
            <div className="animate-in fade-in-50 duration-600 delay-100">
              <h5 className="font-semibold text-foreground mb-4 font-sans">Shop</h5>
              <ul className="space-y-2 text-muted-foreground font-serif">
                <li>
                  <Link href="/living-room" className="hover:text-primary transition-colors duration-300">
                    Sofas
                  </Link>
                </li>
                <li>
                  <Link href="/bedroom" className="hover:text-primary transition-colors duration-300">
                    Beds
                  </Link>
                </li>
                <li>
                  <Link href="/dining" className="hover:text-primary transition-colors duration-300">
                    Dining Sets
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors duration-300">
                    TV Stands
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors duration-300">
                    Shoe Racks
                  </a>
                </li>
              </ul>
            </div>
            <div className="animate-in fade-in-50 duration-600 delay-200">
              <h5 className="font-semibold text-foreground mb-4 font-sans">Support</h5>
              <ul className="space-y-2 text-muted-foreground font-serif">
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors duration-300">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-primary transition-colors duration-300">
                    FAQ
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors duration-300">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors duration-300">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div className="animate-in fade-in-50 duration-600 delay-300">
              <h5 className="font-semibold text-foreground mb-4 font-sans">Company</h5>
              <ul className="space-y-2 text-muted-foreground font-serif">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors duration-300">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors duration-300">
                    Press
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors duration-300">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8">
            <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in-50 duration-800">
              <div className="flex items-center space-x-3">
                <img
                  src="/images/smo-logo.png"
                  alt="SMO Logo"
                  className="h-8 w-8 hover:scale-110 transition-transform duration-300"
                />
                <p className="text-muted-foreground font-serif text-sm">
                  Designed, built and managed by{" "}
                  <a
                    href="https://ondieki1237.github.io/sethbellarin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors duration-300 font-semibold hover:underline"
                  >
                    Seth Bellarin
                  </a>
                </p>
              </div>
              <p className="text-muted-foreground font-serif text-sm">
                &copy; 2024 Haven Furnitures. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}