"use client";

// Zine's habit-tracker pieces: today's cover, one way to log and see each
// habit, and the star chart for streaks.

import { useEffect, useState } from "react";
import type { ForcedState } from "@/components/orbit/tokens";
import { CutOut, cx, rand, Rough, Scrap, StarSticker, Stamp, Tape, tornClip, zine } from "./paper";
import { Key } from "./ui";

const note = "font-(family-name:--font-reenie) text-2xl leading-none";
const typed = "font-(family-name:--font-label) text-sm uppercase";

// A sheet of paper taped down: the frame for each habit piece.
export function Sheet({ children, className, dark }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={cx("relative pt-3", className)}>
      <Tape className="top-0 left-6" tilt={-6} />
      <div
        style={{ clipPath: tornClip }}
        className={cx("border-2 border-[#141414] px-5 pt-5 pb-8", dark ? "bg-[#141414] text-white" : "bg-white")}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Today's cover: cut-out title, typed rows, handwritten numbers, stars on goals met.

export function TodayCover() {
  const rows: [string, string, boolean][] = [
    ["Water", "5 of 8", false],
    ["Read", "20 of 20 pp", true],
    ["Exercise", "25 of 30 min", false],
    ["Mood", "good", true],
  ];
  return (
    <Sheet dark>
      <div className="flex items-start justify-between">
        <CutOut text="today" size={34} />
        <span className={`${typed} text-white/70`}>Fri · Oct 10</span>
      </div>
      <ul className="mt-5 flex flex-col gap-2.5">
        {rows.map(([name, value, met], i) => (
          <li key={name} className="flex items-center gap-3">
            <Scrap tilt={i % 2 ? 1.5 : -1.5}>{name}</Scrap>
            <span className="flex-1 border-b border-dashed border-white/30" />
            <span className={`${note} text-white`}>{value}</span>
            <span className="w-7">{met && <StarSticker size={26} tilt={i * 17} color={i === 1 ? zine.yellow : zine.mint} />}</span>
          </li>
        ))}
      </ul>
      <p className={`${note} mt-4 text-[#ffd60a]`}>2 of 4 done, keep going</p>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Water: hand-drawn glasses, hatched in riso blue as you drink.

type GlassLook = "empty" | "full" | "preview";

export function Glass({
  look,
  index = 0,
  forced,
  disabled,
  ...props
}: { look: GlassLook; index?: number; forced?: ForcedState; disabled?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const id = `glass-${index}-${look}-${forced ?? ""}${disabled ? "d" : ""}`;
  const fill = look === "full" || forced === "pressed" ? 1 : look === "preview" || forced === "hover" ? 0.35 : 0;
  return (
    <button
      type="button"
      disabled={disabled}
      className={cx(
        "rounded-sm transition-transform",
        disabled ? "cursor-not-allowed opacity-40" : "hover:-rotate-3 active:scale-95",
        forced === "pressed" && "scale-95",
        forced === "focus"
          ? "outline-2 outline-dashed outline-offset-4 outline-[#141414]"
          : "focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-4 focus-visible:outline-[#141414]",
      )}
      {...props}
    >
      <svg viewBox="0 0 32 48" className="h-14 w-9" aria-hidden>
        <defs>
          <Rough id={id} scale={2} />
          <pattern id={`${id}-h`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="5" stroke={zine.blue} strokeWidth="3" />
          </pattern>
        </defs>
        <g filter={`url(#${id})`}>
          {fill > 0 && <path d="M5 14 L27 14 L25 44 L7 44 Z" fill={`url(#${id}-h)`} opacity={fill} />}
          <path d="M3 4 L29 4 L26 45 L6 45 Z" fill="none" stroke={zine.ink} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      </svg>
    </button>
  );
}

export function WaterGlasses({ goal = 8, initial = 5 }: { goal?: number; initial?: number }) {
  const [count, setCount] = useState(initial);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-0.5" onMouseLeave={() => setHover(null)}>
        {Array.from({ length: goal }, (_, i) => {
          const full = i < count;
          return (
            <Glass
              key={i}
              index={i}
              look={full ? "full" : hover !== null && i <= hover ? "preview" : "empty"}
              aria-label={full && i === count - 1 ? `Empty glass ${i + 1}` : `Fill to ${i + 1} glasses`}
              onMouseEnter={() => setHover(i)}
              onClick={() => setCount(i + 1 === count ? i : i + 1)}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <span className={note} aria-live="polite">
          {count} of {goal} glasses
        </span>
        {count >= goal && <StarSticker size={32} tilt={-12} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reading: a yellow highlighter stroke along a ruled line, 0 to the goal.

export function PageHighlighter({ goal = 20, initial = 12 }: { goal?: number; initial?: number }) {
  const [pages, setPages] = useState(initial);
  const t = Math.min(pages / goal, 1);
  const ticks = [0, goal / 4, goal / 2, (goal * 3) / 4, goal];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <span className="font-(family-name:--font-abril) text-4xl" aria-live="polite">
          {pages}
        </span>
        <span className={typed}>/ {goal} pages</span>
        {pages >= goal && <Stamp tilt={-8}>Done</Stamp>}
      </div>
      <svg viewBox="0 0 220 44" className="w-full max-w-60" aria-hidden>
        <defs>
          <Rough id="read-rough" scale={3} />
        </defs>
        <path
          d={`M6 18 L${6 + 208 * t} 18`}
          stroke={zine.yellow}
          strokeWidth="16"
          strokeLinecap="square"
          opacity="0.9"
          filter="url(#read-rough)"
          style={{ transition: "d 200ms" }}
        />
        <line x1="4" y1="26" x2="216" y2="26" stroke={zine.ink} strokeWidth="1.5" />
        {ticks.map((p, i) => (
          <g key={i}>
            <line x1={6 + 208 * (p / goal)} y1="22" x2={6 + 208 * (p / goal)} y2="30" stroke={zine.ink} strokeWidth="1.5" />
            <text x={6 + 208 * (p / goal)} y="42" textAnchor="middle" fontSize="11" fontFamily="var(--font-reenie)" fill={zine.ink}>
              {p}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex gap-2">
        <Key variant="secondary" aria-label="One page fewer" onClick={() => setPages((p) => Math.max(0, p - 1))}>
          −1
        </Key>
        <Key variant="secondary" onClick={() => setPages((p) => p + 1)}>
          +1
        </Key>
        <Key variant="secondary" onClick={() => setPages((p) => p + 10)}>
          +10
        </Key>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exercise: a hand-drawn clock; the minutes fill in as a wedge of pink halftone.

export function ExerciseClock({ goal = 30, initial = 25 }: { goal?: number; initial?: number }) {
  const [minutes, setMinutes] = useState(initial);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const total = minutes + Math.floor(seconds / 60);
  const t = Math.min(total / goal, 1);
  const a = t * 2 * Math.PI - Math.PI / 2;
  const [x, y] = [50 + 40 * Math.cos(a), 50 + 40 * Math.sin(a)];
  const wedge =
    t >= 1 ? "M50 10 A40 40 0 1 1 49.99 10 Z" : `M50 50 L50 10 A40 40 0 ${t > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`;

  function toggleTimer() {
    if (running) {
      setMinutes(total);
      setSeconds(0);
    }
    setRunning(!running);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 100 100" className="size-28" aria-hidden>
          <defs>
            <Rough id="clock-rough" scale={2.5} />
            <pattern id="halftone" width="5" height="5" patternUnits="userSpaceOnUse">
              <circle cx="2.5" cy="2.5" r="1.6" fill={zine.pink} />
            </pattern>
          </defs>
          <path d={wedge} fill="url(#halftone)" />
          <g filter="url(#clock-rough)" fill="none" stroke={zine.ink} strokeLinecap="round">
            <circle cx="50" cy="50" r="42" strokeWidth="2.5" />
            {Array.from({ length: 12 }, (_, i) => {
              const ta = (i / 12) * 2 * Math.PI;
              return (
                <line
                  key={i}
                  x1={50 + 36 * Math.sin(ta)}
                  y1={50 - 36 * Math.cos(ta)}
                  x2={50 + 41 * Math.sin(ta)}
                  y2={50 - 41 * Math.cos(ta)}
                  strokeWidth={i % 3 ? 1.5 : 3}
                />
              );
            })}
            <line x1="50" y1="50" x2={x} y2={y} strokeWidth="3.5" />
          </g>
          <circle cx="50" cy="50" r="3" fill={zine.ink} />
        </svg>
        <div className="flex flex-col items-start gap-1">
          <span className={note} aria-live="polite">
            {total} of {goal} min
          </span>
          {running && (
            <span className={`${typed} bg-[#141414] px-1.5 text-white`}>
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
            </span>
          )}
          {total >= goal && <StarSticker size={30} tilt={8} color={zine.mint} />}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Key variant="secondary" onClick={() => setMinutes((m) => m + 5)}>
          +5
        </Key>
        <Key variant="secondary" onClick={() => setMinutes((m) => m + 15)}>
          +15
        </Key>
        <Key selected={running} onClick={toggleTimer}>
          {running ? "Stop" : "Start"}
        </Key>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mood: a sheet of face stickers. Empty slots show the dashed die-cut line;
// today's mood is peeled off and stuck on.

const moods: { name: string; color: string; line: string; mouth: number }[] = [
  { name: "Rough", color: zine.blue, line: "#ffffff", mouth: -5 },
  { name: "Low", color: zine.lilac, line: zine.ink, mouth: -2.5 },
  { name: "Okay", color: zine.yellow, line: zine.ink, mouth: 0 },
  { name: "Good", color: zine.mint, line: zine.ink, mouth: 3 },
  { name: "Great", color: zine.pink, line: "#ffffff", mouth: 6 },
];

export function FaceSticker({ mood, stuck, size = 56 }: { mood: number; stuck: boolean; size?: number }) {
  const m = moods[mood];
  const id = `face-${mood}-${stuck ? "s" : "o"}`;
  const ink = stuck ? m.line : zine.pencil;
  return (
    <svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      aria-hidden
      style={stuck ? { filter: "drop-shadow(1.5px 2px 0 rgba(20,20,20,0.35))", rotate: `${(rand(mood + 3) - 0.5) * 16}deg` } : undefined}
    >
      <defs>
        <Rough id={id} scale={1.6} />
      </defs>
      {stuck ? (
        <>
          <circle cx="30" cy="30" r="27" fill="white" />
          <circle cx="30" cy="30" r="23" fill={m.color} />
        </>
      ) : (
        <circle cx="30" cy="30" r="26" fill="none" stroke={zine.pencil} strokeWidth="2" strokeDasharray="5 4" />
      )}
      <g filter={`url(#${id})`} stroke={ink} strokeWidth="2.6" strokeLinecap="round" fill="none">
        <line x1="22" y1="23" x2="22" y2="28" />
        <line x1="38" y1="23" x2="38" y2="28" />
        <path d={`M20 ${38 - m.mouth / 3} Q30 ${38 + m.mouth}, 40 ${38 - m.mouth / 3}`} />
      </g>
    </svg>
  );
}

export function MoodStickers({ initial = 3 }: { initial?: number | null }) {
  const [mood, setMood] = useState<number | null>(initial);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = Math.min(4, Math.max(0, (mood ?? 2) + (e.key === "ArrowRight" ? 1 : -1)));
    setMood(next);
    (e.currentTarget.querySelectorAll("[role=radio]")[next] as HTMLElement)?.focus();
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="radiogroup"
        aria-label="Today's mood"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1 bg-[#ece5d3] p-2 [background-image:repeating-linear-gradient(0deg,transparent_0_23px,rgba(20,20,20,0.06)_23px_24px)]"
      >
        {moods.map((m, i) => (
          <button
            key={m.name}
            type="button"
            role="radio"
            aria-checked={mood === i}
            tabIndex={mood === i || (mood === null && i === 0) ? 0 : -1}
            onClick={() => setMood(i)}
            className="group flex flex-col items-center gap-1 rounded-sm px-1 py-1.5 focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-[#141414]"
          >
            <span className="transition-transform group-hover:-translate-y-0.5 group-hover:-rotate-6">
              <FaceSticker mood={i} stuck={mood === i} />
            </span>
            <span className={cx(typed, "text-xs", mood === i ? "text-[#141414]" : "text-[#57514a]")}>{m.name}</span>
          </button>
        ))}
      </div>
      <span className={note}>{mood === null ? "how was today?" : `feeling ${moods[mood].name.toLowerCase()}`}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Streaks: the star chart. A star for each day the goal was met,
// a pencil cross when missed, a dashed outline for today.

type Day = "met" | "missed" | "today";
const starColors = [zine.yellow, zine.pink, zine.mint, zine.lilac, zine.blue, zine.tomato];

export function DayMark({ day, seed = 0, size = 28 }: { day: Day; seed?: number; size?: number }) {
  if (day === "met")
    return (
      <StarSticker size={size} tilt={(rand(seed) - 0.5) * 40} color={starColors[Math.floor(rand(seed + 1) * starColors.length)]} />
    );
  if (day === "today") return <StarSticker size={size} outline />;
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden>
      <defs>
        <Rough id={`x-${seed}`} scale={1.5} />
      </defs>
      <path d="M8 8 L20 20 M20 8 L8 20" stroke={zine.pencil} strokeWidth="2" strokeLinecap="round" filter={`url(#x-${seed})`} />
    </svg>
  );
}

const chart: [string, Day[], number][] = [
  ["Water", ["met", "met", "met", "met", "met", "met", "today"], 21],
  ["Read", ["met", "missed", "met", "met", "met", "met", "met"], 5],
  ["Exercise", ["missed", "met", "met", "missed", "met", "met", "today"], 2],
  ["Mood", ["met", "met", "met", "met", "met", "met", "met"], 30],
];

export function StarChart() {
  return (
    <Sheet>
      <div className="flex items-baseline justify-between">
        <span className="font-(family-name:--font-marker) text-xl uppercase">Star chart</span>
        <span className={note}>this week</span>
      </div>
      <div className="mt-3 grid grid-cols-[5rem_repeat(7,1.75rem)_auto] items-center gap-x-1.5 gap-y-1.5">
        <span />
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className={`${typed} text-center text-xs text-[#57514a]`}>
            {d}
          </span>
        ))}
        <span />
        {chart.map(([name, days, streak], r) => (
          <div key={name} className="contents">
            <span className={`${typed} text-xs`}>{name}</span>
            {days.map((d, i) => (
              <DayMark key={i} day={d} seed={r * 10 + i} />
            ))}
            <span className={`${note} pl-2 whitespace-nowrap`}>
              {streak} <span className="text-lg">days</span>
            </span>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
