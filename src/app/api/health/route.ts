import { HUB_VERSION } from "@/lib/hub-meta";

export const dynamic = "force-dynamic";

/**
 * Sonde de disponibilité. Utilisée par les monitors externes
 * (UptimeRobot, BetterStack…) et par la page /status.
 */
export function GET() {
  return Response.json(
    {
      ok: true,
      version: HUB_VERSION,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
