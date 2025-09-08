import type React from "react"
import type { Metadata } from "next"
import "../styles/globals.css"
import ClientLayout from "@/components/client-layout";

export const metadata: Metadata = {
  title: "Haven Furnitures - Premium Home Furniture",
  description: "Discover elegant, modern furniture for your home. Quality craftsmanship meets contemporary design.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
