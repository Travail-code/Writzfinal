"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, KeyRound, Terminal, Zap } from "lucide-react";
import type { Game } from "@/lib/games";
import { featuresFromTag } from "@/lib/game-style";
import { GameCard } from "./game-card";

const STEPS = [
  {
    icon: Search,
    title: "Pick a game",
    body: "Search the library or filter by feature.",
  },
  {
    icon: KeyRound,
    title: "Grab your key",
    body: "One key per device, delivered instantly.",
  },
  {
    icon: Terminal,
    title: "Run the loadstring",
    body: "Paste it in your executor and play.",
  },
];

export function KeysExplorer({ games }: { games: Game[] }) {
  const [query, setQuery] = useState("");
  const [feature, setFeature] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only offer filters that actually narrow the list down.
  const filterOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const game of games) {
      for (const item of featuresFromTag(game.tag)) {
        counts.set(item, (counts.get(item) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name]) => name)
      .slice(0, 8);
  }, [games]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return games.filter((game) => {
      const matchesFeature =
        !feature || featuresFromTag(game.tag).includes(feature);
      const matchesQuery =
        !q ||
        game.name.toLowerCase().includes(q) ||
        game.slug.includes(q) ||
        game.tag.toLowerCase().includes(q);
      return matchesFeature && matchesQuery;
    });
  }, [games, query, feature]);

  // Changing the key remounts the grid, which replays the staggered entrance
  // without an extra render pass.
  const gridKey = `${query.trim().toLowerCase()}|${feature ?? "all"}`;

  // "/" or Ctrl/Cmd+K focuses the search field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing) {
        if (event.key === "Escape") {
          setQuery("");
          (target as HTMLElement).blur();
        }
        return;
      }
      if (event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key === "k")) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const reset = () => {
    setQuery("");
    setFeature(null);
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="keys-rise mt-10 md:mt-14">
        <div className="glass-strong relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3">
          <Search className="size-4 shrink-0 text-faint" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a game or a feature…"
            aria-label="Search games"
            className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-fg outline-none placeholder:text-faint/80 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="grid size-7 shrink-0 place-items-center rounded-full text-faint transition-colors duration-200 hover:bg-fg/10 hover:text-fg"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="hidden shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] text-faint shadow-[0_0_0_1px_rgb(255_255_255_/_0.12)] sm:block">
              /
            </kbd>
          )}
        </div>

        {filterOptions.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFeature(null)}
              className={
                "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-[color,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] " +
                (feature === null
                  ? "bg-fg text-accent-fg"
                  : "text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.1)] hover:bg-fg/5 hover:text-fg")
              }
            >
              All
            </button>
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFeature((current) => (current === option ? null : option))}
                className={
                  "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-[color,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] " +
                  (feature === option
                    ? "bg-fg text-accent-fg"
                    : "text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.1)] hover:bg-fg/5 hover:text-fg")
                }
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}

        <p
          className="mt-4 font-mono text-[11px] text-faint"
          role="status"
          aria-live="polite"
        >
          <Zap className="mr-1.5 inline size-3 align-[-2px]" aria-hidden />
          {filtered.length} / {games.length} games
        </p>
      </div>

      {filtered.length > 0 ? (
        <div
          key={gridKey}
          className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {filtered.map((game, index) => (
            <GameCard key={game.slug} game={game} index={index} />
          ))}
        </div>
      ) : (
        <div className="keys-card-enter glass mt-5 flex flex-col items-center rounded-xl px-6 py-14 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
            no match
          </p>
          <p className="font-display mt-3 text-xl font-semibold tracking-tight">
            Nothing found for “{query || feature}”
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Try another name, or reset the filters to see the whole library.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-full bg-fg px-5 text-[13px] font-medium text-accent-fg transition duration-200 hover:opacity-90 active:scale-[0.97]"
          >
            <X className="size-3.5" />
            Reset filters
          </button>
        </div>
      )}

      <ol className="keys-rise mt-14 grid gap-3 sm:grid-cols-3" style={{ animationDelay: "120ms" }}>
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="glass group relative overflow-hidden rounded-xl p-5 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgb(255_255_255_/_0.18),0_16px_40px_rgb(0_0_0/_0.4)]"
            >
              <span className="absolute right-4 top-3 font-display text-4xl font-bold text-fg/[0.06] transition-colors duration-300 group-hover:text-fg/10">
                {index + 1}
              </span>
              <span className="grid size-9 place-items-center rounded-md bg-fg/5 shadow-[0_0_0_1px_rgb(255_255_255_/_0.08)] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110">
                <Icon className="size-4" aria-hidden />
              </span>
              <p className="font-display mt-3 text-[15px] font-semibold tracking-tight">
                {step.title}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          );
        })}
      </ol>
    </>
  );
}
