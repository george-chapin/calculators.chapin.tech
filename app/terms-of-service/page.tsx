import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Disclaimer</h2>
          <p>
            The calculations provided by our services are for informational and illustrative purposes only. They are not
            a substitute for professional financial advice. We do not guarantee the accuracy of any calculation.
          </p>
          <h2>2. Limitation of Liability</h2>
          <p>
            In no event will the Company, its affiliates, or their licensors, service providers, employees, agents,
            officers, or directors be liable for damages of any kind arising out of or in connection with your use of
            the services.
          </p>
          <h2>3. Governing Law</h2>
          <p>
            All matters relating to the services and these Terms of Service shall be governed by and construed in
            accordance with the internal laws of the State of California without giving effect to any choice or conflict
            of law provision or rule.
          </p>
          <p className="text-sm text-muted-foreground mt-6">Last Updated: {new Date().toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
