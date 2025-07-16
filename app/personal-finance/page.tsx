import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Car, GraduationCap, Sun } from "lucide-react"

const personalFinanceCalculators = [
  {
    title: "Car Loan Calculator",
    description: "Estimate your monthly car payments and total interest.",
    link: "/car-calculator",
    icon: <Car className="h-8 w-8 text-primary" />,
  },
  {
    title: "College Savings Calculator",
    description: "Plan and save for future education expenses.",
    link: "/college-savings-calculator",
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
  },
  {
    title: "Retirement Calculator",
    description: "Determine if you're on track for a secure retirement.",
    link: "/retirement-calculator",
    icon: <Sun className="h-8 w-8 text-primary" />,
  },
]

export default function PersonalFinancePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="relative rounded-xl overflow-hidden mb-12">
        <Image
          src="/piggy-bank-coins-planning.png"
          alt="Personal finance planning"
          width={1200}
          height={400}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold">Personal Finance Calculators</h1>
          <p className="text-lg mt-2 max-w-2xl">
            Plan for life's biggest milestones. Calculate car payments, save for college, and secure your retirement.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {personalFinanceCalculators.map((calc) => (
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
