export type ForecastInput = {
  budget: number
  cpa_target: number
  sector: "ecommerce" | "infoproduct" | "lead_gen_b2c"
  duration_days: number
}

export type ForecastOutput = {
  cpa_min: number
  cpa_max: number
  roas_min: number
  roas_max: number
  risk_level: "low" | "medium" | "high"
  explanation: string
}

const SECTOR_VOLATILITY: Record<ForecastInput["sector"], number> = {
  ecommerce: 0.30,
  infoproduct: 0.40,
  lead_gen_b2c: 0.25,
}

const EXPLANATIONS = {
  low: "Tes paramètres sont solides. Budget suffisant et durée adequate pour lisser la variance algorithmique. La fourchette restelarge, mais tu as de la marge.",
  medium: "Setup classique. Le forecast te donne une plage realiste, mais prepare-toi a ajuster en cours de route. La premiere semaine sera decisive.",
  high: "Attention: budget trop juste ou duree trop courte. Tes resultats reels risquent d'etre tres eloignes de la cible. Monte le budget ou allonge la duree.",
}

export function calculateForecast(input: ForecastInput): ForecastOutput {
  const volatility = SECTOR_VOLATILITY[input.sector]

  const cpa_min = input.cpa_target * (1 - volatility)
  const cpa_max = input.cpa_target * (1 + volatility * 1.5)

  const estimatedConversions = (input.budget / input.cpa_target) * (1 - volatility * 0.5)
  const roas_base = input.budget / (input.cpa_target * Math.max(1, estimatedConversions))
  const roas_min = roas_base * 0.7
  const roas_max = roas_base * 1.3

  let risk_level: "low" | "medium" | "high"

  if (input.duration_days >= 14 && input.budget >= input.cpa_target * 50) {
    risk_level = "low"
  } else if (input.budget < input.cpa_target * 20 || input.duration_days < 7) {
    risk_level = "high"
  } else {
    risk_level = "medium"
  }

  return {
    cpa_min: Math.max(0, cpa_min),
    cpa_max: Math.max(0, cpa_max),
    roas_min: Math.max(0, roas_min),
    roas_max: Math.max(0, roas_max),
    risk_level,
    explanation: EXPLANATIONS[risk_level],
  }
}
