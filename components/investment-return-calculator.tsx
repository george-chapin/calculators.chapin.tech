"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DollarSign, TrendingUp, Percent, CalendarClock } from "lucide-react"
import { formatCurrency } from "@/utils/format-currency"
import { cn } from "@/lib/utils"

export default function InvestmentReturnCalculator() {
  // Inputs
  const [initialInvestment, setInitialInvestment] = useState("10000")
  const [finalValue, setFinalValue] = useState("15000")
  const [investmentLength, setInvestmentLength] = useState("5") // in years
  const [totalCosts, setTotalCosts] = useState("500")

  const { netProfit, roi, annualizedRoi, chartData } = useMemo(() => {
    const initial = Number(initialInvestment) || 0
    const final = Number(finalValue) || 0
    const length = Number(investmentLength) || 0
    const costs = Number(totalCosts) || 0

    const basis = initial + costs
    const profit = final - basis

    const returnOnInvestment = basis > 0 ? (profit / basis) * 100 : 0

    let annualizedReturn = 0
    if (basis > 0 && final >= 0 && length > 0) {
      annualizedReturn = (Math.pow(final / basis, 1 / length) - 1) * 100
    }

    const data = [
      {
        name: "Investment",
        "Cost Basis": basis,
        "Final Value": final,
      },
    ]

    return {
      netProfit: profit,
      roi: returnOnInvestment,
      annualizedRoi: annualizedReturn,
      chartData: data,
    }
  }, [initialInvestment, finalValue, investmentLength, totalCosts])

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <DollarSign className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-bold">Investment Return Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8 p-6">
        {/* Input Column */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="initial-investment">Initial Investment Amount</Label>
            <Input
              id="initial-investment"
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="final-value">Final Value of Investment</Label>
            <Input id="final-value" type="number" value={finalValue} onChange={(e) => setFinalValue(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="total-costs">Additional Costs & Fees</Label>
            <Input id="total-costs" type="number" value={totalCosts} onChange={(e) => setTotalCosts(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="investment-length">Investment Length (Years)</Label>
            <Input
              id="investment-length"
              type="number"
              value={investmentLength}
              onChange={(e) => setInvestmentLength(e.target.value)}
            />
          </div>
        </div>

        {/* Results Column */}
        <div className="space-y-6">
          <Card className="bg-muted text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium flex items-center justify-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Net Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("text-5xl font-bold", netProfit >= 0 ? "text-green-600" : "text-red-600")}>
                {formatCurrency(netProfit)}
              </p>
            </CardContent>
          </Card>

          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis tickFormatter={(value) => formatCurrency(Number(value))} width={100} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="Cost Basis" fill="#ff8042" />
                <Bar dataKey="Final Value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-center gap-2">
                  <Percent className="h-5 w-5 text-blue-500" />
                  Total ROI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn("text-2xl font-bold", roi >= 0 ? "text-blue-600" : "text-red-600")}>
                  {roi.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-center gap-2">
                  <CalendarClock className="h-5 w-5 text-purple-500" />
                  Annualized ROI
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Number(investmentLength) > 0 ? (
                  <p className={cn("text-2xl font-bold", annualizedRoi >= 0 ? "text-purple-600" : "text-red-600")}>
                    {annualizedRoi.toFixed(2)}%
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground pt-3">Enter length &gt; 0</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
