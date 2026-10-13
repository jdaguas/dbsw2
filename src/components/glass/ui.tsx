"use client";

// Glass's UI library: the general-purpose controls the brief asks for,
// drawn as frosted panes on a dusk sky. Habit-specific pieces live in habits.tsx.

import { useEffect, useRef, useState } from "react";
import { glass, pane, paneRaised, spectrum, type ForcedState } from "./tokens";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#5cc8ff]";
const forcedFocusRing = "outline-2 outline-offset-3 outline-[#5cc8ff]";

// ---------------------------------------------------------------------------
// Pill button: the primary and secondary buttons.
// Primary is a glowing orange pill; secondary is a clear glass pill.
// Hover brightens and glows, press sinks slightly, selected turns violet.

type PillProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  selected?: boolean;
  disabled?: boolean;
  // Show a state without interacting, for the control-states row.
  forced?: ForcedState;
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
};

export function Pill({
  children,
  variant = "primary",
  selected = false,
  disabled = false,
  forced,
  onClick,
  className,
  ...rest
}: PillProps) {
  const hovered = forced === "hover";
  const pressed = forced === "pressed";

  let look: string;
  if (disabled) look = "cursor-not-allowed border border-white/10 bg-white/5 text-white/40";
  else if (selected)
    look = "border border-white/25 bg-[#6a3df0] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_24px_rgba(106,61,240,0.5)]";
  else if (variant === "primary")
    look = cx(
      "border border-white/40 bg-[linear-gradient(180deg,#ffa865,#ff8a3d)] text-[#1a1033] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
      hovered
        ? "brightness-110 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_0_28px_rgba(255,138,61,0.6)]"
        : "hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_0_28px_rgba(255,138,61,0.6)]",
    );
  else look = cx(paneRaised, "text-(--text)", hovered ? "bg-white/20" : "hover:bg-white/20");

  const press = disabled ? "" : pressed ? "scale-[0.96] brightness-95" : "active:scale-[0.96] active:brightness-95";

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected || undefined}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-[transform,filter,background-color,box-shadow] duration-150",
        look,
        press,
        forced === "focus" ? forcedFocusRing : focusRing,
        className,
      )}
      {...rest}
    >
      {selected && (
        <svg viewBox="0 0 12 10" className="w-3" aria-hidden>
          <path d="M1 5l3.5 3.5L11 1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Link

export function TextLink({ children, href = "#" }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className={cx(
        "rounded-sm font-medium text-[#5cc8ff] underline decoration-[#5cc8ff]/40 decoration-2 underline-offset-4 hover:decoration-[#5cc8ff]",
        focusRing,
      )}
    >
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// Fields

const fieldLabel = "font-(family-name:--font-label) text-xs tracking-[0.12em] uppercase text-(--muted)";
const fieldBox =
  "w-full rounded-2xl border border-[#8a7dc4] bg-white/8 px-4 py-2.5 text-(--text) backdrop-blur-md placeholder:text-[#a59bc9] hover:bg-white/12 focus:border-[#5cc8ff] focus:outline-3 focus:outline-[#5cc8ff]/30";

export function TextField({ label, placeholder, defaultValue }: { label: string; placeholder?: string; defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={fieldLabel}>{label}</span>
      <input type="text" placeholder={placeholder} defaultValue={defaultValue} className={fieldBox} />
    </label>
  );
}

export function SelectField({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={fieldLabel}>{label}</span>
      <span className="relative">
        <select defaultValue={defaultValue} className={cx(fieldBox, "appearance-none pr-10")}>
          {options.map((o) => (
            <option key={o} className="bg-[#241a4d]">
              {o}
            </option>
          ))}
        </select>
        <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute top-1/2 right-4 w-3 -translate-y-1/2">
          <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Checkbox, radio, toggle

export function Checkbox({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="group inline-flex cursor-pointer items-center gap-2.5">
      <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className={cx(
          "grid size-6 place-items-center rounded-lg border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#5cc8ff]",
          checked
            ? "border-white/40 bg-[#a98bff] shadow-[0_0_12px_rgba(169,139,255,0.6)]"
            : "border-[#8a7dc4] bg-white/8 group-hover:border-(--text)",
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 10" className="w-3">
            <path d="M1 5l3.5 3.5L11 1" fill="none" stroke={glass.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </label>
  );
}

// A radio drawn as a bubble; the checked one has a glowing core.
export function RadioGroup({ name, options, defaultValue }: { name: string; options: string[]; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? options[0]);
  return (
    <div role="radiogroup" className="flex flex-wrap gap-5">
      {options.map((o) => (
        <label key={o} className="group inline-flex cursor-pointer items-center gap-2.5">
          <input type="radio" name={name} checked={value === o} onChange={() => setValue(o)} className="peer sr-only" />
          <span
            aria-hidden
            className={cx(
              "grid size-6 place-items-center rounded-full border bg-white/8 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#5cc8ff]",
              value === o ? "border-[#a98bff]" : "border-[#8a7dc4] group-hover:border-(--text)",
            )}
          >
            {value === o && <span className="size-2.5 rounded-full bg-[#a98bff] shadow-[0_0_10px_#a98bff]" />}
          </span>
          <span>{o}</span>
        </label>
      ))}
    </div>
  );
}

export function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn(!on)}
      className={cx("group inline-flex items-center gap-2.5 rounded-full", focusRing)}
    >
      <span
        aria-hidden
        className={cx(
          "relative h-7 w-12 rounded-full border transition-colors",
          on ? "border-white/30 bg-[#6a3df0]" : "border-[#8a7dc4] bg-white/8 group-hover:border-(--text)",
        )}
      >
        <span
          className={cx(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-[0_2px_6px_rgba(8,4,28,0.5)] transition-transform",
            on && "translate-x-5",
          )}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Tabs and chips

// A glass track with the active tab lifted out as a brighter pane.
export function Tabs({ tabs, defaultTab }: { tabs: string[]; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]);
  return (
    <div role="tablist" className={cx(pane, "inline-flex gap-1 rounded-full p-1")}>
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={active === t}
          onClick={() => setActive(t)}
          className={cx(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            active === t
              ? "bg-white/20 text-(--text) shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
              : "text-(--muted) hover:bg-white/8 hover:text-(--text)",
            focusRing,
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function Chips({ chips, defaultChip }: { chips: string[]; defaultChip?: string }) {
  const [active, setActive] = useState(defaultChip ?? chips[0]);
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <button
          key={c}
          type="button"
          aria-pressed={active === c}
          onClick={() => setActive(c)}
          className={cx(
            "rounded-full border px-4 py-1 text-sm font-medium transition-colors",
            active === c
              ? "border-white/25 bg-[#6a3df0] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
              : "border-[#8a7dc4] bg-white/5 text-(--text) hover:border-(--text) hover:bg-white/12",
            focusRing,
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Badges

// A small glass bubble holding the streak count, with a warm glow.
export function StreakBadge({ days }: { days: number }) {
  return (
    <span className={cx(paneRaised, "inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-1")}>
      <span className="grid size-7 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffd2ad,#ff8a3d_70%)] text-xs font-bold text-[#1a1033] shadow-[0_0_12px_rgba(255,138,61,0.6)]">
        {days}
      </span>
      <span className="font-(family-name:--font-label) text-xs tracking-[0.12em] uppercase">day streak</span>
    </span>
  );
}

// The one place the full spectrum shows as a solid: the goal is met.
export function GoalBadge({ children = "Goal met" }: { children?: React.ReactNode }) {
  return (
    <span
      style={{ backgroundImage: spectrum }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-(family-name:--font-label) text-xs font-medium tracking-[0.12em] text-[#1a1033] uppercase shadow-[0_0_16px_rgba(255,138,61,0.45)]"
    >
      <span aria-hidden>✦</span>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Detail panel: inline for the library, or as a real modal dialog.

export function DetailPanel({ title, children, onClose }: { title: string; children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className={cx(pane, "w-full max-w-sm rounded-[1.75rem] bg-white/10 p-6 text-(--text)")}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-(family-name:--font-display) text-2xl font-light tracking-tight">{title}</h3>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={cx(paneRaised, "grid size-8 place-items-center rounded-full hover:bg-white/20", focusRing)}
        >
          <svg viewBox="0 0 10 10" className="w-2.5" aria-hidden>
            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function ModalDemo({ trigger, title, children }: { trigger: string; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <Pill variant="secondary" onClick={() => setOpen(true)}>
        {trigger}
      </Pill>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === ref.current && setOpen(false)}
        className="m-auto bg-transparent p-0 font-(family-name:--font-body) backdrop:bg-[#120c2a]/40 backdrop:backdrop-blur-sm"
      >
        <DetailPanel title={title} onClose={() => setOpen(false)}>
          {children}
        </DetailPanel>
      </dialog>
    </>
  );
}
