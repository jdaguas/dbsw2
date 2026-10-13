// Agent-made mood board artifacts, drawn in code instead of collected as images.
// Each tile fills a 4:3 box and can use the style's theme variables.

const orbit = {
  orange: "#b53e15",
  teal: "#1f6f78",
  mustard: "#e8a33d",
  navy: "#1c2a4a",
  chrome: "#b9bcbf",
  screen: "#16182a",
  phosphor: "#9fe3c4",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-(family-name:--font-label) text-[11px] tracking-[0.2em] uppercase">
      {children}
    </span>
  );
}

const orbitTiles: Record<string, () => React.ReactNode> = {
  "orbit/headline": () => (
    <div className="flex h-full flex-col justify-between p-6">
      <Label>display · michroma · capitals</Label>
      <p className="font-(family-name:--font-display) text-3xl leading-tight tracking-wide uppercase">
        Day 21
        <br />
        in orbit
      </p>
      <p className="font-(family-name:--font-body) text-sm text-(--muted)">
        Body in Jost 400, 16px, for everything you read.
      </p>
    </div>
  ),

  "orbit/labels": () => (
    <div className="flex h-full flex-col justify-center gap-3 p-6">
      {[
        ["t-minus", "04:12:00"],
        ["streak", "21 days"],
        ["window", "morning"],
        ["status", "go"],
      ].map(([k, v]) => (
        <div key={k} className="flex justify-between border-b border-(--border) pb-2">
          <Label>{k}</Label>
          <Label>{v}</Label>
        </div>
      ))}
    </div>
  ),

  "orbit/palette": () => (
    <div className="grid h-full grid-cols-3 gap-3 p-6">
      {[
        ["background", "#f3ead8"],
        ["surface", "#fbf6ec"],
        ["border", "#ddd0b8"],
        ["text", "#1c1a2e"],
        ["muted", "#5f5a6b"],
        ["accent", "#b53e15"],
      ].map(([name, hex]) => (
        <div key={name} className="flex flex-col gap-1">
          <div style={{ backgroundColor: hex }} className="flex-1 rounded-2xl border border-(--border)" />
          <Label>{name}</Label>
        </div>
      ))}
    </div>
  ),

  "orbit/materials": () => (
    <div className="flex h-full items-center justify-center gap-3 p-6">
      {[
        ["orange", orbit.orange],
        ["teal", orbit.teal],
        ["mustard", orbit.mustard],
        ["navy", orbit.navy],
        ["chrome", orbit.chrome],
      ].map(([name, hex]) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <div style={{ backgroundColor: hex }} className="h-24 w-10 rounded-full" />
          <Label>{name}</Label>
        </div>
      ))}
    </div>
  ),

  // A rounded CRT screen, like a 1960s TV or mission control monitor.
  "orbit/console": () => (
    <div className="flex h-full items-center justify-center p-5">
      <div style={{ backgroundColor: orbit.chrome }} className="w-full rounded-[2.5rem] p-3">
        <div
          style={{ backgroundColor: orbit.screen, color: orbit.phosphor }}
          className="rounded-[2rem/2.5rem] px-6 py-5"
        >
          <Label>today · 2 of 4 goals</Label>
          {[
            ["water", "5/8 glasses"],
            ["read", "20/20 pp"],
            ["exercise", "30/30 min"],
            ["mood", "—"],
          ].map(([habit, status]) => (
            <div key={habit} className="mt-1.5 flex justify-between border-t border-current/20 pt-1.5">
              <Label>{habit}</Label>
              <Label>{status}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  "orbit/buttons": () => (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <span className="rounded-full bg-(--accent) px-8 py-3 font-(family-name:--font-body) font-medium text-white">
        Check in
      </span>
      <span className="rounded-full border-2 border-(--text) px-8 py-3 font-(family-name:--font-body) font-medium">
        Skip today
      </span>
    </div>
  ),

  "orbit/card": () => (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full rounded-[2.5rem_2.5rem_2.5rem_0.75rem] border border-(--border) bg-(--background) p-6">
        <Label>morning · 07:30</Label>
        <p className="mt-2 font-(family-name:--font-display) text-lg tracking-wide uppercase">Read 20 pages</p>
        <p className="mt-1 font-(family-name:--font-body) text-sm text-(--muted)">21 day streak</p>
      </div>
    </div>
  ),

  // The streak as a planet on an orbit ring: 21 of 30 days = 70% of the way round.
  "orbit/orbit": () => {
    const angle = -Math.PI / 2 + 0.7 * 2 * Math.PI;
    const x = 100 + 80 * Math.cos(angle);
    const y = 60 + 36 * Math.sin(angle);
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <svg viewBox="0 0 200 120" className="w-full">
          <ellipse cx="100" cy="60" rx="80" ry="36" fill="none" stroke="#ddd0b8" strokeWidth="3" />
          <circle cx="100" cy="60" r="22" fill={orbit.mustard} />
          <circle cx={x} cy={y} r="9" fill={orbit.orange} />
        </svg>
        <p className="font-(family-name:--font-display) text-2xl tracking-wide">21</p>
        <Label>of 30 days</Label>
      </div>
    );
  },
};

// Zine: crayon, cut paper, tape, star stickers.

const zine = {
  pink: "#d1126f",
  yellow: "#ffd60a",
  blue: "#2340ff",
  lilac: "#b69cff",
  mint: "#3ddc97",
  tomato: "#ff4d2e",
  tape: "#e8dcb5",
  ink: "#141414",
};

// Roughens SVG strokes so they look like crayon or colored pencil.
function Crayon({ id, scale = 3 }: { id: string; scale?: number }) {
  return (
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale={scale} />
    </filter>
  );
}

function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      style={{ backgroundColor: zine.tape }}
      className={`absolute h-5 w-16 opacity-80 shadow-sm ${className}`}
    />
  );
}

// A five-point star sticker, with a light sheen like foil.
function Star({ color, size = 40, tilt = 0 }: { color: string; size?: number; tilt?: number }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? 19 : 48;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ rotate: `${tilt}deg` }}>
      <polygon points={points} fill={color} stroke={zine.ink} strokeWidth="3" strokeLinejoin="round" />
      <polygon points={points} fill="white" opacity="0.25" transform="translate(50 50) scale(0.45) translate(-62 -66)" />
    </svg>
  );
}

// A word typed on a strip of paper and pasted down.
function Scrap({ children, tilt = 0 }: { children: React.ReactNode; tilt?: number }) {
  return (
    <span
      style={{ rotate: `${tilt}deg` }}
      className="inline-block bg-white px-2 py-0.5 font-(family-name:--font-label) text-sm text-(--text) shadow-sm"
    >
      {children}
    </span>
  );
}

// A ragged bottom edge, like paper torn off a pad.
const torn = `polygon(0 0, 100% 0, 100% 92%, ${Array.from({ length: 13 }, (_, i) => {
  const x = 100 - (i + 1) * (100 / 14);
  const y = i % 2 ? 92 : 98;
  return `${x.toFixed(1)}% ${y}%`;
}).join(", ")}, 0 94%)`;

const zineTiles: Record<string, () => React.ReactNode> = {
  "zine/headline": () => (
    <div className="relative flex h-full flex-col items-start justify-center gap-1 p-6 font-(family-name:--font-display) font-black uppercase">
      <span style={{ backgroundColor: zine.yellow }} className="-rotate-3 px-2 text-3xl leading-tight">
        drink
      </span>
      <span style={{ backgroundColor: zine.blue }} className="ml-6 rotate-2 px-2 text-3xl leading-tight text-white">
        more
      </span>
      <span className="text-6xl leading-none">water!</span>
      <span className="absolute top-4 right-5">
        <Star color={zine.lilac} size={34} tilt={12} />
      </span>
      <span className="absolute right-12 bottom-6">
        <Star color={zine.pink} size={26} tilt={-10} />
      </span>
    </div>
  ),

  "zine/labels": () => (
    <div style={{ backgroundColor: zine.ink }} className="flex h-full flex-col justify-center gap-4 p-6 text-white">
      <p className="font-(family-name:--font-body) text-2xl leading-snug">read 12 pages before bed, the good chapter</p>
      <div className="flex flex-wrap gap-2">
        <Scrap tilt={-2}>water</Scrap>
        <Scrap tilt={1.5}>5 of 8</Scrap>
        <Scrap tilt={-1}>goal met</Scrap>
      </div>
    </div>
  ),

  "zine/palette": () => (
    <div className="grid h-full grid-cols-3 gap-4 p-6">
      {[
        ["background", "#fbf6ea", -3],
        ["surface", "#ffffff", 2],
        ["border", "#141414", -1],
        ["text", "#141414", 3],
        ["muted", "#57514a", -2],
        ["accent", "#d1126f", 1],
      ].map(([name, hex, tilt]) => (
        <div key={name} style={{ rotate: `${tilt}deg` }} className="flex flex-col">
          <div style={{ backgroundColor: hex as string, clipPath: torn }} className="flex-1 border-2 border-(--text)" />
          <span className="mt-1 font-(family-name:--font-label) text-[11px]">{name}</span>
        </div>
      ))}
    </div>
  ),

  "zine/stickers": () => (
    <div className="flex h-full flex-wrap items-center justify-center gap-x-4 gap-y-2 p-6">
      {[
        ["yellow", zine.yellow, -8],
        ["blue", zine.blue, 6],
        ["lilac", zine.lilac, -3],
        ["mint", zine.mint, 10],
        ["tomato", zine.tomato, -12],
      ].map(([name, hex, tilt]) => (
        <div key={name} className="flex flex-col items-center gap-1">
          <Star color={hex as string} size={56} tilt={tilt as number} />
          <span className="font-(family-name:--font-label) text-xs">{name}</span>
        </div>
      ))}
    </div>
  ),

  // Doodled glasses: the first five hatched in blue pencil.
  "zine/glasses": () => (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
      <svg viewBox="0 0 248 44" className="w-full">
        <defs>
          <Crayon id="zine-glass" scale={2} />
          <pattern id="zine-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="5" stroke={zine.blue} strokeWidth="2.5" />
          </pattern>
        </defs>
        {Array.from({ length: 8 }, (_, i) => {
          const x = 4 + i * 30;
          return (
            <g key={i} filter="url(#zine-glass)">
              {i < 5 && <path d={`M${x + 1.5} 14 L${x + 22.5} 14 L${x + 20} 39 L${x + 4} 39 Z`} fill="url(#zine-hatch)" />}
              <path
                d={`M${x} 4 L${x + 24} 4 L${x + 21} 40 L${x + 3} 40 Z`}
                fill="none"
                stroke={zine.ink}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>
      <p className="font-(family-name:--font-body) text-xl font-bold">5 of 8 glasses</p>
    </div>
  ),

  "zine/buttons": () => (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-6">
      <span
        style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px", boxShadow: `4px 4px 0 ${zine.ink}` }}
        className="-rotate-2 border-2 border-(--text) bg-(--accent) px-8 py-2 font-(family-name:--font-display) text-2xl font-black text-white uppercase"
      >
        log it!
      </span>
      <span
        style={{ backgroundColor: zine.tape }}
        className="rotate-1 px-5 py-1.5 font-(family-name:--font-label) text-sm tracking-wide opacity-90"
      >
        skip today
      </span>
    </div>
  ),

  "zine/card": () => (
    <div className="relative flex h-full items-center justify-center p-6">
      <div style={{ clipPath: torn }} className="w-full rotate-1 border-2 border-(--text) bg-(--surface) px-6 pt-6 pb-8">
        <Scrap tilt={-2}>reading</Scrap>
        <p className="mt-1 font-(family-name:--font-body) text-2xl font-bold">20 of 20 pages</p>
        <svg viewBox="0 0 200 14" className="mt-2 w-full">
          <defs>
            <Crayon id="zine-progress" />
          </defs>
          <path d="M4 7 L196 7" stroke={zine.mint} strokeWidth="9" strokeLinecap="round" filter="url(#zine-progress)" />
        </svg>
      </div>
      <Tape className="top-4 left-8 -rotate-12" />
      <span className="absolute top-3 right-5">
        <Star color={zine.yellow} size={52} tilt={14} />
      </span>
    </div>
  ),

  // Five faces from sad to happy; the fourth is circled in pink crayon.
  "zine/mood": () => (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
      <svg viewBox="0 0 250 60" className="w-full">
        <defs>
          <Crayon id="zine-mood" scale={2} />
        </defs>
        <g filter="url(#zine-mood)" fill="none" stroke={zine.ink} strokeWidth="2.5" strokeLinecap="round">
          {[-6, -3, 0, 3, 6].map((curve, i) => {
            const cx = 25 + i * 50;
            return (
              <g key={i}>
                <circle cx={cx} cy="30" r="16" />
                <circle cx={cx - 5} cy="26" r="1" fill={zine.ink} />
                <circle cx={cx + 5} cy="26" r="1" fill={zine.ink} />
                <path d={`M${cx - 7} ${36 - curve / 3} Q ${cx} ${36 + curve}, ${cx + 7} ${36 - curve / 3}`} />
              </g>
            );
          })}
          <ellipse cx="175" cy="30" rx="23" ry="25" stroke={zine.pink} strokeWidth="3.5" transform="rotate(-8 175 30)" />
        </g>
      </svg>
      <p className="font-(family-name:--font-body) text-xl font-bold">pretty good today</p>
    </div>
  ),
};

// Glass: frosted panes over blurred violet, blue, and orange light.

const glass = {
  orange: "#ff8a3d",
  violet: "#a98bff",
  violetDeep: "#6a3df0",
  blue: "#5cc8ff",
  blueDeep: "#2a6bf0",
  night: "#120c2a",
  ink: "#1a1033",
};

const glassSpectrum = `linear-gradient(90deg, ${glass.blue}, ${glass.violet} 50%, ${glass.orange})`;
const glassPane =
  "border border-white/15 bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_12px_40px_rgba(8,4,28,0.45)] backdrop-blur-xl";

// The dusk sky each glass tile sits on: three blurred blobs of light.
function Sky({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: glass.night }} className="relative h-full overflow-hidden text-[#f5f2ff]">
      <span style={{ backgroundColor: glass.violet }} className="absolute -top-8 -left-6 size-36 rounded-full opacity-70 blur-2xl" />
      <span style={{ backgroundColor: glass.orange }} className="absolute -right-6 -bottom-10 size-40 rounded-full opacity-60 blur-2xl" />
      <span style={{ backgroundColor: glass.blue }} className="absolute top-6 right-10 size-24 rounded-full opacity-50 blur-2xl" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

function GlassFace({ curve, tint, size = 40 }: { curve: number; tint: string; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        backgroundImage: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85), ${tint} 45%, ${tint}99 100%)`,
      }}
      className="grid place-items-center rounded-full border border-white/40"
    >
      <svg viewBox="0 0 40 40" width={size * 0.62}>
        <g fill="none" stroke={glass.ink} strokeWidth="2.6" strokeLinecap="round">
          <circle cx="14" cy="16" r="1.2" fill={glass.ink} />
          <circle cx="26" cy="16" r="1.2" fill={glass.ink} />
          <path d={`M12 ${26 - curve / 3} Q 20 ${26 + curve}, 28 ${26 - curve / 3}`} />
        </g>
      </svg>
    </span>
  );
}

const glassTiles: Record<string, () => React.ReactNode> = {
  "glass/headline": () => (
    <Sky>
      <div className="flex h-full flex-col justify-between p-6">
        <Label>display · outfit · light</Label>
        <p className="font-(family-name:--font-display) text-5xl leading-none font-extralight tracking-tight">
          Good
          <br />
          morning
        </p>
        <p className="font-(family-name:--font-body) text-sm text-[#b7acdc]">Body in DM Sans 400, 16px, for everything you read.</p>
      </div>
    </Sky>
  ),

  "glass/labels": () => (
    <Sky>
      <div className="flex h-full items-center p-5">
        <div className={`${glassPane} flex w-full flex-col gap-2.5 rounded-[1.5rem] p-5`}>
          {[
            ["water", "5 of 8"],
            ["streak", "21 days"],
            ["timer", "12:04"],
            ["status", "goal met"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-white/10 pb-2 last:border-0 last:pb-0">
              <Label>{k}</Label>
              <Label>{v}</Label>
            </div>
          ))}
        </div>
      </div>
    </Sky>
  ),

  "glass/palette": () => (
    <div style={{ backgroundColor: glass.night }} className="grid h-full grid-cols-3 gap-3 p-6 text-[#f5f2ff]">
      {[
        ["background", "#120c2a"],
        ["surface", "#241a4d"],
        ["border", "#5a4d94"],
        ["text", "#f5f2ff"],
        ["muted", "#b7acdc"],
        ["accent", "#ff8a3d"],
      ].map(([name, hex]) => (
        <div key={name} className="flex flex-col gap-1">
          <div style={{ backgroundColor: hex }} className="flex-1 rounded-2xl border border-white/20" />
          {/* Tighter than Label, so "background" fits under its swatch. */}
          <span className="font-(family-name:--font-label) text-[10px] uppercase">{name}</span>
        </div>
      ))}
    </div>
  ),

  "glass/spectrum": () => (
    <Sky>
      <div className="flex h-full flex-col justify-center gap-5 p-6">
        <div className="flex justify-center gap-5">
          {[
            ["blue", glass.blue],
            ["violet", glass.violet],
            ["orange", glass.orange],
          ].map(([name, hex]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <span
                style={{ backgroundImage: `radial-gradient(circle at 32% 28%, #fff, ${hex} 50%)` }}
                className="size-14 rounded-full border border-white/40"
              />
              <Label>{name}</Label>
            </div>
          ))}
        </div>
        <div style={{ backgroundImage: glassSpectrum }} className="h-3 rounded-full shadow-[0_0_16px_rgba(255,138,61,0.5)]" />
      </div>
    </Sky>
  ),

  // The anatomy of a pane, with its four ingredients called out.
  "glass/pane": () => (
    <Sky>
      <div className="flex h-full items-center justify-center p-6">
        <div className={`${glassPane} relative w-full rounded-[1.75rem] p-5`}>
          <Label>reading · mind</Label>
          <p className="mt-1 font-(family-name:--font-display) text-2xl font-light">12 / 20 pages</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["white 8%", "blur 24", "top edge", "28px"].map((t) => (
              <span key={t} className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-(family-name:--font-label) text-[10px]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Sky>
  ),

  "glass/buttons": () => (
    <Sky>
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
        <span className="rounded-full border border-white/40 bg-[linear-gradient(180deg,#ffa865,#ff8a3d)] px-8 py-3 font-(family-name:--font-body) font-semibold text-[#1a1033] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_0_28px_rgba(255,138,61,0.6)]">
          Log
        </span>
        <span className={`${glassPane} rounded-full px-8 py-3 font-(family-name:--font-body) font-semibold`}>Undo</span>
      </div>
    </Sky>
  ),

  // 25 of 30 minutes: the ring is most of the way round and turning orange.
  "glass/progress": () => {
    const t = 25 / 30;
    const ring = "radial-gradient(farthest-side, transparent calc(100% - 12px), #000 calc(100% - 11px))";
    return (
      <Sky>
        <div className="flex h-full items-center justify-center gap-6 p-6">
          <div className="relative grid size-32 place-items-center">
            <div className="absolute inset-0 overflow-hidden rounded-full" style={{ mask: ring, WebkitMask: ring }}>
              <div className="absolute inset-0 bg-white/10" />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `conic-gradient(${glass.blue}, ${glass.violet} 50%, ${glass.orange})`,
                  mask: `conic-gradient(#000 ${t * 360}deg, transparent 0)`,
                  WebkitMask: `conic-gradient(#000 ${t * 360}deg, transparent 0)`,
                }}
              />
            </div>
            <p className="relative font-(family-name:--font-display) text-3xl font-light">25</p>
          </div>
          <div className="flex flex-col gap-1">
            <Label>exercise</Label>
            <Label>of 30 min</Label>
          </div>
        </div>
      </Sky>
    );
  },

  // Five bubbles from rough to great; "good" is today's, lifted and ringed.
  "glass/mood": () => (
    <Sky>
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <div className="flex items-center gap-2">
          {(
            [
              [-6, glass.blueDeep],
              [-3, glass.blue],
              [0, glass.violet],
              [3, "#ff9a7a"],
              [6, glass.orange],
            ] as const
          ).map(([curve, tint], i) => (
            <span
              key={i}
              className={i === 3 ? "scale-125 rounded-full ring-2 ring-white/80 ring-offset-2 ring-offset-transparent" : "opacity-60"}
            >
              <GlassFace curve={curve} tint={tint} />
            </span>
          ))}
        </div>
        <p className="font-(family-name:--font-body) text-lg">Good today</p>
      </div>
    </Sky>
  ),
};

export const tiles: Record<string, () => React.ReactNode> = { ...orbitTiles, ...zineTiles, ...glassTiles };
