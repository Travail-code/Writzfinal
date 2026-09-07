import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// Polices auto-hébergées, avec les .woff2 versionnés dans `src/fonts`.
//
// Pourquoi pas `next/font/google` ? Parce qu'il télécharge les fontes
// pendant le build : une panne (ou un pare-feu) chez Google Fonts casse le
// déploiement. Pourquoi pas les <link> qu'on avait avant ? Parce qu'ils
// ajoutent 2 connexions tierces, du layout shift, et forcent le CSP à
// autoriser un domaine externe.
//
// Cette version cumule les avantages des deux : build 100 % hors-ligne,
// zéro requête tierce à l'exécution, préchargement et `size-adjust`
// automatiques par Next.
const syne = localFont({
  src: [
    { path: "../fonts/syne-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/syne-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/syne-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/syne-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-syne",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const plexSans = localFont({
  src: [
    { path: "../fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const plexMono = localFont({
  src: [
    { path: "../fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    // Chaque page n'a plus qu'à définir son propre titre court.
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Writz Hub",
    "Roblox script hub",
    "keyless loadstring",
    "Xeno",
    "Solara",
    "Delta",
    "Wave",
  ],
  alternates: { canonical: "/" },
  // Les icônes, le manifest et les images OG sont fournis par les
  // conventions de fichiers de l'App Router (icon.svg, apple-icon.tsx,
  // manifest.ts, opengraph-image.tsx) : Next les injecte tout seul.
  // Preview riche quand le lien est collé sur Discord / X / Telegram.
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
