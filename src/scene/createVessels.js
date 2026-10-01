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
import { ferryHull, ferryWindows, junkPlanks, junkSail } from './surfaces.js';

// Both vessels are built with their bow pointing along local +X.

function createFerry() {
  const ferry = new Group();
  ferry.name = 'ferry';

  const hullShape = new Shape();
  hullShape.moveTo(-15, -5);
  hullShape.lineTo(15, -5);
  hullShape.absarc(15, 0, 5, -Math.PI / 2, Math.PI / 2, false);
  hullShape.lineTo(-15, 5);
  hullShape.absarc(-15, 0, 5, Math.PI / 2, (Math.PI * 3) / 2, false);
  const hullGeometry = new ExtrudeGeometry(hullShape, { depth: 4, bevelEnabled: false, curveSegments: 8 });
  hullGeometry.rotateX(-Math.PI / 2);
  hullGeometry.translate(0, -0.8, 0);
  const hull = new Mesh(hullGeometry, new MeshStandardMaterial({ map: ferryHull(), roughness: 0.6 }));

  const deckMaterial = lambert(0xb4b0a4);
  const lowerDeck = new Mesh(new BoxGeometry(34, 3, 9), deckMaterial);
  lowerDeck.position.y = 4.7;
  const upperDeck = new Mesh(new BoxGeometry(30, 2.8, 8.5), deckMaterial);
  upperDeck.position.y = 7.6;
  const roof = new Mesh(new BoxGeometry(32, 0.3, 9.6), lambert(0x6c6a66));
  roof.position.y = 9.15;
  const funnel = new Mesh(new CylinderGeometry(1, 1, 2, 10), lambert(0x3a3a3a));
  funnel.position.y = 10.3;

  const lowerWindows = new Mesh(new BoxGeometry(30, 1, 9.1), new MeshBasicMaterial({ map: ferryWindows(24) }));
  lowerWindows.position.y = 4.9;
  const upperWindows = new Mesh(new BoxGeometry(26, 0.9, 8.6), new MeshBasicMaterial({ map: ferryWindows(21) }));
  upperWindows.position.y = 7.7;

  // Cabin light spilling onto the water around the hull.
  const glow = new PointLight(0xffb36b, 160, 45, 2);
  glow.position.y = 3;

  ferry.add(hull, lowerDeck, upperDeck, roof, funnel, lowerWindows, upperWindows, glow);
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
