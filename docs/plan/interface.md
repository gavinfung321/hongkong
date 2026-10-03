# Interface and page shell

Part of the Milestone 2 plan (index: [README.md](README.md)). Old sections 2 and 3.


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
  ("Victoria Harbour: A Night Crossing"). Chapter 01's title becomes an
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
  On shorter phone screens (a browser's toolbars showing, small phones)
  01's copy reached down over the top of 香港 (user request, 2026-10-03):
  the word now keeps 14 px clear below the copy, its feet moving down to
  48% at most (over the top of the moon), then shrinking instead (`clear`
  and `maxFoot` in the `HERO` block). At 390×844 it is as before.
- **Exit:** from the first scroll it moves down out of the frame and fades,
  while the camera pushes in (chapter 01's `holdDolly`, which now starts at
  the top of the page instead of at the hold). Both start immediately, with no
  dead zone.
- **Mobile:** stays horizontal (not stacked) and smaller, about 78% of the
  screen width.
- **Reduced motion:** no sinking; it simply fades out when you leave the hero.

How it is built:

- A flat plane in the scene with the two characters drawn onto it in Noto
  Serif TC 700, self-hosted, so Windows and iPhone draw the same glyphs (user
  request, 2026-10-03). Until the font is ready a system serif paints; when
  it arrives the texture is repainted once and the old one disposed
  (`createWordmark.js`). A blocked font keeps the fallback.
- Colour: warm cream (`--color-cream`), slightly fogged so it sits in the
  scene rather than on the glass. The lower two thirds shade down into dusk
  violet, as if lit from above (user request, 2026-10-01, after Kage).
- Position and size are authored per breakpoint in `chapters.js` (a new `hero`
  block), like the camera poses.
- The canvas is decorative (`aria-hidden`); the real heading is the hidden
  `<h1>`.

### 3.3 "Scroll to cross" hint and chapter counter

- Bottom-left: a small "Scroll to cross" label with a short line. The
  numbers **01–06** that stood beneath it on desktop are removed (user
  request, 2026-10-02): the nav bar, menu and side pager already link every
  chapter. The notes on the numbers below are history.
- The hint shows only in the hero and fades out as the wordmark sinks. Its line
  loops: a bright stroke draws in over a faint track and leaves to the right
  (user request, 2026-10-01).
- The whole counter shows only in the hero and fades out once chapter 01 begins
  (user request, 2026-10-01). Each number is a link to that chapter; on hover
  it turns sail coral and rises (user request, an exception to coral being
  reserved for the sails).
- On mobile the counter shrinks to the current number only ("01 / 06"), so it
  never collides with copy. It stays, on the opening screen only, not in
  the chapters: each chapter's copy already starts with its number and the
  vertical label names it (user choices, 2026-10-02).
- Desktop now shows the same "01 / 06" under "Scroll to cross" on the
  opening screen, so both breakpoints match (user choice, 2026-10-03).
- Dimmed so the scene leads: hint at 50% and numbers at 40% opacity, full on
  hover (user request, 2026-10-01).
- Chapter 01's body no longer ends with "Scroll to cross the water."; the
  hint already says it. The hint read "Let's cross the harbour" for a while
  (user request, 2026-10-01) and is back to "Scroll to cross", shorter and a
  clear instruction (user request, 2026-10-02).
- Chapter 01's kicker is "Victoria Harbour" (was "Arrival"), naming the
  place like the other chapters, and its body reads "Night settles on the
  water, and the island begins to glow." so the name isn't repeated (user
  requests, 2026-10-01).
- **Final copy** (user request, 2026-10-03): all six chapters, the hidden
  H1, page title, meta description and Open Graph tags now follow the
  approved `docs/FINAL-NARRATIVE-COPY.md` word for word. Kickers 04 and 05
  read "Junk with red sails" and "Two IFC"; the `data-copy="placeholder"`
  markers are gone. Menu buttons are named "Open chapter menu" and "Close
  chapter menu"; the footer return is named "Return to the beginning of the
  harbour crossing". No loading, fallback or social image UI was added.

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
- A soft dark pool (radial gradient) sits behind it, and another behind
  chapter 01's copy, which on 16:10 and narrower windows lies over the
  Clock Tower's lit top (user choice, 2026-10-03). Both move and fade with
  their text (`styles.css`). Nudging the camera to clear the tower was
  ruled out: it would need about 15% of the width and push 香 onto the
  tower and IFC off its mark.
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
- Drawn in code (`src/scene/createMoon.js`), no image file, plus an
  additive glow. The surface (more dark spots for realism and depth, then
  fewer spots and larger seas like Kage's, user requests, 2026-10-01;
  redrawn 2026-10-03, user request, because the two seas left above the
  ridge read as a pair of eyes):
  - eleven seas (maria) laid out like the real moon's near side
    (Procellarum down the left, Imbrium, Serenitatis, Tranquillitatis,
    Crisium near the right rim, Nubium and others lower down), each built
    from many faint overlapping blobs, so the seas join with ragged edges
    in a muted grey-brown (the `MARIA` list: x, y, radii, blob count,
    darkness);
  - pale and dark specks over the highlands between them;
  - only 6 small craters, with a shadowed upper-left wall and a bright
    lower-right rim;
  - spots squashed toward the rim, as on a sphere;
  - fine grain, then an even face with only a slight darker rim (a full
    moon is lit face on; the old lit-ball shading from the upper left made
    it look like a cartoon sphere).
- The glow (2026-10-03, user request: "subtle mist around it"): a soft
  corona falling off just beyond the rim and a wide faint haze out to five
  moon diameters, as if seen through thin mist (`CORONA`, `HAZE`). The
  rim stays clean. Clouds near the moon pick up its light (see "Moonlit
  clouds" in [atmosphere.md](atmosphere.md)). The warm yellow stays: it
  is part of the look (section 2), and the grade was chosen partly to
  avoid a pale moon.
- A fixed object in the world (`WORLD.moon` in `world.js`: position, radius,
  seed), so it stays put as the camera travels: it peeks between towers in 05
  and sits low behind IFC in 06.
- Far larger than life on purpose (about 9° across) and unaffected by fog.
- Tweak later: seas in `MARIA`, crater count in `CRATERS`, colours in
  `drawDisc`, glow in `CORONA` and `HAZE`, and size or place in `WORLD.moon`
  (changing its `seed` reshuffles the spots). A painted moon can replace the disc in the assets
  milestone.

### 3.11 Side pager (user request, 2026-10-01)

- After Kage: six short dashes stacked in the middle of the right edge, one
  per chapter. The current chapter's dash is twice as long and bright (01's
  in the hero); the others are faint.
- Each dash is a link to its chapter. On hover it lengthens and the chapter
  name appears to its left.
- Desktop only: on phones IFC stands at the right edge in 03–05, and the
  vertical label already shows the chapter (confirmed, user choice,
  2026-10-02). Hidden in the poster-only
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
  `styles.css`. Since the typography pass (2026-10-03) the label is Inter
  500 in sentence case, as the typography brief asks, instead of thin
  tracked capitals.

### Typography system (user request, 2026-10-03)

The approved `docs/TYPOGRAPHY-INTERFACE-BRIEF.md`, self-hosted (files in
`ASSET-LEDGER.md`, "Fonts"): Cormorant Garamond 600 for chapter titles, the
tagline, mobile menu titles and the footer statement; Inter 400 to 600 for
body, kickers, nav, buttons and footer text; Noto Serif TC for 香港 (700),
東方明珠 and 維港夜色 (600); Noto Sans TC 500 for the chapter labels. Tokens
`--font-display-en`, `--font-text-en`, `--font-display-zh`, `--font-text-zh`
in `styles.css`. Sizes from the brief: titles `clamp(2.5rem, 3.6vw,
3.75rem)` (phones `clamp(2.25rem, 10vw, 3rem)`), body 16 px / 1.6 / 36ch
(phones 15 px / 1.58 / 30ch), kickers 11 px Inter 600. Footer statement:
two lines on desktop, four on phones. Three preloads (Inter, Cormorant, Noto
Serif TC 700). Copy regions widened for 03 desktop, 02 and 06 phones.

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
  - a statement in large light type beside our red-sail mark: "One night,
    six chapters, one crossing. The journey runs from the old railway clock
    at Tsim Sha Tsui to the lights of Central. The harbour, vessels and
    skyline are built and animated in code.";
  - a hairline, then three columns with small uppercase headings (user
    choice): **Chapters** (links to all six), **Landmarks and vessels**
    (facts, not links: Clock Tower completed 1915, Star Ferry origins in
    1880, Chinese junk before the 1950s, Two IFC completed 2003) and
    **Colophon** (Built with Three.js
    and WebGL; Original 3D scene and illustrated atmosphere; Designed for
    desktop and mobile);
  - credit (user choice, 2026-10-03): the colophon opens with "Created by
    Gavin Fung at HKAAA" (HKAAA is the author's studio; "HKAAA" links to
    <https://hkaiautomation.com/>, user request, 2026-10-03), and the page head
    has `<meta name="author" content="Gavin Fung">`;
  - a bottom bar: "© 2026 Gavin Fung" (was the project name), 維港夜色
    ("Victoria Harbour at night") in the centre, "Three.js · WebGL · Hong
    Kong" on the right.
- **Approved copy** (user choice, 2026-10-03): the statement, landmark
  column, colophon and bar now follow `FINAL-NARRATIVE-COPY.md`. The old
  "every model and texture made in code" line was dropped because the
  clouds and sky use painted textures. The details sit in a smaller grey
  style after each name and its comma ("Clock Tower, completed 1915"); on
  phones they drop to their own line. The Observation Wheel left the list:
  it stays in the scene but is not part of the narrative (user request,
  2026-10-03).
- **Copy fit** (2026-10-03): the statement measure is 62ch, so it reads in
  three lines on desktop (two would need about 100 characters a line); on
  phones the mark sits above it at 17 px, so it stays at four lines at 390
  and 414 px wide. Column headings use balanced wrapping, so "Landmarks and
  vessels" breaks as "Landmarks / and vessels", never leaving one word.
- **The fireworks quieten as the footer rises** (user choice, 2026-10-03):
  over the first 60% of the footer's rise the bursts dim to half strength
  and their smoke to 70%, so the show carries on behind the footer without
  fighting the text. A first version faded them out completely; the user
  found that too empty (user request, 2026-10-03). Driven from
  `src/main.js` through `fireworks.setFooter()` in
  `src/scene/createFireworks.js`.
- The 06 scene stays behind it, dimmed by a dark gradient. On mobile the
  chapters and landmarks sit side by side with the colophon below, the
  landmark years on their own line, and the bottom bar stacks. The space
  above the return button on phones is tighter: 40 px of padding instead
  of 72 px (user choice, 2026-10-03).
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
