import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AcceptableUsePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Acceptable Use Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            This Acceptable Use Policy ("AUP") governs your use of our financial calculator services. By using our
            services, you agree to this AUP.
          </p>
          <h2>2. Prohibited Uses</h2>
          <p>You may not use our services:</p>
          <ul>
            <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material.</li>
            <li>To impersonate or attempt to impersonate the Company, a Company employee, or another user.</li>
            <li>
              To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the services.
            </li>
          </ul>
          <h2>3. Enforcement</h2>
          <p>We reserve the right to suspend or terminate your access to our services for any violation of this AUP.</p>
          <p className="text-sm text-muted-foreground mt-6">Last Updated: {new Date().toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
