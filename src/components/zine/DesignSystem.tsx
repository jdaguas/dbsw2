import Link from "next/link";
import { contrast } from "@/lib/color";
import { themeVars, type Style } from "@/lib/styles";
import { DayMark, ExerciseClock, FaceSticker, Glass, MoodStickers, PageHighlighter, Sheet, StarChart, TodayCover, WaterGlasses } from "./habits";
import { CutOut, Scrap, StarSticker, Stamp, Tape, cutClip, tapeClip, tornClip, zine } from "./paper";
import { Checkbox, Chips, DetailPanel, Key, ModalDemo, RadioGroup, SelectField, Tabs, TextField, TextLink, Toggle } from "./ui";

const typed = "font-(family-name:--font-label) text-sm uppercase";
const note = "font-(family-name:--font-reenie) text-2xl leading-none";

function Section({ n, title, children, className }: { n: number; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={className}>
      <h2 className="flex items-center gap-3">
        <CutOut text={String(n)} size={26} />
        <span className="font-(family-name:--font-marker) text-xl uppercase">{title}</span>
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <p className={`${typed} mt-2 text-center text-xs text-(--muted)`}>{children}</p>;
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
    ["Accent", p.accent, <Ratio key="a" fg="#ffffff" bg={p.accent} />],
  ];
  const stickers: [string, string, string][] = [
    ["Yellow", zine.yellow, zine.ink],
    ["Blue", zine.blue, "#ffffff"],
    ["Lilac", zine.lilac, zine.ink],
    ["Mint", zine.mint, zine.ink],
    ["Tomato", zine.tomato, zine.ink],
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-6">
        {roles.map(([name, hex, ratio], i) => (
          <div key={name} className="text-center">
            <div
              style={{ backgroundColor: hex, clipPath: cutClip(i * 13 + 2), rotate: `${(i % 3) - 1}deg` }}
              className="h-14 border-2 border-[#141414]"
            />
            <p className="mt-1.5 text-xs">{name}</p>
            <p className="text-[11px] text-(--muted)">{hex}</p>
            {ratio && <p className="text-[11px]">{ratio}</p>}
          </div>
        ))}
      </div>
      <div>
        <p className={`${typed} mb-2 text-xs text-(--muted)`}>Sticker colors: only for stickers, highlights, and marks</p>
        <div className="flex flex-wrap gap-4">
          {stickers.map(([name, hex, fg], i) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <StarSticker color={hex} size={44} tilt={(i - 2) * 9} />
              <span className="text-[11px]">{name}</span>
              <span className="text-[11px] text-(--muted)">
                {fg === "#ffffff" ? "white" : "black"} text <Ratio fg={fg} bg={hex} />
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-(--muted)">
        Black ink on paper does most of the work. Hot pink is only for the primary action; the stickers are the reward,
        so they stay rare.
      </p>
    </div>
  );
}

function TypeRoles() {
  const rows: [React.ReactNode, string, string][] = [
    [<CutOut key="d" text="drink water" size={30} />, "Display", "Cut-out letters · mixed faces"],
    [<span key="h" className="font-(family-name:--font-marker) text-2xl uppercase">This week</span>, "Heading", "Permanent Marker 24 · caps"],
    [<span key="b" className="text-base">Five glasses so far. Three to go before bed.</span>, "Body", "Courier Prime 16 / 24"],
    [<span key="l" className={typed}>Best streak</span>, "Label", "Special Elite 14 · caps"],
    [<span key="n" className={note}>the good chapter!</span>, "Note", "Reenie Beanie 24"],
  ];
  return (
    <div className="flex flex-col divide-y divide-dashed divide-[#141414]/25">
      {rows.map(([sample, role, spec]) => (
        <div key={role} className="flex items-center justify-between gap-4 py-3">
          {sample}
          <span className="shrink-0 text-right text-xs text-(--muted)">
            {role}
            <br />
            {spec}
          </span>
        </div>
      ))}
      <p className="pt-3 text-sm text-(--muted)">
        Cut-outs are for one big word per screen. Marker for headings, typewriter for reading, pen for the asides.
      </p>
    </div>
  );
}

function SpacingAndShape() {
  const scale = [4, 8, 12, 16, 24, 32, 48];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-3">
        {scale.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-1.5">
            <span style={{ height: s, width: 14, clipPath: cutClip(i + 40) }} className="bg-[#141414]" />
            <span className="text-[11px] text-(--muted)">{s}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-5">
        <div className="flex flex-col items-center gap-1.5">
          <span style={{ clipPath: cutClip(77) }} className="block h-12 w-16 bg-[#141414]" />
          <span className="text-[11px] text-(--muted)">cut scrap</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span style={{ clipPath: tornClip }} className="block h-12 w-16 border-2 border-[#141414] bg-white" />
          <span className="text-[11px] text-(--muted)">torn sheet</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span style={{ backgroundColor: zine.tape, clipPath: tapeClip }} className="block h-6 w-20" />
          <span className="text-[11px] text-(--muted)">tape</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <StarSticker size={48} />
          <span className="text-[11px] text-(--muted)">die-cut sticker</span>
        </div>
      </div>
      <ul className="flex flex-col gap-1.5 text-sm text-(--muted)">
        <li>
          <span className="text-(--text)">Corners:</span> none. Everything is cut, torn, or die-cut, never rounded.
        </li>
        <li>
          <span className="text-(--text)">Borders:</span> 2px black ink; dashed for cut lines and empty slots.
        </li>
        <li>
          <span className="text-(--text)">Shadow:</span> a hard 3px black offset, like a photocopied paste-up. Tape lies
          flat, with none.
        </li>
      </ul>
    </div>
  );
}

function Components() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-center gap-5">
        <Key>Log it</Key>
        <Key variant="secondary">skip today</Key>
        <TextLink>See the week →</TextLink>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="pages read" placeholder="e.g. 12" />
        <SelectField label="water goal" options={["6 glasses", "8 glasses", "10 glasses"]} defaultValue="8 glasses" />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Checkbox label="Done" defaultChecked />
        <RadioGroup name="zine-window" options={["Morning", "Evening"]} />
        <Toggle label="Reminders" defaultOn />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs tabs={["Today", "Week", "Month"]} />
        <Chips chips={["All", "Body", "Mind"]} defaultChip="Body" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card: one habit on a torn sheet. */}
        <Sheet>
          <div className="flex items-start justify-between">
            <div>
              <Scrap tilt={-2}>reading</Scrap>
              <p className="mt-2 font-(family-name:--font-abril) text-3xl">12 / 20</p>
              <p className={note}>pages, the good chapter</p>
            </div>
            <StarSticker size={52} tilt={12} color={zine.pink}>
              5
            </StarSticker>
          </div>
        </Sheet>
        {/* List rows: the week, a row per day, marks for each habit. */}
        <ul className="divide-y divide-dashed divide-[#141414]/30 border-y-2 border-[#141414] bg-white/60">
          {[
            ["Thu 09", ["met", "met", "met", "met"], true],
            ["Wed 08", ["met", "met", "missed", "met"], false],
            ["Tue 07", ["met", "missed", "met", "met"], false],
          ].map(([day, marks, all], r) => (
            <li key={day as string}>
              <a
                href="#"
                className="flex items-center justify-between gap-3 px-2 py-2 hover:bg-[linear-gradient(transparent_60%,#ffd60a_60%)] focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-[#141414]"
              >
                <span className={`${typed} w-16`}>{day as string}</span>
                <span className="flex gap-1">
                  {(marks as ("met" | "missed")[]).map((m, i) => (
                    <DayMark key={i} day={m} seed={r * 7 + i + 50} size={22} />
                  ))}
                </span>
                {all ? <Stamp tilt={-4}>All 4</Stamp> : <span aria-hidden className="font-(family-name:--font-marker)">→</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-start gap-8">
        <DetailPanel title="Water">
          <p className={note}>this week</p>
          <div className="mt-2 flex gap-1">
            {(["met", "met", "met", "met", "met", "met", "today"] as const).map((d, i) => (
              <DayMark key={i} day={d} seed={i + 90} size={26} />
            ))}
          </div>
          <div className="mt-5">
            <SelectField label="goal" options={["6 glasses", "8 glasses", "10 glasses"]} defaultValue="8 glasses" />
          </div>
          <div className="mt-6 flex items-center gap-4">
            <Key variant="secondary">reset</Key>
            <Key>Save</Key>
          </div>
        </DetailPanel>
        <div className="flex flex-col items-start gap-5">
          <ModalDemo trigger="open detail" title="Reading">
            <p>12 of 20 pages today.</p>
            <p className={note}>five days in a row</p>
            <div className="mt-6 flex items-center gap-4">
              <Key variant="secondary">reset</Key>
              <Key>Save</Key>
            </div>
          </ModalDemo>
          <div className="flex items-center gap-4">
            <StarSticker size={48} tilt={-10}>
              21
            </StarSticker>
            <Stamp>Goal met</Stamp>
          </div>
        </div>
      </div>
      <p className="text-sm text-(--muted)">
        Buttons, link, input, select, checkbox, radio, toggle, tabs, chips, card, list rows, badges (star and stamp),
        detail panel and modal. All live: hover, press, and tab through it.
      </p>
    </div>
  );
}

function ControlStates() {
  const keys: [string, React.ReactNode][] = [
    ["Rest", <Key key="r">Log it</Key>],
    ["Hover", <Key key="h" forced="hover">Log it</Key>],
    ["Focus", <Key key="f" forced="focus">Log it</Key>],
    ["Pressed", <Key key="p" forced="pressed">Log it</Key>],
    ["Selected", <Key key="s" selected>Logged</Key>],
    ["Disabled", <Key key="d" disabled>Log it</Key>],
  ];
  const glasses: [string, React.ReactNode][] = [
    ["Empty", <Glass key="e" look="empty" index={101} aria-label="Empty" />],
    ["Hover", <Glass key="h" look="empty" index={102} forced="hover" aria-label="Hover" />],
    ["Focus", <Glass key="f" look="empty" index={103} forced="focus" aria-label="Focus" />],
    ["Pressed", <Glass key="p" look="full" index={104} forced="pressed" aria-label="Pressed" />],
    ["Full", <Glass key="s" look="full" index={105} aria-label="Full" />],
    ["Disabled", <Glass key="d" look="empty" index={106} disabled aria-label="Disabled" />],
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-6">
        {keys.map(([name, el]) => (
          <div key={name} className="flex flex-col items-center">
            <div className="flex h-14 items-center">{el}</div>
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
      <p className="text-sm text-(--muted)">
        The scrap lifts off the page on hover and gets pressed flat when you click. A dashed cut line marks keyboard
        focus. Logged earns a star.
      </p>
    </div>
  );
}

function UIStates() {
  const states: [string, React.ReactNode, string][] = [
    [
      "Empty",
      <span key="e" className="flex flex-col items-center gap-1">
        <StarSticker size={40} outline />
        <span className={note}>nothing yet</span>
      </span>,
      "Nothing logged today",
    ],
    [
      "Loading",
      <span key="l" className="flex flex-col items-center gap-2">
        <span className="inline-block animate-spin [animation-duration:2.4s]">
          <StarSticker size={34} color={zine.lilac} />
        </span>
        <span className={typed}>loading…</span>
      </span>,
      "Fetching the week",
    ],
    [
      "Error",
      <span key="x" className="flex flex-col items-center gap-2">
        <Stamp tilt={-5}>Not saved</Stamp>
        <span className={note}>try again?</span>
      </span>,
      "Couldn't save",
    ],
    [
      "Success",
      <span key="s" className="flex items-center gap-2">
        <StarSticker size={38} tilt={-14} />
        <Stamp tilt={4} color={zine.ink}>
          Saved
        </Stamp>
      </span>,
      "Logged for today",
    ],
  ];
  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {states.map(([name, el, text], i) => (
        <div key={name} className="relative pt-3">
          <Tape className="top-0 left-1/2 w-14 -translate-x-1/2" tilt={i % 2 ? 4 : -4} />
          <div className="flex h-28 items-center justify-center border-2 border-[#141414] bg-white">{el}</div>
          <Caption>{name}</Caption>
          <p className="text-center text-xs text-(--muted)">{text}</p>
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
          <p className={`${typed} mb-2 text-xs text-(--muted)`}>Today, as a zine cover</p>
          <TodayCover />
        </div>
        <div>
          <p className={`${typed} mb-2 text-xs text-(--muted)`}>Streaks: the star chart</p>
          <StarChart />
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        <Piece title="Water" text="Glasses hatched in riso blue. Tap one to fill up to it; tap the last full one to empty it.">
          <WaterGlasses />
        </Piece>
        <Piece title="Reading" text="A highlighter stroke along a ruled line. Hit the goal and it gets stamped.">
          <PageHighlighter />
        </Piece>
        <Piece title="Exercise" text="A hand-drawn clock; minutes fill in as pink halftone. Add time or run the timer.">
          <ExerciseClock />
        </Piece>
        <Piece title="Mood" text="A sheet of face stickers. Pick one and it's stuck on. Arrow keys move between them.">
          <MoodStickers />
        </Piece>
      </div>
      <div className="flex flex-wrap items-end gap-6">
        {[0, 1, 2, 3, 4].map((m) => (
          <div key={m} className="flex flex-col items-center gap-1">
            <FaceSticker mood={m} stuck size={64} />
            <FaceSticker mood={m} stuck={false} size={40} />
          </div>
        ))}
        <p className="max-w-56 text-sm text-(--muted)">The five face stickers, stuck and as empty die-cut slots.</p>
      </div>
    </div>
  );
}

function Piece({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <Sheet>
      <h3 className="font-(family-name:--font-marker) text-xl uppercase">{title}</h3>
      <p className="mt-1 mb-4 text-sm text-(--muted)">{text}</p>
      {children}
    </Sheet>
  );
}

// ---------------------------------------------------------------------------

export function ZineDesignSystem({ style }: { style: Style }) {
  return (
    <div
      style={themeVars(style)}
      className={`min-h-full bg-(--background) font-(family-name:--font-body) text-(--text) ${style.page ?? ""}`}
    >
      <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
        <Link href="/" className={`${typed} text-(--muted) hover:text-(--text)`}>
          ← Hub
        </Link>
        <h1 className="mt-8 flex flex-wrap items-end gap-x-5 gap-y-2">
          <CutOut text="zine" size={64} />
          <span className="font-(family-name:--font-marker) text-3xl uppercase sm:text-4xl">design system</span>
        </h1>
        <p className={`${note} mt-3 text-(--muted)`}>maximalist, graphic, vibrant. cut, taped, and stuck down.</p>

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

        <Section n={7} title="Habit pieces" className="mt-16 border-t-2 border-dashed border-[#141414]/40 pt-12">
          <HabitPieces />
        </Section>
      </main>
    </div>
  );
}
