# Changelog

Part of the Milestone 2 plan (index: [README.md](README.md)). Newest first.
One entry per change: what changed, why, and the files. Older history also
lives in the dated notes inside each area file, and in `git log`.

## 2026-10-02

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
