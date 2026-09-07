import Link from "next/link";
import type { Metadata } from "next";
import {
  HUB_VERSION,
  SERVICES,
  CHANGELOG,
  overallStatus,
  statusLabel,
  type ServiceStatus,
} from "@/lib/hub-meta";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Status · Writz Hub",
  description: "Live status for Writz Hub loader, CDN, website and Discord.",
};

export default function StatusPage() {
  const overall = overallStatus();
  const latest = CHANGELOG[0];

  return (
    <div className="relative min-h-svh bg-bg text-fg">
      <div className="noise-overlay" />
      <header className="relative z-10 border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-fg text-[11px] font-semibold text-accent-fg">
              W
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight">Writz Hub</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-fg"
          >
            ← Back home
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">Status</p>
        <h1 className="font-display mt-3 text-[clamp(1.8rem,5vw,2.8rem)] font-semibold tracking-tight">
          System status
        </h1>
        <p className="mt-3 text-sm text-muted md:text-base">
          Current availability of Writz Hub services. Version{" "}
          <span className="font-mono text-fg">v{HUB_VERSION}</span>.
        </p>

        <div className="glass-strong mt-10 rounded-xl p-5 md:p-6">
          <div className="flex items-center gap-3">
            <StatusDot status={overall} large />
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">
                {overall === "operational"
                  ? "All systems operational"
                  : overall === "degraded"
                    ? "Partial degradation"
                    : "Service disruption"}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-faint">
                Updated just now · hub v{HUB_VERSION}
              </p>
            </div>
          </div>
        </div>

        <ul className="mt-6 space-y-2">
          {SERVICES.map((service) => (
            <li
              key={service.id}
              className="glass flex items-center gap-4 rounded-xl px-4 py-4 md:px-5"
            >
              <StatusDot status={service.status} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold tracking-tight">{service.name}</p>
                <p className="truncate text-[12px] text-muted">{service.description}</p>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-muted">
                {statusLabel(service.status)}
              </span>
            </li>
          ))}
        </ul>

        {latest ? (
          <section className="mt-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">Latest release</p>
            <div className="glass mt-4 rounded-xl p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-base font-semibold tracking-tight">v{latest.version}</h2>
                {latest.tag ? (
                  <span className="rounded-full bg-fg/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                    {latest.tag}
                  </span>
                ) : null}
                <time className="ml-auto font-mono text-[11px] text-faint">{latest.date}</time>
              </div>
              <ul className="mt-3 space-y-1.5">
                {latest.changes.map((c) => (
                  <li key={c} className="text-sm text-muted">
                    · {c}
                  </li>
                ))}
              </ul>
              <Link
                href="/#changelog"
                className="mt-4 inline-block text-sm text-fg underline-offset-4 hover:underline"
              >
                Full changelog →
              </Link>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function StatusDot({ status, large }: { status: ServiceStatus; large?: boolean }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full",
        large ? "size-3" : "size-2",
        status === "operational" && "bg-fg status-pulse",
        status === "degraded" && "bg-fg/50",
        status === "outage" && "bg-fg/25",
      )}
      aria-hidden
    />
  );
}
