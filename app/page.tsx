import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, PiggyBank, Briefcase, ArrowRight } from "lucide-react"

const calculatorGroups = [
  {
    title: "Home & Real Estate",
    description: "Tools for buying, selling, and investing in property. From your first mortgage to your tenth rental.",
    icon: <Home className="h-8 w-8 text-primary" />,
    link: "/home-real-estate",
    image: "/real-estate-graphic.png",
  },
  {
    title: "Personal Finance",
    description:
      "Plan for life's biggest milestones. Calculate car payments, save for college, and secure your retirement.",
    icon: <PiggyBank className="h-8 w-8 text-primary" />,
    link: "/personal-finance",
    image: "/personal-finance-graphic.png",
  },
  {
    title: "Business & Investment",
    description: "Forecast growth and analyze returns. Tools designed for CEOs, founders, and savvy investors.",
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    link: "/business-investment",
    image: "/business-graphic.png",
  },
]

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Your Financial Clarity Toolkit</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Powerful, easy-to-use calculators to help you make smarter financial decisions for your home, family, and
          business.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {calculatorGroups.map((group) => (
          <Card
            key={group.title}
            className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="flex-row items-center gap-4 pb-4">
              {group.icon}
              <CardTitle className="text-2xl">{group.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src={group.image || "/placeholder.svg"}
                  alt={`${group.title} graphic`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <p className="text-muted-foreground flex-grow">{group.description}</p>
              <Button asChild className="mt-6 w-full">
                <Link href={group.link}>
                  View Calculators <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
