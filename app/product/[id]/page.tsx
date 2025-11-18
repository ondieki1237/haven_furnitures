"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InterestForm } from "@/components/interest-form";
import { ArrowLeft } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  description: string;
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch product and related
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await api.getProduct(params.id);
        if (res.success && res.data) {
          setProduct(res.data);
          const relRes = await api.getProducts({
            category: res.data.category,
            limit: 6,
          });
          if (relRes.success && relRes.data) {
            setRelated(relRes.data.filter((p: Product) => p._id !== res.data._id));
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-b from-white to-[#f5f0eb]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-destructive py-20 text-2xl font-sans">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-[#fdfbf9] to-[#f5f0eb]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 shadow-sm py-4 px-4 sm:px-6 lg:px-8 z-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              aria-label="Go back"
              className="text-primary hover:bg-primary/10 rounded-full transition-transform duration-200 hover:scale-110"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <Link href="/" className="text-xl font-bold font-sans text-primary hover:text-[#8b5a2b] transition-colors">
              Haven Living
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 py-12 px-4 mt-20 sm:mt-24">
        <div className="max-w-6xl mx-auto bg-white/95 rounded-3xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row gap-12 transition-all duration-300">
          <div className="flex-1 flex items-center justify-center">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3 text-primary font-sans tracking-tight">
                {product.name}
              </h1>
              <div className="text-muted-foreground mb-6 text-base font-sans uppercase tracking-wider">
                {product.category}
              </div>
              <p className="mb-8 text-lg font-serif text-gray-700 leading-relaxed">
                {product.description}
              </p>
              <div className="text-3xl font-bold text-[#8b5a2b] mb-8">
                Ksh {product.price.toLocaleString()}
              </div>
              <div className="flex gap-4 mb-6 flex-wrap">
                <InterestForm
                  productId={product._id}
                  productName={product.name}
                  productPrice={product.price.toString()}
                  triggerClassName="bg-primary/10 text-primary border border-primary rounded-full px-8 py-4 font-serif text-lg hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="max-w-6xl mx-auto mt-20">
            <h2 className="text-3xl font-bold mb-8 text-primary font-sans tracking-tight">
              Explore More in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col items-center group cursor-pointer transition-all duration-300 hover:-translate-y-1"
                >
                  <Link href={`/product/${p._id}`} className="w-full flex flex-col items-center">
                    <Image
                      src={p.imageUrl || "/placeholder.svg"}
                      alt={p.name}
                      width={250}
                      height={250}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="rounded-lg object-cover mb-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="font-semibold text-xl text-primary group-hover:text-[#8b5a2b] transition-colors font-sans">
                      {p.name}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2 font-sans">{p.category}</div>
                    <div className="text-lg font-bold text-[#8b5a2b] mb-4">
                      Ksh {p.price.toLocaleString()}
                    </div>
                  </Link>
                  <div className="flex gap-2 mt-2">
                    <InterestForm
                      productId={p._id}
                      productName={p.name}
                      productPrice={p.price.toString()}
                      triggerClassName="bg-primary/10 text-primary border border-primary rounded-full px-6 py-2 font-serif text-sm hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card py-10 sm:py-16 border-t border-border">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-4">
              <div className="col-span-2 md:col-span-1 animate-in fade-in-50 duration-600">
                <h4 className="text-lg sm:text-xl font-bold text-foreground mb-4 font-sans tracking-tight">
                  haven_living_furniture
                </h4>
                <p className="text-muted-foreground font-serif text-base sm:text-lg mb-6 leading-relaxed">
                  Creating beautiful spaces with premium furniture since 2020.
                </p>
                <div className="pt-4 border-t border-border/50">
                  <h5 className="font-semibold text-foreground mb-3 font-sans text-base">Business Hours</h5>
                  <div className="text-sm text-muted-foreground font-serif space-y-2">
                    <p>Mon - Sat: 8:00 AM - 7:00 PM</p>
                    <p>Sunday: 12:00 PM - 6:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="animate-in fade-in-50 duration-600 delay-100">
                <h5 className="font-semibold text-foreground mb-4 font-sans text-base sm:text-lg">Shop</h5>
                <ul className="space-y-3 text-muted-foreground font-serif text-sm sm:text-base">
                  <li>
                    <Link href="/living-room" className="hover:text-primary transition-colors duration-300 hover:underline">
                      Sofas
                    </Link>
                  </li>
                  <li>
                    <Link href="/bedroom" className="hover:text-primary transition-colors duration-300 hover:underline">
                      Beds
                    </Link>
                  </li>
                  <li>
                    <Link href="/dining" className="hover:text-primary transition-colors duration-300 hover:underline">
                      Dining Sets
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary transition-colors duration-300 hover:underline">
                      TV Stands
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary transition-colors duration-300 hover:underline">
                      Shoe Racks
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="animate-in fade-in-50 duration-600 delay-200">
                <h5 className="font-semibold text-foreground mb-4 font-sans text-base sm:text-lg">Support</h5>
                <ul className="space-y-3 text-muted-foreground font-serif text-sm sm:text-base">
                  <li>
                    <Link href="/contact" className="hover:text-primary transition-colors duration-300 hover:underline">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-primary transition-colors duration-300 hover:underline">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary transition-colors duration-300 hover:underline">
                      Shipping Info
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary transition-colors duration-300 hover:underline">
                      Returns
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="animate-in fade-in-50 duration-600 delay-300">
                <h5 className="font-semibold text-foreground mb-4 font-sans text-base sm:text-lg">Company</h5>
                <ul className="space-y-3 text-muted-foreground font-serif text-sm sm:text-base">
                  <li>
                    <Link href="/about" className="hover:text-primary transition-colors duration-300 hover:underline">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary transition-colors duration-300 hover:underline">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary transition-colors duration-300 hover:underline">
                      Press
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-primary transition-colors duration-300 hover:underline">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border/50 mt-8 sm:mt-12 pt-8 sm:pt-10">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 animate-in fade-in-50 duration-800">
                <div className="flex items-center space-x-4">
                  <Image
                    src="/images/smo-logo.png"
                    alt="SMO Logo"
                    width={28}
                    height={28}
                    className="hover:scale-110 transition-transform duration-300 sm:w-10 sm:h-10"
                  />
                  <p className="text-muted-foreground font-serif text-sm sm:text-base text-center">
                    Designed, built and managed by{" "}
                    <a
                      href="https://www.codewithseth.co.ke/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors duration-300 font-semibold hover:underline"
                    >
                      Seth Bellarin
                    </a>
                  </p>
                </div>
                <p className="text-muted-foreground font-serif text-sm sm:text-base text-center">
                  &copy; 2025 haven_living_furniture. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}