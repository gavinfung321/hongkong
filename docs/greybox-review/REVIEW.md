# Grey-box review notes (build steps 2–11)

The screenshots in this folder show the 12 hold poses: `01-desktop.png` …
`06-mobile.png`. Desktop is 1440 × 900 and mobile is 390 × 844. Compare each
one with its storyboard PNG in `docs/storyboards/`.

## Running it

- `npm run dev`, then open `http://localhost:5173/`.
- Add `?hold=3` to jump straight to a chapter's hold (dev only). Add
  `?motion=reduced` for Stepped mode, `?fallback` for the poster-only page, or
  `?fps` for the performance overlay.
- Add `?debug` (dev only) for the tuning tools:
  - **O** toggles the storyboard overlay, and **[** / **]** change its opacity.
  - **R** shows the copy-safe region, and **P** shows the composition probe
    (landmark boxes and pass/fail against the section 7 targets).
  - **1–6** jump to a hold, **F** toggles a free orbit camera, and **C** logs
    the current pose.

## Deviations from the storyboards (please confirm)

1. **02 desktop — IFC and wheel.** They sit behind the Clock Tower rather than
   out of frame. The camera is on the IFC–tower line, so the tower hides them.
2. **03 mobile — IFC is larger than in the PNG.** At the PNG's size it would
   need a camera far outside the harbour. Its right edge reaches about 98%
   (target 94%).
3. **04 mobile — IFC is a cropped edge cue** at the right edge, for the same
   reason.
4. **04 — wheel faded out (both viewports).** Framing alone left it peeking
   past the junk's stern, so it fades out while small and distant, then fades
   back in on the way to 05.
5. **05 — wheel at true scale.** The PNG draws it about 3.5× too big compared
   with IFC (frames 01 and 03 don't). It keeps its place left of IFC. To fit
   both, the wheel moved about 50 m west of its first position, and the
   desktop camera sits about 420 m from IFC instead of the 650–700 m hint.
   That hint would crop IFC's crown.
6. **01 mobile** is within about 3% of every target. IFC's right edge is at 91%
   (target 88%) and the wheel's left edge at 70% (target 73%).
7. **02 mobile** has no water strip at the bottom, because the lowered tower
   and the railing fill it.
8. **01 desktop — IFC moved right (your request).** It sits at about 78–83%
   instead of the PNG's 70–74%, so the junk's sails no longer hide it. The
   camera moved about 6 m east along the promenade to do this. The copy
   moved 2% right to stay clear of the Clock Tower.
9. **Brief wording.** The brief swaps the fore and mizzen sail labels in 7.4.
   The geometry follows the PNG.

Everything else is within ±3% of its section 7 target.

## Checked automatically

- **Composition:** the probe passes for all 12 poses except the boundary cases
  above.
- **Copy:**
  - All copy fits its region at 16 px body text on mobile, and no landmark
    box overlaps copy at any hold.
  - The 04 sails never cross the copy while it is visible.
  - Copy is fully visible through each hold window, then fades out before the
    camera moves far.
- **Camera paths:**
  - The camera never passes within 2.5 m of the tower, palms or railing on
    desktop, or within about 1.7 m on mobile.
  - It stays about 1.5 m or more above ground or water.
  - Pitch changes by about 25° at most in a chapter (05 → 06 on mobile; the
    limit is 30°), and roll is always 0.
  - Waypoints (`via` in `chapters.js`) route the 01 → 02 and 02 → 03 paths
    around the palms and the tower.
- **Behaviour:**
  - Deep links and the 06 "Return to the harbour" link land on the hold pose
    (with the veil for big jumps).
  - Stepped mode, `?fallback`, and forced WebGL context loss (switches to the
    poster within 2 s) all work.
- **Scope:** no loaders, post-processing, custom shaders, particles, audio,
  or shadows. `public/` holds only `.gitkeep` files.

## Known grey-box artifacts

- From mid-harbour (05), the placeholder water shows a faint repeating
  pattern. The final water will replace it. Fixing it now would need a custom
  shader, which is out of scope.
- The burst markers in 06 are flat rings at the brief's sizes, which are large.
  They are placement markers, not fireworks.

## Still needs your phones

iPhone 11 and iPhone 13 frame rates, and the Safari toolbar check. See
`PERFORMANCE.md` for the step-by-step test.
