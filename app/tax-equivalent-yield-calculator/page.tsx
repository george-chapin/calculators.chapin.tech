import { TaxEquivalentYieldCalculator } from "@/components/tax-equivalent-yield-calculator"
import Image from "next/image"

export default function TaxEquivalentYieldPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Tax-Equivalent Yield (TEY) Calculator</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Compare the returns of tax-free municipal bonds with taxable investments.
        </p>
      </header>
      <div className="relative w-full h-64 md:h-80 mb-12 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/taxable-vs-tax-free-bonds.png"
          alt="A scale weighing a municipal bond against a corporate bond, with a tax symbol on one side."
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      <div className="flex justify-center">
        <TaxEquivalentYieldCalculator />
      </div>
    </div>
  )
}
