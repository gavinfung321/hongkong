import { Box3, Color, Vector3 } from 'three';
import { seededRandom } from './random.js';
import { WORLD } from '../data/world.js';

// What the harbour reflects (user choices, 2026-10-02): IFC, the Clock Tower,
// the Observation Wheel (2026-10-03), the ferry's windows, the junk's sails
// and the moon, each as a glittering
// glow; and a dim shimmer under the whole skyline (`cityStrip`), with no
// columns. The water draws them as glints (createWater.js).
// Each light is an upright strip: ground position x / z, lit from height h0
// to h1, `width` half wide, with a colour × power. tail: how far the glow
// runs on toward the viewer, as a share of the mirror image's length; taper:
// how much it dims along its length (0 even, 1 down to nothing).
// kind 'hull': a dark mirror image from the waterline up to h1 instead.

const WARM = new Color(0xffc07a); // city windows (cityWindows.js)
const COOL = new Color(0xc4d6ff);
const STRIP = 256; // texels along the island front
const BLUR = 4; // texels each side, so neighbouring towers merge

const box = new Box3();
const size = new Vector3();
const centre = new Vector3();

function source(x, z, h0, h1, width, colour, power, extra = {}) {
  return { x, z, h0, h1, width, colour: new Color(colour), power, tail: 0.6, taper: 0, rank: power, ...extra };
}

// tower: the Clock Tower group; ferry, junk: the boats, followed every frame.
// IFC and the moon come from WORLD.
export function reflectionSources({ tower, ferry, junk }) {
  const list = [];

  const [ix, iy, iz] = WORLD.ifc.position;
  list.push(source(ix, iz, iy + 4, iy + 300, 22, 0xd8e0f2, 0.4, { key: 'ifc', tail: 0.25, taper: 0.7 }));

  // The floodlit lower part (the floodlight fades up the shaft).
  tower.updateMatrixWorld(true);
  box.setFromObject(tower).getSize(size);
  box.getCenter(centre);
  list.push(source(centre.x, centre.z, box.min.y + 2, box.min.y + size.y * 0.6, size.x * 0.35, 0xffa860, 0.6, { taper: 0.6 }));

  // The Observation Wheel's red-pink rim and violet gondolas (user request,
  // 2026-10-03): from the rim's foot to its top, about the rim's width.
  const { position: [wx, wy, wz], radius: wr, hub } = WORLD.wheel;
  list.push(source(wx, wz, wy + hub - wr, wy + hub + wr, wr * 0.7, 0xff4a7c, 0.35, { key: 'wheel', tail: 0.3, taper: 0.4 }));

  // A glitter path from the horizon to the moon's mirror image.
  const { position: [mx, my, mz], radius } = WORLD.moon;
  list.push(source(mx, mz, my * 0.08, my, radius * 0.45, 0xf6c46a, 0.3, { taper: 0.6, tail: 0.15 }));

  // Moving: heights and half extents (along the hull, across it) in the boat's frame.
  // The ferry's windows: kept to the hull's length and close under it, a
  // column of slivers (user choice, 2026-10-03: with a longer tail and the
  // full hull width the glints scattered over 03's whole foreground).
  list.push(source(0, 0, 1.4, 6.6, 0, 0xffd29a, 0.45, { key: 'ferry', follow: ferry, extent: [9, 3], tail: 0.15 }));
  list.push(source(0, 0, 5.6, 19.5, 0, 0xff5a36, 0.9, { key: 'junk', follow: junk, extent: [8, 0.5], taper: 0.3 }));
  list.push(source(0, 0, 2.9, 5, 0, 0xffc890, 0.3, { key: 'junk', follow: junk, extent: [3, 2] }));

  // The hulls' own mirror images (user choice, 2026-10-02): dark, dimly
  // coloured, hiding the city and moon glints behind them, so each boat
  // sits in the water rather than on a glittering floor. Their own lights
  // still reflect through. Height: the hull up to the bulwark; above it
  // the lit cabins reflect as their own glints.
  list.push(source(0, 0, 0, 3, 0, 0x2a5a40, 0.1, { key: 'ferry', follow: ferry, extent: [19, 4.6], kind: 'hull', rank: 2 }));
  list.push(source(0, 0, 0, 3.6, 0, 0x8a5030, 0.08, { key: 'junk', follow: junk, extent: [12, 3.2], kind: 'hull', rank: 2 }));
  return list;
}

// The skyline as a strip along the island front: per texel the lit windows'
// colour × brightness (rgb) and the tallest tower's height (a), blurred so
// the shimmer is continuous.
export function cityStrip(skyline) {
  const { x: [x0, x1], z: [front] } = WORLD.island.skyline;
  const random = seededRandom(31);
  const light = new Float32Array(STRIP * 3);
  const height = new Float32Array(STRIP);
  const m = skyline.instanceMatrix.array;
  const colour = new Color();
  for (let i = 0; i < skyline.count; i++) {
    const [x, w, h] = [m[i * 16 + 12], m[i * 16], m[i * 16 + 5]];
    colour.copy(WARM).lerp(COOL, 0.1 + random() * 0.5);
    const a = Math.max(0, Math.floor(((x - w / 2 - x0) / (x1 - x0)) * STRIP));
    const b = Math.min(STRIP - 1, Math.ceil(((x + w / 2 - x0) / (x1 - x0)) * STRIP));
    for (let j = a; j <= b; j++) {
      light[j * 3] += colour.r * h;
      light[j * 3 + 1] += colour.g * h;
      light[j * 3 + 2] += colour.b * h;
      height[j] = Math.max(height[j], h);
    }
  }
  const blur = (values, stride) => {
    const out = new Float32Array(values.length);
    for (let j = 0; j < STRIP; j++) {
      for (let k = -BLUR; k <= BLUR; k++) {
        const n = Math.min(STRIP - 1, Math.max(0, j + k));
        for (let c = 0; c < stride; c++) out[j * stride + c] += values[n * stride + c] / (2 * BLUR + 1);
      }
    }
    return out;
  };
  const smoothLight = blur(light, 3);
  const smoothHeight = blur(height, 1);
  const peakLight = Math.max(...smoothLight);
  const peakHeight = Math.max(...smoothHeight);
  const data = new Uint8Array(STRIP * 4);
  for (let j = 0; j < STRIP; j++) {
    // Fade out at both ends of the island.
    const edge = Math.min(1, j / BLUR, (STRIP - 1 - j) / BLUR);
    for (let c = 0; c < 3; c++) data[j * 4 + c] = Math.round((255 * edge * smoothLight[j * 3 + c]) / peakLight);
    data[j * 4 + 3] = Math.round((255 * smoothHeight[j]) / peakHeight);
  }
  return { data, x0, x1, z: front, height: peakHeight };
}
