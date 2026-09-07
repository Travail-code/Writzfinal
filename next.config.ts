import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy
// - 'unsafe-inline' pour les scripts/styles reste requis par l'App Router
//   (scripts inline de flight-data + attributs style inline du design).
// - En développement, Turbopack/HMR a besoin de 'unsafe-eval' et d'une
//   websocket : sans ça le hot-reload est silencieusement bloqué.
//   L'ancien CSP s'appliquait tel quel en dev et cassait le HMR.
// - Les polices sont désormais auto-hébergées par next/font, donc
//   fonts.googleapis.com / fonts.gstatic.com ont été retirés.
// - Pas de X-Frame-Options / frame-ancestors : la plateforme de preview
//   embarque l'app dans une iframe, le framing doit rester autorisé.
const contentSecurityPolicy = [
  "default-src 'self'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), geolocation=(), microphone=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Ne pas annoncer la stack dans les en-têtes de réponse.
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Le loader Lua est téléchargé par les exécuteurs : il doit être
        // servi en text/plain et rester cacheable côté CDN.
        source: "/loader.lua",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=300, s-maxage=300" },
        ],
      },
    ];
  },
};

export default nextConfig;
