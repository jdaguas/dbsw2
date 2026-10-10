import Link from "next/link";

// Mood board: a name for the mood + 25–30 artifacts
// (photos, type, color, texture, interface pieces).
// Put images in public/mood-boards/arcade/.
export default function ArcadeMoodBoard() {
  return (
    <main className="p-8">
      <Link href="/">← Hub</Link>
      <h1 className="mt-4 text-3xl">Arcade</h1>
      <p className="mt-2">Mood board — artifacts go here.</p>
    </main>
  );
}
