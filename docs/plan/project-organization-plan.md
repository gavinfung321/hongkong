# Project organization

**Status:** closed (user request, 2026-10-06).
**Review:** <http://localhost:5173/>

The harbour is built. This pass lined the words, the docs and the code
up, and removed only what nothing uses. The briefing, the copy record and
the scene map describe the site as it is.

## What “clean” means

Someone new can answer three questions without reading the changelog:

1. What is on the page now?
2. Which file owns each chapter?
3. Which documents are the current record, and which are history?

The page stays the source for words and for the picture. Docs describe
that page. Code stays where `docs/SCENE-MAP.md` says it is.

## Leave in place

- Closed chapter plans. They are the record of how 02–06 were built.
- `CHANGELOG.md`. It is the history. Do not rewrite or shorten it.
- Briefs and reviews (`CURSOR-GREYBOX-BRIEF.md`, `WORLD-BIBLE.md`,
  `ATMOSPHERE-EFFECTS-BRIEF.md`, `TYPOGRAPHY-INTERFACE-BRIEF.md`, the
  greybox and milestone reviews). Mark them as history. Do not delete them.
- Reference art under `docs/references/`. It is not shipped.
- A cleanup whose only aim is a smaller download. Unused comments and
  unread docs are not requested by the page. Delete a file in `public/`
  only when nothing asks for it. Delete a source file only when nothing
  imports it.

## What is already out of date

These are the mismatches found while writing this plan. Steps 1–5
corrected them.

- `docs/plan/README.md` still opens as if the colour pass and the iPhone
  measurement are open. The “Open” section below that says both are
  closed. The glance still calls the vertical title 東方明珠. It is
  東方之珠.
- `docs/plan/HANDOFF.md` still briefs a fresh chat for 2026-10-03. It
  points at <http://localhost:5173/hongkong/>. The review address is
  <http://localhost:5173/>. It says not to commit
  `docs/FINAL-NARRATIVE-COPY.md`. That file is now the word record. It
  says publishing is what remains. The site is already live.
- `docs/SCENE-MAP.md` still says some scenes live in `src/data/chapters.js`.
  All six chapters are assembled from `src/story/scene01`–`scene06`.
  `chapters.js` only gathers them and holds the shared scroll numbers.
- The footer says the Star Ferry’s origins are in 1880. Scene 03 says
  “Crossing since 1888.” Both are on purpose until a choice is made.
- The share image was retaken 2026-10-06 with the warmed 香港. The
  fallback posters, `posters/harbour-poster-desktop.webp` and
  `posters/harbour-poster-mobile.webp`, are still the 2026-10-04 frame.
- `FINAL-NARRATIVE-COPY.md` records the live sentences, and it also still
  carries the 2026-10-03 draft notes, the old 18-to-21-word rule, and a
  finished implementation handoff. A reader can think those are still
  the task.
- README “After this milestone” still describes copy, posters and
  publishing as future work.

## Recommendation

Do the briefing first, then the words, then an inventory, then deletions.
Do not start by deleting files.

1. Rewrite `HANDOFF.md` as the current briefing: how we work, the review
   address, where the words are, where each chapter lives, and that the
   six chapters, the footer and the colours are built.
2. Correct the README glance and its open/closed lines so they match
   that briefing. Point “After this milestone” at this plan.
3. Make `FINAL-NARRATIVE-COPY.md` one record of the live words. Keep a
   short note that earlier drafts are retired. Do not leave a second
   task list inside it.
4. Bring `SCENE-MAP.md` in line with `chapters.js`.
5. List unused `public/` files and unimported `src/` files. Delete only
   the ones that list confirms. Record each removal.
6. Ask before changing the 1880 / 1888 split, and before retaking the
   two fallback posters.

## Checklist

### 1 — A briefing someone can follow

- [x] Rewrite `HANDOFF.md` for the site as it is on 2026-10-06.
- [x] Correct the README status, the glance, and “After this milestone.”
- [x] Name the current documents: `SCENE-MAP.md`,
  `FINAL-NARRATIVE-COPY.md`, `ASSET-LEDGER.md`, this plan folder.
- [x] Name the history documents and say they are not the task list.

**Done (2026-10-06):** a new chat starts from `HANDOFF.md`. The review
address is <http://localhost:5173/>. The October look test is named as
history.

### 2 — Words match the page

- [x] Read `index.html` against `FINAL-NARRATIVE-COPY.md`.
- [x] Keep one statement of each live sentence. Move retired drafts out
  of the reading path.
- [x] Leave the 1880 footer line and the 1888 chapter line until a choice.
- [x] Record the vertical title as 東方之珠 and the chapter 01 label as 維港.

**Done (2026-10-06):** `FINAL-NARRATIVE-COPY.md` records the words on the
page. Retired drafts are not repeated. The page was not changed.

### 3 — The map matches the code

- [x] Update `SCENE-MAP.md` so each chapter points at its
  `src/story/sceneNN/config.js`.
- [x] Say what `src/data/chapters.js` still owns: the scroll numbers and
  the assembled list.
- [x] Check the README file table against the plan files that exist.

**Done (2026-10-06):** the map sends a chapter edit to that scene's
config. `chapters.js` is the scroll numbers and the assembled list.
Scenes 03–06 still attach id, slug, title and storyboard there. The README
plan table already names every file in `docs/plan/`. The page was not
changed.

### 4 — Inventory, then remove

- [x] List every file in `public/` and where the page requests it.
- [x] List every `src/` module that nothing imports.
- [x] Delete only confirmed unused files. Update `ASSET-LEDGER.md` when
  a shipped asset goes.
- [x] Do not delete closed plans, briefs, or reference art.

**Done (2026-10-06):** every image, font and the favicon is requested.
The four OFL texts stay; they are the font licences. Six `.gitkeep`
placeholders are gone: the empty `cutouts`, `models` and `textures`
folders, and the spare keeps in `fonts`, `plates` and `posters`. All 72
`src` modules are imported (`debug.js` with `?debug`, `fpsOverlay.js`
with `?fps`). No shipped asset left, so the ledger is unchanged. The
page was not changed.

### 5 — Decisions still open

- [x] Choose whether Scene 03 stays “Crossing since 1888” while the
  footer says “origins in 1880.”
- [x] Choose whether to retake the two fallback posters so they match
  the warmed 香港. The share image is already retaken.
- [x] Record the illustration count. The spine still has an open line
  about using no more than two or three. Scene 02 has one print and
  Scene 04 has two photographs.

**Done (2026-10-06):** both dates stay. 1880 is the first crossing,
Morning Star. 1888 is the founding of the Kowloon Ferry Company. The
two fallback posters are retaken from the current opening frame. The
illustration count is three: one print in Scene 02 and two photographs
in Scene 04. That is the top of the spine’s limit. Nothing was added
or removed.

### 6 — Close this plan

- [x] Update `HANDOFF.md`, `README.md`, `CHANGELOG.md` and this file.
- [x] Look at <http://localhost:5173/> only if a step changed the page.
- [ ] Commit when asked.

**Done (2026-10-06):** the briefing, the words and the map describe the
same site. This step did not change the page. The commit waits until it
is asked for.
