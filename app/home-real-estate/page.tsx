import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Home, Repeat, Banknote, HomeIcon as House, GitCompareArrows, Combine } from "lucide-react"

const realEstateCalculators = [
  {
    title: "Mortgage Calculator",
    description: "Estimate your monthly mortgage payments.",
    link: "/mortgage-calculator",
    icon: <Home className="h-8 w-8 text-primary" />,
  },
  {
    title: "Refinance Calculator",
    description: "See how much you could save by refinancing.",
    link: "/refinance-calculator",
    icon: <Repeat className="h-8 w-8 text-primary" />,
  },
  {
    title: "HELOC Calculator",
    description: "Calculate payments for a Home Equity Line of Credit.",
    link: "/heloc-calculator",
    icon: <Banknote className="h-8 w-8 text-primary" />,
  },
  {
    title: "Cash-Out Refinance Calculator",
    description: "Determine how much cash you can get from your home equity.",
    link: "/cash-out-refinance",
    icon: <House className="h-8 w-8 text-primary" />,
  },
  {
    title: "Rent vs. Buy Calculator",
    description: "Compare the financial costs of renting versus buying a home.",
    link: "/rent-vs-buy-calculator",
    icon: <GitCompareArrows className="h-8 w-8 text-primary" />,
  },
  {
    title: "House Hacking Calculator",
    description: "Analyze the profitability of living in and renting out part of your property.",
    link: "/house-hacking-calculator",
    icon: <Combine className="h-8 w-8 text-primary" />,
  },
]

export default function HomeRealEstatePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="relative rounded-xl overflow-hidden mb-12">
        <Image
          src="/modern-house-garden.png"
          alt="Modern house with a garden"
          width={1200}
          height={400}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold">Home & Real Estate Calculators</h1>
          <p className="text-lg mt-2 max-w-2xl">
            Tools for buying, selling, and investing in property. From your first mortgage to your tenth rental.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {realEstateCalculators.map((calc) => (
          <Card key={calc.title} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader className="flex-row items-center gap-4">
              {calc.icon}
              <CardTitle>{calc.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{calc.description}</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href={calc.link} className="text-sm font-semibold text-primary hover:underline flex items-center">
                Use Calculator <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
