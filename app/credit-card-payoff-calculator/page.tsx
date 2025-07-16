import { CreditCardPayoffCalculator } from "@/components/credit-card-payoff-calculator"
import Image from "next/image"

export default function CreditCardPayoffPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Credit Card Payoff Calculator</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Discover your debt-free date and the total interest you'll pay on your credit card balance.
        </p>
      </header>
      <div className="relative w-full h-64 md:h-80 mb-12 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/cutting-up-credit-card.png"
          alt="A person cutting a credit card with scissors, symbolizing financial freedom."
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      <div className="flex justify-center">
        <CreditCardPayoffCalculator />
      </div>
    </div>
  )
}
