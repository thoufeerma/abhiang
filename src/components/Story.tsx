"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { story } from "@/content";
import { Burst, Cloud, Heart, Sparkle, Squiggle } from "./Doodles";
import { FloatyDoodles, PopIn } from "./Extras";
import Stickman from "./Stickman";

const INK = "#2b1b2e";

/*
 * Panels are 4:3. Figures are 72% of panel height, which makes
 * one figure unit = 0.1227% of panel width and 0.1636% of panel height.
 */
const UX = 0.12273;
const UY = 0.16364;
const FIG_W = 260 * UX;
const GROUND = 7; // % from bottom

function Fig({ cx, children }: { cx: number; children: ReactNode }) {
  return (
    <div
      className="absolute"
      style={{ left: `${cx - 130 * UX}%`, bottom: `${GROUND}%`, width: `${FIG_W}%`, height: "72%" }}
    >
      {children}
    </div>
  );
}

function CupItem() {
  // coffee cup drawn in figure units, sitting in the hand
  return (
    <g transform="translate(-16 -30)">
      <path d="M12 2 Q8 -6 12 -12 M22 2 Q18 -6 22 -12" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
      <path d="M2 6 L32 6 L29 36 Q17 41 5 36 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M4 16 L30 16" stroke="#c98a3a" strokeWidth={5} />
    </g>
  );
}

function Scene({ kind }: { kind: (typeof story)[number]["scene"] }) {
  const near = 86 * UX; // hands-held half distance
  const clink = 104 * UX;
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] border-[4px] border-ink bg-gradient-to-b from-[#bfe8ff] to-[#fff4dc]">
      <Cloud className="absolute left-[8%] top-[8%] w-[22%]" />
      <Cloud className="absolute right-[6%] top-[16%] w-[16%] opacity-90" />
      <div className="absolute inset-x-0 bottom-0 h-[10%] border-t-[4px] border-ink bg-mint" />

      {kind === "apart" && (
        <>
          <Fig cx={20}>
            <Stickman who="abhinav" className="h-full w-full" headTilt={-6} rightArm={-20} />
          </Fig>
          <Fig cx={80}>
            <Stickman who="angel" className="h-full w-full" headTilt={6} leftArm={20} />
          </Fig>
          {[-1, 1].map((s) => (
            <span
              key={s}
              className="font-display ink-text wiggle absolute top-[14%] text-[clamp(1.6rem,4vw,2.6rem)] font-bold text-sun"
              style={{ left: s < 0 ? "34%" : "auto", right: s > 0 ? "34%" : "auto" }}
            >
              ?
            </span>
          ))}
          <svg viewBox="0 0 100 10" className="absolute bottom-[34%] left-[36%] w-[28%]" aria-hidden>
            <path d="M2 5 L98 5" stroke={INK} strokeWidth={2.5} strokeDasharray="5 5" strokeLinecap="round" />
          </svg>
        </>
      )}

      {kind === "spark" && (
        <>
          <Fig cx={50 - near}>
            <Stickman who="abhinav" className="h-full w-full" headTilt={9} rightArm={-50} />
          </Fig>
          <Fig cx={50 + near}>
            <Stickman who="angel" className="h-full w-full" headTilt={-9} leftArm={50} />
          </Fig>
          <div
            className="absolute w-[13%] -translate-x-1/2 translate-y-1/2"
            style={{ left: "50%", bottom: `${GROUND + 171 * UY}%` }}
          >
            <Burst className="wiggle w-full" />
          </div>
        </>
      )}

      {kind === "coffee" && (
        <>
          {/* tiny café table */}
          <svg viewBox="0 0 100 60" className="absolute bottom-[9%] left-1/2 w-[18%] -translate-x-1/2" aria-hidden>
            <path d="M6 10 L94 10" stroke={INK} strokeWidth={7} strokeLinecap="round" />
            <path d="M50 10 L50 56 M34 56 L66 56" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          </svg>
          <Fig cx={50 - clink}>
            <Stickman who="abhinav" className="h-full w-full" headTilt={7} rightArm={-72} rightHandItem={<CupItem />} />
          </Fig>
          <Fig cx={50 + clink}>
            <Stickman who="angel" className="h-full w-full" headTilt={-7} leftArm={72} leftHandItem={<CupItem />} />
          </Fig>
          <Sparkle className="spin-slow absolute left-1/2 top-[30%] w-[7%] -translate-x-1/2" fill="#fff6c9" />
        </>
      )}

      {kind === "together" && (
        <>
          <Fig cx={50 - near}>
            <Stickman who="abhinav" className="h-full w-full" headTilt={9} rightArm={-50} leftArm={140} waveLeft hop />
          </Fig>
          <Fig cx={50 + near}>
            <Stickman who="angel" className="h-full w-full" headTilt={-9} leftArm={50} rightArm={-140} waveRight hop />
          </Fig>
          <Heart className="heartbeat absolute left-1/2 top-[6%] w-[12%] -translate-x-1/2" />
          <Sparkle className="spin-slow absolute left-[30%] top-[10%] w-[5%]" fill="#ffd45c" />
          <Sparkle className="spin-slow absolute right-[30%] top-[18%] w-[4%]" fill="#ffd45c" />
        </>
      )}
    </div>
  );
}

export default function Story() {
  return (
    <section id="story" className="relative isolate px-5 py-24 sm:py-32">
      <FloatyDoodles
        items={[
          { kind: "heart", top: "6%", left: "6%", size: 40, color: "#ff6b8b", mobile: true },
          { kind: "star", top: "4%", right: "7%", size: 44, color: "#ffd45c", mobile: true },
          { kind: "squiggle", top: "40%", right: "2%", size: 72, color: "#c9b6ff" },
          { kind: "spiral", top: "62%", left: "2%", size: 56, color: "#ff8fab" },
          { kind: "sparkle", top: "88%", right: "5%", size: 34, color: "#fff6c9" },
        ]}
      />
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="font-hand text-2xl font-bold text-coral">a tiny comic about</p>
          <PopIn>
            <h2 className="font-display text-[clamp(2.4rem,6vw,4.2rem)] font-bold leading-tight">
              Our <span className="marker">Little</span> Story
            </h2>
          </PopIn>
          <Squiggle className="mx-auto mt-2 h-4 w-48" stroke="#9fdcff" />
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          {story.map((s, i) => (
            <motion.figure
              key={s.title}
              initial={{ opacity: 0, y: 50, rotate: i % 2 ? 2.5 : -2.5, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1 : -1, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ type: "spring", stiffness: 110, damping: 14, delay: (i % 2) * 0.12 }}
              whileHover={{ rotate: 0, scale: 1.03, y: -6 }}
              className="relative rounded-[22px] border-[4px] border-ink bg-white p-3 shadow-pop"
            >
              <span className="font-display absolute -left-4 -top-5 z-10 flex size-12 items-center justify-center rounded-full border-[4px] border-ink bg-sun text-xl font-bold shadow-pop-sm">
                {i + 1}
              </span>
              <div className="absolute left-6 top-6 z-10 -rotate-2 rounded-md border-[3px] border-ink bg-[#fff6c9] px-3 py-1 shadow-pop-sm">
                <p className="font-display text-sm font-semibold sm:text-base">{s.title}</p>
              </div>
              <Scene kind={s.scene} />
              <figcaption className="font-hand px-2 pb-1 pt-3 text-center text-2xl leading-tight font-bold">
                {s.text}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
