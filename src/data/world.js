// World layout in metres. Y is up, water is y = 0, −Z points toward Hong Kong
// Island, and +X is screen-right in the arrival view (toward Central).

export const WORLD = {
  water: { size: 8000, center: [0, -1000] },

  kowloon: {
    // [xMin, xMax, zMin, zMax, top]
    blocks: [
      [-260, -50, -60, 40, 2.5], // Clock Tower promontory
      [-260, -60, 40, 400, 2.5], // Kowloon waterfront behind
      [-60, 80, 99, 400, 2.5], // promenade under the arrival viewpoint
      // Land stops 5 m past the tower: in frame 01 open water separates it from the ferry.
    ],
    // Polygon decks [[x, z], ...] at height `top`, for edges that are not axis-aligned.
    decks: [
      // Arrival promenade out to the diagonal railing A, so no water shows inside it.
      { points: [[-5.6, 99], [-5.6, 97.4], [-48, 61.7], [-60, 61.7], [-60, 99]], top: 2.5 },
    ],
    skyline: { x: [-480, -80], z: [80, 460], count: 40, height: [14, 60], seed: 7 },
  },

  clockTower: { position: [-60, 2.5, -20], yaw: 0 },

  island: {
    slab: [-1000, 1400, -1600, -1100, 3],
    skyline: { x: [-1000, 1400], z: [-1150, -1520], count: 230, maxHeight: 320, peakX: 520, seed: 11 },
  },

  // Two IFC on its mall podium [xMin, xMax, zMin, zMax, height].
  ifc: { position: [500, 3, -1180], podium: [448, 552, -1200, -1130, 22] },
  // True scale: 60 m to the top of the rim.
  wheel: { position: [335, 3, -1105], radius: 27.5, hub: 32.5 },
  // Landmarks in their order seen from Kowloon, at about real height (user
  // choice, 2026-10-02). Central Plaza stands well right of its true place
  // (Wan Chai), where the Clock Tower would hide it in 01. BOC: four shafts
  // stopping at `modules` × side metres (front, left, back, right), masts to
  // 367 m. The Center: crown tiers are [rise, half width].
  landmarks: {
    boc: { position: [130, 3, -1330], side: 52, modules: [3, 4, 6, 5], mastTip: 367 },
    cheungKong: { position: [235, 3, -1400], side: 50, height: 283 },
    centralPlaza: { position: [-250, 3, -1340], radius: 40, height: 300, pyramid: 34, mastTip: 374 },
    center: { position: [800, 3, -1420], half: 24, height: 290, crown: [[10, 20], [9, 16], [8, 12]], spireTip: 346 },
  },
  // Central Ferry Piers: pavilion centres along x, jutting out from the island's edge.
  piers: { x: [400, 456, 512, 568, 624], z: -1085, depth: 30 },

  foreground: {
    // Railing runs sit on top of the promenade / seawall (y = deck height).
    // Every water edge near the Clock Tower has one (user request,
    // 2026-10-02). `railings` fade with the chapters (`railing` in each
    // chapter's visibility; mobile 01 wants open water at the bottom);
    // `edgeRailings` follow the promontory and always show. Runs meeting at a
    // corner share one post: skipFirst / skipLast drop the duplicate.
    railings: [
      // A: arrival promenade edge, the hero's foreground frame. Chunkier, with
      // a lantern on every big post, like the storyboard (user choice,
      // 2026-10-03).
      { from: [-5.6, 97.4], to: [-48, 61.7], y: 2.5, scale: 1.3, lanternEvery: 1 },
      { from: [-74, 92.2], to: [-50, 92.3], y: 2.5 }, // C: waterfront (mobile 02)
      { from: [-60, 61.7], to: [-48, 61.7], y: 2.5, skipFirst: true, skipLast: true }, // D: inlet, north side
    ],
    edgeRailings: [
      // B: promontory's harbour edge, the desktop 02 foreground. Chunky with
      // a lantern on every post, like A (user choice, 2026-10-03).
      { from: [-50, 40], to: [-50, -60], y: 2.5, scale: 1.3, lanternEvery: 1 },
      { from: [-50, -60], to: [-110, -60], y: 2.5, skipFirst: true }, // promontory's south tip
      { from: [-50, 40], to: [-60, 40], y: 2.5, skipFirst: true }, // inlet, south side
      // Inlet, west side. No lanterns: in mobile 02 this run points straight
      // at the tower, and they would sit in front of its lit base.
      { from: [-60, 40], to: [-60, 61.7], y: 2.5, skipFirst: true, lanterns: false },
    ],
    // Tall cast-iron lamps on the Clock Tower promontory: either side of the
    // tower and short of the ferry in desktop 02, left of the tower in mobile
    // 02. Spaced so they also stand apart left of the tower in the hero and 01
    // on wide windows (user request, 2026-10-02); at 16:10 only the first shows.
    lamps: [
      [-71.5, 2.5, -9.5],
      [-67, 2.5, 14.5],
      [-70, 2.5, 24],
    ],
    // The bauhinia tree on the arrival promenade, just right of and behind the
    // 01 camera, leaning out over the water so its crown frames the top-right
    // corner of the hero and 01 (its trunk stays out of frame). Yaw turns the
    // lean, as for the palms.
    // `viewer`: the hero / 01 desktop camera, which the flowers turn toward.
    // Set 1.5 m into the deck (user choice, 2026-10-03) so the crown sits
    // below 東方明珠 in the hero instead of behind it; the trunk's foot is
    // never in frame.
    bauhinia: { position: [1.2, 1, 100], yaw: 1.91, scale: 1, seed: 5, viewer: [-13, 5.9, 102] },
    // A low bauhinia bush on the arrival promenade just inside railing A
    // (user request, 2026-10-03), its long side along the railing: it fills
    // the bottom-left corner of the hero under the Clock Tower and slides
    // into the corner by the 01 hold. Moved 2 m on along the railing (user
    // request, 2026-10-03) so its crown ends left of 香 in the hero (right
    // edge at 20% of the width, 香 starts at 22.5%) and the railing lantern
    // it hid shows; it still fills the corner at the 01 hold (to 8.5%).
    // Desktop only (mobile 01 has no deck).
    // size: [length, height, depth] in metres.
    bauhiniaBush: { position: [-21.1, 2.5, 87.4], yaw: -0.7, size: [7, 2.3, 2.6], seed: 11, viewer: [-13, 5.9, 102] },
    // People standing near the Clock Tower (user choices, 2026-10-03; see
    // people.js): at railing B watching the sea in desktop 02 (a couple, a
    // single, a pair turned to each other), and one looking up at the
    // tower. face: radians, 0 toward +x (the sea).
    people: {
      seed: 8,
      list: [
        { position: [-51.3, 23.6], face: 0.1 },
        { position: [-51.3, 24.3], face: -0.1 },
        { position: [-51.3, 30.5], face: 0.3 },
        { position: [-51.4, 12.6], face: 0.6 },
        { position: [-52.1, 13.2], face: -0.9 },
        { position: [-66.5, -9], face: -1.1 },
      ],
    },
    // 3D palms around the Clock Tower (frame 02), in two shapes. Yaw turns the
    // trunk's lean: 0 leans toward +x, π/2 toward −z. None may cross the
    // tower in either chapter 02 framing. The row of five stands behind the
    // tower on the promontory's south end. `only: 'mobile'`: outside the
    // desktop frame, where it would only sweep across the tower mid-move.
    // `only: 'desktop'`: the desktop camera looks across the promontory and
    // sees few of the others; on mobile these would sit beside the tower or,
    // for the coconut at x −82.4 and the row's last palm, left of the frame.
    palms: [
      { position: [-75.4, 2.5, -7.4], height: 10, shape: 'coconut', yaw: 2.32, only: 'desktop' },
      { position: [-70.4, 2.5, -25.6], height: 12.5, shape: 'fan', yaw: 2.32, only: 'desktop' },
      { position: [-52, 2.5, 5], height: 10.5, shape: 'coconut', yaw: 2.32, only: 'desktop' },
      { position: [-82.4, 2.5, 9.1], height: 11, shape: 'coconut', yaw: -0.83, only: 'desktop' },
      { position: [-52.5, 2.5, 0.2], height: 9, shape: 'fan', yaw: -0.83 },
      { position: [-66.7, 2.5, 55.1], height: 10, shape: 'coconut', yaw: Math.PI },
      { position: [-53.5, 2.5, 38], height: 9, shape: 'fan', yaw: 0, only: 'mobile' },
      { position: [-70, 2.5, -50], height: 10, shape: 'fan', yaw: 2.9 },
      { position: [-74.5, 2.5, -46.5], height: 11.5, shape: 'coconut', yaw: 2.7 },
      { position: [-79, 2.5, -50], height: 9.5, shape: 'fan', yaw: 3.0 },
      { position: [-83.5, 2.5, -47], height: 12, shape: 'coconut', yaw: 2.6 },
      { position: [-88, 2.5, -50], height: 10.5, shape: 'fan', yaw: 3.1, only: 'desktop' },
    ],
  },

  // Peaks are [x, extra height, width]; a negative height cuts a saddle.
  // `step` is the ridge's sample spacing in metres, `rough` scales its jagged
  // detail, `taper` is the length of the slope down to the water at each end
  // (user request, 2026-10-02). The near ridge stays above the Central skyline across the whole
  // 05/06 frames. Its outline follows the Peak seen from Kowloon (user choice,
  // 2026-10-02): the High West knob, the summit (~560 m) left of IFC with a
  // shoulder that hides the moon's lower edge in 01, the dip of Victoria Gap,
  // then Mount Cameron's mass. The third range sits behind
  // the moon, so the moon draws over it.
  mountains: {
    ranges: [
      {
        z: -1800,
        x: [-3200, 3800],
        base: 340,
        peaks: [[200, 215, 420], [-170, 140, 170], [-900, 70, 600], [500, 70, 150], [760, -40, 100], [1000, 140, 300], [1350, 50, 280], [2200, 90, 700]],
        color: 0x15122a,
        seed: 3,
        step: 10,
        rough: 1,
        taper: 1200,
      },
      { z: -2700, x: [-4000, 4600], base: 420, peaks: [[900, 230, 900], [-1600, 150, 900], [2900, 180, 900]], color: 0x241e3c, seed: 5, step: 20, rough: 0.8, taper: 1500 },
      { z: -3700, x: [-4500, 5500], base: 780, peaks: [[-500, 260, 900], [1900, 300, 1000], [3700, 200, 800]], color: 0x2c2648, seed: 9, step: 30, rough: 0.6, taper: 1800 },
    ],
    // Haze lit by the city, between the skyline and the near range.
    mist: { z: -1650, x: [-3200, 3800], height: 340 },
    // Mid-Levels on the near range (user request, 2026-10-03: the old
    // scattered dots read as floating specks): residential towers as columns
    // of lit windows on the lower slopes, road lights climbing the hill, and
    // the lights round the Peak Tower at Victoria Gap. Roads run from
    // [x, share of the ridge's height] to [x, share], with a wiggle in metres.
    // `west`: Sheung Wan to Kennedy Town, left of the Clock Tower in the hero
    // (user choice, 2026-10-03: the lights stopped in a hard edge behind the
    // tower). From `x[0]` the towers thin out and stay lower over the next
    // `reachOut` metres, so High West's top stays dark behind the tower.
    lights: {
      x: [-700, 1400],
      towers: 210,
      west: { towers: 55, reachOut: 500, reach: 0.42 },
      roads: [
        [[-1000, 0.18], [-560, 0.26], 8],
        [[-560, 0.3], [420, 0.36], 14],
        [[-300, 0.46], [700, 0.5], 10],
        [[150, 0.24], [1300, 0.3], 12],
        [[380, 0.42], [745, 0.93], 18],
      ],
      peak: 760,
      seed: 21,
    },
  },

  // Behind the far range, upper right of the opening frame; its lower edge dips
  // behind the ridge. Faces the opening camera. Stylised: far larger than life.
  moon: { position: [742, 1000, -3300], radius: 280, facing: [-13, 6, 104], seed: 11 },
};
