import { Color } from 'three';

// Bays per run of a lit floor strip, once single bays are too narrow to draw.
const RUN = 4;

// Adds a lit-window grid to a lit material (Lambert or Standard, instanced or
// not). The grid is laid out in world metres on every wall, so it doesn't
// stretch with each box's scale. Each building (its world x / z) gets its own
// share of lit windows. Each direction fades on its own so distant towers
// can't shimmer: where bays shrink below a couple of pixels but floors don't,
// each floor becomes a strip of lit and dark runs of RUN bays (user choice,
// 2026-10-02: IFC read as a flat slab in 01); where floors or runs shrink too,
// the wall fades to its average glow.
export function addCityWindows(material, options = {}) {
  const {
    lit = 0.3, // share of windows lit
    maxLit = 1, // no building lit above this share
    floor = 3.6, // metres per storey
    bay = 3.2, // metres per window bay
    warm = 0xffc07a,
    cool = 0xc4d6ff,
    coolShare = 0.25,
    strength = 1,
    glass = 0.7, // unlit windows darken the wall by this factor
    glow = 0.35, // the faded wall's glow, per lit share
    close = 1, // peak of windows drawn large (bays over ~10 px), so close-ups don't sparkle
  } = options;
  const uniforms = {
    uCityLit: { value: [lit, maxLit] },
    uCityCell: { value: [bay, floor] },
    uCityWarm: { value: new Color(warm) },
    uCityCool: { value: new Color(cool) },
    uCityCoolShare: { value: coolShare },
    uCityStrength: { value: strength },
    uCityGlass: { value: glass },
    uCityGlow: { value: glow },
    uCityClose: { value: close },
  };
  material.userData.cityWindows = uniforms;

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vCityPos;
        varying vec2 vCitySeed;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        mat4 cityMatrix = modelMatrix;
        #ifdef USE_INSTANCING
          cityMatrix = modelMatrix * instanceMatrix;
        #endif
        vCityPos = ( cityMatrix * vec4( transformed, 1.0 ) ).xyz;
        vCitySeed = cityMatrix[ 3 ].xz;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform vec2 uCityLit;
        uniform vec2 uCityCell;
        uniform vec3 uCityWarm;
        uniform vec3 uCityCool;
        uniform float uCityCoolShare;
        uniform float uCityStrength;
        uniform float uCityGlass;
        uniform float uCityGlow;
        uniform float uCityClose;
        varying vec3 vCityPos;
        varying vec2 vCitySeed;
        float cityHash( vec2 p ) {
          return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 );
        }`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          // Flat wall normal (smooth-shaded meshes like IFC would bend the
          // grid), only used to pick the wall's axis: every wall here faces x
          // or z. Measured from the building's own centre, so rounding at
          // ~1 km from the origin can't make windows jump.
          vec3 cn = normalize( cross( dFdx( vCityPos ), dFdy( vCityPos ) ) );
          if ( abs( cn.y ) < 0.5 ) {
            vec3 local = vCityPos - vec3( vCitySeed.x, 0.0, vCitySeed.y );
            float across = abs( cn.x ) > abs( cn.z ) ? local.z : local.x;
            vec2 g = vec2( across, vCityPos.y - 3.0 ) / uCityCell;
            vec2 cell = floor( g );
            vec2 f = fract( g );
            vec2 w = max( fwidth( g ), vec2( 1e-4 ) );
            float shape =
              ( smoothstep( 0.2 - w.x, 0.2 + w.x, f.x ) - smoothstep( 0.8 - w.x, 0.8 + w.x, f.x ) ) *
              ( smoothstep( 0.28 - w.y, 0.28 + w.y, f.y ) - smoothstep( 0.78 - w.y, 0.78 + w.y, f.y ) );
            vec2 seed = floor( vCitySeed );
            float density = min( uCityLit.x * ( 0.35 + 1.3 * cityHash( seed * 0.013 ) ), uCityLit.y );
            float on = step( cityHash( cell + seed * 0.137 ), density );
            vec3 tint = mix( uCityWarm, uCityCool, step( 1.0 - uCityCoolShare, cityHash( cell.yx + seed ) ) );
            float closeGain = mix( uCityClose, 1.0, smoothstep( 0.08, 0.25, w.x ) );
            vec3 detail = tint * on * ( 0.5 + 0.5 * cityHash( cell + 7.7 ) ) * shape * closeGain;
            // Floor strips: the window band of each floor, lit in runs of RUN
            // bays, at the bays' average coverage across.
            float bandY = smoothstep( 0.28 - w.y, 0.28 + w.y, f.y ) - smoothstep( 0.78 - w.y, 0.78 + w.y, f.y );
            float runX = g.x / ${RUN.toFixed(1)};
            float run = floor( runX );
            float wr = w.x / ${RUN.toFixed(1)};
            float fr = fract( runX );
            float runEdge = smoothstep( 0.0, wr, fr ) * smoothstep( 0.0, wr, 1.0 - fr );
            float runOn = step( cityHash( vec2( run, cell.y ) + seed * 0.137 ), density );
            vec3 runTint = mix( uCityWarm, uCityCool, step( 1.0 - uCityCoolShare, cityHash( vec2( cell.y, run ) + seed ) ) );
            float strip = bandY * runEdge * 0.6;
            vec3 strips = runTint * runOn * ( 0.55 + 0.45 * cityHash( vec2( run, cell.y ) + 7.7 ) ) * strip;
            // 0.3 window area × 0.75 mean brightness, lifted: a true average
            // of the dots reads dimmer than the dots themselves.
            vec3 average = mix( uCityWarm, uCityCool, uCityCoolShare ) * min( density, 1.0 ) * uCityGlow;
            float bays = smoothstep( 0.2, 0.5, w.x );
            float far = smoothstep( 0.2, 0.5, max( w.y, wr ) );
            totalEmissiveRadiance += mix( mix( detail, strips, bays ), average, far ) * uCityStrength;
            diffuseColor.rgb *= mix( 1.0, uCityGlass, mix( mix( shape, strip, bays ), 0.3, far ) );
          }
        }`,
      );
  };
  return material;
}
