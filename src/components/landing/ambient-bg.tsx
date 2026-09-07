"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, usePrefersReducedMotion, useIsMobile } from "@/lib/hooks";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
};

const LINK_DISTANCE = 110;

/**
 * Fond animé : grille perspective, particules qui dérivent et se relient
 * en constellation, halo qui suit la souris avec inertie. Désactivé en
 * mouvement réduit et sur mobile (sauf halo statique).
 */
export function AmbientBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const isMobile = useIsMobile();

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || !fine || isMobile) return;
    const onMove = (e: PointerEvent) => {
      glow.style.setProperty("--mx", `${e.clientX}px`);
      glow.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced || isMobile) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mouse = { x: -9999, y: -9999 };
    // Le halo ne saute plus d'un pixel : il est lissé dans la boucle.
    const glow = { x: window.innerWidth / 2, y: window.innerHeight * 0.3 };
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;

    const countForWidth = () => {
      if (window.innerWidth < 640) return 26;
      if (window.innerWidth < 1024) return 44;
      return 68;
    };

    const spawn = () => {
      const n = countForWidth();
      particles = Array.from({ length: n }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 0.6 + Math.random() * 1.4,
        a: 0.12 + Math.random() * 0.28,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const tick = () => {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Halo suiveur lissé (légère traînée derrière le curseur).
      glow.x += (mouse.x - glow.x) * 0.09;
      glow.y += (mouse.y - glow.y) * 0.09;

      // 1) Physique des particules.
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 140) {
          const f = ((140 - dist) / 140) * 0.035;
          p.vx += (dx / dist) * f;
          p.vy += (dy / dist) * f;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      // 2) Liens de constellation entre particules proches.
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK_DISTANCE) continue;
          const alpha = (1 - d / LINK_DISTANCE) * 0.1;
          ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // 3) Les particules elles-mêmes.
      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (glowRef.current) {
        glowRef.current.style.setProperty("--mx", `${glow.x}px`);
        glowRef.current.style.setProperty("--my", `${glow.y}px`);
      }

      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, isMobile]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-bg" />
      <div
        className="absolute left-1/2 top-[-12%] h-[52vh] w-[78vw] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgb(255 255 255 / 0.07), transparent 68%)",
        }}
      />
      <div className="perspective-floor absolute inset-x-[-20%] top-[38%] h-[90vh]" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        ref={glowRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgb(255 255 255 / 0.045), transparent 42%)",
        }}
      />
    </div>
  );
}
