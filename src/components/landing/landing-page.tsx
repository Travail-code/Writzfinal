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

export function LandingPage() {
  return (
    <div className="relative min-h-svh bg-bg text-fg">
      {/* Le lien d'évitement vise le <main> : il pointait avant sur
          #features, ce qui faisait sauter tout le hero — donc le bouton
          « Copy », qui est l'action principale du site. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>
      <CustomCursor />
      <AmbientBg />
      <div className="noise-overlay" />
      <Nav />
      <main id="main">
        <Hero />
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
