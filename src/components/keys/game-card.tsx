"use client";

import Link from "next/link";
import { useRef, type CSSProperties, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Game } from "@/lib/games";
import { accentFor, featuresFromTag, initialsFor } from "@/lib/game-style";
import {
  useFinePointer,
  useIsMobile,
  usePrefersReducedMotion,
} from "@/components/landing/hooks";

export function GameCard({
  game,
  index,
  compact = false,
}: {
  game: Game;
  index: number;
  compact?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const accent = accentFor(game.slug);
  const features = featuresFromTag(game.tag);

  // 3D tilt follows the pointer, but only when it actually helps:
  // fine pointer, motion allowed, desktop viewport.
  const tiltEnabled = fine && !reduced && !isMobile;

  const onMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || !tiltEnabled) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-3px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };

  return (
    <div
      className="keys-card-enter"
      style={{ animationDelay: `${Math.min(index, 11) * 55}ms` }}
    >
      <Link
        ref={ref}
        href={`/key/${game.slug}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={
          {
            "--accent": accent.color,
            "--accent-soft": accent.soft,
            "--accent-ring": accent.ring,
          } as CSSProperties
        }
        className="game-card group relative"
      >
        <span className="game-card-sheen" aria-hidden />

        <div className="relative flex items-start justify-between gap-2">
          <span
            className="keys-mono grid place-items-center font-display font-semibold"
            style={{
              background: accent.soft,
              boxShadow: `0 0 0 1px ${accent.ring}`,
              color: accent.color,
            }}
            aria-hidden
          >
            {initialsFor(game.name)}
          </span>
          <span className="font-mono text-[10px] tabular-nums text-faint/70">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h2
          className={
            "font-display relative mt-4 font-semibold leading-tight tracking-tight " +
            (compact ? "text-[14px]" : "text-[15px]")
          }
        >
          {game.name}
        </h2>

        <div className="relative mt-2 flex flex-wrap gap-1">
          {features.map((feature) => (
            <span
              key={feature}
              className="rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.09)] transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:text-fg"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="relative mt-4 flex items-center justify-between gap-2 pt-1">
          <span
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: accent.color }}
          >
            Get key
            <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          <span
            className="keys-pulse size-1.5 shrink-0 rounded-full"
            style={{ background: accent.color }}
            aria-hidden
          />
        </div>
      </Link>
    </div>
  );
}
