"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/utils/format-currency"
import { PlusCircle, Trash2 } from "lucide-react"

const itemSchema = z.object({
  name: z.string().min(1, "Name is required."),
  value: z.coerce.number().min(0, "Value cannot be negative."),
})

const formSchema = z.object({
  assets: z.array(itemSchema),
  liabilities: z.array(itemSchema),
})

export function NetWorthTracker() {
  const [netWorth, setNetWorth] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assets: [{ name: "Checking Account", value: 5000 }],
      liabilities: [{ name: "Credit Card Debt", value: 2000 }],
    },
  })

  const {
    fields: assetFields,
    append: appendAsset,
    remove: removeAsset,
  } = useFieldArray({ control: form.control, name: "assets" })
  const {
    fields: liabilityFields,
    append: appendLiability,
    remove: removeLiability,
  } = useFieldArray({ control: form.control, name: "liabilities" })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const totalAssets = values.assets.reduce((sum, asset) => sum + asset.value, 0)
    const totalLiabilities = values.liabilities.reduce((sum, liability) => sum + liability.value, 0)
    setNetWorth(totalAssets - totalLiabilities)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Net Worth Tracker</CardTitle>
        <CardDescription>Calculate your financial snapshot by listing your assets and liabilities.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assets (What you own)</h3>
              {assetFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`assets.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        {" "}
                        <FormLabel className={index !== 0 ? "sr-only" : ""}>Asset Name</FormLabel>{" "}
                        <FormControl>
                          {" "}
                          <Input placeholder="e.g., Savings" {...field} />{" "}
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`assets.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel className={index !== 0 ? "sr-only" : ""}>Value ($)</FormLabel>{" "}
                        <FormControl>
                          {" "}
                          <Input type="number" placeholder="e.g., 10000" {...field} />{" "}
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeAsset(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendAsset({ name: "", value: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Asset
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Liabilities (What you owe)</h3>
              {liabilityFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`liabilities.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        {" "}
                        <FormLabel className={index !== 0 ? "sr-only" : ""}>Liability Name</FormLabel>{" "}
                        <FormControl>
                          {" "}
                          <Input placeholder="e.g., Student Loan" {...field} />{" "}
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`liabilities.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel className={index !== 0 ? "sr-only" : ""}>Amount ($)</FormLabel>{" "}
                        <FormControl>
                          {" "}
                          <Input type="number" placeholder="e.g., 20000" {...field} />{" "}
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeLiability(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendLiability({ name: "", value: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Liability
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Calculate Net Worth
            </Button>
          </form>
        </Form>
        {netWorth !== null && (
          <div className="mt-8 p-6 bg-muted rounded-lg text-center">
            <h3 className="text-lg font-semibold text-foreground">Your Net Worth</h3>
            <p className={`text-4xl font-bold mt-2 ${netWorth >= 0 ? "text-primary" : "text-destructive"}`}>
              {formatCurrency(netWorth)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
