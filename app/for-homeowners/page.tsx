import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Repeat, PiggyBank, Banknote, Building2 } from "lucide-react"

const calculators = [
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
    title: "House Hacking Analyzer",
    description: "Analyze multi-unit properties for investment potential.",
    icon: <Building2 className="h-6 w-6 text-primary" />,
    link: "/house-hacking-calculator",
  },
]

export default function ForHomeownersPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/happy-family-home.png"
            alt="Family in front of their house"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">Calculators for Homeowners</h1>
        <p className="text-lg text-muted-foreground mt-2">Tools to manage and grow your home investment.</p>
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
