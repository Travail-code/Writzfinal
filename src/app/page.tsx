import { LandingPage } from "@/components/landing/landing-page";

// La page est entièrement statique : plus de `force-dynamic`.
// Elle était dynamique uniquement pour rendre le compteur de copies côté
// serveur — compteur supprimé, donc la home est désormais mise en cache
// par le CDN (TTFB quasi nul).
export default function Home() {
  return <LandingPage />;
}
