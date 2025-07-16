import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const changes = [
  {
    version: "1.5.0",
    date: "July 16, 2025",
    notes: [
      "Added Footer with links to Acceptable Use, Terms of Service, Contact, and Change Log pages.",
      "Created placeholder pages for new footer links.",
    ],
  },
  {
    version: "1.4.0",
    date: "July 16, 2025",
    notes: ["Added Property Address field to Mortgage Calculator.", "Implemented PDF generation for mortgage summary."],
  },
  {
    version: "1.3.0",
    date: "July 16, 2025",
    notes: [
      "Added loan payoff and sales tax options to Car Calculator.",
      "Included a visual trade-in equity/deficit card.",
    ],
  },
  {
    version: "1.2.0",
    date: "July 16, 2025",
    notes: [
      "Added Car Payment Calculator page.",
      "Added checkbox to toggle Mortgage Insurance on/off.",
      "Implemented main navigation header.",
    ],
  },
  {
    version: "1.1.0",
    date: "July 16, 2025",
    notes: [
      "Added password-protected Admin Panel to manage PMI rates.",
      "Refactored PMI rates into a custom hook with localStorage persistence.",
    ],
  },
  {
    version: "1.0.0",
    date: "July 16, 2025",
    notes: [
      "Initial release of the feature-rich Mortgage Calculator.",
      "Features include amortization table, shareable links, and loan type options (Conventional, FHA, VA).",
    ],
  },
]

export default function ChangeLogPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Change Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {changes.map((change) => (
            <div key={change.version} className="relative pl-6">
              <div className="absolute left-0 top-1 h-full w-px bg-border"></div>
              <div className="absolute left-[-0.3rem] top-1 h-3 w-3 rounded-full bg-primary"></div>
              <h2 className="text-2xl font-bold">Version {change.version}</h2>
              <p className="text-sm text-muted-foreground mb-2">{change.date}</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {change.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
