import { CanvasTexture, MeshLambertMaterial, RepeatWrapping, SRGBColorSpace } from 'three';
import { seededRandom } from './random.js';
import { cityLight, cityLightGlsl } from './cityLight.js';

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
// white (the rest neutral, and a few warm); level: zone brightness range;
// rooms: some rooms dark or with blinds down; colours: cladding overrides.
// Returns { map, emissiveMap } for `facadeMaterial`.
export function curtainWall({ bays, floors, bay, floor, lit, coolShare, seed, level: range = [0.7, 1], rooms = true, colours = {} }) {
  const random = seededRandom(seed);
  const width = bays * PX;
  const height = floors * PX;
  const [colour, base] = canvas(width, height);
  const [glow, light] = canvas(width, height);
  const palette = { ...COLOURS, ...colours };

  base.fillStyle = palette.slab;
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
    base.fillStyle = palette.glass;
    base.fillRect(0, glassTop, width, glassHeight);
    base.fillStyle = palette.slabEdge;
    base.fillRect(0, top + GLASS[1] + 1, width, 1);

    const kind = random();
    const zoneLit = kind < full ? 0.95 : kind < full + partial ? 0.55 : 0.04;
    const [min, max] = kind < full ? [6, 16] : [3, 9];
    for (const [first, count] of zones(bays, random, min, max)) {
      if (random() > zoneLit) continue;
      const colour = tint(random, coolShare);
      const level = range[0] + random() * (range[1] - range[0]);
      for (let b = first; b < first + count; b++) {
        const r = rooms ? random() : (random(), 1);
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

  base.fillStyle = palette.mullion;
  for (let b = 0; b < bays; b++) base.fillRect(b * PX, 0, MULLION, height);

  const repeat = [1 / (bays * bay), 1 / (floors * floor)];
  return { map: texture(colour, repeat), emissiveMap: texture(glow, repeat) };
}

// Bank of China Tower: `modules` square facade modules stacked, UVs one per
// module (u across, v up). Each module's X braces split it into four glass
// facets, each catching the sky a little differently; dim offices show
// through the tinted glass; the braces and module edges are lit white lines
// with a soft halo. `roof` is a [u, v] spot kept dark for the roofs to sample.
export function braceWall({ modules, seed, roof = [0.5, 0.2] }) {
  const random = seededRandom(seed);
  const S = 256;
  const H = modules * S;
  const floors = 13; // ~4 m storeys in a 52 m module
  const [colour, base] = canvas(S, H);
  const [glow, light] = canvas(S, H);
  light.fillStyle = '#000';
  light.fillRect(0, 0, S, H);
  const tones = ['#27303f', '#2e394b', '#232c3a', '#34405a', '#2a3446'];
  for (let m = 0; m < modules; m++) {
    const y = H - (m + 1) * S;
    const facets = [
      [[0, 0], [S, 0]],
      [[S, 0], [S, S]],
      [[S, S], [0, S]],
      [[0, S], [0, 0]],
    ];
    for (const [[ax, ay], [bx, by]] of facets) {
      base.fillStyle = tones[Math.floor(random() * tones.length)];
      base.beginPath();
      base.moveTo(ax, y + ay);
      base.lineTo(bx, y + by);
      base.lineTo(S / 2, y + S / 2);
      base.closePath();
      base.fill();
    }
    for (let f = 0; f < floors; f++) {
      const fy = y + (f * S) / floors;
      base.fillStyle = 'rgba(16, 20, 30, 0.55)';
      base.fillRect(0, Math.round(fy), S, 1);
      // Offices behind the tinted glass, a few runs per floor.
      for (let x = 0; x < S; ) {
        const run = 16 + Math.floor(random() * 40);
        if (random() < 0.3) {
          const k = 0.25 + random() * 0.2;
          light.fillStyle = rgb(random() < 0.6 ? COLOURS.cool : COLOURS.neutral, k);
          light.fillRect(x, Math.round(fy + 3), run, Math.round(S / floors - 7));
        }
        x += run;
      }
    }
    base.fillStyle = 'rgba(70, 82, 104, 0.5)';
    for (let i = 1; i < 8; i++) base.fillRect((i * S) / 8, y, 1, S);
  }

  // Braces and module edges: pale steel by day, white light at night.
  // Edges straddle the tile seam, half on each side.
  const braces = (ctx, width, style) => {
    ctx.strokeStyle = style;
    for (let m = 0; m < modules; m++) {
      const y = H - (m + 1) * S;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(S, y + S);
      ctx.moveTo(S, y);
      ctx.lineTo(0, y + S);
      ctx.stroke();
      ctx.lineWidth = width * 2;
      ctx.strokeRect(0, y, S, S);
    }
  };
  braces(base, 6, '#b8c2d4');
  braces(light, 16, 'rgba(255, 255, 255, 0.14)');
  braces(light, 5, '#ffffff');

  const [rx, ry] = [roof[0] * S, H - roof[1] * S];
  base.fillStyle = tones[0];
  base.fillRect(rx - 6, ry - 6, 12, 12);
  light.fillStyle = '#000';
  light.fillRect(rx - 6, ry - 6, 12, 12);

  const repeat = [1, 1 / modules];
  return { map: texture(colour, repeat), emissiveMap: texture(glow, repeat) };
}

// Central Ferry Pier hall: a warm lit hall seen between pale columns, under a
// fascia, `width` × `height` metres per tile, for metre UVs. The columns are
// painted rather than modelled: sub-pixel posts against the glow shimmered on
// phones (user report, 2026-10-02). Columns sit `spacing` apart, centred
// half a spacing in. The tile holds `halls` halls side by side, each its own
// pattern and overall level (`PIER_BAYS.hall`), so the row doesn't read as
// identical lightboxes (user request, 2026-10-04).
export function pierHall({ width, height, spacing, seed, halls = 1 }) {
  const random = seededRandom(seed);
  const P = 16; // texels per metre
  const [w, h] = [width * halls * P, height * P];
  const [colour, base] = canvas(w, h);
  const [glow, light] = canvas(w, h);
  const y = (m) => h - m * P; // metres up from the foot to canvas rows
  const [plinth, fascia] = [0.6, 6.8];

  base.fillStyle = '#3a3028';
  base.fillRect(0, 0, w, h);
  light.fillStyle = '#000';
  light.fillRect(0, 0, w, h);

  base.fillStyle = '#4a3e32';
  base.fillRect(0, y(fascia), w, (fascia - plinth) * P);
  const levels = [];
  const perHall = Math.round(width / spacing);
  for (let hall = 0; hall < halls; hall++) {
    const bays = Array(perHall).fill(PIER_BAYS.lit);
    const scale = PIER_BAYS.hall[0] + random() * (PIER_BAYS.hall[1] - PIER_BAYS.hall[0]);
    // Dark bays in runs of 1–3, so the lit ones gather in clusters.
    const dark = PIER_BAYS.dark.count[0] + Math.floor(random() * (PIER_BAYS.dark.count[1] - PIER_BAYS.dark.count[0] + 1));
    const darkSoFar = () => bays.filter((b) => b === PIER_BAYS.dark).length;
    while (darkSoFar() < dark) {
      const start = Math.floor(random() * perHall);
      const run = Math.min(1 + Math.floor(random() * 3), dark - darkSoFar());
      for (let i = start; i < Math.min(start + run, perHall); i++) bays[i] = PIER_BAYS.dark;
    }
    const bright = PIER_BAYS.bright.count[0] + Math.floor(random() * (PIER_BAYS.bright.count[1] - PIER_BAYS.bright.count[0] + 1));
    for (let n = 0; n < bright; ) {
      const i = Math.floor(random() * perHall);
      if (bays[i] === PIER_BAYS.lit) {
        bays[i] = PIER_BAYS.bright;
        n++;
      }
    }
    for (const level of bays) levels.push([level, scale]);
  }
  levels.forEach(([level, scale], bay) => {
    const x = bay * spacing;
    const [low, high] = level.k;
    // An unlit hall is darker inside too, not just without glow.
    if (level === PIER_BAYS.dark) {
      base.fillStyle = '#241e19';
      base.fillRect(x * P, y(fascia), spacing * P, (fascia - plinth) * P);
    }
    // Brightest under the ceiling, soft at the top and bottom edges.
    const k = (low + random() * (high - low)) * scale;
    const warm = [255, 186 + random() * 14, 110];
    const g = light.createLinearGradient(0, y(fascia), 0, y(plinth));
    g.addColorStop(0, rgb(warm, k * 0.5));
    g.addColorStop(0.15, rgb(warm, k));
    g.addColorStop(0.6, rgb(warm, k * 0.85));
    g.addColorStop(1, rgb(warm, k * 0.45));
    light.fillStyle = g;
    light.fillRect(x * P, y(fascia), spacing * P, (fascia - plinth) * P);
  });

  base.fillStyle = '#8a8070';
  base.fillRect(0, 0, w, y(fascia));
  light.fillStyle = 'rgb(34, 30, 24)';
  light.fillRect(0, 0, w, y(fascia));
  base.fillStyle = '#2a2622';
  base.fillRect(0, y(plinth), w, plinth * P);

  const column = 0.8 * P;
  for (let x = spacing / 2; x < width * halls; x += spacing) {
    base.fillStyle = '#b8b0a0';
    base.fillRect(x * P - column / 2, y(fascia), column, (fascia - plinth) * P);
    light.fillStyle = 'rgb(58, 52, 42)';
    light.fillRect(x * P - column / 2, y(fascia), column, (fascia - plinth) * P);
  }

  const repeat = [1 / (width * halls), 1 / height];
  return { map: texture(colour, repeat), emissiveMap: texture(glow, repeat) };
}

// Pier hall bay levels (user request, 2026-10-04: the halls read as five
// identical lightboxes). Per hall of 12 bays: `count` dark (3–4, 25–33%) and
// bright (1–2) bays, the rest lit; `k` the glow range of each (lit was
// 0.5–0.62 throughout). Each hall's level is scaled by `hall`.
const PIER_BAYS = {
  dark: { count: [3, 4], k: [0.03, 0.09] },
  lit: { k: [0.32, 0.48] },
  bright: { count: [1, 2], k: [0.6, 0.7] },
  hall: [0.85, 1.1],
};

// Shared mipmap bias for every facade: phones take half a level blurrier, so
// detail sliding past mid-scroll strobes less (user report, 2026-10-02).
export const facadeBias = { value: 0 };

// A lit facade: the colour map lit by the scene, the glow map added on top.
// neon: optional { map, color, repeat }, a line mask (red channel) glowing in
// `color`, repeating `repeat` times up the colour map's tile.
// The street light and sky reflection (cityLight.js) are added on top.
export function facadeMaterial({ map, emissiveMap }, glow, { neon } = {}) {
  const material = new MeshLambertMaterial({ color: 0xffffff, map, emissive: 0xffffff, emissiveMap, emissiveIntensity: glow });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uFacadeBias = facadeBias;
    Object.assign(shader.uniforms, cityLight);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vFacadeY;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vec4 facadeWorld = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          facadeWorld = instanceMatrix * facadeWorld;
        #endif
        vFacadeY = ( modelMatrix * facadeWorld ).y;`,
      );
    let emissive = `vec4 facadeGlow = texture2D( emissiveMap, vEmissiveMapUv, uFacadeBias );
      totalEmissiveRadiance *= facadeGlow.rgb;
      float facadeLit = max( max( facadeGlow.r, facadeGlow.g ), facadeGlow.b );
      totalEmissiveRadiance += streetLight( diffuseColor.rgb, vFacadeY );
      totalEmissiveRadiance += skyInGlass( normal, normalize( vViewPosition ), vFacadeY ) * ( 1.0 - smoothstep( 0.05, 0.35, facadeLit ) );`;
    let head = `uniform float uFacadeBias;\nvarying float vFacadeY;\n${cityLightGlsl}`;
    if (neon) {
      Object.assign(shader.uniforms, {
        uNeonMap: { value: neon.map },
        uNeonColor: { value: neon.color },
        uNeonRepeat: { value: neon.repeat },
      });
      head += '\nuniform sampler2D uNeonMap;\nuniform vec3 uNeonColor;\nuniform float uNeonRepeat;';
      emissive += '\ntotalEmissiveRadiance += uNeonColor * texture2D( uNeonMap, vec2( 0.5, vMapUv.y * uNeonRepeat ), uFacadeBias ).r;';
    }
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${head}`)
      .replace('#include <map_fragment>', 'diffuseColor *= texture2D( map, vMapUv, uFacadeBias );')
      .replace('#include <emissivemap_fragment>', emissive);
  };
  material.customProgramCacheKey = () => (neon ? 'facade-neon' : 'facade');
  return material;
}

// A neon line mask: one line `duty` of each period, at its top.
export function neonLines(duty) {
  const [c, ctx] = canvas(4, 32);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 4, 32);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 4, Math.max(1, Math.round(32 * duty)));
  const t = texture(c, [1, 1]);
  t.colorSpace = '';
  return t;
}

// Wall UVs in metres for upright walls: u along the wall, v up from the
// object's origin, so floors run on across stacked tiers. Each face starts
// the pattern `shift` metres further on, so neighbours differ. Roofs sample
// the slab at the foot of the tile.
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
    uv[i * 2 + 1] = position.getY(i);
    if (Math.max(Math.abs(nx), Math.abs(nz)) > 0.99) {
      const facesX = Math.abs(nx) > Math.abs(nz);
      const face = facesX ? (nx > 0 ? 0 : 2) : nz > 0 ? 1 : 3;
      uv[i * 2] = (facesX ? position.getZ(i) : position.getX(i)) + face * shift;
      continue;
    }
    // Angled walls: along the wall's own direction.
    const length = Math.hypot(nx, nz);
    const face = 4 + ((Math.round(Math.atan2(nz, nx) / (Math.PI / 6)) + 12) % 12);
    uv[i * 2] = (position.getZ(i) * nx - position.getX(i) * nz) / length + face * shift;
  }
  geometry.attributes.uv.array.set(uv);
  geometry.attributes.uv.needsUpdate = true;
  return geometry;
}
