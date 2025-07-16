import { BreakEvenRentCalculator } from "@/components/break-even-rent-calculator"
import Image from "next/image"

export default function BreakEvenRentPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Break-Even Rent Calculator</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          For landlords: determine the minimum rent you need to charge to cover all your property expenses.
        </p>
      </header>
      <div className="relative w-full h-64 md:h-80 mb-12 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/landlord-property-costs.png"
          alt="A house with icons floating around it representing various costs like mortgage, taxes, and insurance."
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      <div className="flex justify-center">
        <BreakEvenRentCalculator />
      </div>
    </div>
  )
}
