"use client";

// Zine's UI library: the general-purpose controls, cut from paper.
// Habit-specific pieces live in habits.tsx.

import { useEffect, useRef, useState } from "react";
import type { ForcedState } from "@/components/orbit/tokens";
import { cutClip, cx, Rough, Scrap, seedOf, StarSticker, tapeClip, Tape, tornClip, zine } from "./paper";

// Keyboard focus: a dashed cut line around the control.
const focusRing = "focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-4 focus-visible:outline-[#141414]";
const forcedFocusRing = "outline-2 outline-dashed outline-offset-4 outline-[#141414]";

// ---------------------------------------------------------------------------
// Primary: a pink paper scrap that lifts on hover and is pressed flat when clicked.
// Secondary: a strip of masking tape.

type KeyProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  selected?: boolean;
  disabled?: boolean;
  forced?: ForcedState;
  onClick?: () => void;
  "aria-label"?: string;
};

export function Key({ children, variant = "primary", selected, disabled, forced, onClick, ...rest }: KeyProps) {
  const seed = seedOf(String(children)) + (variant === "primary" ? 0 : 50);

  if (variant === "secondary") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cx("group inline-block", disabled && "cursor-not-allowed", forced === "focus" ? forcedFocusRing : focusRing)}
        {...rest}
      >
        <span
          style={{ backgroundColor: zine.tape, clipPath: tapeClip }}
          className={cx(
            "block px-5 py-1.5 font-(family-name:--font-label) text-sm tracking-wide text-[#141414] transition-transform duration-100",
            disabled ? "opacity-50" : "group-hover:-rotate-2 group-hover:brightness-105 group-active:translate-y-0.5 group-active:rotate-0",
            forced === "hover" && "-rotate-2 brightness-105",
            forced === "pressed" && "translate-y-0.5",
          )}
        >
          {children}
        </span>
      </button>
    );
  }

  let face: string;
  if (disabled) face = "bg-[#e3dccb] text-[#7c756b] bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgba(20,20,20,0.06)_6px_8px)]";
  else if (selected) face = "bg-[#141414] text-white";
  else face = "bg-[#d1126f] text-white";

  // The scrap's position and shadow carry the state.
  let lift: string;
  if (disabled) lift = "";
  else if (forced === "hover") lift = "-translate-x-px -translate-y-px -rotate-2 [filter:drop-shadow(5px_5px_0_#141414)]";
  else if (forced === "pressed") lift = "translate-x-0.5 translate-y-0.5 rotate-0";
  else
    lift =
      "-rotate-1 [filter:drop-shadow(3px_3px_0_#141414)] group-hover:-translate-x-px group-hover:-translate-y-px group-hover:-rotate-2 group-hover:[filter:drop-shadow(5px_5px_0_#141414)] group-active:translate-x-0.5 group-active:translate-y-0.5 group-active:rotate-0 group-active:[filter:none]";

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected || undefined}
      onClick={onClick}
      className={cx("group relative inline-block", disabled && "cursor-not-allowed", forced === "focus" ? forcedFocusRing : focusRing)}
      {...rest}
    >
      <span className={cx("block transition-[translate,rotate,filter] duration-100", lift)}>
        <span
          style={{ clipPath: cutClip(seed) }}
          className={cx("block px-5 pt-1.5 pb-1 font-(family-name:--font-marker) text-lg tracking-wide uppercase", face)}
        >
          {children}
        </span>
      </span>
      {selected && !disabled && (
        <span className="absolute -top-3 -right-3">
          <StarSticker size={26} tilt={14} />
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Link: a wavy pink underline; highlighted on hover.

export function TextLink({ children, href = "#" }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className={cx(
        "font-bold text-[#141414] underline decoration-[#d1126f] decoration-wavy decoration-2 underline-offset-4 hover:bg-[linear-gradient(transparent_55%,#ffd60a_55%)]",
        focusRing,
      )}
    >
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// Fields: typed on a ruled line; focus lays a highlighter stroke behind the text.

const fieldBox =
  "w-full border-0 border-b-2 border-[#141414] bg-transparent px-1 py-1.5 font-(family-name:--font-body) text-[#141414] placeholder:text-[#7c756b] focus:border-[#d1126f] focus:bg-[#ffd60a]/40 focus:outline-none";

export function TextField({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="flex flex-col items-start gap-2">
      <Scrap tilt={-2}>{label}</Scrap>
      <input type="text" placeholder={placeholder} className={fieldBox} />
    </label>
  );
}

export function SelectField({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) {
  return (
    <label className="flex flex-col items-start gap-2">
      <Scrap tilt={1.5}>{label}</Scrap>
      <span className="relative w-full">
        <select defaultValue={defaultValue} className={cx(fieldBox, "appearance-none pr-8")}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span aria-hidden className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 font-(family-name:--font-marker)">
          ↓
        </span>
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Checkbox: a hand-drawn box, ticked in pink marker.
// Radio: a hand-drawn bubble, filled in with scribble like a form.

function DrawnBox({ checked, id }: { checked: boolean; id: string }) {
  return (
    <svg viewBox="0 0 28 28" className="size-7 shrink-0" aria-hidden>
      <defs>
        <Rough id={id} scale={1.8} />
      </defs>
      <path d="M4 5 L23 4 L24 23 L5 24 Z" fill="white" stroke={zine.ink} strokeWidth="2" strokeLinejoin="round" filter={`url(#${id})`} />
      {checked && (
        <path d="M7 14 L12 20 L26 2" fill="none" stroke={zine.pink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id})`} />
      )}
    </svg>
  );
}

export function Checkbox({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  const id = `cb-${seedOf(label)}`;
  return (
    <label className="group inline-flex cursor-pointer items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="peer sr-only" />
      <span className="rounded-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-dashed peer-focus-visible:outline-[#141414] group-hover:-rotate-3">
        <DrawnBox checked={checked} id={id} />
      </span>
      <span>{label}</span>
    </label>
  );
}

export function RadioGroup({ name, options, defaultValue }: { name: string; options: string[]; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? options[0]);
  return (
    <div role="radiogroup" className="flex flex-wrap gap-5">
      {options.map((o) => {
        const id = `rd-${name}-${seedOf(o)}`;
        return (
          <label key={o} className="group inline-flex cursor-pointer items-center gap-2">
            <input type="radio" name={name} checked={value === o} onChange={() => setValue(o)} className="peer sr-only" />
            <span className="rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-dashed peer-focus-visible:outline-[#141414]">
              <svg viewBox="0 0 28 28" className="size-7 group-hover:-rotate-6" aria-hidden>
                <defs>
                  <Rough id={id} scale={1.8} />
                  <clipPath id={`${id}-c`}>
                    <circle cx="14" cy="14" r="8.5" />
                  </clipPath>
                </defs>
                <circle cx="14" cy="14" r="10" fill="white" stroke={zine.ink} strokeWidth="2" filter={`url(#${id})`} />
                {value === o && (
                  <path
                    d="M4 10 L12 4 M4 16 L18 4 M5 21 L23 5 M9 24 L24 10 M15 24 L24 17"
                    stroke={zine.ink}
                    strokeWidth="3"
                    strokeLinecap="round"
                    clipPath={`url(#${id}-c)`}
                    filter={`url(#${id})`}
                  />
                )}
              </svg>
            </span>
            <span>{o}</span>
          </label>
        );
      })}
    </div>
  );
}

// Toggle: two cut-out words, OFF and ON. The live one is pasted in pink.
export function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  const word = (text: string, live: boolean) => (
    <span
      style={live ? { filter: "drop-shadow(2px 2px 0 #141414)" } : undefined}
      className={cx("inline-block transition-transform", live ? "-rotate-3" : "rotate-0")}
    >
      <span
        style={{ clipPath: cutClip(seedOf(text)) }}
        className={cx(
          "inline-block px-1.5 font-(family-name:--font-label) text-sm uppercase",
          live ? "bg-[#d1126f] text-white" : "bg-[#ece5d3] text-[#7c756b] line-through decoration-[#7c756b]",
        )}
      >
        {text}
      </span>
    </span>
  );
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn(!on)}
      className={cx("group inline-flex items-center gap-2.5", focusRing)}
    >
      <span className="inline-flex gap-1 group-hover:-translate-y-px">
        {word("off", !on)}
        {word("on", on)}
      </span>
      <span>{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Tabs: the active tab is a scrap pasted on; the rest are typed.
// Chips: scraps; the selected one is black.

export function Tabs({ tabs, defaultTab }: { tabs: string[]; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]);
  return (
    <div role="tablist" className="flex items-center gap-4">
      {tabs.map((t, i) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={active === t}
          onClick={() => setActive(t)}
          className={cx("rounded-sm", focusRing)}
        >
          {active === t ? (
            <span style={{ filter: "drop-shadow(2px 2px 0 #141414)", rotate: `${i % 2 ? 2 : -2}deg` }} className="inline-block">
              <span style={{ clipPath: cutClip(seedOf(t)) }} className="inline-block bg-white px-3 py-0.5 font-(family-name:--font-marker) text-lg uppercase">
                {t}
              </span>
            </span>
          ) : (
            <span className="font-(family-name:--font-label) text-[#57514a] uppercase decoration-[#d1126f] decoration-wavy underline-offset-4 hover:text-[#141414] hover:underline">
              {t}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Chips({ chips, defaultChip }: { chips: string[]; defaultChip?: string }) {
  const [active, setActive] = useState(defaultChip ?? chips[0]);
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c, i) => (
        <button
          key={c}
          type="button"
          aria-pressed={active === c}
          onClick={() => setActive(c)}
          className={cx("group inline-block", focusRing)}
        >
          <span
            style={{ clipPath: cutClip(seedOf(c) + 9), rotate: `${(i % 3) - 1}deg` }}
            className={cx(
              "inline-block px-3 py-1 font-(family-name:--font-label) text-sm transition-transform group-hover:-rotate-2",
              active === c ? "bg-[#141414] text-white" : "bg-[#ece5d3] text-[#141414] group-hover:bg-white",
            )}
          >
            {c}
          </span>
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail panel: a torn sheet taped down. Inline for the library, or a modal dialog.

export function DetailPanel({ title, children, onClose }: { title: string; children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="relative w-full max-w-sm pt-3">
      <Tape className="top-0 left-1/2 -translate-x-1/2" />
      <div style={{ clipPath: tornClip }} className="border-2 border-[#141414] bg-white px-6 pt-6 pb-9">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-(family-name:--font-marker) text-2xl uppercase">{title}</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={cx("font-(family-name:--font-marker) text-2xl leading-none hover:text-[#d1126f]", focusRing)}
          >
            ×
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
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
      <Key variant="secondary" onClick={() => setOpen(true)}>
        {trigger}
      </Key>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === ref.current && setOpen(false)}
        className="m-auto overflow-visible bg-transparent p-0 backdrop:bg-[#141414]/60"
      >
        <DetailPanel title={title} onClose={() => setOpen(false)}>
          {children}
        </DetailPanel>
      </dialog>
    </>
  );
}
