# README

**Status:** written and committed (user request, 2026-10-06).
**Review:** the file is `README.md` at the project root. GitHub shows it
on the repository page. The harbour page stays
<http://localhost:5173/>.

The repository page should read in one pass: what the harbour is, where
to open it, a picture of the opening, what it does, how it is built, how
to run it, and where the files are.

The order is the useful part. The sentences are ours. No wording, picture
or lettering is taken from anywhere else.

## What the page will contain

1. **Title.** Victoria Harbour.
2. **One sentence.** A night crossing of the harbour, drawn in the browser
   as you scroll.
3. **Three links.** The live site, the source, and
   `docs/plan/HANDOFF.md` for someone joining the work. There is no
   separate prompt file.
4. **Preview.** `public/posters/harbour-social.jpg`, the opening frame
   already in the repo (1200×630, warmed 香港, centered in the frame,
   no interface chrome). The alt text names the Clock Tower, the ferry,
   the red sails and the skyline.
5. **What it does.** Four short points from the built site: the camera
   moves with the scroll through six chapters; the harbour, boats and
   skyline are built in code; the words sit over the picture; phones,
   reduced motion and the chapter menu are included.
6. **How it is made.** Vite, vanilla JavaScript and Three.js. The scene
   is split across `src/`, not held in one file. A push to `main`
   publishes the built site.
7. **Run locally.** `npm install`, then `npm run dev`, then
   <http://localhost:5173/>. Mention `?debug` and `?fps` in one line.
8. **Project structure.** A short tree of the folders that exist now:
   `index.html`, `src/`, `public/`, `docs/`.
9. **Credit.** The models are original. The fonts are SIL OFL. The Dukling
   photograph is Ank Kumar, CC BY-SA. The 1915 terminus print is public
   domain. No reuse licence is stated, because the repository does not
   have one yet.

Leave out a list of other projects. Leave the chapter list; the six names
belong in "What it does" or under the structure, not as a second contents
page.

## Checklist

- [x] Replace the opening so the title, one sentence and three links come
  first.
- [x] Show `public/posters/harbour-social.jpg` under the links.
- [x] Write "What it does" from the built harbour.
- [x] Write "How it is made" as Vite, vanilla JavaScript and Three.js.
- [x] Keep local review at <http://localhost:5173/>.
- [x] Draw the folder tree from the folders that exist.
- [x] Name the font licence and the two picture credits.
- [x] Use none of the sentences from the reference README.
- [x] Do not change the harbour page.
- [x] Commit when asked.

**Done when:** the repository page tells a new person what this is, where
it runs, and which folder to open, without sending them into the plan.
