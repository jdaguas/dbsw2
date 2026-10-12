// The Zine style's paper pieces: cut-out letters, scraps, tape, star stickers,
// and a rubber stamp. Everything else in the style is built from these.

export const zine = {
  pink: "#d1126f",
  ink: "#141414",
  paper: "#fbf6ea",
  newsprint: "#ece5d3",
  yellow: "#ffd60a",
  blue: "#2340ff",
  lilac: "#b69cff",
  mint: "#3ddc97",
  tomato: "#ff4d2e",
  tape: "#e8dcb5",
  pencil: "#8a8378", // missed marks and empty outlines (3:1 on paper)
};

export function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Seeded random in [0, 1). Integer math, so server and browser agree.
export function rand(seed: number) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function seedOf(text: string) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return h;
}

// A shape cut with scissors: four corners, none quite square.
export function cutClip(seed: number) {
  const j = (i: number) => (rand(seed + i) * 4).toFixed(1);
  return `polygon(${j(1)}% ${j(2)}%, ${100 - +j(3)}% ${j(4)}%, 100% ${100 - +j(5)}%, ${j(6)}% 100%)`;
}

// Ragged ends, like tape torn off the roll.
export const tapeClip =
  "polygon(0 10%, 3% 0, 97% 4%, 100% 0, 98% 30%, 100% 55%, 97% 80%, 100% 100%, 3% 96%, 0 100%, 2% 70%, 0 45%, 3% 25%)";

// A ragged bottom edge, like paper torn off a pad.
export const tornClip = `polygon(0 0, 100% 0, 100% 96%, ${Array.from({ length: 15 }, (_, i) => {
  const x = 100 - (i + 1) * (100 / 16);
  return `${x.toFixed(1)}% ${i % 2 ? 96 : 99.5}%`;
}).join(", ")}, 0 97%)`;

export const photocopyShadow = "drop-shadow(3px 3px 0 #141414)";

// ---------------------------------------------------------------------------
// Cut-out letters, ransom-note style. Each letter is its own scrap.

const cutFonts = ["var(--font-abril)", "var(--font-londrina)", "var(--font-anton)", "var(--font-special-elite)"];
const cutColors: [string, string][] = [
  ["#ffffff", zine.ink],
  [zine.newsprint, zine.ink],
  [zine.ink, "#ffffff"],
  ["#ffffff", zine.ink],
  [zine.pink, "#ffffff"],
  [zine.newsprint, zine.ink],
  [zine.yellow, zine.ink],
];

export function CutOut({ text, size = 48, className }: { text: string; size?: number; className?: string }) {
  const base = seedOf(text);
  return (
    <span className={cx("inline-flex flex-wrap items-end gap-y-2", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex flex-wrap items-end gap-x-1 gap-y-2">
        {[...text].map((ch, i) => {
          if (ch === " ") return <span key={i} style={{ width: size * 0.3 }} />;
          const r = (k: number) => rand(base + i * 7 + k);
          const [bg, fg] = cutColors[Math.floor(r(1) * cutColors.length)];
          const font = cutFonts[Math.floor(r(2) * cutFonts.length)];
          const scale = 0.85 + r(3) * 0.3;
          return (
            <span
              key={i}
              style={{ filter: "drop-shadow(1.5px 1.5px 0 rgba(20,20,20,0.35))", rotate: `${(r(4) - 0.5) * 10}deg` }}
              className="inline-block"
            >
              <span
                style={{
                  backgroundColor: bg,
                  color: fg,
                  fontFamily: font,
                  fontSize: size * scale,
                  clipPath: cutClip(base + i),
                  lineHeight: 1,
                }}
                className="inline-block px-[0.12em] pt-[0.1em] pb-[0.06em] uppercase"
              >
                {ch}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

// A word typed on a strip of paper and pasted down.
export function Scrap({
  children,
  tilt = 0,
  dark = false,
  className,
}: {
  children: React.ReactNode;
  tilt?: number;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span style={{ rotate: `${tilt}deg`, filter: "drop-shadow(1.5px 1.5px 0 rgba(20,20,20,0.3))" }} className="inline-block">
      <span
        style={{ clipPath: cutClip(seedOf(String(children)) + 3) }}
        className={cx(
          "inline-block px-2 py-0.5 font-(family-name:--font-label) text-sm",
          dark ? "bg-[#141414] text-white" : "bg-white text-[#141414]",
          className,
        )}
      >
        {children}
      </span>
    </span>
  );
}

export function Tape({ className, tilt = -4 }: { className?: string; tilt?: number }) {
  return (
    <span
      aria-hidden
      style={{ backgroundColor: zine.tape, clipPath: tapeClip, rotate: `${tilt}deg` }}
      className={cx("absolute block h-6 w-20 opacity-85", className)}
    />
  );
}

// ---------------------------------------------------------------------------
// Star sticker: die-cut with a white border and a foil sheen.

export function starPoints(outer = 46, inner = 20) {
  return Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(52 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

export function StarSticker({
  color = zine.yellow,
  size = 40,
  tilt = 0,
  children,
  outline = false,
}: {
  color?: string;
  size?: number;
  tilt?: number;
  children?: React.ReactNode;
  // Just the dashed die-cut line, where a sticker would go.
  outline?: boolean;
}) {
  const pts = starPoints();
  const id = `foil-${color.slice(1)}`;
  return (
    <span
      className="relative inline-grid place-items-center"
      style={{
        width: size,
        height: size,
        rotate: `${tilt}deg`,
        filter: outline ? undefined : "drop-shadow(1.5px 2px 0 rgba(20,20,20,0.35))",
      }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden>
        {outline ? (
          <polygon points={pts} fill="none" stroke={zine.pencil} strokeWidth="3" strokeDasharray="6 5" strokeLinejoin="round" />
        ) : (
          <>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="white" stopOpacity="0.55" />
                <stop offset="0.45" stopColor="white" stopOpacity="0" />
                <stop offset="0.7" stopColor="white" stopOpacity="0.25" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={pts} fill="white" stroke="white" strokeWidth="10" strokeLinejoin="round" />
            <polygon points={pts} fill={color} />
            <polygon points={pts} fill={`url(#${id})`} />
          </>
        )}
      </svg>
      {children && (
        <span className="relative mt-[8%] font-(family-name:--font-londrina) font-black text-[#141414]" style={{ fontSize: size * 0.3 }}>
          {children}
        </span>
      )}
    </span>
  );
}

// A rubber stamp: inked letters in a box, a little crooked and uneven.
export function Stamp({ children, color = zine.pink, tilt = -6 }: { children: React.ReactNode; color?: string; tilt?: number }) {
  return (
    <span
      style={{
        color,
        borderColor: color,
        rotate: `${tilt}deg`,
        maskImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.2 2.1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
      className="inline-block border-[3px] px-2.5 py-0.5 font-(family-name:--font-label) text-sm font-bold tracking-[0.2em] uppercase"
    >
      {children}
    </span>
  );
}

// Roughens SVG strokes so they look drawn by hand.
export function Rough({ id, scale = 2.5 }: { id: string; scale?: number }) {
  return (
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale={scale} />
    </filter>
  );
}
