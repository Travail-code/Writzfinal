"use client";

import { AmbientBg } from "./ambient-bg";
import { Changelog } from "./changelog";
import { CustomCursor } from "./custom-cursor";
import { ExecutorMarquee } from "./marquee";
import { Features } from "./features";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { Nav } from "./nav";
import { Showcase } from "./showcase";
import { Stats } from "./stats";

export function LandingPage({
  initialCopies = 0,
}: {
  initialCopies?: number;
}) {
  return (
    <div className="relative min-h-svh bg-bg text-fg">
      <a
        href="#features"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>
      <CustomCursor />
      <AmbientBg />
      <div className="noise-overlay" />
      <Nav />
      <main>
        <Hero initialCopies={initialCopies} />
        <ExecutorMarquee />
        <Showcase />
        <Features />
        <Stats />
        <Changelog />
      </main>
      <Footer />
    </div>
  );
}
