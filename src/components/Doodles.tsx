import type { CSSProperties, SVGProps } from "react";

const INK = "#2b1b2e";

type P = { className?: string; style?: CSSProperties };

export function Cloud({ className, style }: P) {
  return (
    <svg viewBox="0 0 200 100" className={className} style={style} aria-hidden>
      <path
        d="M40 82 Q12 82 14 62 Q16 44 38 46 Q40 22 66 24 Q80 6 104 16 Q124 4 140 24 Q170 20 172 46 Q192 50 188 68 Q184 84 160 82 Z"
        fill="#fff"
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path d="M60 66 Q70 72 82 66" fill="none" stroke="#e8eef5" strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}

export function Sun({ className, style }: P) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      <g className="spin-slow" style={{ transformOrigin: "100px 100px" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d="M100 8 L108 34 L92 34 Z"
            fill="#ffb347"
            stroke={INK}
            strokeWidth={4}
            strokeLinejoin="round"
            transform={`rotate(${i * 30} 100 100)`}
          />
        ))}
      </g>
      <circle cx={100} cy={100} r={56} fill="#ffd45c" stroke={INK} strokeWidth={5} />
      <circle cx={82} cy={94} r={5} fill={INK} />
      <circle cx={118} cy={94} r={5} fill={INK} />
      <path d="M84 114 Q100 128 116 114" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <circle cx={72} cy={110} r={7} fill="#ff8fab" opacity={0.7} />
      <circle cx={128} cy={110} r={7} fill="#ff8fab" opacity={0.7} />
    </svg>
  );
}

export function Heart({ className, style, fill = "#ff4f7b", ...rest }: P & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 92" className={className} style={style} aria-hidden {...rest}>
      <path
        d="M50 86 C20 64 4 46 6 28 C8 12 22 4 34 6 C42 7 47 12 50 18 C53 12 58 7 66 6 C78 4 92 12 94 28 C96 46 80 64 50 86 Z"
        fill={fill}
        stroke={INK}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path d="M24 26 Q26 18 34 17" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
    </svg>
  );
}

export function Star({ className, style, fill = "#ffd45c" }: P & { fill?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <path
        d="M50 6 L61 37 L94 38 L68 58 L78 91 L50 72 L22 91 L32 58 L6 38 L39 37 Z"
        fill={fill}
        stroke={INK}
        strokeWidth={6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sparkle({ className, style, fill = "#fff" }: P & { fill?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <path
        d="M50 4 Q56 44 96 50 Q56 56 50 96 Q44 56 4 50 Q44 44 50 4 Z"
        fill={fill}
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Flower({ className, style, petal = "#ff8fab" }: P & { petal?: string }) {
  return (
    <svg viewBox="0 0 60 110" className={className} style={style} aria-hidden>
      <path d="M30 108 Q26 80 30 46" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M29 84 Q14 72 10 80 Q16 90 29 86" fill="#6fcf6a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse
          key={r}
          cx={30}
          cy={20}
          rx={9}
          ry={13}
          fill={petal}
          stroke={INK}
          strokeWidth={4}
          transform={`rotate(${r} 30 34)`}
        />
      ))}
      <circle cx={30} cy={34} r={8} fill="#ffd45c" stroke={INK} strokeWidth={4} />
    </svg>
  );
}

export function Squiggle({ className, style, stroke = INK }: P & { stroke?: string }) {
  return (
    <svg viewBox="0 0 220 24" className={className} style={style} aria-hidden preserveAspectRatio="none">
      <path
        d="M4 14 Q22 2 40 12 T76 12 T112 12 T148 12 T184 12 T216 10"
        fill="none"
        stroke={stroke}
        strokeWidth={6}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Hills({ className, style }: P) {
  return (
    <svg viewBox="0 0 1440 260" preserveAspectRatio="none" className={className} style={style} aria-hidden>
      <path
        d="M0 120 Q240 30 520 96 T1040 84 T1440 70 L1440 260 L0 260 Z"
        fill="#9be38a"
        stroke={INK}
        strokeWidth={5}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 176 Q300 112 720 150 T1440 140 L1440 260 L0 260 Z"
        fill="#6fcf6a"
        stroke={INK}
        strokeWidth={5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Burst({ className, style }: P) {
  // comic "kapow" starburst
  const pts: string[] = [];
  const n = 18;
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? 96 : 58 + ((i * 37) % 13);
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      <polygon points={pts.join(" ")} fill="#ffd45c" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <polygon
        points={pts
          .map((p) => {
            const [x, y] = p.split(",").map(Number);
            return `${(100 + (x - 100) * 0.62).toFixed(1)},${(100 + (y - 100) * 0.62).toFixed(1)}`;
          })
          .join(" ")}
        fill="#fff6c9"
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Coffee({ className, style }: P) {
  return (
    <svg viewBox="0 0 60 70" className={className} style={style} aria-hidden>
      <path d="M22 16 Q16 8 22 2 M34 16 Q28 8 34 2" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.6} />
      <path d="M8 22 L48 22 L44 62 Q28 68 12 62 Z" fill="#fff" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M47 30 Q60 30 58 42 Q56 52 45 50" fill="none" stroke={INK} strokeWidth={4.5} />
      <path d="M12 36 L46 36" stroke="#c98a3a" strokeWidth={6} />
      <path d="M22 46 C18 42 22 38 26 42 C30 38 34 42 30 46 L26 50 Z" fill="#ff6b8b" />
    </svg>
  );
}
