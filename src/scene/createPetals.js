import {
  CanvasTexture,
  ImageLoader,
  Color,
  DoubleSide,
  Euler,
  Group,
  InstancedMesh,
  MathUtils,
  Matrix4,
  MeshBasicMaterial,
  PlaneGeometry,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from 'three';
import { seededRandom } from './random.js';
import { OVERLAY } from './bloom.js';

// Bauhinia (洋紫荊) petals drifting over the harbour: the user's petal artwork,
// shaded per instance. Three depth layers live in boxes that travel with the
// camera; petals wrap around inside them, so the camera's own motion still gives
// parallax, at three speeds.
//   near: a few large petals close to the lens, drawn over everything,
//         including the 香港 wordmark (user request, 2026-10-01).
//   mid:  between the two, where petals read as petals with depth (user
//         choices, 2026-10-04: added, then doubled); depth-tested.
//   far:  many small petals, depth-tested and softened by fog.
// The near layer stays small: it crosses 香港 and the copy.
// box = [x, y, z] size in metres, centred `ahead` metres in front of the camera.
const LAYERS = {
  near: { box: [5, 4, 5], ahead: 4, size: [0.13, 0.2], max: { desktop: 6, mobile: 4 } },
  mid: { box: [18, 11, 12], ahead: 12, size: [0.15, 0.24], max: { desktop: 40, mobile: 16 } },
  far: { box: [50, 26, 44], ahead: 30, size: [0.2, 0.34], max: { desktop: 100, mobile: 44 } },
};
// The artwork's own fuchsia, dimmed for the night in four shades, so the petals
// sit in the scene and the junk's coral sails lead (user choice, 2026-10-02).
export const COLOURS = [0x8c8c8c, 0xa0a0a0, 0xb4b4b4, 0xc8c8c8];
// Card size: the artwork's 512 × 500 proportions, scaled so the petal's length
// matches the old code-drawn petal's.
export const PETAL_CARD = [0.92, 0.9];
const PETAL_ART = { url: 'atmosphere/bauhinia-petal.webp', size: [512, 500] };
// Toward screen left, away from the bauhinia on the hero's right edge.
export const WIND = new Vector3(-0.35, 0, 0.1); // metres per second
export const FALL = [0.25, 0.5]; // metres per second
const GUST = { gain: 3, max: 2.5, rise: 3, decay: 1.2 }; // scroll speed → extra drift
const FADE_WIDTH = 0.15; // share of the density range over which each petal shrinks away
// The desktop pointer's stir (pointerStir.js, user choice, 2026-10-04):
// radius in ndc (the screen is 2 tall); push: ndc per second outward at full
// stir; carry: share of the pointer's own velocity passed on. The push sticks,
// so a stirred petal drifts on from where it was sent.
const STIR = { radius: 0.3, push: 0.5, carry: 0.35 };

let petal;
// Shared with the bauhinia's falling petals.
export function petalTexture() {
  petal ??= loadPetal();
  return petal;
}

// A canvas the artwork's size, clear (so the petals are invisible) until the
// artwork has loaded and is drawn into it: the texture keeps its size, so no
// reallocation, and the petal shader is the same before and after.
function loadPetal() {
  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = PETAL_ART.size;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  new ImageLoader().load(`${import.meta.env.BASE_URL}${PETAL_ART.url}`, (image) => {
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    texture.needsUpdate = true;
  });
  return texture;
}

function createLayer(name, layer, texture, random, onTop) {
  const total = layer.max.desktop;
  const material = new MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.92,
    side: DoubleSide,
    depthWrite: false,
    depthTest: !onTop,
  });
  const mesh = new InstancedMesh(new PlaneGeometry(...PETAL_CARD), material, total);
  mesh.name = 'petals';
  mesh.frustumCulled = false;
  if (onTop) {
    mesh.renderOrder = 11; // after the wordmark (10)
    mesh.layers.set(OVERLAY);
  }

  const colour = new Color();
  const petals = [];
  for (let i = 0; i < total; i++) {
    mesh.setColorAt(i, colour.setHex(COLOURS[Math.floor(random() * COLOURS.length)]));
    petals.push({
      position: new Vector3(),
      fall: MathUtils.lerp(FALL[0], FALL[1], random()),
      sway: [0.6 + random() * 0.8, random() * Math.PI * 2, 0.2 + random() * 0.3], // freq, phase, metres
      spin: [0.8 + random() * 1.6, 0.4 + random(), 0.3 + random() * 0.6].map((v) => (random() < 0.5 ? -v : v)),
      phase: [random() * 6, random() * 6, random() * 6],
      size: MathUtils.lerp(layer.size[0], layer.size[1], random()),
      // Petals leave in this order as the density drops, shrinking rather than popping.
      threshold: ((i + random()) / total) * (1 - FADE_WIDTH),
      seed: [random(), random(), random()],
    });
  }
  return { name, layer, mesh, petals, placed: 0 };
}

const centre = new Vector3();
const forward = new Vector3();
const euler = new Euler();
const quaternion = new Quaternion();
const scale = new Vector3();
const matrix = new Matrix4();
const screen = new Vector3();
const right = new Vector3();
const up = new Vector3();
const offset = new Vector3();

// Pushes p (world) away from the pointer and along its motion, in screen terms.
function stirPetal(p, camera, stir, dt, tanHalf) {
  screen.copy(p).project(camera);
  if (screen.z > 1) return;
  const dx = (screen.x - stir.x) * camera.aspect;
  const dy = screen.y - stir.y;
  const gap = Math.hypot(dx, dy);
  if (gap >= STIR.radius || gap < 1e-4) return;
  const f = (1 - gap / STIR.radius) ** 2 * stir.strength;
  const depth = offset.copy(p).sub(camera.position).dot(forward);
  if (depth <= 0) return;
  const metres = tanHalf * depth * dt * f; // one ndc of height at this depth
  const across = (dx / gap) * STIR.push + stir.vx * camera.aspect * STIR.carry;
  const lift = (dy / gap) * STIR.push + stir.vy * STIR.carry;
  p.addScaledVector(right, across * metres).addScaledVector(up, lift * metres);
}

function wrap(value, middle, half) {
  const span = half * 2;
  return middle - half + ((((value - middle + half) % span) + span) % span);
}

export function createPetals() {
  const texture = petalTexture();
  const random = seededRandom(23);
  const layers = [
    createLayer('near', LAYERS.near, texture, random, true),
    createLayer('far', LAYERS.far, texture, random, false),
    createLayer('mid', LAYERS.mid, texture, random, false),
  ];
  const group = new Group();
  group.name = 'petals';
  for (const { mesh } of layers) group.add(mesh);

  let density = 1;
  let enabled = true;
  let gust = 0;
  let time = 0;

  function refreshVisibility() {
    group.visible = enabled && density > 0.001;
  }

  function setBreakpoint(breakpoint) {
    for (const { layer, mesh } of layers) mesh.count = layer.max[breakpoint] ?? layer.max.desktop;
  }

  function setDensity(value) {
    density = value;
    refreshVisibility();
  }

  // Off in reduced motion (stepped mode renders still frames only).
  function setEnabled(value) {
    enabled = value;
    refreshVisibility();
  }

  // scrollSpeed: absolute scroll progress per second, for the gust.
  // stir: the desktop pointer (pointerStir.js), or none.
  function update(dt, camera, scrollSpeed = 0, stir = null) {
    if (!group.visible) return;
    time += dt;
    const targetGust = Math.min(scrollSpeed * GUST.gain, GUST.max);
    gust += (targetGust - gust) * (1 - Math.exp(-(targetGust > gust ? GUST.rise : GUST.decay) * dt));
    camera.getWorldDirection(forward);
    const stirring = stir && stir.strength > 0.001;
    const tanHalf = Math.tan(MathUtils.degToRad(camera.fov / 2));
    if (stirring) {
      right.setFromMatrixColumn(camera.matrixWorld, 0);
      up.setFromMatrixColumn(camera.matrixWorld, 1);
    }

    for (const set of layers) {
      const { layer, mesh, petals } = set;
      centre.copy(camera.position).addScaledVector(forward, layer.ahead);
      const [hx, hy, hz] = layer.box.map((v) => v / 2);
      for (let i = 0; i < mesh.count; i++) {
        const petal = petals[i];
        const p = petal.position;
        if (i >= set.placed) {
          p.set(centre.x + (petal.seed[0] - 0.5) * hx * 2, centre.y + (petal.seed[1] - 0.5) * hy * 2, centre.z + (petal.seed[2] - 0.5) * hz * 2);
        }
        const [freq, phase, amp] = petal.sway;
        const sway = Math.cos(time * freq + phase) * amp * freq;
        p.x += (WIND.x + sway - gust) * dt;
        p.y += (gust * 0.4 - petal.fall) * dt;
        p.z += (WIND.z + gust * 0.3) * dt;
        if (stirring) stirPetal(p, camera, stir, dt, tanHalf);
        p.set(wrap(p.x, centre.x, hx), wrap(p.y, centre.y, hy), wrap(p.z, centre.z, hz));

        const [sx, sy, sz] = petal.spin;
        const [px, py, pz] = petal.phase;
        euler.set(time * sx + px, time * sy + py, time * sz + pz);
        quaternion.setFromEuler(euler);
        const s = petal.size * MathUtils.smoothstep(density, petal.threshold, petal.threshold + FADE_WIDTH);
        scale.setScalar(s);
        mesh.setMatrixAt(i, matrix.compose(p, quaternion, scale));
      }
      set.placed = Math.max(set.placed, mesh.count);
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  return { group, setBreakpoint, setDensity, setEnabled, update };
}
