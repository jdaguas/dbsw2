import Link from "next/link";
import { site, styles } from "@/lib/styles";

export default function Hub() {
  return (
    <main className="mx-auto w-full max-w-3xl p-8">
      <p className="text-sm">UI/UX &amp; Visual Design</p>
      <h1 className="text-3xl">{site.name}</h1>

      <section className="mt-8">
        <h2 className="text-sm uppercase">1 Mood Boards</h2>
        <ul className="mt-2 flex gap-4">
          {styles.map((s) => (
            <li key={s.slug}>
              <Link href={`/mood-boards/${s.slug}`}>{s.name} →</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm uppercase">2 Design Systems</h2>
        <ul className="mt-2 flex gap-4">
          {styles.map((s) => (
            <li key={s.slug}>
              <Link href={`/design-systems/${s.slug}`}>{s.name} →</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm uppercase">3 Your Site</h2>
        <Link href={site.href} className="mt-2 inline-block">
          Open {site.name} →
        </Link>
      </section>
    </main>
  );
}
