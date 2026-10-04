// x: the column's centre; foot: where the numerals start, height: their
// length up the screen (% of the viewport height). Desktop: 3.2 km out,
// behind the near range (1.8 km north), so the ridge hides the foot; phones
// look at the range from below the copy, so there it stands in front of it.
export const SCENE_02_GHOST = {
  text: '1915',
  font: 'fonts/cormorant-garamond-latin-600.woff2',
  colour: 0xf3e9d2,
  // Phones: right of the tower, between it and the skyline, its foot above
  // the right-hand palms (user choice, 2026-10-04: on the left the palms hid
  // it); stronger, as it stands over the dark city at the veil's edge.
  // Desktop follows the window's aspect: ultrawide above 1.7, standard
  // 1.35–1.7, compact below 1.35. x, foot and height keep the whole column
  // in the right-hand sky, below the header, above the timeline, and clear
  // of the copy and the side pager.
  ultrawide: { x: 89, foot: 60, height: 50, depth: 3200, opacity: 0.12 },
  standard: { x: 89, foot: 59, height: 48, depth: 3200, opacity: 0.12 },
  compact: { x: 89, foot: 57, height: 42, depth: 3200, opacity: 0.12 },
  mobile: { x: 74, foot: 62, height: 22, depth: 420, opacity: 0.2 },
};

// Desktop scene-02 composition. The copy keeps the reference distance from
// the Clock Tower. The ghost sits to the right of the complete content block
// at full size, shrinking only when the remaining right-side space is tight.
// Percentages are viewport shares.
export const SCENE_02_LAYOUT = {
  towerGap: 15,
  copyLeft: [40, 52],
  copyWidth: 44,
  copyRight: 80,
  ghostGap: 1.5,
  ghostRight: 98,
};
