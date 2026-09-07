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

/** Copie via textarea hors écran + execCommand (fonctionne même sans focus document strict). */
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
  } catch (err) {
    console.warn("copyViaExecCommand a échoué:", err);
    return false;
  }
}

/**
 * Copie dans le presse-papier avec une cascade de secours :
 *
 *  1. `navigator.clipboard.writeText` (contexte sécurisé + focus + permission)
 *  2. `document.execCommand("copy")` via un textarea hors écran
 *  3. échec → l'appelant sélectionne le texte pour un Ctrl+C manuel
 *
 * Le focus du document est vérifié avant d'appeler la Clipboard API :
 * Chrome throw silencieusement "Document is not focused" sinon, ce qui
 * causait le besoin de cliquer plusieurs fois avant que ça fonctionne.
 */
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

      if (!document.hasFocus()) {
        window.focus();
      }

      let ok = false;

      if (document.hasFocus() && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          ok = true;
        } catch (err) {
          console.warn("clipboard.writeText a échoué, fallback execCommand:", err);
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
