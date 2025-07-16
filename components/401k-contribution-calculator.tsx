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
  annualSalary: z.coerce.number().min(1, "Annual salary must be greater than 0."),
  contributionPercentage: z.coerce
    .number()
    .min(0, "Contribution cannot be negative.")
    .max(100, "Contribution cannot exceed 100%."),
  employerMatchPercentage: z.coerce.number().min(0, "Match cannot be negative.").max(100, "Match cannot exceed 100%."),
  matchLimitPercentage: z.coerce
    .number()
    .min(0, "Match limit cannot be negative.")
    .max(100, "Match limit cannot exceed 100%."),
})

export function K401ContributionCalculator() {
  const [results, setResults] = useState<{
    yourContribution: number
    employerMatch: number
    totalContribution: number
  } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annualSalary: 80000,
      contributionPercentage: 6,
      employerMatchPercentage: 50,
      matchLimitPercentage: 6,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { annualSalary, contributionPercentage, employerMatchPercentage, matchLimitPercentage } = values
    const yourContribution = annualSalary * (contributionPercentage / 100)
    const matchedContribution = Math.min(
      annualSalary * (contributionPercentage / 100),
      annualSalary * (matchLimitPercentage / 100),
    )
    const employerMatch = matchedContribution * (employerMatchPercentage / 100)
    const totalContribution = yourContribution + employerMatch
    setResults({ yourContribution, employerMatch, totalContribution })
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>401(k) Contribution & Match Calculator</CardTitle>
        <CardDescription>Maximize your retirement savings by understanding your employer's match.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="annualSalary"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Annual Salary</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" placeholder="e.g., 80000" {...field} />{" "}
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contributionPercentage"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Your Contribution (%)</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" placeholder="e.g., 6" {...field} />{" "}
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employerMatchPercentage"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Employer Match (%)</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" placeholder="e.g., 50" {...field} />{" "}
                  </FormControl>{" "}
                  <FormDescription>e.g., 50% match</FormDescription> <FormMessage />{" "}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="matchLimitPercentage"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Employer Match Limit (%)</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" placeholder="e.g., 6" {...field} />{" "}
                  </FormControl>{" "}
                  <FormDescription>e.g., up to 6% of your salary</FormDescription> <FormMessage />{" "}
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Calculate
            </Button>
          </form>
        </Form>
        {results && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-center">Annual Contribution Summary</h3>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span>Your Contribution:</span> <strong>{formatCurrency(results.yourContribution)}</strong>
              </div>
              <div className="flex justify-between mt-2">
                <span>Employer Match:</span> <strong>{formatCurrency(results.employerMatch)}</strong>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t font-bold text-lg">
                <span>Total Contribution:</span>{" "}
                <strong className="text-primary">{formatCurrency(results.totalContribution)}</strong>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
