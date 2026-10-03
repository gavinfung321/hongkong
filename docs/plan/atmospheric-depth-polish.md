# Atmospheric Depth and Mystery Polish

**Status:** planned, user request 2026-10-03. Implement one stage at a time
and stop for visual approval after every stage.

This plan increases depth, atmosphere and mystery across the existing Victoria
Harbour journey without changing its approved subjects, camera compositions or
calm neo-vintage Hong Kong identity. It takes the general lesson from Kage that
a cinematic frame benefits from near, middle and far layers, partial
occlusion, local motion and an image-wide finish. It does not copy Kage code,
artwork, scene design or weather treatment.

The target is not "more effects." The target is a more convincing sense that
the viewer is moving through humid harbour air, with something close,
something partly hidden, something slowly moving and one controlled source of
light in each composition.

## 1. Desired result

The finished journey should have:

- clear near, middle and far depth in every chapter;
- occasional concealment and reveal instead of every landmark being fully
  exposed at once;
- subtle ambient movement during camera holds;
- restrained texture and shadow around the frame;
- one leading subject and one leading motion family per chapter;
- atmosphere specific to Victoria Harbour rather than a Kyoto-style rain
  treatment;
- no loss of copy legibility, composition accuracy or mobile performance.

## 2. Standing decisions and constraints

1. Work in isolated stages. Do not combine grain, haze, foregrounds, light
   movement and drizzle in one implementation pass.
2. Capture before-and-after desktop and mobile evidence for every stage.
3. Keep approved camera keyframes, copy-safe regions, vessel routes and chapter
   subjects unchanged unless a later stage explicitly receives approval to
   alter them.
4. Do not restore the Star Ferry's chapter-03 forward drift. Its current
   `drift: { ferry: [0, 0] }` remains the baseline unless separately reviewed.
5. Do not add a large bow-spray card, dramatic crashing wave, full-screen mist
   wash or permanent rain curtain.
6. Do not add foreground artwork to every chapter by rule. A layer stays only
   where an A/B comparison shows a clear improvement.
7. New animation must have a stable reduced-motion state.
8. Use seeded or authored phase differences. Avoid visible synchronized loops,
   random flicker between frames and nondeterministic layout changes.
9. Preserve the existing adaptive pixel-ratio behavior and performance
   switches.
10. Kage's repository grants no licence to reuse its original code or artwork.
    Use only the general layering and motion principles as reference.

## 3. Current baseline

The site already has strong foundations:

- exponential scene fog and mountain-foot haze;
- a two-layer chapter-authored cloud ceiling;
- shore mist and open-water wisps;
- procedural water and dynamic reflections;
- thresholded bloom and a global colour grade;
- near and far Bauhinia petals;
- 3D foreground depth in the Hero, 01 and 02;
- ferry and junk wakes;
- searchlights, fireworks, smoke and embers;
- stepped reduced-motion behavior;
- desktop and mobile chapter compositions.

The principal gaps are:

- no implemented global vignette, paper grain or halftone finish;
- limited near-camera framing after chapter 02;
- mist that mostly separates distant scenery rather than occasionally
  occluding it;
- practical lights and reflections that can feel too mechanically stable;
- chapter 05 having almost no close physical arrival cue;
- insufficient visual response during some camera holds when the main subject
  is stationary.

## Implementation tracker

This is the master checklist. Mark a stage complete only after its acceptance
gate has passed and its documentation has been updated. If an experiment is
rejected, mark the experiment complete and write **removed** beside it rather
than leaving its status ambiguous.

- [x] Plan written and indexed — 2026-10-03
- [x] Stage 0 — Baseline captures and comparison controls — 2026-10-03
  (shortened, user choice: hold captures only, no scroll recordings)
- [x] Stage 1 — Global vignette (grain **removed**, user choice 2026-10-03)
  — approved 2026-10-03
- [ ] Stage 2 — Atmospheric occlusion and depth haze
- [ ] Stage 3 — Localized light and reflection breathing
- [ ] Stage 4 — Chapter 05 foreground prototype
- [ ] Stage 5 — Chapter 03 near-atmosphere
- [ ] Stage 6 — Optional chapter 04 rigging foreground
- [ ] Stage 7 — Optional harbour drizzle experiment
- [ ] Stage 8 — Chapter balance and final motion hierarchy
- [ ] Final desktop visual review
- [ ] Final mobile visual review
- [ ] Final reduced-motion review
- [ ] Final performance review
- [ ] Final documentation and asset-ledger update
- [ ] User sign-off

### Stage record

Fill this record beneath the relevant stage whenever work begins. Keep links to
evidence inside the repository so a later review can reproduce the decision.

| Field | Record |
|---|---|
| Status | Not started / In progress / Approved / Revise / Removed |
| Started | YYYY-MM-DD |
| Completed | YYYY-MM-DD |
| Implementation files | — |
| Feature switch | — |
| Desktop hold captures | — |
| Mobile hold captures | — |
| Transition recording | — |
| Reduced-motion result | — |
| Desktop performance | Average fps / 1% low / draw calls |
| Mobile performance | Device / average fps / 1% low |
| Decision | Keep / revise / remove |
| Review notes | — |

### Checklist for every stage

Before implementation:

- [ ] Confirm the stage is the only visual system being changed.
- [ ] Record the exact files already modified in the working tree.
- [ ] Preserve a rollback point without discarding unrelated user work.
- [ ] Capture the affected baseline holds and transitions.
- [ ] Define the feature switch and reduced-motion behavior.

During implementation:

- [ ] Keep the effect below copy and controls unless the stage explicitly calls
  for a near foreground crossing them.
- [ ] Use deterministic seeds or authored phases for animated variation.
- [ ] Add desktop and mobile quality settings where needed.
- [ ] Avoid changing camera poses, vessel routes or copy-safe regions.
- [ ] Avoid unrelated refactors and formatting changes.
- [ ] Ensure new shaders and assets load before the loading screen lifts.

Visual review:

- [ ] Capture desktop at 1440 x 900.
- [ ] Capture mobile at 390 x 844.
- [ ] Watch each affected hold for at least five seconds.
- [ ] Record slow continuous scrolling into and out of the affected chapter.
- [ ] Test fast scrolling and navigation jumps.
- [ ] Compare the effect enabled and disabled.
- [ ] Check text contrast, transparent edges and landmark clarity.
- [ ] Confirm the effect supports the chapter's leading motion rather than
  competing with it.

Technical review:

- [ ] Production build completes successfully.
- [ ] Browser console has no new warnings or errors.
- [ ] Reduced-motion mode presents a complete composed still frame.
- [ ] Desktop performance remains within budget.
- [ ] Mobile performance remains within budget.
- [ ] No new shader compiles during an active transition.
- [ ] No visible popping, synchronized looping, shimmer or rectangular card
  edge appears.

Close the stage:

- [ ] Record the decision as approved, revise or removed.
- [ ] Add evidence links and measurements to the stage record.
- [ ] Update the relevant area plan to describe the current implementation.
- [ ] Update `docs/plan/CHANGELOG.md`.
- [ ] Update `docs/plan/checks.md` if measurements changed.
- [ ] Update `docs/ASSET-LEDGER.md` for shipped assets.
- [ ] Mark the master stage checkbox complete.
- [ ] Stop for user approval before beginning the next stage.

## 4. Workflow for every stage

For each stage below:

1. Save the current working state before editing.
2. Implement only the named stage.
3. Add an independent debug/query switch where practical.
4. Build the production version and check the browser console.
5. Capture every affected hold at desktop 1440 x 900 and mobile 390 x 844.
6. Record the affected incoming and outgoing transitions with continuous slow
   scrolling.
7. Check reduced motion.
8. Compare against the baseline and record performance.
9. Stop for user approval.
10. If approved, update the appropriate plan file, `CHANGELOG.md`, checks and
    asset ledger before proceeding.

Do not compensate for a weak result by adding another effect in the same
stage. Tune, approve or remove the current effect first.

## 5. Stage 0 — Baseline and comparison controls

### Work

- Record one complete desktop scroll and one complete mobile scroll.
- Refresh the settled Hero and 01–06 screenshots.
- Record current average fps, 1% low, draw calls and adaptive pixel ratio.
- Preserve the current working version as the rollback point.
- Add or reserve measurement switches where practical:
  - `?off=texture`
  - `?off=haze`
  - `?off=foreground`
  - `?off=light-motion`
  - `?off=drizzle`

Do not introduce placeholder effects merely to make every switch functional.
A switch may be added with the stage that owns its effect.

### Acceptance gate

- Every future stage can be compared directly with a known baseline.
- The switches do not change the default frame when their effect is absent.

## 6. Stage 1 — Global vignette and static grain

This is the first implementation stage and the highest-value low-risk test.

### Preferred implementation

- Add one fixed presentation layer above the finished WebGL image and below
  chapter copy, navigation and controls.
- Prefer a lightweight DOM/CSS overlay or one shared texture-overlay module
  rather than modifying every material.
- Suggested module if a new one is needed: `src/ui/textureOverlay.js`.
- Add only:
  - one broad elliptical vignette;
  - one small original monochrome grain texture, generated locally or in code.
- Keep the grain static. Do not animate it during this stage.
- Do not add halftone until vignette and grain are approved independently.

### Starting visual targets

- Desktop corner darkening: approximately 8–10%.
- Mobile corner darkening: approximately 5–7%.
- Grain opacity: approximately 2% desktop and 1.5% mobile.
- Keep the centre, copy-safe regions and active landmark visually open.
- Grain should be fine enough not to resemble dust, stars or rain.

### Controls

- `?off=texture` disables vignette and grain together for A/B comparison.
- If halftone is later approved, give it an independent control.
- Print, fallback and reduced-quality modes may disable the layer if needed for
  clarity.

### Acceptance gate

- The frame feels less digitally clean without looking filtered.
- Grain is felt before it is consciously seen.
- No water shimmer, facade moire or loss of small-text clarity.
- Bright lights remain clean and do not acquire dirty halos.
- The overlay adds no meaningful frame-time regression.

### Rollback

Remove the overlay cleanly. Do not alter the colour grade to compensate for a
failed texture treatment.

### Stage 1 record

| Field | Record |
|---|---|
| Status | Approved |
| Started | 2026-10-03 |
| Completed | 2026-10-03 |
| Implementation files | `index.html` (`.vignette` after the canvas), `src/styles.css`, `src/main.js` |
| Feature switch | `?off=texture` removes the layer |
| Scope | Vignette only. Grain removed before building (user choice, 2026-10-03): the standing rule is "no paper texture or grain", and the earlier grain proof measured only 1–3 levels of change |
| Values | Radial ellipse centred at 50% 48%. Desktop clear to 38%, corners `rgb(6 5 16 / 0.24)`; phones (`max-aspect-ratio: 4/5` or `max-width: 600px`) clear to 42%, corners `0.16`. The first pass (9% / 6%, clear to 50%) read as no change and was strengthened (user request, 2026-10-03) |
| Layering | Above the 3D canvas, below the jump veil, copy, header and controls; fades in with the canvas; static, so reduced motion is unaffected; absent in fallback mode |
| Desktop hold captures | `review-shots/depth-stage1/before/` and `after/` (hero, 01–06, 1440 × 900) |
| Mobile hold captures | Partial; CDP captures in phone emulation were unreliable, so skipped (user choice) |
| Performance | One CSS layer, no draw calls added (desktop holds 241 / 238 / 190 / 120 / 79 / 81 / 62 calls, unchanged) |
| Decision | Keep (user approval, 2026-10-03) |

## 7. Stage 2 — Atmospheric occlusion and depth haze

Build on the existing mist system rather than adding a full-screen fog layer.

### Preferred implementation

- Extend `src/data/atmosphere.js` and `src/scene/createAtmosphere.js` with one
  or two thin, separated haze bands at different depths.
- Reuse the existing harbour-mist artwork only if its crop, tint and edge
  behavior remain suitable. Do not stretch it into a continuous belt.
- Use soft alpha edges and stable render order.
- Animate the bands with slow, different, seeded horizontal phases.
- Hold them still in reduced-motion mode.
- Add `?off=haze` without changing the existing `?off=mist` behavior unless
  consolidating the switches is explicitly approved.

### Chapter direction

| Chapter | Haze role |
|---|---|
| Hero / 01 | Gentle depth separation; occasional softening near the moon halo, never over the main wordmark |
| 02 | Slightly stronger behind the Clock Tower and palms; tower face stays crisp |
| 03 | Low band between ferry and skyline; never a camera-facing wash over the ferry |
| 04 | Pass behind the red sails and soften the distant shore; do not veil the sail silhouette |
| 05 | Humid band around podium and pier level; IFC crown and wheel remain crisp |
| 06 | Fade the harbour haze; fireworks smoke becomes the atmospheric layer |

### Acceptance gate

- The skyline no longer reads as one flat wall.
- At least three depth bands are visible in 03–05 without obvious card edges.
- Haze occasionally conceals small background details but never the whole
  subject.
- No grey film, straight mist belt or washed-out water reflections.
- Copy contrast remains at least 4.5:1.

## 8. Stage 3 — Localized light and reflection breathing

The goal is low-level life during holds, not visible electrical flicker.

### Suitable sources

- promenade lamp halos;
- warm light around the Clock Tower base;
- ferry cabin-light reflection on the water;
- junk deck-light glow and its reflection;
- selected warm pier reflections.

### Sources that stay stable

- IFC crown and facade;
- most office windows and skyline LEDs;
- navigation and interface elements;
- the moon disc;
- text and vertical labels.

### Motion rules

- Source-light intensity variation should generally stay within 2–4%.
- Reflections may vary slightly more than their source.
- Use long, non-dividing periods and authored phase offsets.
- The moon halo may breathe slowly, but it must not flicker.
- No random number may be sampled independently every rendered frame.
- Reduced motion uses fixed mid-cycle values.
- Add `?off=light-motion` for comparison.

### Likely files

- `src/scene/createLighting.js`
- `src/scene/createWater.js`
- `src/scene/waterReflections.js`
- vessel and foreground light owners only where their existing public update
  APIs make the change local and clear.

### Acceptance gate

- A settled composition watched for five seconds feels alive.
- No lamp, cabin, building or reflection appears broken or visibly blinking.
- Sources do not pulse together.
- IFC and city windows remain stable while scrolling on phones.

## 9. Stage 4 — Chapter 05 foreground prototype

Chapter 05 is the first and most important foreground experiment because its
composition currently contains mostly middle- and far-distance content.

### Candidate order

Test one candidate at a time:

1. a dark bollard and chain in one lower corner;
2. a Central pier canopy edge;
3. a cropped pier railing or mooring structure.

The first preferred test is the bollard and chain. Existing source candidates
are documented in `docs/references/foreground-pass-candidates/MANIFEST.md`.
Do not move a candidate into `public/` until it wins an A/B comparison and its
asset status is updated.

### Behavior

- Treat the asset as a close physical object, not a decorative frame.
- Anchor it to a bottom corner with a convincing off-frame base.
- Give it stronger parallax than the skyline.
- Bring it in during the 04-to-05 handoff.
- Keep it visually solid while active.
- On departure, lower it slightly, fade it and apply a soft blur.
- Use opacity-only behavior in reduced motion.
- Keep IFC, the wheel, copy and waterfront destination cues unobstructed.
- Use a smaller crop or omit it on mobile if it reduces clarity.
- Add `?off=foreground` for A/B comparison.

### Likely implementation

- Prefer one reusable foreground-stage controller rather than chapter-specific
  DOM behavior scattered across `main.js`.
- Suggested module: `src/ui/foregroundStage.js` for fixed viewport artwork, or
  a world-space implementation only if depth testing and physical placement
  clearly improve the result.
- Make the chapter data declarative: asset, anchor, size, entrance, exit and
  breakpoint visibility.

### Acceptance gate

- Chapter 05 feels like arriving at a physical harbour edge.
- The foreground frames the city rather than becoming a second subject.
- No sticker-like outline, floating base or visible rectangular image edge.
- The entrance and retirement do not pop during fast or slow scrolling.

If the frame is not clearly better, remove the foreground and proceed without
it. Do not add a second asset to rescue the first.

## 10. Stage 5 — Chapter 03 near-atmosphere

Do not restore the removed bow-spray artwork. The chapter needs proximity, not
a dramatic wave.

### Preferred test

- Add a very small number of soft near-lens moisture or spray specks near the
  lower edges.
- Use multiple depths, sizes and lifetimes with deterministic seeds.
- Give near particles strong parallax and keep them out of the copy-safe area.
- Avoid repeating the same cluster or path visibly.
- Fade the layer during the transition to 04.
- Reduced motion uses a sparse still state or disables the near particles.

The ferry, refined wake and water reflections remain the chapter's leading
motion. Near moisture is only supporting motion.

### Acceptance gate

- The camera feels close to the water.
- Nothing resembles a crashing wave, snow, dust or a particle fountain.
- The effect never becomes a second wake.
- Copy is never persistently obscured.
- Mobile uses fewer particles or omits the layer if necessary.

## 11. Stage 6 — Optional chapter 04 rigging foreground

Chapter 04 already has a large near subject. This stage is optional and must be
judged more strictly than chapter 05.

### Test

- Use one close rope, rigging line or cropped sail edge entering from one
  side.
- Crop it strongly and show it primarily during the 03-to-04 arrival.
- Use stronger parallax than the junk.
- Remove it before it becomes a permanent border.
- Do not cross the copy block, main sail silhouette or IFC cue.

### Acceptance gate

- It creates the feeling of passing alongside or aboard the junk.
- It does not divide the frame awkwardly or make the composition busier.
- If improvement is ambiguous, do not ship it.

## 12. Stage 7 — Optional harbour drizzle experiment

Do this only after stages 1–5 have been reviewed. It is an experiment, not a
required feature.

### Direction

- Suggest suspended moisture visible in light, not active rainfall.
- Limit it to chapters 02 and 03.
- Fade it out before chapter 04 and keep it absent in 05–06.
- Use faint narrow streaks at different depths, speeds and lengths.
- Keep density and opacity much lower than a conventional rain effect.
- Avoid bright full-screen diagonal lines.
- Consider desktop-only at first; mobile may use half the count or omit it.
- Keep petals visually distinct and prevent the two particle families from
  becoming clutter.
- Add `?off=drizzle`.

### Acceptance gate

- The effect is more apparent in motion than in a still screenshot.
- It reads as humid illuminated harbour air, not a storm.
- It remains compatible with the moon and later fireworks.
- No aliasing, shimmer or meaningful performance loss.

If it reads as "Kage rain added to Hong Kong," remove it.

## 13. Stage 8 — Chapter balance and final motion hierarchy

After all approved layers are present, rebalance rather than adding more.

| Chapter | Leading motion | Supporting motion | Effects to suppress |
|---|---|---|---|
| Hero / 01 | camera push and water | petals, clouds, restrained haze | strong foreground entrance, rain curtain |
| 02 | camera parallax and palms | distant haze, optional faint drizzle | petal swarm, strong searchlights |
| 03 | ferry transition and wake | water glints, sparse near moisture | forward ferry drift, dramatic spray, bright beams |
| 04 | junk passage and sail silhouette | small wake, sparse petals, optional rigging | bright city animation, extra foreground cards |
| 05 | camera rise, wheel and arrival foreground | reflections, slow beams, podium haze | near particle clutter, rain |
| 06 | fireworks | smoke and embers | petals, drizzle, pier foreground, strong beams |

No two ambient systems should use the same obvious period. The leading motion
must remain readable even when all supporting effects are enabled.

## 14. Final acceptance checks

### Visual

- Each chapter has a clear foreground, middle ground and background, whether
  supplied by geometry, atmosphere or subject scale.
- Every hold still has one unmistakable subject.
- Occlusion creates discovery but never hides the main landmark.
- Foreground elements remain physically connected to a frame edge or world
  surface.
- No effect looks pasted on, rectangular, synchronized or decorative without
  narrative purpose.
- Grain and vignette are felt rather than seen.
- No global screen flicker is present.

### Motion

- Slow and fast scrolling both produce smooth entrances and exits.
- Camera holds retain subtle life without making stationary subjects drift in
  the wrong direction.
- No abrupt opacity, blur, scale or direction changes.
- Reduced-motion mode preserves complete, composed still frames.

### Copy and accessibility

- Normal text maintains at least 4.5:1 contrast.
- No persistent foreground or particle covers body copy.
- Controls and navigation remain above all decorative layers.
- Fallback mode remains complete without atmospheric effects.

### Performance

- Desktop average remains at least 50 fps with 1% low at least 40 fps.
- iPhone 11/13 target remains at least 30 fps with 1% low at least 24 fps.
- No stage creates a main-thread task longer than 50 ms after loading.
- No shader is first compiled during an active chapter transition.
- Transparent full-screen layers are kept to the minimum needed.
- Mobile quality reduction removes drizzle and near particles before removing
  core water, subjects or copy.

## 15. Documentation required after approval

For every approved stage:

- update this file from planned to the current implementation state;
- add a dated entry to `docs/plan/CHANGELOG.md`;
- update the relevant area file (`atmosphere.md`, `scene-promenade.md`,
  `scene-city.md` or `interface.md`);
- update `docs/plan/checks.md` with new measurements;
- update `docs/ASSET-LEDGER.md` for every new shipped texture or cutout;
- record removed experiments as removed rather than silently deleting their
  design decision;
- commit documentation with the implementation.

## 16. Immediate next action

Review the Stage 1 vignette (built 2026-10-03, vignette only). Do not begin
haze, foreground, light breathing or drizzle until Stage 1 is approved.
