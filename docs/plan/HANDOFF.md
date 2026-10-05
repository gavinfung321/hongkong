# Handoff

Written 2026-10-06. Start here. The six chapters, the footer and the
colours are built. No plan is open.

## The project and the user

- Victoria Harbour 3D scroll site: Vite, three.js, everything built in
  code (no GLB files). A hero, then chapters 01–06.
- The user is a designer, on Windows, and reviews on desktop and on
  iPhone. They prefer to work in the code.
- Live at <https://gavinfung321.github.io/hongkong/> (repo
  `gavinfung321/hongkong`). Every push to `main` deploys. After a push,
  watch the Action.
- Review at <http://localhost:5173/>. Do not use another port. Dev serves
  the site at `/`; the `/hongkong/` base is only the GitHub Pages build.
- `?hold=N` opens chapter N at its hold. `?debug` adds `window.__vh`.
  `?fps` shows the frame rate. Phone switches live in `checks.md`:
  `?dpr=1.25`, `?aa=0`, `?bloom=0`,
  `?off=water,clouds,mist,palms,petals,beams`, `?grade=0`.

## How we work

- Plan first when the user asks for a plan. An approval is the go-ahead
  to build that step.
- Plain language, outcome first.
- The user reviews the page. Do not take screenshots unless asked.
- Commit only when asked.
- One harbour chapter: read `docs/SCENE-MAP.md` first and open only the
  files in that scene's row.

## Standing rules

- Update the plan with every change to behaviour, look or content: the
  area file in `docs/plan/`, one entry in `CHANGELOG.md`, and `checks.md`
  only if a check or a budget figure changes. New artwork goes in
  `docs/ASSET-LEDGER.md`.
- Never edit `~/.cursor/plans/*.plan.md`.
- No Kage code, images, lettering or copy. Techniques only, with original
  or licensed assets.
- Nothing may cover 香港 in the hero. IFC leads in brightness.
- Do not commit `docs/references/atmosphere/`,
  `docs/references/bauhinia/generated/`, `docs/references/foreground/` or
  the bauhinia photos. They are gitignored.
- Edit files with the editor tools. PowerShell `Set-Content` and
  `Out-File` can change the encoding.
- A cleanup whose only aim is a smaller download waits until a measured
  figure is over budget. Unused comments are not downloaded. A file in
  `public/` is downloaded only when the page asks for it.

## Where things are

Current record. These describe the site now:

- [`../SCENE-MAP.md`](../SCENE-MAP.md) — which files own each chapter.
- [`../FINAL-NARRATIVE-COPY.md`](../FINAL-NARRATIVE-COPY.md) — the live
  words, one record. The page is the source. Retired drafts are not
  repeated there.
- [`../ASSET-LEDGER.md`](../ASSET-LEDGER.md) — shipped art, fonts and rights.
- [`README.md`](README.md) — the plan index and the look at a glance.

Each chapter's settings live in `src/story/scene01` through `scene06`.
`src/data/chapters.js` gathers those six and holds the shared scroll
numbers. Scenes 03–06 attach their id, slug, title and storyboard in that
list. Words are in `index.html`. The map is `docs/SCENE-MAP.md`.

History. These are not the task list:

- `docs/CURSOR-GREYBOX-BRIEF.md`, `docs/WORLD-BIBLE.md`,
  `docs/ATMOSPHERE-EFFECTS-BRIEF.md`, `docs/TYPOGRAPHY-INTERFACE-BRIEF.md`
- `docs/greybox-review/` and `docs/milestone-2-review/` — the written
  notes. The pictures were removed 2026-10-06.
- `docs/MILESTONE-2-PLAN.md` (split into this folder on 2026-10-02)
- [`closed-plans.md`](closed-plans.md) — the finished checklists, folded
  into one file on 2026-10-06
- `CHANGELOG.md` — the dated history. Do not rewrite it.

## What is built

- Hero 香港: white at the top, dark cream at the feet.
- Vertical title 東方之珠. Chapter 01's label stays 維港.
- Chapters 01–06, including Scene 02's two paragraphs, Scene 03's
  crossing, Scene 04's then-and-now, Scene 05's callouts, and Scene 06's
  closing paragraph.
- Footer, orange for the brand, yellow for light in the picture.
- Share image `posters/harbour-social.jpg`, and the two fallback posters,
  retaken 2026-10-06 from the current opening frame. A normal visit does
  not download the share image. The fallback stills load only when the
  3D scene cannot.
- The footer says the Star Ferry's origins are in 1880: the first
  crossing, Morning Star. Scene 03 says "Crossing since 1888": the year
  the Kowloon Ferry Company was founded. Both stay (user choice,
  2026-10-06).

## Next

Nothing is queued. The site described above is current. A new chat starts
from this file.
