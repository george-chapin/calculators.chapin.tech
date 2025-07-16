"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Home, PiggyBank, Briefcase, LayoutGrid, Library, Mail } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), pathname === "/" ? "text-primary font-semibold" : "")}
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Home className="h-4 w-4 mr-2" />
                Home & Real Estate
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/home-real-estate"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">All Real Estate</div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Comprehensive tools for every stage of your property journey.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/for-buyers" title="For Buyers">
                    Tools to help you navigate the home buying process.
                  </ListItem>
                  <ListItem href="/for-homeowners" title="For Homeowners">
                    Calculators to manage and leverage your home equity.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/personal-finance" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === "/personal-finance" ? "text-primary font-semibold" : "",
                  )}
                >
                  <PiggyBank className="h-4 w-4 mr-2" />
                  Personal Finance
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/business-investment" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === "/business-investment" ? "text-primary font-semibold" : "",
                  )}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Business & Investment
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/marketing-calculators" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === "/marketing-calculators" ? "text-primary font-semibold" : "",
                  )}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Marketing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/suggested-resources" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === "/suggested-resources" ? "text-primary font-semibold" : "",
                  )}
                >
                  <Library className="h-4 w-4 mr-2" />
                  Resources
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
