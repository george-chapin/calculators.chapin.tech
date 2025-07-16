"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Lightbulb } from "lucide-react"

export function UnsubscribeRateCalculator() {
  const [unsubscribes, setUnsubscribes] = useState("")
  const [emailsDelivered, setEmailsDelivered] = useState("")
  const [unsubscribeRate, setUnsubscribeRate] = useState<number | null>(null)

  const calculateUnsubscribeRate = () => {
    const numUnsubscribes = Number.parseFloat(unsubscribes)
    const delivered = Number.parseFloat(emailsDelivered)

    if (!isNaN(numUnsubscribes) && !isNaN(delivered) && delivered > 0) {
      setUnsubscribeRate((numUnsubscribes / delivered) * 100)
    } else {
      setUnsubscribeRate(null)
    }
  }

  const resetCalculator = () => {
    setUnsubscribes("")
    setEmailsDelivered("")
    setUnsubscribeRate(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unsubscribe Rate Calculator</CardTitle>
        <CardDescription>Measure the percentage of recipients who opted out of your email list.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="unsubscribes">Number of Unsubscribes</Label>
            <Input
              id="unsubscribes"
              type="number"
              value={unsubscribes}
              onChange={(e) => setUnsubscribes(e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <Label htmlFor="emailsDelivered-unsub">Number of Emails Delivered</Label>
            <Input
              id="emailsDelivered-unsub"
              type="number"
              value={emailsDelivered}
              onChange={(e) => setEmailsDelivered(e.target.value)}
              placeholder="e.g., 10000"
            />
          </div>
        </div>
        {unsubscribeRate !== null && (
          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Your Unsubscribe Rate is:</AlertTitle>
            <AlertDescription className="text-2xl font-bold">{unsubscribeRate.toFixed(2)}%</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={calculateUnsubscribeRate}>Calculate</Button>
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
                The percentage of recipients who opted out of your email list after receiving a specific email.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Formula</h4>
              <p className="text-sm text-muted-foreground italic">
                (Number of Unsubscribes / Number of Emails Delivered) × 100%
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Why It Matters</h4>
              <p className="text-sm text-muted-foreground">
                This is a critical list health metric. A sudden spike can indicate a mismatch between your content and
                your audience's expectations, or that you're emailing too frequently.
              </p>
            </div>
            <Alert variant="default">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Wendi's Insight</AlertTitle>
              <AlertDescription>
                Don't fear the unsubscribe. A rate of 0% is often a sign you aren't being bold enough with your offers
                or opinions. A small, steady unsubscribe rate ensures you're cleaning your list of unengaged people,
                which improves deliverability and overall engagement with the audience that does want to hear from you.
              </AlertDescription>
            </Alert>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
