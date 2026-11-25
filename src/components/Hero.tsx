"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { hero, intro } from "@/content";
import { loveBurst } from "@/lib/confetti";
import { getMusic } from "@/lib/music";
import { Burst, Cloud, Flower, Heart, Hills, Sparkle, Star, Sun } from "./Doodles";
import FloatingHearts from "./FloatingHearts";
import Stickman from "./Stickman";

type Phase = "idle" | "walk" | "look" | "reach" | "spark" | "celebrate";
const ORDER: Phase[] = ["idle", "walk", "look", "reach", "spark", "celebrate"];

// ms at which each phase begins
const TIMELINE: [Phase, number][] = [
  ["walk", 500],
  ["look", 4100],
  ["reach", 4750],
  ["spark", 5350],
  ["celebrate", 6200],
];

const WALK_S = 3.6; // = 6 full stride cycles of 0.6s, so legs land back at neutral

/*
 * Geometry (figure viewBox units, 440 tall):
 * hands meet when each figure reaches 50° toward the other.
 * hand dx from neck = 19 + 88·sin50° ≈ 86  → figures stand 172 units apart.
 * hand height from figure bottom ≈ 171 units.
 */
const HALF_GAP = 86;
const NECK_FROM_LEFT = 130;
const HAND_FROM_BOTTOM = 171;

const at = (p: Phase, phase: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p);

const letterColors = ["#ff6b8b", "#ffd45c", "#9fdcff", "#9be38a", "#c9b6ff", "#ff9f6b", "#ff8fab"];

export default function Hero() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(false);
  const sparkRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    clear();
    if (!started) return clear;
    if (reduce) {
      timers.current.push(setTimeout(() => setPhase("celebrate"), 0));
      return clear;
    }
    timers.current.push(setTimeout(() => setPhase("idle"), 0));
    for (const [p, ms] of TIMELINE) timers.current.push(setTimeout(() => setPhase(p), ms));
    return clear;
  }, [run, reduce, started]);

  // side effects of the spark moment
  useEffect(() => {
    if (phase !== "spark") return;
    const r = sparkRef.current?.getBoundingClientRect();
    if (r) loveBurst(r.left + r.width / 2, r.top + r.height / 2, 1.2);
    getMusic().chime();
  }, [phase]);

  const begin = () => {
    const m = getMusic();
    m.start(); // must run inside the tap so browsers allow sound
    m.reveal();
    setStarted(true);
  };

  const skip = useCallback(() => {
    clear();
    setPhase("celebrate");
  }, []);

  const replay = () => setRun((n) => n + 1);

  const walking = phase === "walk";
  const looking = at("look", phase);
  const reaching = at("reach", phase);
  const celebrating = phase === "celebrate";
  const arrived = phase !== "idle";
  const shake = phase === "spark";

  return (
    <section
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
      style={
        {
          "--fh": "min(50svh, 460px, 92vw)",
          "--ground": "clamp(56px, 11svh, 120px)",
          "--u": "calc(var(--fh) / 440)",
        } as React.CSSProperties
      }
    >
      {/* sky: day → sunset once they meet */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#a8e0ff] via-[#d8f1ff] to-[#fff4dc]" />
      <motion.div
        className="absolute inset-0 -z-20 bg-gradient-to-b from-[#ffb3c7] via-[#ffd6c2] to-[#fff1d6]"
        initial={false}
        animate={{ opacity: celebrating ? 1 : 0 }}
        transition={{ duration: 1.6 }}
      />

      <div className={`absolute inset-0 -z-10 ${shake ? "shake" : ""}`}>
        <Sun className="absolute right-[2.5vw] top-[1.5svh] w-[clamp(54px,9vw,130px)]" />
        <Cloud className="cloud-drift absolute top-[12svh] w-[clamp(110px,14vw,210px)]" style={{ animationDuration: "48s", animationDelay: "-12s" }} />
        <Cloud className="cloud-drift absolute top-[26svh] w-[clamp(80px,10vw,150px)] opacity-90" style={{ animationDuration: "64s", animationDelay: "-40s" }} />
        <Cloud className="cloud-drift absolute top-[5svh] w-[clamp(70px,8vw,120px)] opacity-80" style={{ animationDuration: "56s", animationDelay: "-5s" }} />

        {/* hills + flowers */}
        <Hills className="absolute inset-x-0 bottom-0 h-[calc(var(--ground)+90px)] w-full" />
        <div className="absolute inset-x-0 bottom-0 h-[var(--ground)]">
          {[
            [6, "#ff8fab", 0],
            [14, "#c9b6ff", 1.2],
            [24, "#ffd45c", 0.5],
            [74, "#ffd45c", 0.8],
            [84, "#ff8fab", 0.2],
            [93, "#9fdcff", 1.6],
          ].map(([left, petal, delay], i) => (
            <Flower
              key={i}
              petal={petal as string}
              className="sway absolute bottom-[18%] w-[clamp(22px,3vw,40px)]"
              style={{ left: `${left}%`, animationDelay: `-${delay}s` }}
            />
          ))}
        </div>
      </div>

      {celebrating && <FloatingHearts every={520} />}

      {/* headline */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-[11svh] text-center sm:pt-[7svh]">
        <AnimatePresence mode="wait">
          {!celebrating ? (
            <motion.p
              key="kicker"
              className="font-hand text-[clamp(1.5rem,3.6vw,2.6rem)] font-bold text-ink/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6 }}
            >
              {hero.kicker}
            </motion.p>
          ) : (
            <motion.div key="title" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
              <h1 className="font-display flex flex-wrap items-center justify-center gap-x-[0.25em] text-[clamp(2.9rem,9vw,6.6rem)] leading-[0.95] font-bold">
                {hero.title.map((word, wi) =>
                  word === "&" ? (
                    <motion.span
                      key={wi}
                      className="inline-block"
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 11, delay: 0.55 }}
                    >
                      <Heart className="heartbeat inline-block w-[0.85em] align-middle" />
                      <span className="sr-only">&amp;</span>
                    </motion.span>
                  ) : (
                    <span key={wi} className="inline-flex whitespace-nowrap">
                      {[...word].map((ch, ci) => (
                        <motion.span
                          key={ci}
                          className="ink-text inline-block"
                          style={{ color: letterColors[(ci + wi * 3) % letterColors.length] }}
                          initial={{ y: -120, opacity: 0, rotate: -20 }}
                          animate={{ y: 0, opacity: 1, rotate: ci % 2 ? 4 : -4 }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 14,
                            delay: (wi === 0 ? 0 : 0.7) + ci * 0.06,
                          }}
                        >
                          {ch}
                        </motion.span>
                      ))}
                    </span>
                  ),
                )}
              </h1>
              <motion.p
                className="font-hand mt-3 text-[clamp(1.35rem,3vw,2.2rem)] font-bold text-ink/80"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                {hero.subtitle}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- the stage ---------- */}
      <div className={`pointer-events-none absolute inset-0 ${shake ? "shake" : ""}`}>
        {/* Abhinav, from the left */}
        <motion.div
          key={`him-${run}`}
          className="absolute"
          style={{
            bottom: "var(--ground)",
            height: "var(--fh)",
            width: "calc(var(--u) * 260)",
            left: `calc(50% - var(--u) * ${HALF_GAP + NECK_FROM_LEFT})`,
          }}
          initial={{ x: reduce ? 0 : "-80vw" }}
          animate={{ x: arrived ? 0 : "-80vw" }}
          transition={{ duration: phase === "walk" ? WALK_S : 0, ease: "linear" }}
        >
          <Stickman
            who="abhinav"
            className="h-full w-full"
            walking={walking}
            headTilt={looking ? 9 : 0}
            rightArm={reaching ? -50 : -8}
            leftArm={celebrating ? 140 : 8}
            waveLeft={celebrating}
            hop={celebrating}
          />
        </motion.div>

        {/* Angel, from the right */}
        <motion.div
          key={`her-${run}`}
          className="absolute"
          style={{
            bottom: "var(--ground)",
            height: "var(--fh)",
            width: "calc(var(--u) * 260)",
            left: `calc(50% + var(--u) * ${HALF_GAP - NECK_FROM_LEFT})`,
          }}
          initial={{ x: reduce ? 0 : "80vw" }}
          animate={{ x: arrived ? 0 : "80vw" }}
          transition={{ duration: phase === "walk" ? WALK_S : 0, ease: "linear" }}
        >
          <Stickman
            who="angel"
            className="h-full w-full"
            walking={walking}
            headTilt={looking ? -9 : 0}
            leftArm={reaching ? 50 : 8}
            rightArm={celebrating ? -140 : -8}
            waveRight={celebrating}
            hop={celebrating}
          />
        </motion.div>

        {/* little "!" + heart bubbles when they notice each other */}
        <AnimatePresence>
          {phase === "look" &&
            [-1, 1].map((s) => (
                <motion.div
                  key={s}
                  className="absolute"
                  style={{
                    left: `calc(50% + var(--u) * ${s * (HALF_GAP + 20)} - 22px)`,
                    bottom: "calc(var(--ground) + var(--u) * 430)",
                  }}
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Heart className="w-11" />
                </motion.div>
              ))}
        </AnimatePresence>

        {/* the SPARK at their joined hands */}
        <div
          ref={sparkRef}
          className="absolute size-0"
          style={{ left: "50%", bottom: `calc(var(--ground) + var(--u) * ${HAND_FROM_BOTTOM})` }}
        >
          <AnimatePresence>
            {phase === "spark" && (
              <motion.div
                key="burst"
                className="absolute -translate-x-1/2 translate-y-1/2"
                style={{ width: "calc(var(--u) * 240)", left: 0, bottom: 0 }}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: [0, 1.35, 1], rotate: 0 }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.35 } }}
                transition={{ duration: 0.5, times: [0, 0.6, 1] }}
              >
                <Burst className="w-full" />
                <span className="font-display ink-text absolute inset-0 flex items-center justify-center text-[calc(var(--u)*38)] font-bold text-coral">
                  YAY!
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {phase === "spark" &&
            Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return (
                <motion.div
                  key={`s${run}-${i}`}
                  className="absolute -translate-x-1/2 translate-y-1/2"
                  style={{ left: 0, bottom: 0 }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{ x: Math.cos(a) * 190, y: Math.sin(a) * 150, scale: [0, 1.2, 0.6], opacity: [1, 1, 0] }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  {i % 2 ? <Star className="w-7" /> : <Sparkle className="w-8" fill="#fff6c9" />}
                </motion.div>
              );
            })}

          {/* glowing heart that stays at their hands */}
          <AnimatePresence>
            {celebrating && (
              <motion.div
                className="absolute -translate-x-1/2 translate-y-1/2"
                style={{ left: 0, bottom: 0 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
              >
                <Sparkle className="spin-slow w-[calc(var(--u)*46)]" fill="#fff6c9" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* big heart balloon above their heads */}
        <AnimatePresence>
          {celebrating && (
            <motion.div
              className="absolute -translate-x-1/2"
              style={{ left: "50%", bottom: "calc(var(--ground) + var(--u) * 400)" }}
              initial={{ scale: 0, y: 60 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 10, delay: 0.25 }}
            >
              <Heart className="heartbeat w-[calc(var(--u)*92)] drop-shadow-[4px_5px_0_rgba(43,27,46,0.25)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* white flash */}
        <AnimatePresence>
          {phase === "spark" && (
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0] }}
              transition={{ duration: 0.55, times: [0, 0.15, 1] }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* tap-to-begin gate: browsers only allow music after a tap */}
      <AnimatePresence>
        {!started && (
          <motion.button
            key="gate"
            onClick={begin}
            className="absolute inset-0 z-30 flex cursor-pointer flex-col items-center justify-center gap-4 bg-white/10 backdrop-blur-[2px]"
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            aria-label="Tap to begin, with music"
          >
            {/* the two of them peeking in from the edges */}
            <motion.img
              src="/heads/abhinav.png"
              alt=""
              className="absolute bottom-[calc(var(--ground)+10px)] left-[-34px] w-[clamp(110px,16vw,190px)] sm:left-[-40px]"
              initial={{ x: -120, rotate: 0 }}
              animate={{ x: 0, rotate: [14, 22, 14] }}
              transition={{ x: { type: "spring", stiffness: 120, damping: 14, delay: 0.3 }, rotate: { duration: 2.2, repeat: Infinity } }}
            />
            <motion.img
              src="/heads/angel.png"
              alt=""
              className="absolute bottom-[calc(var(--ground)+10px)] right-[-34px] w-[clamp(110px,16vw,190px)] sm:right-[-40px]"
              initial={{ x: 120, rotate: 0 }}
              animate={{ x: 0, rotate: [-14, -22, -14] }}
              transition={{ x: { type: "spring", stiffness: 120, damping: 14, delay: 0.5 }, rotate: { duration: 2.2, repeat: Infinity, delay: 0.4 } }}
            />
            <motion.span
              className="relative block"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.15 }}
            >
              <Heart className="heartbeat w-[clamp(150px,22vw,220px)] drop-shadow-[6px_7px_0_rgba(43,27,46,0.9)]" />
              <span className="font-display ink-text absolute inset-0 flex items-center justify-center pb-3 text-[clamp(1.6rem,3.4vw,2.3rem)] font-bold text-white">
                ▶
              </span>
            </motion.span>
            <span className="font-display ink-text text-[clamp(1.8rem,4.5vw,3rem)] font-bold text-sun">{intro.button}</span>
            <span className="font-hand nudge text-2xl font-bold text-ink/80">{intro.hint}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* controls */}
      <div className="absolute inset-x-0 bottom-3 z-20 flex items-end justify-between px-4 sm:px-6">
        <div className="w-28">
          {celebrating && !reduce && (
            <motion.button
              onClick={replay}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 }}
              className="font-display rounded-full border-[3px] border-ink bg-white px-4 py-1.5 text-sm font-semibold shadow-pop-sm transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
            >
              ↺ replay
            </motion.button>
          )}
        </div>

        {celebrating ? (
          <motion.a
            href="#meet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="font-hand nudge flex flex-col items-center whitespace-nowrap text-xl font-bold text-ink"
          >
            <span className="hidden sm:inline">scroll down for more</span>
            <span className="sm:hidden">scroll</span>
            <span className="text-2xl leading-none">↓</span>
          </motion.a>
        ) : (
          <span />
        )}

        <div className="flex w-28 justify-end">
          {started && !celebrating && (
            <button
              onClick={skip}
              className="font-display rounded-full border-[3px] border-ink/70 bg-white/70 px-3 py-1 text-xs font-semibold text-ink/80 backdrop-blur transition hover:bg-white"
            >
              skip intro →
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
