import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Points, ShaderMaterial } from 'three';
import { cityDensity } from './cityWindows.js';
import { seededRandom } from './random.js';

// Lit windows on far towers as dots of a fixed pixel size (user choice,
// 2026-10-02). The window grid in `cityWindows.js` fades to a faint average
// glow once its floors shrink below a few pixels (about 1.5 km on desktop),
// and the 02 background read as unlit grey slabs. Dots never get smaller
// than a pixel, so they can't shimmer; each one fades in only where its
// building's floors have shrunk that far, so close-ups don't get doubles.
const DOTS = {
  // Soft all the way in, so they read as window glow, not specks. About 6 m
  // across, so each covers the same share of its tower on any screen (fixed
  // CSS pixels made them twice as dense on phones, user request,
  // 2026-10-02), between 1.5 and 3.2 CSS pixels.
  metres: 6,
  size: [1.5, 3.2],
  perLit: 13, // wall area (m²) per dot, per lit share
  run: 3, // longest run of dots in one office
  offset: 1.5, // metres in front of the wall, clear of its depth
  fade: [0.22, 0.45], // floors per pixel: dots fade in across this range
  brightness: [0.22, 0.2],
};

export function createCityDots(buildings, windows, seed) {
  const { floor = 3.6, warm = 0xffc07a, cool = 0xc4d6ff, coolShare = 0.25, strength = 1 } = windows;
  const random = seededRandom(seed);
  const warmColor = new Color(warm);
  const coolColor = new Color(cool);
  const c = new Color();
  const position = [];
  const color = [];
  for (const b of buildings) {
    const density = cityDensity(b.x, b.z, windows);
    const floors = Math.floor(b.h / floor);
    // Walls facing ±z run along x (the width), walls facing ±x along z.
    for (const [nx, nz] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const length = nx ? b.depth : b.w;
      const fit = Math.max(1, Math.floor(length / DOTS.metres));
      const expected = (length * b.h * density) / DOTS.perLit;
      const count = Math.floor(expected + random());
      // Offices, as on the window grid: runs of 1–3 touching dots on one
      // floor in one colour (user choice, 2026-10-02: realism step 4).
      for (let placed = 0; placed < count; ) {
        const run = Math.min(count - placed, fit, 1 + Math.floor(random() * DOTS.run));
        const span = (run - 1) * DOTS.metres;
        const start = -span / 2 + (random() - 0.5) * Math.max(0, length - DOTS.metres - span);
        const y = 3 + (Math.floor(random() * floors) + 0.5) * floor;
        const tint = random() < coolShare ? coolColor : warmColor;
        const level = DOTS.brightness[0] + DOTS.brightness[1] * random();
        for (let i = 0; i < run; i++) {
          const along = start + i * DOTS.metres;
          const x = nx ? b.x + nx * (b.w / 2 + DOTS.offset) : b.x + along;
          const z = nz ? b.z + nz * (b.depth / 2 + DOTS.offset) : b.z + along;
          position.push(x, y, z);
          c.copy(tint).multiplyScalar(level * (0.9 + 0.2 * random()) * strength);
          color.push(c.r, c.g, c.b);
        }
        placed += run;
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(position, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(color, 3));
  const material = new ShaderMaterial({
    uniforms: {
      uSize: { value: [...DOTS.size] },
      uMetres: { value: DOTS.metres },
      uHeight: { value: 900 },
      uFloor: { value: floor },
      uFade: { value: DOTS.fade },
      uFog: { value: 0 },
      uLevel: { value: 1 },
    },
    vertexShader: `
      uniform vec2 uSize;
      uniform float uMetres;
      uniform float uHeight;
      uniform float uFloor;
      uniform vec2 uFade;
      uniform float uFog;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        float depth = -mvPosition.z;
        float pixelsPerMetre = projectionMatrix[ 1 ][ 1 ] * uHeight * 0.5 / depth;
        // Floors per pixel, as the window grid measures them.
        float floorsPerPixel = 1.0 / ( uFloor * pixelsPerMetre );
        float fade = smoothstep( uFade.x, uFade.y, floorsPerPixel );
        float fog = exp( -uFog * uFog * depth * depth );
        vColor = color * fade * fog;
        gl_PointSize = fade > 0.0 ? clamp( uMetres * pixelsPerMetre, uSize.x, uSize.y ) : 0.0;
        gl_Position = projectionMatrix * mvPosition;
      }`,
    fragmentShader: `
      uniform float uLevel;
      varying vec3 vColor;
      void main() {
        float d = length( gl_PointCoord - 0.5 ) * 2.0;
        gl_FragColor = vec4( vColor * uLevel * smoothstep( 1.0, 0.0, d ), 1.0 );
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const points = new Points(geometry, material);
  points.name = 'skylineDots';
  points.userData.noProbe = true;
  points.onBeforeRender = (renderer, scene) => {
    const ratio = renderer.getPixelRatio();
    material.uniforms.uSize.value[0] = DOTS.size[0] * ratio;
    material.uniforms.uSize.value[1] = DOTS.size[1] * ratio;
    material.uniforms.uHeight.value = renderer.domElement.height;
    material.uniforms.uFog.value = scene.fog?.density ?? 0;
  };
  return {
    points,
    setLevel(value) {
      material.uniforms.uLevel.value = value;
    },
  };
}
