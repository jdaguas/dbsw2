import type { Metadata } from "next";
import { HabitTracker } from "@/components/orbit/HabitTracker";
import { getStyle, themeVars } from "@/lib/styles";

export const metadata: Metadata = { title: "Habit Tracker" };

// The habit tracker, in the Orbit style.
export default function Habits() {
  const style = getStyle("orbit")!;
  return (
    <div style={themeVars(style)} className="min-h-full flex-1 bg-(--background) font-(family-name:--font-body) text-(--text)">
      <HabitTracker />
    </div>
  );
}
