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
  Quaternion,
  Shape,
  ShapeGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
} from 'three';
import { PALETTE, basic, lambert } from './palette.js';
import { addCityWindows } from './cityWindows.js';
import { WORLD } from '../data/world.js';
import { seededRandom } from './random.js';
import { strut } from './strut.js';
import { hubGlow } from './surfaces.js';

const unitBox = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);

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
  const material = addCityWindows(new MeshLambertMaterial({ color: 0xffffff }), { lit: 0.3, strength: 0.9 });
  const mesh = new InstancedMesh(unitBox, material, count);
  const matrix = new Matrix4();
  const q = new Quaternion();
  const color = new Color();
  const dark = new Color(PALETTE.proxyDark);
  const mid = new Color(PALETTE.proxyMid);
  const warm = new Color(0x6e5a4c);

  for (let i = 0; i < count; i++) {
    let px = x[0] + random() * (x[1] - x[0]);
    const pz = z[0] + Math.pow(random(), 0.8) * (z[1] - z[0]);
    if (Math.abs(px - ifcX) < 70 && Math.abs(pz - ifcZ) < 70) px += px < ifcX ? -80 : 80;
    if (Math.abs(px - wheelX) < 45 && pz > wheelZ - 60) px += px < wheelX ? -50 : 50;
    const d = (px - peakX) / 480;
    const h = Math.min(maxHeight, 30 + 230 * Math.exp(-d * d) * (0.45 + 0.55 * random()) + random() * 35);
    const w = 18 + random() * 30;
    matrix.compose(new Vector3(px, 3, pz), q, new Vector3(w, h, 18 + random() * 30));
    mesh.setMatrixAt(i, matrix);
    color.copy(dark).lerp(mid, 0.25 + random() * 0.5);
    if (random() < 0.12) color.lerp(warm, 0.6);
    mesh.setColorAt(i, color);
  }
  mesh.name = 'skyline';
  return mesh;
}

function createMountain({ z, x, base, peaks, color, seed }) {
  const random = seededRandom(seed);
  const phase = [random() * 6, random() * 6, random() * 6];
  const shape = new Shape();
  shape.moveTo(x[0], 0);
  for (let px = x[0]; px <= x[1]; px += 60) {
    let h = base + 40 * Math.sin(px / 310 + phase[0]) + 25 * Math.sin(px / 140 + phase[1]) + 12 * Math.sin(px / 55 + phase[2]);
    for (const [cx, height, width] of peaks) {
      const d = (px - cx) / width;
      h += height * Math.exp(-d * d);
    }
    shape.lineTo(px, h);
  }
  shape.lineTo(x[1], 0);
  shape.lineTo(x[0], 0);
  const mesh = new Mesh(new ShapeGeometry(shape), basic(color));
  mesh.position.z = z;
  return mesh;
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

// A plan shape extruded upward from y0 to y1.
function prism(shape, y0, y1) {
  const geometry = new ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, y0, 0);
  return geometry;
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

function createIFC() {
  const ifc = new Group();
  ifc.name = 'ifc';
  // Warmer and brighter than the first build, so IFC reads as a lit tower from
  // 01's 1.4 km too (user choice, 2026-10-02).
  const windows = { floor: 4.6, bay: 2.6, strength: 1.25, glow: 0.5 };
  const glass = addCityWindows(new MeshLambertMaterial({ color: 0x636a7e }), { ...windows, lit: 0.5, coolShare: 0.45 });
  // The top floors are the brightest at night, and the last three tiers are
  // floodlit white under the crown.
  const glassHigh = addCityWindows(new MeshLambertMaterial({ color: 0x6a7286 }), {
    ...windows,
    lit: 0.75,
    coolShare: 0.6,
    strength: 1.4,
  });
  const floodlit = new MeshLambertMaterial({ color: 0xe6ecf6, emissive: 0x9aa8c4 });
  const tierMaterial = (i) => (i === 0 ? glass : i >= IFC_TIERS.length - 3 ? floodlit : glassHigh);

  const m = new Matrix4();
  const q = new Quaternion();
  const piers = new InstancedMesh(unitBox, new MeshLambertMaterial({ color: 0xc9cfdb, emissive: 0x4f5768 }), IFC_TIERS.length * 4);
  IFC_TIERS.forEach(([y0, y1, half, notch], i) => {
    const plan = i === 0 ? ifcPlan(half, notch) : ifcPlan(half, notch, ...IFC_SLOT);
    ifc.add(new Mesh(prism(plan, y0, y1), tierMaterial(i)));
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
  const fins = new InstancedMesh(finGeometry, new MeshLambertMaterial({ color: 0xffffff, emissive: 0xc9d4e8 }), finOffsets.length * 4);
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
// the composition probe measures the tower alone.
function createPodium() {
  const [x0, x1, z0, z1, height] = WORLD.ifc.podium;
  const material = addCityWindows(new MeshLambertMaterial({ color: 0x4a4652 }), { lit: 0.5, floor: 5, bay: 4, coolShare: 0.2 });
  const podium = new Mesh(unitBox, material);
  podium.position.set((x0 + x1) / 2, WORLD.island.slab[4], (z0 + z1) / 2);
  podium.scale.set(x1 - x0, height, z1 - z0);
  podium.name = 'ifcPodium';
  return podium;
}

// Central Ferry Piers: a row of pavilions out over the water, each a warm lit
// hall behind a colonnade under a pitched green roof.
function createPiers() {
  const { x: xs, z, depth } = WORLD.piers;
  const top = WORLD.island.slab[4];
  const count = xs.length;
  const m = new Matrix4();
  const q = new Quaternion();
  const instanced = (geometry, material, n) => new InstancedMesh(geometry, material, n);

  const decks = instanced(unitBox, lambert(0x24222e), count);
  const halls = instanced(unitBox, new MeshLambertMaterial({ color: 0x4a3e32, emissive: 0x7a5a34 }), count);
  const roofs = instanced(unitBox, new MeshLambertMaterial({ color: 0x3e5a4a, emissive: 0x0f1a14 }), count);
  const ridge = new Shape([new Vector2(-11, 0), new Vector2(11, 0), new Vector2(0, 4)]);
  const ridgeGeometry = new ExtrudeGeometry(ridge, { depth: 38, bevelEnabled: false }).translate(0, 0, -19).rotateY(Math.PI / 2);
  const ridges = instanced(ridgeGeometry, roofs.material, count);
  const postsPer = 12;
  const posts = instanced(unitBox, new MeshLambertMaterial({ color: 0xb8b0a0, emissive: 0x3a342a }), count * postsPer);

  xs.forEach((x, i) => {
    // The deck starts 1 m under the water so its sides cut the surface cleanly.
    decks.setMatrixAt(i, m.compose(new Vector3(x, -1, z - 1), q, new Vector3(44, top + 1, depth + 2)));
    halls.setMatrixAt(i, m.compose(new Vector3(x, top, z - 1), q, new Vector3(36, 8, 18)));
    roofs.setMatrixAt(i, m.compose(new Vector3(x, top + 8, z - 1), q, new Vector3(40, 1, 22)));
    ridges.setMatrixAt(i, m.compose(new Vector3(x, top + 9, z - 1), q, new Vector3(1, 1, 1)));
    for (let j = 0; j < postsPer; j++) {
      const px = x - 16.5 + (j * 33) / (postsPer - 1);
      posts.setMatrixAt(i * postsPer + j, m.compose(new Vector3(px, top, z + 8.9), q, new Vector3(0.8, 8, 0.8)));
    }
  });

  const group = new Group();
  group.name = 'piers';
  group.add(decks, halls, roofs, ridges, posts);
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
  group.add(createSlab(), createSkyline());
  for (const mountain of WORLD.mountains) group.add(createMountain(mountain));

  const ifc = createIFC();
  const { wheel, turn } = createWheel();
  group.add(ifc, createPodium(), createPiers(), wheel);

  // Continuous mode only; in reduced motion the wheel holds still.
  function update(time) {
    turn((time / WHEEL_TURN) * Math.PI * 2);
  }

  return { group, ifc, wheel, update };
}
