"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Heart, Loader2, Mail, Phone, MapPin, User, CheckCircle } from "lucide-react"
import { api } from "@/lib/api"

interface InterestFormProps {
  productId: string
  productName: string
  productPrice: string
  triggerClassName?: string
}

export function InterestForm({ productId, productName, productPrice, triggerClassName }: InterestFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await api.submitInterest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        productId,
        message: formData.location ? `Location: ${formData.location}` : undefined,
      })

      if (result.success) {
        setIsSuccess(true)
        // Reset form after 3 seconds and close dialog
        setTimeout(() => {
          setIsSuccess(false)
          setIsOpen(false)
          setFormData({ name: "", email: "", phone: "", location: "" })
        }, 3000)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error submitting interest:", error)
      alert("Failed to submit your interest. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={`bg-amber-700 hover:bg-amber-800 text-white transition-all duration-300 transform hover:scale-105 ${triggerClassName}`}
        >
          <Heart className="h-4 w-4 mr-2" />
          I'm Interested
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900 text-center">Express Your Interest</DialogTitle>
          <div className="text-center space-y-1">
            <p className="text-amber-800 font-medium">{productName}</p>
            <p className="text-amber-700 text-sm">
              Product #{productId} • ${productPrice}
            </p>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-green-800">Thank You!</h3>
              <p className="text-green-700">
                Your interest has been submitted successfully. Check your email for confirmation and we'll be in touch
                soon!
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-amber-800 font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-800 font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-amber-800 font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-amber-800 font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                placeholder="Enter your city/location"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Submit Interest
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-amber-700 text-center">
              By submitting, you agree to be contacted about this product. We respect your privacy.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
