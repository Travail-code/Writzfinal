import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — Roblox script hub`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Image Open Graph générée au build. C'est ce que Discord, X et Telegram
 * affichent quand on colle un lien du site.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #141416 0%, #0a0a0a 55%)",
          padding: "80px",
          color: "#f4f4f5",
        }}
      >
        {/* Bande lumineuse en haut (Satori ne gère pas bien les
            radial-gradient : on reste sur du linéaire). */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, rgba(244,244,245,0) 0%, rgba(244,244,245,0.85) 45%, rgba(244,244,245,0) 100%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#f4f4f5",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            W
          </div>
          <div style={{ fontSize: 30, letterSpacing: "0.24em", color: "#8b8b96" }}>
            SCRIPT HUB · 2026
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: "-0.04em" }}>
            {SITE_NAME}
          </div>
          <div style={{ fontSize: 34, color: "#a8a8b3", maxWidth: 900, lineHeight: 1.35 }}>
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 26, color: "#8b8b96" }}>
          <span>keyless</span>
          <span>·</span>
          <span>auto-update</span>
          <span>·</span>
          <span>Xeno / Solara / Delta / Wave</span>
        </div>
      </div>
    ),
    size,
  );
}
