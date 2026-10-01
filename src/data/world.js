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

  ifc: { position: [500, 3, -1180] },
  wheel: { position: [335, 3, -1105], radius: 30 },

  foreground: {
    // Railing segments sit on top of the promenade / seawall (y = deck height).
    railings: [
      { from: [-5.6, 97.4], to: [-48, 61.7], y: 2.5 }, // A: arrival promenade edge
      { from: [-69.7, 2], to: [-69.2, 30], y: 2.5 }, // B: tower walkway (desktop 02)
      { from: [-74, 92.2], to: [-50, 92.3], y: 2.5 }, // C: waterfront (mobile 02)
    ],
    // Palm silhouette cards around the Clock Tower (frame 02). Yaw faces the cards
    // toward the chapter 02 cameras.
    palms: [
      { position: [-76.9, 2.5, 14.5], height: 11, yaw: -0.11 },
      { position: [-57.8, 2.5, 0.2], height: 9, yaw: -0.57 },
      { position: [-66.7, 2.5, 55.1], height: 10, yaw: 0.07 },
      { position: [-55.6, 2.5, 41.6], height: 9, yaw: -0.11 },
    ],
  },

  mountains: [
    { z: -2000, x: [-3200, 3800], base: 150, peaks: [[450, 260, 550], [-700, 130, 600], [1800, 170, 700]], color: 0x221d3a, seed: 3 },
    { z: -2700, x: [-4000, 4600], base: 230, peaks: [[1000, 280, 800], [-1500, 180, 900], [2800, 200, 900]], color: 0x2a2446, seed: 5 },
  ],
};
