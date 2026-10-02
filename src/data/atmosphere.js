// Sky atmosphere: distant cloud cards (user choice, 2026-10-02; see
// docs/ATMOSPHERE-EFFECTS-BRIEF.md 6.1). How strongly they show per chapter
// is the `clouds` visibility value in chapters.js.

// The generated coral cloud sheet (docs/ASSET-LEDGER.md): three bands, given
// as pixel rows of the 1600 × 534 image. The lower two touch, so every card
// feathers its edges.
export const CLOUD_SHEET = {
  url: 'atmosphere/coral-clouds.webp',
  size: [1600, 534],
  bands: { tall: [0, 226], thin: [226, 376], low: [376, 534] },
};

// Each card is authored on screen at one chapter's hold pose, then lives in
// the world `distance` metres out, so other chapters see it where it really
// is and the ridge and towers hide its lower edge. x / y: % of the viewport
// for the card's centre; width: % of the viewport width; opacity: at a
// chapter's full `clouds` level; drift: the slow sideways sway, as a share of
// the card's width.
export const CLOUDS = {
  distance: 3000,
  drift: { share: 0.012, period: [110, 150] },
  cards: {
    desktop: [
      // 01: a coral band over the far range between the Clock Tower and the
      // moon, clear of the copy and the tower's crown.
      { chapter: 0, band: 'tall', x: 47, y: 15, width: 36, opacity: 0.2 },
      // 01: a thinner trace high on the right, above IFC.
      { chapter: 0, band: 'thin', x: 88, y: 6, width: 38, opacity: 0.14 },
      // 02, 04 and 05 each fill their own empty side of the sky (user
      // choice, 2026-10-02); the opacities allow for the chapters' fade.
      // 02: low over the right-hand ridge, below the copy, above the ferry.
      { chapter: 1, band: 'low', x: 72, y: 52, width: 50, opacity: 0.18 },
      // 04: above the low mountains on the left, below the copy.
      { chapter: 3, band: 'thin', x: 22, y: 34, width: 40, opacity: 0.2 },
      // 05: between the copy and Bank of China's mast.
      { chapter: 4, band: 'thin', x: 22, y: 33, width: 40, opacity: 0.2 },
      // 06: a dim band beneath the fireworks, above the moon and ridge.
      { chapter: 5, band: 'low', x: 42, y: 60, width: 80, opacity: 0.15 },
    ],
    mobile: [
      { chapter: 0, band: 'tall', x: 40, y: 43, width: 150, opacity: 0.12 },
      // 06: above IFC's crown, below the fireworks.
      { chapter: 5, band: 'low', x: 45, y: 57, width: 170, opacity: 0.12 },
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
