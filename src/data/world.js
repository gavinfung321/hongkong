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
      { from: [-5.6, 97.4], to: [-48, 61.7], y: 2.5 }, // A: arrival promenade edge
      { from: [-74, 92.2], to: [-50, 92.3], y: 2.5 }, // C: waterfront (mobile 02)
      { from: [-60, 61.7], to: [-48, 61.7], y: 2.5, skipFirst: true, skipLast: true }, // D: inlet, north side
    ],
    edgeRailings: [
      { from: [-50, 40], to: [-50, -60], y: 2.5 }, // B: promontory's harbour edge
      { from: [-50, -60], to: [-110, -60], y: 2.5, skipFirst: true }, // promontory's south tip
      { from: [-50, 40], to: [-60, 40], y: 2.5, skipFirst: true }, // inlet, south side
      // Inlet, west side. No lanterns: in mobile 02 this run points straight
      // at the tower, and they would sit in front of its lit base.
      { from: [-60, 40], to: [-60, 61.7], y: 2.5, skipFirst: true, lanterns: false },
    ],
    // Tall cast-iron lamps on the Clock Tower promontory, seen in 02 only:
    // either side of the tower and short of the ferry on desktop, clear of the
    // tower on mobile, outside the 01 frames (they line up with the tower there).
    lamps: [
      [-74.5, 2.5, 3.5],
      [-69.5, 2.5, 17],
      [-66, 2.5, 21],
    ],
    // The bauhinia tree on the arrival promenade, just right of and behind the
    // 01 camera, leaning out over the water so its crown frames the top-right
    // corner of the hero and 01 (its trunk stays out of frame). Yaw turns the
    // lean, as for the palms.
    bauhinia: { position: [1.2, 2.5, 100], yaw: 1.91, scale: 1, seed: 5 },
    // 3D palms around the Clock Tower (frame 02), in two shapes. Yaw turns the
    // trunk's lean: 0 leans toward +x, π/2 toward −z. None may cross the
    // tower in either chapter 02 framing. The row of five stands behind the
    // tower on the promontory's south end. `only: 'mobile'`: outside the
    // desktop frame, where it would only sweep across the tower mid-move.
    // `only: 'desktop'`: the desktop camera looks across the promontory and
    // sees few of the others; on mobile these would sit beside the tower.
    palms: [
      { position: [-75.4, 2.5, -7.4], height: 10, shape: 'coconut', yaw: 2.32, only: 'desktop' },
      { position: [-70.4, 2.5, -25.6], height: 12.5, shape: 'fan', yaw: 2.32, only: 'desktop' },
      { position: [-52, 2.5, 5], height: 10.5, shape: 'coconut', yaw: 2.32, only: 'desktop' },
      { position: [-82.4, 2.5, 9.1], height: 11, shape: 'coconut', yaw: -0.83 },
      { position: [-52.5, 2.5, 0.2], height: 9, shape: 'fan', yaw: -0.83 },
      { position: [-66.7, 2.5, 55.1], height: 10, shape: 'coconut', yaw: Math.PI },
      { position: [-53.5, 2.5, 38], height: 9, shape: 'fan', yaw: 0, only: 'mobile' },
      { position: [-70, 2.5, -50], height: 10, shape: 'fan', yaw: 2.9 },
      { position: [-74.5, 2.5, -46.5], height: 11.5, shape: 'coconut', yaw: 2.7 },
      { position: [-79, 2.5, -50], height: 9.5, shape: 'fan', yaw: 3.0 },
      { position: [-83.5, 2.5, -47], height: 12, shape: 'coconut', yaw: 2.6 },
      { position: [-88, 2.5, -50], height: 10.5, shape: 'fan', yaw: 3.1 },
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
    // Homes and roads on the near range's lower slopes (Mid-Levels).
    lights: { x: [-700, 1400], clusters: 80, perCluster: 12, seed: 21 },
  },

  // Behind the far range, upper right of the opening frame; its lower edge dips
  // behind the ridge. Faces the opening camera. Stylised: far larger than life.
  moon: { position: [742, 1000, -3300], radius: 280, facing: [-13, 6, 104], seed: 11 },
};
