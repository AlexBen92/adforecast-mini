import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: scenarios } = await supabase
    .from("scenarios")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  const riskColors = {
    low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    medium: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    high: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  const sectorLabels = {
    ecommerce: "E-commerce",
    infoproduct: "Info-produit",
    lead_gen_b2c: "Lead Gen B2C",
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Mes scénarios</h1>
            <p className="text-slate-400 mt-1">Historique de tes forecasts</p>
          </div>
          <Link href="/">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
              Nouveau scénario
            </button>
          </Link>
        </header>

        {!scenarios || scenarios.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardContent className="py-16 text-center">
              <p className="text-slate-400">Aucun scénario sauvegardé.</p>
              <Link href="/">
                <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm">
                  Créer mon premier forecast →
                </button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left p-4 text-slate-400 font-medium text-sm">Date</th>
                      <th className="text-left p-4 text-slate-400 font-medium text-sm">Secteur</th>
                      <th className="text-left p-4 text-slate-400 font-medium text-sm">Budget</th>
                      <th className="text-left p-4 text-slate-400 font-medium text-sm">CPA cible</th>
                      <th className="text-left p-4 text-slate-400 font-medium text-sm">Risque</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map((scenario) => {
                      const forecast = scenario.forecast_json as {
                        risk_level: "low" | "medium" | "high"
                      }
                      return (
                        <tr key={scenario.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                          <td className="p-4 text-slate-300 text-sm">
                            {new Date(scenario.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="p-4 text-slate-300 text-sm">
                            {sectorLabels[scenario.sector as keyof typeof sectorLabels]}
                          </td>
                          <td className="p-4 text-slate-300 text-sm">
                            {Number(scenario.budget).toLocaleString("fr-FR")}€
                          </td>
                          <td className="p-4 text-slate-300 text-sm">
                            {Number(scenario.cpa_target).toFixed(2)}€
                          </td>
                          <td className="p-4">
                            <Badge className={riskColors[forecast?.risk_level || "medium"]}>
                              {forecast?.risk_level === "low" && "Faible"}
                              {forecast?.risk_level === "medium" && "Moyen"}
                              {forecast?.risk_level === "high" && "Élevé"}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
