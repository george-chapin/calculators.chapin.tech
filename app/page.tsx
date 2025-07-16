import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, PiggyBank, Briefcase, ArrowRight, Mail } from "lucide-react"

const calculatorGroups = [
  {
    title: "Home & Real Estate",
    description:
      "Navigate the property market with confidence. Whether you're calculating your first mortgage, exploring refinancing options, or analyzing the profitability of a rental property, our tools provide the essential data for your real estate journey.",
    icon: <Home className="h-8 w-8 text-primary" />,
    link: "/home-real-estate",
    image: "/real-estate-graphic.png",
  },
  {
    title: "Personal Finance",
    description:
      "Take control of your financial future. From creating a debt payoff plan and building an emergency fund to planning for college and a comfortable retirement, these calculators empower you to manage your money effectively and achieve your life goals.",
    icon: <PiggyBank className="h-8 w-8 text-primary" />,
    link: "/personal-finance",
    image: "/personal-finance-graphic.png",
  },
  {
    title: "Business & Investment",
    description:
      "Drive growth and maximize returns with powerful analytical tools. Forecast loan payments, calculate investment returns, and track your net worth. Essential for entrepreneurs, investors, and anyone serious about building wealth.",
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    link: "/business-investment",
    image: "/business-graphic.png",
  },
  {
    title: "Marketing",
    description:
      "Measure what matters and optimize your campaign performance. Calculate key metrics like open rates, click-through rates, and ROI to understand the true impact of your email marketing efforts and make data-driven decisions.",
    icon: <Mail className="h-8 w-8 text-primary" />,
    link: "/marketing-calculators",
    image: "/marketing-graphic.png",
  },
]

export default function HomePage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto py-16 sm:py-24 px-4">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            Master Your Money with Precision
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            From planning your first home purchase to optimizing your retirement strategy, our comprehensive suite of
            financial calculators provides the clarity you need to make confident decisions.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {calculatorGroups.map((group) => (
            <Card
              key={group.title}
              className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-border/50"
            >
              <CardHeader className="flex-row items-start gap-4 p-6">
                <div className="bg-primary/10 p-3 rounded-lg">{group.icon}</div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-semibold">{group.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow p-6 pt-0">
                <div className="relative h-52 w-full mb-6 rounded-xl overflow-hidden group">
                  <Image
                    src={group.image || "/placeholder.svg"}
                    alt={`${group.title} graphic`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-muted-foreground flex-grow mb-6">{group.description}</p>
                <Button asChild className="mt-auto w-full text-lg py-6">
                  <Link href={group.link}>
                    View Calculators <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
