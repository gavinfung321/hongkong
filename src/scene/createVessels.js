import {
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
} from 'three';
import { breatheLight } from './lightBreath.js';
import { lambert } from './palette.js';
import { strut } from './strut.js';
import {
  ferryCabin,
  ferryDeck,
  ferryDeckRepeat,
  ferryHull,
  ferryUpper,
  junkCloth,
  junkHull,
} from './surfaces.js';
import { vesselPose, vesselRoute } from './vesselRoutes.js';
import { createWake } from './wakes.js';

// Both vessels are built with their bow pointing along local +X.

// A stadium outline (straight sides, round ends) extruded upward, as for a
// double-ended ferry: half-length `straight`, end radius `radius`.
function stadiumSlab(straight, radius, y0, y1, material) {
  const shape = new Shape();
  shape.moveTo(-straight, -radius);
  shape.lineTo(straight, -radius);
  shape.absarc(straight, 0, radius, -Math.PI / 2, Math.PI / 2, false);
  shape.lineTo(-straight, radius);
  shape.absarc(-straight, 0, radius, Math.PI / 2, (Math.PI * 3) / 2, false);
  const geometry = new ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, curveSegments: 10 });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, y0, 0);
  return new Mesh(geometry, material);
}

// A stadium-shaped wall as a box and two half cylinders, so textures wrap
// evenly round the ends. sideFor(length in metres) dresses the walls (endFor
// the round ends, if different); `cap` the tops, bottoms and hidden faces.
function stadiumWall(straight, radius, y0, y1, sideFor, cap, endFor = sideFor) {
  const group = new Group();
  const height = y1 - y0;
  const side = sideFor(straight * 2);
  const box = new Mesh(new BoxGeometry(straight * 2, height, radius * 2), [cap, cap, cap, cap, side, side]);
  box.position.y = y0 + height / 2;
  group.add(box);
  const end = endFor(Math.PI * radius);
  for (const [x, start] of [[straight, 0], [-straight, Math.PI]]) {
    const half = new Mesh(new CylinderGeometry(radius, radius, height, 16, 1, false, start, Math.PI), [end, cap, cap]);
    half.position.set(x, y0 + height / 2, 0);
    group.add(half);
  }
  return group;
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

// A closed stadium outline as [x, z] points, running +X along the +Z side.
function stadiumLoop(straight, radius, steps = 12) {
  const loop = [];
  for (let i = 0; i <= steps; i++) {
    const a = Math.PI / 2 - (Math.PI * i) / steps;
    loop.push([straight + radius * Math.cos(a), radius * Math.sin(a)]);
  }
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 - (Math.PI * i) / steps;
    loop.push([-straight + radius * Math.cos(a), radius * Math.sin(a)]);
  }
  return loop;
}

// Moves a closed outline `d` metres outward (negative: inward).
function offsetLoop(loop, d) {
  const n = loop.length;
  return loop.map(([x, z], i) => {
    const [px, pz] = loop[(i + n - 1) % n];
    const [nx, nz] = loop[(i + 1) % n];
    const length = Math.hypot(nx - px, nz - pz) || 1;
    return [x - ((nz - pz) / length) * d, z + ((nx - px) / length) * d];
  });
}

// An outline at height y (a number, or a function of x).
const lift = (loop, y) => loop.map(([x, z]) => [x, typeof y === 'function' ? y(x) : y, z]);

// Closed bands between pairs of 3D outlines with the same point count; each
// faces outward when the first outline is the lower one. U runs along the
// outline in units of `uScale` metres, V from the first outline (0) to the
// second (1).
function ribbons(pairs, uScale = 1) {
  const positions = [];
  const uvs = [];
  const index = [];
  for (const [lower, upper] of pairs) {
    const base = positions.length / 3;
    const n = lower.length;
    let s = 0;
    for (let i = 0; i <= n; i++) {
      const a = lower[i % n];
      if (i > 0) {
        const p = lower[i - 1];
        s += Math.hypot(a[0] - p[0], a[2] - p[2]);
      }
      positions.push(...a, ...upper[i % n]);
      uvs.push(s / uScale, 0, s / uScale, 1);
    }
    for (let i = 0; i < n; i++) {
      const a = base + i * 2;
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

// ---- Star Ferry -------------------------------------------------------------

// After the Star Ferry's look (original, simplified; details from the user's
// reference photos, no names or emblems): a double-ended green hull with
// flared sides and a sheer rising to both ends, a dark rubbing strip and tyre
// fenders; an open lower deck of green posts over a waist-high bulwark, lit
// inside; a green band, then a white upper deck ringed with life rings, with
// bridge windows at both ends; a roof with liferaft canisters, a funnel and a
// tripod mast at each end; navigation lights.

const FERRY_HALF = 20; // half-length at the sheer
const FERRY_BEAM = 4.75; // half-width at the sheer, midships
const FERRY_SHEER = 1.9; // midships sheer above the waterline
const FERRY_KEEL = -0.9;
const FERRY_FULLNESS = 0.5;
const FERRY_STATIONS = 48;
// Preserve the ferry's warm night identity while keeping the lower deck's
// passengers, seats and posts visible instead of blooming into solid white.
const FERRY_LIGHTING = {
  cabinTint: 0xe0e0e0,
  ceiling: 0.48,
  spill: 140,
};

const ferryD = (x) => Math.min(1, Math.abs(x) / FERRY_HALF);
const ferryHalfWidth = (x) => {
  const d = ferryD(x);
  return d < 0.6 ? FERRY_BEAM : FERRY_BEAM * Math.sqrt(Math.max(0, 1 - ((d - 0.6) / 0.4) ** 2));
};
const ferrySheer = (x) => FERRY_SHEER + 0.6 * ferryD(x) ** 2.5;
const ferryKeel = (x) => FERRY_KEEL + 0.6 * smooth(0.75, 1, ferryD(x));
// Stations bunch toward the round ends.
const ferryStation = (i) => -FERRY_HALF * Math.cos((Math.PI * i) / FERRY_STATIONS);

// A section point from the sheer (a = 0) to the keel (π/2). The ends rake:
// the hull is 5% shorter at the keel than at the sheer.
function ferrySection(x, a, side) {
  const s = ferrySheer(x);
  const k = ferryKeel(x);
  const t = Math.sin(a) ** FERRY_FULLNESS;
  return [x * (1 - 0.05 * t), k + (s - k) * (1 - t), side * ferryHalfWidth(x) * Math.cos(a) ** FERRY_FULLNESS];
}
function ferrySectionAt(x, y) {
  const t = Math.min(1, Math.max(0, (ferrySheer(x) - y) / (ferrySheer(x) - ferryKeel(x))));
  return ferrySection(x, Math.asin(t ** (1 / FERRY_FULLNESS)), 1);
}

function ferryHullGeometry() {
  const HALF = 8;
  const ring = HALF * 2 + 1;
  const positions = [];
  const uvs = [];
  const index = [];
  for (let i = 0; i <= FERRY_STATIONS; i++) {
    const x = ferryStation(i);
    for (let j = 0; j < ring; j++) {
      const c = (j - HALF) / HALF;
      const p = ferrySection(x, (1 - Math.abs(c)) * (Math.PI / 2), Math.sign(c));
      positions.push(...p);
      // The waterline stays level while the paint lines follow the sheer.
      const strake = p[1] > 0 ? (p[1] * FERRY_SHEER) / ferrySheer(x) : p[1];
      uvs.push(p[0] / 10, (strake - FERRY_KEEL) / (FERRY_SHEER - FERRY_KEEL));
    }
  }
  for (let i = 0; i < FERRY_STATIONS; i++) {
    for (let j = 0; j < ring - 1; j++) {
      const a = i * ring + j;
      index.push(a, a + 1, a + ring, a + 1, a + ring + 1, a + ring);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

// Closed outline round the hull: pointAt(x) gives the +Z point [x, z] at
// station x; the other side mirrors it.
function ferryOutline(pointAt) {
  const loop = [];
  for (let i = 0; i <= FERRY_STATIONS; i++) loop.push(pointAt(ferryStation(i)));
  for (let i = FERRY_STATIONS - 1; i > 0; i--) {
    const [x, z] = pointAt(ferryStation(i));
    loop.push([x, -z]);
  }
  return loop;
}

function createFerry() {
  const ferry = new Group();
  ferry.name = 'ferry';
  const m = new Matrix4();

  // Deck lights and cabin spill keep the paint readable at night.
  const paint = (color, extra = {}, glow = 0.22) =>
    new MeshStandardMaterial({ color, emissive: new Color(color).multiplyScalar(glow), roughness: 0.6, ...extra });
  const green = paint(0x2f7a4c);
  const white = paint(0xe9e6dc, {}, 0.45);
  const black = new MeshStandardMaterial({ color: 0x151515, roughness: 0.9 });

  // Hull, a dark rubbing strip along the sheer, and the deck inside.
  const hullMap = ferryHull();
  const hull = new Mesh(
    ferryHullGeometry(),
    new MeshStandardMaterial({ map: hullMap, emissive: 0xffffff, emissiveMap: hullMap, emissiveIntensity: 0.22, roughness: 0.6, side: DoubleSide }),
  );
  const gunwale = ferryOutline((x) => [x, ferryHalfWidth(x)]);
  const stripOut = offsetLoop(gunwale, 0.12);
  const stripIn = offsetLoop(gunwale, -0.08);
  const stripBottom = (x) => ferrySheer(x) - 0.28;
  const strip = new Mesh(
    ribbons([
      [lift(stripOut, stripBottom), lift(stripOut, ferrySheer)],
      [lift(stripOut, ferrySheer), lift(stripIn, ferrySheer)],
      [lift(stripIn, stripBottom), lift(stripOut, stripBottom)],
    ]),
    paint(0x2e231c),
  );
  const floorShape = new Shape(offsetLoop(gunwale, -0.05).map(([x, z]) => new Vector2(x, -z)));
  const floor = new Mesh(new ShapeGeometry(floorShape).rotateX(-Math.PI / 2).translate(0, 1.8, 0), paint(0x3a4038));

  // Open lower deck: a waist-high bulwark with a rail, posts up to the band,
  // and the lit cabin 1.1 m behind them; closed casing amidships.
  const DECK = 12.8; // half-length of the deck's straight sides
  const BULWARK_R = 4.6;
  const bulwarkLoop = stadiumLoop(DECK, BULWARK_R);
  const bulwark = new Mesh(ribbons([[lift(bulwarkLoop, 1.75), lift(bulwarkLoop, 2.95)]]), paint(0x2f7a4c, { side: DoubleSide }));
  const railOut = stadiumLoop(DECK, BULWARK_R + 0.06);
  const railIn = stadiumLoop(DECK, BULWARK_R - 0.2);
  const rail = new Mesh(
    ribbons([
      [lift(railOut, 2.93), lift(railOut, 3.03)],
      [lift(railOut, 3.03), lift(railIn, 3.03)],
      [lift(railIn, 3.03), lift(railIn, 2.93)],
      [lift(railIn, 2.93), lift(railOut, 2.93)],
    ]),
    paint(0x1f5a36),
  );
  const cabinLoop = stadiumLoop(DECK, 3.5);
  const cabin = new Mesh(
    ribbons([[lift(cabinLoop, 1.8), lift(cabinLoop, 4.4)]], 19.2),
    new MeshBasicMaterial({ map: ferryCabin(), color: FERRY_LIGHTING.cabinTint }),
  );

  const POST_R = BULWARK_R - 0.08;
  const postSpots = [];
  for (let k = 0; k <= 10; k++) {
    if (k === 5) continue;
    for (const z of [POST_R, -POST_R]) postSpots.push([-DECK + k * 2.56, z]);
  }
  for (const s of [1, -1]) {
    for (const deg of [-60, -30, 0, 30, 60]) {
      const a = (deg * Math.PI) / 180;
      postSpots.push([s * (DECK + POST_R * Math.cos(a)), POST_R * Math.sin(a)]);
    }
  }
  const posts = new InstancedMesh(new BoxGeometry(0.16, 1.44, 0.16), green, postSpots.length);
  postSpots.forEach(([x, z], i) => posts.setMatrixAt(i, m.makeTranslation(x, 3.65, z)));
  const casing = new InstancedMesh(new BoxGeometry(5.12, 1.44, 0.16), green, 2);
  casing.setMatrixAt(0, m.makeTranslation(0, 3.65, POST_R));
  casing.setMatrixAt(1, m.makeTranslation(0, 3.65, -POST_R));

  // Green band with a lit ceiling under it, the upper deck and the roof.
  const ceiling = new MeshStandardMaterial({
    color: 0xf2e6cc,
    emissive: 0xffd9a0,
    emissiveIntensity: FERRY_LIGHTING.ceiling,
    roughness: 0.8,
  });
  const band = stadiumSlab(DECK, 4.78, 4.35, 4.8, [ceiling, green]);
  // Each round end is six bays; the middle two are the bridge's dark glass.
  const upperMaps = ferryUpper(53);
  const endMaps = ferryUpper(59, [2, 3]);
  const upperDeck = stadiumWall(
    12.6,
    4.5,
    4.8,
    6.9,
    (length) => new MeshStandardMaterial({ ...ferryDeckRepeat(upperMaps, Math.round(length / 2.4)), emissive: 0xffffff, roughness: 0.7 }),
    white,
    () => new MeshStandardMaterial({ ...ferryDeckRepeat(endMaps, 6), emissive: 0xffffff, roughness: 0.7 }),
  );
  const roof = stadiumSlab(12.9, 4.75, 6.9, 7.12, paint(0xdedad0, {}, 0.4));

  // Life rings all round the upper deck, below the windows.
  const ringSpots = [];
  for (let i = 0; i < 16; i++) {
    const x = -12.75 + i * 1.7;
    ringSpots.push([x, 4.6, 0], [x, -4.6, 0]);
  }
  for (const s of [1, -1]) {
    for (const deg of [-73.5, -52.5, -31.5, -10.5, 10.5, 31.5, 52.5, 73.5]) {
      const a = (deg * Math.PI) / 180;
      const [dx, dz] = [s * Math.cos(a), Math.sin(a)];
      ringSpots.push([s * 12.6 + 4.6 * dx, 4.6 * dz, Math.atan2(dx, dz)]);
    }
  }
  const rings = new InstancedMesh(new TorusGeometry(0.3, 0.065, 6, 16), paint(0xffffff, {}, 0.75), ringSpots.length);
  ringSpots.forEach(([x, z, turn], i) => rings.setMatrixAt(i, m.makeRotationY(turn).setPosition(x, 5.3, z)));

  // Tyres hung below the rubbing strip, in pairs and a group of three.
  const tyreXs = [-10.4, -9.6, -0.8, 0, 0.8, 9.6, 10.4];
  const tyres = new InstancedMesh(new TorusGeometry(0.33, 0.12, 6, 12), black, tyreXs.length * 2);
  tyreXs.forEach((x, i) => {
    const y = ferrySheer(x) - 0.8;
    const z = ferryHalfWidth(x) + 0.15;
    tyres.setMatrixAt(i * 2, m.makeTranslation(x, y, z));
    tyres.setMatrixAt(i * 2 + 1, m.makeTranslation(x, y, -z));
  });

  // Roof: a short white funnel with a black top, liferaft canisters along
  // both sides, a tripod mast with a yard at each end.
  const funnel = new Mesh(new CylinderGeometry(0.7, 0.8, 1.35, 16), white);
  funnel.position.y = 7.745;
  const funnelTop = new Mesh(new CylinderGeometry(0.73, 0.73, 0.36, 16), black);
  funnelTop.position.y = 8.3;
  const rafts = [];
  for (const x of [-8.4, -6.6, -4.8, 4.8, 6.6, 8.4]) for (const z of [3.7, -3.7]) rafts.push([x, z]);
  const raftBodies = new InstancedMesh(new CylinderGeometry(0.32, 0.32, 1.5, 12).rotateZ(Math.PI / 2), paint(0xf0eee8), rafts.length);
  const raftBands = new InstancedMesh(new CylinderGeometry(0.36, 0.36, 0.2, 12).rotateZ(Math.PI / 2), paint(0xc8322a), rafts.length * 2);
  rafts.forEach(([x, z], i) => {
    raftBodies.setMatrixAt(i, m.makeTranslation(x, 7.5, z));
    raftBands.setMatrixAt(i * 2, m.makeTranslation(x - 0.5, 7.5, z));
    raftBands.setMatrixAt(i * 2 + 1, m.makeTranslation(x + 0.5, 7.5, z));
  });

  const MAST = 10.6;
  const struts = [];
  const linePoints = [];
  for (const s of [1, -1]) {
    const x0 = s * MAST;
    struts.push([[x0, 7.05, 0], [x0, 13, 0], 0.09], [[x0, 11.6, -1.6], [x0, 11.6, 1.6], 0.05]);
    for (const z of [0.9, -0.9]) struts.push([[x0 - s * 1.8, 7.05, z], [x0, 10.8, 0], 0.07]);
    // Stays to the funnel and the roof end; shrouds from the yard.
    linePoints.push(x0, 12.9, 0, 0, 8.45, 0, x0, 12.9, 0, s * 17.4, 7.12, 0);
    for (const z of [1.6, -1.6]) linePoints.push(x0, 11.6, z, x0 - s * 1.2, 7.12, z * 2.7);
  }
  const masts = new InstancedMesh(new CylinderGeometry(1, 1, 1, 6).translate(0, 0.5, 0), white, struts.length);
  struts.forEach(([a, b, r], i) => masts.setMatrixAt(i, strut(a, b, r)));
  const lineGeometry = new BufferGeometry();
  lineGeometry.setAttribute('position', new Float32BufferAttribute(linePoints, 3));
  const rigging = new LineSegments(lineGeometry, new LineBasicMaterial({ color: 0x8c8a84 }));
  rigging.userData.noProbe = true;

  // Navigation lights: white at each masthead, green to starboard (+Z) and
  // red to port at both ends, as it runs both ways.
  const lamp = new SphereGeometry(0.15, 8, 6);
  const lamps = [];
  for (const s of [1, -1]) {
    for (const [color, y, z] of [[0xfff4dc, 13.15, 0], [0x40ff80, 7.29, 4.4], [0xff3a2e, 7.29, -4.4]]) {
      const light = new Mesh(lamp, new MeshBasicMaterial({ color, toneMapped: false }));
      light.position.set(s * (z ? 12.4 : MAST), y, z);
      lamps.push(light);
    }
  }

  const wake = createWake({
    halfWidthAt: (x) => (Math.abs(x) < FERRY_HALF ? ferrySectionAt(x, 0)[2] : 0),
    span: [-FERRY_HALF, FERRY_HALF],
    // Longer and whiter (user choices, 2026-10-03: the wake barely showed
    // in 02 and 03), its foam glowing faintly so it reads at night. Eased
    // a touch once the foam broke into patches (user request, 2026-10-03).
    trail: 90,
    spread: 0.45,
    speed: 3,
    strength: 1.45,
    glow: 0x464e60,
    seed: 61,
  });

  // Cabin light spilling onto the water around the hull.
  const glow = new PointLight(0xffb36b, FERRY_LIGHTING.spill, 45, 2);
  glow.position.y = 3;
  breatheLight(glow, { period: 6.7, phase: 0.61, amount: 0.04 });

  ferry.add(
    hull,
    strip,
    floor,
    bulwark,
    rail,
    cabin,
    posts,
    casing,
    band,
    upperDeck,
    roof,
    rings,
    tyres,
    funnel,
    funnelTop,
    raftBodies,
    raftBands,
    masts,
    rigging,
    ...lamps,
    wake.mesh,
    glow,
  );
  ferry.userData.wake = wake;
  return ferry;
}

// ---- Junk -------------------------------------------------------------------

// After Victoria Harbour's red-sailed junks (original, simplified; hull
// measured from a side-on photo, sails sized after a closer one): a
// varnished hull narrowing to a raised bow, a high stern with a lit deckhouse
// and square transom, a canopy over the waist, three battened sails uplit
// from the deck, rope fans and tyre fenders.

const JUNK_LENGTH = 28;
const JUNK_SHEER = 2.9; // midships deck edge above the waterline
const JUNK_HULL_BOTTOM = -1.2; // lowest point of the hull texture
const BULWARK = 0.5; // deck below the sheer

// Hull lines along u, from the transom (0) to the bow (1).
const junkX = (u) => (u - 0.5) * JUNK_LENGTH;
const junkU = (x) => x / JUNK_LENGTH + 0.5;
const junkHalfWidth = (u) => 3.5 * (1 - 0.22 * (1 - smooth(0, 0.3, u))) * (1 - 0.88 * smooth(0.5, 1, u) ** 1.4);
const junkSheer = (u) =>
  u < 0.45 ? JUNK_SHEER + 2.7 * (1 - u / 0.45) ** 2 : JUNK_SHEER + 2.1 * ((u - 0.45) / 0.55) ** 2.2;
const junkKeel = (u) => (u < 0.3 ? -1 + 1.4 * (1 - u / 0.3) ** 2 : u > 0.75 ? -1 + 2.4 * ((u - 0.75) / 0.25) ** 2 : -1);
const deckAt = (x) => junkSheer(junkU(x)) - BULWARK;

// A section is a superellipse quarter each side, full in the bilge.
const FULLNESS = 2 / 3;
function sectionPoint(u, a, side) {
  const hw = junkHalfWidth(u);
  const s = junkSheer(u);
  const k = junkKeel(u);
  return [side * hw * Math.cos(a) ** FULLNESS, k + (s - k) * (1 - Math.sin(a) ** FULLNESS)];
}
// Half-width of the hull `drop` metres under the sheer.
function halfWidthBelowSheer(u, drop) {
  const a = Math.asin(Math.min(1, (drop / (junkSheer(u) - junkKeel(u))) ** (1 / FULLNESS)));
  return sectionPoint(u, a, 1)[0];
}

// Texture V: the waterline stays level while the strakes above it bend
// with the sheer, so the rail cap runs along the deck edge.
function hullV(u, y) {
  const strake = y > 0 ? (y * JUNK_SHEER) / junkSheer(u) : y;
  return (strake - JUNK_HULL_BOTTOM) / (JUNK_SHEER - JUNK_HULL_BOTTOM);
}

function junkHullGeometry() {
  const STATIONS = 40;
  const HALF = 8; // points from sheer to keel on each side
  const ring = HALF * 2 + 1;
  const positions = [];
  const uvs = [];
  const index = [];
  for (let i = 0; i <= STATIONS; i++) {
    const u = i / STATIONS;
    const x = junkX(u);
    for (let j = 0; j < ring; j++) {
      const c = (j - HALF) / HALF;
      const [z, y] = sectionPoint(u, (1 - Math.abs(c)) * (Math.PI / 2), Math.sign(c));
      positions.push(x, y, z);
      uvs.push(x / 8, hullV(u, y));
    }
  }
  for (let i = 0; i < STATIONS; i++) {
    for (let j = 0; j < ring - 1; j++) {
      const a = i * ring + j;
      index.push(a, a + 1, a + ring, a + 1, a + ring + 1, a + ring);
    }
  }
  // Transom and bow: fans from the middle of each end section.
  for (const i of [0, STATIONS]) {
    const u = i / STATIONS;
    const centre = positions.length / 3;
    const y = (junkSheer(u) + junkKeel(u)) / 2;
    positions.push(junkX(u), y, 0);
    uvs.push(junkX(u) / 8, hullV(u, y));
    for (let j = 0; j < ring - 1; j++) index.push(centre, i * ring + j, i * ring + j + 1);
    index.push(centre, i * ring + ring - 1, i * ring);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

// A strip following the hull lines from u0 to u1: `edge(u)` gives
// [halfWidth, y] for each side.
function hullStrip(u0, u1, edge, thickness = 0) {
  const positions = [];
  const index = [];
  const steps = 32;
  for (let i = 0; i <= steps; i++) {
    const u = lerp(u0, u1, i / steps);
    const [hw, y] = edge(u);
    if (thickness) positions.push(junkX(u), y, hw, junkX(u), y + thickness, hw, junkX(u), y, -hw, junkX(u), y + thickness, -hw);
    else positions.push(junkX(u), y, hw, junkX(u), y, -hw);
  }
  const per = thickness ? 4 : 2;
  for (let i = 0; i < steps; i++) {
    const a = i * per;
    const b = a + per;
    index.push(a, b, a + 1, a + 1, b, b + 1);
    if (thickness) index.push(a + 2, a + 3, b + 2, a + 3, b + 3, b + 2);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

// A battened junk sail in mast coordinates (mast at x 0, foot at y 0, bow
// +X): a tall luff leaning back, a yard climbing steeply aft to a pointed
// peak just behind the mast, a leech that sweeps out below the peak and is
// widest low down, scalloped between the batten ends, and cloth bellying
// between battens. Uplit from the deck: vertex colours brightest at the foot
// and darkening toward the head, each panel darker just under the batten
// above and fuller in its belly than at the luff and leech (user choice,
// 2026-10-03: the sails read as one flat colour).
function junkSail(w, h, panels) {
  const tack = [0.26 * w, 0];
  const throat = [0.15 * w, 0.75 * h];
  const clew = [-0.7 * w, 0];
  const bend = [-0.9 * w, 0.6 * h];
  const peak = [-0.25 * w, h];
  const luff = (t) => [lerp(tack[0], throat[0], t), lerp(tack[1], throat[1], t)];
  const leech = (t) => {
    const [a, b, c] = [(1 - t) ** 2, 2 * (1 - t) * t, t * t];
    return [a * clew[0] + b * bend[0] + c * peak[0], a * clew[1] + b * bend[1] + c * peak[1]];
  };

  const SUB = 4;
  const COLS = 8;
  const rows = panels * SUB;
  const positions = [];
  const uvs = [];
  const colors = [];
  const index = [];
  for (let r = 0; r <= rows; r++) {
    const t = r / rows;
    const pocket = (r % SUB) / SUB;
    const [lx, ly] = luff(t);
    const [rx, ry] = leech(t);
    const scallop = 0.05 * w * Math.sin(Math.PI * pocket);
    const light = (0.32 + 0.73 * (1 - t) ** 1.6) * (1 - 0.42 * pocket);
    for (let c = 0; c <= COLS; c++) {
      const s = c / COLS;
      const belly = 0.78 + 0.22 * Math.sin(Math.PI * s) * Math.sin(Math.PI * Math.max(pocket, 0.25));
      positions.push(
        lerp(lx, rx + scallop, s),
        lerp(ly, ry, s),
        0.07 * w * Math.sin(Math.PI * s) * Math.sin(Math.PI * pocket),
      );
      uvs.push(s, t);
      colors.push(light * belly, light * belly, light * belly);
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < COLS; c++) {
      const a = r * (COLS + 1) + c;
      const b = a + COLS + 1;
      index.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.setIndex(index);

  // Battens and the boom overhang both edges; the yard stops at the peak so
  // the tip stays sharp. A sheet runs from each batten end to one block
  // under the boom.
  const battens = [];
  const sheets = [];
  const block = [-0.8 * w, -1.4];
  for (let p = 0; p <= panels; p++) {
    const t = p / panels;
    const [lx, ly] = luff(t);
    const [rx, ry] = leech(t);
    battens.push([lx + 0.04 * w, ly, rx - (p < panels ? 0.06 * w : 0), ry]);
    if (p < panels) sheets.push([rx - 0.06 * w, ry, ...block]);
  }
  return { geometry, battens, sheets, block };
}

function createJunk() {
  const junk = new Group();
  junk.name = 'junk';
  const wood = lambert(0x3a2416);

  // Lit by its own deck lights at night: a faint glow of the varnish, kept
  // low so the hull reads dark under the sails (user choice, 2026-10-03;
  // was 0.18).
  const hullMap = junkHull();
  const hull = new Mesh(
    junkHullGeometry(),
    new MeshStandardMaterial({ map: hullMap, emissive: 0xffffff, emissiveMap: hullMap, emissiveIntensity: 0.09, roughness: 0.55, side: DoubleSide }),
  );
  const deck = new Mesh(
    hullStrip(0, 1, (u) => [halfWidthBelowSheer(u, BULWARK), junkSheer(u) - BULWARK]),
    new MeshStandardMaterial({ color: 0x7a5434, emissive: 0x1e120a, roughness: 0.9, side: DoubleSide }),
  );
  // Rail along both sides, 0.85 m above the deck edge.
  const rail = new Mesh(
    hullStrip(0.03, 0.97, (u) => [junkHalfWidth(u) - 0.05, junkSheer(u) + 0.85], 0.08),
    new MeshStandardMaterial({ color: 0x3a2416, roughness: 0.8, side: DoubleSide }),
  );

  // Stern deckhouse with lit windows, roofed; a canopy over the waist on posts.
  const cabinMaps = ferryDeck('#4a2c18', 61);
  const cabinWall = (length) =>
    new MeshStandardMaterial({ ...ferryDeckRepeat(cabinMaps, Math.max(1, Math.round(length / 2.4))), emissive: 0xffffff, roughness: 0.7 });
  const roofMaterial = new MeshStandardMaterial({ color: 0xe6d8bb, emissive: 0x2a2418, roughness: 0.9 });
  const [house0, house1] = [-12.4, -7.2];
  const houseLength = house1 - house0;
  const house = new Mesh(new BoxGeometry(houseLength, 3.4, 4.4), [
    cabinWall(4.4),
    cabinWall(4.4),
    wood,
    wood,
    cabinWall(houseLength),
    cabinWall(houseLength),
  ]);
  house.position.set((house0 + house1) / 2, 4.6, 0);
  // Roofs overlap the boxes they sit on, so no faces are coplanar.
  const houseRoof = new Mesh(new BoxGeometry(houseLength + 0.6, 0.2, 5), roofMaterial);
  houseRoof.position.set(house.position.x, 6.35, 0);
  const [canopy0, canopy1] = [house1 - 0.2, 1.6];
  const canopyY = 4.8;
  const canopy = new Mesh(new BoxGeometry(canopy1 - canopy0, 0.15, 6), roofMaterial);
  canopy.position.set((canopy0 + canopy1) / 2, canopyY, 0);

  const postMatrices = [];
  const m = new Matrix4();
  for (let x = -5.6; x <= canopy1; x += 2.2) {
    const bottom = deckAt(x) - 0.1;
    for (const z of [2.9, -2.9]) postMatrices.push(new Matrix4().makeScale(0.12, canopyY - bottom, 0.12).setPosition(x, (canopyY + bottom) / 2, z));
  }
  for (let u = 0.06; u < 0.95; u += 0.05) {
    const y0 = junkSheer(u);
    for (const side of [1, -1]) {
      postMatrices.push(new Matrix4().makeScale(0.08, 0.9, 0.08).setPosition(junkX(u), y0 + 0.45, side * (junkHalfWidth(u) - 0.05)));
    }
  }
  const posts = new InstancedMesh(new BoxGeometry(1, 1, 1), wood, postMatrices.length);
  postMatrices.forEach((matrix, i) => posts.setMatrixAt(i, matrix));

  // Tyres hung along both sides as fenders, as on the harbour junks.
  const tyreXs = [-6, -3, 0, 3, 6];
  const tyres = new InstancedMesh(new TorusGeometry(0.34, 0.12, 6, 12), lambert(0x151313), tyreXs.length * 2);
  tyreXs.forEach((x, i) => {
    const u = junkU(x);
    const y = junkSheer(u) - 0.9;
    const hw = halfWidthBelowSheer(u, 0.9);
    for (const [k, side] of [[0, 1], [1, -1]]) tyres.setMatrixAt(i * 2 + k, m.makeTranslation(x, y, side * (hw + 0.1)));
  });

  // Mostly under water; only its head shows below the transom.
  const rudder = new Mesh(new BoxGeometry(1.3, 2.4, 0.2), wood);
  rudder.position.set(junkX(0) - 0.45, -0.45, 0);

  // [mastX, mastZ, rake (forward +), sailWidth, sailHeight, sailFoot, panels]
  // Big sails, as on the harbour junks (user request): the main is about
  // half the hull length tall. The foresail overlaps the main, so it hangs
  // 0.9 m to one side and the cloths never meet. Each mast ends just above
  // its sail's peak.
  const MASTHEAD = 0.6;
  const rig = [
    [10.6, 0.9, 0.14, 8, 10, 5.4, 6],
    [4, 0, 0, 12, 15, 5.6, 7],
    [-11.2, -0.8, -0.04, 4.2, 5.6, 7, 5],
  ];
  const masts = new InstancedMesh(new CylinderGeometry(0.12, 0.17, 1, 6).translate(0, 0.5, 0), lambert(0x2a1a12), rig.length);
  const sailGeometries = [];
  const linePoints = [];
  const lineColors = [];
  const BAMBOO = [0.85, 0.69, 0.48];
  const ROPE = [0.16, 0.1, 0.07];
  const point = new Vector3();
  const line = (a, b, color, frame) => {
    for (const p of [a, b]) {
      point.set(...p).applyMatrix4(frame);
      linePoints.push(point.x, point.y, point.z);
      lineColors.push(...color);
    }
  };
  const mastheads = [];

  rig.forEach(([mx, mz, rake, w, h, foot, panels], i) => {
    const deckY = deckAt(mx);
    const lift = foot - deckY;
    const length = lift + h + MASTHEAD;
    const frame = new Matrix4().makeRotationZ(-rake).setPosition(mx, deckY, mz);
    masts.setMatrixAt(i, new Matrix4().multiplyMatrices(frame, new Matrix4().makeScale(1, length, 1)));

    const sail = junkSail(w, h, panels);
    sailGeometries.push(sail.geometry.translate(0, lift, 0).applyMatrix4(frame));
    for (const [x0, y0, x1, y1] of sail.battens) {
      for (const z of [0.05, -0.05]) line([x0, y0 + lift, z], [x1, y1 + lift, z], BAMBOO, frame);
    }
    for (const [x0, y0, x1, y1] of sail.sheets) line([x0, y0 + lift, 0], [x1, y1 + lift, 0], ROPE, frame);
    const [bx, by] = sail.block;
    line([bx, by + lift, 0], [bx, 0, 0], ROPE, frame);
    // Shrouds from the masthead down to both rails.
    const hw = junkHalfWidth(junkU(mx)) - 0.1;
    for (const side of [1, -1]) line([0, length, 0], [-0.6, 0, side * hw - mz], ROPE, frame);
    mastheads.push(new Vector3(0, length, 0).applyMatrix4(frame));
  });
  // Forestay from the foremast head to the bow.
  linePoints.push(...mastheads[0].toArray(), junkX(1), junkSheer(1), 0);
  lineColors.push(...ROPE, ...ROPE);

  // One mesh per sail keeps each bounding box tight for the composition probe.
  const sailMaterial = new MeshBasicMaterial({ map: junkCloth(), vertexColors: true, side: DoubleSide });
  const sails = sailGeometries.map((geometry) => new Mesh(geometry, sailMaterial));
  const lineGeometry = new BufferGeometry();
  lineGeometry.setAttribute('position', new Float32BufferAttribute(linePoints, 3));
  lineGeometry.setAttribute('color', new Float32BufferAttribute(lineColors, 3));
  const rigging = new LineSegments(lineGeometry, new LineBasicMaterial({ vertexColors: true }));
  // The rigging stays inside the sails and hull; its box would span the boat.
  rigging.userData.noProbe = true;

  // Deck lights shining up into the sails; low and red, so the glassy water
  // draws red streaks under the junk the way the rim light draws the moon path.
  const sailLight = new PointLight(0xff6a3c, 180, 50, 2);
  sailLight.position.set(4.5, 6, 0);
  breatheLight(sailLight, { period: 9.4, phase: 0.38, amount: 0.03 });

  // The junk sails slower than the ferry: a shorter, narrower wake, its foam
  // glowing faintly so it reads at night (user choice, 2026-10-03: it
  // barely showed; was 32 m at 0.9).
  const wake = createWake({
    halfWidthAt: (x) => {
      const u = junkU(x);
      return u <= 0 || u >= 1 || junkKeel(u) >= 0 ? 0 : halfWidthBelowSheer(u, junkSheer(u));
    },
    span: [-JUNK_LENGTH / 2, JUNK_LENGTH / 2],
    trail: 45,
    speed: 1.8,
    strength: 1.15,
    glow: 0x3a4252,
    seed: 67,
  });

  junk.add(hull, deck, rail, house, houseRoof, canopy, posts, tyres, rudder, masts, ...sails, rigging, sailLight, wake.mesh);
  junk.userData.wake = wake;
  return junk;
}

// Riding the swell, each as [amplitude, angular speed (rad/s)] pairs summed
// with the vessel's phase, so the motion never repeats exactly. heave in
// metres; roll (about the keel, local X) and pitch (local Z) in radians.
// The ferry (user request, 2026-10-03): a visible bob and a very small roll,
// at most about 0.2 m and 0.9°. The junk keeps its first, gentler motion.
const SWELL = {
  ferry: { phase: 0, heave: [[0.15, 0.8], [0.06, 1.7]], roll: [[0.011, 0.55], [0.004, 1.3]], pitch: [[0.004, 0.65]] },
  junk: { phase: 1.7, heave: [[0.12, 0.9]], roll: [[0.0105, 0.7]], pitch: [[0.007, 0.6]] },
};

const swing = (waves, time, phase) =>
  waves.reduce((sum, [amplitude, speed], i) => sum + amplitude * Math.sin(time * speed + phase + i * 2.1), 0);

export function createVessels({ hold }) {
  const group = new Group();
  const ferry = createFerry();
  const junk = createJunk();
  ferry.rotation.order = 'YXZ';
  junk.rotation.order = 'YXZ';
  group.add(ferry, junk);

  const vessels = [
    { key: 'ferry', object: ferry, route: null, swell: SWELL.ferry },
    { key: 'junk', object: junk, route: null, swell: SWELL.junk },
  ];

  function setPaths(chapters, breakpoint) {
    for (const vessel of vessels) vessel.route = vesselRoute(chapters, breakpoint, vessel.key);
  }

  const pose = { position: new Vector3(), heading: 0 };
  function update(segment, time, animate) {
    for (const { object, route, swell } of vessels) {
      vesselPose(route, segment, hold, pose);
      object.position.copy(pose.position);
      object.rotation.y = pose.heading;
      if (animate) {
        object.position.y = swing(swell.heave, time, swell.phase);
        object.rotation.x = swing(swell.roll, time, swell.phase);
        object.rotation.z = swing(swell.pitch, time, swell.phase + 1);
      } else {
        object.position.y = 0;
        object.rotation.x = 0;
        object.rotation.z = 0;
      }
      object.userData.wake.update(object, time, animate);
    }
  }

  return { group, ferry, junk, setPaths, update };
}
