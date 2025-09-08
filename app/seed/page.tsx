"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const seedDatabase = async () => {
    setIsSeeding(true)
    setResult(null)

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: 'admin123' }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ ${data.message}`)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Failed to seed database: ${error}`)
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Database Seeding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Click the button below to seed the database with sample property data.
          </p>
          
          <Button
            onClick={seedDatabase}
            disabled={isSeeding}
            className="w-full"
          >
            {isSeeding ? 'Seeding Database...' : 'Seed Database'}
          </Button>

          {result && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm">{result}</p>
            </div>
          )}

          <div className="mt-4 text-center">
            <a href="/" className="text-primary hover:underline">
              ← Back to Home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
