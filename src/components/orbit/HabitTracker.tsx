"use client";

// The habit tracker, built from Orbit's design system. All state lives here
// and resets on reload: nothing is saved.

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ConsoleScreen,
  ExerciseDial,
  MissionLog,
  MoodPhases,
  PageStepper,
  Porthole,
  TodayConsole,
  WaterCells,
  moodNames,
  type ConsoleRow,
  type Day,
  type LogRow,
} from "./habits";
import { orbit } from "./tokens";
import {
  Checkbox,
  Chips,
  ChromeButton,
  GoalBadge,
  Key,
  Modal,
  SelectField,
  StreakBadge,
  Tabs,
  TextField,
  TextLink,
  Toggle,
} from "./ui";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const label = "font-(family-name:--font-label) text-xs tracking-[0.15em] uppercase";
const display = "font-(family-name:--font-display) tracking-wide uppercase";

// ---------------------------------------------------------------------------
// Data

type HabitId = "water" | "reading" | "exercise" | "mood";
type Group = "Body" | "Mind";

type Habit = {
  id: HabitId;
  name: string;
  short: string;
  group: Group;
  unit?: string;
  goals?: number[];
};

const habits: Habit[] = [
  { id: "water", name: "Water", short: "Water", group: "Body", unit: "glasses", goals: [6, 8, 10] },
  { id: "reading", name: "Reading", short: "Read", group: "Mind", unit: "pages", goals: [10, 20, 30, 50] },
  { id: "exercise", name: "Exercise", short: "Exercise", group: "Body", unit: "min", goals: [20, 30, 45, 60] },
  { id: "mood", name: "Mood", short: "Mood", group: "Mind" },
];

const today = { short: "Tue 13", long: "Tue · Oct 13", day: "Tuesday" };

// The six days before today, oldest first, and whether each goal was met.
const pastDays = [
  { short: "Wed 07", letter: "W" },
  { short: "Thu 08", letter: "T" },
  { short: "Fri 09", letter: "F" },
  { short: "Sat 10", letter: "S" },
  { short: "Sun 11", letter: "S" },
  { short: "Mon 12", letter: "M" },
];

const initialPast: Record<HabitId, boolean[]> = {
  water: [true, true, true, true, true, true],
  reading: [true, false, true, true, true, true],
  exercise: [false, true, true, false, true, true],
  mood: [true, true, true, true, true, true],
};

// Days in a row each goal was met before this week, so streaks can run past it.
const streakBefore: Record<HabitId, number> = { water: 15, reading: 0, exercise: 0, mood: 24 };

type Today = { water: number; reading: number; exercise: number; mood: number | null };
type Goals = { water: number; reading: number; exercise: number };

function isMet(id: HabitId, t: Today, g: Goals) {
  return id === "mood" ? t.mood !== null : t[id] >= g[id];
}

// Count back from today. An unmet today doesn't break the streak: the day isn't over.
function streak(past: boolean[], metToday: boolean, before: number) {
  const days = metToday ? [...past, true] : past;
  let n = 0;
  for (let i = days.length - 1; i >= 0 && days[i]; i--) n++;
  return n === days.length ? n + before : n;
}

function list(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

// ---------------------------------------------------------------------------

export function HabitTracker() {
  const [tab, setTab] = useState("Today");
  const [filter, setFilter] = useState("All");
  const [todayLog, setTodayLog] = useState<Today>({ water: 5, reading: 12, exercise: 25, mood: null });
  const [note, setNote] = useState("");
  const [goals, setGoals] = useState<Goals>({ water: 8, reading: 20, exercise: 30 });
  const [reminders, setReminders] = useState<Record<HabitId, boolean>>({
    water: true,
    reading: false,
    exercise: true,
    mood: false,
  });
  const [past, setPast] = useState(initialPast);
  const [detail, setDetail] = useState<HabitId | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const met = (id: HabitId) => isMet(id, todayLog, goals);
  const streaks = Object.fromEntries(
    habits.map((h) => [h.id, streak(past[h.id], met(h.id), streakBefore[h.id])]),
  ) as Record<HabitId, number>;

  function log<K extends keyof Today>(id: K, value: Today[K]) {
    setTodayLog((t) => ({ ...t, [id]: value }));
  }

  function notify(message: string) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  function openWeek() {
    setTab("Week");
    window.scrollTo({ top: 0 });
  }

  const shown = habits.filter((h) => filter === "All" || h.group === filter);
  const open = habits.find((h) => h.id === detail);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-6 pb-20 sm:px-10 sm:pt-8">
      <Link href="/" className={cx("rounded-sm text-sm text-(--muted) hover:text-(--text)", "focus-visible:outline-3 focus-visible:outline-[#1f6f78]")}>
        ← Hub
      </Link>

      <header className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b-2 border-(--text) pb-3">
        <p className="flex items-center gap-3 pb-1.5">
          <Logo />
          <span className={cx(display, "text-lg")}>Habit Tracker</span>
        </p>
        <Tabs tabs={["Today", "Week"]} value={tab} onChange={setTab} />
      </header>

      <main role="tabpanel" aria-label={tab} className="mt-10 sm:mt-14">
        {tab === "Today" ? (
          <>
            <Summary todayLog={todayLog} goals={goals} met={met} />

            <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
              <Chips chips={["All", "Body", "Mind"]} value={filter} onChange={setFilter} label="Filter habits" />
              <TextLink onClick={openWeek}>See week →</TextLink>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {shown.map((h) => (
                <HabitCard key={h.id} habit={h} goal={h.id === "mood" ? undefined : goals[h.id]} met={met(h.id)} streak={streaks[h.id]} onDetails={() => setDetail(h.id)}>
                  {h.id === "water" && <WaterCells goal={goals.water} value={todayLog.water} onChange={(v) => log("water", v)} fill />}
                  {h.id === "reading" && (
                    <PageStepper goal={goals.reading} value={todayLog.reading} onChange={(v) => log("reading", v)} fill />
                  )}
                  {h.id === "exercise" && <ExerciseDial goal={goals.exercise} value={todayLog.exercise} onChange={(v) => log("exercise", v)} />}
                  {h.id === "mood" && (
                    <div className="flex flex-col gap-5">
                      <MoodPhases value={todayLog.mood} onChange={(v) => log("mood", v)} />
                      <TextField label="Note (optional)" placeholder="What shaped today?" value={note} onChange={setNote} />
                    </div>
                  )}
                </HabitCard>
              ))}
            </div>
          </>
        ) : (
          <Week past={past} setPast={setPast} met={met} streaks={streaks} onToday={() => setTab("Today")} />
        )}
      </main>

      <Modal open={open !== undefined} onClose={() => setDetail(null)} title={open?.name ?? ""}>
        {open && (
          <Detail
            key={open.id}
            habit={open}
            days={[...past[open.id].map((m): Day => (m ? "met" : "missed")), met(open.id) ? "met" : "today"]}
            streak={streaks[open.id]}
            goal={open.id === "mood" ? undefined : goals[open.id]}
            reminder={reminders[open.id]}
            onReset={() => {
              log(open.id, open.id === "mood" ? null : 0);
              if (open.id === "mood") setNote("");
              notify(`${open.name} reset for today`);
            }}
            onSave={(goal, reminder) => {
              if (goal !== undefined && open.id !== "mood") setGoals((g) => ({ ...g, [open.id]: goal }));
              setReminders((r) => ({ ...r, [open.id]: reminder }));
              setDetail(null);
              notify(`${open.name} saved`);
            }}
          />
        )}
      </Modal>

      {/* Top of the screen on mobile, so it never covers a card; bottom on wider screens. */}
      <div role="status" className="pointer-events-none fixed inset-x-0 top-4 z-10 flex justify-center px-5 sm:top-auto sm:bottom-6">
        {toast && (
          <ConsoleScreen className="!rounded-full !p-1.5 shadow-[0_8px_24px_rgba(28,42,74,0.25)]">
            <span className="flex items-center gap-2.5 text-sm">
              <span aria-hidden className="grid size-5 place-items-center rounded-full bg-[#9fe3c4] text-xs text-[#16182a]">
                ✓
              </span>
              {toast}
            </span>
          </ConsoleScreen>
        )}
      </div>
    </div>
  );
}

// A planet in its ring: the site's mark.
function Logo() {
  return (
    <svg viewBox="0 0 40 40" width={32} height={32} aria-hidden>
      <ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke={orbit.teal} strokeWidth="2.5" transform="rotate(-20 20 20)" />
      <circle cx="20" cy="20" r="8" fill={orbit.navy} />
      <circle cx="35" cy="14" r="3" fill={orbit.mustard} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Today: the headline, and the console readout beside it.

function Summary({ todayLog, goals, met }: { todayLog: Today; goals: Goals; met: (id: HabitId) => boolean }) {
  const done = habits.filter((h) => met(h.id));
  const left = habits.filter((h) => !met(h.id));
  const nothing = !todayLog.water && !todayLog.reading && !todayLog.exercise && todayLog.mood === null;

  const rows: ConsoleRow[] = [
    ["Water", todayLog.water, goals.water, `${todayLog.water}/${goals.water} gl`],
    ["Read", todayLog.reading, goals.reading, `${todayLog.reading}/${goals.reading} pp`],
    ["Exercise", todayLog.exercise, goals.exercise, `${todayLog.exercise}/${goals.exercise} min`],
    ["Mood", todayLog.mood === null ? 0 : 1, 1, todayLog.mood === null ? "—" : moodNames[todayLog.mood].toLowerCase()],
  ];

  let line: string;
  if (nothing) line = "Nothing logged yet today. A glass of water is an easy start.";
  else if (left.length === 0) line = "Every goal met. Mission complete for today.";
  else line = `Still to go: ${list(left.map((h) => h.name.toLowerCase()))}.`;

  return (
    <section aria-label="Today's progress" className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-10">
      <div>
        <h1 className={cx(display, "text-4xl leading-tight sm:text-5xl xl:whitespace-nowrap")}>
          {done.length} of {habits.length} goals met
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-lg text-(--muted)" aria-live="polite">
            {line}
          </p>
          {left.length === 0 && <GoalBadge>All 4</GoalBadge>}
        </div>
      </div>
      <TodayConsole rows={rows} date={today.long} title={today.day} />
    </section>
  );
}

function HabitCard({
  habit,
  goal,
  met,
  streak,
  onDetails,
  children,
}: {
  habit: Habit;
  goal?: number;
  met: boolean;
  streak: number;
  onDetails: () => void;
  children: React.ReactNode;
}) {
  const unit = habit.unit === "min" ? "minutes" : habit.unit;
  return (
    <article
      aria-labelledby={`${habit.id}-title`}
      className={cx(
        "flex flex-col gap-6 rounded-[2rem_2rem_2rem_0.75rem] border-2 bg-(--surface) p-5 transition-[border-color,box-shadow] sm:p-6",
        met ? "border-[#1c2a4a] shadow-[0_0_0_4px_rgba(232,163,61,0.55)]" : "border-(--text)",
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 id={`${habit.id}-title`} className={cx(display, "text-xl")}>
            {habit.name}
          </h2>
          <p className={cx(label, "mt-1 text-(--muted)")}>{goal ? `Goal · ${goal} ${unit}` : "Goal · once a day"}</p>
          {met && (
            <p className={cx(label, "mt-1.5 flex items-center gap-2 font-bold whitespace-nowrap")}>
              <span aria-hidden className="size-2 rounded-full bg-[#e8a33d] shadow-[0_0_8px_#e8a33d]" />
              Goal met
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <StreakBadge days={streak} size={52} compact lit={met} />
          <ChromeButton label={`${habit.name} details and goal`} onClick={onDetails} aria-haspopup="dialog">
            <svg viewBox="0 0 8 12" className="w-2" aria-hidden>
              <path d="M1.5 1.5L6 6l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </ChromeButton>
        </div>
      </header>
      <div className="flex flex-1 flex-col *:flex-1">{children}</div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Detail panel: the last 7 days, the goal, reminders, and reset.

function Detail({
  habit,
  days,
  streak,
  goal,
  reminder,
  onReset,
  onSave,
}: {
  habit: Habit;
  days: Day[];
  streak: number;
  goal?: number;
  reminder: boolean;
  onReset: () => void;
  onSave: (goal: number | undefined, reminder: boolean) => void;
}) {
  const [draftGoal, setDraftGoal] = useState(goal);
  const [draftReminder, setDraftReminder] = useState(reminder);
  const unit = habit.unit === "min" ? "min" : habit.unit;
  const letters = [...pastDays.map((d) => d.letter), "T"];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-baseline justify-between">
          <p className={cx(label, "text-(--muted)")}>Last 7 days</p>
          <p className="text-sm">
            <span className="font-bold">{streak}</span> {streak === 1 ? "day" : "days"} in a row
          </p>
        </div>
        <div className="mt-2 grid grid-cols-7 justify-items-center gap-1 rounded-[1.25rem] bg-[#16182a] px-3 pt-2.5 pb-1.5">
          {days.map((d, i) => (
            <span key={i} className="flex flex-col items-center gap-1">
              <Porthole day={d} />
              <span className={cx(label, "text-[10px] text-[#5f8f7c]")}>{letters[i]}</span>
            </span>
          ))}
        </div>
      </div>

      {habit.goals && draftGoal !== undefined && (
        <SelectField
          label="Daily goal"
          options={habit.goals.map((g) => `${g} ${unit}`)}
          value={`${draftGoal} ${unit}`}
          onChange={(v) => setDraftGoal(parseInt(v))}
        />
      )}
      <Toggle label="Daily reminder" on={draftReminder} onChange={setDraftReminder} />

      <div className="flex flex-wrap justify-between gap-2 border-t border-(--border) pt-5">
        <Key variant="secondary" lamp={false} onClick={onReset}>
          Reset today
        </Key>
        <Key onClick={() => onSave(draftGoal, draftReminder)}>Save</Key>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Week: the mission log, and a row per day to fix past check-ins.

function Week({
  past,
  setPast,
  met,
  streaks,
  onToday,
}: {
  past: Record<HabitId, boolean[]>;
  setPast: React.Dispatch<React.SetStateAction<Record<HabitId, boolean[]>>>;
  met: (id: HabitId) => boolean;
  streaks: Record<HabitId, number>;
  onToday: () => void;
}) {
  const log: LogRow[] = habits.map((h) => [
    h.short,
    [...past[h.id].map((m): Day => (m ? "met" : "missed")), met(h.id) ? "met" : "today"],
    streaks[h.id],
  ]);

  function toggle(id: HabitId, day: number, value: boolean) {
    setPast((p) => ({ ...p, [id]: p[id].map((m, i) => (i === day ? value : m)) }));
  }

  // Newest first, today on top.
  const rows = [
    { short: today.short, isToday: true, marks: habits.map((h) => met(h.id)), index: -1 },
    ...pastDays
      .map((d, i) => ({ short: d.short, isToday: false, marks: habits.map((h) => past[h.id][i]), index: i }))
      .reverse(),
  ];

  return (
    <div>
      <p className={cx(label, "text-(--muted)")}>Oct 7 – 13</p>
      <h1 className={cx(display, "mt-3 text-4xl leading-tight sm:text-5xl")}>This week</h1>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-10">
        <div className="flex flex-col gap-3">
          <MissionLog log={log} days={[...pastDays.map((d) => d.letter), "T"]} />
          <p className="text-sm text-(--muted)">Lit: goal met. Dashed: today, still open. The number is the streak.</p>
        </div>

        <ul className="divide-y divide-(--border) rounded-[2rem] border-2 border-(--text) bg-(--surface) px-5 sm:px-6">
          {rows.map((r) => {
            const all = r.marks.every(Boolean);
            return (
              <li key={r.short} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center justify-between gap-3 sm:w-28 sm:shrink-0 sm:flex-col sm:items-start sm:gap-1.5">
                  <span className={cx(label, "font-bold")}>
                    {r.short}
                    {r.isToday && <span className="font-normal text-(--muted)"> · Today</span>}
                  </span>
                  {all ? <GoalBadge>All 4</GoalBadge> : r.isToday && <TextLink onClick={onToday}>Log today →</TextLink>}
                </div>
                <fieldset className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2.5 sm:flex sm:flex-wrap sm:gap-x-6">
                  <legend className="sr-only">{r.short}</legend>
                  {habits.map((h, j) => (
                    <Checkbox
                      key={h.id}
                      label={h.short}
                      checked={r.marks[j]}
                      disabled={r.isToday}
                      onChange={(v) => toggle(h.id, r.index, v)}
                    />
                  ))}
                </fieldset>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
