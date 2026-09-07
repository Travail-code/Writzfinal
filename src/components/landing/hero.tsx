import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDownRight, Check, Copy, Trash2 } from "lucide-react";
import { GlowButton } from "./glow-button";
import { useMounted } from "./hooks";
import { LOADSTRING } from "./download";

const TITLE = "Writz Hub";
const SCRAMBLE_GLYPHS = "@#$%&<>/\\|01█▓▒░";

export function Hero({ initialCopies = 0 }: { initialCopies?: number }) {
  const mounted = useMounted();
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"editor" | "output">("editor");
  const [logs, setLogs] = useState<string[]>(["Ready."]);
  const [runId, setRunId] = useState(0);
  const copiedTimer = useRef<number | undefined>(undefined);
  // Server-rendered initial value: the counter is visible on first paint,
  // even before any client-side fetch resolves.
  const [copies, setCopies] = useState<number>(initialCopies);
  const [titleText, setTitleText] = useState(TITLE);
  const loadstringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  // Load the live copy counter once on mount.
  useEffect(() => {
    fetch("/api/copy")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: unknown) => {
        const count = (data as { count?: unknown } | null)?.count;
        if (typeof count === "number" && Number.isFinite(count)) {
          setCopies(count);
        }
      })
      .catch(() => {
        // Counter is decorative: fail silently.
      });
  }, []);

  // Decrypt-style scramble animation on the title after mount.
  useEffect(() => {
    if (!mounted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = TITLE.split("");
    const resolveAt = chars.map((char, i) =>
      char === " " ? 0 : 380 + i * 90 + Math.random() * 240,
    );
    const start = performance.now();
    const id = window.setInterval(() => {
      const elapsed = performance.now() - start;
      let done = true;
      const next = chars
        .map((char, i) => {
          if (char === " ") return " ";
          if (elapsed >= resolveAt[i]) return char;
          done = false;
          return SCRAMBLE_GLYPHS[
            Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)
          ];
        })
        .join("");
      setTitleText(next);
      if (done) window.clearInterval(id);
    }, 45);
    return () => window.clearInterval(id);
  }, [mounted]);

  // Register a copy on the server (rate-limited there) and refresh the count.
  const registerCopy = () => {
    fetch("/api/copy", { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: unknown) => {
        const count = (data as { count?: unknown } | null)?.count;
        if (typeof count === "number" && Number.isFinite(count)) {
          setCopies(count);
        }
      })
      .catch(() => {
        // Counter is decorative: fail silently.
      });
  };

  // Select the loadstring text displayed in the editor panel so a manual
  // Ctrl+C always works, even when every programmatic copy is blocked.
  const selectLoadstring = () => {
    const el = loadstringRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const copy = async () => {
    let method: "clipboard" | "fallback" | "blocked" = "blocked";

    // Method 1: modern clipboard API (needs a secure context + permission).
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(LOADSTRING);
        method = "clipboard";
      }
    } catch {
      method = "blocked";
    }

    // Method 2: legacy execCommand fallback (works in more contexts).
    if (method === "blocked") {
      try {
        const ta = document.createElement("textarea");
        ta.value = LOADSTRING;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        if (document.execCommand("copy")) method = "fallback";
        ta.remove();
      } catch {
        method = "blocked";
      }
    }

    setRunId((n) => n + 1);

    if (method === "blocked") {
      // Every programmatic copy was blocked (common in sandboxed iframes):
      // show the script, select it, and let the user press Ctrl+C.
      setTab("editor");
      window.requestAnimationFrame(selectLoadstring);
      setLogs([
        "Auto-copy blocked by the browser.",
        "Script selected — press Ctrl+C to copy.",
      ]);
      return;
    }

    registerCopy();
    setCopied(true);
    setTab("output");
    setLogs(["Copied to clipboard.", "Paste into your executor."]);
    window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      id="top"
      className="relative z-10 flex min-h-svh flex-col items-center justify-center px-4 pb-16 pt-24 text-center sm:px-5 sm:pb-20 sm:pt-28"
      style={{ perspective: "1200px" }}
    >
      <div className={cnReady(mounted)} style={{ transitionDelay: "40ms" }}>
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.1)]">
          <span className="status-pulse size-1.5 rounded-full bg-fg" />
          Script hub · 2026
        </span>
      </div>

      <h1
        className={cnReady(
          mounted,
          "glitch-title font-display mt-6 text-[clamp(2.6rem,11vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-fg sm:mt-8",
        )}
        data-text={TITLE}
        aria-label={TITLE}
        style={{ transitionDelay: "120ms" }}
      >
        {titleText}
      </h1>

      <div
        id="download"
        className={cnReady(mounted, "mx-auto mt-8 w-full max-w-[520px] text-left sm:mt-10")}
        style={{
          transitionDelay: "280ms",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="executor-3d group relative overflow-hidden rounded-md bg-bg shadow-[0_0_0_1px_rgb(255_255_255_/_0.1),0_24px_60px_rgb(0_0_0_/_0.45)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hover:[transform:rotateX(4deg)_rotateY(-6deg)_translateZ(12px)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Header */}
          <div className="flex h-10 items-center justify-between gap-2 border-b border-line px-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Image
                src="/logo.svg"
                alt="Writz Hub"
                width={22}
                height={22}
                className="executor-spin size-[22px] shrink-0 rounded-[5px]"
                unoptimized
              />
              <span className="font-display text-[13px] font-semibold tracking-tight text-fg">
                Executor
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-faint sm:inline">
                Writz Hub
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={() => setTab("editor")}
                className={
                  "relative px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors duration-200 sm:px-2.5 " +
                  (tab === "editor" ? "text-fg" : "text-faint hover:text-muted")
                }
              >
                Script
                <span
                  className={
                    "absolute inset-x-2 -bottom-0.5 h-px origin-left bg-fg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:inset-x-2.5 " +
                    (tab === "editor" ? "scale-x-100" : "scale-x-0")
                  }
                />
              </button>
              <button
                type="button"
                onClick={() => setTab("output")}
                className={
                  "relative px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors duration-200 sm:px-2.5 " +
                  (tab === "output" ? "text-fg" : "text-faint hover:text-muted")
                }
              >
                Output
                <span
                  className={
                    "absolute inset-x-2 -bottom-0.5 h-px origin-left bg-fg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:inset-x-2.5 " +
                    (tab === "output" ? "scale-x-100" : "scale-x-0")
                  }
                />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative min-h-[120px] border-b border-line sm:min-h-[132px]">
            {tab === "editor" ? (
              <div className="flex min-h-[120px] sm:min-h-[132px]">
                <div className="hidden select-none border-r border-line px-2.5 py-3 text-right font-mono text-[11px] leading-6 text-faint/50 sm:block">
                  <div>1</div>
                  <div>2</div>
                </div>
                <pre className="flex-1 overflow-x-auto px-3 py-3 font-mono text-[11px] leading-6 text-fg sm:text-[12px] md:text-[13px]">
                  <span
                    ref={loadstringRef}
                    className="select-all break-all sm:break-normal"
                  >
                    {LOADSTRING}
                  </span>
                  <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-fg align-text-bottom animate-pulse" />
                </pre>
              </div>
            ) : (
              <div className="min-h-[120px] space-y-1 px-3 py-3 font-mono text-[11px] leading-5 text-muted sm:min-h-[132px] sm:px-4">
                {logs.map((line, i) => (
                  <div
                    key={`${runId}-${line}-${i}`}
                    className={i === logs.length - 1 ? "text-fg" : ""}
                    style={{
                      opacity: 0,
                      animation: `fadeSlide 420ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms forwards`,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-3">
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-full bg-fg px-5 text-[12px] font-medium text-accent-fg transition duration-200 hover:opacity-90 active:scale-[0.96] sm:flex-none"
            >
              <span className="relative flex size-3.5 items-center justify-center">
                <Check
                  className={
                    "absolute size-3.5 transition duration-200 " +
                    (copied ? "scale-100 opacity-100" : "scale-75 opacity-0")
                  }
                />
                <Copy
                  className={
                    "absolute size-3.5 transition duration-200 " +
                    (copied ? "scale-75 opacity-0" : "scale-100 opacity-100")
                  }
                />
              </span>
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => {
                setRunId((n) => n + 1);
                setLogs(["Cleared."]);
                setTab("output");
              }}
              className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-[12px] font-medium text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.12)] transition duration-200 hover:text-fg active:scale-[0.96]"
            >
              <Trash2 className="size-3.5" />
              Clear
            </button>
            <a
              href="/loader.lua"
              download="loader.lua"
              className="ml-auto inline-flex h-9 items-center rounded-full px-3 font-mono text-[11px] text-faint transition duration-200 hover:text-fg sm:px-4"
            >
              .lua ↘
            </a>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2 font-mono text-[10px] text-faint sm:px-4">
            <span className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-fg status-pulse" />
              keyless
            </span>
            <span className="truncate">Xeno · Solara · Delta · Wave</span>
          </div>
        </div>

        <p className="mt-3 px-1 text-center font-mono text-[11px] text-faint">
          Copy the loadstring — paste it into your executor
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 font-mono text-[11px] text-faint">
          <span className="status-pulse size-1 rounded-full bg-fg" />
          {copies.toLocaleString("en-US")} copies · live
        </p>
      </div>

      <p
        className={cnReady(
          mounted,
          "mx-auto mt-7 max-w-xl text-sm leading-relaxed text-muted sm:mt-8 sm:text-base md:text-lg",
        )}
        style={{ transitionDelay: "380ms" }}
      >
        Run your scripts with surgical precision. Premium interface,
        instant load, compatible with every executor.
      </p>

      <div
        className={cnReady(mounted, "mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-8")}
        style={{ transitionDelay: "480ms" }}
      >
        <GlowButton variant="glow" href="#showcase" icon={<ArrowDownRight className="size-4" />}>
          View preview
        </GlowButton>
      </div>

      <p
        className={cnReady(mounted, "mt-7 font-mono text-[11px] tracking-wide text-faint sm:mt-8")}
        style={{ transitionDelay: "560ms" }}
      >
        loadstring · keyless · auto-update
      </p>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin3d {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        .executor-spin {
          animation: spin3d 4s linear infinite;
          transform-style: preserve-3d;
        }
        @media (prefers-reduced-motion: reduce) {
          .executor-spin { animation: none; }
        }
      `}</style>
    </section>
  );
}

function cnReady(mounted: boolean, extra = "") {
  return [
    "transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
    mounted ? "translate-y-0 opacity-100 blur-0" : "translate-y-4 opacity-0 blur-[4px]",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}
