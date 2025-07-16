import { K401ContributionCalculator } from "@/components/401k-contribution-calculator"
import Image from "next/image"

export default function K401ContributionPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">401(k) Contribution Calculator</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Optimize your retirement savings by calculating your 401(k) contributions and employer match.
        </p>
      </header>
      <div className="relative w-full h-64 md:h-80 mb-12 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/retirement-nest-egg.png"
          alt="A nest with golden eggs, symbolizing retirement savings."
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      <div className="flex justify-center">
        <K401ContributionCalculator />
      </div>
    </div>
  )
}
