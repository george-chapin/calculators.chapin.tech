import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Repeat, PiggyBank, Banknote, Scale, Building2, Calculator } from "lucide-react"
import Image from "next/image"

const calculators = [
  {
    title: "Mortgage Calculator",
    description: "Estimate your monthly mortgage payment.",
    icon: <Home className="h-6 w-6 text-primary" />,
    link: "/mortgage-calculator",
  },
  {
    title: "Refinance Calculator",
    description: "See if refinancing your mortgage can save you money.",
    icon: <Repeat className="h-6 w-6 text-primary" />,
    link: "/refinance-calculator",
  },
  {
    title: "HELOC Calculator",
    description: "Calculate your available home equity line of credit.",
    icon: <PiggyBank className="h-6 w-6 text-primary" />,
    link: "/heloc-calculator",
  },
  {
    title: "Cash-Out Refinance",
    description: "Consolidate debt by tapping into your home equity.",
    icon: <Banknote className="h-6 w-6 text-primary" />,
    link: "/cash-out-refinance",
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
  {
    title: "Break-Even Rent Calculator",
    description: "Determine the rental income needed to cover your property costs.",
    icon: <Calculator className="h-6 w-6 text-primary" />,
    link: "/break-even-rent-calculator",
  },
]

export default function HomeRealEstatePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold">Home & Real Estate Calculators</h1>
        <p className="text-lg text-muted-foreground mt-2">Tools for every step of your property journey.</p>
      </header>
      <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/modern-house-garden.png"
          alt="Modern house with a beautiful garden"
          layout="fill"
          objectFit="cover"
          className="transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => (
          <Link key={calc.title} href={calc.link} className="block">
            <Card className="h-full hover:border-primary transition-colors">
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
