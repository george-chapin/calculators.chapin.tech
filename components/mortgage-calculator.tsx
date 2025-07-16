"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Share2, Printer, Calculator, Info, FileDown } from "lucide-react"
import { Tooltip as ShadTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePmiRates } from "@/hooks/use-pmi-rates"
import { formatCurrency } from "@/utils/format-currency"

interface AmortizationData {
  month: number
  principal: string
  interest: string
  remainingBalance: string
}

type LoanType = "conventional" | "fha" | "va"

export function MortgageCalculator() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { getConventionalPmiRate, creditScoreTiers } = usePmiRates()

  const [propertyAddress, setPropertyAddress] = useState(searchParams.get("address") || "123 Main St, Anytown, USA")
  const [homePrice, setHomePrice] = useState(searchParams.get("price") || "500000")
  const [downPayment, setDownPayment] = useState(searchParams.get("dp") || "40000")
  const [loanTerm, setLoanTerm] = useState(Number(searchParams.get("term")) || 30)
  const [interestRate, setInterestRate] = useState(searchParams.get("rate") || "6.5")
  const [propertyTax, setPropertyTax] = useState(searchParams.get("tax") || "500")
  const [homeInsurance, setHomeInsurance] = useState(searchParams.get("insurance") || "150")
  const [loanType, setLoanType] = useState<LoanType>((searchParams.get("loanType") as LoanType) || "conventional")
  const [creditScore, setCreditScore] = useState(searchParams.get("creditScore") || "760")
  const [includeMI, setIncludeMI] = useState(searchParams.get("includeMI") === "false" ? false : true)
  const [isFirstTimeVALoanUser, setIsFirstTimeVALoanUser] = useState(
    searchParams.get("vaFirstTime") === "true" || searchParams.get("vaFirstTime") === null,
  )

  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationData[]>([])
  const [monthlyMI, setMonthlyMI] = useState(0)
  const [upfrontFee, setUpfrontFee] = useState(0)

  const baseLoanAmount = useMemo(() => Math.max(0, Number(homePrice) - Number(downPayment)), [homePrice, downPayment])
  const downPaymentPercentage = useMemo(
    () => (Number(homePrice) > 0 ? (Number(downPayment) / Number(homePrice)) * 100 : 0),
    [homePrice, downPayment],
  )
  const effectiveLoanAmount = useMemo(() => baseLoanAmount + upfrontFee, [baseLoanAmount, upfrontFee])

  useEffect(() => {
    if (!includeMI) {
      setUpfrontFee(0)
      setMonthlyMI(0)
      return
    }

    let newUpfrontFee = 0
    let newMonthlyMI = 0
    const ltv = (baseLoanAmount / Number(homePrice)) * 100

    if (loanType === "conventional") {
      const pmiRate = getConventionalPmiRate(ltv, creditScore)
      newMonthlyMI = (baseLoanAmount * pmiRate) / 12
    } else if (loanType === "fha") {
      newUpfrontFee = baseLoanAmount * 0.0175
      newMonthlyMI = (baseLoanAmount * 0.0055) / 12
    } else if (loanType === "va") {
      let fundingFeeRate = 0
      if (isFirstTimeVALoanUser) {
        if (downPaymentPercentage < 5) fundingFeeRate = 0.0215
        else if (downPaymentPercentage < 10) fundingFeeRate = 0.015
        else fundingFeeRate = 0.0125
      } else {
        if (downPaymentPercentage < 5) fundingFeeRate = 0.033
        else if (downPaymentPercentage < 10) fundingFeeRate = 0.015
        else fundingFeeRate = 0.0125
      }
      newUpfrontFee = baseLoanAmount * fundingFeeRate
    }

    setUpfrontFee(newUpfrontFee)
    setMonthlyMI(newMonthlyMI)
  }, [
    includeMI,
    loanType,
    baseLoanAmount,
    homePrice,
    downPaymentPercentage,
    isFirstTimeVALoanUser,
    creditScore,
    getConventionalPmiRate,
  ])

  const principalAndInterest = useMemo(() => {
    const P = effectiveLoanAmount
    const r = Number(interestRate) / 100 / 12
    const n = loanTerm * 12
    if (P > 0 && r > 0 && n > 0) {
      return (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
    }
    return 0
  }, [effectiveLoanAmount, interestRate, loanTerm])

  const calculateMortgage = useCallback(() => {
    const tax = Number(propertyTax) || 0
    const insurance = Number(homeInsurance) || 0
    const totalMonthly = principalAndInterest + tax + insurance + monthlyMI
    setMonthlyPayment(totalMonthly)

    const n = loanTerm * 12
    const totalPaid = principalAndInterest * n
    const interestPaid = totalPaid - effectiveLoanAmount
    setTotalInterest(interestPaid)
    setTotalPayment(totalPaid + (tax + insurance + monthlyMI) * n)

    let balance = effectiveLoanAmount
    const schedule: AmortizationData[] = []
    const r = Number(interestRate) / 100 / 12
    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * r
      const principalPayment = principalAndInterest - interestPayment
      balance -= principalPayment
      schedule.push({
        month: i,
        interest: interestPayment.toFixed(2),
        principal: principalPayment.toFixed(2),
        remainingBalance: balance.toFixed(2),
      })
    }
    setAmortizationSchedule(schedule)
  }, [effectiveLoanAmount, interestRate, loanTerm, propertyTax, homeInsurance, monthlyMI, principalAndInterest])

  useEffect(() => {
    calculateMortgage()
  }, [calculateMortgage])

  const generateShareableLink = () => {
    const params = new URLSearchParams({
      address: propertyAddress,
      price: homePrice,
      dp: downPayment,
      term: String(loanTerm),
      rate: interestRate,
      tax: propertyTax,
      insurance: homeInsurance,
      loanType: loanType,
      creditScore: creditScore,
      includeMI: String(includeMI),
      vaFirstTime: String(isFirstTimeVALoanUser),
    })
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link Copied!",
        description: "Mortgage calculation link copied to clipboard.",
      })
    })
  }

  const generatePdfReport = () => {
    const doc = new jsPDF()

    // Header
    doc.setFont("helvetica", "bold")
    doc.setFontSize(20)
    doc.text("Mortgage Loan Summary", 105, 20, { align: "center" })
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(propertyAddress, 105, 28, { align: "center" })

    // Loan Details and Monthly Payment tables
    const loanDetails = [
      ["Home Price", formatCurrency(Number(homePrice))],
      ["Down Payment", `${formatCurrency(Number(downPayment))} (${downPaymentPercentage.toFixed(2)}%)`],
      ["Loan Type", loanType.charAt(0).toUpperCase() + loanType.slice(1)],
      ["Interest Rate", `${interestRate}%`],
      ["Loan Term", `${loanTerm} Years`],
      ["Base Loan Amount", formatCurrency(baseLoanAmount)],
    ]
    if (upfrontFee > 0) {
      loanDetails.push(["Upfront MI/Funding Fee", formatCurrency(upfrontFee)])
    }
    loanDetails.push(["Total Loan Amount", formatCurrency(effectiveLoanAmount)])

    const monthlyPaymentDetails = [
      ["Principal & Interest", formatCurrency(principalAndInterest)],
      ["Property Tax", formatCurrency(Number(propertyTax))],
      ["Home Insurance", formatCurrency(Number(homeInsurance))],
    ]
    if (monthlyMI > 0) {
      monthlyPaymentDetails.push(["Monthly Mortgage Insurance", formatCurrency(monthlyMI)])
    }
    monthlyPaymentDetails.push([
      { content: "Total Monthly Payment", styles: { fontStyle: "bold" } },
      { content: formatCurrency(monthlyPayment), styles: { fontStyle: "bold" } },
    ])

    autoTable(doc, {
      startY: 35,
      head: [["Loan Details", ""]],
      body: loanDetails,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: { 1: { halign: "right" } },
    })

    autoTable(doc, {
      head: [["Monthly Payment Breakdown", ""]],
      body: monthlyPaymentDetails,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: { 1: { halign: "right" } },
    })

    // Amortization Schedule
    const firstYearSchedule = amortizationSchedule
      .slice(0, 12)
      .map((row) => [
        row.month,
        formatCurrency(Number(row.principal)),
        formatCurrency(Number(row.interest)),
        formatCurrency(Number(row.remainingBalance)),
      ])

    autoTable(doc, {
      head: [["First 12 Months Payment Schedule", "", "", ""]],
      startY: (doc as any).lastAutoTable.finalY + 10,
      headStyles: { fillColor: [41, 128, 185], halign: "center" },
      body: [["Month", "Principal", "Interest", "Remaining Balance"], ...firstYearSchedule],
      bodyStyles: {
        0: { fontStyle: "bold" },
      },
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
    })

    // PDF Footer Disclaimer
    const pageHeight = doc.internal.pageSize.getHeight()
    const pageWidth = doc.internal.pageSize.getWidth()
    doc.setFontSize(8)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(128) // Gray color

    const disclaimer =
      "*Disclaimer: The calculations provided are for informational and illustrative purposes only and are not a guarantee of credit. Accuracy is not guaranteed."
    const termsUrl = `${window.location.origin}/terms-of-service`
    const termsText = `For full details, please review our Terms of Service at: ${termsUrl}`

    const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 20)
    doc.text(disclaimerLines, 10, pageHeight - 20)

    const termsLines = doc.splitTextToSize(termsText, pageWidth - 20)
    doc.text(termsLines, 10, pageHeight - 12)

    doc.save(`mortgage-summary-${propertyAddress.replace(/ /g, "-")}.pdf`)
  }

  const chartData = [
    { name: "P&I", value: principalAndInterest },
    { name: "Tax", value: Number(propertyTax) || 0 },
    { name: "Insurance", value: Number(homeInsurance) || 0 },
    { name: "MI", value: monthlyMI },
  ].filter((item) => item.value > 0)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <TooltipProvider>
      <Card className="w-full max-w-5xl mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Mortgage Calculator</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="property-address">Property Address</Label>
              <Input
                id="property-address"
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="e.g., 123 Main St, Anytown, USA"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loan-type">Loan Type</Label>
                <Select value={loanType} onValueChange={(val: LoanType) => setLoanType(val)}>
                  <SelectTrigger id="loan-type">
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conventional">Conventional</SelectItem>
                    <SelectItem value="fha">FHA</SelectItem>
                    <SelectItem value="va">VA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {loanType === "conventional" && includeMI && (
                <div>
                  <Label htmlFor="credit-score">Credit Score</Label>
                  <Select value={creditScore} onValueChange={setCreditScore}>
                    <SelectTrigger id="credit-score">
                      <SelectValue placeholder="Select score" />
                    </SelectTrigger>
                    <SelectContent>
                      {creditScoreTiers.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                          {tier.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 pl-1">
              <Checkbox
                id="include-mi"
                checked={includeMI}
                onCheckedChange={(checked) => setIncludeMI(Boolean(checked))}
              />
              <label htmlFor="include-mi" className="text-sm font-medium">
                Include Mortgage Insurance / Funding Fees
              </label>
            </div>

            {loanType === "va" && includeMI && (
              <div className="flex items-center space-x-2 pl-1">
                <Checkbox
                  id="va-first-time"
                  checked={isFirstTimeVALoanUser}
                  onCheckedChange={(checked) => setIsFirstTimeVALoanUser(Boolean(checked))}
                />
                <label htmlFor="va-first-time" className="text-sm font-medium">
                  First-time use of VA loan benefit
                </label>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="home-price">Home Price</Label>
                <Input
                  id="home-price"
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(e.target.value)}
                  placeholder="e.g., 500000"
                />
              </div>
              <div>
                <Label htmlFor="down-payment">Down Payment</Label>
                <Input
                  id="down-payment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="loan-term">Loan Term (Years)</Label>
              <Select value={String(loanTerm)} onValueChange={(val) => setLoanTerm(Number(val))}>
                <SelectTrigger id="loan-term">
                  <SelectValue placeholder="Select loan term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Years</SelectItem>
                  <SelectItem value="20">20 Years</SelectItem>
                  <SelectItem value="15">15 Years</SelectItem>
                  <SelectItem value="10">10 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="interest-rate">Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g., 6.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property-tax">Monthly Property Tax</Label>
                <Input
                  id="property-tax"
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(e.target.value)}
                  placeholder="e.g., 500"
                />
              </div>
              <div>
                <Label htmlFor="home-insurance">Monthly Home Insurance</Label>
                <Input
                  id="home-insurance"
                  type="number"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(e.target.value)}
                  placeholder="e.g., 150"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between bg-muted p-6 rounded-lg">
            <div>
              <h3 className="text-lg font-medium text-center">Estimated Monthly Payment</h3>
              <p className="text-5xl font-bold text-primary text-center">{formatCurrency(monthlyPayment)}</p>
            </div>
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                      const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
                      const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))
                      return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">{`${(
                          percent * 100
                        ).toFixed(0)}%`}</text>
                      )
                    }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2 text-sm">
              <Card>
                <CardContent className="p-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Principal & Interest</span>
                    <span className="font-medium">{formatCurrency(principalAndInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Property Tax</span>
                    <span className="font-medium">{formatCurrency(Number(propertyTax) || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Home Insurance</span>
                    <span className="font-medium">{formatCurrency(Number(homeInsurance) || 0)}</span>
                  </div>
                  {monthlyMI > 0 && (
                    <div className="flex justify-between">
                      <span>Mortgage Insurance</span>
                      <span className="font-medium">{formatCurrency(monthlyMI)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              <div className="text-center space-y-1 pt-2">
                <div className="flex justify-center items-center gap-1">
                  <p>
                    Loan Amount: <span className="font-semibold">{formatCurrency(effectiveLoanAmount)}</span>
                  </p>
                  {upfrontFee > 0 && (
                    <ShadTooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Base: {formatCurrency(baseLoanAmount)}</p>
                        <p>Upfront Fee: {formatCurrency(upfrontFee)}</p>
                      </TooltipContent>
                    </ShadTooltip>
                  )}
                </div>
                <p>
                  Total Interest Paid: <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 p-6 bg-muted/50">
          <Button onClick={generatePdfReport} variant="secondary">
            <FileDown className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>
          <Button onClick={generateShareableLink} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Calculation
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>View Amortization Table</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh]">
              <DialogHeader>
                <DialogTitle>Amortization Schedule</DialogTitle>
              </DialogHeader>
              <div id="amortization-table-content" className="h-full overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="w-[100px]">Month</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead className="text-right">Remaining Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amortizationSchedule.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell className="font-medium">{row.month}</TableCell>
                        <TableCell>{formatCurrency(Number(row.principal))}</TableCell>
                        <TableCell>{formatCurrency(Number(row.interest))}</TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(row.remainingBalance))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DialogFooter>
                <Button onClick={() => window.print()} variant="secondary">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Table
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
