import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Icône d'écran d'accueil iOS (Safari ne gère pas les favicons SVG). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f4f5",
          color: "#0a0a0a",
          fontSize: 104,
          fontWeight: 700,
        }}
      >
        W
      </div>
    ),
    size,
  );
}
