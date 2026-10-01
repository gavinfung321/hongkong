# Victoria Harbour 3D Website

A cinematic, scroll-controlled Three.js journey through Victoria Harbour.

## Current stage

Grey-box milestone approved (2026-10-01). Pre-production decisions and all six
desktop and mobile storyboard frames are approved. The implementation brief is
`docs/CURSOR-GREYBOX-BRIEF.md`. Build only what that brief describes, starting
with step 1 of its build order.

## Planned chapters

1. Harbour at Dusk — Arrival
2. The Kowloon Edge — Clock Tower
3. Across the Water — Star Ferry
4. Red Sails — The Junk
5. City of Light — IFC
6. Afterglow — Departure

## Project structure

- `docs/` — creative direction, storyboard, asset planning, and the grey-box brief
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
