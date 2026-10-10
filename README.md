# UI/UX & Visual Design — Assignment 2

Design, Build, Ship · MPCS 51238 · Autumn 2026

Static Next.js + Tailwind site, deployed on Vercel. The homepage is the hub.

## Routes

| Route | File |
|---|---|
| `/` (hub) | `src/app/page.tsx` |
| `/mood-boards/{calm,arcade,editorial}` | `src/app/mood-boards/*/page.tsx` |
| `/design-systems/{calm,arcade,editorial}` | `src/app/design-systems/*/page.tsx` |
| `/my-site` (your site) | `src/app/my-site/page.tsx` |

Style names and the site link live in `src/lib/styles.ts`.
Mood board images go in `public/mood-boards/<style>/`.

## Run

```bash
npm run dev    # http://localhost:3000
npm run build
```
