"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Building2, FileDown, Mail } from "lucide-react"
import { formatCurrency } from "@/utils/format-currency"
import { useToast } from "@/components/ui/use-toast"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function HouseHackingCalculator() {
  const { toast } = useToast()
  // --- INPUTS ---
  const [purchasePrice, setPurchasePrice] = useState("500000")
  const [downPayment, setDownPayment] = useState("100000")
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [closingCosts, setClosingCosts] = useState("10000")
  const [initialRepairs, setInitialRepairs] = useState("5000")

  const [numberOfUnits, setNumberOfUnits] = useState(2)
  const [unitRents, setUnitRents] = useState(["1800"])
  const [ownerUnitMarketRent, setOwnerUnitMarketRent] = useState("2000")

  const [propertyTax, setPropertyTax] = useState("6000") // Annual
  const [homeInsurance, setHomeInsurance] = useState("1800") // Annual
  const [vacancyRate, setVacancyRate] = useState(5)
  const [capexRate, setCapexRate] = useState(5)
  const [appreciationRate, setAppreciationRate] = useState(3)

  const [email, setEmail] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleUnitChange = (num: number) => {
    setNumberOfUnits(num)
    setUnitRents(Array(num - 1).fill("0"))
  }

  const handleRentChange = (index: number, value: string) => {
    const newRents = [...unitRents]
    newRents[index] = value
    setUnitRents(newRents)
  }

  const calculations = useMemo(() => {
    const price = Number(purchasePrice) || 0
    const down = Number(downPayment) || 0
    const loanAmount = price - down
    const r = interestRate / 100 / 12
    const n = loanTerm * 12
    const monthlyPI = loanAmount > 0 && r > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0

    const monthlyTax = (Number(propertyTax) || 0) / 12
    const monthlyInsurance = (Number(homeInsurance) || 0) / 12
    const piti = monthlyPI + monthlyTax + monthlyInsurance

    const grossRentalIncome = unitRents.reduce((sum, rent) => sum + (Number(rent) || 0), 0)
    const potentialGrossIncome = grossRentalIncome + (Number(ownerUnitMarketRent) || 0)

    const vacancyLoss = potentialGrossIncome * (vacancyRate / 100)
    const capexReserve = potentialGrossIncome * (capexRate / 100)
    const totalMonthlyExpenses = monthlyTax + monthlyInsurance + vacancyLoss + capexReserve

    const cashFlow = grossRentalIncome - piti - vacancyLoss - capexReserve
    const annualCashFlow = cashFlow * 12

    const totalCashInvested = down + (Number(closingCosts) || 0) + (Number(initialRepairs) || 0)
    const cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0

    const noi = potentialGrossIncome * 12 - totalMonthlyExpenses * 12
    const capRate = price > 0 ? (noi / price) * 100 : 0

    // 5-Year Projection
    const projection = []
    let currentLoanBalance = loanAmount
    let currentPropertyValue = price
    for (let year = 1; year <= 5; year++) {
      let interestPaid = 0
      let principalPaid = 0
      for (let month = 1; month <= 12; month++) {
        const i = currentLoanBalance * r
        const p = monthlyPI - i
        interestPaid += i
        principalPaid += p
        currentLoanBalance -= p
      }
      currentPropertyValue *= 1 + appreciationRate / 100
      const equity = currentPropertyValue - currentLoanBalance
      projection.push({ year, cashFlow: annualCashFlow, loanBalance: currentLoanBalance, equity })
    }

    return { cashFlow, cashOnCashReturn, capRate, piti, projection, totalCashInvested, noi }
  }, [
    purchasePrice,
    downPayment,
    interestRate,
    loanTerm,
    propertyTax,
    homeInsurance,
    unitRents,
    ownerUnitMarketRent,
    vacancyRate,
    capexRate,
    closingCosts,
    initialRepairs,
    appreciationRate,
  ])

  const handlePdfGeneration = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({ title: "Please enter your email.", variant: "destructive" })
      return
    }
    const doc = new jsPDF()
    doc.setFont("helvetica", "bold")
    doc.setFontSize(20)
    doc.text("House Hacking Deal Analysis", 105, 20, { align: "center" })

    autoTable(doc, {
      startY: 30,
      head: [["Key Performance Indicators", ""]],
      body: [
        ["Monthly Cash Flow", formatCurrency(calculations.cashFlow)],
        ["Cash-on-Cash Return", `${calculations.cashOnCashReturn.toFixed(2)}%`],
        ["Capitalization (Cap) Rate", `${calculations.capRate.toFixed(2)}%`],
        ["Total Cash Invested", formatCurrency(calculations.totalCashInvested)],
        ["Net Operating Income (NOI)", formatCurrency(calculations.noi)],
      ],
    })

    autoTable(doc, {
      head: [["5-Year Profitability Projection", "", "", ""]],
      body: [
        ["Year", "Annual Cash Flow", "Loan Balance", "Estimated Equity"],
        ...calculations.projection.map((p) => [
          p.year,
          formatCurrency(p.cashFlow),
          formatCurrency(p.loanBalance),
          formatCurrency(p.equity),
        ]),
      ],
    })

    doc.save(`House-Hacking-Analysis-${purchasePrice}.pdf`)
    toast({ title: "Success!", description: "Your PDF report has been downloaded." })
    setIsModalOpen(false)
  }

  return (
    <Card className="w-full max-w-7xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-bold">House Hacking Deal Analyzer</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid lg:grid-cols-2 gap-6 p-6">
        {/* --- INPUTS COLUMN --- */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property & Loan</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InputWithLabel label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} />
              <InputWithLabel label="Down Payment" value={downPayment} onChange={setDownPayment} />
              <InputWithLabel
                label="Interest Rate (%)"
                value={String(interestRate)}
                onChange={(v) => setInterestRate(Number(v))}
              />
              <InputWithLabel
                label="Loan Term (Years)"
                value={String(loanTerm)}
                onChange={(v) => setLoanTerm(Number(v))}
              />
              <InputWithLabel label="Closing Costs" value={closingCosts} onChange={setClosingCosts} />
              <InputWithLabel label="Initial Repairs" value={initialRepairs} onChange={setInitialRepairs} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Income</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Number of Units</Label>
                <Select value={String(numberOfUnits)} onValueChange={(v) => handleUnitChange(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} Units
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <InputWithLabel
                label="Owner's Unit Market Rent"
                value={ownerUnitMarketRent}
                onChange={setOwnerUnitMarketRent}
              />
              {unitRents.map((rent, i) => (
                <InputWithLabel
                  key={i}
                  label={`Unit ${i + 2} Monthly Rent`}
                  value={rent}
                  onChange={(v) => handleRentChange(i, v)}
                />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expenses & Assumptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputWithLabel label="Annual Property Tax" value={propertyTax} onChange={setPropertyTax} />
              <InputWithLabel label="Annual Home Insurance" value={homeInsurance} onChange={setHomeInsurance} />
              <SliderWithLabel
                label="Vacancy Rate"
                value={vacancyRate}
                onValueChange={setVacancyRate}
                max={25}
                unit="%"
              />
              <SliderWithLabel
                label="Capital Expenditures (CapEx)"
                value={capexRate}
                onValueChange={setCapexRate}
                max={25}
                unit="%"
              />
              <SliderWithLabel
                label="Appreciation Rate"
                value={appreciationRate}
                onValueChange={setAppreciationRate}
                max={10}
                unit="%"
              />
            </CardContent>
          </Card>
        </div>

        {/* --- RESULTS COLUMN --- */}
        <div className="space-y-4">
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-center">KPI Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard title="Monthly Cash Flow" value={formatCurrency(calculations.cashFlow)} />
              <KpiCard title="Cash-on-Cash Return" value={`${calculations.cashOnCashReturn.toFixed(2)}%`} />
              <KpiCard title="Cap Rate" value={`${calculations.capRate.toFixed(2)}%`} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>5-Year Profitability Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Cash Flow</TableHead>
                    <TableHead>Loan Balance</TableHead>
                    <TableHead>Equity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculations.projection.map((p) => (
                    <TableRow key={p.year}>
                      <TableCell>{p.year}</TableCell>
                      <TableCell>{formatCurrency(p.cashFlow)}</TableCell>
                      <TableCell>{formatCurrency(p.loanBalance)}</TableCell>
                      <TableCell>{formatCurrency(p.equity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Download Full Deal Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Get a comprehensive PDF report with all inputs, KPIs, and projections for your records.</p>
            </CardContent>
            <CardFooter>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <FileDown className="mr-2 h-4 w-4" /> Get My Analysis
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Download Your Deal Analysis</DialogTitle>
                    <DialogDescription>Enter your email to receive the comprehensive PDF report.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePdfGeneration} className="space-y-4">
                    <div className="relative">
                      <Mail className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="investor@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Download PDF
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper components for cleaner code
function InputWithLabel({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} type="number" />
    </div>
  )
}

function SliderWithLabel({
  label,
  value,
  onValueChange,
  max,
  unit,
}: {
  label: string
  value: number
  onValueChange: (v: number) => void
  max: number
  unit: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="font-semibold">
          {value}
          {unit}
        </span>
      </div>
      <Slider value={[value]} onValueChange={(v) => onValueChange(v[0])} max={max} step={0.5} />
    </div>
  )
}

function KpiCard({ title, value }: { title: string; value: string }) {
  const isNegative = value.startsWith("-")
  return (
    <Card className="text-center">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${isNegative ? "text-red-600" : "text-primary"}`}>{value}</p>
      </CardContent>
    </Card>
  )
}
