import Link from "next/link";
import { site, styles, themeVars, type Style } from "@/lib/styles";

export default function Hub() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
      <p className="text-sm font-semibold tracking-wider text-neutral-500 uppercase">
        Assignment 2 · UI/UX &amp; Visual Design
      </p>
      <h1 className="mt-4 text-6xl font-bold tracking-tight sm:text-7xl">{site.name}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-700">
        A habit tracker for me: what I want to do every day, checked off as I go. Three styles to
        choose from, then the app in the one I pick.
      </p>

      <Section number={1} title="Mood Boards">
        {styles.map((s) => (
          <MoodBoardCard key={s.slug} style={s} />
        ))}
      </Section>

      <Section number={2} title="Design Systems" note="Each one built from its mood board">
        {styles.map((s) => (
          <DesignSystemCard key={s.slug} style={s} />
        ))}
      </Section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <SectionHeading number={3} title="My Site" />
        <Link
          href={site.href}
          className="mt-8 block rounded-xl border border-dashed border-neutral-300 p-8 transition-colors hover:border-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
        >
          <h3 className="text-xl font-semibold">{site.name}</h3>
          <p className="mt-2 max-w-2xl text-neutral-600">{site.description}</p>
        </Link>
      </section>
    </main>
  );
}

function SectionHeading({ number, title }: { number: number; title: string }) {
  return (
    <h2 className="flex items-baseline gap-4 text-4xl font-bold tracking-tight">
      <span className="text-base font-semibold text-neutral-500">{number}</span>
      {title}
    </h2>
  );
}

function Section({
  number,
  title,
  note,
  children,
}: {
  number: number;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16 border-t border-neutral-200 pt-16">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <SectionHeading number={number} title={title} />
        {note && <p className="text-neutral-500">{note}</p>}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">{children}</div>
    </section>
  );
}

// A card whose top panel is drawn in the style itself.
function StyleCard({
  href,
  style,
  subtitle,
  children,
}: {
  href: string;
  style: Style;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-xl border border-neutral-200 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
    >
      <div
        style={themeVars(style)}
        className={`flex h-48 flex-col justify-between bg-(--background) p-6 text-(--text) ${style.page ?? ""}`}
      >
        {children}
      </div>
      <div className="p-6">
        <p className="text-lg font-semibold">
          {style.name} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </p>
        <p className="mt-1 text-neutral-600">{subtitle}</p>
      </div>
    </Link>
  );
}

function MoodBoardCard({ style }: { style: Style }) {
  const { background, surface, text, muted, accent } = style.palette;
  return (
    <StyleCard
      href={`/mood-boards/${style.slug}`}
      style={style}
      subtitle={style.mood.map((w) => w[0].toUpperCase() + w.slice(1)).join(" · ")}
    >
      <p className={`font-(family-name:--font-display) text-3xl ${style.display}`}>{style.name}</p>
      <div className="flex gap-2">
        {[background, surface, text, muted, accent].map((color, i) => (
          <span
            key={i}
            style={{ backgroundColor: color }}
            className="size-8 rounded-full border border-(--border)"
          />
        ))}
      </div>
    </StyleCard>
  );
}

function DesignSystemCard({ style }: { style: Style }) {
  return (
    <StyleCard
      href={`/design-systems/${style.slug}`}
      style={style}
      subtitle="Color, type, components, and every state"
    >
      <p className={`font-(family-name:--font-display) text-5xl ${style.display}`}>Aa</p>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-(--accent) px-5 py-2 text-sm font-medium text-(--background)">
          Check in
        </span>
        <span className="text-sm text-(--muted)">3 day streak</span>
      </div>
    </StyleCard>
  );
}
