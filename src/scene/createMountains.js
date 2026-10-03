import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Points,
  ShaderMaterial,
  Vector2,
  Vector3,
} from 'three';
import { WORLD } from '../data/world.js';
import { seededRandom } from './random.js';

// Mountain ranges as upright strips under a ridge line (user choices,
// 2026-10-02): darker at the foot, lighter toward the ridge, a moonlit edge on
// the ridges near the moon, a band of city-lit mist at the near range's foot
// and scattered lights on its lower slopes.
const SHADE = { foot: 0.6, ridge: 1.9, power: 1.3 };
// Edge glow: width in metres (never under 2 px), reach in radians from the
// moon's centre as seen from the camera.
const RIM = { width: 5, reach: 0.22, strength: 0.32, color: 0xf6c46a };
const MIST = { color: 0x55445f, opacity: 0.6, fall: 1.2, drift: 0.004 };
// Point sprites of a fixed pixel size. Towers: width and height ranges in
// metres, window spacing [across, floor], lit share, how high up the slope
// they reach (share of the ridge) and how strongly they gather low (`rise`).
const LIGHTS = {
  size: 1.7,
  crowd: 1.7,
  warm: 0xffc68c,
  cool: 0xdde6ff,
  coolShare: 0.3,
  glow: [0.17, 0.26],
  tower: { width: [14, 36], height: [45, 140], spacing: [4.5, 3.6], lit: [0.35, 0.75], reach: 0.72, rise: 1.6 },
  road: { color: 0xffa65a, spacing: 7, gap: 0.2, glow: 0.24 },
  peak: { color: 0xfff0d8, count: 34, spread: [44, 14], glow: 0.55, size: 1.5 },
};
// Gullies and vegetation on the slopes: brightness varies by ± `amount`, in
// cells `cell` metres across and tall (taller than wide, like ravines).
const TEXTURE = { amount: 0.28, cell: [[45, 160], [18, 50]] };

const smoothstep = (t) => {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * (3 - 2 * c);
};

// Ridge height at x: the long swells and peaks, plus jagged detail from four
// octaves of ridged value noise (sharp crests, rounded hollows). Over `taper`
// metres at each end the ridge eases down to the water like a headland
// (user request, 2026-10-02: the cut ends read as cliffs).
function ridgeOf({ x: [x0, x1], base, peaks, seed, rough = 1, taper }) {
  const random = seededRandom(seed);
  const phase = [random() * 6, random() * 6, random() * 6];
  const table = Float32Array.from({ length: 256 }, () => random());
  const noise = (t) => {
    const i = Math.floor(t);
    const f = t - i;
    const s = f * f * (3 - 2 * f);
    return table[i & 255] + (table[(i + 1) & 255] - table[i & 255]) * s;
  };
  return (px) => {
    let h = base + 40 * Math.sin(px / 310 + phase[0]) + 25 * Math.sin(px / 140 + phase[1]) + 12 * Math.sin(px / 55 + phase[2]);
    for (const [cx, height, width] of peaks) {
      const d = (px - cx) / width;
      h += height * Math.exp(-d * d);
    }
    let detail = 0;
    for (let o = 0, amp = 16, len = 90; o < 4; o++, amp /= 2, len /= 2) {
      detail += amp * (1 - Math.abs(2 * noise(px / len + o * 37.1) - 1));
    }
    return (h + rough * (detail - 15)) * smoothstep((px - x0) / taper) * smoothstep((x1 - px) / taper);
  };
}

const moonPosition = new Vector3().fromArray(WORLD.moon.position);

function rangeMaterial(color) {
  const material = new MeshBasicMaterial({ color });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      uMoon: { value: moonPosition },
      uRim: { value: new Color(RIM.color).multiplyScalar(RIM.strength) },
    });
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute float aRidge;
        varying float vRidge;
        varying vec3 vMtnPos;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vRidge = aRidge;
        vMtnPos = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform vec3 uMoon;
        uniform vec3 uRim;
        varying float vRidge;
        varying vec3 vMtnPos;
        float mtnHash( vec2 p ) {
          return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 );
        }
        float mtnNoise( vec2 p ) {
          vec2 i = floor( p );
          vec2 f = fract( p );
          f = f * f * ( 3.0 - 2.0 * f );
          return mix( mix( mtnHash( i ), mtnHash( i + vec2( 1.0, 0.0 ) ), f.x ),
                      mix( mtnHash( i + vec2( 0.0, 1.0 ) ), mtnHash( i + 1.0 ), f.x ), f.y );
        }`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float mtnT = clamp( vMtnPos.y / max( vRidge, 1.0 ), 0.0, 1.0 );
        diffuseColor.rgb *= mix( ${SHADE.foot.toFixed(2)}, ${SHADE.ridge.toFixed(2)}, pow( mtnT, ${SHADE.power.toFixed(2)} ) );
        float mtnTexture = 0.6 * mtnNoise( vMtnPos.xy / vec2( ${TEXTURE.cell[0].map((n) => n.toFixed(1)).join(', ')} ) )
          + 0.4 * mtnNoise( vMtnPos.xy / vec2( ${TEXTURE.cell[1].map((n) => n.toFixed(1)).join(', ')} ) + 17.0 );
        diffuseColor.rgb *= 1.0 + ${(TEXTURE.amount * 2).toFixed(2)} * ( mtnTexture - 0.5 );`,
      )
      .replace(
        '#include <fog_fragment>',
        `#include <fog_fragment>
        {
          // After the fog: the moon behind the range lights its edge at any distance.
          float below = max( vRidge - vMtnPos.y, 0.0 );
          float rimWidth = max( ${RIM.width.toFixed(1)}, 2.0 * fwidth( vMtnPos.y ) );
          float toward = dot( normalize( vMtnPos - cameraPosition ), normalize( uMoon - cameraPosition ) );
          float near = smoothstep( cos( ${RIM.reach.toFixed(2)} ), 1.0, toward );
          gl_FragColor.rgb += uRim * exp( -below / rimWidth ) * near;
        }`,
      );
  };
  return material;
}

function createRange(range) {
  const { z, x, step, color } = range;
  const ridge = ridgeOf(range);
  const columns = Math.ceil((x[1] - x[0]) / step) + 1;
  const position = [];
  const top = [];
  const index = [];
  for (let i = 0; i < columns; i++) {
    const px = Math.min(x[0] + i * step, x[1]);
    const h = ridge(px);
    position.push(px, 0, 0, px, h, 0);
    top.push(h, h);
    if (i > 0) {
      const a = (i - 1) * 2;
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(position, 3));
  geometry.setAttribute('aRidge', new Float32BufferAttribute(top, 1));
  geometry.setIndex(index);
  geometry.computeBoundingSphere();
  const mesh = new Mesh(geometry, rangeMaterial(color));
  mesh.position.z = z;
  return { mesh, ridge };
}

// `taper`: the near range's end slopes, which the mist fades out along.
function createMist({ z, x, height }, taper) {
  const ends = (taper / (x[1] - x[0])).toFixed(3);
  const material = new ShaderMaterial({
    uniforms: {
      uColor: { value: new Color(MIST.color) },
      uOpacity: { value: MIST.opacity },
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uTime;
      varying vec2 vUv;
      float hash( float p ) { return fract( sin( p * 127.1 ) * 43758.5453 ); }
      float noise( float t ) {
        float i = floor( t );
        float f = fract( t );
        return mix( hash( i ), hash( i + 1.0 ), f * f * ( 3.0 - 2.0 * f ) );
      }
      void main() {
        float s = vUv.x * ${((x[1] - x[0]) / 300).toFixed(1)} + uTime * ${MIST.drift};
        float patches = 0.6 + 0.4 * ( 0.65 * noise( s ) + 0.35 * noise( s * 2.3 + 5.0 ) );
        float fall = pow( 1.0 - vUv.y, ${MIST.fall.toFixed(1)} );
        float ends = smoothstep( 0.0, ${ends}, vUv.x ) * smoothstep( 1.0, 1.0 - ${ends}, vUv.x );
        gl_FragColor = vec4( uColor, uOpacity * fall * patches * ends );
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new Mesh(new PlaneGeometry(x[1] - x[0], height), material);
  mesh.position.set((x[0] + x[1]) / 2, height / 2, z);
  // First of the transparent layers after the moon, so nothing nearer is painted over.
  mesh.renderOrder = -0.5;
  return { mesh, material };
}

// Soft dots of a fixed pixel size: they stay put and never twinkle as the
// camera moves. All in one draw call.
function createSlopeLights({ x, towers, west, roads, peak, seed }, ridge, z) {
  const random = seededRandom(seed);
  const position = [];
  const color = [];
  const scale = [];
  const warm = new Color(LIGHTS.warm);
  const cool = new Color(LIGHTS.cool);
  const c = new Color();
  const add = (px, py, colour, glow, size = 1) => {
    position.push(px, py, z);
    c.copy(colour).multiplyScalar(glow);
    color.push(c.r, c.g, c.b);
    scale.push(size);
  };
  const between = ([a, b]) => a + (b - a) * random();

  // Residential towers: a grid of windows, some lit, in one tone per tower.
  // The west towers gather toward `x[0]` and reach less high further out.
  const { tower } = LIGHTS;
  for (let i = 0; i < towers + west.towers; i++) {
    const out = i < towers ? 0 : Math.pow(random(), 1.8);
    const cx = out > 0 ? x[0] - out * west.reachOut : between(x);
    const reach = out > 0 ? west.reach * (1 - 0.5 * out) : tower.reach;
    const ceiling = Math.min(ridge(cx) - 40, ridge(cx) * reach);
    const height = between(tower.height);
    const base = 30 + Math.max(0, ceiling - height - 30) * Math.pow(random(), tower.rise);
    const top = Math.min(base + height, ceiling);
    const width = between(tower.width);
    const columns = Math.max(2, Math.round(width / tower.spacing[0]));
    const lit = between(tower.lit);
    const tone = random() < LIGHTS.coolShare ? cool : warm;
    for (let y = base; y <= top; y += tower.spacing[1]) {
      for (let k = 0; k < columns; k++) {
        if (random() > lit) continue;
        add(cx - width / 2 + (k * width) / (columns - 1), y, tone, between(LIGHTS.glow));
      }
    }
  }

  // Roads: evenly spaced street lights with a few gaps, wiggling up the slope.
  const roadColour = new Color(LIGHTS.road.color);
  for (const [[xa, sa], [xb, sb], wiggle] of roads) {
    const phase = random() * Math.PI * 2;
    for (let px = xa; px <= xb; px += LIGHTS.road.spacing) {
      if (random() < LIGHTS.road.gap) continue;
      const t = (px - xa) / (xb - xa);
      const py = ridge(px) * (sa + (sb - sa) * t) + wiggle * Math.sin(px / 60 + phase);
      add(px, Math.min(py, ridge(px) - 12), roadColour, LIGHTS.road.glow * (0.8 + 0.4 * random()));
    }
  }

  // The Peak Tower and its terrace at Victoria Gap: a brighter patch just
  // under the ridge.
  const peakColour = new Color(LIGHTS.peak.color);
  for (let i = 0; i < LIGHTS.peak.count; i++) {
    const px = peak + (random() - 0.5) * LIGHTS.peak.spread[0];
    const py = ridge(px) - 6 - random() * LIGHTS.peak.spread[1];
    add(px, py, peakColour, LIGHTS.peak.glow * (0.6 + 0.4 * random()), LIGHTS.peak.size);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(position, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(color, 3));
  geometry.setAttribute('scale', new Float32BufferAttribute(scale, 1));
  // Where a window floor shrinks to under `crowd` point widths on screen (phones,
  // narrow windows), the dots dim, so the towers don't merge into solid bars.
  const material = new ShaderMaterial({
    uniforms: { uSize: { value: LIGHTS.size }, uHeight: { value: 900 } },
    vertexShader: `
      uniform float uSize;
      uniform float uHeight;
      attribute vec3 color;
      attribute float scale;
      varying vec3 vColor;
      void main() {
        gl_PointSize = uSize * scale;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        float floorPixels = ${LIGHTS.tower.spacing[1].toFixed(1)} * projectionMatrix[ 1 ][ 1 ] * 0.5 * uHeight / gl_Position.w;
        vColor = color * clamp( floorPixels / ( ${LIGHTS.crowd.toFixed(1)} * gl_PointSize ), 0.3, 1.0 );
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
  const points = new Points(geometry, material);
  points.renderOrder = -0.6;
  const buffer = new Vector2();
  points.onBeforeRender = (renderer) => {
    material.uniforms.uSize.value = LIGHTS.size * renderer.getPixelRatio();
    material.uniforms.uHeight.value = renderer.getDrawingBufferSize(buffer).y;
  };
  return points;
}

export function createMountains() {
  const { ranges, mist, lights } = WORLD.mountains;
  const group = new Group();
  group.name = 'mountains';
  const built = ranges.map(createRange);
  for (const { mesh } of built) group.add(mesh);
  const haze = createMist(mist, ranges[0].taper);
  // In front of the near range by 20 m, well clear of its depth.
  group.add(haze.mesh, createSlopeLights(lights, built[0].ridge, ranges[0].z + 20));

  // Continuous mode only; in reduced motion the mist holds still.
  function update(time) {
    haze.material.uniforms.uTime.value = time;
  }

  return { group, update };
}
