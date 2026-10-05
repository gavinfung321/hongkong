# Footer — Improvement Plan

**Status:** planned, 0 of 8 steps complete
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/#chapter-06> then scroll into the footer

## Goal

Keep the footer as the quiet close after Afterglow. The layout already
works. The statement still retells the night that Scene 06 has just ended,
and its making credit sits in the same display type as the story.

## Frozen scope

Do not change:

- the return button, its label, or its place above the statement;
- the three columns, their headings, or the chapter links;
- the landmark facts, years, or the decision to leave the wheel off that list;
- the bottom bar: © 2026 Gavin Fung, 維港夜色, Hong Kong;
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
- The statement is ivory display type: “One night, six chapters, one
  crossing. The journey runs from the old railway clock at Tsim Sha Tsui to
  the lights of Central. The harbour, vessels and skyline are built and
  animated in code.”
- Scene 06 now ends on one paragraph: the light fades, the water stays, the
  ferries and the clock return in the morning, the harbour remains. The
  footer statement repeats that journey and then switches into a production
  note.
- Chapters and landmarks sit side by side on phones, with the colophon
  below. Landmark years drop to their own line. The bottom bar stacks.
- Chapter copy, the vertical label, and the side pager fade as the footer
  rises. The nav bar is not forced back on.

## Proposed words

Not yet approved. Use these only if step 2 is accepted:

1. **Statement:** “The crossing ends here. In the morning the ferries will
   cross again.”
2. **Colophon, after the HKAAA line:** “The harbour, vessels and skyline are
   built and animated in code.”

The statement answers Scene 06 instead of retelling it. The making credit
moves next to the other credits.

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

- [ ] Leave the return, columns, bar, hairline and wash in place.
- [ ] Leave the firework dimming and the chapter-layer fade in place.
- [ ] Do not restyle the footer to match the chapter beats.

**Done when:** the footer is still the same close, ready for a shorter
statement.

### 2 — Let the statement answer the ending

- [ ] Replace the three-sentence statement with the proposed two lines, once
  accepted.
- [ ] Move “built and animated in code” into the colophon.
- [ ] Keep the red-sail mark beside the statement.
- [ ] Keep the statement in the ivory display face.

**Done when:** the footer does not retell the six chapters, and the making
credit sits with the other credits.

### 3 — Desktop reading

- [ ] Keep the statement to two lines at 1440 × 900 and 1178 × 1014.
- [ ] Keep the three columns aligned, with headings and links readable over
  the dimmed bursts.
- [ ] Keep “Return to the harbour” the first action.

**Done when:** a desktop reader can return, read the close, and find a
chapter without the statement crowding the columns.

### 4 — Mobile reading

- [ ] Check 390 × 844 and 320 × 720.
- [ ] Keep the mark above the statement, and the statement within four lines.
- [ ] Keep chapters and landmarks side by side, the colophon below, and the
  years on their own line.
- [ ] Keep the stacked bottom bar from colliding with the home indicator.

**Done when:** a phone reads the same close without a cramped column or a
clipped bar.

### 5 — Handoff from Scene 06

- [ ] Let Scene 06’s paragraph leave with the existing copy fade.
- [ ] Keep the bursts at half strength and the smoke at 70% behind the text.
- [ ] Leave the nav bar on its current show-on-scroll-up behaviour.

**Done when:** Afterglow ends, and the footer begins, without a second
finale.

### 6 — Reduced motion, keyboard and fallback

- [ ] The footer is already still. Do not add motion.
- [ ] Confirm the return, chapter links, HKAAA link and photo credit are
  reachable by keyboard.
- [ ] Confirm the same words appear in the poster-only fallback.

**Done when:** the close is readable with motion reduced and without the
3D scene.

### 7 — Final review

- [ ] Run `npm run build` once after the final adjustment.
- [ ] Inspect the footer at 1440 × 900, 1178 × 1014, 390 × 844 and 320 × 720.
- [ ] Confirm the page remains enhanced and does not enter fallback.
- [ ] Do not create screenshots or recordings.

**Done when:** the existing footer picture is intact and the new lines are
readable at all review sizes.

### 8 — Approval gate

- [ ] Present the footer from <http://localhost:5173/#chapter-06>.
- [ ] Obtain explicit user approval.
- [ ] Record the decision in `interface.md` and `CHANGELOG.md`.
- [ ] Update `FINAL-NARRATIVE-COPY.md` only after that approval.

**Done when:** the user approves the footer.

## Next action

Begin step 2 when the proposed statement is accepted. Do not change the
columns, the bar, or the firework softening in that step.
