# Victoria Harbour 3D Website

A cinematic, scroll-controlled Three.js journey through Victoria Harbour.

## Current stage

Grey-box milestone built (steps 1–11 of `docs/CURSOR-GREYBOX-BRIEF.md`) and
awaiting review. See `docs/greybox-review/REVIEW.md` for screenshots,
deviations, and debug tools, and `docs/greybox-review/PERFORMANCE.md` for
performance numbers and the iPhone test.

```
npm install
npm run dev        # http://localhost:5173/  (add ?debug for tuning tools)
npm run build      # production build in dist/
npm run preview    # serve dist/ at http://localhost:4173/  (add ?fps)
```

## Planned chapters

1. Harbour at Dusk — Arrival
2. The Kowloon Edge — Clock Tower
3. Across the Water — Star Ferry
4. Red Sails — The Junk
5. City of Light — IFC
6. Afterglow — Departure

## Project structure

- `docs/` — creative direction, storyboard, asset planning, grey-box brief, and the approved typography/interface direction
- `public/models/` — optimized GLB models
- `public/textures/` — model and procedural textures
- `public/cutouts/` — transparent WebP foreground layers
- `public/plates/` — cinematic editorial images
- `public/posters/` — hero and WebGL fallback images
- `public/fonts/` — local web fonts and license files
- `src/data/` — chapter and camera configuration
- `src/scene/` — Three.js world systems
- `src/scroll/` — scroll-to-camera conductor
- `src/ui/` — semantic HTML chapter behavior

## Guiding principle

Build one persistent 3D harbour world. Native scrolling controls the camera, atmosphere, lighting, animation, and HTML story layered above it.
