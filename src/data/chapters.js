// The single chapter configuration. Every scroll threshold, camera pose, copy
// region, visibility value, fog value, and composition target lives here.
//
// camera:      position / target in world metres, vertical fov in degrees.
//              Optional via: [[x, y, z], ...] waypoints the camera passes on
//              the way to the next chapter (to route around the tower).
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
// visibility:  1 = shown, 0 = gated (faded out) at this chapter's hold pose.
//              petals is a density (omitted = 1); city is the skyline
//              windows' level (omitted = 1).
// vessels:     [x, z] world position of each vessel at this chapter's hold pose,
//              per breakpoint (mobile is re-authored, not cropped).
// probes:      composition targets (% of viewport) checked by the debug probe.

const SB = '/docs/storyboards';

export const SCROLL = {
  chapterLength: 150, // svh per chapter
  hold: 0.2, // fraction of a segment held still on each side of a keyframe
  copyFull: 0.2, // copy fully visible within this distance of a keyframe (= hold)
  copyFade: 0.05, // then fades out before the camera has moved far
  damping: 5,
  jumpThreshold: 1,
};

// The 香港 wordmark in the hero, authored on screen at chapter 01's opening pose.
// x / foot: % of the viewport where the characters stand on the water.
// width: % of the viewport width. It is drawn in front of everything and moves
// down out of frame from the first scroll until progress sinkEnd (the hero is
// p < 0; chapter 01's hold starts at 0.3), while chapter 01's holdDolly pushes in.
export const HERO = {
  wordmark: {
    text: '香港',
    // Desktop stands on the water, raised over the boats (user request,
    // 2026-10-02); its feet must stay below the horizon (57.5% at the opening
    // pose). Mobile floats in the empty sky between the copy and the moon,
    // 190 m ahead like the water placement it replaced (user request, 2026-10-02).
    desktop: { x: 50, foot: 74, width: 60 },
    mobile: { x: 50, foot: 42, width: 78, depth: 190 },
  },
  sinkEnd: 0.2,
  // Fraction of the sink by which the wordmark and chapter 01's copy have faded.
  fadeEnd: 0.6,
};

export const chapters = [
  {
    id: '01',
    slug: 'harbour-at-dusk',
    title: 'Harbour at Dusk',
    storyboard: {
      desktop: `${SB}/frame-01-harbour-at-dusk-rough.png`,
      mobile: `${SB}/frame-01-harbour-at-dusk-mobile-rough.png`,
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
      desktop: { ferry: 1, junk: 1, ifc: 1, wheel: 1, deck: 1, railing: 1, palms: 0, bauhinia: 1, bursts: 0, clouds: 1, mist: 0.6 },
      // No deck: the mobile storyboard has open water right to the bottom edge.
      mobile: { ferry: 0, junk: 1, ifc: 1, wheel: 1, deck: 0, railing: 0, palms: 0, bauhinia: 0, bursts: 0, clouds: 1, mist: 0.6 },
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
        // IFC sits right of the PNG (70–74) so the junk's sails don't hide it.
        ifc: { left: 79, right: 83, top: 18 },
        wheel: { left: 71.4, right: 74.6, bottom: 56 },
        horizon: 57.5,
      },
      mobile: {
        tower: { left: 5, right: 19, top: 42, bottom: 72 },
        junk: { left: 44, right: 75, bottom: 74 },
        // Right edge 1% wider than the PNG: the rebuilt IFC has the true 57 m width.
        ifc: { left: 81, right: 89, top: 46 },
        wheel: { left: 73, right: 79, bottom: 70 },
        horizon: 70,
      },
    },
  },
  {
    id: '02',
    slug: 'kowloon-edge',
    title: 'The Kowloon Edge',
    storyboard: {
      desktop: `${SB}/frame-02-kowloon-edge-rough.png`,
      mobile: `${SB}/frame-02-kowloon-edge-mobile-rough.png`,
    },
    camera: {
      desktop: {
        position: [-81.6, 6.5, 33],
        target: [196.2, 137.9, -223],
        fov: 61.4,
        keepHeight: true,
        via: [[-28, 7, 22], [5, 5, -90]],
      },
      mobile: {
        position: [-59.6, 4.8, 108.2],
        target: [-59.1, 82.8, -284.1],
        fov: 36.6,
        via: [[-34, 8, 60], [-24, 6, -35]],
      },
    },
    copy: {
      desktop: { left: 50, top: 11, right: 92, bottom: 39 },
      mobile: { left: 8, top: 9, right: 92, bottom: 23 },
    },
    visibility: {
      desktop: { ferry: 1, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 1, palms: 1, bauhinia: 0, bursts: 0, clouds: 0.8, mist: 0.5 },
      mobile: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 1, palms: 1, bauhinia: 0, bursts: 0, clouds: 0.8, mist: 0.5 },
    },
    fogDensity: 0.00045,
    vessels: {
      desktop: { ferry: [-1.4, 5.3, -0.2], junk: [120, -80, 0] },
      mobile: { ferry: [20, -120, 0.8], junk: [120, -80, 0] },
    },
    probes: {
      desktop: {
        // keepHeight: on narrow windows the sides are trimmed, so the ferry
        // sits inside 60–84 (it stays whole down to a 1.1 aspect).
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
  },
  {
    id: '03',
    slug: 'across-the-water',
    title: 'Across the Water',
    storyboard: {
      desktop: `${SB}/frame-03-across-the-water-rough.png`,
      mobile: `${SB}/frame-03-across-the-water-mobile-rough.png`,
    },
    camera: {
      desktop: { position: [77.6, 2.2, -323], target: [40.2, 50.7, -718.3], fov: 56.9 },
      mobile: { position: [-31.2, 1.8, -218.1], target: [41.8, 112.7, -595.4], fov: 80.1, via: [[60, 3, -300]] },
    },
    copy: {
      desktop: { left: 5, top: 11, right: 42, bottom: 27 },
      mobile: { left: 8, top: 9, right: 92, bottom: 37 },
    },
    visibility: {
      desktop: { ferry: 1, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bursts: 0, clouds: 0.8, mist: 0.8 },
      mobile: { ferry: 1, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bursts: 0, clouds: 0.8, mist: 0.8 },
    },
    fogDensity: 0.00045,
    vessels: {
      desktop: { ferry: [69.3, -359.1, 1.26], junk: [30, -310, 0.3] },
      mobile: { ferry: [-23.4, -270.9, 1], junk: [-60, -240, 0.3] },
    },
    probes: {
      desktop: {
        ferry: { left: 0, right: 60, top: 24, bottom: 78 },
        ifc: { left: 82, right: 87, top: 12 },
        wheel: { left: 74, right: 78 },
        horizon: 62,
      },
      // Deviation: the mobile PNG draws IFC at about half the size the shared
      // world allows from mid-harbour, so IFC is wider here (review note).
      mobile: {
        ferry: { left: 0, right: 66, top: 52, bottom: 72 },
        ifc: { left: 83, right: 94, top: 46 },
        wheel: { left: 76, right: 82 },
        horizon: 66,
      },
    },
  },
  {
    id: '04',
    slug: 'red-sails',
    title: 'Red Sails',
    storyboard: {
      desktop: `${SB}/frame-04-red-sails-rough.png`,
      mobile: `${SB}/frame-04-red-sails-mobile-rough.png`,
    },
    camera: {
      desktop: { position: [153.4, 3, -419.8], target: [-21.8, 68, -773.4], fov: 74.7 },
      mobile: { position: [153.4, 3, -386.1], target: [176.8, 97.9, -773.9], fov: 79.9 },
    },
    copy: {
      desktop: { left: 5, top: 11, right: 34, bottom: 45 },
      mobile: { left: 8, top: 9, right: 92, bottom: 37 },
    },
    // The wheel is gated here: framing alone leaves it peeking past the junk's
    // stern, and it is small and distant while it fades.
    visibility: {
      desktop: { ferry: 1, junk: 1, ifc: 1, wheel: 0, deck: 1, railing: 0, palms: 0, bauhinia: 0, bursts: 0, clouds: 0.5, mist: 1 },
      mobile: { ferry: 1, junk: 1, ifc: 1, wheel: 0, deck: 1, railing: 0, palms: 0, bauhinia: 0, bursts: 0, clouds: 0.5, mist: 1 },
    },
    fogDensity: 0.00063,
    vessels: {
      desktop: { ferry: [400, -700, 1.2], junk: [149.5, -444.6, 0.46] },
      mobile: { ferry: [400, -700, 1.2], junk: [156.2, -430.5, 0.65] },
    },
    probes: {
      desktop: {
        junk: { left: 37, right: 93, top: 10, bottom: 72 },
        ifc: { left: 96 },
        ferry: { offscreen: true },
        horizon: 63,
      },
      mobile: {
        junk: { left: 6, right: 84, top: 40, bottom: 70 },
        // IFC is a right-edge cue cropped by the frame (the PNG's thin far IFC
        // needs a camera ~2 km out in the shared world).
        ifc: { left: 91 },
        ferry: { offscreen: true },
        horizon: 66,
      },
    },
  },
  {
    id: '05',
    slug: 'city-of-light',
    title: 'City of Light',
    storyboard: {
      desktop: `${SB}/frame-05-city-of-light-rough.png`,
      mobile: `${SB}/frame-05-city-of-light-mobile-rough.png`,
    },
    camera: {
      desktop: { position: [380, 40.4, -779], target: [362.9, 183.7, -1152], fov: 66.5, parallax: 1.8 },
      mobile: { position: [568.7, 50, -500], target: [476.2, 139.4, -878.8], fov: 64.1 },
    },
    copy: {
      desktop: { left: 5, top: 11, right: 50, bottom: 37 },
      mobile: { left: 6, top: 9, right: 62, bottom: 44 },
    },
    visibility: {
      // city: the towers around IFC at 60%, so IFC leads (user choice, 2026-10-02).
      desktop: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bursts: 0, petals: 0.6, city: 0.6, clouds: 0.4, mist: 0.6 },
      mobile: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bursts: 0, petals: 0.6, city: 0.6, clouds: 0.4, mist: 0.6 },
    },
    fogDensity: 0.00045,
    vessels: {
      desktop: { ferry: [700, -850, 1.2], junk: [230, -520, 0.24] },
      mobile: { ferry: [700, -850, 1.2], junk: [230, -520, 0.24] },
    },
    // Deviation: the PNG draws the wheel about 3.5× its true size relative to
    // IFC (frames 01 and 03 do not), so the wheel keeps its placement left of
    // IFC at true scale. Desktop is solved for IFC; the wheel lands at about
    // 41–50% instead of 29–42% (review note).
    probes: {
      desktop: {
        ifc: { left: 62, right: 72, top: 3, bottom: 87 },
        wheel: { left: 29, right: 42, bottom: 89 },
      },
      mobile: {
        ifc: { left: 64, right: 82, top: 25, bottom: 75 },
        wheel: { left: 18, right: 38, bottom: 76 },
      },
    },
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
      mobile: { left: 6, top: 9, right: 60, bottom: 35 },
    },
    visibility: {
      // city: the towers around IFC stay at 60%, as in 05 (user request, 2026-10-02).
      desktop: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bursts: 1, petals: 0, city: 0.6, clouds: 1, mist: 0.15 },
      mobile: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bauhinia: 0, bursts: 1, petals: 0, city: 0.6, clouds: 1, mist: 0.15 },
    },
    fogDensity: 0.00036,
    vessels: {
      desktop: { ferry: [720, -860, 1.2], junk: [240, -530, 0.24] },
      mobile: { ferry: [720, -860, 1.2], junk: [240, -530, 0.24] },
    },
    bursts: {
      desktop: [
        { x: 85, y: 22, size: 22, color: 'warm' },
        { x: 65, y: 30, size: 16, color: 'coral' },
        { x: 73, y: 45, size: 11, color: 'cyan' },
        { x: 90, y: 50, size: 10, color: 'coral' },
      ],
      mobile: [
        { x: 84, y: 26, size: 34, color: 'warm' },
        { x: 56, y: 37, size: 26, color: 'coral' },
        { x: 68, y: 46, size: 18, color: 'cyan' },
        { x: 88, y: 50, size: 18, color: 'coral' },
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
