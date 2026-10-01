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
| A giant wordmark inside the scene, with grass covering its feet | 香港 standing on the water behind the railing, sinking as you scroll |
| Particles at several depths (red leaves, embers) | Warm specks of light drifting near the promenade (frame 01) |
| Soft glow on the moon, lanterns and windows | Glow on lit windows, the Clock Tower faces and IFC's crown |
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
- Chapter 01's copy shows from the moment the page loads, top-left beside the
  Clock Tower, together with the wordmark, logo, nav and scroll hint (user
  request, 2026-10-01). It stays until 01's hold ends, as before.
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
  scene rather than on the glass.
- Position and size are authored per breakpoint in `chapters.js` (a new `hero`
  block), like the camera poses.
- The canvas is decorative (`aria-hidden`); the real heading is the hidden
  `<h1>`.

### 3.3 "Scroll to cross" hint and chapter counter

- Bottom-left: a small "Scroll to cross" label with a short line, and the
  numbers **01–06** beneath it.
- The hint shows only in the hero and fades out as the wordmark sinks.
- The counter stays for the whole page, highlighting the current chapter. Each
  number is a link to that chapter.
- On mobile the counter shrinks to the current number only ("03 / 06"), so it
  never collides with copy.

### 3.4 Nav bar and mobile menu

- **Desktop:** a thin bar across the top. Left: logo. Right: chapter links and
  a menu button.
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
- Tagline under the name: "Victoria Harbour, after dark".

### 3.6 Vertical Chinese text

- **維港之夜**, written vertically down the right edge below the nav, on every
  chapter.
- A **per-chapter label** lower on the right, also vertical, which changes as
  you scroll. Proposed (user to confirm the wording):

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
- On mobile both are smaller. The per-chapter label moves to the menu if it
  collides with a subject in any frame.

### 3.7 Copy regions move down

The nav bar takes about the top 8% of the screen on desktop and 7% on mobile.
Every chapter's copy region currently starts at 4–12%, so all twelve move down
to start at **11% or lower** (desktop) and **9% or lower** (mobile).
Afterwards, re-run the composition probe, the copy-overflow check and the
landmark-overlap check for all twelve frames, exactly as in the grey-box.

### 3.8 Cursor parallax (desktop only)

- The camera shifts up to **±0.5 m** sideways and **±0.25 m** up and down,
  following the mouse with smooth damping. Near objects (railing, tower) slide
  more than the distant skyline, which gives real depth.
- Full strength during holds, fading to zero during scroll transitions.
- Off on touch devices and in reduced motion.
- Must keep every frame inside the ±3% composition tolerance at the extremes,
  and the camera clearance above 1.5 m (the current minimum is 1.99 m).

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
   except on IFC.
3. **Glow.** Two options, tested side by side:
   - **A (recommended first):** soft glow sprites behind each bright light
     (clock faces, IFC crown, ferry windows). Cheap, art-directable, works on
     phones.
   - **B:** a bloom pass from the three.js add-ons (standard, not a custom
     shader). Richer, but costs speed on phones. Desktop only if used.
4. **Particles.** Warm specks drifting slowly near the promenade: about 150 on
   desktop and 60 on mobile, as one cheap point cloud. Off in reduced motion.
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
- `src/data/chapters.js`: copy regions, new `hero` block, Chinese labels.
- `src/main.js`: wire up the new pieces.
- New: `src/ui/siteHeader.js` (nav, menu, counter), `src/scene/createWordmark.js`,
  `src/ui/pointerParallax.js`, `src/scene/createParticles.js`,
  `src/scene/createGlow.js`.
- `src/ui/debug.js`: wordmark position in the probe.
- `docs/ASSET-LEDGER.md`: entries for the railing art and any font.

## 8. Acceptance checks

The milestone passes when:

1. All twelve frames still pass the composition probe (±3%) with the nav bar in
   place, and no copy overflows at 1440 × 900, 1156 × 766 and 390 × 844.
2. The wordmark reads in front, its feet hidden by the railing, and is fully
   gone before the 01 copy appears. Mobile shows it horizontal and smaller.
3. Nav links, counter numbers, the menu and "Return to the harbour" all land
   on the right hold. The menu works with the keyboard and a screen reader.
4. Reduced-motion mode shows no sinking, no parallax and no particles, and
   still tells the whole story.
5. The poster-only fallback still works, with a usable nav.
6. Frame 01 with the look-test layers is approved by the user against the
   storyboard and the Kage reference.
7. The performance budget in section 5 is met on the laptop and the iPhone 11.

## 9. Decisions (resolved 2026-10-01)

1. **Tagline under the logo:** "Victoria Harbour, after dark". ("Pearl of the
   Orient" was dropped because it conflicts with the world bible's tone rules.)
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
| 3. Assets | GLB models from the ledger (junk, ferry, Clock Tower, IFC, wheel), remaining cutouts, display fonts |
| 4. Atmosphere, all chapters | The look-test layers rolled out to 02–06, per-chapter particles (sea spray, city bokeh, firework embers), real fireworks, desktop sparkle cursor |
| 5. Copy and launch | Final copy, poster images, a full performance pass on both iPhones, deployment |
