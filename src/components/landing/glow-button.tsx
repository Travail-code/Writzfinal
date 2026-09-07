"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
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
        href={href}
        className={classes}
        onClick={handleClick}
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
    <button type={type} className={classes} onClick={handleClick} {...props}>
      {content}
    </button>
  );
}
