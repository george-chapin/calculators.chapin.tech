"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/utils/format-currency"

const formSchema = z.object({
  mortgage: z.coerce.number().min(0),
  taxes: z.coerce.number().min(0),
  insurance: z.coerce.number().min(0),
  maintenance: z.coerce.number().min(0),
  otherFees: z.coerce.number().min(0),
  vacancyRate: z.coerce.number().min(0).max(100),
})

export function BreakEvenRentCalculator() {
  const [breakEvenRent, setBreakEvenRent] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mortgage: 1500,
      taxes: 300,
      insurance: 100,
      maintenance: 150,
      otherFees: 50,
      vacancyRate: 5,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const totalExpenses = values.mortgage + values.taxes + values.insurance + values.maintenance + values.otherFees
    const rent = totalExpenses / (1 - values.vacancyRate / 100)
    setBreakEvenRent(rent)
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Break-Even Rent Calculator</CardTitle>
        <CardDescription>Determine the minimum rent to cover your rental property's costs.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mortgage"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Monthly Mortgage</FormLabel>{" "}
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
                name="taxes"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Monthly Taxes</FormLabel>{" "}
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
                name="insurance"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Monthly Insurance</FormLabel>{" "}
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
                name="maintenance"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Monthly Maintenance</FormLabel>{" "}
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
                name="otherFees"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Other Monthly Fees</FormLabel>{" "}
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
                name="vacancyRate"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Vacancy Rate (%)</FormLabel>{" "}
                    <FormControl>
                      {" "}
                      <Input type="number" {...field} />{" "}
                    </FormControl>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Calculate Break-Even Rent
            </Button>
          </form>
        </Form>
        {breakEvenRent !== null && (
          <div className="mt-8 p-6 bg-muted rounded-lg text-center">
            <h3 className="text-lg font-semibold text-foreground">Break-Even Monthly Rent</h3>
            <p className="text-4xl font-bold text-primary mt-2">{formatCurrency(breakEvenRent)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              This is the minimum you must charge to cover all expenses.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
