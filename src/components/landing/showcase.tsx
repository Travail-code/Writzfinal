import { HubMockup } from "./hub-mockup";
import { Reveal, WordReveal } from "./reveal";

export function Showcase() {
  return (
    <section id="showcase" className="relative z-10 mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">Preview</p>
        </Reveal>
        <WordReveal
          text="The hub, in action."
          className="font-display mt-4 text-[clamp(1.8rem,4.4vw,3.1rem)] font-semibold leading-[1.12] tracking-[-0.03em]"
        />
        <Reveal delay={80}>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            One panel, instant search, execute in one click. Hover the mockup for the 3D tilt.
          </p>
        </Reveal>
      </div>

      <div className="mt-14">
        <Reveal>
          <HubMockup />
        </Reveal>
      </div>
    </section>
  );
}
