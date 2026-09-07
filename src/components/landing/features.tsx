import { Gauge, Layers, RefreshCw, Shield, Terminal, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, WordReveal } from "./reveal";

const FEATURES: {
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Keyless",
    body: "Keyless bug only for the hub after you can found game have key system but not all.",
    icon: Shield,
  },
  {
    title: "Instant",
    body: "Fast hub, 0 lag, we update that",
    icon: Zap,
  },
  {
    title: "Universal",
    body: "We use our library system work on every game",
    icon: Layers,
  },
  {
    title: "Auto-update",
    body: "We update when we found a bug, add a game or add security",
    icon: RefreshCw,
  },
  {
    title: "Tuff UI",
    body: "Dark panel, classic theme, Small UI and rly cool",
    icon: Terminal,
  },
  {
    title: "Every exec",
    body: "Xeno, Solara, Delta, Wave, Swift, Codex. One loadstring, every runtime.",
    icon: Gauge,
  },
];

export function Features() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">Features</p>
      </Reveal>
      <WordReveal
        text="Everything a hub should be. Nothing more."
        className="font-display mt-4 max-w-2xl text-[clamp(1.8rem,4.4vw,3.1rem)] font-semibold leading-[1.12] tracking-[-0.03em]"
      />
      <Reveal delay={80}>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted md:text-base">
          Writz Hub is built for execution: fast, stable, and discreet enough to stay elegant.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <Reveal key={feature.title} delay={i * 70}>
              <article className="group glass relative h-full overflow-hidden rounded-xl p-6">
                <div className="mb-8 grid size-11 place-items-center rounded-md bg-fg/5 shadow-[0_0_0_1px_rgb(255_255_255_/_0.08)] transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06] group-hover:bg-fg/10 group-hover:shadow-[0_0_0_1px_rgb(255_255_255_/_0.18),0_0_24px_rgb(255_255_255_/_0.08)]">
                  <Icon className="size-4 text-fg transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-6" />
                </div>
                <h3 className="font-display text-lg font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.body}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
