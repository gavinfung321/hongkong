import {
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  Color,
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
  MeshStandardMaterial,
  PointLight,
  Quaternion,
  RingGeometry,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  Vector2,
  Vector3,
} from 'three';
import { PALETTE, lambert } from './palette.js';
import { addCityWindows } from './cityWindows.js';
import {
  clockDial,
  clockTowerBelfry,
  clockTowerPilaster,
  clockTowerShaft,
  graniteAshlar,
  promenadePaving,
} from './surfaces.js';
import { TOWER_FLOOD, addLampLight, addWetPaving } from './lamps.js';
import { strut } from './strut.js';
import { WORLD } from '../data/world.js';
import { breatheLight } from './lightBreath.js';
import { seededRandom } from './random.js';

const unitBox = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
const PAVING_LAMP = 1.2;

function block([x0, x1, z0, z1, top], material) {
  const depth = 6;
  const mesh = new Mesh(unitBox, material);
  mesh.position.set((x0 + x1) / 2, top - depth, (z0 + z1) / 2);
  mesh.scale.set(x1 - x0, depth, z1 - z0);
  return mesh;
}

function deck({ points, top }, material) {
  const depth = 6;
  // Shape y = −z so that rotating the extrusion upright maps it back onto world z.
  const shape = new Shape(points.map(([x, z]) => new Vector2(x, -z)));
  const geometry = new ExtrudeGeometry(shape, { depth, bevelEnabled: false }).rotateX(-Math.PI / 2);
  const mesh = new Mesh(geometry, material);
  mesh.position.y = top - depth;
  return mesh;
}

// A round-headed arch, w wide and h tall, standing on y = 0.
function archShape(w, h) {
  const r = w / 2;
  const shape = new Shape();
  shape.moveTo(-r, 0);
  shape.lineTo(-r, h - r);
  shape.absarc(0, h - r, r, Math.PI, 0, true);
  shape.lineTo(r, 0);
  shape.closePath();
  return shape;
}

// After Kowloon's old railway Clock Tower (original, simplified; proportions
// measured from the user's reference photos): a granite plinth, a red brick
// shaft framed by rusticated granite pilasters, stone-framed windows, white
// clock dials in stone rings on three faces, an arched door, a bracketed
// cornice, a brick stage with corner scrolls, a pillared stage with
// balconies, a dome and a lattice mast. Floodlit golden all the way up by
// glow maps; one point light warms the foot.
function createClockTower() {
  const tower = new Group();
  tower.name = 'clockTower';
  const m = new Matrix4();
  const brick = new MeshStandardMaterial({ ...clockTowerShaft(), emissive: 0xffffff, roughness: 0.92 });
  const granite = new MeshStandardMaterial({ ...clockTowerPilaster(), emissive: 0xffffff, roughness: 0.85 });
  const belfry = new MeshStandardMaterial({ ...clockTowerBelfry(), emissive: 0xffffff, roughness: 0.9 });
  const ashlar = graniteAshlar();
  // Warm tints keep the cyan rim light from turning the granite teal.
  const stone = new MeshStandardMaterial({
    ...ashlar,
    bumpScale: 1,
    color: 0xf2cfae,
    emissive: 0xa07a4c,
    emissiveMap: ashlar.map,
    roughness: 0.85,
  });
  const iron = new MeshStandardMaterial({ color: 0x15130f, roughness: 0.7 });
  const box = (w, y0, y1, material, d = w) => {
    const mesh = new Mesh(new BoxGeometry(w, y1 - y0, d), material);
    mesh.position.y = (y0 + y1) / 2;
    return mesh;
  };
  const corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  // Each face as [outward x, outward z, turn about Y].
  const faces = [[0, 1, 0], [1, 0, Math.PI / 2], [0, -1, Math.PI], [-1, 0, -Math.PI / 2]];

  // Plinth and shaft: a 9 m brick core, granite pilasters 1.9 m wide on each
  // corner standing 0.15 m proud of the brick.
  const plinth = box(10, 0, 1.8, stone);
  const core = box(9, 1.7, 31.5, brick);
  const pilasters = new InstancedMesh(new BoxGeometry(1.9, 29.8, 1.9), granite, 4);
  corners.forEach(([sx, sz], i) => pilasters.setMatrixAt(i, m.makeTranslation(sx * 3.7, 16.6, sz * 3.7)));

  // Cornice on a moulding, with a row of brackets under its overhang.
  const moulding = box(9.7, 31.3, 31.8, stone);
  const cornice = box(10.2, 31.8, 32.7, stone);
  const bracketSpots = [];
  for (const [fx, fz] of faces) {
    for (let t = -4.5; t <= 4.51; t += 0.6) bracketSpots.push([fx ? fx * 4.96 : t, fz ? fz * 4.96 : t]);
  }
  const brackets = new InstancedMesh(new BoxGeometry(0.3, 0.35, 0.3), stone, bracketSpots.length);
  bracketSpots.forEach(([x, z], i) => brackets.setMatrixAt(i, m.makeTranslation(x, 31.62, z)));

  // First crown stage: brick with stone corners, a scroll rising from the
  // cornice to each corner, and its own cornice.
  const stage1 = box(7.2, 32.6, 36.5, belfry);
  const stage1Corners = new InstancedMesh(new BoxGeometry(1.1, 3.9, 1.1), stone, 4);
  corners.forEach(([sx, sz], i) => stage1Corners.setMatrixAt(i, m.makeTranslation(sx * 3.35, 34.55, sz * 3.35)));
  const scroll = new Shape();
  scroll.moveTo(0, 0);
  scroll.lineTo(1.4, 0);
  scroll.lineTo(1.4, 0.35);
  scroll.quadraticCurveTo(0.3, 0.5, 0.15, 2.6);
  scroll.lineTo(0, 2.6);
  scroll.closePath();
  const scrollGeometry = new ExtrudeGeometry(scroll, { depth: 0.6, bevelEnabled: false, curveSegments: 8 }).translate(0, 0, -0.3);
  const scrolls = corners.map(([sx, sz]) => {
    const mesh = new Mesh(scrollGeometry, stone);
    mesh.position.set(sx * 3.9, 32.68, sz * 3.9);
    mesh.rotation.y = Math.atan2(-sz, sx);
    return mesh;
  });
  const stage1Cornice = box(8.4, 36.5, 37, stone);

  // Second stage: arched openings between corner columns, a balcony with an
  // iron railing on each face, and a cornice.
  const stage2 = box(4.6, 36.95, 40.4, belfry);
  const columns = new InstancedMesh(new CylinderGeometry(0.3, 0.3, 3.45, 10), stone, 4);
  corners.forEach(([sx, sz], i) => columns.setMatrixAt(i, m.makeTranslation(sx * 2.45, 38.7, sz * 2.45)));
  const balconies = new InstancedMesh(new BoxGeometry(3.8, 0.15, 0.7), stone, 4);
  const rails = new InstancedMesh(new BoxGeometry(3.8, 0.06, 0.06), iron, 4);
  const balusterSpots = [];
  faces.forEach(([fx, fz, turn], i) => {
    balconies.setMatrixAt(i, m.makeRotationY(turn).setPosition(fx * 2.65, 37.07, fz * 2.65));
    rails.setMatrixAt(i, m.makeRotationY(turn).setPosition(fx * 2.95, 38, fz * 2.95));
    for (let t = -1.8; t <= 1.81; t += 0.45) balusterSpots.push([fx ? fx * 2.95 : t, fz ? fz * 2.95 : t]);
  });
  const balusters = new InstancedMesh(new BoxGeometry(0.05, 0.85, 0.05), iron, balusterSpots.length);
  balusterSpots.forEach(([x, z], i) => balusters.setMatrixAt(i, m.makeTranslation(x, 37.57, z)));
  const stage2Cornice = box(5.6, 40.4, 40.85, stone);

  // Drum, dome and finial; a tapering lattice mast on top.
  const drum = new Mesh(new CylinderGeometry(2.1, 2.1, 0.9, 24), stone);
  drum.position.y = 41.25;
  const dome = new Mesh(new SphereGeometry(2.2, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), stone);
  dome.position.y = 41.68;
  dome.scale.y = 1.2;
  const finial = new Mesh(new CylinderGeometry(0.15, 0.3, 0.7, 8), stone);
  finial.position.y = 44.5;
  const [mastBottom, mastTop] = [44.7, 51.2];
  const legs = new InstancedMesh(new CylinderGeometry(1, 1, 1, 5).translate(0, 0.5, 0), iron, 4);
  corners.forEach(([sx, sz], i) => legs.setMatrixAt(i, strut([sx * 0.35, mastBottom, sz * 0.35], [sx * 0.07, mastTop, sz * 0.07], 0.05)));
  const bracing = [];
  const legAt = (sx, sz, y) => {
    const k = (y - mastBottom) / (mastTop - mastBottom);
    const half = 0.35 + (0.07 - 0.35) * k;
    return [sx * half, y, sz * half];
  };
  const ring = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
  for (let y = mastBottom; y < mastTop - 0.8; y += 0.8) {
    ring.forEach(([sx, sz], i) => {
      const [nx, nz] = ring[(i + 1) % 4];
      bracing.push(...legAt(sx, sz, y), ...legAt(nx, nz, y + 0.8));
    });
  }
  const bracingGeometry = new BufferGeometry();
  bracingGeometry.setAttribute('position', new Float32BufferAttribute(bracing, 3));
  const lattice = new LineSegments(bracingGeometry, new LineBasicMaterial({ color: 0x1a1714 }));
  lattice.userData.noProbe = true;

  // White dials in stone rings on three faces (none toward the harbour), and
  // an arched door with a lit fanlight on the front.
  const dialMaterial = new MeshBasicMaterial({ map: clockDial() });
  const dialY = 26.8;
  const dials = [];
  for (const [fx, fz, turn] of [faces[0], faces[1], faces[3]]) {
    const surround = new Mesh(new RingGeometry(1.5, 1.95, 32), stone);
    surround.position.set(fx * 4.53, dialY, fz * 4.53);
    surround.rotation.y = turn;
    const dial = new Mesh(new CircleGeometry(1.5, 32), dialMaterial);
    dial.position.set(fx * 4.55, dialY, fz * 4.55);
    dial.rotation.y = turn;
    dials.push(surround, dial);
  }
  const doorFrame = new Mesh(new ShapeGeometry(archShape(2.4, 3.5)), stone);
  doorFrame.position.set(0, 1.8, 4.53);
  const door = new Mesh(new ShapeGeometry(archShape(1.8, 3.1)), new MeshBasicMaterial({ color: 0xe0a060 }));
  door.position.set(0, 1.8, 4.55);

  // Warm floodlight at the foot of the front face.
  const flood = new PointLight(0xffa860, 420, 60, 2);
  flood.position.set(...TOWER_FLOOD);
  breatheLight(flood, { period: 8.3, phase: 0.17, amount: 0.03 });

  tower.add(
    plinth,
    core,
    pilasters,
    moulding,
    cornice,
    brackets,
    stage1,
    stage1Corners,
    ...scrolls,
    stage1Cornice,
    stage2,
    columns,
    balconies,
    rails,
    balusters,
    stage2Cornice,
    drum,
    dome,
    finial,
    legs,
    lattice,
    ...dials,
    doorFrame,
    door,
    flood,
  );
  const [x, y, z] = WORLD.clockTower.position;
  tower.position.set(x, y, z);
  tower.rotation.y = WORLD.clockTower.yaw;
  return tower;
}

function createKowloonSkyline() {
  const { x, z, count, height, seed } = WORLD.kowloon.skyline;
  const random = seededRandom(seed);
  const material = addCityWindows(new MeshLambertMaterial({ color: 0xffffff }), { lit: 0.22, strength: 0.8, ribbon: 0.2 });
  const mesh = new InstancedMesh(unitBox, material, count);
  const matrix = new Matrix4();
  const q = new Quaternion();
  const color = new Color();
  const base = new Color(PALETTE.proxyDark);
  const mid = new Color(PALETTE.proxyMid);

  for (let i = 0; i < count; i++) {
    const px = x[0] + random() * (x[1] - x[0]);
    const pz = z[0] + random() * (z[1] - z[0]);
    const h = height[0] + random() * (height[1] - height[0]);
    matrix.compose(new Vector3(px, 2.5, pz), q, new Vector3(16 + random() * 24, h, 16 + random() * 24));
    mesh.setMatrixAt(i, matrix);
    mesh.setColorAt(i, color.copy(base).lerp(mid, random() * 0.6));
  }
  return mesh;
}

export function createKowloonEdge() {
  const group = new Group();
  group.name = 'kowloonEdge';
  // Seawall sides stay plain dark stone; the tops are wet paving.
  const ground = addWetPaving(addLampLight(new MeshLambertMaterial({ color: 0x24222f }), PAVING_LAMP), {
    map: promenadePaving(),
    tile: 2.4,
    y: 2.5,
  });

  for (const b of WORLD.kowloon.blocks) group.add(block(b, ground));
  const decks = new Group();
  decks.name = 'decks';
  for (const d of WORLD.kowloon.decks) decks.add(deck(d, ground));
  group.add(decks, createKowloonSkyline());

  const clockTower = createClockTower();
  group.add(clockTower);

  return { group, decks, clockTower };
}
