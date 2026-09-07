"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

// Plus le chiffre est grand, plus c'est lent
const FRAME_SKIP = 3; // on ne rafraîchit qu'une frame sur 3 (~20fps au lieu de 60fps)
const STEP_PER_LETTER = 4; // délai entre le début du scramble de chaque lettre
const MIN_SCRAMBLE_DURATION = 14; // durée mini du scramble par lettre
const RANDOM_SCRAMBLE_DURATION = 16; // durée aléatoire ajoutée

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
    { to: string; start: number; end: number }[]
  >([]);

  useEffect(() => {
    queue.current = text.split("").map((to, i) => {
      const start = i * STEP_PER_LETTER;
      const end =
        start +
        MIN_SCRAMBLE_DURATION +
        Math.floor(Math.random() * RANDOM_SCRAMBLE_DURATION);
      return { to, start, end };
    });

    frame.current = 0;
    let skipCounter = 0;

    const update = () => {
      skipCounter++;

      if (skipCounter >= FRAME_SKIP) {
        skipCounter = 0;

        let output = "";
        let complete = 0;

        for (let i = 0; i < queue.current.length; i++) {
          const { to, start, end } = queue.current[i];

          if (frame.current >= end) {
            complete++;
            output += to;
          } else if (frame.current >= start) {
            output +=
              to === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)];
          } else {
            output += "\u00A0";
          }
        }

        setDisplay(output);

        if (complete === queue.current.length) {
          setDisplay(text);
          return;
        }

        frame.current++;
      }

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
