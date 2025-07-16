"use client"

import { useState, useEffect, useCallback } from "react"

const defaultCreditScoreTiers = [
  { value: "760", label: "760+" },
  { value: "740", label: "740-759" },
  { value: "720", label: "720-739" },
  { value: "700", label: "700-719" },
  { value: "680", label: "680-699" },
  { value: "660", label: "< 680" },
]

const defaultPmiRateChart: Record<string, Record<string, number>> = {
  "760": { "97": 0.41, "95": 0.3, "90": 0.23, "85": 0.18 },
  "740": { "97": 0.51, "95": 0.4, "90": 0.31, "85": 0.22 },
  "720": { "97": 0.72, "95": 0.59, "90": 0.45, "85": 0.33 },
  "700": { "97": 0.98, "95": 0.81, "90": 0.68, "85": 0.51 },
  "680": { "97": 1.12, "95": 0.94, "90": 0.82, "85": 0.62 },
  "660": { "97": 1.25, "95": 1.05, "90": 0.95, "85": 0.75 },
}

const LTV_BRACKETS = ["97", "95", "90", "85"]

const STORAGE_KEY = "mortgage-pmi-rates"

export function usePmiRates() {
  const [rates, setRates] = useState<Record<string, Record<string, number>>>(defaultPmiRateChart)
  const [creditScoreTiers, setCreditScoreTiers] = useState(defaultCreditScoreTiers) // In a full app, this could also be editable

  useEffect(() => {
    try {
      const storedRates = localStorage.getItem(STORAGE_KEY)
      if (storedRates) {
        setRates(JSON.parse(storedRates))
      }
    } catch (error) {
      console.error("Failed to load PMI rates from localStorage", error)
      setRates(defaultPmiRateChart)
    }
  }, [])

  const saveRates = (newRates: Record<string, Record<string, number>>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRates))
      setRates(newRates)
    } catch (error) {
      console.error("Failed to save PMI rates to localStorage", error)
    }
  }

  const getConventionalPmiRate = useCallback(
    (ltv: number, creditScore: string): number => {
      if (ltv <= 80) {
        return 0
      }

      const scoreKey = creditScore
      const ratesForScore = rates[scoreKey]
      if (!ratesForScore) {
        return (rates["660"]["97"] || 0) / 100
      }

      let ltvKey: string
      if (ltv > 95) ltvKey = "97"
      else if (ltv > 90) ltvKey = "95"
      else if (ltv > 85) ltvKey = "90"
      else ltvKey = "85"

      const rate = ratesForScore[ltvKey] || 0
      return rate / 100 // Convert percentage to decimal
    },
    [rates],
  )

  return { rates, saveRates, creditScoreTiers, getConventionalPmiRate, LTV_BRACKETS }
}
