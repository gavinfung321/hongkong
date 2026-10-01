import {
  BoxGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  PointLight,
  Quaternion,
  Shape,
  SphereGeometry,
  Vector2,
  Vector3,
} from 'three';
import { PALETTE, lambert } from './palette.js';
import { addCityWindows } from './cityWindows.js';
import { clockDial, clockTowerShaft, graniteAshlar } from './surfaces.js';
import { WORLD } from '../data/world.js';
import { seededRandom } from './random.js';

const unitBox = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);

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

function createClockTower() {
  const tower = new Group();
  tower.name = 'clockTower';
  const shaftMaps = clockTowerShaft();
  const stone = new MeshStandardMaterial({ ...shaftMaps, bumpScale: 1.5, emissive: 0xffffff, roughness: 0.92 });
  const ashlar = graniteAshlar();
  // Warm tints keep the cyan rim light from turning the granite teal.
  const light = new MeshStandardMaterial({ ...ashlar, color: 0xf2cfae, bumpScale: 1, roughness: 0.85 });
  const dark = new MeshStandardMaterial({ ...ashlar, color: 0x9a8070, bumpScale: 1, roughness: 0.9 });

  // Slim shaft, then a light-stone crown that steps in: cornice, two tiers, dome, spire.
  const plinth = new Mesh(new BoxGeometry(10, 3, 10), dark);
  plinth.position.y = 1.5;
  const shaft = new Mesh(new BoxGeometry(8, 34, 8), stone);
  shaft.position.y = 20;
  // Barely wider than the shaft: a deeper overhang shows its unlit underside as a black band.
  const cornice = new Mesh(new BoxGeometry(8.3, 1.2, 8.3), light);
  cornice.position.y = 37.6;
  const lowerTier = new Mesh(new BoxGeometry(5.6, 5, 5.6), light);
  lowerTier.position.y = 40.7;
  const upperTier = new Mesh(new BoxGeometry(4.2, 3, 4.2), light);
  upperTier.position.y = 44.7;

  const pinnacles = new InstancedMesh(new BoxGeometry(0.8, 2, 0.8), light, 4);
  const m = new Matrix4();
  [[-3.9, -3.9], [3.9, -3.9], [-3.9, 3.9], [3.9, 3.9]].forEach(([x, z], i) => {
    pinnacles.setMatrixAt(i, m.makeTranslation(x, 39.2, z));
  });

  const dome = new Mesh(new SphereGeometry(2.1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), light);
  dome.position.y = 46.2;
  const spire = new Mesh(new CylinderGeometry(0.12, 0.12, 6, 6), light);
  spire.position.y = 51;

  const faceMaterial = new MeshBasicMaterial({ map: clockDial() });
  const faceY = 33.5;
  const faceFront = new Mesh(new CircleGeometry(1.6, 24), faceMaterial);
  faceFront.position.set(0, faceY, 4.02);
  const faceEast = new Mesh(new CircleGeometry(1.6, 24), faceMaterial);
  faceEast.position.set(4.02, faceY, 0);
  faceEast.rotation.y = Math.PI / 2;
  const faceWest = new Mesh(new CircleGeometry(1.6, 24), faceMaterial);
  faceWest.position.set(-4.02, faceY, 0);
  faceWest.rotation.y = -Math.PI / 2;

  // Warm floodlight at the foot of the harbour face: bright brick low down,
  // fading up the shaft.
  const flood = new PointLight(0xffa860, 420, 60, 2);
  flood.position.set(0, 1.5, 9);

  tower.add(plinth, shaft, cornice, lowerTier, upperTier, pinnacles, dome, spire, faceFront, faceEast, faceWest, flood);
  const [x, y, z] = WORLD.clockTower.position;
  tower.position.set(x, y, z);
  tower.rotation.y = WORLD.clockTower.yaw;
  return tower;
}

function createKowloonSkyline() {
  const { x, z, count, height, seed } = WORLD.kowloon.skyline;
  const random = seededRandom(seed);
  const material = addCityWindows(new MeshLambertMaterial({ color: 0xffffff }), { lit: 0.22, strength: 0.8 });
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
  const ground = lambert(0x24222f);

  for (const b of WORLD.kowloon.blocks) group.add(block(b, ground));
  const decks = new Group();
  decks.name = 'decks';
  for (const d of WORLD.kowloon.decks) decks.add(deck(d, ground));
  group.add(decks, createKowloonSkyline());

  const clockTower = createClockTower();
  group.add(clockTower);

  return { group, decks, clockTower };
}
