"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/utils/format-currency"

const formSchema = z.object({
  totalSavings: z.coerce.number().min(1, "Total savings must be greater than 0."),
  withdrawalRate: z.coerce.number().min(1).max(10).default(4),
})

export function RetirementWithdrawalCalculator() {
  const [results, setResults] = useState<{ annual: number; monthly: number } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalSavings: 1000000,
      withdrawalRate: 4,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const annualWithdrawal = values.totalSavings * (values.withdrawalRate / 100)
    const monthlyWithdrawal = annualWithdrawal / 12
    setResults({ annual: annualWithdrawal, monthly: monthlyWithdrawal })
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Retirement Withdrawal Calculator</CardTitle>
        <CardDescription>Estimate your sustainable retirement income based on the 4% rule.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="totalSavings"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Total Retirement Savings</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" placeholder="e.g., 1,000,000" {...field} />{" "}
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="withdrawalRate"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Annual Withdrawal Rate (%)</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" {...field} />{" "}
                  </FormControl>{" "}
                  <FormDescription>The 4% rule is a common starting point.</FormDescription> <FormMessage />{" "}
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Calculate Withdrawal
            </Button>
          </form>
        </Form>
        {results && (
          <div className="mt-8 space-y-4 text-center">
            <h3 className="text-lg font-semibold">Your Estimated Safe Withdrawal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Annual Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(results.annual)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Monthly Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(results.monthly)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
