import {
  AdditiveBlending,
  CanvasTexture,
  DoubleSide,
  Group,
  ImageLoader,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  PlaneGeometry,
  SRGBColorSpace,
  Vector3,
} from 'three';
import { OVERLAY } from './bloom.js';
import { seededRandom } from './random.js';

// Lens bokeh (user choice, 2026-10-04; Kage's particles at several depths,
// technique only): specks of city light drifting just in front of the lens,
// so close they are out of focus — round discs with a brighter rim, and in
// 05 a few soft petals too. They ride with the camera, drift down and to
// the left, and shift against the mouse a little more than anything in the
// scene. Drawn over everything. Off in reduced motion. Sizes in metres.
// 03–04: two restrained edge highlights (`busy` 0). 05: the denser pack
// (`busy` 1), skipping Two IFC's shaft (user request, 2026-10-04).
const LENS = {
  count: { desktop: 12, mobile: 8 },
  petals: { desktop: 3, mobile: 2 },
  few: { desktop: 2, mobile: 1 },
  distance: [1.1, 1.8],
  size: { petal: [0.14, 0.24], mote: [0.05, 0.22] },
  opacity: { petal: [0.28, 0.42], mote: [0.18, 0.4] },
  // Quiet scenes need depth, not visible lens rings: keep the remaining
  // motes small, dim and outside the main ferry/copy composition.
  quiet: { opacity: 0.48, size: 0.68, side: 0.58 },
  drift: [0.02, 0.05], // per second, as a share of the half width
  parallax: 0.08, // share of the half width at the pointer's full reach
  // Petals stay toward the sides. Motions may sit further in (05).
  side: { petal: 0.45, mote: 0.08 },
  // NDC band covering Two IFC on the 05 desktop hold (probe left 56–67%).
  ifc: { x0: 0.08, x1: 0.42, y0: -0.88, y1: 0.9 },
};
const PETALS = LENS.petals.desktop;
const MOTES = LENS.count.desktop - PETALS;
const MOTE_COLOURS = [0xffc98e, 0xffd9b0, 0xc8d6ff, 0xffe8c4, 0xb8c8ff];
const PETAL_TINT = 0xd0a8c0;
const PETAL_URL = 'atmosphere/bauhinia-petal.webp';

// The petal artwork blurred by drawing it small and scaling it back up
// twice: a soft blur that needs no canvas filter (not in every browser).
// Clear until the artwork loads.
function blurredPetal() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  new ImageLoader().load(`${import.meta.env.BASE_URL}${PETAL_URL}`, (image) => {
    let source = image;
    for (const size of [14, 40]) {
      const step = document.createElement('canvas');
      step.width = step.height = size;
      const ctx = step.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      // Inset, so the blur has room to spread inside the card.
      ctx.drawImage(source, size * 0.18, size * 0.18, size * 0.64, size * 0.64);
      source = step;
    }
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, 128, 128);
    texture.needsUpdate = true;
  });
  return texture;
}

// A bokeh disc: an even soft fill, a slightly brighter rim, a soft edge.
function moteDisc() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  gradient.addColorStop(0.68, 'rgba(255, 255, 255, 0.6)');
  gradient.addColorStop(0.82, 'rgba(255, 255, 255, 0.85)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(canvas);
}

const right = new Vector3();
const up = new Vector3();
const forward = new Vector3();

export function createLensBokeh() {
  const group = new Group();
  group.name = 'lens';
  const random = seededRandom(57);
  const geometry = new PlaneGeometry(1, 1);
  const textures = { petal: blurredPetal(), mote: moteDisc() };
  const between = ([a, b]) => MathUtils.lerp(a, b, random());

  const specks = [];
  let busy = 0;
  const coversIfc = (x, y) => x > LENS.ifc.x0 && x < LENS.ifc.x1 && y > LENS.ifc.y0 && y < LENS.ifc.y1;
  function place(speck, incoming = false) {
    const side = speck.kind === 'petal'
      ? LENS.side.petal
      : MathUtils.lerp(LENS.quiet.side, LENS.side.mote, busy);
    for (let n = 0; n < 14; n++) {
      let x;
      let y;
      if (incoming) {
        if (random() < 0.5) {
          x = 1.15;
          y = random() * 1.8 - 0.9;
        } else {
          x = MathUtils.lerp(-0.95, 0.95, random());
          y = 1.15;
        }
      } else {
        x = (random() < 0.5 ? -1 : 1) * MathUtils.lerp(side, 0.95, random());
        y = busy < 0.45 && speck.kind === 'mote'
          ? MathUtils.lerp(0.05, 0.92, random())
          : random() * 1.8 - 0.9;
      }
      if (speck.kind === 'petal' || busy < 0.45 || !coversIfc(x, y)) {
        speck.x = x;
        speck.y = y;
        return;
      }
    }
    speck.x = -MathUtils.lerp(0.5, 0.95, random());
    speck.y = random() * 1.6 - 0.7;
  }

  for (let i = 0; i < PETALS + MOTES; i++) {
    const petal = i < PETALS;
    const kind = petal ? 'petal' : 'mote';
    const material = new MeshBasicMaterial({
      map: textures[kind],
      color: petal ? PETAL_TINT : MOTE_COLOURS[(i - PETALS) % MOTE_COLOURS.length],
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      side: DoubleSide,
      blending: petal ? NormalBlending : AdditiveBlending,
    });
    const mesh = new Mesh(geometry, material);
    mesh.layers.set(OVERLAY);
    mesh.renderOrder = 12; // after the near petals (11)
    mesh.frustumCulled = false;
    mesh.userData.noProbe = true;
    group.add(mesh);
    const speck = {
      mesh,
      kind,
      opacity: between(LENS.opacity[kind]),
      size: between(LENS.size[kind]),
      distance: between(LENS.distance),
      drift: between(LENS.drift),
      spin: (random() - 0.5) * 0.6,
      turn: random() * Math.PI * 2,
      x: 0,
      y: 0,
    };
    place(speck);
    specks.push(speck);
  }

  let breakpoint = 'desktop';
  let petalCount = LENS.petals.desktop;
  let moteCount = LENS.count.desktop - LENS.petals.desktop;
  let level = 0;
  let opacityGain = 1;
  let sizeGain = 1;
  let enabled = true;

  function shown(i) {
    if (i < PETALS) return i < petalCount;
    return i - PETALS < moteCount;
  }

  function look() {
    petalCount = Math.round(MathUtils.lerp(0, LENS.petals[breakpoint] ?? LENS.petals.desktop, busy));
    const few = LENS.few[breakpoint] ?? LENS.few.desktop;
    const full = (LENS.count[breakpoint] ?? LENS.count.desktop) - (LENS.petals[breakpoint] ?? LENS.petals.desktop);
    moteCount = Math.round(MathUtils.lerp(few, full, busy));
    opacityGain = MathUtils.lerp(LENS.quiet.opacity, 1, busy);
    sizeGain = MathUtils.lerp(LENS.quiet.size, 1, busy);
  }

  function apply() {
    look();
    const on = enabled && level > 0.001;
    specks.forEach((speck, i) => {
      speck.mesh.visible = on && shown(i);
      speck.mesh.material.opacity = speck.opacity * level * opacityGain;
    });
  }

  function setBreakpoint(value) {
    breakpoint = value;
    apply();
  }

  function setLevel(value) {
    if (value === level) return;
    level = value;
    apply();
  }

  function setBusy(value) {
    if (value === busy) return;
    busy = value;
    apply();
  }

  function setEnabled(value) {
    enabled = value;
    apply();
  }

  // pointer: the parallax's eased pointer (-1 to 1 each way), or zero.
  function update(dt, camera, pointer) {
    if (!enabled || level <= 0.001) return;
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    up.setFromMatrixColumn(camera.matrixWorld, 1);
    camera.getWorldDirection(forward);
    const tanV = Math.tan(MathUtils.degToRad(camera.fov / 2));
    for (let i = 0; i < specks.length; i++) {
      if (!shown(i)) continue;
      const speck = specks[i];
      speck.x -= speck.drift * dt * 1.4;
      speck.y -= speck.drift * dt;
      // Out past the left or bottom edge: back in at the right or top.
      if (speck.x < -1.15 || speck.y < -1.15) place(speck, true);
      speck.turn += speck.spin * dt;
      const halfH = tanV * speck.distance;
      const halfW = halfH * camera.aspect;
      const x = (speck.x - pointer.x * LENS.parallax) * halfW;
      const y = (speck.y - pointer.y * LENS.parallax) * halfH;
      const { mesh } = speck;
      mesh.position.copy(camera.position).addScaledVector(forward, speck.distance).addScaledVector(right, x).addScaledVector(up, y);
      mesh.quaternion.copy(camera.quaternion);
      mesh.rotateZ(speck.turn);
      mesh.scale.setScalar(speck.size * sizeGain);
    }
  }

  return { group, setBreakpoint, setLevel, setBusy, setEnabled, update };
}
