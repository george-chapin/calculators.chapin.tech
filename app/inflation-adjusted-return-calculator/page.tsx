import { InflationAdjustedReturnCalculator } from "@/components/inflation-adjusted-return-calculator"
import Image from "next/image"

export default function InflationAdjustedReturnPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Inflation-Adjusted Return Calculator</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Understand the true growth of your investments by accounting for the effects of inflation.
        </p>
      </header>
      <div className="relative w-full h-64 md:h-80 mb-12 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/investment-growth-inflation.png"
          alt="A growing plant with coins as leaves, with a faded background representing inflation."
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      <div className="flex justify-center">
        <InflationAdjustedReturnCalculator />
      </div>
    </div>
  )
}
