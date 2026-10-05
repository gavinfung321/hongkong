// Scene 05 owns the City of Light composition and its progressive arrival.
// Shared camera, skyline and interaction engines remain in their existing
// files; this module contains only values specific to this chapter.

export const SCENE_05_CHAPTER = {
  // Close to the wheel so perspective makes it IFC's co-star at true scale.
  camera: {
    desktop: { position: [383.3, 16, -917.1], target: [426.6, 255, -1244.9], fov: 82, parallax: 1.8 },
    mobile: { position: [264.4, 46.6, -900.2], target: [449.2, 184.8, -1226.9], fov: 80.2 },
  },
  copy: {
    desktop: { left: 5, top: 11, right: 50, bottom: 37 },
    mobile: { left: 6, top: 9, right: 62, bottom: 44 },
  },
  // A short reading hold; the camera remains on its existing authored pose.
  dwell: 45,
  visibility: {
    desktop: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 0, petals: 0.6, city: 0.6, accents: 0.25, reflections: 2, mist: 0.4, seaMist: 0, searchlights: 1, branch: 1, lens: 1, lensBusy: 1, cloudBand: 1, wave: 1, boat: 1 },
    mobile: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 0, petals: 0.6, city: 0.6, accents: 0.25, reflections: 2, mist: 0.4, seaMist: 0, searchlights: 0.7, branch: 0, lens: 1, lensBusy: 1, cloudBand: 1, wave: 1, boat: 1 },
  },
  fogDensity: 0.00045,
  vessels: {
    desktop: { ferry: [120, -430, 1], junk: [80, -480, 0.24] },
    mobile: { ferry: [40, -370, 1], junk: [80, -480, 0.24] },
  },
  probes: {
    desktop: {
      ifc: { left: 56, right: 67, top: 3, bottom: 91 },
      wheel: { left: 28, right: 42, top: 74, bottom: 95 },
    },
    mobile: {
      ifc: { left: 59, right: 90, top: 6, bottom: 80 },
      wheel: { left: 7, right: 44, top: 65, bottom: 84 },
    },
  },
};

// Label and title use chapter progress on approach. The remaining ranges are
// shares of Scene 05's dwell and remain reversible.
export const SCENE_05_ARRIVAL = {
  reveal: {
    label: [0.34, 0.42],
    title: [0.42, 0.5],
    sweep: [0.02, 0.2],
    body: [0.14, 0.36],
    branch: [0.26, 0.46],
    hint: [0.5, 0.64],
    interaction: [0.6, 0.8],
  },
};

export const SCENE_05_CALLOUTS = {
  wheelTapSeconds: 2.5,
  skylineHit: {
    desktop: { left: 42, right: 96, top: 20, bottom: 76 },
    mobile: { left: 44, right: 96, top: 20, bottom: 72 },
  },
  // Both callouts stay visible. On a phone each dims only while its own
  // target is pressed. On desktop they stay at full strength (user choice,
  // 2026-10-05) and sit close to Two IFC and the wheel.
  positions: {
    desktop: {
      skyline: { x: 71, y: 52, angle: 168 },
      wheel: { x: 32, y: 68, angle: 28 },
    },
    mobile: {
      skyline: { x: 48, y: 48, angle: 8 },
      wheel: { x: 24, y: 58, angle: 78 },
    },
  },
};
