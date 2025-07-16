import { DtiRatioCalculator } from "@/components/dti-ratio-calculator"
import Image from "next/image"

export default function DtiRatioPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Debt-to-Income (DTI) Ratio Calculator</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Calculate your DTI ratio, a critical factor lenders use to assess your borrowing risk.
        </p>
      </header>
      <div className="relative w-full h-64 md:h-80 mb-12 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/dti-ratio-pie-chart.png"
          alt="A pie chart showing the ratio of debt to income."
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      <div className="flex justify-center">
        <DtiRatioCalculator />
      </div>
    </div>
  )
}
