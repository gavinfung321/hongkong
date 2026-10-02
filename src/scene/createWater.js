import {
  CanvasTexture,
  DataTexture,
  LinearFilter,
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
// Reflections (waterReflections.js, user choice, 2026-10-02): a few lights
// (at most this many in view, by rank) and a dim shimmer under the whole
// skyline. Each light lays a soft glow on the water: as long as its mirror
// image plus a tail toward the viewer, Gaussian across and `spread` times
// its width, its rows shifted sideways by the wavelets so the edges are
// ragged. Sizes are view-angle tangents. The boats' hulls lay dark mirror
// images that hide the other lights behind them (2026-10-02).
const REFLECT = {
  max: { desktop: 8, mobile: 8 },
  head: 0.012, // longest fade beyond the mirror image, toward the horizon
  minPixels: 3, // shortest fade either way and narrowest half width
  spread: 1.5,
  wobble: 0.6, // sideways shift of each wavelet row, in half widths
  gain: 0.8,
};
// The glow is drawn as glints: thin horizontal slivers where a wavelet faces
// the light, dense in the bright core and sparse at the edges. They are laid
// out in view angles around the camera, so they keep their size on screen
// and moving the camera can't make them strobe; they drift and twinkle.
// Rows are `rowPixels` CSS px tall in the distance and grow toward the viewer
// (1 / `grow` of the depression tangent), slivers `aspect` times as long.
// maxDensity keeps dark gaps between glints even in the brightest core.
const GLINT = { rowPixels: 2, grow: 30, aspect: 4, density: 2, maxDensity: 0.72, drift: 0.9 };
// The skyline shimmer: brightness of the strip read along the island front.
const CITY = { power: 0.08, lit: 0.6, tail: 0.25 };
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
    waterPixelTan: { value: 0.001 }, // view tangent per CSS pixel
    waterCity: { value: null }, // skyline strip: rgb brightness, a height
    waterCityRange: { value: new Vector4(0, 1, 0, 0) }, // x0, x1, front z, full height
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
        uniform float waterPixelTan;
        uniform sampler2D waterCity;
        uniform vec4 waterCityRange;
        varying vec3 vWaterWorld;
        float waterHash( vec2 p ) {
          return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 );
        }
        float waterNoise( vec2 p ) {
          vec2 i = floor( p );
          vec2 f = fract( p );
          f = f * f * ( 3.0 - 2.0 * f );
          return mix( mix( waterHash( i ), waterHash( i + vec2( 1.0, 0.0 ) ), f.x ),
                      mix( waterHash( i + vec2( 0.0, 1.0 ) ), waterHash( i + 1.0 ), f.x ), f.y );
        }
        // Inside a mirror image spanning depression tangents near..far,
        // dimming by taper along it, fading over head beyond it and tail
        // toward the viewer.
        float waterAlong( float t, float near, float far, float head, float tail, float taper ) {
          float inside = clamp( t, near, far );
          float drop = t - inside;
          float u = drop / ( drop > 0.0 ? tail : head );
          return ( 1.0 - taper * ( inside - near ) / max( far - near, 1e-5 ) ) * exp( -u * u );
        }
        // A light strip at ground point a.xy, lit from height a.z to a.w,
        // width half wide; its mirror image spans the depression tangents
        // (H + h) / D. c: tail, head, taper. wobble shifts this wavelet row
        // sideways, in half widths.
        float waterStreak( vec4 a, vec4 c, float width, vec2 p, float wobble ) {
          float H = max( cameraPosition.y, 0.5 );
          vec2 toLight = a.xy - cameraPosition.xz;
          float D = length( toLight );
          if ( D < 1.0 ) return 0.0;
          vec2 dir = toLight / D;
          vec2 rel = p - cameraPosition.xz;
          float along = dot( rel, dir );
          if ( along <= 0.0 ) return 0.0;
          float halfWidth = max( width / D, ${REFLECT.minPixels.toFixed(1)} * waterPixelTan );
          float lateral = dot( rel, vec2( -dir.y, dir.x ) ) / along;
          float v = ( lateral + wobble * halfWidth ) / ( halfWidth * ${REFLECT.spread.toFixed(2)} );
          if ( abs( v ) > 3.0 ) return 0.0;
          float t = H / along;
          return waterAlong( t, ( H + a.z ) / D, ( H + a.w ) / D, c.y, c.x, c.z ) * exp( -v * v );
        }
        // One piece of a hull's mirror image: ground point c, half length
        // len along the hull axis, half beam beam, up to height h. It
        // starts at its far waterline (the hull covers the rest), runs down
        // to the mirror of its top and breaks up toward the far end; wobble
        // rags its edges row by row.
        float waterHullPiece( vec2 c, vec2 axis, float len, float beam, float h, vec2 p, float wobble ) {
          float H = max( cameraPosition.y, 0.5 );
          vec2 toBoat = c - cameraPosition.xz;
          float D = length( toBoat );
          if ( D < 1.0 ) return 0.0;
          vec2 dir = toBoat / D;
          vec2 rel = p - cameraPosition.xz;
          float along = dot( rel, dir );
          if ( along <= 0.0 ) return 0.0;
          float side = abs( axis.x * dir.y - axis.y * dir.x );
          float toward = sqrt( max( 0.0, 1.0 - side * side ) );
          float width = side * len + toward * beam;
          float reach = toward * len + side * beam;
          float halfWidth = width / D;
          float lateral = dot( rel, vec2( -dir.y, dir.x ) ) / along;
          float edge = max( waterPixelTan * 2.0, halfWidth * 0.06 );
          float across = 1.0 - smoothstep( halfWidth - edge, halfWidth + edge, abs( lateral + wobble * halfWidth * 0.12 ) );
          float t = H / along;
          float top = H / ( D + reach );
          float bottom = ( H + h ) / max( D - reach, 1.0 );
          float soft = max( waterPixelTan * 3.0, ( bottom - top ) * 0.25 );
          float down = clamp( ( t - top ) / max( bottom - top, 1e-5 ), 0.0, 1.0 );
          return across * smoothstep( top - waterPixelTan, top, t ) * ( 1.0 - smoothstep( bottom - soft, bottom + soft * 0.5, t ) ) * ( 1.0 - 0.45 * down );
        }
        // A hull's mirror image in four pieces along its length, so it
        // follows the boat's outline in perspective. a: x, z, half beam,
        // height; c: axis x, z, half length.
        float waterHull( vec4 a, vec4 c, vec2 p, float wobble ) {
          float k = 0.0;
          for ( int j = 0; j < 4; j ++ ) {
            float s = ( float( j ) - 1.5 ) * 0.5;
            k = max( k, waterHullPiece( a.xy + c.xy * c.z * s, c.xy, c.z * 0.25, a.z, a.w, p, wobble ) );
          }
          return k;
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
          float H = max( cameraPosition.y, 0.5 );
          vec2 fromEye = vWaterWorld.xz - cameraPosition.xz;
          float dist = max( length( fromEye ), 1.0 );
          float t = H / dist;
          // Wavelet rows in view angles: rowPixels tall far off, growing
          // toward the viewer. Azimuth is measured from −z (toward the
          // island), so its seam lies behind every camera.
          float rowMin = waterPixelTan * ${GLINT.rowPixels.toFixed(2)};
          float t0 = rowMin * ${GLINT.grow.toFixed(1)};
          float row = t < t0 ? t / rowMin : ${GLINT.grow.toFixed(1)} * ( 1.0 + log( t / t0 ) );
          float rowTan = max( rowMin, t / ${GLINT.grow.toFixed(1)} );
          float azimuth = atan( fromEye.x, -fromEye.y );
          vec2 g = vec2( azimuth / ( rowTan * ${GLINT.aspect.toFixed(1)} ), row );
          float drift = waterTime * ${GLINT.drift.toFixed(2)};
          float wobble = ( waterNoise( vec2( 3.7, floor( row ) * 0.61 + drift * 0.3 ) ) - 0.5 ) * ${(REFLECT.wobble * 2).toFixed(2)};

          // Hulls (kind 2 in waterRefC.w) first: what they hide, and their colour.
          float hullMask = 0.0;
          vec3 hullShine = vec3( 0.0 );
          for ( int i = 0; i < REFLECT_MAX; i ++ ) {
            if ( i >= waterRefCount ) break;
            if ( waterRefC[ i ].w < 1.5 ) continue;
            float k = waterHull( waterRefA[ i ], waterRefC[ i ], vWaterWorld.xz, wobble );
            hullMask = max( hullMask, k );
            hullShine += waterRefB[ i ].rgb * k;
          }
          // Lights: the boats' own (kind 1) show over their hulls, the rest are hidden.
          vec3 shine = vec3( 0.0 );
          for ( int i = 0; i < REFLECT_MAX; i ++ ) {
            if ( i >= waterRefCount ) break;
            if ( waterRefC[ i ].w > 1.5 ) continue;
            float keep = waterRefC[ i ].w > 0.5 ? 1.0 : 1.0 - hullMask;
            shine += keep * waterRefB[ i ].rgb * waterStreak( waterRefA[ i ], waterRefC[ i ], waterRefB[ i ].w, vWaterWorld.xz, wobble );
          }

          // Skyline shimmer: the strip read where this line of sight meets
          // the island front; its mirror image runs from that point's
          // horizon down by the buildings' lit height.
          if ( fromEye.y < -1.0 && cameraPosition.z > waterCityRange.z ) {
            float k = ( waterCityRange.z - cameraPosition.z ) / fromEye.y;
            if ( k > 1.0 ) {
              vec2 hit = cameraPosition.xz + fromEye * k;
              float u = ( hit.x - waterCityRange.x ) / ( waterCityRange.y - waterCityRange.x );
              vec4 city = texture2D( waterCity, vec2( u + wobble * 0.004, 0.5 ) );
              float Ds = dist * k;
              float near = H / Ds;
              float far = ( H + city.a * waterCityRange.w * ${CITY.lit.toFixed(2)} ) / Ds;
              float span = far - near;
              shine += ( 1.0 - hullMask ) * city.rgb * ${CITY.power.toFixed(3)} * waterAlong( t, near, far, max( rowMin, span * 0.2 ), max( rowMin * 2.0, span * ${CITY.tail.toFixed(2)} ), 0.5 );
            }
          }

          // Water mirrors more at grazing angles.
          vec3 toEye = normalize( cameraPosition - vWaterWorld );
          float fresnel = 0.02 + 0.98 * pow( 1.0 - clamp( toEye.y, 0.0, 1.0 ), 5.0 );
          shine *= fresnel * ${REFLECT.gain.toFixed(2)} * ( 0.7 + 0.6 * smoothstep( -0.2, 0.4, waterRipple.y ) );

          // Glints: a sliver noise thresholded by the local brightness, so the
          // core is nearly solid and the edges break into sparse slivers.
          float lum = max( max( shine.r, shine.g ), shine.b );
          if ( lum > 0.0005 ) {
            float n = 0.62 * waterNoise( g + vec2( drift * 0.4, -drift ) )
              + 0.38 * waterNoise( g * vec2( 1.9, 2.3 ) + vec2( 31.0 - drift * 0.7, drift * 0.8 ) );
            n = clamp( ( n - 0.5 ) * 2.4 + 0.5, 0.0, 1.0 ); // about even from 0 to 1
            float density = clamp( lum * ${GLINT.density.toFixed(2)}, 0.0, ${GLINT.maxDensity.toFixed(2)} );
            float threshold = 1.0 - density;
            float glint = smoothstep( threshold, threshold + 0.06, n ) * mix( 0.45, 1.0, smoothstep( threshold, 1.0, n ) );
            vec3 glow = shine / lum * ( glint * ( 0.3 + 0.9 * density ) + 0.05 * density );
            totalEmissiveRadiance += 1.5 * ( 1.0 - exp( -glow / 1.5 ) );
          }

          // The hull's mirror image: darker water, dimly hull-coloured,
          // broken into the same wavelet rows.
          if ( hullMask > 0.0 ) {
            diffuseColor.rgb *= 1.0 - 0.6 * hullMask;
            float ripple = waterNoise( g * vec2( 0.35, 1.0 ) + vec2( drift * 0.2, 0.0 ) );
            totalEmissiveRadiance += hullShine * ( 0.5 + 0.5 * ripple );
          }
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

  // city: { data (RGBA bytes, one texel per step along x), x0, x1, z, height }
  // from waterReflections.js.
  function setCity({ data, x0, x1, z, height }) {
    const texture = new DataTexture(data, data.length / 4, 1);
    texture.magFilter = texture.minFilter = LinearFilter;
    texture.needsUpdate = true;
    reflection.waterCity.value = texture;
    reflection.waterCityRange.value.set(x0, x1, z, height);
  }

  // Before each render: follows the boats, keeps the sources whose streak
  // falls in view (they run straight down the screen from their light).
  function reflect(camera, breakpoint) {
    camera.updateMatrixWorld();
    const tanH = Math.tan((camera.fov * Math.PI) / 360) * camera.aspect;
    const pixel = (2 * tanH) / renderer.getSize(buffer).x;
    reflection.waterPixelTan.value = pixel;
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
      if (Math.abs(x) > 1.1 + (2 * REFLECT.spread * width) / depth / tanH) continue;
      kept.push([s, width, fade]);
      if (kept.length === limit) break;
    }
    kept.forEach(([s, width, fade], i) => {
      reflection.waterRefA.value[i].set(s.x, s.z, s.h0, s.h1);
      const power = s.power * fade;
      reflection.waterRefB.value[i].set(s.colour.r * power, s.colour.g * power, s.colour.b * power, width);
      if (s.kind === 'hull') {
        const heading = s.follow.rotation.y;
        reflection.waterRefA.value[i].z = s.extent[1];
        reflection.waterRefC.value[i].set(Math.cos(heading), -Math.sin(heading), s.extent[0], 2);
        return;
      }
      const mirror = (s.h1 - s.h0) / Math.max(Math.hypot(s.x - camera.position.x, s.z - camera.position.z), 1);
      reflection.waterRefC.value[i].set(
        Math.max(s.tail * mirror, shortest),
        MathUtils.clamp(mirror * 0.25, shortest, REFLECT.head),
        s.taper,
        s.follow ? 1 : 0,
      );
    });
    reflection.waterRefCount.value = kept.length;
  }

  return { mesh, update, setSources, setFade, setCity, reflect };
}
