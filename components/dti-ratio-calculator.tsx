"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const formSchema = z.object({
  grossMonthlyIncome: z.coerce.number().min(1, "Income must be greater than 0."),
  monthlyDebtPayments: z.coerce.number().min(0, "Debt payments cannot be negative."),
})

export function DtiRatioCalculator() {
  const [dtiRatio, setDtiRatio] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossMonthlyIncome: 6000,
      monthlyDebtPayments: 1800,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { grossMonthlyIncome, monthlyDebtPayments } = values
    setDtiRatio((monthlyDebtPayments / grossMonthlyIncome) * 100)
  }

  const getDtiFeedback = (ratio: number | null) => {
    if (ratio === null) return ""
    if (ratio <= 36) return "Looking good! Lenders generally view a DTI of 36% or less as favorable."
    if (ratio <= 43)
      return "Acceptable, but could be improved. This is often the highest DTI a borrower can have and still get a qualified mortgage."
    if (ratio <= 50) return "Cause for concern. You may have limited borrowing options."
    return "High risk. It may be difficult to obtain new credit."
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Debt-to-Income (DTI) Ratio Calculator</CardTitle>
        <CardDescription>Understand a key metric lenders use to evaluate your loan applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="grossMonthlyIncome"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Gross Monthly Income</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" placeholder="e.g., 6000" {...field} />{" "}
                  </FormControl>{" "}
                  <FormDescription>Your total income before taxes.</FormDescription> <FormMessage />{" "}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthlyDebtPayments"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Total Monthly Debt Payments</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" placeholder="e.g., 1800" {...field} />{" "}
                  </FormControl>{" "}
                  <FormDescription>
                    Includes mortgage/rent, car loans, student loans, credit cards, etc.
                  </FormDescription>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Calculate DTI Ratio
            </Button>
          </form>
        </Form>
        {dtiRatio !== null && (
          <div className="mt-8 p-6 bg-muted rounded-lg text-center">
            <h3 className="text-lg font-semibold text-foreground">Your DTI Ratio</h3>
            <p className="text-4xl font-bold text-primary mt-2">{dtiRatio.toFixed(2)}%</p>
            <p className="text-sm text-muted-foreground mt-2">{getDtiFeedback(dtiRatio)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
