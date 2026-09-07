"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

type ScrambleTitleProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
};

export function ScrambleTitle({ text, className, style }: ScrambleTitleProps) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const rafId = useRef<number | null>(null);
  const queue = useRef<
    { from: string; to: string; start: number; end: number }[]
  >([]);

  useEffect(() => {
    // Construit la file de résolution lettre par lettre
    queue.current = text.split("").map((to, i) => {
      const start = Math.floor(i * 2.2);
      const end = start + Math.floor(Math.random() * 8) + 6;
      return { from: "", to, start, end };
    });

    frame.current = 0;

    const update = () => {
      let output = "";
      let complete = 0;

      for (let i = 0; i < queue.current.length; i++) {
        const { to, start, end } = queue.current[i];

        if (frame.current >= end) {
          complete++;
          output += to;
        } else if (frame.current >= start) {
          if (to === " ") {
            output += " ";
          } else {
            output += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        } else {
          output += "\u00A0"; // espace insécable en attente
        }
      }

      setDisplay(output);

      if (complete === queue.current.length) {
        setDisplay(text);
        return;
      }

      frame.current++;
      rafId.current = requestAnimationFrame(update);
    };

    rafId.current = requestAnimationFrame(update);

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [text]);

  return (
    <h1 className={className} style={style} aria-label={text}>
      {display}
    </h1>
  );
}
