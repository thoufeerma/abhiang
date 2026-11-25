"use client";

import { motion } from "motion/react";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { Heart, Sparkle, Star } from "./Doodles";

const INK = "#2b1b2e";

/* ---------------- birds ---------------- */

function Bird({ size = 34, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <svg viewBox="0 0 44 20" width={size} className="flap overflow-visible" style={{ animationDelay: `${delay}s` }} aria-hidden>
      <path d="M2 12 Q12 0 22 12 Q32 0 42 12" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A little flock that drifts across the sky. */
export function Birds({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`cloud-drift absolute ${className}`} style={style} aria-hidden>
      <div className="bob relative h-16 w-28">
        <div className="absolute left-0 top-6"><Bird size={30} /></div>
        <div className="absolute left-9 top-0"><Bird size={38} delay={-0.15} /></div>
        <div className="absolute left-20 top-8"><Bird size={26} delay={-0.3} /></div>
      </div>
    </div>
  );
}

/* ---------------- butterflies ---------------- */

export function Butterfly({
  className = "",
  color = "#c9b6ff",
  path = [0, 40, -20, 60, 0],
  rise = [0, -30, -10, -40, 0],
  duration = 9,
  size = 34,
}: {
  className?: string;
  color?: string;
  path?: number[];
  rise?: number[];
  duration?: number;
  size?: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      animate={{ x: path, y: rise, rotate: [0, 8, -6, 10, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <svg viewBox="0 0 40 34" width={size} className="overflow-visible">
        <g className="wing-l" style={{ transformOrigin: "20px 17px" }}>
          <path d="M20 16 C10 0 0 4 3 14 C5 20 14 20 20 17 Z" fill={color} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M20 18 C12 22 6 30 12 31 C17 32 20 24 20 19 Z" fill={color} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        </g>
        <g className="wing-r" style={{ transformOrigin: "20px 17px" }}>
          <path d="M20 16 C30 0 40 4 37 14 C35 20 26 20 20 17 Z" fill={color} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M20 18 C28 22 34 30 28 31 C23 32 20 24 20 19 Z" fill={color} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        </g>
        <path d="M20 10 L20 26" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M20 10 Q17 4 14 3 M20 10 Q23 4 26 3" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

/* ---------------- rainbow ---------------- */

const BANDS = ["#ff6b6b", "#ffa94d", "#ffd45c", "#8ce99a", "#74c0fc", "#b197fc"];

/** Hand-drawn rainbow that paints itself in from left to right. */
export function Rainbow({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 400 210" className={className} style={style} aria-hidden>
      {BANDS.map((c, i) => {
        const r = 190 - i * 15;
        const d = `M${200 - r} 205 A ${r} ${r} 0 0 1 ${200 + r} 205`;
        return (
          <g key={c}>
            <motion.path
              d={d}
              fill="none"
              stroke={INK}
              strokeWidth={17}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, delay: 0.2 + i * 0.08, ease: "easeInOut" }}
            />
            <motion.path
              d={d}
              fill="none"
              stroke={c}
              strokeWidth={11}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, delay: 0.2 + i * 0.08, ease: "easeInOut" }}
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------- floating section doodles ---------------- */

type Floaty = {
  kind: "heart" | "star" | "sparkle" | "spiral" | "squiggle" | "dots";
  top: string;
  left?: string;
  right?: string;
  size: number;
  color?: string;
  delay?: number;
  mobile?: boolean; // show on phones too
};

function Spiral({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 60" className="w-full" aria-hidden>
      <path
        d="M30 30 m0 0 c3 0 5 2 5 5 c0 5-6 7-10 5 c-6-2-7-10-3-15 c5-6 15-6 20 0 c6 7 4 18-4 23 c-9 6-22 3-27-6"
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Wiggly({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 30" className="w-full" aria-hidden>
      <path d="M4 18 Q14 4 24 16 T44 16 T64 16 T78 12" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}

function Dots({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 40" className="w-full" aria-hidden>
      {[
        [8, 10, 5],
        [28, 6, 4],
        [48, 14, 6],
        [16, 30, 4],
        [40, 32, 5],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={color} stroke={INK} strokeWidth={2} />
      ))}
    </svg>
  );
}

export function FloatyDoodles({ items }: { items: Floaty[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {items.map((it, i) => {
        const color = it.color ?? "#ff8fab";
        return (
          <div
            key={i}
            className={`absolute ${it.mobile ? "" : "hidden md:block"}`}
            style={{ top: it.top, left: it.left, right: it.right, width: it.size }}
          >
            <div className="bob" style={{ animationDelay: `${it.delay ?? 0}s`, animationDuration: `${3 + (i % 3)}s` }}>
              <div className={it.kind === "star" || it.kind === "sparkle" ? "spin-slow" : "wiggle"}>
                {it.kind === "heart" && <Heart className="w-full" fill={color} />}
                {it.kind === "star" && <Star className="w-full" fill={color} />}
                {it.kind === "sparkle" && <Sparkle className="w-full" fill={color} />}
                {it.kind === "spiral" && <Spiral color={color} />}
                {it.kind === "squiggle" && <Wiggly color={color} />}
                {it.kind === "dots" && <Dots color={color} />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- scalloped grass edge ---------------- */

export function GrassEdge({ className = "" }: { className?: string }) {
  const n = 24;
  const w = 1440 / n;
  let d = "M0 0 H1440 V10";
  for (let i = n; i > 0; i--) {
    const x0 = i * w;
    d += ` Q${x0 - w / 2} ${i % 2 ? 40 : 32} ${x0 - w} 10`;
  }
  d += " Z";
  return (
    <svg viewBox="0 0 1440 44" preserveAspectRatio="none" className={className} aria-hidden>
      <path d={d} fill="#6fcf6a" stroke={INK} strokeWidth={4} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ---------------- bouncy heading wrapper ---------------- */

export function PopIn({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0.6, rotate: -6, opacity: 0 }}
      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", stiffness: 260, damping: 10 }}
      whileHover={{ rotate: [0, -3, 3, -2, 0], transition: { duration: 0.5 } }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- heart / sparkle cursor trail (mouse only) ---------------- */

type Dot = { id: number; x: number; y: number; kind: number; rot: number };

export function CursorTrail() {
  const [dots, setDots] = useState<Dot[]>([]);
  const last = useRef(0);
  const id = useRef(0);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - last.current < 55) return;
      last.current = now;
      const d: Dot = { id: ++id.current, x: e.clientX, y: e.clientY, kind: id.current % 3, rot: (id.current * 47) % 60 - 30 };
      setDots((all) => [...all.slice(-18), d]);
      setTimeout(() => setDots((all) => all.filter((x) => x.id !== d.id)), 900);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      {dots.map((d) => (
        <motion.div
          key={d.id}
          className="absolute"
          style={{ left: d.x - 9, top: d.y - 9 }}
          initial={{ scale: 0.3, opacity: 1, y: 0, rotate: 0 }}
          animate={{ scale: 1, opacity: 0, y: -26, rotate: d.rot }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {d.kind === 0 ? (
            <Heart className="w-[18px]" fill="#ff6b8b" />
          ) : d.kind === 1 ? (
            <Sparkle className="w-[18px]" fill="#ffd45c" />
          ) : (
            <Heart className="w-[14px]" fill="#c9b6ff" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
