"use client";

// Orbit's UI library: the general-purpose controls the brief asks for,
// drawn as 1960s console hardware. Habit-specific pieces live in habits.tsx.

import { useEffect, useRef, useState } from "react";
import { orbit, type ForcedState } from "./tokens";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// State that a parent can own (pass value and onChange), or that the control
// keeps for itself (the design system's demos).
export function useControlled<T>(value: T | undefined, onChange: ((v: T) => void) | undefined, initial: T) {
  const [inner, setInner] = useState(initial);
  const controlled = value !== undefined;
  function set(v: T) {
    if (!controlled) setInner(v);
    onChange?.(v);
  }
  return [controlled ? value : inner, set] as const;
}

const focusRing = "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#1f6f78]";
const forcedFocusRing = "outline-3 outline-offset-3 outline-[#1f6f78]";

// ---------------------------------------------------------------------------
// Console key: the primary and secondary buttons.
// A rounded hardware key with a bottom edge that sinks when pressed,
// and a lamp that lights on hover and glows green once logged.

type KeyProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  selected?: boolean;
  disabled?: boolean;
  // Show a state without interacting, for the control-states row.
  forced?: ForcedState;
  lamp?: boolean;
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
};

export function Key({
  children,
  variant = "primary",
  selected = false,
  disabled = false,
  forced,
  lamp = true,
  onClick,
  className,
  ...rest
}: KeyProps) {
  const hovered = forced === "hover";
  const pressed = forced === "pressed";

  let look: string;
  if (disabled) look = "cursor-not-allowed border-[#d6cab5] bg-[#e6dccb] text-[#857d72]";
  else if (selected) look = "border-[#0e1628] bg-[#1c2a4a] text-[#f3ead8]";
  else if (variant === "primary")
    look = cx("border-[#7d2a0e] text-white", hovered ? "bg-[#9e3410]" : "bg-(--accent) hover:bg-[#9e3410]");
  else
    look = cx(
      "border-x-2 border-t-2 border-(--text) text-(--text)",
      hovered ? "bg-[#efe4cf]" : "bg-(--surface) hover:bg-[#efe4cf]",
    );

  const press = disabled
    ? "border-b-4"
    : pressed
      ? "mt-[2px] border-b-2"
      : "border-b-4 active:mt-[2px] active:border-b-2";

  let lampLook: string;
  if (disabled) lampLook = "bg-[#cfc4b2]";
  else if (selected) lampLook = "bg-[#9fe3c4] shadow-[0_0_8px_#9fe3c4]";
  else if (hovered || pressed) lampLook = "bg-[#e8a33d] shadow-[0_0_8px_#e8a33d]";
  else
    lampLook = cx(
      variant === "primary" ? "bg-white/35" : "bg-(--text)/25",
      "group-hover:bg-[#e8a33d] group-hover:shadow-[0_0_8px_#e8a33d]",
    );

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected || undefined}
      onClick={onClick}
      className={cx(
        "group inline-flex items-center gap-2.5 rounded-xl px-5 pt-2.5 pb-2 font-(family-name:--font-label) text-sm font-bold tracking-[0.15em] uppercase transition-[background-color,margin,border-width] duration-75",
        look,
        press,
        forced === "focus" ? forcedFocusRing : focusRing,
        className,
      )}
      {...rest}
    >
      {lamp && <span aria-hidden className={cx("size-2 rounded-full transition-[background-color,box-shadow]", lampLook)} />}
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Link

const linkLook = cx(
  "rounded-sm font-medium text-[#1f6f78] underline decoration-2 underline-offset-4 hover:decoration-[#e8a33d] active:text-[#1c2a4a]",
  focusRing,
);

// A link; with onClick it's a button that looks like one (for in-page actions).
export function TextLink({
  children,
  href = "#",
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  "aria-haspopup"?: "dialog";
}) {
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={linkLook} {...rest}>
        {children}
      </button>
    );
  return (
    <a href={href} className={linkLook}>
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// Fields

const fieldLabel = "font-(family-name:--font-label) text-xs tracking-[0.15em] uppercase text-(--muted)";
const fieldBox =
  "w-full rounded-xl border-2 border-[#8a7f6c] bg-(--surface) px-4 py-2.5 text-(--text) placeholder:text-[#857d72] focus:border-[#1f6f78] focus:outline-3 focus:outline-[#1f6f78]/25";

type TextFieldProps = {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export function TextField({ label, placeholder, defaultValue, value, onChange, inputMode }: TextFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={fieldLabel}>{label}</span>
      <input
        type="text"
        inputMode={inputMode}
        placeholder={placeholder}
        defaultValue={value === undefined ? defaultValue : undefined}
        value={value}
        onChange={onChange && ((e) => onChange(e.target.value))}
        className={fieldBox}
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  options: string[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function SelectField({ label, options, defaultValue, value, onChange }: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={fieldLabel}>{label}</span>
      <span className="relative">
        <select
          defaultValue={value === undefined ? defaultValue : undefined}
          value={value}
          onChange={onChange && ((e) => onChange(e.target.value))}
          className={cx(fieldBox, "appearance-none pr-10")}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
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

type CheckboxProps = {
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

export function Checkbox({ label, defaultChecked = false, checked: value, onChange, disabled = false }: CheckboxProps) {
  const [checked, setChecked] = useControlled(value, onChange, defaultChecked);
  return (
    <label className={cx("group inline-flex items-center gap-2.5", disabled ? "cursor-not-allowed text-(--muted)" : "cursor-pointer")}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => setChecked(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cx(
          "grid size-6 shrink-0 place-items-center rounded-lg border-2 transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1f6f78]",
          disabled
            ? checked
              ? "border-[#5f8f7c] bg-[#5f8f7c]"
              : "border-[#cfc4b2] bg-[#e6dccb]"
            : checked
              ? "border-[#1f6f78] bg-[#1f6f78]"
              : "border-[#8a7f6c] bg-(--surface) group-hover:border-(--text)",
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 10" className="w-3">
            <path d="M1 5l3.5 3.5L11 1" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </label>
  );
}

// A radio drawn as an orbit ring; the checked one has a planet inside.
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
              "grid size-6 place-items-center rounded-full border-2 transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1f6f78]",
              value === o ? "border-[#1c2a4a]" : "border-[#8a7f6c] group-hover:border-(--text)",
            )}
          >
            {value === o && <span className="size-2.5 rounded-full bg-[#e8a33d] ring-2 ring-[#1c2a4a]" />}
          </span>
          <span>{o}</span>
        </label>
      ))}
    </div>
  );
}

type ToggleProps = { label: string; defaultOn?: boolean; on?: boolean; onChange?: (on: boolean) => void };

export function Toggle({ label, defaultOn = false, on: value, onChange }: ToggleProps) {
  const [on, setOn] = useControlled(value, onChange, defaultOn);
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
          "relative h-7 w-12 rounded-full border-2 transition-colors",
          on ? "border-[#1f6f78] bg-[#1f6f78]" : "border-[#8a7f6c] bg-[#e6dccb] group-hover:border-(--text)",
        )}
      >
        <span
          className={cx(
            "absolute top-0.5 left-0.5 grid size-5 place-items-center rounded-full bg-[#e9ebec] shadow-[inset_0_-2px_0_#9da1a5] transition-transform",
            on && "translate-x-5",
          )}
        >
          <span className={cx("size-1.5 rounded-full", on ? "bg-[#e8a33d]" : "bg-[#9da1a5]")} />
        </span>
      </span>
      <span>{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Tabs and chips

type TabsProps = { tabs: string[]; defaultTab?: string; value?: string; onChange?: (tab: string) => void };

export function Tabs({ tabs, defaultTab, value, onChange }: TabsProps) {
  const [active, setActive] = useControlled(value, onChange, defaultTab ?? tabs[0]);
  return (
    <div role="tablist" className="flex gap-6">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={active === t}
          onClick={() => setActive(t)}
          className={cx(
            "flex flex-col items-center gap-1 rounded-md pb-1 font-(family-name:--font-label) text-sm tracking-[0.15em] uppercase",
            active === t ? "font-bold text-(--text)" : "text-(--muted) hover:text-(--text)",
            focusRing,
          )}
        >
          {t}
          <span aria-hidden className={cx("h-1.5 w-full rounded-full", active === t ? "bg-[#e8a33d]" : "bg-transparent")} />
        </button>
      ))}
    </div>
  );
}

type ChipsProps = { chips: string[]; defaultChip?: string; value?: string; onChange?: (chip: string) => void; label?: string };

export function Chips({ chips, defaultChip, value, onChange, label }: ChipsProps) {
  const [active, setActive] = useControlled(value, onChange, defaultChip ?? chips[0]);
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <button
          key={c}
          type="button"
          aria-pressed={active === c}
          onClick={() => setActive(c)}
          className={cx(
            "rounded-full border-2 px-4 py-1 text-sm font-medium transition-colors",
            active === c
              ? "border-[#1c2a4a] bg-[#1c2a4a] text-[#f3ead8]"
              : "border-[#8a7f6c] text-(--text) hover:border-(--text) hover:bg-[#efe4cf]",
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

// A Googie starburst holding the streak count.
// compact: on small screens the "day streak" words are kept for screen readers only.
// `lit` glows the starburst like a lamp, for a goal met today.
export function StreakBadge({
  days,
  size = 64,
  compact = false,
  lit = false,
}: {
  days: number;
  size?: number;
  compact?: boolean;
  lit?: boolean;
}) {
  const points = Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 ? 30 : 48;
    const a = (Math.PI / 8) * i;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative grid place-items-center" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 100 100"
          className={cx("absolute inset-0 overflow-visible transition-[filter]", lit && "drop-shadow-[0_0_8px_#e8a33d]")}
          aria-hidden
        >
          <polygon points={points} fill={orbit.mustard} />
        </svg>
        <span className="relative font-(family-name:--font-display) text-lg text-[#1c2a4a]">{days}</span>
      </span>
      <span
        className={cx(
          "font-(family-name:--font-label) text-xs leading-tight tracking-[0.15em] uppercase",
          compact && "max-sm:sr-only",
        )}
      >
        day
        <br />
        streak
      </span>
    </span>
  );
}

export function GoalBadge({ children = "Goal met" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8a33d] px-3 py-1 font-(family-name:--font-label) text-xs font-bold tracking-[0.15em] text-[#1c2a4a] uppercase">
      <span aria-hidden>✦</span>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Chrome button: a small round hardware knob for icon-only actions (close, open details).

export function ChromeButton({
  label,
  onClick,
  children,
  ...rest
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  "aria-haspopup"?: "dialog";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cx(
        "grid size-9 shrink-0 place-items-center rounded-full bg-[#e9ebec] text-[#1c2a4a] shadow-[inset_0_-3px_0_#9da1a5] transition-[background-color,box-shadow] hover:bg-[#dfe2e4] active:shadow-[inset_0_-1px_0_#9da1a5]",
        focusRing,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Detail panel: inline for the library, or as a real modal dialog.

export function DetailPanel({ title, children, onClose }: { title: string; children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="w-full max-w-sm rounded-[2rem] border-2 border-(--text) bg-(--surface) p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-(family-name:--font-display) text-xl tracking-wide uppercase">{title}</h3>
        <ChromeButton label="Close" onClick={onClose}>
          <svg viewBox="0 0 10 10" className="w-2.5" aria-hidden>
            <path d="M1 1l8 8M9 1l-8 8" stroke={orbit.navy} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </ChromeButton>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

// The detail panel as a modal dialog: Escape or a click on the backdrop closes it.
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(24rem,calc(100%-2rem))] bg-transparent p-0 text-(--text) backdrop:bg-[#1c2a4a]/50"
    >
      <DetailPanel title={title} onClose={onClose}>
        {children}
      </DetailPanel>
    </dialog>
  );
}

export function ModalDemo({ trigger, title, children }: { trigger: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Key variant="secondary" onClick={() => setOpen(true)}>
        {trigger}
      </Key>
      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        {children}
      </Modal>
    </>
  );
}
