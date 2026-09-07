import type { Metadata } from "next";
import { GlowButton } from "@/components/landing/glow-button";

export const metadata: Metadata = {
  title: "404 — page not found",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-bg px-5 text-center text-fg">
      <div className="noise-overlay" />
      <div
        className="perspective-floor absolute inset-x-[-20%] top-[48%] h-[70vh] opacity-60"
        aria-hidden="true"
      />

      <p className="relative z-10 font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
        error · runtime fault
      </p>

      <h1
        className="glitch-title font-display relative z-10 mt-4 text-[clamp(5rem,24vw,13rem)] font-bold leading-none tracking-[-0.05em]"
        data-text="404"
      >
        404
      </h1>

      <p className="relative z-10 mt-5 max-w-md text-sm leading-relaxed text-muted md:text-base">
        This page failed to inject. The script you are looking for doesn&apos;t
        exist — or it got patched.
      </p>

      <div className="relative z-10 mt-9">
        <GlowButton href="/">Back to the hub</GlowButton>
      </div>

      <p className="relative z-10 mt-7 font-mono text-[10px] tracking-wide text-faint">
        exit code 0x194 · module not found
      </p>
    </div>
  );
}
