import { EmergencyFundCalculator } from "@/components/emergency-fund-calculator"
import Image from "next/image"

export default function EmergencyFundPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Emergency Fund Calculator</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Plan your financial safety net. Calculate how much you need to save for unexpected life events.
        </p>
      </header>
      <div className="relative w-full h-64 md:h-80 mb-12 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/financial-safety-net.png"
          alt="A piggy bank with a shield, symbolizing a financial safety net."
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      <div className="flex justify-center">
        <EmergencyFundCalculator />
      </div>
    </div>
  )
}
