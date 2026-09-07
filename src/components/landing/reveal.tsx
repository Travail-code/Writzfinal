"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/hooks";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  // Observer partagé : un seul IntersectionObserver pour toutes les
  // instances de Reveal, au lieu d'un par composant.
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        inView ? "translate-y-0 opacity-100 blur-0" : "translate-y-6 opacity-0 blur-[4px]",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function WordReveal({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.3, rootMargin: "0px" });
  const shown = inView;

  return (
    <Tag ref={ref as never} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="mr-[0.28em] inline-block overflow-hidden align-bottom">
          <span
            className="inline-block transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              // Cascade légèrement irrégulière (i % 3) pour un rendu
              // moins « robotique » d'un mot à l'autre.
              transitionDelay: shown ? `${i * 64 + (i % 3) * 28}ms` : "0ms",
              opacity: shown ? 1 : 0,
              transformOrigin: "50% 100%",
              transform: shown ? "translateY(0) rotateX(0)" : "translateY(112%) rotateX(-28deg)",
              filter: shown ? "blur(0)" : "blur(6px)",
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
