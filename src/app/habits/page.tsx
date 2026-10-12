import Link from "next/link";

// The habit tracker, in the style you picked. Needs: clear visual hierarchy,
// 2+ interactions faked in the browser (e.g. check-in + detail panel),
// every control in its states, accent kept for the primary action,
// and responsive layout (390px mobile, 1440px desktop).
export default function Habits() {
  return (
    <main className="p-8">
      <Link href="/">← Hub</Link>
      <h1 className="mt-4 text-3xl">Habit Tracker</h1>
      <p className="mt-2">Not started yet: pick a style first.</p>
    </main>
  );
}
