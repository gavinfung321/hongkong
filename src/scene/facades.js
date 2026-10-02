import { CanvasTexture, MeshLambertMaterial, RepeatWrapping, SRGBColorSpace } from 'three';
import { seededRandom } from './random.js';

// Painted curtain-wall facades for the main towers, drawn in code (user
// choice, 2026-10-02). Lit floors read as glass bands behind thin mullions,
// lit tenant by tenant rather than window by window. Being textures, they are
// filtered by mipmaps as the camera moves, so they don't twinkle on phones
// the way per-pixel window grids did.

const PX = 16; // texels per bay across and per floor up
// Rows inside one floor, from its top edge: ceiling void, glass, then slab and sill.
const GLASS = [2, 13];
const MULLION = 2; // texels at the left of each bay

// Offices at night are mostly cool or neutral white; warm light is the odd
// tenant. Mullions are what reads from across the harbour, so slab edges
// stay faint.
const COLOURS = {
  slab: '#4a5366',
  slabEdge: '#525c70',
  glass: '#2c3446',
  mullion: '#8a93a8',
  cool: [206, 222, 255],
  neutral: [246, 236, 214],
  warm: [255, 200, 140],
};

function tint(random, coolShare) {
  const r = random();
  if (r < coolShare) return COLOURS.cool;
  return r < coolShare + (1 - coolShare) * 0.6 ? COLOURS.neutral : COLOURS.warm;
}

function canvas(width, height) {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  return [c, c.getContext('2d')];
}

function texture(c, repeat) {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = 8;
  return t;
}

const rgb = ([r, g, b], k) => `rgb(${Math.round(r * k)}, ${Math.round(g * k)}, ${Math.round(b * k)})`;

// Splits one floor into tenant zones: [first bay, bay count].
function zones(bays, random, min, max) {
  const out = [];
  for (let b = 0; b < bays; ) {
    const n = Math.min(bays - b, min + Math.floor(random() * (max - min + 1)));
    out.push([b, n]);
    b += n;
  }
  return out;
}

// One tile of curtain wall, `bays` across and `floors` up, for walls whose
// UVs are in metres (u along the wall, v up from the tower's foot).
// lit: rough share of glass lit; coolShare: share of zones in cool office
// white (the rest neutral, and a few warm). Returns { map, emissiveMap } for a Lambert material
// with a white emissive.
export function curtainWall({ bays, floors, bay, floor, lit, coolShare, seed }) {
  const random = seededRandom(seed);
  const width = bays * PX;
  const height = floors * PX;
  const [colour, base] = canvas(width, height);
  const [glow, light] = canvas(width, height);

  base.fillStyle = COLOURS.slab;
  base.fillRect(0, 0, width, height);
  light.fillStyle = '#000';
  light.fillRect(0, 0, width, height);

  // Whole floors lit, part-let floors lit zone by zone, and dark floors
  // with the odd late office.
  const full = lit * 0.85;
  const partial = 0.3;
  for (let f = 0; f < floors; f++) {
    const top = height - (f + 1) * PX;
    const glassTop = top + GLASS[0];
    const glassHeight = GLASS[1] - GLASS[0];
    base.fillStyle = COLOURS.glass;
    base.fillRect(0, glassTop, width, glassHeight);
    base.fillStyle = COLOURS.slabEdge;
    base.fillRect(0, top + GLASS[1] + 1, width, 1);

    const kind = random();
    const zoneLit = kind < full ? 0.95 : kind < full + partial ? 0.55 : 0.04;
    const [min, max] = kind < full ? [6, 16] : [3, 9];
    for (const [first, count] of zones(bays, random, min, max)) {
      if (random() > zoneLit) continue;
      const colour = tint(random, coolShare);
      const level = 0.7 + random() * 0.3;
      for (let b = first; b < first + count; b++) {
        const r = random();
        if (r < 0.05) continue; // one dark room
        const k = level * (0.85 + random() * 0.15);
        const x = b * PX + MULLION;
        const w = PX - MULLION;
        // Brightest under the ceiling lights, dimmer toward the sill, with
        // soft top and bottom edges (hard ones crawl as floors slide past);
        // some rooms have their blinds half down.
        const low = r < 0.12 ? 0.4 : 0.7;
        const g = light.createLinearGradient(0, glassTop, 0, glassTop + glassHeight);
        g.addColorStop(0, rgb(colour, k * 0.45));
        g.addColorStop(0.12, rgb(colour, k));
        g.addColorStop(0.35, rgb(colour, k * 0.9));
        g.addColorStop(0.88, rgb(colour, k * low));
        g.addColorStop(1, rgb(colour, k * low * 0.5));
        light.fillStyle = g;
        light.fillRect(x, glassTop, w, glassHeight);
      }
    }
  }

  base.fillStyle = COLOURS.mullion;
  for (let b = 0; b < bays; b++) base.fillRect(b * PX, 0, MULLION, height);

  const repeat = [1 / (bays * bay), 1 / (floors * floor)];
  return { map: texture(colour, repeat), emissiveMap: texture(glow, repeat) };
}

// Shared mipmap bias for every facade: phones take half a level blurrier, so
// detail sliding past mid-scroll strobes less (user report, 2026-10-02).
export const facadeBias = { value: 0 };

// A lit facade: the colour map lit by the scene, the glow map added on top.
export function facadeMaterial({ map, emissiveMap }, glow) {
  const material = new MeshLambertMaterial({ color: 0xffffff, map, emissive: 0xffffff, emissiveMap, emissiveIntensity: glow });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uFacadeBias = facadeBias;
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uFacadeBias;')
      .replace('#include <map_fragment>', 'diffuseColor *= texture2D( map, vMapUv, uFacadeBias );')
      .replace('#include <emissivemap_fragment>', 'totalEmissiveRadiance *= texture2D( emissiveMap, vEmissiveMapUv, uFacadeBias ).rgb;');
  };
  material.customProgramCacheKey = () => 'facade';
  return material;
}

// Wall UVs in metres for walls facing x or z: u along the wall, v up from
// the object's origin, so floors run on across stacked tiers. Each face
// starts the pattern `shift` metres further on, so neighbours differ. Roofs
// sample the slab at the foot of the tile.
export function facadeUVs(geometry, shift = 23) {
  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const uv = new Float32Array(position.count * 2);
  for (let i = 0; i < position.count; i++) {
    const nx = normal.getX(i);
    const nz = normal.getZ(i);
    if (Math.abs(normal.getY(i)) >= 0.5) {
      uv[i * 2] = 1.3;
      uv[i * 2 + 1] = 0.3;
      continue;
    }
    const facesX = Math.abs(nx) > Math.abs(nz);
    const face = facesX ? (nx > 0 ? 0 : 2) : nz > 0 ? 1 : 3;
    uv[i * 2] = (facesX ? position.getZ(i) : position.getX(i)) + face * shift;
    uv[i * 2 + 1] = position.getY(i);
  }
  geometry.attributes.uv.array.set(uv);
  geometry.attributes.uv.needsUpdate = true;
  return geometry;
}
