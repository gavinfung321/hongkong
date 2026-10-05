# Scene 04 — Progressive Story Implementation Plan

**Status:** approved, 10 of 10 steps complete
**Created:** user request, 2026-10-05  
**Review:** <http://localhost:5173/#chapter-04>

## Goal

Turn Scene 04's existing 60svh hold into a clear then-and-now story using
the current label, title, two photographs, captions, quote and statement.
The sequence should move from the historical working junk to the present-day
harbour symbol without competing with the red sails.

## Frozen scope

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

## Current state

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

## Files in scope

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

## Implementation checklist

### 1 — Give Scene 04 one configuration

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

### 2 — Establish the red-sails opening

- [x] Reveal the existing label first.
- [x] Bring in the title and statement rule as the opening composition.
- [x] Hold the photographs, quote and statement intro for later beats.
- [x] Keep the junk and camera still throughout the dwell.

**Done when:** the scene first reads as “Red Sails” before the archival
comparison asks for attention.

**Completed 2026-10-05:** the existing label, title, rule and lower wash form
the opening while every later story element waits. Camera and junk values are
unchanged.

### 3 — Introduce the historical junk

- [x] Reveal the “Then · Before 1945” photograph and caption second.
- [x] Start its existing cloth motion only when the card becomes visible.
- [x] Preserve its crop, grade, size, angle and position.
- [x] Keep the entrance reversible and restrained.

**Done when:** the first card clearly establishes the working-junk history.

**Completed 2026-10-05:** the historical card has its own reversible range,
and its existing cloth simulation remains paused while the card is hidden.
Artwork and placement are unchanged.

### 4 — Complete the then-and-now comparison

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

### 5 — Resolve the story

- [x] Reveal the existing quote only after both desktop cards are available.
- [x] Reveal the statement intro as the final narrative beat.
- [x] Keep the approved wording and bottom statement placement unchanged.
- [x] Keep the quote omitted on mobile.

**Done when:** the final words explain why the junk remains a harbour symbol
instead of repeating what the photographs already show.

**Completed 2026-10-05:** the quote follows the completed card comparison,
then the statement intro closes the sequence. Wording, placement and mobile
quote omission are unchanged.

### 6 — Synchronize cards and atmosphere

- [x] Bring the existing wind haze in with the historical card.
- [x] Let it reach its current full strength with the contemporary card.
- [x] Preserve the existing memory-veil strength and opening on the sails.
- [x] Do not alter clouds, lens bokeh, water, wake or any 3D atmosphere.

**Done when:** the existing air supports the comparison without becoming a
new visual subject.

**Completed 2026-10-05:** wind haze begins at 45% of its authored level with
the historical card and reaches full level with the contemporary card. The
veil and all visual-effect assets remain unchanged.

### 7 — Preserve the mobile composition

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

### 8 — Reduced motion, loading and reading order

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

### 9 — Final review

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

### 10 — Approval gate

- [x] Present Scene 04 at <http://localhost:5173/#chapter-04>.
- [x] Obtain explicit user approval.
- [x] Record the decision in `narrative-spine.md` and `CHANGELOG.md`.
- [x] Do not plan or change Scene 05 before approval.

**Done when:** the user approves Scene 04 and the controlled rollout can move
to Scene 05.

**Completed 2026-10-05:** Scene 04 was approved as built (user approval,
2026-10-05). The progressive-story implementation is complete.

## Post-approval responsive polish

- [x] Make the desktop quote's type size, line height and surrounding spacing
  respond to both viewport width and height (user request, 2026-10-05).
- [x] Keep the quote clear of the statement hairline on short desktop windows.
- [x] Preserve card, statement, copy and 3D placement.
- [x] Keep the quote omitted on mobile.

**Completed 2026-10-05:** the quote now scales fluidly from 17 px to 22 px
with tighter responsive spacing. It clears the statement rule by 36 px at
870 × 786 and remains clear at 1178 × 1014 and 1440 × 900. Mobile remains
unchanged. The production build passed; no screenshots were created.

## Verification discipline

For each implementation item, inspect only Scene 04 and its mapped files. Run
only `npm run build` and inspect <http://localhost:5173/#chapter-04>. Do not
create screenshots or recordings.

## Next action

Scene 04 is complete. Define Scene 05's controlled rollout and frozen scope
before making new Scene 05 changes.
