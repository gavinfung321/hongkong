# Closed plans

These finished checklists were separate files until 2026-10-06 (user
request). They are history. A change to the site is recorded in the area
file that describes it now, and in `CHANGELOG.md`.

- [Scene 03, progressive story](#scene-03)
- [Scene 04, then and now](#scene-04)
- [Scene 05, arrival](#scene-05)
- [Scene 06, afterimage](#scene-06)
- [Scene 03, crossing](#scene-03-crossing)
- [Footer](#footer)
- [Accent colour](#accent)
- [Hero wordmark](#hero-wordmark)
- [Organization](#organization)

<a id="scene-03"></a>

## Scene 03 — Progressive Story Implementation Plan

**Status:** approved, 10 of 10 implementation steps complete; improvement
review and implementation approved, 5 of 5 improvement steps complete
**Created:** user request, 2026-10-05  
**Review:** <http://localhost:5173/#chapter-03>

### Goal

Turn Scene 03's existing 60svh hold into a clear ferry-crossing sequence
using the current label, title, standfirst, departure board, ticket, three
desktop panels and route. The result should feel like a departure becoming a
daily crossing, not a collection of elements arriving at once.

### Frozen scope

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

### Current state

- Label, title and standfirst establish the departure before the board.
- The ticket and “Facing Forward” form the human-crossing beat, followed by
  “A Daily Crossing” and then “The Route”.
- The route dot waits for its panel, then crosses during the dwell.
- The board keeps CENTRAL fixed and advances through 3 MIN, 2 MIN, 1 MIN and
  ARRIVING without counting backward inside the scene.
- Phones omit the three-panel index and retain the title, standfirst,
  “Crossing since 1888”, departure board and ticket.
- Reduced motion shows still panels, board and ticket with short fades.

### Files in scope

- `src/story/scene03/config.js` — all editable Scene 03 ranges and values.
- `src/ui/copyLayer.js` — reveal orchestration and route/board synchronization.
- `src/ui/departureBoard.js` — only if existing board state handling cannot
  express the approved sequence.
- `src/ui/ticketCard.js` — only if entrance state handling needs adjustment.
- `src/styles.css` — Scene 03-scoped reveal states and responsive treatment.
- `index.html` — read-only unless semantic order must be corrected.
- This file, `narrative-spine.md` and `CHANGELOG.md` — tracking.

### Implementation checklist

#### 1 — Author the reveal ranges

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

#### 2 — Establish the departure

- [x] Reveal label, title and standfirst first.
- [x] Bring in the existing departure board second.
- [x] Preserve split-flap behavior and current wording.
- [x] Keep the board clear of the ferry, moon and IFC at existing breakpoints.

**Done when:** the scene first reads as a departure before any panel or ticket
asks for attention.

**Completed 2026-10-05:** the opening arrives first, the board follows over
dwell share 0.08–0.2, and the still-grouped ticket/panels wait until the later
human-crossing range. Existing desktop and mobile positions are unchanged.

#### 3 — Introduce the human crossing

- [x] Bring in the ticket and desktop “Facing Forward” panel together.
- [x] Keep both elements in their current positions.
- [x] Preserve the ticket's rigid flip, sway, hover and touch behavior.
- [x] Keep the reversible-seat sentence unchanged.

**Done when:** the physical ticket and seat detail form one clear second beat.

**Completed 2026-10-05:** the ticket and first panel share the human-crossing
range. The daily-crossing and route panels remain grouped in the following
range pending step 4.

#### 4 — Build the daily journey

- [x] Reveal “A Daily Crossing” after “Facing Forward”.
- [x] Reveal “The Route” last.
- [x] Start route-dot progress only once the route panel is available.
- [x] Keep all panel motion restrained and reversible.

**Done when:** the desktop story reads departure → passenger detail → daily
commute → route.

**Completed 2026-10-05:** the daily-crossing panel now has its own range, the
route panel follows it, and the route dot starts after that final panel has
fully arrived. Reversing the scroll reverses the panel and route sequence.

#### 5 — Synchronize board and route

- [x] Keep CENTRAL fixed.
- [x] Advance due states at meaningful route thresholds.
- [x] Preserve the current no-count-back behavior while the visitor remains
  in Scene 03.
- [x] Blank and reset the board after leaving Scene 03.

**Done when:** board status never contradicts the route dot.

**Completed 2026-10-05:** the existing route thresholds continue to advance
the due row, but reverse scrolling no longer makes the physical board count
backward. Its existing leave-and-return reset remains intact.

#### 6 — Mobile sequence

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

#### 7 — Atmosphere timing

- [x] Bring the existing wind haze in with the crossing sequence.
- [x] Keep lens bokeh, buoy, ferry, wake and all 3D atmosphere unchanged.
- [x] Do not add particles, trails, route geometry or new 3D layers.

**Done when:** existing atmosphere supports the story without becoming a new
subject.

**Completed 2026-10-05:** the existing wind haze now begins with the ticket
and human-crossing beat instead of the opening label. No atmosphere artwork,
3D layer or composition value changed.

#### 8 — Reduced motion and reading order

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

#### 9 — Final review

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

#### 10 — Approval gate

- [x] Present Scene 03 at <http://localhost:5173/#chapter-03>.
- [x] Obtain explicit user approval.
- [x] Record the decision in `narrative-spine.md` and `CHANGELOG.md`.
- [x] Do not plan or change Scene 04 before approval.

**Done when:** the user approves Scene 03 and the controlled rollout can move
to Scene 04.

**Completed 2026-10-05:** Scene 03 was approved as built (user approval,
2026-10-05). The progressive-story implementation is complete.

### Post-approval improvement review

This is a review pass, not authorization to change the scene. Complete the
checks below, present a short prioritized proposal, and wait for approval
before implementing anything (user request, 2026-10-05).

Keep the entire frozen scope above. In particular, preserve both cameras,
ferry pose and route, copy-safe regions, board and ticket artwork, panel
placement, 3D atmosphere and approved wording. Prefer timing, opacity and
state clarity over new elements or movement.

#### R1 — Review narrative pacing

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

#### R2 — Review board and route communication

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

#### R3 — Review ticket and panel hierarchy

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

#### R4 — Review responsive readability

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

#### R5 — Review atmosphere synchronization

- [x] Compare wind-haze timing with the ticket and crossing beats.
- [x] Confirm lens bokeh, buoy, wake and water remain subordinate.
- [x] If needed, propose timing or opacity refinements only.
- [x] Do not add particles, trails, geometry or another visual layer.

**Completed 2026-10-05:** wind haze already rises with `humanCrossing`, so
the air begins with the ticket and passenger beat rather than competing with
the opening. Scene 03 uses only the restrained quiet lens treatment; the
dark buoy, localized wake and water remain environmental cues. No timing or
opacity refinement is justified, and no atmosphere layer should be added.

#### R6 — Present recommendations

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

### Approved improvement implementation

#### I1 — Create clearer middle pauses

- [x] Change `dailyCrossing` from `[0.42, 0.56]` to `[0.44, 0.56]`.
- [x] Change `routePanel` from `[0.58, 0.7]` to `[0.6, 0.7]`.
- [x] Keep `humanCrossing`, route progress, the 60svh hold and all camera and
  layout values unchanged.

#### I2 — Increase mobile supporting microtype

- [x] Raise the mobile board head and labels from 9 px to 10 px.
- [x] Raise the mobile “Crossing since 1888” line from 11 px to 12 px.
- [x] Keep board tiles, board geometry, ticket size, placement and wording
  unchanged.

#### I3 — Verify sequencing

- [x] Confirm the two 0.04 pauses remain distinct in forward scrolling.
- [x] Confirm reverse scrolling restores the exact opposite sequence.
- [x] Confirm board/route synchronization and no-count-back behavior remain
  unchanged.

#### I4 — Verify responsive readability

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

#### I5 — Approval gate

- [x] Present Scene 03 at <http://localhost:5173/#chapter-03>.
- [x] Obtain user approval for the two improvements.
- [x] Record the final decision before changing Scene 04.

**Completed 2026-10-05:** the user approved the clearer middle pauses and
larger mobile supporting microtype. Scene 03 is complete.

### Verification discipline

For each small implementation item, inspect only Scene 03 and its mapped
files. Run only `npm run build` and inspect
<http://localhost:5173/#chapter-03>. Do not create screenshots or recordings.

### Next action

Scene 03 is complete. Continue with Scene 04's post-approval improvement
review when requested.

<a id="scene-04"></a>

## Scene 04 — Progressive Story Implementation Plan

**Status:** approved, 10 of 10 implementation steps complete; responsive
quote polish complete; improvement review complete; approved improvement
implementation approved, 3 of 3 steps complete
**Created:** user request, 2026-10-05  
**Review:** <http://localhost:5173/#chapter-04>

### Goal

Turn Scene 04's existing 60svh hold into a clear then-and-now story using
the current label, title, two photographs, captions, quote and statement.
The sequence should move from the historical working junk to the present-day
harbour symbol without competing with the red sails.

### Frozen scope

Do not change:

- desktop or mobile cameras;
- junk pose, scale, route, sail treatment or timing;
- ferry transition, water, wake, skyline, clouds, mist, lens effects, moon
  or any 3D model;
- copy-safe regions, desktop card column or statement placement;
- photograph crops, grading, captions or cloth-card artwork;
- approved wording, quote or semantic order;
- Scene 03, Scene 05 or any other scene.

Do not add another illustration, particle system or foreground object. If
sequencing does not resolve the density, stop for review before resizing or
removing an existing element.

### Current state

- The label and title establish Red Sails first.
- The working junk appears second, followed by the Dukling, quote and final
  statement intro.
- The two cards compare a working junk before 1945 with the Dukling in 2016.
- Desktop uses a staggered vertical card column and shows the quote.
- Mobile keeps the cards side by side and omits the quote.
- Fine-pointer desktops render the existing cloth simulation; touch, reduced
  motion and unsupported browsers keep the still photographs.
- The existing memory veil and wind haze support the scene while the 3D junk
  remains the visual lead.

### Files in scope

- `src/story/scene04/config.js` — create for Scene 04's current chapter values
  and new reveal ranges.
- `src/data/chapters.js` — replace only the current chapter `04` values with
  the Scene 04 config import.
- `src/ui/copyLayer.js` — reveal orchestration and existing veil/wind timing.
- `src/ui/paperCard.js` — only if separate card entrances require a small
  existing-state adjustment.
- `src/styles.css` — only Scene 04's `.chapter__statement`,
  `.chapter__photos`, `.chapter__photo` and responsive reveal states.
- `index.html` — Scene 04 section, read-only unless accessibility state must
  be corrected.
- This file, `narrative-spine.md`, `README.md` and `CHANGELOG.md` — tracking.

### Implementation checklist

#### 1 — Give Scene 04 one configuration

- [x] Create `src/story/scene04/config.js`.
- [x] Move only chapter `04`'s current camera, copy, dwell, visibility, fog,
  vessel and probe values into it without changing any value.
- [x] Add named Scene 04 reveal ranges there.
- [x] Keep all new scroll-linked Scene 04 timing out of shared literals.

**Done when:** Scene 04 has one readable configuration and the extraction
does not alter its appearance, camera or behavior.

**Completed 2026-10-05:** extracted every existing Scene 04 chapter value
unchanged and added named opening, historical, contemporary, quote and
statement ranges. `chapters.js` now assembles the chapter from that config.

#### 2 — Establish the red-sails opening

- [x] Reveal the existing label first.
- [x] Bring in the title and statement rule as the opening composition.
- [x] Hold the photographs, quote and statement intro for later beats.
- [x] Keep the junk and camera still throughout the dwell.

**Done when:** the scene first reads as “Red Sails” before the archival
comparison asks for attention.

**Completed 2026-10-05:** the existing label, title, rule and lower wash form
the opening while every later story element waits. Camera and junk values are
unchanged.

#### 3 — Introduce the historical junk

- [x] Reveal the “Then · Before 1945” photograph and caption second.
- [x] Start its existing cloth motion only when the card becomes visible.
- [x] Preserve its crop, grade, size, angle and position.
- [x] Keep the entrance reversible and restrained.

**Done when:** the first card clearly establishes the working-junk history.

**Completed 2026-10-05:** the historical card has its own reversible range,
and its existing cloth simulation remains paused while the card is hidden.
Artwork and placement are unchanged.

#### 4 — Complete the then-and-now comparison

- [x] Reveal the “Now · Dukling, built 1955” photograph and caption after the
  historical card.
- [x] Start the second card's existing cloth motion with its own entrance.
- [x] Preserve the staggered desktop relationship and side-by-side mobile
  relationship.
- [x] Do not change either photograph or caption.

**Done when:** scrolling creates an understandable Then → Now comparison.

**Completed 2026-10-05:** the contemporary card follows in a separate
reversible range and activates its existing cloth only once visible. Desktop
and mobile card relationships remain unchanged.

#### 5 — Resolve the story

- [x] Reveal the existing quote only after both desktop cards are available.
- [x] Reveal the statement intro as the final narrative beat.
- [x] Keep the approved wording and bottom statement placement unchanged.
- [x] Keep the quote omitted on mobile.

**Done when:** the final words explain why the junk remains a harbour symbol
instead of repeating what the photographs already show.

**Completed 2026-10-05:** the quote follows the completed card comparison,
then the statement intro closes the sequence. Wording, placement and mobile
quote omission are unchanged.

#### 6 — Synchronize cards and atmosphere

- [x] Bring the existing wind haze in with the historical card.
- [x] Let it reach its current full strength with the contemporary card.
- [x] Preserve the existing memory-veil strength and opening on the sails.
- [x] Do not alter clouds, lens bokeh, water, wake or any 3D atmosphere.

**Done when:** the existing air supports the comparison without becoming a
new visual subject.

**Completed 2026-10-05:** wind haze begins at 45% of its authored level with
the historical card and reaches full level with the contemporary card. The
veil and all visual-effect assets remain unchanged.

#### 7 — Preserve the mobile composition

- [x] Sequence label and title → historical card → contemporary card →
  statement intro.
- [x] Keep the two cards side by side at their current size.
- [x] Keep the quote omitted and the vertical margin label clear.
- [x] Keep the main sail, captions and bottom statement unobstructed.
- [x] Preserve the current short-landscape behavior.

**Done when:** mobile communicates the complete comparison without crowding
the sail or shrinking the cards.

**Completed 2026-10-05:** verified at 390 × 844 and a short landscape
viewport without screenshots. Both cards retain their side-by-side sizing,
the quote stays omitted, the statement remains in view and short landscape
continues to omit the cards.

#### 8 — Reduced motion, loading and reading order

- [x] Use short fades and still photographs in stepped mode.
- [x] Keep cloth simulation off for touch, reduced motion and WebGL2 fallback.
- [x] Preserve label → title → intro → photographs → captions → quote in the
  semantic document order.
- [x] Ensure delayed visual entrances do not hide meaningful fallback content.
- [x] Confirm reverse navigation does not leave hidden content interactive.

**Done when:** the complete story remains readable without continuous motion
and before enhanced card rendering is available.

**Completed 2026-10-05:** reduced-motion emulation confirmed stepped
midpoint reveals, still photographs and no cloth canvases. The existing
semantic order is unchanged, non-enhanced content remains visible, and
reverse scrolling restores the earlier states without interactive remnants.

#### 9 — Final review

- [x] Run `npm run build` once after the final adjustment.
- [x] Inspect Scene 04 at 1440 × 900, 1178 × 1014, 390 × 844 and a short
  mobile viewport.
- [x] Confirm the page remains enhanced and does not enter fallback.
- [x] Confirm no overlap with the junk, captions, quote, statement or margin
  label.
- [x] Do not create screenshots or recordings.
- [x] If sequencing resolves the density, do not resize or remove elements.

**Done when:** the existing composition is intact and the progressive
then-and-now story is clear at all review sizes.

**Completed 2026-10-05:** the production build passed. Scene 04 stayed
enhanced without fallback at 1440 × 900, 1178 × 1014, 390 × 844 and short
landscape sizes. Every existing element remained in its authored position and
size; no screenshots or recordings were created.

#### 10 — Approval gate

- [x] Present Scene 04 at <http://localhost:5173/#chapter-04>.
- [x] Obtain explicit user approval.
- [x] Record the decision in `narrative-spine.md` and `CHANGELOG.md`.
- [x] Do not plan or change Scene 05 before approval.

**Done when:** the user approves Scene 04 and the controlled rollout can move
to Scene 05.

**Completed 2026-10-05:** Scene 04 was approved as built (user approval,
2026-10-05). The progressive-story implementation is complete.

### Post-approval responsive polish

- [x] Make the desktop quote's type size, line height and surrounding spacing
  respond to both viewport width and height (user request, 2026-10-05).
- [x] Keep the quote clear of the statement hairline on short desktop windows.
- [x] Preserve card, statement, copy and 3D placement.
- [x] Keep the quote omitted on mobile.

**Completed 2026-10-05:** the quote now scales fluidly from 17 px to 22 px
with tighter responsive spacing. It clears the statement rule by 36 px at
870 × 786 and remains clear at 1178 × 1014 and 1440 × 900. Mobile remains
unchanged. The production build passed; no screenshots were created.

### Post-approval improvement review

This is a review pass, not authorization to change the scene. Complete the
checks below, present a short prioritized proposal, and wait for approval
before implementing anything (user request, 2026-10-05).

Keep the entire frozen scope above and the approved responsive quote fix.
Preserve both cameras, junk pose and sails, card placement and artwork,
statement placement, copy, 3D atmosphere and mobile composition. Prefer
timing, opacity and state clarity over new elements or movement.

#### R1 — Review narrative pacing

- [x] Inspect the opening → historical junk → contemporary Dukling → quote →
  statement rhythm in forward and reverse scrolling.
- [x] Identify pauses that feel rushed, empty or visually simultaneous.
- [x] Propose range adjustments only where they clarify the Then → Now story.
- [x] Keep the existing 60svh hold, camera and junk completely unchanged.

**Completed 2026-10-05:** live forward and reverse sampling confirmed a clear
opening → historical → contemporary → quote → statement sequence. Every
handoff already has a 0.04 dwell-share pause, the final statement retains a
readable hold, and the sequence reverses cleanly. No range adjustment is
justified.

#### R2 — Review comparison hierarchy

- [x] Confirm the historical card clearly leads before the contemporary card.
- [x] Check whether the active card needs restrained emphasis while both
  cards remain visible.
- [x] Consider timing or opacity only; avoid sliding, bouncing or resizing.
- [x] Preserve both crops, grades, captions, angles and positions.

**Completed 2026-10-05:** the historical card reaches full visibility before
the contemporary card begins, then both remain equal for direct comparison.
Dimming either completed card would weaken the Then → Now relationship.
Keep both cards' timing, opacity, artwork and placement unchanged.

#### R3 — Review quote and resolution

- [x] Check the handoff from the completed comparison to the quote and final
  statement.
- [x] Confirm the quote remains clear of the responsive statement rule at all
  desktop review sizes.
- [x] Check whether the final statement has enough reading time.
- [x] Preserve wording, typography intent, placement and mobile quote
  omission.

**Completed 2026-10-05:** the quote completes before the statement begins,
and the statement remains fully available before the scene exits. Quote
clearance measured 35 px at 1440 × 900 and 160.5 px at 1178 × 1014. The
existing responsive quote fix and all resolution timing should remain.

#### R4 — Review responsive readability

- [x] Inspect reference desktop, compact desktop, mobile and short-landscape
  compositions.
- [x] Check captions, card relationship and final statement at each size.
- [x] Record any spacing or legibility issue without changing copy-safe
  regions or card placement.
- [x] Preserve side-by-side mobile cards and the existing short-landscape
  omission.

**Completed 2026-10-05:** cards, captions, quote and statement remained inside
the viewport without overlap at 1440 × 900, 1178 × 1014 and 390 × 844; short
landscape correctly omitted the cards. The sole readability candidate is the
9 px mobile caption type. Raising it to 10 px should improve “Then” and “Now”
legibility without moving or resizing either card.

#### R5 — Review cloth and atmosphere synchronization

- [x] Check whether each cloth simulation begins naturally with its card.
- [x] Compare wind haze and memory veil timing with the Then → Now sequence.
- [x] Confirm clouds, bokeh, water and wake remain subordinate to the junk.
- [x] If needed, propose timing or opacity refinements only; add no new layer.

**Completed 2026-10-05:** each cloth simulation starts only when its own card
becomes visible. Wind haze rises to 45% with the historical card and reaches
full strength with the contemporary card. The quiet lens treatment, wake,
water and veil remain subordinate. No effect timing or opacity change is
needed.

#### R6 — Present recommendations

- [x] Separate worthwhile improvements from changes that would merely add
  activity.
- [x] Rank recommendations by narrative benefit and implementation risk.
- [x] State explicitly when an existing treatment should remain unchanged.
- [x] Obtain user approval before changing application code or styles.

**Review deliverable:** a concise list of recommended improvements, preserved
elements and rejected ideas. Implementation and build verification will be
planned only after the user chooses which recommendations to pursue.

**Recommendations and user authorization 2026-10-05:**

1. **Increase mobile caption type from 9 px to 10 px — medium readability
   benefit, low risk.** Keep caption wording, letter spacing, cards and
   placement unchanged.
2. **Keep everything else unchanged.** Pacing, card hierarchy,
   quote/statement resolution, cloth activation, wind haze, veil, lens
   treatment, wake and water already support the story. Reject extra active
   states, movement, opacity changes and new visual layers.

The user's instruction to review and execute authorizes recommendation 1.

### Approved improvement implementation

#### I1 — Increase mobile caption readability

- [x] Raise only Scene 04's mobile card caption type from 9 px to 10 px.
- [x] Keep caption wording, spacing, cards and placement unchanged.

#### I2 — Verify the approved change

- [x] Confirm both captions remain readable and contained at 390 × 844.
- [x] Confirm short landscape still omits the cards.
- [x] Recheck 1440 × 900 and 1178 × 1014 without changing desktop.
- [x] Run `npm run build` once after the adjustment.

**Completed 2026-10-05:** mobile captions now compute to 10 px and remain
contained at 390 × 844; the longer Dukling caption wraps naturally to two
lines. Short landscape still omits the cards. Desktop captions remain 11 px,
with the existing quote clearance unchanged at 35 px for 1440 × 900 and
160.5 px for 1178 × 1014. The page remained enhanced, lint checks passed and
the production build passed once. No screenshots or recordings were created.

#### I3 — Approval gate

- [x] Present Scene 04 at <http://localhost:5173/#chapter-04>.
- [x] Obtain final user approval for the mobile caption improvement.
- [x] Record the final decision before continuing to another scene.

**Completed 2026-10-05:** the user approved and adopted the review
recommendations. The 10 px mobile captions are final; all reviewed pacing,
hierarchy, quote, cloth and atmosphere treatments remain unchanged as
recommended.

### Verification discipline

For each implementation item, inspect only Scene 04 and its mapped files. Run
only `npm run build` and inspect <http://localhost:5173/#chapter-04>. Do not
create screenshots or recordings.

### Next action

Scene 04's post-approval improvement pass is complete.

<a id="scene-05"></a>

## Scene 05 — Progressive Arrival Implementation Plan

**Status:** approved, 10 of 10 steps complete; callout visual review implemented
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/#chapter-05>

### Goal

Turn Scene 05 into a clear arrival at Central using the existing label,
“City of Light” title, verified Two IFC sentence, title sweep, corner branch
and office-light interaction. The words should establish IFC before the
visitor is invited to explore the city lights.

### Frozen scope

Do not change:

- desktop or mobile cameras;
- IFC, wheel, skyline, piers, fairground, models or reflections;
- copy-safe regions, wording, typography or element placement;
- corner-branch geometry, placement, artwork or parallax response;
- touch-light radius, brightness, fade, office density or gesture behavior;
- lens bokeh, cloud band, skyline wave, harbour boat, searchlights or wheel
  hover behavior;
- Scene 04, Scene 06 or any other scene.

Do not add another illustration, landmark label, statistic graphic, particle
system or foreground object. Scene 05 remains a restrained arrival, not a
second finale.

### Current state

- The label establishes the arrival before the title appears.
- A warm band crosses the title with the scroll and reverses with it.
- The verified Two IFC sentence and desktop corner branch follow together.
- Pointer movement or a touch lights a small office patch only after the
  sentence is readable; reduced motion disables it.
- “Light the skyline” stays beside Two IFC, and “Hover me” stays beside the
  wheel. Each arrow dims only while the pointer is on its own target and
  returns as soon as the pointer leaves. A mobile tap dims only while the
  finger is down.
- On mobile, tapping the wheel applies its existing 16× boost and easing for
  2.5 seconds without also painting skyline lights.
- Lens bokeh, the lit cloud band, skyline wave, harbour boat, autonomous
  searchlights and wheel hover already animate independently.
- A 45svh chapter-specific dwell holds the existing camera pose.

### Files in scope

- `src/story/scene05/config.js` — create for Scene 05's current chapter values,
  short dwell and reveal ranges.
- `src/data/chapters.js` — replace only the current chapter `05` values with
  the Scene 05 config import.
- `src/ui/copyLayer.js` — opening, body, branch and touch activation levels.
- `src/ui/cityLights.js` — only if the existing one-shot title sweep cannot
  follow the approved title entrance.
- `src/ui/cityTouch.js` — only if delayed activation requires a small
  existing-state adjustment.
- `src/styles.css` — only Scene 05's `.chapter__title--sweep` and
  `.chapter__lights` reveal states.
- `src/scene/createCornerBranch.js` and `src/main.js` — only if the existing
  `words` level cannot express the approved branch entrance.
- `index.html` — Scene 05 section, read-only unless accessibility state must
  be corrected.
- This file, `narrative-spine.md`, `README.md` and `CHANGELOG.md` — tracking.

### Implementation checklist

#### 1 — Give Scene 05 one configuration

- [x] Create `src/story/scene05/config.js`.
- [x] Move only chapter `05`'s current camera, copy, visibility, fog, vessel
  and probe values into it without changing any value.
- [x] Add a short 45svh Scene 05 dwell that holds the existing camera pose.
- [x] Add named opening, body, branch and interaction ranges.
- [x] Keep all new Scene 05 timing in that configuration.

**Done when:** Scene 05 has one readable configuration and gains reading time
without a new camera path or altered composition.

**Completed 2026-10-05:** extracted every existing Scene 05 chapter value
unchanged, added the 45svh hold and named label, title, body, branch and
interaction ranges. `chapters.js` now assembles the chapter from that config.

#### 2 — Establish the Central arrival

- [x] Reveal the existing label first.
- [x] Bring in “City of Light” second.
- [x] Run the warm title sweep once the title is visible.
- [x] Hold the body sentence, branch and touch interaction for later beats.

**Done when:** the opening reads as an arrival at the city before explanation
or interaction competes for attention.

**Completed 2026-10-05:** the label enters over chapter progress 0.34–0.42,
the title follows over 0.42–0.5, and the title sweep occupies the beginning
of the dwell. All later material waits.

#### 3 — Deliver the Two IFC fact

- [x] Reveal the existing verified sentence after the title.
- [x] Keep its wording, width, type and position unchanged.
- [x] Keep the entrance restrained and fully reversible.
- [x] Leave the title visible while the sentence arrives.

**Done when:** the visitor understands why Two IFC leads the composition.

**Completed 2026-10-05:** the sentence now fades in over dwell share
0.14–0.36 while the title remains visible. Reverse scrolling restores the
earlier title-only state.

#### 4 — Frame the postcard

- [x] Bring the existing corner branch in with the body sentence on desktop.
- [x] Keep its geometry, resting position, scale, slide and parallax unchanged.
- [x] Keep the branch absent on mobile.
- [x] Reverse the branch cleanly when scrolling back.

**Done when:** the branch frames the completed arrival instead of preceding
the story.

**Completed 2026-10-05:** the branch now follows the sentence through the
existing `words` level, beginning after the body is already readable. Its
model, placement, slide, parallax and mobile gate are unchanged.

#### 5 — Invite light interaction

- [x] Activate the existing office touch light only after the sentence is
  readable.
- [x] Preserve its current mouse and touch gestures.
- [x] Preserve its 50px pointer radius, 80px tap radius, brightness and fade.
- [x] Clear pending touch state when reversing before the interaction range.

**Done when:** interaction feels like a final invitation to explore, not an
effect competing with the title.

**Completed 2026-10-05:** touch lighting now activates over dwell share
0.6–0.8. The existing zero-level path clears pending taps and painted state
when reversing; all authored interaction values remain unchanged.

#### 6 — Preserve the city choreography

- [x] Keep lens bokeh at its existing Scene 05 density.
- [x] Keep the cloud band, skyline wave and harbour boat timings unchanged.
- [x] Keep searchlights autonomous and the wheel hover behavior unchanged.
- [x] Do not synchronize every city effect to the copy.
- [x] Add no new light, particle or 3D layer.

**Done when:** the city remains alive behind the progressive copy without a
new synchronized “show”.

**Completed 2026-10-05:** no city-effect engine or visibility value changed.
The new ranges control only copy, the existing branch level and the existing
touch-light level.

#### 7 — Mobile sequence

- [x] Sequence label → title → verified sentence → touch interaction.
- [x] Keep the corner branch absent.
- [x] Keep IFC's crown, the wheel, copy and vertical margin label clear.
- [x] Preserve current mobile copy width and type size.
- [x] Verify pointer-independent tap behavior without enlarging the light.

**Done when:** mobile communicates the same arrival without crowding IFC or
turning the interaction into a dominant glow.

**Completed 2026-10-05:** verified the unchanged copy bounds at 390 × 844 and
320 × 720 without screenshots. The branch remains gated off, and the existing
touch path and 80px tap radius are unchanged.

#### 8 — Reduced motion and reading order

- [x] Use short stepped fades for label, title and sentence.
- [x] Show the title without the animated sweep.
- [x] Keep office touch lighting, wheel acceleration and branch motion still
  under reduced motion.
- [x] Preserve label → title → sentence semantic order.
- [x] Ensure reverse navigation leaves no hidden content interactive.

**Done when:** the complete arrival remains understandable as a composed
still frame.

**Completed 2026-10-05:** reduced-motion emulation confirmed a static title,
midpoint stepped sentence reveal, disabled touch level and unchanged semantic
order. Non-enhanced content remains visible, and the existing stepped scene
keeps the branch and wheel still.

### Pre-review interaction polish

- [x] Replace the one-shot title animation with a scroll-linked, reversible
  sweep (user request, 2026-10-05).
- [x] Add a restrained “Trace the skyline to light the city” hint after the
  sentence; hide it after the first active mouse movement or tap.
- [x] Review branch, bokeh and copy timing together; delay the branch until
  the sentence is partly established and keep bokeh unchanged.
- [x] Keep the hint out of fallback and reduced-motion presentations.

**Completed 2026-10-05:** the sweep now tracks dwell share 0.02–0.2 and
reverses cleanly. The hint appears over 0.5–0.64, immediately before touch
lighting becomes available, and dismisses after the first active pointer move
or tap. The branch now enters over 0.26–0.46 instead of sharing the sentence's
0.14–0.36 range. Existing bokeh density and timing remain unchanged because
they did not compete with the copy. Desktop, mobile and reduced motion were
verified without screenshots; the production build passed.

### Interaction-prompt follow-up plan

The current disappearance is intentional for a one-time page-session hint,
but it leaves no instruction when the visitor returns to Scene 05. Treat the
prompt as a per-visit sequence instead (user request, 2026-10-05).

#### P1 — Reset the skyline prompt per visit

- [x] Restore “Trace the skyline to light the city” after Scene 05 is fully
  left and the interaction level returns to zero.
- [x] Do not reset while the visitor is still inside Scene 05 or merely
  reverses within its interaction range.
- [x] Preserve the existing hint reveal range and city-light gesture.

#### P2 — Add a second desktop prompt

- [x] After the skyline light is discovered, replace the first prompt with:
  “Join the wheel ride — hover to pick up speed.”
- [x] Keep this as the same restrained prompt line rather than adding another
  permanent copy block.
- [x] Show the wheel prompt only on fine-pointer desktop, because the current
  wheel acceleration is hover-only.
- [x] Hide the wheel prompt after the visitor first hovers the wheel.

#### P3 — Preserve wheel behavior

- [x] Detect the existing wheel-hover state only to advance the prompt.
- [x] Do not change the wheel's normal speed, approximately 16× hover boost,
  easing, hit area, model or reduced-motion behavior.
- [x] Do not add click, tap, drag, sound or another wheel animation.

#### P4 — Preserve mobile and reduced motion

- [x] On mobile, restore only the skyline prompt on each new Scene 05 visit.
- [x] Do not show the wheel prompt on touch devices until a wheel touch
  interaction actually exists.
- [x] Keep both prompts hidden in reduced motion and fallback.

#### P5 — Verify before final review

- [x] Verify first visit, skyline discovery, wheel discovery, exit and
  re-entry on desktop.
- [x] Verify the skyline prompt resets on mobile without introducing a
  misleading wheel instruction.
- [x] Confirm no copy, IFC, wheel, branch or pager overlap at the existing
  review sizes.
- [x] Run `npm run build` once after implementation and create no screenshots
  or recordings.

**Implementation boundary:** this follow-up may change only the prompt copy
and its discovery/reset state. It must not alter the authored city-light or
wheel interactions, timing, geometry or visual strength.

**Completed 2026-10-05:** the skyline prompt now resets only after the Scene
05 copy fully leaves. On fine-pointer desktop, skyline discovery changes the
same line to “Join the wheel ride — hover to pick up speed”; the live wheel
hit area dismisses it on first hover. Mobile retains only the skyline prompt,
and reduced motion keeps the prompt hidden. First visit, both discoveries,
exit/re-entry, 1440 × 900, 1178 × 1014, 390 × 844 and 320 × 720 passed
without prompt overlap or fallback. Existing city-light and wheel behavior
remain unchanged. Lints and the single production build passed; no
screenshots or recordings were created.

### Target-callout redesign exploration

The current text prompts can disappear too quickly: any active desktop mouse
movement dismisses the skyline instruction, and the wheel instruction
dismisses as soon as the wheel hit area is entered. Explore a shorter,
targeted visual language before changing the implementation (user request,
2026-10-05).

#### Current interaction facts

- [x] Desktop skyline lighting responds to mouse movement after its reveal
  range becomes active.
- [x] Mobile skyline lighting responds to a screen tap and fades normally.
- [x] Desktop wheel acceleration responds to hover.
- [x] Mobile wheel acceleration does **not** respond to touch; the wheel has
  no tap interaction today.
- [x] Reduced motion disables both interactive motion treatments.

#### Recommended callout model

- [x] Replace the long shared prompt line with one small target callout at a
  time.
- [x] Point the first callout toward the skyline and retain it until the
  skyline interaction actually occurs, rather than dismissing it on any
  pointer movement.
- [x] After skyline discovery, reveal a second callout beside the wheel.
- [x] Keep each arrow and label restrained, fixed during the camera hold and
  reversible on scene exit.
- [x] Store responsive callout positions in `src/story/scene05/config.js`.
- [x] Use an original CSS/SVG arrow; add no image asset or 3D object.

#### Short-copy recommendation

- Desktop skyline: **“Light the skyline”**
- Desktop wheel: **“Hover me”**
- Mobile skyline: **“Tap the lights”**
- Mobile wheel, only if a tap interaction is approved: **“Tap the wheel”**

“Touch me” is not recommended for the current build: it is inaccurate for a
desktop hover and misleading on mobile while the wheel has no touch response.

#### Mobile wheel decision

- [ ] **Option A — preserve current behavior:** show only “Tap the lights” on
  mobile and omit the wheel callout.
- [x] **Option B — add touch parity:** tapping the wheel gives it the existing
  speed boost briefly, then eases back; show “Tap the wheel.”
- [x] If Option B is chosen, preserve the authored boost amount, normal speed,
  wheel model and reduced-motion stillness.
- [x] Add no drag, repeated tapping requirement, sound or new wheel animation.

**Recommendation:** choose Option B only if wheel interaction on mobile is a
real product goal. Otherwise choose Option A and avoid advertising an
unavailable action. In either option, use sequential callouts so the skyline
and wheel never compete on screen.

#### Decision gate

- [x] Choose Option A or Option B.
- [x] Approve or revise the four short labels above.
- [x] Do not replace the current prompts or add arrows until those choices
  are explicit.
- [x] After implementation, verify desktop, mobile, re-entry, reduced motion
  and the existing review sizes without screenshots.

**Completed 2026-10-05:** Option B now uses the wheel's existing projected
ellipse, 16× acceleration and easing for a non-stacking 2.5-second boost. The
four approved labels appear sequentially beside one responsive original arrow.
Misses do not dismiss either callout, and wheel taps do not paint skyline
lights.

### Mobile wheel-tap implementation plan

The wheel currently receives only the fine-pointer position used by its
desktop hover hit test. Touch events go to the city-light painting map, so
the wheel has no touch target or boost state. Add touch parity without
creating another wheel animation (user request, 2026-10-05).

#### W1 — Reuse the existing wheel hit area

- [x] Listen only for non-mouse pointer-down events while Scene 05 is the
  active continuous-motion chapter.
- [x] Convert the tap position to normalized screen coordinates and reuse the
  existing projected wheel ellipse hit test.
- [x] Ignore taps outside the wheel and every tap in reduced motion.
- [x] Ensure a confirmed wheel tap is not also painted as a skyline-light
  tap.

#### W2 — Apply the existing acceleration

- [x] Add a Scene 05 configuration value of 2.5 seconds for the mobile boost.
- [x] On a valid tap, drive the existing `wheelBoost` target to its authored
  16× value; do not add another rotation path or speed constant.
- [x] Restart, but never stack, the 2.5-second duration on another valid tap.
- [x] Ease back using the existing wheel-hover easing when the duration ends.

At the current boosted revolution time of roughly 15 seconds, 2.5 seconds
produces about one-sixth of a turn before easing. This should read clearly
without becoming a fairground spin.

#### W3 — Connect the callout lifecycle

- [x] Show “Tap the wheel” only after the mobile skyline interaction has been
  discovered.
- [x] Dismiss the wheel callout only after a tap lands inside the live wheel
  hit area.
- [x] Reset the tap timer and sequential callouts after fully leaving Scene
  05.
- [x] Keep desktop “Hover me” tied to the unchanged hover behavior.

#### W4 — Preserve accessibility and composition

- [x] Add no drag, sound, vibration or repeated-tap requirement.
- [x] Keep reduced motion still and omit both interactive callouts there.
- [x] Do not change wheel geometry, placement, normal speed, boost amount,
  lighting, fairground or camera.
- [x] Keep all callout coordinates responsive and editable in
  `src/story/scene05/config.js`.

#### W5 — Verify before final review

- [x] Test wheel hits near the centre and rim plus misses immediately outside
  the ellipse at 390 × 844 and 320 × 720.
- [x] Confirm the boost lasts once, restarts without stacking and eases back.
- [x] Confirm wheel taps do not paint skyline lights and skyline taps do not
  accelerate the wheel.
- [x] Recheck desktop hover, scene exit/re-entry, reduced motion and fallback.
- [x] Run `npm run build` once after implementation; create no screenshots or
  recordings.

#### 9 — Final review

- [x] Run `npm run build` once after the final adjustment.
- [x] Inspect Scene 05 at 1440 × 900, 1178 × 1014, 390 × 844 and a short
  mobile viewport.
- [x] Confirm the page remains enhanced and does not enter fallback.
- [x] Confirm no overlap with IFC, wheel, branch, copy or margin label.
- [x] Do not create screenshots or recordings.
- [x] If sequencing resolves the density, do not resize or remove elements.

**Done when:** the existing composition is intact and the arrival sequence is
clear at all review sizes.

#### 10 — Approval gate

- [x] Present Scene 05 at <http://localhost:5173/#chapter-05>.
- [x] Obtain explicit user approval.
- [x] Record the decision in `narrative-spine.md` and `CHANGELOG.md`.
- [x] Do not plan or change Scene 06 before approval.

**Done when:** the user approves Scene 05 and the controlled rollout can move
to Scene 06.

**Decision (user approval, 2026-10-05): Scene 05 is approved as built.** The
arrival, callouts and mobile wheel tap are complete. Scene 06 may now be
planned.

### Verification discipline

For each implementation item, inspect only Scene 05 and its mapped files. Run
only `npm run build` and inspect <http://localhost:5173/#chapter-05>. Do not
create screenshots or recordings.

### Persistent callout dimming

The sequential callouts disappeared after the first hover (user request,
2026-10-05). Both arrows now remain in place.

- [x] Keep “Light the skyline” / “Tap the lights” visible and point it at
  Two IFC.
- [x] Keep “Hover me” / “Tap the wheel” visible and place it beside the wheel.
- [x] Dim only the skyline arrow while the pointer is over the buildings, then
  restore it when the pointer leaves.
- [x] Dim only the wheel arrow while the pointer is over the wheel, then
  restore it when the pointer leaves.
- [x] On touch, dim only during the finger press and restore on release.
- [x] Leave the wheel boost, city-light strength, camera and copy unchanged.

**Completed 2026-10-05:** desktop hover, mobile press-and-release, 1440 × 900,
1178 × 1014, 390 × 844 and 320 × 720 were checked without screenshots. Each
arrow stayed inside the viewport, clear of the copy, and returned to full
strength after the pointer left its target. The page remained enhanced.

### Callout visual review

Reviewed 2026-10-05 before any further visual change (user request). The
callouts are worth keeping. The interactions are invisible until someone
tries them, and a short labeled arrow is lighter than the earlier sentence.
The current treatment is heavier than the scene needs.

#### 1 — The yellow line

The amber line is the callout’s left border, with a dark wash behind the
words. It is not needed. The arrow already shows where to look, and the line
does not point at the target. On the skyline callout it sits on the opposite
side from Two IFC, so the label reads as a small interface chip rather than a
caption in the sky.

**Recommendation:** remove the left border and the dark wash. Keep the cream
label and the warm arrow.

#### 2 — Desktop skyline position

“Light the skyline” is at 74% across and 38% down. The corner branch enters
from the top-right and its foliage reaches into that same area, so the label
sits in the sprig. The branch placement stays frozen.

**Recommendation:** lower only this desktop callout to about 54% down, still
beside Two IFC’s shaft and above the wheel callout. Adjust the arrow angle
only if it no longer aims into the tower.

#### 3 — Mobile skyline position

“Tap the lights” sits left of Two IFC, with a clear gap on a 390-wide phone.
It was kept there so it would not cover the copy. On a 320-wide phone the
copy and Two IFC leave only a narrow opening, so the label cannot sit on the
tower.

**Recommendation:** move it right until the arrow meets Two IFC’s left edge,
staying below the copy. Do not cover the tower or the sentence.

#### 4 — Shorter mobile words

“Tap the lights” and “Tap the wheel” are the widest part of the mobile
callouts. The arrow already identifies the target, so the words only need to
name the action (user question, 2026-10-05).

**Recommendation:** use **“Tap me”** for both mobile callouts. Keep desktop
as “Light the skyline” and “Hover me”, because a desktop pointer hovers and
the skyline action is lighting rather than tapping.

#### What to preserve

- Both arrows remain visible and dim only on their own target.
- The wheel callout stays beside the wheel.
- Desktop wording stays “Light the skyline” and “Hover me”.
- No change to the branch, camera, copy, wheel boost or city-light strength.
- No extra icon, box, shadow or second rule.

#### Decision gate

- [x] Approve removing the yellow line and dark wash.
- [x] Approve lowering the desktop skyline callout below the branch.
- [x] Approve moving the mobile skyline callout closer to Two IFC.
- [x] Approve “Tap me” for both mobile callouts.
- [x] Implement only after those choices. Then recheck 1440 × 900,
  1178 × 1014, 390 × 844 and 320 × 720 without screenshots.

**Completed 2026-10-05:** the amber rule and dark wash are gone. The desktop
skyline label is at 54% down, beside Two IFC and below the branch. Both mobile
labels read “Tap me,” and the skyline arrow meets the tower’s left edge
without covering the copy. Desktop wording, wheel placement, dimming, camera
and branch are unchanged. All four review sizes stayed inside the viewport
without fallback.

### Next action

Closed (user approval, 2026-10-06). Desktop callouts are S2, D2, and the
closer place (user choice, 2026-10-05). The phone is unchanged.

### Desktop callout size and dim (user request, 2026-10-05)

On a large desktop the two labels read as a whisper, and each sits in a
gap rather than against its target. “Light the skyline” is at 74% across
and 54% down, in the dark between Two IFC and the branch. “Hover me” is
at 25% across and 71% down, in the dark left of the wheel. Both are
0.625rem, uppercase, widely tracked. The arrow is 3rem wide. The phone
uses the same size for “Tap me”, and this pass does not change the phone.

The labels should stay close to the wheel and to Two IFC (user request,
2026-10-05). A larger word still belongs against the thing it names, not
farther out in the sky. The branch stays clear of “Light the skyline”.
The wheel’s rim stays readable around “Hover me”. Positions remain in
`SCENE_05_CALLOUTS` in `src/story/scene05/config.js`.

While the pointer is on the buildings, only the skyline label falls to
32% opacity. While it is on the wheel, only the wheel label does. Each
returns as soon as the pointer leaves. The lights and the wheel are
already the response.

#### Size

**S1 — A small step.** Desktop labels become 0.75rem. The arrow grows
with them. Still a caption. On a large monitor they may still feel small
next to the tower.

**S2 — A clear step.** Desktop labels become 0.875rem, and the arrow
grows in proportion. Readable across the picture without matching the
chapter sentence, which is 1.1875rem. Check that “Light the skyline”
stays out of the branch and off the tower. Positions stay in
`src/story/scene05/config.js` unless the longer line needs a nudge.

**S3 — Leave them.** 0.625rem stays. The arrows do the pointing and the
words stay quiet.

#### Dim

**D1 — Keep it.** The label steps back to 32% while you are on its
target, then returns. It marks “you found it.”

**D2 — Drop it.** Both labels stay at full strength. The lit windows and
the turning wheel are the feedback. This matches making the words easier
to see: they no longer vanish at the moment the interaction starts.

**D3 — Soften it.** Dim only to about 70%, so the label still reads while
the pointer is on the target.

#### Place

Desktop only. Move each label in until the arrow is a short step onto its
target.

- “Light the skyline” moves left, toward Two IFC’s shaft, and stays below
  the branch.
- “Hover me” moves right, toward the wheel, and stays off the hub.

#### Recommendation

S2, D2, and the closer place. Desktop only. The phone, the wording, the
branch, the camera and the light strength stay as they are.

#### Checklist

- [x] Pick S1, S2 or S3. S2 (user choice, 2026-10-05).
- [x] Pick D1, D2 or D3. D2 (user choice, 2026-10-05).
- [x] Move the desktop labels close to Two IFC and the wheel.
- [x] If the words grow, scale the desktop arrow with them.
- [x] Recheck a large desktop and a phone at
  <http://localhost:5173/#chapter-05>. The phone labels stay 0.625rem
  and stay where they are.

**On the page (2026-10-05):** desktop labels are 0.875rem. The arrow is
4.2rem by 1.6rem. “Light the skyline” sits just right of Two IFC’s shaft,
below the branch, at 71% across and 52% down, arrow aimed back at the
tower. “Hover me” sits just above the wheel, at 32% across and 68% down.
Desktop labels stay at full strength while the pointer is on the target.
The phone still reads “Tap me” at 0.625rem, in the same places, and still
dims to 32% only while pressed.

<a id="scene-06"></a>

## Scene 06 — Afterimage Implementation Plan

**Status:** approved, 10 of 10 steps complete
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/#chapter-06>

### Goal

Turn Scene 06 into a quiet ending. The existing firework loop continues, and
the approved afterimage arrives in two beats: one sentence gathers, then the
resolving lines fade in. The harbour should feel as if it remains after the
light has gone.

### Frozen scope

Do not change:

- desktop or mobile cameras;
- firework burst positions, sizes, colours, timing, strength or smoke;
- IFC, wheel, skyline, moon, mist or reflections;
- the footer, its statement, or the way fireworks soften as the footer rises;
- Scene 05 or any earlier scene.

Do not add another illustration, particle system, burst, vessel or foreground
object. Scene 06 remains an ending, not a second show.

### Current state

- Scene 06 holds for 50svh on the existing camera. The label and “Afterglow”
  arrive on approach, then the closing paragraph fades in.
- The fireworks sentence is gone (user request, 2026-10-05). The remaining
  paragraph is cream, left-aligned with the title, and set at the lead size
  (user request, 2026-10-05).
- The firework loop, smoke, cameras and footer softening are unchanged.
- Steps 9 and 10 are still open for review.

### Chosen technique

User choice, 2026-10-04, not yet built: one sentence whose letters close in
from wide spacing, then the remaining lines fade in.

Use the approved words, not a new draft:

1. **Gathering sentence:** “Fireworks open above the harbour, then soften into
   smoke and drift slowly over the water.”
2. **Resolving lines:** “The light fades, as light does. The water stays. In
   the morning the ferries will cross again, and the clock will still be
   facing the shore. The crossing ends; the harbour remains.”

Keep both beats in the existing left copy-safe region, sharing the title’s
left edge (user request, 2026-10-05). Both beats are cream and the same size.
The first sentence no longer gathers its letter-spacing. The bursts were
placed to leave that column open.

### Files in scope

- `src/story/scene06/config.js` — Scene 06’s current chapter values, a short
  dwell and the reveal ranges.
- `src/data/chapters.js` — replace only chapter `06` with the config import.
- `index.html` — Scene 06 section, only to split the approved beats.
- `src/ui/copyLayer.js` — Scene 06 reveal levels only.
- `src/styles.css` — Scene 06 gathering sentence and resolving lines only.
- `docs/SCENE-MAP.md` — add the new Scene 06 config once it exists.
- This file, `narrative-spine.md`, `README.md` and `CHANGELOG.md` — tracking.

`src/scene/createFireworks.js` and `src/data/atmosphere.js` stay unread unless
a later step finds the existing loop cannot remain independent.

### Implementation checklist

#### 1 — Give Scene 06 one configuration

- [x] Create `src/story/scene06/config.js`.
- [x] Move chapter `06`’s current camera, copy, visibility, fog, vessels,
  bursts, smoke and probes into it without changing any value.
- [x] Add a short camera-held dwell, about 50svh, so the two beats can be read.
- [x] Add named ranges for the label, title, gathering sentence and resolving
  lines.
- [x] Keep the new timing in that configuration.

**Done when:** Scene 06 has one readable configuration and gains reading time
without a new camera path.

#### 2 — Establish the ending

- [x] Reveal the existing label first.
- [x] Bring in “Afterglow” second.
- [x] Hold both beats until the title is readable.
- [x] Keep the kicker, title and left-column placement.

**Done when:** the opening reads as an ending before the afterimage begins.

#### 3 — Gather the sentence

- [x] Replace the live paragraph with the approved gathering sentence.
- [x] Close its letter-spacing with the scroll, from wide to its normal measure.
- [x] Keep the motion reversible.
- [x] Keep the sentence inside the dark left column, clear of the bursts.

**Done when:** the sentence gathers in place and the fireworks remain the
picture.

#### 4 — Resolve the crossing

- [x] Fade in the approved resolving lines after the sentence has gathered.
- [x] Keep them quieter and smaller than the sentence.
- [x] Leave the sentence visible while they arrive.
- [x] Reverse them cleanly when scrolling back.

**Done when:** the visitor understands that the light goes and the harbour
stays.

#### 5 — Leave the fireworks independent

- [x] Keep the 8-second burst loop, colours, sizes and smoke unchanged.
- [x] Do not sync individual bursts to the words.
- [x] Keep the footer’s existing smoke softening.
- [x] Add no new light, particle or 3D layer.

**Done when:** the sky keeps its own rhythm behind the two beats.

#### 6 — Mobile sequence

- [x] Sequence label, title, gathering sentence, then resolving lines.
- [x] Keep the sentence from overflowing the copy column.
- [x] Keep the bursts right of the copy and above IFC’s crown.
- [x] Use a shorter tracking range if the wide spacing would clip.

**Done when:** a phone reads the same ending without covering the fireworks.

#### 7 — Reduced motion and reading order

- [x] Show the sentence at its final spacing, without the gathering motion.
- [x] Step the resolving lines in at the middle of their range.
- [x] Keep the fireworks still under reduced motion, as they are now.
- [x] Preserve label, title, sentence, resolving lines as the reading order.
- [x] Ensure reverse navigation leaves no hidden line interactive.

**Done when:** the ending remains understandable as a still frame.

#### 8 — Footer handoff

- [x] Let the two beats leave with the existing copy fade as the footer rises.
- [x] Do not change the footer statement, links or colophon.
- [x] Do not hold the chapter open over the footer.

**Done when:** the afterimage ends and the return to the harbour begins.

#### 9 — Final review

- [x] Run `npm run build` once after the final adjustment.
- [x] Inspect Scene 06 at 1440 × 900, 1178 × 1014, 390 × 844 and a short
  mobile viewport.
- [x] Confirm the page remains enhanced and does not enter fallback.
- [x] Confirm the sentence and resolving lines stay clear of the bursts, IFC’s
  crown and the margin label.
- [x] Do not create screenshots or recordings.
- [x] If the sequence is clear, do not move the fireworks.

**Done when:** the existing firework picture is intact and the ending is
readable at all review sizes.

#### 10 — Approval gate

- [x] Present Scene 06 at <http://localhost:5173/#chapter-06>.
- [x] Obtain explicit user approval.
- [x] Record the decision in `narrative-spine.md` and `CHANGELOG.md`.

**Done when:** the user approves Scene 06.

### Verification discipline

For each implementation item, inspect only Scene 06 and its mapped files. Run
only `npm run build` and inspect <http://localhost:5173/#chapter-06>. Do not
create screenshots or recordings.

### As built (steps 1–8, 2026-10-05)

Scene 06 now holds the camera for 50svh. The label and “Afterglow” arrive on
approach, then the closing paragraph fades in. The fireworks sentence is
removed (user request, 2026-10-05). Reduced motion steps that paragraph at
the middle of its range.
The firework loop, smoke, cameras and footer softening are unchanged. At
1440×900, 1178×1014 and 390×844 the beats stay inside the column and clear of
the bursts. On a 320×720 phone the resolving lines still run about 18px past
the copy region and meet the outer edge of the coral burst; the sentence
stays clear.

**Decision (user approval, 2026-10-05): Scene 06 is approved as built.** The
footer is next, and is not part of this chapter.

<a id="scene-03-crossing"></a>

## Scene 03 — Crossing, countdown and cards

**Status:** closed (user approval, 2026-10-06). Desktop presence is W2, C2,
T1 (user choice, 2026-10-05). The phone is unchanged.
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/#chapter-03>

The approved build stays in
[`scene-03-implementation-plan.md`](#scene-03). This
file is the reopen: whether the countdown, the route and the three cards
should stay as they are.

### What this chapter is for

01 and 02 do not tell the ferry story.

- 01 is the harbour at dusk. “The night crossing begins” is the visitor’s
  night, not a boat.
- 02 is the Clock Tower and the trains that left this shore for the north.
  Same Kowloon edge, a different journey.

03 is the first chapter that names the Star Ferry. Whatever we keep here is
the whole ferry essay. It is not a repeat of the chapters before it.

### How it feels now

The page already has a departure: the title, the standfirst (“Kowloon to
the Island, the slow way, every few minutes.”), the split-flap board
(CENTRAL, then 3 MIN / 2 MIN / 1 MIN / ARRIVING), and the ticket.

Under that, three numbered cards:

1. **Facing Forward** — the seat backs flip so you face the way you are going.
2. **A Daily Crossing** — a commute, the same one their grandparents made.
3. **The Route** — a green line from Tsim Sha Tsui to Central, a dot that
   moves with the scroll, and “Crossing since 1888”.

They arrive one after another, then the dot and the minutes are supposed
to be the same journey. In practice they are not one story.

The cards are an index. Each has its own number, title and fact. Two of
them never move. Only the third card is the crossing, and it sits in the
footer row while the minutes sit up by the title. Nothing on the page says
those two belong together.

On a phone the three cards are hidden. The minutes still change. There is
no line to connect them to.

### Why the minutes jump

The link exists in the timing, and it is too short to feel.

The camera holds for 60svh. The board appears near the start and stays on
3 MIN. The dot only travels in the last quarter of that hold (dwell share
0.70 to 0.96, about 16svh). The steps inside that quarter are:

| What you read | Share of the chapter | Scroll inside the hold |
|---|---|---|
| 3 MIN | from the board’s arrival until about 0.78 | most of the scene |
| 2 MIN | about 0.78 to 0.84 | about 4svh |
| 1 MIN | about 0.84 to 0.91 | about 4svh |
| ARRIVING | about 0.91 to the end | about 3svh |

One flick covers 2 MIN and 1 MIN together. The board then aims at the
latest step, so 2 MIN never lands. That is the jump from 3 MIN to 1 MIN.

Scrolling back does not restore an earlier minute. The board only counts
forward until you leave the chapter (user choice, 2026-10-04). If the
minutes become something you scroll through, that one-way rule works
against the feeling.

### Do the three cards earn their place?

| Card | What it adds | What already says this |
|---|---|---|
| Facing Forward | How you sit | Nothing else. It is a true detail, and it is not the crossing. |
| A Daily Crossing | What the trip means | The standfirst already calls it the slow way, every few minutes. |
| The Route | The trip as a line | The standfirst, the board’s CENTRAL, and the ticket (Tsim Sha Tsui to Central, HK$5). “Crossing since 1888” lives only on this card on desktop. |

They are three topics beside a departure, not one departure becoming a
crossing. The seat fact can go without leaving a hole. The grandparents
line is the only sentence that says why the trip matters. The moving line
is the one piece that should be felt, and it is buried in the third card.

### Options

The ferry, the cameras, the water and the ticket picture stay as they are.
These options change words, cards and timing only.

#### A — One instrument

Drop all three cards. Keep the title, the standfirst, the board and the
ticket. Move the route line up with the board, so destination, minutes and
the dot are one object. Run that line across most of the 60svh hold, with
a clear stretch for 3, for 2, for 1, and for ARRIVING. Show the same line
on phones. Keep “Crossing since 1888” as the small line it already is on
phones, on desktop too.

This is the clearest reading: you are waiting for a boat, and the wait is
the scroll.

#### B — One sentence beside the instrument

Same as A, and keep a single line of meaning under the standfirst. The
line to keep is “A Daily Crossing”: a commute, the crossing their
grandparents made. Drop Facing Forward. Drop the route card; the line
lives with the board.

Use this if the chapter should say why the ferry matters, not only that
one is due.

#### C — Keep the facts, free the line

Leave the three cards as a quiet row that arrives and sits. Take the
moving dot out of the third card and put it with the board, on the same
long timing as A. The third card keeps the place names and “Crossing
since 1888”, or loses the diagram and stays a caption. Phones still need
the line, because they do not show the cards.

Use this if the seat fact and the grandparents line both still feel
necessary after seeing A or B.

#### D — Slow the link only

Keep the layout. Stretch the existing dot from the last quarter of the
hold across most of it, and space the four readings so a normal scroll
cannot skip 2 MIN. Leave the board at the top and the line in the third
card.

This fixes the jump. It does not make the link obvious, and phones still
have minutes with no line.

### Recommendation

A, unless the grandparents line still feels necessary, in which case B.
The thing to feel is one crossing: the line and the minutes together, for
most of the hold, on desktop and on a phone. The numbered row is what
makes that hard to see.

If the minutes are the scroll, they should follow it both ways. That
replaces the one-way countdown from 2026-10-04.

### Chosen (user choice, 2026-10-05)

A is on the page. The three cards are gone. The title, standfirst,
“Crossing since 1888”, departure board and ticket remain. The route line
and the place names sit on the board, on desktop and on a phone. The dot
and the minutes share dwell 0.10–0.96 in four even stretches, and the
board counts back when the dot moves back. The ferry, the cameras and the
ticket picture are unchanged.

### Desktop after A (user request, 2026-10-05)

The phone is fine. Leave it. A wide window, including a short one, looks
empty.

On desktop now:

- Top left is the title, one line (“Kowloon to the Island, the slow way,
  every few minutes.”), then “CROSSING SINCE 1888” with nothing under it.
- The countdown is a small board in the sky (top of the window, left of
  the moon). The due tiles are 1.125rem.
- The ticket sits at the lower right at `min(15vw, 16.5rem)`.
- The lower half is the ferry and open water, with little to read.

The phone already stacks the words, the board and the ticket. This pass
does not move or resize the phone.

The ferry fills the left and centre of the picture. A large countdown
dropped straight onto the cabin would cover the boat. The open places are
the left column under the title, the water in front of the hull, and the
lower right where the ticket already sits.

#### Words

One line is not enough on a wide screen. The year on its own looks
stranded. These are the sentences we already have. No new facts.

- Standfirst: “Kowloon to the Island, the slow way, every few minutes.”
- Seats: “Inside, the wooden seat backs flip over, so passengers always
  face the way they are going.”
- Meaning: “Not a view but a commute: a few quiet minutes, the same
  crossing their grandparents made.”

**W1 — Two sentences. The year joins the second.**
The standfirst stays. The meaning line follows, and the year is its
ending, not a label: “…the same crossing their grandparents made, running
since 1888.” The seat sentence stays off. The left column is a short
paragraph. The lonely small-caps line goes.

**W2 — Two sentences. The year captions the countdown.**
The standfirst and the meaning line sit under the title as two sentences.
“Since 1888” leaves that column and sits on the enlarged board, under the
route, so the date belongs to the crossing. The seat sentence stays off.

**W3 — Three sentences.**
Standfirst, then the seats, then the meaning, as plain lines. No cards and
no numbers. The year is the last line of that column, written as a
sentence (“The crossing has run since 1888.”), not as a label by itself.

#### Countdown

Desktop only. It moves down and gets much bigger. The route stays under
the minutes. The phone board stays in the column.

**C1 — Under the words.**
The board leaves the sky and sits in the left column, under the sentences,
the way the phone already stacks them. Due tiles about twice the current
size. Risk: on a tall window it can cover the ferry’s cabin. On a short
window the column is the natural place, because there is less water below.

**C2 — In the water, in front of the hull.**
The board sits low and toward the centre, in the open water ahead of the
bow, clear of the cabin windows and clear of the ticket. Due tiles about
twice the current size. The route becomes a longer line. This fills the
empty lower middle without sitting on the boat.

#### Ticket

Desktop only. The phone ticket stays at 46vw.

**T1 — About twice as wide.**
`min(30vw, 32rem)` at the lower right, still clear of the vertical
天星小輪 label. It stays off the ferry’s hull and off the countdown.

**T2 — Paired with the countdown.**
The ticket grows until its height matches the enlarged board, so the two
read as a pair along the bottom. It stops growing when it would meet the
countdown or the hull.

On a short desktop the countdown and the ticket share the bottom edge.
They shrink together before they cover the title or each other.

#### Recommendation

W2, C2 and T1. The left side becomes two sentences. The year stops sitting
alone and captions the crossing. The countdown drops into the open water
and grows. The ticket grows with it. The phone stays as it is.

**Chosen (user choice, 2026-10-05): W2, C2, T1.** On desktop the standfirst
is followed by the commute sentence. “Since 1888” captions the countdown.
The board sits low, in line with the words, clear of the ticket, and the
due tiles are about twice the old size. The desktop ticket is `min(22.5vw, 24rem)`, about three quarters of the
first enlargement, so the countdown stays the louder object. Both shrink
when the window is shorter than 820px. The phone column is unchanged.

### Frozen until the next choice

- The phone layout.
- Cameras, ferry pose, water, wake, buoy, skyline, haze and lens.
- Ticket artwork. The desktop ticket may only change size and position.
- Scenes other than 03.
- No new illustration.

### Checklist — desktop presence

#### 7 — Choose the desktop shape

- [x] Pick W1, W2 or W3. W2.
- [x] Pick C1 or C2. C2.
- [x] Pick T1 or T2. T1.

**Done when:** the three choices are made. The phone stays as it is.

#### 8 — Give the desktop column a second beat

- [x] Add the chosen sentences under the title.
- [x] Remove the lone “CROSSING SINCE 1888” label, and put the year where
  the word choice says. It captions the desktop countdown. The phone
  still shows it under the standfirst.
- [x] Leave the phone column as it is.

**Done when:** a wide window has more than one line to read, and the year
is no longer a label on its own.

#### 9 — Lower and enlarge the countdown

- [x] Move the desktop board to the chosen place. It sits low, to the left
  of the ticket.
- [x] Make the due tiles about twice the current 1.125rem.
- [x] Keep the route directly under the minutes.
- [x] On a short window, keep the board off the title and off the ticket.

**Done when:** the countdown is the large object in the lower part of a
wide window, and the minutes still match the dot.

#### 10 — Enlarge the desktop ticket

- [x] Apply T1 or T2. T1.
- [x] Keep it lower right, off the hull, off the countdown, and left of
  the 天星小輪 label.
- [x] Leave the phone ticket at 46vw.

**Done when:** the ticket has the same kind of presence as the countdown,
on a tall window and on a short one.

#### 11 — Review

- [x] Desktop, short desktop, and a phone at
  <http://localhost:5173/#chapter-03>. Checked at a wide window, at
  1280 × 720, and at 390 × 844.
- [x] The phone still matches the look already accepted.
- [x] The ferry picture is unchanged.

**Done when:** the wide window feels occupied, and the phone does not.

- Cameras, ferry pose, water, wake, buoy, skyline, haze and lens.
- Ticket artwork and the split-flap board.
- Scenes other than 03.
- No new illustration.

### Checklist

#### 1 — Choose the shape

- [x] Pick A, B, C or D (user choice, 2026-10-05: A).
- [x] If the minutes follow the scroll, confirm they may count back while
  the chapter is on screen. Counting back is part of A.

**Done when:** one option is chosen and the reverse-count question is
answered. No page change before that.

#### 2 — Give the line room

- [x] Move the route range so the dot travels through most of the 60svh
  hold, not only the last quarter. The range is dwell 0.10–0.96.
- [x] Space 3 MIN, 2 MIN, 1 MIN and ARRIVING so each is a stretch of
  scroll, and a single flick cannot skip 2 MIN. The four readings are
  even quarters of that range, and the dot moves linearly.
- [x] Keep the values in `SCENE_03_CROSSING` in `src/story/scene03/config.js`.

**Done when:** holding still on the chapter can show each minute, and a
steady scroll visits all four readings.

#### 3 — Make the link one object

- [x] For A, B or C, draw the route with the departure board, not inside a
  footer card.
- [x] For D, leave the line in the third card and skip this step’s move.
  Not used.
- [x] Use the same line on phones. Phones currently hide the cards, so a
  desktop-only line leaves the jump unexplained there. The line is on the
  board, so phones show it too.

**Done when:** looking at the minutes, the dot is in the same group, on
both widths.

#### 4 — Decide the words that remain

- [x] A: no cards. Keep the standfirst. Put “Crossing since 1888” under it
  on desktop, as phones already do.
- [x] B: one meaning line, the daily-crossing sentence. No seat card, no
  route card. Not used.
- [x] C: three cards stay; the third no longer owns the moving dot. Not used.
- [x] D: wording unchanged. Not used.

**Done when:** 03 reads as one departure, and no sentence is said twice
unless the choice above keeps it.

#### 5 — Follow the scroll both ways

- [x] If confirmed in step 1, let the board step back when the dot moves
  back, and still blank when the chapter is left.
- [x] Reduced motion still shows the words without flipping. Stepped mode
  sets the tiles directly, as before.

**Done when:** scrolling up through 03 revisits 1 MIN, then 2 MIN, then
3 MIN, in step with the dot.

#### 6 — Review

- [x] Desktop and phone at <http://localhost:5173/#chapter-03>. Checked at
  desktop, 390 × 844 and 320 × 720. The minutes and the dot stay together,
  and scrolling back revisits 1 MIN, 2 MIN and 3 MIN.
- [x] The ferry, the ticket and the other chapters look unchanged.
- [x] Update this file, `narrative-spine.md` and `CHANGELOG.md` with the
  choice.

**Done when:** the countdown and the line feel like one crossing, and the
chosen cards — or none — are the only words left.

<a id="footer"></a>

## Footer — Improvement Plan

**Status:** approved, 8 of 8 steps complete (user approval, 2026-10-05)
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/#chapter-06> then scroll into the footer

### Goal

Keep the footer as the quiet close after Afterglow. The statement answers
the ending. The making credit sits in the colophon with the other credits.

### Frozen scope

Do not change:

- the return button, its label, or its place above the statement;
- the three columns, their headings, or the chapter links;
- the landmark facts, years, or the decision to leave the wheel off that list;
- the bottom bar: © 2026 Gavin Fung, 維港夜色, Hong Kong;
- the colophon line “Created by Gavin Fung at HKAAA”, and the Dukling
  photograph credit, while that photograph remains in Scene 04;
- the cream hairline, the near-black wash, or how the bursts dim to half
  strength and the smoke to 70% as the footer rises;
- Scene 06’s camera, bursts, smoke, or closing paragraph;
- any earlier scene.

Do not add a newsletter, social row, map, or a second illustration. Do not
use any Kage lettering or copy.

### Current state

- The footer rises over Scene 06. A cream hairline, then “Return to the
  harbour,” then the statement beside the red-sail mark, then three columns,
  then the bottom bar.
- The statement is ivory display type, two lines: “The crossing ends here.
  In the morning the ferries will cross again.” (user approval, 2026-10-05).
- Scene 06 now ends on one paragraph: the light fades, the water stays, the
  ferries and the clock return in the morning, the harbour remains. The
  footer answers that ending. The making credit sits in the colophon, after
  the HKAAA line. “Original 3D scene and illustrated atmosphere” is gone
  (user request, 2026-10-05).
- On phones the red-sail mark stays to the left of “The”, on the first
  line (user request, 2026-10-05). Chapters and landmarks sit side by side,
  with the colophon below. Landmark years drop to their own line. The
  bottom bar stacks.
- Chapter copy, the vertical label, and the side pager fade as the footer
  rises. The nav bar is not forced back on.

### Accepted words

Accepted (user approval, 2026-10-05). Now on the page:

1. **Statement:** “The crossing ends here. In the morning the ferries will
   cross again.”
2. **Colophon, after the HKAAA line:** “The harbour, vessels and skyline are
   built and animated in code.”

The statement answers Scene 06 instead of retelling it. The making credit
sits with the other credits.

**Credits** (user question, 2026-10-05): keep “Created by Gavin Fung at
HKAAA”. It is not a copy of “© 2026 Gavin Fung”. The bar is the year and the
name. The colophon is the studio, and HKAAA is the only link to it. Do not
remove “Dukling photograph by Ank Kumar, CC BY-SA” while
`plates/dukling-2016.webp` is on Scene 04. The caption “Now · Dukling, built
1955” does not name the photographer or the licence, and CC BY-SA 4.0
requires both. “Original 3D scene and illustrated atmosphere” is removed
(user request, 2026-10-05). It repeated the making line. The painted sky
stays in the asset notes.

### Files in scope

- `index.html` — the footer statement and colophon line only.
- `src/styles.css` — footer type and spacing only, if the new lines need it.
- This file, `interface.md`, `narrative-spine.md`, `README.md` and
  `CHANGELOG.md` — tracking.

`src/ui/siteFooter.js`, `src/main.js` and `src/scene/createFireworks.js`
stay unread unless a later step finds the existing rise or the firework
softening cannot stay as they are. `FINAL-NARRATIVE-COPY.md` is updated
only after the words are approved.

### Implementation checklist

#### 1 — Keep the close that already works

- [x] Leave the return, columns, bar, hairline and wash in place.
- [x] Leave the firework dimming and the chapter-layer fade in place.
- [x] Do not restyle the footer to match the chapter beats.

**Done when:** the footer is still the same close, ready for a shorter
statement.

#### 2 — Let the statement answer the ending

- [x] Replace the three-sentence statement with the proposed two lines, once
  accepted.
- [x] Move “built and animated in code” into the colophon.
- [x] Keep the red-sail mark beside the statement.
- [x] Keep the statement in the ivory display face.

**Done when:** the footer does not retell the six chapters, and the making
credit sits with the other credits.

#### 3 — Desktop reading

- [x] Keep the statement to two lines at 1440 × 900 and 1178 × 1014.
- [x] Keep the three columns aligned, with headings and links readable over
  the dimmed bursts.
- [x] Keep “Return to the harbour” the first action.

**Done when:** a desktop reader can return, read the close, and find a
chapter without the statement crowding the columns.

#### 4 — Mobile reading

- [x] Check 390 × 844 and 320 × 720.
- [x] Keep the mark to the left of “The”, and the statement within four
  lines (user request, 2026-10-05).
- [x] Keep chapters and landmarks side by side, the colophon below, and the
  years on their own line.
- [x] Keep the stacked bottom bar from colliding with the home indicator.

**Done when:** a phone reads the same close without a cramped column or a
clipped bar.

#### 5 — Handoff from Scene 06

- [x] Let Scene 06’s paragraph leave with the existing copy fade.
- [x] Keep the bursts at half strength and the smoke at 70% behind the text.
- [x] Leave the nav bar on its current show-on-scroll-up behaviour.

**Done when:** Afterglow ends, and the footer begins, without a second
finale.

#### 6 — Reduced motion, keyboard and fallback

- [x] The footer is already still. Do not add motion.
- [x] Confirm the return, chapter links, HKAAA link and photo credit are
  reachable by keyboard.
- [x] Confirm the same words appear in the poster-only fallback.

**Done when:** the close is readable with motion reduced and without the
3D scene.

#### 7 — Final review

- [x] Run `npm run build` once after the final adjustment.
- [x] Inspect the footer at 1440 × 900, 1178 × 1014, 390 × 844 and 320 × 720.
- [x] Confirm the page remains enhanced and does not enter fallback.
- [x] Do not create screenshots or recordings.

**Done when:** the existing footer picture is intact and the new lines are
readable at all review sizes.

#### 8 — Approval gate

- [x] Present the footer from <http://localhost:5173/#chapter-06>.
- [x] Obtain explicit user approval.
- [x] Record the decision in `interface.md` and `CHANGELOG.md`.
- [x] Update `FINAL-NARRATIVE-COPY.md` only after that approval.

**Done when:** the user approves the footer.

### Next action

Closed (user approval, 2026-10-05). The footer stays as approved. No further
footer work until asked.

<a id="accent"></a>

## Accent colour

**Status:** approved, 8 of 8 steps complete (user approval, 2026-10-05)
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/>

### Goal

Give the interface one accent. The logo sail is orange (`--color-coral`,
`#e4573d`). A second accent, yellow (`--color-warm`, `#f2b36b`), is used
both for “you are here” and for light in the picture. The two jobs should
not share one colour.

### Recommendation

Accepted and approved (user approval, 2026-10-05). The logo stays orange.

Yellow is already the colour of the lamps, the active year, the ferry
board and the callout arrows. If the sail became yellow, the chapter
numbers 01–06 would have to follow, and the mark would sit in the same
colour as the night’s lights.

Orange stays the brand:

- the sail;
- the chapter numbers 01–06, which are already orange;
- the marks that mean start, or you are here, or a link under the pointer.

Yellow stays the light in the picture. Cream stays the reading type and
the hairlines.

An earlier choice kept coral for the junk’s sails and put the nav
underline in yellow (`interface.md`, 3.4). The chapter numbers have since
joined the sail. This plan revises that split only where a mark is
interface, not light.

### The six questions

Proposed, then applied (user request, 2026-10-05).

1. **Scroll to cross.** Yes. The moving stroke is cream today
   (`currentColor` on the hint). It becomes orange. The faint track under
   it stays cream. The hero numerals “01 / 06” stay cream. After the hero,
   the current numeral is yellow; it moves to orange with the stroke, so
   the corner is one colour.
2. **Scene 02 years.** The active year stays yellow. The line is a
   separator between years, not a logo mark. It brightens on the current
   year. **1915 had no line even while current** (user request, 2026-10-05):
   the first year is built with `border-left: 0`, so the active colour had
   nothing to paint. It now draws the same yellow stroke, one gap to the
   left of the numerals, only while 1915 is current. The numerals do not
   move. At rest, 1915 still has no line.
3. **Nav underline.** Yes. It is yellow today. It becomes orange, with the
   current chapter in the menu, so “you are here” matches the chapter
   number.
4. **Scene 03 countdown.** No. The due digits stay yellow. They are the
   board’s lamps. The green dot stays the ferry’s own green. The
   destination tiles stay cream.
5. **Callout arrows.** No. “Hover me” and “Light the skyline” keep yellow
   arrows. They point at lights. The words stay cream.
6. **Footer hover.** Yes. HKAAA and the other footer links turn yellow on
   hover. That hover becomes orange. The same text-link hover elsewhere
   moves with it.

### Frozen scope

Do not change:

- the logo sail, its shape, or its orange;
- the chapter numbers 01–06;
- cream body type, ivory titles, or the footer statement;
- the timeline’s yellow. 1915’s current stroke uses that same yellow;
- the ferry due digits, the ferry-green dot, or the callout arrows;
- fireworks, lamps, the film grade, or any camera;
- Scene 06, the footer layout, or the approved footer words.

### Files in scope

- `src/styles.css` — the scroll stroke, the nav and menu current mark, the
  link hover, and the 1915 current stroke.
- This file, `interface.md`, `narrative-spine.md`, `README.md` and
  `CHANGELOG.md` — tracking.

### Implementation checklist

#### 1 — Keep the orange sail

- [x] Leave the logo orange.
- [x] Leave the chapter numbers orange.
- [x] Do not introduce a third accent.

**Done when:** the brand colour is the sail’s orange, and yellow is only
light.

#### 2 — Scroll to cross

- [x] Colour the moving stroke orange.
- [x] Leave the faint track cream.
- [x] Colour the current numeral orange once the hero is left. Leave
  “01 / 06” cream while it is still the invitation.

**Done when:** the corner invites in orange and does not turn the whole
counter into a lamp.

#### 3 — Scene 02 years

- [x] Leave the active year’s line and glow yellow.
- [x] Leave 1915 without a resting line.
- [x] Give 1915 the same yellow marker while it is current (user request,
  2026-10-05).

**Done when:** 1915 shows the stroke only while it is the current year, and
the later years are unchanged.

#### 4 — Nav underline

- [x] Change the current chapter’s underline from yellow to orange.
- [x] Change the menu’s current chapter mark to the same orange.
- [x] Leave the Chinese hover swap as it is.

**Done when:** the current chapter matches the orange chapter number.

#### 5 — Scene 03 countdown

- [x] Leave the due digits yellow.
- [x] Leave the ferry dot green and the destination tiles cream.

**Done when:** the board still looks like a lamp, not a logo.

#### 6 — Callout arrows

- [x] Leave both arrows yellow.
- [x] Leave “Hover me” and “Light the skyline” in cream.

**Done when:** the arrows still point at light.

#### 7 — Footer hover

- [x] Change the footer link hover, including HKAAA, from yellow to orange.
- [x] Change the shared text-link hover with it.
- [x] Leave unhovered links in their present colour.

**Done when:** a hovered credit matches the sail.

#### 8 — Approval gate

- [x] Review at <http://localhost:5173/>: the opening counter, Scene 02’s
  years, the nav, Scene 03’s board, a Scene 05 callout, and the footer
  hover.
- [x] Check 1440 × 900 and 390 × 844.
- [x] Run `npm run build` once after the last colour change.
- [x] Obtain explicit approval.
- [x] Do not create screenshots or recordings.

**Done when:** the user approves the accent split.

### Next action

Closed (user approval, 2026-10-05). Orange is the brand. Yellow stays the
light in the picture. The Scene 02 year cards keep their insets. No further
accent work until asked.

<a id="hero-wordmark"></a>

## Hero wordmark — 香港 colour

**Status:** approved, 6 of 6 steps complete (user approval, 2026-10-05)
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/> on desktop and on a phone

### Goal

Keep 香港 as the hero’s large word, lit from above. The lower half is a
cool grey-violet that does not belong to the cream type or the night’s
warm light, and the feet lose their strokes.

### How it looks now

The two characters are drawn in Noto Serif TC 700 onto a plane in the
scene (`createWordmark.js`). The material is cream (`#f3e9d2`). A vertical
shade multiplies that:

- the top third is white;
- by 70% of the height it is grey-violet, `rgb(140, 130, 165)`;
- the feet are dusk violet, `rgba(44, 38, 74, 0.95)`.

On a wide screen the word stands in the water. The bright tops read. The
feet sink into the same colour as the harbour, so the lower strokes of 香
and 港 disappear, and the red sail shows through them.

On a phone the word sits in the sky. The tops still read. The lower half
turns grey where it crosses the moon, so 港 looks muddy.

The shade was chosen so the word would sit in the scene rather than on the
glass (user request, 2026-10-01). The violet is now a third colour, beside
cream type and the orange brand.

### Recommendation

Accepted and approved (user approval, 2026-10-05). The lower shade is a dark
cream. The top stays white.

Keep the lit-from-above fade. Keep the tops near white. Move the middle
and the feet from grey-violet toward a dark cream, dark enough to sit in
the water, light enough that the strokes stay visible over the water and
over the moon.

Do not paint 香港 orange. Orange is the sail and the interface marks. A
giant orange word would fight the junk. Do not flatten it to one solid
white. That would sit on the glass.

### Frozen scope

Do not change:

- the word’s size, depth, screen position, or the gap below 01’s copy;
- the fade as the hero is left;
- the font, or the hidden heading;
- the logo, the chapter type, the scroll stroke, or the accent split;
- the poster and the social image, unless a later step is asked to
  recapture them.

### Files in scope

- `src/scene/createWordmark.js` — the shade stops only.
- This file, `interface.md`, `narrative-spine.md`, `README.md` and
  `CHANGELOG.md` — tracking.

### Implementation checklist

#### 1 — Keep the word where it is

- [x] Leave placement, size, depth and the scroll fade as they are.
- [x] Leave the top of the shade near white.

**Done when:** only the lower colour is open to change.

#### 2 — Warm the lower shade

- [x] Replace the grey-violet middle and the dusk-violet feet with a dark
  cream, once the direction is accepted.
- [x] Keep a clear step from the white top into that darker cream.
- [x] Do not introduce orange.

**Done when:** the lower strokes are a warm dark, not a separate violet.

#### 3 — Desktop reading

- [x] At 1440 × 900, read both characters over the water, the railing and
  the red sail.
- [x] The feet stay darker than the tops, and the strokes still show.

**Done when:** 香 and 港 can be read down to their feet.

#### 4 — Phone reading

- [x] At 390 × 844, read both characters over the moon and the sky.
- [x] The lower half does not turn muddy grey on the moon.

**Done when:** the phone word matches the desktop shade.

#### 5 — Stillness

- [x] Reduced motion still fades the same word, with no new motion.
- [x] The poster and the social image stay as they are.

**Done when:** only the live shade has changed.

#### 6 — Approval gate

- [x] Review at <http://localhost:5173/> on desktop and on a phone.
- [x] Run `npm run build` once after the last shade change.
- [x] Obtain explicit approval.
- [x] Record it in `interface.md` and `CHANGELOG.md`.
- [x] Do not create screenshots or recordings.

**Done when:** the user approves the shade.

### Next action

Closed (user approval, 2026-10-05). The feet stay a dark cream. No further
wordmark work until asked.

<a id="organization"></a>

## Project organization

**Status:** closed (user request, 2026-10-06).
**Review:** <http://localhost:5173/>

The harbour is built. This pass lined the words, the docs and the code
up, and removed only what nothing uses. The briefing, the copy record and
the scene map describe the site as it is.

### What “clean” means

Someone new can answer three questions without reading the changelog:

1. What is on the page now?
2. Which file owns each chapter?
3. Which documents are the current record, and which are history?

The page stays the source for words and for the picture. Docs describe
that page. Code stays where `docs/SCENE-MAP.md` says it is.

### Leave in place

- Closed chapter plans. They are the record of how 02–06 were built.
- `CHANGELOG.md`. It is the history. Do not rewrite or shorten it.
- Briefs and reviews (`CURSOR-GREYBOX-BRIEF.md`, `WORLD-BIBLE.md`,
  `ATMOSPHERE-EFFECTS-BRIEF.md`, `TYPOGRAPHY-INTERFACE-BRIEF.md`, the
  greybox and milestone reviews). Mark them as history. Do not delete them.
- Reference art under `docs/references/`. It is not shipped.
- A cleanup whose only aim is a smaller download. Unused comments and
  unread docs are not requested by the page. Delete a file in `public/`
  only when nothing asks for it. Delete a source file only when nothing
  imports it.

### What is already out of date

These are the mismatches found while writing this plan. Steps 1–5
corrected them.

- `docs/plan/README.md` still opens as if the colour pass and the iPhone
  measurement are open. The “Open” section below that says both are
  closed. The glance still calls the vertical title 東方明珠. It is
  東方之珠.
- `docs/plan/HANDOFF.md` still briefs a fresh chat for 2026-10-03. It
  points at <http://localhost:5173/hongkong/>. The review address is
  <http://localhost:5173/>. It says not to commit
  `docs/FINAL-NARRATIVE-COPY.md`. That file is now the word record. It
  says publishing is what remains. The site is already live.
- `docs/SCENE-MAP.md` still says some scenes live in `src/data/chapters.js`.
  All six chapters are assembled from `src/story/scene01`–`scene06`.
  `chapters.js` only gathers them and holds the shared scroll numbers.
- The footer says the Star Ferry’s origins are in 1880. Scene 03 says
  “Crossing since 1888.” Both are on purpose until a choice is made.
- The share image was retaken 2026-10-06 with the warmed 香港. The
  fallback posters, `posters/harbour-poster-desktop.webp` and
  `posters/harbour-poster-mobile.webp`, are still the 2026-10-04 frame.
- `FINAL-NARRATIVE-COPY.md` records the live sentences, and it also still
  carries the 2026-10-03 draft notes, the old 18-to-21-word rule, and a
  finished implementation handoff. A reader can think those are still
  the task.
- README “After this milestone” still describes copy, posters and
  publishing as future work.

### Recommendation

Do the briefing first, then the words, then an inventory, then deletions.
Do not start by deleting files.

1. Rewrite `HANDOFF.md` as the current briefing: how we work, the review
   address, where the words are, where each chapter lives, and that the
   six chapters, the footer and the colours are built.
2. Correct the README glance and its open/closed lines so they match
   that briefing. Point “After this milestone” at this plan.
3. Make `FINAL-NARRATIVE-COPY.md` one record of the live words. Keep a
   short note that earlier drafts are retired. Do not leave a second
   task list inside it.
4. Bring `SCENE-MAP.md` in line with `chapters.js`.
5. List unused `public/` files and unimported `src/` files. Delete only
   the ones that list confirms. Record each removal.
6. Ask before changing the 1880 / 1888 split, and before retaking the
   two fallback posters.

### Checklist

#### 1 — A briefing someone can follow

- [x] Rewrite `HANDOFF.md` for the site as it is on 2026-10-06.
- [x] Correct the README status, the glance, and “After this milestone.”
- [x] Name the current documents: `SCENE-MAP.md`,
  `FINAL-NARRATIVE-COPY.md`, `ASSET-LEDGER.md`, this plan folder.
- [x] Name the history documents and say they are not the task list.

**Done (2026-10-06):** a new chat starts from `HANDOFF.md`. The review
address is <http://localhost:5173/>. The October look test is named as
history.

#### 2 — Words match the page

- [x] Read `index.html` against `FINAL-NARRATIVE-COPY.md`.
- [x] Keep one statement of each live sentence. Move retired drafts out
  of the reading path.
- [x] Leave the 1880 footer line and the 1888 chapter line until a choice.
- [x] Record the vertical title as 東方之珠 and the chapter 01 label as 維港.

**Done (2026-10-06):** `FINAL-NARRATIVE-COPY.md` records the words on the
page. Retired drafts are not repeated. The page was not changed.

#### 3 — The map matches the code

- [x] Update `SCENE-MAP.md` so each chapter points at its
  `src/story/sceneNN/config.js`.
- [x] Say what `src/data/chapters.js` still owns: the scroll numbers and
  the assembled list.
- [x] Check the README file table against the plan files that exist.

**Done (2026-10-06):** the map sends a chapter edit to that scene's
config. `chapters.js` is the scroll numbers and the assembled list.
Scenes 03–06 still attach id, slug, title and storyboard there. The README
plan table already names every file in `docs/plan/`. The page was not
changed.

#### 4 — Inventory, then remove

- [x] List every file in `public/` and where the page requests it.
- [x] List every `src/` module that nothing imports.
- [x] Delete only confirmed unused files. Update `ASSET-LEDGER.md` when
  a shipped asset goes.
- [x] Do not delete closed plans, briefs, or reference art.

**Done (2026-10-06):** every image, font and the favicon is requested.
The four OFL texts stay; they are the font licences. Six `.gitkeep`
placeholders are gone: the empty `cutouts`, `models` and `textures`
folders, and the spare keeps in `fonts`, `plates` and `posters`. All 72
`src` modules are imported (`debug.js` with `?debug`, `fpsOverlay.js`
with `?fps`). No shipped asset left, so the ledger is unchanged. The
page was not changed.

#### 5 — Decisions still open

- [x] Choose whether Scene 03 stays “Crossing since 1888” while the
  footer says “origins in 1880.”
- [x] Choose whether to retake the two fallback posters so they match
  the warmed 香港. The share image is already retaken.
- [x] Record the illustration count. The spine still has an open line
  about using no more than two or three. Scene 02 has one print and
  Scene 04 has two photographs.

**Done (2026-10-06):** both dates stay. 1880 is the first crossing,
Morning Star. 1888 is the founding of the Kowloon Ferry Company. The
two fallback posters are retaken from the current opening frame. The
illustration count is three: one print in Scene 02 and two photographs
in Scene 04. That is the top of the spine’s limit. Nothing was added
or removed.

#### 6 — Close this plan

- [x] Update `HANDOFF.md`, `README.md`, `CHANGELOG.md` and this file.
- [x] Look at <http://localhost:5173/> only if a step changed the page.
- [ ] Commit when asked.

**Done (2026-10-06):** the briefing, the words and the map describe the
same site. This step did not change the page. The commit waits until it
is asked for.
