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
  edge below the nav. It replaced 維港之夜, and it slides up and fades out
  with the header on scroll down and returns with it on scroll up. Large and
  bright so it reads as a second title: 1.75rem on desktop, 1.125rem on
  mobile, near-full ivory (user requests, 2026-10-01).
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

- The camera shifts up to **±0.5 m** sideways only, following the mouse with
  smooth damping. Near objects (railing, tower) slide more than the distant
  skyline, which gives real depth.
- **No vertical shift** (user request, 2026-10-01: "the harbor keeps blinking
  when my cursor is going around"). Raising or lowering the eye changes the
  viewing angle onto the water, so the moonlit ripple glints sweep across the
  whole harbour and read as blinking. Measured frame-to-frame change with the
  mouse moving: up/down only 8.95, sideways only 6.95, still 4.85. With
  sideways only and the slower follow below it is 6.66, close to the still
  water's own shimmer.
- Full strength during holds, fading to zero during scroll transitions.
- Off on touch devices and in reduced motion.
- Must keep every frame inside the ±3% composition tolerance at the extremes,
  and the camera clearance above 1.5 m (the current minimum is 1.99 m).
- **As built:** the mouse position is damped (`FOLLOW` 1.5 per second in
  `src/ui/pointerParallax.js`, lowered from 2.5 so the scene drifts lazily
  rather than tracking every flick) and drifts back to centre when the pointer
  leaves the window. The camera rig slides camera and target together
  (`PARALLAX` in `cameraRig.js`), at full strength on holds and zero halfway
  through each transition. It also runs in the hero, so 香港 shifts slightly
  against the scene. Desktop breakpoint and mouse only; off in reduced motion.
- **Per-chapter share:** the near subjects in two holds left their targets
  at full strength, so their desktop pose has a `parallax` share in
  `chapters.js`: 01 at 0.8 (Clock Tower; safe up to 0.86) and 04 at 0.8 (the
  junk; safe up to 0.825). 02, 03, 05 and 06 take the full amount (02 needed
  0.4 only while there was a vertical shift).
- **Checked:** at all four mouse corners every desktop frame passes its
  targets (05's wheel misses are the existing documented deviation), and the
  closest approach is 2.26 m (railing in the 01 → 02 move); the debug
  `clearance()` takes a `parallax` option for this.
- **Calm water while moving** (user request, 2026-10-01: "when I start
  scrolling, the sideways and the water are flickering again"). Parallax was
  not the cause: it moves the camera under 0.6 m/s, and the camera path is
  smooth with or without it. Scroll transitions move the camera up to ~3 m
  per frame, so the 3–15 m ripples jumped about half a wavelength each frame
  and strobed (the wagon-wheel effect). The water now blends to the same
  ripple pattern at 3× the size while the camera moves faster than 4 m/s
  (fully by 24 m/s), and back within about a second after a hold is reached
  (`CALM` in `src/scene/createWater.js`; `water.update()` receives the camera
  speed from `main.js`). Holds and mouse parallax keep today's ripples.
  Measured strobing (second difference between frames on the water) at
  1.5 m per frame: 54 before, 17 now, 13 for perfectly flat water. A larger
  tile everywhere fixed it too but turned 03's wave-height water glassy.

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
2. **Lit windows.** Sparse warm window rectangles on the skyline buildings and
   brighter ones on IFC, drawn from one small generated texture. The world
   bible says the skyline must not compete, so the windows stay sparse and dim
   except on IFC. Also try a brighter band of ground-level lights along the
   Central waterfront, as in the storyboard (user reminder, 2026-10-01).
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
   artwork first (section 9).
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
| New generated textures | ≤ 4 more, each ≤ 512 px, plus the wordmark (about 1400 × 700 px, so it stays sharp) | same |
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
- New: `src/ui/siteHeader.js` (nav, menu, counter, vertical label, side pager), `src/scene/createWordmark.js`,
  `src/scene/createMoon.js`, `src/ui/cursorRing.js`,
  `src/ui/pointerParallax.js`, `src/scene/createPetals.js`,
  `src/scene/createGlow.js`.
- `src/data/world.js`: the `moon` block.
- `src/data/chapters.js`: `petals` density in chapters 05 and 06; desktop
  `parallax` shares in 01 and 04.
- `src/scroll/cameraRig.js`: the parallax offset (`setParallax`, `PARALLAX`).
- `src/scene/createWater.js`: ripples calm to a larger scale while the camera
  moves fast (`CALM`); `src/main.js` passes it the camera speed.
- `src/ui/debug.js`: wordmark position in the probe; `clearance()` takes a
  `parallax` option.
- `docs/ASSET-LEDGER.md`: entries for the railing art and any font.

## 8. Acceptance checks

The milestone passes when:

1. All twelve frames still pass the composition probe (±3%) with the nav bar in
   place, and no copy overflows at 1440 × 900, 1156 × 766 and 390 × 844.
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
| 3. Assets | GLB models from the ledger (junk, ferry, Clock Tower, IFC, wheel), remaining cutouts including the user's bauhinia petals and tree, display fonts. The Star Ferry is made by the user in Meshy.ai; until then the box proxy stays, with no interim reshape (user decision, 2026-10-01). Specs and licence notes are in `ASSET-LEDGER.md`, "Meshy models". Also the user's stone railing, promenade palms, wet paving tiles and more realistic skyline buildings (`ASSET-LEDGER.md`, "User reminders", 2026-10-01) |
| 4. Atmosphere, all chapters | Clouds lit from below and searchlight beams from the Central towers (user reminders, 2026-10-01), the look-test layers rolled out to 02–06, extra particles alongside the petals (sea spray, city bokeh, firework embers in 06), real fireworks, a sparkle trail added to the cursor ring (3.10) |
| 5. Copy and launch | Final copy, poster images, a full performance pass on both iPhones, deployment |
