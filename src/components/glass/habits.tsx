"use client";

// Glass's habit-tracker pieces: frosted panes, and one way to log
// and see each habit. These are what the site is built from.

import { useEffect, useState } from "react";
import { GoalBadge, Pill, StreakBadge } from "./ui";
import { glass, pane, spectrum, type ForcedState } from "./tokens";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const label = "font-(family-name:--font-label) text-xs tracking-[0.12em] uppercase";

// ---------------------------------------------------------------------------
// Pane: a frosted card that everything on the site sits in.

export function Pane({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx(pane, "rounded-[1.75rem] p-6", className)}>{children}</div>;
}

// ---------------------------------------------------------------------------
// Progress bar. The spectrum is stretched across the whole track, so a short
// fill is cool blue and only a full one reaches orange.

export function ProgressBar({ value, total, name }: { value: number; total: number; name: string }) {
  const t = Math.min(value / total, 1);
  const done = value >= total;
  return (
    <div
      role="progressbar"
      aria-label={name}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={Math.min(value, total)}
      className="h-2.5 w-full overflow-hidden rounded-full bg-white/10 shadow-[inset_0_1px_2px_rgba(8,4,28,0.5)]"
    >
      <div
        style={{
          width: `${t * 100}%`,
          backgroundImage: spectrum,
          backgroundSize: t > 0 ? `${100 / t}% 100%` : undefined,
        }}
        className={cx(
          "h-full rounded-full transition-[width] duration-300",
          done && "shadow-[0_0_14px_rgba(255,138,61,0.7)]",
        )}
      />
    </div>
  );
}

// A ring, drawn with CSS masks so the spectrum can sweep around it.
export function ProgressRing({
  value,
  total,
  size = 160,
  thickness = 14,
  children,
}: {
  value: number;
  total: number;
  size?: number;
  thickness?: number;
  children?: React.ReactNode;
}) {
  const t = Math.min(value / total, 1);
  const ring = `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness - 1}px))`;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div aria-hidden className="absolute inset-0 overflow-hidden rounded-full" style={{ mask: ring, WebkitMask: ring }}>
        <div className="absolute inset-0 bg-white/10" />
        <div
          className="absolute inset-0 transition-[mask] duration-300"
          style={{
            backgroundImage: `conic-gradient(${glass.blue}, ${glass.violet} 50%, ${glass.orange})`,
            mask: `conic-gradient(#000 ${t * 360}deg, transparent 0)`,
            WebkitMask: `conic-gradient(#000 ${t * 360}deg, transparent 0)`,
          }}
        />
      </div>
      {t >= 1 && <div aria-hidden className="absolute inset-0 rounded-full shadow-[0_0_32px_rgba(255,138,61,0.45)]" />}
      <div className="relative text-center">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Today's summary: the pane at the top of the site.

export function TodaySummary() {
  const rows: [string, number, number, string][] = [
    ["Water", 5, 8, "5 of 8 glasses"],
    ["Reading", 20, 20, "20 of 20 pages"],
    ["Exercise", 30, 30, "30 of 30 min"],
    ["Mood", 1, 1, "Good"],
  ];
  const met = rows.filter(([, v, t]) => v >= t).length;
  return (
    <Pane className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <ProgressRing value={met} total={rows.length} size={140}>
        <p className="font-(family-name:--font-display) text-4xl font-light">
          {met}
          <span className="text-(--muted)">/{rows.length}</span>
        </p>
        <p className={cx(label, "text-(--muted)")}>goals met</p>
      </ProgressRing>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <p className="font-(family-name:--font-display) text-2xl font-light">Friday</p>
          <p className={cx(label, "text-(--muted)")}>Oct 10</p>
        </div>
        {rows.map(([name, v, t, text]) => (
          <div key={name} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm">
              <span>{name}</span>
              <span className={v >= t ? "text-[#ffa865]" : "text-(--muted)"}>{text}</span>
            </div>
            <ProgressBar value={v} total={t} name={name} />
          </div>
        ))}
      </div>
    </Pane>
  );
}

// ---------------------------------------------------------------------------
// Water: a row of glass tumblers. Tap the 5th to fill 1–5; tap the last full one to empty it.

type GlassLook = "empty" | "full" | "preview";

export function Tumbler({
  look,
  forced,
  disabled,
  ...props
}: {
  look: GlassLook;
  forced?: ForcedState;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const showPreview = !disabled && (look === "preview" || (look === "empty" && forced === "hover"));
  return (
    <button
      type="button"
      disabled={disabled}
      className={cx(
        "relative h-14 w-9 overflow-hidden rounded-t-md rounded-b-2xl border transition-[transform,background-color] duration-150",
        disabled ? "cursor-not-allowed border-white/10 bg-white/3" : "border-white/35 bg-white/8 hover:bg-white/12",
        forced === "pressed" && "scale-95",
        forced === "focus"
          ? "outline-2 outline-offset-3 outline-[#5cc8ff]"
          : "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#5cc8ff] active:scale-95",
      )}
      {...props}
    >
      {(look === "full" || showPreview) && !disabled && (
        <span
          aria-hidden
          className={cx(
            "absolute inset-x-0 bottom-0 h-4/5 bg-[linear-gradient(180deg,#5cc8ff,#2a6bf0)] transition-opacity",
            look === "full" ? "opacity-100" : "opacity-35",
          )}
        />
      )}
      {/* The glint down the side of the glass. */}
      <span aria-hidden className="absolute top-1.5 left-1.5 h-9 w-1 rounded-full bg-white/45" />
    </button>
  );
}

export function WaterGlasses({ goal = 8, initial = 5 }: { goal?: number; initial?: number }) {
  const [count, setCount] = useState(initial);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" onMouseLeave={() => setHover(null)}>
        {Array.from({ length: goal }, (_, i) => {
          const full = i < count;
          const look: GlassLook = full ? "full" : hover !== null && i <= hover ? "preview" : "empty";
          return (
            <Tumbler
              key={i}
              look={look}
              aria-label={full && i === count - 1 ? `Empty glass ${i + 1}` : `Fill to ${i + 1} glasses`}
              onMouseEnter={() => setHover(i)}
              onClick={() => setCount(i + 1 === count ? i : i + 1)}
            />
          );
        })}
      </div>
      <ProgressBar value={count} total={goal} name="Water" />
      <div className="flex items-center gap-3">
        <span className="text-sm" aria-live="polite">
          {count} of {goal} glasses
        </span>
        {count >= goal && <GoalBadge />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reading: a stepper, or type the page count, and the bar fills.

export function PageStepper({ goal = 20, initial = 12 }: { goal?: number; initial?: number }) {
  const [pages, setPages] = useState(initial);
  const add = (n: number) => setPages((p) => Math.max(0, p + n));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Pill variant="secondary" aria-label="One page fewer" onClick={() => add(-1)} className="px-3.5">
          −
        </Pill>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          aria-label="Pages read"
          value={pages}
          onChange={(e) => setPages(Math.max(0, Number(e.target.value) || 0))}
          className="w-16 [appearance:textfield] rounded-2xl border border-[#8a7dc4] bg-white/8 py-2 text-center font-(family-name:--font-display) text-xl focus:border-[#5cc8ff] focus:outline-3 focus:outline-[#5cc8ff]/30 [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Pill variant="secondary" aria-label="One page more" onClick={() => add(1)} className="px-3.5">
          +
        </Pill>
        <Pill variant="secondary" onClick={() => add(10)} className="px-3.5">
          +10
        </Pill>
      </div>
      <ProgressBar value={pages} total={goal} name="Reading" />
      <div className="flex items-center gap-3">
        <span className="text-sm" aria-live="polite">
          {pages} of {goal} pages
        </span>
        {pages >= goal && <GoalBadge />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exercise: a ring that fills toward the goal. Add minutes, or run the timer.

type TimerState = "idle" | "running" | "paused";

export function ExerciseRing({ goal = 30, initial = 25, timer: startTimer = "idle" }: { goal?: number; initial?: number; timer?: TimerState }) {
  const [minutes, setMinutes] = useState(initial);
  const [timer, setTimer] = useState<TimerState>(startTimer);
  const [seconds, setSeconds] = useState(startTimer === "idle" ? 0 : 42);

  useEffect(() => {
    if (timer !== "running") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const total = minutes + Math.floor(seconds / 60);
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  // Stopping banks the timer's whole minutes and clears it.
  function stop() {
    setMinutes(total);
    setSeconds(0);
    setTimer("idle");
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <ProgressRing value={total} total={goal} size={150}>
        <p className="font-(family-name:--font-display) text-3xl font-light" aria-live="polite">
          {total}
          <span className="text-base text-(--muted)"> / {goal}</span>
        </p>
        <p className={cx(label, "text-(--muted)")}>min</p>
      </ProgressRing>
      <div className="flex min-h-7 items-center gap-3">
        {timer === "idle" ? (
          <span className="text-sm">
            {total} of {goal} min
          </span>
        ) : (
          <span className={cx(label, "flex items-center gap-2")}>
            <span
              aria-hidden
              className={cx(
                "size-2 rounded-full",
                timer === "running" ? "animate-pulse bg-[#ff8a3d] shadow-[0_0_8px_#ff8a3d]" : "bg-(--muted)",
              )}
            />
            {clock} · {timer}
          </span>
        )}
        {total >= goal && <GoalBadge />}
      </div>
      <div className="flex flex-wrap gap-2">
        {timer === "idle" && (
          <>
            <Pill variant="secondary" onClick={() => setMinutes((m) => m + 5)}>
              +5
            </Pill>
            <Pill variant="secondary" onClick={() => setMinutes((m) => m + 15)}>
              +15
            </Pill>
            <Pill onClick={() => setTimer("running")}>Start</Pill>
          </>
        )}
        {timer === "running" && (
          <Pill variant="secondary" onClick={() => setTimer("paused")}>
            Pause
          </Pill>
        )}
        {timer === "paused" && (
          <>
            <Pill variant="secondary" onClick={stop}>
              Stop
            </Pill>
            <Pill onClick={() => setTimer("running")}>Resume</Pill>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mood: five glass bubbles with faces, tinted from deep blue (rough) to orange (great).

const moods: [string, string][] = [
  ["Rough", "#2a6bf0"],
  ["Low", "#5cc8ff"],
  ["Okay", "#a98bff"],
  ["Good", "#ff9a7a"],
  ["Great", "#ff8a3d"],
];

export function MoodFace({ index, size = 56 }: { index: number; size?: number }) {
  const curve = [-6, -3, 0, 3, 6][index];
  const tint = moods[index][1];
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        backgroundImage: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85), ${tint} 45%, ${tint}99 100%)`,
      }}
      className="grid place-items-center rounded-full border border-white/40 shadow-[inset_0_-6px_12px_rgba(8,4,28,0.35)]"
    >
      <svg viewBox="0 0 40 40" width={size * 0.62} height={size * 0.62}>
        <g fill="none" stroke={glass.ink} strokeWidth="2.6" strokeLinecap="round">
          <circle cx="14" cy="16" r="1.2" fill={glass.ink} />
          <circle cx="26" cy="16" r="1.2" fill={glass.ink} />
          <path d={`M12 ${26 - curve / 3} Q 20 ${26 + curve}, 28 ${26 - curve / 3}`} />
        </g>
      </svg>
    </span>
  );
}

export function MoodBubbles({ initial = 3 }: { initial?: number | null }) {
  const [mood, setMood] = useState<number | null>(initial);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = Math.min(4, Math.max(0, (mood ?? 2) + (e.key === "ArrowRight" ? 1 : -1)));
    setMood(next);
    (e.currentTarget.querySelectorAll("[role=radio]")[next] as HTMLElement)?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      <div role="radiogroup" aria-label="Today's mood" className="flex flex-wrap gap-1" onKeyDown={onKeyDown}>
        {moods.map(([m], i) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mood === i}
            tabIndex={mood === i || (mood === null && i === 0) ? 0 : -1}
            onClick={() => setMood(i)}
            className="group flex flex-col items-center gap-1.5 rounded-2xl px-1.5 py-2 hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-[#5cc8ff]"
          >
            <span
              className={cx(
                "rounded-full transition-[transform,opacity,box-shadow] duration-200",
                mood === i
                  ? "scale-110 opacity-100 ring-2 ring-white/80 ring-offset-2 ring-offset-transparent shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                  : "opacity-60 group-hover:opacity-90",
              )}
            >
              <MoodFace index={i} size={44} />
            </span>
            <span className={cx("text-xs", mood === i ? "font-semibold text-(--text)" : "text-(--muted)")}>{m}</span>
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1.5">
        <span className={cx(label, "text-(--muted)")}>Note</span>
        <input
          type="text"
          placeholder="Slept well, long walk"
          className="w-full rounded-2xl border border-[#8a7dc4] bg-white/8 px-4 py-2 text-sm placeholder:text-[#a59bc9] focus:border-[#5cc8ff] focus:outline-3 focus:outline-[#5cc8ff]/30"
        />
      </label>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Week: a row of beads per habit. Lit with the spectrum when the goal was met,
// a clear ring when missed, dashed blue for today.

type Day = "met" | "missed" | "today";

export function Bead({ day }: { day: Day }) {
  return (
    <span
      style={day === "met" ? { backgroundImage: `radial-gradient(circle at 35% 30%, #fff8, transparent 55%), ${spectrum}` } : undefined}
      className={cx(
        "block size-5 rounded-full",
        day === "met" && "shadow-[0_0_8px_rgba(169,139,255,0.6)]",
        day === "missed" && "border border-white/25 bg-white/5",
        day === "today" && "border-2 border-dashed border-[#5cc8ff]",
      )}
    />
  );
}

const week: [string, Day[], number][] = [
  ["Water", ["met", "met", "met", "met", "met", "met", "today"], 21],
  ["Reading", ["met", "missed", "met", "met", "met", "met", "met"], 5],
  ["Exercise", ["missed", "met", "met", "missed", "met", "met", "today"], 2],
  ["Mood", ["met", "met", "met", "met", "met", "met", "met"], 30],
];

export function WeekLog() {
  return (
    <Pane>
      <div className="flex items-baseline justify-between">
        <span className="font-(family-name:--font-display) text-xl font-light">This week</span>
        <span className={cx(label, "text-(--muted)")}>Oct 4 – 10</span>
      </div>
      <div className="mt-4 grid grid-cols-[5.5rem_repeat(7,1.25rem)_auto] items-center gap-x-2 gap-y-3">
        <span />
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className={cx(label, "text-center text-(--muted)")}>
            {d}
          </span>
        ))}
        <span />
        {week.map(([name, days, streak]) => (
          <div key={name} className="contents">
            <span className="text-sm">{name}</span>
            {days.map((d, i) => (
              <Bead key={i} day={d} />
            ))}
            <span className={cx(label, "pl-2 text-right text-[#ffa865]")}>{streak}d</span>
          </div>
        ))}
      </div>
    </Pane>
  );
}

export { StreakBadge };
