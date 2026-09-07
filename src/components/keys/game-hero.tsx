"use client";

import type { CSSProperties } from "react";
import { KeyRound, ShieldCheck, Timer, Fingerprint } from "lucide-react";
import type { Game } from "@/lib/games";
import { accentFor, featuresFromTag, initialsFor } from "@/lib/game-style";
import { GlowButton } from "@/components/landing/glow-button";

const GUARANTEES = [
  { icon: Fingerprint, label: "one key per device" },
  { icon: ShieldCheck, label: "instant delivery" },
  { icon: Timer, label: "valid 24h" },
];

export function GameHero({ game }: { game: Game }) {
  const accent = accentFor(game.slug);
  const features = featuresFromTag(game.tag);

  return (
    <div
      className="relative flex flex-col items-center text-center"
      style={
        {
          "--accent": accent.color,
          "--accent-soft": accent.soft,
          "--accent-ring": accent.ring,
        } as CSSProperties
      }
    >
      <p className="keys-rise font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
        key system · {game.slug}
      </p>

      {/* Monogram + rotating accent ring */}
      <div className="keys-rise relative mt-8" style={{ animationDelay: "60ms" }}>
        <span
          className="keys-hero-ring"
          style={{
            background: `conic-gradient(from 0deg, transparent 0 45%, ${accent.color} 60%, transparent 75% 100%)`,
          }}
          aria-hidden
        />
        <span
          className="keys-hero-mono grid place-items-center font-display text-3xl font-bold"
          style={{
            background: accent.soft,
            boxShadow: `0 0 0 1px ${accent.ring}, 0 18px 50px ${accent.wash}`,
            color: accent.color,
          }}
          aria-hidden
        >
          {initialsFor(game.name)}
        </span>
      </div>

      <h1
        className="keys-rise font-display mt-8 text-[clamp(2.1rem,6.5vw,3.8rem)] font-semibold leading-[1.03] tracking-[-0.035em]"
        style={{ animationDelay: "120ms" }}
      >
        {game.name}
      </h1>

      <div
        className="keys-rise mt-4 flex flex-wrap items-center justify-center gap-1.5"
        style={{ animationDelay: "180ms" }}
      >
        {features.map((feature) => (
          <span
            key={feature}
            className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.1)]"
          >
            {feature}
          </span>
        ))}
      </div>

      <div
        className="keys-panel keys-rise glass-strong mt-10 w-full max-w-md rounded-xl p-6 md:p-8"
        style={{ animationDelay: "240ms" }}
      >
        <span
          className="mx-auto grid size-12 place-items-center rounded-full"
          style={{ background: accent.soft, boxShadow: `0 0 0 1px ${accent.ring}` }}
          aria-hidden
        >
          <KeyRound className="size-5" style={{ color: accent.color }} />
        </span>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          Open the key page, complete the steps, and your key is delivered
          instantly. Then paste the loadstring into your executor.
        </p>

        <div className="mt-6 flex justify-center">
          <GlowButton
            href={game.keyUrl}
            target="_blank"
            rel="noreferrer"
            icon={<KeyRound className="size-4" />}
          >
            Get Key
          </GlowButton>
        </div>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-line pt-5">
          {GUARANTEES.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.label}
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint"
              >
                <Icon className="size-3" aria-hidden />
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
