import type { NextRequest } from "next/server";
import { getCount, incrementCount, isRateLimited } from "@/lib/copy-store";

export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

export function GET() {
  return Response.json({ count: getCount() });
}

export function POST(req: NextRequest) {
  // The request body is never read or parsed: there is no user input to
  // validate, store, or inject anywhere.
  if (isRateLimited(clientIp(req))) {
    return Response.json({ error: "too_many_requests" }, { status: 429 });
  }
  return Response.json({ count: incrementCount() });
}
