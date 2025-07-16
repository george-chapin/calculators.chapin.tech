import { RetirementWithdrawalCalculator } from "@/components/retirement-withdrawal-calculator"
import Image from "next/image"

export default function RetirementWithdrawalPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Retirement Withdrawal Calculator (4% Rule)</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Plan your retirement income stream by applying the 4% rule to your savings.
        </p>
      </header>
      <div className="relative w-full h-64 md:h-80 mb-12 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/retirement-income-stream.png"
          alt="A large piggy bank with a tap, with coins flowing out, representing a retirement income stream."
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      <div className="flex justify-center">
        <RetirementWithdrawalCalculator />
      </div>
    </div>
  )
}
