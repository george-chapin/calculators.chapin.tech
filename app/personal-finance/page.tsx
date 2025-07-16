import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, GraduationCap, Landmark } from "lucide-react"

const calculators = [
  {
    title: "Car Payment Calculator",
    description: "Estimate monthly payments for your new vehicle.",
    icon: <Car className="h-6 w-6 text-primary" />,
    link: "/car-calculator",
  },
  {
    title: "Retirement Savings",
    description: "Project your savings to see if you're on track for retirement.",
    icon: <Landmark className="h-6 w-6 text-primary" />,
    link: "/retirement-calculator",
  },
  {
    title: "College Savings",
    description: "Estimate the future cost of college and your savings goal.",
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
    link: "/college-savings-calculator",
  },
]

export default function PersonalFinancePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold">Personal Finance Calculators</h1>
        <p className="text-lg text-muted-foreground mt-2">Plan for your life's major financial milestones.</p>
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
