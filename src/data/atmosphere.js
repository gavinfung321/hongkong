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
      // 02: a roof across the top, lit banks right of the tower below the
      // copy and over the right-hand ridge, traces left above the moon and
      // between the tower and the palms.
      { chapter: 1, layer: 'back', band: 'tall', x: 75, y: 8, width: 70, opacity: 0.55 },
      { chapter: 1, layer: 'back', band: 'tall', u: [1, 0.4], x: 15, y: 14, width: 45, opacity: 0.55 },
      { chapter: 1, layer: 'back', band: 'low', x: 75, y: 42, width: 70, opacity: 0.5 },
      { chapter: 1, layer: 'front', band: 'tall', u: [0.5, 1], x: 84, y: 30, width: 36, opacity: 0.65 },
      { chapter: 1, layer: 'front', band: 'low', x: 70, y: 53, width: 46, opacity: 0.6 },
      { chapter: 1, layer: 'front', band: 'thin', u: [0, 0.6], x: 8, y: 28, width: 26, opacity: 0.6 },
      { chapter: 1, layer: 'front', band: 'thin', u: [0.2, 0.9], x: 42, y: 36, width: 22, opacity: 0.55 },
      // 03: a roof above the moon, lit banks between the copy and the moon,
      // above IFC and above the copy.
      { chapter: 2, layer: 'back', band: 'tall', x: 58, y: 8, width: 80, opacity: 0.55 },
      { chapter: 2, layer: 'back', band: 'low', u: [1, 0], x: 22, y: 32, width: 50, opacity: 0.5 },
      { chapter: 2, layer: 'front', band: 'thin', u: [0, 0.7], x: 44, y: 18, width: 32, opacity: 0.65 },
      { chapter: 2, layer: 'front', band: 'low', u: [0.3, 1], x: 92, y: 6, width: 25, opacity: 0.6 },
      { chapter: 2, layer: 'front', band: 'thin', u: [1, 0.3], x: 18, y: 3, width: 30, opacity: 0.55 },
      // 04: a roof over the sails, banks left above the low mountains, above
      // the copy and between the masts.
      { chapter: 3, layer: 'back', band: 'tall', x: 55, y: 7, width: 90, opacity: 0.55 },
      { chapter: 3, layer: 'back', band: 'tall', u: [0.4, 1], x: 18, y: 40, width: 36, opacity: 0.5 },
      { chapter: 3, layer: 'front', band: 'thin', x: 22, y: 32, width: 46, opacity: 0.65 },
      { chapter: 3, layer: 'front', band: 'low', u: [0, 0.55], x: 70, y: 8, width: 30, opacity: 0.6 },
      { chapter: 3, layer: 'front', band: 'low', u: [1, 0.5], x: 22, y: 4, width: 30, opacity: 0.55 },
      // 05: dimmer, so IFC leads: a roof either side of its crown, banks
      // between the copy and Bank of China's mast and among the towers.
      { chapter: 4, layer: 'back', band: 'tall', x: 30, y: 8, width: 64, opacity: 0.4 },
      { chapter: 4, layer: 'back', band: 'tall', u: [0.5, 1], x: 88, y: 12, width: 30, opacity: 0.4 },
      { chapter: 4, layer: 'back', band: 'low', x: 50, y: 40, width: 100, opacity: 0.35 },
      { chapter: 4, layer: 'front', band: 'thin', x: 22, y: 32, width: 38, opacity: 0.45 },
      { chapter: 4, layer: 'front', band: 'low', u: [0.5, 1], x: 86, y: 28, width: 26, opacity: 0.45 },
      // 06: the fireworks need dark sky, so a dim roof behind the bursts and
      // lit banks below them, above the moon and ridge.
      { chapter: 5, layer: 'back', band: 'tall', x: 70, y: 7, width: 70, opacity: 0.35 },
      { chapter: 5, layer: 'back', band: 'low', x: 25, y: 45, width: 60, opacity: 0.45 },
      { chapter: 5, layer: 'front', band: 'low', x: 42, y: 64, width: 80, opacity: 0.5 },
      { chapter: 5, layer: 'front', band: 'thin', u: [0.4, 1], x: 87, y: 77, width: 28, opacity: 0.5 },
      { chapter: 5, layer: 'front', band: 'tall', u: [0, 0.45], x: 15, y: 33, width: 28, opacity: 0.5 },
    ],
    mobile: [
      // The phone's sky is tall. 01: one dim deck from the top down to the
      // moon, a small lit bank off-centre left and the bright bank just
      // above the moon; full-width strips at even steps read as stripes
      // (user choice, 2026-10-03).
      { chapter: 0, layer: 'back', band: 'tall', u: [0.15, 0.5], x: 50, y: 22, width: 190, opacity: 0.5 },
      { chapter: 0, layer: 'front', band: 'low', u: [0, 0.45], x: 22, y: 25, width: 70, opacity: 0.5 },
      { chapter: 0, layer: 'front', band: 'tall', u: [0.1, 0.65], x: 45, y: 42, width: 150, opacity: 0.6 },
      { chapter: 1, layer: 'back', band: 'tall', x: 50, y: 8, width: 200, opacity: 0.5 },
      { chapter: 1, layer: 'back', band: 'tall', u: [0.2, 0.8], x: 50, y: 34, width: 170, opacity: 0.45 },
      { chapter: 1, layer: 'back', band: 'low', u: [1, 0], x: 50, y: 46, width: 180, opacity: 0.45 },
      { chapter: 1, layer: 'front', band: 'low', u: [0.4, 1], x: 80, y: 33, width: 110, opacity: 0.55 },
      { chapter: 1, layer: 'front', band: 'thin', u: [0, 0.6], x: 15, y: 30, width: 90, opacity: 0.55 },
      { chapter: 2, layer: 'back', band: 'low', x: 50, y: 5, width: 200, opacity: 0.45 },
      { chapter: 2, layer: 'back', band: 'tall', u: [0.1, 0.8], x: 50, y: 30, width: 170, opacity: 0.5 },
      { chapter: 2, layer: 'front', band: 'low', u: [0, 0.5], x: 80, y: 28, width: 80, opacity: 0.55 },
      { chapter: 2, layer: 'front', band: 'thin', x: 45, y: 40, width: 150, opacity: 0.55 },
      { chapter: 3, layer: 'back', band: 'low', u: [1, 0], x: 50, y: 5, width: 200, opacity: 0.45 },
      { chapter: 3, layer: 'back', band: 'tall', u: [0.9, 0.2], x: 50, y: 30, width: 170, opacity: 0.5 },
      { chapter: 3, layer: 'front', band: 'low', u: [0.5, 1], x: 75, y: 26, width: 90, opacity: 0.55 },
      { chapter: 3, layer: 'front', band: 'thin', x: 40, y: 36, width: 140, opacity: 0.55 },
      // 05: dimmer, so IFC leads.
      { chapter: 4, layer: 'back', band: 'low', x: 50, y: 5, width: 200, opacity: 0.4 },
      { chapter: 4, layer: 'back', band: 'tall', x: 40, y: 32, width: 180, opacity: 0.4 },
      { chapter: 4, layer: 'front', band: 'thin', u: [0, 0.7], x: 25, y: 30, width: 90, opacity: 0.4 },
      { chapter: 4, layer: 'front', band: 'low', u: [0.4, 1], x: 90, y: 19, width: 60, opacity: 0.4 },
      // 06: one lit bank between the bursts and IFC's crown; the bursts keep
      // dark sky (user request, 2026-10-03: less cloud on phones).
      { chapter: 5, layer: 'front', band: 'low', x: 45, y: 60, width: 170, opacity: 0.4 },
    ],
  },
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
