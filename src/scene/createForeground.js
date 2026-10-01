import {
  BoxGeometry,
  CircleGeometry,
  DoubleSide,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Quaternion,
  RingGeometry,
  Shape,
  ShapeGeometry,
  Vector3,
} from 'three';
import { WORLD } from '../data/world.js';

function fadeMaterial(color, extra = {}) {
  return new MeshBasicMaterial({ color, transparent: true, opacity: 1, ...extra });
}

function createRailing(segments, material) {
  const group = new Group();
  const m = new Matrix4();
  const q = new Quaternion();
  const up = new Vector3(0, 1, 0);

  let postCount = 0;
  const layout = segments.map(({ from, to, y }) => {
    const a = new Vector3(from[0], y, from[1]);
    const b = new Vector3(to[0], y, to[1]);
    const length = a.distanceTo(b);
    const posts = Math.max(2, Math.round(length / 2.6) + 1);
    postCount += posts;
    return { a, b, length, posts };
  });

  const posts = new InstancedMesh(new BoxGeometry(0.42, 1.15, 0.42), material, postCount);
  const rails = new InstancedMesh(new BoxGeometry(1, 0.12, 0.12), material, segments.length * 2);
  // A narrow seawall strip under each railing, so water reads right up to it.
  const walls = new InstancedMesh(new BoxGeometry(1, 1, 1.4), material, segments.length);
  let p = 0;
  layout.forEach(({ a, b, length, posts: n }, i) => {
    for (let k = 0; k < n; k++) {
      const pos = a.clone().lerp(b, k / (n - 1));
      pos.y += 0.575;
      posts.setMatrixAt(p++, m.compose(pos, q, new Vector3(1, 1, 1)));
    }
    const yaw = Math.atan2(-(b.z - a.z), b.x - a.x);
    const railQ = new Quaternion().setFromAxisAngle(up, yaw);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    rails.setMatrixAt(i * 2, m.compose(mid.clone().setY(a.y + 1.1), railQ, new Vector3(length, 1, 1)));
    rails.setMatrixAt(i * 2 + 1, m.compose(mid.clone().setY(a.y + 0.55), railQ, new Vector3(length, 1, 1)));
    walls.setMatrixAt(i, m.compose(mid.clone().setY(a.y - 3), railQ, new Vector3(length + 0.4, 6, 1)));
  });

  group.add(posts, rails, walls);
  return group;
}

function palmShape(height) {
  const shape = new Shape();
  const lean = height * 0.12;
  shape.moveTo(-0.25, 0);
  shape.quadraticCurveTo(lean * 0.3, height * 0.5, lean - 0.15, height);
  shape.lineTo(lean + 0.15, height);
  shape.quadraticCurveTo(lean * 0.3 + 0.4, height * 0.5, 0.25, 0);
  shape.lineTo(-0.25, 0);

  const fronds = [];
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * (0.05 + (i / 6) * 0.9);
    const len = height * (0.32 + 0.08 * Math.sin(i * 1.7));
    const tipX = lean + Math.cos(a) * len;
    const tipY = height + Math.sin(a) * len * 0.45 - len * 0.25;
    const frond = new Shape();
    frond.moveTo(lean, height);
    frond.quadraticCurveTo(lean + Math.cos(a) * len * 0.5, height + Math.sin(a) * len * 0.5 + 0.6, tipX, tipY);
    frond.quadraticCurveTo(lean + Math.cos(a) * len * 0.5, height + Math.sin(a) * len * 0.5 - 0.6, lean, height);
    fronds.push(frond);
  }
  return [shape, ...fronds];
}

function createPalms(palms, material) {
  const group = new Group();
  for (const { position, height, yaw } of palms) {
    const palm = new Mesh(new ShapeGeometry(palmShape(height), 6), material);
    palm.position.set(position[0], position[1], position[2]);
    palm.rotation.y = yaw;
    group.add(palm);
  }
  return group;
}

const BURST_COLORS = { warm: 0xfff1d6, coral: 0xff7a8a, cyan: 0x7fe3f0 };

function createBursts(count) {
  const group = new Group();
  const items = [];
  for (let i = 0; i < count; i++) {
    const material = new MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      fog: false,
      side: DoubleSide,
    });
    const burst = new Group();
    const ring = new Mesh(new RingGeometry(0.82, 1, 48), material);
    const core = new Mesh(new CircleGeometry(0.12, 16), material);
    burst.add(ring, core);
    group.add(burst);
    items.push({ object: burst, material });
  }
  return { group, items };
}

const placementCamera = new PerspectiveCamera();
const ndc = new Vector3();

export function createForeground() {
  const railingMaterial = fadeMaterial(0x14121e);
  const palmMaterial = fadeMaterial(0x110f1a, { side: DoubleSide });

  const railing = createRailing(WORLD.foreground.railings, railingMaterial);
  railing.name = 'railing';
  const palms = createPalms(WORLD.foreground.palms, palmMaterial);
  palms.name = 'palms';
  const bursts = createBursts(4);
  bursts.group.name = 'bursts';

  const groups = {
    railing: { object: railing, materials: [railingMaterial] },
    palms: { object: palms, materials: [palmMaterial] },
    bursts: { object: bursts.group, materials: bursts.items.map((b) => b.material) },
  };

  // Burst markers are placed in front of the chapter 06 pose for the active breakpoint.
  function placeBursts(pose, aspect, specs) {
    placementCamera.fov = pose.fov;
    placementCamera.aspect = aspect;
    placementCamera.near = 0.5;
    placementCamera.far = 5000;
    placementCamera.position.fromArray(pose.position);
    placementCamera.lookAt(new Vector3().fromArray(pose.target));
    placementCamera.updateProjectionMatrix();
    placementCamera.updateMatrixWorld();

    const distance = 1600;
    const viewWidth = 2 * distance * Math.tan((pose.fov * Math.PI) / 360) * aspect;
    specs.forEach((spec, i) => {
      const item = bursts.items[i];
      ndc.set((spec.x / 100) * 2 - 1, 1 - (spec.y / 100) * 2, 0.5).unproject(placementCamera);
      const dir = ndc.sub(placementCamera.position).normalize();
      item.object.position.copy(placementCamera.position).addScaledVector(dir, distance);
      item.object.scale.setScalar((spec.size / 100) * viewWidth * 0.5);
      item.object.quaternion.copy(placementCamera.quaternion);
      item.material.color.setHex(BURST_COLORS[spec.color]);
    });
  }

  function setOpacity(key, value) {
    const entry = groups[key];
    entry.object.visible = value > 0.001;
    for (const material of entry.materials) material.opacity = value;
  }

  const group = new Group();
  group.add(railing, palms, bursts.group);

  return { group, placeBursts, setOpacity };
}
