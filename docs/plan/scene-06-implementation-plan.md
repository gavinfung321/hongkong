# Scene 06 — Afterimage Implementation Plan

**Status:** approved, 10 of 10 steps complete
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/#chapter-06>

## Goal

Turn Scene 06 into a quiet ending. The existing firework loop continues, and
the approved afterimage arrives in two beats: one sentence gathers, then the
resolving lines fade in. The harbour should feel as if it remains after the
light has gone.

## Frozen scope

Do not change:

- desktop or mobile cameras;
- firework burst positions, sizes, colours, timing, strength or smoke;
- IFC, wheel, skyline, moon, mist or reflections;
- the footer, its statement, or the way fireworks soften as the footer rises;
- Scene 05 or any earlier scene.

Do not add another illustration, particle system, burst, vessel or foreground
object. Scene 06 remains an ending, not a second show.

## Current state

- Scene 06 holds for 50svh on the existing camera. The label and “Afterglow”
  arrive on approach, then the closing paragraph fades in.
- The fireworks sentence is gone (user request, 2026-10-05). The remaining
  paragraph is cream, left-aligned with the title, and set at the lead size
  (user request, 2026-10-05).
- The firework loop, smoke, cameras and footer softening are unchanged.
- Steps 9 and 10 are still open for review.

## Chosen technique

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

## Files in scope

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

## Implementation checklist

### 1 — Give Scene 06 one configuration

- [x] Create `src/story/scene06/config.js`.
- [x] Move chapter `06`’s current camera, copy, visibility, fog, vessels,
  bursts, smoke and probes into it without changing any value.
- [x] Add a short camera-held dwell, about 50svh, so the two beats can be read.
- [x] Add named ranges for the label, title, gathering sentence and resolving
  lines.
- [x] Keep the new timing in that configuration.

**Done when:** Scene 06 has one readable configuration and gains reading time
without a new camera path.

### 2 — Establish the ending

- [x] Reveal the existing label first.
- [x] Bring in “Afterglow” second.
- [x] Hold both beats until the title is readable.
- [x] Keep the kicker, title and left-column placement.

**Done when:** the opening reads as an ending before the afterimage begins.

### 3 — Gather the sentence

- [x] Replace the live paragraph with the approved gathering sentence.
- [x] Close its letter-spacing with the scroll, from wide to its normal measure.
- [x] Keep the motion reversible.
- [x] Keep the sentence inside the dark left column, clear of the bursts.

**Done when:** the sentence gathers in place and the fireworks remain the
picture.

### 4 — Resolve the crossing

- [x] Fade in the approved resolving lines after the sentence has gathered.
- [x] Keep them quieter and smaller than the sentence.
- [x] Leave the sentence visible while they arrive.
- [x] Reverse them cleanly when scrolling back.

**Done when:** the visitor understands that the light goes and the harbour
stays.

### 5 — Leave the fireworks independent

- [x] Keep the 8-second burst loop, colours, sizes and smoke unchanged.
- [x] Do not sync individual bursts to the words.
- [x] Keep the footer’s existing smoke softening.
- [x] Add no new light, particle or 3D layer.

**Done when:** the sky keeps its own rhythm behind the two beats.

### 6 — Mobile sequence

- [x] Sequence label, title, gathering sentence, then resolving lines.
- [x] Keep the sentence from overflowing the copy column.
- [x] Keep the bursts right of the copy and above IFC’s crown.
- [x] Use a shorter tracking range if the wide spacing would clip.

**Done when:** a phone reads the same ending without covering the fireworks.

### 7 — Reduced motion and reading order

- [x] Show the sentence at its final spacing, without the gathering motion.
- [x] Step the resolving lines in at the middle of their range.
- [x] Keep the fireworks still under reduced motion, as they are now.
- [x] Preserve label, title, sentence, resolving lines as the reading order.
- [x] Ensure reverse navigation leaves no hidden line interactive.

**Done when:** the ending remains understandable as a still frame.

### 8 — Footer handoff

- [x] Let the two beats leave with the existing copy fade as the footer rises.
- [x] Do not change the footer statement, links or colophon.
- [x] Do not hold the chapter open over the footer.

**Done when:** the afterimage ends and the return to the harbour begins.

### 9 — Final review

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

### 10 — Approval gate

- [x] Present Scene 06 at <http://localhost:5173/#chapter-06>.
- [x] Obtain explicit user approval.
- [x] Record the decision in `narrative-spine.md` and `CHANGELOG.md`.

**Done when:** the user approves Scene 06.

## Verification discipline

For each implementation item, inspect only Scene 06 and its mapped files. Run
only `npm run build` and inspect <http://localhost:5173/#chapter-06>. Do not
create screenshots or recordings.

## As built (steps 1–8, 2026-10-05)

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
