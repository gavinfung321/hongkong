# Handoff — Milestone 2 review done; user decisions next

Written 2026-10-02 to start a fresh chat; updated 2026-10-03. Read this
file, then [`README.md`](README.md) and
[`../milestone-2-review/REVIEW.md`](../milestone-2-review/REVIEW.md).

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
  Phone measurement switches (live): `?dpr=1.25`, `?aa=0`, `?bloom=0`,
  `?off=water,clouds,mist,palms,petals,beams,spray`, `?grade=0` (see
  `checks.md`).

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
stronger 04 cloud, the plan split into `docs/plan/`. Since then: the
cloud ceiling (two layers in every chapter, wind drift; see
`atmosphere.md`), user petal artwork, automatic phone sharpness. On
2026-10-03: searchlights, bow spray (the junk's only a small bow wave),
the film grade, and the Milestone 2 review. The review leaves three
decisions to the user: sign-off of 01, the phone re-measure (deferred),
and raising the draw-call and texture budgets. The paper grain from the
atmosphere brief was offered and not built.

## Fireworks: all three steps done (user choice, 2026-10-02)

Built from `ATMOSPHERE-EFFECTS-BRIEF.md` §6.7, one step at a time, with a
review after each. No next task is set; ask the user.

1. **Still bursts (done 2026-10-02):** `src/scene/createFireworks.js`
   replaced the ring markers with cards of `firework-burst.webp`: eight
   on desktop, six on phones, 35% bigger than the markers (user request);
   see `atmosphere.md`, "Fireworks in 06".
2. **The show (done 2026-10-02):** an 8 s loop with rockets, ignition,
   opening, cooling, fading and falling spark streaks; reduced motion
   holds a composed moment; see `atmosphere.md`. The user's React
   "fireworks-show" component was a technique reference only.
3. **Smoke (done 2026-10-02):** three faint wisps on desktop, two on
   phones, beside and below the biggest bursts, drifting and thinning
   over 5 s (`smoke` in chapter 06, `FIREWORKS.smoke`). The falling
   sparks cover the brief's embers.

Where things are:

- Show: `createFireworks` in `src/scene/createFireworks.js` (`place`,
  `setLevel`, `load`, `update`, `setStill`, and `hold(t)` for tests),
  placed in front of the 06 pose from `bursts` in chapter 06 of
  `src/data/chapters.js` (place, size, colour, strength, rotate, mirror,
  squash, `at`); artwork, colours, halo and all timing in `FIREWORKS` in
  `src/data/atmosphere.js`. Everything is a pure function of the show
  time (`pose(t)`). The `bursts` visibility level is 1 only in 06. The
  smoke wisps live in the same module. With `?debug`,
  `window.__vh.fireworks.hold(t)` freezes the show at any moment.
- Artwork: `public/atmosphere/firework-burst.webp` and
  `public/atmosphere/firework-smoke.webp` (re-encoded to 285 KB) are in
  use; `firework-embers.webp` stays unused in
  `docs/references/production-candidates/`.
- A similar card technique: `src/scene/createAtmosphere.js` (feathered
  ShaderMaterial cards cut from a sprite sheet, placed from screen
  positions at a chapter pose).

## Checks used so far

Local test scripts lived in `%TEMP%\vh-shot` (they may be gone; rewrite if
needed). They drove headless Edge (playwright-core, SwiftShader):

- screenshots of every hold on desktop (1440 × 900) and phone (390 × 844);
- the composition probe (only known misses: desktop and narrow 05
  wheel.left/right; mobile 01 ifc.top; mobile 03 ifc.left, wheel.left;
  plus box-only copy-region flags in desktop 01 and 03 and phone 02 and
  04, with no text on a subject — see the review);
- draw calls per hold (desktop 06 is about 64 now);
- bright-pixel counts so IFC keeps the lead.

Software rendering is slow (a full screenshot set takes about 2 minutes),
so check only the chapters a change touches, plus a full set before
pushing.
