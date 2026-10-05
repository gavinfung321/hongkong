import { WORLD } from '../../data/world.js';

const STORYBOARDS = '/docs/storyboards';

// Scene 02's complete chapter composition. Keeping it beside the scene's
// story-layer settings makes future work on this chapter a one-file start.
export const SCENE_02_CHAPTER = {
  id: '02',
  slug: 'kowloon-edge',
  title: 'The Kowloon Edge',
  storyboard: {
    desktop: `${STORYBOARDS}/frame-02-kowloon-edge-rough.png`,
    mobile: `${STORYBOARDS}/frame-02-kowloon-edge-mobile-rough.png`,
  },
  camera: {
    desktop: {
      position: [-81.6, 6.5, 33],
      target: [196.2, 137.9, -223],
      fov: 61.4,
      keepHeight: true,
      via: [[-28, 7, 37], [5, 5, -90]],
      viaTurn: [0.4, 0.7],
    },
    mobile: {
      position: [-59.6, 4.8, 108.2],
      target: [-59.1, 82.8, -284.1],
      fov: 36.6,
      via: [[-44, 8, 90], [-24, 6, -35]],
    },
  },
  copy: {
    desktop: { left: 50, top: 11, right: 97, bottom: 82 },
    mobile: { left: 8, top: 7.5, right: 92, bottom: 30 },
  },
  dwell: 80,
  visibility: {
    desktop: { ferry: 1, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 1, palms: 1, bauhinia: 0, bush: 0, bursts: 0, city: 0.6, slopeLights: 0.7, mist: 0.5, seaMist: 0, haze: 0.8, searchlights: 0, afterglow: 1 },
    mobile: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 1, palms: 1, bauhinia: 0, bush: 0, bursts: 0, city: 0.35, slopeLights: 0.5, mist: 0.2, seaMist: 0, haze: 0.8, searchlights: 0, afterglow: 1 },
  },
  fogDensity: 0.00045,
  vessels: {
    desktop: { ferry: [-1.4, 5.3, -0.2], junk: [120, -80, 0] },
    mobile: { ferry: [20, -120, 0.8], junk: [120, -80, 0] },
  },
  probes: {
    desktop: {
      tower: { left: 16, right: 34, top: 3, bottom: 88 },
      ferry: { left: 60, right: 84, top: 71, bottom: 87 },
      ifc: { offscreen: true, behind: 'tower' },
      wheel: { offscreen: true, behind: 'tower' },
      horizon: 80,
    },
    mobile: {
      tower: { left: 33, right: 64, top: 20, bottom: 82 },
      ifc: { offscreen: true, behind: 'tower' },
      wheel: { offscreen: true, behind: 'tower' },
      horizon: 80,
    },
  },
};

// x: the column's centre; foot: where the numerals start; height: their
// length up the screen (% of viewport height).
export const SCENE_02_GHOST = {
  text: '1915',
  font: 'fonts/cormorant-garamond-latin-600.woff2',
  colour: 0xf3e9d2,
  ultrawide: { x: 89, foot: 60, height: 50, depth: 3200, opacity: 0.12 },
  standard: { x: 89, foot: 59, height: 48, depth: 3200, opacity: 0.12 },
  compact: { x: 89, foot: 57, height: 42, depth: 3200, opacity: 0.12 },
  mobile: { x: 74, foot: 62, height: 22, depth: 420, opacity: 0.2 },
};

// Desktop scene-02 composition. Percentages are viewport shares.
export const SCENE_02_LAYOUT = {
  towerGap: 15,
  copyLeft: [40, 52],
  copyWidth: 44,
  copyRight: 80,
  ghostGap: 1.5,
  ghostRight: 98,
};

const LAMP_Y = 6.3;
const lampSwarms = (count, size, box) =>
  WORLD.foreground.lamps.map(([x, , z]) => ({ at: [x, LAMP_Y, z], box, count, size, spare: 0.25 }));

// Warm motes authored around the tower, promenade lamps, and lens.
export const SCENE_02_DUST = {
  colour: [1, 0.84, 0.6],
  rise: [0.08, 0.22],
  desktop: [
    { ahead: 22, lift: 4, box: [34, 16, 24], count: 110, size: 0.2, spare: 0.3 },
    { at: [-62, 6.5, -9], box: [14, 10, 8], count: 50, size: 0.26, gain: 1.2, spare: 0.3 },
    ...lampSwarms(12, 0.17, [3.5, 3, 3.5]),
    { ahead: 5.5, lift: 0.5, box: [7, 4, 3], count: 7, size: 0.22, gain: 0.4, near: true },
  ],
  mobile: [
    { ahead: 70, lift: 10, box: [30, 26, 50], count: 55, size: 0.5, spare: 0.3 },
    { at: [-60, 9, -9], box: [18, 14, 12], count: 24, size: 0.45, spare: 0.3 },
    ...lampSwarms(6, 0.4, [5, 4, 5]),
    { ahead: 5, lift: 0.4, box: [3.5, 5, 3], count: 5, size: 0.2, gain: 0.4, near: true },
  ],
};

export const SCENE_02_STIR = { radius: 0.28, push: 0.07, carry: 0.05 };

// Railway-steam cards crossing the foot of the tower.
export const SCENE_02_STEAM = {
  band: 'billow',
  colour: 0xfff0dc,
  opacity: 0.75,
  stretch: 3,
  period: 46,
  travel: 0.3,
  feather: [0.3, 0.2],
  desktop: [
    { x: 22, y: 84, width: 46, depth: 38, phase: 0 },
    { x: 34, y: 86, width: 40, depth: 42, phase: 0.5, mirror: true },
  ],
  mobile: [
    { x: 40, y: 83, width: 110, depth: 112, phase: 0 },
    { x: 60, y: 87, width: 90, depth: 118, phase: 0.5, mirror: true },
  ],
};
