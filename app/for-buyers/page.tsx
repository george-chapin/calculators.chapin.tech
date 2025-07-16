import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Scale, Building2 } from "lucide-react"

const calculators = [
  {
    title: "Mortgage Calculator",
    description: "Estimate your monthly mortgage payment.",
    icon: <Home className="h-6 w-6 text-primary" />,
    link: "/mortgage-calculator",
  },
  {
    title: "Rent vs. Buy Analyzer",
    description: "Compare the financial and lifestyle costs of renting vs. buying.",
    icon: <Scale className="h-6 w-6 text-primary" />,
    link: "/rent-vs-buy-calculator",
  },
  {
    title: "House Hacking Analyzer",
    description: "Analyze multi-unit properties for investment potential.",
    icon: <Building2 className="h-6 w-6 text-primary" />,
    link: "/house-hacking-calculator",
  },
]

export default function ForBuyersPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/happy-couple-blueprints.png"
            alt="Happy couple planning their new home"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">Calculators for Home Buyers</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Essential tools to guide you through the home buying journey.
        </p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => (
          <Link key={calc.title} href={calc.link} className="block">
            <Card className="h-full hover:border-primary transition-colors duration-300 ease-in-out transform hover:-translate-y-1">
              <CardHeader className="flex-row items-center gap-4">
                {calc.icon}
                <CardTitle>{calc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{calc.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
