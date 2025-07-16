import { HelocCalculator } from "@/components/heloc-calculator"
import Image from "next/image"

export default function HelocCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/heloc-calculator-hero.png"
            alt="A house with a dotted line around it showing equity, with a piggy bank inside"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">HELOC Calculator</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Calculate your available home equity line of credit and potential monthly payments.
        </p>
      </header>
      <main className="flex justify-center">
        <HelocCalculator />
      </main>
    </div>
  )
}
