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
// 6.2): one belt of upright cards on the water just off the island's
// waterfront, facing Kowloon, so it parts the water from the podiums and the
// skyline in every chapter that looks across. Boats, the Clock Tower and the
// junk stand in front of it. x / z: card centre in world metres; width in
// metres (height follows the band's shape); opacity at a chapter's full
// `mist` level. The lower bands sit in front of the wheel and IFC's podium.
export const MIST = {
  drift: { share: 0.008, period: [90, 130] },
  cards: [
    { x: -830, z: -1050, width: 520, band: 'flat', opacity: 0.3 },
    { x: -390, z: -1035, width: 560, band: 'broad', opacity: 0.3 },
    { x: 60, z: -1050, width: 520, band: 'flat', opacity: 0.3 },
    { x: 470, z: -1030, width: 480, band: 'low', opacity: 0.3 },
    { x: 900, z: -1045, width: 560, band: 'broad', opacity: 0.3 },
    { x: 1310, z: -1035, width: 440, band: 'flat', opacity: 0.3 },
  ],
};
