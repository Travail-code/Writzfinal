import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Play, Search } from "lucide-react";
import { HUB_VERSION } from "@/lib/hub-meta";
import { useFinePointer, usePrefersReducedMotion, useIsMobile } from "./hooks";
import { cn } from "@/lib/utils";

const SCRIPTS = [
  { name: "Auto Farm", tag: "Universal", hot: true },
  { name: "ESP Box", tag: "Visual", hot: true },
  { name: "Speed", tag: "Player", hot: false },
  { name: "Teleport", tag: "Utility", hot: false },
  { name: "Hitbox", tag: "Combat", hot: true },
  { name: "Anti AFK", tag: "Utility", hot: false },
];

const NAV = ["Home", "Universal", "Blox Fruits", "Pet Sim", "Da Hood"];

export function HubMockup() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [activeNav, setActiveNav] = useState("Universal");
  const [running, setRunning] = useState("Auto Farm");

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || reduced || isMobile) return;

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      wrap.style.transform = `translate3d(0, ${mid * -0.06}px, 0)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, isMobile]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const inner = innerRef.current;
    if (!inner || !fine || reduced || isMobile) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    inner.style.transform = `rotateX(${-y * 7}deg) rotateY(${x * 9}deg)`;
  };

  const onLeave = () => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={wrapRef}
      className="tilt-target mx-auto max-w-4xl"
      style={{ perspective: "1200px" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={innerRef}
        className="glass-strong hub-scan relative overflow-hidden rounded-xl transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-2.5 rounded-full bg-fg/25" />
          <span className="size-2.5 rounded-full bg-fg/18" />
          <span className="size-2.5 rounded-full bg-fg/12" />
          <span className="ml-3 font-mono text-[11px] text-faint">
            writz-hub · v{HUB_VERSION}
          </span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
            <span className="live-blink size-1.5 rounded-full bg-fg" />
            Ready
          </span>
        </div>

        <div className="grid md:grid-cols-4">
          <aside className="hidden border-r border-line p-3 md:block">
            <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Library</p>
            <ul className="space-y-0.5">
              {NAV.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => setActiveNav(item)}
                    className={cn(
                      "flex w-full items-center rounded-md px-2.5 py-2 text-left text-[13px] transition-[background-color,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
                      activeNav === item ? "bg-fg/10 text-fg" : "text-muted hover:bg-fg/5 hover:text-fg",
                    )}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="p-4 md:col-span-3 md:p-5">
            <div className="flex items-center gap-2 rounded-md bg-bg/60 px-3 py-2 shadow-[0_0_0_1px_rgb(255_255_255_/_0.08)]">
              <Search className="size-3.5 text-faint" />
              <span className="font-mono text-xs text-faint">search scripts…</span>
              <span className="live-blink ml-0.5 inline-block h-3 w-px bg-fg/70" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SCRIPTS.map((script) => {
                const on = running === script.name;
                return (
                  <button
                    key={script.name}
                    type="button"
                    onClick={() => setRunning(script.name)}
                    className={cn(
                      "rounded-md p-3 text-left transition-[background-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]",
                      on
                        ? "bg-fg/10 shadow-[0_0_0_1px_rgb(255_255_255_/_0.2)]"
                        : "bg-fg/5 shadow-[0_0_0_1px_rgb(255_255_255_/_0.07)] hover:bg-fg/10",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-medium tracking-tight">{script.name}</span>
                      {script.hot ? (
                        <span className="rounded-full bg-fg/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted">
                          hot
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] text-faint">{script.tag}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-fg px-4 text-sm font-medium text-accent-fg transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_0_28px_rgb(255_255_255_/_0.18)] active:scale-[0.96]"
              >
                <Play className="size-3.5" />
                Execute {running}
              </button>
              <div className="flex-1">
                <div className="h-1.5 overflow-hidden rounded-full bg-fg/10">
                  <div className="bar-run h-full rounded-full bg-fg/80" />
                </div>
                <p className="mt-1.5 font-mono text-[10px] text-faint">
                  injecting · {running.toLowerCase().replace(" ", "_")}.lua
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
