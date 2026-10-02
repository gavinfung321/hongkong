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
