# High-Impact Depth and Atmosphere Plan

**Status:** simplified 2026-10-04. Work on one visible improvement at a time.

## Goal

Make the harbour feel deeper, calmer and more mysterious through a few changes
that are obvious in the normal experience. Do not add effects merely because
they are technically possible.

The important visual hierarchy is:

1. one clear landmark or vessel;
2. a supporting middle layer;
3. a restrained foreground or atmospheric layer;
4. enough darkness for the lights and silhouettes to breathe.

## Working rules

- A change must be clearly noticeable at normal size within a few seconds.
- Make one visual change per pass. Keep it, revise it or remove it before
  starting another.
- Do not change approved cameras, copy positions or vessel routes as part of
  atmosphere work.
- Prefer editing existing lights, geometry and layers over adding new particle
  systems or full-screen effects.
- Preserve reduced-motion behaviour and deterministic animation.
- If the improvement is ambiguous, do not ship it.

## Minimal review

Do not create full chapter matrices, contact sheets or repeated recordings.

For each pass, use only:

- one desktop before image and one desktop after image of the most affected
  scene;
- one mobile after image only when the mobile composition is affected;
- one short transition check only when the change moves or fades;
- one production build and a quick browser-console check.

Additional captures or performance measurements are required only when a real
problem is found. Do not capture every chapter for a local change.

## Keep as the current baseline

- The approved vignette stays. Do not add grain, paper texture or halftone.
- Existing cloud masses, harbour mist and depth haze stay at their current
  settings. Do not add more haze layers.
- Existing wakes, water reflections, searchlights and fireworks stay unless a
  specific scene review identifies a clear problem.
- The Star Ferry must not regain forward drift in chapter 03.
- The large bow-spray artwork remains removed.

## Priority 1 — Restore lighting hierarchy

This is the next implementation task and the highest-value refinement.

### Kowloon, scenes 01 and 02

- Reduce railing lanterns from every post to every second post.
- Preserve the two close lanterns that frame scene 01.
- Keep the three tall promenade lamps.
- Reduce lantern halo strength only if the reduced count is still too bright.
- Keep the Clock Tower floodlight dominant.
- Do not globally darken the scene or remove wet-paving reflections.

### Central, scenes 03 and 05

- Break up the five identical bright ferry-pier halls with deterministic dark
  and dim window bays.
- Reduce pier-hall glow by about 25–30% while retaining a few bright clusters.
- Increase spacing and dark gaps in the waterfront lamp line.
- Keep IFC brightest, the wheel second and the piers supporting.
- Do not change global exposure, IFC, the wheel, searchlights or the chapter
  reflection multiplier in this pass.

### Success condition

The waterfronts have visible dark gaps. Lights form a deliberate rhythm rather
than continuous dotted lines, and the principal landmarks lead immediately.

## Diagnosis after the lighting pass (user request, 2026-10-04)

Compared with Kage, the frames still lack depth, layers and a mysterious,
elegant mood. The cause is value structure, not detail: every frame is about
equally bright and equally detailed from front to back and edge to edge.
Depth comes from each farther layer being paler and softer than the one in
front of it; mystery comes from what is left in darkness. The user chose all
six directions below (user choice, 2026-10-04), in this order, one pass each.

### Priority A — Aerial perspective

- Distance compresses contrast toward a dim, city-lit violet near the
  horizon, darker higher up, instead of the current dark fog that only
  makes far things vanish.
- Back-row towers and their windows sink into the glow; the mountains become
  paler, flatter shapes; Kowloon's near edge stays dark and crisp.
- This replaces the depth haze's job rather than adding a layer: no new
  cards or bands.
- Success: the skyline reads as at least three receding planes in 01, 03
  and 05 without looking grey or washed out; IFC and the Clock Tower stay
  crisp.
- **Approved 2026-10-04 (user approval).** The fog now takes the sky dome's
  colour along each view ray (plum near the horizon, navy higher up, the
  old fog colour below the horizon, so the water is unchanged); density is
  unchanged. `src/scene/aerialFog.js` patches three.js's fog chunks once at
  start-up; `?off=aerial` restores the old fog. In 03 the ridges paled into
  distinct layers, but the skyline barely changed, so a depth fade was
  added (user request, 2026-10-04): on top of the chapter fog, everything
  more than 1220 m north (world −z) fades toward that sky colour, rising to
  55% at 1920 m, a third less on tower tops. IFC (z −1180) and the front
  row stay crisp; back rows recede in steps; the ridges go palest. Measured
  in the world, not from the camera, so the planes are the same in every
  chapter. No draw calls or textures added; no screenshots taken (user
  request).

### Priority B — Calm water

- The harbour is mostly near-black. Long vertical reflection streaks fall
  only under the strongest lights (IFC, the wheel, the moon, the Clock
  Tower, the vessels); glitter appears near those streaks, not across the
  whole width.
- Success: the water reads as quiet dark depth, with a few deliberate
  columns of light instead of scattered sequins.
- **Approved 2026-10-04 (user approval).**
  In `createWater.js`: the skyline shimmer at 0.045 (was 0.11), so the
  full-width band of glints under the city becomes a faint glow; the
  mirrored sky sheen 0.18 (was 0.28) with softer bands (contrast 0.9, was
  1.3); columns narrower and straighter (spread 1.1, was 1.5; row wobble
  0.4, was 0.6; swell sway 0.2, was 0.3). In `waterReflections.js`: longer
  columns under IFC (tail 0.4, was 0.25), the wheel (0.45, was 0.3) and the
  moon (0.3, was 0.15). The boats' reflections and the 05 boost are
  unchanged.

### Priority C — Foreground silhouettes

- The nearest layer is the darkest: the railing, the bauhinia bush and the
  tree lose most of their fill and read as dark shapes, with warm edges
  where the lanterns catch them. The lanterns themselves are unchanged.
- Success: the foreground frames the scene without competing with it.
- **Approved 2026-10-04 (user approval).** A `silhouette()` patch
  (`lamps.js`) keeps only a share of the moon and sky fill on a material;
  the lantern pools are emitted light and stay full, so they catch the
  edges warm. Fill kept: railing A–D stone, panels and lantern iron 0.35;
  bauhinia tree bark and leaves 0.3; bauhinia bush stems and leaves 0.3
  (`SILHOUETTE` in `createForeground.js`). The promontory railings are
  mid-ground and unchanged; lantern glass, glows, palms, tall lamps and
  petals unchanged.

### Priority D — Veiled moon

- Slightly lower moon brightness, with thin cloud passing slowly across it,
  so the focal light is partly concealed rather than fully revealed.
- Success: the moon still reads as the focal light but no longer dominates
  every frame.
- **Built 2026-10-04, awaiting approval.** The disc is drawn at 0.86 of its
  colour and the corona at 0.22 (was 0.26). A thin veil of cloud sits just
  in front of the disc: a seeded, tileable band of 18 soft violet-grey
  streaks (alpha 0.12–0.3 each, overlapping), 4 × 1.4 moon diameters,
  fading out at its edges, drifting sideways at 0.004 tiles a second (a
  streak takes about a minute to cross the disc). In reduced motion it holds
  still. Unfogged like the moon. The moon's water column is unchanged
  (`VEIL` in `createMoon.js`). Approved 2026-10-04 (user approval).

### Priority E — Quieter sky and palette

- A near-black navy zenith; the glow kept in a low band behind the skyline;
  clouds dimmer except near the moon; neon accents on supporting towers
  muted, leaving one warm accent per frame.
- Success: the palette feels restrained, and the landmarks' own colours
  stand out.
- **Built 2026-10-04, awaiting approval.** Zenith `skyTop` 0x0a0d1e (was
  0x141833); the horizon glow band over the lowest 0.24 of the dome (was
  0.3; the aerial fog follows). Clouds keep 0.65 of their brightness, back
  to full where the moon lights them (`CLOUD_QUIET`, mist unchanged). LED
  crowns and strips at 0.6 (`LED.level`). Central Plaza's bars and The
  Center's lines desaturated (0.35 / 0.3, was 0.6 / 0.55), the bars at 0.7
  and The Center's neon 0.5 (was 0.8). IFC, the wheel, the Clock Tower and
  the 02 afterglow unchanged. Approved 2026-10-04 (user approval).

### Priority F — Per-chapter withholding

- Decide for each chapter what it leaves out (for example 01 currently shows
  the ferry, junk, tower, skyline, moon, searchlights, bush, tree and
  petals at once).
- Success: every chapter has one subject and visible rest areas.
- **Built 2026-10-04, awaiting approval.** Visibility gates only; cameras,
  vessel routes and copy unchanged (`chapters.js`):
  - 01 (subject: the harbour at dusk, framed by railing, tree and bush):
    petals 0.5, skyline 0.75. The searchlights stay at 0.6 on desktop
    (01 and 05 only, per `atmosphere.md`; briefly removed, restored by user
    request, 2026-10-04).
  - 02 (subject: the Clock Tower and afterglow): desktop skyline 0.6 and
    Mid-Levels lights 0.7, as mobile already did.
  - 03 (subject: the ferry) and 04 (subject: the junk): petals 0.3 out on
    the open water.
  - 05 (IFC and the searchlights) and 06 (the fireworks) were already
    restrained and are unchanged.
  - Approved 2026-10-04 (user approval).

## Priority 2 — Add one physical foreground cue to chapter 05

Only begin this after priorities A–F are approved.

- Test one dark harbour-edge object in a lower corner: preferably a bollard and
  short chain, or a cropped pier structure.
- It must be visibly attached to the bottom or side of the frame and move with
  stronger parallax than the skyline.
- Keep it away from the copy, IFC and observation wheel.
- Use one object only. Do not combine several foreground decorations.
- Omit or simplify it on mobile if it crowds the composition.

### Success condition

Chapter 05 feels like arrival at a real harbour edge instead of a distant city
view. The foreground supports the scene without becoming a second subject.

If the first prototype looks pasted on or the improvement is not obvious,
remove it and stop this task.

### Built 2026-10-04, awaiting approval

- The bollard and short chain (user choice, 2026-10-04), desktop only. A
  cast-iron mooring bollard (flange, waisted body, lipped head, domed cap;
  0.83 m) in the lower right of the 05 desktop frame, its base cropped by
  the bottom edge, with a short chain of oval links sagging from its neck
  toward the left and out of frame. Dark iron (0x26211d), lit only by the
  scene's moon and sky light.
- Placed from the 05 desktop pose: 1.9 m ahead, 1.4 m right, its head
  0.2 m above eye height (the 05 camera looks steeply up, so only things
  near eye height show at the bottom of the frame). Roughly 74–87% across
  and the bottom 17% of a 1440 × 900 window.
- Parallax: it follows 92% of the mouse parallax shift, so it moves about
  ten times more than the skyline but never swings out of frame.
- A `bollard` gate (0 everywhere, 1 in desktop 05) fades it in only in the
  last 15% of the move into 05 and out in the first 10% of the move to 06.
  Mobile 05 is unchanged.
- `src/scene/createBollard.js` (`BOLLARD`), `rig.shift` in `cameraRig.js`,
  gate in `main.js` and `chapters.js`.
- Kept by the user, 2026-10-04. Not repeated elsewhere: 01 and 02 are
  already framed by railing, tree, bush and palms, and the 03, 04 and 06
  cameras are on the water or in the air, where a bollard would float.

### 03 channel buoy (user choice, 2026-10-04), approved 2026-10-04

- The one open-water equivalent: a dark red port-hand channel buoy
  (fendered float, pillar, can topmark; 2.6 m above the water) 20 m ahead
  and 5.8 m right of the 03 desktop camera, in the lower right (about 64–70%
  across, 59–72% down), right of the ferry and clear of IFC's and the
  wheel's water columns. It heaves 7 cm and rolls and pitches about 2° with
  the swell; still in reduced motion. Lit only by the moon and sky.
- A `buoy` gate (1 in desktop 03 only) fades it in over the second half of
  the move into 03 and out between 20% and 50% of the move to 04. Mobile 03
  and chapter 04 unchanged.
- `src/scene/createBuoy.js` (`BUOY`), gate in `main.js` and `chapters.js`.

### Phone versions (user choice, 2026-10-04), approved 2026-10-04

- Mobile 05 bollard: 3 m ahead, 0.65 m right, its head 0.55 m below eye
  height (the phone camera looks up less, so more shows): about 63–97%
  across and the bottom 15% of the frame, under IFC's foot (IFC ends at
  80% down).
- Mobile 03 buoy: IFC's and the wheel's water columns cross the lower
  right, so a smaller buoy (0.45 scale, about 1.2 m above the water) sits
  4.6 m out in the lower left, about 76–96% down, just under the ferry's
  hull.
- Both are repositioned per screen size (`setBreakpoint`); the `bollard`
  and `buoy` gates are now 1 in mobile 05 and mobile 03 too.

## Priority 3 — Final chapter balance

Only after priorities 1 and 2:

- Review the settled 01–06 sequence once at desktop size and once on mobile.
- Correct only obvious hierarchy problems: an over-bright supporting light, a
  foreground obstruction or an atmosphere layer hiding the subject.
- Prefer reducing or removing elements over adding new ones.
- Stop when every chapter has one clear subject and the transitions feel calm.

## Do not pursue

These ideas are removed from the active plan because their likely visual gain
is too small for their implementation and review cost:

- additional mist or haze bands;
- near-lens moisture or spray particles;
- chapter 04 rope or rigging overlays;
- harbour drizzle or rain;
- animated grain, halftone or flicker overlays;
- additional full-screen texture treatments;
- separate reflection-breathing systems;
- more searchlights, particles or decorative foreground cards.

The existing light-breathing experiment is not a priority. Do not spend more
time tuning it. If it is not clearly beneficial in a normal five-second view,
disable or remove it rather than expanding it.

## Short checklist

- [ ] Priority 1: simplify Kowloon and Central waterfront lighting — built
  2026-10-04, awaiting approval
- [ ] Approve or remove the existing light-breathing experiment
- [x] Priority A: aerial perspective — approved 2026-10-04
- [x] Priority B: calm water — approved 2026-10-04
- [x] Priority C: foreground silhouettes — approved 2026-10-04
- [x] Priority D: veiled moon — approved 2026-10-04
- [x] Priority E: quieter sky and palette — approved 2026-10-04
- [x] Priority F: per-chapter withholding — approved 2026-10-04
- [x] Priority 2: test one chapter 05 foreground object — 05 bollard, 03 buoy and their phone versions approved 2026-10-04
- [ ] Priority 3: one desktop and one mobile sequence review
- [ ] Update the changelog with only the final kept decisions

## Immediate next action

Priority 3: final chapter balance (no screenshots, user request,
2026-10-04).
