# Scene 03 — Progressive Story Implementation Plan

**Status:** approved, 10 of 10 implementation steps complete; improvement
review and implementation approved, 5 of 5 improvement steps complete
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

## Post-approval improvement review

This is a review pass, not authorization to change the scene. Complete the
checks below, present a short prioritized proposal, and wait for approval
before implementing anything (user request, 2026-10-05).

Keep the entire frozen scope above. In particular, preserve both cameras,
ferry pose and route, copy-safe regions, board and ticket artwork, panel
placement, 3D atmosphere and approved wording. Prefer timing, opacity and
state clarity over new elements or movement.

### R1 — Review narrative pacing

- [x] Inspect the opening → board → ticket/passenger → daily crossing → route
  rhythm in forward and reverse scrolling.
- [x] Identify pauses that feel rushed, empty or visually simultaneous.
- [x] Propose range adjustments only where they create a clearer beat.
- [x] Keep the existing 60svh hold and camera completely unchanged.

**Completed 2026-10-05:** live forward and reverse sampling confirmed that
all five beats remain ordered and fully reversible. The opening-to-board
handoff and the final route hold are well paced and should remain unchanged.
The middle sequence is slightly compressed: `humanCrossing` →
`dailyCrossing` and `dailyCrossing` → `routePanel` each have only a 0.02
dwell-share pause, about 9 px of scroll at the reviewed 766 px viewport.
For later approval, the low-risk candidate is to keep the 60svh hold and all
positions unchanged while increasing those two pauses to approximately 0.04.
No timing value has been changed.

### R2 — Review board and route communication

- [x] Confirm the active countdown state is immediately understandable.
- [x] Check that the board and route dot support rather than duplicate one
  another.
- [x] Consider restrained active-state emphasis using timing or opacity only.
- [x] Preserve CENTRAL, all wording, split-flap artwork and no-count-back
  behavior.

**Completed 2026-10-05:** the amber Due row advances at route shares 0.3,
0.55 and 0.8 while the green rule, marker, route-panel tint and Central
endpoint show spatial progress. The board communicates time and the route
communicates distance, so they are complementary. Existing colour, glow and
endpoint emphasis are sufficient; another active treatment would add noise.
The approved no-count-back behavior remains intentionally independent while
reverse scrolling and should not be changed.

### R3 — Review ticket and panel hierarchy

- [x] Check whether the ticket and “Facing Forward” share attention cleanly.
- [x] Check whether “A Daily Crossing” and “The Route” become distinct at the
  intended moments.
- [x] Review hover and touch discoverability without adding permanent copy.
- [x] Preserve artwork, positions, semantic order and existing interactions.

**Completed 2026-10-05:** the ticket sits apart from the lower panel row and
supports “Facing Forward” without obscuring it. The following two panels have
separate configured ranges and remain understandable. Panel hover and ticket
mouse/touch responses are decorative rewards rather than required controls;
adding a hint or pointer affordance would overstate their importance. Keep
the current artwork, positions and interactions.

### R4 — Review responsive readability

- [x] Inspect reference desktop, compact desktop, mobile and short-mobile
  compositions.
- [x] Check board text, ticket details and “Crossing since 1888” at each size.
- [x] Record any spacing or legibility issue without moving the ferry or
  changing copy-safe regions.
- [x] Do not shrink the ticket or reintroduce the desktop panels on phones.

**Completed 2026-10-05:** measured 1440 × 900, 1178 × 1014, 390 × 844 and
320 × 720 without screenshots. Board, ticket and panels remain inside the
viewport with no mutual overlaps; phones correctly omit the panels. The
mobile board tiles remain readable at 13 px and the ticket remains fully
visible at 46vw. The only legibility candidate is supporting microtype: board
head/labels are 9 px and “Crossing since 1888” is 11 px. A later approved
change could raise them to approximately 10 px and 12 px respectively
without moving or resizing the board or ticket.

### R5 — Review atmosphere synchronization

- [x] Compare wind-haze timing with the ticket and crossing beats.
- [x] Confirm lens bokeh, buoy, wake and water remain subordinate.
- [x] If needed, propose timing or opacity refinements only.
- [x] Do not add particles, trails, geometry or another visual layer.

**Completed 2026-10-05:** wind haze already rises with `humanCrossing`, so
the air begins with the ticket and passenger beat rather than competing with
the opening. Scene 03 uses only the restrained quiet lens treatment; the
dark buoy, localized wake and water remain environmental cues. No timing or
opacity refinement is justified, and no atmosphere layer should be added.

### R6 — Present recommendations

- [x] Separate worthwhile improvements from changes that would merely add
  activity.
- [x] Rank recommendations by narrative benefit and implementation risk.
- [x] State explicitly when an existing treatment should remain unchanged.
- [x] Obtain user approval before changing application code or styles.

**Review deliverable:** a concise list of recommended improvements, preserved
elements and rejected ideas. Implementation and build verification will be
planned only after the user chooses which recommendations to pursue.

**Recommendations ready 2026-10-05:**

1. **Increase mobile supporting microtype — medium benefit, low risk.** Raise
   only the mobile board head/labels from about 9 px to 10 px and the mobile
   “Crossing since 1888” line from 11 px to 12 px. Keep board tiles, ticket,
   positions and copy unchanged.
2. **Give the middle beats slightly clearer pauses — modest benefit, low
   risk.** Increase the two 0.02 dwell-share pauses around
   `dailyCrossing` to about 0.04 by adjusting configured reveal ranges only.
   Keep the 60svh hold and every camera/layout value unchanged.
3. **Keep everything else unchanged.** Board/route emphasis, ticket and panel
   interactions, wind haze, lens treatment, buoy, wake and water already
   support the story. Reject extra hints, active animation, particles,
   movement, resizing and new visual layers.

**User choice 2026-10-05:** implement recommendations 1 and 2. Preserve
everything listed in recommendation 3.

## Approved improvement implementation

### I1 — Create clearer middle pauses

- [x] Change `dailyCrossing` from `[0.42, 0.56]` to `[0.44, 0.56]`.
- [x] Change `routePanel` from `[0.58, 0.7]` to `[0.6, 0.7]`.
- [x] Keep `humanCrossing`, route progress, the 60svh hold and all camera and
  layout values unchanged.

### I2 — Increase mobile supporting microtype

- [x] Raise the mobile board head and labels from 9 px to 10 px.
- [x] Raise the mobile “Crossing since 1888” line from 11 px to 12 px.
- [x] Keep board tiles, board geometry, ticket size, placement and wording
  unchanged.

### I3 — Verify sequencing

- [x] Confirm the two 0.04 pauses remain distinct in forward scrolling.
- [x] Confirm reverse scrolling restores the exact opposite sequence.
- [x] Confirm board/route synchronization and no-count-back behavior remain
  unchanged.

### I4 — Verify responsive readability

- [x] Inspect 1440 × 900, 1178 × 1014, 390 × 844 and 320 × 720.
- [x] Confirm the larger mobile microtype fits without overlap.
- [x] Confirm the ticket and desktop panels remain unchanged.
- [x] Run `npm run build` once after the adjustment.

**Completed 2026-10-05:** both approved improvements are implemented. Live
forward and reverse checks confirmed two distinct middle pauses and unchanged
route/board behavior. At both mobile sizes the board head and labels compute
to 10 px, the 1888 line to 12 px and the unchanged tiles to 13 px. Board,
ticket and panels remained inside the viewport without overlap at all four
review sizes. The page remained enhanced, lint checks passed and the
production build passed once. No screenshots or recordings were created.

### I5 — Approval gate

- [x] Present Scene 03 at <http://localhost:5173/#chapter-03>.
- [x] Obtain user approval for the two improvements.
- [x] Record the final decision before changing Scene 04.

**Completed 2026-10-05:** the user approved the clearer middle pauses and
larger mobile supporting microtype. Scene 03 is complete.

## Verification discipline

For each small implementation item, inspect only Scene 03 and its mapped
files. Run only `npm run build` and inspect
<http://localhost:5173/#chapter-03>. Do not create screenshots or recordings.

## Next action

Scene 03 is complete. Continue with Scene 04's post-approval improvement
review when requested.
