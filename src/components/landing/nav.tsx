import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowButton } from "./glow-button";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#showcase", label: "Preview" },
  { href: "/key", label: "Keys" },
  { href: "#changelog", label: "Changelog" },
  { href: "/status", label: "Status" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div
        className={cn(
          "relative z-30 mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] md:px-8",
          scrolled && "glass-strong mx-4 mt-2 rounded-full md:mx-auto",
        )}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="" width={32} height={32} className="size-8 rounded-md" unoptimized />
          <span className="font-display text-[15px] font-semibold tracking-tight">Writz Hub</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {LINKS.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] text-muted transition-[color,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-fg"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-muted transition-[color,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-fg"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden md:block">
          <GlowButton href="#download" className="min-h-10 px-5 py-2 text-[13px]">
            Copy script
          </GlowButton>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full text-fg shadow-[0_0_0_1px_rgb(255_255_255_/_0.16)] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-20 bg-bg/92 backdrop-blur-xl transition-[opacity,visibility] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8" aria-label="Mobile">
          {LINKS.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl font-semibold tracking-tight"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl font-semibold tracking-tight"
              >
                {link.label}
              </Link>
            ),
          )}
          <GlowButton href="#download" onClick={() => setOpen(false)}>
            Copy script
          </GlowButton>
        </nav>
      </div>
    </header>
  );
}
