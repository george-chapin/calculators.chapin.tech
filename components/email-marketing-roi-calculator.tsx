"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Lightbulb } from "lucide-react"

export function EmailMarketingROICalculator() {
  const [revenueGained, setRevenueGained] = useState("")
  const [campaignCost, setCampaignCost] = useState("")
  const [roi, setRoi] = useState<number | null>(null)

  const calculateROI = () => {
    const revenue = Number.parseFloat(revenueGained)
    const cost = Number.parseFloat(campaignCost)

    if (!isNaN(revenue) && !isNaN(cost) && cost > 0) {
      setRoi(((revenue - cost) / cost) * 100)
    } else {
      setRoi(null)
    }
  }

  const resetCalculator = () => {
    setRevenueGained("")
    setCampaignCost("")
    setRoi(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Marketing ROI Calculator</CardTitle>
        <CardDescription>Calculate the return on investment for your email marketing efforts.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="revenueGained">Revenue Gained from Campaign ($)</Label>
            <Input
              id="revenueGained"
              type="number"
              value={revenueGained}
              onChange={(e) => setRevenueGained(e.target.value)}
              placeholder="e.g., 5000"
            />
          </div>
          <div>
            <Label htmlFor="campaignCost">Total Campaign Cost ($)</Label>
            <Input
              id="campaignCost"
              type="number"
              value={campaignCost}
              onChange={(e) => setCampaignCost(e.target.value)}
              placeholder="e.g., 500"
            />
          </div>
        </div>
        {roi !== null && (
          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Your Email Marketing ROI is:</AlertTitle>
            <AlertDescription className="text-2xl font-bold">{roi.toFixed(2)}%</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={calculateROI}>Calculate</Button>
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
                The total return on investment for your email marketing efforts. This calculates the total revenue
                generated for every dollar spent on the campaign.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Formula</h4>
              <p className="text-sm text-muted-foreground italic">
                ((Revenue Gained - Campaign Cost) / Campaign Cost) × 100%
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Why It Matters</h4>
              <p className="text-sm text-muted-foreground">
                This is the ultimate bottom-line metric that proves the value of your marketing department to the
                C-suite. It answers the simple question: "Is this making us money?"
              </p>
            </div>
            <Alert variant="default">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Wendi's Insight</AlertTitle>
              <AlertDescription>
                When calculating "Campaign Cost," be sure to include not just the hard costs (i.e., your email platform
                subscription fee) but also the soft costs, like the man-hours spent on copywriting, design, and
                strategy. This gives you a true picture of the investment.
              </AlertDescription>
            </Alert>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
