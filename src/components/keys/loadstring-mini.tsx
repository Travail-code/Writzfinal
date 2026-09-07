"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { LOADSTRING } from "@/components/landing/download";

/**
 * Small "copy the loadstring" helper shared by the key pages.
 * Falls back to selecting the text when the clipboard API is blocked
 * (sandboxed iframes, insecure contexts).
 */
export function LoadstringMini() {
  const [state, setState] = useState<"idle" | "copied" | "blocked">("idle");
  const codeRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const selectText = () => {
    const el = codeRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const copy = async () => {
    let done = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(LOADSTRING);
        done = true;
      }
    } catch {
      done = false;
    }

    if (!done) {
      try {
        const area = document.createElement("textarea");
        area.value = LOADSTRING;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        done = document.execCommand("copy");
        area.remove();
      } catch {
        done = false;
      }
    }

    setState(done ? "copied" : "blocked");
    if (!done) window.requestAnimationFrame(selectText);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <div className="glass-strong relative overflow-hidden rounded-xl">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          <span className="status-pulse size-1 rounded-full bg-fg" aria-hidden />
          loadstring
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.12)] transition-[color,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-fg/5 hover:text-fg"
        >
          <span className="relative flex size-3 items-center justify-center">
            <Check
              className={
                "absolute size-3 transition duration-200 " +
                (state === "copied" ? "scale-100 opacity-100" : "scale-75 opacity-0")
              }
              aria-hidden
            />
            <Copy
              className={
                "absolute size-3 transition duration-200 " +
                (state === "copied" ? "scale-75 opacity-0" : "scale-100 opacity-100")
              }
              aria-hidden
            />
          </span>
          {state === "copied" ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="overflow-x-auto px-4 py-3 font-mono text-[11px] leading-5 text-fg md:text-[12px]">
        <code ref={codeRef} className="break-all">
          {LOADSTRING}
        </code>
      </pre>

      <p
        className={
          "border-t border-line px-4 py-2 font-mono text-[10px] transition-colors duration-200 " +
          (state === "blocked" ? "text-fg" : "text-faint")
        }
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
