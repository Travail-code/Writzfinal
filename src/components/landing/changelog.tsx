import Link from "next/link";
import { CHANGELOG, HUB_VERSION } from "@/lib/hub-meta";
import { Reveal, WordReveal } from "./reveal";

export function Changelog() {
  return (
    <section id="changelog" className="relative z-10 mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">Changelog</p>
          </Reveal>
          <WordReveal
            text="What’s new in Writz Hub."
            className="font-display mt-4 max-w-xl text-[clamp(1.8rem,4.4vw,3rem)] font-semibold leading-[1.12] tracking-[-0.03em]"
          />
        </div>
        <Reveal delay={80}>
          <Link
            href="/status"
            className="inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 font-mono text-[11px] text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.1)] transition-colors hover:text-fg md:self-auto"
          >
            <span className="status-pulse size-1.5 rounded-full bg-fg" />
            v{HUB_VERSION} · all systems operational
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 space-y-3">
        {CHANGELOG.map((entry, i) => (
          <Reveal key={entry.version} delay={i * 60}>
            <article className="glass rounded-xl p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-2 gap-y-2">
                <h3 className="font-display text-lg font-semibold tracking-tight">v{entry.version}</h3>
                {entry.tag ? (
                  <span className="rounded-full bg-fg/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                    {entry.tag}
                  </span>
                ) : null}
                <time className="ml-auto font-mono text-[11px] text-faint">{entry.date}</time>
              </div>
              <ul className="mt-4 space-y-2">
                {entry.changes.map((change) => (
                  <li key={change} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-fg/40" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <p className="mt-8 text-center text-sm text-muted">
          Need live uptime?{" "}
          <Link href="/status" className="text-fg underline-offset-4 transition-colors hover:underline">
            Open status page
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
