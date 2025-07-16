import { RetirementCalculator } from "@/components/retirement-calculator"
import Image from "next/image"

export default function RetirementCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/retirement-calculator-hero.png"
            alt="An older couple relaxing on a beach, with a graph showing savings growth in the background"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">Retirement Calculator</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Determine how much you need to save to reach your retirement goals.
        </p>
      </header>
      <main className="flex justify-center">
        <RetirementCalculator />
      </main>
    </div>
  )
}
