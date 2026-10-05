# Milestone 2 — Page Shell and Kage-style Look Test

**Status:** Milestone 2 is closed (2026-10-03). The six chapters, the
footer and the colours are built. The organization plan is closed
(2026-10-06). Live at <https://gavinfung321.github.io/hongkong/>; every
push to `main` redeploys. No plan is open. Start a new chat from
[`HANDOFF.md`](HANDOFF.md).

It does not change the approved camera journey. Until 2026-10-02 it was
one file; it was split so each update touches one short file (user
choice, 2026-10-02). The pre-production briefs were removed 2026-10-06.

## How this plan is organised

| File | What it holds | Old sections |
|---|---|---|
| `README.md` (this file) | Goal, current state at a glance, open items, decisions, next milestones | 1, 6, 9, 10 |
| [`interface.md`](interface.md) | What we take from Kage; hero, wordmark, hint and counter, nav and menu, logo, vertical text, copy regions, parallax, moon, side pager, cursor ring, return button, footer, loading screen | 2, 3 |
| [`scene-models.md`](scene-models.md) | Halftone, lit windows, the code-built ferry, Clock Tower, IFC, wheel and junk, glow | 4.1–4.3 (step 2b) |
| [`scene-promenade.md`](scene-promenade.md) | Petals, railing and lamps, wet paving, palms, bauhinia tree, water reflections | 4.4, 4.5 stops 1–5 |
| [`scene-city.md`](scene-city.md) | Central towers, mountains, landmarks, window lights, painted facades, glow, film grade, wakes | 4.5 stop 6, parts 1–3f |
| [`atmosphere.md`](atmosphere.md) | Clouds, shore mist, open-water wisps, searchlights, fireworks in 06 (no bow spray) | 4.5 stop 6, part 3g |
| [`atmospheric-depth-polish.md`](atmospheric-depth-polish.md) | Step-by-step vignette, grain, depth haze, local light motion and selective foreground experiments | Post-Milestone 2 polish |
| [`narrative-spine.md`](narrative-spine.md) | Hybrid 3D and editorial-story direction, six-chapter arc and scene 02 prototype gate | Post-Milestone 2 narrative test |
| [`closed-plans.md`](closed-plans.md) | Finished checklists: scenes 03–06, the crossing, the footer, the accent colours, the hero wordmark, and the organization pass | Closed 2026-10-06 |
| [`checks.md`](checks.md) | Performance budget and acceptance checks | 5, 8 |
| [`CHANGELOG.md`](CHANGELOG.md) | Dated history of changes, newest first; the old files list | 7 |
| [`HANDOFF.md`](HANDOFF.md) | Current briefing: how we work, where things are, what is built | Updated 2026-10-06 |

References elsewhere to "part 3e", "section 3.11", "stop 4" and so on keep
their old numbers; the table above says which file holds them.

## Updating the plan

After any change to the site's behaviour, look or content:

1. Edit the area file so it describes how the site is **now** (not its
   history). Mark user decisions "(user request, YYYY-MM-DD)" or
   "(user choice, …)".
2. Add one dated entry to `CHANGELOG.md`: what changed, why, which files.
3. Touch `checks.md` only if an acceptance check or a measured budget figure
   changes.
4. New artwork, textures or fonts also go in `docs/ASSET-LEDGER.md`.
5. Commit the plan edits with the code.

## Working speed (user request, 2026-10-04)

The user reviews at <http://localhost:5173/>. Do not take screenshots, do
not open a browser to check, and do not run extra searches once the edit
is clear. The user checks the page.

**Cleanup does not come first.** The page's load is the JS bundle (budget
230 KB gzip, last measured 210.5 KB), the fonts, and the images something
on the page actually requests. Vite ships imported code only. Comments,
unused source files, docs, and a copy sitting in `dist/` are not
downloaded. A file in `public/` is downloaded only when the page asks for
it.

Do a cleanup when a measured figure is over budget: drop an image the page
still loads, or stop importing code the first view does not need. Skip a
general tidy of files, comments, or docs. That does not make the harbour
load faster, and it does not make the next edit faster. The slow part of a
coding turn is reading large files and taking screenshots. Read the one
area file and the lines to edit.

## Goal

Give the site the Kage-style depth and finish, proven on **one frame (01)**
before it is applied to all six chapters.

The milestone has two halves:

1. **Page shell (all chapters):** logo, nav bar, chapter counter, mobile menu,
   the 香港 hero wordmark, the "Scroll to cross" hint, vertical Chinese text,
   and cursor parallax.
2. **Look test (frame 01 only):** the layers that make Kage feel deep, built
   once on frame 01 and measured on the iPhone 11.

## Current state at a glance

- **Interface:** 香港 wordmark (on the water on desktop, in the sky on
  phones); "Scroll to cross" in the hero (phones add "01 / 06"; no chapter
  numbers on desktop); nav bar that slides away while scrolling down; menu;
  vertical 東方之珠 and chapter labels (01 stays 維港); side pager on desktop only; cursor
  ring and parallax on desktop; "Return to the harbour" at the top of the
  footer; loading screen.
- **Models:** everything built in code, no GLB files: Star Ferry, junk,
  Clock Tower, IFC with its podium, Observation Wheel, Central Ferry Piers,
  four landmarks; lit windows and a soft glow; a film grade over the
  whole frame. In 03 the ferry sails on toward Central through the hold,
  bobbing and rolling, with churned water behind it; the camera overtakes
  it on the way to 04, so its cabin uncovers the junk.
- **Promenade:** bauhinia petals, stone railing with lanterns and three tall
  lamps (spread apart in every view), wet paving, palms, bauhinia tree,
  glittering water reflections.
- **City:** dimmer towers so IFC leads, three mountain ranges with haze and
  slope lights, painted landmark facades, wakes.
- **Atmosphere:** a coral cloud ceiling in every chapter (dim back layer,
  lit front banks, drifting on the wind); searchlights sweeping over
  Central in 01 and 05;
  separate shore mist drifts (none in desktop 01); open-water wisps in the
  hero and 01; a firework show in 06 (eight bursts on desktop, six on
  phones, in an 8 s loop with rockets, falling sparks and drifting smoke).

## Open

Nothing open in the look test. The colour pass (was item 6) is done: a
film grade over the finished frame, kept because 01 clearly improved (user
choice, 2026-10-03; see "Film grade" in [`scene-city.md`](scene-city.md)).
Build step 6 (measure and review) is done and Milestone 2 is closed
(2026-10-03). The written review was removed 2026-10-06.
The iPhone speed check is closed (user, 2026-10-04: fine as it is). The
colophon keeps "Created by Gavin Fung at HKAAA" (user, 2026-10-04).
The paper grain is passed (user, 2026-10-04). The fallback poster is a
still of the opening frame (user request, 2026-10-04; see interface 3.12).

## Foreground direction (user choice, 2026-10-03)

Foreground elements go in only where they improve a specific composition;
there is no rule of two foreground cards per chapter. The first 2.5D card
test (Hero and 01) was removed before it was committed; its generated
artwork stays in `docs/references/foreground-pass-candidates/` for later,
selective use (status per piece in its `MANIFEST.md`).

| Chapter | Foreground |
|---|---|
| Hero and 01 | Existing 3D foreground only |
| 02 | Existing palms, lamps, paving and Clock Tower only |
| 03 | Ferry, wake and reflections only: no cutouts, water spray or camera-facing mist; haze only behind the ferry and round the far skyline |
| 04 | The junk and its rigging |
| 05 | One optional test, reserved: a Central pier canopy, bollard or chain (not started) |
| 06 | Smoke and illuminated sky haze only |

On phones, no large physical foreground cutouts unless a later comparison
proves they improve the frame.

## 01 polish (user request, 2026-10-03)

A review of the hero and 01 against the storyboard ranked six improvements.
The user asked for the first three now and to revisit the rest after:

1. **Moon** (done): real near-side seas instead of two "eyes", an even
   face, a soft corona and haze, moonlit cloud edges.
2. **Water** (done): the night sky mirrored between the glints, finer
   glints near the camera, a stronger skyline shimmer.
3. **Bush** (done): clear of 香 in the hero, the hidden railing lantern
   showing, clustered flowers and stray sprigs.
4. **Mountains** (done, user choice): Mid-Levels tower windows and road
   lamps instead of scattered specks, a Peak light, tonal texture on the
   slopes ([scene-city.md](scene-city.md)).
5. **Railing** (done, user choices): rails and slim posts matched to the
   posts, wider lantern pools; then the arrival-promenade run built 1.3×
   with a lantern on every big post, like the storyboard.
6. **Paving** (done, user choice): weathered tone patches, small
   puddles mirroring the lanterns, fallen bauhinia petals.

Added on the second review (user choice, 2026-10-03): **skyline colour**,
LED crowns and corner strips on some towers and a lamp line along
Central's waterfront, IFC still leading ([scene-city.md](scene-city.md)).

Third round (user choices, 2026-10-03): slope lights carried west of the
Clock Tower, thinning out; soft dark pools behind 01's copy and
東方明珠; the bauhinia tree's crown lowered clear of 東方明珠.

## 02 polish (user choices, 2026-10-03)

After 01 was signed off, a review of 02 against the storyboard found seven
improvements; the user chose all of them, and all are done: a red-orange
afterglow low on the right with one cloud mass instead of stacked rows
([atmosphere.md](atmosphere.md)); far-shore city lights behind the ferry
and a quieter background behind the tower on phones
([scene-city.md](scene-city.md)); the afterglow mirrored on the water and a
stronger ferry wake; railing B built chunky with a lantern on every post;
puddles mirroring the tower on the empty paving; people strolling near the
tower ([scene-promenade.md](scene-promenade.md)).

## 03 polish (user choices, 2026-10-03)

A review of 03 against its storyboard found six improvements; the user
chose five (the moon stays, for consistency with 01 and 02): the ferry's
reflection as a column of slivers under the hull instead of blobs over
the whole foreground, and a visible wake
([scene-promenade.md](scene-promenade.md),
[scene-city.md](scene-city.md)); the other towers dimmed so the ferry,
IFC and the wheel lead ([scene-city.md](scene-city.md)); the clouds as
one mass ([atmosphere.md](atmosphere.md)); and on phones the ferry 34 m
from the camera (was 53 m), filling about a fifth of the frame's height
with its stern off the left edge, as in the storyboard (`vessels` in
`src/data/chapters.js`; the move to 04 still slides it off left and
uncovers the junk).

## 04 polish (user request, 2026-10-03)

A review of 04 against its storyboard (the user asked for the fixes to go
in without a stop): the sails coral red with billowing panels, a darker
head and a glowing foot instead of one flat colour; the hull darker; a
visible narrow wake behind the junk ([scene-models.md](scene-models.md));
the skyline behind the sails held at 40% as in 03, so the full city
waits for 05 ([scene-city.md](scene-city.md)); the clouds regrouped
([atmosphere.md](atmosphere.md)). The moon stays, as in 03.

Then the junk was made more impressive (user choice, 2026-10-03): a
longer lens on the 04 camera, not a bigger model, so it fills about 60%
of the desktop width (was 50%) and on phones its main sail rises to just
under the copy (was 41% down the screen) ([scene-models.md](scene-models.md)).

## 05 polish (user choices, 2026-10-03)

A review of 05 against its storyboard found six improvements; the user
chose four (the moon and the searchlights stay): the camera much closer
to the wheel, so perspective makes it IFC's co-star at true scale (desktop
IFC 3–90% of the height, wheel about 20%, was 15%; phones IFC about 70%,
was 47%, wheel about 17%, was 8%) ([scene-city.md](scene-city.md)); the
LED crowns, strips and landmarks dimmed further so the skyline steps down
to IFC while the windows stay lit; IFC's and the wheel's reflections twice
as long and bright ([scene-city.md](scene-city.md)); the clouds as one
mass ([atmosphere.md](atmosphere.md)).

## 06 polish (user choices, 2026-10-03)

A review of 06 against its storyboard found five improvements; the user
chose four (the moon stays): the bursts recoloured and moved to the
storyboard's palette, a warm-white hero in each half of the loop,
coral-pink support and one small cyan accent, all upper right and top
centre with the left kept dark; the clouds as one mass under the bursts;
the skyline accents held at 05's level; and the bursts now light the
clouds near them in their own colour ([atmosphere.md](atmosphere.md)).
Then, because the left half read as empty (user request), smaller, fainter
bursts, a smoke puff and a cloud tail were added on the left, below the copy.

## Transitions (user request, 2026-10-03)

A continuous review of the whole journey found six transition issues;
the user approved all six, fixed in order with the holds left as they
were. The local pictures from that review were removed 2026-10-06.

1. The camera keeps an even pace by distance through each move, and its
   look turns with distance; a move can set the share of the turn at each
   waypoint (`viaTurn`) where the default turns too early.
2. 04 → 05 passes round the junk (about 11 m clear), which fades only
   once it has left the frame.
3. 02 → 03: the Clock Tower slides out steadily as the ferry takes over.
4. Phones: the hidden junk never shows half-faded in 02 → 03 or 03 → 04,
   and the ferry is fully shown before it enters the frame.
5. Copy follows the damped camera, so quick scrolling never puts the next
   chapter's text over the previous view; any nav jump of one chapter or
   more goes behind the veil.
6. Phones: 香港 and 01's copy fade out by 40% of the sink, before they
   cross the moon.

Shorter holds (user request, 2026-10-03): each composition now holds
for 14% of a chapter's scroll on each side of its keyframe (was 20%),
and the copy stays fully shown for exactly the hold, then fades over
the next 5% (`SCROLL.hold` and `copyFull` in `chapters.js`). The camera
starts moving sooner after a composition, and with the move spread over
72% of the scroll instead of 60% its top speed is about a sixth lower.
Chapter lengths, camera keyframes and vessel routes are unchanged.

**Not in the look test:** 3D models (GLBs; later dropped altogether, all 3D
is built in code, user decision 2026-10-01), real fireworks, the sparkle cursor,
particles in other chapters, sound, final copy and fonts.

## Build steps

Stop for the user's review after each step, as in the grey-box.

1. **Shell structure.** Hero section, hidden `<h1>`, nav bar, mobile menu,
   counter, logo. "Return to the harbour" goes to the hero. Move the copy regions down and
   re-run the checks for all twelve frames.
2. **Wordmark and hint.** 香港 fixed in the scene, fading as the camera moves past. "Scroll to
   cross" hint. Reduced-motion fade. Desktop and mobile.
3. **Vertical Chinese text.** 維港之夜 and the per-chapter labels.
4. **Cursor parallax.** Then re-check composition and clearance at the
   extremes.
5. **Look test on 01.** The layers in section 4, one at a time, with
   before-and-after screenshots.
6. **Measure and review.** Laptop numbers by me; iPhone 11 and 13 numbers by
   the user. **Done 2026-10-03; the milestone is closed.** The user
   approved 01 and raised the draw-call and texture budgets; the phone
   re-measure was later closed (user, 2026-10-04). The review notes and
   pictures were removed 2026-10-06.

## Decisions (resolved 2026-10-01)

1. **Tagline under the logo:** first "Victoria Harbour, after dark", because
   "Pearl of the Orient" seemed to conflict with the world bible's tone
   rules. Later changed to "Pearl of the Orient" at the user's request
   (2026-10-01). The vertical title is now 東方之珠 (user request, 2026-10-06).
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

## After this milestone

The look test, the six chapters, the footer, the colours and the live site
are built. The organization plan is closed (2026-10-06). No plan is open.

The table below is the history of milestones 3–5, not a task list.

| Milestone | What happened |
|---|---|
| 3. Assets | Every 3D object is built in code. The ferry, junk, Clock Tower, IFC, wheel, railing, lamps, palms, paving and bauhinia tree are on the page. |
| 4. Atmosphere | Coral clouds, harbour mist, searchlights and the firework show are on the page. Ferry spray was tried and dropped (user choice, 2026-10-03). |
| 5. Copy and launch | The live words are in `index.html` and recorded in `FINAL-NARRATIVE-COPY.md`. The site has been live since 2026-10-02. The share image was retaken 2026-10-06. The phone check is closed. |

**Published (user choice, 2026-10-02).** Live at
<https://gavinfung321.github.io/hongkong/> from `gavinfung321/hongkong`.
Every push to `main` rebuilds the site (`.github/workflows/deploy.yml`).
