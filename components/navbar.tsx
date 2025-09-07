"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock cart data - replace with your actual cart state
const cart = []; // Example: [{ id: 1, name: "Luxe Velvet Sofa" }, ...]

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const toggleCart = () => {
    // Implement cart toggle logic here
    console.log("Cart toggled");
  };

  // Animation variants for nav links
  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  // Animation variants for mobile menu
  const mobileMenuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-[#f9f6f2]/95 via-[#fefcf9]/95 to-[#e8e2d9]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b border-[#e7e1d6]/70 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="text-lg sm:text-xl lg:text-2xl font-bold text-[#2d1a06] font-sans hover:scale-110 transition-all duration-500 cursor-pointer hover:text-[#8b5a2b]/80 relative group"
                >
                  haven_living_furniture
                  <div className="absolute inset-0 bg-[#8b5a2b]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </motion.h1>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6 lg:space-x-8">
                {["living-room", "bedroom", "dining", "office", "admin"].map((category, index) => (
                  <motion.div
                    key={category}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={linkVariants}
                  >
                    <Link
                      href={`/${category}`}
                      className="text-[#5c4a36] hover:text-[#8b5a2b] px-3 py-2 text-sm lg:text-base font-medium font-serif transition-all duration-500 hover:scale-105 relative group overflow-hidden"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8b5a2b] transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="hover:scale-125 transition-all duration-300 hover:bg-[#8b5a2b]/10 hover:text-[#8b5a2b] rounded-full"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-125 transition-all duration-300 hover:bg-[#8b5a2b]/10 hover:text-red-500 hidden sm:flex rounded-full"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-125 transition-all duration-300 hover:bg-[#8b5a2b]/10 hover:text-[#8b5a2b] relative rounded-full"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#8b5a2b] text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow min-w-[18px] text-center">
                    {cart.length}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-125 transition-all duration-300 hover:bg-[#8b5a2b]/10 hover:text-[#8b5a2b] hidden sm:flex rounded-full"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:scale-125 transition-all duration-300 hover:bg-[#8b5a2b]/10 hover:text-[#8b5a2b] rounded-full"
                onClick={toggleMobileMenu}
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <motion.div
          variants={mobileMenuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="md:hidden fixed inset-0 bg-gradient-to-br from-[#f9f6f2]/95 via-[#fefcf9]/95 to-[#e8e2d9]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 hover:scale-125 transition-all duration-300 hover:bg-[#8b5a2b]/10 hover:text-[#8b5a2b] rounded-full"
            onClick={toggleMobileMenu}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="flex flex-col items-center space-y-6">
            {["living-room", "bedroom", "dining", "office", "admin"].map((category, index) => (
              <motion.div
                key={category}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={linkVariants}
              >
                <Link
                  href={`/${category}`}
                  className="text-[#2d1a06] hover:text-[#8b5a2b] text-xl font-serif font-medium transition-all duration-500 hover:scale-110 relative group"
                  onClick={toggleMobileMenu}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8b5a2b] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
            {/* Mobile Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex space-x-4"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowSearch(true);
                  toggleMobileMenu();
                }}
                className="hover:scale-125 transition-all duration-300 hover:bg-[#8b5a2b]/10 hover:text-[#8b5a2b] rounded-full"
              >
                <Search className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-125 transition-all duration-300 hover:bg-[#8b5a2b]/10 hover:text-red-500 rounded-full"
              >
                <Heart className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-125 transition-all duration-300 hover:bg-[#8b5a2b]/10 hover:text-[#8b5a2b] relative rounded-full"
                onClick={() => {
                  toggleCart();
                  toggleMobileMenu();
                }}
              >
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#8b5a2b] text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow min-w-[18px] text-center">
                    {cart.length}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-125 transition-all duration-300 hover:bg-[#8b5a2b]/10 hover:text-[#8b5a2b] rounded-full"
              >
                <User className="h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}