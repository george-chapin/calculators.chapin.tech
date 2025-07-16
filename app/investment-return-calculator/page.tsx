import { InvestmentReturnCalculator } from "@/components/investment-return-calculator"
import Image from "next/image"

export default function InvestmentReturnCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/investment-return-hero.png"
            alt="A stock market chart with an upward trend and a magnifying glass over it"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">Investment Return Calculator</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Analyze the potential return on investment (ROI) for any investment.
        </p>
      </header>
      <main className="flex justify-center">
        <InvestmentReturnCalculator />
      </main>
    </div>
  )
}
