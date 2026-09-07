"use client";

import { useEffect } from "react";
import { GlowButton } from "@/components/landing/glow-button";

/**
 * Frontière d'erreur de l'App Router. Sans ce fichier, une exception de
 * rendu affichait l'écran d'erreur générique de Next (page blanche en prod).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Writz Hub] Unhandled error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-bg px-5 text-center text-fg">
      <div className="noise-overlay" />
      <div
        className="perspective-floor absolute inset-x-[-20%] top-[48%] h-[70vh] opacity-60"
        aria-hidden="true"
      />

      <p className="relative z-10 font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
        error · execution halted
      </p>

      <h1
        className="glitch-title font-display relative z-10 mt-4 text-[clamp(3.5rem,16vw,9rem)] font-bold leading-none tracking-[-0.05em]"
        data-text="500"
      >
        500
      </h1>

      <p className="relative z-10 mt-5 max-w-md text-sm leading-relaxed text-muted md:text-base">
        Something threw on our side. The hub is still up — try again, or head
        back home.
      </p>

      <div className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-3">
        <GlowButton onClick={reset}>Try again</GlowButton>
        <GlowButton variant="ghost" href="/">
          Back to the hub
        </GlowButton>
      </div>

      {error.digest ? (
        <p className="relative z-10 mt-7 font-mono text-[10px] tracking-wide text-faint">
          digest {error.digest}
        </p>
      ) : null}
    </div>
  );
}
