import { AdditiveBlending, Color, ShaderMaterial, Vector3, Vector4 } from 'three';
import { WORLD } from '../data/world.js';
import { breath, breatheGlsl } from './lightBreath.js';

// Promenade railing bays (after the user's stone balustrade design): a big
// square post every ~4 m, a slim post halfway, a lantern on every second big
// post. The bay geometry is built 4 m long and stretched to fit each run.
export const RAILING_BAY = 4;
const LANTERN_EVERY = 2;
const LANTERN_LIGHT_Y = 1.28;
const LAMP_LIGHT_Y = 3.55;

// Bays start at every post; a post skipped at a corner belongs to the
// neighbouring run (the bays themselves are kept). `scale` sizes the whole
// run, post spacing included; `lanternEvery` counts big posts per lantern,
// starting from post `lanternOffset` (0 = the run's first post).
export function railingLayout({ from, to, y, skipFirst = false, skipLast = false, lanterns = true, scale = 1, lanternEvery = LANTERN_EVERY, lanternOffset = 0 }) {
  const lit = (k) => (((k - lanternOffset) % lanternEvery) + lanternEvery) % lanternEvery === 0;
  const a = new Vector3(from[0], y, from[1]);
  const b = new Vector3(to[0], y, to[1]);
  const length = a.distanceTo(b);
  const bays = Math.max(1, Math.round(length / (RAILING_BAY * scale)));
  const yaw = Math.atan2(-(b.z - a.z), b.x - a.x);
  const starts = [];
  const posts = [];
  for (let k = 0; k <= bays; k++) {
    const position = a.clone().lerp(b, k / bays);
    if (k < bays) starts.push(position);
    if ((k === 0 && skipFirst) || (k === bays && skipLast)) continue;
    posts.push({ position, lantern: lanterns && lit(k) });
  }
  return { a, b, length, bays, bayLength: length / bays, yaw, starts, posts, scale, lanternEvery, lanternOffset };
}

// Every warm light on the promenade: railing lanterns and the tall lamps.
// They are not real lights (the scene keeps 3); materials that opt in with
// addLampLight get a warm pool around each one.
export const LAMPS = [];
for (const segment of [...WORLD.foreground.railings, ...WORLD.foreground.edgeRailings]) {
  const { posts, scale } = railingLayout(segment);
  for (const post of posts) {
    // Range 4.5 m (was 3.2; user request, 2026-10-03): the pool reaches the
    // rails either side and the paving at the post's foot.
    if (post.lantern) LAMPS.push({ position: post.position.clone().setY(segment.y + LANTERN_LIGHT_Y * scale), range: 4.5 * scale, power: 1 });
  }
}
for (const [x, y, z] of WORLD.foreground.lamps) {
  LAMPS.push({ position: new Vector3(x, y + LAMP_LIGHT_Y, z), range: 11, power: 1.4 });
}

export const LAMP_COLOR = new Color(0xffb46a);

const lampUniforms = {
  lampPos: { value: LAMPS.map(({ position, range }) => new Vector4(position.x, position.y, position.z, range)) },
  lampPower: { value: LAMPS.map(({ power }) => power) },
  lampColor: { value: LAMP_COLOR },
};

// Adds the lamp pools to a Lambert or Standard material as emitted light, so
// they survive the night's low fill. `strength` scales them per material.
export function addLampLight(material, strength = 1) {
  const previous = material.onBeforeCompile;
  // Keeps programs apart from same-type materials with other shader patches.
  const key = `${material.customProgramCacheKey()}|lamps`;
  material.customProgramCacheKey = () => key;
  material.onBeforeCompile = (shader, renderer) => {
    previous?.(shader, renderer);
    Object.assign(shader.uniforms, lampUniforms, { lampStrength: { value: strength } });
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vLampWorld;
        varying vec3 vLampNormal;`,
      )
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        vec4 lampWorld = vec4( transformed, 1.0 );
        vec3 lampNormal = objectNormal;
        #ifdef USE_INSTANCING
          lampWorld = instanceMatrix * lampWorld;
          lampNormal = mat3( instanceMatrix ) * lampNormal;
        #endif
        vLampWorld = ( modelMatrix * lampWorld ).xyz;
        vLampNormal = normalize( mat3( modelMatrix ) * lampNormal );`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        #define LAMP_COUNT ${LAMPS.length}
        uniform vec4 lampPos[ LAMP_COUNT ];
        uniform float lampPower[ LAMP_COUNT ];
        uniform vec3 lampColor;
        uniform float lampStrength;
        varying vec3 vLampWorld;
        varying vec3 vLampNormal;`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        vec3 lampN = normalize( vLampNormal );
        float lampSum = 0.0;
        for ( int i = 0; i < LAMP_COUNT; i ++ ) {
          vec3 toLamp = lampPos[ i ].xyz - vLampWorld;
          float d = length( toLamp );
          float fall = 1.0 - min( d / lampPos[ i ].w, 1.0 );
          float facing = 0.3 + 0.7 * max( dot( lampN, toLamp / max( d, 0.001 ) ), 0.0 );
          lampSum += lampPower[ i ] * fall * fall * facing;
        }
        totalEmissiveRadiance += diffuseColor.rgb * lampColor * lampSum * lampStrength;`,
      );
  };
  return material;
}

// Keeps `fill` of the scene's moon and sky light on a Lambert material, so
// the nearest layer reads as a dark shape; the lamp pools (emitted light)
// are untouched and catch its edges warm. Patch before the first compile.
export function silhouette(material, fill) {
  const previous = material.onBeforeCompile;
  const key = `${material.customProgramCacheKey()}|silhouette`;
  material.customProgramCacheKey = () => key;
  material.onBeforeCompile = (shader, renderer) => {
    previous?.(shader, renderer);
    shader.uniforms.silhouetteFill = { value: fill };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float silhouetteFill;')
      .replace(
        '#include <aomap_fragment>',
        `#include <aomap_fragment>
        reflectedLight.directDiffuse *= silhouetteFill;
        reflectedLight.indirectDiffuse *= silhouetteFill;`,
      );
  };
  return material;
}

// The Clock Tower's floodlight (a real light), relative to the tower.
export const TOWER_FLOOD = [0, 1.5, 9];

// Paving variation (user choice, 2026-10-03: the slabs read as one uniform
// dark grid). `weather`: soft lighter and darker patches `size` metres across,
// ± `amount`. `puddles` (user request, 2026-10-03: the noise-scattered ones
// were too many and read as flat shapes): two, on the hero's visible deck
// under the bush where a lantern's reflection falls, [x, z, radius x,
// radius z, turn], with ragged edges (`wobble`) and a soaked rim (`rim`, a
// share of the radius). The 01 hold sees no deck. Inside, the stone goes
// nearly black under the water, which mirrors railing A and the sky beyond
// it, slightly rippled. Three more on the promontory fill the empty paving
// at the bottom left of desktop 02 (user choice, 2026-10-03), on the 02
// camera's line to the Clock Tower so they mirror its lit foot.
// `petals`: fallen bauhinia petals (`size` metres long) lying on the deck,
// thickest within `reach` metres of the tree and the bush.
const PAVING = {
  weather: { size: 5, amount: 0.22, slab: 0.25 },
  puddles: {
    list: [
      [-18.6, 91.3, 1.4, 0.65, 0.6],
      [-15.9, 93.5, 0.7, 0.4, -0.3],
      [-70.4, 6, 3.2, 1.8, 0.4],
      [-76, 3, 1.8, 1.0, -0.4],
      [-67.4, -0.5, 1.4, 0.8, 0.9],
    ],
    wobble: 0.2,
    rim: 0.3,
    // What the water mirrors: the sky, and railing A beyond the puddles
    // (traced: posts, rails and lit lanterns), at `reflect` of their light.
    // `clouds`: the sky's brightness between clear gaps and lit cloud.
    sky: { horizon: [0.3, 0.19, 0.42], zenith: [0.05, 0.05, 0.15], clouds: [0.15, 1.4] },
    reflect: 0.2,
    stone: [0.03, 0.025, 0.025],
    glass: 3,
    halo: 0.04,
    ripple: 0.012,
    // The Clock Tower in the water (traced as an upright slab `half` metres
    // half wide, `height` tall facing the puddle): its floodlit foot (`base`,
    // the lowest `glow` metres) and the brick above, before `reflect`.
    tower: { half: 4.2, height: 42, glow: 7, base: [4.5, 2.6, 1], body: [1.1, 0.3, 0.16] },
  },
  petals: { cell: 0.3, size: [0.1, 0.06], reach: 7, density: 0.45, colour: [0.82, 0.2, 0.46] },
};

// Wet promenade paving (after the user's wet-paving design): on faces that
// look up, granite slabs from `map` laid in world metres (`tile` m per
// repeat), darker where wet, and warm reflections of every lantern, lamp and
// the tower floodlight, stretched toward the camera like light on wet stone.
// Slab joints fade to the slab average once they shrink below a few pixels,
// so they don't shimmer at grazing angles. Needs addLampLight first.
export function addWetPaving(material, { map, tile, y }) {
  const previous = material.onBeforeCompile;
  const key = `${material.customProgramCacheKey()}|paving`;
  material.customProgramCacheKey = () => key;
  const [tx, ty, tz] = WORLD.clockTower.position;
  const flood = new Vector4(tx + TOWER_FLOOD[0], ty + TOWER_FLOOD[1], tz + TOWER_FLOOD[2], 3);
  const { bauhinia, bauhiniaBush } = WORLD.foreground;
  const blooms = new Vector4(bauhinia.position[0], bauhinia.position[2], bauhiniaBush.position[0], bauhiniaBush.position[2]);
  const { weather, puddles, petals } = PAVING;
  const f = (n) => n.toFixed(3);
  const railA = railingLayout(WORLD.foreground.railings[0]);
  const railDir = railA.b.clone().sub(railA.a).normalize();
  const rail = new Vector4(railA.a.x, railA.a.z, railDir.x, railDir.z);
  const railSize = new Vector4(railA.bayLength, railA.scale, railA.length, 0);
  material.onBeforeCompile = (shader, renderer) => {
    previous(shader, renderer);
    Object.assign(shader.uniforms, {
      paveMap: { value: map },
      paveTile: { value: tile },
      paveY: { value: y },
      paveFlood: { value: flood },
      paveBlooms: { value: blooms },
      paveRail: { value: rail },
      paveRailSize: { value: railSize },
    });
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform sampler2D paveMap;
        uniform float paveTile;
        uniform float paveY;
        uniform vec4 paveFlood;
        uniform vec4 paveBlooms;
        uniform vec4 paveRail;
        uniform vec4 paveRailSize;
        float paveHash( vec2 p ) {
          return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 );
        }
        float paveNoise( vec2 p ) {
          vec2 i = floor( p );
          vec2 f = fract( p );
          f = f * f * ( 3.0 - 2.0 * f );
          return mix( mix( paveHash( i ), paveHash( i + vec2( 1.0, 0.0 ) ), f.x ),
                      mix( paveHash( i + vec2( 0.0, 1.0 ) ), paveHash( i + vec2( 1.0, 1.0 ) ), f.x ), f.y );
        }
        // Reflection of a light at height h above the paving, around the
        // point where the mirrored light's ray from the camera meets the
        // ground. Measured in view angles (depression and azimuth) so it keeps
        // one size on screen and its tail never reaches the deck under the
        // camera. x: the streak, narrow across and long down toward the
        // viewer; y: a wide faint glow around it; z: a sharp mirror image
        // (for standing water, offset by \`ripple\`); w: a soft halo round it.
        vec4 paveStreak( vec3 light, vec2 p, vec2 ripple ) {
          float h = light.y - paveY;
          float H = cameraPosition.y - paveY;
          if ( h <= 0.0 || H <= 0.0 ) return vec4( 0.0 );
          vec2 c = cameraPosition.xz;
          vec2 dir = light.xz - c;
          float dist = length( dir ) * H / ( H + h );
          if ( dist < 0.001 ) return vec4( 0.0 );
          dir = normalize( dir );
          vec2 rel = p - c;
          float a = dot( rel, dir );
          if ( a <= 0.0 ) return vec4( 0.0 );
          float drop = H / a - H / dist;
          float side = dot( rel, vec2( -dir.y, dir.x ) ) / a;
          float u = drop / ( drop > 0.0 ? 0.045 : 0.015 );
          float v = side / 0.006;
          float gu = drop / ( drop > 0.0 ? 0.09 : 0.03 );
          float gv = side / 0.02;
          float mu = ( drop + ripple.x ) / 0.012;
          float mv = ( side + ripple.y ) / 0.009;
          float hu = drop / 0.05;
          float hv = side / 0.04;
          return vec4( exp( -u * u - v * v ), exp( -gu * gu - gv * gv ), exp( -mu * mu - mv * mv ), exp( -hu * hu - hv * hv ) );
        }
        // Railing A as seen in standing water at p: the mirrored view ray,
        // tilted by \`ripple\`, meets the railing's line at a height above the
        // deck; the shape there (in metres of the unscaled railing). rgb:
        // its light; a: 1 where it hits stone or iron, 2 on lantern glass
        // (lit by the caller, as lampColor is declared later).
        vec4 paveRailMirror( vec2 p, vec2 ripple ) {
          vec3 view = vec3( p.x, paveY, p.y ) - cameraPosition;
          vec2 r = view.xz + ripple * length( view.xz );
          vec2 d = paveRail.zw;
          vec2 w = paveRail.xy - p;
          float den = r.x * d.y - r.y * d.x;
          if ( abs( den ) < 1e-5 ) return vec4( 0.0 );
          float t = ( w.x * d.y - w.y * d.x ) / den;
          float s = ( w.x * r.y - w.y * r.x ) / den;
          if ( t <= 0.0 || s < 0.0 || s > paveRailSize.z ) return vec4( 0.0 );
          float k = paveRailSize.y;
          float y = -view.y * t / k;
          float q = mod( s, paveRailSize.x ) / k;
          float bay = paveRailSize.x / k;
          float post = min( q, bay - q );
          float slim = abs( q - bay * 0.5 );
          bool lit = mod( floor( s / paveRailSize.x + 0.5 ) - ${f(railA.lanternOffset)}, ${f(railA.lanternEvery)} ) < 0.5;
          if ( lit && post < 0.12 && y > 1.14 && y < 1.41 ) return vec4( 0.0, 0.0, 0.0, 2.0 );
          bool iron = lit && post < 0.16 && y > 1.12 && y < 1.6;
          bool stone = y < 0.3
            || ( post < 0.31 && y < 1.12 )
            || ( slim < 0.13 && y < 1.01 )
            || abs( y - 0.87 ) < 0.065 || abs( y - 0.58 ) < 0.035 || abs( y - 0.4 ) < 0.035;
          if ( iron ) return vec4( vec3( 0.015, 0.012, 0.01 ), 1.0 );
          if ( stone ) return vec4( vec3( ${puddles.stone.map(f).join(', ')} ) * ( 1.0 + 2.5 * exp( -post * post / 0.6 ) * smoothstep( 0.3, 1.1, y ) ), 1.0 );
          return vec4( 0.0 );
        }
        // Distance-like edge value of a puddle: under 1 inside, ragged.
        float pavePuddleEdge( vec2 p, vec2 centre, vec2 radius, float turn ) {
          vec2 d = mat2( cos( turn ), -sin( turn ), sin( turn ), cos( turn ) ) * ( p - centre );
          float e = length( d / radius );
          return e + ${f(puddles.wobble)} * ( 2.0 * paveNoise( p * 1.7 + centre ) - 1.0 + 0.5 * ( 2.0 * paveNoise( p * 5.0 - centre ) - 1.0 ) );
        }`,
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        bool paveTop = vLampNormal.y > 0.5;
        float paveWet = 0.0;
        float paveFine = 0.0;
        float paveCoarse = 0.0;
        float paveGloss = 1.0;
        float paveBevel = 0.0;
        float pavePuddle = 0.0;
        float pavePetal = 0.0;
        if ( paveTop ) {
          vec2 paveUv = vLampWorld.xz / paveTile;
          vec3 slab = texture2D( paveMap, paveUv ).rgb;
          vec3 average = textureLod( paveMap, paveUv, 12.0 ).rgb;
          float metresPerPixel = length( fwidth( vLampWorld.xz ) );
          // Detail fades out as it shrinks toward a pixel, finest first.
          paveFine = 1.0 - smoothstep( 0.015, 0.05, metresPerPixel );
          paveCoarse = 1.0 - smoothstep( 0.05, 0.15, metresPerPixel );
          slab = mix( average, slab, 1.0 - smoothstep( 0.02, 0.07, metresPerPixel ) );
          // The map holds 3 × 3 slabs: each slab gets its own tone and gloss,
          // and a bevel just inside its joints catches the lamps.
          float slabSize = paveTile / 3.0;
          float slabRandom = paveHash( floor( vLampWorld.xz / slabSize ) );
          vec2 inSlab = fract( vLampWorld.xz / slabSize );
          float toJoint = min( min( inSlab.x, 1.0 - inSlab.x ), min( inSlab.y, 1.0 - inSlab.y ) ) * slabSize;
          paveBevel = smoothstep( 0.06, 0.015, toJoint ) * step( 0.012, toJoint ) * paveFine;
          paveGloss = 0.75 + 0.5 * slabRandom;
          slab *= mix( 1.0, ${f(1 - weather.slab)} + ${f(2 * weather.slab)} * slabRandom, paveCoarse );
          slab *= 1.0 + ${f(2 * weather.amount)} * ( paveNoise( vLampWorld.xz / ${f(weather.size)} + 31.0 ) - 0.5 );
          paveWet = 0.35 + 0.65 * smoothstep( 0.4, 0.75, paveNoise( vLampWorld.xz / 3.5 ) + ( slabRandom - 0.5 ) * 0.15 );
          float edge = 9.0;
          ${puddles.list.map(([x, z, rx, rz, t]) => `edge = min( edge, pavePuddleEdge( vLampWorld.xz, vec2( ${f(x)}, ${f(z)} ), vec2( ${f(rx)}, ${f(rz)} ), ${f(t)} ) );`).join('\n          ')}
          float edgeBlur = max( fwidth( edge ), 0.02 );
          pavePuddle = 1.0 - smoothstep( 1.0 - edgeBlur, 1.0 + edgeBlur, edge );
          float soaked = 1.0 - smoothstep( 1.0, ${f(1 + puddles.rim)}, edge );
          paveWet = max( paveWet, soaked );
          paveBevel *= 1.0 - soaked;
          diffuseColor.rgb = slab * mix( 0.8, 0.4, paveWet ) * mix( 1.0 - 0.25 * soaked, 0.12, pavePuddle );
          // Fallen petals: at most one per cell, lying at a random angle.
          vec2 petalCell = floor( vLampWorld.xz / ${f(petals.cell)} );
          vec2 toTree = vLampWorld.xz - paveBlooms.xy;
          vec2 toBush = vLampWorld.xz - paveBlooms.zw;
          float petalNear = max( exp( -dot( toTree, toTree ) / ${f(petals.reach ** 2)} ), exp( -dot( toBush, toBush ) / ${f(petals.reach ** 2)} ) );
          if ( paveHash( petalCell + 3.1 ) < ${f(petals.density)} * petalNear ) {
            vec2 centre = ( petalCell + 0.25 + 0.5 * vec2( paveHash( petalCell + 7.3 ), paveHash( petalCell + 11.9 ) ) ) * ${f(petals.cell)};
            float turn = paveHash( petalCell + 5.7 ) * 6.2832;
            vec2 d = mat2( cos( turn ), -sin( turn ), sin( turn ), cos( turn ) ) * ( vLampWorld.xz - centre );
            float shape = length( d / vec2( ${f(petals.size[0] / 2)}, ${f(petals.size[1] / 2)} ) );
            pavePetal = smoothstep( 1.0, 0.6, shape ) * ( 1.0 - smoothstep( 0.012, 0.03, metresPerPixel ) );
            vec3 petalColour = vec3( ${petals.colour.map(f).join(', ')} ) * ( 0.6 + 0.6 * paveHash( petalCell + 9.1 ) );
            diffuseColor.rgb = mix( diffuseColor.rgb, petalColour * 0.5, pavePetal );
          }
          paveWet *= 1.0 - pavePetal;
        }`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        if ( paveTop ) {
          vec2 ripple = ${f(puddles.ripple)} * ( vec2( paveNoise( vLampWorld.xz * 9.0 ), paveNoise( vLampWorld.xz * 9.0 + 4.0 ) ) - 0.5 ) * pavePuddle;
          vec4 shine = vec4( 0.0 );
          for ( int i = 0; i < LAMP_COUNT; i ++ ) shine += lampPower[ i ] * paveStreak( lampPos[ i ].xyz, vLampWorld.xz, ripple );
          shine += paveFlood.w * paveStreak( paveFlood.xyz, vLampWorld.xz, ripple );
          // Uneven wet stone breaks each streak into flecks: a coarse and a
          // fine layer, each smoothed away before it would shimmer.
          float coarse = smoothstep( 0.3, 0.75, paveNoise( vLampWorld.xz * 2.0 ) );
          float fine = smoothstep( 0.25, 0.8, paveNoise( vLampWorld.xz * 7.0 ) );
          float flecks = mix( 1.0, 0.15 + 1.7 * coarse, paveCoarse );
          flecks *= mix( 1.0, 0.2 + 1.6 * fine, paveFine );
          float streak = shine.x * flecks * paveGloss * ( 1.0 + 1.2 * paveBevel );
          streak = 1.5 * ( 1.0 - exp( -streak / 1.5 ) );
          vec3 stoneShine = lampColor * ( streak * paveWet * 0.9 + shine.y * flecks * paveWet * 0.04 );
          // The dusk sky's sheen on wet stone, strongest at grazing angles.
          vec3 toEye = cameraPosition - vLampWorld;
          float elevation = clamp( toEye.y / length( toEye ), 0.0, 1.0 );
          float grazing = pow( 1.0 - elevation, 5.0 );
          stoneShine += vec3( 0.14, 0.1, 0.32 ) * grazing * paveWet * 0.12;
          // Standing water: a mirror of railing A and the sky beyond it,
          // slightly rippled, plus a soft halo round each light's image.
          vec3 mirrored = mix( vec3( ${puddles.sky.horizon.map(f).join(', ')} ), vec3( ${puddles.sky.zenith.map(f).join(', ')} ), smoothstep( 0.0, 0.6, elevation ) );
          if ( pavePuddle > 0.0 ) {
            // Clouds in the mirrored sky, by the reflected ray's direction.
            vec3 ray = normalize( vec3( toEye.x, -toEye.y, toEye.z ) );
            float cloud = paveNoise( vec2( atan( ray.x, -ray.z ) * 40.0, ray.y * 60.0 ) ) * 0.65 + paveNoise( vec2( atan( ray.x, -ray.z ) * 110.0, ray.y * 150.0 ) ) * 0.35;
            mirrored *= ${f(puddles.sky.clouds[0])} + ${f(puddles.sky.clouds[1])} * smoothstep( 0.3, 0.8, cloud );
            vec3 up = vec3( -toEye.x, toEye.y, -toEye.z );
            vec2 across = normalize( up.xz );
            vec2 toTower = vec2( ${f(tx)}, ${f(tz)} ) - vLampWorld.xz;
            float reach = dot( toTower, across );
            if ( reach > 0.0 ) {
              float lateral = abs( toTower.x * across.y - toTower.y * across.x + ripple.y * reach * 4.0 );
              float rise = reach * up.y / length( up.xz ) + ripple.x * reach * 4.0;
              if ( lateral < ${f(puddles.tower.half)} && rise < ${f(puddles.tower.height)} ) {
                mirrored = mix( vec3( ${puddles.tower.base.map(f).join(', ')} ), vec3( ${puddles.tower.body.map(f).join(', ')} ), smoothstep( ${f(puddles.tower.glow * 0.5)}, ${f(puddles.tower.glow)}, rise ) );
              }
            }
            vec4 railing = paveRailMirror( vLampWorld.xz, ripple );
            if ( railing.a > 1.5 ) mirrored = lampColor * ${f(puddles.glass)};
            else if ( railing.a > 0.5 ) mirrored = railing.rgb;
          }
          vec3 waterShine = mirrored * ${f(puddles.reflect)} + lampColor * shine.w * ${f(puddles.halo)};
          totalEmissiveRadiance += mix( stoneShine, waterShine, pavePuddle );
        }`,
      );
  };
  return material;
}

// Soft camera-facing glow for instanced lights. Each instance's matrix gives
// the centre and size (scale x); the quad is pulled toward the camera by half
// its size so the lantern's own cap and roof never cut it. Each light breathes
// ±3% on a period (5–9 s) and phase hashed from its position, so neighbours
// never pulse together (lightBreath.js).
export function glowMaterial(color, strength = 1) {
  return new ShaderMaterial({
    uniforms: {
      color: { value: new Color(color) },
      opacity: { value: 1 },
      strength: { value: strength },
      uBreathTime: breath.uTime,
      uBreathDepth: breath.uDepth,
    },
    vertexShader: /* glsl */ `
      ${breatheGlsl}
      varying vec2 vUv;
      varying float vBreath;
      void main() {
        vUv = uv;
        vec4 centre = modelViewMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
        float size = length( instanceMatrix[ 0 ].xyz );
        vec3 seat = ( modelMatrix * instanceMatrix[ 3 ] ).xyz;
        float h = fract( sin( dot( seat, vec3( 12.9898, 78.233, 37.719 ) ) ) * 43758.5453 );
        vBreath = breathe( mix( 5.0, 9.0, fract( h * 7.13 ) ), h, 0.03 );
        centre.xyz += normalize( -centre.xyz ) * size * 0.5;
        centre.xy += position.xy * size;
        gl_Position = projectionMatrix * centre;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 color;
      uniform float opacity;
      uniform float strength;
      varying vec2 vUv;
      varying float vBreath;
      void main() {
        float r = length( vUv - 0.5 ) * 2.0;
        float core = exp( -r * r * 18.0 );
        float halo = pow( max( 1.0 - r, 0.0 ), 2.5 );
        gl_FragColor = vec4( color, ( core * 0.8 + halo * 0.45 ) * strength * opacity * vBreath );
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
}
