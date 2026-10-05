// Scene 03 owns the Star Ferry composition and its story interactions.
// Keep shared camera, vessel, water and copy engines in their existing files;
// this module contains only the values that are specific to this chapter.

export const SCENE_03_CHAPTER = {
  camera: {
    desktop: { position: [77.6, 2.2, -323], target: [40.2, 50.7, -718.3], fov: 56.9 },
    mobile: { position: [-31.2, 1.8, -218.1], target: [41.8, 112.7, -595.4], fov: 80.1, via: [[60, 3, -300]] },
  },
  // Label and title at top-left. The route line lives on the departure board.
  copy: {
    desktop: { left: 5, top: 11, right: 42, bottom: 40 },
    mobile: { left: 8, top: 9, right: 92, bottom: 37 },
  },
  // Long enough for the route dot to cross while the camera holds.
  dwell: 60,
  visibility: {
    desktop: { ferry: 1, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 0, petals: 0.3, city: 0.4, mist: 0.8, seaMist: 0, haze: 1, searchlights: 0, buoy: 1, lens: 1 },
    mobile: { ferry: 1, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 0, petals: 0.3, city: 0.4, mist: 0.8, seaMist: 0, haze: 1, searchlights: 0, buoy: 1, lens: 1 },
  },
  fogDensity: 0.00045,
  // The ferry holds during 03, then the shared route carries it toward 04.
  vessels: {
    desktop: { ferry: [69.3, -359.1, 1.26], junk: [59.5, -400.6, 0.46], via: { ferry: [[91.5, -381.5, 1.125]] }, drift: { ferry: [0, 0] } },
    mobile: { ferry: [-29, -252.3, 1], junk: [160, -430, 0.5], via: { ferry: [[8, -318, 1]] }, drift: { ferry: [0, 0] } },
  },
  probes: {
    desktop: {
      ferry: { left: 0, right: 60, top: 24, bottom: 78 },
      ifc: { left: 82, right: 87, top: 12 },
      wheel: { left: 74, right: 78 },
      horizon: 62,
    },
    mobile: {
      ferry: { left: 0, right: 66, top: 52, bottom: 72 },
      ifc: { left: 83, right: 94, top: 46 },
      wheel: { left: 76, right: 82 },
      horizon: 66,
    },
  },
};

// Scroll-linked board, ticket and route timing.
export const SCENE_03_CROSSING = {
  // `opening` is chapter progress on approach; the remaining reveal ranges
  // are shares of Scene 03's dwell.
  reveal: {
    opening: [0.38, 0.5],
    board: [0.08, 0.18],
    ticket: [0.22, 0.36],
  },
  // The dot and the minutes share most of the hold, in even stretches.
  // Each quarter is one reading: 3 MIN, 2 MIN, 1 MIN, ARRIVING.
  route: [0.1, 0.96],
  dark: 0.7,
  due: [0.25, 0.5, 0.75],
  flip: 0.2,
};

export const SCENE_03_BOARD = {
  destination: 'CENTRAL',
  due: ['   3 MIN', '   2 MIN', '   1 MIN', 'ARRIVING'],
  characters: 'ABCDEFGHIJKLMNOPRSTUVWXYZ0123456789',
  tickMs: 55,
};

export const SCENE_03_TICKET = {
  tapSeconds: 1,
};

export const SCENE_03_BUOY = {
  desktop: { ahead: 20, side: 5.8, scale: 1 },
  mobile: { ahead: 4.6, side: -1.5, scale: 0.45 },
  colour: 0x4a1f1c,
  rim: [0x8fa6d8, 0.25],
  heave: [0.07, 0.7],
  roll: [0.035, 0.55],
  pitch: [0.025, 0.8],
};
