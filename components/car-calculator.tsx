"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Car } from "lucide-react"
import { cn } from "@/lib/utils"

export function CarCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState("35000")
  const [downPayment, setDownPayment] = useState("5000")
  const [tradeInValue, setTradeInValue] = useState("10000")
  const [loanPayoff, setLoanPayoff] = useState("8000")
  const [interestRate, setInterestRate] = useState("7.5")
  const [loanTerm, setLoanTerm] = useState(60) // in months
  const [salesTax, setSalesTax] = useState("6")
  const [deductTaxOnTradeIn, setDeductTaxOnTradeIn] = useState(true)

  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [totalLoanAmount, setTotalLoanAmount] = useState(0)

  const tradeInEquity = useMemo(() => {
    return (Number(tradeInValue) || 0) - (Number(loanPayoff) || 0)
  }, [tradeInValue, loanPayoff])

  const calculateCarLoan = useCallback(() => {
    const price = Number(vehiclePrice) || 0
    const down = Number(downPayment) || 0
    const tradeIn = Number(tradeInValue) || 0
    const taxRate = Number(salesTax) / 100 || 0
    const rate = Number(interestRate) / 100 / 12 || 0
    const term = Number(loanTerm) || 0

    const taxableAmount = deductTaxOnTradeIn ? Math.max(0, price - tradeIn) : price
    const totalTax = taxableAmount * taxRate

    const loan = price + totalTax - down - tradeInEquity
    setTotalLoanAmount(loan)

    if (loan > 0 && rate > 0 && term > 0) {
      const M = (loan * (rate * Math.pow(1 + rate, term))) / (Math.pow(1 + rate, term) - 1)
      const totalPaid = M * term
      const interestPaid = totalPaid - loan

      setMonthlyPayment(M)
      setTotalInterest(interestPaid)
      setTotalCost(price + interestPaid + totalTax - tradeInEquity)
    } else {
      setMonthlyPayment(0)
      setTotalInterest(0)
      setTotalCost(price + totalTax - tradeInEquity)
    }
  }, [vehiclePrice, downPayment, tradeInValue, interestRate, loanTerm, salesTax, deductTaxOnTradeIn, tradeInEquity])

  useEffect(() => {
    calculateCarLoan()
  }, [calculateCarLoan])

  const chartData = [
    { name: "Principal", value: Math.max(0, totalLoanAmount - totalInterest) },
    { name: "Total Interest", value: totalInterest },
    {
      name: "Sales Tax",
      value: useMemo(() => {
        const price = Number(vehiclePrice) || 0
        const tradeIn = Number(tradeInValue) || 0
        const taxRate = Number(salesTax) / 100 || 0
        const taxableAmount = deductTaxOnTradeIn ? Math.max(0, price - tradeIn) : price
        return taxableAmount * taxRate
      }, [vehiclePrice, tradeInValue, salesTax, deductTaxOnTradeIn]),
    },
  ].filter((item) => item.value > 0)

  const COLORS = ["#0088FE", "#FF8042", "#00C49F"]

  const getEquityImage = () => {
    if (tradeInEquity > 0) {
      return "/happy-car-money-bags.png"
    }
    if (tradeInEquity < 0) {
      return "/placeholder-bgk3u.png"
    }
    return "/car-on-balance-scale.png"
  }

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Car className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-bold">Car Payment Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8 p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="vehicle-price">Vehicle Price</Label>
            <Input
              id="vehicle-price"
              type="number"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="down-payment">Down Payment</Label>
              <Input
                id="down-payment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="trade-in">Trade-in Value</Label>
              <Input
                id="trade-in"
                type="number"
                value={tradeInValue}
                onChange={(e) => setTradeInValue(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="loan-payoff">Loan Payoff on Trade-in</Label>
            <Input id="loan-payoff" type="number" value={loanPayoff} onChange={(e) => setLoanPayoff(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="loan-term">Loan Term (Months)</Label>
            <Select value={String(loanTerm)} onValueChange={(val) => setLoanTerm(Number(val))}>
              <SelectTrigger id="loan-term">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="36">36 Months</SelectItem>
                <SelectItem value="48">48 Months</SelectItem>
                <SelectItem value="60">60 Months</SelectItem>
                <SelectItem value="72">72 Months</SelectItem>
                <SelectItem value="84">84 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="interest-rate">Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sales-tax">Sales Tax (%)</Label>
              <Input
                id="sales-tax"
                type="number"
                step="0.01"
                value={salesTax}
                onChange={(e) => setSalesTax(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="deduct-tax"
              checked={deductTaxOnTradeIn}
              onCheckedChange={(checked) => setDeductTaxOnTradeIn(Boolean(checked))}
            />
            <label htmlFor="deduct-tax" className="text-sm font-medium leading-none">
              Deduct trade-in value from sales tax calculation
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <Card className="flex flex-col items-center justify-center bg-muted p-6 rounded-lg h-full">
            <h3 className="text-lg font-medium mb-2">Estimated Monthly Payment</h3>
            <p className="text-5xl font-bold text-primary mb-4">
              ${monthlyPayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" outerRadius={70} fill="#8884d8" dataKey="value" label>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Legend iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm text-center mt-4 space-y-1">
              <p>
                Total Loan Amount:{" "}
                <span className="font-semibold">
                  ${totalLoanAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </p>
              <p>
                Total Interest Paid:{" "}
                <span className="font-semibold">
                  ${totalInterest.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </p>
              <p>
                Total Cost of Vehicle:{" "}
                <span className="font-semibold">
                  ${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </p>
            </div>
          </Card>
          <Card className="bg-muted">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-lg">{tradeInEquity >= 0 ? "Trade-in Equity" : "Trade-in Deficit"}</h4>
                <p
                  className={cn(
                    "text-3xl font-bold",
                    tradeInEquity > 0 && "text-green-600",
                    tradeInEquity < 0 && "text-red-600",
                  )}
                >
                  $
                  {Math.abs(tradeInEquity).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-muted-foreground">(Trade-in Value - Loan Payoff)</p>
              </div>
              <Image
                src={getEquityImage() || "/placeholder.svg"}
                alt={tradeInEquity >= 0 ? "Positive Equity" : "Negative Equity"}
                width={80}
                height={80}
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
