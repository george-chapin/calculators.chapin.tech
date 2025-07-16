"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { PiggyBank } from "lucide-react"
import { formatCurrency } from "@/utils/format-currency"

export default function HelocCalculator() {
  const [homeValue, setHomeValue] = useState("450000")
  const [mortgageBalance, setMortgageBalance] = useState("200000")
  const [ltvRatio, setLtvRatio] = useState(80)

  const { availableEquity, maxLoanAmount, remainingEquity } = useMemo(() => {
    const value = Number(homeValue) || 0
    const balance = Number(mortgageBalance) || 0
    const maxLoan = value * (ltvRatio / 100)
    const available = Math.max(0, maxLoan - balance)
    const remaining = Math.max(0, value - balance - available)

    return {
      availableEquity: available,
      maxLoanAmount: maxLoan,
      remainingEquity: remaining,
    }
  }, [homeValue, mortgageBalance, ltvRatio])

  const chartData = useMemo(
    () => [
      {
        name: "Home Value Breakdown",
        "Mortgage Balance": Number(mortgageBalance),
        "Available Equity": availableEquity,
        "Remaining Equity": remainingEquity,
      },
    ],
    [mortgageBalance, availableEquity, remainingEquity],
  )

  const COLORS = {
    "Mortgage Balance": "#FF8042",
    "Available Equity": "#00C49F",
    "Remaining Equity": "#0088FE",
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <PiggyBank className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-bold">Home Equity Loan Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8 p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="home-value">Current Home Value</Label>
            <Input
              id="home-value"
              type="number"
              value={homeValue}
              onChange={(e) => setHomeValue(e.target.value)}
              placeholder="e.g., 450,000"
            />
          </div>
          <div>
            <Label htmlFor="mortgage-balance">Current Mortgage Balance</Label>
            <Input
              id="mortgage-balance"
              type="number"
              value={mortgageBalance}
              onChange={(e) => setMortgageBalance(e.target.value)}
              placeholder="e.g., 200,000"
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="ltv-ratio">Loan-to-Value (LTV) Ratio</Label>
              <span className="font-bold text-lg text-primary">{ltvRatio}%</span>
            </div>
            <Slider
              id="ltv-ratio"
              min={50}
              max={100}
              step={1}
              value={[ltvRatio]}
              onValueChange={(value) => setLtvRatio(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              This is the maximum percentage of your home's value a lender will let you borrow against. 80-85% is
              common.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-medium text-center">Estimated Available Equity</h3>
          <p className="text-5xl font-bold text-primary text-center my-4">{formatCurrency(availableEquity)}</p>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" stackOffset="expand">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend iconSize={10} formatter={(value) => <span className="text-muted-foreground">{value}</span>} />
                {Object.entries(COLORS).map(([key, color]) => (
                  <Bar key={key} dataKey={key} stackId="a" fill={color} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Based on your inputs, you can borrow up to {formatCurrency(maxLoanAmount)} (
            <span className="font-semibold">{ltvRatio}%</span> of your home's value).
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
