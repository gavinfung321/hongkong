import {
  CanvasTexture,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  ShaderChunk,
  Vector2,
} from 'three';
import { PALETTE } from './palette.js';
import { WORLD } from '../data/world.js';

const TEXTURE_SIZE = 512;
// Metres per normal-map tile. Small tiles read as a brick grid from the high 05 camera.
const TILE = 120;
// While the camera moves fast (scroll transitions, up to ~3 m per frame) the
// ripples jump about half a wavelength each frame and strobe. The water then
// blends to the same pattern at CALM.scale times the size, which moves
// coherently. Speeds in m/s; parallax and the hold dolly stay below `from`.
const CALM = { scale: 3, from: 4, to: 24, rise: 8, fall: 2 };

// [cycles per tile x, cycles per tile y, amplitude, phase]. Integer frequencies
// keep the height field tileable; wavelengths run from ~15 m down to ~3 m.
const WAVES = [
  [9, 3, 1.0, 0.3],
  [-6, 12, 0.75, 1.7],
  [4, 7, 0.45, 2.6],
  [-12, -5, 0.5, 5.9],
  [14, -11, 0.5, 4.1],
  [21, 17, 0.3, 2.2],
  [-27, 11, 0.16, 5.3],
  [17, -38, 0.06, 1.2],
  [32, -29, 0.07, 0.9],
  [-41, -16, 0.05, 3.6],
];

function createNormalTexture() {
  const n = TEXTURE_SIZE;
  const heights = new Float32Array(n * n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let h = 0;
      for (const [fx, fy, amp, phase] of WAVES) {
        h += amp * Math.sin(((fx * x + fy * y) / n) * Math.PI * 2 + phase);
      }
      heights[y * n + x] = h;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = n;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(n, n);
  const strength = 6;
  const at = (x, y) => heights[((y + n) % n) * n + ((x + n) % n)];

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * 0.5 * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * 0.5 * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * n + x) * 4;
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
  // Off-axis so any remaining repeat doesn't line up with the harbour cameras.
  texture.rotation = 0.37;
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

  const calm = { value: 0 };
  material.onBeforeCompile = (shader) => {
    shader.uniforms.calm = calm;
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <normalmap_pars_fragment>', '#include <normalmap_pars_fragment>\nuniform float calm;')
      .replace(
        '#include <normal_fragment_maps>',
        ShaderChunk.normal_fragment_maps.replace(
          'vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;',
          `vec3 mapN = mix(
            texture2D( normalMap, vNormalMapUv ).xyz,
            texture2D( normalMap, vNormalMapUv / ${CALM.scale.toFixed(1)} ).xyz,
            calm ) * 2.0 - 1.0;`,
        ),
      );
  };

  const mesh = new Mesh(new PlaneGeometry(WORLD.water.size, WORLD.water.size), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(WORLD.water.center[0], 0, WORLD.water.center[1]);
  mesh.name = 'water';

  // cameraSpeed in m/s.
  function update(dt, cameraSpeed = 0) {
    normalMap.offset.x += dt * 0.0067;
    normalMap.offset.y += dt * 0.004;
    const goal = MathUtils.smoothstep(cameraSpeed, CALM.from, CALM.to);
    calm.value = MathUtils.damp(calm.value, goal, goal > calm.value ? CALM.rise : CALM.fall, dt);
  }

  return { mesh, update, calm };
}
