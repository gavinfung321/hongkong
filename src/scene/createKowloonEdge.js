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
  MeshLambertMaterial,
  Quaternion,
  Shape,
  SphereGeometry,
  Vector2,
  Vector3,
} from 'three';
import { PALETTE, basic, lambert } from './palette.js';
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
  const stone = lambert(0x6a6478);
  const dark = lambert(PALETTE.proxyDark);
  const light = lambert(0x8d879a);

  const plinth = new Mesh(new BoxGeometry(12.5, 3, 12.5), dark);
  plinth.position.y = 1.5;
  const shaft = new Mesh(new BoxGeometry(10, 32, 10), stone);
  shaft.position.y = 19;
  const stage = new Mesh(new BoxGeometry(8, 5, 8), light);
  stage.position.y = 37.5;

  const pinnacles = new InstancedMesh(new BoxGeometry(1.1, 2.4, 1.1), light, 4);
  const m = new Matrix4();
  [[-4.3, -4.3], [4.3, -4.3], [-4.3, 4.3], [4.3, 4.3]].forEach(([x, z], i) => {
    pinnacles.setMatrixAt(i, m.makeTranslation(x, 36.2, z));
  });

  const dome = new Mesh(new SphereGeometry(3.7, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), light);
  dome.position.y = 40;
  const spire = new Mesh(new CylinderGeometry(0.14, 0.14, 7, 6), light);
  spire.position.y = 46.5;

  const faceMaterial = basic(PALETTE.warm);
  const faceFront = new Mesh(new CircleGeometry(1.8, 24), faceMaterial);
  faceFront.position.set(0, 27, 5.02);
  const faceEast = new Mesh(new CircleGeometry(1.8, 24), faceMaterial);
  faceEast.position.set(5.02, 27, 0);
  faceEast.rotation.y = Math.PI / 2;
  const faceWest = new Mesh(new CircleGeometry(1.8, 24), faceMaterial);
  faceWest.position.set(-5.02, 27, 0);
  faceWest.rotation.y = -Math.PI / 2;

  tower.add(plinth, shaft, stage, pinnacles, dome, spire, faceFront, faceEast, faceWest);
  const [x, y, z] = WORLD.clockTower.position;
  tower.position.set(x, y, z);
  tower.rotation.y = WORLD.clockTower.yaw;
  return tower;
}

function createKowloonSkyline() {
  const { x, z, count, height, seed } = WORLD.kowloon.skyline;
  const random = seededRandom(seed);
  const mesh = new InstancedMesh(unitBox, new MeshLambertMaterial({ color: 0xffffff }), count);
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
  for (const d of WORLD.kowloon.decks) group.add(deck(d, ground));
  group.add(createKowloonSkyline());

  const clockTower = createClockTower();
  group.add(clockTower);

  return { group, clockTower };
}
