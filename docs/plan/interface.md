# Interface and page shell

Part of the Milestone 2 plan (index: [README.md](README.md)). Old sections 2 and 3.


## 2. What we take from Kage, and what we don't

Watching the recordings shows that Kage's 3D models are about as simple as our
grey-box: the temple is dark boxes with flat glowing window rectangles. Its
depth comes from layers around the simple 3D:

| Kage technique | Harbour version in this milestone |
|---|---|
| Painted 2D cutouts at the frame edges (grass, pine, wall) that move faster than the scene | The promenade railing as a painted cutout (frame 01); in 05 a bauhinia sprig in the top-right corner (desktop) |
| A giant wordmark inside the scene, with grass covering its feet | 香港 fixed in the scene close to the camera, shaded toward its feet; the camera glides in on load and moves past it as you scroll |
| Particles at several depths (red leaves, embers) | Bauhinia petals drifting across the whole site, gone for the fireworks (4.4); in 03–04 a few quiet out-of-focus light discs; in 05 more discs and petals just in front of the lens |
| A big moon as the focal light | An original yellow moon behind the Peak ridge, drawn in code (3.9) |
| Soft glow on the moon, lanterns and windows | Glow on lit windows, the Clock Tower faces and IFC's crown |
| A ring that trails the mouse pointer | An original cursor ring, desktop only (3.10) |
| Cold motes shed along the pointer's path | A warm cursor trail with our own values, desktop only (3.10) |
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
  step with the fading wordmark, so 01's hold is scene only; links to 01 go
  to the top of the page. Other chapters' copy also leaves upward and arrives
  from below.
- Scrolling through the hero moves the camera past the wordmark, which fades.
  It is fully gone before the 01 copy starts fading in (progress p = 0.25).
- **Opening glide** (user choice, 2026-10-04, after Kage): when the page
  loads at the top, the camera eases in from 6 m further back and 0.6 m
  higher over 2.4 s as the loading screen lifts (`HERO.glide`,
  `setGlide()` in `cameraRig.js`). Deep links and reduced motion start at
  rest.
- Deep links (`#chapter-01` … `#chapter-06`) and `?hold=` still land on each
  chapter's hold pose, unchanged.
- Accessibility: the page gets one real `<h1>` in the hero, visually hidden
  ("Victoria Harbour: A Night Crossing"). Chapter 01's title becomes an
  `<h2>` like the others.

### 3.2 香港 wordmark

Agreed with the user:

- **Placement:** drawn in front of the whole scene including the railing
  (user request, 2026-10-01, replacing "behind the railing").
- **A fixed object, not a text effect** (user choice, 2026-10-04, after
  Kage's hero word, technique only): it stays at one place in the world and
  only the camera moves, so scrolling, the opening glide and the mouse
  parallax all shift it like part of the scene. It floats 16 m ahead of the
  camera on desktop and 25 m on phones, close enough for those moves to
  show; its screen position and size at rest are authored as before and
  converted to that depth (`depth` in the `HERO` block, `place()` in
  `createWordmark.js`). Until 2026-10-04 it stood on the water 47 m out on
  desktop and 190 m on phones, and slid down out of the frame by script.
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
  the moon and the tower and IFC tops. It now floats 25 m ahead (see
  Placement above).
  On shorter phone screens (a browser's toolbars showing, small phones)
  01's copy reached down over the top of 香港 (user request, 2026-10-03):
  the word now keeps 14 px clear below the copy, its feet moving down to
  48% at most (over the top of the moon), then shrinking instead (`clear`
  and `maxFoot` in the `HERO` block). At 390×844 it is as before.
- **Exit:** from the first scroll the camera pushes in toward it (chapter
  01's `holdDolly`, which starts at the top of the page). The word, with
  01's copy, stays whole for the first 15% of the way to
  `HERO.leaveEnd`, so the approach reads, then fades, gone by 90% (80% on
  phones): about 70% of a screen of scrolling (user choice, 2026-10-04: it
  was gone by 60% and 40%, about half and a third of a screen, which ended
  before the camera visibly neared it). It no longer slides by script
  (`fadeStart` and `fadeEnd` in the `HERO` block).
- **Mobile:** stays horizontal (not stacked) and smaller, about 78% of the
  screen width.
- **Reduced motion:** no glide; it simply fades out when you leave the hero.

How it is built:

- A flat plane in the scene with the two characters drawn onto it in Noto
  Serif TC 700, self-hosted, so Windows and iPhone draw the same glyphs (user
  request, 2026-10-03). Until the font is ready a system serif paints; when
  it arrives the texture is repainted once and the old one disposed
  (`createWordmark.js`). A blocked font keeps the fallback.
- Colour: warm cream (`--color-cream`), slightly fogged so it sits in the
  scene rather than on the glass. The lower two thirds shade down into dusk
  violet, as if lit from above (user request, 2026-10-01, after Kage). The
  feet are now a dark cream so the strokes stay readable (user request,
  2026-10-05). Checklist in
  [`closed-plans.md`](closed-plans.md#hero-wordmark). Status:
  approved, 6 of 6 (user approval, 2026-10-05). Closed.
- Position and size are authored per breakpoint in `chapters.js` (a new `hero`
  block), like the camera poses.
- The canvas is decorative (`aria-hidden`); the real heading is the hidden
  `<h1>`.

### 3.3 "Scroll to cross" hint and chapter counter

- Bottom-left: a small "Scroll to cross" label with a short line. The
  numbers **01–06** that stood beneath it on desktop are removed (user
  request, 2026-10-02): the nav bar, menu and side pager already link every
  chapter. The notes on the numbers below are history.
- The hint shows only in the hero and fades out as the hero ends. Its line
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
  hover (user request, 2026-10-01). The hint is now at 75%, because at 50%
  the 11 px label measured only 3.26:1 against the paving on desktop
  (user request, 2026-10-03, interface audit IS-09).
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
  read "Junk with red sails" and "Two IFC"; 06's kicker is "Fireworks"
  (was "Departure"; user request, 2026-10-03); the `data-copy="placeholder"`
  markers are gone. Menu buttons are named "Open chapter menu" and "Close
  chapter menu"; the footer return is named "Return to the beginning of the
  harbour crossing". No loading, fallback or social image UI was added.
- **Social image** (user request, 2026-10-04; retaken 2026-10-06): a
  shared link shows the hero. `posters/harbour-social.jpg` is the opening
  frame cropped to 1200×630, the usual share-card shape, with the Clock
  Tower, the warmed 香港, the ferry, the red sails and the skyline. It is
  a JPEG so chat apps that skip WebP still show it. A visit to the page
  does not download it; only the link preview does. The approved alt text
  is unchanged.

### 3.4 Nav bar and mobile menu

- **Desktop:** a thin bar across the top. Left: logo. Right: chapter links and
  a menu button. From 960 px wide, where the links show, the menu button is
  left out: the links, the logo and the side pager already reach every
  chapter (user choice, 2026-10-03). Narrower windows and phones turned
  sideways keep it, since they have no links.
- **Both:** the bar slides away while scrolling down and returns on any scroll
  up, or when it receives keyboard focus (user request, 2026-10-01).
  - Proposed links: Clock Tower · Star Ferry · Red Sails · City of Light ·
    Afterglow (chapter 01 is reached through the logo).
  - The current chapter's link is underlined in the sail’s orange
    (`--color-coral`, user request, 2026-10-05). The scroll stroke and link
    hover use the same orange. Yellow stays on the timeline, the ferry due
    digits and the callout arrows. Approved and closed (user approval,
    2026-10-05), in
    [`closed-plans.md`](closed-plans.md#accent).
  - On hover, each English label rolls up and its Chinese label (from 3.6)
    rolls in from below (user request, 2026-10-01). Keyboard focus no
    longer swaps it, so the visible name matches the one announced (user
    request, 2026-10-03, IS-08).
- **Mobile:** logo plus a menu button. The menu opens a full-screen dark panel
  listing all six chapters, each with its Chinese label.
  - The button reports open/closed to screen readers, keyboard focus stays in
    the panel while it is open, and Escape closes it.
- **Phone card menu** (user request, 2026-10-03; approved and made the
  default the same day, replacing the full-screen panel on phones; it was
  first shown behind `?menu=card`): on phones the menu is a centred floating
  card (`min(88vw, 420px)` wide, at most `min(76svh, 620px)` tall, near
  black, 22 px corners) over the harbour blurred and darkened; without
  backdrop blur the backdrop is simply darker. A small header (sail mark,
  "Chapters", close) sits above six 52 px rows: number, Cormorant title,
  Noto Sans TC label. The current chapter gets a small coral dot and
  brighter text instead of the underline. The list scrolls inside the card
  when it doesn't fit; phone landscape shows two columns (01–03, 04–06) in
  a card up to 640 px wide. Opening fades the backdrop in 200 ms, then the
  card rises 10 px and scales 0.98 → 1 over 340 ms; closing takes 240 ms;
  reduced motion fades only. A tap on the backdrop closes it. Focus,
  Escape, inert background and focus return are unchanged. Desktop keeps
  the full-screen panel (`siteHeader.js` `buildCard`, `styles.css`).
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
  it was "Victoria Harbour, after dark"). It pairs with the vertical 東方之珠.

### 3.6 Vertical Chinese text (built 2026-10-01)

- **東方之珠** ("Pearl of the Orient"), written vertically down the right
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
- **Pointer stir** (user choice, 2026-10-04): the moving mouse also pushes
  the drifting petals aside and carries them along, everywhere on the site,
  and stirs scene 02's motes. Mouse only, off in reduced motion. See
  `narrative-spine.md` (Pointer stir).
- **Cursor trail** (user choices, 2026-10-04: "I want the mote or petal
  following my cursor", then rebuilt after studying how Kage's cursor
  wisps work; technique only, our own code and values). Warm motes, the
  colour of scene 02's dust with paler cores, are shed by the mouse on
  every section. They are released by distance travelled, spaced along
  the path from a release point that trails the pointer slightly, so a
  slow hand lays a thread and a quick one throws them wide. Each lives
  0.9–1.8 s: it drifts back from the hand, frays on a slow curl, rises a
  little and softens as it fades. A resting pointer breathes out one faint
  mote about every 0.45 s. Thinned to about a third the same day (user
  request, 2026-10-04: too many): one mote every 3.2% of the window height
  travelled, a pool of 60, a narrower spread. Sizes and distances are
  shares of the window height. Drawn in screen space after the bloom, over the scene
  and under all page text. Mouse only, off in reduced motion.
  `src/scene/createCursorMotes.js` (`TRAIL`). (The first version, 18
  motes circling the pointer, read as a static cluster.)

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
  500 in sentence case, instead of thin tracked capitals.

### Typography system (user request, 2026-10-03)

Self-hosted (files in `ASSET-LEDGER.md`, "Fonts"): Cormorant Garamond 600 for chapter titles, the
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
  - a statement in large light type beside our red-sail mark: "The crossing
    ends here. In the morning the ferries will cross again." (user approval,
    2026-10-05; the earlier three-sentence recap is gone);
  - a hairline, then three columns with small uppercase headings (user
    choice): **Chapters** (links to all six), **Landmarks and vessels**
    (facts, not links: Clock Tower completed 1915, Star Ferry origins in
    1880, Chinese junk before the 1950s, Two IFC completed 2003) and
    **Colophon** (Created by Gavin Fung at HKAAA; The harbour, vessels and
    skyline are built and animated in code; a short Dukling credit).
    "Original 3D scene and illustrated atmosphere" is gone (user request,
    2026-10-05). "Built with Three.js
    and WebGL", "Designed for desktop and mobile", and the long Red Sails
    photo paragraph are gone (user request, 2026-10-04). The Dukling line
    stays short because that photograph is CC BY-SA;
  - credit (user choice, 2026-10-03): the colophon opens with "Created by
    Gavin Fung at HKAAA" (HKAAA is the author's studio; "HKAAA" links to
    <https://hkaiautomation.com/>, user request, 2026-10-03), and the page head
    has `<meta name="author" content="Gavin Fung">`;
  - a bottom bar: "© 2026 Gavin Fung" (was the project name), 維港夜色
    ("Victoria Harbour at night") in the centre, "Hong Kong" on the right
    (the Three.js · WebGL prefix left with the colophon line, user request,
    2026-10-04).
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
- The 06 scene stays behind it. The gradient is near black from early in
  the rise (user request, 2026-10-04: darker), then opened to a wash so
  the bursts show through: about 80% black under the hairline, darker
  toward the columns (user request, 2026-10-04). A cream hairline, the same
  weight as the rules under the statement and above the bar, is the top
  edge of the footer, just above "Return to the harbour" (user request,
  2026-10-04; the dark band above it was removed the same day).   On mobile the red-sail mark stays to the left of “The” (user request,
  2026-10-05). Chapters and landmarks sit side by side with the colophon
  below, the landmark years on their own line, and the bottom bar stacks. The space
  above the return button on phones is tighter: 40 px of padding instead
  of 72 px (user choice, 2026-10-03).
- Built in `index.html` (`.site-footer`) and `styles.css`;
  `src/ui/siteFooter.js` publishes `--footer-in` (0 → 1) and `is-at-footer`.
  Also works in the poster-only fallback, where it is a plain footer.
- **Improvement checklist** (user request, 2026-10-05): the layout stays.
  The statement answers Scene 06, and the making credit sits in the
  colophon. The eight-step plan is in
  [`closed-plans.md`](closed-plans.md#footer). Status:
  approved, 8 of 8 (user approval, 2026-10-05). Closed for now.

### 3.14 Interface states (user request, 2026-10-03)

Fixes from the Interface State Polish audit (IS-01 to IS-13). The desktop
and portrait phone layouts, scenes and timings are unchanged.

- **Header after jumps (IS-01):** a scroll of more than one screen (nav,
  menu, side pager, Return) no longer hides the header, so the menu button
  is still there after choosing a chapter (`siteHeader.js`).
- **Copy below the header (IS-02):** the copy's top is never higher than
  the header plus 4 px. At the approved sizes the authored top is already
  lower, so nothing moves; on short windows and at 200% zoom the copy no
  longer runs under the logo.
- **Phones turned sideways (IS-03, IS-04):** windows in landscape no more
  than 500 px tall keep the desktop layout but use the 56 px phone header,
  smaller copy (28 px titles, 14 px body), the phone vertical title and no
  side pager. 香港 keeps 14 px clear below 01's copy there, moving its
  feet down to 84% at most (the strokes reach a little below the feet) and
  then shrinking (`desktopShort` in the
  `HERO` block, `main.js`). The menu's rows are tighter so all six fit at
  390 px tall, and a list taller than the window now scrolls from its
  first item instead of being cut off at the top.
- **Notch and home-bar insets (IS-05, IS-12):** the header, menu, copy,
  counter, side pager, vertical text and footer keep clear of the left and
  right safe areas; the header's height adds the top inset instead of
  losing it from its 56/72 px.
- **Return focus (IS-06):** after "Return to the harbour" focus goes to the
  logo, so the next Tab reaches the nav instead of a hidden heading.
- **Current chapter in the menu (IS-07):** its title is also underlined in
  warm amber, not only its number coloured.
- **Fallback (IS-10):** without the 3D story 東方明珠 scrolls away with the
  first screen instead of staying fixed over the footer.
- **Address bar (IS-11):** once you scroll on from a deep link, the address
  follows the current chapter (and drops the hash in the hero), so a reload
  or shared link opens where you are.
- **Touch (IS-13):** hover colours and movements apply only where a pointer
  can hover, so a tap on a tablet never leaves a link lit.

### 3.12 Loading screen (user choice, 2026-10-02)

The user asked why a flat drawing showed before the site loaded. It was the
Milestone 1 fallback poster (greybox shapes that no longer match the scene),
on screen for about 1–2 s per load, with the copy in its plain stacked layout
until `main.js` ran (measured on the live site, simulated 4G: page 0.7 s,
script 1.4 s, first 3D frame 1.7 s).

- **Entrance (user request, 2026-10-03):** a dark title card covers the
  page while the scene starts, like a film's opening title (technique
  studied in Kage; nothing of Kage's is used). Markup in `index.html`
  (`.entrance`), styles in `src/styles.css` ("Entrance"), logic in
  `src/ui/loadingScreen.js`.
  - **Look (centred direction, user choice, 2026-10-03):** dark, quiet
    and mysterious. One small group, every line centred, in the middle of
    the small viewport (`100svh`, so phone toolbars never push it down;
    a 4svh bottom bias puts it on the optical centre; safe areas kept
    clear). Top to bottom: the red sail mark (18 px wide; 16 px on
    phones), 維港夜色 in Noto Serif TC 600 warm ivory (22 px; 18 px on
    phones; 0.22em tracking, no synthetic bold; user request, 2026-10-04:
    smaller, so it reads as a mark), a 1 px line (240 px;
    200 px on phones, never wider than the screen less its insets; track
    cream at 12%, fill cream at 72%, so it never becomes the focus), and
    "Preparing the harbour · 42%" (the real percentage) in Inter 10 px
    (9 px on phones), muted lavender grey. Gaps 16, 30 and 11 px (14, 27
    and 10 on phones). Background near black `#05060b` with a barely
    visible aubergine radial at 50% 46%. The English title "Victoria
    Harbour: A Night Crossing" is not shown on the card (user choice,
    2026-10-03); it stays in the page title, metadata, social tags and the
    hidden H1. The lettering waits for its fonts (at most 1.5 s, inline
    script), so no system font shows first. Nothing else: no tagline, no
    harbour objects, no texture, grain, glow or particles, and nothing in
    the group moves except the progress line.
  - **Real progress:** each task has a fixed weight and the line shows the
    weighted share done: fonts 8, renderer 10, sky, lights and water 8,
    Kowloon and the island 22, vessels 10, foreground, wordmark, moon,
    petals, atmosphere, fireworks and searchlights 16, the hero's images
    (clouds, mist, bauhinia, petals; the fireworks too when the page opens
    on 06) 10, shaders 12 (compiled in parallel where the browser allows),
    first frame 4. All are registered up front, so it only rises, and it
    stops at 99% until the first frame is drawn. `main.js` yields between
    stages so the line repaints and phones stay responsive. While the
    script itself downloads it shows 0%; nothing creeps on a timer.
  - **Timing:** from the top of the page the card stays at least 0.8 s
    after navigation (a cached load holds at 100%), pauses 0.25 s on 100%,
    then fades over 0.8 s, its lettering first, into the hero, which then
    behaves as before. A chapter link or a restored scroll position skips
    the minimum and the pause and fades in 0.5 s straight into that
    chapter. Reduced motion: no line easing or lettering fade, a 0.3 s
    plain fade. It never returns: not from the footer, not after a back or
    forward visit, not after a lost context.
  - **Scroll and input:** wheel, touch and scrolling keys are held while
    the card is up; the scroll position itself is untouched, so deep links
    and restored positions survive, and there is no scrollbar change when
    it leaves. The card takes clicks while it is up, holds no focusable
    element and moves no focus when it goes.
  - **Safety:** any fallback (no WebGL 2, a start-up error, the 8 s guard,
    a lost context while loading) fades the card into the readable poster
    story. A font or image that is slow or fails is waited for at most 3 s
    or 5 s from the script's start, then the scene goes on without it.
    Without JavaScript the card never shows; if the script never arrives,
    the inline 12 s timer lifts it. Hidden from screen readers.
  - **Test switches** (explicit; ordinary visits never wait):
    `?entrance=slow` (each stage waits 0.5 s), `?entrance=hold` (stays on
    100%), `?entrance=fail` (start-up throws, shows the fallback handoff).
- **Favicon:** `public/favicon.svg`, the sail mark on night navy.
- **Poster (user request, 2026-10-06):** stills of the current opening
  frame, `posters/harbour-poster-desktop.webp` (1016×648, 49 KB) and
  `posters/harbour-poster-mobile.webp` (390×844, 22 KB). They include
  the warmed 香港 and no interface chrome. A normal visit does not
  request them. The inline script adds the images
  on fallback or when the 12 s timer lifts the cover; without JavaScript
  a `noscript` pair shows them. Phones use the portrait still (the same
  `max-aspect-ratio: 4/5` switch as before).
- **Fallback introduction** (user request, 2026-10-04): once the page is
  the readable story, the first screen carries the two approved lines,
  "A night crossing of Victoria Harbour" and "The interactive harbour is
  unavailable here, but the complete journey continues below." The six
  chapters follow. A normal visit and a no-JavaScript visit do not show
  them.
