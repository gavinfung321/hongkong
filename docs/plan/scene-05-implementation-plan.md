# Scene 05 — Progressive Arrival Implementation Plan

**Status:** approved, 10 of 10 steps complete; callout visual review implemented
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

### 2 — Establish the Central arrival

- [x] Reveal the existing label first.
- [x] Bring in “City of Light” second.
- [x] Run the warm title sweep once the title is visible.
- [x] Hold the body sentence, branch and touch interaction for later beats.

**Done when:** the opening reads as an arrival at the city before explanation
or interaction competes for attention.

**Completed 2026-10-05:** the label enters over chapter progress 0.34–0.42,
the title follows over 0.42–0.5, and the title sweep occupies the beginning
of the dwell. All later material waits.

### 3 — Deliver the Two IFC fact

- [x] Reveal the existing verified sentence after the title.
- [x] Keep its wording, width, type and position unchanged.
- [x] Keep the entrance restrained and fully reversible.
- [x] Leave the title visible while the sentence arrives.

**Done when:** the visitor understands why Two IFC leads the composition.

**Completed 2026-10-05:** the sentence now fades in over dwell share
0.14–0.36 while the title remains visible. Reverse scrolling restores the
earlier title-only state.

### 4 — Frame the postcard

- [x] Bring the existing corner branch in with the body sentence on desktop.
- [x] Keep its geometry, resting position, scale, slide and parallax unchanged.
- [x] Keep the branch absent on mobile.
- [x] Reverse the branch cleanly when scrolling back.

**Done when:** the branch frames the completed arrival instead of preceding
the story.

**Completed 2026-10-05:** the branch now follows the sentence through the
existing `words` level, beginning after the body is already readable. Its
model, placement, slide, parallax and mobile gate are unchanged.

### 5 — Invite light interaction

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

### 6 — Preserve the city choreography

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

### 7 — Mobile sequence

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

### 8 — Reduced motion and reading order

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

## Pre-review interaction polish

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

## Interaction-prompt follow-up plan

The current disappearance is intentional for a one-time page-session hint,
but it leaves no instruction when the visitor returns to Scene 05. Treat the
prompt as a per-visit sequence instead (user request, 2026-10-05).

### P1 — Reset the skyline prompt per visit

- [x] Restore “Trace the skyline to light the city” after Scene 05 is fully
  left and the interaction level returns to zero.
- [x] Do not reset while the visitor is still inside Scene 05 or merely
  reverses within its interaction range.
- [x] Preserve the existing hint reveal range and city-light gesture.

### P2 — Add a second desktop prompt

- [x] After the skyline light is discovered, replace the first prompt with:
  “Join the wheel ride — hover to pick up speed.”
- [x] Keep this as the same restrained prompt line rather than adding another
  permanent copy block.
- [x] Show the wheel prompt only on fine-pointer desktop, because the current
  wheel acceleration is hover-only.
- [x] Hide the wheel prompt after the visitor first hovers the wheel.

### P3 — Preserve wheel behavior

- [x] Detect the existing wheel-hover state only to advance the prompt.
- [x] Do not change the wheel's normal speed, approximately 16× hover boost,
  easing, hit area, model or reduced-motion behavior.
- [x] Do not add click, tap, drag, sound or another wheel animation.

### P4 — Preserve mobile and reduced motion

- [x] On mobile, restore only the skyline prompt on each new Scene 05 visit.
- [x] Do not show the wheel prompt on touch devices until a wheel touch
  interaction actually exists.
- [x] Keep both prompts hidden in reduced motion and fallback.

### P5 — Verify before final review

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

## Target-callout redesign exploration

The current text prompts can disappear too quickly: any active desktop mouse
movement dismisses the skyline instruction, and the wheel instruction
dismisses as soon as the wheel hit area is entered. Explore a shorter,
targeted visual language before changing the implementation (user request,
2026-10-05).

### Current interaction facts

- [x] Desktop skyline lighting responds to mouse movement after its reveal
  range becomes active.
- [x] Mobile skyline lighting responds to a screen tap and fades normally.
- [x] Desktop wheel acceleration responds to hover.
- [x] Mobile wheel acceleration does **not** respond to touch; the wheel has
  no tap interaction today.
- [x] Reduced motion disables both interactive motion treatments.

### Recommended callout model

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

### Short-copy recommendation

- Desktop skyline: **“Light the skyline”**
- Desktop wheel: **“Hover me”**
- Mobile skyline: **“Tap the lights”**
- Mobile wheel, only if a tap interaction is approved: **“Tap the wheel”**

“Touch me” is not recommended for the current build: it is inaccurate for a
desktop hover and misleading on mobile while the wheel has no touch response.

### Mobile wheel decision

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

### Decision gate

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

## Mobile wheel-tap implementation plan

The wheel currently receives only the fine-pointer position used by its
desktop hover hit test. Touch events go to the city-light painting map, so
the wheel has no touch target or boost state. Add touch parity without
creating another wheel animation (user request, 2026-10-05).

### W1 — Reuse the existing wheel hit area

- [x] Listen only for non-mouse pointer-down events while Scene 05 is the
  active continuous-motion chapter.
- [x] Convert the tap position to normalized screen coordinates and reuse the
  existing projected wheel ellipse hit test.
- [x] Ignore taps outside the wheel and every tap in reduced motion.
- [x] Ensure a confirmed wheel tap is not also painted as a skyline-light
  tap.

### W2 — Apply the existing acceleration

- [x] Add a Scene 05 configuration value of 2.5 seconds for the mobile boost.
- [x] On a valid tap, drive the existing `wheelBoost` target to its authored
  16× value; do not add another rotation path or speed constant.
- [x] Restart, but never stack, the 2.5-second duration on another valid tap.
- [x] Ease back using the existing wheel-hover easing when the duration ends.

At the current boosted revolution time of roughly 15 seconds, 2.5 seconds
produces about one-sixth of a turn before easing. This should read clearly
without becoming a fairground spin.

### W3 — Connect the callout lifecycle

- [x] Show “Tap the wheel” only after the mobile skyline interaction has been
  discovered.
- [x] Dismiss the wheel callout only after a tap lands inside the live wheel
  hit area.
- [x] Reset the tap timer and sequential callouts after fully leaving Scene
  05.
- [x] Keep desktop “Hover me” tied to the unchanged hover behavior.

### W4 — Preserve accessibility and composition

- [x] Add no drag, sound, vibration or repeated-tap requirement.
- [x] Keep reduced motion still and omit both interactive callouts there.
- [x] Do not change wheel geometry, placement, normal speed, boost amount,
  lighting, fairground or camera.
- [x] Keep all callout coordinates responsive and editable in
  `src/story/scene05/config.js`.

### W5 — Verify before final review

- [x] Test wheel hits near the centre and rim plus misses immediately outside
  the ellipse at 390 × 844 and 320 × 720.
- [x] Confirm the boost lasts once, restarts without stacking and eases back.
- [x] Confirm wheel taps do not paint skyline lights and skyline taps do not
  accelerate the wheel.
- [x] Recheck desktop hover, scene exit/re-entry, reduced motion and fallback.
- [x] Run `npm run build` once after implementation; create no screenshots or
  recordings.

### 9 — Final review

- [x] Run `npm run build` once after the final adjustment.
- [x] Inspect Scene 05 at 1440 × 900, 1178 × 1014, 390 × 844 and a short
  mobile viewport.
- [x] Confirm the page remains enhanced and does not enter fallback.
- [x] Confirm no overlap with IFC, wheel, branch, copy or margin label.
- [x] Do not create screenshots or recordings.
- [x] If sequencing resolves the density, do not resize or remove elements.

**Done when:** the existing composition is intact and the arrival sequence is
clear at all review sizes.

### 10 — Approval gate

- [x] Present Scene 05 at <http://localhost:5173/#chapter-05>.
- [x] Obtain explicit user approval.
- [x] Record the decision in `narrative-spine.md` and `CHANGELOG.md`.
- [x] Do not plan or change Scene 06 before approval.

**Done when:** the user approves Scene 05 and the controlled rollout can move
to Scene 06.

**Decision (user approval, 2026-10-05): Scene 05 is approved as built.** The
arrival, callouts and mobile wheel tap are complete. Scene 06 may now be
planned.

## Verification discipline

For each implementation item, inspect only Scene 05 and its mapped files. Run
only `npm run build` and inspect <http://localhost:5173/#chapter-05>. Do not
create screenshots or recordings.

## Persistent callout dimming

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

## Callout visual review

Reviewed 2026-10-05 before any further visual change (user request). The
callouts are worth keeping. The interactions are invisible until someone
tries them, and a short labeled arrow is lighter than the earlier sentence.
The current treatment is heavier than the scene needs.

### 1 — The yellow line

The amber line is the callout’s left border, with a dark wash behind the
words. It is not needed. The arrow already shows where to look, and the line
does not point at the target. On the skyline callout it sits on the opposite
side from Two IFC, so the label reads as a small interface chip rather than a
caption in the sky.

**Recommendation:** remove the left border and the dark wash. Keep the cream
label and the warm arrow.

### 2 — Desktop skyline position

“Light the skyline” is at 74% across and 38% down. The corner branch enters
from the top-right and its foliage reaches into that same area, so the label
sits in the sprig. The branch placement stays frozen.

**Recommendation:** lower only this desktop callout to about 54% down, still
beside Two IFC’s shaft and above the wheel callout. Adjust the arrow angle
only if it no longer aims into the tower.

### 3 — Mobile skyline position

“Tap the lights” sits left of Two IFC, with a clear gap on a 390-wide phone.
It was kept there so it would not cover the copy. On a 320-wide phone the
copy and Two IFC leave only a narrow opening, so the label cannot sit on the
tower.

**Recommendation:** move it right until the arrow meets Two IFC’s left edge,
staying below the copy. Do not cover the tower or the sentence.

### 4 — Shorter mobile words

“Tap the lights” and “Tap the wheel” are the widest part of the mobile
callouts. The arrow already identifies the target, so the words only need to
name the action (user question, 2026-10-05).

**Recommendation:** use **“Tap me”** for both mobile callouts. Keep desktop
as “Light the skyline” and “Hover me”, because a desktop pointer hovers and
the skyline action is lighting rather than tapping.

### What to preserve

- Both arrows remain visible and dim only on their own target.
- The wheel callout stays beside the wheel.
- Desktop wording stays “Light the skyline” and “Hover me”.
- No change to the branch, camera, copy, wheel boost or city-light strength.
- No extra icon, box, shadow or second rule.

### Decision gate

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

## Next action

Scene 05 is approved. Continue with
[`scene-06-implementation-plan.md`](scene-06-implementation-plan.md).
