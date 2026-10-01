import { Color } from 'three';

// Adds a lit-window grid to a lit material (Lambert or Standard, instanced or
// not). The grid is laid out in world metres on every wall, so it doesn't
// stretch with each box's scale. Each building (its world x / z) gets its own
// share of lit windows. Where a window shrinks below a couple of pixels the
// grid fades to its average glow, so distant towers can't shimmer.
export function addCityWindows(material, options = {}) {
  const {
    lit = 0.3, // share of windows lit
    floor = 3.6, // metres per storey
    bay = 3.2, // metres per window bay
    warm = 0xffc07a,
    cool = 0xc4d6ff,
    coolShare = 0.25,
    strength = 1,
    glass = 0.7, // unlit windows darken the wall by this factor
  } = options;
  const uniforms = {
    uCityLit: { value: lit },
    uCityCell: { value: [bay, floor] },
    uCityWarm: { value: new Color(warm) },
    uCityCool: { value: new Color(cool) },
    uCityCoolShare: { value: coolShare },
    uCityStrength: { value: strength },
    uCityGlass: { value: glass },
  };

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
        uniform float uCityLit;
        uniform vec2 uCityCell;
        uniform vec3 uCityWarm;
        uniform vec3 uCityCool;
        uniform float uCityCoolShare;
        uniform float uCityStrength;
        uniform float uCityGlass;
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
            float density = uCityLit * ( 0.35 + 1.3 * cityHash( seed * 0.013 ) );
            float on = step( cityHash( cell + seed * 0.137 ), density );
            vec3 tint = mix( uCityWarm, uCityCool, step( 1.0 - uCityCoolShare, cityHash( cell.yx + seed ) ) );
            vec3 detail = tint * on * ( 0.5 + 0.5 * cityHash( cell + 7.7 ) ) * shape;
            // 0.3 window area × 0.75 mean brightness, lifted: a true average
            // of the dots reads dimmer than the dots themselves.
            vec3 average = mix( uCityWarm, uCityCool, uCityCoolShare ) * min( density, 1.0 ) * 0.35;
            float far = smoothstep( 0.2, 0.5, max( w.x, w.y ) );
            totalEmissiveRadiance += mix( detail, average, far ) * uCityStrength;
            diffuseColor.rgb *= mix( 1.0, uCityGlass, mix( shape, 0.3, far ) );
          }
        }`,
      );
  };
  return material;
}
