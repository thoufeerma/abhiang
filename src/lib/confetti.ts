"use client";

const HEART =
  "M50 86 C20 64 4 46 6 28 C8 12 22 4 34 6 C42 7 47 12 50 18 C53 12 58 7 66 6 C78 4 92 12 94 28 C96 46 80 64 50 86 Z";

export const PALETTE = ["#ff4f7b", "#ff8fab", "#ffd45c", "#9fdcff", "#c9b6ff", "#9be38a", "#ffffff"];

/** Fire a burst of hearts + confetti from a point given in viewport pixels. */
export async function loveBurst(x: number, y: number, power = 1) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const confetti = (await import("canvas-confetti")).default;
  const origin = { x: x / window.innerWidth, y: y / window.innerHeight };
  const heart = confetti.shapeFromPath({ path: HEART });

  confetti({
    origin,
    particleCount: Math.round(70 * power),
    spread: 360,
    startVelocity: 34 * Math.sqrt(power),
    scalar: 1.7,
    ticks: 140,
    gravity: 0.7,
    shapes: [heart],
    colors: ["#ff4f7b", "#ff8fab", "#ff2e63"],
    zIndex: 60,
  });
  confetti({
    origin,
    particleCount: Math.round(90 * power),
    spread: 360,
    startVelocity: 42 * Math.sqrt(power),
    scalar: 1,
    ticks: 160,
    shapes: ["circle", "square", "star"],
    colors: PALETTE,
    zIndex: 60,
  });
}

/** Light rain of confetti from the top of the screen. */
export async function confettiRain() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const confetti = (await import("canvas-confetti")).default;
  const end = Date.now() + 1400;
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: PALETTE, zIndex: 60 });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: PALETTE, zIndex: 60 });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
