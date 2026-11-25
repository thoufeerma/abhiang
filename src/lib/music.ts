"use client";

/**
 * Background music.
 * By default it plays an original, synthesized music-box tune (no audio file needed).
 * To use your own song instead, drop it in /public and set `music.file` in src/content.ts.
 */

import { music as musicConfig } from "@/content";

type Listener = () => void;

const BPM = 98;
const STEP = 60 / BPM / 2; // eighth notes

// I–V–vi–IV, eight bars
const CHORDS: number[][] = [
  [60, 64, 67],
  [59, 62, 67],
  [57, 60, 64],
  [57, 60, 65],
  [60, 64, 67],
  [59, 62, 67],
  [57, 60, 64],
  [57, 60, 65],
];
const BASS = [48, 43, 45, 41, 48, 43, 45, 41];
const _ = null;
// original melody, 8 eighth-steps per bar
const MELODY: (number | null)[] = [
  76, _, 79, _, 84, _, 79, 76,
  74, _, 79, _, 83, 81, 79, _,
  72, _, 76, _, 81, _, 79, 76,
  77, 76, 74, _, 72, _, _, _,
  76, 77, 79, _, 84, _, 83, 84,
  86, _, 83, _, 79, _, 81, 83,
  84, _, 81, 79, 76, _, 79, _,
  77, _, 76, _, 74, _, 72, _,
];

const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

class Music {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextTime = 0;
  private step = 0;
  private audio: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  playing = false;
  /** true once the visitor has tapped "begin" — the sound button shows from then on */
  revealed = false;

  subscribe = (l: Listener) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };
  getSnapshot = () => this.playing;
  getRevealed = () => this.revealed;
  reveal() {
    this.revealed = true;
    this.emit();
  }
  private emit() {
    this.listeners.forEach((l) => l());
  }

  private ensureCtx() {
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0;
    // warm it up a little: lowpass + soft echo
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 5200;
    const bus = ctx.createGain();
    const delay = ctx.createDelay(1);
    delay.delayTime.value = STEP * 3;
    const fb = ctx.createGain();
    fb.gain.value = 0.22;
    const wet = ctx.createGain();
    wet.gain.value = 0.18;
    bus.connect(lp);
    bus.connect(delay);
    delay.connect(fb).connect(delay);
    delay.connect(wet).connect(lp);
    lp.connect(master).connect(ctx.destination);

    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    this.ctx = ctx;
    this.master = master;
    this.bus = bus;
    this.noise = buf;

    document.addEventListener("visibilitychange", () => {
      if (!this.ctx) return;
      if (document.hidden) this.ctx.suspend();
      else if (this.playing) this.ctx.resume();
    });
    return ctx;
  }

  private tone(t: number, midi: number, dur: number, vol: number, type: OscillatorType, harmonic = 0) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(this.bus!);
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = hz(midi);
    o.connect(g);
    o.start(t);
    o.stop(t + dur + 0.05);
    if (harmonic) {
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(vol * harmonic, t + 0.005);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.35);
      g2.connect(this.bus!);
      const o2 = ctx.createOscillator();
      o2.type = "sine";
      o2.frequency.value = hz(midi) * 3;
      o2.connect(g2);
      o2.start(t);
      o2.stop(t + dur);
    }
  }

  private shaker(t: number, vol: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    src.connect(hp).connect(g).connect(this.bus!);
    src.start(t);
    src.stop(t + 0.08);
  }

  private schedule = () => {
    const ctx = this.ctx!;
    while (this.nextTime < ctx.currentTime + 0.15) {
      const t = this.nextTime;
      const s = this.step % MELODY.length;
      const bar = Math.floor(s / 8);
      const inBar = s % 8;
      const m = MELODY[s];
      if (m) this.tone(t, m, 0.9, 0.16, "triangle", 0.35);
      if (inBar === 0 || inBar === 4) this.tone(t, BASS[bar], 0.7, 0.2, "sine");
      if (inBar === 0 || inBar === 3 || inBar === 6) {
        CHORDS[bar].forEach((n, i) => this.tone(t + i * 0.018, n, 0.45, 0.045, "triangle"));
      }
      if (inBar % 2 === 1) this.shaker(t, 0.05);
      this.nextTime += STEP;
      this.step += 1;
    }
  };

  async start() {
    if (this.playing) return;
    this.playing = true;
    this.emit();

    if (musicConfig.file) {
      // unlock Web Audio too (inside the tap), so the "yay" chime can play later
      this.ensureCtx().resume();
      if (!this.audio) {
        this.audio = new Audio(musicConfig.file);
        this.audio.loop = true;
        this.audio.volume = musicConfig.volume;
      }
      try {
        await this.audio.play();
      } catch {
        this.playing = false;
        this.emit();
      }
      return;
    }

    const ctx = this.ensureCtx();
    await ctx.resume();
    const now = ctx.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(musicConfig.volume, now + 1.5);
    this.nextTime = now + 0.08;
    this.timer = setInterval(this.schedule, 25);
  }

  stop() {
    if (!this.playing) return;
    this.playing = false;
    this.emit();
    if (this.audio) {
      this.audio.pause();
      return;
    }
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(0, now + 0.4);
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  toggle() {
    if (this.playing) this.stop();
    else this.start();
  }

  /** a sparkly "yay!" chime — plays only while sound is on */
  chime() {
    if (!this.playing) return;
    const ctx = this.ensureCtx();
    const t = ctx.currentTime + 0.02;
    const g = ctx.createGain();
    g.gain.value = 1.4;
    g.connect(ctx.destination);
    [84, 88, 91, 96, 100].forEach((n, i) => {
      const o = ctx.createOscillator();
      const e = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = hz(n);
      e.gain.setValueAtTime(0.0001, t + i * 0.06);
      e.gain.exponentialRampToValueAtTime(0.12, t + i * 0.06 + 0.01);
      e.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.06 + 0.9);
      o.connect(e).connect(g);
      o.start(t + i * 0.06);
      o.stop(t + i * 0.06 + 1);
    });
  }
}

let instance: Music | null = null;
export function getMusic() {
  if (!instance) instance = new Music();
  return instance;
}
