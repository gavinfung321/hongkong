import {
  BufferGeometry,
  CanvasTexture,
  ImageLoader,
  Color,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PlaneGeometry,
  QuadraticBezierCurve3,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { COLOURS, FALL, PETAL_CARD, WIND, petalTexture } from './createPetals.js';
import { addLampLight } from './lamps.js';
import { seededRandom } from './random.js';

// A Hong Kong orchid tree (Bauhinia blakeana) built in code, after the user's
// reference images (references only): a trunk leaning out over the water,
// forking low into dark arching limbs, and a loose crown of broad two-lobed
// leaves with magenta flowers bunched on its outer twigs. Local frame: the
// trunk leans toward +x; metres. A low bauhinia bush (createBauhiniaBush)
// shares its foliage.

const TRUNK = { height: 5, lean: 4, base: 0.32, top: 0.21 };
const LIMBS = { count: 5, length: 3.6, radius: 0.15, bias: 1.8 };
const LEVELS = 4; // limb = 1; its forks down to the twigs at LEVELS
const FORKS = [0, 0, 3, 2, 2]; // children per branch, by child level
const SHRINK = 0.68;

// The foliage atlas, cut from the user's flower-cluster and petal artwork
// (docs/ASSET-LEDGER.md), 1024 × 1024 in four 512 px cells: u 0–0.5, v 0.5–1
// one two-lobed leaf, stalk at the bottom; u 0.5–1, v 0.5–1 one open flower
// made of the drifting petals' artwork, centred; u 0–0.5, v 0–0.5 a spray of
// buds, base at the bottom; u 0.5–1, v 0–0.5 a clump of six leaves, base at
// the bottom.
const FOLIAGE_ART = { url: 'atmosphere/bauhinia-foliage.webp', size: [1024, 1024] };

// Atlas cells (u0, v0) and card sizes in metres.
// `glow`: the card's own light, as if lit by the moon and the city, so the
// artwork's veins and colour read at night like the drifting petals.
const CARDS = {
  leaf: { cell: [0, 0.5], size: [0.2, 0.28], glow: 0.09, flutter: 0.14 },
  clump: { cell: [0.5, 0], size: [0.42, 0.58], glow: 0.07, flutter: 0.06 },
  flower: { cell: [0.5, 0.5], size: [0.2, 0.27], glow: 0.32, flutter: 0.08 },
  buds: { cell: [0, 0], size: [0.16, 0.22], glow: 0.15, flutter: 0.1 },
};
// Foliage deep in a crown or low on it is shaded down to this (1 at the top
// of the outer surface), so the crowns read round instead of flat.
const SHADE_FLOOR = 0.45;
const BARK = [0.3, 0.24, 0.2];
// Petals that leave the flowers, drift with the harbour wind and land on the
// water (y = 0), then start again from another flower.
const FALLING = { count: 18, size: [0.13, 0.2], landing: 0.2 };

const up = new Vector3(0, 1, 0);

// The skeleton: quadratic segments with radii, and the twig tips.
function grow(random) {
  const branches = [];
  const tips = [];
  const trunkTop = new Vector3(TRUNK.lean, TRUNK.height, 0);
  branches.push({
    curve: new QuadraticBezierCurve3(new Vector3(), new Vector3(TRUNK.lean * 0.15, TRUNK.height * 0.6, 0), trunkTop),
    radius: [TRUNK.base, TRUNK.top],
    level: 0,
  });

  function branch(start, dir, length, radius, level) {
    const end = start.clone().addScaledVector(dir, length);
    // Outer branches arch over and droop at their ends.
    end.y -= length * 0.12 * (level - 1);
    const middle = start.clone().addScaledVector(dir, length * 0.5).addScaledVector(up, length * 0.12);
    branches.push({ curve: new QuadraticBezierCurve3(start, middle, end), radius: [radius, radius * SHRINK], level });
    const heading = end.clone().sub(middle).normalize();
    if (level === LEVELS) {
      tips.push({ position: end, dir: heading });
      return;
    }
    for (let i = 0; i < FORKS[level + 1]; i++) {
      const axis = new Vector3(random() - 0.5, random() - 0.5, random() - 0.5).cross(heading).normalize();
      const turn = new Quaternion().setFromAxisAngle(axis, 0.35 + random() * 0.45);
      const next = heading.clone().applyQuaternion(turn);
      next.y = next.y * 0.7 + 0.12;
      branch(end, next.normalize(), length * SHRINK * (0.85 + random() * 0.3), radius * SHRINK, level + 1);
    }
  }

  for (let i = 0; i < LIMBS.count; i++) {
    const azimuth = ((i + random() * 0.5) / LIMBS.count) * Math.PI * 2;
    const rise = 0.55 + random() * 0.45;
    const dir = new Vector3(Math.cos(azimuth) + LIMBS.bias, rise, Math.sin(azimuth)).normalize();
    branch(trunkTop, dir, LIMBS.length * (0.85 + random() * 0.3), LIMBS.radius, 1);
  }
  return { branches, tips, trunkTop };
}

function tube(curve, [r0, r1], shade) {
  const RADIAL = 6;
  const segments = Math.max(3, Math.ceil(curve.getLength() / 0.4));
  const frames = curve.computeFrenetFrames(segments, false);
  const positions = [];
  const colors = [];
  const index = [];
  const point = new Vector3();
  for (let j = 0; j <= segments; j++) {
    const t = j / segments;
    curve.getPoint(t, point);
    const r = r0 + (r1 - r0) * t;
    const { normals, binormals } = frames;
    for (let k = 0; k <= RADIAL; k++) {
      const a = (k / RADIAL) * Math.PI * 2;
      const n = normals[j].clone().multiplyScalar(Math.cos(a)).addScaledVector(binormals[j], Math.sin(a));
      positions.push(point.x + n.x * r, point.y + n.y * r, point.z + n.z * r);
      colors.push(...BARK.map((c) => c * shade));
    }
  }
  const row = RADIAL + 1;
  for (let j = 0; j < segments; j++) {
    for (let k = 0; k < RADIAL; k++) {
      const a = j * row + k;
      index.push(a, a + row, a + 1, a + 1, a + row, a + row + 1);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

// Brightness of a card from its height in the crown (0 bottom, 1 top) and its
// depth inside it (0 outer surface, 1 deep); flowers sit at the tips and
// stay brighter.
function crownShade(kind, height, depth) {
  const shade = SHADE_FLOOR + (1 - SHADE_FLOOR) * (0.35 + 0.65 * height) * (1 - 0.5 * depth);
  return kind === 'flower' ? 0.5 * (1 + shade) : shade;
}

// Cards: [{ kind, position, normal, tip, shade }]; normal faces out of the
// crown, tip runs from stalk to tip.
function foliage(skeleton, random) {
  const cards = [];
  const centre = skeleton.trunkTop.clone().add(new Vector3(2, 2, 0));
  const jitter = () => new Vector3(random() - 0.5, random() - 0.5, random() - 0.5);
  const add = (kind, at, spread, dir, outwardBias, depth) => {
    const position = at.clone().add(jitter().multiplyScalar(spread));
    const outward = position.clone().sub(centre).normalize();
    const normal = outward.multiplyScalar(outwardBias).add(jitter().multiplyScalar(1.6)).addScaledVector(up, 0.3).normalize();
    const tip = dir.clone().addScaledVector(jitter(), 1.2);
    cards.push({ kind, position, normal, tip, depth });
  };
  for (const { position, dir } of skeleton.tips) {
    for (let i = 0; i < 14; i++) add('leaf', position, 0.9, dir, 1, 0);
    for (let i = 0; i < 7; i++) add('clump', position, 1.1, dir, 1, 0.2);
    for (let i = 0; i < 6; i++) add('flower', position.clone().addScaledVector(dir, 0.2), 0.7, dir, 2, 0);
    add('buds', position.clone().addScaledVector(dir, 0.15), 0.5, dir, 1.5, 0);
  }
  for (const { curve, level } of skeleton.branches) {
    if (level < LEVELS - 2) continue;
    const n = level === LEVELS ? 1 : 2;
    for (let i = 0; i < 3 * n; i++) add('clump', curve.getPoint(0.4 + random() * 0.5), 0.7, up, 0.6, 0.7);
    for (let i = 0; i < 4 * n; i++) add('leaf', curve.getPoint(0.3 + random() * 0.7), 0.6, up, 0.6, 0.7);
  }
  const heights = cards.map(({ position }) => position.y);
  const low = Math.min(...heights);
  const high = Math.max(...heights);
  for (const card of cards) card.shade = crownShade(card.kind, (card.position.y - low) / (high - low), card.depth);
  return cards;
}

// A low, dense mound: an ellipsoid crown of semi-axes [a, b, c] whose centre
// stands `lift` above the ground, cut flat near the ground, with lumps so its
// outline is uneven. Cards sit on and just under its surface; flowers only
// on the upper outer surface, many more of them than on the tree, gathered
// in `clusters` (user request, 2026-10-03: less even, more like a real bush).
// A `stray` share of leaves and flowers sits on sprigs poking out past the
// surface by up to `strayReach` of the crown.
const BUSH_FOLIAGE = {
  clump: 700, leaf: 880, flower: 260, buds: 80, inset: 0.45, ground: 0.3,
  lumps: 11, lump: 0.3, clusters: 16, clusterSpread: 0.32, stray: 0.06, strayReach: 0.28,
};

function bushFoliage([a, b, c], lift, random) {
  const cards = [];
  const jitter = () => new Vector3(random() - 0.5, random() - 0.5, random() - 0.5);
  const lumps = Array.from({ length: BUSH_FOLIAGE.lumps }, () => [
    new Vector3(random() - 0.5, random() * 0.8, random() - 0.5).normalize(),
    BUSH_FOLIAGE.lump * (0.5 + random()),
  ]);
  const swell = (dir) => lumps.reduce((sum, [axis, amount]) => sum + amount * Math.max(0, dir.dot(axis)) ** 5, 0.9);
  const clusters = Array.from({ length: BUSH_FOLIAGE.clusters }, () =>
    new Vector3(random() - 0.5, 0.15 + random() * 0.6, random() - 0.5).normalize(),
  );
  const direction = new Vector3();
  for (const kind of ['clump', 'leaf', 'flower', 'buds']) {
    for (let i = 0; i < BUSH_FOLIAGE[kind]; i++) {
      const outer = kind === 'flower' || kind === 'buds';
      if (outer) {
        // Near one of the cluster centres.
        const centre = clusters[Math.floor(random() * clusters.length)];
        direction.copy(centre).addScaledVector(jitter(), BUSH_FOLIAGE.clusterSpread * 2).normalize();
      } else {
        // Uniform on the sphere, then stretched onto the ellipsoid.
        const z = random() * 2 - 1;
        const phi = random() * Math.PI * 2;
        const r = Math.sqrt(1 - z * z);
        direction.set(r * Math.cos(phi), z, r * Math.sin(phi));
      }
      if (outer && direction.y < -0.25) direction.y = -direction.y * 0.6;
      const depth = outer ? random() * 0.25 : Math.pow(random(), 1.5);
      const stray = kind !== 'clump' && random() < BUSH_FOLIAGE.stray ? random() * BUSH_FOLIAGE.strayReach : 0;
      const scale = swell(direction) + stray - (depth * BUSH_FOLIAGE.inset) / Math.min(a, b, c);
      const position = new Vector3(direction.x * a * scale, direction.y * b * scale + lift, direction.z * c * scale);
      if (position.y < BUSH_FOLIAGE.ground) position.y = BUSH_FOLIAGE.ground + random() * 0.15;
      const normal = new Vector3(direction.x / a, direction.y / b, direction.z / c).normalize();
      normal.add(jitter().multiplyScalar(1.4)).addScaledVector(up, 0.35).normalize();
      const tip = up.clone().multiplyScalar(0.8).addScaledVector(normal, 0.5).addScaledVector(jitter(), 1.2);
      const height = MathUtils.clamp((direction.y + 1) / 2, 0, 1);
      cards.push({ kind, position, normal, tip, shade: crownShade(kind, height, depth) });
    }
  }
  return cards;
}

// Atlas cell, leaflet cut-out and flutter, shared by the foliage and its
// depth-only twin. `soft`: the cut edge blends over one pixel (the twin
// keeps the hard cut). Each card glows faintly (flowers more), as if lit
// by the city, so the magenta reads at night.
function addCardShader(material, time, soft) {
  const previous = material.onBeforeCompile;
  const key = `${material.customProgramCacheKey()}|bauhinia${soft ? '-soft' : ''}`;
  material.customProgramCacheKey = () => key;
  material.onBeforeCompile = (shader, renderer) => {
    previous?.(shader, renderer);
    shader.uniforms.treeTime = time;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float treeTime;
        attribute vec4 cardInfo;
        varying float vCardGlow;`,
      )
      .replace(
        '#include <uv_vertex>',
        `#include <uv_vertex>
        vMapUv = uv * 0.5 + cardInfo.xy;
        vCardGlow = cardInfo.z;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float cardPhase = dot( instanceMatrix[ 3 ].xyz, vec3( 1.3, 0.7, 1.1 ) );
        float cardFlap = sin( treeTime * 2.1 + cardPhase ) + 0.4 * sin( treeTime * 4.7 + cardPhase * 1.9 );
        transformed.z += cardFlap * cardInfo.w * position.y;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying float vCardGlow;`,
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        ${
          soft
            ? `float cardEdge = clamp( ( sampledDiffuseColor.a - 0.5 ) / max( fwidth( sampledDiffuseColor.a ), 1e-4 ) + 0.5, 0.0, 1.0 );
        if ( cardEdge < 0.02 ) discard;
        diffuseColor.a = opacity * cardEdge;`
            : `if ( sampledDiffuseColor.a < 0.5 ) discard;
        diffuseColor.a = opacity;`
        }`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        totalEmissiveRadiance += diffuseColor.rgb * vCardGlow;`,
      );
  };
  return material;
}

// In the tree's local frame, so the wind is turned back by its yaw. Returns
// the mesh, its material and step(time).
function fallingPetals(spawns, random, { yaw, scale, height }) {
  const wind = WIND.clone().applyAxisAngle(up, -yaw).divideScalar(scale);
  const landing = (FALLING.landing - height) / scale;
  const material = new MeshBasicMaterial({ map: petalTexture(), transparent: true, side: DoubleSide, depthWrite: false });
  const mesh = new InstancedMesh(new PlaneGeometry(...PETAL_CARD), material, FALLING.count);
  mesh.frustumCulled = false;
  mesh.renderOrder = 3;
  mesh.userData.noProbe = true;

  const colour = new Color();
  const petals = [];
  const launch = (position) => position.copy(spawns[Math.floor(random() * spawns.length)]);
  for (let i = 0; i < FALLING.count; i++) {
    mesh.setColorAt(i, colour.setHex(COLOURS[Math.floor(random() * COLOURS.length)]));
    const petal = {
      position: launch(new Vector3()),
      fall: (FALL[0] + (FALL[1] - FALL[0]) * random()) / scale,
      sway: [0.6 + random() * 0.8, random() * Math.PI * 2, 0.2 + random() * 0.3], // freq, phase, metres
      spin: [0.8 + random() * 1.6, 0.4 + random(), 0.3 + random() * 0.6].map((v) => (random() < 0.5 ? -v : v)),
      size: (FALLING.size[0] + (FALLING.size[1] - FALLING.size[0]) * random()) / scale,
    };
    // Start part-way down, so they don't all leave the tree together.
    const drop = (petal.position.y - landing) * random();
    petal.position.addScaledVector(wind, drop / petal.fall).y -= drop;
    petals.push(petal);
  }

  const euler = new Euler();
  const quaternion = new Quaternion();
  const size = new Vector3();
  const m = new Matrix4();
  let last = 0;
  function step(seconds) {
    const dt = Math.min(Math.max(seconds - last, 0), 0.1);
    last = seconds;
    for (const [i, petal] of petals.entries()) {
      const p = petal.position;
      const [freq, phase, amp] = petal.sway;
      const sway = (Math.cos(seconds * freq + phase) * amp * freq) / scale;
      p.x += (wind.x + sway) * dt;
      p.z += (wind.z + sway * 0.5) * dt;
      p.y -= petal.fall * dt;
      if (p.y < landing) launch(p);
      const [sx, sy, sz] = petal.spin;
      quaternion.setFromEuler(euler.set(seconds * sx + i, seconds * sy + i * 2, seconds * sz + i * 3));
      mesh.setMatrixAt(i, m.compose(p, quaternion, size.setScalar(petal.size)));
    }
    mesh.instanceMatrix.needsUpdate = true;
  }
  step(0);
  return { mesh, material, step };
}

function depthTwin(mesh, material) {
  const twin = mesh.isInstancedMesh ? new InstancedMesh(mesh.geometry, material, mesh.count) : new Mesh(mesh.geometry, material);
  if (mesh.isInstancedMesh) twin.instanceMatrix = mesh.instanceMatrix;
  twin.renderOrder = 1;
  twin.userData.noProbe = true;
  return twin;
}

// spec: { position, yaw, scale, seed }. Returns the group, the faded
// materials, and update(time) for the flutter and falling petals (not called
// in reduced motion, where the petals hang still).
export function createBauhinia({ position, yaw = 0, scale = 1, seed = 5, viewer = null }) {
  const random = seededRandom(seed);
  const time = { value: 0 };
  const skeleton = grow(random);

  const group = new Group();
  group.position.fromArray(position);
  group.rotation.y = yaw;
  group.scale.setScalar(scale);

  const bark = new MeshLambertMaterial({ vertexColors: true, transparent: true });
  const wood = new Mesh(
    mergeGeometries(skeleton.branches.map(({ curve, radius, level }) => tube(curve, radius, level === 0 ? 0.85 : 1))),
    bark,
  );
  wood.renderOrder = 2;

  const cards = foliage(skeleton, random);
  const { leaves, leafTwin, material: leafMaterial } = foliageMeshes(cards, random, time, {
    viewer: viewer && localViewer(viewer, position, yaw, scale),
  });
  const woodTwin = depthTwin(wood, new MeshBasicMaterial(DEPTH_ONLY));

  const spawns = cards.filter(({ kind }) => kind === 'flower').map(({ position: p }) => p);
  const falling = fallingPetals(spawns, random, { yaw, scale, height: position[1] });

  group.add(woodTwin, leafTwin, wood, leaves, falling.mesh);
  return {
    group,
    materials: [bark, leafMaterial, falling.material],
    update(seconds) {
      time.value = seconds;
      falling.step(seconds);
    },
  };
}

let foliageArt;
// A clear canvas the atlas's size until the artwork has loaded and is drawn
// into it (as the drifting petals do): the foliage stays invisible until
// then, and its shader is the same before and after.
function foliageTexture() {
  if (foliageArt) return foliageArt;
  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = FOLIAGE_ART.size;
  foliageArt = new CanvasTexture(canvas);
  foliageArt.colorSpace = SRGBColorSpace;
  new ImageLoader().load(`${import.meta.env.BASE_URL}${FOLIAGE_ART.url}`, (image) => {
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    foliageArt.needsUpdate = true;
  });
  return foliageArt;
}

// Drawn just before the foliage: while it fades, only its front surface
// blends, so leaves behind leaves don't show through.
const DEPTH_ONLY = { colorWrite: false, transparent: true, polygonOffset: true, polygonOffsetFactor: 0, polygonOffsetUnits: 2 };

// How far flowers turn toward the viewer: edge-on they read as pink slivers.
const FLOWER_FACING = 1.3;

// The viewer's position in a group's local frame (position, yaw, uniform scale).
function localViewer(viewer, position, yaw, scale = 1) {
  return new Vector3().fromArray(viewer).sub(new Vector3().fromArray(position)).applyAxisAngle(up, -yaw).divideScalar(scale);
}

// The foliage cards as one instanced mesh, and its depth-only twin.
// `lamps`: strength of the lantern pools on the leaves (0: none); `viewer`:
// local point the flowers turn toward.
function foliageMeshes(cards, random, time, { lamps = 0, viewer = null } = {}) {
  if (viewer) {
    for (const card of cards) {
      if (card.kind !== 'flower') continue;
      const toward = viewer.clone().sub(card.position).normalize();
      card.normal = card.normal.clone().addScaledVector(toward, FLOWER_FACING).normalize();
    }
  }
  const map = foliageTexture();
  // One pass for both faces (three.js would draw transparent two-sided cards
  // twice): the depth twin already keeps the nearest card in front.
  let material = addCardShader(new MeshLambertMaterial({ map, side: DoubleSide, transparent: true, forceSinglePass: true }), time, true);
  if (lamps > 0) material = addLampLight(material, lamps);
  const leaves = new InstancedMesh(new PlaneGeometry(1, 1).translate(0, 0.5, 0), material, cards.length);
  const info = new Float32Array(cards.length * 4);
  const m = new Matrix4();
  const x = new Vector3();
  const y = new Vector3();
  const colour = new Color();
  cards.forEach(({ kind, position: p, normal, tip, shade }, i) => {
    const card = CARDS[kind];
    const size = card.size[0] + (card.size[1] - card.size[0]) * random();
    y.copy(tip).addScaledVector(normal, -tip.dot(normal)).normalize();
    x.crossVectors(y, normal).normalize();
    m.makeBasis(x.clone().multiplyScalar(size), y.clone().multiplyScalar(size), normal.clone().multiplyScalar(size));
    // Flowers are centred on their point; the others hang from their stalk.
    const origin = kind === 'flower' ? p.clone().addScaledVector(y, -size / 2) : p;
    m.setPosition(origin);
    leaves.setMatrixAt(i, m);
    const tone = (kind === 'flower' ? 0.9 + random() * 0.2 : 0.75 + random() * 0.35) * shade;
    leaves.setColorAt(i, colour.setRGB(tone, tone * (0.95 + random() * 0.1), tone));
    info.set([...card.cell, card.glow, card.flutter], i * 4);
  });
  leaves.geometry.setAttribute('cardInfo', new InstancedBufferAttribute(info, 4));
  leaves.computeBoundingSphere();
  leaves.boundingSphere.radius += 0.5;
  leaves.renderOrder = 2;
  const leafTwin = depthTwin(
    leaves,
    addCardShader(new MeshBasicMaterial({ map, side: DoubleSide, forceSinglePass: true, ...DEPTH_ONLY }), time, false),
  );
  return { leaves, leafTwin, material };
}

// Fallen petals on the ground around the bush: flat, a few centimetres up
// so they never fight the paving.
const FALLEN = { count: 26, lift: 0.03, size: [0.12, 0.18] };

function fallenPetals([a, , c], random) {
  const material = new MeshBasicMaterial({ map: petalTexture(), transparent: true, depthWrite: false });
  const mesh = new InstancedMesh(new PlaneGeometry(...PETAL_CARD).rotateX(-Math.PI / 2), material, FALLEN.count);
  const colour = new Color();
  const m = new Matrix4();
  const q = new Quaternion();
  const s = new Vector3();
  const p = new Vector3();
  for (let i = 0; i < FALLEN.count; i++) {
    // In a ring just outside the crown's footprint, thinning outward.
    const angle = random() * Math.PI * 2;
    const reach = 0.85 + Math.pow(random(), 2) * 0.6;
    p.set(Math.cos(angle) * a * reach, FALLEN.lift, Math.sin(angle) * c * reach);
    q.setFromAxisAngle(up, random() * Math.PI * 2);
    s.setScalar(FALLEN.size[0] + (FALLEN.size[1] - FALLEN.size[0]) * random());
    mesh.setMatrixAt(i, m.compose(p, q, s));
    // Dimmer than the drifting petals: they lie in the bush's shadow.
    mesh.setColorAt(i, colour.setHex(COLOURS[Math.floor(random() * 2)]).multiplyScalar(0.8));
  }
  mesh.computeBoundingSphere();
  mesh.renderOrder = 2;
  mesh.userData.noProbe = true;
  return { mesh, material };
}

// spec: { position, yaw, size: [length, height, depth], seed }. A low,
// dense Hong Kong orchid bush (user request, 2026-10-03): several thin stems
// from the ground under a mounded crown, flowers all over its top, fallen
// petals around it, and the lanterns' warm light on its leaves. Returns the
// group, the faded materials, and update(time) for the flutter.
export function createBauhiniaBush({ position, yaw = 0, size = [7, 2.3, 2.6], seed = 11, lamps = 1.5, viewer = null }) {
  const random = seededRandom(seed);
  const time = { value: 0 };
  const [length, height, depth] = size;
  const lift = height * 0.55;
  const axes = [length / 2, height - lift, depth / 2];

  const group = new Group();
  group.position.fromArray(position);
  group.rotation.y = yaw;

  // Stems: fanning out and up from a tight base to just under the crown's
  // surface, each forking once near its end.
  const branches = [];
  const STEMS = 9;
  for (let i = 0; i < STEMS; i++) {
    const azimuth = ((i + random() * 0.6) / STEMS) * Math.PI * 2;
    const base = new Vector3((random() - 0.5) * axes[0] * 0.5, 0, (random() - 0.5) * axes[2] * 0.4);
    const reach = 0.55 + random() * 0.2;
    const end = new Vector3(Math.cos(azimuth) * axes[0] * reach, lift + (0.1 + random() * 0.5) * axes[1], Math.sin(azimuth) * axes[2] * reach);
    const middle = base.clone().lerp(end, 0.5).setY(end.y * 0.35);
    const stem = new QuadraticBezierCurve3(base, middle, end);
    branches.push({ curve: stem, radius: [0.05, 0.03] });
    for (let k = 0; k < 2; k++) {
      const from = stem.getPoint(0.7 + random() * 0.2);
      const to = from.clone().add(new Vector3((random() - 0.5) * 0.9, 0.3 + random() * 0.4, (random() - 0.5) * 0.9));
      branches.push({ curve: new QuadraticBezierCurve3(from, from.clone().lerp(to, 0.5).add(new Vector3(0, 0.1, 0)), to), radius: [0.025, 0.012] });
    }
  }
  const bark = addLampLight(new MeshLambertMaterial({ vertexColors: true, transparent: true }), lamps);
  const wood = new Mesh(mergeGeometries(branches.map(({ curve, radius }) => tube(curve, radius, 0.8))), bark);
  wood.renderOrder = 2;

  const cards = bushFoliage(axes, lift, random);
  const { leaves, leafTwin, material: leafMaterial } = foliageMeshes(cards, random, time, {
    lamps,
    viewer: viewer && localViewer(viewer, position, yaw),
  });
  const fallen = fallenPetals(axes, random);

  group.add(leafTwin, wood, leaves, fallen.mesh);
  return {
    group,
    materials: [bark, leafMaterial, fallen.material],
    update(seconds) {
      time.value = seconds;
    },
  };
}
