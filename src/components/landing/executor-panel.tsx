"use client";

import { useRef, useState } from "react";
import { Check, Copy, Trash2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { selectElementContents, useCopyToClipboard } from "@/lib/clipboard";
import { LOADSTRING } from "@/lib/site";

type Tab = "editor" | "output";

/**
 * Faux panneau d'exécuteur de la home : affiche le loadstring, permet de le
 * copier, et simule une console de sortie. Extrait de `hero.tsx` qui faisait
 * 394 lignes.
 */
export function ExecutorPanel() {
  const [tab, setTab] = useState<Tab>("editor");
  const [logs, setLogs] = useState<string[]>(["Ready."]);
  const [runId, setRunId] = useState(0);
  const loadstringRef = useRef<HTMLSpanElement>(null);
  const { copied, copy } = useCopyToClipboard(1800);

  const handleCopy = async () => {
    const ok = await copy(LOADSTRING);
    setRunId((n) => n + 1);

    if (!ok) {
      // Toutes les copies programmatiques ont été bloquées (fréquent dans
      // une iframe sandboxée) : on montre le script, on le sélectionne, et
      // l'utilisateur fait Ctrl+C.
      setTab("editor");
      window.requestAnimationFrame(() =>
        selectElementContents(loadstringRef.current),
      );
      setLogs([
        "Auto-copy blocked by the browser.",
        "Script selected — press Ctrl+C to copy.",
      ]);
      return;
    }

    setTab("output");
    setLogs(["Copied to clipboard.", "Paste it into your executor."]);
  };

  return (
    <div
      className="executor-3d group relative overflow-hidden rounded-md bg-bg shadow-[0_0_0_1px_rgb(255_255_255_/_0.1),0_24px_60px_rgb(0_0_0_/_0.45)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hover:[transform:rotateX(4deg)_rotateY(-6deg)_translateZ(12px)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Header */}
      <div className="flex h-10 items-center justify-between gap-2 border-b border-line px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Logo className="executor-spin size-[22px] shrink-0 rounded-[5px] text-fg" />
          <span className="font-display text-[13px] font-semibold tracking-tight text-fg">
            Executor
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-faint sm:inline">
            Writz Hub
          </span>
        </div>
        <div
          className="flex shrink-0 items-center gap-0.5 sm:gap-1"
          role="tablist"
          aria-label="Executor panel"
        >
          <PanelTab active={tab === "editor"} onSelect={() => setTab("editor")}>
            Script
          </PanelTab>
          <PanelTab active={tab === "output"} onSelect={() => setTab("output")}>
            Output
          </PanelTab>
        </div>
      </div>

      {/* Body */}
      <div className="relative min-h-[120px] border-b border-line sm:min-h-[132px]">
        {tab === "editor" ? (
          <div className="flex min-h-[120px] sm:min-h-[132px]">
            <div
              className="hidden select-none border-r border-line px-2.5 py-3 text-right font-mono text-[11px] leading-6 text-faint/60 sm:block"
              aria-hidden="true"
            >
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
              <span
                className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-fg align-text-bottom"
                aria-hidden="true"
              />
            </pre>
          </div>
        ) : (
          <div
            className="min-h-[120px] space-y-1 px-3 py-3 font-mono text-[11px] leading-5 text-muted sm:min-h-[132px] sm:px-4"
            role="status"
            aria-live="polite"
          >
            {logs.map((line, i) => (
              <div
                key={`${runId}-${line}-${i}`}
                className={`log-line ${i === logs.length - 1 ? "text-fg" : ""}`}
                style={{ animationDelay: `${i * 90}ms` }}
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
          onClick={handleCopy}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-full bg-fg px-5 text-[12px] font-medium text-accent-fg transition duration-200 hover:opacity-90 active:scale-[0.96] sm:flex-none"
        >
          <span className="relative flex size-3.5 items-center justify-center">
            <Check
              aria-hidden="true"
              className={`absolute size-3.5 transition duration-200 ${
                copied ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
            />
            <Copy
              aria-hidden="true"
              className={`absolute size-3.5 transition duration-200 ${
                copied ? "scale-75 opacity-0" : "scale-100 opacity-100"
              }`}
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
          <Trash2 className="size-3.5" aria-hidden="true" />
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
          <span className="status-pulse size-1 rounded-full bg-fg" aria-hidden="true" />
          keyless
        </span>
        <span className="truncate">Xeno · Solara · Delta · Wave</span>
      </div>
    </div>
  );
}

function PanelTab({
  active,
  onSelect,
  children,
}: {
  active: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      className={`relative px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors duration-200 sm:px-2.5 ${
        active ? "text-fg" : "text-faint hover:text-muted"
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute inset-x-2 -bottom-0.5 h-px origin-left bg-fg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:inset-x-2.5 ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </button>
  );
}
