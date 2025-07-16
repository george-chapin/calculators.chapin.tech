"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Lightbulb } from "lucide-react"

export function ConversionRateCalculator() {
  const [conversions, setConversions] = useState("")
  const [emailsDelivered, setEmailsDelivered] = useState("")
  const [conversionRate, setConversionRate] = useState<number | null>(null)

  const calculateConversionRate = () => {
    const numConversions = Number.parseFloat(conversions)
    const delivered = Number.parseFloat(emailsDelivered)

    if (!isNaN(numConversions) && !isNaN(delivered) && delivered > 0) {
      setConversionRate((numConversions / delivered) * 100)
    } else {
      setConversionRate(null)
    }
  }

  const resetCalculator = () => {
    setConversions("")
    setEmailsDelivered("")
    setConversionRate(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Rate Calculator</CardTitle>
        <CardDescription>Measure the percentage of recipients who completed a desired action.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="conversions">Number of Conversions</Label>
            <Input
              id="conversions"
              type="number"
              value={conversions}
              onChange={(e) => setConversions(e.target.value)}
              placeholder="e.g., 50"
            />
          </div>
          <div>
            <Label htmlFor="emailsDelivered-conv">Number of Emails Delivered</Label>
            <Input
              id="emailsDelivered-conv"
              type="number"
              value={emailsDelivered}
              onChange={(e) => setEmailsDelivered(e.target.value)}
              placeholder="e.g., 10000"
            />
          </div>
        </div>
        {conversionRate !== null && (
          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Your Conversion Rate is:</AlertTitle>
            <AlertDescription className="text-2xl font-bold">{conversionRate.toFixed(2)}%</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={calculateConversionRate}>Calculate</Button>
        <Button variant="ghost" onClick={resetCalculator}>
          Reset
        </Button>
      </CardFooter>
      <Accordion type="single" collapsible className="w-full px-6 pb-6">
        <AccordionItem value="item-1">
          <AccordionTrigger>Details & Insights</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Definition</h4>
              <p className="text-sm text-muted-foreground">
                The percentage of email recipients who completed a desired action as a result of the email campaign.
                This action could be making a purchase, filling out a lead form, or downloading a resource.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Formula</h4>
              <p className="text-sm text-muted-foreground italic">
                (Number of Conversions / Number of Emails Delivered) × 100%
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Why It Matters</h4>
              <p className="text-sm text-muted-foreground">
                This is the metric that ties directly to revenue and business objectives. While opens and clicks are
                nice, conversions are what pays the bills. A high conversion rate means you successfully targeted the
                right audience with the right offer.
              </p>
            </div>
            <Alert variant="default">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Wendi's Insight</AlertTitle>
              <AlertDescription>
                Accurate conversion tracking is non-negotiable. This relies on proper setup of tracking pixels or, more
                importantly, using UTM parameters in your email links so your analytics platform can correctly attribute
                success back to the specific campaign. It closes the loop on ROI.
              </AlertDescription>
            </Alert>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
