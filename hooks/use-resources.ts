"use client"

import { useState, useEffect } from "react"

export interface Resource {
  id: number
  name: string
  url: string
  description: string
}

const defaultResources: Resource[] = [
  {
    id: 1,
    name: "NerdWallet",
    url: "https://www.nerdwallet.com/mortgages",
    description: "Compare mortgage rates and get expert advice on the home buying process.",
  },
  {
    id: 2,
    name: "Bankrate",
    url: "https://www.bankrate.com/mortgage/",
    description: "Offers a wide range of financial calculators and current rate comparisons.",
  },
  {
    id: 3,
    name: "Investopedia",
    url: "https://www.investopedia.com/mortgage/",
    description: "In-depth articles and definitions for all things finance and mortgage.",
  },
  {
    id: 4,
    name: "Consumer Financial Protection Bureau",
    url: "https://www.consumerfinance.gov/owning-a-home/",
    description: "Government resources to help you understand your rights and options as a homebuyer.",
  },
]

const STORAGE_KEY = "mortgage-resources"

export function useResources() {
  const [resources, setResources] = useState<Resource[]>(defaultResources)

  useEffect(() => {
    try {
      const storedResources = localStorage.getItem(STORAGE_KEY)
      if (storedResources) {
        setResources(JSON.parse(storedResources))
      }
    } catch (error) {
      console.error("Failed to load resources from localStorage", error)
      setResources(defaultResources)
    }
  }, [])

  const saveResources = (newResources: Resource[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newResources))
      setResources(newResources)
    } catch (error) {
      console.error("Failed to save resources to localStorage", error)
    }
  }

  return { resources, saveResources }
}
