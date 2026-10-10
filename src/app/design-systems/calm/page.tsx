import Link from "next/link";

// Design system built from the Calm mood board. Sections:
// 1. Color roles (background, surface, text, muted, border, accent + contrast ratios)
// 2. Type roles (display, heading, body, label)
// 3. Spacing and shape (spacing scale, corners, borders, shadow)
// 4. Components (buttons, link, input, select, checkbox, radio, toggle,
//    tabs, chips, card, list rows, badge, modal/detail panel)
// 5. Control states (rest, hover, focus, pressed, selected, disabled)
// 6. UI states (empty, loading, error, success)
export default function CalmDesignSystem() {
  return (
    <main className="p-8">
      <Link href="/">← Hub</Link>
      <h1 className="mt-4 text-3xl">Calm · Design System</h1>
      <p className="mt-2">Design system — sections go here.</p>
    </main>
  );
}
