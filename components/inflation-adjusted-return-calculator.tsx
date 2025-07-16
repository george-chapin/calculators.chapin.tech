"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const formSchema = z.object({
  initialInvestment: z.coerce.number().min(1, "Initial investment must be greater than 0."),
  finalValue: z.coerce.number().min(0, "Final value cannot be negative."),
  investmentPeriod: z.coerce.number().min(1, "Investment period must be at least 1 year."),
  inflationRate: z.coerce
    .number()
    .min(0, "Inflation rate cannot be negative.")
    .max(100, "Inflation rate seems too high."),
})

export function InflationAdjustedReturnCalculator() {
  const [results, setResults] = useState<{ nominalReturn: number; realReturn: number } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialInvestment: 10000,
      finalValue: 15000,
      investmentPeriod: 5,
      inflationRate: 3,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { initialInvestment, finalValue, investmentPeriod, inflationRate } = values
    const nominalReturn = (Math.pow(finalValue / initialInvestment, 1 / investmentPeriod) - 1) * 100
    const realReturn = ((1 + nominalReturn / 100) / (1 + inflationRate / 100) - 1) * 100
    setResults({ nominalReturn, realReturn })
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Inflation-Adjusted Return Calculator</CardTitle>
        <CardDescription>See the true return of your investment after accounting for inflation.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="initialInvestment"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Initial Investment ($)</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" {...field} />{" "}
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="finalValue"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Final Value ($)</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" {...field} />{" "}
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="investmentPeriod"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Investment Period (Years)</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" {...field} />{" "}
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inflationRate"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Average Annual Inflation Rate (%)</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" {...field} />{" "}
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Calculate
            </Button>
          </form>
        </Form>
        {results && (
          <div className="mt-8 space-y-4 text-center">
            <h3 className="text-lg font-semibold">Your Investment Returns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Nominal Annual Return</p>
                <p className="text-2xl font-bold">{results.nominalReturn.toFixed(2)}%</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary/80">Real Annual Return (After Inflation)</p>
                <p className="text-2xl font-bold text-primary">{results.realReturn.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
