import { NetWorthTracker } from "@/components/net-worth-tracker"
import Image from "next/image"

export default function NetWorthTrackerPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Net Worth Tracker</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Get a clear picture of your financial health by calculating your net worth.
        </p>
      </header>
      <div className="relative w-full h-64 md:h-80 mb-12 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/assets-vs-liabilities.png"
          alt="A balance scale weighing assets (house, car, investments) against liabilities (loans, credit cards)."
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      <div className="flex justify-center">
        <NetWorthTracker />
      </div>
    </div>
  )
}
