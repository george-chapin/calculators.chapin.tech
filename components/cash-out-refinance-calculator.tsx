"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Banknote, PlusCircle, Trash2, TrendingDown, TrendingUp, AlertTriangle, FileDown } from "lucide-react"
import { formatCurrency } from "@/utils/format-currency"
import { Slider } from "@/components/ui/slider"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface Debt {
  id: number
  name: string
  balance: string
  payment: string
}

export default function CashOutRefinanceCalculator() {
  // Loan & Home Details
  const [homeValue, setHomeValue] = useState("500000")
  const [currentMortgageBalance, setCurrentMortgageBalance] = useState("250000")
  const [currentMortgagePayment, setCurrentMortgagePayment] = useState("1500")
  const [newRate, setNewRate] = useState("6.0")
  const [newTerm, setNewTerm] = useState(30)
  const [closingCosts, setClosingCosts] = useState("6000")
  const [ltvRatio, setLtvRatio] = useState(80)

  // Debts
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: "Credit Card", balance: "15000", payment: "400" },
    { id: 2, name: "Car Loan", balance: "20000", payment: "500" },
  ])

  // Calculated Results
  const {
    totalDebtBalance,
    totalDebtPayments,
    cashNeeded,
    maxCashOutAvailable,
    newLoanAmount,
    newMortgagePayment,
    totalOldPayments,
    monthlySavings,
  } = useMemo(() => {
    const homeVal = Number(homeValue) || 0
    const currentBalance = Number(currentMortgageBalance) || 0
    const currentPmt = Number(currentMortgagePayment) || 0
    const costs = Number(closingCosts) || 0
    const rate = Number(newRate) / 100 / 12
    const term = newTerm * 12

    const debtBalance = debts.reduce((sum, d) => sum + (Number(d.balance) || 0), 0)
    const debtPayments = debts.reduce((sum, d) => sum + (Number(d.payment) || 0), 0)

    const needed = debtBalance + costs
    const maxAvailable = homeVal * (ltvRatio / 100) - currentBalance
    const newBalance = currentBalance + needed

    let newPmt = 0
    if (newBalance > 0 && rate > 0 && term > 0) {
      newPmt = (newBalance * (rate * Math.pow(1 + rate, term))) / (Math.pow(1 + rate, term) - 1)
    }

    const oldPmts = currentPmt + debtPayments
    const savings = oldPmts - newPmt

    return {
      totalDebtBalance: debtBalance,
      totalDebtPayments: debtPayments,
      cashNeeded: needed,
      maxCashOutAvailable: maxAvailable,
      newLoanAmount: newBalance,
      newMortgagePayment: newPmt,
      totalOldPayments: oldPmts,
      monthlySavings: savings,
    }
  }, [homeValue, currentMortgageBalance, currentMortgagePayment, newRate, newTerm, closingCosts, ltvRatio, debts])

  const ltvWarning = cashNeeded > maxCashOutAvailable

  const addDebt = () => {
    if (debts.length < 10) {
      setDebts([...debts, { id: Date.now(), name: "", balance: "", payment: "" }])
    }
  }

  const removeDebt = (id: number) => {
    setDebts(debts.filter((d) => d.id !== id))
  }

  const updateDebt = (id: number, field: keyof Omit<Debt, "id">, value: string) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, [field]: value } : d)))
  }

  const generatePdfReport = () => {
    const doc = new jsPDF()

    // Header
    doc.setFont("helvetica", "bold")
    doc.setFontSize(20)
    doc.text("Cash-Out Refinance Summary", 105, 20, { align: "center" })

    // Loan Details Table
    const loanDetails = [
      ["Current Home Value", formatCurrency(Number(homeValue))],
      ["Current Mortgage Balance", formatCurrency(Number(currentMortgageBalance))],
      ["Total Debt to Consolidate", formatCurrency(totalDebtBalance)],
      ["Estimated Closing Costs", formatCurrency(Number(closingCosts))],
      [
        { content: "New Loan Amount", styles: { fontStyle: "bold" } },
        { content: formatCurrency(newLoanAmount), styles: { fontStyle: "bold" } },
      ],
      ["New Interest Rate", `${newRate}%`],
      ["New Loan Term", `${newTerm} Years`],
    ]
    autoTable(doc, {
      startY: 30,
      head: [["Loan & Home Details", ""]],
      body: loanDetails,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
    })

    // Debts Table
    const debtRows = debts.map((d) => [d.name, formatCurrency(Number(d.balance)), formatCurrency(Number(d.payment))])
    debtRows.push([
      { content: "Totals", styles: { fontStyle: "bold" } },
      { content: formatCurrency(totalDebtBalance), styles: { fontStyle: "bold" } },
      { content: formatCurrency(totalDebtPayments), styles: { fontStyle: "bold" } },
    ])
    autoTable(doc, {
      head: [["Debts to Consolidate", "Balance", "Monthly Payment"]],
      body: debtRows,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
    })

    // Savings Summary Table
    const savingsDetails = [
      ["Total Old Payments", formatCurrency(totalOldPayments)],
      ["New Mortgage Payment (P&I)", formatCurrency(newMortgagePayment)],
      [
        { content: "Total Monthly Savings", styles: { fontStyle: "bold" } },
        { content: formatCurrency(monthlySavings), styles: { fontStyle: "bold" } },
      ],
    ]
    autoTable(doc, {
      head: [["Savings Summary", ""]],
      body: savingsDetails,
      theme: "striped",
      headStyles: { fillColor: [22, 163, 74] }, // Green for savings
    })

    // Savings Over Time
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Savings Over Time:", 14, (doc as any).lastAutoTable.finalY + 10)
    doc.setFont("helvetica", "normal")
    doc.text(`12 Months: ${formatCurrency(monthlySavings * 12)}`, 14, (doc as any).lastAutoTable.finalY + 17)
    doc.text(`24 Months: ${formatCurrency(monthlySavings * 24)}`, 70, (doc as any).lastAutoTable.finalY + 17)
    doc.text(`36 Months: ${formatCurrency(monthlySavings * 36)}`, 126, (doc as any).lastAutoTable.finalY + 17)

    // PDF Footer Disclaimer
    const pageHeight = doc.internal.pageSize.getHeight()
    const pageWidth = doc.internal.pageSize.getWidth()
    doc.setFontSize(8)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(128)
    const disclaimer =
      "*Disclaimer: The calculations provided are for informational and illustrative purposes only and are not a guarantee of credit. Accuracy is not guaranteed."
    const termsUrl = `${window.location.origin}/terms-of-service`
    const termsText = `For full details, please review our Terms of Service at: ${termsUrl}`
    doc.text(disclaimer, 10, pageHeight - 15)
    doc.text(termsText, 10, pageHeight - 10)

    doc.save("cash-out-refinance-summary.pdf")
  }

  const chartData = [
    { name: "Payments", "Total Old Payments": totalOldPayments, "New Mortgage Payment": newMortgagePayment },
  ]

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Banknote className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-bold">Cash-Out Refinance Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid lg:grid-cols-2 gap-8 p-6">
        {/* Input Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Home & New Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="home-value">Current Home Value</Label>
                  <Input
                    id="home-value"
                    type="number"
                    value={homeValue}
                    onChange={(e) => setHomeValue(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="current-balance">Current Mortgage Balance</Label>
                  <Input
                    id="current-balance"
                    type="number"
                    value={currentMortgageBalance}
                    onChange={(e) => setCurrentMortgageBalance(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="current-payment">Current Mortgage P&I</Label>
                  <Input
                    id="current-payment"
                    type="number"
                    value={currentMortgagePayment}
                    onChange={(e) => setCurrentMortgagePayment(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="new-rate">New Interest Rate (%)</Label>
                  <Input id="new-rate" type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                    </SelectContent>
                  </Select>
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
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="ltv-ratio">Max Loan-to-Value (LTV)</Label>
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Debts to Consolidate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {debts.map((debt, index) => (
                <div key={debt.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4">
                    {index === 0 && <Label>Debt Name</Label>}
                    <Input
                      placeholder="e.g. Credit Card"
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    {index === 0 && <Label>Balance</Label>}
                    <Input
                      type="number"
                      placeholder="10000"
                      value={debt.balance}
                      onChange={(e) => updateDebt(debt.id, "balance", e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    {index === 0 && <Label>Payment</Label>}
                    <Input
                      type="number"
                      placeholder="250"
                      value={debt.payment}
                      onChange={(e) => updateDebt(debt.id, "payment", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => removeDebt(debt.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              {debts.length < 10 && (
                <Button variant="outline" size="sm" onClick={addDebt} className="mt-4 bg-transparent">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Debt
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Column */}
        <div className="space-y-6">
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-xl text-center">New Monthly Mortgage Payment (P&I)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-primary text-center">{formatCurrency(newMortgagePayment)}</p>
              <div className="w-full h-48 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" hide />
                    <YAxis tickFormatter={(value) => formatCurrency(Number(value))} width={80} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="Total Old Payments" fill="#ff8042" />
                    <Bar dataKey="New Mortgage Payment" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {ltvWarning && (
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="p-4 flex items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <h4 className="font-bold text-destructive">LTV Exceeded</h4>
                  <p className="text-sm text-destructive/90">
                    Cash needed ({formatCurrency(cashNeeded)}) exceeds max available cash-out (
                    {formatCurrency(maxCashOutAvailable)}). Increase home value or LTV.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-4 text-center">
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
                <CardTitle className="text-base font-medium">New Loan Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(newLoanAmount)}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Total Savings Over Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-lg">
                <span>12 Months:</span>
                <span className={`font-bold ${monthlySavings * 12 >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(monthlySavings * 12)}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>24 Months:</span>
                <span className={`font-bold ${monthlySavings * 24 >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(monthlySavings * 24)}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>36 Months:</span>
                <span className={`font-bold ${monthlySavings * 36 >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(monthlySavings * 36)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-6 bg-muted/50">
        <Button onClick={generatePdfReport}>
          <FileDown className="mr-2 h-4 w-4" />
          Generate PDF Summary
        </Button>
      </CardFooter>
    </Card>
  )
}
