import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AmbientBg } from "@/components/landing/ambient-bg";
import { KeysHeader } from "@/components/keys/keys-header";
import { GameHero } from "@/components/keys/game-hero";
import { LoadstringMini } from "@/components/keys/loadstring-mini";
import { OtherGames } from "@/components/keys/other-games";
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
    title: game ? `${game.name} · Keys` : "Key not found",
    description: game
      ? `Get your Writz Hub key for ${game.name} — ${game.tag}. One key per device, instant delivery, valid 24h.`
      : "This key page does not exist.",
    alternates: { canonical: game ? `/key/${game.slug}` : undefined },
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

  const others = GAMES.filter((entry) => entry.slug !== game.slug);

  return (
    <div className="relative flex min-h-svh flex-col bg-bg text-fg">
      <AmbientBg />
      <div className="noise-overlay" />

      <div className="relative z-10 flex flex-1 flex-col">
        <KeysHeader backHref="/key" backLabel="All games" />

        <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20 pt-14 md:px-8 md:pb-28 md:pt-20">
          <GameHero game={game} />

          <div className="keys-rise mt-8" style={{ animationDelay: "300ms" }}>
            <LoadstringMini />
          </div>

          <p
            className="keys-rise mt-8 text-center font-mono text-[11px] text-faint"
            style={{ animationDelay: "340ms" }}
          >
            one key per device · instant delivery · key valid 24h
          </p>

          <OtherGames games={others} />
        </main>
      </div>
    </div>
  );
}
