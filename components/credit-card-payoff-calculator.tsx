"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/format-currency"

export function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState(5000)
  const [apr, setApr] = useState(19.99)
  const [monthlyPayment, setMonthlyPayment] = useState(150)
  const [results, setResults] = useState<{
    months: number
    totalInterest: number
    totalPrincipal: number
    payoffDate: string
  } | null>(null)

  const calculatePayoff = () => {
    const monthlyRate = apr / 100 / 12
    let currentBalance = balance
    let totalInterestPaid = 0
    let months = 0

    if (balance <= 0 || monthlyPayment <= balance * monthlyRate) {
      // Handle edge cases where payment doesn't cover interest or balance is zero
      setResults(null) // Or show an error message
      return
    }

    while (currentBalance > 0) {
      months++
      const interest = currentBalance * monthlyRate
      totalInterestPaid += interest
      const principalPaid = monthlyPayment - interest
      currentBalance -= principalPaid

      if (months > 1200) {
        // Safety break for very long payoff periods
        break
      }
    }

    const payoffDate = new Date()
    payoffDate.setMonth(payoffDate.getMonth() + months)

    setResults({
      months,
      totalInterest: totalInterestPaid,
      totalPrincipal: balance,
      payoffDate: payoffDate.toLocaleDateString("en-US", { year: "numeric", month: "long" }),
    })
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Credit Card Payoff Calculator</CardTitle>
        <CardDescription>
          Find out how long it will take to pay off your credit card balance and how much interest you'll pay.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="balance">Credit Card Balance</Label>
            <Input
              id="balance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              placeholder="5000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apr">Annual Percentage Rate (APR %)</Label>
            <Input
              id="apr"
              type="number"
              value={apr}
              onChange={(e) => setApr(Number(e.target.value))}
              placeholder="19.99"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyPayment">Monthly Payment</Label>
            <Input
              id="monthlyPayment"
              type="number"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(Number(e.target.value))}
              placeholder="150"
            />
          </div>
          <Button onClick={calculatePayoff} className="w-full">
            Calculate Payoff
          </Button>

          {results && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-center mb-4">Payoff Summary</h3>
              <Card className="bg-muted/50">
                <CardContent className="p-6 grid gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Payoff Date</span>
                    <span className="font-bold text-lg">{results.payoffDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Time to Pay Off</span>
                    <span className="font-bold text-lg">{results.months} months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Principal Paid</span>
                    <span className="font-bold text-lg">{formatCurrency(results.totalPrincipal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-600">
                    <span className="text-muted-foreground">Total Interest Paid</span>
                    <span className="font-bold text-lg">{formatCurrency(results.totalInterest)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
