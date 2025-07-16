import { RefinanceCalculator } from "@/components/refinance-calculator"
import Image from "next/image"

export default function RefinanceCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/refinance-calculator-hero.png"
            alt="A diagram showing a high interest rate mortgage being replaced by a lower interest rate one"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">Refinance Calculator</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          See if refinancing your mortgage can lower your monthly payment and save you money.
        </p>
      </header>
      <main className="flex justify-center">
        <RefinanceCalculator />
      </main>
    </div>
  )
}
