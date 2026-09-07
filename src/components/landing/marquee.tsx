type Executor = {
  name: string;
  mark: string;
};

const EXECUTORS: Executor[] = [
  { name: "Xeno", mark: "X" },
  { name: "Solara", mark: "S" },
  { name: "Delta", mark: "Δ" },
  { name: "Wave", mark: "W" },
  { name: "Swift", mark: "ƒ" },
  { name: "Codex", mark: "C" },
  { name: "Hydrogen", mark: "H" },
  { name: "Macsploit", mark: "M" },
  { name: "Arceus", mark: "A" },
  { name: "Fluxus", mark: "F" },
];

function Mark({ item }: { item: Executor }) {
  return (
    <div className="flex items-center gap-3 px-7">
      <span className="grid size-9 place-items-center rounded-md bg-fg/10 font-display text-sm font-semibold text-fg shadow-[0_0_0_1px_rgb(255_255_255_/_0.16)]">
        {item.mark}
      </span>
      <span className="font-display text-lg font-medium tracking-tight text-fg/80">{item.name}</span>
    </div>
  );
}

export function ExecutorMarquee() {
  const loop = [...EXECUTORS, ...EXECUTORS];

  return (
    <section aria-label="Compatible executors" className="relative z-10 py-8">
      <p className="mb-5 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
        Compatible executors
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent md:w-28" />
        <div className="marquee-track">
          <div className="flex items-center">
            {loop.map((item, i) => (
              <Mark key={`${item.name}-${i}`} item={item} />
            ))}
          </div>
          <div className="flex items-center" aria-hidden="true">
            {loop.map((item, i) => (
              <Mark key={`dup-${item.name}-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
