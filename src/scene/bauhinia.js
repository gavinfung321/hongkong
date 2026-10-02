import {
  BufferGeometry,
  Color,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PlaneGeometry,
  QuadraticBezierCurve3,
  Quaternion,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { COLOURS, FALL, WIND, petalTexture } from './createPetals.js';
import { seededRandom } from './random.js';
import { bauhiniaAtlas } from './surfaces.js';

// A Hong Kong orchid tree (Bauhinia blakeana) built in code, after the user's
// reference images (references only): a trunk leaning out over the water,
// forking low into dark arching limbs, and a loose crown of broad two-lobed
// leaves with magenta flowers bunched on its outer twigs. Local frame: the
// trunk leans toward +x; metres.

const TRUNK = { height: 5, lean: 4, base: 0.32, top: 0.21 };
const LIMBS = { count: 5, length: 3.6, radius: 0.15, bias: 1.8 };
const LEVELS = 4; // limb = 1; its forks down to the twigs at LEVELS
const FORKS = [0, 0, 3, 2, 2]; // children per branch, by child level
const SHRINK = 0.68;

// Atlas cells (u0, v0) and card sizes in metres.
const CARDS = {
  leaf: { cell: [0, 0.5], size: [0.15, 0.21], glow: 0.03, flutter: 0.14 },
  clump: { cell: [0.5, 0], size: [0.36, 0.5], glow: 0.03, flutter: 0.06 },
  flower: { cell: [0.5, 0.5], size: [0.19, 0.25], glow: 0.26, flutter: 0.08 },
  buds: { cell: [0, 0], size: [0.16, 0.22], glow: 0.12, flutter: 0.1 },
};
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

// Cards: [{ kind, position, normal, tip }]; normal faces out of the crown,
// tip runs from stalk to tip.
function foliage(skeleton, random) {
  const cards = [];
  const centre = skeleton.trunkTop.clone().add(new Vector3(2, 2, 0));
  const jitter = () => new Vector3(random() - 0.5, random() - 0.5, random() - 0.5);
  const add = (kind, at, spread, dir, outwardBias) => {
    const position = at.clone().add(jitter().multiplyScalar(spread));
    const outward = position.clone().sub(centre).normalize();
    const normal = outward.multiplyScalar(outwardBias).add(jitter().multiplyScalar(1.6)).addScaledVector(up, 0.3).normalize();
    const tip = dir.clone().addScaledVector(jitter(), 1.2);
    cards.push({ kind, position, normal, tip });
  };
  for (const { position, dir } of skeleton.tips) {
    for (let i = 0; i < 14; i++) add('leaf', position, 0.9, dir, 1);
    for (let i = 0; i < 7; i++) add('clump', position, 1.1, dir, 1);
    for (let i = 0; i < 6; i++) add('flower', position.clone().addScaledVector(dir, 0.2), 0.7, dir, 2);
    add('buds', position.clone().addScaledVector(dir, 0.15), 0.5, dir, 1.5);
  }
  for (const { curve, level } of skeleton.branches) {
    if (level < LEVELS - 2) continue;
    const n = level === LEVELS ? 1 : 2;
    for (let i = 0; i < 3 * n; i++) add('clump', curve.getPoint(0.4 + random() * 0.5), 0.7, up, 0.6);
    for (let i = 0; i < 4 * n; i++) add('leaf', curve.getPoint(0.3 + random() * 0.7), 0.6, up, 0.6);
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
  const mesh = new InstancedMesh(new PlaneGeometry(0.7, 1), material, FALLING.count);
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
export function createBauhinia({ position, yaw = 0, scale = 1, seed = 5 }) {
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

  const map = bauhiniaAtlas();
  const leafMaterial = addCardShader(
    new MeshLambertMaterial({ map, side: DoubleSide, transparent: true }),
    time,
    true,
  );
  const cards = foliage(skeleton, random);
  const leaves = new InstancedMesh(new PlaneGeometry(1, 1).translate(0, 0.5, 0), leafMaterial, cards.length);
  const info = new Float32Array(cards.length * 4);
  const m = new Matrix4();
  const x = new Vector3();
  const y = new Vector3();
  const colour = new Color();
  cards.forEach(({ kind, position: p, normal, tip }, i) => {
    const card = CARDS[kind];
    const size = card.size[0] + (card.size[1] - card.size[0]) * random();
    y.copy(tip).addScaledVector(normal, -tip.dot(normal)).normalize();
    x.crossVectors(y, normal).normalize();
    m.makeBasis(x.clone().multiplyScalar(size), y.clone().multiplyScalar(size), normal.clone().multiplyScalar(size));
    // Flowers are centred on their point; the others hang from their stalk.
    const origin = kind === 'flower' ? p.clone().addScaledVector(y, -size / 2) : p;
    m.setPosition(origin);
    leaves.setMatrixAt(i, m);
    const tone = kind === 'flower' ? 0.9 + random() * 0.2 : 0.75 + random() * 0.35;
    leaves.setColorAt(i, colour.setRGB(tone, tone * (0.95 + random() * 0.1), tone));
    info.set([...card.cell, card.glow, card.flutter], i * 4);
  });
  leaves.geometry.setAttribute('cardInfo', new InstancedBufferAttribute(info, 4));
  leaves.computeBoundingSphere();
  leaves.boundingSphere.radius += 0.5;
  leaves.renderOrder = 2;

  // Drawn just before the tree: while it fades, only its front surface
  // blends, so leaves behind leaves don't show through.
  const depthOnly = { colorWrite: false, transparent: true, polygonOffset: true, polygonOffsetFactor: 0, polygonOffsetUnits: 2 };
  const leafTwin = depthTwin(
    leaves,
    addCardShader(new MeshBasicMaterial({ map, side: DoubleSide, ...depthOnly }), time, false),
  );
  const woodTwin = depthTwin(wood, new MeshBasicMaterial(depthOnly));

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
