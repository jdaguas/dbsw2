// Orbit colors beyond the six palette roles in src/lib/styles.ts.
export const orbit = {
  orange: "#b53e15",
  orangeDeep: "#7d2a0e", // the key's bottom edge
  teal: "#1f6f78", // links, focus rings, checked controls
  mustard: "#e8a33d", // lamps, planets, "goal met"
  navy: "#1c2a4a", // selected and engaged states
  chrome: "#b9bcbf", // screen bezels
  screen: "#16182a", // console screen glass
  phosphor: "#9fe3c4", // text and lit cells on the screen
  phosphorDim: "#5f8f7c", // secondary text on the screen
  outline: "#8a7f6c", // control outlines (3:1 on surface)
};

export type ForcedState = "hover" | "focus" | "pressed";
