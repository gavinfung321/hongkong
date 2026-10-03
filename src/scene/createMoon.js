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
const HALO_SCALE = 5; // halo diameter in moon diameters

// Maria in disc units (-1..1, y down), laid out like the real near side so the
// joined, ragged seas read as the moon rather than two dark "eyes" (user
// request, 2026-10-03): [x, y, radius x, radius y, blobs, strength].
const MARIA = [
  [-0.62, -0.02, 0.2, 0.42, 22, 0.13], // Oceanus Procellarum
  [-0.3, -0.4, 0.27, 0.22, 18, 0.15], // Imbrium
  [0.02, -0.72, 0.32, 0.06, 10, 0.1], // Frigoris
  [-0.02, -0.18, 0.09, 0.07, 5, 0.1], // Vaporis
  [0.2, -0.36, 0.15, 0.14, 10, 0.15], // Serenitatis
  [0.36, -0.04, 0.2, 0.17, 14, 0.14], // Tranquillitatis
  [0.68, -0.26, 0.09, 0.07, 6, 0.15], // Crisium
  [0.56, 0.22, 0.11, 0.14, 8, 0.11], // Fecunditatis
  [0.36, 0.34, 0.07, 0.07, 4, 0.1], // Nectaris
  [-0.16, 0.38, 0.17, 0.13, 10, 0.11], // Nubium
  [-0.5, 0.42, 0.09, 0.08, 5, 0.12], // Humorum
];
const CRATERS = 6;
// The glow round the disc, in moon radii from its centre: a soft corona
// close in and a wide faint haze, as if seen through thin mist.
const CORONA = { strength: 0.26, fall: 2.2 };
const HAZE = { strength: 0.1, fall: 0.6 };

const smoothstep = (a, b, t) => {
  const c = Math.min(Math.max((t - a) / (b - a), 0), 1);
  return c * c * (3 - 2 * c);
};

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

  // Maria: many faint overlapping blobs per sea, so the seas join and their
  // edges stay ragged, in a muted grey-brown.
  for (const [cx, cy, rx, ry, count, strength] of MARIA) {
    for (let i = 0; i < count; i++) {
      const angle = random() * Math.PI * 2;
      const distance = Math.sqrt(random()) * 0.8;
      const x = cx + Math.cos(angle) * distance * rx;
      const y = cy + Math.sin(angle) * distance * ry;
      const size = (0.35 + random() * 0.45) * Math.min(rx, ry) * 1.6 * r;
      blob(ctx, r, x, y, size, `rgba(150, 108, 74, ${strength * 0.8 * (0.6 + random() * 0.8)})`);
    }
  }
  // Highland mottling: small pale and dark specks between the seas.
  for (let i = 0; i < 90; i++) {
    const angle = random() * Math.PI * 2;
    const distance = Math.sqrt(random()) * 0.95;
    const pale = random() < 0.5;
    blob(ctx, r, Math.cos(angle) * distance, Math.sin(angle) * distance, (0.015 + random() * 0.04) * r,
      pale ? 'rgba(255, 238, 190, 0.14)' : 'rgba(150, 108, 74, 0.08)');
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

  // A full moon is lit face on, so it stays evenly bright with only a slight
  // darkening at the rim (no lit-ball shading).
  ctx.globalCompositeOperation = 'multiply';
  const shade = ctx.createRadialGradient(r, r, r * 0.05, r, r, r);
  shade.addColorStop(0, '#ffffff');
  shade.addColorStop(0.75, '#fbf1de');
  shade.addColorStop(1, '#e2b37c');
  ctx.fillStyle = shade;
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
  // Exponential falloffs from the rim, eased to zero at the card's edge (a
  // straight cut leaves a visible ring).
  for (let i = 0; i <= 32; i++) {
    const stop = i / 32;
    const beyond = Math.max(0, stop * HALO_SCALE - 1);
    const edge = 1 - smoothstep(0.7, 1, stop);
    const alpha = (CORONA.strength * Math.exp(-beyond * CORONA.fall) + HAZE.strength * Math.exp(-beyond * HAZE.fall)) * edge;
    glow.addColorStop(stop, `rgba(246, 196, 106, ${alpha.toFixed(4)})`);
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

  // The farthest see-through layer, so it draws before the mist and slope lights.
  halo.renderOrder = disc.renderOrder = -0.9;
  group.add(halo, disc);
  return { group };
}
