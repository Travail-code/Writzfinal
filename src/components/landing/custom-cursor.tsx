"use client";

import { useEffect, useRef } from "react";
import { useRichMotion } from "@/lib/hooks";

const TRAIL_SIZE = 6;

/**
 * Curseur personnalisé desktop : point précis, anneau qui s'élargit au
 * survol des éléments interactifs, et traînée de particules qui suit
 * avec un léger retard. Rien n'est rendu sur mobile / pointeur tactile.
 */
export function CustomCursor() {
  const richMotion = useRichMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!richMotion) {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }

    document.documentElement.classList.add("has-custom-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    const trail = Array.from({ length: TRAIL_SIZE }, () => ({ x: pos.x, y: pos.y }));
    let hovering = false;
    let raf = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const target = e.target;
      if (target instanceof Element) {
        hovering = Boolean(
          target.closest("a, button, [role='button'], input, textarea, .tilt-target"),
        );
      }
    };

    const tick = () => {
      if (!running) return;

      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;

      // Traînée : chaque particule poursuit la précédente.
      let fx = pos.x;
      let fy = pos.y;
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i];
        t.x += (fx - t.x) * 0.42;
        t.y += (fy - t.y) * 0.42;
        fx = t.x;
        fy = t.y;
        const el = trailRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0)`;
        }
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
        ringRef.current.classList.toggle("is-hover", hovering);
      }
      raf = requestAnimationFrame(tick);
    };

    // La boucle ne tourne pas en arrière-plan (batterie).
    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [richMotion]);

  if (!richMotion) return null;

  return (
    <>
      {Array.from({ length: TRAIL_SIZE }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="cursor-trail"
          style={{ opacity: 0.26 - i * 0.036 }}
          aria-hidden="true"
        />
      ))}
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
    </>
  );
}
