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
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
  Shape,
  ShapeGeometry,
  Vector3,
} from 'three';
import { basic, lambert } from './palette.js';
import { ferryDeck, ferryDeckRepeat, ferryHull, junkPlanks, junkSail, waterlineFoam } from './surfaces.js';

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
// (it runs both ways) and a white funnel. Placeholder until the user's Meshy
// model (ASSET-LEDGER.md).
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

function sailShape(width, height) {
  const shape = new Shape();
  shape.moveTo(0.25 * width, 0);
  shape.lineTo(-0.75 * width, 0);
  shape.quadraticCurveTo(-0.95 * width, 0.5 * height, -0.6 * width, height);
  shape.lineTo(0.2 * width, 0.92 * height);
  shape.lineTo(0.25 * width, 0);
  return shape;
}

function createJunk() {
  const junk = new Group();
  junk.name = 'junk';

  const profile = new Shape();
  profile.moveTo(-14, 5.2);
  profile.lineTo(-11.5, 5.2);
  profile.lineTo(-10, 3);
  profile.lineTo(8, 2.8);
  profile.lineTo(14, 3.8);
  profile.lineTo(12.5, 1.5);
  profile.lineTo(9, -0.9);
  profile.lineTo(-10, -0.9);
  profile.lineTo(-13.2, 1.8);
  profile.lineTo(-14, 5.2);
  const hullGeometry = new ExtrudeGeometry(profile, { depth: 7, bevelEnabled: false });
  hullGeometry.translate(0, 0, -3.5);
  const hull = new Mesh(hullGeometry, new MeshStandardMaterial({ map: junkPlanks(), roughness: 0.8 }));

  const cabin = new Mesh(new BoxGeometry(12, 1.4, 6.2), basic(0xc98a4f));
  cabin.position.set(-2, 3.6, 0);

  // [mastX, mastHeight, sailWidth, sailHeight, sailBase, zOffset]
  const rig = [
    [9.5, 15, 6, 11, 4, 0.3],
    [1, 22, 9, 16, 4.2, 0],
    [-9, 13, 5, 9, 5.5, -0.3],
  ];

  const masts = new InstancedMesh(new CylinderGeometry(0.18, 0.18, 1, 6), lambert(0x241c1c), rig.length);
  const sailMaterial = new MeshBasicMaterial({ map: junkSail(), side: DoubleSide });
  const battenPoints = [];
  const m = new Matrix4();

  rig.forEach(([mx, mh, w, h, base, z], i) => {
    m.makeScale(1, mh, 1).setPosition(mx, 2.8 + mh / 2, 0);
    masts.setMatrixAt(i, m);

    const sail = new Mesh(normaliseUVs(new ShapeGeometry(sailShape(w, h), 6)), sailMaterial);
    sail.position.set(mx, base, z);
    junk.add(sail);

    for (const f of [0.2, 0.4, 0.6, 0.8]) {
      const y = base + f * h;
      const front = mx + (0.25 - 0.05 * f) * w;
      const back = mx + (-0.75 - 0.2 * Math.sin(f * Math.PI) + 0.15 * f) * w;
      for (const side of [0.06, -0.06]) battenPoints.push(front, y, z + side, back, y, z + side);
    }
  });

  const battenGeometry = new BufferGeometry();
  battenGeometry.setAttribute('position', new Float32BufferAttribute(battenPoints, 3));
  const battens = new LineSegments(battenGeometry, basic(0x5a1f18));

  // Deck lanterns: a warm pool on the water around the junk.
  const lantern = new PointLight(0xffa860, 110, 35, 2);
  lantern.position.set(-2, 5, 0);

  junk.add(hull, cabin, masts, battens, lantern);
  return junk;
}

// ShapeGeometry UVs are in shape units; maps the outline's bounds to 0..1.
function normaliseUVs(geometry) {
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  const uv = geometry.attributes.uv;
  const position = geometry.attributes.position;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (position.getX(i) - min.x) / (max.x - min.x), (position.getY(i) - min.y) / (max.y - min.y));
  }
  return geometry;
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
