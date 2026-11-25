import type { CSSProperties, ReactNode } from "react";

/**
 * A cartoon stick figure with a real photo head.
 * Coordinate system: viewBox -30 -60 260 440, neck at (100,136), feet on y≈376.
 * Arm angles: 0 = hanging down, positive = hand swings toward viewer's left.
 */

const INK = "#2b1b2e";
const HEAD = 178;

type Who = "abhinav" | "angel";

const heads: Record<Who, { src: string; cx: number; cy: number }> = {
  abhinav: { src: "/heads/abhinav.png", cx: 0.476, cy: 0.915 },
  angel: { src: "/heads/angel.png", cx: 0.372, cy: 0.85 },
};

export type StickmanProps = {
  who: Who;
  walking?: boolean;
  leftArm?: number;
  rightArm?: number;
  waveLeft?: boolean;
  waveRight?: boolean;
  headTilt?: number;
  hop?: boolean;
  className?: string;
  style?: CSSProperties;
  /** extra SVG drawn in the figure's coordinate space (props in hands etc.) */
  children?: ReactNode;
  leftHandItem?: ReactNode;
  rightHandItem?: ReactNode;
};

export const VIEW = { x: -30, y: -60, w: 260, h: 440 };
/** shoulder & arm geometry, used by scenes to work out where hands are */
export const RIG = { neckX: 100, shoulderY: 152, shoulderDX: 19, arm: 88 };

function Arm({
  side,
  angle,
  waving,
  who,
  item,
}: {
  side: "l" | "r";
  angle: number;
  waving?: boolean;
  who: Who;
  item?: ReactNode;
}) {
  const x = side === "l" ? RIG.neckX - RIG.shoulderDX : RIG.neckX + RIG.shoulderDX;
  return (
    <g transform={`translate(${x} ${RIG.shoulderY})`}>
      <g className="sm-joint sm-pose" style={{ transform: `rotate(${angle}deg)` }}>
        <g className={`sm-joint ${waving ? `sm-waving-${side}` : `sm-swing-${side}`}`}>
          {/* white halo keeps the arm readable over dark hair */}
          <path
            d={side === "l" ? "M0 30 Q -7 56 0 86" : "M0 30 Q 7 56 0 86"}
            fill="none"
            stroke="#fff"
            strokeWidth={17}
            strokeLinecap="round"
          />
          {who === "abhinav" && (
            // rolled black sleeve
            <>
              <path d="M0 -4 L0 34" stroke={INK} strokeWidth={22} strokeLinecap="round" />
              <path d="M0 -4 L0 34" stroke="#1d1d22" strokeWidth={14} strokeLinecap="round" />
              <path d="M-7 30 L7 30" stroke="#3a3a44" strokeWidth={3} strokeLinecap="round" />
            </>
          )}
          <path
            d={side === "l" ? "M0 0 Q -7 46 0 86" : "M0 0 Q 7 46 0 86"}
            fill="none"
            stroke={INK}
            strokeWidth={9}
            strokeLinecap="round"
          />
          {who === "angel" && side === "l" && (
            <ellipse cx={0} cy={70} rx={8} ry={3.5} fill="none" stroke="#c98a3a" strokeWidth={3.5} />
          )}
          {who === "abhinav" && side === "r" && (
            <rect x={-6} y={66} width={12} height={9} rx={3} fill="#3d7bd9" stroke={INK} strokeWidth={2.5} />
          )}
          <circle cx={0} cy={89} r={8} fill="#fff" stroke={INK} strokeWidth={5} />
          {item && <g transform={`translate(0 89) rotate(${-angle})`}>{item}</g>}
        </g>
      </g>
    </g>
  );
}

function Leg({ side, who }: { side: "l" | "r"; who: Who }) {
  const x = side === "l" ? 91 : 109;
  const dir = side === "l" ? -1 : 1;
  const jeans = who === "angel";
  const seg = (d: string) =>
    jeans ? (
      <>
        <path d={d} stroke={INK} strokeWidth={17} strokeLinecap="round" />
        <path d={d} stroke="#a9c9ec" strokeWidth={9} strokeLinecap="round" />
      </>
    ) : (
      <path d={d} stroke={INK} strokeWidth={9} strokeLinecap="round" />
    );
  return (
    <g transform={`translate(${x} 248)`}>
      <g className={`sm-joint sm-thigh-${side}`}>
        {seg("M0 0 L0 60")}
        <g transform="translate(0 60)">
          <g className={`sm-joint sm-shin-${side}`}>
            {seg("M0 0 L0 56")}
            <path
              d={`M${-4 * dir} 58 Q ${-4 * dir} 50 ${10 * dir} 52 Q ${24 * dir} 54 ${22 * dir} 62 Q ${10 * dir} 68 ${-4 * dir} 64 Z`}
              fill={jeans ? "#fff" : "#7a4a2b"}
              stroke={INK}
              strokeWidth={4.5}
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
    </g>
  );
}

function Torso({ who }: { who: Who }) {
  if (who === "abhinav") {
    return (
      <g>
        {/* black shirt */}
        <path
          d="M80 144 Q100 138 120 144 L127 246 Q100 252 73 246 Z"
          fill="#1d1d22"
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <path d="M92 142 L100 158 L108 142" fill="none" stroke="#3a3a44" strokeWidth={3.5} strokeLinejoin="round" />
        {[170, 190, 210, 230].map((y) => (
          <circle key={y} cx={100} cy={y} r={2.4} fill="#cfcfd6" />
        ))}
        {/* white mundu, sways while walking */}
        <g transform="translate(100 238)">
          <g className="sm-joint sm-skirt">
            <path
              d="M-30 0 Q0 -5 30 0 L37 76 Q0 84 -37 76 Z"
              fill="#fbf7ee"
              stroke={INK}
              strokeWidth={5}
              strokeLinejoin="round"
            />
            <path d="M-31 9 Q0 4 31 9" fill="none" stroke="#e7c770" strokeWidth={4} />
            <path d="M12 12 Q16 44 10 78" fill="none" stroke="#d9d2c0" strokeWidth={3} />
          </g>
        </g>
      </g>
    );
  }
  return (
    <g>
      {/* white halter top with a little peplum */}
      <path d="M96 138 L84 152 M104 138 L116 152" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <path
        d="M82 150 Q100 162 118 150 L117 214 Q132 236 128 250 Q100 258 72 250 Q68 236 83 214 Z"
        fill="#fffdf8"
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path d="M84 214 Q100 220 116 214" fill="none" stroke="#e9e2d6" strokeWidth={3.5} />
      <path d="M100 160 L100 196" stroke="#efe8dc" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

export default function Stickman({
  who,
  walking = false,
  leftArm = 8,
  rightArm = -8,
  waveLeft,
  waveRight,
  headTilt = 0,
  hop,
  className = "",
  style,
  children,
  leftHandItem,
  rightHandItem,
}: StickmanProps) {
  const h = heads[who];
  return (
    <svg
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
      className={`overflow-visible ${walking ? "sm-walking" : "sm-idle"} ${className}`}
      style={style}
      role="img"
      aria-label={who === "abhinav" ? "Stick figure Abhinav" : "Stick figure Angel"}
    >
      {/* ground shadow */}
      <ellipse cx={100} cy={378} rx={62} ry={8} fill={INK} opacity={0.14} />
      <g className={hop ? "sm-hop" : undefined}>
        <g className="sm-body">
          <g filter="url(#boil)">
            <Leg side="l" who={who} />
            <Leg side="r" who={who} />
            {/* neck */}
            <path d="M100 120 L100 150" stroke={INK} strokeWidth={9} strokeLinecap="round" />
            <Torso who={who} />
          </g>
          {/* head pivots on the chin */}
          <g transform="translate(100 140)">
            <g className="sm-joint sm-pose" style={{ transform: `rotate(${headTilt}deg)` }}>
              <g className="sm-joint sm-head">
                <image
                  href={h.src}
                  x={-h.cx * HEAD}
                  y={-h.cy * HEAD}
                  width={HEAD}
                  height={HEAD}
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            </g>
          </g>
          {/* arms go over the head so raised arms never vanish behind hair */}
          <g filter="url(#boil)">
            <Arm side="l" angle={leftArm} waving={waveLeft} who={who} item={leftHandItem} />
            <Arm side="r" angle={rightArm} waving={waveRight} who={who} item={rightHandItem} />
          </g>
          {children}
        </g>
      </g>
    </svg>
  );
}

/** Shared SVG filters; render once per page. */
export function StickDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        {/* "line boil" — makes strokes look hand-drawn and alive */}
        <filter id="boil" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1" result="n">
            <animate attributeName="seed" values="1;7;13;4" dur="0.48s" calcMode="discrete" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" />
        </filter>
      </defs>
    </svg>
  );
}
