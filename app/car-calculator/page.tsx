import { CarCalculator } from "@/components/car-calculator"
import Image from "next/image"

export default function CarCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/car-calculator-hero.png"
            alt="A new car with a price tag and a calculator next to it"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">Car Loan Calculator</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Estimate your monthly car payments and the total cost of your auto loan.
        </p>
      </header>
      <main className="flex justify-center">
        <CarCalculator />
      </main>
    </div>
  )
}
