"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Lightbulb } from "lucide-react"

export function EmailOpenRateCalculator() {
  const [uniqueOpens, setUniqueOpens] = useState("")
  const [emailsDelivered, setEmailsDelivered] = useState("")
  const [openRate, setOpenRate] = useState<number | null>(null)

  const calculateOpenRate = () => {
    const opens = Number.parseFloat(uniqueOpens)
    const delivered = Number.parseFloat(emailsDelivered)

    if (!isNaN(opens) && !isNaN(delivered) && delivered > 0) {
      setOpenRate((opens / delivered) * 100)
    } else {
      setOpenRate(null)
    }
  }

  const resetCalculator = () => {
    setUniqueOpens("")
    setEmailsDelivered("")
    setOpenRate(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Open Rate Calculator</CardTitle>
        <CardDescription>Measure the percentage of recipients who opened your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="uniqueOpens">Number of Unique Opens</Label>
            <Input
              id="uniqueOpens"
              type="number"
              value={uniqueOpens}
              onChange={(e) => setUniqueOpens(e.target.value)}
              placeholder="e.g., 500"
            />
          </div>
          <div>
            <Label htmlFor="emailsDelivered">Number of Emails Delivered</Label>
            <Input
              id="emailsDelivered"
              type="number"
              value={emailsDelivered}
              onChange={(e) => setEmailsDelivered(e.target.value)}
              placeholder="e.g., 10000"
            />
            <p className="text-xs text-muted-foreground mt-1">Emails Sent - Bounced Emails</p>
          </div>
        </div>
        {openRate !== null && (
          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Your Email Open Rate is:</AlertTitle>
            <AlertDescription className="text-2xl font-bold">{openRate.toFixed(2)}%</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={calculateOpenRate}>Calculate</Button>
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
                The percentage of recipients who opened your email out of the total number of emails successfully
                delivered. It’s the first gatekeeper of your message's success.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Formula</h4>
              <p className="text-sm text-muted-foreground italic">
                (Number of Unique Opens / Number of Emails Delivered) × 100%
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Why It Matters</h4>
              <p className="text-sm text-muted-foreground">
                This is your primary indicator of how well your subject lines resonate with your audience and how much
                they trust your brand in their inbox. A low open rate means your subject line isn't compelling enough to
                earn the click.
              </p>
            </div>
            <Alert variant="default">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Wendi's Insight</AlertTitle>
              <AlertDescription>
                Be aware that Apple's Mail Privacy Protection (MPP) automatically "opens" emails for its users, which
                can artificially inflate this number. Treat it as a directional guide, but focus more on clicks as the
                true measure of initial engagement.
              </AlertDescription>
            </Alert>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
