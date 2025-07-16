import { RentVsBuyCalculator } from "@/components/rent-vs-buy-calculator"
import Image from "next/image"

export default function RentVsBuyCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/rent-vs-buy-hero.png"
            alt="A balance scale with a rental apartment on one side and a purchased house on the other"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">Rent vs. Buy Analyzer</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Compare the financial implications of renting a home versus buying one.
        </p>
      </header>
      <main className="flex justify-center">
        <RentVsBuyCalculator />
      </main>
    </div>
  )
}
