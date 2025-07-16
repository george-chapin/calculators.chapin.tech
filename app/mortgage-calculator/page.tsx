"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useToast } from "@/components/ui/use-toast"
import { usePmiRates } from "@/hooks/use-pmi-rates"
import { formatCurrency } from "@/utils/format-currency"
import { MortgageCalculator } from "@/components/mortgage-calculator"
import Image from "next/image"

interface AmortizationData {
  month: number
  principal: string
  interest: string
  remainingBalance: string
}

type LoanType = "conventional" | "fha" | "va"

export default function MortgageCalculatorPage() {
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
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/mortgage-calculator-hero.png"
            alt="A modern home with a for sale sign and a calculator icon overlaid"
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <h1 className="text-4xl font-bold">Mortgage Calculator</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Estimate your monthly mortgage payment and see a full amortization schedule.
        </p>
      </header>
      <main className="flex justify-center">
        <MortgageCalculator />
      </main>
    </div>
  )
}
