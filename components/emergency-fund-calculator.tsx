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
  monthlyExpenses: z.coerce.number().min(1, "Monthly expenses must be greater than 0."),
  monthsOfCoverage: z.coerce
    .number()
    .min(1, "Months of coverage must be at least 1.")
    .max(24, "Months of coverage cannot exceed 24."),
})

export function EmergencyFundCalculator() {
  const [targetFund, setTargetFund] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyExpenses: 5000,
      monthsOfCoverage: 6,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { monthlyExpenses, monthsOfCoverage } = values
    setTargetFund(monthlyExpenses * monthsOfCoverage)
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Emergency Fund Calculator</CardTitle>
        <CardDescription>Calculate the ideal size of your financial safety net.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="monthlyExpenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Monthly Expenses</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} />
                  </FormControl>
                  <FormDescription>Enter your total essential monthly living expenses.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthsOfCoverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Months of Coverage</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 6" {...field} />
                  </FormControl>
                  <FormDescription>How many months of expenses do you want to cover? (Typically 3-6)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Calculate
            </Button>
          </form>
        </Form>
        {targetFund !== null && (
          <div className="mt-8 p-6 bg-muted rounded-lg text-center">
            <h3 className="text-lg font-semibold text-foreground">Your Emergency Fund Goal</h3>
            <p className="text-4xl font-bold text-primary mt-2">{formatCurrency(targetFund)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              This is your target to cover {form.getValues("monthsOfCoverage")} months of expenses.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
