import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassDesignSystem } from "@/components/glass/DesignSystem";
import { OrbitDesignSystem } from "@/components/orbit/DesignSystem";
import { ZineDesignSystem } from "@/components/zine/DesignSystem";
import { getStyle, styles, themeVars, type Style } from "@/lib/styles";

// Every style is prerendered from generateStaticParams, so there's no data to wait on.
export const instant = false;

export function generateStaticParams() {
  return styles.map((s) => ({ style: s.slug }));
}

// Each style's design system, as it gets built.
const systems: Record<string, (props: { style: Style }) => React.ReactNode> = {
  orbit: OrbitDesignSystem,
  zine: ZineDesignSystem,
  glass: GlassDesignSystem,
};

// Design system built from the style's mood board. Sections to fill in:
const sections = [
  "Color roles", // background, surface, text, muted, border, accent + contrast ratios
  "Type roles", // display, heading, body, label
  "Spacing and shape", // spacing scale, corners, borders, shadow
  "Components", // buttons, link, input, select, checkbox, radio, toggle, tabs, chips, card, list rows, badge, modal
  "Control states", // rest, hover, focus, pressed, selected, disabled
  "UI states", // empty, loading, error, success
];

export default async function DesignSystemPage({ params }: PageProps<"/design-systems/[style]">) {
  const style = getStyle((await params).style);
  if (!style) notFound();

  const System = systems[style.slug];
  if (System) return <System style={style} />;

  return (
    <div
      style={themeVars(style)}
      className={`min-h-full bg-(--background) font-(family-name:--font-body) text-(--text) ${style.page ?? ""}`}
    >
      <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
        <Link href="/" className="text-sm text-(--muted) hover:text-(--text)">
          ← Hub
        </Link>
        <h1 className={`mt-10 font-(family-name:--font-display) text-4xl sm:text-5xl ${style.display}`}>
          {style.name} · Design System
        </h1>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {sections.map((title, i) => (
            <section key={title} className="rounded-lg border border-dashed border-(--border) p-6">
              <h2 className="text-sm font-semibold tracking-wider uppercase">
                {i + 1} {title}
              </h2>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
