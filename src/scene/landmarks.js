import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Points,
  RepeatWrapping,
  SRGBColorSpace,
  ShaderMaterial,
  Shape,
  Vector2,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { braceWall, curtainWall, facadeMaterial, facadeUVs, neonLines } from './facades.js';
import { prism } from './prism.js';
import { WORLD } from '../data/world.js';

// Four Central landmarks built in code (user choice, 2026-10-02): Bank of
// China Tower, Cheung Kong Center, Central Plaza and The Center, each with
// its own painted skin (`facades.js`). Lit well below IFC, so IFC still
// leads; their glow follows the `city` level.
// Every line pattern is a mip-mapped texture, so it fades with distance
// instead of shimmering.

const unitBox = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);

function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// A plan polygon from [x, z] points (shape y is −z once stood up).
function plan(points) {
  return new Shape(points.map(([x, z]) => new Vector2(x, -z)));
}

// Regular polygon of `sides` with circumradius r, its corners cut back by
// `cut` of each edge. `start` is the first corner's angle (0 = +x).
function chamfered(sides, r, cut, start) {
  const corners = [];
  for (let i = 0; i < sides; i++) {
    const a = start + (i / sides) * Math.PI * 2;
    corners.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  const points = [];
  corners.forEach((c, i) => {
    const prev = corners[(i + sides - 1) % sides];
    const next = corners[(i + 1) % sides];
    points.push([c[0] + (prev[0] - c[0]) * cut, c[1] + (prev[1] - c[1]) * cut]);
    points.push([c[0] + (next[0] - c[0]) * cut, c[1] + (next[1] - c[1]) * cut]);
  });
  return points;
}

// ---- Bank of China Tower ------------------------------------------------------

// Four triangular shafts round a square, each stopping at its own height
// under a roof cut at 45°, so each face ends on one of its diagonals. UVs
// are in facade modules, one module per side × side.
function bocGeometry(side, modules) {
  const h = side / 2;
  const corners = [[h, h], [-h, h], [-h, -h], [h, -h]];
  const position = [];
  const uv = [];
  const a = new Vector3();
  const b = new Vector3();
  const n = new Vector3();
  const tri = (p, q, r, tp, tq, tr, outward) => {
    a.subVectors(q, p);
    b.subVectors(r, p);
    n.crossVectors(a, b);
    if (n.dot(outward) < 0) [q, r, tq, tr] = [r, q, tr, tq];
    position.push(p.x, p.y, p.z, q.x, q.y, q.z, r.x, r.y, r.z);
    uv.push(...tp, ...tq, ...tr);
  };
  modules.forEach((count, k) => {
    const top = count * side;
    const [ax, az] = corners[k];
    const [bx, bz] = corners[(k + 1) % 4];
    const A0 = new Vector3(ax, 0, az);
    const B0 = new Vector3(bx, 0, bz);
    const C0 = new Vector3(0, 0, 0);
    const At = new Vector3(ax, top - side, az);
    const Bt = new Vector3(bx, top, bz);
    const Ct = new Vector3(0, top, 0);
    const middle = new Vector3((ax + bx) / 3, top / 2, (az + bz) / 3);
    const out = (...ps) => ps.reduce((s, p) => s.add(p), new Vector3()).divideScalar(ps.length).sub(middle);
    const m = (y) => y / side;
    // Outer facade, A → B.
    const o = out(A0, B0, Bt, At);
    tri(A0, B0, Bt, [0, 0], [1, 0], [1, m(top)], o);
    tri(A0, Bt, At, [0, 0], [1, m(top)], [0, m(top - side)], o);
    // Inner faces toward the core, seen where a neighbour stops lower.
    const d = h * Math.SQRT2 / side;
    for (const [P0, Pt] of [[A0, At], [B0, Bt]]) {
      const f = out(C0, P0, Pt, Ct);
      tri(C0, P0, Pt, [0, 0], [d, 0], [d, m(Pt.y)], f);
      tri(C0, Pt, Ct, [0, 0], [d, m(Pt.y)], [0, m(top)], f);
    }
    // The roof samples a dark spot between the braces.
    tri(At, Bt, Ct, [0.5, 0.2], [0.5, 0.2], [0.5, 0.2], new Vector3(0, 1, 0));
  });
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(position, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  geometry.computeVertexNormals();
  return geometry;
}

const BOC_GLOW = 0.6;

// Painted skin (user choice, 2026-10-02): glass facets, offices and lit braces.
function createBOC({ position, side, modules, mastTip }) {
  const material = facadeMaterial(braceWall({ modules: Math.max(...modules), seed: 917 }), BOC_GLOW);
  const tower = new Mesh(bocGeometry(side, modules), material);
  tower.position.set(...position);
  tower.name = 'boc';
  // Twin masts on the top shaft's ridge (corner B of the last quarter to the core).
  const top = Math.max(...modules) * side;
  const k = modules.indexOf(Math.max(...modules));
  const corner = [[1, 1], [-1, 1], [-1, -1], [1, -1]][(k + 1) % 4].map((s) => (s * side) / 2);
  const masts = [0.25, 0.6].map((t) => [position[0] + corner[0] * t, position[1] + top, position[2] + corner[1] * t]);
  return {
    mesh: tower,
    glow: [[material, BOC_GLOW]],
    masts: masts.map((p) => [p, mastTip - top, 2]),
  };
}

// ---- Cheung Kong Center ---------------------------------------------------------

// A plain square box whose whole glass skin glows an even cool white at
// night, behind a silver grid, with a brighter crown band.
const CHEUNG_KONG_GLOW = 0.4;

function createCheungKong({ position, side, height }) {
  const group = new Group();
  group.name = 'cheungKong';
  const half = side / 2;
  const square = (s) => plan([[s, s], [-s, s], [-s, -s], [s, -s]]);
  const skin = curtainWall({
    bays: 32,
    floors: 72,
    bay: 3,
    floor: 4,
    lit: 1,
    coolShare: 1,
    level: [0.85, 1],
    rooms: false,
    colours: { slab: '#5a6274', slabEdge: '#646d80', glass: '#384052', mullion: '#9aa4b8' },
    seed: 283,
  });
  const body = new Mesh(facadeUVs(prism(square(half), 0, height)), facadeMaterial(skin, CHEUNG_KONG_GLOW));
  // 1.5 m proud of the glass, clear of its depth at 1.4 km.
  const crownMaterial = new MeshBasicMaterial({ color: 0x8fa0bc });
  const crown = new Mesh(prism(square(half + 1.5), height - 8, height), crownMaterial);
  group.add(body, crown);
  group.position.set(...position);
  return {
    mesh: group,
    glow: [[body.material, CHEUNG_KONG_GLOW]],
    basics: [[crownMaterial, new Color(0x8fa0bc)]],
    beacons: [[position[0] + half - 2, position[1] + height + 1, position[2] + half - 2], [position[0] - half + 2, position[1] + height + 1, position[2] + half - 2]],
  };
}

// ---- Central Plaza ----------------------------------------------------------------

// Four colour bars, the "light clock" band near the top.
function barTexture() {
  return canvasTexture(4, 128, (ctx) => {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 4; i++) ctx.fillRect(0, 10 + i * 30, 4, 14);
  });
}

// A chamfered triangle, one face to the harbour, under a lit crown band, a
// glass pyramid and a mast.
const PLAZA_GLOW = 0.6;

function createCentralPlaza({ position, radius, height, pyramid, mastTip }) {
  const group = new Group();
  group.name = 'centralPlaza';
  const corners = (r) => chamfered(3, r, 0.12, -Math.PI / 2);
  // Gold-tinted glass and bronze cladding, mostly warm offices.
  const skin = curtainWall({
    bays: 32,
    floors: 80,
    bay: 3,
    floor: 4,
    lit: 0.4,
    coolShare: 0.1,
    colours: { slab: '#5c5040', slabEdge: '#6a5c48', glass: '#2e2a28', mullion: '#a08c62' },
    seed: 374,
  });
  const body = new Mesh(facadeUVs(prism(plan(corners(radius)), 0, height)), facadeMaterial(skin, PLAZA_GLOW));
  // The band stands 1.5 m out from the glass (inradius is half the circumradius).
  const bars = barTexture();
  bars.repeat.set(1, 1 / 30);
  const bandMaterial = new MeshBasicMaterial({ color: 0xffffff, map: bars });
  const band = new Mesh(prism(plan(corners(radius + 3)), height - 30, height), bandMaterial);
  const pyramidMaterial = new MeshLambertMaterial({ color: 0x8a7c5c, emissive: 0x4a3c20 });
  const cap = new Mesh(
    new ConeGeometry(radius * 0.75, pyramid, 3).rotateY(Math.PI).translate(0, height + pyramid / 2, 0),
    pyramidMaterial,
  );
  group.add(body, band, cap);
  group.position.set(...position);
  const top = height + pyramid;
  return {
    mesh: group,
    glow: [[pyramidMaterial, 1], [body.material, PLAZA_GLOW]],
    bands: [bandMaterial],
    masts: [[[position[0], position[1] + top - 4, position[2]], mastTip - top + 4, 2]],
  };
}

// ---- The Center --------------------------------------------------------------------

// A chamfered square shaft of dark glass with a stepped crown and a spire,
// ringed by colour-changing neon lines every two floors.
const CENTER = { glow: 0.5, floors: 80, linesEvery: 2, duty: 0.2, neon: 0.5 }; // neon 0.5, was 0.8 (Priority E, 2026-10-04)

function createCenter({ position, half, height, crown, spireTip }) {
  const corners = (r) => chamfered(4, r * Math.SQRT2, 0.16, Math.PI / 4);
  const parts = [prism(plan(corners(half)), 0, height)];
  let y = height;
  for (const [rise, size] of crown) {
    parts.push(prism(plan(corners(size)), y, y + rise));
    y += rise;
  }
  const skin = curtainWall({
    bays: 24,
    floors: CENTER.floors,
    bay: 3,
    floor: 4,
    lit: 0.15,
    coolShare: 0.5,
    colours: { slab: '#323848', slabEdge: '#3a4152', glass: '#1e2432', mullion: '#4c5468' },
    seed: 346,
  });
  const neon = new Color();
  const material = facadeMaterial(skin, CENTER.glow, {
    neon: { map: neonLines(CENTER.duty), color: neon, repeat: CENTER.floors / CENTER.linesEvery },
  });
  const mesh = new Mesh(facadeUVs(mergeGeometries(parts)), material);
  mesh.position.set(...position);
  mesh.name = 'center';
  return {
    mesh,
    glow: [[material, CENTER.glow]],
    hue: neon,
    masts: [[[position[0], position[1] + y - 2, position[2]], spireTip - y + 2, 2.5]],
  };
}

// ---- Masts and aviation lights -----------------------------------------------------

// Dark and low-contrast: they are only a pixel or two wide, and a bright one
// would crawl as the camera moves.
export function mastMesh(masts) {
  const geometry = mergeGeometries(
    masts.map(([[x, y, z], height, width]) => unitBox.clone().scale(width, height, width).translate(x, y, z)),
  );
  const mesh = new Mesh(geometry, new MeshLambertMaterial({ color: 0x40434f, emissive: 0x15161c }));
  mesh.name = 'masts';
  return mesh;
}

const BEACON = { size: 2.6, color: 0xff3a2a, period: 3.2, low: 0.45 };

// Red warning lights: dots of a fixed pixel size, depth-tested so nearer
// towers hide them, pulsing slowly in continuous mode only.
export function createBeacons(positions) {
  const phase = positions.map((_, i) => (i * 0.618) % 1);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions.flat(), 3));
  geometry.setAttribute('phase', new Float32BufferAttribute(phase, 1));
  const material = new ShaderMaterial({
    uniforms: { uSize: { value: BEACON.size }, uTime: { value: 0 }, uColor: { value: new Color(BEACON.color) } },
    vertexShader: `
      uniform float uSize;
      uniform float uTime;
      attribute float phase;
      varying float vPulse;
      void main() {
        float wave = 0.5 + 0.5 * sin( 6.2832 * ( uTime / ${BEACON.period.toFixed(1)} + phase ) );
        vPulse = mix( ${BEACON.low.toFixed(2)}, 1.0, wave );
        gl_PointSize = uSize;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vPulse;
      void main() {
        float d = length( gl_PointCoord - 0.5 ) * 2.0;
        gl_FragColor = vec4( uColor * vPulse * smoothstep( 1.0, 0.2, d ), 1.0 );
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const points = new Points(geometry, material);
  points.name = 'beacons';
  points.userData.noProbe = true;
  points.onBeforeRender = (renderer) => {
    material.uniforms.uSize.value = BEACON.size * renderer.getPixelRatio();
  };
  return {
    points,
    update(time) {
      material.uniforms.uTime.value = time;
    },
  };
}

// ---- All four ------------------------------------------------------------------------

// Colour cycles: seconds per turn of the hue wheel, saturation, lightness.
// Saturation 0.35 / 0.3 (was 0.6 / 0.55) and the plaza's bars at
// `PLAZA_BANDS` (atmospheric depth Priority E, user choice, 2026-10-04): the
// supporting towers' neon is muted so the landmarks' own colours lead.
const CYCLE = { plaza: [90, 0.35, 0.55], center: [60, 0.3, 0.6] };
const PLAZA_BANDS = 0.7;

export function createLandmarks() {
  const { boc, cheungKong, centralPlaza, center } = WORLD.landmarks;
  const built = [createBOC(boc), createCheungKong(cheungKong), createCentralPlaza(centralPlaza), createCenter(center)];
  const group = new Group();
  group.name = 'landmarks';
  for (const { mesh } of built) group.add(mesh);
  const masts = built.flatMap((b) => b.masts ?? []);
  const beacons = [
    ...masts.map(([[x, y, z], height]) => [x, y + height + 1, z]),
    ...built.flatMap((b) => b.beacons ?? []),
  ];

  const glow = built.flatMap((b) => b.glow ?? []);
  const basics = built.flatMap((b) => b.basics ?? []);
  const bands = built.flatMap((b) => b.bands ?? []);
  const hue = built.find((b) => b.hue).hue;
  const plaza = new Color();
  const tower = new Color();
  let level = 1;

  function apply() {
    for (const material of bands) material.color.copy(plaza).multiplyScalar(PLAZA_BANDS * level);
    hue.copy(tower).multiplyScalar(CENTER.neon * level);
  }

  // Central Plaza's bars and The Center's lines drift slowly through the
  // colours, a little out of step with each other.
  function paint(time) {
    const [plazaPeriod, plazaS, plazaL] = CYCLE.plaza;
    const [towerPeriod, towerS, towerL] = CYCLE.center;
    plaza.setHSL((time / plazaPeriod) % 1, plazaS, plazaL);
    tower.setHSL((time / towerPeriod + 0.4) % 1, towerS, towerL);
    apply();
  }
  paint(0);

  function setLevel(value) {
    level = value;
    for (const [material, base] of glow) material.emissiveIntensity = base * value;
    for (const [material, base] of basics) material.color.copy(base).multiplyScalar(value);
    apply();
  }

  return { group, masts, beacons, setLevel, update: paint };
}
