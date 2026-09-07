"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function KeysHeader({
  backHref,
  backLabel,
}: {
  backHref: string;
  backLabel: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
        scrolled
          ? "border-line bg-bg/80 shadow-[0_10px_30px_rgb(0_0_0/_0.35)] backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 md:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-md bg-fg text-[11px] font-semibold text-accent-fg transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105">
            W
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Writz Hub
          </span>
        </Link>

        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted shadow-[0_0_0_1px_rgb(255_255_255_/_0.1)] transition-[color,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-fg/5 hover:text-fg hover:shadow-[0_0_0_1px_rgb(255_255_255_/_0.22)]"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-0.5" />
          {backLabel}
        </Link>
      </div>
    </header>
  );
}
