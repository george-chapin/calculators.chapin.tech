"use client"

import Link from "next/link"
import { useResources } from "@/hooks/use-resources"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Library, ExternalLink } from "lucide-react"

export default function SuggestedResourcesPage() {
  const { resources } = useResources()

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Library className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Suggested Resources for Home Buyers</CardTitle>
          </div>
          <p className="text-muted-foreground pt-2">
            A curated list of trusted websites for financial information, rate comparison, and expert advice.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Website</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-semibold">{resource.name}</TableCell>
                  <TableCell className="text-muted-foreground">{resource.description}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                        Visit Site <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
