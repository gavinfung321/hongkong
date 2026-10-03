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
  the 02 afterglow unchanged.

### Priority F — Per-chapter withholding

- Decide for each chapter what it leaves out (for example 01 currently shows
  the ferry, junk, tower, skyline, moon, searchlights, bush, tree and
  petals at once).
- Success: every chapter has one subject and visible rest areas.

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
- [ ] Priority E: quieter sky and palette — built 2026-10-04, awaiting approval
- [ ] Priority F: per-chapter withholding
- [ ] Priority 2: test one chapter 05 foreground object
- [ ] Priority 3: one desktop and one mobile sequence review
- [ ] Update the changelog with only the final kept decisions

## Immediate next action

Review **Priority E: quieter sky and palette** in the browser (no
screenshots, user request, 2026-10-04), then Priority F: per-chapter
withholding.
