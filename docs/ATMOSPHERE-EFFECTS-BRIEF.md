# Atmosphere and Effects Brief

**Status:** Proposed for review 2026-10-02. Planning document only. Do not begin
this pass until the current build step is complete and its screenshots are
approved.

This brief defines the final atmospheric treatment across the six-chapter
Victoria Harbour journey. It builds on the working scene and the approved
`ASSET-INTEGRATION-BLUEPRINT.md`; it does not replace the camera journey,
landmarks, vessels, water or interface.

---

## 1. Goal

Turn the existing constructed harbour into one continuous cinematic night:
dusk-blue at the Kowloon edge, increasingly luminous across the water, then
quietly expansive beneath the final fireworks.

Atmosphere should create depth, scale and emotional progression. It must not
hide weak geometry, overwhelm the landmark of a chapter, or become a collection
of unrelated visual effects.

The target is an illustrated, neo-vintage Hong Kong night with restrained
photographic richness:

- navy and aubergine shadow structure;
- coral warmth near the horizon and sails;
- cyan edge light and broken water glints;
- warm practical lights;
- humid harbour depth;
- subtle printed texture;
- calm motion punctuated by the final fireworks.

---

## 2. Systems already built — retain them

The following are working foundations, not placeholders to rebuild:

| Existing system | Current role | Decision |
|---|---|---|
| Exponential scene fog | Chapter depth and distance | Retain; tune through chapter config |
| Mountain-foot mist | Separates ridge, skyline and water | Retain; do not duplicate with an opaque card |
| Procedural water and dynamic reflections | Reflects IFC, Clock Tower, vessels, moon and skyline | Retain as the only primary reflection system |
| Local light glows | Lamps, windows, wheel, tower and vessel lights | Retain as the all-device baseline |
| Moon disc and halo | Chapter 01 focal light and continuity cue | Retain |
| Near/far Bauhinia petals | Recurring organic motion | Retain; replace only their texture if approved |
| Bauhinia tree and palms | World-space foreground depth | Retain |
| City-level control | Keeps IFC dominant in 05–06 | Retain |
| Four chapter-06 burst markers | Approved firework positions | Replace in place; do not recompose |
| Adaptive pixel ratio and `?fps` overlay | Protects phone performance | Retain and extend to effect quality |
| Stepped reduced-motion mode | Static chapter poses | Retain; every new effect needs a still state |

No atmospheric layer may force a new camera pose or move an approved copy-safe
region.

---

## 3. Rendering strategy

Use a hybrid approach:

1. **Geometry and procedural systems** provide lighting, water response,
   depth, parallax and deterministic motion.
2. **Selected transparent WebP artwork** provides organic detail: clouds,
   low mist, spray, firework bursts, smoke and embers.
3. **One fixed screen-texture layer** provides restrained vignette, grain and
   halftone.
4. **Existing halo meshes and emissive materials** remain the primary glow
   technique on every device.

### Bloom decision

Do not make full-screen bloom a dependency of the look.

- First approve all chapters using the existing local glow sprites and emissive
  materials.
- Afterwards, A/B test one thresholded, half-resolution bloom layer on desktop.
- Only the brightest lamps, IFC crown, Clock Tower faces, wheel hub and
  firework cores may feed it.
- Keep radius soft and strength low. Dark buildings, water and copy must not
  bloom.
- Enable it on mobile only if the iPhone 11 still achieves at least 30 fps
  average and 24 fps 1% low through a complete scroll pass.
- If bloom costs more than roughly 4 ms of GPU time on the reference laptop or
  causes visible resolution pumping on a phone, omit it. The local glow system
  remains the approved fallback.

No depth of field, motion blur, chromatic aberration, lens distortion, SSAO or
screen-space reflections are planned. They add cost or visual instability
without helping the approved compositions.

---

## 4. Atmospheric depth model

Every chapter can use four depth bands, but not every band must be visible.

| Band | Content | Behaviour |
|---|---|---|
| Near lens | Large petal, very rare bokeh, spray droplet | Strong parallax; brief; never covers copy |
| Foreground/world | Tree, railing, palms, vessel spray | Anchored in 3D and depth tested |
| Midground | Vessels, low harbour mist, water glints | Moves with the world; establishes scale |
| Far sky | Clouds, high haze, fireworks and smoke | Camera-facing; slowest parallax; no depth writing |

Transparent layers use soft alpha edges, stable render order and shared
textures. Avoid stacking multiple broad semi-transparent cards over the same
pixels: it produces grey veils, sorting errors and unnecessary overdraw.

### Fog versus mist

- Scene fog handles distance continuously.
- Existing mountain mist remains attached to the ridge foot.
- The generated `harbour-mist.webp` supplies at most one or two narrow local
  bands near water or between skyline layers.
- Never use mist as a full-screen wash.
- The Clock Tower, junk sail, IFC crown and active firework core must remain
  crisp enough to lead their chapters.

---

## 5. Chapter colour and light progression

The exact values are tuning starts, not a replacement for visual review.

| Chapter | Emotional state | Dominant shadows | Controlled accents | Fog start |
|---|---|---|---|---:|
| Hero / 01 — Harbour at Dusk | Anticipation | Deep navy and aubergine | Coral horizon, cream wordmark, cyan water edge | `0.00045` |
| 02 — The Kowloon Edge | Intimate heritage | Aubergine-black stone | Warm clock and lamps, restrained cyan rim | `0.00045` |
| 03 — Across the Water | Movement | Blue-violet harbour | Ferry cream/green, cyan and amber glints | `0.00045` |
| 04 — Red Sails | Dramatic pause | Deepest indigo | Coral sails and warm cabin light | `0.00063` |
| 05 — City of Light | Urban radiance | Cool midnight blue | IFC cream, wheel pink, cyan reflections | `0.00045` |
| 06 — Afterglow | Release and distance | Open violet-black sky | Warm/coral/cyan fireworks | `0.00036` |

Rules:

- Interpolate atmosphere continuously between chapters. Do not switch grades
  at section boundaries.
- IFC remains the brightest building in 01 and 05. Fireworks may exceed it
  locally in 06 but must not lift the whole sky.
- Chapter 04 is the darkest scene so the red sail reads immediately.
- Chapter 06 has the clearest atmosphere and broadest dark sky.
- Practical light remains warm; edge and reflected light may be cyan. Avoid
  making every object both colours at once.

### Tone mapping

The current materials were tuned without a global post-process grade. Do not
enable a new tone mapper and accept its defaults. If ACES filmic tone mapping
is tested, capture all 12 approved views before and after, then retune exposure,
emissive strengths and the water as one coordinated change. Reject it if the
cream lights turn grey, coral sails lose saturation, or shadow separation
collapses.

---

## 6. Effect families

### 6.1 Coral clouds

Use `coral-clouds.webp` as a distant sky card.

- Hero / 01 desktop: one broad band above the skyline at approximately
  12–22% opacity.
- Hero / 01 mobile: one fainter crop, maximum 12% opacity.
- 05: optional trace at no more than 8%; city light is the subject.
- 06: one dim high band beneath or behind the fireworks at 10–18% opacity.
- Drift laterally by roughly 1–2% of viewport width over one chapter.
- Clouds move more slowly than mountains and never reveal a rectangular edge.
- No billowing simulation is required.

### 6.2 Harbour mist

Use `harbour-mist.webp` only for local depth separation.

- 01: one faint horizon band; keep the Clock Tower silhouette clean.
- 02: a low distant-water band, never across the tower.
- 03: a narrow layer behind the ferry and before the island skyline.
- 04: slightly denser behind the junk, never across the red sail.
- 05: at most two very soft layers separating water, podiums and towers.
- 06: fade local harbour mist as the camera tilts into the clearer sky.
- Drift opposite to the clouds by roughly 0.5–1% of viewport width per
  chapter.

### 6.3 Bauhinia petals

- Keep the existing near/far particle counts and harbour-wind direction first.
- Replace the generated canvas texture with the approved WebP petal only after
  an A/B test.
- 01–03: normal density, with near petals fading before the Clock Tower close
  view.
- 04: sparse; none may cross the principal red sail during the hold.
- 05: 60% of normal density as currently configured.
- 06: zero petals. Fireworks own the sky.
- No petal may sit over body copy for more than a moment.

### 6.4 Harbour spray and wakes

The procedural wakes remain. `harbour-spray.webp` adds contact and speed, not a
second wake.

- 03: one main camera-facing card attached to the ferry waterline; one smaller
  differently cropped card only if necessary.
- Tie opacity to vessel speed. At the chapter hold, spray remains visible but
  calmer.
- Scale pulse is limited to 5–8% and must not reveal a loop.
- 04: optional smaller, lower-opacity card at the junk hull.
- Keep spray below mid-frame and away from copy.
- Mobile uses fewer/lower-resolution cards before reducing the procedural wake.

### 6.5 Searchlights

Searchlights are a restrained Central-city effect, not a constant spectacle.

- Build them as translucent tapered beam meshes; they do not cast real lights
  or shadows.
- Desktop 01: at most two extremely faint distant beams behind Central.
- Desktop 05: two or three beams may sweep slowly above the skyline.
- Mobile 01: none. Mobile 05: no more than two, with lower opacity.
- 02–04: none; they distract from the close subjects.
- 06: fade them before fireworks become dominant.
- Each sweep lasts roughly 12–18 seconds with different phases. Do not cross
  and form a bright white knot.
- Reduced motion holds the beams in one dim position.

### 6.6 City bokeh

This is conditional polish, not a required layer.

- Use procedural soft circles; no photographic bokeh asset is needed.
- Maximum eight on desktop and four on mobile.
- Only during the 03→05 movement, at the extreme frame edges or near lens.
- Bokeh never appears over a chapter title, IFC crown, wheel or vessel.
- If it reads as dust, UI decoration or a lens-filter cliché, remove it.

### 6.7 Fireworks

Replace the four ring markers without changing their configured screen
positions and approximate sizes.

#### Composition

- Desktop: four visible burst roles using the existing warm, coral, cyan and
  coral arrangement.
- Mobile: two dominant bursts, one supporting burst and one fading remnant;
  preserve the approved negative space for copy.
- IFC's crown remains the architectural anchor at the bottom of the frame.

#### Construction

- Use `firework-burst.webp` as a shared alpha texture, rotated, mirrored,
  scaled and tinted to prevent obvious duplication.
- Use a small set of camera-facing quads or instanced sprites; no thousands of
  free particles are required.
- Add a compact core halo from the existing glow system.
- Bursts reveal quickly, expand gently and fade more slowly: approximately
  0.2–0.3 seconds in, 1.2–2 seconds out.
- Avoid hard radial scaling from zero. Begin around 70% size with low opacity
  so the burst reads as ignition rather than a growing sticker.

#### Sequence

- Start the sequence as the 05→06 transition opens the sky.
- Use a deterministic 7–9 second loop with staggered bursts. Entering chapter
  06 always begins at a visually composed point.
- Never fire all bursts simultaneously.
- A burst may continue fading after the next begins, creating visual history.
- No full-screen flash and no rapid luminance flicker. Keep flashes comfortably
  below three per second in any region of the frame.

#### Smoke and embers

- Two or three `firework-smoke.webp` wisps on desktop; one on mobile.
- Smoke renders behind bursts, expands slowly and fades over 3–5 seconds.
- Tint smoke toward violet/coral rather than neutral grey.
- Use `firework-embers.webp` as sparse falling instances beneath bursts.
- Embers live 1.5–3 seconds and remain outside the copy field.
- Do not let additive blending turn overlapping smoke into white rectangles.

#### Reduced motion

- Show a balanced static arrangement of burst, faint smoke and a few embers.
- No expansion, falling, flicker or looping.
- A short opacity crossfade during the chapter veil is acceptable.

---

## 7. Global texture treatment

The global treatment is screen-fixed and decorative. It sits above the WebGL
canvas but below all HTML copy and controls.

### Vignette

- One broad radial or elliptical gradient.
- Darken corners by approximately 8–14% on desktop and 5–10% on mobile.
- Keep the centre and all copy-safe regions visually open.
- Chapter 06 uses the weakest vignette because the sky should feel expansive.

### Grain

- Use one small original monochrome texture, ideally under 30 KB.
- Opacity approximately 2–3% desktop and 1.5–2% mobile.
- Static by default. Do not move it every frame; animated grain can shimmer on
  phone displays and wastes compositing work.
- Grain must not reduce small-text legibility.

### Halftone

- Restrained printed-dot or fine diagonal pattern, strongest in midtones rather
  than across bright lights.
- Opacity approximately 2–4% desktop and 1–2% mobile.
- Scale it so it reads only when looking closely; it must not create moiré on
  the water, IFC facade or iPhone display.
- Disable it independently if a phone screenshot shows aliasing.

These layers never intercept pointer events and disappear from print and the
poster-only accessibility fallback if they reduce readability.

---

## 8. Motion hierarchy

At any moment, one motion family leads and the rest recede.

| Chapter | Leading motion | Supporting motion | Suppressed motion |
|---|---|---|---|
| 01 | Slow camera push and water | Petals, subtle clouds | Strong searchlights |
| 02 | Camera approach / tower parallax | Palm sway, distant mist | Petal swarm, beams |
| 03 | Ferry travel and wake | Spray, water glints | Searchlights, bokeh clutter |
| 04 | Junk passage and sail silhouette | Small wake, sparse petals | Bright city animation |
| 05 | Camera rise and wheel rotation | Water reflections, slow beams | Near foreground effects |
| 06 | Firework sequence | Smoke and embers | Petals, wheel emphasis, beams |

No loop should be perfectly synchronized with another. Slow ambient effects
use seeded phase offsets so reloads are visually stable but not mechanical.

---

## 9. Quality tiers and adaptive behaviour

Add an atmosphere quality state separate from the existing pixel-ratio cap.

### High

- Desktop default.
- All approved cards, normal petal count, smoke/embers, searchlights and global
  texture.
- Optional bloom only after its performance gate passes.

### Medium

- Mobile default.
- Fewer transparent cards, 60–70% particle counts, one smoke wisp, no bokeh,
  reduced halftone and no bloom by default.

### Low

- Enter after pixel ratio has already reached 1.0 and the rolling frame rate
  remains below 28 fps on mobile or 45 fps on desktop.
- Remove bokeh and secondary spray first.
- Halve ember and far-petal counts.
- Reduce clouds/mist to one layer each.
- Freeze searchlight movement before removing the beams.
- Keep the hero subjects, water reflections and principal firework bursts.

Quality may step down once per session; do not raise it again during the same
visit. Avoid visible popping by changing only during a veil or when an effect is
already near zero opacity.

---

## 10. Loading and memory budget

Use the approved optimized WebP candidates from `docs/references/production-candidates/`.
Copy only accepted production versions into `public/` during implementation.

Suggested production placement:

```text
public/
  cutouts/
    bauhinia-petal.webp
    harbour-spray.webp
  atmosphere/
    coral-clouds.webp
    harbour-mist.webp
    firework-burst.webp
    firework-smoke.webp
    firework-embers.webp
  textures/
    grain.webp
    halftone.webp
```

Rules:

- Preload only Hero / 01 atmosphere.
- Load spray before the viewer reaches 03.
- Begin loading fireworks, smoke and embers during 04, so 06 is ready before
  the 05→06 transition.
- Reuse one GPU texture for all instances of the same effect.
- Release rejected A/B-test textures; do not leave both full tree cards and the
  procedural tree resident.
- Keep the existing asset targets: petal under 100 KB, spray under 250 KB,
  burst under 250 KB, smoke/mist under 300 KB each and clouds under 350 KB.
- Grain plus halftone should total under 80 KB.
- Aim for no more than 12 additional transparent draw calls in chapters 01–05
  and 18 in chapter 06.
- Keep total peak draw calls under 100 and triangles under 150k after effects.

---

## 11. Proposed module boundaries

Keep effect configuration in data rather than scattering chapter checks through
the render loop.

```text
src/
  data/
    atmosphere.js          chapter values, quality tiers, asset URLs
  scene/
    createAtmosphere.js    cloud and mist cards
    createSpray.js         vessel-attached spray
    createSearchlights.js  inexpensive beam meshes
    createFireworks.js     bursts, smoke and embers
  ui/
    textureOverlay.js      vignette, grain and halftone state
```

`main.js` should only create the systems, pass the current chapter segment,
quality and time, and call their update methods. It should not contain
firework timing tables or per-chapter opacity constants.

Suggested data shape:

```js
{
  id: '05',
  atmosphere: {
    clouds: 0.08,
    mist: 0.18,
    petals: 0.6,
    searchlights: 1,
    vignette: 0.08,
    grain: 0.025,
    halftone: 0.03,
    fireworks: 0,
  },
}
```

Interpolate values with the same chapter segment used by camera and fog.

---

## 12. Implementation and review order

Stop for screenshots and performance measurement after each numbered stage.

1. **Global texture proof:** vignette, static grain and halftone on chapter 01
   only. Check text and water aliasing.
2. **Petal asset swap:** replace only the texture, retaining existing motion
   and counts. Compare code and WebP versions.
3. **Cloud and local mist:** add one card at a time to 01, then extend through
   05. Validate transparent edges and depth order.
4. **Ferry spray:** integrate 03, then decide whether 04 needs a smaller use.
5. **Searchlights:** prove 05 desktop, then author the reduced mobile version
   and subtle 01 version.
6. **Firework burst replacement:** replace the four markers with static WebP
   states at their existing positions.
7. **Firework animation:** add deterministic reveal/fade timing.
8. **Smoke and embers:** add only after the bursts pass composition and
   performance checks.
9. **Chapter colour progression:** tune sky/fog/light/exposure interpolation
   across all transitions.
10. **Optional bloom A/B test:** last, with measured acceptance or rejection.
11. **Adaptive quality:** implement and deliberately force High/Medium/Low in
    development for comparison.
12. **Full acceptance pass:** all viewports, reduced motion, fallback and both
    iPhones.

---

## 13. Acceptance checks

The atmosphere/effects pass is complete when:

1. The six chapters feel like one continuous evening rather than six colour
   presets.
2. Each hold still has one unmistakable subject: harbour, Clock Tower, ferry,
   junk, IFC/wheel, then fireworks.
3. Clouds, mist and smoke show no rectangular borders against dark or bright
   sky.
4. No transparent layer crosses a copy-safe region strongly enough to reduce
   normal-text contrast below 4.5:1.
5. The Clock Tower, junk sail and IFC crown remain crisp at their hero holds.
6. Water reflections remain aligned with their sources and never become a
   static photographic plate.
7. Ferry spray follows the ferry without sliding, repeating visibly or reading
   as a second wake.
8. Searchlights remain subordinate, do not produce bright crossing knots and
   disappear before the fireworks dominate.
9. The four firework roles preserve the approved 06 composition on desktop and
   mobile. Bursts do not all ignite together or create full-screen flashes.
10. Grain and halftone are felt more than seen, with no water shimmer, facade
    moiré or loss of text clarity.
11. Reduced-motion mode has no drifting clouds, moving mist, petal fall,
    searchlight sweep, expanding burst, falling ember, wheel rotation or
    animated texture.
12. Fallback mode remains a complete readable story and does not depend on
    WebGL effects.
13. At 1440 × 900, average performance remains at least 50 fps with a 1% low
    of 40 fps or higher.
14. On iPhone 11 and iPhone 13, average remains at least 30 fps with a 1% low
    of 24 fps or higher through a complete production-build scroll.
15. Peak draw calls remain under 100, triangles under 150k and no effect creates
    a main-thread task longer than 50 ms after loading.
16. Bloom, if accepted, passes the performance gate and has an indistinguishable
    local-glow fallback when disabled.

---

## 14. Decisions proposed for approval

1. Use the hybrid procedural + selected WebP approach already approved in the
   asset blueprint.
2. Keep existing local glows as the required baseline; treat half-resolution
   bloom as an optional final A/B test.
3. Use searchlights only in desktop 01 and 05, with a reduced 05-only mobile
   version.
4. Use fixed subtle grain, halftone and vignette rather than animated film
   noise.
5. Build fireworks from shared illustrated cards, glow, smoke and sparse
   embers rather than a large particle simulation.
6. Use Medium atmosphere quality on mobile by default and step down only after
   adaptive resolution has reached its floor.
7. Keep the current colour palette and create progression through intensity,
   fog, sky and accent balance rather than six unrelated LUT-style filters.

These decisions require visual review of one implementation stage at a time.
Approval of this brief does not authorise Cursor to implement all stages in one
unreviewed pass.
