import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Briefcase } from "lucide-react"

const calculators = [
  {
    title: "Investment ROI Calculator",
    description: "Calculate the return on investment for any asset.",
    icon: <DollarSign className="h-6 w-6 text-primary" />,
    link: "/investment-return-calculator",
  },
  {
    title: "Business Loan Forecaster",
    description: "Analyze funding options and their impact on your business.",
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    link: "/business-loan-calculator",
  },
]

export default function BusinessInvestmentPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold">Business & Investment Calculators</h1>
        <p className="text-lg text-muted-foreground mt-2">Tools for founders, CEOs, and investors.</p>
      </header>
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
