# Changelog

Part of the Milestone 2 plan (index: [README.md](README.md)). Newest first.
One entry per change: what changed, why, and the files. Older history also
lives in the dated notes inside each area file, and in `git log`.

## 2026-10-03

- **Final copy** (user request): the approved `FINAL-NARRATIVE-COPY.md`
  is live. Six chapter bodies, kickers 04 ("Junk with red sails") and 05
  ("Two IFC"), page title, hidden H1, meta description and Open Graph
  title and description; placeholder markers removed; menu and footer
  return accessible names; footer landmarks with commas and without the
  Observation Wheel. Copy fit: footer statement three lines on desktop and
  four on phones (mark above it on phones), balanced footer headings.
  Status in `FINAL-NARRATIVE-COPY.md` set to approved. No scene, camera,
  animation or asset files changed. Files: `index.html`, `src/styles.css`,
  `docs/FINAL-NARRATIVE-COPY.md`; plan: `interface.md`.
- **Footer fireworks kept** (user request: too few fireworks behind the
  footer): instead of fading out, the bursts now dim to half strength and
  the smoke to 70% at the footer. Files: `src/scene/createFireworks.js`;
  plan: `interface.md`.
- **Footer polish** (user choices, all three items from the footer review):
  the statement, "Landmarks and vessels" column, colophon and bottom bar
  now use the approved wording (the inaccurate "every model and texture
  made in code" line is gone); the fireworks fade to thin smoke over the
  first 60% of the footer's rise; less empty space above the return
  button on phones (padding 72 → 40 px). Files: `index.html`,
  `src/styles.css`, `src/main.js`, `src/scene/createFireworks.js`; plan:
  `interface.md`.
- **06 left side** (user request: the left half under the copy read as
  empty): two supporting bursts on desktop (coral at 2.2 s with a smoke
  puff, small warm at 5.8 s) and one on phones (coral at 2 s), smaller
  and fainter than the right, all below the copy text; the cloud mass
  gains a dimmer tail sweeping left and a wisp under the left bursts
  (phones one wisp). Files: `src/data/chapters.js`,
  `src/data/atmosphere.js`; plan: README, `atmosphere.md`.
- **06 polish** (user choices, four of five items from the 06 review; the
  moon stays): bursts recoloured and moved to the storyboard's palette
  (warm-white hero twice per loop, coral support, one small cyan, upper
  right and top centre, the left dark); 06's clouds as one mass under the
  bursts; `accents` held at 0.25 through 06; the bursts now light nearby
  clouds in their colour through shared uniforms. Files:
  `src/data/chapters.js`, `src/data/atmosphere.js`, `src/main.js`,
  `src/scene/createAtmosphere.js`, `src/scene/createFireworks.js`; plan:
  README, `atmosphere.md`.
- **05 polish** (user choices, four of six items from the 05 review; the
  moon and searchlights stay): the camera close to the wheel so it reads
  as IFC's co-star at true scale (desktop wheel ~20% of the height, was
  15%; phones IFC ~70%, was 47%, wheel ~17%, was 8%); new `accents` level
  (05: 0.25) dims the LED crowns, strips and landmarks without darkening
  the windows; new `reflections` level (05: 2) lengthens and brightens
  IFC's and the wheel's water columns; 05's clouds as one mass. Files:
  `src/data/chapters.js`, `src/data/atmosphere.js`, `src/main.js`,
  `src/scene/createIsland.js`, `src/scene/createWater.js`; plan: README,
  `scene-city.md`, `atmosphere.md`.
- **04 junk bigger** (user choice: the camera, not the model): the junk
  read small for the hero reveal. The 04 camera's lens narrows (desktop
  66°, was 74.7°; phones 60°, was 79.9°), so on desktop the junk spans
  about 60% of the width (was 50%) and on phones the main sail rises to
  28% down the screen (was 41%), the junk turned further from the camera
  so the hull stays in frame and IFC a sliver at the right edge. The eye
  stays at 3 m for the 1.5 m camera clearance. Probe targets updated.
  Files: `src/data/chapters.js`; plan: README, `scene-models.md`.
- **04 polish** (user request; fixes made without a stop for approval):
  the junk's sails coral red (`#e23c34`) with stronger shading (darker
  head, glowing foot, a lighter belly in each panel) instead of one flat
  colour; the hull's own glow halved so it sits darker; a longer,
  brighter junk wake so a streak shows behind the stern; the skyline at
  40% in 04 as in 03; 04's clouds regrouped into one mass. Files:
  `src/scene/createVessels.js`, `src/scene/surfaces.js`,
  `src/data/chapters.js`, `src/data/atmosphere.js`; plan: README,
  `scene-models.md`, `scene-city.md`, `atmosphere.md`.
- **03 polish** (user choices, five of six items from the 03 review; the
  moon stays): the ferry's reflection kept under the hull and drawn as
  thin slivers near the camera (they scattered over the foreground as
  flat blobs); a longer, wider, faintly glowing ferry wake; the other
  towers and LEDs at 40% in 03 so IFC and the wheel lead; 03's clouds as
  one mass with the copy's corner calm; on phones the ferry moved closer
  (34 m, was 53 m) to fill about a fifth of the frame, as in the
  storyboard. Files: `src/scene/waterReflections.js`,
  `src/scene/createWater.js`, `src/scene/wakes.js`,
  `src/scene/createVessels.js`, `src/data/chapters.js`,
  `src/data/atmosphere.js`, `docs/plan/README.md`,
  `docs/plan/atmosphere.md`, `docs/plan/scene-city.md`,
  `docs/plan/scene-promenade.md`.
- **02 polish, follow-up** (user requests): the afterglow toned down to
  a soft dusky rose (was a bright red-orange that matched no other
  scene); the far-shore lights cut back to a short sparse run under the
  ridge, none on the open sea; the people stand still, mostly at railing
  B watching the sea, instead of walking. Files:
  `src/scene/createScene.js`, `src/scene/createIsland.js`,
  `src/scene/people.js`, `src/scene/createForeground.js`,
  `src/data/world.js`, `docs/plan/atmosphere.md`,
  `docs/plan/scene-city.md`, `docs/plan/scene-promenade.md`.
- **02 polish** (user choices, all seven items from the 02 review): a
  red-orange afterglow on the sky low on the right (desktop and phones,
  02 only) with the clouds as one overlapping mass instead of three rows;
  the water mirrors the afterglow in drifting bands; the ferry's wake
  longer and whiter; far-shore low-rise lights with dark land strips
  behind the ferry; railing B 1.3× with a lantern on every post; three
  puddles on desktop 02's empty paving, and every puddle now mirrors the
  Clock Tower; six people strolling on the promontory; on phones the
  city (35%) and Mid-Levels lights (50%) dimmed behind the tower. Files:
  `src/scene/createScene.js`, `src/scene/gating.js`, `src/main.js`,
  `src/scene/createWater.js`, `src/scene/createVessels.js`,
  `src/scene/createIsland.js`, `src/scene/createMountains.js`,
  `src/scene/lamps.js`, `src/scene/people.js` (new),
  `src/scene/createForeground.js`, `src/data/world.js`,
  `src/data/chapters.js`, `src/data/atmosphere.js`,
  `docs/plan/README.md`, `docs/plan/atmosphere.md`,
  `docs/plan/scene-city.md`, `docs/plan/scene-promenade.md`.
- **Palms on mobile 01** (user choice): after previewing the lower scene
  on phones, the palms at the Clock Tower's foot now show in the mobile
  hero and 01, as in the mobile storyboard; deck and railing stay hidden
  so the junk's reflection and glints keep the lower third. Files:
  `src/data/chapters.js`, `docs/plan/scene-promenade.md`.
- **Realistic puddles** (user request: too many, and they read as flat
  shapes on the paving): two placed puddles on the hero's deck instead
  of noise-scattered ones; ragged edges, soaked rims; inside, a traced
  mirror image of railing A with its lit lantern, a cloudy sky reflection
  and a slight ripple. Files: `src/scene/lamps.js`,
  `docs/plan/scene-promenade.md`.
- **01 polish, third round** (user choices): slope lights continue west
  of the Clock Tower, thinning and staying low (they stopped in a hard
  edge behind the tower); soft dark gradients behind 01's copy (over the
  tower's top at 16:10) and 東方明珠; the bauhinia tree set 1.5 m lower so
  its crown clears 東方明珠; railing A built 1.3× with a lantern on every
  big post (storyboard foreground; a camera move was left out because it
  would lift the railing behind 香); paving with weathered patches,
  mirror-like puddles and fallen petals. Files: `src/data/world.js`,
  `src/scene/createMountains.js`, `src/scene/createForeground.js`,
  `src/scene/lamps.js`, `src/styles.css`, `docs/plan/README.md`,
  `docs/plan/interface.md`, `docs/plan/scene-city.md`,
  `docs/plan/scene-promenade.md`.
- **01 polish: mountains, skyline colour and railing** (user choices
  after a second review of 01; paving, the big railing and the copy/tree
  notes not chosen for now). Mountains: the scattered slope dots read as
  floating specks; now 210 Mid-Levels towers drawn as lit window grids,
  four road-lamp strings (one up to the Peak), a Peak cluster, dimmed
  where windows would crowd into bars on phones; slopes get soft tonal
  patches. Skyline: half the lit roof bands turn a restrained LED colour,
  a fifth of the tall towers get LED corner strips, and a lamp line runs
  along Central's waterfront; IFC still the brightest. Railing: rails and
  slim posts shaded darker and cooler to match the posts (they read as
  rust-brown pipes), lantern pools reach 4.5 m (was 3.2) onto the rails
  and paving. Probe: only the four older misses. One more draw call in
  every hold (the waterfront lamps): desktop 01 214, mobile 01 149. Files:
  `src/scene/createMountains.js`, `src/scene/createIsland.js`,
  `src/scene/createForeground.js`, `src/scene/lamps.js`,
  `src/data/world.js`, `docs/plan/README.md`, `docs/plan/scene-city.md`,
  `docs/plan/scene-promenade.md`, `docs/plan/checks.md`,
  `docs/ASSET-LEDGER.md`.
- **01 polish: moon, water and bush** (user request): the first three of
  six improvements from a review of the hero and 01; mountains, railing
  and paving wait (listed in README, "01 polish"). Moon: eleven seas laid
  out like the real near side, faint and joined (the two seas above the
  ridge read as eyes), an evenly lit face instead of lit-ball shading, a
  soft corona and wide faint haze ("subtle mist around it"), and clouds
  near the moon catch its light at their edges; the yellow stays. Water:
  a dim violet-navy sky mirrored between the glints with soft drifting
  wave bands (it was pure black), glints capped at 6 px near the camera
  (they grew into flat blobs), skyline shimmer 0.08 → 0.11. Bush: moved
  2 m on along the railing so it ends left of 香 in the hero and the
  railing lantern it hid shows, still framing the 01 hold's corner;
  flowers in 16 clusters, a few sprigs past the crown, eleven lumps.
  Probe: only the four older misses. No new draw calls, textures or
  shaders; JS 211.8 KB gzip. Files: `src/scene/createMoon.js`,
  `src/scene/createAtmosphere.js`, `src/scene/createWater.js`,
  `src/scene/bauhinia.js`, `src/data/world.js`, `docs/plan/README.md`,
  `docs/plan/interface.md`, `docs/plan/atmosphere.md`,
  `docs/plan/scene-promenade.md`.
- **Chapter 03 ferry pass and foreground direction** (user request and
  choice): no foreground cutouts, spray or camera-facing mist in 03;
  depth and motion come from the existing ferry and harbour instead. The
  ferry sails on toward Central through the 03 hold (1.5 m up to the
  keyframe, 6 m on; phones 5 m), bobs, rolls and pitches slightly, and on
  the way to 04 sails slowly (about 50 m instead of 475 m) so the camera
  overtakes it: its cabin slides out past the left edge and its bow
  uncovers the junk, which now comes up from beyond it. A natural
  occlusion, no wipe; built on desktop and phones. The wake gains a
  propeller wash and a band of darker, disturbed water with a second foam
  layer. The water reflections gain the Observation Wheel and a slow swell
  that ripples the columns of the ferry, wheel and skyline (desktop now
  reflects up to 9 lights). Haze unchanged: in 03 it is only the far shore
  mist behind the ferry. Foreground direction recorded: no rule of two
  cards per chapter, a 3D or built foreground per chapter, one optional
  pier canopy, bollard or chain test reserved for 05 (not started), no
  large cutouts on phones. The rejected card test's notes are cleared from
  the area files; its generated artwork is kept, unused, with a status per
  piece. Probe: only the four older misses. Draw calls desktop 04 94 (was
  93), others unchanged; JS 210.9 KB gzip. Files: `src/scene/vesselRoutes.js`
  (new), `src/scene/createVessels.js`, `src/data/chapters.js`,
  `src/scene/wakes.js`, `src/scene/waterReflections.js`,
  `src/scene/createWater.js`, `src/main.js`,
  `docs/references/foreground-pass-candidates/MANIFEST.md`,
  `docs/plan/README.md`, `docs/plan/scene-models.md`,
  `docs/plan/scene-city.md`, `docs/plan/scene-promenade.md`,
  `docs/plan/checks.md`, `docs/ASSET-LEDGER.md`.
- **Bauhinia bush and realistic foliage** (user requests): the 2.5D
  foreground-card test (railing and flower cutouts on planes at the lens,
  Hero and 01) read "very weird" and was removed before it was committed.
  In its place a low bauhinia bush stands on the arrival promenade inside
  railing A, filling the bottom-left of the hero and 01 on desktop, gone
  early in the move to 02. The tree and the bush now share a foliage atlas
  cut from the user's artwork (leaf from the cluster's leaf lobe, flowers
  from the drifting petals' artwork, buds from the cluster), with flowers
  turned toward the camera, crown shading and a little more glow, so they
  read like the petals. Both foliage materials draw in one pass. Draw calls
  desktop hero 216, 01 213 (were 214 and 211); phones unchanged; JS 209.7 KB
  gzip. Files: `src/scene/bauhinia.js`, `src/scene/surfaces.js` (old atlas
  removed), `src/scene/createForeground.js`, `src/data/world.js`,
  `src/data/chapters.js`, `src/main.js`,
  `public/atmosphere/bauhinia-foliage.webp` (new), `docs/plan/scene-promenade.md`,
  `docs/plan/checks.md`, `docs/ASSET-LEDGER.md`.
- **Bow spray removed** (user request and choice): the splash on the
  ferry and junk still looked forceful and unrealistic. The artwork is a
  breaking wave throwing droplets, so no size or strength fixes that; a
  bow foam built in code was offered and declined. The wakes stay the
  boats' only white water. Draw calls back to desktop 01 211, phone 01
  148; JS 209.4 KB gzip; `?off=spray` gone. Files: `src/scene/spray.js`
  and `public/atmosphere/harbour-spray.webp` (deleted),
  `src/scene/createVessels.js`, `src/data/atmosphere.js`, `src/main.js`.
- **Milestone 2 review** (build step 6, user request): 14 hold screenshots
  (hero and 01–06, desktop and phone), the composition probe, copy
  overflow at three sizes, parallax corners, navigation, reduced motion,
  fallback, and laptop frame rates on the real GPU (60 fps, 1% low 57.7).
  Checks 1–5 pass with the known misses. The user approved 01 and raised
  the budgets (draw calls ≤ 100 → ≤ 220; generated textures ≤ 4 → ≤ 32
  small code-drawn ones), so **Milestone 2 is closed**; the phone
  re-measure is carried to Milestone 5 (user choices). Files:
  `docs/milestone-2-review/` (new), `docs/plan/README.md`,
  `docs/plan/checks.md`, `docs/plan/HANDOFF.md`.
- **Junk spray as a bow wave** (user request and choice): in desktop 04
  the junk's 15 m spray card along the hull read as a wave crashing into
  its side, too violent for a junk that "slides alongside". Now a small
  bow wave at the stem (5.5 m, the low right-hand part of the art, its
  cut edge feathered, fainter). Phones barely change; the ferry's spray
  is unchanged. Spray cards can now use part of the artwork (`crop`).
  Files: `src/scene/spray.js`, `src/data/atmosphere.js`.
- **Film grade** (user choice; colour pass, README "Open" 6): the whole
  frame is graded in the glow's last pass: contrast round the night's
  mid-tones, indigo shadows, warm highlights, a little more colour where
  it is weak. 01 clearly improved (deeper indigo sky; warmer Clock Tower,
  moon and sails; IFC leads more), so it stays, in every chapter. ACES
  and AgX were tried and rejected (crushed or bleached; grey haze).
  No extra pass; `?grade=0` turns it off. Files: `src/scene/bloom.js`,
  `src/scene/createScene.js`, `src/main.js`.
- **Bow spray** (user choice): white water at the ferry's and junk's
  bows from the staged `harbour-spray.webp` (now in
  `public/atmosphere/`), because the flat wakes read thin at wave
  height. One camera-facing card per boat, dimmed for night and fogged;
  its depth is pulled toward the camera so the hull's near side doesn't
  hide it; calmer at holds, stronger while the boat moves, a slow swell
  under 6%, still in reduced motion. One draw call per visible boat.
  `?off=spray` hides it. Files: `src/scene/spray.js` (new),
  `src/scene/createVessels.js`, `src/data/atmosphere.js`, `src/main.js`,
  `public/atmosphere/harbour-spray.webp`.
- **Searchlights** (user choice): four soft beams from the Central
  landmark rooftops (not IFC) sweep slowly over 13–17 s, each in its own
  range so they never cross; desktop 01 at 60%, 05 full, phones two beams
  in 05 only; gone before the fireworks; held and dimmed in reduced motion.
  `?off=beams` hides them. Files: `src/scene/createSearchlights.js` (new),
  `src/data/atmosphere.js`, `src/data/chapters.js`, `src/main.js`.
- **Less cloud in phone 06** (user request): three cloud cards → one lit
  bank between the bursts and IFC's crown, so the fireworks open on dark
  sky (mobile 06 58 draw calls). Files: `src/data/atmosphere.js`.
- **Phone 01 clouds as one deck** (user choice): three full-width strips
  at even steps read as stripes. Now one dim deck from the top to the moon,
  a small lit bank off-centre left and the bright bank just above the moon
  (four cards → three; mobile 01 148 draw calls). The user is not
  re-measuring phone fps for now (iPhone 16 expected). Files:
  `src/data/atmosphere.js`.

## 2026-10-02

- **Cloud ceiling** (user request; choices: storyboard ceiling, wind,
  same artwork): the clouds were too thin (12–20% opacity), too few (one
  strip per chapter, two cards on phones) and static (a 1.2% sway over two
  minutes). Now every chapter on desktop and phones has a dim back layer
  roofing the sky and a front layer of lit banks (5–7 cards desktop, 3–5
  phones, 30–70%), each card showing only in its own chapter and
  crossfading across the move. The wind scrolls the art through each
  card's fixed window, front 0.3% of the frame per second and back half
  that, so the clouds move but never cross the copy, moon or IFC; still in
  reduced motion. Cards now face their chapter camera's image plane, so
  frames that look up don't tilt them. The `clouds` level in
  `chapters.js` is gone. Draw calls about 2–4 more per hold. Files:
  `src/scene/createAtmosphere.js`, `src/data/atmosphere.js`,
  `src/data/chapters.js`, `src/main.js`.
- **Bauhinia petal artwork** (user choice): the drifting petals and the
  tree's falling petals now use the user's `bauhinia-petal.webp` (29 KB):
  its own fuchsia, pale veins, wavy edges and curled stalk, dimmed for the
  night in four shades. Motion, counts and densities unchanged. Files:
  `src/scene/createPetals.js`, `src/scene/bauhinia.js`,
  `public/atmosphere/bauhinia-petal.webp`.
- **Automatic phone sharpness** (user choice): the iPhone 11 switch test
  showed pixel count is the only cost that matters in 02 (pixel ratio 1.25:
  43 fps against about 34; glow, edge smoothing and water: no gain). Phones
  now start at 1.5 and drop once to 1.25 if they average under 40 fps; the
  glow stays on. Phones that keep up stay sharp. Files: `src/main.js`.
- **Phone measurement switches** (user choice): the lighter palms left
  phone 02 at 31–36 fps, so the cost is per pixel, not triangles. New
  address-bar switches let the user test on the iPhone what costs most:
  `?dpr=`, `?aa=0` and `?off=water,clouds,mist,palms,petals` (with the
  existing `?bloom=0`); the `?fps` box shows which are on. Files:
  `src/main.js`, `src/ui/fpsOverlay.js`.
- **Lighter palms** (user choice): each palm drew four times (back and
  front passes of both its depth twin and its colour); now it draws twice,
  and two palms left of the phone frame are desktop-only. Phone 02 drops
  from 73k to 52k triangles with no visible change. Files:
  `src/scene/palms.js`, `src/data/world.js`.
- **No more shader stutter between chapters** (user request, after the
  first iPhone 11 reading): the move from 01 to 02 stuttered because 32
  shaders were built mid-scroll. Every shader is now built in one unseen
  frame before the loading screen lifts, and the ferry and junk lights stay
  in the scene at zero while their boat is hidden (a change in the number
  of lights had forced new versions of every lit shader). No visible
  change. Files: `src/main.js`, `src/scene/gating.js`.
- **Fireworks smoke lighter, second phone wisp** (user request and
  choices): every wisp is a third weaker (at most 10.5% opacity instead
  of 16%), and phones gain a lavender wisp under the left cyan burst that
  gathers as the coral wisp thins. Files: `src/data/chapters.js`.
- **Fireworks step 3, smoke** (user request): faint violet, coral and
  lavender smoke gathers beside and below the biggest bursts as they fade,
  then grows, drifts and thins over 5 s (three wisps on desktop, one on
  phones, at most 16% opacity, behind the bursts and clear of the copy).
  The falling sparks stand in for the embers. This completes the
  fireworks. Files: `src/scene/createFireworks.js`,
  `src/data/atmosphere.js`, `src/data/chapters.js`,
  `public/atmosphere/firework-smoke.webp` (re-encoded to 1200 × 600,
  285 KB, to meet the 300 KB aim).
- **Fireworks step 2, the show** (user choices): the 06 bursts play in a
  fixed 8 s loop: a rocket climbs from behind the skyline, the burst
  ignites at 70% size with a soft flare, opens, cools and fades, and
  sparks fall from its tips in drooping streaks. Two to four live at a
  time; entering 06 starts at a composed moment; reduced motion holds one.
  Files: `src/scene/createFireworks.js`, `src/data/atmosphere.js`,
  `src/data/chapters.js`, `src/main.js`.
- **Fireworks step 1, still bursts** (user choice): the four ring markers
  in 06 are now firework bursts from the shared `firework-burst.webp`,
  spun, mirrored and tinted so no two match (warm keeps the art's gold).
  Four were too few and too weak (user request), so there are eight on
  desktop and six on phones, about 35% bigger, with a stronger centre
  glow; the phone keeps a 35% remnant. Step 2 will animate these cards
  and add our own three.js rockets and sparks (user choice; the shared
  React component is a technique reference only). First of three steps
  in `ATMOSPHERE-EFFECTS-BRIEF.md` §6.7. Files: `src/scene/createFireworks.js` (new),
  `src/scene/createForeground.js`, `src/main.js`, `src/data/atmosphere.js`,
  `src/data/chapters.js`, `public/atmosphere/firework-burst.webp`.
- **Plan split** (user choice): `docs/MILESTONE-2-PLAN.md` became
  `docs/plan/` (this changelog, a short README and one file per area), so
  each update edits one short file. The old file is now a pointer.
  `.cursor/rules/keep-plan-updated.mdc` points here.
- **04 far shore removed** (user choice): the far shore lights added the
  same day read as extra buildings, and their reflections were about twice
  as bright as the skyline's own shimmer (mean luma 10 against 5). Lights
  and reflections are gone; the stronger 04 cloud stays. Files:
  `src/scene/farShore.js` (deleted), `src/scene/createIsland.js`,
  `src/scene/waterReflections.js`, `src/data/world.js`.
- **02 end of the skyline left dark** (user choice): no lights between
  the last towers and the ferry, so the ferry stands out. No code change.
- **Phone "01 / 06" stays on the opening screen only** (user choice). No
  code change.
- **Hero chapter numbers removed on desktop** (user request): only "Scroll
  to cross" remains. Files: `index.html`, `src/styles.css`.
- **Promenade lamps re-spaced** (user request): they bunched beside the
  Clock Tower on wide windows. File: `src/data/world.js`.
- **Stronger 04 cloud** (user choice): 45% before the chapter fade (was
  20%), a little wider. File: `src/data/atmosphere.js`.
- **Desktop mist unjoined** (user choice): no shore mist in desktop 01;
  the 05 left drift is a 180 m section. Files: `src/data/chapters.js`,
  `src/data/atmosphere.js`.

## Files changed in Milestone 2 up to the split

The old section 7, unchanged.

- `index.html`: hero section, header and nav, menu, counter, vertical text.
- `src/styles.css`: shell styles, overlay and vignette, new copy positions.
- `src/data/chapters.js`: copy regions, new `hero` block. (The Chinese labels
  ended up in `index.html`, next to the menu's copies of them.)
- `src/main.js`: wire up the new pieces.
- `src/ui/copyLayer.js`: shares chapter 01's fade with the vertical title.
- New: `src/ui/siteHeader.js` (nav, menu, counter, vertical label, side pager), `src/scene/createWordmark.js`,
  `src/scene/createMoon.js`, `src/ui/cursorRing.js`,
  `src/ui/pointerParallax.js`, `src/scene/createPetals.js`,
  `src/scene/createGlow.js`.
- `src/data/world.js`: the `moon` block.
- `src/data/chapters.js`: `petals` density in chapters 05 and 06; desktop
  `parallax` multipliers in 05 and 06.
- `src/scroll/cameraRig.js`: the parallax orbit (`setParallax`, `PARALLAX`);
  `poseFov` and the per-pose `keepHeight` option (Clock Tower rebuild).
- `src/scene/createWater.js`: glassy water, ripples sampled blurred (`BLUR`).
- New: `src/scene/surfaces.js` (code-drawn surface textures; ferry upper
  deck, cabin and hull redrawn with the ferry rebuild; Clock Tower shaft,
  pilaster and crown textures and Roman-numeral dials redrawn with the tower
  rebuild), `src/scene/cityWindows.js` (lit-window grid shader; floor
  strips and the `glow` option, user choice, 2026-10-02) and
  `src/scene/strut.js` (shared helper for thin rods: ferry masts, tower
  mast).
- `src/scene/createLighting.js`: lower sky fill.
- `src/scene/createKowloonEdge.js`: textured Clock Tower, dials, floodlight;
  Kowloon windows. Then the Clock Tower rebuilt from photos at real
  proportions (pilasters, bracketed cornice, two crown stages with scrolls,
  columns and balconies, dome, lattice mast, three Roman-numeral dials,
  arched lit door, golden glow all the way up; user request, 2026-10-01).
- `src/scene/createIsland.js`: Central and IFC windows. Then IFC rebuilt
  from photos (recessed-corner tiers, face slots, bronze bands, floodlit
  top, crown fins), a lit IFC Mall podium, the Central Ferry Piers, and the
  Observation Wheel rebuilt at true scale (truss rim, cable spokes, glowing
  hub, 42 gondolas, A-frame legs, tents) and turning (user request,
  2026-10-02).
- `src/main.js`: turns the wheel each frame in continuous mode.
- `src/data/world.js`: IFC podium, wheel radius 27.5 m and hub height,
  Central Ferry Piers positions.
- `src/data/chapters.js`: mobile 01 IFC right target 89% for the true width.
- `src/scene/surfaces.js`: the wheel's hub glow.
- `src/scene/createVessels.js`: Star Ferry reshaped, then rebuilt from photos
  (lofted hull, rubbing strip, tyres, open lower deck with lit cabin, green
  band, upper deck with bridge ends and life rings, roof canisters, funnel,
  tripod masts, rigging, navigation lights, foam skirt following the hull
  (replaced by a wake on the water, part 3f);
  shared outline and ribbon helpers); rebuilt junk (lofted
  hull, deckhouse, canopy, rails, tyres, rudder, battened sails, rigging;
  masthead pennants removed, user request, 2026-10-01); vessel lights.
- `src/data/chapters.js`: re-solved chapter 04 camera and junk positions
  for the junk's real proportions; re-solved desktop 03 camera and ferry
  position for the rebuilt ferry's masts; desktop 02 re-solved for the
  bigger Clock Tower (closer, lower, looking up; new tower, ferry and
  horizon targets; `keepHeight`).
- `src/ui/composition.js`: the probe skips parts marked `noProbe` (rigging).
- `src/scene/gating.js`: faded copies keep shader patches; meshes with one
  material per face fade too.
- `src/scene/createForeground.js`: depth-only twins for a clean railing
  fade, seawall strip top 5 cm below the deck.
- `src/data/world.js`: railing B on the promontory's harbour edge; the
  big 02 palm moved left, clear of the tower, and the small palm by the
  tower's foot moved right (user request, 2026-10-01).
- `src/ui/debug.js`: wordmark position in the probe; `clearance()` takes a
  `parallax` option.
- `src/scene/createForeground.js`: the stone railing (instanced bays,
  posts, wave panels, lanterns, glows) and the tall promenade lamps (user
  request, 2026-10-02).
- New: `src/scene/lamps.js`: railing layout, the list of promenade lights,
  `addLampLight` (warm pools faked in a material) and the instanced glow
  material.
- `src/scene/surfaces.js`: railing granite and post panel textures.
- `src/data/world.js`: `foreground.lamps` positions; railing runs on every
  edge near the Clock Tower (`railings` that fade, `edgeRailings` that
  always show; user request, 2026-10-02).
- `src/data/chapters.js`: the 香港 wordmark raised over the boats (`HERO`
  feet at 74% desktop, 73% mobile; user request, 2026-10-02).
- `src/scene/lamps.js`: `addWetPaving` (slabs, wet patches and lamp
  reflections on the promenade tops) and `TOWER_FLOOD`;
  `src/scene/surfaces.js`: `promenadePaving` slab tile;
  `src/scene/createKowloonEdge.js`: the wet-paving ground material, weaker
  lantern pools on it; `src/scene/gating.js`: faded copies keep the program
  cache key (user request, 2026-10-02).
- `src/data/chapters.js` and `src/scene/createWordmark.js`: mobile 香港
  floats in the sky (`depth` placement, feet at 42%, width 78%);
  `index.html`: hint "Scroll to cross", the new footer with the pill
  "Return to the harbour" button at its top (moved out of 06);
  `src/styles.css`: pill button, footer, the chapter layer fading as the
  footer rises (the nav bar is not forced back); new `src/ui/siteFooter.js`
  (`--footer-in`, `is-at-footer`), started from `src/main.js` (user
  requests, 2026-10-02).
- New: `src/scene/palms.js` (two 3D palm shapes, sway and leaflet
  cut-out shader, instanced meshes with fade twins, mobile-only palms);
  `src/scene/surfaces.js`: `palmAtlas`; `src/scene/createForeground.js`:
  the palms replace the flat cards, `update` and `setBreakpoint`;
  `src/data/world.js`: nine palms with shapes, the water palm moved onto
  land; `src/scene/gating.js`: per-key fade windows; `src/main.js`: the
  palms' late fade-in and early fade-out, sway in continuous mode only
  (user request, 2026-10-02). Then three desktop-only palms in
  `src/data/world.js`, and `palms.js` shows palms per breakpoint (user
  choice, 2026-10-02).
- New: `src/scene/bauhinia.js` (the bauhinia tree: skeleton, wood tubes,
  instanced leaf and flower cards with flutter and glow, falling petals,
  fade twins); `src/scene/surfaces.js`: `bauhiniaAtlas`;
  `src/scene/createForeground.js`: the tree as the `bauhinia` group;
  `src/data/world.js`: `foreground.bauhinia`; `src/data/chapters.js`:
  `bauhinia` in every visibility, 1 only in desktop 01; `src/main.js`: the
  `bauhinia` gating target; `src/scene/createPetals.js`: the wind turned
  toward screen left, shared petal texture, colours and wind (user choice,
  2026-10-02).
- New: `src/scene/waterReflections.js` (the lights the water reflects:
  IFC, Clock Tower, moon, ferry, junk; `cityStrip`, the skyline summarised
  along the island front); `src/scene/createWater.js`: the glint shader
  (glows with ragged edges and soft ends, sliver glints, skyline shimmer),
  the rim light's and point lights' glare removed, the plane cut into
  64 × 64 squares, `setSources`, `setFade`, `setCity` and `reflect`
  (per-frame culling); `src/main.js`: the lights, the skyline strip, fades
  tied to the ferry, junk and IFC gating, `water.reflect` before each render
  (user choices, 2026-10-02; reworked twice the same day, user requests).
- Central buildings and mountains (step 5, stop 6; user choices,
  2026-10-02): `src/scene/cityWindows.js` gains a `maxLit` cap;
  `src/scene/createIsland.js` dims the skyline windows (part 1);
  `cityWindows.js` `close` option, `createIsland.js` `setCityLevel`,
  `src/data/chapters.js` `city: 0.6` in 05, `src/main.js` the `city` gate
  over the whole move (part 1b). New
  `src/scene/createMountains.js` (three shaded ranges with jagged ridges
  and a moonlit edge, the mist band, the slope lights), replacing the
  mountain code in `createIsland.js`; `src/data/world.js` (the Peak outline,
  the third range, mist and lights); `src/scene/createMoon.js` (draw order)
  (part 2). New `src/scene/landmarks.js` (Bank of China Tower, Cheung Kong
  Center, Central Plaza, The Center, masts, warning lights) and
  `src/scene/prism.js` (the shared extrusion helper, moved out of
  `createIsland.js`); `createIsland.js` varied skyline tops and landmark
  clearance, `setCityLevel` also dims the landmarks; `src/data/world.js`
  `landmarks` (part 3). `cityWindows.js` `dark` option and fewer lit
  skyline windows in `createIsland.js` (part 3b). `cityWindows.js` `vary`
  option and `cityDensity`, new `src/scene/cityDots.js` (window dots on far
  towers), `createIsland.js` shared `SKYLINE_WINDOWS` settings (part 3c).
  `cityWindows.js` `citySoft` (softer single-window edges on phones),
  `src/main.js` (antialiasing on phones too, sets `citySoft` per
  breakpoint), `src/scene/landmarks.js` (comment only), `createIsland.js`
  3–6% lit skyline, `src/data/chapters.js` `city: 0.6` in 06,
  `cityDots.js` dots sized in metres (part 3d). New `src/scene/facades.js`
  (painted curtain walls, metre UVs, phone mipmap bias); `createIsland.js`
  IFC uses them in place of the window shader; `src/main.js` sets
  `facadeBias` per breakpoint (part 3e, step 1). `facades.js` per-tower
  colours and levels, `braceWall` (Bank of China skin), neon line mask,
  UVs for angled walls; `src/scene/landmarks.js` paints all four
  landmarks with them (part 3e, step 2); `createIsland.js` IFC Mall
  podium painted the same way, and the ferry pier halls' colonnade painted
  with `pierHall` in place of modelled posts (part 3e). New
  `src/scene/wakes.js` (flat wakes that stream past the boats);
  `createVessels.js` wakes in place of the ferry's foam skirt, updated
  each frame; `surfaces.js` foam strip removed, junk waterline darkened;
  `waterReflections.js` hull sources; `createWater.js` hull mirror images
  that hide the glints behind them (part 3f). New `src/scene/cityLight.js`
  (street glow and sky in the glass) used by `facades.js` and
  `cityWindows.js`; `createIsland.js` uplit IFC crown fins (part 3e,
  step 3). `cityWindows.js` lights offices on each floor and gains a
  `ribbon` option (curtain-wall towers), used by `createIsland.js` and
  `createKowloonEdge.js`; `cityDots.js` dots in runs on one floor (part
  3e, step 4). New `src/scene/bloom.js` (glow round bright lights);
  `createScene.js` adds it and draws the overlay layer after it;
  `createWordmark.js` and `createPetals.js` (near petals) on the overlay
  layer; `src/main.js` sets the glow per breakpoint, `?bloom=` and the
  phone frame-rate fallback (part 3e, step 5). New
  `src/scene/createAtmosphere.js` and `src/data/atmosphere.js` (coral
  cloud cards, then the harbour mist belt), `public/atmosphere/coral-clouds.webp`
  and `public/atmosphere/harbour-mist.webp`; `src/main.js` adds, places and
  fades them; `src/data/chapters.js` gains `clouds`, `mist` and `seaMist`
  levels per chapter (part 3g). (`src/scene/farShore.js`, far shore
  lights in 04, was added and removed the same day; see 2026-10-02 above.)
- Chapter counter numbers removed (3.3, user request, 2026-10-02):
  `index.html` and `src/styles.css`; the hint and the phone's "01 / 06"
  stay.
- Promenade lamps re-spaced (2026-10-02): `WORLD.foreground.lamps` in
  `src/data/world.js`.
- Loading screen (3.12; user choice, 2026-10-02): `index.html` (inline
  `is-booting` script and 12 s safety timer), `src/styles.css` (poster art,
  copy and footer hidden while loading and during the fade),
  `src/main.js` and `src/ui/fallback.js` (lift `is-booting`).
- Publishing (user choice, 2026-10-02): `vite.config.js` builds with the
  base `/hongkong/` on GitHub; new `.github/workflows/deploy.yml` builds and
  publishes to GitHub Pages on every push to `main`; `.gitignore` keeps the
  reference images of unknown rights and the AI-made references local.
- `docs/ASSET-LEDGER.md`: entries for the railing art and any font; the
  stone railing and lamps built in code from the user's designs; the wet
  paving; the palms; the bauhinia tree; the skyline reflections.
