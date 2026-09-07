"use client";

import { useEffect, useRef } from "react";
import { useRichMotion } from "@/lib/hooks";

const TRAIL_SIZE = 6;

// Référence de fréquence pour normaliser le lerp (60fps).
const BASE_FRAME_MS = 1000 / 60;

/** Lerp indépendant du framerate : le résultat est identique à 60fps, 120fps ou 144Hz. */
function lerpFactor(base: number, dt: number) {
  return 1 - Math.pow(1 - base, dt / BASE_FRAME_MS);
}

/**
 * Curseur personnalisé desktop : point précis, anneau qui s'élargit au
 * survol des éléments interactifs, et traînée de particules qui suit
 * avec un léger retard. Le point se contracte légèrement au clic, et
 * l'ensemble s'estompe proprement quand le pointeur quitte la fenêtre.
 * Rien n'est rendu sur mobile / pointeur tactile.
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
    let pressed = false;
    let scale = 1; // échelle lerp du point (effet de clic)
    let visible = false; // masqué tant qu'aucun mouvement n'est detecté
    let raf = 0;
    let running = true;
    let lastTime = performance.now();

    const setVisible = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      const opacity = next ? "1" : "0";
      if (dotRef.current) dotRef.current.style.opacity = opacity;
      if (ringRef.current) ringRef.current.style.opacity = opacity;
      for (const el of trailRefs.current) {
        if (el) el.style.opacity = next ? el.dataset.baseOpacity ?? "0.2" : "0";
      }
    };

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setVisible(true);
      const target = e.target;
      if (target instanceof Element) {
        hovering = Boolean(
          target.closest("a, button, [role='button'], input, textarea, .tilt-target"),
        );
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };

    const tick = (time: number) => {
      if (!running) return;

      // dt clampé pour éviter les sauts après un onglet en arrière-plan.
      const dt = Math.min(time - lastTime, 48);
      lastTime = time;

      const ringEase = lerpFactor(0.18, dt);
      const trailEase = lerpFactor(0.42, dt);
      const scaleEase = lerpFactor(0.3, dt);

      ring.x += (pos.x - ring.x) * ringEase;
      ring.y += (pos.y - ring.y) * ringEase;

      scale += ((pressed ? 0.72 : 1) - scale) * scaleEase;

      // Traînée : chaque particule poursuit la précédente.
      let fx = pos.x;
      let fy = pos.y;
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i];
        t.x += (fx - t.x) * trailEase;
        t.y += (fy - t.y) * trailEase;
        fx = t.x;
        fy = t.y;
        const el = trailRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0)`;
        }
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${scale})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
        ringRef.current.classList.toggle("is-hover", hovering);
        ringRef.current.classList.toggle("is-active", pressed);
      }

      raf = requestAnimationFrame(tick);
    };

    // La boucle ne tourne pas en arrière-plan (batterie).
    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        lastTime = performance.now();
        raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [richMotion]);

  if (!richMotion) return null;

  return (
    <>
      {Array.from({ length: TRAIL_SIZE }, (_, i) => {
        const baseOpacity = 0.26 - i * 0.036;
        return (
          <div
            key={i}
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
            className="cursor-trail"
            data-base-opacity={baseOpacity}
            style={{
              opacity: 0,
              transition: "opacity 200ms ease",
            }}
            aria-hidden="true"
          />
        );
      })}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{ opacity: 0, transition: "opacity 200ms ease" }}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{ opacity: 0, transition: "opacity 200ms ease" }}
        aria-hidden="true"
      />
    </>
  );
}
