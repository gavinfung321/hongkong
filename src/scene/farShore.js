import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Points, ShaderMaterial } from 'three';
import { WORLD } from '../data/world.js';
import { seededRandom } from './random.js';

// The far western shore's lights (user choice, 2026-10-02): small soft dots
// of a fixed pixel size, like the far towers' window dots (cityDots.js), in
// loose clusters along the shoreline, lower and sparser toward its far end.
// They take the scene's distance fog.
const DOTS = {
  size: [1.4, 2.2], // CSS pixels, farthest and nearest
  depth: 60, // metres inland the lights spread
  clusters: 36,
  spread: 0.035, // cluster length, as a share of the shoreline
  brightness: [0.4, 0.28],
  coolShare: 0.2,
};
const WARM = new Color(0xffb46a);
const COOL = new Color(0xc4d6ff);

export function createFarShore() {
  const { points: shore, count, height, seed } = WORLD.farShore;
  const random = seededRandom(seed);
  const lengths = shore.slice(1).map(([x, z], i) => Math.hypot(x - shore[i][0], z - shore[i][1]));
  const total = lengths.reduce((a, b) => a + b, 0);

  // Point at share s of the shoreline, with its inland direction (away from Kowloon).
  function along(s) {
    let d = s * total;
    for (let i = 0; i < lengths.length; i++) {
      if (d <= lengths[i] || i === lengths.length - 1) {
        const [x0, z0] = shore[i];
        const [x1, z1] = shore[i + 1];
        const t = Math.min(1, d / lengths[i]);
        const [dx, dz] = [(x1 - x0) / lengths[i], (z1 - z0) / lengths[i]];
        return { x: x0 + (x1 - x0) * t, z: z0 + (z1 - z0) * t, nx: dz, nz: -dx };
      }
      d -= lengths[i];
    }
  }

  // Clusters crowd toward the island end.
  const centres = Array.from({ length: DOTS.clusters }, () => random() ** 1.15);
  const position = [];
  const color = [];
  const c = new Color();
  for (let i = 0; i < count; i++) {
    const centre = centres[Math.floor(random() * centres.length)];
    const s = Math.min(1, Math.max(0, centre + (random() - 0.5) * DOTS.spread));
    const p = along(s);
    const inland = random() * DOTS.depth;
    const top = height[0] + (height[1] - height[0]) * s;
    position.push(p.x - p.nx * inland, 3 + random() * top, p.z - p.nz * inland);
    const level = DOTS.brightness[0] + (DOTS.brightness[1] - DOTS.brightness[0]) * s;
    c.copy(random() < DOTS.coolShare ? COOL : WARM).multiplyScalar(level * (0.7 + 0.6 * random()));
    color.push(c.r, c.g, c.b);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(position, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(color, 3));
  const material = new ShaderMaterial({
    uniforms: {
      uSize: { value: [...DOTS.size] },
      uFog: { value: 0 },
    },
    vertexShader: `
      uniform vec2 uSize;
      uniform float uFog;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        float depth = -mvPosition.z;
        vColor = color * exp( -uFog * uFog * depth * depth );
        gl_PointSize = mix( uSize.y, uSize.x, smoothstep( 1200.0, 2200.0, depth ) );
        gl_Position = projectionMatrix * mvPosition;
      }`,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float d = length( gl_PointCoord - 0.5 ) * 2.0;
        gl_FragColor = vec4( vColor * smoothstep( 1.0, 0.0, d ), 1.0 );
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const dots = new Points(geometry, material);
  dots.name = 'farShore';
  dots.userData.noProbe = true;
  dots.onBeforeRender = (renderer, scene) => {
    const ratio = renderer.getPixelRatio();
    material.uniforms.uSize.value[0] = DOTS.size[0] * ratio;
    material.uniforms.uSize.value[1] = DOTS.size[1] * ratio;
    material.uniforms.uFog.value = scene.fog?.density ?? 0;
  };
  return dots;
}
