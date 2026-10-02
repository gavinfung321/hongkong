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

## Next task: fireworks, step 2 of 3 (user choice, 2026-10-02)

Follow `ATMOSPHERE-EFFECTS-BRIEF.md` §6.7, one step at a time, with a
review after each:

1. **Still bursts (done 2026-10-02):** `src/scene/createFireworks.js`
   replaced the ring markers with cards of `firework-burst.webp`: eight
   on desktop, six on phones, 35% bigger than the markers (user request);
   see `atmosphere.md`, "Fireworks in 06".
2. Animation (user choice, 2026-10-02: keep the cards, add particles):
   a deterministic 7–9 s loop, quick reveal (0.2–0.3 s), slow fade
   (1.2–2 s), starting near 70% size; three to five live at once, never
   all; no harsh flashes; reduced motion holds a composed still. Add our
   own three.js particles (one draw call): rockets rising from behind the
   skyline and sparks falling under each burst. The user's React
   "fireworks-show" component is a technique reference only (no React
   here, its trails paint black, unknown licence).
3. Smoke (2–3 violet-coral wisps on desktop, 1 on phones) and sparse
   falling embers, outside the copy.

Where things are:

- Bursts: `createFireworks` in `src/scene/createFireworks.js` (`place`,
  `setLevel`, `load`), placed in front of the 06 pose from `bursts` in
  chapter 06 of `src/data/chapters.js` (place, size, colour, strength,
  rotate, mirror, squash); artwork, colours and halo in
  `src/data/atmosphere.js`. The `bursts` visibility level is 1 only in 06.
  Steps 2 and 3 belong in the same module (it has no `update` yet).
- Artwork: `public/atmosphere/firework-burst.webp` is in use. Smoke and
  embers are still in `docs/references/production-candidates/`
  (`firework-smoke.webp` 391 KB, over the 300 KB aim; `firework-embers.webp`).
  Copy the one in use to `public/atmosphere/` and mark it "In use" in
  `docs/ASSET-LEDGER.md`.
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
