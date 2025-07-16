"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Scale, TrendingUp, Milestone, Home, Building, FileDown, Mail } from "lucide-react"
import { formatCurrency } from "@/utils/format-currency"
import { useToast } from "@/components/ui/use-toast"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function RentVsBuyCalculator() {
  const { toast } = useToast()
  // --- INPUTS ---
  // Buy Inputs
  const [homePrice, setHomePrice] = useState("400000")
  const [downPayment, setDownPayment] = useState("80000")
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2)
  const [homeInsurance, setHomeInsurance] = useState("150")
  const [hoaFees, setHoaFees] = useState("50")
  const [initialRepairs, setInitialRepairs] = useState("2000")
  const [maintenanceRate, setMaintenanceRate] = useState(1)

  // Rent Inputs
  const [monthlyRent, setMonthlyRent] = useState("2000")
  const [rentersInsurance, setRentersInsurance] = useState("20")
  const [rentIncreaseRate, setRentIncreaseRate] = useState(3)

  // Market Inputs
  const [homeAppreciationRate, setHomeAppreciationRate] = useState(4)
  const [investmentReturnRate, setInvestmentReturnRate] = useState(7)

  // Toggles
  const [includeHoa, setIncludeHoa] = useState(true)
  const [includeMaintenance, setIncludeMaintenance] = useState(true)
  const [includeRepairs, setIncludeRepairs] = useState(true)

  // Lifestyle Inputs
  const [stability, setStability] = useState(5)
  const [renovation, setRenovation] = useState(5)
  const [lowMaintenance, setLowMaintenance] = useState(5)

  // Lead Gen
  const [email, setEmail] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const calculations = useMemo(() => {
    const P = Number(homePrice) - Number(downPayment)
    const r = interestRate / 100 / 12
    const n = loanTerm * 12
    const monthlyPI = P > 0 && r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0

    const chartData = []
    let cumulativeBuyCost = Number(downPayment) + (includeRepairs ? Number(initialRepairs) : 0)
    let cumulativeRentCost = 0
    let homeValue = Number(homePrice)
    let loanBalance = P
    let currentRent = Number(monthlyRent)
    let investedDownPayment = Number(downPayment)
    let breakevenYear = null

    for (let year = 1; year <= loanTerm; year++) {
      let yearlyBuyCost = 0
      let yearlyRentCost = 0

      for (let month = 1; month <= 12; month++) {
        // Buying Costs
        const interestPayment = loanBalance * r
        const principalPayment = monthlyPI - interestPayment
        loanBalance -= principalPayment
        const tax = (homeValue * (propertyTaxRate / 100)) / 12
        const insurance = Number(homeInsurance)
        const hoa = includeHoa ? Number(hoaFees) : 0
        const maintenance = includeMaintenance ? (homeValue * (maintenanceRate / 100)) / 12 : 0
        const monthlyBuyCost = monthlyPI + tax + insurance + hoa + maintenance
        yearlyBuyCost += monthlyBuyCost

        // Renting Costs
        const monthlyRentingCost = currentRent + Number(rentersInsurance)
        yearlyRentCost += monthlyRentingCost

        // Opportunity Cost Investment
        investedDownPayment *= 1 + investmentReturnRate / 100 / 12
      }

      cumulativeBuyCost += yearlyBuyCost
      cumulativeRentCost += yearlyRentCost

      homeValue *= 1 + homeAppreciationRate / 100
      currentRent *= 1 + rentIncreaseRate / 100

      const netWorthBuy = homeValue - loanBalance
      const netWorthRent = investedDownPayment

      chartData.push({
        year,
        buyNetWorth: netWorthBuy,
        rentNetWorth: netWorthRent,
      })

      if (breakevenYear === null && netWorthBuy > netWorthRent) {
        breakevenYear = year
      }
    }

    const opportunityCost = investedDownPayment
    const lifestyleScore = stability + renovation - lowMaintenance

    return { chartData, breakevenYear, opportunityCost, lifestyleScore }
  }, [
    homePrice,
    downPayment,
    interestRate,
    loanTerm,
    propertyTaxRate,
    homeInsurance,
    hoaFees,
    initialRepairs,
    maintenanceRate,
    monthlyRent,
    rentersInsurance,
    rentIncreaseRate,
    homeAppreciationRate,
    investmentReturnRate,
    includeHoa,
    includeMaintenance,
    includeRepairs,
    stability,
    renovation,
    lowMaintenance,
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
    doc.text("Rent vs. Buy Analysis", 105, 20, { align: "center" })
    doc.setFontSize(12)
    doc.text(`Prepared for: ${email}`, 105, 28, { align: "center" })

    autoTable(doc, {
      startY: 40,
      head: [["Financial Summary", ""]],
      body: [
        ["Breakeven Horizon", `${calculations.breakevenYear || "> 30"} Years`],
        [
          "Down Payment Opportunity Cost",
          `Your down payment of ${formatCurrency(Number(downPayment))} could grow to ${formatCurrency(
            calculations.opportunityCost,
          )} over ${loanTerm} years.`,
        ],
      ],
      theme: "striped",
    })

    autoTable(doc, {
      head: [["Lifestyle Summary", ""]],
      body: [
        ["Your Score", `${calculations.lifestyleScore} / 10`],
        [
          "Recommendation",
          calculations.lifestyleScore > 5
            ? "Your preferences strongly align with buying."
            : calculations.lifestyleScore < 5
              ? "Your preferences lean towards renting."
              : "You have a balanced view of lifestyle factors.",
        ],
      ],
    })

    doc.save(`Rent-vs-Buy-Analysis-${email}.pdf`)
    toast({ title: "Success!", description: "Your PDF report has been downloaded." })
    setIsModalOpen(false)
  }

  return (
    <Card className="w-full max-w-7xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Scale className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-bold">Rent vs. Buy: The Lifestyle & Investment Analyzer</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid lg:grid-cols-2 gap-8 p-6">
        {/* --- INPUTS COLUMN --- */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Buying Assumptions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Home /> Buying Assumptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Home Price</Label>
                  <Input value={homePrice} onChange={(e) => setHomePrice(e.target.value)} />
                </div>
                <div>
                  <Label>Down Payment</Label>
                  <Input value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
                </div>
                <div>
                  <Label>Interest Rate (%)</Label>
                  <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} max={12} step={0.1} />
                </div>
                <div>
                  <Label>Property Tax Rate (% of value)</Label>
                  <Input value={propertyTaxRate} onChange={(e) => setPropertyTaxRate(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Monthly Home Insurance</Label>
                  <Input value={homeInsurance} onChange={(e) => setHomeInsurance(e.target.value)} />
                </div>
                <div className="space-y-2 pt-2">
                  <h4 className="font-semibold">Hidden Costs</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hoa" checked={includeHoa} onCheckedChange={(c) => setIncludeHoa(Boolean(c))} />
                    <Label htmlFor="hoa">HOA Fees (monthly)</Label>
                    {includeHoa && (
                      <Input className="h-8" value={hoaFees} onChange={(e) => setHoaFees(e.target.value)} />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="maintenance"
                      checked={includeMaintenance}
                      onCheckedChange={(c) => setIncludeMaintenance(Boolean(c))}
                    />
                    <Label htmlFor="maintenance">Maintenance (%/yr)</Label>
                    {includeMaintenance && (
                      <Input
                        className="h-8"
                        value={maintenanceRate}
                        onChange={(e) => setMaintenanceRate(Number(e.target.value))}
                      />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="repairs"
                      checked={includeRepairs}
                      onCheckedChange={(c) => setIncludeRepairs(Boolean(c))}
                    />
                    <Label htmlFor="repairs">Initial Repairs</Label>
                    {includeRepairs && (
                      <Input
                        className="h-8"
                        value={initialRepairs}
                        onChange={(e) => setInitialRepairs(e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Renting & Market Assumptions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Building /> Renting Assumptions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Monthly Rent</Label>
                    <Input value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} />
                  </div>
                  <div>
                    <Label>Annual Rent Increase (%)</Label>
                    <Slider
                      value={[rentIncreaseRate]}
                      onValueChange={(v) => setRentIncreaseRate(v[0])}
                      max={10}
                      step={0.5}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp /> Market Assumptions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Home Appreciation Rate (%)</Label>
                    <Slider
                      value={[homeAppreciationRate]}
                      onValueChange={(v) => setHomeAppreciationRate(v[0])}
                      max={10}
                      step={0.5}
                    />
                  </div>
                  <div>
                    <Label>Investment Return Rate (%)</Label>
                    <Slider
                      value={[investmentReturnRate]}
                      onValueChange={(v) => setInvestmentReturnRate(v[0])}
                      max={15}
                      step={0.5}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Lifestyle Factors */}
          <Card>
            <CardHeader>
              <CardTitle>Lifestyle Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Desire for Stability (1-10)</Label>
                <Slider value={[stability]} onValueChange={(v) => setStability(v[0])} max={10} step={1} />
              </div>
              <div>
                <Label>Freedom to Renovate (1-10)</Label>
                <Slider value={[renovation]} onValueChange={(v) => setRenovation(v[0])} max={10} step={1} />
              </div>
              <div>
                <Label>Desire for Low-Maintenance (1-10)</Label>
                <Slider value={[lowMaintenance]} onValueChange={(v) => setLowMaintenance(v[0])} max={10} step={1} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- RESULTS COLUMN --- */}
        <div className="space-y-4">
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
                <Milestone /> Breakeven Horizon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-primary text-center">
                {calculations.breakevenYear ? `Year ${calculations.breakevenYear}` : `> ${loanTerm} Years`}
              </p>
              <div className="w-full h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={calculations.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
                    <YAxis tickFormatter={(val) => formatCurrency(val).slice(0, -3) + "k"} />
                    <Tooltip formatter={(val) => formatCurrency(Number(val))} />
                    <Legend />
                    <Line type="monotone" name="Buy Net Worth" dataKey="buyNetWorth" stroke="#8884d8" dot={false} />
                    <Line type="monotone" name="Rent Net Worth" dataKey="rentNetWorth" stroke="#82ca9d" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Opportunity Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  If invested, your down payment could grow to{" "}
                  <span className="font-bold text-green-600">{formatCurrency(calculations.opportunityCost)}</span> in{" "}
                  {loanTerm} years.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lifestyle Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-2xl font-bold ${
                    calculations.lifestyleScore > 5
                      ? "text-blue-600"
                      : calculations.lifestyleScore < 5
                        ? "text-orange-600"
                        : ""
                  }`}
                >
                  {calculations.lifestyleScore > 5
                    ? "Favors Buying"
                    : calculations.lifestyleScore < 5
                      ? "Favors Renting"
                      : "Balanced"}
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Get Your Personalized Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Receive a detailed PDF breakdown of this analysis to help guide your decision.</p>
            </CardContent>
            <CardFooter>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <FileDown className="mr-2 h-4 w-4" /> Get My Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Download Your Analysis</DialogTitle>
                    <DialogDescription>
                      Enter your email to receive the personalized "Renter's Path to Homeownership Plan" or "Buyer's
                      Readiness Assessment" PDF.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePdfGeneration} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-muted-foreground absolute ml-3" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
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
