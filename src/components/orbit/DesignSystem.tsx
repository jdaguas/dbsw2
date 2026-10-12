import Link from "next/link";
import { contrast } from "@/lib/color";
import { themeVars, type Style } from "@/lib/styles";
import {
  ConsoleScreen,
  ExerciseDial,
  FuelCell,
  MissionLog,
  MoodPhases,
  OrbitTrack,
  PageStepper,
  Porthole,
  TodayConsole,
  WaterCells,
} from "./habits";
import { orbit } from "./tokens";
import {
  Checkbox,
  Chips,
  DetailPanel,
  GoalBadge,
  Key,
  ModalDemo,
  RadioGroup,
  SelectField,
  StreakBadge,
  Tabs,
  TextField,
  TextLink,
  Toggle,
} from "./ui";

const label = "font-(family-name:--font-label) text-xs tracking-[0.15em] uppercase";

function Section({ n, title, children, className }: { n: number; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={className}>
      <h2 className="flex items-center gap-3">
        <span className="grid size-7 place-items-center rounded-full bg-[#1c2a4a] font-(family-name:--font-label) text-xs font-bold text-[#f3ead8]">
          {n}
        </span>
        <span className={`${label} font-bold text-(--text)`}>{title}</span>
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <p className={`${label} mt-2 text-center text-(--muted)`}>{children}</p>;
}

function Ratio({ fg, bg }: { fg: string; bg: string }) {
  return <span className="font-bold">{contrast(fg, bg).toFixed(1)}:1</span>;
}

// ---------------------------------------------------------------------------

function ColorRoles({ style }: { style: Style }) {
  const p = style.palette;
  const roles: [string, string, React.ReactNode?][] = [
    ["Background", p.background],
    ["Surface", p.surface],
    ["Text", p.text, <Ratio key="t" fg={p.text} bg={p.background} />],
    ["Muted", p.muted, <Ratio key="m" fg={p.muted} bg={p.background} />],
    ["Border", p.border],
    ["Accent", p.accent, <Ratio key="a" fg={p.accent} bg={p.background} />],
  ];
  const support: [string, string, string, React.ReactNode][] = [
    ["Teal", orbit.teal, "links · focus · checked", <Ratio key="1" fg={orbit.teal} bg={p.background} />],
    ["Mustard", orbit.mustard, "lamps · planets · goal met", <Ratio key="2" fg={orbit.navy} bg={orbit.mustard} />],
    ["Navy", orbit.navy, "selected · engaged", <Ratio key="3" fg={p.background} bg={orbit.navy} />],
    ["Screen", orbit.screen, "console glass", <Ratio key="4" fg={orbit.phosphor} bg={orbit.screen} />],
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {roles.map(([name, hex, ratio]) => (
          <div key={name} className="text-center">
            <div style={{ backgroundColor: hex }} className="h-14 rounded-2xl border border-[#8a7f6c]/40" />
            <p className="mt-1.5 text-xs">{name}</p>
            <p className="text-[11px] text-(--muted)">{hex}</p>
            {ratio && <p className="text-[11px]">{ratio}</p>}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {support.map(([name, hex, use, ratio]) => (
          <div key={name} className="flex items-center gap-2.5">
            <span style={{ backgroundColor: hex }} className="size-8 shrink-0 rounded-full" />
            <span className="text-xs leading-snug">
              {name} {ratio}
              <br />
              <span className="text-(--muted)">{use}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="text-sm text-(--muted)">
        Ratios are against the background, or for the pair each color is used in. The accent is only for the one
        primary action on a screen.
      </p>
    </div>
  );
}

function TypeRoles() {
  const rows: [React.ReactNode, string, string][] = [
    [<span key="d" className="font-(family-name:--font-display) text-4xl tracking-wide uppercase">Day 21</span>, "Display", "Michroma 40 · caps"],
    [<span key="h" className="font-(family-name:--font-display) text-xl tracking-wide uppercase">This week</span>, "Heading", "Michroma 20 · caps"],
    [<span key="b" className="text-base">Five glasses so far. Three to go before bed.</span>, "Body", "Jost 400 · 16 / 24"],
    [<span key="l" className={`${label} font-bold`}>Best streak</span>, "Label", "Space Mono 700 · 12 · caps"],
  ];
  return (
    <div className="flex flex-col divide-y divide-(--border)">
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
    ["12px", "rounded-xl", "keys · fields"],
    ["32px", "rounded-[2rem]", "cards · panels"],
    ["32/40", "rounded-[2rem/2.5rem]", "screens"],
    ["full", "rounded-full", "chips · toggles"],
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-3">
        {scale.map((s) => (
          <div key={s} className="flex flex-col items-center gap-1.5">
            <span style={{ height: s, width: 14 }} className="rounded-t-full bg-[#1f6f78]" />
            <span className="text-[11px] text-(--muted)">{s}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {corners.map(([size, cls, use]) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            <span className={`h-12 w-16 border-2 border-(--text) ${cls}`} />
            <span className="text-[11px]">{size}</span>
            <span className="text-[11px] text-(--muted)">{use}</span>
          </div>
        ))}
      </div>
      <ul className="flex flex-col gap-1.5 text-sm text-(--muted)">
        <li>
          <span className="text-(--text)">Borders:</span> 1px light line for dividers, 2px dark outline on controls.
        </li>
        <li>
          <span className="text-(--text)">Depth:</span> no drop shadows. Keys get a 4px bottom edge that sinks when
          pressed; screens get an inner glow.
        </li>
      </ul>
    </div>
  );
}

function Components() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Key>Log</Key>
        <Key variant="secondary">Skip</Key>
        <TextLink>See week →</TextLink>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Pages read" placeholder="e.g. 12" />
        <SelectField label="Water goal" options={["6 glasses", "8 glasses", "10 glasses"]} defaultValue="8 glasses" />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Checkbox label="Done" defaultChecked />
        <RadioGroup name="window" options={["Morning", "Evening"]} />
        <Toggle label="Reminders" defaultOn />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs tabs={["Today", "Week", "Month"]} />
        <Chips chips={["All", "Body", "Mind"]} defaultChip="Body" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Card: one habit, with a sweeping corner. */}
        <div className="rounded-[2rem_2rem_2rem_0.75rem] border-2 border-(--text) bg-(--surface) p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className={`${label} text-(--muted)`}>Reading · 20 pp goal</p>
              <p className="mt-1 font-(family-name:--font-display) text-2xl tracking-wide">12 / 20</p>
            </div>
            <StreakBadge days={5} size={52} />
          </div>
          <OrbitTrack value={12} total={20} size={160} />
        </div>
        {/* List rows: the week, one row per day. */}
        <ul className="divide-y divide-(--border) rounded-[2rem] border-2 border-(--text) bg-(--surface) px-5">
          {[
            ["Thu 09", ["met", "met", "met", "met"], true],
            ["Wed 08", ["met", "met", "missed", "met"], false],
            ["Tue 07", ["met", "missed", "met", "met"], false],
          ].map(([day, marks, best]) => (
            <li key={day as string}>
              <a
                href="#"
                className="flex items-center justify-between gap-3 py-3 hover:text-[#1f6f78] focus-visible:outline-3 focus-visible:outline-[#1f6f78]"
              >
                <span className={`${label} w-16`}>{day as string}</span>
                <span className="flex gap-1.5 rounded-full bg-[#16182a] px-2.5 py-1.5">
                  {(marks as ("met" | "missed")[]).map((m, i) => (
                    <span key={i} className="scale-75">
                      <Porthole day={m} />
                    </span>
                  ))}
                </span>
                {best ? <GoalBadge>All 4</GoalBadge> : <span aria-hidden>→</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <DetailPanel title="Water">
          <p className={`${label} text-(--muted)`}>This week</p>
          <div className="mt-2 flex gap-1.5 rounded-full bg-[#16182a] px-3 py-2">
            {(["met", "met", "met", "met", "met", "met", "today"] as const).map((d, i) => (
              <Porthole key={i} day={d} />
            ))}
          </div>
          <div className="mt-4">
            <SelectField label="Goal" options={["6 glasses", "8 glasses", "10 glasses"]} defaultValue="8 glasses" />
          </div>
          <div className="mt-5 flex gap-2">
            <Key variant="secondary" lamp={false}>
              Reset
            </Key>
            <Key>Save</Key>
          </div>
        </DetailPanel>
        <div className="flex flex-col gap-3">
          <ModalDemo trigger="Open detail" title="Reading">
            <p className="text-(--muted)">12 of 20 pages today. Five days in a row.</p>
            <div className="mt-5 flex gap-2">
              <Key variant="secondary" lamp={false}>
                Reset
              </Key>
              <Key>Save</Key>
            </div>
          </ModalDemo>
          <div className="flex flex-wrap gap-2">
            <GoalBadge />
            <StreakBadge days={21} size={48} />
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
  const keys: [string, React.ReactNode][] = [
    ["Rest", <Key key="r">Log</Key>],
    ["Hover", <Key key="h" forced="hover">Log</Key>],
    ["Focus", <Key key="f" forced="focus">Log</Key>],
    ["Pressed", <Key key="p" forced="pressed">Log</Key>],
    ["Selected", <Key key="s" selected>✓ Logged</Key>],
    ["Disabled", <Key key="d" disabled>Log</Key>],
  ];
  const cells: [string, React.ReactNode][] = [
    ["Empty", <FuelCell key="e" look="empty" aria-label="Empty" />],
    ["Hover", <FuelCell key="h" look="empty" forced="hover" aria-label="Hover" />],
    ["Focus", <FuelCell key="f" look="empty" forced="focus" aria-label="Focus" />],
    ["Pressed", <FuelCell key="p" look="full" forced="pressed" aria-label="Pressed" />],
    ["Full", <FuelCell key="s" look="full" aria-label="Full" />],
    ["Disabled", <FuelCell key="d" look="empty" disabled aria-label="Disabled" />],
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {keys.map(([name, el]) => (
          <div key={name} className="flex flex-col items-center">
            <div className="flex h-12 items-start">{el}</div>
            <Caption>{name}</Caption>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {cells.map(([name, el]) => (
          <div key={name} className="flex flex-col items-center">
            {el}
            <Caption>{name}</Caption>
          </div>
        ))}
      </div>
      <p className="text-sm text-(--muted)">
        The lamp tells you what a key will do: it lights amber on hover and press, and glows green once logged.
      </p>
    </div>
  );
}

function UIStates() {
  const states: [string, React.ReactNode, string][] = [
    [
      "Empty",
      <span key="e" className="flex flex-col items-center gap-2">
        <span className="flex gap-1">
          {Array.from({ length: 7 }, (_, i) => (
            <Porthole key={i} day="missed" />
          ))}
        </span>
        <span className="text-xs">No signal yet</span>
      </span>,
      "Nothing logged today",
    ],
    [
      "Loading",
      <span key="l" className="flex flex-col items-center gap-2">
        <span className="relative size-8 animate-spin rounded-full border-2 border-[#5f8f7c]/50 [animation-duration:1.6s]">
          <span className="absolute -top-1.5 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-[#e8a33d]" />
        </span>
        <span className="text-xs">Loading…</span>
      </span>,
      "Fetching the week",
    ],
    [
      "Error",
      <span key="x" className="flex flex-col items-center gap-2 text-[#ff7a45]">
        <span className="grid size-8 place-items-center rounded-full border-2 border-[#ff7a45] font-bold">!</span>
        <span className="text-xs">Lost contact</span>
      </span>,
      "Couldn't save. Try again.",
    ],
    [
      "Success",
      <span key="s" className="flex flex-col items-center gap-2">
        <span className="grid size-8 place-items-center rounded-full bg-[#9fe3c4] text-[#16182a]">✓</span>
        <span className="text-xs">Logged</span>
      </span>,
      "Saved for today",
    ],
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {states.map(([name, el, note]) => (
        <div key={name}>
          <ConsoleScreen className="!rounded-[1.75rem] !p-2">
            <div className="flex h-20 items-center justify-center">{el}</div>
          </ConsoleScreen>
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
          <p className={`${label} mb-3 text-(--muted)`}>Today, on the console</p>
          <TodayConsole />
        </div>
        <div>
          <p className={`${label} mb-3 text-(--muted)`}>Streaks: the mission log</p>
          <MissionLog />
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        <Piece title="Water" note="Fuel cells. Tap one to fill up to it; tap the last full one to empty it.">
          <WaterCells />
        </Piece>
        <Piece title="Reading" note="A planet orbits as pages add up, and turns gold when the goal is met.">
          <PageStepper />
        </Piece>
        <Piece title="Exercise" note="A gauge from 0 to the goal. Add minutes or run the timer.">
          <ExerciseDial />
        </Piece>
        <Piece title="Mood" note="Moon phases, from new moon to full. Arrow keys move between them.">
          <MoodPhases />
        </Piece>
      </div>
    </div>
  );
}

function Piece({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-(--border) bg-(--surface) p-5">
      <div>
        <h3 className="font-(family-name:--font-display) text-lg tracking-wide uppercase">{title}</h3>
        <p className="mt-1 text-sm text-(--muted)">{note}</p>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------

export function OrbitDesignSystem({ style }: { style: Style }) {
  return (
    <div style={themeVars(style)} className="min-h-full bg-(--background) font-(family-name:--font-body) text-(--text)">
      <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
        <Link href="/" className="text-sm text-(--muted) hover:text-(--text)">
          ← Hub
        </Link>
        <h1 className="mt-8 font-(family-name:--font-display) text-4xl tracking-wide uppercase sm:text-5xl">
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

        <Section n={7} title="Habit pieces" className="mt-16 border-t border-(--border) pt-12">
          <HabitPieces />
        </Section>
      </main>
    </div>
  );
}
