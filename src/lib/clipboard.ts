"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CopyState = "idle" | "copied" | "blocked";

/** Sélectionne le contenu d'un élément pour permettre un Ctrl+C manuel. */
export function selectElementContents(el: Element | null) {
  if (!el) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

/**
 * Copie dans le presse-papier avec une cascade de secours :
 *
 *  1. `navigator.clipboard.writeText` (contexte sécurisé + permission)
 *  2. `document.execCommand("copy")` via un textarea hors écran
 *  3. échec → l'appelant sélectionne le texte pour un Ctrl+C manuel
 *
 * Cette logique était dupliquée à l'identique dans `hero.tsx` et
 * `loadstring-mini.tsx` ; elle vit désormais à un seul endroit.
 */
export function useCopyToClipboard(resetAfterMs = 2000) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      let ok = false;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          ok = true;
        }
      } catch {
        ok = false;
      }

      if (!ok) {
        try {
          const area = document.createElement("textarea");
          area.value = text;
          area.setAttribute("readonly", "");
          area.style.position = "fixed";
          area.style.left = "-9999px";
          document.body.appendChild(area);
          area.select();
          ok = document.execCommand("copy");
          area.remove();
        } catch {
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
