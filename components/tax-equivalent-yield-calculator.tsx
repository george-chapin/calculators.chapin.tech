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
  municipalBondYield: z.coerce.number().min(0).max(100),
  federalTaxRate: z.coerce.number().min(0).max(100),
  stateTaxRate: z.coerce.number().min(0).max(100),
})

export function TaxEquivalentYieldCalculator() {
  const [taxEquivalentYield, setTaxEquivalentYield] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      municipalBondYield: 3,
      federalTaxRate: 24,
      stateTaxRate: 5,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { municipalBondYield, federalTaxRate, stateTaxRate } = values
    const totalTaxRate = (federalTaxRate + stateTaxRate) / 100
    const tey = municipalBondYield / 100 / (1 - totalTaxRate)
    setTaxEquivalentYield(tey * 100)
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Tax-Equivalent Yield (TEY) Calculator</CardTitle>
        <CardDescription>Compare tax-free municipal bonds to taxable investments.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="municipalBondYield"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Municipal Bond Yield (%)</FormLabel>{" "}
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
              name="federalTaxRate"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Federal Tax Rate (%)</FormLabel>{" "}
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
              name="stateTaxRate"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>State Tax Rate (%)</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input type="number" {...field} />{" "}
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Calculate TEY
            </Button>
          </form>
        </Form>
        {taxEquivalentYield !== null && (
          <div className="mt-8 p-6 bg-muted rounded-lg text-center">
            <h3 className="text-lg font-semibold text-foreground">Tax-Equivalent Yield</h3>
            <p className="text-4xl font-bold text-primary mt-2">{taxEquivalentYield.toFixed(2)}%</p>
            <p className="text-sm text-muted-foreground mt-2">
              A taxable investment would need to yield this much to match your tax-free bond.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
