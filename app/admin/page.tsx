"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePmiRates } from "@/hooks/use-pmi-rates"
import { useResources, type Resource } from "@/hooks/use-resources"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { KeyRound, LogIn, Save, PlusCircle, Trash2 } from "lucide-react"

const ADMIN_PASSWORD = "Mortgage4187!"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const { toast } = useToast()

  // PMI Rates State
  const { rates, saveRates, creditScoreTiers, LTV_BRACKETS } = usePmiRates()
  const [editableRates, setEditableRates] = useState(rates)

  // Resources State
  const { resources, saveResources } = useResources()
  const [editableResources, setEditableResources] = useState<Resource[]>(resources)

  useEffect(() => {
    setEditableRates(rates)
  }, [rates])

  useEffect(() => {
    setEditableResources(resources)
  }, [resources])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      toast({ title: "Authentication successful." })
    } else {
      toast({ title: "Authentication failed.", variant: "destructive" })
    }
  }

  // PMI Handlers
  const handleRateChange = (score: string, ltv: string, value: string) => {
    const numericValue = Number.parseFloat(value)
    if (!isNaN(numericValue)) {
      setEditableRates((prev) => ({
        ...prev,
        [score]: {
          ...prev[score],
          [ltv]: numericValue,
        },
      }))
    }
  }

  const handleSavePmiChanges = () => {
    saveRates(editableRates)
    toast({ title: "Success!", description: "PMI rates have been updated." })
  }

  // Resource Handlers
  const handleResourceChange = (id: number, field: keyof Omit<Resource, "id">, value: string) => {
    setEditableResources((prev) => prev.map((res) => (res.id === id ? { ...res, [field]: value } : res)))
  }

  const handleAddResource = () => {
    setEditableResources((prev) => [...prev, { id: Date.now(), name: "", url: "", description: "" }])
  }

  const handleDeleteResource = (id: number) => {
    setEditableResources((prev) => prev.filter((res) => res.id !== id))
  }

  const handleSaveResourceChanges = () => {
    saveResources(editableResources)
    toast({ title: "Success!", description: "Resources have been updated." })
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound /> Admin Login
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Conventional PMI Rates (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Credit Score</TableHead>
                {LTV_BRACKETS.map((ltv) => (
                  <TableHead key={ltv} className="text-center">
                    LTV &gt; {ltv === "97" ? "95" : ltv === "95" ? "90" : ltv === "90" ? "85" : "80"}%
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditScoreTiers.map((tier) => (
                <TableRow key={tier.value}>
                  <TableCell className="font-medium">{tier.label}</TableCell>
                  {LTV_BRACKETS.map((ltv) => (
                    <TableCell key={ltv}>
                      <Input
                        type="number"
                        step="0.01"
                        className="text-center"
                        value={editableRates[tier.value]?.[ltv] || ""}
                        onChange={(e) => handleRateChange(tier.value, ltv, e.target.value)}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSavePmiChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save PMI Rates
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Suggested Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">Name</TableHead>
                <TableHead className="w-[30%]">URL</TableHead>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editableResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <Input
                      value={resource.name}
                      onChange={(e) => handleResourceChange(resource.id, "name", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={resource.url}
                      onChange={(e) => handleResourceChange(resource.id, "url", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={resource.description}
                      onChange={(e) => handleResourceChange(resource.id, "description", e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteResource(resource.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="outline" onClick={handleAddResource}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveResourceChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Resources
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
