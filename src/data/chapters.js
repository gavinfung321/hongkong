// The single chapter configuration. Every scroll threshold, camera pose, copy
// region, visibility value, fog value, and composition target lives here.
//
// camera:      position / target in world metres, vertical fov in degrees.
//              Optional via: [[x, y, z], ...] waypoints the camera passes on
//              the way to the next chapter (to route around the tower).
// copy:        copy-safe region as % of the viewport (left / top / right / bottom).
// visibility:  1 = shown, 0 = gated (faded out) at this chapter's hold pose.
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
        position: [-19.6, 6.1, 100.9],
        target: [24.8, 28.4, -296],
        fov: 43.3,
        holdDolly: [0, 0, -4],
        via: [[-50, 7, 58]],
      },
      mobile: { position: [-43.8, 8.3, 99], target: [6.9, 119.1, -282], fov: 79.9 },
    },
    copy: {
      desktop: { left: 20, top: 8, right: 50, bottom: 31 },
      mobile: { left: 8, top: 6, right: 92, bottom: 36 },
    },
    visibility: {
      desktop: { ferry: 1, junk: 1, ifc: 1, wheel: 1, deck: 1, railing: 1, palms: 0, bursts: 0 },
      // No deck: the mobile storyboard has open water right to the bottom edge.
      mobile: { ferry: 0, junk: 1, ifc: 1, wheel: 1, deck: 0, railing: 0, palms: 0, bursts: 0 },
    },
    fogDensity: 0.00045,
    vessels: {
      desktop: { ferry: [-19.7, -89.9, 0], junk: [30.1, -36.9, 0] },
      mobile: { ferry: [-19.7, -89.9, 0], junk: [-17.5, -30.5, 0] },
    },
    probes: {
      desktop: {
        tower: { left: 8, right: 18, top: 7, bottom: 60 },
        ferry: { left: 33, right: 49, bottom: 64 },
        junk: { left: 61, right: 77, bottom: 64 },
        ifc: { left: 70, right: 74, top: 18 },
        wheel: { left: 62.4, right: 65.6, bottom: 56 },
        horizon: 57.5,
      },
      mobile: {
        tower: { left: 5, right: 19, top: 42, bottom: 72 },
        junk: { left: 44, right: 75, bottom: 74 },
        ifc: { left: 81, right: 88, top: 46 },
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
        position: [-79.1, 6, 33.3],
        target: [179.4, 107.2, -254.6],
        fov: 55.8,
        via: [[-28, 7, 22], [5, 5, -90]],
      },
      mobile: {
        position: [-62.8, 4.1, 109.1],
        target: [-52.2, 76.3, -284.1],
        fov: 35,
        via: [[-34, 8, 60], [-24, 6, -35]],
      },
    },
    copy: {
      desktop: { left: 50, top: 10, right: 92, bottom: 38 },
      mobile: { left: 8, top: 4, right: 92, bottom: 18 },
    },
    visibility: {
      desktop: { ferry: 1, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 1, palms: 1, bursts: 0 },
      mobile: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 1, palms: 1, bursts: 0 },
    },
    fogDensity: 0.00045,
    vessels: {
      desktop: { ferry: [14.4, -7.5, -0.2], junk: [120, -80, 0] },
      mobile: { ferry: [20, -120, 0.8], junk: [120, -80, 0] },
    },
    probes: {
      desktop: {
        tower: { left: 15, right: 35, top: 2, bottom: 85 },
        ferry: { left: 66, right: 89, top: 67, bottom: 83 },
        ifc: { offscreen: true, behind: 'tower' },
        wheel: { offscreen: true, behind: 'tower' },
        horizon: 75,
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
      desktop: { position: [76.5, 2.2, -323.3], target: [46.2, 42.3, -720.1], fov: 55.1 },
      mobile: { position: [-30, 2.1, -220], target: [44.5, 107.1, -598.8], fov: 80.2, via: [[60, 3, -300]] },
    },
    copy: {
      desktop: { left: 5, top: 6, right: 42, bottom: 22 },
      mobile: { left: 8, top: 6, right: 92, bottom: 34 },
    },
    visibility: {
      desktop: { ferry: 1, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bursts: 0 },
      mobile: { ferry: 1, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bursts: 0 },
    },
    fogDensity: 0.00045,
    vessels: {
      desktop: { ferry: [70.4, -358.6, 1.26], junk: [30, -310, 0.3] },
      mobile: { ferry: [-21.8, -274.2, 1], junk: [-60, -240, 0.3] },
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
      desktop: { position: [153.5, 3, -421.3], target: [-21.7, 67.8, -775], fov: 70.9 },
      mobile: { position: [152.4, 3, -378.2], target: [173.6, 97.2, -766.4], fov: 78 },
    },
    copy: {
      desktop: { left: 5, top: 10, right: 34, bottom: 44 },
      mobile: { left: 8, top: 6, right: 92, bottom: 34 },
    },
    // The wheel is gated here: framing alone leaves it peeking past the junk's
    // stern, and it is small and distant while it fades.
    visibility: {
      desktop: { ferry: 1, junk: 1, ifc: 1, wheel: 0, deck: 1, railing: 0, palms: 0, bursts: 0 },
      mobile: { ferry: 1, junk: 1, ifc: 1, wheel: 0, deck: 1, railing: 0, palms: 0, bursts: 0 },
    },
    fogDensity: 0.00063,
    vessels: {
      desktop: { ferry: [400, -700, 1.2], junk: [148.4, -448.8, 0.46] },
      mobile: { ferry: [400, -700, 1.2], junk: [153.6, -431, 0.17] },
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
      desktop: { position: [462.3, 25, -760], target: [405.4, 152.1, -1135], fov: 55.2 },
      mobile: { position: [568.7, 50, -500], target: [476.2, 139.4, -878.8], fov: 64.1 },
    },
    copy: {
      desktop: { left: 5, top: 6, right: 50, bottom: 32 },
      mobile: { left: 6, top: 5, right: 62, bottom: 40 },
    },
    visibility: {
      desktop: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bursts: 0 },
      mobile: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bursts: 0 },
    },
    fogDensity: 0.00045,
    vessels: {
      desktop: { ferry: [700, -850, 1.2], junk: [230, -520, 0.24] },
      mobile: { ferry: [700, -850, 1.2], junk: [230, -520, 0.24] },
    },
    // Deviation: the PNG draws the wheel about 3.5× its true size relative to
    // IFC (frames 01 and 03 do not), so the wheel keeps its placement left of
    // IFC at true scale, and the camera sits ~420 m from IFC rather than the
    // 650–700 m hint, which would crop IFC's crown (review note).
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
      desktop: { position: [263.7, 32.9, -450], target: [303.1, 273.6, -767.1], fov: 55 },
      mobile: { position: [438.3, 48.5, -350.1], target: [431.1, 294.6, -665.4], fov: 71.7 },
    },
    copy: {
      desktop: { left: 5, top: 12, right: 38, bottom: 62 },
      mobile: { left: 6, top: 4, right: 60, bottom: 30 },
    },
    visibility: {
      desktop: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bursts: 1 },
      mobile: { ferry: 0, junk: 0, ifc: 1, wheel: 1, deck: 1, railing: 0, palms: 0, bursts: 1 },
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
