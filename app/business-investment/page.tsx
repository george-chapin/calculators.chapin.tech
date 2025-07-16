import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, LineChart, Building2, Receipt, Percent } from "lucide-react"

const calculators = [
  {
    title: "Business Loan Calculator",
    description: "Calculate payments and interest for business financing.",
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    link: "/business-loan-calculator",
  },
  {
    title: "Investment Return Calculator",
    description: "Analyze the potential return on your investments.",
    icon: <LineChart className="h-6 w-6 text-primary" />,
    link: "/investment-return-calculator",
  },
  {
    title: "House Hacking Analyzer",
    description: "Analyze multi-unit properties for investment potential.",
    icon: <Building2 className="h-6 w-6 text-primary" />,
    link: "/house-hacking-calculator",
  },
  {
    title: "Inflation-Adjusted Return",
    description: "Calculate the real return of an investment after inflation.",
    icon: <Percent className="h-6 w-6 text-primary" />,
    link: "/inflation-adjusted-return-calculator",
  },
  {
    title: "Tax-Equivalent Yield",
    description: "Compare the returns of taxable and tax-free bonds.",
    icon: <Receipt className="h-6 w-6 text-primary" />,
    link: "/tax-equivalent-yield-calculator",
  },
]

export default function BusinessInvestmentPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/business-investment-hero.png"
            alt="Business investment planning"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">Business & Investment Calculators</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Forecast growth, analyze returns, and make savvy investment decisions.
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
