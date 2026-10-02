# Milestone 2 — Page Shell and Kage-style Look Test

**Status:** approved 2026-10-01 and built step by step, with a review stop
after each step. Live at <https://gavinfung321.github.io/hongkong/>; every
push to `main` redeploys. Still open: the colour pass and the iPhone
measurement (see "Open" below).

This plan follows the approved grey-box (`CURSOR-GREYBOX-BRIEF.md`, review in
`greybox-review/REVIEW.md`). It does not change the existing plan files or the
approved camera journey. Until 2026-10-02 it was one file,
`docs/MILESTONE-2-PLAN.md`; it was split so each update touches one short
file (user choice, 2026-10-02).

## How this plan is organised

| File | What it holds | Old sections |
|---|---|---|
| `README.md` (this file) | Goal, current state at a glance, open items, decisions, next milestones | 1, 6, 9, 10 |
| [`interface.md`](interface.md) | What we take from Kage; hero, wordmark, hint and counter, nav and menu, logo, vertical text, copy regions, parallax, moon, side pager, cursor ring, return button, footer, loading screen | 2, 3 |
| [`scene-models.md`](scene-models.md) | Halftone, lit windows, the code-built ferry, Clock Tower, IFC, wheel and junk, glow | 4.1–4.3 (step 2b) |
| [`scene-promenade.md`](scene-promenade.md) | Petals, railing and lamps, wet paving, palms, bauhinia tree, water reflections | 4.4, 4.5 stops 1–5 |
| [`scene-city.md`](scene-city.md) | Central towers, mountains, landmarks, window lights, painted facades, glow, wakes | 4.5 stop 6, parts 1–3f |
| [`atmosphere.md`](atmosphere.md) | Clouds, shore mist, open-water wisps, fireworks in 06 | 4.5 stop 6, part 3g |
| [`checks.md`](checks.md) | Performance budget and acceptance checks | 5, 8 |
| [`CHANGELOG.md`](CHANGELOG.md) | Dated history of changes, newest first; the old files list | 7 |
| [`HANDOFF.md`](HANDOFF.md) | Briefing for a fresh chat: how we work, standing rules, the next task | — |

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
  vertical 東方明珠 and chapter labels; side pager on desktop only; cursor
  ring and parallax on desktop; "Return to the harbour" at the top of the
  footer; loading screen.
- **Models:** everything built in code, no GLB files: Star Ferry, junk,
  Clock Tower, IFC with its podium, Observation Wheel, Central Ferry Piers,
  four landmarks; lit windows and a soft glow.
- **Promenade:** bauhinia petals, stone railing with lanterns and three tall
  lamps (spread apart in every view), wet paving, palms, bauhinia tree,
  glittering water reflections.
- **City:** dimmer towers so IFC leads, three mountain ranges with haze and
  slope lights, painted landmark facades, wakes.
- **Atmosphere:** coral clouds per chapter (04's stronger on the left);
  separate shore mist drifts (none in desktop 01); open-water wisps in the
  hero and 01; a firework show in 06 (eight bursts on desktop, six on
  phones, in an 8 s loop with rockets, falling sparks and drifting smoke).

## Open

6. **Colour pass.** Try film-style tone mapping. It changes every colour, so
   it is only kept if 01 clearly improves, and the palette is re-tuned for all
   frames in a later milestone.

**Not in the look test:** 3D models (GLBs; later dropped altogether, all 3D
is built in code, user decision 2026-10-01), real fireworks, the sparkle cursor,
particles in other chapters, sound, final copy and fonts.

## Build steps

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

## Decisions (resolved 2026-10-01)

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

## After this milestone

| Milestone | Content |
|---|---|
| 3. Assets | No GLB models: like Kage, every 3D object is built in code (user decision, 2026-10-01; section 4, step 2b). The ferry, junk, Clock Tower, IFC and wheel are already rebuilt from reference photos, with the user's Meshy models and photos as references only. Remaining cutouts including the user's bauhinia petals, display fonts (the bauhinia tree is built in code, 2026-10-02). Also the user's stone railing (built in code with lanterns and tall lamps, 2026-10-02), promenade palms, wet paving tiles (built in code, 2026-10-02) and more realistic skyline buildings (`ASSET-LEDGER.md`, "User reminders", 2026-10-01) |
| 4. Atmosphere, all chapters | Follow `ATMOSPHERE-EFFECTS-BRIEF.md`: clouds and local mist, ferry spray, restrained searchlights, global print texture, chapter colour progression, and illustrated fireworks with smoke and embers. Local glows remain the baseline; a soft bloom is built (Milestone 2, part 3e, step 5; user choice, 2026-10-02). Coral clouds and the harbour mist are built (Milestone 2, part 3g; user request, 2026-10-02). |
| 5. Copy and launch | Follow `FINAL-NARRATIVE-COPY.md` for the proposed final chapter, interface, footer, fallback and metadata wording. Add final poster images (a real snapshot of the hero frame replaces the drawn fallback poster, for loading and fallback; user choice, 2026-10-02), an entrance screen with real build progress, after Kage's technique (3.12; user request, 2026-10-02), a full performance pass on both iPhones, deployment. |

**Published early (user choice, 2026-10-02).** The work in progress is live at
<https://gavinfung321.github.io/hongkong/> from the public repo
`gavinfung321/hongkong` ("hongkong" chosen over "hong-kong": shorter, matches
the HONG KONG wordmark, easy to type on a phone). Every push to `main`
rebuilds the site (`.github/workflows/deploy.yml`), so the iPhone checks can
use the live address. Before the first push, three bauhinia reference photos
of unknown rights were removed from the whole history; they stay on the
user's computer. Milestone 5 still owns the final launch (copy, posters,
performance).
