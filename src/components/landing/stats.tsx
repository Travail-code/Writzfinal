import { useEffect, useRef, useState } from "react";
import { Reveal, WordReveal } from "./reveal";

const STATS = [
  { value: 17526, suffix: "+", label: "Users" },
  { value: 158, suffix: "", label: "Scripts" },
  { value: 1, suffix: "M", label: "execution", decimals: 1 },
  { value: 12, suffix: "", label: "Executors" },
] as const;

function formatValue(n: number, decimals: number) {
  if (decimals > 0) return n.toFixed(decimals);
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Counter({
  value,
  suffix,
  decimals = 0,
  active,
}: {
  value: number;
  suffix: string;
  decimals?: number;
  active: boolean;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  return (
    <span className="font-display tabular-nums text-[clamp(2.2rem,5vw,3.6rem)] font-semibold tracking-tight">
      {formatValue(shown, decimals)}
      {suffix}
    </span>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="stats" className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">By the numbers</p>
      </Reveal>
      <WordReveal
        text="A community that executes."
        className="font-display mt-4 max-w-xl text-[clamp(1.8rem,4.4vw,3rem)] font-semibold leading-[1.12] tracking-[-0.03em]"
      />

      <div ref={ref} className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 80}>
            <div className="glass rounded-xl px-5 py-7 md:px-7">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                decimals={"decimals" in stat ? stat.decimals : 0}
                active={active}
              />
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
