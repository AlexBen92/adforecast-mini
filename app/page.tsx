import ForecastForm from "@/components/forecast-form"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Arrête de vendre des plans média au pif.
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Prédis une plage CPA/ROAS réaliste avant de lancer ta prochaine campagne Meta ou TikTok.
          </p>
        </header>

        <ForecastForm />
      </div>
    </main>
  )
}
