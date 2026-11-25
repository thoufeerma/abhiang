"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Heart, Sparkle } from "./Doodles";

type Piece = {
  id: number;
  kind: "abhinav" | "angel" | "heart" | "sparkle";
  x: number; // px, final position (centre)
  y: number;
  size: number;
  rot: number;
  delay: number;
  fill: string;
  bob: number;
  dx: number; // start offset: all pieces burst out from the centre
  dy: number;
};

const FILLS = ["#ff4f7b", "#ff8fab", "#ff6b8b", "#ffb3c7", "#c9b6ff", "#ff2e63"];

/** Fill the viewport with a jittered grid of heads, hearts and sparkles. */
function makePieces(w: number, h: number): Piece[] {
  const cell = w < 640 ? 92 : 140;
  const cols = Math.ceil(w / cell) + 1;
  const rows = Math.ceil(h / cell) + 1;
  const out: Piece[] = [];
  const cx = w / 2, cy = h / 2;
  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const roll = (r * 7 + c * 3 + Math.floor(Math.random() * 4)) % 6;
      const kind: Piece["kind"] = roll < 2 ? "abhinav" : roll < 4 ? "angel" : roll === 4 ? "heart" : "sparkle";
      const isHead = kind === "abhinav" || kind === "angel";
      const x = c * cell + (r % 2 ? cell / 2 : 0) + (Math.random() - 0.5) * cell * 0.5;
      const y = r * cell + (Math.random() - 0.5) * cell * 0.5;
      out.push({
        id: id++,
        kind,
        x,
        y,
        dx: cx - x,
        dy: cy - y,
        size: isHead ? cell * (0.85 + Math.random() * 0.45) : cell * (0.4 + Math.random() * 0.35),
        rot: (Math.random() - 0.5) * 50,
        delay: Math.random() * 0.6,
        fill: FILLS[id % FILLS.length],
        bob: 1.6 + Math.random() * 1.6,
      });
    }
  }
  return out;
}

export default function LoveParty({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t0 = setTimeout(() => setPieces(makePieces(window.innerWidth, window.innerHeight)), 0);
    const t = setTimeout(onClose, 7000);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t0);
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="party"
          className="fixed inset-0 z-[80] cursor-pointer overflow-hidden"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.3 } }}
          role="dialog"
          aria-label="Love overload! Tap to close"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffe1ea_0%,#ffb3c7_55%,#ff8fab_100%)]" />

          {/* rotating sunburst behind everything */}
          <div className="spin-slow absolute left-1/2 top-1/2 size-[180vmax] -translate-x-1/2 -translate-y-1/2 opacity-40 [background:repeating-conic-gradient(#fff_0deg_10deg,transparent_10deg_20deg)]" />

          {pieces.map((p) => (
            <motion.div
              key={p.id}
              className="absolute"
              style={{ left: p.x, top: p.y, width: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
              initial={{ x: p.dx, y: p.dy, scale: 0, rotate: -180 }}
              animate={{ x: 0, y: 0, scale: 1, rotate: p.rot }}
              exit={{ scale: 0, rotate: p.rot + 90, transition: { duration: 0.4, delay: p.delay * 0.4 } }}
              transition={{ type: "spring", stiffness: 140, damping: 13, delay: p.delay }}
            >
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [-6, 6, -6] }}
                transition={{ duration: p.bob, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
              >
                {p.kind === "heart" ? (
                  <Heart className="w-full" fill={p.fill} />
                ) : p.kind === "sparkle" ? (
                  <Sparkle className="w-full" fill="#fff6c9" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/heads/${p.kind}.png`} alt="" className="w-full drop-shadow-[3px_4px_0_rgba(43,27,46,0.35)]" draggable={false} />
                )}
              </motion.div>
            </motion.div>
          ))}

          {/* centre card */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 12 }}
              transition={{ type: "spring", stiffness: 220, damping: 11, delay: 0.5 }}
            >
              <div className="relative">
                <Heart className="heartbeat w-[min(78vw,420px)] drop-shadow-[8px_10px_0_rgba(43,27,46,0.9)]" />
                <div className="absolute inset-0 flex items-center justify-center gap-0 pb-[8%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/heads/abhinav.png" alt="" className="wiggle w-[38%] -rotate-6" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/heads/angel.png" alt="" className="wiggle -ml-[6%] w-[38%] rotate-6" style={{ animationDelay: "-0.45s" }} />
                </div>
              </div>
              <p className="font-display ink-text -mt-2 text-center text-[clamp(2rem,8vw,4.5rem)] font-bold leading-none text-sun">
                100% IN LOVE!
              </p>
              <p className="font-hand mt-2 rounded-full bg-white/80 px-4 py-1 text-xl font-bold text-ink">tap anywhere to close</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
