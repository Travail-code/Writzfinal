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

/** Copie via textarea hors écran + execCommand (fonctionne même sans focus document). */
function copyViaExecCommand(text: string): boolean {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "-9999px";
    area.style.fontSize = "16px";
    document.body.appendChild(area);

    area.focus({ preventScroll: true });
    area.select();
    area.setSelectionRange(0, area.value.length);

    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export function useCopyToClipboard(resetAfterMs = 2000) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      if (!text) {
        console.error("useCopyToClipboard: texte vide reçu.");
        setState("blocked");
        return false;
      }

      // S'assure que la fenêtre a le focus AVANT de tenter la Clipboard API.
      // Sans ça, Chrome throw "Document is not focused" silencieusement.
      if (typeof window !== "undefined" && !document.hasFocus()) {
        window.focus();
      }

      let ok = false;

      // Si le document n'a toujours pas le focus, on saute direct au
      // fallback execCommand (plus tolérant, se base sur l'élément focus
      // qu'on crée nous-mêmes) au lieu de perdre un cycle sur writeText.
      if (document.hasFocus() && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          ok = true;
        } catch (err) {
          console.warn("clipboard.writeText a échoué:", err);
          ok = false;
        }
      }

      if (!ok) {
        ok = copyViaExecCommand(text);
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
