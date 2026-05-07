"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

type ForecastResult = {
  cpa_min: number
  cpa_max: number
  roas_min: number
  roas_max: number
  risk_level: "low" | "medium" | "high"
  explanation: string
}

type ForecastInput = {
  budget: number
  cpa_target: number
  sector: "ecommerce" | "infoproduct" | "lead_gen_b2c"
  duration_days: number
}

const SECTORS = [
  { value: "ecommerce", label: "E-commerce" },
  { value: "infoproduct", label: "Info-produit" },
  { value: "lead_gen_b2c", label: "Lead Gen B2C" },
] as const

export default function ForecastForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ForecastResult | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<ForecastInput>({
    budget: 5000,
    cpa_target: 35,
    sector: "ecommerce",
    duration_days: 14,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erreur API")
      }

      const data = await response.json()
      setResult(data)
    } catch {
      toast({
        title: "Erreur",
        description: "Le serveur ne répond pas, réessaie dans 30 secondes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const riskColors = {
    low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    medium: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    high: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  const riskLabels = {
    low: "Risque faible",
    medium: "Risque moyen",
    high: "Risque élevé",
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Nouveau scénario</CardTitle>
          <CardDescription className="text-slate-400">
            Remplis les paramètres de ta future campagne
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-slate-300">
                  Budget total (€)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  min="100"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpa_target" className="text-slate-300">
                  CPA cible (€)
                </Label>
                <Input
                  id="cpa_target"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={formData.cpa_target}
                  onChange={(e) => setFormData({ ...formData, cpa_target: Number(e.target.value) })}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="sector" className="text-slate-300">
                  Secteur
                </Label>
                <select
                  id="sector"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value as ForecastInput["sector"] })}
                  className="w-full h-10 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                  required
                >
                  {SECTORS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_days" className="text-slate-300">
                  Durée (jours)
                </Label>
                <Input
                  id="duration_days"
                  type="number"
                  min="1"
                  max="90"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calcul en cours...
                </>
              ) : (
                "Générer le forecast"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="h-4 bg-slate-800 rounded animate-pulse" />
              <div className="h-4 bg-slate-800 rounded animate-pulse w-2/3" />
              <Separator className="bg-slate-800" />
              <div className="h-4 bg-slate-800 rounded animate-pulse w-1/2" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && !isLoading && (
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Résultat du forecast</CardTitle>
              <Badge className={riskColors[result.risk_level]}>
                {riskLabels[result.risk_level]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">CPA estimé</p>
                <p className="text-2xl font-bold text-white">
                  {result.cpa_min.toFixed(2)}€ – {result.cpa_max.toFixed(2)}€
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">ROAS estimé</p>
                <p className="text-2xl font-bold text-white">
                  {result.roas_min.toFixed(2)}x – {result.roas_max.toFixed(2)}x
                </p>
              </div>
            </div>

            <Separator className="bg-slate-800" />

            <p className="text-slate-300 text-sm leading-relaxed">{result.explanation}</p>

            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
              Sauvegarder ce scénario
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
