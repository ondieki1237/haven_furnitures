"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Award, Truck, Shield } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
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
                  haven_living_furniture Furnitures
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-background via-muted/50 to-accent/30 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl animate-in slide-in-from-left duration-1000">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-sans leading-tight animate-in fade-in-50 duration-1000 delay-200">
              About haven_living_furniture Furnitures
            </h2>
            <p className="text-lg text-muted-foreground mb-6 font-serif leading-relaxed animate-in fade-in-50 duration-1000 delay-400">
              Creating beautiful, functional spaces for Kenyan homes since 2020. We believe every home deserves
              furniture that combines style, comfort, and quality craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in slide-in-from-left duration-800">
              <h3 className="text-3xl font-bold text-foreground mb-6 font-sans">Our Story</h3>
              <p className="text-muted-foreground mb-4 font-serif leading-relaxed">
                haven_living_furniture_living_furniture Furnitures was born from a simple belief: that every Kenyan home deserves beautiful, quality
                furniture that doesn't break the bank. Founded in Nairobi in 2020, we started as a small family business
                with a passion for creating spaces where families can gather, relax, and make memories.
              </p>
              <p className="text-muted-foreground mb-4 font-serif leading-relaxed">
                Today, we've grown to serve customers across Kenya, offering everything from modern living room sets to
                ergonomic office furniture. Our commitment remains the same - providing exceptional furniture with
                outstanding customer service.
              </p>
              <p className="text-muted-foreground font-serif leading-relaxed">
                Every piece in our collection is carefully selected for its quality, durability, and style. We work
                directly with trusted manufacturers to ensure you get the best value for your investment.
              </p>
            </div>
            <div className="animate-in slide-in-from-right duration-800 delay-200">
              <img
                src="/placeholder-x09js.png"
                alt="haven_living_furniture Furnitures showroom"
                className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-in fade-in-50 duration-800">
            <h3 className="text-3xl font-bold text-foreground mb-4 font-sans">Our Values</h3>
            <p className="text-muted-foreground font-serif">What drives us every day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Quality First",
                description: "We never compromise on quality. Every piece is built to last and designed to impress.",
              },
              {
                icon: Users,
                title: "Customer Focus",
                description: "Your satisfaction is our priority. We're here to help you create the perfect space.",
              },
              {
                icon: Truck,
                title: "Reliable Service",
                description: "From order to delivery, we ensure a smooth and professional experience.",
              },
              {
                icon: Shield,
                title: "Trust & Integrity",
                description: "Honest pricing, transparent policies, and reliable warranties you can count on.",
              },
            ].map((value, index) => (
              <Card
                key={value.title}
                className={`text-center hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom duration-600 delay-${(index + 1) * 100} hover:-translate-y-2`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2 font-sans">{value.title}</h4>
                  <p className="text-sm text-muted-foreground font-serif">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "5000+", label: "Happy Customers" },
              { number: "300+", label: "Furniture Pieces" },
              { number: "4.8", label: "Average Rating" },
              { number: "3+", label: "Years Experience" },
            ].map((stat, index) => (
              <div key={stat.label} className={`animate-in fade-in-50 duration-800 delay-${(index + 1) * 100}`}>
                <div className="text-4xl font-bold text-primary-foreground mb-2 font-sans">{stat.number}</div>
                <div className="text-primary-foreground/90 font-serif">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-in fade-in-50 duration-800">
            <h3 className="text-3xl font-bold text-foreground mb-4 font-sans">Meet Our Team</h3>
            <p className="text-muted-foreground font-serif">The people behind haven_living_furniture Furnitures</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Kimani",
                role: "Founder & CEO",
                image: "professional woman in business attire smiling",
                description: "Interior design expert with 10+ years experience in the Kenyan furniture industry.",
              },
              {
                name: "David Ochieng",
                role: "Head of Operations",
                image: "professional man in business attire smiling",
                description: "Logistics specialist ensuring smooth delivery and customer satisfaction across Kenya.",
              },
              {
                name: "Grace Wanjiku",
                role: "Customer Relations",
                image: "professional woman customer service representative",
                description: "Dedicated to providing exceptional customer service and support to all our clients.",
              },
            ].map((member, index) => (
              <Card
                key={member.name}
                className={`text-center hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom duration-600 delay-${(index + 1) * 150} hover:-translate-y-2`}
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <img
                      src={`/abstract-geometric-shapes.png?height=200&width=200&query=${member.image}`}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-1 font-sans">{member.name}</h4>
                  <Badge variant="secondary" className="mb-3 font-serif">
                    {member.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground font-serif">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
