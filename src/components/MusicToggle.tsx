"use client";

import { motion } from "motion/react";
import { useSyncExternalStore } from "react";
import { getMusic } from "@/lib/music";

const noop = () => () => {};

export function useMusicPlaying() {
  return useSyncExternalStore(
    (cb) => (typeof window === "undefined" ? noop() : getMusic().subscribe(cb)),
    () => getMusic().getSnapshot(),
    () => false,
  );
}

function useRevealed() {
  return useSyncExternalStore(
    (cb) => (typeof window === "undefined" ? noop() : getMusic().subscribe(cb)),
    () => getMusic().getRevealed(),
    () => false,
  );
}

/** Floating sound button, top-left, visible on every section. */
export default function MusicToggle() {
  const playing = useMusicPlaying();
  const revealed = useRevealed();
  if (!revealed) return null;
  return (
    <motion.button
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 14 }}
      onClick={() => getMusic().toggle()}
      whileTap={{ scale: 0.88 }}
      whileHover={{ rotate: -6, scale: 1.06 }}
      className="fixed left-3 top-3 z-50 flex h-12 items-center gap-2 rounded-full border-[3px] border-ink bg-white px-3 shadow-pop-sm sm:left-5 sm:top-5"
      aria-label={playing ? "Mute music" : "Play music"}
      aria-pressed={playing}
    >
      <span className="text-xl leading-none">{playing ? "🎵" : "🔇"}</span>
      <span className="flex h-5 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-[4px] rounded-full bg-coral"
            animate={playing ? { height: ["30%", "100%", "45%", "85%", "30%"] } : { height: "25%" }}
            transition={playing ? { duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" } : { duration: 0.3 }}
          />
        ))}
      </span>
    </motion.button>
  );
}
