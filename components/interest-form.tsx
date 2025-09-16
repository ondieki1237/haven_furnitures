"use client"

import { Button } from "@/components/ui/button"
// import { Heart } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa" // <-- Add this import

interface InterestFormProps {
  productId: string
  productName: string
  productPrice: string
  triggerClassName?: string
  cartProducts?: any[]
}

export function InterestForm({ productId, productName, productPrice, triggerClassName }: InterestFormProps) {
  const whatsappNumber = "254741926724"
  const message = `I'm interested in ${productName} (Ksh ${productPrice})`

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full inline-block mt-2 ${triggerClassName || ""}`}
    >
      <Button
        variant="outline"
        className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 hover:text-[#128C7E] transition-all duration-300"
      >
        <FaWhatsapp className="h-4 w-4 mr-2" /> {/* WhatsApp icon */}
        on WhatsApp
      </Button>
    </a>
  )
}
