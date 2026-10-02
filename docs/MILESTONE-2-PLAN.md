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
| Thin outlined pill button | "Return to the harbour" as a thin pill with our own ↑ arrow, at the top of the footer (3.12) |
| Footer: statement, three link columns, bottom bar, scene dimmed behind | Our footer with original copy: statement, Chapters / Landmarks / Colophon, 維港夜色 bar (3.13) |

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
- **Height:** raised over the boats (user request, 2026-10-02: "move higher,
  it's ok to cover the boats"). Its feet stand at 74% of the screen height on
  desktop (was 88%) and 73% on mobile (was 80%), so it now spans roughly
  38–73% on desktop. The feet have to stay below the horizon (57.5% desktop
  at the opening pose).
- **Mobile floats in the sky** (user request, 2026-10-02: "push higher near
  the middle of the page"). On water it could rise no higher than 70% (the
  horizon) and covered the tower, junk and IFC. It now floats in the empty
  sky between the copy and the moon: feet at 42%, about 78% of the width,
  spanning roughly 27–43%, so the moon rises just below it and the tower,
  junk, moon and IFC all show. Not the exact middle (50%), which would cover
  the moon and the tower and IFC tops. It sits 190 m ahead of the camera,
  the same distance the water placement had, so its size, haze and the
  first-scroll sink and fade are unchanged (`depth` in the `HERO` block,
  `place()` in `createWordmark.js`). Desktop still stands on the water.
- **Exit:** from the first scroll it moves down out of the frame and fades,
  while the camera pushes in (chapter 01's `holdDolly`, which now starts at
  the top of the page instead of at the hold). Both start immediately, with no
  dead zone.
- **Mobile:** stays horizontal (not stacked) and smaller, about 78% of the
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
  hint already says it. The hint read "Let's cross the harbour" for a while
  (user request, 2026-10-01) and is back to "Scroll to cross", shorter and a
  clear instruction (user request, 2026-10-02).
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
  palms move much more. In 02 the IFC used to peek out from behind the Clock
  Tower at the far right of the mouse range; since the tower rebuild the 02
  camera keeps both the IFC and the wheel hidden at every corner.
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
  darker patches where its pieces overlap (`createForeground.js`). Kept for
  the stone railing (2026-10-02; section 4, step 5).

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

### 3.12 "Return to the harbour" button (user request, 2026-10-02)

- **Moved to the footer** (user request, 2026-10-02): it sits at the top
  left of the footer, above the statement, the first thing seen as the
  footer rises (as in the user's Kage screenshot). Chapter 06 now ends on its
  fireworks and two lines with no button, like the other chapters, and the
  footer's "Back to the start" link was dropped as a duplicate. Someone who
  stops at 06 scrolls about half a screen further to reach it; the logo and
  menu also go to the top.
- It is a rounded button, after the button style in the
  user's Kage screenshot (technique only): a 1 px pill outline in dim cream
  (22%), a thin (light-weight) uppercase label with wide letter spacing, no
  text shadow, and our own ↑ arrow, since it goes back up to the hero (not
  Kage's ↗). On hover the outline brightens, a faint fill appears and the
  arrow lifts.
- Mobile uses smaller type and tighter spacing so it stays on one line.
- Built as `.pill-link` (`.site-footer__return`) in `index.html` and
  `styles.css`; system fonts'
  light weights (Segoe UI on Windows, SF on iPhone), no font file.

### 3.13 Footer (user request, 2026-10-02)

- **The chapter layer leaves as the footer rises.** Chapter 06's copy, the
  vertical 煙花 label and the side pager fade out over the footer's first
  half screen (they used to stay on, and the label collided with the footer
  text on mobile). The nav bar is not forced back at the footer (user
  request, 2026-10-02, reversing an earlier choice to show it as Kage
  does): the footer already has its own chapter links, logo mark and return
  button, and a bar over the dimmed fireworks would clutter the ending and
  still underline "Afterglow". It behaves as everywhere else: hidden while
  scrolling down, back on any scroll up or keyboard focus.
- **A richer footer**, after the layout of the user's Kage screenshot, with
  original copy (no Kage text, lettering or code):
  - the "Return to the harbour" button (3.12);
  - a statement in large light type beside our red-sail mark: "One night on
    Victoria Harbour, crossed in six chapters: from the old Clock Tower in
    Tsim Sha Tsui to the last fireworks over Central. Every boat, tower and
    wave is built in code.";
  - a hairline, then three columns with small uppercase headings (user
    choice): **Chapters** (links to all six), **Landmarks** (facts, not
    links: Clock Tower 1915, Star Ferry since 1888, Two IFC 2003,
    Observation Wheel 2014) and **Colophon** (built live in Three.js and
    WebGL; every model and texture made in code);
  - a bottom bar: "© 2026 Victoria Harbour — A Night Crossing", 維港夜色
    ("Victoria Harbour at night") in the centre, "WebGL · Three.js · Hong
    Kong" on the right.
- The 06 scene stays behind it, dimmed by a dark gradient. On mobile the
  chapters and landmarks sit side by side with the colophon below, the
  landmark years on their own line, and the bottom bar stacks.
- Replaces the grey-box line "Grey-box prototype." Placeholder copy until
  the copy milestone, like the chapters.
- Built in `index.html` (`.site-footer`) and `styles.css`;
  `src/ui/siteFooter.js` publishes `--footer-in` (0 → 1) and `is-at-footer`.
  Also works in the poster-only fallback, where it is a plain footer.

### 3.12 Loading screen (user choice, 2026-10-02)

The user asked why a flat drawing showed before the site loaded. It was the
Milestone 1 fallback poster (greybox shapes that no longer match the scene),
on screen for about 1–2 s per load, with the copy in its plain stacked layout
until `main.js` ran (measured on the live site, simulated 4G: page 0.7 s,
script 1.4 s, first 3D frame 1.7 s).

- **Now:** while the scene loads, only the poster's night-sky gradient shows,
  with the header and the vertical title; the poster art, copy and footer
  are hidden (`is-booting`, set by a tiny inline script in `index.html`).
  `main.js` lifts it with the first 3D frame, which fades in over the sky;
  the art stays hidden during that fade. The poster art only shows in the
  fallback (no WebGL 2, context lost, init error or timeout), and an inline
  12 s timer shows the poster and copy if the script never arrives.
- **Later (Milestone 5):** a real snapshot of the hero frame replaces the
  drawing, for loading and fallback alike (option B, chosen for launch).
- **Later (Milestone 5): an entrance screen, after Kage (user request,
  2026-10-02).** Studied in the local Kage copy (technique only): a dark
  full-screen cover with a small mark, a short title, a 1 px progress line,
  a caption and a percentage; the scene is built in small steps so the line
  shows real progress; scrolling is locked until it is done; then the cover
  fades out over 0.8 s and the hero plays its intro. Kage needs it more than
  we do: it downloads about 3.7 MB (three.js, fonts, ten foreground cutouts,
  four painted plates), we download about 0.22 MB and build everything in
  code (first 3D frame ~1.7 s on simulated 4G). So ours is mainly an
  entrance moment and a way to keep phones responsive while the scene
  builds, not a necessity. Our version, all original (no Kage mark,
  lettering, copy or code):
  - **Look:** the night-sky colours of 3.12, the sail mark, 維港夜色 or
    香港 in the display font, a thin cream progress line, an original
    caption such as "Lighting the harbour", and a percentage.
  - **Real progress:** `main.js` builds the scene in steps (water, Kowloon,
    island and mountains, vessels, foreground, then compiling the shaders
    ahead of the first frame), yielding between steps so the line moves
    and the phone stays responsive. While the script itself downloads, the
    line creeps slowly; it never runs backwards.
  - **Exit:** a short minimum time (about 0.8 s) so fast loads don't
    flash, a 0.8 s fade into the hero, then the opening push and the 香港
    wordmark rising. Reloading mid-page skips the intro and fades straight
    into that chapter. Reduced motion: no creeping line or intro, a plain
    fade.
  - **Safety:** it replaces the sky-only loading state above and keeps the
    same rules: the fallback poster takes over if the 3D fails, and a timer
    shows the poster and copy if the script never arrives. Hidden from
    screen readers (the page title already announces the site).
  - **When:** with the final copy and display fonts in Milestone 5, since
    the caption and title lettering belong there; it could move earlier if
    the user wants the entrance sooner.
- Checked on a production build: loading shows the sky only, then a clean
  fade into the 3D scene; `?fallback` shows the poster and copy; with the
  script blocked, the poster and copy appear at 12 s.

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
   own share of lit windows (Central 30%, since 2026-10-02 20% capped at 30%,
   step 5 stop 6; Kowloon 22%; IFC 45%, now 50%), warm with a
   quarter cool. Unlit windows are darker glass. Where a window shrinks to a
   couple of pixels, the grid fades to its average glow, so distant towers
   can't shimmer.
   - **Floor strips and a warmer IFC (user choice, 2026-10-02).** IFC read
     as a flat grey-blue slab in 01: at 1.4 km its 2.6 m bays are about
     2.3 px wide, so the grid had faded about three-quarters of the way to
     its average, a dim cool glow on cool glass. Each direction now fades
     on its own: when bays get too narrow but floors are still a few pixels
     tall, each floor becomes a strip of lit and dark runs of four bays, as
     a tower reads from across the harbour; only when floors or runs get too
     small does the wall fade to its average. IFC's windows are warmer
     (cool share 45%, top tiers 60%, was 75% and 85%), lit 50% (was 42%),
     brighter (strength 1.25, top tiers 1.4) and its faded glow stronger
     (`glow` 0.5, was 0.35). The skyline towers in 01 gain floor strips
     too. Checked: 1 cm camera steps as before (holds 1–5: 19,197 /
     16,776 / 14,806 / 12,968 / 6,640 px); at scroll speed (1.5 m per frame)
     the 01 skyline changes 6.7% of pixels (5.6% before), from the extra lit
     detail; the Clock Tower is unchanged. On mobile 01 IFC is too small
     for strips and shows the warmer average glow.
   Still to try: a brighter band of ground-level lights along
   the Central waterfront, as in the storyboard (user reminder, 2026-10-01).
   Partly done with the lit Central Ferry Piers (2b, 2026-10-02).
2b. **Lighting and surfaces (user request, 2026-10-01: "why Kage's torii and
   temple look so real … everything looks very plain"; "go ahead and try").**
   Kage's models are as simple as ours; its realism comes from darkness,
   warm-and-cold light, textured surfaces and photo-like foreground cutouts.
   This step does the first three in code:
   - **Darker night:** the sky fill light drops from 2.2 to 0.8
     (`createLighting.js`), so local lights carry the frame. The cyan rim
     light is unchanged (it made the moon path on the water). Since the
     water reflections (step 5, stop 5; user choice, 2026-10-02) the water
     ignores the rim light and the boats' point lights: no cyan glare and
     no hot blobs under the boats; drawn glitter reflections take their
     place.
   - **Warm local lights (3 point lights):** a floodlight at the foot of the
     Clock Tower's harbour face (bright brick low, fading up the shaft), the
     ferry's cabin light and the junk's deck lanterns (warm pools on the
     water). They ride on their objects, so they hide when a vessel is gated
     out.
   - **Clock Tower:** red brick with granite bands at each storey, corner
     quoins, arched windows (two lit) and a granite crown, plus lit clock
     dials with hour marks and hands. The brick is ~2 px on screen, so the
     mortar is faint and flat: sharp courses strobed while scrolling.
     (Replaced by the rebuild from photos below.)
   - **Star Ferry, reshaped (user request, 2026-10-01).** Compared with a
     reference photo, the box proxy read as a generic barge. The user chose to
     reshape it in code now, reversing the earlier "no interim reshape"
     decision. (A Meshy model was to replace it later; since the "no GLB"
     decision below, the code-built ferry is the final one.) Built from rounded (stadium)
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
   - **Star Ferry, rebuilt from photos (user request, 2026-10-01).** The
     user shared six daytime photos and asked for "all the details that make
     it look good". Compared with them, the reshape read as a black pontoon
     with a closed lower deck. Rebuilt (still 40 m × 9.5 m, double-ended):
     - **Hull:** shaped from 48 cross-sections, like the junk's: sides flaring
       out above the waterline, ends narrowing to a soft point and raking
       back, sheer rising 0.6 m to both ends. Bright green (was a dark teal
       that read black at night) with a pale line under a dark wooden
       rubbing strip and a dark band at the waterline; a faint glow of its
       own. Black tyre fenders in pairs and a group of three.
     - **Open lower deck:** a waist-high green bulwark with a rail, green
       posts every 2.6 m up to the band, a closed casing amidships, and a lit
       cabin wall 1.1 m behind the posts (strip lights, seat backs, a few
       passengers), so the light shows between real posts as the mouse
       moves. The ceiling under the band glows warm.
     - **Band and upper deck:** the band between the decks is green (was
       white). The upper deck has paired rectangular windows in pale frames
       (were rounded panes), lit warm, and dark bridge glass in the middle
       of each round end; its white glows enough to read white at night.
       48 white life rings hang all round it below the windows. The two
       wheelhouse boxes on the roof are gone (the real boat has none).
     - **Roof:** a slight overhang, twelve white liferaft canisters with red
       bands, a shorter plain white funnel with a black top (no emblem), and
       a tripod mast with a yard at each end, with thin stays to the funnel
       and roof ends and shrouds from the yards.
     - **Navigation lights:** white at each masthead, green to starboard and
       red to port at both ends; small unlit-material lamps, no new lights.
     - **Proportions:** roof 7.1 m above the water (was 8.15 m, about 15% too
       tall against the photos); mast tops 13.3 m. The night window colour
       stays warm amber (recommended; the photos are daytime).
     - **Framing:** the taller masts put the ferry's top at 18% in desktop
       03 against 24%, so the desktop 03 camera was re-solved (eye still
       2.2 m, field of view 56.9°, was 55.1°; ferry moved about 1 m). Mobile
       03 still passes unchanged.
     - **Checked:** all chapters within ±3% except the four older misses
       (open issue below); 03 within its band at all four mouse corners;
       camera clearance as before. With 1 cm camera steps no surface
       flickers: 03 changes on edges only (rings, window frames, posts,
       masts, rigging, petals, moon path), 22,350 changing pixels against
       18,881 after the reshape; 01 9,747.
     - **Rights:** the photos are looked at only, never stored (ledger,
       "Reference material"); no boat names, star emblem or watermark.
   - **Clock Tower, rebuilt from photos and bigger in 02 (user request,
     2026-10-01).** "In 02, make the clock tower bigger … the tree is
     blocking the clock tower." Measured against the user's photos, the old
     tower was too slim (8 m wide) and too tall (crown cornice 37.6 m, top
     54 m). The user's choices: real proportions and a closer camera; keep
     the tower's size on narrow windows; a golden floodlight all the way up;
     move the big palm so its leaves cross the bottom of the moon instead of
     the tower.
     - **Shaft:** 9 m square brick core up to 31.5 m on a 1.8 m granite
       plinth; rusticated granite pilasters at all four corners; three
       stone-framed sash windows up the harbour face (the middle one lit),
       three narrow windows under the cornice and an arched, lit doorway at
       the foot.
     - **Cornice and crown:** a moulding and a deep cornice on a row of small
       brackets at 31.8–32.7 m. Above it a brick stage with an arched
       opening, corner piers and four curved stone scrolls, then a smaller
       stage with columns and small balconies with railings, a drum and a
       dome (top about 44 m) and a lattice mast to 51 m, thin bracing lines.
     - **Clocks:** three lit dials (harbour face and both sides) 3.9 m
       across in stone rings, with Roman numerals ("IIII"), a minute track
       and hands at about twelve past seven (dusk).
     - **Light:** the floodlight stays at the foot of the harbour face (still
       3 point lights). Every brick and granite surface carries its own
       golden glow, brightest at the foot and still warm at the top, so the
       whole tower reads golden at night as in the photos.
     - **Narrow windows (`keepHeight`):** on desktop windows narrower than
       1.6, the camera normally widens its vertical field of view to keep
       the sides, which shrank the tower to about 60% of the screen height
       at 1024 × 850. Chapter 02 desktop now keeps its height and trims the
       sides instead (`keepHeight: true` in `chapters.js`, `poseFov` in
       `cameraRig.js`). The ferry target moved inward (60–84%) so it stays
       whole down to an aspect of about 1.1.
     - **Framing:** 02 desktop re-solved: tower 16–34% wide and 3–88% tall
       (was 18–32, 2–85). The camera is about 7 m closer (57 m from the
       tower), the eye is lower (4 m above the deck, was 5.1 m) and the view
       looks up more (horizon at 80%, was 75%), so the tower towers over the
       viewer; field of view 61.4° (was 60.7°). The camera sits where the
       IFC and the wheel both hide behind the tower at every mouse corner
       (the IFC used to peek out at the far right). Ferry target 60–84% wide,
       71–87% tall; the ferry sits about 10 m farther out. With the lower
       eye, railing B now crosses the bottom of the ferry's hull (clearing
       it would need a ferry about 30% bigger). Mobile 02 and 01 pass
       unchanged.
     - **Palms:** the big palm by the promenade moved 5.5 m left and 5.4 m
       farther from the camera (same 11 m height). Its leaves now cross the
       lower left of the moon and clear the tower at all four mouse
       corners; on a narrow window it is trimmed off. On mobile the small
       palm at the tower's foot moved 5.3 m right, clear of the tower base;
       it now stands just behind the right-hand palm.
     - **Checked:** all chapters within ±3% except the four older misses;
       02 within its band at all four mouse corners; camera clearance at
       least 1.67 m, as before. With 1 cm camera steps no surface flickers:
       02 changes on edges only (17,711 changing pixels), 01 11,088.
     - **Rights:** the user's photos (and stock photos) are looked at only,
       never stored or traced; no signage lettering or logos from the
       buildings behind the tower.
   - **IFC, Observation Wheel and Central Ferry Piers, rebuilt from photos
     (user request, 2026-10-02).** "Now I think we can focus on the IFC and
     wheel." The user shared ten photos (day, dusk and night, two of them from
     Tsim Sha Tsui at our viewing angle). The user's choices, all as
     recommended: cool white crown, red-pink wheel, true-scale wheel, a slow
     turn, and the lit piers in this pass.
     - **IFC:** a 57 m square plan with recessed corners (pale corner piers
       keep each corner square in silhouette, with the recess behind),
       straight to 285 m, then seven shallow setbacks that round the top off
       like the real tower's; a slot down the middle of each upper face. Four
       horizontal bronze refuge-floor bands on the shaft replace the old
       vertical bronze stripes, which the real tower doesn't have. Windows
       at the real storey height (4.6 m), mostly cool white; the upper tiers
       are lit more densely and the top three tiers are floodlit white. The
       crown is a ring of 24 tapering fins around a lit core, tallest at the
       corners and dipping toward each face's slot, about 413 m to the tips
       (412 m in life; the old proxy reached 417 m). Every wall faces x or z,
       which the window grid needs.
     - **IFC Mall podium:** a low lit block at the tower's foot, kept out of
       the IFC group so the probe measures the tower alone.
     - **Observation Wheel:** true scale, 60 m to the top of the rim (was
       66 m). A red-pink lit truss rim (two rings joined by zigzag lacing),
       28 cable spokes from each side of a wide hub, a glowing white hub disc
       with a soft halo, 42 violet lit gondolas hung outside the rim and
       always upright, four white tubular legs in A-frames front and back, and
       a boarding platform with five white tents. It turns once every 4
       minutes in continuous mode; in reduced motion it holds still. No
       sponsor banners or lettering.
     - **Central Ferry Piers:** five pavilions on decks out over the water
       between IFC and the east: a warm lit hall behind a pale colonnade
       under a pitched green roof. They give Central the lit waterfront band
       from the storyboard (the reminder in step 1).
     - **Depth gaps:** without a logarithmic depth buffer, surfaces 1.2 km
       away only separate when about 0.2 m apart, so the bronze bands stand
       0.6 m proud of the glass and the hub disc 0.5 m in front of the hub.
     - **Framing:** no camera changed. All chapters pass except the four
       older misses. Mobile 01's IFC right edge was widened from 88% to 89%
       for the true 57 m width (it measured 91.1). Re-solving mobile 01 and
       desktop 05 was tried and didn't help: the targets ask for a slimmer IFC
       and a wheel about 3.5× too big, so the older misses stay logged. The
       Clock Tower still hides both buildings at every 02 mouse corner.
     - **Checked:** every desktop frame within its band at the four mouse
       corners; camera clearance unchanged (1.67 m). With 1 cm camera steps
       the IFC and piers change on edges only (05: 8,714 changing pixels;
       03: 23,814; 01: 11,109; 06: 261). The wheel shows as changing because
       it turns. Draw calls: 85 in 03; 01 and 02 were already over the 100
       budget (corrected 2026-10-02, see section 5).
     - **Rights:** the photos are looked at only, never stored or traced; no
       watermarks, promo text, bank logos or sponsor banners copied.
   - **No GLB models (user decision, 2026-10-01):** "If Kage didn't use any
     GLB files, I will follow that." Checked in Kage's public repository: it
     has no 3D model files (only images, fonts and three.js) and builds its
     shapes in code. So every 3D object here stays built in code; Meshy
     models are references only (ledger, "Meshy models"). The user keeps a
     local copy at `C:\Users\gavin\OneDrive\Desktop\kage-main` (22 files, no
     models), for studying techniques only: no Kage code, images or copy is
     reused (licence rule).
   - **Junk, rebuilt (user request, 2026-10-01).** Analysed against the
     user's photos and Meshy renders (reference only). Model: a wooden-hull
     harbour junk, with a side-on night photo as the proportion master,
     because the warm hull and lit stern windows stay readable on dark water
     (a black hull vanishes in 04).
     - **Sail size: much bigger (user request, 2026-10-01, replacing the
       first choice of real proportions + 15–20%).** After seeing the build,
       the user asked for sails "much bigger like the attached photos" (a
       close daytime photo, where the sails dwarf the hull). Measured there,
       the main sail is about half the hull length tall and nearly as wide.
       Built on the 28 m hull: main 12 × 15 m (mast top 21.2 m since the pointed tops), fore
       8 × 10 m, mizzen 4.2 × 5.6 m, about 1.45 times the first build. (The
       side-on photo had given a main sail of only ~0.25 × 0.30 of the hull
       length.) The foresail overlaps the main, as in the photo, so it hangs
       0.9 m to one side and the two cloths never meet or flicker. The
       mizzen overhangs the stern, as on the real boats.
     - **Pointed sail tops (built; user request, 2026-10-01).** The tops read
       as a slanted roof, not a point: the front edge stopped at 62% of the
       sail height (photo ~75%), the highest point sat ~5 m behind the mast at
       the back corner, the back edge ran nearly straight down from it, and
       the masts rose ~3 m above the sails. Decision (user): the tip goes as
       in the photo, just behind the mast and just under the mast top. Built:
       front edge to 75%, tip a quarter of the sail width behind the mast,
       back edge widest low down and sweeping in to the tip, the top pole
       ends at the tip, each mast ends 0.6 m above its tip (main mast top
       21.2 m, was 23.5 m); sail sizes unchanged. 04 re-solved again
       (desktop field of view 74.7°, mobile 79.9°, eye 3 m); 01 and 04
       within ±3%, mouse corners and clearance as before, flicker test shows
       edges only (21,121 changing pixels in 04).
     - **Hull:** shaped from 40 cross-sections: narrower bow rising to a
       point, raised stern with a wide square transom, sheer sweeping up at
       both ends; varnished planks bent to follow the sheer, a salmon
       waterline stripe, a gold line under a dark rail cap; a faint glow of
       its own so it reads at night. A rudder mostly under water (no keel
       fins; Meshy invented them).
     - **Deck:** a stern deckhouse with lit windows, a cream canopy over the
       waist on posts, a rail with posts along both sides, tyre fenders.
     - **Sails:** straight leaning front edge, a yard climbing to the peak at
       the back, a fan-shaped back edge scalloped between batten ends, mast
       about a quarter back; 7 battens on the main, 6 on the fore, 5 on the mizzen, in pale bamboo,
       cloth bellying between them; vivid red, uplit from the deck so each
       sail is brightest at the foot and each panel darker under the batten
       above.
     - **Rig:** foremast raked forward, rope fans from the batten ends,
       shrouds and a forestay as thin lines. No pennants: the small gold and
       rose masthead flags were removed (user request, 2026-10-01). String
       lights are left out for now.
     - **Reflections:** the junk's light is now red and sits among the sails
       (was a warm deck lantern), so the glassy water draws a red streak under
       the junk beside the moon path. (Since 2026-10-02 the water ignores the
       point lights; the sails' red reflection is drawn by the water shader,
       step 5, stop 5.) No new flat pieces on the water; still
       3 point lights.
     - **Framing:** the first, smaller rig left 04 with the junk's top at 19%
       against a 10% target, and the big sails then put it at 3%, so the 04
       camera was re-solved each time (again for the pointed tops). Now:
       desktop eye still 3 m, field of view 74.7° (was 79.9°), camera and junk both shifted about 6 m; mobile
       eye 3 m, field of view 79.9°, camera 9 m closer, junk turned 27° more
       toward the camera (a three-quarter view, which reads better in
       portrait). A solve at 2.5 m eye height brought the camera within 1.2 m
       of the water, under the 1.5 m clearance rule, so it was rejected. The
       probe skips the thin rigging, whose bounding box would span the whole
       boat.
     - **Checked:** 01 and 04 within ±3% on desktop and mobile; framing at the
       four mouse corners and camera clearance as before. With 1 cm camera
       steps no surface flickers, including where the fore and main sails
       overlap; 04 changes on edges only (sails, battens, rails, masts move as
       the junk bobs): 20,396 changing pixels against 9,025 for the old junk,
       from the many more edges. 01 is up 9%.
     - **Open issue (older, not from the junk):** the full probe run shows
       four misses that were already there before this change: the wheel in
       desktop 05 (left 41 against 29), IFC top in mobile 01 (49 against
       46), and IFC and the wheel in mobile 03 (3–4% off). To fix in a later
       pass.
     - **Rights:** stock and watermarked photos are looked at only, never
       stored, traced or copied (including boat names and flag lettering);
       the user's own photo is in `docs/references/junk/`.
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
   - **Not yet:** soft shadows, glow (step 3), photo-like foreground
     cutouts (user artwork). Reflections of the lit city in the water are
     built (step 5, stop 5, 2026-10-02). On mobile the skyline windows mostly blend into
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
     a short gust. The breeze blows toward screen left, away from the
     bauhinia tree, whose own falling petals join it (2026-10-02).
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
5. **Promenade pass (user request, 2026-10-02).** The closest layer to the
   camera, done in three stops with a review after each: railing and lamps,
   wet paving, palms. The user ranked it first of the remaining work
   (railing, paving, palms, water, Central buildings and mountains, sky and
   clouds, fireworks) and chose to build from their AI-made designs in 3D,
   with the images as references only (not a flat cutout, which would look
   paper-thin at 01's angle and under parallax).
   - **Stop 1: railing and lamps (built 2026-10-02).** The grey blocks are
     replaced by the user's stone balustrade: a granite plinth with
     pedestals, big square posts (0.44 m, 1.12 m tall) every ~4 m with a
     carved wave panel on each face, a slim post mid-bay, a round top rail
     and two thin rails, and a cast-iron lantern with warm glass and a soft
     glow on every second big post (16 lanterns). Three tall cast-iron lamps
     after the user's lamp design (octagonal pedestal, fluted column, six-sided
     lantern, 4.2 m) stand on the Clock Tower promontory, seen in 02 only:
     either side of the tower and short of the ferry on desktop, clear of the
     tower on mobile, outside both 01 frames (they line up with the tower
     there). The lamps are not real lights (the scene keeps 3): materials that
     opt in get a warm pool around each lantern and lamp (`lamps.js`), which
     the paving and palms will share. Railing sizes and lantern spacing are
     the constants in `lamps.js` and `createForeground.js`; lamp positions
     are `WORLD.foreground.lamps`.
   - **Railing on every edge near the Clock Tower** (user request,
     2026-10-02: "I need all edges to be filled with railing"). Railing B now
     runs the promontory's whole harbour edge (x = −50, z −60 to 40, was
     z 2–30), and new runs follow its south tip (z = −60, out to x = −110)
     and the three sides of the inlet between the promontory and the arrival
     promenade. Runs meeting at a corner share one post. The promontory runs
     (`edgeRailings`) always show, so mobile 01 now has them too; railing A,
     C and the inlet's north side (`railings`) still fade with the chapters,
     as mobile 01 wants open water at the bottom. The inlet's west run has
     no lanterns: in mobile 02 it points straight at the tower and they sat
     in front of its lit base. The seawall strip is now as deep as the
     plinth (0.5 m), so strips crossing at a corner never show a shared top.
     36 lanterns in all.
   - **Kept:** railing lines A, B (x = −50) and C, seawall strip tops 5 cm
     below the deck, the depth-twin fade for 02 → 03 (the twins are now
     nudged back by a constant depth offset so the railing always passes;
     a slope-scaled offset let the rails show through the slim posts
     mid-fade). Bays meet end to end, never overlap.
   - **Checked:** all 12 frames as before (only the four older misses), all
     mouse corners pass, closest camera approach 1.91 m (was 1.67 m). With
     1 cm camera steps the railing changes on edges and its granite grain
     only (the near railing moves 2–4 px per step), no solid patches.
   - **Stop 2: wet paving (built 2026-10-02, user request).** After the
     user's wet-paving design: the promenade and promontory tops (the
     Kowloon blocks and the arrival deck) are now 0.8 m square granite slabs
     with dark joints, laid in world metres, darker where wet (soft
     patches, 3.5 m across), with a warm reflection of every lantern, tall
     lamp and the Clock Tower floodlight. A reflection is a streak around
     the point where the mirrored light meets the ground, measured in view
     angles so it keeps one size on screen (narrow across, longer down toward
     the viewer than up). An earlier version sized it in metres; the
     tails of all the far lanterns then met under the camera and flooded the
     hero's near deck orange. The joints fade to the slab colour once they
     shrink below a few pixels, so they never shimmer at grazing angles. The
     lantern pools on the paving are weaker than before (wet stone shows
     the lights mostly as reflections). Code: `addWetPaving` in `lamps.js`,
     `promenadePaving` in `surfaces.js`; the ground material in
     `createKowloonEdge.js`. Checked: all 12 frames as before, all mouse
     corners pass (closest approach 1.94 m), 1 cm camera steps change edges
     only (hold 1 20,040 px, hold 2 9,813, as before), draw calls unchanged.
     The shader loops over all 39 lamps and lanterns plus the floodlight per
     deck pixel; to be watched in the iPhone 11 measurement.
   - **Wet paving, middle-ground look (user choice, 2026-10-02).** Compared
     with the user's rough, bright reference, the user chose to keep the
     dark, clean ground and borrow the reference's best parts: each
     reflection breaks into flecks (two noise layers, as on uneven wet
     stone), a faint narrow gold glow around each one, a cool dusk-sky sheen
     on wet stone at grazing angles, a tone and gloss per slab, and a bevel
     inside the joints that catches the lamps. Fine detail shows on the near
     deck only and fades out before it would shimmer; the far paving stays
     smooth. A photo-real rough floor was not used: at 02's distances its
     roughness is below a pixel, it would clash with the illustrated scene
     and pull the eye from the tower and copy. Checked: 1 cm camera steps
     as before (hold 1 20,036 px, hold 2 10,040, hero 27,759).
   - **Stop 3: palms (built 2026-10-02, user request).** The flat palm
     cards are replaced by 3D palms in two shapes: a tall coconut palm
     with a curved, leaning trunk and long drooping fronds, and a straighter
     palm with a rounder crown of shorter fronds over a skirt of brown dead
     ones. Fronds are curved, V-folded ribbons cut into leaflets by a small
     texture drawn in code (one frond plus a bark strip, `palmAtlas`);
     leaflet edges blend over one pixel, and the gaps fill in on distant
     crowns so they never shimmer. They sway slowly (trunk bend plus frond
     flutter, each palm on its own phase) and hold still in reduced motion.
     They take the warm lamp pools like the railing. Nine palms: the four
     around the tower (the one standing over the inlet water moved onto
     land at x −53.5, z 38; it shows on mobile only, as it is outside the
     desktop frame and would only sweep across the tower), plus a row of
     five behind the tower on the promontory's south end (x −70 to −88,
     z −46.5 to −50, 9.5–12 m), left of the tower in both 02 framings.
     No crown crosses the tower at the 02 hold, and none crosses it
     mid-move: the palms fade in late in the 01 → 02 move (62–90% of it,
     after they pass the tower) and out early in 02 → 03 (first 10%), set
     per key in `createGating` (`windows`). One instanced mesh per shape
     plus a depth-only twin for the fade: 4 draw calls. Code: `palms.js`;
     positions and shapes in `WORLD.foreground.palms`. Checked: all 12
     frames as before (only the four older misses), all mouse corners pass,
     draw calls desktop 02 137 (was 133), mobile 02 75 (unchanged). With
     1 cm camera steps hold 2 now changes 13,634 px (was 10,040): the
     near palm's leaflets moving about a pixel per step; with the camera
     still the palms change 7 px, so nothing flickers.
   - **More palms on desktop (user choice, 2026-10-02).** The desktop
     camera looks across the promontory, so it saw only about four palms
     (three of the five in the row fall just off its left edge), against
     seven on mobile. Three desktop-only palms: two make a grove left of
     the tower (a 10 m coconut palm at x −75.4, z −7.4 and a 12.5 m palm
     at x −70.4, z −25.6, both leaning away from the tower, crowns under
     the moon), and a 10.5 m coconut palm at x −52, z 5 pairs with the
     palm between the tower and the ferry, clear of the lamps. On mobile
     they would stand beside the tower, so they are hidden there
     (`only: 'desktop'`; a breakpoint change rewrites the instances).
     Checked: none crosses the tower at the hold (also at 1156 × 766) or
     while visible in the moves in and out of 02; all 12 frames as before;
     draw calls unchanged; with 1 cm camera steps hold 2 changes 16,802 px
     (more near leaflets moving), 8 px with the camera still.
   - **Stop 4: bauhinia tree (built 2026-10-02, user choice), before the
     water reflections.** One Hong Kong orchid tree built in code (no flat
     cutout: the user's AI images stay references, and a card would look
     paper-thin under parallax). Pulled forward from Milestone 3.
     - **Shape:** a seeded skeleton. A 5 m trunk leans out over the water
       from the arrival promenade (x 1.2, z 100, just right of and behind
       the 01 camera) and forks into five dark arching limbs, three more
       levels of drooping branches and twigs, all as merged tubes.
     - **Foliage:** about 2,700 instanced cards from one atlas drawn in
       code: broad two-lobed leaves, leaf clumps, five-petal magenta
       flowers with pale veins, and buds bunched on the outer twigs. The
       flowers glow faintly so the magenta reads at night; the cards
       flutter gently, as soft as the palms' edges.
     - **Falling petals:** 18 petals leave the flowers, drift left on the
       harbour wind and land on the water, then start again from another
       flower. To match, the site-wide petals now drift toward screen
       left too, away from the tree.
     - **Framing:** in the hero the canopy fills the right edge (from about
       86% of the width, y 8–60%) behind 東方明珠 and the side pager, which
       stay legible. The IFC, moon, junk and 香港 stay uncovered. The 01
       hold pushes the camera 5 m forward, so by the hold the canopy has
       slid out of frame. Keeping it in the corner at the hold too would
       need foliage hanging 15–20 m out over open water.
     - **Breakpoints and chapters:** not on mobile, whose 01 camera stands
       45 m to the left with no corner for a branch; hidden there, so it
       costs nothing. Not in 02, which the palms, lamps, tower and ferry
       already fill (`bauhinia` in each chapter's `visibility`, 1 only in
       desktop 01). A depth-only twin for the leaves and one for the wood
       keep the fade even.
     - **Checks:** all 12 frames as before (only the four older misses);
       all mouse corners pass, nearest clearance 1.91 m; desktop 01 draw
       calls 170 (was 164). With 1 cm camera steps the hero changes
       46,800 px (27,700 without the tree): the leaf cards shifting about
       a pixel. With the camera still it changes 24 px, so nothing
       flickers. Hold 1 is unchanged (20,140 px against 20,040).
     - **Code:** `bauhinia.js`; the atlas is `bauhiniaAtlas` in `surfaces.js`;
       placement is `WORLD.foreground.bauhinia`.
   - **Stop 5: water reflections (built 2026-10-02, user choice; reworked
     twice the same day, user requests).** The harbour glitters like the
     user's photo of the junks at night: the lights break into many small
     horizontal glints with dark gaps between them, spreading wider than
     each light with ragged edges and soft ends, over a dim shimmer from the
     whole skyline. Drawn by the water shader (not a mirror render, which
     would double the draw calls and flicker under the ripples it needs).
     - **Version 1 (replaced):** solid streaks under every skyline column,
       the IFC, moon, wheel, Clock Tower, lamps and boats, cut into 11 m
       window stripes. 01 read as a barcode of thin vertical rectangles, and
       the boats' streaks were too big ("Just remove all the reflection that
       look like thin vertical reflection in 01").
     - **Version 2 (replaced):** only IFC, the boats and the Clock Tower,
       at true size, as solid columns broken by horizontal bands. Too
       sparse and still rectangles ("the reflection look really bad now.
       Just simply a vertical rectangle … not enough reflection in the
       water and they look not natural at all").
     - **Now (user choices: glitter shader, skyline shimmer, moon glitter
       path, moderate chop):**
       - **Glints:** thin slivers where a wavelet faces the light, about
         2 px tall in the distance and growing toward the viewer, 4× as
         long as tall. Dense in a light's bright core (but always with
         gaps) and sparse at its edges, they drift and twinkle slowly
         (frozen in reduced motion, where the water does not animate).
       - **Shape:** each glow is Gaussian across, 1.5× the light's width,
         its rows shifted sideways by the wavelets so the edges zigzag; it
         runs the length of the light's mirror image plus a tail toward the
         viewer (0.6 of the image for the junk and Clock Tower, 0.45 for
         the ferry, 0.25 for IFC, 0.15 for the moon), dimming along it.
       - **Lights:** IFC (cool white, lower two thirds of the tower), the
         Clock Tower's floodlit lower part (warm), the ferry's window decks,
         the junk's sails (red) and deckhouse, and a soft gold glitter path
         under the moon.
       - **Skyline shimmer:** the skyline is summarised once as a strip
         along the island front (lit-window colour, brightness and height
         per 9 m, blurred so neighbouring towers merge). Each water pixel
         reads the strip where its line of sight meets the front, so the
         water under the city carries a dim, continuous glitter in the
         buildings' warm and cool colours, with no columns. One texture
         read per pixel.
       - **Not reflected:** the Observation Wheel and the promenade lamps.
     - **No glare:** the water ignores the rim light and the boats' point
       lights (they made hot blobs under the ferry in 03 and the junk in
       04); the glints draw all reflections.
     - **Why it cannot strobe:** the glints are laid out in view angles
       around the camera, so moving the camera does not slide wavelets
       past a pixel; azimuth is measured from the island side, so its seam
       is behind every camera. Brightness follows the water's Fresnel
       sheen and is soft-clipped, so glints stay below the subjects and
       copy.
     - **Limits:** at most 8 lights per frame (6 in the scene). Lights
       behind the camera or off screen are skipped; a faded subject (ferry,
       junk, IFC) fades its reflection too.
     - **Flicker fix (kept):** the water plane is cut into 64 × 64 squares.
       As two 8 km triangles, the world positions across it were too
       imprecise and the reflections shivered at 1 cm camera steps.
     - **Checks:** draw calls unchanged; one new 256 × 1 data texture (the
       skyline strip); water adds about 8,000 triangles. With 1 cm camera
       steps the holds change 19,092 / 16,774 / 14,891 / 12,920 / 6,791 px
       (holds 1–5), as before. Strobe on the water with the twinkle frozen
       (sideways / forward moves): hold 1 3.3 / 8.8, hold 3 0.8 / 6.1,
       hold 4 0.5 / 6.4, hold 5 0.8 / 15.5, the same as version 2 and below
       version 1. The twinkle itself is slow on purpose.
     - **Code:** `waterReflections.js` (the lights and `cityStrip`),
       `createWater.js` (the glint shader, culling, fades, `setCity`),
       `main.js` (lights, skyline strip, fades, per-frame `water.reflect`).
   - **Stop 6: Central buildings and mountains (user choices, 2026-10-02).**
     The user found the Central towers too bright next to IFC and asked to
     rework the buildings and mountains next, in three parts with a review
     after each: dim the buildings, then the mountains (shading from a dark
     foot to a lighter ridge with an edge glow near the moon, rougher ridges
     with a Peak outline, a scatter of slope lights, a mist band where the
     skyline meets the mountain, a faint third range), then building shapes
     (varied tops plus a few landmarks built in code, such as Bank of China
     and Central Plaza).
     - **Part 1: dimmer Central buildings (built 2026-10-02).** Every skyline
       building had 30% of its windows lit, varied per building from 10% to
       50%, so the busiest matched IFC's 50%; in 05 the tower right of IFC
       was almost as bright (mean 44 against IFC's 47, bright pixels 13.7%
       against 14.6%). Now 20% lit, capped at 30% per building (new
       `maxLit` option in `cityWindows.js`), and windows at strength 0.7
       (was 0.9). IFC, its podium and Kowloon are unchanged. Measured: the
       skyline beside IFC in 01 drops from 47 to 38 (IFC 57), the tower in
       05 from 44 to 29 with half the bright pixels (IFC 47), mobile 01 from
       51 to 39 (IFC 80). Strobe at scroll speed: the 01 skyline changes
       6.2% of pixels (6.7% before); the Clock Tower is unchanged. On
       mobile the distant skyline still reads as flat slabs; the depth haze
       (not chosen for now) or the mist band in part 2 could fix that.
     - **Part 1b: quieter towers in 05 (user choices, 2026-10-02).** The user
       still found the towers around IFC too bright in 05. Each was about half
       as bright as IFC, but together they had 1.5× its bright pixels; at
       ~500 m every window is drawn crisp at the same peak as IFC's, and warm
       dots on near-black walls sparkle more than IFC's on blue-grey glass.
       Two changes, IFC untouched:
       - **05 only:** the skyline windows fade to 60% across the move into
         05 and back on the way out (`city` in each chapter's visibility,
         omitted = 1; `island.setCityLevel`).
       - **Close-ups:** windows drawn large (bays over ~10 px) peak at 70%
         (new `close` option in `cityWindows.js`), which only touches
         04–06; in 01 the bays are ~3 px and unchanged.
       - Measured in 05: the towers' bright pixels fall from 14,200 to 4,900
         (IFC 9,100; much of the rest is the wheel and moon glow), the
         towers right of IFC from 5,100 to 560. 01 unchanged; 1 cm camera
         steps in 05 6,529 px (6,607 before).
     - **Part 2: mountains (built 2026-10-02).** The two flat one-colour
       cut-outs are rebuilt in `src/scene/createMountains.js`:
       - **Shape:** each range is an upright strip under a ridge line sampled
         every 10 / 20 / 30 m (near / far / third), with jagged detail from
         four octaves of ridged noise (±15 m) on top of the old swells. The
         near ridge follows the Peak seen from Kowloon: the High West knob,
         the summit (~560 m) left of IFC with a shoulder that still hides the
         moon's lower edge in 01, the dip of Victoria Gap, then Mount
         Cameron's mass (`WORLD.mountains.ranges`).
       - **Sloping ends (user request, 2026-10-02: "too vertical … like a
         cliff").** Each range used to stop at full height in a straight
         drop, seen at the near range's east end in desktop 02 (and the
         move from 01) and the near and second ranges' west ends in desktop
         04; the new lighter ridges made the cut stand out. Now every ridge
         eases down to the water over its last 1.2 / 1.5 / 1.8 km (near /
         second / third), like a headland, its jagged detail shrinking with
         it, and the mist fades out along the same slope. Widening the
         ranges instead would only move the cut to the camera's 5 km limit.
         01, 05 and 06 are unchanged; 1 cm camera steps in 02 and 04 as
         before (16,695 / 13,007 px).
       - **Shading:** darker at the foot (×0.6) to lighter at the ridge
         (×1.9), so the slopes have volume through the fog. A thin moonlit
         edge (5 m, never under 2 px) lights the ridges within about 13° of
         the moon, drawn after the fog so it shows at any distance.
       - **Third range:** at 3.7 km, behind the moon (the moon draws over
         it), almost fog-coloured; it peeks over the others where they dip.
       - **Mist band:** a 340 m band of city-lit haze between the skyline
         and the near range (z −1650), fading upward, in soft patches that
         drift slowly in continuous mode and hold still in reduced motion.
       - **Slope lights:** 80 clusters of 12 soft warm and cool dots on the
         near range's lower slopes behind Central (Mid-Levels homes), up to
         65% of the ridge height and dim (well below the skyline windows).
         Fixed 1.8 px dots, so they don't twinkle as the camera moves.
       - **Order:** the moon now draws first of the see-through layers, then
         the slope lights, then the mist, so nothing nearer is painted over.
       - **Checks:** the composition probe shows only the four older misses;
         1 cm camera steps as before (holds 1–5: 19,099 / 16,700 / 14,782 /
         13,032 / 6,607 px); the 01 skyline strobe at scroll speed 6.2%, as
         in part 1; three more draw calls in every hold (desktop 01 173).
         In 05 the shoulder hides more of the moon behind the towers (a
         sliver shows left of IFC).
     - **Part 3: building shapes and four landmarks (user choices,
       2026-10-02; built the same day).** All four landmarks the user picked,
       built in code at about real height in their order seen from Kowloon,
       plus varied tops on the plain skyline boxes. All are lit well below
       IFC and fade with the `city` level in 05 like the skyline.
       - **Bank of China Tower** (`WORLD.landmarks.boc`, left of IFC under
         the moon): four triangular shafts round a 52 m square, stopping at
         3, 4, 6 and 5 facade modules (156–312 m), each roof cut at 45° so
         each face ends on a diagonal. White X braces and corner lines on
         dark glass (a mip-mapped texture, so the lines fade with distance
         instead of shimmering), twin masts to 367 m.
       - **Cheung Kong Center** (just right of BOC, 283 m): a plain square
         box whose whole skin glows an even cool white (every window lit,
         dim), with a pale crown band 1.5 m proud of the glass.
       - **Central Plaza** (374 m): a chamfered triangle, one face to the
         harbour, with four colour bars near the top that drift slowly
         through the colours (90 s per cycle), a glass pyramid and a mast.
         It stands well right of its true place in Wan Chai, where the Clock
         Tower would hide it in 01; it shows between the tower and the ferry
         in 01 and at the left edge of 05 and 06.
       - **The Center** (right of IFC, 346 m): a chamfered square shaft with
         three crown steps and a spire, neon lines every 12 m, the whole
         tower slowly changing colour (60 s per cycle).
       - **Varied tops** on the skyline boxes, from their own random
         sequence so the towers don't move: a narrower upper section on 35%
         of those over 90 m, a dim warm or cool lit roof band on 25% of
         those over 100 m, a pyramid roof on 10%, and dark masts on 30% of
         those over 140 m. Skyline towers step aside from the landmark
         footprints.
       - **Masts and warning lights:** masts are dark and low-contrast (one
         or two pixels wide; on phones, without antialiasing, a bright one
         would crawl). Each carries a red light, a fixed 2.6 px dot that
         nearer towers hide, pulsing slowly in continuous mode and holding
         still in reduced motion, as do the colour cycles.
       - **Checks:** the composition probe shows only the four older misses;
         moon, IFC and copy uncovered in every frame. 1 cm camera steps
         holds 1–5: 19,124 / 16,726 / 14,871 / 13,026 / 6,806 px (5: +4%,
         the BOC braces); strobe at scroll speed 6.3% for the 01 skyline and
         unchanged for the Clock Tower. Twelve more draw calls (desktop 01
         185, 05 60; mobile 01 129).
     - **Part 3b: fewer lit windows on the other towers (user request,
       2026-10-02: "still too many window lights … stealing too much
       attention from the main buildings").** Measured on the screenshots,
       the other towers still had about as many bright pixels as IFC and the
       four landmarks together in 05 (20,700 against 25,400 above luma 60),
       because every tower had some lit windows and the whole skyline
       sparkled evenly. Now 40% of the skyline towers are left almost dark
       (a tenth of their windows; new `dark` option in `cityWindows.js`)
       and the rest have fewer lit: 13% on average, at most 20% per tower
       (was 20%, at most 30%). IFC and the landmarks are untouched. Their
       light: 05 from 20,700 to 10,600 bright pixels (main buildings 22,800),
       01 from 2,160 to 820 (main buildings 8,900). 1 cm camera steps hold 1
       19,099 px, hold 5 6,972; strobe unchanged.
     - **Part 3c: lights spread evenly, and window lights on far towers
       (user choices, 2026-10-02).** The user saw lights crowded on some
       towers beside unlit ones, and the 02 background (the low east end of
       Central, 1.6–2.1 km away) as unlit grey slabs while nearer towers had
       lights.
       - **Spread:** neighbours ranged from 0.5% lit (the dark 40%) to 20%.
         Now every tower is 5–12% lit and only 10% are almost dark (new
         `vary` option in `cityWindows.js`: the spread between buildings),
         about the same total light as part 3b.
       - **Far towers:** the window grid fades to a faint average glow once
         its floors shrink below a few pixels, which happens at about 1.5 km
         on desktop and sooner on phones. Far towers now get their lit
         windows as soft dots of a fixed 3.2 px size (new
         `src/scene/cityDots.js`, the slope lights' technique), on window
         positions on every wall, 1.5 m proud of it, as many as each tower's
         lit share. Each dot fades in only where its tower's floors have
         shrunk that far (worked out per pixel, so phones get them sooner),
         fades into the fog, and follows the `city` level. Close-ups (04–06)
         get no doubles. One draw call.
       - **Checks:** the composition probe shows only the four older misses.
         1 cm camera steps as before (holds 1, 2 and 5: 19,127 / 16,597 /
         6,599 px); at the 01 hold, small side steps give the same result
         with and without the dots (0.34% of pixels pop). At scroll speed the
         01 skyline pops 7.4% of pixels (6.3% without the dots): more detail
         moving past, not shimmer. Background light against the main
         buildings: 05 10,700 against 23,500 (unchanged), 01 1,440 against
         9,100. Draw calls desktop 01 186, 05 61; mobile 01 130.
     - **Part 3d: no IFC flicker while scrolling, and fewer background
       lights (user request, 2026-10-02).** The user saw IFC flicker while
       scrolling on a phone, and still too many lights on the other towers
       in 01–03, 05 and 06.
       - **IFC flicker, second try (user choice, 2026-10-02):** the first
         try softened every window grid while scrolling, toward its strips
         and glow. The user then saw IFC still flicker on phones and turn
         into a grey slab on desktop mid-scroll, with the other towers'
         lights gone: the softening pushed walls into their flat glow, and
         each flick switched IFC between three looks. It is removed;
         windows keep one look whether or not the camera moves. Instead:
         - Antialiasing is on for phones too (`src/main.js`; the brief
           allowed it if 30 fps holds, and the low-frame-rate fallback
           still lowers the resolution). IFC's piers, face slots, bronze
           bands and crown fins are 1–2 px wide on a phone and crawled
           without it.
         - On phones, single windows over about 6 px get edges 1.5 times
           softer (`citySoft` in `cityWindows.js`). Smaller windows and
           floor strips are left alone, as softening them dimmed IFC in 01;
           it never moves a wall to its strips or glow.
         - Checks: IFC holds exactly as locked on phones (01 and 05 side
           by side) and desktop mid-scroll keeps every lit window. On the
           mobile scroll path, holds and slow moves are steady; a fast
           05 → 06 move still scores high frame to frame because the window
           grid slides about one floor per frame, and the windows keep
           their pattern. If that still reads as flicker on the phone, the
           next steps are 2× phone resolution, then a short blur along the
           scroll direction that keeps each window's brightness.
     - **Part 3e: IFC painted facade (user choice, 2026-10-02).** The user
       still saw IFC flicker on phones, and asked why IFC and Bank of China
       look less real than the Clock Tower, ferry and junk. The hand-built
       objects have painted, mip-mapped textures, several materials and real
       light falloff; the towers had flat colours, a salt-and-pepper of
       punched windows from one shared shader, no glass and no lighting
       gradient. The shader's pixel-by-pixel windows were also why IFC
       flickered: textures are filtered by mipmaps as they move, as on the
       Clock Tower. The user chose all four fixes, in steps, with a review
       after each: (1) a painted IFC facade, (2) painted skins for the four
       landmarks, (3) a lighting and material pass (glass reflection
       gradient, warm street glow at Central's foot, crown uplight, Bank of
       China facets), (4) curtain-wall bands and floor-clustered lights in
       the background towers' shader, (5) a soft glow around bright lights,
       tuned down on phones. This unlocks the IFC window look.
       - **Step 1, IFC (done):** new `src/scene/facades.js` paints a glass
         curtain wall in code: floors of glass bands behind thin pale
         mullions, lit tenant by tenant (whole floors, part-let floors and
         dark floors with the odd late office), mostly cool and neutral
         office white with some warm, brightest under the ceiling and soft
         at the band edges, the odd room dark or with blinds down. The shaft
         tile covers its full height and a whole face (32 bays × 64 floors),
         the upper tiers have a brighter one (75% lit), and each face starts
         the pattern at its own offset. Wall UVs are in metres from IFC's
         foot (`facadeUVs`), so floors run on across tiers. On phones the
         facades sample half a mipmap level blurrier (`facadeBias`, set in
         `src/main.js`).
       - **Checks:** a new flicker test renders each frame at the phone's
         resolution and at four times that, filtered down, and counts
         frame-to-frame jitter beyond the ideal image's. On 05 → 06 that
         excess fell from 9–12% (window shader) to 0%; total jitter from
         151% to 123%, below the ideal's 152%. IFC still leads: bright
         pixels in 05 28,800 (22,500 before), other towers unchanged.
         Composition probe: only the four older misses; draw calls
         unchanged.
       - **Fewer background lights:** every skyline tower is now 3–6% lit
         (was 5–12%), still spread evenly with 10% almost dark; 06 dims the
         skyline to 60% like 05 (`city: 0.6` in `src/data/chapters.js`).
       - **Far-tower dots sized in metres:** a dot now covers about 6 m of
         wall (clamped to 1.5–3.2 px), so phones, where towers are smaller
         on screen, get smaller, calmer dots instead of the desktop size.
       - **Checks:** bright background pixels (luma over 60) against the
         main buildings: 01 1,440 → 720 (main 8,600), 02 1,950 → 1,070, 03
         3,790 → 1,870 (main 16,200), 05 10,670 → 6,720 (main 22,500), 06
         3,040 → 1,730 (main 7,900). Composition probe: only the four older
         misses. Draw calls unchanged. Strobe at the 01 hold unchanged
         (still 0.18%, side steps 0.36%); at scroll speed the 01 skyline
         pops 6.8% of pixels (7.4% before).
6. **Colour pass.** Try film-style tone mapping. It changes every colour, so
   it is only kept if 01 clearly improves, and the palette is re-tuned for all
   frames in a later milestone.

**Not in the look test:** 3D models (GLBs; later dropped altogether, all 3D
is built in code, user decision 2026-10-01), real fireworks, the sparkle cursor,
particles in other chapters, sound, final copy and fonts.

## 5. Performance budget

Measured with the `?fps` overlay on a production build, as in
`greybox-review/PERFORMANCE.md`.

| Metric | Laptop | iPhone 11 |
|---|---|---|
| Average fps | ≥ 50 | ≥ 30 |
| 1% low fps | ≥ 40 | ≥ 24 |
| Draw calls | ≤ 100 (was ≤ 80). **Over budget in 01 and 02** (measured per hold, 2026-10-02): desktop 01 158, 02 136, 03 85, 04 58, 05 45, 06 40; mobile 01 108, 02 69. With the edge railings: desktop 01 164, 02 133, mobile 01 114, 02 75. With the 3D palms: desktop 02 137. With the bauhinia tree: desktop 01 170 (desktop only). The water reflections add none. The mountain rebuild adds 3 everywhere (third range, mist, slope lights): desktop 01 173, 02 140, 05 48; mobile 01 117. The landmarks and varied tops add 12 (four skyline-top sets, six landmark meshes, one mast mesh, one set of warning lights): desktop 01 185, 02 149, 03 100, 05 60; mobile 01 129. The far-tower window dots add 1: desktop 01 186, 02 150, 05 61; mobile 01 130. Earlier notes gave "85 peak (03)", which missed 01 and 02. Biggest shares in 01: ferry 40, Clock Tower 32, junk 25, IFC 15, wheel 12, stone railing 9 (with its fade twins), promenade lamps 3. The rebuilt vessels and tower are the place to merge meshes; decided with the iPhone 11 measurement in step 6 | ≤ 100 |
| New generated textures | ≤ 4 more, each ≤ 512 px, plus the wordmark (about 1400 × 700 px, so it stays sharp). **Over budget since 2b (2026-10-01):** 18 small code-drawn surface textures (the ferry reshape added four 512 × 64 deck textures and a foam strip; the junk rebuild swapped its two textures for two new ones and added two 512 × 64 deckhouse textures; the ferry rebuild swapped its four deck textures for four 512 × 56 upper-deck textures and added a 512 × 64 cabin texture). The Clock Tower rebuild swapped its three 256 × 1088 shaft maps for two 256 × 848 shaft maps, two 54 × 848 pilaster maps and two 128 × 96 crown maps: 21 textures, about 5.5 MB of GPU memory in all (was 6.6 MB). The wheel adds a 64 × 64 hub glow (22 textures; the IFC rebuild adds none). The stone railing adds a 64 × 64 granite tile and a 64 × 96 post panel (24 textures; the lantern glows are drawn in their shader). The wet paving adds a 240 × 240 slab tile (25 textures). The palms add a 256 × 256 frond and bark atlas (26 textures). The bauhinia tree adds a 512 × 512 leaf and flower atlas (27 textures; its falling petals reuse the petal texture). The water reflections add a 256 × 1 skyline strip (28 textures, 1 KB). To be measured on the iPhone 11 in step 6, then the budget is either raised (user decision) or the shaft is tiled at a lower resolution | same |
| Point lights | 3 (Clock Tower flood, ferry, junk sail light) since 2b; the promenade lanterns and lamps are faked in the materials (`lamps.js`) | same |
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
  tripod masts, rigging, navigation lights, foam skirt following the hull;
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
  `facadeBias` per breakpoint (part 3e).
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

## 8. Acceptance checks

The milestone passes when:

1. All twelve frames still pass the composition probe (±3%) with the nav bar in
   place, and no copy overflows at 1440 × 900, 1156 × 766 and 390 × 844.
   With the mouse at either edge, desktop frames stay within ±6% and the
   parallax is plainly visible (user request, 2026-10-01). On narrow desktop
   windows (down to an aspect of about 1.1) the 02 Clock Tower keeps its full
   height and the ferry stays whole; no palm crosses the tower (user
   request, 2026-10-01), at the hold or while the camera moves in and out
   of 02, and the 3D palms sway gently with no flicker (user request,
   2026-10-02); the desktop hero's right edge is framed by the bauhinia
   canopy, its petals drifting left, with the IFC, moon, junk and 香港
   uncovered and 東方明珠 legible (user choice, 2026-10-02); no promenade lamp crosses the tower or the ferry,
   and a half-faded railing is an even veil with no rails showing through
   its posts (2026-10-02). The promenade reads as dark wet stone slabs with
   narrow, broken lamp reflections, quieter than the tower and copy, with
   no glare patch on the hero's near deck and no shimmering joints or
   flecks (user request, 2026-10-02). The harbour glitters like the user's
   junk photo: IFC, the Clock Tower, the ferry, the junk and the moon break
   into small horizontal glints with dark gaps, ragged edges and soft ends,
   over a dim continuous shimmer from the skyline; no vertical rectangles,
   no glare or hot blobs under the boats, nothing strobing while the camera
   moves (user choices and requests, 2026-10-02). IFC is the brightest
   tower in 01 and 05; no Central building is lit as much, and in 05 the
   towers around it are clearly quieter, together well under IFC's bright
   pixels (user requests, 2026-10-02). The mountains have rough ridges with the Peak's outline,
   lighter upper slopes, a thin moonlit edge near the moon, a faint third
   range, mist at their foot and quiet slope lights; their ends slope down
   to the water, with no cliff-like cut in any frame or move (user request,
   2026-10-02); the ridge still hides
   the moon's lower edge in 01, and nothing on them twinkles while the
   camera moves (user choices, 2026-10-02). Bank of China Tower, Cheung
   Kong Center, Central Plaza and The Center are recognisable, the skyline
   has varied tops, none of them covers the moon, IFC or copy, IFC stays
   the brightest tower, the other towers together give off well under the
   main buildings' light, spread thinly over every tower rather than
   crowded on a few, and far towers (the 02 background) show lit windows
   too (user requests and choices, 2026-10-02); in 01–03, 05 and 06 the
   other towers give off no more than about a third of the main
   buildings' bright light, and IFC does not twinkle or flicker while
   scrolling on a phone, nor change look mid-scroll on any screen: no grey
   slab, lit windows stay lit (user requests, 2026-10-02); IFC reads as a
   lit glass office tower, floors as bands behind thin mullions rather than
   scattered dots (user choice, 2026-10-02), and no brace line, mast or warning light shimmers
   while the camera moves; warning lights and colour cycles hold still in
   reduced motion (user choices, 2026-10-02).
2. The wordmark reads in front of the whole scene, shading into dusk toward its
   feet, raised over the boats (user request, 2026-10-02), and sinks and
   fades out with the 01 copy from the first scroll.
   Mobile shows it horizontal and smaller, floating in the sky between the
   copy and the moon with the tower, junk, moon and IFC uncovered (user
   request, 2026-10-02).
3. Nav links, counter numbers, the menu and "Return to the harbour" all land
   on the right hold. The menu works with the keyboard and a screen reader.
   The vertical label shows the current chapter and never covers a subject.
   The side pager (desktop) marks the current chapter and its dashes land on
  the right hold. "Return to the harbour" is a thin rounded button on one
  line at the top of the footer, not in 06. When the footer arrives, the 06
  copy, vertical label and side pager are gone and the nav bar is not
  forced back; the footer's chapter links land on their holds (user
  requests, 2026-10-02).
4. Reduced-motion mode shows no sinking, no parallax, no particles and no
   cursor ring, the palms and the bauhinia (leaves and its falling petals)
   hold still (user request, 2026-10-02), and the
   Observation Wheel holds still (it turns slowly in
   continuous mode; user request, 2026-10-02), and still tells the whole story. In continuous mode the water
   does not blink or strobe while the mouse moves or during scroll
   transitions.
5. The poster-only fallback still works, with a usable nav. A normal load
   shows only the night sky until the 3D scene fades in: no poster art and
   no plain-layout copy flash first (user choice, 2026-10-02).
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
   image is used. Update (user decision, 2026-10-02): the railing and lamps
   are built in code from the user's AI-made designs, which stay references
   only and are not shipped.
4. **"Return to the harbour" target:** the hero, so the wordmark rises again.
   Since 2026-10-02 the button sits at the top of the footer instead of in
   chapter 06 (user request).
5. **Nav labels:** the five proposed links in 3.4 (no change requested).

**Status:** approved for coding, step by step, with a review stop after each
step.

## 10. After this milestone

| Milestone | Content |
|---|---|
| 3. Assets | No GLB models: like Kage, every 3D object is built in code (user decision, 2026-10-01; section 4, step 2b). The ferry, junk, Clock Tower, IFC and wheel are already rebuilt from reference photos, with the user's Meshy models and photos as references only. Remaining cutouts including the user's bauhinia petals, display fonts (the bauhinia tree is built in code, 2026-10-02). Also the user's stone railing (built in code with lanterns and tall lamps, 2026-10-02), promenade palms, wet paving tiles (built in code, 2026-10-02) and more realistic skyline buildings (`ASSET-LEDGER.md`, "User reminders", 2026-10-01) |
| 4. Atmosphere, all chapters | Clouds lit from below and searchlight beams from the Central towers (user reminders, 2026-10-01), the look-test layers rolled out to 02–06, extra particles alongside the petals (sea spray, city bokeh, firework embers in 06), real fireworks, a sparkle trail added to the cursor ring (3.10) |
| 5. Copy and launch | Final copy, poster images (a real snapshot of the hero frame replaces the drawn fallback poster, for loading and fallback; user choice, 2026-10-02), an entrance screen with real build progress, after Kage's technique (3.12; user request, 2026-10-02), a full performance pass on both iPhones, deployment |

**Published early (user choice, 2026-10-02).** The work in progress is live at
<https://gavinfung321.github.io/hongkong/> from the public repo
`gavinfung321/hongkong` ("hongkong" chosen over "hong-kong": shorter, matches
the HONG KONG wordmark, easy to type on a phone). Every push to `main`
rebuilds the site (`.github/workflows/deploy.yml`), so the iPhone checks can
use the live address. Before the first push, three bauhinia reference photos
of unknown rights were removed from the whole history; they stay on the
user's computer. Milestone 5 still owns the final launch (copy, posters,
performance).
