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

function drawDisc(seed) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  const r = SIZE / 2;

  ctx.beginPath();
  ctx.arc(r, r, r - 2, 0, Math.PI * 2);
  ctx.clip();

  // Lit slightly from the upper left, darkening toward the rim.
  const body = ctx.createRadialGradient(r * 0.8, r * 0.75, r * 0.1, r, r, r);
  body.addColorStop(0, '#fff1bf');
  body.addColorStop(0.55, '#f6cf72');
  body.addColorStop(1, '#d9953f');
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const random = seededRandom(seed);
  for (let i = 0; i < 16; i++) {
    const x = r + (random() - 0.5) * r * 1.4;
    const y = r + (random() - 0.5) * r * 1.4;
    const size = r * (0.12 + random() * 0.3);
    const spot = ctx.createRadialGradient(x, y, 0, x, y, size);
    spot.addColorStop(0, `rgba(176, 112, 48, ${0.16 + random() * 0.14})`);
    spot.addColorStop(1, 'rgba(176, 112, 48, 0)');
    ctx.fillStyle = spot;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  }

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
