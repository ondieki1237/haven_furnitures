"use client"

import type React from "react"
import { api } from "@/lib/api" // Import centralized API utility

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  category: string
  imageUrl: string
  createdAt: string
}

interface SearchDropdownProps {
  onClose?: () => void
}

export function SearchDropdown({ onClose }: SearchDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    // Handle click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose?.()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const data = await api.searchProducts(searchTerm, 10)

        if (data.success) {
          setSearchResults(data.data || [])
        } else {
          console.error("Search failed:", data.message)
          setSearchResults([])
        }
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300) // Debounce search

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose?.()
    }
  }

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "living-room": "Living Room",
      bedroom: "Bedroom",
      dining: "Dining",
      office: "Office",
      "new-arrivals": "New Arrivals",
      sale: "Sale",
      promotion: "Promotion",
      bogo: "BOGO",
      sofas: "Sofas",
      beds: "Beds",
      "dining-sets": "Dining Sets",
      "tv-stands": "TV Stands",
      "shoe-racks": "Shoe Racks",
    }
    return categoryMap[category] || category
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 animate-in fade-in-0 duration-200">
      <div className="max-w-2xl mx-auto mt-20 px-4">
        <Card ref={searchRef} className="bg-white shadow-2xl border-0 animate-in slide-in-from-top-4 duration-300">
          <CardContent className="p-0">
            {/* Search Input */}
            <div className="flex items-center p-4 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <Input
                ref={inputRef}
                placeholder="Search for sofas, beds, dining sets, TV stands, shoe racks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-0 focus-visible:ring-0 text-lg placeholder:text-muted-foreground/70"
              />
              <Button variant="ghost" size="icon" onClick={onClose} className="ml-2 hover:bg-muted">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {searchTerm.trim() === "" ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Search our furniture collection</p>
                  <p className="text-sm">Find sofas, beds, dining sets, TV stands, shoe racks and more</p>
                </div>
              ) : isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">No products found</p>
                  <p className="text-sm">Try searching for "sofa", "bed", "dining", "TV stand", or "shoe rack"</p>
                </div>
              ) : (
                <div className="p-2">
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors duration-200 group"
                      onClick={() => {
                        // You can add navigation logic here
                        console.log("Selected product:", product)
                        onClose?.()
                      }}
                    >
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden mr-4 flex-shrink-0">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <Search className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            {getCategoryDisplayName(product.category)}
                          </span>
                          <span className="text-sm font-semibold text-primary">${product.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {searchResults.length > 0 && (
              <div className="p-4 border-t border-border bg-muted/30">
                <p className="text-sm text-muted-foreground text-center">
                  Found {searchResults.length} product{searchResults.length !== 1 ? "s" : ""} matching "{searchTerm}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
