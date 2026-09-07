import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AmbientBg } from "@/components/landing/ambient-bg";
import { GAMES } from "@/lib/games";

export const metadata: Metadata = {
  title: "Keys · Writz Hub",
  description: "Pick your game and get a key for Writz Hub scripts.",
};

export default function KeysPage() {
  return (
    <div className="relative min-h-svh bg-bg text-fg">
      <AmbientBg />
      <div className="noise-overlay" />

      <header className="relative z-10 border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-fg text-[11px] font-semibold text-accent-fg">
              W
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              Writz Hub
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-fg"
          >
            ← Back home
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
          Key system
        </p>
        <h1 className="font-display mt-3 text-[clamp(1.8rem,5vw,2.8rem)] font-semibold tracking-tight">
          Pick your game
        </h1>
        <p className="mt-3 max-w-lg text-sm text-muted md:text-base">
          Select a game to open its key page. One key per device — keys are
          delivered instantly.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {GAMES.map((game) => (
            <Link
              key={game.slug}
              href={`/key/${game.slug}`}
              className="group glass relative flex flex-col overflow-hidden rounded-xl p-4 transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:bg-fg/[0.06] hover:shadow-[0_0_0_1px_rgb(255_255_255_/_0.2),0_12px_40px_rgb(0_0_0_/_0.4)]"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-md bg-fg/10 font-display text-sm font-semibold shadow-[0_0_0_1px_rgb(255_255_255_/_0.12)] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110">
                  {game.name.charAt(0)}
                </span>
                <ArrowUpRight className="size-4 text-faint opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
              <h2 className="font-display mt-4 text-[15px] font-semibold leading-tight tracking-tight">
                {game.name}
              </h2>
              <p className="mt-1 font-mono text-[10px] text-faint">{game.tag}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Get key →
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-[11px] text-faint">
          key system · one key per device · instant delivery
        </p>
      </main>
    </div>
  );
}
