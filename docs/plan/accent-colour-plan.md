# Accent colour

**Status:** approved, 8 of 8 steps complete (user approval, 2026-10-05)
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/>

## Goal

Give the interface one accent. The logo sail is orange (`--color-coral`,
`#e4573d`). A second accent, yellow (`--color-warm`, `#f2b36b`), is used
both for “you are here” and for light in the picture. The two jobs should
not share one colour.

## Recommendation

Accepted and approved (user approval, 2026-10-05). The logo stays orange.

Yellow is already the colour of the lamps, the active year, the ferry
board and the callout arrows. If the sail became yellow, the chapter
numbers 01–06 would have to follow, and the mark would sit in the same
colour as the night’s lights.

Orange stays the brand:

- the sail;
- the chapter numbers 01–06, which are already orange;
- the marks that mean start, or you are here, or a link under the pointer.

Yellow stays the light in the picture. Cream stays the reading type and
the hairlines.

An earlier choice kept coral for the junk’s sails and put the nav
underline in yellow (`interface.md`, 3.4). The chapter numbers have since
joined the sail. This plan revises that split only where a mark is
interface, not light.

## The six questions

Proposed, then applied (user request, 2026-10-05).

1. **Scroll to cross.** Yes. The moving stroke is cream today
   (`currentColor` on the hint). It becomes orange. The faint track under
   it stays cream. The hero numerals “01 / 06” stay cream. After the hero,
   the current numeral is yellow; it moves to orange with the stroke, so
   the corner is one colour.
2. **Scene 02 years.** The active year stays yellow. The line is a
   separator between years, not a logo mark. It brightens on the current
   year. **1915 had no line even while current** (user request, 2026-10-05):
   the first year is built with `border-left: 0`, so the active colour had
   nothing to paint. It now draws the same yellow stroke, one gap to the
   left of the numerals, only while 1915 is current. The numerals do not
   move. At rest, 1915 still has no line.
3. **Nav underline.** Yes. It is yellow today. It becomes orange, with the
   current chapter in the menu, so “you are here” matches the chapter
   number.
4. **Scene 03 countdown.** No. The due digits stay yellow. They are the
   board’s lamps. The green dot stays the ferry’s own green. The
   destination tiles stay cream.
5. **Callout arrows.** No. “Hover me” and “Light the skyline” keep yellow
   arrows. They point at lights. The words stay cream.
6. **Footer hover.** Yes. HKAAA and the other footer links turn yellow on
   hover. That hover becomes orange. The same text-link hover elsewhere
   moves with it.

## Frozen scope

Do not change:

- the logo sail, its shape, or its orange;
- the chapter numbers 01–06;
- cream body type, ivory titles, or the footer statement;
- the timeline’s yellow. 1915’s current stroke uses that same yellow;
- the ferry due digits, the ferry-green dot, or the callout arrows;
- fireworks, lamps, the film grade, or any camera;
- Scene 06, the footer layout, or the approved footer words.

## Files in scope

- `src/styles.css` — the scroll stroke, the nav and menu current mark, the
  link hover, and the 1915 current stroke.
- This file, `interface.md`, `narrative-spine.md`, `README.md` and
  `CHANGELOG.md` — tracking.

## Implementation checklist

### 1 — Keep the orange sail

- [x] Leave the logo orange.
- [x] Leave the chapter numbers orange.
- [x] Do not introduce a third accent.

**Done when:** the brand colour is the sail’s orange, and yellow is only
light.

### 2 — Scroll to cross

- [x] Colour the moving stroke orange.
- [x] Leave the faint track cream.
- [x] Colour the current numeral orange once the hero is left. Leave
  “01 / 06” cream while it is still the invitation.

**Done when:** the corner invites in orange and does not turn the whole
counter into a lamp.

### 3 — Scene 02 years

- [x] Leave the active year’s line and glow yellow.
- [x] Leave 1915 without a resting line.
- [x] Give 1915 the same yellow marker while it is current (user request,
  2026-10-05).

**Done when:** 1915 shows the stroke only while it is the current year, and
the later years are unchanged.

### 4 — Nav underline

- [x] Change the current chapter’s underline from yellow to orange.
- [x] Change the menu’s current chapter mark to the same orange.
- [x] Leave the Chinese hover swap as it is.

**Done when:** the current chapter matches the orange chapter number.

### 5 — Scene 03 countdown

- [x] Leave the due digits yellow.
- [x] Leave the ferry dot green and the destination tiles cream.

**Done when:** the board still looks like a lamp, not a logo.

### 6 — Callout arrows

- [x] Leave both arrows yellow.
- [x] Leave “Hover me” and “Light the skyline” in cream.

**Done when:** the arrows still point at light.

### 7 — Footer hover

- [x] Change the footer link hover, including HKAAA, from yellow to orange.
- [x] Change the shared text-link hover with it.
- [x] Leave unhovered links in their present colour.

**Done when:** a hovered credit matches the sail.

### 8 — Approval gate

- [x] Review at <http://localhost:5173/>: the opening counter, Scene 02’s
  years, the nav, Scene 03’s board, a Scene 05 callout, and the footer
  hover.
- [x] Check 1440 × 900 and 390 × 844.
- [x] Run `npm run build` once after the last colour change.
- [x] Obtain explicit approval.
- [x] Do not create screenshots or recordings.

**Done when:** the user approves the accent split.

## Next action

Closed (user approval, 2026-10-05). Orange is the brand. Yellow stays the
light in the picture. The Scene 02 year cards keep their insets. No further
accent work until asked.
