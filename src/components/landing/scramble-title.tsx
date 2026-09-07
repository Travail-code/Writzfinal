"use client";

import { useEffect, useState } from "react";
import { useMounted, usePrefersReducedMotion } from "@/lib/hooks";

const SCRAMBLE_GLYPHS = "@#$%&<>/\\|01█▓▒░";

/**
 * Titre avec animation « décryptage » : les glyphes aléatoires se résolvent
 * lettre par lettre après le montage. Le texte final est rendu côté serveur,
 * donc il reste lisible sans JS et pour les crawlers.
 */
export function ScrambleTitle({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const mounted = useMounted();
  const reducedMotion = usePrefersReducedMotion();
  const [frame, setFrame] = useState<string | null>(null);

  const animate = mounted && !reducedMotion;
  // Valeur dérivée : pas de setState synchrone dans l'effet, et le texte
  // final est rendu tel quel côté serveur et en mouvement réduit.
  const shown = animate && frame !== null ? frame : text;

  useEffect(() => {
    if (!animate) return;

    const chars = text.split("");
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
      setFrame(next);
      if (done) window.clearInterval(id);
    }, 45);

    return () => window.clearInterval(id);
  }, [animate, text]);

  return (
    <h1 className={className} data-text={text} aria-label={text} style={style}>
      {/* Le contenu animé est masqué aux lecteurs d'écran : ils lisent
          `aria-label`, jamais la bouillie de glyphes intermédiaire. */}
      <span aria-hidden="true">{shown}</span>
    </h1>
  );
}
