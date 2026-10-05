# Victoria Harbour 3D Website

A cinematic, scroll-controlled Three.js journey through Victoria Harbour.

## Current stage

The six chapters, the footer and the colours are built. Start from
`docs/plan/HANDOFF.md`. The grey-box review is history.

```
npm install
npm run dev        # http://localhost:5173/  (add ?debug for tuning tools)
npm run build      # production build in dist/
npm run preview    # serve dist/ at http://localhost:4173/  (add ?fps)
```

## Chapters

1. Harbour at Dusk — Arrival
2. The Kowloon Edge — Clock Tower
3. Across the Water — Star Ferry
4. Red Sails — The Junk
5. City of Light — IFC
6. Afterglow — Departure

## Project structure

- `docs/` — the current record (`plan/HANDOFF.md`, `SCENE-MAP.md`, `FINAL-NARRATIVE-COPY.md`, `ASSET-LEDGER.md`) and the history briefs
- `public/atmosphere/` — clouds, mist, petals, foliage, fireworks
- `public/plates/` — the memory print, the two photographs, the ticket
- `public/posters/` — the share image and the two fallback stills
- `public/fonts/` — local web fonts and their licence files
- `src/data/` — shared scroll numbers, the assembled chapter list, world and atmosphere
- `src/story/` — one config per chapter
- `src/scene/` — Three.js world systems
- `src/scroll/` — scroll-to-camera conductor
- `src/ui/` — semantic HTML chapter behavior

## Guiding principle

Build one persistent 3D harbour world. Native scrolling controls the camera, atmosphere, lighting, animation, and HTML story layered above it.
