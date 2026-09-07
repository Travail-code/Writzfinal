"use client";

import {
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "glow" | "ghost";

type GlowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  icon?: ReactNode;
  download?: string | boolean;
  target?: string;
  rel?: string;
};

function spawnRipple(el: HTMLElement, clientX: number, clientY: number) {
  const rect = el.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = `${clientX - rect.left}px`;
  ripple.style.top = `${clientY - rect.top}px`;
  el.appendChild(ripple);
  const remove = () => ripple.remove();
  ripple.addEventListener("animationend", remove, { once: true });
  // Safety net: if `animationend` never fires (animations disabled, tab hidden…),
  // make sure the ripple element is still removed from the DOM.
  window.setTimeout(remove, 900);
}

const base =
  "btn-ripple inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium tracking-wide select-none " +
  "transition-[transform,background-color,color,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] " +
  "active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-accent-fg shadow-[0_0_0_1px_rgb(255_255_255_/_0.08),0_0_32px_rgb(255_255_255_/_0.12)] " +
    "hover:scale-[1.03] hover:shadow-[0_0_0_1px_rgb(255_255_255_/_0.16),0_0_48px_rgb(255_255_255_/_0.22)]",
  glow: "glow-border text-fg hover:scale-[1.03] hover:text-fg",
  ghost:
    "bg-transparent text-fg shadow-[0_0_0_1px_rgb(255_255_255_/_0.12)] hover:bg-fg/5 hover:shadow-[0_0_0_1px_rgb(255_255_255_/_0.22)]",
};

export function GlowButton({
  variant = "primary",
  href,
  icon,
  className,
  children,
  onClick,
  download,
  target,
  rel,
  type = "button",
  ...props
}: GlowButtonProps) {
  const ref = useRef<HTMLElement | null>(null);

  // Effet « magnétique » : le bouton glisse légèrement vers le curseur
  // (propriété `translate`, indépendante du transform utilisé par les
  // effets de scale). Souris uniquement — jamais sur tactile.
  const handlePointerMove = (e: PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.translate = `${(x - r.width / 2) * 0.1}px ${(y - r.height / 2) * 0.16}px`;
  };

  const handlePointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.translate = "0px 0px";
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    spawnRipple(e.currentTarget, e.clientX, e.clientY);
    onClick?.(e as MouseEvent<HTMLButtonElement>);
  };

  const classes = cn(base, variants[variant], className);
  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {icon ? <span className="relative z-10 -mr-0.5">{icon}</span> : null}
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as unknown as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        download={download}
        target={target}
        rel={rel}
        {...(props as unknown as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as unknown as React.Ref<HTMLButtonElement>}
      type={type}
      className={classes}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {content}
    </button>
  );
}
