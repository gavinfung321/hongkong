import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Quaternion,
  SphereGeometry,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { addLampLight } from './lamps.js';
import { PALM_BARK_U, PALM_FROND_U, palmAtlas } from './surfaces.js';
import { seededRandom } from './random.js';

// 3D promenade palms in two shapes, built at unit height (the top of the
// trunk at y = 1) and scaled per instance: a tall coconut palm with a curved
// trunk and long drooping fronds, and a straighter palm with a rounder crown
// of shorter fronds over a skirt of dead ones. The trunk leans along local +x.

const SHAPES = {
  coconut: {
    lean: 0.14, base: 0.022, top: 0.015, seed: 3,
    fronds: { count: 13, length: 0.36, width: 0.075, lift: [0.25, 0.9], droop: 1.1 },
    dead: null,
  },
  fan: {
    lean: 0.035, base: 0.03, top: 0.024, seed: 9,
    fronds: { count: 16, length: 0.27, width: 0.07, lift: [0.45, 1.1], droop: 0.95 },
    dead: { count: 8, length: 0.2, width: 0.05, lift: [-1.4, -0.9], droop: 0.1 },
  },
};

const GREEN = [0.33, 0.46, 0.27];
const DEAD = [0.5, 0.39, 0.25];
const BARK = [0.78, 0.68, 0.6];
const PALM_LAMP = 1.5;

// Sway weights per vertex: x bends with the trunk (0 at the root, 1 in the
// crown), y flutters the fronds toward their tips.
function finish(geometry, positions, uvs, colors, sway, index) {
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.setAttribute('palmSway', new Float32BufferAttribute(sway, 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

function trunkGeometry({ lean, base, top }) {
  const RADIAL = 7;
  const SEGMENTS = 10;
  const [u0, u1] = PALM_BARK_U;
  const positions = [];
  const uvs = [];
  const colors = [];
  const sway = [];
  const index = [];
  for (let j = 0; j <= SEGMENTS; j++) {
    const s = j / SEGMENTS;
    const cx = lean * s ** 1.8;
    // A slight bulge at the root.
    const r = (base + (top - base) * s) * (1 + Math.max(0, 0.08 - s) * 5);
    for (let k = 0; k <= RADIAL; k++) {
      const a = (k / RADIAL) * Math.PI * 2;
      positions.push(cx + Math.cos(a) * r, s, Math.sin(a) * r);
      uvs.push(u0 + (u1 - u0) * (k / RADIAL), s);
      colors.push(...BARK);
      sway.push(s * s, 0);
    }
  }
  const row = RADIAL + 1;
  for (let j = 0; j < SEGMENTS; j++) {
    for (let k = 0; k < RADIAL; k++) {
      const a = j * row + k;
      index.push(a, a + row, a + 1, a + 1, a + row, a + row + 1);
    }
  }
  return finish(new BufferGeometry(), positions, uvs, colors, sway, index);
}

// The knot of frond bases at the top of the trunk.
function crownGeometry({ lean, top }) {
  const geometry = new SphereGeometry(top * 1.7, 7, 5).translate(lean, 1, 0);
  const [u0, u1] = PALM_BARK_U;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, u0 + (u1 - u0) * uv.getX(i), 0.85 + 0.15 * uv.getY(i));
  const count = geometry.attributes.position.count;
  geometry.setAttribute('color', new Float32BufferAttribute(new Array(count).fill(BARK).flat(), 3));
  geometry.setAttribute('palmSway', new Float32BufferAttribute(new Array(count).fill([1, 0]).flat(), 2));
  return geometry;
}

// One frond: a ribbon along an arc that rises at `lift` and droops with
// `droop`, widest a third of the way out, folded into a shallow V along the
// midrib. The atlas cuts it into leaflets.
function frondGeometry(origin, angle, { length, width, lift, droop }, color) {
  const SEGMENTS = 10;
  const dir = [Math.cos(angle), Math.sin(angle)];
  const side = [-dir[1], dir[0]];
  const positions = [];
  const uvs = [];
  const colors = [];
  const sway = [];
  const index = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const out = length * t;
    const x = origin[0] + dir[0] * out;
    const z = origin[2] + dir[1] * out;
    const y = origin[1] + length * (lift * t - droop * t * t);
    const w = width * Math.sin(Math.PI * t ** 0.75);
    const fold = w * 0.35;
    positions.push(
      x - side[0] * w, y - fold, z - side[1] * w,
      x, y, z,
      x + side[0] * w, y - fold, z + side[1] * w,
    );
    uvs.push(0, t, PALM_FROND_U / 2, t, PALM_FROND_U, t);
    for (let k = 0; k < 3; k++) {
      colors.push(...color);
      sway.push(1, t);
    }
  }
  for (let i = 0; i < SEGMENTS; i++) {
    const a = i * 3;
    const b = a + 3;
    index.push(a, b, a + 1, a + 1, b, b + 1, a + 1, b + 1, a + 2, a + 2, b + 1, b + 2);
  }
  return finish(new BufferGeometry(), positions, uvs, colors, sway, index);
}

function frondRing(origin, spec, baseColor, random) {
  const parts = [];
  for (let i = 0; i < spec.count; i++) {
    const angle = ((i + random() * 0.6) / spec.count) * Math.PI * 2;
    const [lo, hi] = spec.lift;
    const shade = 0.85 + random() * 0.3;
    parts.push(
      frondGeometry(
        origin,
        angle,
        {
          length: spec.length * (0.85 + random() * 0.3),
          width: spec.width * (0.85 + random() * 0.3),
          lift: lo + (hi - lo) * random(),
          droop: spec.droop * (0.8 + random() * 0.4),
        },
        baseColor.map((c) => c * shade),
      ),
    );
  }
  return parts;
}

function palmGeometry(shape) {
  const spec = SHAPES[shape];
  const random = seededRandom(spec.seed);
  const crown = [spec.lean, 1, 0];
  const parts = [trunkGeometry(spec), crownGeometry(spec), ...frondRing(crown, spec.fronds, GREEN, random)];
  if (spec.dead) parts.push(...frondRing([spec.lean, 0.985, 0], spec.dead, DEAD, random));
  return mergeGeometries(parts);
}

// Sway and leaflet cut-out, shared by the palms and their depth-only twins so
// both move identically. Leaflet gaps fill in once they shrink below a few
// texels per pixel, so distant crowns read as calm silhouettes instead of
// shimmering. `soft`: the leaflet edge blends over one pixel instead of
// snapping (the twin keeps the hard cut). The cut-out ignores opacity, so
// palms fade evenly.
function addPalmShader(material, time, soft) {
  const previous = material.onBeforeCompile;
  const key = `${material.customProgramCacheKey()}|palm${soft ? '-soft' : ''}`;
  material.customProgramCacheKey = () => key;
  material.onBeforeCompile = (shader, renderer) => {
    previous?.(shader, renderer);
    shader.uniforms.palmTime = time;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float palmTime;
        attribute vec2 palmSway;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vec3 palmRoot = instanceMatrix[ 3 ].xyz;
        #else
          vec3 palmRoot = vec3( 0.0 );
        #endif
        float palmPhase = dot( palmRoot.xz, vec2( 0.37, 0.61 ) );
        float palmSwing = sin( palmTime * 0.55 + palmPhase ) + 0.35 * sin( palmTime * 1.27 + palmPhase * 1.7 );
        transformed.x += palmSwing * 0.02 * palmSway.x;
        transformed.z += palmSwing * 0.007 * palmSway.x;
        float palmFlutter = sin( palmTime * 1.9 + palmPhase + atan( position.z, position.x ) * 3.0 );
        transformed.y += palmFlutter * 0.012 * palmSway.y * palmSway.y;`,
      );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
      float palmLeaf = mix( sampledDiffuseColor.a, 1.0, smoothstep( 1.5, 4.0, length( fwidth( vMapUv ) ) * 256.0 ) );
      ${
        soft
          ? `float palmEdge = clamp( ( palmLeaf - 0.5 ) / max( fwidth( palmLeaf ), 1e-4 ) + 0.5, 0.0, 1.0 );
      if ( palmEdge < 0.02 ) discard;
      diffuseColor.a = opacity * palmEdge;`
          : `if ( palmLeaf < 0.5 ) discard;
      diffuseColor.a = opacity;`
      }`,
    );
  };
  return material;
}

// palms: [{ position, height, shape, yaw, only }], `only` naming the one
// breakpoint a palm shows at. Returns the group, the faded material,
// setBreakpoint, and update(time) for the sway (not called in reduced motion).
export function createPalms(palms) {
  const group = new Group();
  const time = { value: 0 };
  const map = palmAtlas();
  const material = addPalmShader(
    addLampLight(new MeshLambertMaterial({ map, vertexColors: true, side: DoubleSide, transparent: true }), PALM_LAMP),
    time,
    true,
  );
  // Drawn just before the palms: while they fade, only their front surface
  // blends, so fronds behind fronds don't show through.
  const depthOnly = addPalmShader(
    new MeshBasicMaterial({
      map,
      side: DoubleSide,
      colorWrite: false,
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: 0,
      polygonOffsetUnits: 2,
    }),
    time,
    false,
  );

  const q = new Quaternion();
  const up = new Vector3(0, 1, 0);
  const sets = [];
  for (const shape of Object.keys(SHAPES)) {
    const list = palms
      .filter((p) => p.shape === shape)
      .map(({ position, height, yaw = 0, only }) => ({
        only,
        matrix: new Matrix4().compose(
          new Vector3(...position),
          q.setFromAxisAngle(up, yaw).clone(),
          new Vector3(height, height, height),
        ),
      }));
    if (!list.length) continue;
    const mesh = new InstancedMesh(palmGeometry(shape), material, list.length);
    list.forEach(({ matrix }, i) => mesh.setMatrixAt(i, matrix));
    // Bounds cover every palm, whichever breakpoint shows.
    mesh.computeBoundingSphere();
    mesh.boundingSphere.radius += 1;
    mesh.renderOrder = 2;
    const twin = new InstancedMesh(mesh.geometry, depthOnly, list.length);
    twin.instanceMatrix = mesh.instanceMatrix;
    twin.boundingSphere = mesh.boundingSphere;
    twin.renderOrder = 1;
    twin.userData.noProbe = true;
    group.add(twin, mesh);
    sets.push({ meshes: [twin, mesh], list });
  }

  return {
    group,
    material,
    setBreakpoint(breakpoint) {
      for (const { meshes, list } of sets) {
        const shown = list.filter((p) => !p.only || p.only === breakpoint);
        shown.forEach(({ matrix }, i) => meshes[1].setMatrixAt(i, matrix));
        meshes[1].instanceMatrix.needsUpdate = true;
        for (const mesh of meshes) mesh.count = shown.length;
      }
    },
    update(seconds) {
      time.value = seconds;
    },
  };
}
