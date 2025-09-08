"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Search, Menu, User, X } from "lucide-react"
import { InterestForm } from "@/components/interest-form"
import { SearchDropdown } from "@/components/search-dropdown"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { api, type Product as BackendProduct } from "@/lib/api"
import { useRouter } from "next/navigation"
import heroImg from "@/public/hero.png"
import Hero from "@/components/herosection"
import Navbar from "@/components/navbar"

// Sample testimonials data (replace with API fetch if needed)
const testimonials = [
	{
		id: "1",
		name: "Benjamin Karani",
		image: "/profile.png",
		rating: 5,
		comment: "The furniture quality is exceptional, and the delivery was seamless!",
	},
	{
		id: "2",
		name: "Jane Mwangi",
		image: "/profile.png",
		rating: 4,
		comment: "Beautiful designs that transformed my living space. Highly recommend!",
	},
	{
		id: "3",
		name: "Daniel Kinyua",
		image: "/profile.png",
		rating: 5,
		comment: "Amazing customer service and stunning furniture pieces!",
	},
]

type Product = BackendProduct

// Hardcoded fallback products (minimal example, add more as needed)
const fallbackProducts: Product[] = [
  {
    _id: "68b2de1ebc4cbb21328ef240",
    name: "Bed",
    description: "5 by 6 bed\nMahogany wood Quality frame\nQuality fabric used",
    price: 65000,
    category: "sofas",
    imageUrl: "https://res.cloudinary.com/diaceq8bv/image/upload/v1756552730/haven/wf...",
    inStock: true,
    featured: false,
    createdAt: "2025-08-30T11:18:54.818+00:00",
    updatedAt: "2025-08-30T11:18:54.818+00:00",
    __v: 0,
  },
  {
    _id: "68b2df06bc4cbb21328ef244",
    name: "Modern Sofa 7 Seater",
    description: "Mahogany wood\nQuality fabric used\nPremium cushion used with an option...",
    price: 165000,
    category: "sofas",
    imageUrl: "https://res.cloudinary.com/diaceq8bv/image/upload/v1756552961/haven/j0...",
    inStock: true,
    featured: false,
    createdAt: "2025-08-30T11:22:46.839+00:00",
    updatedAt: "2025-08-30T11:22:46.839+00:00",
    __v: 0,
  },
  {
    _id: "68b2df66bc4cbb21328ef248",
    name: "Modern TV Stand",
    description: "Mahogany wood used\n7 ft length",
    price: 50000,
    category: "tv-stands",
    imageUrl: "https://res.cloudinary.com/diaceq8bv/image/upload/v1756553058/haven/yb...",
    inStock: true,
    featured: false,
    createdAt: "2025-08-30T11:24:22.111+00:00",
    updatedAt: "2025-08-30T11:24:22.111+00:00",
    __v: 0,
  },
  {
    _id: "68b2dff5bc4cbb21328ef24c",
    name: "7 Seater Modern Sofa",
    description: "Mahogany wood used\nPremium cushion with an option of spring cushion\nQuality...",
    price: 170000,
    category: "dining-sets",
    imageUrl: "https://res.cloudinary.com/diaceq8bv/image/upload/v1756553197/haven/un...",
    inStock: true,
    featured: false,
    createdAt: "2025-08-30T11:26:45.782+00:00",
    updatedAt: "2025-08-30T11:26:45.782+00:00",
    __v: 0,
  },
  {
    _id: "68b2e06ebc4cbb21328ef250",
    name: "7 Seater Sofa",
    description: "Mahogany wood used\nPremium cushion with an option of spring cushion",
    price: 165000,
    category: "sofas",
    imageUrl: "https://res.cloudinary.com/diaceq8bv/image/upload/v1756553323/haven/cn...",
    inStock: true,
    featured: false,
    createdAt: "2025-08-30T11:28:46.638+00:00",
    updatedAt: "2025-08-30T11:28:46.638+00:00",
    __v: 0,
  },
];

export default function HomePage() {
	const [adminProducts, setAdminProducts] = useState<Product[]>(fallbackProducts);
	const [isLoaded, setIsLoaded] = useState(false)
	const [showSearch, setShowSearch] = useState(false)
	const [cart, setCart] = useState<Product[]>([])
	const [showCart, setShowCart] = useState(false)
	const [showMobileMenu, setShowMobileMenu] = useState(false)
	const [newsletterEmail, setNewsletterEmail] = useState("")
	const [newsletterLoading, setNewsletterLoading] = useState(false)
	const [newsletterMsg, setNewsletterMsg] = useState("")
	const [currentIndex, setCurrentIndex] = useState(0) // For testimonials carousel
	const [featuredCount, setFeaturedCount] = useState(6);
	const [newArrivalsCount, setNewArrivalsCount] = useState(6); // <--- add this
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
				// Optionally keep fallbackProducts if fetch fails
			} finally {
				setIsLoaded(true)
			}
		})()
	}, [])

	// Auto-slide testimonials every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % testimonials.length)
		}, 5000)
		return () => clearInterval(interval)
	}, [])

	// Populate new arrivals and sale products (adjust logic as needed)
	const allNewArrivals = adminProducts
		.filter((p) => new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
	const newArrivals = allNewArrivals.slice(0, newArrivalsCount); // <--- use count
	const saleProducts = adminProducts.filter((p) => p.discount && p.discount > 0).slice(0, 6)
	const featuredProducts = adminProducts.slice(0, featuredCount); // Show latest 6 products

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

	const toggleMobileMenu = () => {
		setShowMobileMenu(!showMobileMenu)
	}

	// Handle next slide for testimonials
	const nextSlide = () => {
		setCurrentIndex((prev) => (prev + 1) % testimonials.length)
	}

	// Handle previous slide for testimonials
	const prevSlide = () => {
		setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
	}

	// Newsletter subscription handler
	const handleNewsletterSubscribe = async () => {
		setNewsletterLoading(true)
		setNewsletterMsg("")
		try {
			const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://haven-furnitures.onrender.com"
			const res = await fetch(`${apiUrl}/api/subscribe`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: newsletterEmail }),
			})
			const data = await res.json()
			if (res.ok) {
				setNewsletterMsg("🎉 Subscription successful! Check your email.")
				setNewsletterEmail("")
			} else {
				setNewsletterMsg(data.message || "❌ Subscription failed")
			}
		} catch {
			setNewsletterMsg("⚠️ Something went wrong")
		} finally {
			setNewsletterLoading(false)
		}
	}

	// Add this function (or update your existing one)
	const handleLoadMore = () => {
		setNewArrivalsCount((prev) => prev + 6)
	}

	return (
        <div
            className="min-h-screen bg-gradient-to-b from-white via-[#fdfbf9] to-[#f5f0eb] relative overflow-x-hidden"
        >
            {showSearch && <SearchDropdown onClose={() => setShowSearch(false)} />}

			{/* Cart Modal */}
			{showCart && (
				<div
					className="fixed inset-0 z-50 bg-black/50 flex items-center justify-end"
					onClick={() => setShowCart(false)}
				>
					<div
						className="bg-background w-full max-w-md h-full p-4 sm:p-6 overflow-y-auto shadow-xl animate-in slide-in-from-right duration-500"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl sm:text-2xl font-bold text-foreground font-sans">Your Cart</h2>
							<Button variant="ghost" size="icon" onClick={toggleCart}>
								<X className="h-6 w-6" />
							</Button>
						</div>
						{cart.length === 0 ? (
							<p className="text-muted-foreground font-serif text-center">Your cart is empty</p>
						) : (
							<div className="space-y-4">
								{cart.map((item) => (
									<div key={item._id} className="flex items-center gap-3 border-b pb-4">
										<Image
											src={item.imageUrl || "/placeholder.svg"}
											alt={item.name}
											width={60}
											height={60}
											className="object-cover rounded sm:w-20 sm:h-20"
										/>
										<div className="flex-1 min-w-0">
											<h4 className="font-semibold text-foreground font-sans text-sm sm:text-base truncate">
												{item.name}
											</h4>
											<p className="text-sm text-muted-foreground font-serif">Ksh {item.price}</p>
										</div>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleRemoveFromCart(item._id)}
											className="text-xs"
										>
											Remove
										</Button>
									</div>
								))}
								<div className="mt-6">
									<p className="text-lg font-bold text-foreground font-sans">
										Total: Ksh {cart.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2)}
									</p>
									<InterestForm
										productId={cart.map((item) => item._id).join(",")}
										productName={cart.map((item) => item.name).join(", ")}
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

			{showMobileMenu && (
				<div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setShowMobileMenu(false)}>
					<div
						className="bg-background w-64 h-full p-6 shadow-xl animate-in slide-in-from-left duration-300"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex justify-between items-center mb-8">
							<h2 className="text-xl font-bold text-primary font-sans">Menu</h2>
							<Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
								<X className="h-6 w-6" />
							</Button>
						</div>
						<nav className="space-y-4">
							{["living-room", "bedroom", "dining", "office", "admin"].map((category) => (
								<Link
									key={category}
									href={`/${category}`}
									className="block text-muted-foreground hover:text-primary py-3 text-lg font-medium transition-colors duration-300 font-serif border-b border-border/50"
									onClick={() => setShowMobileMenu(false)}
								>
									{category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
								</Link>
							))}
						</nav>
					</div>
				</div>
			)}

			{/* Navigation */}
			<Navbar
				onShowSearch={() => setShowSearch(true)}
				onShowCart={() => setShowCart(true)}
				cartCount={cart.length} // <-- pass cart count here
			/>

			{/* Hero Section */}
			<Hero />

			{/* New Arrivals Section */}
			{newArrivals.length > 0 && (
				<section className="py-12 sm:py-16 bg-gradient-to-b from-white via-[#fdfbf9] to-[#f5f0eb] relative overflow-hidden">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(139,90,43,0.03)_50%,transparent_75%)] bg-[length:50px_50px] animate-pulse"></div>

                    <div className="w-full px-4 sm:px-6 lg:px-8 relative">
                        <div className="max-w-7xl mx-auto">
                            {/* Section Header */}
                            <div className="text-center mb-8 sm:mb-12 animate-in fade-in-50 duration-800">
                                <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4 font-serif relative inline-block">
                                    New Arrivals
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#8b5a2b] via-black to-[#8b5a2b] rounded-full"></div>
                                </h3>
                                <p className="text-gray-700 font-serif text-sm sm:text-base italic">
                                    Fresh additions to our premium collection
                                </p>
                            </div>

                            {/* Product Grid */}
                            {!isLoaded ? (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <Skeleton key={i} className="h-72 sm:h-80 w-full rounded-lg" />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                        {newArrivals.map((product, index) => (
                                            <Card
                                                key={product._id}
                                                className={`group cursor-pointer hover:shadow-xl transition-all duration-700 border border-[#8b5a2b]/20 hover:border-[#8b5a2b] rounded-xl overflow-hidden bg-white`}
                                            >
                                                {/* Hover overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#8b5a2b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                                <CardContent className="p-0 relative">
                                                    {/* Product Image */}
                                                    <div className="relative aspect-square overflow-hidden">
                                                        <Image
                                                            src={product.imageUrl || "/placeholder.svg"}
                                                            alt={product.name}
                                                            width={400}
                                                            height={400}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />

                                                        {/* "New" Badge */}
                                                        <Badge className="absolute top-3 left-3 bg-[#8b5a2b] text-white font-serif shadow-md text-xs px-2 py-1 rounded-md">
                                                            New
                                                        </Badge>

                                                        {/* Wishlist Heart */}
                                                        <Button
                                                            size="icon"
                                                            variant="secondary"
                                                            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm border border-[#8b5a2b]/30 text-[#8b5a2b] opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 w-8 h-8 rounded-full"
                                                        >
                                                            <Heart className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="p-3 sm:p-5">
                                                        <h4 className="text-sm sm:text-lg font-semibold text-black mb-1 font-serif group-hover:text-[#8b5a2b] transition-colors duration-500 line-clamp-1">
                                                            {product.name}
                                                        </h4>
                                                        <p className="text-xs sm:text-sm text-gray-600 mb-2 font-light line-clamp-2">
                                                            {product.description}
                                                        </p>

                                                        {/* Price + Cart */}
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="text-base sm:text-xl font-bold text-[#8b5a2b] font-sans group-hover:scale-110 transition-transform duration-300">
                                                                Ksh {product.price}
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                className="bg-[#8b5a2b] text-white hover:bg-black transition-all duration-300 hover:shadow-md
             text-[10px] sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2"
                                                                onClick={() => handleAddToCart(product)}
                                                            >
                                                                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                <span className="hidden sm:inline">Add to Cart</span>
                                                                <span className="sm:hidden">Add</span>
                                                            </Button>
                                                        </div>

                                                        {/* Interest Form */}
                                                        <div className="pt-2 border-t border-gray-200">
                                                            <InterestForm
                                                                productId={product._id}
                                                                productName={product.name}
                                                                productPrice={product.price.toString()}
                                                                triggerClassName="w-full text-xs sm:text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                    {/* Load More Button */}
                                    {newArrivals.length < allNewArrivals.length && (
                                        <div className="flex justify-center mt-8">
                                            <Button
                                                variant="outline"
                                                className="border-[#8b5a2b] text-[#8b5a2b] hover:bg-[#8b5a2b]/10 font-serif px-8 py-3 rounded-full transition-all duration-300"
                                                onClick={handleLoadMore}
                                            >
                                                Load More
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}

			{/* Special Offers Section */}
			{saleProducts.length > 0 && (
				<section className="py-12 sm:py-16 bg-destructive/5">
					<div className="w-full px-4 sm:px-6 lg:px-8">
						<div className="max-w-7xl mx-auto">
							<div className="text-center mb-8 sm:mb-12 animate-in fade-in-50 duration-800">
								<h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 font-sans">
									Special Offers
								</h3>
								<p className="text-muted-foreground font-serif text-sm sm:text-base">
									Limited time deals and exclusive promotions
								</p>
							</div>

							{!isLoaded ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
									{[...Array(6)].map((_, i) => (
										<Skeleton key={i} className="h-80 sm:h-96 w-full rounded-lg" />
									))}
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
									{saleProducts.map((product, index) => (
										<Card
											key={product._id}
											className={`group cursor-pointer hover:shadow-xl transition-all duration-500 border-border hover:border-primary/20 animate-in slide-in-from-bottom duration-700 delay-${
												(index + 1) * 150
											} hover:-translate-y-3`}
										>
											<CardContent className="p-0">
												<div className="relative aspect-square overflow-hidden rounded-t-lg">
													<Image
														src={product.imageUrl || "/placeholder.svg"}
														alt={product.name}
														width={400}
														height={400}
														className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
													/>
													<Badge
														className={`absolute top-3 left-3 font-serif animate-in zoom-in-50 duration-500 delay-300 text-xs ${
															product.category === "bogo" ? "bg-green-600" : "bg-destructive"
														}`}
													>
														{product.category === "bogo"
															? "BOGO"
															: product.category === "promotion"
															? "Special"
															: "Sale"}
													</Badge>
													<Button
														size="icon"
														variant="secondary"
														className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 w-8 h-8"
													>
														<Heart className="h-3 w-3" />
													</Button>
												</div>
												<div className="p-4 sm:p-6">
													<h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 font-sans group-hover:text-primary transition-colors duration-300 line-clamp-1">
														{product.name}
													</h4>
													<p className="text-xs sm:text-sm text-muted-foreground mb-3 font-serif line-clamp-2">
														{product.description}
													</p>
													<div className="flex items-center justify-between mb-3 gap-2">
														<span className="text-lg sm:text-xl font-bold text-primary font-sans">
															Ksh {product.price}
														</span>
														<Button
															size="sm"
															className="bg-primary hover:bg-primary/90 font-serif hover:scale-105 transition-transform duration-200 text-xs sm:text-sm px-2 sm:px-3"
															onClick={() => handleAddToCart(product)}
														>
															<ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
															<span className="hidden sm:inline">Add to Cart</span>
															<span className="sm:hidden">Add</span>
														</Button>
													</div>
													<div className="pt-2 border-t border-border">
														<InterestForm
															productId={product._id}
															productName={product.name}
															productPrice={product.price.toString()}
															triggerClassName="w-full text-xs sm:text-sm"
														/>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</div>
					</div>
				</section>
			)}

			{/* Shop by Category Section */}
			<section className="py-16 sm:py-24 bg-background relative overflow-hidden">
				<div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

				<div className="w-full px-4 sm:px-6 lg:px-8 relative">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-12 sm:mb-16 animate-in fade-in-50 duration-800">
							<h3 className="text-3xl sm:text-4xl font-bold text-primary mb-4 font-sans relative inline-block tracking-tight">
								Shop by Category
								<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
							</h3>
							<p className="text-base sm:text-lg text-muted-foreground font-serif">
								Find the perfect pieces for every room in your home
							</p>
						</div>

						<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
							{[
								{
									name: "Living Room",
									image: "/livingroom.png",
									items: "120+ items",
									href: "/living-room",
									color: "from-amber-200 to-amber-100",
								},
								{
									name: "Bedroom",
									image: "/bed.png",
									items: "85+ items",
									href: "/bedroom",
									color: "from-amber-100 to-amber-50",
								},
								{
									name: "Dining",
									image: "/dining.png",
									items: "65+ items",
									href: "/dining",
									color: "from-accent to-primary/10",
								},
								{
									name: "Office",
									image: "/office.png",
									items: "45+ items",
									href: "/office",
									color: "from-primary/10 to-accent/10",
								},
							].map((category, index) => (
								<Link key={category.name} href={category.href}>
									<Card
										className={`group cursor-pointer border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br ${category.color} hover:scale-105 animate-in slide-in-from-bottom duration-600 delay-${
											(index + 1) * 100
										} relative`}
									>
										<CardContent className="p-0 relative">
											<div className="aspect-square overflow-hidden rounded-t-2xl sm:rounded-t-3xl relative">
												<Image
													src={category.image || "/placeholder.svg"}
													alt={`${category.name} category`}
													width={400}
													height={400}
													className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
												/>
												<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/10">
													<div className="bg-white/90 rounded-full p-3 sm:p-4 transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-200 shadow-lg">
														<span className="text-2xl sm:text-3xl">
															{index === 0 ? "🛋️" : index === 1 ? "🛏️" : index === 2 ? "🍽️" : "💼"}
														</span>
													</div>
												</div>
											</div>
											<div className="p-4 sm:p-6 lg:p-8 text-center">
												<h4 className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary mb-1 sm:mb-2 font-sans group-hover:text-amber-700 transition-colors duration-500">
													{category.name}
												</h4>
												<p className="text-sm sm:text-base text-muted-foreground font-serif group-hover:text-foreground transition-colors duration-300">
													{category.items}
												</p>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section
				className="py-12 sm:py-16 bg-primary/10 border-t border-border relative overflow-hidden"
				aria-labelledby="testimonials-heading"
				role="region"
				aria-roledescription="carousel"
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,90,43,0.1),transparent_70%)] animate-pulse opacity-50"></div>
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
					<h3
						id="testimonials-heading"
						className="text-2xl sm:text-3xl font-bold text-primary text-center mb-8 sm:mb-10 font-sans animate-in fade-in zoom-in-50 duration-1000 ease-out"
					>
						What Our Customers Say
						<div className="mt-2 mx-auto w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full transform scale-x-0 animate-in slide-in-from-bottom duration-1000 ease-out delay-200 origin-center"></div>
					</h3>

					<div className="relative" aria-live="polite">
						<div className="overflow-hidden">
							<div
								className="flex transition-transform duration-700 ease-in-out"
								style={{ transform: `translateX(-${currentIndex * 100}%)` }}
							>
								{testimonials.map((testimonial, index) => (
									<div key={testimonial.id} className="min-w-full px-4" role="group" aria-roledescription="slide">
										<Card
											className={`border-border hover:border-primary/30 hover:shadow-xl transition-all duration-700 ease-in-out animate-in slide-in-from-bottom zoom-in-75 duration-1000 delay-${
												(index + 1) * 200
											} hover:-translate-y-2 hover:scale-105 group relative overflow-hidden max-w-2xl mx-auto`}
											role="article"
											aria-label={`Testimonial by ${testimonial.name}`}
										>
											<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></div>
											<CardContent className="p-4 sm:p-6 relative">
												<div className="flex items-center mb-4">
													<Image
														src={testimonial.image || "/placeholder.svg"}
														alt={`${testimonial.name}'s profile picture`}
														width={48}
														height={48}
														className="rounded-full object-cover mr-3 sm:mr-4 transform scale-90 group-hover:scale-100 transition-transform duration-500 ease-in-out w-10 h-10 sm:w-12 sm:h-12"
													/>
													<div>
														<h4 className="text-base sm:text-lg font-semibold text-black font-sans transition-colors duration-500 ease-in-out group-hover:text-primary">
															{testimonial.name}
														</h4>
														<div className="flex items-center" aria-label={`${testimonial.rating} out of 5 stars`}>
															{[...Array(testimonial.rating)].map((_, i) => (
																<Star
																	key={i}
																	className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-yellow-400 transform scale-90 group-hover:scale-110 transition-transform duration-300 ease-in-out"
																	aria-hidden="true"
																/>
															))}
															{[...Array(5 - testimonial.rating)].map((_, i) => (
																<Star
																	key={i + testimonial.rating}
																	className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300 transform scale-90 group-hover:scale-110 transition-transform duration-300 ease-in-out"
																	aria-hidden="true"
																/>
															))}
														</div>
													</div>
												</div>
												<p className="text-black font-serif text-sm sm:text-base leading-relaxed transition-opacity duration-500 ease-in-out">
													"{testimonial.comment}"
												</p>
											</CardContent>
										</Card>
									</div>
								))}
							</div>
						</div>

						<Button
							variant="ghost"
							size="icon"
							className="absolute top-1/2 left-2 sm:left-0 transform -translate-y-1/2 bg-background/80 hover:bg-primary/20 transition-all duration-300 ease-in-out hover:scale-110 w-8 h-8 sm:w-10 sm:h-10"
							onClick={prevSlide}
							aria-label="Previous testimonial"
						>
							<svg
								className="h-4 w-4 sm:h-6 sm:w-6 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-1/2 right-2 sm:right-0 transform -translate-y-1/2 bg-background/80 hover:bg-primary/20 transition-all duration-300 ease-in-out hover:scale-110 w-8 h-8 sm:w-10 sm:h-10"
							onClick={nextSlide}
							aria-label="Next testimonial"
						>
							<svg
								className="h-4 w-4 sm:h-6 sm:w-6 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</Button>

						<div className="flex justify-center mt-4 space-x-2">
							{testimonials.map((_, index) => (
								<button
									key={index}
									className={`h-2 w-2 rounded-full transition-all duration-300 ${
										index === currentIndex ? "bg-primary scale-125" : "bg-gray-300"
									}`}
									onClick={() => setCurrentIndex(index)}
									aria-label={`Go to testimonial ${index + 1}`}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Newsletter Section */}
			<section className="py-12 sm:py-16 bg-primary relative overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse"></div>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)] animate-pulse delay-1000"></div>

				<div className="w-full px-4 sm:px-6 lg:px-8 text-center animate-in fade-in-50 duration-800 relative">
					<div className="max-w-2xl mx-auto">
						<h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4 font-sans animate-in slide-in-from-top duration-600 hover:scale-105 transition-transform duration-300">
							Stay Updated
						</h3>
						<p className="text-primary-foreground/90 mb-6 sm:mb-8 font-serif animate-in fade-in-50 duration-800 delay-200 text-sm sm:text-base">
							Get the latest updates on new arrivals and exclusive offers
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto animate-in slide-in-from-bottom duration-800 delay-400">
							<input
								type="email"
								placeholder="Enter your email"
								value={newsletterEmail}
								onChange={(e) => setNewsletterEmail(e.target.value)}
								className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-foreground/20 font-serif transition-all duration-500 focus:scale-105 hover:shadow-lg text-sm sm:text-base"
							/>
							<Button
								variant="secondary"
								size="lg"
								className="font-serif hover:scale-110 transition-all duration-300 hover:shadow-xl relative overflow-hidden group text-sm sm:text-base px-4 sm:px-6"
								onClick={handleNewsletterSubscribe}
								disabled={newsletterLoading}
							>
								<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
								{newsletterLoading ? "Subscribing..." : "Subscribe"}
							</Button>
						</div>
						{newsletterMsg && <p className="text-primary-foreground mt-4 text-sm sm:text-base">{newsletterMsg}</p>}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-card py-8 sm:py-12 border-t border-border">
				<div className="w-full px-4 sm:px-6 lg:px-8">
					<div className="max-w-7xl mx-auto">
						<div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
							<div className="col-span-2 md:col-span-1 animate-in fade-in-50 duration-600">
								<h4 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4 font-sans">
									haven_living_furniture
								</h4>
								<p className="text-muted-foreground font-serif text-sm sm:text-base mb-4">
									Creating beautiful spaces with premium furniture since 2020.
								</p>
								<div className="pt-4 border-t border-border">
									<h5 className="font-semibold text-foreground mb-2 font-sans text-sm">Business Hours</h5>
									<div className="text-xs sm:text-sm text-muted-foreground font-serif space-y-1">
										<p>Mon - Sat: 8:00 AM - 7:00 PM</p>
										<p>Sunday: 12:00 PM - 6:00 PM</p>
									</div>
								</div>
							</div>
							<div className="animate-in fade-in-50 duration-600 delay-100">
								<h5 className="font-semibold text-foreground mb-3 sm:mb-4 font-sans text-sm sm:text-base">Shop</h5>
								<ul className="space-y-2 text-muted-foreground font-serif text-xs sm:text-sm">
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
								<h5 className="font-semibold text-foreground mb-3 sm:mb-4 font-sans text-sm sm:text-base">Support</h5>
								<ul className="space-y-2 text-muted-foreground font-serif text-xs sm:text-sm">
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
								<h5 className="font-semibold text-foreground mb-3 sm:mb-4 font-sans text-sm sm:text-base">Company</h5>
								<ul className="space-y-2 text-muted-foreground font-serif text-xs sm:text-sm">
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
						<div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8">
							<div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 animate-in fade-in-50 duration-800">
								<div className="flex items-center space-x-3">
									<Image
										src="/images/smo-logo.png"
										alt="SMO Logo"
										width={24}
										height={24}
										className="hover:scale-110 transition-transform duration-300 sm:w-8 sm:h-8"
									/>
									<p className="text-muted-foreground font-serif text-xs sm:text-sm text-center">
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
								<p className="text-muted-foreground font-serif text-xs sm:text-sm text-center">
									&copy; 2025 haven_living_furniture. All rights reserved.
								</p>
							</div>
						</div>
					</div>
				</div>
			</footer>

			<a
				href={`https://wa.me/254741926724?text=I'm%20interested%20in%20these%20products:%20${encodeURIComponent(cart.map(item => item.name).join(", "))}%20Total:%20Ksh%20${cart.reduce((sum, item) => sum + Number(item.price), 0)}`}
				target="_blank"
				rel="noopener noreferrer"
				className="w-full inline-block mt-4"
			>
				<Button
					variant="outline"
					className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-all duration-300"
				>
					Message on WhatsApp
				</Button>
			</a>
		</div>
	)
}
