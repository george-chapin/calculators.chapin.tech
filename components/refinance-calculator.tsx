"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Repeat, TrendingDown, TrendingUp, Milestone } from "lucide-react"
import { formatCurrency } from "@/utils/format-currency"

export function RefinanceCalculator() {
  // Current Mortgage
  const [currentBalance, setCurrentBalance] = useState("250000")
  const [currentPayment, setCurrentPayment] = useState("1450") // P&I only

  // New Refinance Loan
  const [newRate, setNewRate] = useState("5.5")
  const [newTerm, setNewTerm] = useState(30)
  const [closingCosts, setClosingCosts] = useState("5000")

  // Calculated Results
  const [newMonthlyPayment, setNewMonthlyPayment] = useState(0)
  const [monthlySavings, setMonthlySavings] = useState(0)
  const [breakEvenPoint, setBreakEvenPoint] = useState<number | null>(null)

  const calculateRefinance = useCallback(() => {
    const balance = Number(currentBalance) || 0
    const costs = Number(closingCosts) || 0
    const currentPmt = Number(currentPayment) || 0
    const rate = Number(newRate) / 100 / 12
    const term = newTerm * 12

    const newLoanAmount = balance + costs

    if (newLoanAmount > 0 && rate > 0 && term > 0) {
      const M = (newLoanAmount * (rate * Math.pow(1 + rate, term))) / (Math.pow(1 + rate, term) - 1)
      setNewMonthlyPayment(M)

      const savings = currentPmt - M
      setMonthlySavings(savings)

      if (savings > 0 && costs > 0) {
        setBreakEvenPoint(costs / savings)
      } else {
        setBreakEvenPoint(null)
      }
    } else {
      setNewMonthlyPayment(0)
      setMonthlySavings(0)
      setBreakEvenPoint(null)
    }
  }, [currentBalance, closingCosts, currentPayment, newRate, newTerm])

  useEffect(() => {
    calculateRefinance()
  }, [calculateRefinance])

  const chartData = useMemo(
    () => [
      {
        name: "Monthly Payment",
        Current: Number(currentPayment),
        New: newMonthlyPayment,
      },
    ],
    [currentPayment, newMonthlyPayment],
  )

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Repeat className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-bold">Refinance Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8 p-6">
        <div className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">Current Mortgage Details</h3>
            <div>
              <Label htmlFor="current-balance">Current Mortgage Balance</Label>
              <Input
                id="current-balance"
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="current-payment">Current Monthly Payment (Principal & Interest)</Label>
              <Input
                id="current-payment"
                type="number"
                value={currentPayment}
                onChange={(e) => setCurrentPayment(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">New Refinance Loan</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-rate">New Interest Rate (%)</Label>
                <Input
                  id="new-rate"
                  type="number"
                  step="0.01"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="new-term">New Loan Term</Label>
                <Select value={String(newTerm)} onValueChange={(val) => setNewTerm(Number(val))}>
                  <SelectTrigger id="new-term">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Years</SelectItem>
                    <SelectItem value="20">20 Years</SelectItem>
                    <SelectItem value="15">15 Years</SelectItem>
                    <SelectItem value="10">10 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="closing-costs">Closing Costs</Label>
              <Input
                id="closing-costs"
                type="number"
                value={closingCosts}
                onChange={(e) => setClosingCosts(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between bg-muted p-6 rounded-lg">
          <div>
            <h3 className="text-lg font-medium text-center">New Estimated Monthly Payment (P&I)</h3>
            <p className="text-5xl font-bold text-primary text-center">{formatCurrency(newMonthlyPayment)}</p>
          </div>
          <div className="w-full h-52 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(Number(value))} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="Current" fill="#8884d8" />
                <Bar dataKey="New" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-center">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-center gap-2">
                  {monthlySavings >= 0 ? (
                    <TrendingDown className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-red-500" />
                  )}
                  Monthly Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${monthlySavings >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(monthlySavings)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-center gap-2">
                  <Milestone className="h-5 w-5 text-blue-500" />
                  Break-Even Point
                </CardTitle>
              </CardHeader>
              <CardContent>
                {breakEvenPoint !== null && breakEvenPoint > 0 ? (
                  <p className="text-2xl font-bold text-blue-600">{breakEvenPoint.toFixed(1)} months</p>
                ) : (
                  <p className="text-sm text-muted-foreground pt-3">No savings to recoup costs</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
