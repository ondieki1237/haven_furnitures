"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, Heart } from "lucide-react";
import Image from "next/image";

// Mock product data - replace with your actual images
const featuredProducts = [
	{
		id: 1,
		name: "Luxe Velvet Sofa",
		price: "Ksh12,890",
		image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
		category: "Seating"
	},
	{
		id: 2,
		name: "Modern Coffee Table",
		price: "Ksh8,090",
		image: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800",
		category: "Tables"
	},
	{
		id: 3,
		name: "Designer Armchair",
		price: "Ksh11,450",
		image: "https://res.cloudinary.com/diaceq8bv/image/upload/v1757257813/haven/dy0nhw0d8koxzbzzegnx.png",
		category: "Chairs"
	},
	{
		id: 4,
		name: "Elegant Floor Lamp",
		price: "$320",
		image: "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800",
		category: "Lighting"
	}
];

export default function Hero() {
	return (
		<section className="relative min-h-screen bg-gradient-to-br from-[#f9f6f2] via-[#fefcf9] to-[#e8e2d9] overflow-hidden flex items-center">
			{/* Decorative Orbs */}
			<div className="absolute top-20 -left-20 w-72 h-72 bg-[#8b5a2b]/20 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-10 -right-20 w-96 h-96 bg-[#d4c5b0]/30 rounded-full blur-3xl animate-pulse" />

			<div className="relative z-10 container mx-auto px-6 lg:px-12 py-20 flex flex-col lg:flex-row items-center gap-16">
				{/* Left Content */}
				<div className="flex-1 space-y-10 max-w-2xl">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.9, ease: "easeOut" }}
						className="space-y-8"
					>
						<div className="inline-flex items-center gap-2 px-5 py-2 bg-[#8b5a2b]/10 backdrop-blur-md rounded-full text-[#8b5a2b] text-sm font-medium shadow-md border border-[#8b5a2b]/20">
							<Award className="w-4 h-4" />
							We are Haven Living Furnitures
						</div>

						<h1 className="font-serif font-bold text-[#2d1a06] leading-tight tracking-tight text-5xl sm:text-6xl lg:text-7xl drop-shadow-sm">
							Redefine{" "}
							<span className="text-[#8b5a2b]">Luxury</span>, Embrace{" "}
							<span className="italic">Comfort</span>
						</h1>

						<p className="text-lg sm:text-xl text-[#5c4a36] max-w-lg leading-relaxed font-sans opacity-90">
							Discover furniture that blends timeless elegance with modern comfort.
							Each piece is crafted to elevate your home into a sanctuary of
							sophistication.
						</p>
					</motion.div>

					{/* Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.8 }}
						className="flex flex-col sm:flex-row gap-5"
					>
						<Button
							size="lg"
							className="bg-gradient-to-r from-[#8b5a2b] to-[#6f4822] hover:shadow-xl hover:scale-105 transition-all duration-300 text-white px-8 py-6 text-lg font-semibold rounded-full group"
						>
							Explore Collection
							<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Button>

						<Button
							variant="outline"
							size="lg"
							className="px-8 py-6 text-lg border-[#8b5a2b] text-[#8b5a2b] hover:bg-[#8b5a2b]/10 hover:text-[#6f4822] rounded-full transition-all duration-300 backdrop-blur-sm"
						>
							View Catalog
						</Button>
					</motion.div>

					{/* Trust Indicators */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.8 }}
						className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-[#e7e1d6]/70"
					>
						{[
							{ icon: Shield, title: "Premium Quality", text: "Handcrafted excellence" },
							{ icon: Heart, title: "Customer Love", text: "5-star satisfaction" }
						].map(({ icon: Icon, title, text }, i) => (
							<div key={i} className="flex items-center gap-3">
								<div className="w-14 h-14 bg-[#8b5a2b]/10 rounded-xl flex items-center justify-center shadow-inner">
									<Icon className="w-6 h-6 text-[#8b5a2b]" />
								</div>
								<div>
									<h4 className="font-semibold text-[#2d1a06]">{title}</h4>
									<p className="text-sm text-[#5c4a36]/80">{text}</p>
								</div>
							</div>
						))}
					</motion.div>
				</div>

				{/* Right Product Showcase - Desktop */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4, duration: 0.9 }}
					className="flex-1 flex justify-center relative max-w-4xl hidden lg:flex"
				>
					{/* Main Featured Product - Larger Size */}
					<div className="relative">
						<motion.div
							className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-[#e7e1d6]/60 w-[450px] h-[550px] group cursor-pointer"
							whileHover={{ scale: 1.02, y: -5 }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
						>
							<div className="relative w-full h-[450px] rounded-2xl overflow-hidden">
								<Image
									src={featuredProducts[0].image}
									alt={featuredProducts[0].name}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-110"
								/>
							</div>
							<div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
								<h3 className="font-semibold text-[#2d1a06] text-lg">
									{featuredProducts[0].name}
								</h3>
								<p className="text-sm text-[#5c4a36]/70">
									{featuredProducts[0].category}
								</p>
								<p className="text-lg font-bold text-[#8b5a2b]">
									{featuredProducts[0].price}
								</p>
							</div>
						</motion.div>
						{/* Floating Product Cards */}
						{featuredProducts.slice(1).map((product, index) => (
							<motion.div
								key={product.id}
								className={`absolute bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-[#e7e1d6]/60 w-48 h-32 cursor-pointer group ${
									index === 0
										? "-top-12 -right-16"
										: index === 1
										? "-bottom-8 -left-20"
										: "-top-16 left-1/2 transform -translate-x-1/2"
								}`}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
								whileHover={{ scale: 1.05, y: -3 }}
							>
								<div className="flex gap-3 h-full">
									<div className="w-20 h-full rounded-xl overflow-hidden flex-shrink-0">
										<Image
											src={product.image}
											alt={product.name}
											width={80}
											height={80}
											className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
										/>
									</div>
									<div className="flex-1 flex flex-col justify-center">
										<h4 className="font-semibold text-sm text-[#2d1a06] leading-tight">
											{product.name}
										</h4>
										<p className="text-xs text-[#5c4a36]/70">
											{product.category}
										</p>
										<p className="text-sm font-bold text-[#8b5a2b] mt-1">
											{product.price}
										</p>
									</div>
								</div>
							</motion.div>
						))}
						{/* Animated Statistics */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 1.2, duration: 0.6 }}
							className="absolute -right-24 top-1/2 transform -translate-y-1/2 bg-gradient-to-br from-[#8b5a2b] to-[#6f4822] text-white p-6 rounded-2xl shadow-xl"
						>
							<div className="text-center">
								<div className="text-2xl font-bold">500+</div>
								<div className="text-sm opacity-90">Premium Items</div>
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 1.4, duration: 0.6 }}
							className="absolute -left-24 bottom-1/4 bg-[#f5f0eb] text-[#8b5a2b] p-6 rounded-2xl shadow-xl border border-[#8b5a2b]/20"
						>
							<div className="text-center">
								<div className="text-2xl font-bold">98%</div>
								<div className="text-sm">Satisfaction</div>
							</div>
						</motion.div>
					</div>
				</motion.div>

				{/* Right Product Showcase - Mobile Only */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4, duration: 0.9 }}
					className="w-full flex justify-center relative mt-10 lg:hidden"
				>
					<div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-[#e7e1d6]/60 w-full max-w-xs group cursor-pointer">
						<div className="relative w-full h-64 rounded-2xl overflow-hidden">
							<Image
								src={featuredProducts[0].image}
								alt={featuredProducts[0].name}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-110"
							/>
						</div>
						<div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
							<h3 className="font-semibold text-[#2d1a06] text-base">
								{featuredProducts[0].name}
							</h3>
							<p className="text-xs text-[#5c4a36]/70">
								{featuredProducts[0].category}
							</p>
							<p className="text-base font-bold text-[#8b5a2b]">
								{featuredProducts[0].price}
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}