// Scene 01 owns the opening harbour composition and the 香港 hero wordmark.
// Keep shared camera, atmosphere, vessel and copy engines in their existing
// files; this module contains only values authored specifically for Scene 01.

const STORYBOARDS = '/docs/storyboards';

// The 香港 wordmark is fixed in the world while the opening camera glides
// toward it. Screen-relative placement values are percentages of the viewport.
export const HERO = {
  wordmark: {
    text: '香港',
    // Desktop floats beyond the railing below the horizon. Mobile occupies
    // the open sky between the copy and moon. Short-screen clearances prevent
    // either version from colliding with the chapter copy.
    desktop: { x: 50, foot: 74, width: 60, depth: 16 },
    desktopShort: { clear: 14, maxFoot: 84 },
    mobile: { x: 50, foot: 42, width: 78, depth: 25, fadeEnd: 0.8, clear: 14, maxFoot: 48 },
  },
  leaveEnd: 0.2,
  // Fractions of the way to leaveEnd: hold the wordmark, then fade it as the
  // camera moves into the first chapter hold.
  fadeStart: 0.15,
  fadeEnd: 0.9,
  glide: { back: 6, rise: 0.6, duration: 2.4 },
};

export const SCENE_01_CHAPTER = {
  id: '01',
  slug: 'harbour-at-dusk',
  title: 'Harbour at Dusk',
  storyboard: {
    desktop: `${STORYBOARDS}/frame-01-harbour-at-dusk-rough.png`,
    mobile: `${STORYBOARDS}/frame-01-harbour-at-dusk-mobile-rough.png`,
  },
  camera: {
    desktop: {
      position: [-13, 5.9, 99.5],
      target: [-2.4, 30.5, -299.6],
      fov: 41.5,
      holdDolly: [0, 0, -10],
      via: [[-50, 7, 58]],
    },
    mobile: { position: [-43.1, 9, 99], target: [7.6, 121.5, -281.4], fov: 77.7, holdDolly: [1.3, 0, -9.9] },
  },
  copy: {
    desktop: { left: 5, top: 8.5, right: 36, bottom: 34 },
    mobile: { left: 8, top: 9, right: 92, bottom: 39 },
  },
  visibility: {
    // Desktop keeps the foreground framing and searchlights. Mobile opens the
    // water to the lower edge and uses palms at the Clock Tower's foot.
    desktop: { ferry: 1, junk: 1, ifc: 1, wheel: 1, deck: 1, railing: 1, palms: 0, bauhinia: 1, bush: 1, bursts: 0, petals: 0.8, city: 0.75, mist: 0, seaMist: 1, haze: 0.5, searchlights: 0.6, moon: 0.75, junkGlow: 0.5 },
    mobile: { ferry: 0, junk: 1, ifc: 1, wheel: 1, deck: 0, railing: 0, palms: 1, bauhinia: 0, bush: 0, bursts: 0, petals: 0.8, city: 0.75, mist: 0.6, seaMist: 1, haze: 0.5, searchlights: 0, moon: 0.75, junkGlow: 0.5 },
  },
  fogDensity: 0.00045,
  vessels: {
    desktop: { ferry: [-29.2, -103.6, 0], junk: [26.1, -53.1, 0] },
    mobile: { ferry: [-19.7, -89.9, 0], junk: [-18.1, -23.2, 0] },
  },
  probes: {
    desktop: {
      tower: { left: 9, right: 17, top: 3, bottom: 60 },
      ferry: { left: 33, right: 49, bottom: 64 },
      junk: { left: 61, right: 77, bottom: 64 },
      ifc: { left: 79, right: 83, top: 18 },
      wheel: { left: 71.4, right: 74.6, bottom: 56 },
      horizon: 57.5,
    },
    mobile: {
      tower: { left: 5, right: 19, top: 42, bottom: 72 },
      junk: { left: 44, right: 75, bottom: 74 },
      ifc: { left: 81, right: 89, top: 46 },
      wheel: { left: 73, right: 79, bottom: 70 },
      horizon: 70,
    },
  },
};
