import {
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LineSegments,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  Quaternion,
  Shape,
  ShapeGeometry,
  TorusGeometry,
  Vector3,
} from 'three';
import { PALETTE, basic, lambert } from './palette.js';
import { WORLD } from '../data/world.js';
import { seededRandom } from './random.js';

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
  const mesh = new InstancedMesh(unitBox, new MeshLambertMaterial({ color: 0xffffff }), count);
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

function taperedSquare(sideBottom, sideTop, height) {
  const geometry = new CylinderGeometry(sideTop / Math.SQRT2, sideBottom / Math.SQRT2, height, 4, 1);
  geometry.rotateY(Math.PI / 4);
  return geometry;
}

function createIFC() {
  const ifc = new Group();
  ifc.name = 'ifc';
  const glass = lambert(0x747a8e);
  const tiers = [
    [0, 300, 56, 52],
    [300, 350, 50, 47],
    [350, 385, 44, 41],
    [385, 400, 38, 36],
  ];
  for (const [y0, y1, b, t] of tiers) {
    const tier = new Mesh(taperedSquare(b, t, y1 - y0), glass);
    tier.position.y = (y0 + y1) / 2;
    ifc.add(tier);
  }

  const crownMaterial = basic(PALETTE.cream);
  const cap = new Mesh(new BoxGeometry(30, 5, 30), crownMaterial);
  cap.position.y = 402.5;
  const fins = new InstancedMesh(new BoxGeometry(3, 16, 3), crownMaterial, 4);
  const m = new Matrix4();
  [[-16.5, -16.5], [16.5, -16.5], [-16.5, 16.5], [16.5, 16.5]].forEach(([x, z], i) => {
    fins.setMatrixAt(i, m.makeTranslation(x, 406, z));
  });

  const strips = new InstancedMesh(new PlaneGeometry(1, 1), basic(0x9b7552), 10);
  const q = new Quaternion();
  const side = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2);
  [-18, -9, 0, 9, 18].forEach((offset, i) => {
    strips.setMatrixAt(i, m.compose(new Vector3(offset, 150, 28.1), q, new Vector3(1.6, 280, 1)));
    strips.setMatrixAt(i + 5, m.compose(new Vector3(-28.1, 150, offset), side, new Vector3(1.6, 280, 1)));
  });

  ifc.add(cap, fins, strips);
  const [x, y, z] = WORLD.ifc.position;
  ifc.position.set(x, y, z);
  return ifc;
}

function createWheel() {
  const wheel = new Group();
  wheel.name = 'wheel';
  const r = WORLD.wheel.radius;
  const hubY = r + 6;
  const ringMaterial = basic(PALETTE.wheel);

  const ring = new Mesh(new TorusGeometry(r, 0.6, 6, 48), ringMaterial);
  ring.position.y = hubY;

  const spokePoints = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    spokePoints.push(0, hubY, 0, Math.cos(a) * r, hubY + Math.sin(a) * r, 0);
  }
  const spokeGeometry = new BufferGeometry();
  spokeGeometry.setAttribute('position', new Float32BufferAttribute(spokePoints, 3));
  const spokes = new LineSegments(spokeGeometry, basic(0x8f3a5a));

  const hub = new Mesh(new CylinderGeometry(1.6, 1.6, 2.5, 12), ringMaterial);
  hub.rotation.x = Math.PI / 2;
  hub.position.y = hubY;

  const legs = new InstancedMesh(new BoxGeometry(1.2, 1, 1.2), lambert(0x4a4458), 2);
  const m = new Matrix4();
  [-13, 13].forEach((foot, i) => {
    const from = new Vector3(foot, 3, 0);
    const to = new Vector3(0, hubY, 0);
    const dir = to.clone().sub(from);
    const q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().normalize());
    legs.setMatrixAt(i, m.compose(from.clone().add(to).multiplyScalar(0.5), q, new Vector3(1, dir.length(), 1)));
  });

  const base = new Mesh(new BoxGeometry(34, 3, 12), lambert(0x2c2838));
  base.position.y = 1.5;

  const gondolas = new InstancedMesh(new BoxGeometry(2.2, 2.2, 2.2), basic(PALETTE.warm), 16);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    gondolas.setMatrixAt(i, m.makeTranslation(Math.cos(a) * r, hubY + Math.sin(a) * r, 0));
  }

  wheel.add(ring, spokes, hub, legs, base, gondolas);
  const [x, y, z] = WORLD.wheel.position;
  wheel.position.set(x, y, z);
  return wheel;
}

export function createIsland() {
  const group = new Group();
  group.name = 'island';
  group.add(createSlab(), createSkyline());
  for (const mountain of WORLD.mountains) group.add(createMountain(mountain));

  const ifc = createIFC();
  const wheel = createWheel();
  group.add(ifc, wheel);

  return { group, ifc, wheel };
}
