import Image from "next/image";
import Link from "next/link";
import { tiles } from "@/components/tiles";
import { themeVars, type Artifact, type ArtifactSection, type Style } from "@/lib/styles";

// The grid sections show four artifacts in a row; references flow into
// masonry columns underneath.
const gridSections: ArtifactSection[] = ["where it comes from", "type and color", "pieces of ui"];

// For collage styles: a repeating set of small tilts, so nothing sits quite straight.
const tilts = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 2];

export function MoodBoard({ style }: { style: Style }) {
  // Empty placeholder tiles don't count toward the total.
  const filled = style.artifacts.filter((a) => a.image || a.tile);
  const collected = filled.filter((a) => a.source === "collected").length;
  const made = filled.length - collected;
  const references = style.artifacts.filter((a) => a.section === "references");

  return (
    <div
      style={themeVars(style)}
      className={`min-h-full bg-(--background) font-(family-name:--font-body) text-(--text) ${style.page ?? ""}`}
    >
      <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
        <Link href="/" className="text-sm text-(--muted) hover:text-(--text)">
          ← Hub
        </Link>

        <header className="mt-10 font-(family-name:--font-display)">
          <p className="text-(--muted)">mood board</p>
          <h1 className={`mt-2 text-6xl sm:text-8xl ${style.display}`}>{style.name}</h1>
          <p className={`mt-4 text-2xl text-(--muted) sm:text-3xl ${style.display}`}>{style.mood.join(" · ")}</p>
        </header>

        <dl className="mt-12 grid gap-8 border-b border-(--border) pb-12 md:grid-cols-3">
          <Fact label="evokes">{style.evokes}</Fact>
          <Fact label="suits">{style.suits}</Fact>
          <Fact label="artifacts">
            {filled.length}: {collected} collected, {made} made by the agent
          </Fact>
        </dl>

        {gridSections.map((section) => (
          <section key={section} className="border-b border-(--border) py-12">
            <SectionTitle display={style.display}>{section}</SectionTitle>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {style.artifacts
                .filter((a) => a.section === section)
                .map((a, i) => (
                  <ArtifactCard key={i} artifact={a} tilt={style.collage ? tilts[i % tilts.length] : undefined} />
                ))}
            </div>
          </section>
        ))}

        <section className="py-12">
          <SectionTitle display={style.display}>references</SectionTitle>
          <div className="mt-8 gap-8 sm:columns-2 lg:columns-4">
            {references.map((a, i) => (
              <ArtifactCard
                key={i}
                artifact={a}
                masonry
                tilt={style.collage ? tilts[(i + 3) % tilts.length] : undefined}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionTitle({ display, children }: { display: string; children: React.ReactNode }) {
  return (
    <h2 className={`font-(family-name:--font-display) text-3xl sm:text-4xl ${display}`}>{children}</h2>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-(family-name:--font-label) text-sm tracking-widest text-(--accent) uppercase">
        {label}
      </dt>
      <dd className="mt-2 text-lg leading-relaxed">{children}</dd>
    </div>
  );
}

function ArtifactCard({
  artifact,
  masonry = false,
  tilt,
}: {
  artifact: Artifact;
  masonry?: boolean;
  // Degrees to rotate, and tape it down. Only set for collage styles.
  tilt?: number;
}) {
  const { image, tile, title, takeaway, credit, width = 4, height = 3 } = artifact;
  const Tile = tile ? tiles[tile] : undefined;

  let media: React.ReactNode;
  if (image && masonry) {
    media = (
      <Image
        src={image}
        alt={title}
        width={width}
        height={height}
        className="w-full rounded-(--radius) border border-(--border)"
      />
    );
  } else if (image) {
    // Grid rows crop to the same 4:3 frame so captions line up.
    media = (
      <div className="relative aspect-4/3 overflow-hidden rounded-(--radius) border border-(--border)">
        <Image src={image} alt={title} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      </div>
    );
  } else if (Tile) {
    media = (
      <div className="aspect-4/3 overflow-hidden rounded-(--radius) border border-(--border) bg-(--surface)">
        <Tile />
      </div>
    );
  } else {
    media = (
      <div
        style={{ aspectRatio: `${width} / ${height}` }}
        className="flex w-full items-center justify-center rounded-(--radius) border border-dashed border-(--border) bg-(--surface) text-sm text-(--muted)"
      >
        artifact
      </div>
    );
  }

  return (
    <figure
      style={tilt ? { rotate: `${tilt}deg` } : undefined}
      className={masonry ? "mb-8 break-inside-avoid" : ""}
    >
      <div className="relative">
        {media}
        {tilt !== undefined && (
          <span
            style={{ rotate: `${-tilt * 2}deg` }}
            className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 bg-[#e8dcb5] opacity-80 shadow-sm"
          />
        )}
      </div>
      <figcaption className="mt-4">
        <p className="text-lg font-semibold">{title || "Untitled"}</p>
        <p className="mt-1 leading-relaxed text-(--muted)">{takeaway || "What to take from it."}</p>
        {credit && (
          <a
            href={credit.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block font-(family-name:--font-label) text-xs text-(--muted) underline-offset-2 hover:underline"
          >
            {credit.author} · {credit.license}
          </a>
        )}
      </figcaption>
    </figure>
  );
}
