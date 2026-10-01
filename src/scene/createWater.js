import { CanvasTexture, Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, Vector2 } from 'three';
import { PALETTE } from './palette.js';
import { WORLD } from '../data/world.js';

const TEXTURE_SIZE = 256;
// Metres per normal-map tile. Smaller tiles read as a grid from mid-harbour.
const TILE = 40;

// Integer frequencies keep the height field tileable.
const WAVES = [
  [3, 1, 1.0, 0.3],
  [-2, 4, 0.7, 1.7],
  [5, -3, 0.45, 4.1],
  [7, 6, 0.3, 2.2],
  [-9, 4, 0.22, 5.3],
  [11, -10, 0.15, 0.9],
  [-14, -5, 0.1, 3.6],
];

function height(x, y) {
  let h = 0;
  for (const [fx, fy, amp, phase] of WAVES) {
    h += amp * Math.sin(((fx * x + fy * y) / TEXTURE_SIZE) * Math.PI * 2 + phase);
  }
  return h;
}

function createNormalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = TEXTURE_SIZE;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(TEXTURE_SIZE, TEXTURE_SIZE);
  const strength = 4;

  for (let y = 0; y < TEXTURE_SIZE; y++) {
    for (let x = 0; x < TEXTURE_SIZE; x++) {
      const dx = (height(x + 1, y) - height(x - 1, y)) * 0.5 * strength;
      const dy = (height(x, y + 1) - height(x, y - 1)) * 0.5 * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * TEXTURE_SIZE + x) * 4;
      image.data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      image.data[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      image.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      image.data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(WORLD.water.size / TILE, WORLD.water.size / TILE);
  return texture;
}

export function createWater(renderer) {
  const normalMap = createNormalTexture();
  normalMap.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

  const material = new MeshStandardMaterial({
    color: PALETTE.water,
    roughness: 0.32,
    metalness: 0,
    normalMap,
    normalScale: new Vector2(0.55, 0.55),
  });

  const mesh = new Mesh(new PlaneGeometry(WORLD.water.size, WORLD.water.size), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(WORLD.water.center[0], 0, WORLD.water.center[1]);
  mesh.name = 'water';

  function update(dt) {
    normalMap.offset.x += dt * 0.02;
    normalMap.offset.y += dt * 0.012;
  }

  return { mesh, update };
}
