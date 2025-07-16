import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Your Financial Clarity Hub
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                A comprehensive suite of free, powerful calculators designed to help you navigate your financial journey
                with confidence. From mortgages to retirement, we've got you covered.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full pb-12 md:pb-24 lg:pb-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <CalculatorCategoryCard
                title="Personal Finance"
                description="Master your money with tools for budgeting, debt management, and savings. Plan for your future, from college savings to a secure retirement."
                href="/personal-finance"
              />
              <CalculatorCategoryCard
                title="Home & Real Estate"
                description="Navigate the property market with ease. Whether you're buying, selling, or investing, our calculators help you understand mortgages, refinancing, and rental profitability."
                href="/home-real-estate"
              />
              <CalculatorCategoryCard
                title="Business & Investment"
                description="Make smarter financial decisions for your business and portfolio. Analyze loan options, project investment returns, and track your net worth."
                href="/business-investment"
              />
              <CalculatorCategoryCard
                title="Marketing"
                description="Optimize your campaigns with data-driven insights. Calculate key metrics like ROI, open rates, and conversion rates to maximize your marketing impact."
                href="/marketing-calculators"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function CalculatorCategoryCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="flex items-center font-semibold text-primary">
            Explore Calculators
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
