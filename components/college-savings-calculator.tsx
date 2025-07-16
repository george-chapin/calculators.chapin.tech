"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { GraduationCap, Target, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/utils/format-currency"
import { cn } from "@/lib/utils"

export default function CollegeSavingsCalculator() {
  // Inputs
  const [childsAge, setChildsAge] = useState(5)
  const [collegeStartAge, setCollegeStartAge] = useState(18)
  const [currentSavings, setCurrentSavings] = useState("10000")
  const [monthlyContribution, setMonthlyContribution] = useState("250")
  const [currentAnnualCost, setCurrentAnnualCost] = useState("25000")
  const [costInflationRate, setCostInflationRate] = useState(5)
  const [investmentReturn, setInvestmentReturn] = useState(7)

  const { totalFutureCost, projectedSavings, shortfall, chartData } = useMemo(() => {
    const yearsToCollege = Math.max(0, collegeStartAge - childsAge)

    // Calculate total future cost of 4 years of college
    const inflation = costInflationRate / 100
    let futureCost = 0
    let costAtStart = Number(currentAnnualCost) * Math.pow(1 + inflation, yearsToCollege)
    for (let i = 0; i < 4; i++) {
      futureCost += costAtStart
      costAtStart *= 1 + inflation
    }

    // Calculate projected savings
    const n = yearsToCollege * 12
    const r = investmentReturn / 100 / 12
    const pmt = Number(monthlyContribution)
    const pv = Number(currentSavings)

    const fvCurrent = pv * Math.pow(1 + r, n)
    const fvContributions = pmt * ((Math.pow(1 + r, n) - 1) / r)
    const totalProjected = fvCurrent + fvContributions

    const data = [
      {
        name: "Savings Goal",
        "Total Future Cost": futureCost,
        "Projected Savings": totalProjected,
      },
    ]

    return {
      totalFutureCost: futureCost,
      projectedSavings: totalProjected,
      shortfall: futureCost - totalProjected,
      chartData: data,
    }
  }, [
    childsAge,
    collegeStartAge,
    currentSavings,
    monthlyContribution,
    currentAnnualCost,
    costInflationRate,
    investmentReturn,
  ])

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-bold">College Savings Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid lg:grid-cols-2 gap-8 p-6">
        {/* Input Column */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="childs-age">Child's Current Age</Label>
              <Input
                id="childs-age"
                type="number"
                value={childsAge}
                onChange={(e) => setChildsAge(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="college-start-age">College Start Age</Label>
              <Input
                id="college-start-age"
                type="number"
                value={collegeStartAge}
                onChange={(e) => setCollegeStartAge(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current-savings">Current Savings</Label>
              <Input
                id="current-savings"
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="monthly-contribution">Monthly Contribution</Label>
              <Input
                id="monthly-contribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="current-annual-cost">Current Annual College Cost</Label>
            <Input
              id="current-annual-cost"
              type="number"
              value={currentAnnualCost}
              onChange={(e) => setCurrentAnnualCost(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>College Cost Inflation Rate</Label>
              <span className="font-bold text-lg text-primary">{costInflationRate}%</span>
            </div>
            <Slider value={[costInflationRate]} onValueChange={(v) => setCostInflationRate(v[0])} max={10} step={0.5} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Investment Rate of Return</Label>
              <span className="font-bold text-lg text-primary">{investmentReturn}%</span>
            </div>
            <Slider value={[investmentReturn]} onValueChange={(v) => setInvestmentReturn(v[0])} max={15} step={0.5} />
          </div>
        </div>

        {/* Results Column */}
        <div className="space-y-6">
          <Card className="bg-muted text-center">
            <CardHeader>
              <CardTitle className="text-xl">Projected Total Cost of College</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-primary">{formatCurrency(totalFutureCost)}</p>
            </CardContent>
          </Card>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis tickFormatter={(value) => formatCurrency(Number(value))} width={100} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="Total Future Cost" fill="#ff8042" />
                <Bar dataKey="Projected Savings" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Projected Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(projectedSavings)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Savings Shortfall
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn("text-2xl font-bold", shortfall > 0 ? "text-red-600" : "text-green-600")}>
                  {formatCurrency(Math.max(0, shortfall))}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
