import { AdditiveBlending, Color, ShaderMaterial, Vector3, Vector4 } from 'three';
import { WORLD } from '../data/world.js';

// Promenade railing bays (after the user's stone balustrade design): a big
// square post every ~4 m, a slim post halfway, a lantern on every second big
// post. The bay geometry is built 4 m long and stretched to fit each run.
export const RAILING_BAY = 4;
const LANTERN_EVERY = 2;
const LANTERN_LIGHT_Y = 1.28;
const LAMP_LIGHT_Y = 3.55;

// Bays start at every post; a post skipped at a corner belongs to the
// neighbouring run (the bays themselves are kept).
export function railingLayout({ from, to, y, skipFirst = false, skipLast = false, lanterns = true }) {
  const a = new Vector3(from[0], y, from[1]);
  const b = new Vector3(to[0], y, to[1]);
  const length = a.distanceTo(b);
  const bays = Math.max(1, Math.round(length / RAILING_BAY));
  const yaw = Math.atan2(-(b.z - a.z), b.x - a.x);
  const starts = [];
  const posts = [];
  for (let k = 0; k <= bays; k++) {
    const position = a.clone().lerp(b, k / bays);
    if (k < bays) starts.push(position);
    if ((k === 0 && skipFirst) || (k === bays && skipLast)) continue;
    posts.push({ position, lantern: lanterns && k % LANTERN_EVERY === 0 });
  }
  return { a, b, length, bays, bayLength: length / bays, yaw, starts, posts };
}

// Every warm light on the promenade: railing lanterns and the tall lamps.
// They are not real lights (the scene keeps 3); materials that opt in with
// addLampLight get a warm pool around each one.
export const LAMPS = [];
for (const segment of [...WORLD.foreground.railings, ...WORLD.foreground.edgeRailings]) {
  for (const post of railingLayout(segment).posts) {
    if (post.lantern) LAMPS.push({ position: post.position.clone().setY(segment.y + LANTERN_LIGHT_Y), range: 3.2, power: 1 });
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
  const key = `${previous.toString()}|lamps`;
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

// Soft camera-facing glow for instanced lights. Each instance's matrix gives
// the centre and size (scale x); the quad is pulled toward the camera by half
// its size so the lantern's own cap and roof never cut it.
export function glowMaterial(color, strength = 1) {
  return new ShaderMaterial({
    uniforms: { color: { value: new Color(color) }, opacity: { value: 1 }, strength: { value: strength } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 centre = modelViewMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
        float size = length( instanceMatrix[ 0 ].xyz );
        centre.xyz += normalize( -centre.xyz ) * size * 0.5;
        centre.xy += position.xy * size;
        gl_Position = projectionMatrix * centre;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 color;
      uniform float opacity;
      uniform float strength;
      varying vec2 vUv;
      void main() {
        float r = length( vUv - 0.5 ) * 2.0;
        float core = exp( -r * r * 18.0 );
        float halo = pow( max( 1.0 - r, 0.0 ), 2.5 );
        gl_FragColor = vec4( color, ( core * 0.8 + halo * 0.45 ) * strength * opacity );
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
}
