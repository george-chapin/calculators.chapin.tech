import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Financial Calculators",
  description: "Advanced Mortgage and Car Payment Calculators",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-background text-foreground">
        <MainNav />
        <div className="flex-grow">{children}</div>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
