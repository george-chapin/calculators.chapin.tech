"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Briefcase, CheckCircle, XCircle, AlertTriangle, LinkIcon } from "lucide-react"
import { formatCurrency } from "@/utils/format-currency"
import Link from "next/link"

type LoanType = "term" | "sba" | "loc"

export function BusinessLoanCalculator() {
  // --- INPUTS ---
  const [loanAmount, setLoanAmount] = useState("100000")
  const [interestRate, setInterestRate] = useState("8.5")
  const [loanTerm, setLoanTerm] = useState("5") // Years
  const [loanType, setLoanType] = useState<LoanType>("term")

  // LOC specific
  const [drawPeriod, setDrawPeriod] = useState("12") // Months
  const [repaymentPeriod, setRepaymentPeriod] = useState("5") // Years

  // Business Health
  const [annualRevenue, setAnnualRevenue] = useState("500000")
  const [annualProfit, setAnnualProfit] = useState("80000")

  // ROI Goal
  const [roiGoal, setRoiGoal] = useState("Expand marketing campaign")
  const [expectedMonthlyRoi, setExpectedMonthlyRoi] = useState("3000")

  // Amortization
  const [extraPayment, setExtraPayment] = useState("0")

  const calculations = useMemo(() => {
    const amount = Number(loanAmount) || 0
    const rate = (Number(interestRate) || 0) / 100
    const termInMonths = (Number(loanTerm) || 0) * 12
    const monthlyRate = rate / 12

    let monthlyPayment = 0
    let totalInterest = 0
    let totalPayment = 0
    const amortizationSchedule = []

    if (loanType === "term" || loanType === "sba") {
      if (amount > 0 && monthlyRate > 0) {
        monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termInMonths))
        totalPayment = monthlyPayment * termInMonths
        totalInterest = totalPayment - amount
      }
    } else if (loanType === "loc") {
      const drawMonths = Number(drawPeriod) || 0
      const repayMonths = (Number(repaymentPeriod) || 0) * 12
      const interestOnlyPayment = amount * monthlyRate
      const interestDuringDraw = interestOnlyPayment * drawMonths

      if (amount > 0 && monthlyRate > 0 && repayMonths > 0) {
        const amortizingPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -repayMonths))
        monthlyPayment = amortizingPayment // Show the amortizing payment as the main result
        totalPayment = amortizingPayment * repayMonths + interestDuringDraw
        totalInterest = totalPayment - amount
      } else {
        monthlyPayment = interestOnlyPayment
        totalInterest = interestDuringDraw
        totalPayment = amount + interestDuringDraw
      }
    }

    // DSCR
    const annualDebtService = monthlyPayment * 12
    const dscr = annualDebtService > 0 ? (Number(annualProfit) || 0) / annualDebtService : Number.POSITIVE_INFINITY

    // ROI Analysis
    const roiSurplus = (Number(expectedMonthlyRoi) || 0) - monthlyPayment

    // Amortization with extra payments (for term/SBA loans)
    let interestSaved = 0
    let monthsSaved = 0
    if (loanType === "term" || loanType === "sba") {
      let balance = amount
      const originalBalance = amount
      const extra = Number(extraPayment) || 0
      let month = 0
      while (balance > 0) {
        month++
        const interest = balance * monthlyRate
        const principal = monthlyPayment - interest
        const totalPrincipalPaid = principal + extra
        balance -= totalPrincipalPaid
        amortizationSchedule.push({
          month,
          payment: monthlyPayment + extra,
          principal: totalPrincipalPaid,
          interest,
          balance: Math.max(0, balance),
        })
        if (balance <= 0) break
        if (month > termInMonths * 2) break // Safety break
      }
      const newTotalPayment = month * monthlyPayment + (month * extra - (extra > 0 ? balance : 0))
      const newTotalInterest = newTotalPayment - amount
      interestSaved = totalInterest - newTotalInterest
      monthsSaved = termInMonths - month
    }

    return { monthlyPayment, totalInterest, dscr, roiSurplus, amortizationSchedule, interestSaved, monthsSaved }
  }, [
    loanAmount,
    interestRate,
    loanTerm,
    loanType,
    drawPeriod,
    repaymentPeriod,
    annualProfit,
    expectedMonthlyRoi,
    extraPayment,
  ])

  const getDscrColor = (dscr: number) => {
    if (dscr >= 1.5) return "text-green-600"
    if (dscr >= 1.25) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="w-full max-w-7xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Briefcase className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-bold">Growth Funding Forecaster</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid lg:grid-cols-2 gap-6 p-6">
        {/* --- INPUTS COLUMN --- */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Loan Amount</Label>
                  <Input value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
                </div>
                <div>
                  <Label>Loan Type</Label>
                  <Select value={loanType} onValueChange={(v: LoanType) => setLoanType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="term">Term Loan</SelectItem>
                      <SelectItem value="sba">SBA Loan</SelectItem>
                      <SelectItem value="loc">Line of Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {loanType === "loc" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Draw Period (Months)</Label>
                    <Input value={drawPeriod} onChange={(e) => setDrawPeriod(e.target.value)} />
                  </div>
                  <div>
                    <Label>Repayment Period (Years)</Label>
                    <Input value={repaymentPeriod} onChange={(e) => setRepaymentPeriod(e.target.value)} />
                  </div>
                </div>
              ) : (
                <div>
                  <Label>Loan Term (Years)</Label>
                  <Input value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} />
                </div>
              )}
              <div>
                <Label>Interest Rate (%)</Label>
                <Input value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Business Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label>Annual Revenue</Label>
                <Input value={annualRevenue} onChange={(e) => setAnnualRevenue(e.target.value)} />
              </div>
              <div>
                <Label>Annual Profit</Label>
                <Input value={annualProfit} onChange={(e) => setAnnualProfit(e.target.value)} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Return on Investment (ROI) Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>What will this loan fund?</Label>
                <Input value={roiGoal} onChange={(e) => setRoiGoal(e.target.value)} />
              </div>
              <div>
                <Label>Expected Monthly ROI from this Investment</Label>
                <Input value={expectedMonthlyRoi} onChange={(e) => setExpectedMonthlyRoi(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- RESULTS COLUMN --- */}
        <div className="space-y-4">
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-center">
                {loanType === "loc" ? "Estimated Repayment" : "Estimated Monthly Payment"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-5xl font-bold text-primary">{formatCurrency(calculations.monthlyPayment)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Total Interest Paid: {formatCurrency(calculations.totalInterest)}
              </p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Health</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className={`text-3xl font-bold ${getDscrColor(calculations.dscr)}`}>
                  {calculations.dscr.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Debt Service Coverage Ratio</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ROI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {calculations.roiSurplus >= 0 ? (
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                )}
                <p className={`text-lg font-bold ${calculations.roiSurplus >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(calculations.roiSurplus)}
                </p>
                <p className="text-sm text-muted-foreground">Monthly ROI vs. Payment</p>
              </CardContent>
            </Card>
          </div>
          {(loanType === "term" || loanType === "sba") && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                  View Amortization & Early Payoff
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Amortization Schedule</DialogTitle>
                  <DialogDescription>See how extra payments can save you money and time.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-4 items-end">
                  <div className="col-span-2">
                    <Label>Extra Monthly Payment</Label>
                    <Input value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} />
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-sm font-bold text-green-600">
                      Interest Saved: {formatCurrency(calculations.interestSaved)}
                    </p>
                    <p className="text-sm font-bold text-blue-600">Time Saved: {calculations.monthsSaved} months</p>
                  </div>
                </div>
                <div className="h-96 overflow-y-auto border rounded-md mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculations.amortizationSchedule.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell>{row.month}</TableCell>
                          <TableCell>{formatCurrency(row.principal)}</TableCell>
                          <TableCell>{formatCurrency(row.interest)}</TableCell>
                          <TableCell>{formatCurrency(row.balance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Card className="border-2 border-dashed border-primary/50 bg-primary/5 text-center">
            <CardHeader>
              <AlertTriangle className="h-8 w-8 text-primary mx-auto" />
              <CardTitle className="text-primary">Maximize Your Funding's ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Is your business running efficiently enough to guarantee the best return on this new funding?
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/contact">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Request a Free AI Efficiency Audit
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
