import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { calculateForecast } from "@/lib/forecast-engine"
import { z } from "zod"

const forecastSchema = z.object({
  budget: z.number().min(100, "Le budget minimum est de 100€"),
  cpa_target: z.number().min(0.5, "Le CPA cible minimum est de 0.50€"),
  sector: z.enum(["ecommerce", "infoproduct", "lead_gen_b2c"]),
  duration_days: z.number().min(1).max(90),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = forecastSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const input = validation.data
    const forecast = calculateForecast(input)

    const supabase = await createServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    await supabase.from("scenarios").insert({
      user_id: session?.user.id || null,
      budget: input.budget,
      cpa_target: input.cpa_target,
      sector: input.sector,
      duration_days: input.duration_days,
      forecast_json: forecast,
    })

    return NextResponse.json(forecast)
  } catch (error) {
    console.error("Forecast error:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Méthode non autorisée" },
    { status: 405 }
  )
}
