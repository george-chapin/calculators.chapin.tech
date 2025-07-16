"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Lightbulb } from "lucide-react"

export function ClickThroughRateCalculator() {
  const [uniqueClicks, setUniqueClicks] = useState("")
  const [emailsDelivered, setEmailsDelivered] = useState("")
  const [ctr, setCtr] = useState<number | null>(null)

  const calculateCTR = () => {
    const clicks = Number.parseFloat(uniqueClicks)
    const delivered = Number.parseFloat(emailsDelivered)

    if (!isNaN(clicks) && !isNaN(delivered) && delivered > 0) {
      setCtr((clicks / delivered) * 100)
    } else {
      setCtr(null)
    }
  }

  const resetCalculator = () => {
    setUniqueClicks("")
    setEmailsDelivered("")
    setCtr(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Click-Through Rate (CTR) Calculator</CardTitle>
        <CardDescription>Measure the percentage of recipients who clicked a link in your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="uniqueClicks">Number of Unique Clicks</Label>
            <Input
              id="uniqueClicks"
              type="number"
              value={uniqueClicks}
              onChange={(e) => setUniqueClicks(e.target.value)}
              placeholder="e.g., 150"
            />
          </div>
          <div>
            <Label htmlFor="emailsDelivered-ctr">Number of Emails Delivered</Label>
            <Input
              id="emailsDelivered-ctr"
              type="number"
              value={emailsDelivered}
              onChange={(e) => setEmailsDelivered(e.target.value)}
              placeholder="e.g., 10000"
            />
          </div>
        </div>
        {ctr !== null && (
          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Your Click-Through Rate is:</AlertTitle>
            <AlertDescription className="text-2xl font-bold">{ctr.toFixed(2)}%</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={calculateCTR}>Calculate</Button>
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
                The percentage of recipients who clicked on at least one link within your email out of the total number
                of emails delivered.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Formula</h4>
              <p className="text-sm text-muted-foreground italic">
                (Number of Unique Clicks / Number of Emails Delivered) × 100%
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Why It Matters</h4>
              <p className="text-sm text-muted-foreground">
                This is a much stronger engagement signal than the open rate. CTR measures the effectiveness of your
                email's content, copy, and call-to-action (CTA). It answers the question: "Was my message compelling
                enough to make them act?"
              </p>
            </div>
            <Alert variant="default">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Wendi's Insight</AlertTitle>
              <AlertDescription>
                For a more granular view, savvy marketers also track the Click-to-Open Rate (CTOR), which is (Unique
                Clicks / Unique Opens) x 100. This tells you how effective your content was specifically for the
                audience that did open your email.
              </AlertDescription>
            </Alert>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
