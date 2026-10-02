# Handoff — next task: fireworks in 06

Written 2026-10-02 to start a fresh chat. Read this file, then
[`README.md`](README.md) and `docs/ATMOSPHERE-EFFECTS-BRIEF.md` §6.7 and §12.

## The project and the user

- Victoria Harbour 3D scroll site: Vite 8, three.js 0.186, everything built
  in code (no GLB files). Six chapters, 01–06, plus a hero.
- The user is a designer, new to coding, on Windows; tests on iPhone 11/13.
- Live at <https://gavinfung321.github.io/hongkong/> (repo
  `gavinfung321/hongkong`). Every push to `main` deploys through GitHub
  Actions; after pushing, watch it (`gh run list --limit 1`,
  `gh run watch <id> --exit-status`).
- Dev server: `npm run dev`, then <http://localhost:5173/hongkong/>.
  `?hold=N` opens chapter N at its hold; `?debug` adds `window.__vh`
  (scene, camera, world, solver tools); `?fps` shows the frame-rate overlay.

## How the user likes to work

- Often asks to "analyze first": report findings and recommendations, then
  ask with multiple-choice options; an answer counts as approval to code.
- Plain-language updates, outcome first.
- Images embedded in chat don't display for the user. Copy review
  screenshots into `review-shots/` (ignored by git, never committed) and
  tell the user the file names.
- Commit and push each approved change, then watch the deploy.

## Standing rules

- Update the plan with every change (`.cursor/rules/keep-plan-updated.mdc`):
  the area file in `docs/plan/`, one line in `CHANGELOG.md`, and `checks.md`
  only if a check or budget figure changes. New artwork goes in
  `docs/ASSET-LEDGER.md`. Commit plan edits with the code.
- Never edit `~/.cursor/plans/*.plan.md`.
- Licence: no Kage code, images, lettering or copy; techniques only.
- Never commit `docs/references/atmosphere/`, `docs/references/bauhinia/generated/`,
  `docs/references/foreground/` or the bauhinia photos (all gitignored).
  `docs/references/production-candidates/` is committed.
- Don't commit other agents' files: `docs/FINAL-NARRATIVE-COPY.md`
  (untracked) and `docs/TYPOGRAPHY-INTERFACE-BRIEF.md` (modified) are left
  out on purpose.
- Nothing may cover 香港 in the hero; IFC leads in brightness.
- Edit files with the editor tools; PowerShell `Set-Content` / `Out-File`
  can change the encoding.

## Current state

Milestone 2 is built (see README "Current state at a glance"). The latest
work, all done and deployed: clouds and mist (finished: the user said "we
done with mist"), lamps re-spaced, hero chapter numbers removed on desktop,
stronger 04 cloud, the plan split into `docs/plan/`.

## Next task: fireworks, step 1 of 3 (user choice, 2026-10-02)

Follow `ATMOSPHERE-EFFECTS-BRIEF.md` §6.7, one step at a time, with a
review after each:

1. **Still bursts (do this first):** replace the four ring markers with
   `firework-burst.webp` at their existing screen positions and sizes.
   Desktop: warm, coral, cyan, coral. Phones: two dominant bursts, one
   supporting, one fading remnant, keeping the copy's space. One shared
   alpha texture, rotated, mirrored, scaled and tinted so no two look the
   same; a small core halo; IFC's crown stays the anchor at the bottom.
2. Animation: a deterministic 7–9 s loop, quick reveal (0.2–0.3 s), slow
   fade (1.2–2 s), starting near 70% size; never all at once; no harsh
   flashes; reduced motion holds a composed still.
3. Smoke (2–3 violet-coral wisps on desktop, 1 on phones) and sparse
   falling embers, outside the copy.

Where things are:

- Markers: `createBursts` / `placeBursts` in `src/scene/createForeground.js`
  (colours in `BURST_COLORS`), placed in front of the 06 pose by
  `src/main.js` from `bursts` in chapter 06 of `src/data/chapters.js`.
  The `bursts` visibility level is 1 only in 06.
- Artwork: `docs/references/production-candidates/firework-burst.webp`,
  `firework-smoke.webp`, `firework-embers.webp`. Copy the one in use to
  `public/` (as was done for `public/atmosphere/coral-clouds.webp`) and mark
  it "In use" in `docs/ASSET-LEDGER.md`.
- A similar card technique: `src/scene/createAtmosphere.js` (feathered
  ShaderMaterial cards cut from a sprite sheet, placed from screen
  positions at a chapter pose).

## Checks used so far

Local test scripts lived in `%TEMP%\vh-shot` (they may be gone; rewrite if
needed). They drove headless Edge (playwright-core, SwiftShader):

- screenshots of every hold on desktop (1440 × 900) and phone (390 × 844);
- the composition probe (only known misses: desktop and narrow 05
  wheel.left/right; mobile 01 ifc.top; mobile 03 ifc.left, wheel.left);
- draw calls per hold (desktop 06 is about 64 now);
- bright-pixel counts so IFC keeps the lead.

Software rendering is slow (a full screenshot set takes about 2 minutes),
so check only the chapters a change touches, plus a full set before
pushing.
