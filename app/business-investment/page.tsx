import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Briefcase, TrendingUp } from "lucide-react"

const businessCalculators = [
  {
    title: "Business Loan Calculator",
    description: "Calculate payments and interest for business financing.",
    link: "/business-loan-calculator",
    icon: <Briefcase className="h-8 w-8 text-primary" />,
  },
  {
    title: "Investment Return Calculator",
    description: "Analyze the potential return on your investments.",
    link: "/investment-return-calculator",
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
  },
]

export default function BusinessInvestmentPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="relative rounded-xl overflow-hidden mb-12">
        <Image
          src="/business-investment-hero.png"
          alt="Business and investment planning"
          width={1200}
          height={400}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold">Business & Investment Calculators</h1>
          <p className="text-lg mt-2 max-w-2xl">
            Forecast growth and analyze returns. Tools designed for CEOs, founders, and savvy investors.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {businessCalculators.map((calc) => (
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
