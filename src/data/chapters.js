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
import { SCENE_06_CHAPTER } from '../story/scene06/config.js';

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
    ...SCENE_06_CHAPTER,
  },
];
