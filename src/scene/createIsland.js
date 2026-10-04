import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
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
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  Quaternion,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
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
  // Muted to 0.6 (atmospheric depth Priority E, user choice, 2026-10-04), so
  // the frame keeps one warm accent.
  level: 0.6,
};

// 05's light wave (user choice, 2026-10-04): every `period` seconds a band
// of light `width` metres wide runs left to right along the skyline from x
// `from` to `to` in `travel` seconds, flaring the LED crowns and strips it
// passes in their own colours (`gain`, added on top of their dimmed level),
// and IFC's crown fins as it crosses IFC (`flare`, falling off over
// `flareWidth` metres). The first wave starts `first` seconds after the
// chapter arrives. A followed light source lays it on the water
// (waterReflections.js). Still in reduced motion: no wave.
const WAVE = { period: 10, travel: 3.2, first: 1.2, from: -200, to: 1200, width: 70, gain: 1.3, flare: 1.4, flareWidth: 90 };
export const lightWave = {
  uWaveX: { value: -1e5 },
  uWaveGain: { value: 0 },
  uWaveWidth: { value: WAVE.width },
  uFinFlare: { value: 0 },
};

function waveCrowns(material) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, lightWave);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vWaveX;')
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        vec4 waveWorld = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          waveWorld = instanceMatrix * waveWorld;
        #endif
        vWaveX = ( modelMatrix * waveWorld ).x;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vWaveX;\nuniform float uWaveX;\nuniform float uWaveGain;\nuniform float uWaveWidth;')
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        {
          float d = ( vWaveX - uWaveX ) / uWaveWidth;
          #if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
            diffuseColor.rgb += vColor.rgb * uWaveGain * exp( -d * d );
          #else
            diffuseColor.rgb += uWaveGain * exp( -d * d );
          #endif
        }`,
      );
  };
  material.customProgramCacheKey = () => 'skyline-crowns-wave';
  return material;
}

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
  const crownMaterial = waveCrowns(new MeshBasicMaterial({ color: 0xffffff }));
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

// Lamps along Central's harbour front (user request, 2026-10-03: the
// storyboard has a bright band where the city meets the water). Not a row:
// a straight line of even dots read as fake (user request, 2026-10-04), so
// they stand in small clusters (`cluster` lamps, `step` m apart) with dark
// stretches of `gap` m between, at street level (`street` m up) or, a
// `podiumShare` of them, higher on podium fronts (`podium`), set back
// `setback` m; mostly warm, a `coolShare` cool white. Fixed pixel size,
// fogged like the skyline. Piers and podium in front hide them.
const WATERFRONT = {
  cluster: [1, 4],
  step: [3, 6],
  gap: [25, 70],
  street: [4, 8],
  podium: [9, 16],
  podiumShare: 0.3,
  setback: [1, 8],
  coolShare: 0.15,
  size: 3,
  warm: 0xffd2a0,
  cool: 0xe8f0ff,
  glow: [0.45, 0.8],
};

function createWaterfront(seed) {
  const [x0, x1, , front] = WORLD.island.slab;
  const random = seededRandom(seed);
  const between = ([low, high]) => low + random() * (high - low);
  const warm = new Color(WATERFRONT.warm);
  const cool = new Color(WATERFRONT.cool);
  const position = [];
  const color = [];
  for (let x = x0 + between(WATERFRONT.gap) / 2; x <= x1; x += between(WATERFRONT.gap)) {
    const count = Math.floor(between([WATERFRONT.cluster[0], WATERFRONT.cluster[1] + 1]));
    const podium = random() < WATERFRONT.podiumShare;
    const setback = between(WATERFRONT.setback);
    for (let n = 0; n < count && x <= x1; n++, x += between(WATERFRONT.step)) {
      position.push(x, 3 + between(podium ? WATERFRONT.podium : WATERFRONT.street), front - setback - random() * 2);
      const c = (random() < WATERFRONT.coolShare ? cool : warm).clone().multiplyScalar(between(WATERFRONT.glow));
      color.push(c.r, c.g, c.b);
    }
  }
  return lightDots(position, color, WATERFRONT.size, 'waterfrontLights');
}

// Far shore past the skyline's east end (user choice, 2026-10-03): sparse
// low-rise lights on the island's east side, in a few rows `spacing`
// metres apart along runs [x, z] → [x, z], over a dark strip of land
// `land` metres deep. The run stops where the ridge comes down to the
// water in desktop 02, so no lights stand on the open sea (user request,
// 2026-10-03; a Kowloon East run across the water was removed). `fog`
// thins the fog on the lights so the far end still reads. Thinned to about
// half (user request, 2026-10-04: too many spots; was spacing 8, gap 0.5).
const FAR_SHORE = {
  runs: [{ from: [1400, -1120], to: [1900, -1155], rows: 3, height: 34 }],
  spacing: 12,
  gap: 0.62,
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
// 05's light wave flares them as it passes (`uFinFlare`, lightWave).
function upliftFins(material) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uFinFlare = lightWave.uFinFlare;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vFinUp;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFinUp = position.y;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vFinUp;\nuniform float uFinFlare;')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        float finLight = mix( 1.0, ${FIN_TIP.toFixed(2)}, pow( clamp( vFinUp, 0.0, 1.0 ), 1.5 ) );
        totalEmissiveRadiance *= finLight * ( 1.0 + uFinFlare );
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
  // One mesh: each hall's harbour face is shifted onto its own section of the
  // tile, so the five halls light differently. Glow 0.7 (was 1; user request,
  // 2026-10-04): the IFC and the wheel lead, the piers follow.
  const halls = new Mesh(
    mergeGeometries(xs.map((x, i) => {
      const hall = hallGeometry.clone().translate(x, top, z - 1);
      const uv = hall.attributes.uv;
      for (let v = 0; v < uv.count; v++) uv.setX(v, uv.getX(v) + i * hallW - hallW / 2);
      return hall;
    })),
    facadeMaterial(pierHall({ width: hallW, height: hallH, spacing: 3, seed: 529, halls: count }), 0.7),
  );
  const roofs = instanced(unitBox, new MeshLambertMaterial({ color: 0x3e5a4a, emissive: 0x0f1a14 }), count);
  const ridge = new Shape([new Vector2(-11, 0), new Vector2(11, 0), new Vector2(0, 4)]);
  const ridgeGeometry = new ExtrudeGeometry(ridge, { depth: 38, bevelEnabled: false }).translate(0, 0, -19).rotateY(Math.PI / 2);
  const ridges = instanced(ridgeGeometry, roofs.material, count);

  xs.forEach((x, i) => {
    // The deck starts 1 m under the water so its sides cut the surface cleanly.
    decks.setMatrixAt(i, m.compose(new Vector3(x, -1, z - 1), q, new Vector3(44, top + 1, depth + 2)));
    roofs.setMatrixAt(i, m.compose(new Vector3(x, top + hallH, z - 1), q, new Vector3(40, 1, 22)));
    ridges.setMatrixAt(i, m.compose(new Vector3(x, top + hallH + 1, z - 1), q, new Vector3(1, 1, 1)));
  });

  const group = new Group();
  group.name = 'piers';
  group.add(decks, halls, roofs, ridges);
  return group;
}

// ---- Observation Wheel -----------------------------------------------------------

const WHEEL_TURN = 240; // seconds per revolution at rest
const WHEEL_HOVER = { boost: 16, ease: 8, pad: 1.35 };
const WHEEL_GONDOLAS = 42;
const WHEEL_RIM = 1.1; // half the rim truss depth
const WHEEL_FLANGE = 3.4; // hub flange offset, where the spokes start
const PLAZA = {
  tents: [-22, -15.5, -9, -2.5, 4, 10.5, 17, 23.5],
  lamps: [[-24, 10.5], [-2, 11.2], [22, 10.4]],
  kiosks: [[-30, 9.5, 3.2, 2.6], [30, 9.2, 2.8, 2.4]],
  bulbs: { colour: 0xffd4a0, size: 5.5, spacing: 1.2, sag: 0.9 },
};

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
  platform.scale.set(64, 1.2, 22);
  // Boarding plaza (user request, 2026-10-04): extra tents, two kiosks,
  // three short lamps and strings of bulbs. Not a fairground — the same
  // small plaza, denser, so the land under the wheel isn't a blank pad.
  const tentCount = PLAZA.tents.length;
  const tents = new InstancedMesh(unitBox, new MeshLambertMaterial({ color: 0xe6e2da, emissive: 0x6a5a48 }), tentCount);
  const tentRoofs = new InstancedMesh(
    new ConeGeometry(3.6, 2.4, 4).rotateY(Math.PI / 4).translate(0, 1.2, 0),
    new MeshLambertMaterial({ color: 0xf4f0ea, emissive: 0x4a4038 }),
    tentCount,
  );
  const tentTops = [];
  PLAZA.tents.forEach((x, i) => {
    const z = i % 2 === 0 ? 9.2 : 7.4;
    const s = i === 2 || i === 5 ? 0.84 : 1;
    tents.setMatrixAt(i, m.compose(new Vector3(x, 1.2, z), q, new Vector3(4.6 * s, 2.2 * s, 4.6 * s)));
    tentRoofs.setMatrixAt(i, m.compose(new Vector3(x, 3.4 * s, z), q, new Vector3(s, s, s)));
    tentTops.push(new Vector3(x, 4.6 * s, z));
  });
  const kiosks = new InstancedMesh(unitBox, new MeshLambertMaterial({ color: 0xc8b49a, emissive: 0x4a3a28 }), PLAZA.kiosks.length);
  PLAZA.kiosks.forEach(([x, z, w, h], i) => {
    kiosks.setMatrixAt(i, m.compose(new Vector3(x, 1.2, z), q, new Vector3(w, h, w)));
  });
  const lampPost = mergeGeometries([
    new CylinderGeometry(0.11, 0.16, 5.4, 8).translate(0, 2.7, 0),
    new SphereGeometry(0.32, 10, 8).translate(0, 5.5, 0),
  ]);
  const lamps = new InstancedMesh(
    lampPost,
    new MeshLambertMaterial({ color: 0x2a2832, emissive: 0x5a4838 }),
    PLAZA.lamps.length,
  );
  const lampGlow = new InstancedMesh(
    new CircleGeometry(1.6, 16),
    new MeshBasicMaterial({
      color: 0xffd4a8,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    }),
    PLAZA.lamps.length,
  );
  PLAZA.lamps.forEach(([x, z], i) => {
    lamps.setMatrixAt(i, m.compose(new Vector3(x, 0.6, z), q, new Vector3(1, 1, 1)));
    lampGlow.setMatrixAt(i, m.compose(new Vector3(x, 6.1, z), q, new Vector3(1, 1, 1)));
  });
  lampGlow.userData.noProbe = true;

  const bulbCanvas = document.createElement('canvas');
  bulbCanvas.width = bulbCanvas.height = 32;
  const bulbCtx = bulbCanvas.getContext('2d');
  const bulbWash = bulbCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  bulbWash.addColorStop(0, 'rgba(255, 255, 255, 1)');
  bulbWash.addColorStop(0.45, 'rgba(255, 255, 255, 0.85)');
  bulbWash.addColorStop(1, 'rgba(255, 255, 255, 0)');
  bulbCtx.fillStyle = bulbWash;
  bulbCtx.fillRect(0, 0, 32, 32);
  const bulbPoints = [];
  const stringLights = (a, b) => {
    const mid = a.clone().lerp(b, 0.5);
    mid.y -= PLAZA.bulbs.sag;
    const curve = new QuadraticBezierCurve3(a, mid, b);
    const n = Math.max(2, Math.round(curve.getLength() / PLAZA.bulbs.spacing));
    for (let i = 0; i <= n; i++) bulbPoints.push(...curve.getPoint(i / n).toArray());
  };
  for (let i = 0; i < tentTops.length - 1; i++) stringLights(tentTops[i], tentTops[i + 1]);
  stringLights(new Vector3(PLAZA.lamps[0][0], 5.6, PLAZA.lamps[0][1]), new Vector3(PLAZA.lamps[2][0], 5.6, PLAZA.lamps[2][1]));
  const bulbs = new Points(
    new BufferGeometry().setAttribute('position', new Float32BufferAttribute(bulbPoints, 3)),
    new PointsMaterial({
      color: PLAZA.bulbs.colour,
      size: PLAZA.bulbs.size,
      map: new CanvasTexture(bulbCanvas),
      sizeAttenuation: false,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  bulbs.userData.noProbe = true;

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

  wheel.add(rotor, hub, disc, halo, legs, platform, tents, tentRoofs, kiosks, lamps, lampGlow, bulbs, gondolas);
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

  // The light wave's position on the waterfront, for its reflection.
  const waveMarker = new Object3D();
  waveMarker.position.set(-1e5, 0, WORLD.island.skyline.z[0]);
  let waveLevel = 0;
  let waveStart = -1;
  let waveOn = 0;
  let wheelAngle = 0;
  let wheelBoost = 0;
  const hubNdc = new Vector3();
  const rimX = new Vector3();
  const rimY = new Vector3();

  function overWheel(camera, pointer) {
    if (!camera || !pointer) return false;
    camera.updateMatrixWorld();
    const [wx, wy, wz] = WORLD.wheel.position;
    const { radius, hub } = WORLD.wheel;
    const r = radius + 2; // gondolas sit outside the rim
    hubNdc.set(wx, wy + hub, wz).project(camera);
    if (hubNdc.z > 1) return false;
    rimX.set(wx + r, wy + hub, wz).project(camera);
    rimY.set(wx, wy + hub + r, wz).project(camera);
    const rx = Math.abs(rimX.x - hubNdc.x) * WHEEL_HOVER.pad;
    const ry = Math.abs(rimY.y - hubNdc.y) * WHEEL_HOVER.pad;
    if (rx < 0.04 || ry < 0.04) return false;
    const dx = (pointer.x - hubNdc.x) / rx;
    const dy = (pointer.y - hubNdc.y) / ry;
    return dx * dx + dy * dy <= 1;
  }

  function runWave(time) {
    if (waveLevel <= 0.001) {
      waveStart = -1;
      waveOn = 0;
      lightWave.uWaveGain.value = 0;
      lightWave.uFinFlare.value = 0;
      return;
    }
    if (waveStart < 0) waveStart = time - (WAVE.period - WAVE.first);
    const phase = (time - waveStart) % WAVE.period;
    const running = phase < WAVE.travel;
    const x = running ? MathUtils.lerp(WAVE.from, WAVE.to, phase / WAVE.travel) : -1e5;
    const d = (x - WORLD.ifc.position[0]) / WAVE.flareWidth;
    lightWave.uWaveX.value = x;
    lightWave.uWaveGain.value = WAVE.gain * waveLevel;
    lightWave.uFinFlare.value = WAVE.flare * waveLevel * Math.exp(-d * d);
    waveMarker.position.x = x;
    waveOn = running ? waveLevel : 0;
  }

  // Continuous mode only; in reduced motion the wheel, mist, beacons and
  // landmark colours hold still, and there is no light wave. Hovering the
  // wheel in 05 (large on screen) speeds the turn about 4×.
  function update(time, dt = 0, camera = null, pointer = null) {
    if (dt > 0) {
      const target = overWheel(camera, pointer) ? 1 : 0;
      wheelBoost += (target - wheelBoost) * (1 - Math.exp(-WHEEL_HOVER.ease * dt));
      wheelAngle += ((Math.PI * 2) / WHEEL_TURN) * MathUtils.lerp(1, WHEEL_HOVER.boost, wheelBoost) * dt;
      turn(wheelAngle);
    }
    mountains.update(time);
    landmarks.update(time);
    beacons.update(time);
    runWave(time);
  }

  // 05's light wave (`wave` in each chapter's visibility).
  function setWave(value) {
    waveLevel = value;
    if (value <= 0.001) runWave(0);
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
    tops.crownMaterial.color.setScalar(LED.level * cityLevel * accentLevel);
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

  return {
    group,
    ifc,
    wheel,
    update,
    setCityLevel,
    setAccentLevel,
    setWave,
    wave: {
      marker: waveMarker,
      get level() {
        return waveOn;
      },
    },
    setSlopeLights: mountains.setLightLevel,
  };
}
