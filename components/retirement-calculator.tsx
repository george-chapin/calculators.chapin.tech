"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Landmark, TrendingUp, Target } from "lucide-react"
import { formatCurrency } from "@/utils/format-currency"
import { cn } from "@/lib/utils"

export function RetirementCalculator() {
  // User Inputs
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(65)
  const [currentSavings, setCurrentSavings] = useState("50000")
  const [monthlyContribution, setMonthlyContribution] = useState("500")
  const [preRetirementReturn, setPreRetirementReturn] = useState(7)
  const [postRetirementReturn, setPostRetirementReturn] = useState(4)
  const [lifeExpectancy, setLifeExpectancy] = useState(90)
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState("4000")

  const { projectedNestEgg, requiredNestEgg, shortfall, chartData } = useMemo(() => {
    const yearsToRetire = retirementAge - currentAge
    const n = yearsToRetire * 12
    const r = preRetirementReturn / 100 / 12

    // Future value of current savings
    const fvCurrent = Number(currentSavings) * Math.pow(1 + r, n)

    // Future value of monthly contributions
    const pmt = Number(monthlyContribution)
    const fvContributions = pmt * ((Math.pow(1 + r, n) - 1) / r)

    const totalNestEgg = fvCurrent + fvContributions

    // Required nest egg calculation
    const yearsInRetirement = lifeExpectancy - retirementAge
    const nRetire = yearsInRetirement * 12
    const rRetire = postRetirementReturn / 100 / 12
    const pmtRetire = Number(desiredMonthlyIncome)

    const required = (pmtRetire / rRetire) * (1 - Math.pow(1 + rRetire, -nRetire))

    // Chart data generation
    const data = []
    let balance = Number(currentSavings)
    for (let year = 0; year <= yearsToRetire; year++) {
      data.push({ age: currentAge + year, balance: balance })
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + r) + pmt
      }
    }

    return {
      projectedNestEgg: totalNestEgg,
      requiredNestEgg: required,
      shortfall: required - totalNestEgg,
      chartData: data,
    }
  }, [
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    preRetirementReturn,
    postRetirementReturn,
    lifeExpectancy,
    desiredMonthlyIncome,
  ])

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Landmark className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-bold">Retirement Savings Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid lg:grid-cols-2 gap-8 p-6">
        {/* Input Column */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current-age">Current Age</Label>
              <Input
                id="current-age"
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="retirement-age">Retirement Age</Label>
              <Input
                id="retirement-age"
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
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
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Pre-Retirement Rate of Return</Label>
              <span className="font-bold text-lg text-primary">{preRetirementReturn}%</span>
            </div>
            <Slider
              value={[preRetirementReturn]}
              onValueChange={(v) => setPreRetirementReturn(v[0])}
              max={15}
              step={0.5}
            />
          </div>
          <hr />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="life-expectancy">Life Expectancy</Label>
              <Input
                id="life-expectancy"
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="desired-income">Desired Monthly Income</Label>
              <Input
                id="desired-income"
                type="number"
                value={desiredMonthlyIncome}
                onChange={(e) => setDesiredMonthlyIncome(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Post-Retirement Rate of Return</Label>
              <span className="font-bold text-lg text-primary">{postRetirementReturn}%</span>
            </div>
            <Slider
              value={[postRetirementReturn]}
              onValueChange={(v) => setPostRetirementReturn(v[0])}
              max={10}
              step={0.5}
            />
          </div>
        </div>

        {/* Results Column */}
        <div className="space-y-6">
          <Card className="bg-muted text-center">
            <CardHeader>
              <CardTitle className="text-xl">Projected Nest Egg at Age {retirementAge}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-primary">{formatCurrency(projectedNestEgg)}</p>
            </CardContent>
          </Card>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" label={{ value: "Age", position: "insideBottom", offset: -5 }} />
                <YAxis tickFormatter={(value) => `$${(Number(value) / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Savings Balance"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Required Nest Egg
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(requiredNestEgg)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Surplus / Shortfall
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn("text-2xl font-bold", shortfall > 0 ? "text-red-600" : "text-green-600")}>
                  {formatCurrency(Math.abs(shortfall))}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
