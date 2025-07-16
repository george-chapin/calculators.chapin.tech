import { DebtPayoffCalculator } from "@/components/debt-payoff-calculator"
import Image from "next/image"

export default function DebtPayoffPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Debt Payoff Calculator</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Compare the Debt Snowball and Debt Avalanche methods to create a plan for becoming debt-free.
        </p>
      </header>
      <div className="relative w-full h-64 md:h-80 mb-12 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/climbing-out-of-debt.png"
          alt="A person climbing a mountain of coins, representing escaping debt"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      <div className="flex justify-center">
        <DebtPayoffCalculator />
      </div>
    </div>
  )
}
