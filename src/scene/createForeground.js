import {
  BoxGeometry,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  RingGeometry,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { WORLD } from '../data/world.js';
import { aimCamera } from '../scroll/cameraRig.js';
import { RAILING_BAY, addLampLight, glowMaterial, railingLayout } from './lamps.js';
import { promenadeGranite, railingPanel } from './surfaces.js';

function fadeMaterial(color, extra = {}) {
  return new MeshBasicMaterial({ color, transparent: true, opacity: 1, ...extra });
}

// ---- Promenade railing --------------------------------------------------------
// Built from the user's stone balustrade design (reference only): a granite
// plinth, square posts with carved wave panels, a slim post mid-bay, a round
// top rail and two thin rails, a lantern on every second big post.

const STONE_LAMP = 2.5;
const IRON = 0x2b2621;
const GLASS = 0xffd08a;
const GLOW = 0xffb060;

function shadeGeometry(geometry, shade) {
  const count = geometry.attributes.position.count;
  geometry.setAttribute('color', new Float32BufferAttribute(new Array(count * 3).fill(shade), 3));
  return geometry;
}

// A granite block from its extents; UVs repeat the granite once per metre.
function stoneBox([x0, x1], [y0, y1], [z0, z1], shade = 1) {
  const [w, h, d] = [x1 - x0, y1 - y0, z1 - z0];
  const geometry = new BoxGeometry(w, h, d);
  const uv = geometry.attributes.uv;
  const faces = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let i = 0; i < uv.count; i++) {
    const [su, sv] = faces[Math.floor(i / 4)];
    uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
  }
  geometry.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  return shadeGeometry(geometry, shade);
}

// A round rail along local x, open-ended (its ends sit inside the posts).
function rail(radius, y, x0, x1, segments) {
  const length = x1 - x0;
  const geometry = new CylinderGeometry(radius, radius, length, segments, 1, true);
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * Math.PI * 2 * radius, uv.getY(i) * length);
  geometry.rotateZ(Math.PI / 2).translate((x0 + x1) / 2, y, 0);
  return shadeGeometry(geometry, 1);
}

// One bay, local x from 0 to RAILING_BAY along the run, y = 0 at the deck,
// z = 0 on the railing line. Neighbouring bays meet end to end (never
// overlap: their faces would be coplanar).
function bayGeometry() {
  const L = RAILING_BAY;
  const mid = L / 2;
  return mergeGeometries([
    stoneBox([0, L], [-0.1, 0.27], [-0.28, 0.28]),
    // Seawall strip: top 5 cm below the deck, so the two never z-fight, and
    // inside the plinth, so strips crossing at a corner never show a shared top.
    stoneBox([0, L], [-6.05, -0.05], [-0.25, 0.25], 0.45),
    stoneBox([mid - 0.11, mid + 0.11], [0.26, 0.96], [-0.11, 0.11]),
    stoneBox([mid - 0.135, mid + 0.135], [0.95, 1.01], [-0.135, 0.135]),
    rail(0.065, 0.87, 0, L, 10),
    rail(0.035, 0.58, 0, L, 6),
    rail(0.035, 0.4, 0, L, 6),
  ]);
}

function postStoneGeometry() {
  return mergeGeometries([
    stoneBox([-0.31, 0.31], [-0.12, 0.3], [-0.32, 0.32]),
    stoneBox([-0.26, 0.26], [0.28, 0.35], [-0.26, 0.26]),
    stoneBox([-0.27, 0.27], [0.99, 1.07], [-0.27, 0.27]),
    stoneBox([-0.23, 0.23], [1.06, 1.12], [-0.23, 0.23]),
  ]);
}

function lanternIronGeometry() {
  const parts = [new BoxGeometry(0.32, 0.04, 0.32).translate(0, 1.13, 0)];
  for (const [x, z] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    parts.push(new BoxGeometry(0.035, 0.27, 0.035).translate(x * 0.12, 1.275, z * 0.12));
  }
  parts.push(new ConeGeometry(0.25, 0.15, 4).rotateY(Math.PI / 4).translate(0, 1.475, 0));
  parts.push(new BoxGeometry(0.05, 0.07, 0.05).translate(0, 1.565, 0));
  return mergeGeometries(parts);
}

const textures = {};

// `fade`: the run fades with the chapters, so its materials are transparent
// and it gets depth-only twins for a clean half-faded veil.
function createRailing(segments, { fade }) {
  const group = new Group();
  textures.granite ??= promenadeGranite();
  textures.panel ??= railingPanel();
  const transparent = fade;
  const stone = addLampLight(
    new MeshLambertMaterial({ map: textures.granite, vertexColors: true, transparent }),
    STONE_LAMP,
  );
  const panel = addLampLight(new MeshLambertMaterial({ map: textures.panel, transparent }), STONE_LAMP);
  const iron = addLampLight(new MeshLambertMaterial({ color: IRON, transparent }), 2);
  const glass = new MeshBasicMaterial({ color: GLASS, transparent });
  const glow = glowMaterial(GLOW, 0.9);

  const layouts = segments.map(railingLayout);
  const bayCount = layouts.reduce((n, l) => n + l.bays, 0);
  const postCount = layouts.reduce((n, l) => n + l.posts.length, 0);
  const lanternCount = layouts.reduce((n, l) => n + l.posts.filter((p) => p.lantern).length, 0);

  const bays = new InstancedMesh(bayGeometry(), stone, bayCount);
  const posts = new InstancedMesh(postStoneGeometry(), stone, postCount);
  const panels = new InstancedMesh(new BoxGeometry(0.44, 0.67, 0.44).translate(0, 0.665, 0), panel, postCount);
  const lanterns = new InstancedMesh(lanternIronGeometry(), iron, lanternCount);
  const lights = new InstancedMesh(new BoxGeometry(0.24, 0.27, 0.24).translate(0, 1.275, 0), glass, lanternCount);
  const glows = new InstancedMesh(new PlaneGeometry(1, 1), glow, lanternCount);

  const m = new Matrix4();
  const q = new Quaternion();
  const up = new Vector3(0, 1, 0);
  const one = new Vector3(1, 1, 1);
  let [b, p, l] = [0, 0, 0];
  for (const { posts: list, starts, bayLength, yaw } of layouts) {
    q.setFromAxisAngle(up, yaw);
    for (const start of starts) bays.setMatrixAt(b++, m.compose(start, q, new Vector3(bayLength / RAILING_BAY, 1, 1)));
    for (const post of list) {
      m.compose(post.position, q, one);
      posts.setMatrixAt(p, m);
      panels.setMatrixAt(p++, m);
      if (!post.lantern) continue;
      lanterns.setMatrixAt(l, m);
      lights.setMatrixAt(l, m);
      glows.setMatrixAt(l++, m.compose(post.position.clone().setY(post.position.y + 1.28), q, new Vector3(1.3, 1.3, 1.3)));
    }
  }
  glows.computeBoundingSphere();
  glows.boundingSphere.radius += 2;

  // Depth-only twins drawn just before the railing (after the water, before
  // the wordmark at 10): while the railing fades, only its front surface
  // blends, so overlapping posts and rails don't pop as the camera moves.
  // Pushed back a hair so the railing itself always passes the depth test.
  if (fade) {
    const depthOnly = new MeshBasicMaterial({
      colorWrite: false,
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: 0,
      polygonOffsetUnits: 2,
    });
    for (const mesh of [bays, posts, panels]) {
      const twin = new InstancedMesh(mesh.geometry, depthOnly, mesh.count);
      twin.instanceMatrix = mesh.instanceMatrix;
      twin.renderOrder = 1;
      group.add(twin);
    }
  }
  for (const mesh of [bays, posts, panels, lanterns, lights]) mesh.renderOrder = 2;
  glows.renderOrder = 3;
  glows.userData.noProbe = true;

  group.add(bays, posts, panels, lanterns, lights, glows);
  return { group, materials: [stone, panel, iron, glass], glows: [glow] };
}

// ---- Promenade lamps --------------------------------------------------------
// Tall cast-iron lamps after the user's lamp design (reference only): an
// octagonal pedestal, a fluted column with collars, a six-sided lantern.

function lampIronGeometry() {
  return mergeGeometries([
    new CylinderGeometry(0.3, 0.3, 0.14, 8).translate(0, 0.05, 0),
    new CylinderGeometry(0.21, 0.24, 0.76, 8).translate(0, 0.48, 0),
    new CylinderGeometry(0.27, 0.27, 0.07, 8).translate(0, 0.87, 0),
    new CylinderGeometry(0.13, 0.16, 0.26, 12).translate(0, 1.0, 0),
    new CylinderGeometry(0.085, 0.11, 2.0, 12).translate(0, 2.1, 0),
    new CylinderGeometry(0.13, 0.1, 0.2, 12).translate(0, 3.13, 0),
    new CylinderGeometry(0.2, 0.2, 0.05, 6).translate(0, 3.245, 0),
    new ConeGeometry(0.38, 0.3, 6).translate(0, 3.95, 0),
    new SphereGeometry(0.06, 8, 6).translate(0, 4.15, 0),
  ]);
}

function createLamps(positions) {
  const group = new Group();
  group.name = 'lamps';
  const iron = addLampLight(new MeshLambertMaterial({ color: IRON }), 2);
  const lamps = new InstancedMesh(lampIronGeometry(), iron, positions.length);
  const lights = new InstancedMesh(
    new CylinderGeometry(0.3, 0.21, 0.55, 6).translate(0, 3.535, 0),
    new MeshBasicMaterial({ color: GLASS }),
    positions.length,
  );
  const glows = new InstancedMesh(new PlaneGeometry(1, 1), glowMaterial(GLOW, 0.9), positions.length);
  const m = new Matrix4();
  positions.forEach(([x, y, z], i) => {
    m.makeTranslation(x, y, z);
    lamps.setMatrixAt(i, m);
    lights.setMatrixAt(i, m);
    glows.setMatrixAt(i, m.makeScale(2.6, 2.6, 2.6).setPosition(x, y + 3.55, z));
  });
  glows.computeBoundingSphere();
  glows.boundingSphere.radius += 3;
  glows.userData.noProbe = true;
  group.add(lamps, lights, glows);
  return group;
}

// ---- Palms ------------------------------------------------------------------

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

// ---- Firework burst markers -------------------------------------------------

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
  const palmMaterial = fadeMaterial(0x110f1a, { side: DoubleSide });

  const railing = createRailing(WORLD.foreground.railings, { fade: true });
  railing.group.name = 'railing';
  const edgeRailing = createRailing(WORLD.foreground.edgeRailings, { fade: false });
  edgeRailing.group.name = 'edgeRailing';
  const lamps = createLamps(WORLD.foreground.lamps);
  const palms = createPalms(WORLD.foreground.palms, palmMaterial);
  palms.name = 'palms';
  const bursts = createBursts(4);
  bursts.group.name = 'bursts';

  const groups = {
    railing: { object: railing.group, materials: railing.materials, glows: railing.glows },
    palms: { object: palms, materials: [palmMaterial] },
    bursts: { object: bursts.group, materials: bursts.items.map((b) => b.material) },
  };

  // Burst markers are placed in front of the chapter 06 pose for the active breakpoint.
  function placeBursts(pose, aspect, specs) {
    placementCamera.fov = pose.fov;
    placementCamera.aspect = aspect;
    placementCamera.near = 0.5;
    placementCamera.far = 5000;
    aimCamera(placementCamera, new Vector3().fromArray(pose.position), new Vector3().fromArray(pose.target));
    placementCamera.updateMatrixWorld();

    const depth = 1600;
    const viewWidth = 2 * depth * Math.tan((pose.fov * Math.PI) / 360) * aspect;
    const forward = placementCamera.getWorldDirection(new Vector3());
    specs.forEach((spec, i) => {
      const item = bursts.items[i];
      ndc.set((spec.x / 100) * 2 - 1, 1 - (spec.y / 100) * 2, 0.5).unproject(placementCamera);
      const dir = ndc.sub(placementCamera.position).normalize();
      // Same depth for every marker, so the lens shift doesn't enlarge high ones.
      item.object.position.copy(placementCamera.position).addScaledVector(dir, depth / dir.dot(forward));
      item.object.scale.setScalar((spec.size / 100) * viewWidth * 0.5);
      item.object.quaternion.copy(placementCamera.quaternion);
      item.material.color.setHex(BURST_COLORS[spec.color]);
    });
  }

  function setOpacity(key, value) {
    const entry = groups[key];
    entry.object.visible = value > 0.001;
    for (const material of entry.materials) material.opacity = value;
    for (const glow of entry.glows ?? []) glow.uniforms.opacity.value = value;
  }

  const group = new Group();
  group.add(railing.group, edgeRailing.group, lamps, palms, bursts.group);

  return { group, placeBursts, setOpacity };
}
