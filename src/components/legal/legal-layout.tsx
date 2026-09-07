import type { ReactNode } from "react";
import Link from "next/link";
import { KeysHeader } from "@/components/keys/keys-header";

/**
 * Coquille commune aux pages légales (/legal, /privacy) :
 * en-tête, mise en page lisible, date de mise à jour.
 */
export function LegalLayout({
  eyebrow,
  title,
  updatedAt,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-svh bg-bg text-fg">
      <div className="noise-overlay" />

      <div className="relative z-10">
        <KeysHeader backHref="/" backLabel="Back home" />

        <main className="mx-auto max-w-3xl px-5 pb-24 pt-12 md:px-8 md:pb-32 md:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
            {eyebrow}
          </p>
          <h1 className="font-display mt-3 text-[clamp(1.9rem,5vw,3rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{intro}</p>
          <p className="mt-4 font-mono text-[11px] text-faint">
            Last updated: <time dateTime={updatedAt}>{updatedAt}</time>
          </p>

          <div className="mt-12 space-y-10">{children}</div>

          <div className="mt-16 border-t border-line pt-6">
            <p className="text-sm text-muted">
              Questions about this page?{" "}
              <Link href="/legal" className="text-fg underline-offset-4 hover:underline">
                Legal &amp; disclaimer
              </Link>{" "}
              ·{" "}
              <Link href="/privacy" className="text-fg underline-offset-4 hover:underline">
                Privacy
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="glass rounded-xl p-6 md:p-7">
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}
