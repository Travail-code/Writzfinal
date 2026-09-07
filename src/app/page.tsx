import { LandingPage } from "@/components/landing/landing-page";
import { getCount } from "@/lib/copy-store";

// Rendered on every request so the live copy counter is always up to date
// and visible immediately (no client-side fetch needed for first paint).
export const dynamic = "force-dynamic";

export default function Home() {
  return <LandingPage initialCopies={getCount()} />;
}
