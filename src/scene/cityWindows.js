import { Color } from 'three';
import { cityLight, cityLightGlsl } from './cityLight.js';

// Bays per run of a lit floor strip, once single bays are too narrow to draw:
// the fade to the wall's average is measured at this width.
const RUN = 4;
// Lights come in offices: runs of 3–6 bays on one floor (the floor strips'
// runs), in busier and quieter groups of FLOOR_GROUP floors, a lit office
// with OFFICE_ON of its windows on, plus a few lone windows (LONE of the
// light). The lit share per building stays `density` (user choice,
// 2026-10-02: realism step 4).
const OFFICE_ON = 0.75;
const LONE = 0.25;
const FLOOR_GROUP = 3;
const RIBBON_DIM = 0.7;
const glsl = (n) => n.toFixed(2);

const fract = (v) => v - Math.floor(v);
const cityHash = (x, y) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453);

// The share of windows lit on the building standing at world x / z, as the
// shader works it out (near enough: GPU sine can differ in the last digits).
export function cityDensity(x, z, { lit = 0.3, maxLit = 1, vary = 1.3, dark = 0 } = {}) {
  const sx = Math.floor(x);
  const sz = Math.floor(z);
  const density = Math.min(lit * (1 + vary * (cityHash(sx * 0.013, sz * 0.013) - 0.5)), maxLit);
  return cityHash(sx * 0.071 + 3.1, sz * 0.071 + 3.1) < dark ? density * 0.1 : density;
}

// Shared by every window material: how many pixels wide each single
// window's edge blur is. Phones' 3–4 px windows twinkle as the camera moves
// with crisp edges, so they get softer ones (user report, 2026-10-02). It
// leaves floor strips alone, never moves a wall to its strips or glow, and
// stays constant: switching looks mid-scroll read as flicker and greyed IFC out.
export const citySoft = { value: 1 };

// Adds a lit-window grid to a lit material (Lambert or Standard, instanced or
// not). The grid is laid out in world metres on every wall, so it doesn't
// stretch with each box's scale. Each building (its world x / z) gets its own
// share of lit windows. Each direction fades on its own so distant towers
// can't shimmer: where bays shrink below a couple of pixels but floors don't,
// each floor becomes a strip of lit and dark runs of RUN bays (user choice,
// 2026-10-02: IFC read as a flat slab in 01); where floors or runs shrink too,
// the wall fades to its average glow. The street's warm light washes the
// lowest floors (cityLight.js). A share of buildings (`ribbon`) are curtain
// walls: continuous glass bands that mirror a little dusk sky between pale
// slab bands, their lights dimmed to the punched windows' total.
export function addCityWindows(material, options = {}) {
  const {
    lit = 0.3, // share of windows lit
    maxLit = 1, // no building lit above this share
    vary = 1.3, // spread of the lit share between buildings: lit × (1 ± vary / 2)
    dark = 0, // share of buildings left almost unlit
    floor = 3.6, // metres per storey
    bay = 3.2, // metres per window bay
    warm = 0xffc07a,
    cool = 0xc4d6ff,
    coolShare = 0.25,
    strength = 1,
    glass = 0.7, // unlit windows darken the wall by this factor
    glow = 0.35, // the faded wall's glow, per lit share
    close = 1, // peak of windows drawn large (bays over ~10 px), so close-ups don't sparkle
    ribbon = 0, // share of buildings with ribbon glazing
    ribbonGlass = 0.5, // ribbon glass darkens the wall by this factor
    sky = 0.8, // dusk sky in the ribbon glass, of the painted facades' amount
  } = options;
  const uniforms = {
    uCityLit: { value: [lit, maxLit] },
    uCityVary: { value: vary },
    uCityDark: { value: dark },
    uCityCell: { value: [bay, floor] },
    uCityWarm: { value: new Color(warm) },
    uCityCool: { value: new Color(cool) },
    uCityCoolShare: { value: coolShare },
    uCityStrength: { value: strength },
    uCityGlass: { value: glass },
    uCityGlow: { value: glow },
    uCityClose: { value: close },
    uCitySoft: citySoft,
    uCityRibbon: { value: [ribbon, ribbonGlass, sky] },
  };
  material.userData.cityWindows = uniforms;

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms, cityLight);
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
        uniform float uCityVary;
        uniform float uCityDark;
        uniform vec2 uCityCell;
        uniform vec3 uCityWarm;
        uniform vec3 uCityCool;
        uniform float uCityCoolShare;
        uniform float uCityStrength;
        uniform float uCityGlass;
        uniform float uCityGlow;
        uniform float uCityClose;
        uniform float uCitySoft;
        uniform vec3 uCityRibbon;
        varying vec3 vCityPos;
        varying vec2 vCitySeed;
        float cityHash( vec2 p ) {
          return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 );
        }
        ${cityLightGlsl}`,
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
            vec2 w0 = max( fwidth( g ), vec2( 1e-4 ) );
            vec2 seed = floor( vCitySeed );
            // Punched windows fill 0.6 × 0.5 of a bay; ribbon glass the full
            // width (behind mullions that fade before they'd crawl) × 0.48.
            float ribbon = step( cityHash( seed * 0.031 + 5.3 ), uCityRibbon.x );
            vec2 rowY = mix( vec2( 0.28, 0.78 ), vec2( 0.32, 0.8 ), ribbon );
            float xCover = mix( 0.6, 1.0, ribbon );
            float area = xCover * ( rowY.y - rowY.x );
            // Lit bars over 0.6 bay wide read brighter than their total: dimmed further.
            float norm = 0.3 / area * mix( 1.0, ${glsl(RIBBON_DIM)}, ribbon );
            // Only windows over ~6 px are softened: blurring smaller ones dims them.
            vec2 w = w0 * mix( vec2( uCitySoft ), vec2( 1.0 ), smoothstep( 0.1, 0.2, w0 ) );
            float punchedX = smoothstep( 0.2 - w.x, 0.2 + w.x, f.x ) - smoothstep( 0.8 - w.x, 0.8 + w.x, f.x );
            float mullion = 1.0 - smoothstep( 0.03 - w.x, 0.03 + w.x, min( f.x, 1.0 - f.x ) );
            float ribbonX = 1.0 - mullion * ( 1.0 - smoothstep( 0.03, 0.08, w0.x ) );
            float shape = mix( punchedX, ribbonX, ribbon ) *
              ( smoothstep( rowY.x - w.y, rowY.x + w.y, f.y ) - smoothstep( rowY.y - w.y, rowY.y + w.y, f.y ) );
            float density = min( uCityLit.x * ( 1.0 + uCityVary * ( cityHash( seed * 0.013 ) - 0.5 ) ), uCityLit.y );
            density *= mix( 1.0, 0.1, step( cityHash( seed * 0.071 + 3.1 ), uCityDark ) );
            // Offices: runs of 3–6 bays (fixed per floor), more of them lit on
            // busy groups of floors (busy averages 1).
            float runW = 3.0 + floor( cityHash( vec2( cell.y, 1.7 ) + seed * 0.29 ) * 4.0 );
            float runX = g.x / runW;
            float run = floor( runX );
            float fr = fract( runX );
            float wr = w0.x / runW;
            float runEdge = smoothstep( 0.0, wr, fr ) * smoothstep( 0.0, wr, 1.0 - fr );
            float busy = 0.25 + 1.5 * cityHash( vec2( floor( cell.y / ${glsl(FLOOR_GROUP)} ), 9.1 ) + seed * 0.53 );
            vec2 office = vec2( run, cell.y );
            float officeOn = step( cityHash( office + seed * 0.137 ), density * busy * ${glsl((1 - LONE) / OFFICE_ON)} );
            vec3 officeLight = mix( uCityWarm, uCityCool, step( 1.0 - uCityCoolShare, cityHash( office.yx + seed ) ) ) *
              ( 0.5 + 0.5 * cityHash( office + 7.7 ) );
            float windowOn = officeOn * step( cityHash( cell + seed * 0.211 + 4.1 ), ${glsl(OFFICE_ON)} );
            float lone = step( cityHash( cell + seed * 0.137 + 11.3 ), density * ${glsl(LONE)} ) * ( 1.0 - windowOn );
            vec3 loneLight = mix( uCityWarm, uCityCool, step( 1.0 - uCityCoolShare, cityHash( cell.yx + seed ) ) ) *
              ( 0.5 + 0.5 * cityHash( cell + 7.7 ) );
            float closeGain = mix( uCityClose, 1.0, smoothstep( 0.08, 0.25, w0.x ) );
            vec3 detail = ( officeLight * windowOn * ( 0.8 + 0.2 * cityHash( cell + 2.3 ) ) + loneLight * lone ) *
              shape * closeGain * norm;
            // Floor strips: the window band of each floor, each office lit
            // whole (standing in for its lone windows too), at the bays'
            // average coverage across.
            float bandY = smoothstep( rowY.x - w0.y, rowY.x + w0.y, f.y ) - smoothstep( rowY.y - w0.y, rowY.y + w0.y, f.y );
            float strip = bandY * runEdge * xCover;
            vec3 strips = officeLight * officeOn * strip * norm;
            // 0.3 window area × 0.75 mean brightness, lifted: a true average
            // of the dots reads dimmer than the dots themselves.
            vec3 average = mix( uCityWarm, uCityCool, uCityCoolShare ) * min( density, 1.0 ) * uCityGlow;
            float bays = smoothstep( 0.2, 0.5, w0.x );
            float far = smoothstep( 0.2, 0.5, max( w0.y, w0.x / ${RUN.toFixed(1)} ) );
            totalEmissiveRadiance += mix( mix( detail, strips, bays ), average, far ) * uCityStrength;
            // Ribbon glass runs on between offices, so its strips have no gaps.
            float glassStrip = bandY * mix( runEdge * 0.6, 1.0, ribbon );
            float glass = mix( mix( shape, glassStrip, bays ), area, far );
            diffuseColor.rgb *= mix( 1.0, mix( uCityGlass, uCityRibbon.y, ribbon ), glass );
            totalEmissiveRadiance += skyInGlass( normal, normalize( vViewPosition ), vCityPos.y ) * glass * ribbon * uCityRibbon.z;
          }
          totalEmissiveRadiance += streetLight( diffuseColor.rgb, vCityPos.y );
        }`,
      );
  };
  return material;
}
