"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in-50 duration-800">
            <h1 className="text-4xl font-bold text-foreground mb-8 font-sans">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8 font-serif">Last updated: January 2024</p>

            <Card>
              <CardContent className="p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4 font-sans">Information We Collect</h2>
                  <p className="text-muted-foreground font-serif leading-relaxed mb-4">
                    We collect information you provide directly to us, such as when you create an account, make a
                    purchase, or contact us for support. This may include your name, email address, phone number,
                    shipping address, and payment information.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4 font-sans">How We Use Your Information</h2>
                  <p className="text-muted-foreground font-serif leading-relaxed mb-4">
                    We use the information we collect to provide, maintain, and improve our services, process
                    transactions, send you technical notices and support messages, and communicate with you about
                    products, services, and promotional offers.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4 font-sans">Information Sharing</h2>
                  <p className="text-muted-foreground font-serif leading-relaxed mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your
                    consent, except as described in this policy. We may share your information with trusted service
                    providers who assist us in operating our website and conducting our business.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4 font-sans">Data Security</h2>
                  <p className="text-muted-foreground font-serif leading-relaxed mb-4">
                    We implement appropriate security measures to protect your personal information against unauthorized
                    access, alteration, disclosure, or destruction. However, no method of transmission over the internet
                    is 100% secure.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4 font-sans">Contact Us</h2>
                  <p className="text-muted-foreground font-serif leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at
                    privacy@havenfurnitures.co.ke or call us at +254 700 123 456.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
