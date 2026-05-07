# AdForecast Mini

SaaS MVP qui prédit une plage CPA/ROAS avant le lancement d'une campagne Meta/TikTok.

## Setup Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Récupérer `Project URL` et `anon public key` dans Settings → API
3. Créer un fichier `.env.local` à la racine :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

4. Exécuter le SQL dans le Supabase SQL Editor :
   - Ouvrir `supabase/schema.sql`
   - Copier-coller le contenu dans l'éditeur
   - Exécuter

5. Activer Magic Link dans Authentication → Providers → Email

## Installation

```bash
npm install next@14 react react-dom @supabase/supabase-js @supabase/ssr zod clsx tailwind-merge class-variance-authority lucide-react
```

Packages exacts avec versions :

```bash
npm install next@14.2.0 react@18.3.0 react-dom@18.3.0 @supabase/supabase-js@2.44.0 @supabase/ssr@0.4.0 zod@3.23.0
npm install -D tailwindcss@3.4.0 postcss autoprefixer
npm install -D @types/node@20.0.0 @types/react@18.3.0 typescript@5.4.0
```

Installer Shadcn UI :

```bash
npx shadcn-ui@latest init -d
npx shadcn-ui@latest add button input label card badge separator toaster
```

## Lancement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Test API

```bash
curl -X POST http://localhost:3000/api/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 5000,
    "cpa_target": 35,
    "sector": "ecommerce",
    "duration_days": 14
  }'
```

Réponse attendue :

```json
{
  "cpa_min": 24.5,
  "cpa_max": 56.0,
  "roas_min": 1.89,
  "roas_max": 3.51,
  "risk_level": "low",
  "explanation": "Tes paramètres sont solides..."
}
```

## Brancher un vrai modèle ML

Dans `lib/forecast-engine.ts`, remplacer la fonction `calculateForecast()` :

```typescript
export async function calculateForecast(input: ForecastInput): Promise<ForecastOutput> {
  // Appel à ton API ML
  const response = await fetch('https://ton-ml-api.com/predict', {
    method: 'POST',
    body: JSON.stringify(input)
  })
  return response.json()
}
```

N'oublie pas d'ajouter `async` dans `route.ts` :

```typescript
const forecast = await calculateForecast(input)
```
