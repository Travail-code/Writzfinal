"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Game } from "@/lib/games";
import { GameCard } from "./game-card";

export function OtherGames({ games }: { games: Game[] }) {
  if (games.length === 0) return null;

  const shown = games.slice(0, 8);

  return (
    <section className="mt-20 md:mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
            Keep going
          </p>
          <h2 className="font-display mt-2 text-[clamp(1.4rem,3.4vw,2rem)] font-semibold tracking-tight">
            Other games
          </h2>
        </div>
        <Link
          href="/key"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.1)] transition-[color,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-fg/5 hover:text-fg hover:shadow-[0_0_0_1px_rgb(255_255_255_/_0.22)]"
        >
          All games
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((game, index) => (
          <GameCard key={game.slug} game={game} index={index} compact />
        ))}
      </div>
    </section>
  );
}
