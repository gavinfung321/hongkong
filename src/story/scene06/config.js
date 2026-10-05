// Scene 06 owns the Afterglow composition and its afterimage.
// Shared firework, skyline and footer engines remain in their existing files;
// this module contains only values specific to this chapter.

export const SCENE_06_CHAPTER = {
  camera: {
    desktop: { position: [271.8, 32.7, -467.7], target: [299.2, 263.7, -793.2], fov: 54.7, parallax: 1.8 },
    mobile: { position: [447.2, 57.1, -365.3], target: [434.4, 277.9, -698.6], fov: 63 },
  },
  copy: {
    desktop: { left: 5, top: 12, right: 38, bottom: 62 },
    mobile: { left: 6, top: 9, right: 66, bottom: 35 },
  },
  // A short reading hold; the camera remains on its existing authored pose.
  dwell: 50,
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
};

// Label and title use chapter progress on approach. The closing paragraph is
// a share of Scene 06's dwell and remains reversible.
export const SCENE_06_AFTERIMAGE = {
  reveal: {
    label: [0.34, 0.42],
    title: [0.42, 0.5],
    line: [0.1, 0.32],
  },
};
