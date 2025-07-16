import { CashOutRefinanceCalculator } from "@/components/cash-out-refinance-calculator"
import Image from "next/image"

export default function CashOutRefinancePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/cash-out-refinance-hero.png"
            alt="A house turning into a pile of cash, illustrating equity withdrawal"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">Cash-Out Refinance Calculator</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          See how much cash you can get from your home's equity by refinancing.
        </p>
      </header>
      <main className="flex justify-center">
        <CashOutRefinanceCalculator />
      </main>
    </div>
  )
}
