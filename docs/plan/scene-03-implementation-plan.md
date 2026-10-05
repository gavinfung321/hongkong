# Scene 03 — Progressive Story Implementation Plan

**Status:** approved, 10 of 10 steps complete  
**Created:** user request, 2026-10-05  
**Review:** <http://localhost:5173/#chapter-03>

## Goal

Turn Scene 03's existing 60svh hold into a clear ferry-crossing sequence
using the current label, title, standfirst, departure board, ticket, three
desktop panels and route. The result should feel like a departure becoming a
daily crossing, not a collection of elements arriving at once.

## Frozen scope

Do not change:

- desktop or mobile cameras;
- ferry pose, scale, route or timing;
- water, wake, buoy, skyline, haze, lens effects or any 3D model;
- copy-safe regions or the desktop panel-row placement;
- ticket or departure-board artwork;
- approved wording or semantic order;
- Scene 02 or any other scene.

Do not add another illustration unless the completed sequence reveals a
specific narrative gap and the user approves it separately.

## Current state

- Label, title and standfirst establish the departure before the board.
- The ticket and “Facing Forward” form the human-crossing beat, followed by
  “A Daily Crossing” and then “The Route”.
- The route dot waits for its panel, then crosses during the dwell.
- The board keeps CENTRAL fixed and advances through 3 MIN, 2 MIN, 1 MIN and
  ARRIVING without counting backward inside the scene.
- Phones omit the three-panel index and retain the title, standfirst,
  “Crossing since 1888”, departure board and ticket.
- Reduced motion shows still panels, board and ticket with short fades.

## Files in scope

- `src/story/scene03/config.js` — all editable Scene 03 ranges and values.
- `src/ui/copyLayer.js` — reveal orchestration and route/board synchronization.
- `src/ui/departureBoard.js` — only if existing board state handling cannot
  express the approved sequence.
- `src/ui/ticketCard.js` — only if entrance state handling needs adjustment.
- `src/styles.css` — Scene 03-scoped reveal states and responsive treatment.
- `index.html` — read-only unless semantic order must be corrected.
- This file, `narrative-spine.md` and `CHANGELOG.md` — tracking.

## Implementation checklist

### 1 — Author the reveal ranges

- [x] Add named reveal ranges to `SCENE_03_CROSSING` in
  `src/story/scene03/config.js`.
- [x] Keep all scroll-linked Scene 03 timing in that configuration.
- [x] Make forward and reverse scrolling produce opposite sequences.
- [x] Leave camera, vessel and dwell values unchanged.

**Done when:** Scene 03 has one readable timing configuration and no new
scene-specific timing literals in `copyLayer.js`.

**Completed 2026-10-05:** added named opening, board, human-crossing,
daily-crossing and route-panel ranges. The existing opening now reads its
unchanged values from Scene 03's config.

### 2 — Establish the departure

- [x] Reveal label, title and standfirst first.
- [x] Bring in the existing departure board second.
- [x] Preserve split-flap behavior and current wording.
- [x] Keep the board clear of the ferry, moon and IFC at existing breakpoints.

**Done when:** the scene first reads as a departure before any panel or ticket
asks for attention.

**Completed 2026-10-05:** the opening arrives first, the board follows over
dwell share 0.08–0.2, and the still-grouped ticket/panels wait until the later
human-crossing range. Existing desktop and mobile positions are unchanged.

### 3 — Introduce the human crossing

- [x] Bring in the ticket and desktop “Facing Forward” panel together.
- [x] Keep both elements in their current positions.
- [x] Preserve the ticket's rigid flip, sway, hover and touch behavior.
- [x] Keep the reversible-seat sentence unchanged.

**Done when:** the physical ticket and seat detail form one clear second beat.

**Completed 2026-10-05:** the ticket and first panel share the human-crossing
range. The daily-crossing and route panels remain grouped in the following
range pending step 4.

### 4 — Build the daily journey

- [x] Reveal “A Daily Crossing” after “Facing Forward”.
- [x] Reveal “The Route” last.
- [x] Start route-dot progress only once the route panel is available.
- [x] Keep all panel motion restrained and reversible.

**Done when:** the desktop story reads departure → passenger detail → daily
commute → route.

**Completed 2026-10-05:** the daily-crossing panel now has its own range, the
route panel follows it, and the route dot starts after that final panel has
fully arrived. Reversing the scroll reverses the panel and route sequence.

### 5 — Synchronize board and route

- [x] Keep CENTRAL fixed.
- [x] Advance due states at meaningful route thresholds.
- [x] Preserve the current no-count-back behavior while the visitor remains
  in Scene 03.
- [x] Blank and reset the board after leaving Scene 03.

**Done when:** board status never contradicts the route dot.

**Completed 2026-10-05:** the existing route thresholds continue to advance
the due row, but reverse scrolling no longer makes the physical board count
backward. Its existing leave-and-return reset remains intact.

### 6 — Mobile sequence

- [x] Keep the phone composition panel-free.
- [x] Sequence title and standfirst → departure board → ticket →
  route/countdown.
- [x] Keep “Crossing since 1888” readable.
- [x] Keep the ferry, buoy, IFC and vertical margin label unobstructed.
- [x] Do not shrink the ticket merely to create empty space.

**Done when:** mobile communicates the same crossing with fewer layers and no
crowding.

**Completed 2026-10-05:** verified the panel-free mobile composition at
390 × 844 and 320 × 720. The opening, board and ticket remain in order and in
the viewport; the hidden route still drives the countdown. No mobile sizing
or placement changed.

### 7 — Atmosphere timing

- [x] Bring the existing wind haze in with the crossing sequence.
- [x] Keep lens bokeh, buoy, ferry, wake and all 3D atmosphere unchanged.
- [x] Do not add particles, trails, route geometry or new 3D layers.

**Done when:** existing atmosphere supports the story without becoming a new
subject.

**Completed 2026-10-05:** the existing wind haze now begins with the ticket
and human-crossing beat instead of the opening label. No atmosphere artwork,
3D layer or composition value changed.

### 8 — Reduced motion and reading order

- [x] Use short fades and still artwork in stepped mode.
- [x] Show board words directly without tile flipping.
- [x] Keep the ticket still.
- [x] Preserve the semantic order already present in `index.html`.
- [x] Confirm reverse navigation does not leave hidden content focusable.

**Done when:** the complete story remains understandable without continuous
motion.

**Completed 2026-10-05:** reduced-motion emulation confirmed midpoint stepped
reveals, direct board words, a still ticket and the existing semantic order.
The decorative reveal elements remain non-focusable.

### 9 — Final review

- [x] Run `npm run build` once after the final adjustment.
- [x] Inspect Scene 03 at reference desktop, compact desktop and mobile sizes.
- [x] Confirm the page remains enhanced and does not enter fallback.
- [x] Confirm no overlap with the ferry, board, ticket, panels or margin label.
- [x] Do not create screenshots or recordings.
- [x] If sequencing solves the density, do not resize or remove elements.

**Done when:** the existing composition is intact and the sequence is clear at
all three sizes.

**Completed 2026-10-05:** the production build passed. Scene 03 stayed
enhanced without fallback at 1440 × 900, 1178 × 1014 and 390 × 844; the
short-mobile check at 320 × 720 also passed. Sequencing resolved the density,
so no element was resized, removed or moved. No screenshots or recordings
were created.

### 10 — Approval gate

- [x] Present Scene 03 at <http://localhost:5173/#chapter-03>.
- [x] Obtain explicit user approval.
- [x] Record the decision in `narrative-spine.md` and `CHANGELOG.md`.
- [x] Do not plan or change Scene 04 before approval.

**Done when:** the user approves Scene 03 and the controlled rollout can move
to Scene 04.

**Completed 2026-10-05:** Scene 03 was approved as built (user approval,
2026-10-05). The progressive-story implementation is complete.

## Verification discipline

For each small implementation item, inspect only Scene 03 and its mapped
files. Run only `npm run build` and inspect
<http://localhost:5173/#chapter-03>. Do not create screenshots or recordings.

## Next action

Scene 03 is complete. Define Scene 04's controlled rollout before making any
new Scene 04 changes.
