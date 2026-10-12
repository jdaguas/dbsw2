// Everything the hub, mood boards, and design systems need to know about
// each style lives here. Edit a style's entry to rename it or change its colors;
// its routes (/mood-boards/<slug>, /design-systems/<slug>) follow the slug.

import type { CSSProperties } from "react";

export type Palette = {
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
};

// CSS font-family values. The font variables are loaded in src/app/layout.tsx.
export type Fonts = {
  display: string;
  body: string;
  label: string;
};

export type ArtifactSection =
  | "where it comes from"
  | "type and color"
  | "pieces of ui"
  | "references";

export type Artifact = {
  section: ArtifactSection;
  title: string;
  // What you take from it, e.g. "Take the hairline between rows, not a box."
  takeaway: string;
  // Path under public/, e.g. "/mood-boards/style-a/notebook.jpg".
  image?: string;
  // Natural size of the image, used to keep its aspect ratio.
  width?: number;
  height?: number;
  // Key of a tile drawn in code (src/components/tiles.tsx), for agent-made artifacts.
  tile?: string;
  source: "collected" | "agent";
  // Who made it and under what license, for images found online.
  credit?: { author: string; license: string; url: string };
};

export type Style = {
  slug: string;
  name: string;
  // Three words, shown as "quiet · paper · spectrum".
  mood: [string, string, string];
  evokes: string;
  suits: string;
  palette: Palette;
  fonts: Fonts;
  // Tailwind classes for display headings (weight, case, tracking).
  display: string;
  // Corner radius for images and cards.
  radius: string;
  // Extra classes for the page background, e.g. a paper texture from globals.css.
  page?: string;
  // Tilt mood board artifacts and tape them down.
  collage?: boolean;
  artifacts: Artifact[];
};

const defaultFonts: Fonts = {
  display: "var(--font-geist-sans)",
  body: "var(--font-geist-sans)",
  label: "var(--font-geist-mono)",
};

// Empty tiles to lay out a board before the real artifacts are in.
function placeholders(section: ArtifactSection, count: number): Artifact[] {
  return Array.from({ length: count }, () => ({
    section,
    title: "",
    takeaway: "",
    source: "collected",
  }));
}

function placeholderBoard(): Artifact[] {
  return [
    ...placeholders("where it comes from", 4),
    ...placeholders("type and color", 4),
    ...placeholders("pieces of ui", 4),
    ...placeholders("references", 16),
  ];
}

export const styles: Style[] = [
  {
    slug: "orbit",
    name: "Orbit",
    mood: ["retro", "curved", "optimistic"],
    evokes:
      "The future as people pictured it in the 1960s: rounded rooms, chrome, a countdown, and everything going up.",
    suits: "Daily habits as a mission: a streak you keep in orbit, one check-in at a time.",
    palette: {
      background: "#f3ead8",
      surface: "#fbf6ec",
      text: "#1c1a2e",
      muted: "#5f5a6b",
      border: "#ddd0b8",
      accent: "#b53e15",
    },
    fonts: {
      display: "var(--font-michroma)",
      body: "var(--font-jost)",
      label: "var(--font-space-mono)",
    },
    // Michroma has one weight, so headings get width and capitals instead of bold.
    display: "font-normal uppercase tracking-wide",
    radius: "2rem",
    artifacts: [
      {
        section: "where it comes from",
        title: "Rocketing into the future",
        takeaway: "Take the sunset orange, the light rays, and the spire and sphere: the future as a poster.",
        image: "/mood-boards/orbit/rocketing-poster.jpg",
        width: 600,
        height: 847,
        source: "collected",
      },
      {
        section: "where it comes from",
        title: "A living room of the future",
        takeaway: "Take the orange pod, the stacked screens, and the dome onto space: comfort with controls.",
        image: "/mood-boards/orbit/living-room-of-the-future.jpg",
        width: 728,
        height: 937,
        source: "collected",
      },
      {
        section: "where it comes from",
        title: "A concept car at dusk",
        takeaway: "Take the chrome, the long sweep, and the twilight blue that cools the orange.",
        image: "/mood-boards/orbit/concept-car.jpg",
        width: 514,
        height: 389,
        source: "collected",
      },
      {
        section: "where it comes from",
        title: "A doorway cut into a concrete shell",
        takeaway: "Take the curve as the container: corners that sweep instead of snap.",
        image: "/mood-boards/orbit/concrete-shell-doorway.jpg",
        width: 547,
        height: 365,
        source: "collected",
      },
      {
        section: "type and color",
        title: "Michroma for headlines",
        takeaway: "Take a wide, squared-round face in capitals, like the type on 1960s sci-fi and hardware.",
        tile: "orbit/headline",
        source: "agent",
      },
      {
        section: "type and color",
        title: "Space Mono for readouts",
        takeaway: "Take a retro monospace in small caps for labels, counts, and countdowns.",
        tile: "orbit/labels",
        source: "agent",
      },
      {
        section: "type and color",
        title: "The cream palette",
        takeaway: "Take six warm roles on cream, with one burnt orange accent.",
        tile: "orbit/palette",
        source: "agent",
      },
      {
        section: "type and color",
        title: "Orange, teal, mustard, navy, chrome",
        takeaway: "Take the Space Age colors as supporting notes, never louder than the orange.",
        tile: "orbit/materials",
        source: "agent",
      },
      {
        section: "pieces of ui",
        title: "A console screen of habits",
        takeaway: "Take the rounded TV screen as the frame for today's list.",
        tile: "orbit/console",
        source: "agent",
      },
      {
        section: "pieces of ui",
        title: "The check-in pill",
        takeaway: "Take the orange for the one primary action, in a full pill.",
        tile: "orbit/buttons",
        source: "agent",
      },
      {
        section: "pieces of ui",
        title: "A card with a sweeping corner",
        takeaway: "Take big, uneven radii so a card feels molded, not cut.",
        tile: "orbit/card",
        source: "agent",
      },
      {
        section: "pieces of ui",
        title: "A streak in orbit",
        takeaway: "Take the orbit ring as progress: a planet that travels as the streak grows.",
        tile: "orbit/orbit",
        source: "agent",
      },
      {
        section: "references",
        title: "A sunken lounge under a concrete wing",
        takeaway: "Take one warm, saturated color where people gather, set on soft white.",
        image: "/mood-boards/orbit/twa-sunken-lounge.jpg",
        width: 1440,
        height: 961,
        source: "collected",
      },
      {
        section: "references",
        title: "A board set in a sculpted pod",
        takeaway: "Take the oval frame around a dark screen: information held inside a curve.",
        image: "/mood-boards/orbit/twa-departures-board.webp",
        width: 1500,
        height: 1125,
        source: "collected",
      },
      {
        section: "references",
        title: "A ring table on moss carpet",
        takeaway: "Take the loop and the soft materials: moss, leather, chrome.",
        image: "/mood-boards/orbit/ring-table.jpg",
        width: 399,
        height: 501,
        source: "collected",
      },
      {
        section: "references",
        title: "A space colony with a lake",
        takeaway: "Take the optimism: a whole town curved overhead, green and blue under glass.",
        image: "/mood-boards/orbit/nasa-torus-interior.jpg",
        width: 1200,
        height: 950,
        source: "collected",
        credit: { author: "NASA/Donald Davis", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Stanford_Torus_interior.jpg" },
      },
      {
        section: "references",
        title: "Inside a Bernal sphere",
        takeaway: "Take the world wrapping around you: everything held inside one curve.",
        image: "/mood-boards/orbit/nasa-bernal-sphere.jpg",
        width: 1200,
        height: 892,
        source: "collected",
        credit: { author: "NASA/Rick Guidice", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Bernal_sphere_interior.jpg" },
      },
      {
        section: "references",
        title: "A cutaway of the torus",
        takeaway: "Take the bands of warm sunlight against deep space: orange light on navy.",
        image: "/mood-boards/orbit/nasa-torus-cutaway.jpg",
        width: 1200,
        height: 947,
        source: "collected",
        credit: { author: "NASA/Rick Guidice", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Stanford_Torus_cutaway.jpg" },
      },
      {
        section: "references",
        title: "The Theme Building at night",
        takeaway: "Take the arches crossing overhead: big, light curves holding a small round center.",
        image: "/mood-boards/orbit/lax-theme-building.jpg",
        width: 1200,
        height: 800,
        source: "collected",
        credit: { author: "Junkyardsparkle", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:LAX_Theme_Building_and_moon_from_northwest_2016-07-21.jpg" },
      },
      {
        section: "references",
        title: "The Atomium at twilight",
        takeaway: "Take chrome spheres joined by lines: progress as dots on a track.",
        image: "/mood-boards/orbit/atomium.jpg",
        width: 1200,
        height: 1513,
        source: "collected",
        credit: { author: "Trougnouf (Benoit Brummer)", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:The_Atomium_during_civil_twilight_(DSCF1135).jpg" },
      },
      {
        section: "references",
        title: "A Futuro house on legs",
        takeaway: "Take the saucer with oval windows: rounded rectangles everywhere.",
        image: "/mood-boards/orbit/futuro-house.jpg",
        width: 1200,
        height: 800,
        source: "collected",
        credit: { author: "Henning Schlottmann (User:H-stt)", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Futuro_Pinakothek_M%C3%BCnchen_6491.jpg" },
      },
      {
        section: "references",
        title: "The Unisphere",
        takeaway: "Take the orbit rings around a globe: rings as a frame for progress.",
        image: "/mood-boards/orbit/unisphere.jpg",
        width: 1200,
        height: 1247,
        source: "collected",
        credit: { author: "Beyond My Ken", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Unisphere_in_summer.jpg" },
      },
      {
        section: "references",
        title: "The Space Needle",
        takeaway: "Take the halo on a stem: a small bright top on a tall, quiet line.",
        image: "/mood-boards/orbit/space-needle.jpg",
        width: 1200,
        height: 817,
        source: "collected",
        credit: { author: "Dietmar Rabich", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Seattle_(WA,_USA),_Space_Needle_--_2022_--_1498.jpg" },
      },
      {
        section: "references",
        title: "Aarnio's Ball chair",
        takeaway: "Take the white shell with a warm orange inside: soft color held in a hard curve.",
        image: "/mood-boards/orbit/ball-chair.jpg",
        width: 1200,
        height: 1409,
        source: "collected",
        credit: { author: "sailko", license: "CC BY 2.5", url: "https://commons.wikimedia.org/wiki/File:Ngv_design,_eero_aarnio,_globe_chair_1963-65_01.JPG" },
      },
      {
        section: "references",
        title: "Panton's one-piece chair",
        takeaway: "Take a single glossy sweep with no corners at all.",
        image: "/mood-boards/orbit/panton-chair.jpg",
        width: 1200,
        height: 1736,
        source: "collected",
        credit: { author: "sailko", license: "CC BY 2.5", url: "https://commons.wikimedia.org/wiki/File:Ngv_design,_verner_panton,_panton_chair,_1960_01.JPG" },
      },
      {
        section: "references",
        title: "The Apollo 11 plaque",
        takeaway: "Take the plain capitals on brushed steel: the future, set in Futura.",
        image: "/mood-boards/orbit/apollo-11-plaque.jpg",
        width: 1200,
        height: 1130,
        source: "collected",
        credit: { author: "NASA", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Apollo_11_plaque_closeup_on_Moon.jpg" },
      },
      {
        section: "references",
        title: "The Las Vegas sign",
        takeaway: "Take the starburst and the lit circles: small stars for moments worth celebrating.",
        image: "/mood-boards/orbit/las-vegas-sign.jpg",
        width: 1200,
        height: 914,
        source: "collected",
        credit: { author: "Thomas Wolf, www.foto-tw.de", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Welcome_to_Fabulous_Las_Vegas.jpg" },
      },
      {
        section: "references",
        title: "Pann's diner sign",
        takeaway: "Take the slanted neon script and starbursts: playful lettering, used once.",
        image: "/mood-boards/orbit/panns-sign.jpg",
        width: 1200,
        height: 800,
        source: "collected",
        credit: { author: "Wikimedia Commons contributor", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Pann%27s_sign.jpg" },
      },
    ],
  },
  {
    slug: "zine",
    name: "Zine",
    mood: ["maximalist", "graphic", "vibrant"],
    evokes:
      "A stack of photocopied zines: cut-up photos, hand-lettered covers, typed scraps, and star stickers everywhere.",
    suits: "Logging the day by hand and loudly: coloring in glasses, sticking a star on every goal you hit.",
    palette: {
      background: "#fbf6ea",
      surface: "#ffffff",
      text: "#141414",
      muted: "#57514a",
      border: "#141414",
      accent: "#d1126f",
    },
    fonts: {
      display: "var(--font-marker)",
      body: "var(--font-courier)",
      label: "var(--font-special-elite)",
    },
    display: "uppercase",
    // A hand-drawn box: every corner a different curve.
    radius: "255px 15px 225px 15px / 15px 225px 15px 255px",
    page: "paper-texture",
    collage: true,
    artifacts: [
      {
        section: "where it comes from",
        title: "A collage of friends",
        takeaway: "Take photos cut out roughly with a white edge, black-and-white next to color, names written in by hand.",
        image: "/mood-boards/zine/photo-collage.jpg",
        width: 1200,
        height: 1200,
        source: "collected",
      },
      {
        section: "where it comes from",
        title: "Foil stars on a tour poster",
        takeaway: "Take the star stickers scattered over grainy black: little bursts of color as rewards.",
        image: "/mood-boards/zine/star-sticker-poster.jpg",
        width: 640,
        height: 960,
        source: "collected",
      },
      {
        section: "where it comes from",
        title: "A pile of handmade zines",
        takeaway: "Take the loud covers: fat hand-lettering, bright paper, doodled stars and hearts.",
        image: "/mood-boards/zine/pile-of-zines.jpg",
        width: 1200,
        height: 1600,
        source: "collected",
      },
      {
        section: "where it comes from",
        title: "Words on paper scraps",
        takeaway: "Take each word handwritten on its own cut scrap, over a world drawn in colored pencil.",
        image: "/mood-boards/zine/paper-cutout-video.jpg",
        width: 1280,
        height: 720,
        source: "collected",
      },
      {
        section: "type and color",
        title: "Marker for headlines",
        takeaway: "Take scrawled marker capitals that shout like a zine cover, with cut-out letters for the big moments.",
        tile: "zine/headline",
        source: "agent",
      },
      {
        section: "type and color",
        title: "Typewriter text, typed scraps",
        takeaway: "Take a typewriter for reading, and typed words cut out and pasted down for labels.",
        tile: "zine/labels",
        source: "agent",
      },
      {
        section: "type and color",
        title: "Paper, ink, and hot pink",
        takeaway: "Take six roles on bright paper, with black ink everywhere and hot pink for the one action.",
        tile: "zine/palette",
        source: "agent",
      },
      {
        section: "type and color",
        title: "The sticker sheet",
        takeaway: "Take five loud colors as stickers and highlights: black text on yellow, lilac, mint, tomato; white on blue.",
        tile: "zine/stickers",
        source: "agent",
      },
      {
        section: "pieces of ui",
        title: "Glasses you color in",
        takeaway: "Take the water log as doodled glasses, hatched in when you drink one.",
        tile: "zine/glasses",
        source: "agent",
      },
      {
        section: "pieces of ui",
        title: "A sticker button",
        takeaway: "Take the primary action as a pink sticker, and the secondary as a strip of tape.",
        tile: "zine/buttons",
        source: "agent",
      },
      {
        section: "pieces of ui",
        title: "A goal met, with a star",
        takeaway: "Take a taped-down card with a crayon progress line, and a star stuck on when it's full.",
        tile: "zine/card",
        source: "agent",
      },
      {
        section: "pieces of ui",
        title: "Mood faces, circled",
        takeaway: "Take the mood as five doodled faces, with today's circled in pink crayon.",
        tile: "zine/mood",
        source: "agent",
      },
      {
        section: "references",
        title: "Mini zines with typed scraps",
        takeaway: "Take black covers with words cut from paper and pasted on: labels as scraps.",
        image: "/mood-boards/zine/mini-zines.jpg",
        width: 600,
        height: 600,
        source: "collected",
      },
      {
        section: "references",
        title: "A box of punk zines",
        takeaway: "Take black-and-white photocopies with one loud red cover.",
        image: "/mood-boards/zine/punk-zines-box.jpg",
        width: 1200,
        height: 1200,
        source: "collected",
        credit: { author: "Lindsay Eyink", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:SF_punk_zines_at_Prelinger_Library.jpg" },
      },
      {
        section: "references",
        title: "Zines from the UK and US",
        takeaway: "Take a table of covers, each one shouting in a different typeface.",
        image: "/mood-boards/zine/uk-us-zines.jpg",
        width: 1200,
        height: 900,
        source: "collected",
        credit: { author: "Burn_the_asylum", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:UK_and_US_zines.jpg" },
      },
      {
        section: "references",
        title: "Schwitters, Mal Kah (1921)",
        takeaway: "Take collage built from labels and tickets: found type as decoration.",
        image: "/mood-boards/zine/schwitters-mal-kah.jpg",
        width: 1200,
        height: 1521,
        source: "collected",
        credit: { author: "Kurt Schwitters", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Kurt_Schwitters_Mz_245_Mal_Kah_Merzzeichnung.jpg" },
      },
      {
        section: "references",
        title: "Schwitters, Merz 50 (1922)",
        takeaway: "Take scraps of paper overlapping, never quite lined up.",
        image: "/mood-boards/zine/schwitters-merz-50.jpg",
        width: 1200,
        height: 1575,
        source: "collected",
        credit: { author: "Kurt Schwitters", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Kurt_Schwitters_-_%22Merz_50%22_Composition_-_Google_Art_Project.jpg" },
      },
      {
        section: "references",
        title: "A risograph print coming out",
        takeaway: "Take the riso inks: fluorescent pink, blue, and yellow printed over each other.",
        image: "/mood-boards/zine/risograph-printing.jpg",
        width: 1200,
        height: 1600,
        source: "collected",
        credit: { author: "Quinn Daedal from Berkeley, USA", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Risograph_printing.jpg" },
      },
      {
        section: "references",
        title: "A two-color riso print",
        takeaway: "Take two flat inks slightly out of register: imperfect on purpose.",
        image: "/mood-boards/zine/risograph-two-color.jpg",
        width: 1200,
        height: 800,
        source: "collected",
        credit: { author: "Mario Felipe", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Impress%C3%A3o_em_risografia_em_dua_cores,_2014.jpg" },
      },
      {
        section: "references",
        title: "A wall of sticker sheets",
        takeaway: "Take rows of tiny stickers: rewards you can collect.",
        image: "/mood-boards/zine/sticker-wall.jpg",
        width: 1200,
        height: 904,
        source: "collected",
        credit: { author: "Reconrabbit", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Stickers_and_japanese_goods_in_As_Seen_On_TV_store.jpg" },
      },
      {
        section: "references",
        title: "A collage zine about rent strikers",
        takeaway: "Take cut-out photos on magenta and green: history pasted down loud.",
        image: "/mood-boards/zine/suffragettes-zine.jpg",
        width: 1200,
        height: 1200,
        source: "collected",
        credit: { author: "t s Beall", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Protests_And_Suffragettes_-_RentStrikers_and_Suffragettes_Zine_-_Front,_Back_and_Page_spread.jpg" },
      },
      {
        section: "references",
        title: "Colored pencils in a fan",
        takeaway: "Take the full spectrum, used as bright marks on paper.",
        image: "/mood-boards/zine/colored-pencils.jpg",
        width: 1200,
        height: 898,
        source: "collected",
        credit: { author: "Chevre", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Colored_pencils_chevre.jpg" },
      },
      {
        section: "references",
        title: "A post covered in stickers",
        takeaway: "Take layer on layer: maximal, nothing left blank.",
        image: "/mood-boards/zine/sticker-bomb.jpg",
        width: 1200,
        height: 900,
        source: "collected",
        credit: { author: "Zest", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Sticker_bomb_in_Nanba_D%C5%8Dtonbori.jpg" },
      },
      {
        section: "references",
        title: "A photo-booth strip",
        takeaway: "Take a strip of frames: a day split into little squares.",
        image: "/mood-boards/zine/photo-booth-strip.jpg",
        width: 1200,
        height: 1485,
        source: "collected",
        credit: { author: "Mataparda", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Photo_booth_strip_00002.jpg" },
      },
      {
        section: "references",
        title: "Bubble letters on teal",
        takeaway: "Take fat outlined letters with a drop shadow, on a flat bright wall.",
        image: "/mood-boards/zine/bubble-letters.jpg",
        width: 1200,
        height: 969,
        source: "collected",
        credit: { author: "Notcharizard", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Bubble_writing_graffiti.jpg" },
      },
      {
        section: "references",
        title: "Highlighters scribbling",
        takeaway: "Take neon strokes as emphasis: highlight the one thing that matters.",
        image: "/mood-boards/zine/highlighters.jpg",
        width: 1200,
        height: 900,
        source: "collected",
        credit: { author: "photosteve101", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Artful_highlighter_pens_drawing_on_paper.jpg" },
      },
      {
        section: "references",
        title: "Holographic glitter",
        takeaway: "Take a little sparkle for the moment a goal is met.",
        image: "/mood-boards/zine/glitter.jpg",
        width: 1200,
        height: 1022,
        source: "collected",
        credit: { author: "Inkwina", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Glitter_close_up.jpg" },
      },
      {
        section: "references",
        title: "A highlighted photocopy",
        takeaway: "Take yellow marker over black type, with notes in the margins.",
        image: "/mood-boards/zine/highlighted-photocopy.jpg",
        width: 1200,
        height: 1600,
        source: "collected",
        credit: { author: "Guido \"random\" Alvarez", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Highlighter_pen_-photocopied_text-9Mar2009.jpg" },
      },
    ],
  },
  {
    slug: "style-c",
    name: "Style C",
    mood: ["mood", "words", "here"],
    evokes: "What this style feels like.",
    suits: "What kind of habit tracking it fits.",
    palette: {
      background: "#ffffff",
      surface: "#f0f0f0",
      text: "#111111",
      muted: "#5c5c5c",
      border: "#dddddd",
      accent: "#7a7a7a",
    },
    fonts: defaultFonts,
    display: "font-bold tracking-tight",
    radius: "0.5rem",
    artifacts: placeholderBoard(),
  },
];

export function getStyle(slug: string): Style | undefined {
  return styles.find((s) => s.slug === slug);
}

// Inline CSS variables so a page can be themed with bg-(--background),
// font-(family-name:--font-display), rounded-(--radius), etc.
export function themeVars(style: Style): CSSProperties {
  const { palette: p, fonts: f } = style;
  return {
    "--background": p.background,
    "--surface": p.surface,
    "--text": p.text,
    "--muted": p.muted,
    "--border": p.border,
    "--accent": p.accent,
    "--font-display": f.display,
    "--font-body": f.body,
    "--font-label": f.label,
    "--radius": style.radius,
  } as CSSProperties;
}

export const site = {
  name: "Habit Tracker",
  href: "/habits",
  description:
    "The habit tracker, in the style I pick, at /habits. Not started yet: I pick a style first.",
};
