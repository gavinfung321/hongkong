// The chapter collection. Scene-specific configuration is progressively kept
// in src/story/sceneNN/config.js and assembled here for the shared engines.
//
// camera:      position / target in world metres, vertical fov in degrees.
//              Optional via: [[x, y, z], ...] waypoints the camera passes on
//              the way to the next chapter (to route around the tower). The
//              camera keeps an even pace by distance through them; the look
//              turns with distance too, or by viaTurn: [f, ...], the share of
//              the turn done at each waypoint.
//              Chapter 01 only: holdDolly, the opening push. It starts half a
//              vector back at the top of the page and passes the authored
//              pose at the keyframe.
//              Desktop only: parallax, a multiplier on the mouse parallax
//              swing for this hold (omitted = 1). At the mouse extremes a
//              subject may drift up to ±6% from its composition target.
//              Desktop only: keepHeight: true keeps the vertical fov on windows
//              narrower than 1.6 (the sides are trimmed instead of the fov
//              widening), so a tall subject keeps its size.
// copy:        copy-safe region as % of the viewport (left / top / right / bottom).
// dwell:       optional extra scroll, in svh, at this chapter's keyframe. The
//              camera stays on the hold pose through it while the chapter's
//              story plays out one layer at a time (copyLayer.js).
// visibility:  1 = shown, 0 = gated (faded out) at this chapter's hold pose.
//              petals is a density (omitted = 1); city is the skyline
//              windows' level (omitted = 1); accents dims the LED crowns,
//              strips and landmarks further (omitted = 1); reflections
//              scales the fixed lights' water columns (omitted = 1).
// vessels:     [x, z, heading] world position of each vessel at this chapter's
//              hold pose, per breakpoint (mobile is re-authored, not cropped).
//              Optional via: { ferry: [[x, z, heading], ...] }, points a vessel
//              passes on the way to the next chapter. Optional drift:
//              { ferry: [before, after] }, the metres it sails along its
//              heading through this hold, up to and on from the keyframe
//              (vesselRoutes.js).
// probes:      composition targets (% of viewport) checked by the debug probe.

import { SCENE_01_CHAPTER } from '../story/scene01/config.js';
import { SCENE_02_CHAPTER } from '../story/scene02/config.js';
import { SCENE_03_CHAPTER } from '../story/scene03/config.js';
import { SCENE_04_CHAPTER } from '../story/scene04/config.js';
import { SCENE_05_CHAPTER } from '../story/scene05/config.js';

export { HERO } from '../story/scene01/config.js';

const SB = '/docs/storyboards';

export const SCROLL = {
  chapterLength: 150, // svh per chapter
  hold: 0.14, // fraction of a segment held still on each side of a keyframe
  copyFull: 0.14, // copy fully visible within this distance of a keyframe (= hold)
  copyFade: 0.05, // then fades out before the camera has moved far
  damping: 5,
  // A jump of this many chapters or more snaps behind the veil; 0.9 so a jump
  // to the next chapter (exactly 1) does too (transition review, 2026-10-03).
  jumpThreshold: 0.9,
  // Links and reloads land this share into a chapter's dwell, once its title
  // (and in 02 the print) are in (copyLayer.js).
  dwellLand: 0.24,
};

export const chapters = [
  SCENE_01_CHAPTER,
  SCENE_02_CHAPTER,
  {
    id: '03',
    slug: 'across-the-water',
    title: 'Across the Water',
    storyboard: {
      desktop: `${SB}/frame-03-across-the-water-rough.png`,
      mobile: `${SB}/frame-03-across-the-water-mobile-rough.png`,
    },
    ...SCENE_03_CHAPTER,
  },
  {
    id: '04',
    slug: 'red-sails',
    title: 'Red Sails',
    storyboard: {
      desktop: `${SB}/frame-04-red-sails-rough.png`,
      mobile: `${SB}/frame-04-red-sails-mobile-rough.png`,
    },
    ...SCENE_04_CHAPTER,
  },
  {
    id: '05',
    slug: 'city-of-light',
    title: 'City of Light',
    storyboard: {
      desktop: `${SB}/frame-05-city-of-light-rough.png`,
      mobile: `${SB}/frame-05-city-of-light-mobile-rough.png`,
    },
    ...SCENE_05_CHAPTER,
  },
  {
    id: '06',
    slug: 'afterglow',
    title: 'Afterglow',
    storyboard: {
      desktop: `${SB}/frame-06-afterglow-departure-rough.png`,
      mobile: `${SB}/frame-06-afterglow-departure-mobile-rough.png`,
    },
    camera: {
      desktop: { position: [271.8, 32.7, -467.7], target: [299.2, 263.7, -793.2], fov: 54.7, parallax: 1.8 },
      mobile: { position: [447.2, 57.1, -365.3], target: [434.4, 277.9, -698.6], fov: 63 },
    },
    copy: {
      desktop: { left: 5, top: 12, right: 38, bottom: 62 },
      mobile: { left: 6, top: 9, right: 66, bottom: 35 },
    },
    visibility: {
      // city: the towers around IFC stay at 60%, as in 05 (user request, 2026-10-02);
      // accents stay at 05's quarter so IFC's crown leads (user choice, 2026-10-03).
      // moon 0.5, so the fireworks lead (Priority 3 balance, user choice, 2026-10-04).
      desktop: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 1, petals: 0, city: 0.6, accents: 0.25, mist: 0.15, seaMist: 0, searchlights: 0, moon: 0.5 },
      mobile: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bush: 0, bursts: 1, petals: 0, city: 0.6, accents: 0.25, mist: 0.15, seaMist: 0, searchlights: 0, moon: 0.5 },
    },
    fogDensity: 0.00036,
    vessels: {
      desktop: { ferry: [135, -450, 1], junk: [240, -530, 0.24] },
      mobile: { ferry: [50, -390, 1], junk: [240, -530, 0.24] },
    },
    // Firework bursts (createFireworks.js): x / y, the burst's centre in % of
    // the viewport; size, its spark spread in % of the viewport width;
    // strength, its opacity at full `bursts` level. rotate (degrees), mirror
    // and squash (height share) vary the one shared artwork so no two match;
    // at: when it bursts in the 8 s loop (FIREWORKS in atmosphere.js), its
    // rocket rising just before. Two quick pairs, never all at once; two to
    // four bursts live at any moment (user choice, 2026-10-02).
    // Eight on desktop, six on phones, about 35% bigger than the first four
    // (user request, 2026-10-02), all kept right of and below the copy and
    // above IFC's crown. Phones: two dominant bursts, three supporting, one
    // fading remnant (user choice, 2026-10-02: the remnant at about 35%).
    // Palette as in the storyboard (user choice, 2026-10-03): a warm-white
    // hero in each half of the loop, coral-pink support, one small cyan
    // accent; nothing in the dark left and left-centre kept for the copy.
    bursts: {
      desktop: [
        { x: 84, y: 25, size: 30, color: 'warm', strength: 1, rotate: 0, at: 0 },
        { x: 62, y: 28, size: 22, color: 'coral', strength: 0.9, rotate: 140, mirror: true, at: 1 },
        { x: 76, y: 48, size: 11, color: 'cyan', strength: 0.7, rotate: 250, squash: 0.9, at: 1.25 },
        { x: 92, y: 54, size: 13.5, color: 'coral', strength: 0.75, rotate: 60, mirror: true, squash: 0.92, at: 2.5 },
        { x: 56, y: 14, size: 18, color: 'coral', strength: 0.85, rotate: 200, squash: 0.94, at: 3.6 },
        { x: 72, y: 22, size: 26, color: 'warm', strength: 1, rotate: 110, mirror: true, at: 4.8 },
        { x: 92, y: 12, size: 18, color: 'coral', strength: 0.8, rotate: 315, squash: 0.9, at: 5.05 },
        { x: 60, y: 42, size: 12, color: 'coral', strength: 0.65, rotate: 30, mirror: true, squash: 0.95, at: 6.4 },
        // Left-centre support under the copy, smaller and fainter than the
        // right (user request, 2026-10-03: the left read as empty).
        { x: 22, y: 48, size: 13, color: 'coral', strength: 0.7, rotate: 170, squash: 0.93, at: 2.2 },
        { x: 36, y: 36, size: 10, color: 'warm', strength: 0.65, rotate: 290, mirror: true, at: 5.8 },
      ],
      // Phones: the two warm heroes sit right of the copy's edge (66%), smaller
      // (Priority 3 balance, user choice, 2026-10-04: they ran over its last words).
      mobile: [
        { x: 88, y: 27, size: 38, color: 'warm', strength: 1, rotate: 20, at: 0 },
        { x: 54, y: 42, size: 35, color: 'coral', strength: 1, rotate: 150, mirror: true, at: 1.4 },
        { x: 88, y: 44, size: 16, color: 'cyan', strength: 0.6, rotate: 260, squash: 0.9, at: 2.8 },
        { x: 90, y: 57, size: 24, color: 'coral', strength: 0.35, rotate: 75, mirror: true, squash: 0.92, at: 6 },
        { x: 62, y: 58, size: 24, color: 'coral', strength: 0.85, rotate: 200, squash: 0.94, at: 3.05 },
        { x: 84, y: 30, size: 34, color: 'warm', strength: 1, rotate: 110, mirror: true, at: 4.6 },
        { x: 26, y: 52, size: 22, color: 'coral', strength: 0.7, rotate: 170, squash: 0.93, at: 2 },
      ],
    },
    // Smoke left behind by the biggest bursts (createFireworks.js), drawn
    // behind every burst: burst, the index above; cell, the puff on the
    // smoke sheet; size, its width in % of the viewport width; dx / dy, its
    // centre's offset from the burst in % of the viewport; opacity at its
    // fullest. Three on desktop, two on phones, all clear of the copy
    // (ATMOSPHERE-EFFECTS-BRIEF.md 6.7; user request, 2026-10-02).
    smoke: {
      desktop: [
        { burst: 0, cell: 'coral', size: 30, dx: 3, dy: 11, opacity: 0.105 },
        { burst: 1, cell: 'violet', size: 22, dx: -3, dy: 10, opacity: 0.1 },
        { burst: 3, cell: 'lavender', size: 16, dx: -2, dy: 7, opacity: 0.09 },
        { burst: 8, cell: 'lavender', size: 16, dx: 2, dy: 7, opacity: 0.09 },
      ],
      mobile: [
        { burst: 0, cell: 'coral', size: 46, dx: -2, dy: 8, opacity: 0.105 },
        { burst: 4, cell: 'lavender', size: 34, dx: 2, dy: 8, opacity: 0.1 },
      ],
    },
    probes: {
      desktop: {
        ifc: { left: 61, right: 67, top: 66 },
        wheel: { offscreen: true },
        horizon: { min: 104 },
      },
      mobile: {
        ifc: { left: 62, right: 75, top: 67 },
        wheel: { offscreen: true },
        horizon: { min: 104 },
      },
    },
  },
];
