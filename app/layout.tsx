import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AdForecast Mini - Prédis ton CPA/ROAS avant de dépenser",
  description: "Arrête de vendre des plans média au pif. Prédit une plage CPA/ROAS avant le lancement de ta campagne Meta/TikTok.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
