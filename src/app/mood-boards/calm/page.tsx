import Link from "next/link";

// Mood board: a name for the mood + 25–30 artifacts
// (photos, type, color, texture, interface pieces).
// Put images in public/mood-boards/calm/.
export default function CalmMoodBoard() {
  return (
    <main className="p-8">
      <Link href="/">← Hub</Link>
      <h1 className="mt-4 text-3xl">Calm</h1>
      <p className="mt-2">Mood board — artifacts go here.</p>
    </main>
  );
}
