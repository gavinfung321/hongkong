import { Box3, Color, Vector3 } from 'three';
import { WORLD } from '../data/world.js';

// The lights the harbour reflects (user choice, 2026-10-02): IFC, the Clock
// Tower, the ferry's windows and the junk's sails. The skyline, moon, wheel
// and promenade lamps are not reflected (user choice, same day: their many
// thin streaks read as a barcode). Each source is an upright strip of light:
// ground position x / z, lit from height h0 to h1, `width` half wide, with a
// colour × power. The water draws its reflection (createWater.js).
// tail: how far the streak runs on toward the viewer, as a share of the
// mirror image's length; taper: how much it dims along its length (0 even,
// 1 down to nothing). Colours match the scene's own lights.

const box = new Box3();
const size = new Vector3();
const centre = new Vector3();

function source(x, z, h0, h1, width, colour, power, extra = {}) {
  return { x, z, h0, h1, width, colour: new Color(colour), power, tail: 0.35, taper: 0, rank: power, ...extra };
}

// tower: the Clock Tower group; ferry, junk: the boats, followed every frame.
// IFC comes from WORLD.
export function reflectionSources({ tower, ferry, junk }) {
  const list = [];

  // One soft column, the body's width, half the tower's mirrored height.
  const [ix, iy, iz] = WORLD.ifc.position;
  list.push(source(ix, iz, iy + 4, iy + 210, 20, 0xd2dcf0, 0.32, { key: 'ifc', tail: 0.15, taper: 0.75 }));

  tower.updateMatrixWorld(true);
  box.setFromObject(tower).getSize(size);
  box.getCenter(centre);
  // The floodlit lower half only (the floodlight fades up the shaft).
  list.push(source(centre.x, centre.z, box.min.y + 2, box.min.y + size.y * 0.5, size.x * 0.3, 0xffa860, 0.55, { taper: 0.6 }));

  // Moving: heights and half extents (along the hull, across it) in the boat's
  // frame, covering only the lit window decks and the sails.
  list.push(source(0, 0, 1.4, 6.6, 0, 0xffd29a, 0.3, { key: 'ferry', follow: ferry, extent: [11, 3.5] }));
  list.push(source(0, 0, 5.6, 19.5, 0, 0xff5a36, 0.75, { key: 'junk', follow: junk, extent: [6, 0.5], taper: 0.3 }));
  list.push(source(0, 0, 2.9, 5, 0, 0xffc890, 0.25, { key: 'junk', follow: junk, extent: [2.5, 1.5] }));
  return list;
}
