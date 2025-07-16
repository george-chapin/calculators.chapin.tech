"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, PlusCircle } from "lucide-react"
import { formatCurrency } from "@/utils/format-currency"

type Debt = {
  id: number
  name: string
  balance: number
  apr: number
  minPayment: number
}

type PaymentPlan = {
  month: number
  payment: number
  principal: number
  interest: number
  endingBalance: number
}

type DebtPayoffSummary = {
  totalInterest: number
  months: number
  payoffDate: string
  plan: Record<string, PaymentPlan[]>
}

export function DebtPayoffCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: "Credit Card", balance: 5000, apr: 18, minPayment: 100 },
    { id: 2, name: "Student Loan", balance: 20000, apr: 5, minPayment: 250 },
    { id: 3, name: "Car Loan", balance: 15000, apr: 4, minPayment: 300 },
  ])
  const [extraPayment, setExtraPayment] = useState(200)
  const [results, setResults] = useState<{ snowball: DebtPayoffSummary; avalanche: DebtPayoffSummary } | null>(null)

  const handleDebtChange = (id: number, field: keyof Debt, value: string | number) => {
    setDebts(debts.map((debt) => (debt.id === id ? { ...debt, [field]: Number(value) } : debt)))
  }

  const addDebt = () => {
    const newId = debts.length > 0 ? Math.max(...debts.map((d) => d.id)) + 1 : 1
    setDebts([...debts, { id: newId, name: "", balance: 0, apr: 0, minPayment: 0 }])
  }

  const removeDebt = (id: number) => {
    setDebts(debts.filter((debt) => debt.id !== id))
  }

  const calculatePayoff = (strategy: "snowball" | "avalanche") => {
    const tempDebts = debts.map((d) => ({ ...d, monthlyInterestRate: d.apr / 100 / 12 }))
    let sortedDebts: typeof tempDebts

    if (strategy === "snowball") {
      sortedDebts = [...tempDebts].sort((a, b) => a.balance - b.balance)
    } else {
      // avalanche
      sortedDebts = [...tempDebts].sort((a, b) => b.apr - a.apr)
    }

    let totalMonths = 0
    let totalInterestPaid = 0
    let remainingExtraPayment = extraPayment
    const paymentPlan: Record<string, PaymentPlan[]> = Object.fromEntries(debts.map((d) => [d.name, []]))

    while (sortedDebts.some((d) => d.balance > 0)) {
      totalMonths++
      let currentExtraPayment = remainingExtraPayment

      for (const debt of sortedDebts) {
        if (debt.balance <= 0) continue

        const interest = debt.balance * debt.monthlyInterestRate
        totalInterestPaid += interest
        let payment = debt.minPayment

        if (payment > debt.balance + interest) {
          payment = debt.balance + interest
        }

        const availableForExtra = Math.min(currentExtraPayment, debt.balance + interest - payment)
        payment += availableForExtra
        currentExtraPayment -= availableForExtra

        const principal = payment - interest
        const endingBalance = debt.balance - principal

        paymentPlan[debt.name].push({
          month: totalMonths,
          payment,
          principal,
          interest,
          endingBalance: endingBalance > 0 ? endingBalance : 0,
        })

        debt.balance = endingBalance > 0 ? endingBalance : 0
      }

      const paidOffThisMonth = tempDebts.filter(
        (d) => d.balance > 0 && sortedDebts.find((sd) => sd.id === d.id && sd.balance <= 0),
      )
      remainingExtraPayment += paidOffThisMonth.reduce((sum, d) => sum + d.minPayment, 0)
    }

    const payoffDate = new Date()
    payoffDate.setMonth(payoffDate.getMonth() + totalMonths)

    return {
      totalInterest: totalInterestPaid,
      months: totalMonths,
      payoffDate: payoffDate.toLocaleDateString("en-US", { year: "numeric", month: "long" }),
      plan: paymentPlan,
    }
  }

  const handleCalculate = () => {
    const snowball = calculatePayoff("snowball")
    const avalanche = calculatePayoff("avalanche")
    setResults({ snowball, avalanche })
  }

  const renderPlanTable = (plan: Record<string, PaymentPlan[]>, debtNames: string[]) => {
    const totalMonths = Math.max(...Object.values(plan).map((p) => p.length))
    const monthNumbers = Array.from({ length: totalMonths }, (_, i) => i + 1)

    return (
      <div className="max-h-[500px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              {debtNames.map((name) => (
                <TableHead key={name} className="text-right">
                  {name} Balance
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthNumbers.map((month) => (
              <TableRow key={month}>
                <TableCell>{month}</TableCell>
                {debtNames.map((name) => {
                  const monthData = plan[name]?.find((p) => p.month === month)
                  return (
                    <TableCell key={name} className="text-right">
                      {monthData ? formatCurrency(monthData.endingBalance) : "Paid Off"}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Debt Snowball vs. Avalanche Calculator</CardTitle>
        <CardDescription>
          Enter your debts and extra payment amount to see which strategy helps you get out of debt faster.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Your Debts</h3>
            {debts.map((debt, index) => (
              <div key={debt.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end p-3 border rounded-lg">
                <div className="md:col-span-5">
                  <Label>Debt #{index + 1}</Label>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`name-${debt.id}`}>Name</Label>
                  <Input
                    id={`name-${debt.id}`}
                    value={debt.name}
                    onChange={(e) => handleDebtChange(debt.id, "name", e.target.value)}
                    placeholder="e.g., Credit Card"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`balance-${debt.id}`}>Balance</Label>
                  <Input
                    id={`balance-${debt.id}`}
                    type="number"
                    value={debt.balance}
                    onChange={(e) => handleDebtChange(debt.id, "balance", e.target.value)}
                    placeholder="5000"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`apr-${debt.id}`}>APR (%)</Label>
                  <Input
                    id={`apr-${debt.id}`}
                    type="number"
                    value={debt.apr}
                    onChange={(e) => handleDebtChange(debt.id, "apr", e.target.value)}
                    placeholder="18"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`minPayment-${debt.id}`}>Min. Payment</Label>
                  <Input
                    id={`minPayment-${debt.id}`}
                    type="number"
                    value={debt.minPayment}
                    onChange={(e) => handleDebtChange(debt.id, "minPayment", e.target.value)}
                    placeholder="100"
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeDebt(debt.id)} className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addDebt}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Debt
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extraPayment">Monthly Extra Payment</Label>
            <Input
              id="extraPayment"
              type="number"
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              placeholder="200"
            />
          </div>

          <Button onClick={handleCalculate} className="w-full">
            Calculate
          </Button>

          {results && (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="snowball">Snowball Plan</TabsTrigger>
                <TabsTrigger value="avalanche">Avalanche Plan</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Debt Snowball</CardTitle>
                      <CardDescription>Paying off smallest balances first.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        Payoff Date: <strong>{results.snowball.payoffDate}</strong>
                      </p>
                      <p>
                        Time to Payoff: <strong>{results.snowball.months} months</strong>
                      </p>
                      <p>
                        Total Interest Paid: <strong>{formatCurrency(results.snowball.totalInterest)}</strong>
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Debt Avalanche</CardTitle>
                      <CardDescription>Paying off highest interest rates first.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        Payoff Date: <strong>{results.avalanche.payoffDate}</strong>
                      </p>
                      <p>
                        Time to Payoff: <strong>{results.avalanche.months} months</strong>
                      </p>
                      <p>
                        Total Interest Paid: <strong>{formatCurrency(results.avalanche.totalInterest)}</strong>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="snowball">
                <Card>
                  <CardHeader>
                    <CardTitle>Snowball Payment Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderPlanTable(
                      results.snowball.plan,
                      debts.map((d) => d.name),
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="avalanche">
                <Card>
                  <CardHeader>
                    <CardTitle>Avalanche Payment Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderPlanTable(
                      results.avalanche.plan,
                      debts.map((d) => d.name),
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
