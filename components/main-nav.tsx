"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, PiggyBank, Briefcase, LayoutGrid, Library } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    { href: "/", label: "Home", icon: <LayoutGrid className="h-4 w-4" /> },
    { href: "/home-real-estate", label: "Home & Real Estate", icon: <Home className="h-4 w-4" /> },
    { href: "/personal-finance", label: "Personal Finance", icon: <PiggyBank className="h-4 w-4" /> },
    { href: "/business-investment", label: "Business & Investment", icon: <Briefcase className="h-4 w-4" /> },
    { href: "/suggested-resources", label: "Resources", icon: <Library className="h-4 w-4" /> },
  ]

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center space-x-4 lg:space-x-6 overflow-x-auto pb-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 flex-shrink-0",
                pathname === route.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {route.icon}
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
