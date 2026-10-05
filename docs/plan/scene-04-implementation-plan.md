# Scene 04 — Progressive Story Implementation Plan

**Status:** planned, 0 of 10 steps complete  
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

- The label, title, statement, both photographs and quote share one entrance.
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

- [ ] Create `src/story/scene04/config.js`.
- [ ] Move only chapter `04`'s current camera, copy, dwell, visibility, fog,
  vessel and probe values into it without changing any value.
- [ ] Add named Scene 04 reveal ranges there.
- [ ] Keep all new scroll-linked Scene 04 timing out of shared literals.

**Done when:** Scene 04 has one readable configuration and the extraction
does not alter its appearance, camera or behavior.

### 2 — Establish the red-sails opening

- [ ] Reveal the existing label first.
- [ ] Bring in the title and statement rule as the opening composition.
- [ ] Hold the photographs, quote and statement intro for later beats.
- [ ] Keep the junk and camera still throughout the dwell.

**Done when:** the scene first reads as “Red Sails” before the archival
comparison asks for attention.

### 3 — Introduce the historical junk

- [ ] Reveal the “Then · Before 1945” photograph and caption second.
- [ ] Start its existing cloth motion only when the card becomes visible.
- [ ] Preserve its crop, grade, size, angle and position.
- [ ] Keep the entrance reversible and restrained.

**Done when:** the first card clearly establishes the working-junk history.

### 4 — Complete the then-and-now comparison

- [ ] Reveal the “Now · Dukling, built 1955” photograph and caption after the
  historical card.
- [ ] Start the second card's existing cloth motion with its own entrance.
- [ ] Preserve the staggered desktop relationship and side-by-side mobile
  relationship.
- [ ] Do not change either photograph or caption.

**Done when:** scrolling creates an understandable Then → Now comparison.

### 5 — Resolve the story

- [ ] Reveal the existing quote only after both desktop cards are available.
- [ ] Reveal the statement intro as the final narrative beat.
- [ ] Keep the approved wording and bottom statement placement unchanged.
- [ ] Keep the quote omitted on mobile.

**Done when:** the final words explain why the junk remains a harbour symbol
instead of repeating what the photographs already show.

### 6 — Synchronize cards and atmosphere

- [ ] Bring the existing wind haze in with the historical card.
- [ ] Let it reach its current full strength with the contemporary card.
- [ ] Preserve the existing memory-veil strength and opening on the sails.
- [ ] Do not alter clouds, lens bokeh, water, wake or any 3D atmosphere.

**Done when:** the existing air supports the comparison without becoming a
new visual subject.

### 7 — Preserve the mobile composition

- [ ] Sequence label and title → historical card → contemporary card →
  statement intro.
- [ ] Keep the two cards side by side at their current size.
- [ ] Keep the quote omitted and the vertical margin label clear.
- [ ] Keep the main sail, captions and bottom statement unobstructed.
- [ ] Preserve the current short-landscape behavior.

**Done when:** mobile communicates the complete comparison without crowding
the sail or shrinking the cards.

### 8 — Reduced motion, loading and reading order

- [ ] Use short fades and still photographs in stepped mode.
- [ ] Keep cloth simulation off for touch, reduced motion and WebGL2 fallback.
- [ ] Preserve label → title → intro → photographs → captions → quote in the
  semantic document order.
- [ ] Ensure delayed visual entrances do not hide meaningful fallback content.
- [ ] Confirm reverse navigation does not leave hidden content interactive.

**Done when:** the complete story remains readable without continuous motion
and before enhanced card rendering is available.

### 9 — Final review

- [ ] Run `npm run build` once after the final adjustment.
- [ ] Inspect Scene 04 at 1440 × 900, 1178 × 1014, 390 × 844 and a short
  mobile viewport.
- [ ] Confirm the page remains enhanced and does not enter fallback.
- [ ] Confirm no overlap with the junk, captions, quote, statement or margin
  label.
- [ ] Do not create screenshots or recordings.
- [ ] If sequencing resolves the density, do not resize or remove elements.

**Done when:** the existing composition is intact and the progressive
then-and-now story is clear at all review sizes.

### 10 — Approval gate

- [ ] Present Scene 04 at <http://localhost:5173/#chapter-04>.
- [ ] Obtain explicit user approval.
- [ ] Record the decision in `narrative-spine.md` and `CHANGELOG.md`.
- [ ] Do not plan or change Scene 05 before approval.

**Done when:** the user approves Scene 04 and the controlled rollout can move
to Scene 05.

## Verification discipline

For each implementation item, inspect only Scene 04 and its mapped files. Run
only `npm run build` and inspect <http://localhost:5173/#chapter-04>. Do not
create screenshots or recordings.

## Next action

Complete step 1: create Scene 04's configuration and named reveal ranges
without changing any current value or visible behavior.
