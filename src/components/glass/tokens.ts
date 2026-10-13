// Glass colors beyond the six palette roles in src/lib/styles.ts.
export const glass = {
  orange: "#ff8a3d", // the one primary action
  orangeLight: "#ffa865", // top of the primary pill
  violet: "#a98bff", // checked controls, the middle of the spectrum
  violetDeep: "#6a3df0", // selected and engaged states (white text 5.9:1)
  blue: "#5cc8ff", // links, focus rings, water
  blueDeep: "#2a6bf0", // the bottom of the water
  pink: "#ff7aa2", // errors
  mint: "#7ef0c1", // success
  night: "#120c2a", // the sky behind everything
  ink: "#1a1033", // text on orange, blue, and violet
  outline: "#8a7dc4", // control outlines (4.4:1 on surface)
};

// Blue → violet → orange, the dusk sky. Only for progress fills and "goal met":
// a fill gets warmer as it nears the goal.
export const spectrum = `linear-gradient(90deg, ${glass.blue}, ${glass.violet} 50%, ${glass.orange})`;

// A frosted pane: white at 8%, a blur, a bright top edge, and a soft drop.
export const pane =
  "border border-white/15 bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_12px_40px_rgba(8,4,28,0.45)] backdrop-blur-xl";

// A lighter pane, for controls sitting on a pane.
export const paneRaised = "border border-white/20 bg-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-md";

export type ForcedState = "hover" | "focus" | "pressed";
