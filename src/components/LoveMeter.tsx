"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { confettiRain, loveBurst } from "@/lib/confetti";
import { getMusic } from "@/lib/music";
import { Heart, Squiggle } from "./Doodles";
import { FloatyDoodles, PopIn } from "./Extras";
import LoveParty from "./LoveParty";

const STEP = 8;
const LABELS = [
  [0, "tap the heart to measure the love"],
  [1, "ooh, warming up…"],
  [30, "getting mushy 🥺"],
  [60, "okay this is serious"],
  [85, "almost… there…"],
  [100, "OFF THE CHARTS 💯"],
] as const;

type Pop = { id: number; x: number; r: number };

export default function LoveMeter() {
  const [love, setLove] = useState(0);
  const [pops, setPops] = useState<Pop[]>([]);
  const [party, setParty] = useState(false);
  const closeParty = useCallback(() => setParty(false), []);
  const btn = useRef<HTMLButtonElement>(null);
  const nextId = useRef(0);
  const full = love >= 100;

  const label = [...LABELS].reverse().find(([min]) => love >= min)?.[1] ?? LABELS[0][1];

  const tap = () => {
    const id = ++nextId.current;
    setPops((p) => [...p.slice(-14), { id, x: (id * 47) % 120 - 60, r: (id * 31) % 50 - 25 }]);
    if (full) {
      // already at 100%: throw the party again
      setParty(true);
      getMusic().yay();
      confettiRain();
      return;
    }
    const next = Math.min(100, love + STEP);
    setLove(next);
    if (next >= 100) {
      const r = btn.current?.getBoundingClientRect();
      if (r) loveBurst(r.left + r.width / 2, r.top + r.height / 2, 1.4);
      confettiRain();
      getMusic().yay();
      setTimeout(() => setParty(true), 350);
    }
  };

  return (
    <section id="love" className="relative isolate px-5 py-24 sm:py-32">
      <FloatyDoodles
        items={[
          { kind: "heart", top: "34%", left: "4%", size: 48, color: "#ff8fab", mobile: true },
          { kind: "heart", top: "50%", right: "9%", size: 44, color: "#c9b6ff", mobile: true },
          { kind: "sparkle", top: "12%", right: "16%", size: 38, color: "#ffd45c" },
          { kind: "dots", top: "70%", left: "8%", size: 60, color: "#ffb3c7" },
          { kind: "star", top: "82%", right: "18%", size: 36, color: "#ffd45c" },
        ]}
      />
      <LoveParty open={party} onClose={closeParty} />
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-hand text-2xl font-bold text-coral">scientifically accurate*</p>
        <PopIn>
          <h2 className="font-display text-[clamp(2.4rem,6vw,4.2rem)] font-bold leading-tight">
            The <span className="marker">Love-o-Meter</span>
          </h2>
        </PopIn>
        <Squiggle className="mx-auto mt-2 h-4 w-48" stroke="#c9b6ff" />

        <div className="relative mx-auto mt-14 w-fit">
          <AnimatePresence>
            {pops.map((p) => (
              <motion.span
                key={p.id}
                className="pointer-events-none absolute left-1/2 top-1/3"
                initial={{ x: "-50%", y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
                animate={{ x: `calc(-50% + ${p.x}px)`, y: -170, opacity: 0, scale: 1, rotate: p.r }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                onAnimationComplete={() => setPops((all) => all.filter((x) => x.id !== p.id))}
              >
                <Heart className="w-9" fill={p.id % 2 ? "#ff8fab" : "#ff4f7b"} />
              </motion.span>
            ))}
          </AnimatePresence>

          <motion.button
            ref={btn}
            onClick={tap}
            whileTap={{ scale: 0.86 }}
            whileHover={{ scale: 1.05, rotate: -3 }}
            animate={full ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={full ? { duration: 0.9, repeat: Infinity } : { type: "spring", stiffness: 400, damping: 12 }}
            className="relative block cursor-pointer outline-none focus-visible:drop-shadow-[0_0_0_4px_#ffd45c]"
            aria-label="Send love"
          >
            <Heart className="w-[clamp(160px,34vw,230px)] drop-shadow-[6px_7px_0_rgba(43,27,46,0.9)]" />
            <span className="font-display ink-text absolute inset-0 flex items-center justify-center pb-4 text-[clamp(1.6rem,5vw,2.4rem)] font-bold text-white">
              {full ? "∞" : `${love}%`}
            </span>
          </motion.button>
        </div>

        {/* meter */}
        <div className="mx-auto mt-10 max-w-lg">
          <div className="relative h-9 overflow-hidden rounded-full border-[4px] border-ink bg-white shadow-pop-sm">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "repeating-linear-gradient(-45deg, #ff6b8b 0 14px, #ff8fab 14px 28px)",
              }}
              initial={false}
              animate={{ width: `${love}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={label}
              className="font-hand mt-4 text-3xl font-bold"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {label}
            </motion.p>
          </AnimatePresence>
          {full && (
            <button
              onClick={() => setLove(0)}
              className="font-display mt-4 rounded-full border-[3px] border-ink bg-white px-4 py-1.5 text-sm font-semibold shadow-pop-sm transition hover:-translate-y-0.5"
            >
              measure again
            </button>
          )}
          <p className="mt-6 text-sm text-ink/50">*not at all scientific. the result is always the same.</p>
        </div>
      </div>
    </section>
  );
}
