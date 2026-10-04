// Sky atmosphere: distant cloud cards (user choice, 2026-10-02; see
// docs/ATMOSPHERE-EFFECTS-BRIEF.md 6.1), now a cloud ceiling in every
// chapter like the storyboard (user request, 2026-10-02).

// The generated coral cloud sheet (docs/ASSET-LEDGER.md): three bands, given
// as pixel rows of the 1600 × 534 image. The lower two touch, so every card
// feathers its edges.
export const CLOUD_SHEET = {
  url: 'atmosphere/coral-clouds.webp',
  size: [1600, 534],
  bands: { tall: [0, 226], thin: [226, 376], low: [376, 534] },
};

// Each card is authored on screen at one chapter's hold pose, then lives in
// the world its layer's `distance` out, so the ridge and towers hide its
// lower edge. It shows in that chapter only, crossfading with the next
// across the move. x / y: % of the viewport for the card's centre; width: %
// of the viewport width; u: a section of the band (share of its length;
// reversed to mirror it); opacity: at its chapter's hold.
//
// Two layers: a big dim `back` layer that roofs the sky and a brighter
// `front` layer of lit cloud banks. `speed`: the wind, as a share of the
// viewport width per second (front twice the back, for depth); the art
// flows through each card's fixed window. `tint` darkens and cools the back
// layer. `feather`: the cards' side fade, wide so clouds drift in and out
// softly.
export const CLOUDS = {
  feather: 0.2,
  layers: {
    back: { distance: 3600, speed: 0.0015, renderOrder: -0.96, tint: { low: [0.62, 0.55, 0.72], high: [0.5, 0.5, 0.66] } },
    front: { distance: 3000, speed: 0.003, renderOrder: -0.95, tint: { low: [1.1, 0.95, 0.95], high: [0.95, 0.92, 1] } },
  },
  cards: {
    desktop: [
      // 01 and the hero: a roof across the top, lit banks between the Clock
      // Tower and the moon and above IFC, and a low bank over the ridge.
      { chapter: 0, layer: 'back', band: 'tall', x: 30, y: 9, width: 80, opacity: 0.55 },
      { chapter: 0, layer: 'back', band: 'tall', u: [0.5, 1], x: 85, y: 10, width: 45, opacity: 0.55 },
      { chapter: 0, layer: 'back', band: 'low', x: 50, y: 26, width: 90, opacity: 0.5 },
      { chapter: 0, layer: 'front', band: 'tall', u: [0.1, 0.6], x: 44, y: 15, width: 36, opacity: 0.7 },
      { chapter: 0, layer: 'front', band: 'thin', x: 90, y: 5, width: 38, opacity: 0.6 },
      { chapter: 0, layer: 'front', band: 'thin', u: [0.6, 1], x: 82, y: 26, width: 22, opacity: 0.6 },
      // 02: one cloud mass on the right over the afterglow, its cards
      // overlapping at uneven heights (user choice, 2026-10-03: separate
      // banks read as stacked rows), lit low near the glow; one faint trace
      // above the moon.
      { chapter: 1, layer: 'back', band: 'tall', x: 60, y: 9, width: 80, opacity: 0.6 },
      { chapter: 1, layer: 'back', band: 'tall', u: [0.3, 0.9], x: 86, y: 22, width: 60, opacity: 0.55 },
      { chapter: 1, layer: 'front', band: 'tall', u: [0.5, 1], x: 74, y: 30, width: 44, opacity: 0.6 },
      { chapter: 1, layer: 'front', band: 'low', x: 90, y: 41, width: 40, opacity: 0.7 },
      { chapter: 1, layer: 'front', band: 'thin', u: [0, 0.6], x: 10, y: 22, width: 24, opacity: 0.45 },
      // 03: one mass above the moon and IFC, its cards overlapping at
      // uneven heights, leaving the copy's upper left calm (user choice,
      // 2026-10-03: separate banks read as stacked rows).
      { chapter: 2, layer: 'back', band: 'tall', x: 66, y: 8, width: 72, opacity: 0.55 },
      { chapter: 2, layer: 'back', band: 'tall', u: [0.3, 0.9], x: 82, y: 17, width: 46, opacity: 0.5 },
      { chapter: 2, layer: 'front', band: 'thin', u: [0, 0.7], x: 58, y: 21, width: 30, opacity: 0.55 },
      { chapter: 2, layer: 'front', band: 'low', u: [0.3, 1], x: 90, y: 6, width: 26, opacity: 0.6 },
      // 04: one mass across the top over the sails, thinning down to the
      // left above the low mountains, under the copy (user choice,
      // 2026-10-03: the banks on the left read as stacked rows).
      { chapter: 3, layer: 'back', band: 'tall', x: 58, y: 7, width: 90, opacity: 0.55 },
      { chapter: 3, layer: 'front', band: 'low', u: [0, 0.55], x: 72, y: 9, width: 34, opacity: 0.6 },
      { chapter: 3, layer: 'back', band: 'tall', u: [0.4, 1], x: 20, y: 38, width: 40, opacity: 0.5 },
      { chapter: 3, layer: 'front', band: 'thin', x: 26, y: 42, width: 34, opacity: 0.5 },
      // 05: dimmer, so IFC leads: one mass right of its crown, running
      // behind the tower at mid-height to a thin tail under the copy (user
      // choice, 2026-10-03: the cards sat in rows).
      { chapter: 4, layer: 'back', band: 'tall', x: 82, y: 12, width: 46, opacity: 0.4 },
      { chapter: 4, layer: 'front', band: 'low', u: [0.4, 1], x: 88, y: 22, width: 26, opacity: 0.45 },
      { chapter: 4, layer: 'back', band: 'low', x: 58, y: 38, width: 50, opacity: 0.35 },
      { chapter: 4, layer: 'front', band: 'thin', u: [0, 0.6], x: 38, y: 44, width: 30, opacity: 0.4 },
      // 06: the fireworks need dark sky, so a dim roof behind the bursts and
      // one lit mass below them, above IFC's crown; the left and left-centre
      // stay dark for the closing copy (user choice, 2026-10-03: five cards
      // read as rows across the left).
      { chapter: 5, layer: 'back', band: 'tall', x: 78, y: 6, width: 44, opacity: 0.3 },
      { chapter: 5, layer: 'back', band: 'low', x: 72, y: 58, width: 50, opacity: 0.45 },
      { chapter: 5, layer: 'front', band: 'thin', u: [0.4, 1], x: 84, y: 63, width: 30, opacity: 0.5 },
      // A thinner, dimmer tail of that mass sweeping left, and a wisp under
      // the left bursts that catches their light (user request, 2026-10-03:
      // the left read as empty).
      { chapter: 5, layer: 'back', band: 'low', u: [0, 0.6], x: 32, y: 64, width: 40, opacity: 0.35 },
      { chapter: 5, layer: 'front', band: 'thin', u: [0.2, 0.8], x: 20, y: 56, width: 24, opacity: 0.35 },
    ],
    mobile: [
      // The phone's sky is tall. 01: one dim deck from the top down to the
      // moon, a small lit bank off-centre left and the bright bank just
      // above the moon; full-width strips at even steps read as stripes
      // (user choice, 2026-10-03).
      { chapter: 0, layer: 'back', band: 'tall', u: [0.15, 0.5], x: 50, y: 22, width: 190, opacity: 0.5 },
      { chapter: 0, layer: 'front', band: 'low', u: [0, 0.45], x: 22, y: 25, width: 70, opacity: 0.5 },
      { chapter: 0, layer: 'front', band: 'tall', u: [0.1, 0.65], x: 45, y: 42, width: 150, opacity: 0.6 },
      // 02: a dim deck above, a lit bank right of the tower over the
      // afterglow, a trace on the left (user choice, 2026-10-03: three
      // full-width strips read as rows).
      { chapter: 1, layer: 'back', band: 'tall', x: 50, y: 12, width: 200, opacity: 0.5 },
      { chapter: 1, layer: 'front', band: 'low', u: [0.4, 1], x: 82, y: 40, width: 120, opacity: 0.6 },
      { chapter: 1, layer: 'front', band: 'thin', u: [0, 0.6], x: 12, y: 27, width: 80, opacity: 0.45 },
      // 03: a dim deck above, one lit bank above the moon (user choice,
      // 2026-10-03: four full-width strips read as rows).
      { chapter: 2, layer: 'back', band: 'tall', x: 50, y: 8, width: 200, opacity: 0.45 },
      { chapter: 2, layer: 'front', band: 'low', u: [0.4, 1], x: 68, y: 31, width: 130, opacity: 0.55 },
      { chapter: 2, layer: 'front', band: 'thin', u: [0, 0.5], x: 30, y: 37, width: 90, opacity: 0.45 },
      // 04: a dim deck above, one lit bank above the moon on the right
      // (user choice, 2026-10-03: four full-width strips read as rows).
      { chapter: 3, layer: 'back', band: 'tall', x: 50, y: 8, width: 200, opacity: 0.45 },
      { chapter: 3, layer: 'front', band: 'low', u: [0.5, 1], x: 72, y: 32, width: 120, opacity: 0.55 },
      // 05: dimmer, so IFC leads: a dim deck above, one lit bank behind
      // IFC's upper half (user choice, 2026-10-03: four cards in rows).
      { chapter: 4, layer: 'back', band: 'tall', x: 50, y: 6, width: 200, opacity: 0.4 },
      { chapter: 4, layer: 'front', band: 'low', u: [0.4, 1], x: 80, y: 32, width: 110, opacity: 0.45 },
      // 06: one lit bank between the bursts and IFC's crown; the bursts keep
      // dark sky (user request, 2026-10-03: less cloud on phones). Right of
      // centre, under the bursts, not a full-width strip (user choice,
      // 2026-10-03).
      { chapter: 5, layer: 'front', band: 'low', u: [0.3, 1], x: 70, y: 60, width: 110, opacity: 0.4 },
      { chapter: 5, layer: 'front', band: 'thin', u: [0.1, 0.6], x: 22, y: 63, width: 70, opacity: 0.35 },
    ],
  },
};

// Searchlights over Central (ATMOSPHERE-EFFECTS-BRIEF.md 6.5; user choice,
// 2026-10-03): soft tapered beams from the landmark rooftops, not IFC's, so
// IFC keeps the lead. `base`: the lamp, world metres; `lean`: the sweep's
// range in degrees from upright (+ leans right as seen from Kowloon). The
// ranges are in the beams' left-to-right order, so two beams never cross
// into a bright knot. `period`: one sweep there and back, in seconds;
// `phase`: where in it the beam starts (0–1). `only`: one screen size.
// How strongly they show per chapter is `searchlights` in chapters.js.
export const SEARCHLIGHTS = {
  color: 0xdce6ff,
  length: 1500, // metres; they leave the top of the frame
  width: [6, 240], // metres at the lamp and at the far end
  opacity: 0.16, // at the beam's core, at full level
  falloff: 1, // how fast the beam fades toward its far end
  recede: 0.25, // how far each beam tilts away from Kowloon
  still: { phase: 0.25, dim: 0.6 }, // reduced motion: one held, dimmer pose
  beams: [
    { base: [-250, 334, -1340], lean: [-34, -20], period: 16, phase: 0.1, only: 'desktop' },
    { base: [130, 312, -1330], lean: [-16, -5], period: 13, phase: 0.55 },
    { base: [235, 283, -1400], lean: [-2, 9], period: 17, phase: 0.8, only: 'desktop' },
    { base: [800, 300, -1420], lean: [13, 28], period: 14, phase: 0.35 },
  ],
};

// The generated harbour mist sheet (docs/ASSET-LEDGER.md): four bands, given
// as pixel rows of the 1600 × 534 image, from broad and bumpy to thin and low.
export const MIST_SHEET = {
  url: 'atmosphere/harbour-mist.webp',
  size: [1600, 534],
  bands: { broad: [37, 143], flat: [163, 264], billow: [267, 408], low: [423, 509] },
};

// Low harbour mist (user request, 2026-10-02; ATMOSPHERE-EFFECTS-BRIEF.md
// 6.2): separate drifts standing on the island's waterfront just behind the
// ferry piers, facing Kowloon, so they soften the foot of the podiums and
// the skyline without veiling the water. Boats, the Clock Tower and the junk
// stand in front of them. The gap around the wheel and IFC keeps 05's
// subjects clear. x / z: card centre in world metres, `y` its foot; width in
// metres (height follows the band's own shape); opacity at a chapter's full
// `mist` level. `tint` colours the grey art like haze lit by the city: warm
// amber-rose at the foot, dusky lavender at the top (user choice, 2026-10-02).
export const MIST = {
  drift: { share: 0.008, period: [90, 130] },
  tint: { low: [1.4, 0.8, 0.55], high: [0.9, 0.72, 0.88] },
  y: 3,
  cards: [
    { x: -800, z: -1110, width: 480, band: 'broad', opacity: 0.45 },
    { x: -300, z: -1112, width: 380, band: 'flat', opacity: 0.45 },
    // A short section: 05 sees this drift from close by, where a full band reads as a strip.
    { x: 110, z: -1110, width: 180, band: 'low', u: [0.2, 0.75], opacity: 0.45 },
    { x: 800, z: -1112, width: 460, band: 'broad', opacity: 0.45 },
  ],
};

// 05's cloud band (user choice, 2026-10-04): thin drifts of low cloud among
// the towers at mid-height, lit warm from below by the city, below IFC's
// crown. The long drift stands just behind IFC, so IFC and the towers in
// front cut through it; a short one hangs among the towers left of the
// wheel. Cut from the mist sheet, fogged like the skyline and depth tested;
// each faces the 05 desktop camera (`face`, x / z) and sways slowly on its
// own period. x / z: centre, `y` the foot, width in metres; opacity at the
// chapter's full `cloudBand` level.
export const CLOUD_BAND = {
  face: [383, -917],
  drift: { share: 0.03, period: [60, 85] },
  tint: { low: [1.55, 0.98, 0.72], high: [0.88, 0.78, 0.96] },
  feather: 0.3,
  cards: [
    { x: 560, z: -1262, y: 150, width: 560, band: 'flat', opacity: 0.75 },
    { x: 250, z: -1215, y: 96, width: 240, band: 'billow', u: [0.1, 0.6], opacity: 0.55 },
  ],
};

// Depth haze (atmospheric depth Stage 2, user request, 2026-10-03): a band
// of separate tall wisps cut from the mist sheet, on the water about 200 m
// in front of the waterfront, so the view reads in layers (this band, the
// shore mist, the mountain-foot haze) rather than as one flat wall. It
// softens the podiums and the towers' feet seen from 01–04; tower tops stay
// crisp. Unfogged and tinted like humid air lit by the city: fogged at this
// range it took the fog's dark colour and vanished against the towers. The
// gap from x 230 to 510 keeps the wheel and IFC clear and is where the
// camera crosses this depth into and out of 05, so no wisp sweeps past the
// lens. (A second band lifted among the towers was tried and removed: the
// front rows hid it.) x / z: centre, `y` the foot, width in world metres;
// opacity at a chapter's full `haze` level. Each wisp drifts on its own
// seeded period, against the shore mist's direction; still in reduced
// motion.
export const HAZE = {
  tint: { low: [1.25, 0.84, 0.66], high: [0.86, 0.76, 0.92] },
  feather: 0.25,
  bands: {
    harbour: {
      drift: { share: 0.012, period: [70, 95] },
      cards: [
        { x: -560, z: -900, y: 0, width: 380, band: 'broad', u: [0.1, 0.6], opacity: 0.65 },
        { x: -160, z: -930, y: 0, width: 340, band: 'billow', u: [0.25, 0.75], opacity: 0.6 },
        { x: 120, z: -890, y: 0, width: 210, band: 'broad', u: [0.55, 0.95], opacity: 0.65 },
        { x: 710, z: -910, y: 0, width: 380, band: 'billow', u: [0.05, 0.55], opacity: 0.6 },
      ],
    },
  },
};

// Open-water mist (user choice, 2026-10-02): separate low wisps out on the
// harbour, 420–650 m from the 01 camera, so in the hero and 01 the mist
// spreads across the sea with dark water between the wisps (about half the
// waterline), not one strip. Each faces the 01 camera (`face`, world [x, z])
// and sits behind the Clock Tower, ferry and junk there. `u` takes a section
// of the band (share of its length) so a short wisp keeps a natural shape;
// its cut ends fade over `feather`. Their own level (`seaMist` in
// chapters.js) is 01 only, gone early in the move to 02.
export const SEA_MIST = {
  face: [-13, 99.5],
  feather: 0.25,
  // A little milder than the shore drifts: farther from the city's light.
  tint: { low: [1.3, 0.82, 0.6], high: [0.9, 0.74, 0.88] },
  cards: [
    // Left of the Clock Tower.
    { x: -290, z: -420, width: 76, band: 'broad', u: [0.08, 0.5], opacity: 0.24 },
    // Between the Clock Tower and the ferry: the fullest bank.
    { x: -138, z: -350, width: 71, band: 'billow', u: [0.55, 0.95], opacity: 0.22 },
    // Between the ferry and the junk, farther out.
    { x: 34, z: -550, width: 79, band: 'low', u: [0.3, 0.75], opacity: 0.24 },
    // Right of IFC, toward the Central piers.
    { x: 278, z: -500, width: 102, band: 'broad', u: [0.5, 0.95], opacity: 0.22 },
  ],
};

// Firework bursts over 06 (ATMOSPHERE-EFFECTS-BRIEF.md 6.7). One shared
// gold-and-white burst (docs/ASSET-LEDGER.md); `core` is its glowing centre
// and `reach` the radius holding 98% of its sparks, both in image pixels.
// Each burst's screen place, size, role and variation are `bursts` in
// chapter 06 of chapters.js.
export const BURST_SHEET = {
  url: 'atmosphere/firework-burst.webp',
  size: [768, 692],
  core: [394, 384],
  reach: 345,
};

// The firework smoke sheet (docs/ASSET-LEDGER.md): four puffs, given as
// pixel rects [x0, y0, x1, y1] of the 1200 × 600 image. The grey one is
// unused (the brief wants violet and coral smoke); the coral one's tail
// crosses the split row, so every wisp feathers its edges.
export const SMOKE_SHEET = {
  url: 'atmosphere/firework-smoke.webp',
  size: [1200, 600],
  cells: { violet: [0, 0, 600, 314], coral: [600, 0, 1200, 314], lavender: [0, 314, 600, 600] },
};

// Burst colours (user choice, 2026-10-02): warm keeps the artwork's own
// gold; the others are recoloured by brightness, the hottest spark centres
// staying near white. `sparks` colours the falling sparks and rockets the
// same way. `halo`: the small glow at each burst's centre, its radius as a
// share of the reach and its strength.
//
// The show (user choices, 2026-10-02): a fixed `loop` in seconds; each
// burst fires at its own `at` (chapters.js). Entering 06 starts the loop at
// `entry`, and reduced motion holds the moment `still`: composed moments
// with the lead burst open, a pair igniting and no rocket mid-climb (a
// frozen rocket reads as a stray streak). Times in seconds; distances in
// shares of a burst's reach.
export const FIREWORKS = {
  colors: { warm: null, coral: 0xff7a8a, cyan: 0x7fe3f0 },
  sparkColors: { warm: 0xffc870, coral: 0xff7a8a, cyan: 0x7fe3f0 },
  halo: { radius: 0.22, strength: 0.7 },
  loop: 8,
  entry: 1.5,
  still: 1.6,
  // Rise time, longer for higher bursts; the trail: points, and its length
  // as a share of the climb at full speed (it shortens as the rocket slows).
  rocket: { duration: [0.7, 1], trail: 24, length: 0.12 },
  // Opens from `startScale` over `reveal` (fade in) and `open` (to full
  // size), then fades over `fade` while sinking `sink` and cooling.
  card: { startScale: 0.7, reveal: 0.25, open: 1, fade: 2, sink: 0.06, flare: 1.5 },
  // Falling sparks shed from each burst's tips: per burst, by screen.
  sparks: {
    count: { desktop: 40, mobile: 25 },
    start: [0.55, 0.95], // radius where they appear
    delay: [0.25, 0.7], // after ignition
    life: [1.5, 3],
    speed: [0.15, 0.35], // outward, slowing
    drag: 1.2,
    gravity: 0.35,
    tail: 10, // points per spark, so each falls as a short streak
    tailSpacing: 0.018, // seconds between them
  },
  // Point sizes as shares of the frame height; sparks' brightness.
  size: { spark: 0.0045, rocket: 0.0045 },
  sparkGain: 1.6,
  // Smoke left by a burst (`smoke` in chapters.js): it gathers `delay`
  // after ignition over `fadeIn`, then swells from `grow[0]` to `grow[1]`
  // of its size, drifts with the wind (`drift`: shares of its width right
  // and up over its life) and is gone after `life`.
  smoke: { delay: 0.6, fadeIn: 1.2, life: 5, grow: [0.8, 1.2], drift: [0.08, 0.04] },
};
