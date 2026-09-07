"use client";

import { ArrowDownRight } from "lucide-react";
import { GlowButton } from "./glow-button";
import { ExecutorPanel } from "./executor-panel";
import { ScrambleTitle } from "./scramble-title";
import { useMounted } from "@/lib/hooks";

const TITLE = "Writz Hub";

function reveal(mounted: boolean, extra = "") {
  return [
    "transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
    mounted ? "translate-y-0 opacity-100 blur-0" : "translate-y-4 opacity-0 blur-[4px]",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Hero() {
  const mounted = useMounted();

  return (
    <section
      id="top"
      className="relative z-10 flex min-h-svh flex-col items-center justify-center px-4 pb-16 pt-24 text-center sm:px-5 sm:pb-20 sm:pt-28"
      style={{ perspective: "1200px" }}
    >
      <div className={reveal(mounted)} style={{ transitionDelay: "40ms" }}>
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.1)]">
          <span className="status-pulse size-1.5 rounded-full bg-fg" aria-hidden="true" />
          Script hub · 2026
        </span>
      </div>

      <ScrambleTitle
        text={TITLE}
        className={reveal(
          mounted,
          "glitch-title font-display mt-6 text-[clamp(2.6rem,11vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-fg sm:mt-8",
        )}
        style={{ transitionDelay: "120ms" }}
      />

      <div
        id="download"
        className={reveal(mounted, "mx-auto mt-8 w-full max-w-[520px] text-left sm:mt-10")}
        style={{ transitionDelay: "280ms", transformStyle: "preserve-3d" }}
      >
        <ExecutorPanel />

        <p className="mt-3 px-1 text-center font-mono text-[11px] text-faint">
          Copy the loadstring — paste it into your executor
        </p>
      </div>

      <p
        className={reveal(
          mounted,
          "mx-auto mt-7 max-w-xl text-sm leading-relaxed text-muted sm:mt-8 sm:text-base md:text-lg",
        )}
        style={{ transitionDelay: "380ms" }}
      >
        Run your scripts with surgical precision. Premium interface, instant
        load, compatible with every executor.
      </p>

      <div
        className={reveal(
          mounted,
          "mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-8",
        )}
        style={{ transitionDelay: "480ms" }}
      >
        <GlowButton
          variant="glow"
          href="#showcase"
          icon={<ArrowDownRight className="size-4" aria-hidden="true" />}
        >
          View preview
        </GlowButton>
      </div>

      <p
        className={reveal(
          mounted,
          "mt-7 font-mono text-[11px] tracking-wide text-faint sm:mt-8",
        )}
        style={{ transitionDelay: "560ms" }}
      >
        loadstring · keyless · auto-update
      </p>
    </section>
  );
}
