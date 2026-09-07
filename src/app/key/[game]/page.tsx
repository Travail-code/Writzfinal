import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KeyRound, ArrowLeft } from "lucide-react";
import { AmbientBg } from "@/components/landing/ambient-bg";
import { GlowButton } from "@/components/landing/glow-button";
import { GAMES, getGame } from "@/lib/games";

export function generateStaticParams() {
  return GAMES.map((game) => ({ game: game.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ game: string }>;
}): Promise<Metadata> {
  const { game: slug } = await params;
  const game = getGame(slug);
  return {
    title: game ? `${game.name} · Keys · Writz Hub` : "Key not found · Writz Hub",
  };
}

export default async function GameKeyPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game: slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  return (
    <div className="relative flex min-h-svh flex-col bg-bg text-fg">
      <AmbientBg />
      <div className="noise-overlay" />

      <header className="relative z-10 border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-fg text-[11px] font-semibold text-accent-fg">
              W
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              Writz Hub
            </span>
          </Link>
          <Link
            href="/key"
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-3.5" />
            All games
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center md:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
          key system · {game.slug}
        </p>

        <h1 className="font-display mt-4 text-[clamp(2rem,6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          {game.name}
        </h1>
        <p className="mt-3 font-mono text-[12px] text-muted">{game.tag}</p>

        <div className="glass-strong mt-10 w-full max-w-md rounded-xl p-6 md:p-8">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-fg/10 shadow-[0_0_0_1px_rgb(255_255_255_/_0.12)]">
            <KeyRound className="size-5 text-fg" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Click the button below to open the key page. Complete the steps and
            your key will be delivered instantly.
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
        </div>

        <p className="mt-8 font-mono text-[11px] text-faint">
          one key per device · instant delivery · key valid 24h
        </p>
      </main>
    </div>
  );
}
