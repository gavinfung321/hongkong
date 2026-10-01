# Milestone 2 — Page Shell and Kage-style Look Test

**Status:** Approved 2026-10-01 (decisions in section 9). Built step by step,
with a review stop after each step.

This plan follows the approved grey-box (`CURSOR-GREYBOX-BRIEF.md`, review in
`greybox-review/REVIEW.md`). It does not change the existing plan files or the
approved camera journey.

## 1. Goal

Give the site the Kage-style depth and finish, proven on **one frame (01)**
before it is applied to all six chapters.

The milestone has two halves:

1. **Page shell (all chapters):** logo, nav bar, chapter counter, mobile menu,
   the 香港 hero wordmark, the "Scroll to cross" hint, vertical Chinese text,
   and cursor parallax.
2. **Look test (frame 01 only):** the layers that make Kage feel deep, built
   once on frame 01 and measured on the iPhone 11.

## 2. What we take from Kage, and what we don't

Watching the recordings shows that Kage's 3D models are about as simple as our
grey-box: the temple is dark boxes with flat glowing window rectangles. Its
depth comes from layers around the simple 3D:

| Kage technique | Harbour version in this milestone |
|---|---|
| Painted 2D cutouts at the frame edges (grass, pine, wall) that move faster than the scene | The promenade railing as a painted cutout (frame 01) |
| A giant wordmark inside the scene, with grass covering its feet | 香港 standing on the water in front of the scene, shaded toward its feet, sinking as you scroll |
| Particles at several depths (red leaves, embers) | Bauhinia petals drifting across the whole site, gone for the fireworks (4.4) |
| A big moon as the focal light | An original yellow moon behind the Peak ridge, drawn in code (3.9) |
| Soft glow on the moon, lanterns and windows | Glow on lit windows, the Clock Tower faces and IFC's crown |
| A ring that trails the mouse pointer | An original cursor ring, desktop only (3.10) |
| Fine diagonal-line texture over the page | The restrained halftone from the world bible |
| Mostly dark frames with a vignette | Our navy and aubergine palette, plus a vignette |
| Layers shift with the mouse | Cursor parallax on desktop |
| Nav bar, chapter counter, vertical 影の道, chapter label | Nav bar, counter, vertical 維港之夜, per-chapter Chinese label |

**Licence rule:** Kage's licence grants no reuse. We copy *techniques* only,
which are common web techniques. No Kage code, images, lettering, layout
measurements or copy are used. All artwork is original or licensed, and
recorded in `ASSET-LEDGER.md`.

## 3. Page shell (all chapters)

### 3.1 Hero section ("Chapter 00")

Today the page opens already inside chapter 01's hold, so 01's text is showing
at the top. The wordmark needs a moment of its own first.

- Add a hero section of about **100 svh** before chapter 01. The camera holds
  the 01 pose during it (the rig already holds still before 01's keyframe).
- Chapter 01's copy shows from the moment the page loads, top-left at the top
  of the Clock Tower, together with the wordmark, logo, nav and scroll hint
  (user request, 2026-10-01). From the first scroll it rises and fades out in
  step with the sinking wordmark, so 01's hold is scene only; links to 01 go
  to the top of the page. Other chapters' copy also leaves upward and arrives
  from below.
- Scrolling through the hero sinks the wordmark. It is fully gone before the
  01 copy starts fading in (progress p = 0.25).
- Deep links (`#chapter-01` … `#chapter-06`) and `?hold=` still land on each
  chapter's hold pose, unchanged.
- Accessibility: the page gets one real `<h1>` in the hero, visually hidden
  ("Victoria Harbour — A Night Crossing"). Chapter 01's title becomes an
  `<h2>` like the others.

### 3.2 香港 wordmark

Agreed with the user:

- **Placement:** standing on the water, drawn in front of the whole scene
  including the railing (user request, 2026-10-01, replacing "behind the
  railing").
- **Exit:** from the first scroll it moves down out of the frame and fades,
  while the camera pushes in (chapter 01's `holdDolly`, which now starts at
  the top of the page instead of at the hold). Both start immediately, with no
  dead zone.
- **Mobile:** stays horizontal (not stacked) and smaller, about 85% of the
  screen width.
- **Reduced motion:** no sinking; it simply fades out when you leave the hero.

How it is built:

- A flat plane in the scene with the two characters drawn onto it from a
  system Traditional Chinese font (Microsoft JhengHei on Windows, PingFang TC
  on iPhone). No font file is needed for the test; a licensed display font can
  replace it in the assets milestone.
- Colour: warm cream (`--color-cream`), slightly fogged so it sits in the
  scene rather than on the glass. The lower two thirds shade down into dusk
  violet, as if lit from above (user request, 2026-10-01, after Kage).
- Position and size are authored per breakpoint in `chapters.js` (a new `hero`
  block), like the camera poses.
- The canvas is decorative (`aria-hidden`); the real heading is the hidden
  `<h1>`.

### 3.3 "Scroll to cross" hint and chapter counter

- Bottom-left: a small "Scroll to cross" label with a short line, and the
  numbers **01–06** beneath it.
- The hint shows only in the hero and fades out as the wordmark sinks. Its line
  loops: a bright stroke draws in over a faint track and leaves to the right
  (user request, 2026-10-01).
- The whole counter shows only in the hero and fades out once chapter 01 begins
  (user request, 2026-10-01). Each number is a link to that chapter; on hover
  it turns sail coral and rises (user request, an exception to coral being
  reserved for the sails).
- On mobile the counter shrinks to the current number only ("01 / 06"), so it
  never collides with copy.
- Dimmed so the scene leads: hint at 50% and numbers at 40% opacity, full on
  hover (user request, 2026-10-01).
- Chapter 01's body no longer ends with "Scroll to cross the water."; the
  hint already says it, and the hint now reads "Let's cross the harbour"
  instead of "Scroll to cross" (user requests, 2026-10-01).
- Chapter 01's kicker is "Victoria Harbour" (was "Arrival"), naming the
  place like the other chapters, and its body reads "Night settles on the
  water, and the island begins to glow." so the name isn't repeated (user
  requests, 2026-10-01). Still placeholder copy until the copy milestone.

### 3.4 Nav bar and mobile menu

- **Desktop:** a thin bar across the top. Left: logo. Right: chapter links and
  a menu button.
- **Both:** the bar slides away while scrolling down and returns on any scroll
  up, or when it receives keyboard focus (user request, 2026-10-01).
  - Proposed links: Clock Tower · Star Ferry · Red Sails · City of Light ·
    Afterglow (chapter 01 is reached through the logo).
  - The current chapter's link is underlined in warm amber (`--color-warm`).
    Coral stays reserved for the junk's sails.
  - On hover or keyboard focus, each English label rolls up and its Chinese
    label (from 3.6) rolls in from below (user request, 2026-10-01).
- **Mobile:** logo plus a menu button. The menu opens a full-screen dark panel
  listing all six chapters, each with its Chinese label.
  - The button reports open/closed to screen readers, keyboard focus stays in
    the panel while it is open, and Escape closes it.
- Links reuse the existing jump-to-chapter behaviour, including the short fade
  to dark for long jumps.
- The bar stays transparent over the scene, with a faint dark gradient behind
  it so links stay readable.
- It also works in the poster-only fallback, where it simply scrolls the
  page.

### 3.5 Logo

- An original mark: a simple junk-sail outline (the one place coral is
  allowed in the shell), next to the name "HONG KONG" in small caps.
- Tagline under the name: "Pearl of the Orient" (user request, 2026-10-01;
  it was "Victoria Harbour, after dark"). It pairs with the vertical 東方明珠.

### 3.6 Vertical Chinese text (built 2026-10-01)

- **東方明珠** ("Pearl of the Orient"), written vertically down the right
  edge below the nav. It replaced 維港之夜. Large and bright so it reads as
  a second title: 1.75rem on desktop, 1.125rem on mobile, near-full ivory
  (user requests, 2026-10-01).
- It leaves together with chapter 01's copy ("Harbour at Dusk"): the same
  scroll-linked fade and 48 px rise, at the same speed, and comes back with
  it when you scroll to the top (user request, 2026-10-01: "they should
  scroll away together"). It first followed the header's timed slide, which
  ran at a different speed. `copyLayer.js` publishes chapter 01's values as
  `--intro-copy-opacity` / `--intro-copy-shift` and the title uses them.
- A **per-chapter label** at the bottom right, also vertical, under a short
  hairline. It changes with the current chapter: the old label rises out and
  the new one comes up from below, like the copy. The hero shows 01's label.
  Wording as proposed (confirmed by the user, 2026-10-01):

  | Chapter | Label |
  |---|---|
  | 01 Harbour at Dusk | 維港 |
  | 02 The Kowloon Edge | 鐘樓 |
  | 03 Across the Water | 天星小輪 |
  | 04 Red Sails | 帆船 |
  | 05 City of Light | 國金 |
  | 06 Afterglow | 煙花 |

- Real HTML text with `lang="zh-Hant"` and vertical writing mode. Decorative
  for screen readers, because the English chapter names already carry the
  meaning.
- On mobile both are smaller. No frame has a subject under either one, so
  the label stays on screen on mobile too (it is also in the menu).
- Built in `index.html` (`.vertical-text`), styled in `styles.css`; the
  current label is switched in `siteHeader.js` alongside the nav and counter.
  Same system Chinese fonts as the wordmark. The label is hidden in the
  poster-only fallback, where there is no scroll progress.

### 3.7 Copy regions move down

The nav bar takes about the top 8% of the screen on desktop and 7% on mobile.
Every chapter's copy region currently starts at 4–12%, so all twelve move down
to start at **11% or lower** (desktop) and **9% or lower** (mobile).
Afterwards, re-run the composition probe, the copy-overflow check and the
landmark-overlap check for all twelve frames, exactly as in the grey-box.

### 3.8 Cursor parallax (desktop only; built 2026-10-01)

- The camera swings up to **±1.6 m** sideways and **±0.6 m** up and down
  (×1.8 in 05 and 06), following the mouse with smooth damping. It orbits a point 400 m ahead, so
  the foreground (railing, palms, tower, ferry) slides one way and the far
  skyline and moon the other, which gives real depth.
- **Stronger parallax** (user request, 2026-10-01: "make the PARALLAX effect
  more obvious … I dont see much effect when I move my cursor around"). The
  first version slid camera and target together by 0.5 m. Every subject is
  50 m or more away, so that moved them under 1% of the screen width (the
  Clock Tower 0.6%, the 03 ferry 3%). Now the camera orbits instead of
  sliding (the target stays put), the swing is 3× larger, and the follow is
  twice as fast. Measured travel between mouse full left and full right at
  1.6 m: Clock Tower ~2%, 03 ferry ~9%, 04 junk ~5%; the near railing and
  palms move much more. In 02 the IFC peeks out from behind the Clock Tower
  at the far right of the mouse range.
- At the mouse extremes a subject may drift up to **±6%** from its
  composition target (was ±3%), the price of the stronger swing. The authored
  centre pose still passes the ±3% probe.
- **No vertical shift** (user request, 2026-10-01: "the harbor keeps blinking
  when my cursor is going around"). Raising or lowering the eye changes the
  viewing angle onto the water, so the moonlit ripple glints sweep across the
  whole harbour and read as blinking. Measured frame-to-frame change with the
  mouse moving: up/down only 8.95, sideways only 6.95, still 4.85. With
  sideways only and the slower follow below it is 6.66, close to the still
  water's own shimmer.
- **Vertical shift back at ±0.6 m** (user request, 2026-10-01: "there is no
  PARALLAX when the cursor move up and down?", option 1 with tests). The
  blinking came from sharp ripples, and the water is now glassy. Tests run
  before turning it on for the user:
  - Water blink with the real mouse on 01 (frame-to-frame change): still
    0.29, sideways 2.56, up/down 3.87. The old sharp water scored 4.85 still
    and 8.95 up/down.
  - Strobe on open water in 01 (second difference, 5 cm per frame): still
    0.22, sideways 0.49, up 1.09. The sharp water scored 54 on this test.
  - Z-fighting, 1 cm vertical steps at ±0.6 m on 01, 02 and 03: no patches.
    03's moon path speckles at its soft edge, the same as for sideways moves.
  - Framing: every desktop frame stays within ±6% at all four mouse corners.
    Clearance drops to 1.67 m with the mouse at the bottom (railing in the
    01 → 02 move), above the 1.5 m rule. 03's camera is the lowest (2.2 m);
    it dips to 1.6 m.
  - Mouse up raises the eye: in 01 the view looks over the railing, mouse
    down brings the railing up across the water.
- Full strength during holds, fading to zero during scroll transitions.
- Off on touch devices and in reduced motion.
- Must keep every frame inside ±6% of its composition targets at the
  extremes, and the camera clearance above 1.5 m.
- **As built:** the mouse position is damped (`FOLLOW` 3 per second in
  `src/ui/pointerParallax.js`; it was 1.5 while the water still shimmered,
  which felt sluggish) and drifts back to centre when the pointer leaves the
  window. The camera rig moves the camera and keeps the target
  (`PARALLAX` x 1.6 m, y 0.6 m in `cameraRig.js`), at full strength on holds and zero
  halfway through each transition. It also runs in the hero, so 香港 shifts
  against the scene. Desktop breakpoint and mouse only; off in reduced motion.
- **Per-chapter multiplier:** a desktop pose can scale the swing with
  `parallax` in `chapters.js`. 05 and 06 use 1.8 (wide views with distant
  subjects; safe up to 3 m). 01–04 take the plain 1.6 m (03's ferry would
  leave its ±6% band at 2 m).
- **Checked:** at all four mouse corners every desktop frame stays within
  ±6% of its targets (05's wheel misses are the existing documented
  deviation; 02's IFC peek is accepted), and the closest approach is 1.67 m
  (railing in the 01 → 02 move, mouse at the bottom); the debug
  `clearance()` takes a `parallax` option for this. Moving the camera in 1 cm
  steps at ±1.6 m sideways and ±0.6 m vertically on 01–03 shows no
  z-fighting.
- **Calm water while moving** (user request, 2026-10-01: "when I start
  scrolling, the sideways and the water are flickering again"). Parallax was
  not the cause: it moves the camera under 0.6 m/s, and the camera path is
  smooth with or without it. Scroll transitions move the camera up to ~3 m
  per frame, so the 3–15 m ripples jumped about half a wavelength each frame
  and strobed (the wagon-wheel effect).
- **Glassy water** (user choice, 2026-10-01, after a screen recording and a
  comparison of four blur levels). The ripples are always sampled at least
  5 mip levels down (`BLUR` in `src/scene/createWater.js`), so the harbour
  reads as a calm, glassy sheen with a soft moon path rather than sharp chop.
  Measured strobing (second difference between frames on the water) at
  1.5 m per frame: 54 with sharp ripples, 14 glassy, 13 for perfectly flat
  water; a small sideways move scores 2.9.
- Tried and dropped: swapping to 3× larger ripples while the camera moved
  fast (the swap itself showed as a pop at the start of every scroll, seen in
  the user's recording), and blurring only while moving (still a visible
  soften and sharpen). A larger tile everywhere left 03's water patchy.
- The 01 and 02 railings flickered while scrolling (user report,
  2026-10-01). A holds-only railing fade was built first, on the theory of a
  picket-fence strobe (dark posts against the moon path as the camera sweeps
  past), then removed at the user's request once the real cause below was
  fixed: the railing stays visible while scrolling.
- **Real cause of the railing flicker: z-fighting** (user report, 2026-10-01:
  "still flickering … there was no issue before the parallax"). The seawall
  strip under each railing had its top at the deck height (2.5 m), level with
  the promenade, so the two surfaces fought and flipped at the slightest
  camera move. Before parallax the camera stood still on holds, so the
  pattern stayed frozen; parallax keeps it moving. Moving the camera 1 cm
  flipped solid bands along both railing bases. The strip's top is now 5 cm
  below the deck (`createForeground.js`), and the bands are gone. Parallax
  stays.
- **Railing B moved to the harbour edge** (user request, 2026-10-01: "the
  railing should be at the edge of the harbour, not in the inside"). It ran
  20 m inside the Clock Tower promontory (x ≈ −69.5); it now follows the
  promontory's water edge at x = −50, z 2–30 (`WORLD.foreground.railings`).
  All frames still pass and the closest camera approach is unchanged (2.26 m).
- **No-flicker baseline** (user request, 2026-10-01: "remember this setup
  because there is no flickering anymore"). Keep all of these when changing
  the scene: glassy water (`BLUR` 5; it is what makes the vertical parallax
  safe); vertical parallax no more than ±0.6 m; seawall strip tops 5 cm below the deck (never coplanar surfaces);
  railing B at x = −50; the railing visible while scrolling, with the
  depth-twin fade only for 02 → 03. Any new flat piece laid on the deck or
  water needs a few centimetres of gap, or it will z-fight under parallax.
- **Clean railing fade** (kept for the 02 → 03 fade-out): depth-only twins
  of the posts, rails and wall are drawn just before the railing (render order 1 and 2, below the wordmark at
  10), so a half-faded railing is an even veil over the water instead of
  darker patches where its pieces overlap (`createForeground.js`).

### 3.9 Moon (user request, 2026-10-01)

- A big yellow moon behind the far mountain range, upper right of the opening
  frame, with the ridge hiding its lower edge. Kage's red moon was the
  reference, but its artwork can't be reused, so ours is original.
- Drawn in code (`src/scene/createMoon.js`), no image file, plus a faint
  additive halo. The surface (more dark spots for realism and depth, then
  changed to fewer spots and larger seas like Kage's, user requests,
  2026-10-01):
  - three large dark "seas" (maria), each built from big overlapping blobs
    so they merge into broad patches, in the `MARIA` list (x, y, spread,
    blob count, darkness, blob size);
  - only 6 small craters, with a shadowed upper-left wall and a bright
    lower-right rim;
  - spots squashed toward the rim, as on a sphere;
  - fine grain, then sphere shading: lit from the upper left, darker rim.
- A fixed object in the world (`WORLD.moon` in `world.js`: position, radius,
  seed), so it stays put as the camera travels: it peeks between towers in 05
  and sits low behind IFC in 06.
- Far larger than life on purpose (about 9° across) and unaffected by fog.
- Tweak later: seas in `MARIA`, crater count in `CRATERS`, colours in
  `drawDisc`, halo strength in `drawHalo`, and size or place in `WORLD.moon`
  (changing its `seed` reshuffles the spots). A painted moon can replace the disc in the assets
  milestone.

### 3.11 Side pager (user request, 2026-10-01)

- After Kage: six short dashes stacked in the middle of the right edge, one
  per chapter. The current chapter's dash is twice as long and bright (01's
  in the hero); the others are faint.
- Each dash is a link to its chapter. On hover it lengthens and the chapter
  name appears to its left.
- Desktop only: on phones IFC stands at the right edge in 03–05, and the
  vertical label already shows the chapter. Hidden in the poster-only
  fallback. Like the counter, it duplicates the menu, so it is hidden from
  screen readers and the tab order.
- Built in `index.html` (`.side-pager`) and `styles.css`; `siteHeader.js`
  marks the current dash along with the nav and counter.

### 3.10 Cursor ring (user request, 2026-10-01)

- A thin cream ring (40 px) with a faint dark fill trails the mouse pointer
  with a soft lag, after Kage. The normal pointer stays visible.
- Grows 1.5× and brightens over links and buttons; shrinks slightly while
  pressed. Fades out when the pointer leaves the window.
- Mouse only: not created on touch devices or in reduced motion. It ignores
  clicks (`pointer-events: none`) and stops animating once it catches up.
- Built in `src/ui/cursorRing.js` with styles in `styles.css`; the follow
  speed is `FOLLOW` in the script.

## 4. Look test (frame 01 only)

Each layer below is added one at a time and screenshotted before and after.
The goal is to judge the finished look on one frame, then decide what goes to
all six.

1. **Halftone overlay and vignette.** A CSS layer between the 3D canvas and
   the text: a fine diagonal-line or dot pattern at low opacity, plus a soft
   darkening at the edges. It sits under the text, so contrast doesn't drop.
   Costs almost nothing to render.
2. **Lit windows (built 2026-10-01, with 2b).** A window grid on every
   skyline building and IFC, drawn in the shader in world metres (3.6 m
   storeys, 3.2 m bays; IFC 4 m × 2.6 m, mostly cool white), so it doesn't
   stretch with each box (`src/scene/cityWindows.js`). Each building gets its
   own share of lit windows (Central 30%, Kowloon 22%, IFC 45%), warm with a
   quarter cool. Unlit windows are darker glass. Where a window shrinks to a
   couple of pixels, the grid fades to its average glow, so distant towers
   can't shimmer. Still to try: a brighter band of ground-level lights along
   the Central waterfront, as in the storyboard (user reminder, 2026-10-01).
2b. **Lighting and surfaces (user request, 2026-10-01: "why Kage's torii and
   temple look so real … everything looks very plain"; "go ahead and try").**
   Kage's models are as simple as ours; its realism comes from darkness,
   warm-and-cold light, textured surfaces and photo-like foreground cutouts.
   This step does the first three in code:
   - **Darker night:** the sky fill light drops from 2.2 to 0.8
     (`createLighting.js`), so local lights carry the frame. The cyan rim
     light is unchanged (it makes the moon path on the water).
   - **Warm local lights (3 point lights):** a floodlight at the foot of the
     Clock Tower's harbour face (bright brick low, fading up the shaft), the
     ferry's cabin light and the junk's deck lanterns (warm pools on the
     water). They ride on their objects, so they hide when a vessel is gated
     out.
   - **Clock Tower:** red brick with granite bands at each storey, corner
     quoins, arched windows (two lit) and a granite crown, plus lit clock
     dials with hour marks and hands. The brick is ~2 px on screen, so the
     mortar is faint and flat: sharp courses strobed while scrolling.
   - **Star Ferry, reshaped (user request, 2026-10-01).** Compared with a
     reference photo, the box proxy read as a generic barge. The user chose to
     reshape it in code now and swap in the Meshy model later, reversing the
     earlier "no interim reshape" decision. Built from rounded (stadium)
     plan shapes, so both ends are round like the real double-ended boats:
     - green hull with a dark waterline, under a dark rubbing strip (fender);
     - lower deck painted green and upper deck white, each with big framed
       warm windows (2.4 m bays, brightness varies per window); the walls
       glow faintly, as deck lights would light them, so the paint still
       reads at night;
     - a white band between the decks and a canopy roof that overhangs the
       upper deck;
     - a wheelhouse and mast at each end, a short white funnel with a dark top
       in the middle;
     - a soft broken foam line at the waterline, standing in the water as a
       thin skirt so it can't flicker against the water surface.
     - 40 m long including the fender, roof about 8 m up, matching the old
       proxy so the framings hold (the first version was 1 m shorter and its
       end showed in 03 at the far-left mouse position).
   - **Junk:** sail cloth with five sagging panels between the battens, seams
     and a warm glow toward the foot; plank strakes on the hull.
   - All textures are drawn in code (`src/scene/surfaces.js`); no image
     files, all original (ledger, Phase D).
   - **Checked:** 1 cm camera steps show no flicker on the windows (an early
     version made IFC's windows jump: the wall direction is now snapped to
     x / z and measured from each building's centre). Strobe on the skyline
     with mouse-sized moves is 0.6, like the calm water. At scroll speed
     (1.5 m per frame) the skyline pops less than before (5.2% of pixels
     against 8.3%); the tower scores higher than the plain box (15 against 4),
     which is its brick and stone detail moving, for the user to judge while
     scrolling.
   - **Checked (ferry reshape):** framing at the four mouse corners is the
     same as before the reshape (only the old IFC note in 02 remains). With
     1 cm camera steps, 03 changes on edges only (window frames, foam tips,
     petals); no surface flickers. 01 is unchanged (8,966 against 8,744
     changing pixels); 03 is up from 16,154 to 18,881, from the extra window
     edges.
   - **Not yet:** soft shadows, glow (step 3), reflections of the lit city in
     the water ("Skyline reflections", ledger Phase D), photo-like foreground
     cutouts (user artwork). On mobile the skyline windows mostly blend into
     their average glow; the iPhone check is in step 6.
3. **Glow.** Two options, tested side by side:
   - **A (recommended first):** soft glow sprites behind each bright light
     (clock faces, IFC crown, ferry windows). Cheap, art-directable, works on
     phones.
   - **B:** a bloom pass from the three.js add-ons (standard, not a custom
     shader). Richer, but costs speed on phones. Desktop only if used.
4. **Bauhinia petals (built; user request, 2026-10-01).** Replaces the warm
   specks. Petals of Hong Kong's flower (洋紫荊) drift across every chapter as
   the site's constant effect, instead of Kage's leaves. Rain was considered
   and rejected: it contradicts the clear moon and the fireworks, and Kage's
   "rain" feel mostly comes from the diagonal-line overlay (step 1).
   - **Look:** single loose petals drawn in code (no artwork), tinted in four
     muted shades from deep magenta to pale orchid so the coral sails lead.
   - **Depth:** a near layer of a few large petals (6 desktop / 4 mobile)
     drawn over everything, including 香港; a far layer of small fogged
     petals (70 / 32). Both travel with the camera, so moving still gives
     parallax.
   - **Motion:** slow fall, sideways breeze, sway and flutter; scrolling adds
     a short gust.
   - **Density:** sparse and calm. Full in the hero and 01–04, 0.6 in 05 so
     the city lights lead, 0 in 06 so the fireworks take over (`petals` in
     each chapter's `visibility`). Off in reduced motion.
   - **Cost:** two instanced draw calls, 76 petals updated per frame.
   - Built in `src/scene/createPetals.js`; sizes, counts, colours and wind are
     the constants at the top.
   - **Later (user, 2026-10-01):** the user will make the petal artwork
     (`bauhinia-petals.webp`) and a blossoming tree or branch cutout
     (`bauhinia-tree.webp`) from the reference photos in
     `docs/references/bauhinia/` (ledger, "Reference material"). The real
     flower is a more vivid fuchsia than our muted tints, with pale (not dark)
     veins and wavy edges, so colours and veins get re-tuned when the sprites
     arrive.
5. **Railing cutout.** Replace the grey railing blocks with a painted,
   transparent `promenade-railing.webp` (ledger item, P1). This needs the
   artwork first (section 9). Its base must sit just below the deck top, not
   level with it, to avoid z-fighting (3.8).
6. **Colour pass.** Try film-style tone mapping. It changes every colour, so
   it is only kept if 01 clearly improves, and the palette is re-tuned for all
   frames in a later milestone.

**Not in the look test:** 3D models (GLBs), real fireworks, the sparkle cursor,
particles in other chapters, sound, final copy and fonts.

## 5. Performance budget

Measured with the `?fps` overlay on a production build, as in
`greybox-review/PERFORMANCE.md`.

| Metric | Laptop | iPhone 11 |
|---|---|---|
| Average fps | ≥ 50 | ≥ 30 |
| 1% low fps | ≥ 40 | ≥ 24 |
| Draw calls | ≤ 100 (was ≤ 80) | ≤ 100 |
| New generated textures | ≤ 4 more, each ≤ 512 px, plus the wordmark (about 1400 × 700 px, so it stays sharp). **Over budget since 2b (2026-10-01):** 15 small code-drawn surface textures (the ferry reshape added four 512 × 64 deck textures and a foam strip), about 6.2 MB of GPU memory in all; the Clock Tower shaft maps are 256 × 1088 px. To be measured on the iPhone 11 in step 6, then the budget is either raised (user decision) or the shaft is tiled at a lower resolution | same |
| Point lights | 3 (Clock Tower flood, ferry, junk) since 2b | same |
| JS bundle (gzip) | ≤ 230 KB (was ≤ 200 KB) | same |

If the iPhone 11 misses its target, layers are switched off on mobile in this
order: bloom (if used), particles, glow sprites, lit windows. The existing
automatic resolution drop stays as the last safety net.

## 6. Build steps

Stop for the user's review after each step, as in the grey-box.

1. **Shell structure.** Hero section, hidden `<h1>`, nav bar, mobile menu,
   counter, logo. "Return to the harbour" goes to the hero. Move the copy regions down and
   re-run the checks for all twelve frames.
2. **Wordmark and hint.** 香港 in the scene, sinking with scroll. "Scroll to
   cross" hint. Reduced-motion fade. Desktop and mobile.
3. **Vertical Chinese text.** 維港之夜 and the per-chapter labels.
4. **Cursor parallax.** Then re-check composition and clearance at the
   extremes.
5. **Look test on 01.** The layers in section 4, one at a time, with
   before-and-after screenshots.
6. **Measure and review.** Laptop numbers by me; iPhone 11 and 13 numbers by
   the user. Refresh all twelve review screenshots, write
   `docs/milestone-2-review/REVIEW.md`, commit.

## 7. Files expected to change

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
- `src/scroll/cameraRig.js`: the parallax orbit (`setParallax`, `PARALLAX`).
- `src/scene/createWater.js`: glassy water, ripples sampled blurred (`BLUR`).
- New: `src/scene/surfaces.js` (code-drawn surface textures) and
  `src/scene/cityWindows.js` (lit-window grid shader).
- `src/scene/createLighting.js`: lower sky fill.
- `src/scene/createKowloonEdge.js`: textured Clock Tower, dials, floodlight;
  Kowloon windows.
- `src/scene/createIsland.js`: Central and IFC windows.
- `src/scene/createVessels.js`: reshaped Star Ferry (rounded decks, windows,
  fender, canopy, funnel, wheelhouses, foam skirt), junk sails and planks,
  vessel lights.
- `src/scene/gating.js`: faded copies keep shader patches; meshes with one
  material per face fade too.
- `src/scene/createForeground.js`: depth-only twins for a clean railing
  fade, seawall strip top 5 cm below the deck.
- `src/data/world.js`: railing B on the promontory's harbour edge.
- `src/ui/debug.js`: wordmark position in the probe; `clearance()` takes a
  `parallax` option.
- `docs/ASSET-LEDGER.md`: entries for the railing art and any font.

## 8. Acceptance checks

The milestone passes when:

1. All twelve frames still pass the composition probe (±3%) with the nav bar in
   place, and no copy overflows at 1440 × 900, 1156 × 766 and 390 × 844.
   With the mouse at either edge, desktop frames stay within ±6% and the
   parallax is plainly visible (user request, 2026-10-01).
2. The wordmark reads in front of the whole scene, shading into dusk toward its
   feet, and sinks and fades out with the 01 copy from the first scroll.
   Mobile shows it horizontal and smaller.
3. Nav links, counter numbers, the menu and "Return to the harbour" all land
   on the right hold. The menu works with the keyboard and a screen reader.
   The vertical label shows the current chapter and never covers a subject.
   The side pager (desktop) marks the current chapter and its dashes land on
   the right hold.
4. Reduced-motion mode shows no sinking, no parallax, no particles and no
   cursor ring, and still tells the whole story. In continuous mode the water
   does not blink or strobe while the mouse moves or during scroll
   transitions.
5. The poster-only fallback still works, with a usable nav.
6. Frame 01 with the look-test layers is approved by the user against the
   storyboard and the Kage reference.
7. The performance budget in section 5 is met on the laptop and the iPhone 11.

## 9. Decisions (resolved 2026-10-01)

1. **Tagline under the logo:** first "Victoria Harbour, after dark", because
   "Pearl of the Orient" seemed to conflict with the world bible's tone
   rules. Later changed to "Pearl of the Orient" at the user's request
   (2026-10-01), matching the vertical 東方明珠.
2. **Chinese labels:** the six labels in 3.6, as proposed.
3. **Railing artwork:** made with an AI image tool. The tool, its commercial
   licence terms and the prompt are recorded in `ASSET-LEDGER.md` before the
   image is used.
4. **"Return to the harbour" target:** the hero, so the wordmark rises again.
5. **Nav labels:** the five proposed links in 3.4 (no change requested).

**Status:** approved for coding, step by step, with a review stop after each
step.

## 10. After this milestone

| Milestone | Content |
|---|---|
| 3. Assets | GLB models from the ledger (junk, ferry, Clock Tower, IFC, wheel), remaining cutouts including the user's bauhinia petals and tree, display fonts. The Star Ferry is made by the user in Meshy.ai; until then the code-built ferry stands in; it was reshaped to look like the real boat (user request, 2026-10-01, reversing the earlier "no interim reshape" decision; section 4, step 2b). Specs and licence notes are in `ASSET-LEDGER.md`, "Meshy models". Also the user's stone railing, promenade palms, wet paving tiles and more realistic skyline buildings (`ASSET-LEDGER.md`, "User reminders", 2026-10-01) |
| 4. Atmosphere, all chapters | Clouds lit from below and searchlight beams from the Central towers (user reminders, 2026-10-01), the look-test layers rolled out to 02–06, extra particles alongside the petals (sea spray, city bokeh, firework embers in 06), real fireworks, a sparkle trail added to the cursor ring (3.10) |
| 5. Copy and launch | Final copy, poster images, a full performance pass on both iPhones, deployment |
