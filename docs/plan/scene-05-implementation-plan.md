# Scene 05 — Progressive Arrival Implementation Plan

**Status:** planned, 0 of 10 steps complete
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/#chapter-05>

## Goal

Turn Scene 05 into a clear arrival at Central using the existing label,
“City of Light” title, verified Two IFC sentence, title sweep, corner branch
and office-light interaction. The words should establish IFC before the
visitor is invited to explore the city lights.

## Frozen scope

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

## Current state

- The label, title and verified Two IFC sentence enter together.
- A warm band sweeps once across the title when the copy appears.
- The desktop corner branch slides in with the words; mobile omits it.
- Pointer movement or a touch lights a small office patch whenever Scene 05
  copy is active; reduced motion disables it.
- Lens bokeh, the lit cloud band, skyline wave, harbour boat, autonomous
  searchlights and wheel hover already animate independently.
- Scene 05 currently has no chapter-specific dwell.

## Files in scope

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

## Implementation checklist

### 1 — Give Scene 05 one configuration

- [ ] Create `src/story/scene05/config.js`.
- [ ] Move only chapter `05`'s current camera, copy, visibility, fog, vessel
  and probe values into it without changing any value.
- [ ] Add a short 45svh Scene 05 dwell that holds the existing camera pose.
- [ ] Add named opening, body, branch and interaction ranges.
- [ ] Keep all new Scene 05 timing in that configuration.

**Done when:** Scene 05 has one readable configuration and gains reading time
without a new camera path or altered composition.

### 2 — Establish the Central arrival

- [ ] Reveal the existing label first.
- [ ] Bring in “City of Light” second.
- [ ] Run the existing warm title sweep once the title is visible.
- [ ] Hold the body sentence, branch and touch interaction for later beats.

**Done when:** the opening reads as an arrival at the city before explanation
or interaction competes for attention.

### 3 — Deliver the Two IFC fact

- [ ] Reveal the existing verified sentence after the title.
- [ ] Keep its wording, width, type and position unchanged.
- [ ] Keep the entrance restrained and fully reversible.
- [ ] Leave the title visible while the sentence arrives.

**Done when:** the visitor understands why Two IFC leads the composition.

### 4 — Frame the postcard

- [ ] Bring the existing corner branch in with the body sentence on desktop.
- [ ] Keep its geometry, resting position, scale, slide and parallax unchanged.
- [ ] Keep the branch absent on mobile.
- [ ] Reverse the branch cleanly when scrolling back.

**Done when:** the branch frames the completed arrival instead of preceding
the story.

### 5 — Invite light interaction

- [ ] Activate the existing office touch light only after the sentence is
  readable.
- [ ] Preserve its current mouse and touch gestures.
- [ ] Preserve its 50px pointer radius, 80px tap radius, brightness and fade.
- [ ] Clear pending touch state when reversing before the interaction range.

**Done when:** interaction feels like a final invitation to explore, not an
effect competing with the title.

### 6 — Preserve the city choreography

- [ ] Keep lens bokeh at its existing Scene 05 density.
- [ ] Keep the cloud band, skyline wave and harbour boat timings unchanged.
- [ ] Keep searchlights autonomous and the wheel hover behavior unchanged.
- [ ] Do not synchronize every city effect to the copy.
- [ ] Add no new light, particle or 3D layer.

**Done when:** the city remains alive behind the progressive copy without a
new synchronized “show”.

### 7 — Mobile sequence

- [ ] Sequence label → title → verified sentence → touch interaction.
- [ ] Keep the corner branch absent.
- [ ] Keep IFC's crown, the wheel, copy and vertical margin label clear.
- [ ] Preserve current mobile copy width and type size.
- [ ] Verify pointer-independent tap behavior without enlarging the light.

**Done when:** mobile communicates the same arrival without crowding IFC or
turning the interaction into a dominant glow.

### 8 — Reduced motion and reading order

- [ ] Use short stepped fades for label, title and sentence.
- [ ] Show the title without the animated sweep.
- [ ] Keep office touch lighting, wheel acceleration and branch motion still
  under reduced motion.
- [ ] Preserve label → title → sentence semantic order.
- [ ] Ensure reverse navigation leaves no hidden content interactive.

**Done when:** the complete arrival remains understandable as a composed
still frame.

### 9 — Final review

- [ ] Run `npm run build` once after the final adjustment.
- [ ] Inspect Scene 05 at 1440 × 900, 1178 × 1014, 390 × 844 and a short
  mobile viewport.
- [ ] Confirm the page remains enhanced and does not enter fallback.
- [ ] Confirm no overlap with IFC, wheel, branch, copy or margin label.
- [ ] Do not create screenshots or recordings.
- [ ] If sequencing resolves the density, do not resize or remove elements.

**Done when:** the existing composition is intact and the arrival sequence is
clear at all review sizes.

### 10 — Approval gate

- [ ] Present Scene 05 at <http://localhost:5173/#chapter-05>.
- [ ] Obtain explicit user approval.
- [ ] Record the decision in `narrative-spine.md` and `CHANGELOG.md`.
- [ ] Do not plan or change Scene 06 before approval.

**Done when:** the user approves Scene 05 and the controlled rollout can move
to Scene 06.

## Verification discipline

For each implementation item, inspect only Scene 05 and its mapped files. Run
only `npm run build` and inspect <http://localhost:5173/#chapter-05>. Do not
create screenshots or recordings.

## Next action

Complete step 1: create Scene 05's configuration, preserve every current
chapter value, and add the short camera hold and named reveal ranges.
