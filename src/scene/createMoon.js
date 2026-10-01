import {
  AdditiveBlending,
  CanvasTexture,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
} from 'three';
import { WORLD } from '../data/world.js';
import { seededRandom } from './random.js';

// Original procedural moon: a warm disc with soft maria, plus an additive halo.
// Both sit beyond the far mountain range, so the ridge hides the lower edge.
const SIZE = 512;
const HALO_SCALE = 3.2; // halo diameter in moon diameters

// Maria in disc units (-1..1, y down): [x, y, spread, blobs, strength, size].
// A few large dark seas rather than many spots (user request, 2026-10-01).
const MARIA = [
  [-0.3, -0.28, 0.45, 10, 0.6, 0.22],
  [0.32, -0.08, 0.35, 8, 0.55, 0.2],
  [-0.05, 0.22, 0.3, 6, 0.5, 0.17],
];
const CRATERS = 6;

// Places a disc-space point (-1..1) on the canvas, squashed toward the rim as
// on a sphere, and runs draw(radius) in that frame.
function onSphere(ctx, r, x, y, draw) {
  const d = Math.hypot(x, y);
  if (d >= 0.98) return;
  const squash = Math.sqrt(1 - d * d);
  ctx.save();
  ctx.translate(r + x * r, r + y * r);
  ctx.rotate(Math.atan2(y, x));
  ctx.scale(squash, 1);
  draw();
  ctx.restore();
}

function blob(ctx, r, x, y, size, colour) {
  onSphere(ctx, r, x, y, () => {
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    g.addColorStop(0, colour);
    g.addColorStop(0.55, colour.replace(/[\d.]+\)$/, (a) => `${parseFloat(a) * 0.85})`));
    g.addColorStop(1, colour.replace(/[\d.]+\)$/, '0)'));
    ctx.fillStyle = g;
    ctx.fillRect(-size, -size, size * 2, size * 2);
  });
}

function crater(ctx, r, x, y, size) {
  onSphere(ctx, r, x, y, () => {
    const bowl = ctx.createRadialGradient(-size * 0.25, -size * 0.25, 0, 0, 0, size);
    bowl.addColorStop(0, 'rgba(140, 80, 30, 0.4)');
    bowl.addColorStop(1, 'rgba(140, 80, 30, 0.12)');
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fillStyle = bowl;
    ctx.fill();
  });
  // Rim and shadow stay in screen space so the light direction is constant.
  const px = r + x * r;
  const py = r + y * r;
  const squash = Math.sqrt(Math.max(0, 1 - x * x - y * y));
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(Math.atan2(y, x));
  ctx.scale(squash, 1);
  ctx.rotate(-Math.atan2(y, x));
  ctx.lineWidth = Math.max(1, size * 0.25);
  ctx.beginPath();
  ctx.arc(0, 0, size, Math.PI * 1.05, Math.PI * 1.7);
  ctx.strokeStyle = 'rgba(110, 60, 20, 0.45)';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, size, Math.PI * 0.05, Math.PI * 0.7);
  ctx.strokeStyle = 'rgba(255, 240, 200, 0.5)';
  ctx.stroke();
  ctx.restore();
}

// Fine mottling so flat areas don't look airbrushed.
function grain(ctx, random) {
  const image = ctx.getImageData(0, 0, SIZE, SIZE);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (random() - 0.5) * 14;
    data[i] += n;
    data[i + 1] += n;
    data[i + 2] += n * 0.6;
  }
  ctx.putImageData(image, 0, 0);
}

function drawDisc(seed) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  const r = SIZE / 2;

  ctx.beginPath();
  ctx.arc(r, r, r - 2, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = '#f7d27a';
  ctx.fillRect(0, 0, SIZE, SIZE);
  const random = seededRandom(seed);

  // Maria: clusters of overlapping soft blobs, the moon's dark "seas".
  for (const [cx, cy, spread, count, strength, size] of MARIA) {
    for (let i = 0; i < count; i++) {
      const x = cx + (random() - 0.5) * spread;
      const y = cy + (random() - 0.5) * spread;
      blob(ctx, r, x, y, size * (0.6 + random() * 0.6) * r, `rgba(160, 90, 28, ${strength * (0.6 + random() * 0.4)})`);
    }
  }

  // Craters: a dark bowl, shadowed on the lit (upper-left) side, with a bright
  // lower-right rim.
  for (let i = 0; i < CRATERS; i++) {
    const angle = random() * Math.PI * 2;
    const distance = Math.sqrt(random()) * 0.92;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const size = (0.012 + random() ** 2 * 0.05) * r;
    crater(ctx, r, x, y, size);
  }

  grain(ctx, random);

  // Sphere shading: light from the upper left, a darker rim all round.
  ctx.globalCompositeOperation = 'multiply';
  const shade = ctx.createRadialGradient(r * 0.72, r * 0.68, r * 0.05, r, r, r);
  shade.addColorStop(0, '#ffffff');
  shade.addColorStop(0.6, '#f8ead2');
  shade.addColorStop(1, '#c98a4c');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.globalCompositeOperation = 'screen';
  const shine = ctx.createRadialGradient(r * 0.7, r * 0.64, 0, r * 0.7, r * 0.64, r * 0.7);
  shine.addColorStop(0, 'rgba(255, 244, 210, 0.35)');
  shine.addColorStop(1, 'rgba(255, 244, 210, 0)');
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.globalCompositeOperation = 'source-over';

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function drawHalo() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const glow = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  // Eased falloff; a straight ramp to zero leaves a visible rim.
  for (const [stop, alpha] of [[0, 0.5], [0.15, 0.3], [0.35, 0.12], [0.6, 0.04], [0.85, 0.01], [1, 0]]) {
    glow.addColorStop(stop, `rgba(246, 196, 106, ${alpha})`);
  }
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function createMoon() {
  const { position, radius, facing, seed } = WORLD.moon;
  const group = new Group();
  group.name = 'moon';
  group.position.fromArray(position);
  group.lookAt(...facing);

  // Unfogged: at this distance the scene fog would erase it.
  const halo = new Mesh(
    new PlaneGeometry(1, 1),
    new MeshBasicMaterial({ map: drawHalo(), transparent: true, depthWrite: false, fog: false, blending: AdditiveBlending }),
  );
  halo.scale.setScalar(radius * 2 * HALO_SCALE);
  halo.position.z = -10;

  const disc = new Mesh(
    new PlaneGeometry(1, 1),
    new MeshBasicMaterial({ map: drawDisc(seed), transparent: true, depthWrite: false, fog: false }),
  );
  disc.scale.setScalar(radius * 2);

  group.add(halo, disc);
  return { group };
}
