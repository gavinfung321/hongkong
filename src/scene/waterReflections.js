import { Box3, Color, MathUtils, Vector3 } from 'three';
import { railingLayout } from './lamps.js';
import { seededRandom } from './random.js';
import { WORLD } from '../data/world.js';

// The lights the harbour reflects (user choice, 2026-10-02): the Central
// skyline and IFC, the moon, the ferry's windows and the junk's sails, the
// Clock Tower and the promenade lamps, the Observation Wheel. Each source is
// an upright strip of light: ground position x / z, lit from height h0 to h1,
// half as wide as `width`, with a colour × power. The water draws its
// reflection (createWater.js). Colours match the scene's own lights.

const WARM = new Color(0xffc07a); // city windows (cityWindows.js)
const COOL = new Color(0xc4d6ff);
const SKYLINE_BIN = 45; // metres of skyline per reflection column
const LANTERN_Y = 1.28; // above the railing (lamps.js)
const LAMP_Y = 3.55;

const box = new Box3();
const size = new Vector3();
const centre = new Vector3();

// rank: when more sources are in view than the water draws, the lowest go.
function source(x, z, h0, h1, width, colour, power, extra = {}) {
  return { x, z, h0, h1, width, colour: new Color(colour), power, rank: power, ...extra };
}

// Neighbouring skyline towers merge into columns, one per SKYLINE_BIN metres:
// the front tower's distance, the tallest lit height, a warm / cool mix.
function skylineColumns(skyline) {
  const random = seededRandom(31);
  const bins = new Map();
  const m = skyline.instanceMatrix.array;
  for (let i = 0; i < skyline.count; i++) {
    const [x, y, z] = [m[i * 16 + 12], m[i * 16 + 13], m[i * 16 + 14]];
    const [w, h] = [m[i * 16], m[i * 16 + 5]];
    const key = Math.floor(x / SKYLINE_BIN);
    const bin = bins.get(key) ?? { x0: Infinity, x1: -Infinity, z: -Infinity, top: 0, area: 0, base: y };
    bin.x0 = Math.min(bin.x0, x - w / 2);
    bin.x1 = Math.max(bin.x1, x + w / 2);
    bin.z = Math.max(bin.z, z);
    bin.top = Math.max(bin.top, y + h);
    bin.area += w * h;
    bins.set(key, bin);
  }
  return [...bins.values()].map(({ x0, x1, z, top, area, base }) => {
    const colour = WARM.clone().lerp(COOL, 0.1 + random() * 0.4);
    const power = 0.15 * MathUtils.clamp(area / 9000, 0.4, 1.6) * (0.6 + random() * 0.8);
    return source((x0 + x1) / 2, z, base + 6, top * 0.95, Math.min((x1 - x0) / 2, SKYLINE_BIN) * 0.7, colour, power, { striped: true });
  });
}

// skyline: its InstancedMesh; tower: the Clock Tower group; ferry, junk: the
// boats, followed every frame. The IFC, wheel and moon come from WORLD.
export function reflectionSources({ skyline, tower, ferry, junk }) {
  const list = skylineColumns(skyline);

  const [ix, iy, iz] = WORLD.ifc.position;
  list.push(source(ix, iz, iy + 4, iy + 364, 22, WARM.clone().lerp(COOL, 0.75), 0.3, { key: 'ifc', striped: true }));
  list.push(source(ix, iz, iy + 364, iy + 412, 17, 0xe6ecf6, 0.55, { key: 'ifc' }));

  const { position: [wx, wy, wz], radius, hub } = WORLD.wheel;
  list.push(source(wx, wz, wy + hub - radius, wy + hub + radius, radius * 0.6, 0xff3b64, 0.5, { key: 'wheel' }));

  // The moon's path runs from the horizon to its mirror image.
  const { position: [mx, my, mz], radius: moonRadius } = WORLD.moon;
  list.push(source(mx, mz, my * 0.08, my, moonRadius * 0.55, 0xf6c46a, 1.4));

  tower.updateMatrixWorld(true);
  box.setFromObject(tower).getSize(size);
  box.getCenter(centre);
  list.push(source(centre.x, centre.z, box.min.y + 2, box.max.y - size.y * 0.15, size.x * 0.35, 0xffa860, 0.7));

  // Small and mostly hidden by the promenade's own edge: dropped first.
  const lamp = (x, y, z, key) => source(x, z, y, y + 0.35, 0.2, 0xffb46a, 0.5, { key, rank: 0.01 });
  for (const segment of WORLD.foreground.railings) {
    for (const post of railingLayout(segment).posts) if (post.lantern) list.push(lamp(post.position.x, segment.y + LANTERN_Y, post.position.z, 'railing'));
  }
  for (const segment of WORLD.foreground.edgeRailings) {
    for (const post of railingLayout(segment).posts) if (post.lantern) list.push(lamp(post.position.x, segment.y + LANTERN_Y, post.position.z));
  }
  for (const [x, y, z] of WORLD.foreground.lamps) list.push(lamp(x, y + LAMP_Y, z));

  // Moving: heights and half extents (along the hull, across it) in the boat's frame.
  list.push(source(0, 0, 1.4, 6.6, 0, 0xffd29a, 0.4, { key: 'ferry', follow: ferry, extent: [15, 4.5] }));
  list.push(source(0, 0, 5.6, 19.5, 0, 0xff5a36, 0.9, { key: 'junk', follow: junk, extent: [9, 0.5] }));
  list.push(source(0, 0, 2.9, 5, 0, 0xffc890, 0.3, { key: 'junk', follow: junk, extent: [3, 2] }));
  return list;
}
