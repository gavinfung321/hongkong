import {
  CanvasTexture,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  ShaderChunk,
  Vector2,
  Vector3,
  Vector4,
} from 'three';
import { PALETTE } from './palette.js';
import { WORLD } from '../data/world.js';

const TEXTURE_SIZE = 512;
// Metres per normal-map tile. Small tiles read as a brick grid from the high 05 camera.
const TILE = 120;
// Ripple blur in mip levels: 0 is sharp chop, 5 a glassy sheen with a soft
// moon path. Sharp ripples strobe during scroll transitions (the camera moves
// up to ~3 m per frame, about half a ripple), so the water stays glassy.
const BLUR = 5;
// Reflections of a few lights (waterReflections.js, user choice,
// 2026-10-02): at most this many sources in view are drawn, by rank. Each is
// a streak under its light, as long as its mirror image plus a short tail
// toward the viewer (glassy water barely stretches it), widened and its
// ends moved by the ripples (the same blurred sample as the lighting).
// Sizes are view-angle tangents.
const REFLECT = {
  max: { desktop: 8, mobile: 8 },
  head: 0.012, // longest fade beyond the mirror image, toward the horizon
  minPixels: 3, // shortest fade either way, so ends never alias
  edge: 0.004, // soft edge across
  spread: 1.5, // ripple slope → wider dashes
  jitter: 1.5, // ripple slope → streak end, in tails
  gain: 0.7,
};
// The streaks break into horizontal ripple bands, a noise laid out in view
// angles around the camera: cells per full turn of azimuth (about 60 px wide
// on desktop, wider than a streak, so bands cross it whole) and per unit of
// depression tangent (about 4 px tall). It keeps its size on screen at any
// distance and drifts slowly, so moving the camera can't make it strobe.
const DASH = { azimuth: 120, depression: 300, drift: 0.5 };
// Plane segments per side. Positions interpolated across one 8 km triangle
// lose enough float precision to make the streaks shiver as the camera moves.
const SEGMENTS = 64;

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

const MAX = Math.max(...Object.values(REFLECT.max));

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

  const reflection = {
    waterRefA: { value: Array.from({ length: MAX }, () => new Vector4()) }, // x, z, h0, h1
    waterRefB: { value: Array.from({ length: MAX }, () => new Vector4()) }, // rgb × power, half width
    waterRefC: { value: Array.from({ length: MAX }, () => new Vector4()) }, // tail, head, taper
    waterRefCount: { value: 0 },
    waterTime: { value: 0 },
  };

  // Samples the ripples at least BLUR mip levels down; where the texture is
  // already minified further away, the normal level applies. The rim light
  // (cool cyan) and the boats' point lights leave no glare on the water: the
  // streaks draw the boats' reflections instead.
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, reflection);
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vWaterWorld;`,
      )
      .replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>
        vWaterWorld = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        #define REFLECT_MAX ${MAX}
        uniform vec4 waterRefA[ REFLECT_MAX ];
        uniform vec4 waterRefB[ REFLECT_MAX ];
        uniform vec4 waterRefC[ REFLECT_MAX ];
        uniform int waterRefCount;
        uniform float waterTime;
        varying vec3 vWaterWorld;
        float waterHash( vec2 p ) {
          return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 );
        }
        // Value noise that repeats every \`period\` cells in x (the azimuth).
        float waterNoise( vec2 p, float period ) {
          vec2 i = floor( p );
          vec2 f = fract( p );
          f = f * f * ( 3.0 - 2.0 * f );
          float x0 = mod( i.x, period );
          float x1 = mod( i.x + 1.0, period );
          return mix( mix( waterHash( vec2( x0, i.y ) ), waterHash( vec2( x1, i.y ) ), f.x ),
                      mix( waterHash( vec2( x0, i.y + 1.0 ) ), waterHash( vec2( x1, i.y + 1.0 ) ), f.x ), f.y );
        }
        // A light strip at ground point a.xy, lit from height a.z to a.w,
        // width half wide. Its mirror image spans the depression tangents
        // (H + h) / D; the fragment lights up inside it, dimming by c.z along
        // it, and fades over c.y beyond it and c.x toward the viewer.
        // ripple: the local slope, which widens the streak and moves its end.
        float waterStreak( vec4 a, vec4 c, float width, vec2 p, vec2 ripple ) {
          float H = max( cameraPosition.y, 0.5 );
          vec2 toLight = a.xy - cameraPosition.xz;
          float D = length( toLight );
          if ( D < 1.0 ) return 0.0;
          vec2 dir = toLight / D;
          vec2 rel = p - cameraPosition.xz;
          float along = dot( rel, dir );
          if ( along <= 0.0 ) return 0.0;
          float spread = 1.0 + ${REFLECT.spread.toFixed(2)} * abs( ripple.x );
          float lateral = dot( rel, vec2( -dir.y, dir.x ) ) / along;
          float side = max( abs( lateral ) - width / D, 0.0 );
          float v = side / ( ${REFLECT.edge.toFixed(4)} * spread );
          if ( v > 4.0 ) return 0.0;
          float t = H / along;
          float near = ( H + a.z ) / D;
          float far = ( H + a.w ) / D;
          float inside = clamp( t, near, far );
          float drop = t - inside + ripple.y * c.x * ${REFLECT.jitter.toFixed(2)};
          float u = drop / ( drop > 0.0 ? c.x : c.y );
          float taper = 1.0 - c.z * ( inside - near ) / ( far - near );
          return taper * exp( -u * u - v * v );
        }`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        ShaderChunk.normal_fragment_maps.replace(
          'vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;',
          `vec2 texel = vNormalMapUv * ${TEXTURE_SIZE.toFixed(1)};
          float lod = log2( max( length( dFdx( texel ) ), length( dFdy( texel ) ) ) );
          vec3 mapN = textureLod( normalMap, vNormalMapUv, max( lod, ${BLUR.toFixed(1)} ) ).xyz * 2.0 - 1.0;
          vec2 waterRipple = mapN.xy;`,
        ),
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          vec3 shine = vec3( 0.0 );
          for ( int i = 0; i < REFLECT_MAX; i ++ ) {
            if ( i >= waterRefCount ) break;
            shine += waterRefB[ i ].rgb * waterStreak( waterRefA[ i ], waterRefC[ i ], waterRefB[ i ].w, vWaterWorld.xz, waterRipple );
          }
          // Dashes: near ripples facing away go dark, and the view-angle
          // noise breaks every streak into short horizontal strokes.
          vec2 fromEye = vWaterWorld.xz - cameraPosition.xz;
          float depression = max( cameraPosition.y, 0.5 ) / max( length( fromEye ), 1.0 );
          float azimuth = atan( fromEye.y, fromEye.x ) / 6.2832 + 0.5;
          vec2 dashUv = vec2( azimuth * ${DASH.azimuth.toFixed(1)}, depression * ${DASH.depression.toFixed(1)} );
          float dash = 0.65 * waterNoise( dashUv + vec2( 0.0, waterTime * ${DASH.drift.toFixed(2)} ), ${DASH.azimuth.toFixed(1)} )
            + 0.35 * waterNoise( dashUv * 2.0 + vec2( 17.0, -waterTime * ${DASH.drift.toFixed(2)} ), ${(DASH.azimuth * 2).toFixed(1)} );
          shine *= ( 0.15 + 1.5 * smoothstep( 0.3, 0.75, dash ) ) * ( 0.4 + 0.9 * smoothstep( -0.15, 0.45, waterRipple.y ) );
          // Water mirrors more at grazing angles.
          vec3 toEye = normalize( cameraPosition - vWaterWorld );
          float fresnel = 0.02 + 0.98 * pow( 1.0 - clamp( toEye.y, 0.0, 1.0 ), 5.0 );
          shine *= fresnel * ${REFLECT.gain.toFixed(2)};
          totalEmissiveRadiance += 1.5 * ( 1.0 - exp( -shine / 1.5 ) );
        }`,
      )
      .replace(
        '#include <lights_fragment_begin>',
        ShaderChunk.lights_fragment_begin
          .replace(
            'getDirectionalLightInfo( directionalLight, directLight );',
            'getDirectionalLightInfo( directionalLight, directLight );\n\t\tdirectLight.color = vec3( 0.0 );',
          )
          .replace(
            'getPointLightInfo( pointLight, geometryPosition, directLight );',
            'getPointLightInfo( pointLight, geometryPosition, directLight );\n\t\tdirectLight.color = vec3( 0.0 );',
          ),
      );
  };

  const mesh = new Mesh(new PlaneGeometry(WORLD.water.size, WORLD.water.size, SEGMENTS, SEGMENTS), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(WORLD.water.center[0], 0, WORLD.water.center[1]);
  mesh.name = 'water';

  function update(dt) {
    normalMap.offset.x += dt * 0.0067;
    normalMap.offset.y += dt * 0.004;
    reflection.waterTime.value += dt;
  }

  // ---- Reflections ---------------------------------------------------------

  let sources = [];
  const fades = {};
  const view = new Vector3();
  const buffer = new Vector2();
  const kept = [];

  function setSources(list) {
    sources = list.slice().sort((a, b) => b.rank - a.rank);
  }

  function setFade(key, value) {
    fades[key] = value;
  }

  // Before each render: follows the boats, keeps the sources whose streak
  // falls in view (they run straight down the screen from their light).
  function reflect(camera, breakpoint) {
    camera.updateMatrixWorld();
    const tanH = Math.tan((camera.fov * Math.PI) / 360) * camera.aspect;
    const pixel = (2 * tanH) / renderer.getDrawingBufferSize(buffer).x;
    const shortest = REFLECT.minPixels * pixel;
    const limit = REFLECT.max[breakpoint] ?? MAX;
    kept.length = 0;
    for (const s of sources) {
      const fade = s.key ? (fades[s.key] ?? 1) : 1;
      if (fade <= 0.001) continue;
      let width = s.width;
      if (s.follow) {
        const { position, rotation } = s.follow;
        s.x = position.x;
        s.z = position.z;
        const ax = Math.cos(rotation.y);
        const az = -Math.sin(rotation.y);
        const dx = s.x - camera.position.x;
        const dz = s.z - camera.position.z;
        const d = Math.hypot(dx, dz) || 1;
        const across = Math.abs((ax * -dz + az * dx) / d);
        width = across * s.extent[0] + Math.sqrt(1 - across * across) * s.extent[1];
      }
      view.set(s.x, 0, s.z).applyMatrix4(camera.matrixWorldInverse);
      const depth = -view.z;
      if (depth < 1) continue;
      const x = view.x / depth / tanH;
      if (Math.abs(x) > 1.1 + width / depth / tanH) continue;
      kept.push([s, width, fade]);
      if (kept.length === limit) break;
    }
    kept.forEach(([s, width, fade], i) => {
      reflection.waterRefA.value[i].set(s.x, s.z, s.h0, s.h1);
      const power = s.power * fade;
      reflection.waterRefB.value[i].set(s.colour.r * power, s.colour.g * power, s.colour.b * power, width);
      const mirror = (s.h1 - s.h0) / Math.max(Math.hypot(s.x - camera.position.x, s.z - camera.position.z), 1);
      reflection.waterRefC.value[i].set(
        Math.max(s.tail * mirror, shortest),
        MathUtils.clamp(mirror * 0.25, shortest, REFLECT.head),
        s.taper,
        0,
      );
    });
    reflection.waterRefCount.value = kept.length;
  }

  return { mesh, update, setSources, setFade, reflect };
}
