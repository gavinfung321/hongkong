# Footer — Improvement Plan

**Status:** approved, 8 of 8 steps complete (user approval, 2026-10-05)
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/#chapter-06> then scroll into the footer

## Goal

Keep the footer as the quiet close after Afterglow. The statement answers
the ending. The making credit sits in the colophon with the other credits.

## Frozen scope

Do not change:

- the return button, its label, or its place above the statement;
- the three columns, their headings, or the chapter links;
- the landmark facts, years, or the decision to leave the wheel off that list;
- the bottom bar: © 2026 Gavin Fung, 維港夜色, Hong Kong;
- the colophon line “Created by Gavin Fung at HKAAA”, and the Dukling
  photograph credit, while that photograph remains in Scene 04;
- the cream hairline, the near-black wash, or how the bursts dim to half
  strength and the smoke to 70% as the footer rises;
- Scene 06’s camera, bursts, smoke, or closing paragraph;
- any earlier scene.

Do not add a newsletter, social row, map, or a second illustration. Do not
use any Kage lettering or copy.

## Current state

- The footer rises over Scene 06. A cream hairline, then “Return to the
  harbour,” then the statement beside the red-sail mark, then three columns,
  then the bottom bar.
- The statement is ivory display type, two lines: “The crossing ends here.
  In the morning the ferries will cross again.” (user approval, 2026-10-05).
- Scene 06 now ends on one paragraph: the light fades, the water stays, the
  ferries and the clock return in the morning, the harbour remains. The
  footer answers that ending. The making credit sits in the colophon, after
  the HKAAA line. “Original 3D scene and illustrated atmosphere” is gone
  (user request, 2026-10-05).
- On phones the red-sail mark stays to the left of “The”, on the first
  line (user request, 2026-10-05). Chapters and landmarks sit side by side,
  with the colophon below. Landmark years drop to their own line. The
  bottom bar stacks.
- Chapter copy, the vertical label, and the side pager fade as the footer
  rises. The nav bar is not forced back on.

## Accepted words

Accepted (user approval, 2026-10-05). Now on the page:

1. **Statement:** “The crossing ends here. In the morning the ferries will
   cross again.”
2. **Colophon, after the HKAAA line:** “The harbour, vessels and skyline are
   built and animated in code.”

The statement answers Scene 06 instead of retelling it. The making credit
sits with the other credits.

**Credits** (user question, 2026-10-05): keep “Created by Gavin Fung at
HKAAA”. It is not a copy of “© 2026 Gavin Fung”. The bar is the year and the
name. The colophon is the studio, and HKAAA is the only link to it. Do not
remove “Dukling photograph by Ank Kumar, CC BY-SA” while
`plates/dukling-2016.webp` is on Scene 04. The caption “Now · Dukling, built
1955” does not name the photographer or the licence, and CC BY-SA 4.0
requires both. “Original 3D scene and illustrated atmosphere” is removed
(user request, 2026-10-05). It repeated the making line. The painted sky
stays in the asset notes.

## Files in scope

- `index.html` — the footer statement and colophon line only.
- `src/styles.css` — footer type and spacing only, if the new lines need it.
- This file, `interface.md`, `narrative-spine.md`, `README.md` and
  `CHANGELOG.md` — tracking.

`src/ui/siteFooter.js`, `src/main.js` and `src/scene/createFireworks.js`
stay unread unless a later step finds the existing rise or the firework
softening cannot stay as they are. `FINAL-NARRATIVE-COPY.md` is updated
only after the words are approved.

## Implementation checklist

### 1 — Keep the close that already works

- [x] Leave the return, columns, bar, hairline and wash in place.
- [x] Leave the firework dimming and the chapter-layer fade in place.
- [x] Do not restyle the footer to match the chapter beats.

**Done when:** the footer is still the same close, ready for a shorter
statement.

### 2 — Let the statement answer the ending

- [x] Replace the three-sentence statement with the proposed two lines, once
  accepted.
- [x] Move “built and animated in code” into the colophon.
- [x] Keep the red-sail mark beside the statement.
- [x] Keep the statement in the ivory display face.

**Done when:** the footer does not retell the six chapters, and the making
credit sits with the other credits.

### 3 — Desktop reading

- [x] Keep the statement to two lines at 1440 × 900 and 1178 × 1014.
- [x] Keep the three columns aligned, with headings and links readable over
  the dimmed bursts.
- [x] Keep “Return to the harbour” the first action.

**Done when:** a desktop reader can return, read the close, and find a
chapter without the statement crowding the columns.

### 4 — Mobile reading

- [x] Check 390 × 844 and 320 × 720.
- [x] Keep the mark to the left of “The”, and the statement within four
  lines (user request, 2026-10-05).
- [x] Keep chapters and landmarks side by side, the colophon below, and the
  years on their own line.
- [x] Keep the stacked bottom bar from colliding with the home indicator.

**Done when:** a phone reads the same close without a cramped column or a
clipped bar.

### 5 — Handoff from Scene 06

- [x] Let Scene 06’s paragraph leave with the existing copy fade.
- [x] Keep the bursts at half strength and the smoke at 70% behind the text.
- [x] Leave the nav bar on its current show-on-scroll-up behaviour.

**Done when:** Afterglow ends, and the footer begins, without a second
finale.

### 6 — Reduced motion, keyboard and fallback

- [x] The footer is already still. Do not add motion.
- [x] Confirm the return, chapter links, HKAAA link and photo credit are
  reachable by keyboard.
- [x] Confirm the same words appear in the poster-only fallback.

**Done when:** the close is readable with motion reduced and without the
3D scene.

### 7 — Final review

- [x] Run `npm run build` once after the final adjustment.
- [x] Inspect the footer at 1440 × 900, 1178 × 1014, 390 × 844 and 320 × 720.
- [x] Confirm the page remains enhanced and does not enter fallback.
- [x] Do not create screenshots or recordings.

**Done when:** the existing footer picture is intact and the new lines are
readable at all review sizes.

### 8 — Approval gate

- [x] Present the footer from <http://localhost:5173/#chapter-06>.
- [x] Obtain explicit user approval.
- [x] Record the decision in `interface.md` and `CHANGELOG.md`.
- [x] Update `FINAL-NARRATIVE-COPY.md` only after that approval.

**Done when:** the user approves the footer.

## Next action

Closed (user approval, 2026-10-05). The footer stays as approved. No further
footer work until asked.
