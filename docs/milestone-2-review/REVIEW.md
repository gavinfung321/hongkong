# Milestone 2 review — page shell and look test

Written 2026-10-03, at the end of build step 6 (measure and review). The plan
is in [`../plan/README.md`](../plan/README.md); the acceptance checks are
section 8 of [`../plan/checks.md`](../plan/checks.md).

**Result: Milestone 2 is closed (2026-10-03).** Checks 1–5 pass, with
the known framing misses listed below; you approved 01 (check 6); the
laptop meets its frame-rate targets. One item stays open by your choice:
phone frame rates after the latest layers (check 7; the last iPhone 11
reading had one 1% low under target in 05), carried to Milestone 5's
performance pass. The draw-call and texture budgets were raised to match
the site (your choice).

## Screenshots

The 14 hold pictures (hero and chapters 01–06, desktop and phone) were
removed (user request, 2026-10-06). They were taken 2026-10-03. Desktop
was 1440 × 900 and phone was 390 × 844. The written checks below stay.

What Milestone 2 added, in short: the page shell (nav bar, menu, 香港
wordmark, "Scroll to cross", vertical Chinese labels, side pager, cursor
ring and parallax, footer, loading screen); every model rebuilt in code
(ferry, junk, Clock Tower, IFC, wheel, piers, four Central landmarks, the
skyline); the promenade (stone railing, lanterns and lamps, wet paving,
palms, bauhinia tree, petals); glittering water with hull reflections and
wakes; three mountain ranges; a two-layer cloud ceiling drifting on the
wind; shore mist and open-water wisps; searchlights over Central; a
firework show in 06; a soft glow on the brightest lights; and a film
grade over the whole frame. A bow spray was tried and removed as too
forceful (your choice, 2026-10-03); the screenshots were retaken without
it.

## Acceptance checks

### 1. Composition, copy and parallax — pass, with known misses

The composition probe at the hold of all twelve frames. Everything else
is within ±3% of its target.

| Frame | Miss | Status |
|---|---|---|
| Desktop 05 | Wheel at 41–50% across (target 29–42%) | Known since the grey-box: at true scale, bigger would push IFC's crown out of the frame |
| Phone 01 | IFC top at 49% (target 46%) | Known since the grey-box |
| Phone 03 | IFC left edge at 87% (target 83%); wheel left at 72% (target 76%) | Known since the grey-box: the storyboard's IFC size needs a camera outside the harbour |

The probe also flags four frames where a landmark's box touches a copy
region. None is a real overlap; no text sits on a subject in any frame:

- **Desktop 01:** the box overlaps the Clock Tower's spire, but this
  chapter's copy is shown in the hero, so nothing is in that box at the
  hold.
- **Desktop 03:** the ferry's box includes its mast tip, which ends below
  and right of the copy.
- **Phone 02 and 04:** the copy region is taller than the copy, so it
  reaches the Clock Tower's spire (02) and IFC's edge (04), well clear of
  the text.

**Copy overflow:** none at 1440 × 900, 1156 × 766 or 390 × 844. At
1156 × 766 the framing drifts up to 4% from the 1440 × 900 targets (window
shape); nothing is cropped or covered.

**Parallax** (desktop, mouse in each corner): landmarks move up to 4.2%
from the centred view (03 most, 05 and 06 least, being far away), and no
frame leaves ±6% of its targets apart from the known 05 wheel.

### 2. Wordmark — pass

香港 reads in front of the scene in both hero screenshots (desktop on the
water, phone in the sky between the copy and the moon, with the tower,
junk, moon and IFC uncovered). Its sinking and fading with the first
scroll is unchanged since it was checked on 2026-10-02.

### 3. Navigation — pass

Nav links and the menu land on the right hold with focus on the chapter
title; Escape closes the menu and returns focus to its button; the
footer's chapter links land on their holds; "Return to the harbour" goes
to the hero with focus on the site title.

### 4. Reduced motion — pass

Stepped mode, no cursor ring, petals off; with the mouse moved, the frame
does not change at all over 2 s (no parallax, no animation). The
searchlights and fireworks hold one pose.

### 5. Fallback — pass

`?fallback` shows the poster page with all six chapters and a working nav
(11 links), no canvas.

### 6. Frame 01 approved against the storyboard — pass

Every layer was reviewed with you as it was built (see
[`../plan/CHANGELOG.md`](../plan/CHANGELOG.md)), and you approved the
desktop and phone frames of 01 (2026-10-03). Those pictures were removed
with the rest on 2026-10-06.

### 7. Performance budget — laptop pass; phones carried to Milestone 5

**Laptop, 2026-10-03:** production build in Cursor's browser (Chromium,
AMD Radeon 860M, 1187 × 952 at pixel ratio 1), a steady 36 s scroll from
the top to the footer:

| Metric | Target | Result |
|---|---|---|
| Average fps | ≥ 50 | **60** (display limit) |
| 1% low fps | ≥ 40 | **57.7** |
| Worst 1 s | — | 60 |
| Frames over 50 ms | none | **none** (longest 17.6 ms) |
| Shaders built mid-scroll | 0 | **0** |
| JS bundle (gzip) | ≤ 230 KB | **209.4 KB** (210.5 KB when measured, before the spray was removed) |

**iPhone 11, 2026-10-02 (you):** average fps 01 47, 02 32, 03 43, 04 33,
05 34, 06 38, all over the 30 target. 1% low 01 41, 02 28, 03 34, 04 28,
05 **18**, 06 30: 05 missed its 24 target (short dips). You then judged
the frame rate fine. These readings predate the cloud ceiling,
searchlights and film grade; you chose not to re-measure for
now, expecting most visitors on an iPhone 16 (2026-10-03). The phone
drops its pixel ratio from 1.5 to 1.25 by itself if it falls under 40
fps. If 05's dips matter on the target phones, its searchlights and
clouds are the first layers to test with the `?off=` switches.

## Budgets raised (your choice, 2026-10-03)

| Budget | Was | Now | Site today |
|---|---|---|---|
| Draw calls | ≤ 100 | **≤ 220** | Desktop 01 211, 02 165, 03 120, 04 93, 05 83, 06 65; phone 01 148, 02 101, 03 116, 04 88, 05 73, 06 57 |
| Generated textures | ≤ 4, each ≤ 512 px | **≤ 32 small code-drawn textures**, about 6 MB of GPU memory, plus the wordmark and artwork | 28 (about 5.5 MB) |

Why: the laptop holds 60 fps at these counts, the iPhone 11's own switch
test showed pixel count, not draw calls, as its cost, and the textures
stand in for model files. If a phone falls short, merging the ferry's and
Clock Tower's meshes (40 and 32 calls in 01) is the first fix.

## Still to do after this milestone

- The paper grain (print texture) from the atmosphere brief, if you want
  it; it was offered as an extra and not built.
- The phone frame-rate pass on the iPhone 11 and 13 (Milestone 5 owns the
  full performance pass).
- Milestones 3–5 as in the plan: assets, atmosphere across all chapters,
  copy and launch.

## How these checks were run

Headless Edge (playwright-core, software rendering) against the dev
server for the screenshots, the probe (`?debug`, P), copy overflow,
parallax corners, navigation, reduced motion and the fallback; Cursor's
browser on the real GPU against `npm run build` + `vite preview` for the
frame rates.
