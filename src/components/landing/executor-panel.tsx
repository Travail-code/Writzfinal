"use client";

import { useRef, useState } from "react";
import { Check, Copy, Trash2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { selectElementContents, useCopyToClipboard } from "@/lib/clipboard";
import { LOADSTRING } from "@/lib/site";

type Tab = "script" | "output";

/** Coloration légère du loadstring (aucune vraie syntaxe, juste du rendu). */
function highlightLua(code: string) {
  const re = /(loadstring|game:HttpGet|"[^"]*")/g;
  return code.split(re).map((part, i) => {
    let cls = "text-faint";
    if (part === "loadstring") cls = "text-fg";
    else if (part === "game:HttpGet") cls = "text-muted";
    else if (part.startsWith('"')) cls = "text-fg/75";
    return { key: i, text: part, cls };
  });
}

/**
 * Faux panneau d'exécuteur de la home : affiche le loadstring, permet de le
 * copier, et simule une sortie console. Pur affichage animé — pas de
 * console interactive, pas de commandes : uniquement du visuel.
 */
export function ExecutorPanel() {
  const [tab, setTab] = useState<Tab>("script");
  const [logs, setLogs] = useState<string[]>(["Ready."]);
  const [runId, setRunId] = useState(0);
  // Incrémenté à chaque changement d'onglet : relance l'animation d'entrée
  // du contenu (cascade, deblur) sans toucher au texte affiché.
  const [tabTick, setTabTick] = useState(0);
  const loadstringRef = useRef<HTMLSpanElement>(null);
  const { copied, copy } = useCopyToClipboard(1800);

  const switchTab = (next: Tab) => {
    if (next === tab) return;
    setTab(next);
    setTabTick((n) => n + 1);
  };

  const handleCopy = async () => {
    const ok = await copy(LOADSTRING);
    setRunId((n) => n + 1);

    if (!ok) {
      // Toutes les copies programmatiques ont été bloquées (fréquent dans
      // une iframe sandboxée) : on montre le script, on le sélectionne, et
      // l'utilisateur fait Ctrl+C.
      switchTab("script");
      window.requestAnimationFrame(() =>
        selectElementContents(loadstringRef.current),
      );
      setLogs([
        "Auto-copy blocked by the browser.",
        "Script selected — press Ctrl+C to copy.",
      ]);
      return;
    }

    switchTab("output");
    setLogs(["Copied to clipboard.", "Paste it into your executor."]);
  };

  return (
    <div className="executor-3d group relative overflow-hidden rounded-md bg-bg shadow-[0_0_0_1px_rgb(255_255_255_/_0.1),0_1px_0_0_rgb(255_255_255_/_0.06)_inset,0_28px_70px_rgb(0_0_0_/_0.5)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hover:[transform:rotateX(4deg)_rotateY(-6deg)_translateZ(12px)]">
      {/* Ligne lumineuse qui balaie la bordure supérieure (pur décor). */}
      <div className="executor-beam" aria-hidden="true" />

      {/* Header */}
      <div className="flex h-10 items-center justify-between gap-2 border-b border-line bg-white/[0.015] px-3 backdrop-blur-sm sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1.5 pr-1 sm:flex" aria-hidden="true">
            <span className="size-[7px] rounded-full bg-fg/20" />
            <span className="size-[7px] rounded-full bg-fg/15" />
            <span className="size-[7px] rounded-full bg-fg/10" />
          </div>
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
          <PanelTab active={tab === "script"} onSelect={() => switchTab("script")}>
            Script
          </PanelTab>
          <PanelTab active={tab === "output"} onSelect={() => switchTab("output")}>
            Output
          </PanelTab>
        </div>
      </div>

      {/* Body */}
      <div className="relative min-h-[132px] overflow-hidden border-b border-line bg-gradient-to-b from-white/[0.015] to-transparent sm:min-h-[144px]">
        {/* Voile « CRT » : scanline + vignette, purement décoratif. */}
        <div className="executor-crt" aria-hidden="true" />

        {tab === "script" ? (
          <div key={tabTick} className="code-reveal flex min-h-[132px] sm:min-h-[144px]">
            <div
              className="hidden select-none border-r border-line/70 bg-white/[0.01] px-2.5 py-3 text-right font-mono text-[11px] leading-6 text-faint/50 sm:block"
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
                {highlightLua(LOADSTRING).map((part) => (
                  <span key={part.key} className={part.cls}>
                    {part.text}
                  </span>
                ))}
              </span>
              <span
                className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-fg align-text-bottom"
                aria-hidden="true"
              />
            </pre>
          </div>
        ) : (
          <div
            key={tabTick}
            className="min-h-[132px] space-y-1 px-3 py-3 font-mono text-[11px] leading-5 text-muted sm:min-h-[144px] sm:px-4"
            role="status"
            aria-live="polite"
          >
            {logs.map((line, i) => (
              <div
                key={`${runId}-${line}-${i}`}
                className={`log-line ${i === logs.length - 1 ? "text-fg" : ""}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {line}
              </div>
            ))}
            <div
              className="log-line inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint"
              style={{ animationDelay: `${logs.length * 120 + 120}ms` }}
            >
              <span className="status-pulse size-1 rounded-full bg-fg" aria-hidden="true" />
              idle · v1.2
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-fg to-fg/90 px-5 text-[12px] font-medium text-accent-fg shadow-[0_1px_0_0_rgb(255_255_255_/_0.15)_inset,0_6px_16px_rgb(0_0_0_/_0.25)] transition duration-200 hover:opacity-90 hover:shadow-[0_1px_0_0_rgb(255_255_255_/_0.2)_inset,0_8px_20px_rgb(0_0_0_/_0.3)] active:scale-[0.96] sm:flex-none"
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
            switchTab("output");
          }}
          className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-[12px] font-medium text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.12)] transition duration-200 hover:bg-white/5 hover:text-fg active:scale-[0.96]"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          Clear
        </button>

        <a
          href="/loader.lua"
          download="loader.lua"
          className="ml-auto inline-flex h-9 items-center rounded-full px-3 font-mono text-[11px] text-faint underline decoration-transparent underline-offset-4 transition duration-200 hover:text-fg hover:decoration-current sm:px-4"
        >
          .lua ↘
        </a>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-line bg-white/[0.015] px-3 py-2 font-mono text-[10px] text-faint sm:px-4">
        <span className="flex items-center gap-2">
          <span className="status-pulse size-1 rounded-full bg-fg" aria-hidden="true" />
          keyless
        </span>
        <span className="hidden truncate sm:inline">Xeno · Solara · Delta · Wave</span>
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
      className={`relative rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors duration-200 sm:px-2.5 ${
        active ? "bg-white/[0.06] text-fg" : "text-faint hover:bg-white/[0.03] hover:text-muted"
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
