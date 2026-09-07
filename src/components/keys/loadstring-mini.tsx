"use client";

import { useRef } from "react";
import { Check, Copy } from "lucide-react";
import { selectElementContents, useCopyToClipboard } from "@/lib/clipboard";
import { LOADSTRING } from "@/lib/site";

/**
 * Petit bloc « copier le loadstring » partagé par les pages de clés.
 * La cascade de secours (clipboard API → execCommand → sélection manuelle)
 * vit maintenant dans `useCopyToClipboard`, elle n'est plus dupliquée ici.
 */
export function LoadstringMini() {
  const codeRef = useRef<HTMLElement>(null);
  const { state, copied, copy } = useCopyToClipboard(2200);

  const handleCopy = async () => {
    const ok = await copy(LOADSTRING);
    if (!ok) window.requestAnimationFrame(() => selectElementContents(codeRef.current));
  };

  return (
    <div className="glass-strong relative overflow-hidden rounded-xl">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          <span className="status-pulse size-1 rounded-full bg-fg" aria-hidden="true" />
          loadstring
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.12)] transition-[color,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-fg/5 hover:text-fg"
        >
          <span className="relative flex size-3 items-center justify-center">
            <Check
              aria-hidden="true"
              className={`absolute size-3 transition duration-200 ${
                copied ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
            />
            <Copy
              aria-hidden="true"
              className={`absolute size-3 transition duration-200 ${
                copied ? "scale-75 opacity-0" : "scale-100 opacity-100"
              }`}
            />
          </span>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="overflow-x-auto px-4 py-3 font-mono text-[11px] leading-5 text-fg md:text-[12px]">
        <code ref={codeRef} className="break-all">
          {LOADSTRING}
        </code>
      </pre>

      <p
        className={`border-t border-line px-4 py-2 font-mono text-[10px] transition-colors duration-200 ${
          state === "blocked" ? "text-fg" : "text-faint"
        }`}
        role="status"
        aria-live="polite"
      >
        {state === "copied"
          ? "Copied — paste it into your executor."
          : state === "blocked"
            ? "Auto-copy blocked: the text is selected, press Ctrl+C."
            : "Same script for every game — the hub picks it up."}
      </p>
    </div>
  );
}
