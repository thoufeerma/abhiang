"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { her, him, type Person } from "@/content";
import { Heart, Sparkle, Squiggle } from "./Doodles";

function Card({ p, tilt, accent, delay }: { p: Person; tilt: number; accent: string; delay: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 60, rotate: tilt * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay }}
      whileHover={{ rotate: 0, y: -8 }}
      className="relative mx-auto w-full max-w-sm"
    >
      {/* polaroid */}
      <div className="relative rounded-[18px] border-[4px] border-ink bg-white p-3 pb-5 shadow-pop">
        {/* tape */}
        <div
          className="absolute -top-4 left-1/2 h-8 w-28 -translate-x-1/2 -rotate-3 rounded-sm border-2 border-ink/40 opacity-90"
          style={{ background: accent }}
        />
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl border-[3px] border-ink">
          <Image
            src={p.photo}
            alt={p.fullName}
            fill
            sizes="(max-width: 768px) 90vw, 380px"
            className="object-cover"
            style={{ objectPosition: p.key === "angel" ? "50% 62%" : "50% 30%" }}
          />
        </div>
        <p className="font-hand mt-3 text-center text-3xl font-bold">{p.fullName}</p>
        <p className="font-hand text-center text-xl text-ink/70">{p.tagline}</p>

        {/* bobblehead sticker peeking from the corner */}
        <motion.img
          src={p.key === "abhinav" ? "/heads/abhinav.png" : "/heads/angel.png"}
          alt=""
          className={`absolute -bottom-10 w-28 ${p.key === "abhinav" ? "-left-10" : "-right-10"}`}
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* facts bubble */}
      <ul className="relative mt-8 space-y-2 rounded-[22px] border-[4px] border-ink bg-cream p-5 shadow-pop-sm">
        {p.facts.map((f) => (
          <li key={f.text} className="flex items-start gap-3 text-lg font-medium leading-snug">
            <span className="text-2xl leading-none">{f.emoji}</span>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export default function Meet() {
  return (
    <section id="meet" className="relative scroll-mt-4 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <p className="font-hand text-2xl font-bold text-coral">say hi to</p>
          <h2 className="font-display text-[clamp(2.4rem,6vw,4.2rem)] font-bold leading-tight">
            The <span className="marker">Cutest</span> Duo
          </h2>
          <Squiggle className="mx-auto mt-2 h-4 w-48" stroke="#ff6b8b" />
        </div>

        <div className="relative grid items-start gap-20 md:grid-cols-2 md:gap-14">
          <Card p={him} tilt={-3} accent="#9fdcff" delay={0} />
          <Card p={her} tilt={3} accent="#ffc2d4" delay={0.15} />

          {/* heart in the middle on wide screens */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-40 hidden -translate-x-1/2 md:block"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 10, delay: 0.5 }}
          >
            <Heart className="heartbeat w-20" />
            <Sparkle className="spin-slow absolute -right-6 -top-5 w-8" fill="#ffd45c" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
