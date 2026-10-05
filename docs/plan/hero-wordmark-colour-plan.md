# Hero wordmark — 香港 colour

**Status:** approved, 6 of 6 steps complete (user approval, 2026-10-05)
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/> on desktop and on a phone

## Goal

Keep 香港 as the hero’s large word, lit from above. The lower half is a
cool grey-violet that does not belong to the cream type or the night’s
warm light, and the feet lose their strokes.

## How it looks now

The two characters are drawn in Noto Serif TC 700 onto a plane in the
scene (`createWordmark.js`). The material is cream (`#f3e9d2`). A vertical
shade multiplies that:

- the top third is white;
- by 70% of the height it is grey-violet, `rgb(140, 130, 165)`;
- the feet are dusk violet, `rgba(44, 38, 74, 0.95)`.

On a wide screen the word stands in the water. The bright tops read. The
feet sink into the same colour as the harbour, so the lower strokes of 香
and 港 disappear, and the red sail shows through them.

On a phone the word sits in the sky. The tops still read. The lower half
turns grey where it crosses the moon, so 港 looks muddy.

The shade was chosen so the word would sit in the scene rather than on the
glass (user request, 2026-10-01). The violet is now a third colour, beside
cream type and the orange brand.

## Recommendation

Accepted and approved (user approval, 2026-10-05). The lower shade is a dark
cream. The top stays white.

Keep the lit-from-above fade. Keep the tops near white. Move the middle
and the feet from grey-violet toward a dark cream, dark enough to sit in
the water, light enough that the strokes stay visible over the water and
over the moon.

Do not paint 香港 orange. Orange is the sail and the interface marks. A
giant orange word would fight the junk. Do not flatten it to one solid
white. That would sit on the glass.

## Frozen scope

Do not change:

- the word’s size, depth, screen position, or the gap below 01’s copy;
- the fade as the hero is left;
- the font, or the hidden heading;
- the logo, the chapter type, the scroll stroke, or the accent split;
- the poster and the social image, unless a later step is asked to
  recapture them.

## Files in scope

- `src/scene/createWordmark.js` — the shade stops only.
- This file, `interface.md`, `narrative-spine.md`, `README.md` and
  `CHANGELOG.md` — tracking.

## Implementation checklist

### 1 — Keep the word where it is

- [x] Leave placement, size, depth and the scroll fade as they are.
- [x] Leave the top of the shade near white.

**Done when:** only the lower colour is open to change.

### 2 — Warm the lower shade

- [x] Replace the grey-violet middle and the dusk-violet feet with a dark
  cream, once the direction is accepted.
- [x] Keep a clear step from the white top into that darker cream.
- [x] Do not introduce orange.

**Done when:** the lower strokes are a warm dark, not a separate violet.

### 3 — Desktop reading

- [x] At 1440 × 900, read both characters over the water, the railing and
  the red sail.
- [x] The feet stay darker than the tops, and the strokes still show.

**Done when:** 香 and 港 can be read down to their feet.

### 4 — Phone reading

- [x] At 390 × 844, read both characters over the moon and the sky.
- [x] The lower half does not turn muddy grey on the moon.

**Done when:** the phone word matches the desktop shade.

### 5 — Stillness

- [x] Reduced motion still fades the same word, with no new motion.
- [x] The poster and the social image stay as they are.

**Done when:** only the live shade has changed.

### 6 — Approval gate

- [x] Review at <http://localhost:5173/> on desktop and on a phone.
- [x] Run `npm run build` once after the last shade change.
- [x] Obtain explicit approval.
- [x] Record it in `interface.md` and `CHANGELOG.md`.
- [x] Do not create screenshots or recordings.

**Done when:** the user approves the shade.

## Next action

Closed (user approval, 2026-10-05). The feet stay a dark cream. No further
wordmark work until asked.
