# UI/UX & Visual Design — Assignment 2

Design, Build, Ship · MPCS 51238 · Autumn 2026

Static Next.js + Tailwind site, deployed on Vercel. The homepage is the hub.

## Routes

| Route | File |
|---|---|
| `/` (hub) | `src/app/page.tsx` |
| `/mood-boards/<style>` | `src/app/mood-boards/[style]/page.tsx` → `src/components/MoodBoard.tsx` |
| `/design-systems/<style>` | `src/app/design-systems/[style]/page.tsx` |
| `/habits` (my site) | `src/app/habits/page.tsx` |

Each style's name, mood words, palette, and mood board artifacts live in `src/lib/styles.ts`.
Mood board images go in `public/mood-boards/<style>/`.

## Run

```bash
npm run dev    # http://localhost:3000
npm run build
```
