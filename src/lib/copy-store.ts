// Server-only, database-free copy counter.
// The temp file is the single source of truth (Next.js may load pages and
// route handlers as separate module instances, so module-level state is not
// shared). Shared by the API route and the home page (so the counter is
// server-rendered and always visible).
import { readFileSync, writeFileSync } from "node:fs";

const STORE_PATH = "/tmp/writz-hub-copies.json";

// Rate limiting: max N increments per IP per window (anti counter-spam).
const WINDOW_MS = 10_000;
const MAX_PER_WINDOW = 5;

type RateEntry = { count: number; resetAt: number };
const rateLimits = new Map<string, RateEntry>();

function readCount(): number {
  try {
    const parsed = JSON.parse(readFileSync(STORE_PATH, "utf8")) as {
      count?: unknown;
    };
    return typeof parsed.count === "number" && Number.isFinite(parsed.count)
      ? Math.max(0, Math.floor(parsed.count))
      : 0;
  } catch {
    return 0;
  }
}

// Next.js may load pages and route handlers as separate module instances,
// so module-level state is NOT shared between them. The file is therefore
// the single source of truth: it is read on every request.
function persistCount(count: number) {
  try {
    writeFileSync(STORE_PATH, JSON.stringify({ count }));
  } catch {
    // Best-effort persistence.
  }
}

export function getCount(): number {
  return readCount();
}

export function incrementCount(): number {
  const next = readCount() + 1;
  persistCount(next);
  return next;
}

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  // Keep the map bounded.
  if (rateLimits.size > 5000) {
    for (const [k, entry] of rateLimits) {
      if (now > entry.resetAt) rateLimits.delete(k);
    }
  }
  const entry = rateLimits.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}
