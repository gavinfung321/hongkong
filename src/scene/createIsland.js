import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Points,
  Quaternion,
  ShaderMaterial,
  Shape,
  TorusGeometry,
  Vector2,
  Vector3,
} from 'three';
import { PALETTE, basic, lambert } from './palette.js';
import { addCityWindows } from './cityWindows.js';
import { createMountains } from './createMountains.js';
import { createCityDots } from './cityDots.js';
import { createBeacons, createLandmarks, mastMesh } from './landmarks.js';
import { prism } from './prism.js';
import { curtainWall, facadeMaterial, facadeUVs, pierHall } from './facades.js';
import { WORLD } from '../data/world.js';
import { seededRandom } from './random.js';
import { strut } from './strut.js';
import { hubGlow } from './surfaces.js';

const unitBox = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
const SKYLINE_STRENGTH = 0.7;
// Dimmer than IFC and capped well below its 50%, so IFC leads (user choice,
// 2026-10-02; was 30% lit, up to ~50%, strength 0.9). Close-up windows peak
// lower, so 04–06 don't sparkle like IFC (user choice, 2026-10-02). The
// same light spread evenly: every tower 5–12% lit and only 10% almost dark,
// so no tower is crowded with lights beside unlit ones (user choice,
// 2026-10-02; was 0.5–20% with 40% dark). Then about half again, 3–6% per
// tower, as the other towers still drew the eye in 01–03 and 05–06 (user
// request, 2026-10-02; was 5–12%). Lights clustered in offices and 45% of
// towers in ribbon-glazed curtain walls, same light (user choice,
// 2026-10-02: realism step 4).
const SKYLINE_WINDOWS = {
  lit: 0.045,
  maxLit: 0.065,
  vary: 0.8,
  dark: 0.1,
  strength: SKYLINE_STRENGTH,
  close: 0.7,
  ribbon: 0.45,
};

function createSlab() {
  const [x0, x1, z0, z1, top] = WORLD.island.slab;
  const mesh = new Mesh(unitBox, lambert(0x1d1b29));
  mesh.position.set((x0 + x1) / 2, top - 6, (z0 + z1) / 2);
  mesh.scale.set(x1 - x0, 6, z1 - z0);
  return mesh;
}

function createSkyline() {
  const { x, z, count, maxHeight, peakX, seed } = WORLD.island.skyline;
  const [ifcX, , ifcZ] = WORLD.ifc.position;
  const [wheelX, , wheelZ] = WORLD.wheel.position;
  const random = seededRandom(seed);
  const material = addCityWindows(new MeshLambertMaterial({ color: 0xffffff }), SKYLINE_WINDOWS);
  const mesh = new InstancedMesh(unitBox, material, count);
  const matrix = new Matrix4();
  const q = new Quaternion();
  const color = new Color();
  const dark = new Color(PALETTE.proxyDark);
  const mid = new Color(PALETTE.proxyMid);
  const warm = new Color(0x6e5a4c);

  // Landmark footprints, [x, z, half reach]: towers there step aside.
  const { boc, cheungKong, centralPlaza, center } = WORLD.landmarks;
  const clear = [
    [boc.position, boc.side / 2 + 30],
    [cheungKong.position, cheungKong.side / 2 + 30],
    [centralPlaza.position, centralPlaza.radius + 30],
    [center.position, center.half + 30],
  ].map(([[lx, , lz], r]) => [lx, lz, r]);

  const buildings = [];
  for (let i = 0; i < count; i++) {
    let px = x[0] + random() * (x[1] - x[0]);
    const pz = z[0] + Math.pow(random(), 0.8) * (z[1] - z[0]);
    if (Math.abs(px - ifcX) < 70 && Math.abs(pz - ifcZ) < 70) px += px < ifcX ? -80 : 80;
    if (Math.abs(px - wheelX) < 45 && pz > wheelZ - 60) px += px < wheelX ? -50 : 50;
    for (const [lx, lz, r] of clear) {
      if (Math.abs(px - lx) < r && Math.abs(pz - lz) < r) px += px < lx ? -(r + 10) : r + 10;
    }
    const d = (px - peakX) / 480;
    const h = Math.min(maxHeight, 30 + 230 * Math.exp(-d * d) * (0.45 + 0.55 * random()) + random() * 35);
    const w = 18 + random() * 30;
    const depth = 18 + random() * 30;
    matrix.compose(new Vector3(px, 3, pz), q, new Vector3(w, h, depth));
    mesh.setMatrixAt(i, matrix);
    color.copy(dark).lerp(mid, 0.25 + random() * 0.5);
    if (random() < 0.12) color.lerp(warm, 0.6);
    mesh.setColorAt(i, color);
    buildings.push({ x: px, z: pz, w, h, depth, color: color.clone() });
  }
  mesh.name = 'skyline';
  return { mesh, buildings };
}

// Varied tops on the skyline towers (user choice, 2026-10-02): narrower
// upper sections, lit roof bands, a few pyramid roofs, and masts with red
// warning lights on the tallest. Drawn from their own random sequence, so
// the towers themselves don't move.
const TOPS = {
  setback: { minHeight: 90, share: 0.35, width: [0.55, 0.2], rise: [0.1, 0.1] },
  crown: { minHeight: 100, share: 0.25, height: 2.5, inset: 0.92, warm: 0xffd9a0, cool: 0xcfe0ff, glow: [0.3, 0.2] },
  pyramid: { minHeight: 110, share: 0.1, rise: 0.5 },
  mast: { minHeight: 140, share: 0.3, height: [15, 25] },
};
// LED colour on the skyline, as on the real harbour front (user request,
// 2026-10-03: the storyboard's towers glow magenta, cyan and red; ours were
// dark with sparse windows). A share of the crowns turn a restrained LED
// colour and grow taller; a share of the tall towers get vertical strips up
// their two harbour-facing corners, from `from` of their height to the roof.
// All dimmer than IFC's lit glass (glow ≤ 0.7 against its 0.85–1), so IFC
// still leads. Drawn from their own random sequence, so no tower changes.
const LED = {
  colours: [0xff3d8b, 0x38d6ff, 0xff5a3c, 0xb06bff, 0xffb347],
  crown: { share: 0.5, height: 6, glow: [0.5, 0.2] },
  strip: { minHeight: 120, share: 0.2, width: 2.4, from: [0.3, 0.3], glow: [0.38, 0.2] },
};

function createTops(buildings, windowMaterial, seed) {
  const random = seededRandom(seed);
  const ledRandom = seededRandom(seed + 7);
  const ledColour = (glow) =>
    new Color(LED.colours[Math.floor(ledRandom() * LED.colours.length)]).multiplyScalar(glow[0] + glow[1] * ledRandom());
  const setbacks = [];
  const crowns = [];
  const pyramids = [];
  const masts = [];
  const warm = new Color(TOPS.crown.warm);
  const cool = new Color(TOPS.crown.cool);
  for (const b of buildings) {
    const rolls = [random(), random(), random(), random(), random(), random()];
    let roof = b.h;
    let w = b.w;
    let depth = b.depth;
    // The upper section is inset at least 2 m from the walls below.
    if (b.h > TOPS.setback.minHeight && rolls[0] < TOPS.setback.share) {
      const scale = TOPS.setback.width[0] + TOPS.setback.width[1] * rolls[1];
      const rise = b.h * (TOPS.setback.rise[0] + TOPS.setback.rise[1] * rolls[2]);
      w *= scale;
      depth *= scale;
      setbacks.push({ ...b, y: roof, w, h: rise, depth });
      roof += rise;
    }
    if (b.h > LED.strip.minHeight && ledRandom() < LED.strip.share) {
      const color = ledColour(LED.strip.glow);
      const from = b.h * (LED.strip.from[0] + LED.strip.from[1] * ledRandom());
      for (const side of [-1, 1]) {
        crowns.push({ x: b.x + (side * b.w) / 2, z: b.z + b.depth / 2, y: from, w: LED.strip.width, h: b.h - from, depth: LED.strip.width, color });
      }
    }
    if (b.h > TOPS.crown.minHeight && rolls[3] < TOPS.crown.share) {
      const led = ledRandom() < LED.crown.share;
      const tint = led
        ? ledColour(LED.crown.glow)
        : (rolls[4] < 0.3 ? cool : warm).clone().multiplyScalar(TOPS.crown.glow[0] + TOPS.crown.glow[1] * rolls[5]);
      const h = led ? LED.crown.height : TOPS.crown.height;
      crowns.push({ x: b.x, z: b.z, y: roof, w: w * TOPS.crown.inset, h, depth: depth * TOPS.crown.inset, color: tint });
    } else if (b.h > TOPS.pyramid.minHeight && rolls[3] < TOPS.crown.share + TOPS.pyramid.share) {
      pyramids.push({ x: b.x, z: b.z, y: roof, w, h: w * TOPS.pyramid.rise, depth, color: b.color });
      continue;
    }
    if (roof > TOPS.mast.minHeight && rolls[4] < TOPS.mast.share) {
      masts.push([[b.x, 3 + roof, b.z], TOPS.mast.height[0] + TOPS.mast.height[1] * rolls[5], 2]);
    }
  }

  const matrix = new Matrix4();
  const q = new Quaternion();
  const instanced = (geometry, material, list, name) => {
    const mesh = new InstancedMesh(geometry, material, Math.max(list.length, 1));
    mesh.count = list.length;
    list.forEach((t, i) => {
      mesh.setMatrixAt(i, matrix.compose(new Vector3(t.x, 3 + (t.y ?? 0), t.z), q, new Vector3(t.w, t.h, t.depth)));
      if (t.color) mesh.setColorAt(i, t.color);
    });
    mesh.name = name;
    return mesh;
  };
  const crownMaterial = new MeshBasicMaterial({ color: 0xffffff });
  const pyramidGeometry = new ConeGeometry(Math.SQRT1_2, 1, 4).rotateY(Math.PI / 4).translate(0, 0.5, 0);
  const group = new Group();
  group.name = 'skylineTops';
  group.add(
    instanced(unitBox, windowMaterial, setbacks, 'skylineSetbacks'),
    instanced(unitBox, crownMaterial, crowns, 'skylineCrowns'),
    instanced(pyramidGeometry, new MeshLambertMaterial({ color: 0xffffff }), pyramids, 'skylinePyramids'),
  );
  const beacons = masts.map(([[x, y, z], height]) => [x, y + height + 1, z]);
  return { group, masts, beacons, crownMaterial };
}

// ---- Waterfront lights ---------------------------------------------------------

// A line of lamps along Central's harbour front (user request, 2026-10-03:
// the storyboard has a bright band where the city meets the water; ours was
// a thin dim line). Dots of a fixed pixel size, `spacing` metres apart with
// a few gaps, warm with every `brightEvery`th a brighter cool white, fogged
// like the skyline. Piers and podium in front hide them.
const WATERFRONT = { height: 7, spacing: 6, gap: 0.12, size: 3, warm: 0xffd2a0, cool: 0xe8f0ff, glow: [0.8, 1.15], brightEvery: 5, setback: 2 };

function createWaterfront(seed) {
  const [x0, x1, , front] = WORLD.island.slab;
  const random = seededRandom(seed);
  const warm = new Color(WATERFRONT.warm);
  const cool = new Color(WATERFRONT.cool);
  const position = [];
  const color = [];
  let i = 0;
  for (let x = x0; x <= x1; x += WATERFRONT.spacing, i++) {
    if (random() < WATERFRONT.gap) continue;
    const bright = i % WATERFRONT.brightEvery === 0;
    position.push(x + (random() - 0.5) * 2, 3 + WATERFRONT.height, front - WATERFRONT.setback);
    const c = (bright ? cool : warm).clone().multiplyScalar(WATERFRONT.glow[bright ? 1 : 0] * (0.85 + 0.3 * random()));
    color.push(c.r, c.g, c.b);
  }
  return lightDots(position, color, WATERFRONT.size, 'waterfrontLights');
}

// Far shore past the skyline's east end (user choice, 2026-10-03): sparse
// low-rise lights on the island's east side, in a few rows `spacing`
// metres apart along runs [x, z] → [x, z], over a dark strip of land
// `land` metres deep. The run stops where the ridge comes down to the
// water in desktop 02, so no lights stand on the open sea (user request,
// 2026-10-03; a Kowloon East run across the water was removed). `fog`
// thins the fog on the lights so the far end still reads.
const FAR_SHORE = {
  runs: [{ from: [1400, -1120], to: [1900, -1155], rows: 3, height: 34 }],
  spacing: 8,
  gap: 0.5,
  size: 2.5,
  glow: 1.4,
  land: { depth: 160, height: 8 },
  fog: 0.6,
};

function createFarShore(seed) {
  const random = seededRandom(seed);
  const warm = new Color(WATERFRONT.warm);
  const cool = new Color(WATERFRONT.cool);
  const position = [];
  const color = [];
  const land = new Group();
  for (const { from, to, rows, height } of FAR_SHORE.runs) {
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const strip = new Mesh(unitBox, lambert(0x1d1b29));
    strip.scale.set(length, FAR_SHORE.land.height, FAR_SHORE.land.depth);
    strip.rotation.y = -Math.atan2(to[1] - from[1], to[0] - from[0]);
    strip.position.set((from[0] + to[0]) / 2, 0, (from[1] + to[1]) / 2 - FAR_SHORE.land.depth / 2 + 10);
    land.add(strip);
    for (let row = 0; row < rows; row++) {
      for (let s = 0; s < length; s += FAR_SHORE.spacing) {
        if (random() < FAR_SHORE.gap + row * 0.12) continue;
        const t = s / length;
        const back = row * 25 + random() * 20;
        position.push(
          from[0] + (to[0] - from[0]) * t + (random() - 0.5) * 6,
          3 + 4 + random() * height * (row + 1) / rows,
          from[1] + (to[1] - from[1]) * t - back,
        );
        const c = (random() < 0.2 ? cool : warm).clone().multiplyScalar(FAR_SHORE.glow * (0.6 + 0.6 * random()));
        color.push(c.r, c.g, c.b);
      }
    }
  }
  const dots = lightDots(position, color, FAR_SHORE.size, 'farShoreLights', FAR_SHORE.fog);
  land.add(dots.points);
  land.name = 'farShore';
  return { group: land, setLevel: dots.setLevel };
}

function lightDots(position, color, size, name, fog = 1) {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(position, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(color, 3));
  const material = new ShaderMaterial({
    uniforms: { uSize: { value: size }, uFog: { value: 0 }, uLevel: { value: 1 } },
    vertexShader: `
      uniform float uSize;
      uniform float uFog;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        float depth = -mvPosition.z;
        vColor = color * exp( -uFog * uFog * depth * depth );
        gl_PointSize = uSize;
        gl_Position = projectionMatrix * mvPosition;
      }`,
    fragmentShader: `
      uniform float uLevel;
      varying vec3 vColor;
      void main() {
        float d = length( gl_PointCoord - 0.5 ) * 2.0;
        gl_FragColor = vec4( vColor * uLevel * smoothstep( 1.0, 0.0, d ), 1.0 );
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const points = new Points(geometry, material);
  points.name = name;
  points.userData.noProbe = true;
  points.onBeforeRender = (renderer, scene) => {
    material.uniforms.uSize.value = size * renderer.getPixelRatio();
    material.uniforms.uFog.value = (scene.fog?.density ?? 0) * fog;
  };
  return {
    points,
    setLevel(value) {
      material.uniforms.uLevel.value = value;
    },
  };
}

// ---- Two IFC ------------------------------------------------------------------

// Plan of one IFC tier: a square with recessed corners and, on the upper
// tiers, a slot down the middle of each face. Every wall faces x or z, which
// the window grid needs.
function ifcPlan(half, notch, slot = 0, depth = 0) {
  const side = [[half, -(half - notch)]];
  if (slot) side.push([half, -slot], [half - depth, -slot], [half - depth, slot], [half, slot]);
  side.push([half, half - notch], [half - notch, half - notch]);
  const points = [];
  for (let k = 0; k < 4; k++) {
    for (let [u, v] of side) {
      for (let i = 0; i < k; i++) [u, v] = [-v, u];
      points.push(new Vector2(u, v));
    }
  }
  return new Shape(points);
}

// [bottom, top, half width, corner notch]. Straight to 285 m, then shallow
// setbacks that round the top off like the real tower's; the crown fins
// take it to about 413 m (412 m in life).
const IFC_TIERS = [
  [0, 285, 28.5, 4],
  [285, 310, 27, 3.8],
  [310, 331, 25.5, 3.6],
  [331, 349, 24, 3.4],
  [349, 364, 22.5, 3.2],
  [364, 376, 21, 3],
  [376, 386, 19.5, 2.8],
  [386, 394, 18, 2.6],
];
const IFC_SLOT = [1.5, 1.5]; // half width, depth
const IFC_BANDS = [64, 128, 192, 256]; // bronze refuge-floor bands
const IFC_GLOW = [0.85, 1]; // lit glass: shaft, upper tiers
const FIN_TIP = 0.15; // fin brightness at the tip, against 1 at the foot

// Uplit crown (user choice, 2026-10-02): floodlights at the fins' feet, so
// each fin is brightest at its base and fades toward its tip. The blade's
// own height runs 0 to 1 before each instance stretches it.
function upliftFins(material) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vFinUp;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFinUp = position.y;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vFinUp;')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        float finLight = mix( 1.0, ${FIN_TIP.toFixed(2)}, pow( clamp( vFinUp, 0.0, 1.0 ), 1.5 ) );
        totalEmissiveRadiance *= finLight;
        diffuseColor.rgb *= finLight;`,
      );
  };
  material.customProgramCacheKey = () => 'ifc-fins';
  return material;
}

function createIFC() {
  const ifc = new Group();
  ifc.name = 'ifc';
  // Painted curtain wall (user choice, 2026-10-02; was the shared window-grid
  // shader, which twinkled on phones while scrolling). The shaft tile covers
  // its full height and a whole face, so nothing repeats on screen.
  const cell = { bay: 2.6, floor: 4.6 };
  const glass = facadeMaterial(curtainWall({ ...cell, bays: 32, floors: 64, lit: 0.5, coolShare: 0.45, seed: 412 }), IFC_GLOW[0]);
  // The top floors are the brightest at night, and the last three tiers are
  // floodlit white under the crown.
  const glassHigh = facadeMaterial(curtainWall({ ...cell, bays: 32, floors: 32, lit: 0.75, coolShare: 0.6, seed: 413 }), IFC_GLOW[1]);
  const floodlit = new MeshLambertMaterial({ color: 0xe6ecf6, emissive: 0x9aa8c4 });
  const tierMaterial = (i) => (i === 0 ? glass : i >= IFC_TIERS.length - 3 ? floodlit : glassHigh);

  const m = new Matrix4();
  const q = new Quaternion();
  const piers = new InstancedMesh(unitBox, new MeshLambertMaterial({ color: 0xc9cfdb, emissive: 0x4f5768 }), IFC_TIERS.length * 4);
  IFC_TIERS.forEach(([y0, y1, half, notch], i) => {
    const plan = i === 0 ? ifcPlan(half, notch) : ifcPlan(half, notch, ...IFC_SLOT);
    const geometry = prism(plan, y0, y1);
    if (tierMaterial(i) !== floodlit) facadeUVs(geometry);
    ifc.add(new Mesh(geometry, tierMaterial(i)));
    // Pale corner piers keep each corner square in silhouette, with the recess behind.
    [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sz], k) => {
      piers.setMatrixAt(i * 4 + k, m.compose(new Vector3(sx * (half - 0.8), y0, sz * (half - 0.8)), q, new Vector3(1.6, y1 - y0, 1.6)));
    });
  });

  // Bands stand 0.6 m proud of the glass: at 1.2 km the depth buffer only
  // separates surfaces about 0.2 m apart.
  const [, , shaftHalf, shaftNotch] = IFC_TIERS[0];
  const bronze = new MeshLambertMaterial({ color: 0x5a4630, emissive: 0x2a1d10 });
  for (const y of IFC_BANDS) ifc.add(new Mesh(prism(ifcPlan(shaftHalf + 0.6, shaftNotch), y, y + 2.4), bronze));

  // Crown: a lit core ringed by tapering fins, floodlit cool white, tallest at
  // the corners and dipping toward the slot in the middle of each face.
  const [, roof, topHalf] = IFC_TIERS[IFC_TIERS.length - 1];
  const core = new Mesh(prism(ifcPlan(topHalf - 3, 2), roof - 1, roof + 7), basic(0xbfcbe0));
  const blade = new Shape([new Vector2(-1.4, 0), new Vector2(1.4, 0), new Vector2(0.2, 1), new Vector2(-0.2, 1)]);
  const finGeometry = new ExtrudeGeometry(blade, { depth: 0.8, bevelEnabled: false }).translate(0, 0, -0.4);
  const finOffsets = [[15, 19], [9, 15], [3, 12], [-3, 12], [-9, 15], [-15, 19]];
  const fins = new InstancedMesh(finGeometry, upliftFins(new MeshLambertMaterial({ color: 0xffffff, emissive: 0xc9d4e8 })), finOffsets.length * 4);
  const lean = new Quaternion();
  for (let k = 0; k < 4; k++) {
    const yaw = (k * Math.PI) / 2;
    const facing = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), yaw);
    // Each fin leans 5° in toward the centre.
    lean.setFromAxisAngle(new Vector3(1, 0, 0), -0.09).premultiply(facing);
    finOffsets.forEach(([along, height], j) => {
      const local = new Vector3(along, roof, topHalf - 0.4).applyQuaternion(facing);
      fins.setMatrixAt(k * finOffsets.length + j, m.compose(local, lean, new Vector3(1, height, 1)));
    });
  }

  ifc.add(piers, core, fins);
  const [x, y, z] = WORLD.ifc.position;
  ifc.position.set(x, y, z);
  return ifc;
}

// IFC Mall: the low podium at the tower's foot, kept out of the IFC group so
// the composition probe measures the tower alone. Painted like the tower
// (user request, 2026-10-02; the window shader twinkled on phones): four
// retail floors, warmer and a little dimmer than IFC.
const PODIUM_GLOW = 0.7;

function createPodium() {
  const [x0, x1, z0, z1, height] = WORLD.ifc.podium;
  const floors = 4;
  const skin = curtainWall({ bay: 4, floor: height / floors, bays: 32, floors, lit: 0.6, coolShare: 0.25, level: [0.55, 0.85], seed: 451 });
  const geometry = facadeUVs(new BoxGeometry(x1 - x0, height, z1 - z0).translate(0, height / 2, 0));
  const podium = new Mesh(geometry, facadeMaterial(skin, PODIUM_GLOW));
  podium.position.set((x0 + x1) / 2, WORLD.island.slab[4], (z0 + z1) / 2);
  podium.name = 'ifcPodium';
  return podium;
}

// Central Ferry Piers: a row of pavilions out over the water, each a warm lit
// hall behind a colonnade under a pitched green roof. The colonnade is
// painted on the hall (user request, 2026-10-02; modelled posts shimmered on
// phones).
const PIER_HALL = [36, 8, 18]; // width, height, depth in metres

function createPiers() {
  const { x: xs, z, depth } = WORLD.piers;
  const top = WORLD.island.slab[4];
  const count = xs.length;
  const m = new Matrix4();
  const q = new Quaternion();
  const instanced = (geometry, material, n) => new InstancedMesh(geometry, material, n);

  const decks = instanced(unitBox, lambert(0x24222e), count);
  const [hallW, hallH, hallD] = PIER_HALL;
  // Every face starts the tile a whole hall width on, so columns line up round the corners.
  const hallGeometry = facadeUVs(new BoxGeometry(hallW, hallH, hallD).translate(0, hallH / 2, 0), hallW);
  const halls = instanced(hallGeometry, facadeMaterial(pierHall({ width: hallW, height: hallH, spacing: 3, seed: 529 }), 1), count);
  const roofs = instanced(unitBox, new MeshLambertMaterial({ color: 0x3e5a4a, emissive: 0x0f1a14 }), count);
  const ridge = new Shape([new Vector2(-11, 0), new Vector2(11, 0), new Vector2(0, 4)]);
  const ridgeGeometry = new ExtrudeGeometry(ridge, { depth: 38, bevelEnabled: false }).translate(0, 0, -19).rotateY(Math.PI / 2);
  const ridges = instanced(ridgeGeometry, roofs.material, count);

  xs.forEach((x, i) => {
    // The deck starts 1 m under the water so its sides cut the surface cleanly.
    decks.setMatrixAt(i, m.compose(new Vector3(x, -1, z - 1), q, new Vector3(44, top + 1, depth + 2)));
    halls.setMatrixAt(i, m.compose(new Vector3(x, top, z - 1), q, new Vector3(1, 1, 1)));
    roofs.setMatrixAt(i, m.compose(new Vector3(x, top + hallH, z - 1), q, new Vector3(40, 1, 22)));
    ridges.setMatrixAt(i, m.compose(new Vector3(x, top + hallH + 1, z - 1), q, new Vector3(1, 1, 1)));
  });

  const group = new Group();
  group.name = 'piers';
  group.add(decks, halls, roofs, ridges);
  return group;
}

// ---- Observation Wheel -----------------------------------------------------------

const WHEEL_TURN = 240; // seconds per revolution
const WHEEL_GONDOLAS = 42;
const WHEEL_RIM = 1.1; // half the rim truss depth
const WHEEL_FLANGE = 3.4; // hub flange offset, where the spokes start

// The Hong Kong Observation Wheel: a lit red truss rim on cable spokes from a
// wide glowing hub, 42 upright gondolas, white A-frame legs and a boarding
// platform with tents. No sponsor banners or lettering.
function createWheel() {
  const wheel = new Group();
  wheel.name = 'wheel';
  const { radius: r, hub: hubY } = WORLD.wheel;
  const neon = basic(0xff3b64, { toneMapped: false });

  const rotor = new Group();
  rotor.position.y = hubY;
  for (const z of [-WHEEL_RIM, WHEEL_RIM]) {
    const ring = new Mesh(new TorusGeometry(r, 0.32, 5, 96), neon);
    ring.position.z = z;
    rotor.add(ring);
  }
  const lacing = [];
  for (let i = 0; i < 84; i++) {
    const a = (i / 84) * Math.PI * 2;
    const b = ((i + 1) / 84) * Math.PI * 2;
    lacing.push(Math.cos(a) * r, Math.sin(a) * r, WHEEL_RIM, Math.cos(b) * r, Math.sin(b) * r, -WHEEL_RIM);
  }
  const spokes = [];
  for (let i = 0; i < 28; i++) {
    for (const side of [1, -1]) {
      const a = ((i + (side > 0 ? 0 : 0.5)) / 28) * Math.PI * 2;
      spokes.push(Math.cos(a) * 1.5, Math.sin(a) * 1.5, side * WHEEL_FLANGE, Math.cos(a) * r, Math.sin(a) * r, side * WHEEL_RIM);
    }
  }
  const lines = (points, color) => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
    const line = new LineSegments(geometry, new LineBasicMaterial({ color, toneMapped: false }));
    line.userData.noProbe = true;
    return line;
  };
  rotor.add(lines(lacing, 0xd8405e), lines(spokes, 0x9a6676));

  const hub = new Mesh(new CylinderGeometry(3.2, 3.2, WHEEL_FLANGE * 2, 20), lambert(0xe8e6ec));
  hub.rotation.x = Math.PI / 2;
  hub.position.y = hubY;
  const disc = new Mesh(new CircleGeometry(3, 32), basic(0xffffff, { toneMapped: false }));
  disc.position.set(0, hubY, WHEEL_FLANGE + 0.5);
  const halo = new Mesh(
    new CircleGeometry(10, 32),
    new MeshBasicMaterial({ map: hubGlow(), transparent: true, depthWrite: false, blending: AdditiveBlending, toneMapped: false }),
  );
  halo.position.set(0, hubY, WHEEL_FLANGE + 1.2);
  halo.userData.noProbe = true;

  // Thick white tubes, an A-frame in front of the rim and one behind it.
  const legs = new InstancedMesh(
    new CylinderGeometry(1, 1, 1, 10).translate(0, 0.5, 0),
    new MeshLambertMaterial({ color: 0xe8e6ec, emissive: 0x3a3842 }),
    4,
  );
  [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sz], i) => {
    legs.setMatrixAt(i, strut([sx * 15.5, 1.2, sz * 7.5], [sx * 0.8, hubY, sz * (WHEEL_FLANGE + 0.6)], 0.8));
  });

  const m = new Matrix4();
  const q = new Quaternion();
  const platform = new Mesh(unitBox, lambert(0x2c2838));
  platform.scale.set(46, 1.2, 12);
  const tents = new InstancedMesh(unitBox, new MeshLambertMaterial({ color: 0xe6e2da, emissive: 0x6a5a48 }), 5);
  const tentRoofs = new InstancedMesh(
    new ConeGeometry(3.6, 2.4, 4).rotateY(Math.PI / 4).translate(0, 1.2, 0),
    new MeshLambertMaterial({ color: 0xf4f0ea, emissive: 0x4a4038 }),
    5,
  );
  for (let i = 0; i < 5; i++) {
    const x = -14 + i * 7;
    tents.setMatrixAt(i, m.compose(new Vector3(x, 1.2, 3), q, new Vector3(5, 2.4, 5)));
    tentRoofs.setMatrixAt(i, m.compose(new Vector3(x, 3.6, 3), q, new Vector3(1, 1, 1)));
  }

  const gondolas = new InstancedMesh(new BoxGeometry(2.3, 2.6, 2.3), basic(0x8f78f0), WHEEL_GONDOLAS);
  const position = new Vector3();
  const unit = new Vector3(1, 1, 1);
  function turn(angle) {
    rotor.rotation.z = angle;
    for (let i = 0; i < WHEEL_GONDOLAS; i++) {
      const a = angle + (i / WHEEL_GONDOLAS) * Math.PI * 2;
      // Hung outside the rim and always upright.
      position.set(Math.cos(a) * (r + 2), hubY + Math.sin(a) * (r + 2), 0);
      gondolas.setMatrixAt(i, m.compose(position, q, unit));
    }
    gondolas.instanceMatrix.needsUpdate = true;
  }
  turn(0);

  wheel.add(rotor, hub, disc, halo, legs, platform, tents, tentRoofs, gondolas);
  const [x, y, z] = WORLD.wheel.position;
  wheel.position.set(x, y, z);
  return { wheel, turn };
}

export function createIsland() {
  const group = new Group();
  group.name = 'island';
  const { mesh: skyline, buildings } = createSkyline();
  const tops = createTops(buildings, skyline.material, WORLD.island.skyline.seed + 101);
  const landmarks = createLandmarks();
  const beacons = createBeacons([...tops.beacons, ...landmarks.beacons]);
  const masts = mastMesh([...tops.masts, ...landmarks.masts]);
  const dots = createCityDots(buildings, SKYLINE_WINDOWS, WORLD.island.skyline.seed + 202);
  const waterfront = createWaterfront(WORLD.island.skyline.seed + 303);
  const farShore = createFarShore(WORLD.island.skyline.seed + 404);
  group.add(createSlab(), skyline, tops.group, landmarks.group, masts, beacons.points, dots.points, waterfront.points, farShore.group);
  const mountains = createMountains();
  group.add(mountains.group);

  const ifc = createIFC();
  const { wheel, turn } = createWheel();
  group.add(ifc, createPodium(), createPiers(), wheel);

  // Continuous mode only; in reduced motion the wheel, mist, beacons and
  // landmark colours hold still.
  function update(time) {
    turn((time / WHEEL_TURN) * Math.PI * 2);
    mountains.update(time);
    landmarks.update(time);
    beacons.update(time);
  }

  // Skyline and landmark light level per chapter (`city` in each chapter's
  // visibility): 05 dims the towers around IFC (user choice, 2026-10-02).
  // `accents` (default 1) dims only the LED crowns and strips and the four
  // landmarks on top of that, so in 05 they step down to IFC without the
  // windows going dark (user choice, 2026-10-03).
  const skylineWindows = skyline.material.userData.cityWindows;
  let cityLevel = 1;
  let accentLevel = 1;
  function applyLevels() {
    skylineWindows.uCityStrength.value = SKYLINE_STRENGTH * cityLevel;
    tops.crownMaterial.color.setScalar(cityLevel * accentLevel);
    dots.setLevel(cityLevel);
    waterfront.setLevel(cityLevel);
    farShore.setLevel(cityLevel);
    landmarks.setLevel(cityLevel * accentLevel);
  }
  function setCityLevel(value) {
    cityLevel = value;
    applyLevels();
  }
  function setAccentLevel(value) {
    accentLevel = value;
    applyLevels();
  }

  return { group, ifc, wheel, update, setCityLevel, setAccentLevel, setSlopeLights: mountains.setLightLevel };
}
