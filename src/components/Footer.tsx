"use client";

import { motion } from "motion/react";
import { footer } from "@/content";
import { Flower, Heart, Hills, Sparkle } from "./Doodles";
import { Butterfly } from "./Extras";
import FloatingHearts from "./FloatingHearts";
import Stickman from "./Stickman";

export default function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden bg-gradient-to-b from-transparent via-[#ffd9e3] to-[#ffb3c7] pt-24"
      style={{ "--fh": "min(300px, 60vw)", "--u": "calc(var(--fh) / 440)" } as React.CSSProperties}
    >
      <FloatingHearts every={900} />
      <Butterfly className="bottom-[150px] left-[18%]" color="#ffd45c" duration={10} />
      <Butterfly className="bottom-[210px] right-[20%]" color="#9fdcff" path={[0, -40, 20, -20, 0]} rise={[0, -30, -10, -50, 0]} duration={12} size={28} />

      <div className="relative z-10 px-5 text-center">
        <motion.h2
          className="font-display text-[clamp(2rem,5.5vw,3.6rem)] font-bold leading-tight"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 160, damping: 12 }}
        >
          {footer.line}
        </motion.h2>
      </div>

      {/* the pair, holding hands under a balloon */}
      <div className="relative mx-auto mt-10" style={{ height: "calc(var(--fh) + 170px)", maxWidth: 900 }}>
        {/* balloon string from joined hands */}
        <svg
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: "calc(36px + var(--u) * 171)", height: "calc(var(--u) * 340)", width: 40 }}
          viewBox="0 0 40 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M20 100 Q8 70 22 48 Q32 26 20 0" fill="none" stroke="#2b1b2e" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
        </svg>
        <div
          className="sway absolute left-1/2 -translate-x-1/2"
          style={{ bottom: "calc(36px + var(--u) * 500)" }}
        >
          <Heart className="w-[calc(var(--u)*130)] min-w-16" />
          <Sparkle className="spin-slow absolute -right-5 -top-3 w-7" fill="#ffd45c" />
        </div>

        <div
          className="absolute"
          style={{ bottom: 36, height: "var(--fh)", width: "calc(var(--u) * 260)", left: "calc(50% - var(--u) * 216)" }}
        >
          <Stickman who="abhinav" className="h-full w-full" headTilt={9} rightArm={-50} leftArm={20} />
        </div>
        <div
          className="absolute"
          style={{ bottom: 36, height: "var(--fh)", width: "calc(var(--u) * 260)", left: "calc(50% - var(--u) * 44)" }}
        >
          <Stickman who="angel" className="h-full w-full" headTilt={-9} leftArm={50} rightArm={-20} />
        </div>

      </div>
      <Hills className="absolute inset-x-0 bottom-[60px] -z-10 h-28 w-full" />
      <Flower className="sway absolute bottom-[78px] left-[10%] w-8" petal="#c9b6ff" />
      <Flower className="sway absolute bottom-[72px] right-[12%] w-9" petal="#ffd45c" style={{ animationDelay: "-1s" }} />

      <div className="relative z-10 bg-[#6fcf6a] px-5 pb-8 pt-2 text-center">
        <p className="font-hand text-2xl font-bold text-ink">{footer.signoff} ♥</p>
      </div>
    </footer>
  );
}
