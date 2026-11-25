"use client";

import { useEffect, useState } from "react";
import { Heart } from "./Doodles";

type H = { id: number; left: number; size: number; dur: number; dx: number; rot: number; fill: string };

const FILLS = ["#ff4f7b", "#ff8fab", "#ffb3c7", "#ff6b8b", "#c9b6ff"];

/** Hearts drifting up the screen. Rendered only after mount, so no hydration surprises. */
export default function FloatingHearts({ active = true, every = 650 }: { active?: boolean; every?: number }) {
  const [hearts, setHearts] = useState<H[]>([]);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    const t = setInterval(() => {
      id += 1;
      const h: H = {
        id,
        left: Math.random() * 100,
        size: 18 + Math.random() * 26,
        dur: 7 + Math.random() * 6,
        dx: (Math.random() - 0.5) * 160,
        rot: (Math.random() - 0.5) * 70,
        fill: FILLS[id % FILLS.length],
      };
      setHearts((prev) => [...prev.slice(-24), h]);
    }, every);
    return () => clearInterval(t);
  }, [active, every]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {hearts.map((h) => (
        <Heart
          key={h.id}
          fill={h.fill}
          className="float-heart absolute bottom-[-60px]"
          style={
            {
              left: `${h.left}%`,
              width: h.size,
              animationDuration: `${h.dur}s`,
              "--dx": `${h.dx}px`,
              "--rot": `${h.rot}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
