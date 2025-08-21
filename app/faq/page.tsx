"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [activeCategory, setActiveCategory] = useState("all")

  const faqData: FAQItem[] = [
    {
      question: "What areas do you deliver to?",
      answer:
        "We deliver to all major cities and towns across Kenya including Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and many more. Delivery fees vary based on location. Contact us for specific delivery information to your area.",
      category: "delivery",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Standard delivery takes 3-7 business days within Nairobi and 5-14 business days for other locations. Express delivery options are available for an additional fee. We'll provide you with a tracking number once your order ships.",
      category: "delivery",
    },
    {
      question: "Do you offer assembly services?",
      answer:
        "Yes! We offer professional assembly services for all our furniture. Our trained technicians will assemble your furniture at your location. Assembly fees vary by product complexity and are clearly stated during checkout.",
      category: "delivery",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept M-Pesa, bank transfers, cash on delivery (for orders under KSH 50,000), and major credit/debit cards. We also offer flexible payment plans for larger purchases - contact us to learn more.",
      category: "payment",
    },
    {
      question: "Can I return or exchange furniture?",
      answer:
        "Yes, we offer a 30-day return policy for unused items in original packaging. Custom-made items cannot be returned unless defective. Return shipping costs may apply. Contact our customer service team to initiate a return.",
      category: "returns",
    },
    {
      question: "Do you offer warranties on your furniture?",
      answer:
        "All our furniture comes with manufacturer warranties ranging from 1-5 years depending on the product. We also offer extended warranty options. Warranty details are provided with each product and cover manufacturing defects.",
      category: "warranty",
    },
    {
      question: "Can I see the furniture before buying?",
      answer:
        "Visit our showroom in Westlands Shopping Center to see and test our furniture. We also have detailed photos and specifications online. For items not in our showroom, we can arrange special viewings.",
      category: "shopping",
    },
    {
      question: "Do you offer custom furniture?",
      answer:
        "Yes, we offer custom furniture services for specific requirements. This includes custom sizes, colors, and materials. Custom orders typically take 4-8 weeks and require a 50% deposit. Contact us to discuss your custom needs.",
      category: "custom",
    },
    {
      question: "What if my furniture arrives damaged?",
      answer:
        "We carefully package all items, but if damage occurs during shipping, contact us immediately with photos. We'll arrange for repair, replacement, or refund at no cost to you. All shipments are insured for your protection.",
      category: "returns",
    },
    {
      question: "Do you offer bulk discounts?",
      answer:
        "Yes! We offer attractive discounts for bulk orders, corporate purchases, and interior designers. Discounts start at 10% for orders over KSH 200,000. Contact our sales team for a custom quote.",
      category: "pricing",
    },
  ]

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "delivery", name: "Delivery & Assembly" },
    { id: "payment", name: "Payment & Pricing" },
    { id: "returns", name: "Returns & Warranty" },
    { id: "shopping", name: "Shopping & Custom" },
  ]

  const filteredFAQs = activeCategory === "all" ? faqData : faqData.filter((item) => item.category === activeCategory)

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

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

      {/* Hero Section */}
      <section className="relative h-[300px] bg-gradient-to-br from-background via-muted/50 to-accent/30 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl animate-in slide-in-from-left duration-1000">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-sans leading-tight animate-in fade-in-50 duration-1000 delay-200">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground font-serif leading-relaxed animate-in fade-in-50 duration-1000 delay-400">
              Find answers to common questions about our furniture, delivery, and services.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-8 animate-in fade-in-50 duration-600">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="font-serif hover:scale-105 transition-transform duration-200"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((item, index) => (
              <Card
                key={index}
                className={`hover:shadow-md transition-all duration-300 animate-in slide-in-from-bottom duration-600 delay-${((index % 5) + 1) * 100}`}
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/20 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-foreground font-sans pr-4">{item.question}</h3>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                  {openItems.includes(index) && (
                    <div className="px-6 pb-6 animate-in slide-in-from-top duration-300">
                      <p className="text-muted-foreground font-serif leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center animate-in fade-in-50 duration-800">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4 font-sans">Still have questions?</h3>
                <p className="text-muted-foreground mb-6 font-serif">
                  Our customer service team is here to help. Get in touch with us for personalized assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button className="bg-primary hover:bg-primary/90 font-serif hover:scale-105 transition-transform duration-200">
                      Contact Us
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="font-serif hover:scale-105 transition-transform duration-200 bg-transparent"
                  >
                    Call +254 700 123 456
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
