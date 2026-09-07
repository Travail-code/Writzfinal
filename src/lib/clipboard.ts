"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CopyState = "idle" | "copied" | "blocked";

export function selectElementContents(el: Element | null) {
  if (!el) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export function useCopyToClipboard(resetAfterMs = 2000) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      if (!text) {
        console.error("useCopyToClipboard: texte vide ou undefined reçu.");
        setState("blocked");
        return false;
      }

      let ok = false;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          ok = true;
        }
      } catch (err) {
        console.warn("clipboard.writeText a échoué, fallback execCommand:", err);
        ok = false;
      }

      if (!ok) {
        try {
          const area = document.createElement("textarea");
          area.value = text;
          area.setAttribute("readonly", "");
          area.contentEditable = "true";
          area.style.position = "fixed";
          area.style.top = "0";
          area.style.left = "-9999px";
          area.style.fontSize = "16px"; // évite le zoom auto sur iOS
          document.body.appendChild(area);

          area.focus();
          area.select();
          area.setSelectionRange(0, area.value.length); // requis sur iOS

          ok = document.execCommand("copy");
          document.body.removeChild(area);
        } catch (err) {
          console.warn("execCommand fallback a échoué:", err);
          ok = false;
        }
      }

      setState(ok ? "copied" : "blocked");
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setState("idle"), resetAfterMs);

      return ok;
    },
    [resetAfterMs],
  );

  return { state, copied: state === "copied", blocked: state === "blocked", copy };
}
