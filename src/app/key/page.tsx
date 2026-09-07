import type { Metadata } from "next";
import { AmbientBg } from "@/components/landing/ambient-bg";
import { KeysHeader } from "@/components/keys/keys-header";
import { KeysExplorer } from "@/components/keys/keys-explorer";
import { LoadstringMini } from "@/components/keys/loadstring-mini";
import { GAMES } from "@/lib/games";

export const metadata: Metadata = {
  title: "Keys",
  description:
    "Pick your game and get a key for Writz Hub scripts. One key per device, instant delivery, valid 24h.",
  alternates: { canonical: "/key" },
};

export default function KeysPage() {
  return (
    <div className="relative min-h-svh bg-bg text-fg">
      <AmbientBg />
      <div className="noise-overlay" />

      <div className="relative z-10">
        <KeysHeader backHref="/" backLabel="Back home" />

        <main className="mx-auto max-w-5xl px-5 pb-20 pt-12 md:px-8 md:pb-28 md:pt-16">
          <p
            className="keys-rise font-mono text-[11px] uppercase tracking-[0.22em] text-faint"
            style={{ animationDelay: "20ms" }}
          >
            Key system
          </p>
          <h1
            className="keys-rise font-display mt-3 text-[clamp(2rem,5.6vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.035em]"
            style={{ animationDelay: "70ms" }}
          >
            Pick your game
          </h1>
          <p
            className="keys-rise mt-3 max-w-lg text-sm leading-relaxed text-muted md:text-base"
            style={{ animationDelay: "120ms" }}
          >
            {GAMES.length} games supported. Select one to open its key page —
            one key per device, delivered instantly and valid 24h.
          </p>

          <KeysExplorer games={GAMES} />

          <div className="keys-rise mt-16 max-w-xl" style={{ animationDelay: "160ms" }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
              Already have a key?
            </p>
            <p className="mt-2 text-sm text-muted">
              The loadstring is the same for every game — the hub loads the right
              scripts for you.
            </p>
            <div className="mt-4">
              <LoadstringMini />
            </div>
          </div>

          <p className="mt-12 text-center font-mono text-[11px] text-faint">
            key system · one key per device · instant delivery
          </p>
        </main>
      </div>
    </div>
  );
}
