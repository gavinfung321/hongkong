import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
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
  TorusGeometry,
  Vector3,
} from 'three';
import { lambert } from './palette.js';
import { ferryDeck, ferryDeckRepeat, ferryHull, junkCloth, junkHull, waterlineFoam } from './surfaces.js';

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
// evenly round the ends. sideFor(length in metres) dresses the walls; `cap`
// the tops, bottoms and hidden faces.
function stadiumWall(straight, radius, y0, y1, sideFor, cap) {
  const group = new Group();
  const height = y1 - y0;
  const side = sideFor(straight * 2);
  const box = new Mesh(new BoxGeometry(straight * 2, height, radius * 2), [cap, cap, cap, cap, side, side]);
  box.position.y = y0 + height / 2;
  group.add(box);
  const end = sideFor(Math.PI * radius);
  for (const [x, start] of [[straight, 0], [-straight, Math.PI]]) {
    const half = new Mesh(new CylinderGeometry(radius, radius, height, 16, 1, false, start, Math.PI), [end, cap, cap]);
    half.position.set(x, y0 + height / 2, 0);
    group.add(half);
  }
  return group;
}

// After the Star Ferry's look (original, simplified): a low green hull with a
// dark fender, a green lower deck and a white upper deck with big lit
// windows, a white band between them, a canopy roof, a wheelhouse at each end
// (it runs both ways) and a white funnel.
function createFerry() {
  const ferry = new Group();
  ferry.name = 'ferry';

  const white = new MeshStandardMaterial({ color: 0xe6e1d4, roughness: 0.6 });
  const green = new MeshStandardMaterial({ color: 0x2d5a40, roughness: 0.6 });
  const dark = new MeshStandardMaterial({ color: 0x241c17, roughness: 0.9 });

  // 2.4 m window bays.
  const windowsFor = (maps) => (length) =>
    new MeshStandardMaterial({ ...ferryDeckRepeat(maps, Math.round(length / 2.4)), emissive: 0xffffff, roughness: 0.7 });

  const hull = stadiumSlab(15, 4.6, -0.8, 1.8, new MeshStandardMaterial({ map: ferryHull(), roughness: 0.6 }));
  const fender = stadiumSlab(15, 4.95, 1.8, 2.25, dark);
  const lowerDeck = stadiumWall(12.7, 4.3, 2.25, 5.05, windowsFor(ferryDeck('#2d5a40', 51)), green);
  const band = stadiumSlab(12.9, 4.55, 5.05, 5.5, white);
  const upperDeck = stadiumWall(12.1, 4.1, 5.5, 7.9, windowsFor(ferryDeck('#e6e1d4', 53)), white);
  const roof = stadiumSlab(12.5, 4.6, 7.9, 8.15, new MeshStandardMaterial({ color: 0xcfcabd, roughness: 0.7 }));

  const glass = new MeshStandardMaterial({ color: 0x1b2328, emissive: 0x3a3020, roughness: 0.3 });
  for (const x of [-10.9, 10.9]) {
    const house = new Mesh(new BoxGeometry(2.4, 1.5, 3.4), white);
    house.position.set(x, 8.9, 0);
    const windows = new Mesh(new BoxGeometry(2.45, 0.55, 3.0), glass);
    windows.position.set(x, 9.15, 0);
    const mast = new Mesh(new CylinderGeometry(0.07, 0.07, 3, 6), dark);
    mast.position.set(x, 10.9, 0);
    ferry.add(house, windows, mast);
  }
  const funnel = new Mesh(new CylinderGeometry(0.8, 0.95, 1.7, 16), white);
  funnel.position.y = 9;
  const funnelTop = new Mesh(new CylinderGeometry(0.82, 0.82, 0.35, 16), dark);
  funnelTop.position.y = 9.95;

  // A skirt standing in the waterline, so the foam line can't z-fight the water.
  const foam = new MeshBasicMaterial({ map: waterlineFoam(), transparent: true, depthWrite: false });
  const wake = stadiumWall(15, 4.7, -0.15, 0.5, () => foam, new MeshBasicMaterial({ visible: false }));

  // Cabin light spilling onto the water around the hull.
  const glow = new PointLight(0xffb36b, 160, 45, 2);
  glow.position.y = 3;

  ferry.add(hull, fender, lowerDeck, band, upperDeck, roof, funnel, funnelTop, wake, glow);
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

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

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
// between battens. Uplit from the deck: vertex colours brightest at the foot,
// each panel darker just under the batten above.
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
    const light = (0.5 + 0.5 * (1 - t) ** 1.3) * (1 - 0.3 * pocket);
    for (let c = 0; c <= COLS; c++) {
      const s = c / COLS;
      positions.push(
        lerp(lx, rx + scallop, s),
        lerp(ly, ry, s),
        0.07 * w * Math.sin(Math.PI * s) * Math.sin(Math.PI * pocket),
      );
      uvs.push(s, t);
      colors.push(light, light, light);
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

  // Lit by its own deck lights at night: a faint glow of the varnish.
  const hullMap = junkHull();
  const hull = new Mesh(
    junkHullGeometry(),
    new MeshStandardMaterial({ map: hullMap, emissive: 0xffffff, emissiveMap: hullMap, emissiveIntensity: 0.18, roughness: 0.55, side: DoubleSide }),
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

  junk.add(hull, deck, rail, house, houseRoof, canopy, posts, tyres, rudder, masts, ...sails, rigging, sailLight);
  return junk;
}

const tangent = new Vector3();

function headingFrom(vector) {
  return Math.atan2(-vector.z, vector.x);
}

export function createVessels() {
  const group = new Group();
  const ferry = createFerry();
  const junk = createJunk();
  ferry.rotation.order = 'YXZ';
  junk.rotation.order = 'YXZ';
  group.add(ferry, junk);

  const vessels = [
    { key: 'ferry', object: ferry, curve: null, phase: 0, heading: 0 },
    { key: 'junk', object: junk, curve: null, phase: 1.7, heading: 0 },
  ];

  function setPaths(chapters, breakpoint) {
    for (const vessel of vessels) {
      const keys = chapters.map((c) => c.vessels[breakpoint][vessel.key]);
      vessel.curve = new CatmullRomCurve3(
        keys.map(([x, z]) => new Vector3(x, 0, z)),
        false,
        'centripetal',
      );
      // Optional third value: authored heading in radians (bow along local +X).
      vessel.headings = keys.map((key) => key[2]);
    }
  }

  function lerpAngle(a, b, t) {
    const d = Math.atan2(Math.sin(b - a), Math.cos(b - a));
    return a + d * t;
  }

  // Vessels share the camera's held segment easing, so each hold composition
  // stays put wherever the scroll pauses inside the hold window.
  function update(segment, time, animate) {
    const t = Math.min(1, Math.max(0, (segment.from + segment.eased) / 5));
    for (const vessel of vessels) {
      const { object, curve, headings } = vessel;
      curve.getPoint(t, object.position);
      curve.getTangent(Math.min(0.999, Math.max(0.001, t)), tangent);
      if (tangent.lengthSq() > 1e-6) vessel.heading = headingFrom(tangent);
      const from = headings[segment.from] ?? vessel.heading;
      const to = headings[segment.to] ?? vessel.heading;
      object.rotation.y = lerpAngle(from, to, segment.eased);
      if (animate) {
        object.position.y = 0.12 * Math.sin(time * 0.9 + vessel.phase);
        object.rotation.x = 0.0105 * Math.sin(time * 0.7 + vessel.phase);
        object.rotation.z = 0.007 * Math.sin(time * 0.6 + vessel.phase + 1);
      } else {
        object.position.y = 0;
        object.rotation.x = 0;
        object.rotation.z = 0;
      }
    }
  }

  return { group, ferry, junk, setPaths, update };
}
