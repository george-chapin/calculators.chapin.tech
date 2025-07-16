import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Car,
  GraduationCap,
  Umbrella,
  Coins,
  ShieldCheck,
  TrendingUp,
  CircleDollarSign,
  Wallet,
  Landmark,
  Goal,
} from "lucide-react"

const calculators = [
  {
    title: "Car Loan Calculator",
    description: "Estimate your monthly car payment and total interest.",
    icon: <Car className="h-6 w-6 text-primary" />,
    link: "/car-calculator",
  },
  {
    title: "College Savings Calculator",
    description: "Plan and save for future education expenses.",
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
    link: "/college-savings-calculator",
  },
  {
    title: "Retirement Calculator",
    description: "Determine if you are on track to meet your retirement goals.",
    icon: <Umbrella className="h-6 w-6 text-primary" />,
    link: "/retirement-calculator",
  },
  {
    title: "Debt Payoff Calculator",
    description: "Compare Snowball vs. Avalanche methods to pay off debt faster.",
    icon: <Coins className="h-6 w-6 text-primary" />,
    link: "/debt-payoff-calculator",
  },
  {
    title: "Credit Card Payoff Calculator",
    description: "Find out how long it will take to pay off your credit card balance.",
    icon: <Wallet className="h-6 w-6 text-primary" />,
    link: "/credit-card-payoff-calculator",
  },
  {
    title: "Emergency Fund Calculator",
    description: "Determine how much you need to save for unexpected expenses.",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    link: "/emergency-fund-calculator",
  },
  {
    title: "401(k) Contribution Calculator",
    description: "Maximize your retirement savings with employer matching.",
    icon: <Landmark className="h-6 w-6 text-primary" />,
    link: "/401k-contribution-calculator",
  },
  {
    title: "Net Worth Tracker",
    description: "Calculate your net worth by tracking assets and liabilities.",
    icon: <CircleDollarSign className="h-6 w-6 text-primary" />,
    link: "/net-worth-tracker",
  },
  {
    title: "Debt-to-Income (DTI) Ratio",
    description: "Calculate your DTI ratio, a key metric for lenders.",
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    link: "/dti-ratio-calculator",
  },
  {
    title: "Retirement Withdrawal Calculator",
    description: "Plan your retirement withdrawals using the 4% rule.",
    icon: <Goal className="h-6 w-6 text-primary" />,
    link: "/retirement-withdrawal-calculator",
  },
]

export default function PersonalFinancePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/piggy-bank-coins-planning.png"
            alt="Personal finance planning"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">Personal Finance Calculators</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Plan for life's biggest milestones and secure your financial future.
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
