"use client";

// Orbit's habit-tracker pieces: the console screen, and one way to log
// and see each habit. These are what the site is built from.

import { useEffect, useEffectEvent, useState } from "react";
import { GoalBadge, Key, StreakBadge, useControlled } from "./ui";
import { orbit, type ForcedState } from "./tokens";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const label = "font-(family-name:--font-label) text-xs tracking-[0.15em] uppercase";

// ---------------------------------------------------------------------------
// Console screen: a rounded CRT in a chrome bezel, with faint scanlines.

export function ConsoleScreen({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-[2.5rem] bg-[#b9bcbf] p-3 shadow-[inset_0_-4px_0_#9da1a5]", className)}>
      <div
        style={{
          backgroundColor: orbit.screen,
          color: orbit.phosphor,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 3px)",
        }}
        className="rounded-[2rem/2.5rem] px-4 py-5 sm:px-6 font-(family-name:--font-label) shadow-[inset_0_0_24px_rgba(0,0,0,0.6)]"
      >
        {children}
      </div>
    </div>
  );
}

// A bar of square cells, like a readout on the screen.
function Cells({ value, total, cells = 10 }: { value: number; total: number; cells?: number }) {
  const lit = Math.round((Math.min(value, total) / total) * cells);
  return (
    <span aria-hidden className="flex gap-1">
      {Array.from({ length: cells }, (_, i) => (
        <span key={i} className={cx("h-3 w-2 rounded-[2px]", i < lit ? "bg-[#9fe3c4]" : "bg-[#9fe3c4]/15")} />
      ))}
    </span>
  );
}

// Today's summary, as the screen at the top of the site.
// Each row: name, value, goal, readout text.
export type ConsoleRow = [string, number, number, string];

const demoRows: ConsoleRow[] = [
  ["Water", 5, 8, "5/8 gl"],
  ["Read", 20, 20, "20/20 pp"],
  ["Exercise", 25, 30, "25/30 min"],
  ["Mood", 4, 5, "good"],
];

export function TodayConsole({
  rows = demoRows,
  date = "Fri · Oct 10",
  title = "Day 21",
}: {
  rows?: ConsoleRow[];
  date?: string;
  title?: string;
}) {
  const met = rows.filter(([, v, t]) => v >= t).length;
  return (
    <ConsoleScreen>
      <div className="flex items-baseline justify-between">
        <span className={cx(label, "text-[#5f8f7c]")}>{date}</span>
        <span className={label}>
          {met} of {rows.length} goals
        </span>
      </div>
      <p className="mt-2 font-(family-name:--font-display) text-2xl tracking-wide text-[#f3ead8] uppercase">{title}</p>
      <div className="mt-3 flex flex-col gap-2">
        {rows.map(([name, v, t, text]) => (
          <div key={name} className="grid grid-cols-[4.75rem_1fr_auto] items-center gap-2 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-3">
            <span className={label}>{name}</span>
            <Cells value={v} total={t} />
            <span className={cx(label, v >= t ? "text-[#e8a33d]" : "")}>{text}</span>
          </div>
        ))}
      </div>
    </ConsoleScreen>
  );
}

// ---------------------------------------------------------------------------
// Water: a row of fuel cells. Tap the 5th to fill 1–5; tap the last full one to empty it.

type CellLook = "empty" | "full" | "preview";

export function FuelCell({
  look,
  forced,
  disabled,
  large = false,
  ...props
}: {
  look: CellLook;
  forced?: ForcedState;
  disabled?: boolean;
  // Taller cells from the sm breakpoint up, for the site's water card.
  large?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cx(
        "relative h-14 w-7 overflow-hidden rounded-full border-2 transition-colors",
        large && "sm:h-20 sm:w-10",
        disabled ? "cursor-not-allowed border-[#cfc4b2] bg-[#e6dccb]" : "border-[#1c2a4a]",
        !disabled && look === "empty" && (forced === "hover" ? "bg-[#1f6f78]/30" : "bg-(--surface)"),
        !disabled && look === "preview" && "bg-[#1f6f78]/30",
        !disabled && look === "full" && "bg-[#1f6f78]",
        forced === "pressed" && "scale-95",
        forced === "focus"
          ? "outline-3 outline-offset-3 outline-[#1f6f78]"
          : "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#1f6f78] active:scale-95",
      )}
      {...props}
    >
      {look === "full" && !disabled && (
        <span
          aria-hidden
          className={cx("absolute top-2 left-1.5 h-6 w-1 rounded-full bg-white/40", large && "sm:top-3 sm:left-2 sm:h-9 sm:w-1.5")}
        />
      )}
    </button>
  );
}

type Controlled<T> = { value?: T; onChange?: (value: T) => void };
// badge: show the "Goal met" pill under the widget. The site turns it off; its cards say so in the header.
type Widget = { goal?: number; initial?: number; badge?: boolean };

// fill: large cells, centered in the space the card gives them, for the site.
export function WaterCells({
  goal = 8,
  initial = 5,
  value,
  onChange,
  fill = false,
  badge = true,
}: Widget & { fill?: boolean } & Controlled<number>) {
  const [count, setCount] = useControlled(value, onChange, initial);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className={cx("flex flex-col gap-3", fill && "h-full items-center justify-center gap-4 py-2")}>
      <div className={cx("flex flex-wrap gap-2", fill && "justify-center")} onMouseLeave={() => setHover(null)}>
        {Array.from({ length: goal }, (_, i) => {
          const full = i < count;
          const look: CellLook = full ? "full" : hover !== null && i <= hover ? "preview" : "empty";
          return (
            <FuelCell
              key={i}
              look={look}
              large={fill}
              aria-label={full && i === count - 1 ? `Empty glass ${i + 1}` : `Fill to ${i + 1} glasses`}
              onMouseEnter={() => setHover(i)}
              onClick={() => setCount(i + 1 === count ? i : i + 1)}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <span className={label} aria-live="polite">
          {count} of {goal} glasses
        </span>
        {badge && count >= goal && <GoalBadge />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reading: a planet travels around its orbit as the pages add up.

export function OrbitTrack({ value, total, size = 200, className }: { value: number; total: number; size?: number; className?: string }) {
  const done = value >= total;
  const t = Math.min(value / total, 1);
  const angle = -Math.PI / 2 + t * 2 * Math.PI;
  const x = 100 + 80 * Math.cos(angle);
  const y = 50 + 34 * Math.sin(angle);
  return (
    <svg viewBox="0 0 200 100" width={className ? undefined : size} className={className} aria-hidden>
      <ellipse cx="100" cy="50" rx="80" ry="34" fill="none" stroke="#ddd0b8" strokeWidth="3" />
      {/* The same ellipse drawn from the top, clockwise, so progress starts where the planet does. */}
      <path
        d="M100 16 A80 34 0 1 1 99.99 16"
        fill="none"
        stroke={orbit.teal}
        strokeWidth="3"
        pathLength="100"
        strokeDasharray={`${t * 100} 100`}
      />
      <circle cx="100" cy="50" r="16" fill={orbit.navy} />
      <circle cx={x} cy={y} r={done ? 10 : 8} fill={done ? orbit.mustard : orbit.orange} />
      {done && <circle cx={x} cy={y} r="15" fill="none" stroke={orbit.mustard} strokeWidth="2" opacity="0.6" />}
    </svg>
  );
}

// fill: the orbit grows to the card's width, for the site.
export function PageStepper({
  goal = 20,
  initial = 12,
  value,
  onChange,
  fill = false,
  badge = true,
}: Widget & { fill?: boolean } & Controlled<number>) {
  const [pages, setPages] = useControlled(value, onChange, initial);
  const add = (n: number) => setPages(Math.max(0, pages + n));
  return (
    <div className="flex flex-col items-start gap-3">
      <OrbitTrack value={pages} total={goal} className={fill ? "h-auto w-full max-w-[22rem]" : undefined} />
      <div className="flex items-center gap-3">
        <ConsoleScreen className="!rounded-2xl !p-1.5">
          <span className="block min-w-24 text-center text-lg" aria-live="polite">
            {pages}/{goal} pp
          </span>
        </ConsoleScreen>
        {badge && pages >= goal && <GoalBadge />}
      </div>
      <div className="flex gap-2">
        <Key variant="secondary" lamp={false} aria-label="One page fewer" onClick={() => add(-1)}>
          −
        </Key>
        <Key variant="secondary" lamp={false} onClick={() => add(1)}>
          +1
        </Key>
        <Key variant="secondary" lamp={false} onClick={() => add(10)}>
          +10
        </Key>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exercise: a gauge with a needle, 0 to the goal in minutes, and a timer.

export function ExerciseDial({ goal = 30, initial = 25, value, onChange, badge = true }: Widget & Controlled<number>) {
  const [minutes, setMinutes] = useControlled(value, onChange, initial);
  const [running, setRunning] = useState(false);
  // Seconds into this timer session. Each full minute is added to the total as it passes.
  const [seconds, setSeconds] = useState(0);

  const tick = useEffectEvent(() => {
    const next = seconds + 1;
    setSeconds(next);
    if (next % 60 === 0) setMinutes(minutes + 1);
  });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [running]);

  const total = minutes;
  const t = Math.min(total / goal, 1);
  const needle = -90 + t * 180;
  const step = goal <= 30 ? 5 : 15;
  const ticks = Array.from({ length: Math.floor(goal / step) + 1 }, (_, i) => i * step);

  function toggleTimer() {
    if (running) setSeconds(0);
    setRunning(!running);
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <svg viewBox="0 0 200 120" width={200} aria-hidden>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#ddd0b8" strokeWidth="12" strokeLinecap="round" />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={total >= goal ? orbit.mustard : orbit.orange}
          strokeWidth="12"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${t * 100} 100`}
        />
        {/* Ticks just inside the arc, numbers inside the ticks, and a needle short
            enough to stop before the numbers. The arc's round caps mark 0 and the goal. */}
        {ticks.map((m) => {
          const a = Math.PI - (m / goal) * Math.PI;
          const end = m === 0 || m === goal;
          return (
            <g key={m}>
              {!end && (
                <line
                  x1={100 + 62 * Math.cos(a)}
                  y1={100 - 62 * Math.sin(a)}
                  x2={100 + 68 * Math.cos(a)}
                  y2={100 - 68 * Math.sin(a)}
                  stroke={orbit.navy}
                  strokeWidth="2"
                />
              )}
              <text
                x={100 + (end ? 80 : 52) * Math.cos(a)}
                y={end ? 117 : 103 - 52 * Math.sin(a)}
                textAnchor="middle"
                fontSize="9"
                fill={orbit.navy}
                fontFamily="var(--font-label)"
              >
                {m}
              </text>
            </g>
          );
        })}
        <g style={{ transform: `rotate(${needle}deg)`, transformOrigin: "100px 100px", transition: "transform 300ms" }}>
          <line x1="100" y1="100" x2="100" y2="62" stroke={orbit.navy} strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="100" r="7" fill={orbit.navy} />
        <circle cx="100" cy="100" r="2.5" fill={orbit.mustard} />
      </svg>
      <div className="flex items-center gap-3">
        <span className={label} aria-live="polite">
          {total} of {goal} min
        </span>
        {running && (
          <ConsoleScreen className="!rounded-2xl !p-1.5">
            <span className="block px-2 text-sm">
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
            </span>
          </ConsoleScreen>
        )}
        {badge && total >= goal && <GoalBadge />}
      </div>
      <div className="flex gap-2">
        <Key variant="secondary" lamp={false} onClick={() => setMinutes(minutes + 5)}>
          +5
        </Key>
        <Key variant="secondary" lamp={false} onClick={() => setMinutes(minutes + 15)}>
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
// Mood: five moon phases, from new moon (rough) to full moon (great).

const moods = ["Rough", "Low", "Okay", "Good", "Great"];

function Moon({ phase, size = 40 }: { phase: number; size?: number }) {
  // phase 0 = new, 4 = full. The lit part grows from the right.
  const r = 16;
  const lit = phase / 4; // 0..1
  // The terminator's x-radius: from r (crescent edge) through 0 (half) to r (full side).
  const rx = Math.abs(1 - 2 * lit) * r;
  // Crescents bulge right (counterclockwise back to the top); gibbous moons bulge left.
  const sweep = lit > 0.5 ? 1 : 0;
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden>
      <circle cx="20" cy="20" r={r} fill={orbit.navy} />
      {phase === 4 ? (
        <circle cx="20" cy="20" r={r} fill={orbit.mustard} />
      ) : (
        phase > 0 && (
          <path
            d={`M20 ${20 - r} A ${r} ${r} 0 0 1 20 ${20 + r} A ${rx} ${r} 0 0 ${sweep} 20 ${20 - r} Z`}
            fill={orbit.mustard}
          />
        )
      )}
      <circle cx="20" cy="20" r={r} fill="none" stroke={orbit.navy} strokeWidth="1.5" />
    </svg>
  );
}

export const moodNames = moods;

export function MoodPhases({ initial = 3, value, onChange }: { initial?: number | null } & Controlled<number | null>) {
  const [mood, setMood] = useControlled<number | null>(value, onChange, initial);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = Math.min(4, Math.max(0, (mood ?? 2) + (e.key === "ArrowRight" ? 1 : -1)));
    setMood(next);
    (e.currentTarget.querySelectorAll("[role=radio]")[next] as HTMLElement)?.focus();
  }

  return (
    <div className="flex flex-col gap-3">
      <div role="radiogroup" aria-label="Today's mood" className="grid max-w-sm grid-cols-5 gap-1" onKeyDown={onKeyDown}>
        {moods.map((m, i) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mood === i}
            tabIndex={mood === i || (mood === null && i === 0) ? 0 : -1}
            onClick={() => setMood(i)}
            className="group flex min-w-0 flex-col items-center gap-1.5 rounded-2xl py-2 hover:bg-[#efe4cf] focus-visible:outline-3 focus-visible:outline-[#1f6f78]"
          >
            <span
              className={cx(
                "grid size-12 place-items-center rounded-full border-2 sm:size-14",
                mood === i ? "border-[#1f6f78]" : "border-transparent",
              )}
            >
              <Moon phase={i} />
            </span>
            <span className={cx(label, mood === i ? "font-bold text-(--text)" : "text-(--muted)")}>{m}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Streaks: the mission log. A row of portholes per habit for the week;
// lit when the goal was met, dark when missed, dashed for today.

export type Day = "met" | "missed" | "today";

export function Porthole({ day }: { day: Day }) {
  return (
    <span
      className={cx(
        "block h-7 w-5 rounded-[50%]",
        day === "met" && "bg-[#9fe3c4] shadow-[0_0_8px_rgba(159,227,196,0.7)]",
        day === "missed" && "border-2 border-[#5f8f7c]/60",
        day === "today" && "border-2 border-dashed border-[#e8a33d]",
      )}
    />
  );
}

export type LogRow = [string, Day[], number];

const demoLog: LogRow[] = [
  ["Water", ["met", "met", "met", "met", "met", "met", "today"], 21],
  ["Read", ["met", "missed", "met", "met", "met", "met", "met"], 5],
  ["Exercise", ["missed", "met", "met", "missed", "met", "met", "today"], 2],
  ["Mood", ["met", "met", "met", "met", "met", "met", "met"], 30],
];

export function MissionLog({
  log = demoLog,
  days = ["M", "T", "W", "T", "F", "S", "S"],
}: {
  log?: LogRow[];
  days?: string[];
}) {
  return (
    <ConsoleScreen>
      <div className="flex items-baseline justify-between">
        <span className={label}>Mission log</span>
        <span className={cx(label, "text-[#5f8f7c]")}>this week</span>
      </div>
      <div className="mt-3 grid grid-cols-[4.75rem_repeat(7,1.25rem)_auto] items-center gap-x-1 gap-y-2.5 sm:grid-cols-[5.5rem_repeat(7,1.25rem)_auto] sm:gap-x-2">
        <span />
        {days.map((d, i) => (
          <span key={i} className={cx(label, "text-center text-[#5f8f7c]")}>
            {d}
          </span>
        ))}
        <span />
        {log.map(([name, days, streak]) => (
          <div key={name} className="contents">
            <span className={label}>{name}</span>
            {days.map((d, i) => (
              <Porthole key={i} day={d} />
            ))}
            <span className={cx(label, "pl-2 text-right text-[#e8a33d]")}>{streak}d</span>
          </div>
        ))}
      </div>
    </ConsoleScreen>
  );
}

export { StreakBadge };
