// Scene 04 owns the Red Sails composition and its progressive then-and-now
// story. Keep shared camera, vessel, copy and card engines in their existing
// files; this module contains only values specific to this chapter.

export const SCENE_04_CHAPTER = {
  // The junk fills more of the frame (user choice, 2026-10-03): a longer
  // lens, desktop about 1.2 times larger, phones with the main sail just
  // under the copy. The move to 05 swings around the junk.
  camera: {
    desktop: { position: [153.4, 3, -419.8], target: [-21.8, 76.8, -773.4], fov: 66, via: [[233.4, 8, -439.8]] },
    mobile: { position: [153.4, 3, -386.1], target: [212.7, 56.6, -773.9], fov: 60, via: [[233.4, 8, -486.1]] },
  },
  // Label and cards occupy the left sky; the statement stays at the foot.
  copy: {
    desktop: { left: 5, top: 11, right: 34, bottom: 76 },
    mobile: { left: 8, top: 9, right: 92, bottom: 37 },
  },
  dwell: 60,
  visibility: {
    desktop: { ferry: 1, junk: 1, ifc: 1, wheel: 0, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 0, petals: 0.3, city: 0.4, mist: 1, seaMist: 0, haze: 0.7, searchlights: 0, lens: 1 },
    mobile: { ferry: 1, junk: 1, ifc: 1, wheel: 0, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 0, petals: 0.3, city: 0.4, mist: 1, seaMist: 0, haze: 0.7, searchlights: 0, moon: 0.6, lens: 1 },
  },
  fogDensity: 0.00063,
  vessels: {
    desktop: { ferry: [106, -397, 1.05], junk: [149.5, -444.6, 0.42] },
    mobile: { ferry: [26, -345, 1], junk: [162.9, -430.5, 0.85] },
  },
  probes: {
    desktop: {
      junk: { left: 35, right: 95, top: 6, bottom: 71 },
      ifc: { left: 96 },
      ferry: { offscreen: true },
      horizon: 63,
    },
    mobile: {
      junk: { left: 11, right: 85, top: 28, bottom: 68 },
      // IFC is a right-edge cue cropped by the frame.
      ifc: { left: 91 },
      ferry: { offscreen: true },
      horizon: 66,
    },
  },
};

// `opening` is chapter progress on approach. The remaining ranges are shares
// of Scene 04's dwell and form a reversible Then → Now → reflection sequence.
export const SCENE_04_STORY = {
  reveal: {
    opening: [0.38, 0.5],
    historical: [0.12, 0.3],
    contemporary: [0.34, 0.52],
    quote: [0.56, 0.68],
    statement: [0.72, 0.86],
  },
  dark: 0.7,
  windAtHistorical: 0.45,
};
