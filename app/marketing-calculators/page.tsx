import { EmailOpenRateCalculator } from "@/components/email-open-rate-calculator"
import { ClickThroughRateCalculator } from "@/components/click-through-rate-calculator"
import { ConversionRateCalculator } from "@/components/conversion-rate-calculator"
import { UnsubscribeRateCalculator } from "@/components/unsubscribe-rate-calculator"
import { EmailMarketingROICalculator } from "@/components/email-marketing-roi-calculator"
import Image from "next/image"

export default function MarketingCalculatorsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Marketing Calculators: Email Metrics</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Measure the effectiveness and profitability of your email marketing campaigns with these essential
          calculators.
        </p>
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/digital-marketing-dashboard.png"
            alt="Digital marketing dashboard"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
      </header>
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
        <EmailOpenRateCalculator />
        <ClickThroughRateCalculator />
        <ConversionRateCalculator />
        <UnsubscribeRateCalculator />
        <EmailMarketingROICalculator />
      </div>
    </div>
  )
}
