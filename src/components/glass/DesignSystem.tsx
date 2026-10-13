import Link from "next/link";
import { contrast } from "@/lib/color";
import { themeVars, type Style } from "@/lib/styles";
import {
  Bead,
  ExerciseRing,
  MoodBubbles,
  MoodFace,
  PageStepper,
  Pane,
  ProgressBar,
  ProgressRing,
  TodaySummary,
  Tumbler,
  WaterGlasses,
  WeekLog,
} from "./habits";
import { glass, pane, spectrum } from "./tokens";
import {
  Checkbox,
  Chips,
  DetailPanel,
  GoalBadge,
  ModalDemo,
  Pill,
  RadioGroup,
  SelectField,
  StreakBadge,
  Tabs,
  TextField,
  TextLink,
  Toggle,
} from "./ui";

const label = "font-(family-name:--font-label) text-xs tracking-[0.12em] uppercase";

function Section({ n, title, children, className }: { n: number; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={className}>
      <h2 className="flex items-center gap-3">
        <span
          style={{ backgroundImage: spectrum }}
          className="grid size-7 place-items-center rounded-full font-(family-name:--font-label) text-xs font-medium text-[#1a1033]"
        >
          {n}
        </span>
        <span className="font-(family-name:--font-display) text-xl font-light tracking-tight">{title}</span>
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <p className={`${label} mt-2 text-center text-(--muted)`}>{children}</p>;
}

function Ratio({ fg, bg }: { fg: string; bg: string }) {
  return <span className="font-semibold">{contrast(fg, bg).toFixed(1)}:1</span>;
}

// Soft blobs of light behind the panes, so the frost has something to blur.
function Orbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute top-40 left-[38%] size-72 rounded-full bg-[#a98bff]/50 blur-3xl" />
      <span className="absolute top-[34rem] right-[6%] size-64 rounded-full bg-[#ff8a3d]/40 blur-3xl" />
      <span className="absolute top-[70rem] left-[4%] size-80 rounded-full bg-[#5cc8ff]/30 blur-3xl" />
      <span className="absolute bottom-40 left-[50%] size-96 rounded-full bg-[#6a3df0]/40 blur-3xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------

function ColorRoles({ style }: { style: Style }) {
  const p = style.palette;
  const roles: [string, string, React.ReactNode?][] = [
    ["Background", p.background],
    ["Surface", p.surface],
    ["Text", p.text, <Ratio key="t" fg={p.text} bg={p.surface} />],
    ["Muted", p.muted, <Ratio key="m" fg={p.muted} bg={p.surface} />],
    ["Border", p.border],
    ["Accent", p.accent, <Ratio key="a" fg={glass.ink} bg={p.accent} />],
  ];
  const support: [string, string, string, React.ReactNode][] = [
    ["Blue", glass.blue, "links · focus · water", <Ratio key="1" fg={glass.blue} bg={p.surface} />],
    ["Violet", glass.violet, "checked · spectrum", <Ratio key="2" fg={glass.violet} bg={p.surface} />],
    ["Deep violet", glass.violetDeep, "selected · engaged", <Ratio key="3" fg="#ffffff" bg={glass.violetDeep} />],
    ["Outline", glass.outline, "control outlines", <Ratio key="4" fg={glass.outline} bg={p.surface} />],
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {roles.map(([name, hex, ratio]) => (
          <div key={name} className="text-center">
            <div style={{ backgroundColor: hex }} className="h-14 rounded-2xl border border-white/20" />
            <p className="mt-1.5 text-xs">{name}</p>
            <p className="text-[11px] text-(--muted)">{hex}</p>
            {ratio && <p className="text-[11px]">{ratio}</p>}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {support.map(([name, hex, use, ratio]) => (
          <div key={name} className="flex items-center gap-2.5">
            <span style={{ backgroundColor: hex }} className="size-8 shrink-0 rounded-full border border-white/20" />
            <span className="text-xs leading-snug">
              {name} {ratio}
              <br />
              <span className="text-(--muted)">{use}</span>
            </span>
          </div>
        ))}
      </div>
      <div>
        <div style={{ backgroundImage: spectrum }} className="h-4 rounded-full" />
        <p className="mt-2 text-xs text-(--muted)">
          The spectrum, blue → violet → orange. Only for progress and &ldquo;goal met&rdquo;.
        </p>
      </div>
      <p className="text-sm text-(--muted)">
        Surface is the frosted pane (white at 8%) over the background, flattened to one color so ratios can be checked.
        Text ratios are against it; the accent ratio is the dark ink on the orange button. Orange is only for the one
        primary action on a screen.
      </p>
    </div>
  );
}

function TypeRoles() {
  const rows: [React.ReactNode, string, string][] = [
    [<span key="d" className="font-(family-name:--font-display) text-5xl font-extralight tracking-tight">3 of 4</span>, "Display", "Outfit 200 · 48"],
    [<span key="h" className="font-(family-name:--font-display) text-2xl font-light tracking-tight">This week</span>, "Heading", "Outfit 300 · 24"],
    [<span key="b" className="text-base">Five glasses so far. Three to go before bed.</span>, "Body", "DM Sans 400 · 16 / 24"],
    [<span key="l" className={label}>Best streak</span>, "Label", "DM Mono 400 · 12 · caps"],
  ];
  return (
    <div className="flex flex-col divide-y divide-white/10">
      {rows.map(([sample, role, spec]) => (
        <div key={role} className="flex items-baseline justify-between gap-4 py-3">
          {sample}
          <span className="shrink-0 text-right text-xs text-(--muted)">
            {role}
            <br />
            {spec}
          </span>
        </div>
      ))}
    </div>
  );
}

function SpacingAndShape() {
  const scale = [4, 8, 12, 16, 24, 32, 48];
  const corners: [string, string, string][] = [
    ["16px", "rounded-2xl", "fields · glasses"],
    ["28px", "rounded-[1.75rem]", "panes · panels"],
    ["full", "rounded-full", "buttons · chips · tabs"],
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-3">
        {scale.map((s) => (
          <div key={s} className="flex flex-col items-center gap-1.5">
            <span style={{ height: s, width: 14, backgroundImage: spectrum }} className="rounded-full" />
            <span className="text-[11px] text-(--muted)">{s}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {corners.map(([size, cls, use]) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            <span className={`h-12 w-16 ${pane} ${cls}`} />
            <span className="text-[11px]">{size}</span>
            <span className="text-[11px] text-(--muted)">{use}</span>
          </div>
        ))}
      </div>
      <ul className="flex flex-col gap-1.5 text-sm text-(--muted)">
        <li>
          <span className="text-(--text)">Glass:</span> white at 8% with a 24px backdrop blur. Controls on a pane go up
          to 12%.
        </li>
        <li>
          <span className="text-(--text)">Edges:</span> a 1px white line at 15%, and a brighter 1px highlight along the
          top. Control outlines use the solid outline color so they stay visible.
        </li>
        <li>
          <span className="text-(--text)">Depth:</span> one soft drop shadow under panes. Glow, never a hard shadow, for
          hover and goal met.
        </li>
      </ul>
    </div>
  );
}

function Components() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Pill>Log</Pill>
        <Pill variant="secondary">Undo</Pill>
        <TextLink>See week →</TextLink>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Pages read" placeholder="e.g. 12" />
        <SelectField label="Water goal" options={["6 glasses", "8 glasses", "10 glasses"]} defaultValue="8 glasses" />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Checkbox label="Done" defaultChecked />
        <RadioGroup name="glass-window" options={["Morning", "Evening"]} />
        <Toggle label="Reminders" defaultOn />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs tabs={["Today", "Week"]} />
        <Chips chips={["All", "Body", "Mind"]} defaultChip="Body" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Card: one habit on a pane. */}
        <Pane className="flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`${label} text-(--muted)`}>Reading · Mind</p>
              <p className="mt-1 font-(family-name:--font-display) text-3xl font-light">
                12 <span className="text-lg text-(--muted)">/ 20 pages</span>
              </p>
            </div>
            <StreakBadge days={5} />
          </div>
          <ProgressBar value={12} total={20} name="Reading" />
        </Pane>
        {/* List rows: the week, one row per day. */}
        <ul className={`${pane} divide-y divide-white/10 rounded-[1.75rem] px-5`}>
          {[
            ["Thu 09", ["met", "met", "met", "met"], true],
            ["Wed 08", ["met", "met", "missed", "met"], false],
            ["Tue 07", ["met", "missed", "met", "met"], false],
          ].map(([day, marks, best]) => (
            <li key={day as string}>
              <a
                href="#"
                className="-mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-3 hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-[#5cc8ff]"
              >
                <span className={`${label} w-16`}>{day as string}</span>
                <span className="flex gap-1.5">
                  {(marks as ("met" | "missed")[]).map((m, i) => (
                    <Bead key={i} day={m} />
                  ))}
                </span>
                {best ? <GoalBadge>All 4</GoalBadge> : <span aria-hidden className="text-(--muted)">→</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <DetailPanel title="Water">
          <p className={`${label} text-(--muted)`}>Last 7 days</p>
          <div className="mt-2 flex gap-1.5">
            {(["met", "met", "missed", "met", "met", "met", "today"] as const).map((d, i) => (
              <Bead key={i} day={d} />
            ))}
          </div>
          <div className="mt-4">
            <SelectField label="Goal" options={["6 glasses", "8 glasses", "10 glasses"]} defaultValue="8 glasses" />
          </div>
          <div className="mt-5 flex gap-2">
            <Pill variant="secondary">Reset</Pill>
            <Pill>Save</Pill>
          </div>
        </DetailPanel>
        <div className="flex flex-col gap-3">
          <ModalDemo trigger="Open detail" title="Reading">
            <p className="text-(--muted)">12 of 20 pages today. Five days in a row.</p>
            <div className="mt-5 flex gap-2">
              <Pill variant="secondary">Reset</Pill>
              <Pill>Save</Pill>
            </div>
          </ModalDemo>
          <div className="flex flex-wrap gap-2">
            <GoalBadge />
            <StreakBadge days={21} />
          </div>
        </div>
      </div>
      <p className="text-sm text-(--muted)">
        Buttons, link, input, select, checkbox, radio, toggle, tabs, chips, card, list rows, badges, detail panel and
        modal. Everything is live: hover, press, and tab through it.
      </p>
    </div>
  );
}

function ControlStates() {
  const pills: [string, React.ReactNode][] = [
    ["Rest", <Pill key="r">Log</Pill>],
    ["Hover", <Pill key="h" forced="hover">Log</Pill>],
    ["Focus", <Pill key="f" forced="focus">Log</Pill>],
    ["Pressed", <Pill key="p" forced="pressed">Log</Pill>],
    ["Selected", <Pill key="s" selected>Logged</Pill>],
    ["Disabled", <Pill key="d" disabled>Log</Pill>],
  ];
  const glasses: [string, React.ReactNode][] = [
    ["Empty", <Tumbler key="e" look="empty" aria-label="Empty" />],
    ["Hover", <Tumbler key="h" look="empty" forced="hover" aria-label="Hover" />],
    ["Focus", <Tumbler key="f" look="empty" forced="focus" aria-label="Focus" />],
    ["Pressed", <Tumbler key="p" look="full" forced="pressed" aria-label="Pressed" />],
    ["Filled", <Tumbler key="s" look="full" aria-label="Filled" />],
    ["Disabled", <Tumbler key="d" look="empty" disabled aria-label="Disabled" />],
  ];
  const progress: [string, number][] = [
    ["Empty", 0],
    ["Partway", 5],
    ["Goal met", 8],
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {pills.map(([name, el]) => (
          <div key={name} className="flex flex-col items-center">
            <div className="flex h-12 items-center">{el}</div>
            <Caption>{name}</Caption>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {glasses.map(([name, el]) => (
          <div key={name} className="flex flex-col items-center">
            {el}
            <Caption>{name}</Caption>
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {progress.map(([name, v]) => (
          <div key={name}>
            <ProgressBar value={v} total={8} name={name} />
            <Caption>
              {name} · {v} of 8
            </Caption>
          </div>
        ))}
      </div>
      <p className="text-sm text-(--muted)">
        Hover adds light: the pane brightens and the orange glows. Press sinks to 96%. Focus is always a 2px blue ring.
        A hovered empty glass shows a faint fill: &ldquo;fill to here&rdquo;.
      </p>
    </div>
  );
}

function UIStates() {
  const states: [string, React.ReactNode, string][] = [
    [
      "Empty",
      <span key="e" className="flex flex-col items-center gap-2">
        <ProgressRing value={0} total={4} size={40} thickness={5} />
        <span className="text-xs">Nothing logged yet today</span>
      </span>,
      "A clear ring, waiting",
    ],
    [
      "Loading",
      <span key="l" className="flex flex-col items-center gap-2">
        <span
          style={{ backgroundImage: `conic-gradient(transparent 0 40%, ${glass.violet}, ${glass.blue})` }}
          className="size-10 animate-spin rounded-full [mask:radial-gradient(farthest-side,transparent_calc(100%-5px),#000_calc(100%-4px))] [animation-duration:1.2s]"
        />
        <span className="text-xs">Loading…</span>
      </span>,
      "Fetching the week",
    ],
    [
      "Error",
      <span key="x" className="flex flex-col items-center gap-2 text-[#ff7aa2]">
        <span className="grid size-10 place-items-center rounded-full border border-[#ff7aa2] bg-[#ff7aa2]/15 font-bold">!</span>
        <span className="text-xs">Couldn&rsquo;t save</span>
      </span>,
      "Try again",
    ],
    [
      "Success",
      <span key="s" className="flex flex-col items-center gap-2">
        <span className="grid size-10 place-items-center rounded-full bg-[#7ef0c1] text-[#1a1033] shadow-[0_0_16px_rgba(126,240,193,0.5)]">
          ✓
        </span>
        <span className="text-xs">Logged</span>
      </span>,
      "Saved for today",
    ],
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {states.map(([name, el, note]) => (
        <div key={name}>
          <Pane className="!p-3">
            <div className="flex h-24 items-center justify-center">{el}</div>
          </Pane>
          <Caption>{name}</Caption>
          <p className="text-center text-xs text-(--muted)">{note}</p>
        </div>
      ))}
    </div>
  );
}

function HabitPieces() {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className={`${label} mb-3 text-(--muted)`}>Today: the overall summary</p>
          <TodaySummary />
        </div>
        <div>
          <p className={`${label} mb-3 text-(--muted)`}>Week: a bead per habit per day</p>
          <WeekLog />
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        <Piece title="Water" note="Glass tumblers. Tap one to fill up to it; tap the last full one to empty it.">
          <WaterGlasses />
        </Piece>
        <Piece title="Reading" note="Step, or type the page count. The bar warms from blue to orange.">
          <PageStepper />
        </Piece>
        <Piece title="Exercise" note="A ring toward the goal. Add minutes, or start, pause, and stop the timer.">
          <ExerciseRing />
        </Piece>
        <Piece title="Mood" note="Five bubbles, blue to orange. Arrow keys move between them.">
          <MoodBubbles />
        </Piece>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <p className={`${label} text-(--muted)`}>Timer</p>
        {(["idle", "running", "paused"] as const).map((t) => (
          <span key={t} className={`${label} rounded-full border border-white/15 bg-white/5 px-3 py-1`}>
            {t}
          </span>
        ))}
        <span className="text-sm text-(--muted)">
          Idle shows +5, +15, Start. Running shows a pulsing orange dot and Pause. Paused offers Stop or Resume.
        </span>
      </div>
      <div className="flex items-end gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <MoodFace key={i} index={i} size={36} />
        ))}
        <span className="text-sm text-(--muted)">Mood tints: rough, low, okay, good, great.</span>
      </div>
    </div>
  );
}

function Piece({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <Pane className="flex flex-col gap-4 !p-5">
      <div>
        <h3 className="font-(family-name:--font-display) text-xl font-light">{title}</h3>
        <p className="mt-1 text-sm text-(--muted)">{note}</p>
      </div>
      {children}
    </Pane>
  );
}

// ---------------------------------------------------------------------------

export function GlassDesignSystem({ style }: { style: Style }) {
  return (
    <div
      style={themeVars(style)}
      className={`relative min-h-full bg-(--background) font-(family-name:--font-body) text-(--text) ${style.page ?? ""}`}
    >
      <Orbs />
      <main className="relative mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
        <Link href="/" className="text-sm text-(--muted) hover:text-(--text)">
          ← Hub
        </Link>
        <h1 className="mt-8 font-(family-name:--font-display) text-5xl font-extralight tracking-tight sm:text-6xl">
          {style.name} · Design System
        </h1>

        <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col gap-12">
            <Section n={1} title="Color roles">
              <ColorRoles style={style} />
            </Section>
            <Section n={2} title="Type roles">
              <TypeRoles />
            </Section>
            <Section n={3} title="Spacing and shape">
              <SpacingAndShape />
            </Section>
          </div>
          <div className="flex flex-col gap-12">
            <Section n={4} title="Components">
              <Components />
            </Section>
            <Section n={5} title="Control states">
              <ControlStates />
            </Section>
            <Section n={6} title="UI states">
              <UIStates />
            </Section>
          </div>
        </div>

        <Section n={7} title="Habit pieces" className="mt-16 border-t border-white/10 pt-12">
          <HabitPieces />
        </Section>
      </main>
    </div>
  );
}
