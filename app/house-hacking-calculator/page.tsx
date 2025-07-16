import { HouseHackingCalculator } from "@/components/house-hacking-calculator"
import Image from "next/image"

export default function HouseHackingCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/house-hacking-hero.png"
            alt="A duplex or multi-family home with one unit highlighted and dollar signs coming from the others"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">House Hacking Analyzer</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Analyze the investment potential of living in one unit of a multi-unit property while renting out the others.
        </p>
      </header>
      <main className="flex justify-center">
        <HouseHackingCalculator />
      </main>
    </div>
  )
}
