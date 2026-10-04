import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CylinderGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshLambertMaterial,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  SRGBColorSpace,
  Shape,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// 05's harbour boat (user choice, 2026-10-04): a small evening cruise boat,
// built in code, gliding slowly left to right in front of the Central ferry
// piers: a dark hull, a cabin of warm windows, an open upper deck under a
// canopy, a short mast, strings of bulbs from bow to masthead to stern and
// along the canopy, and navigation lights. Local frame: bow toward +x,
// waterline at y = 0, metres. Its lights and hull are mirrored on the water
// (waterReflections.js).
// The route: along z, from x `from` to `to` at `speed` m/s, then round
// again from `from`; on each arrival in 05 it starts at `start` for the
// screen size, in the frame. It rocks gently. Still in reduced motion, at
// its start.
const ROUTE = { z: -1058, from: 120, to: 760, speed: 3.2, start: { desktop: 300, mobile: 318 } };
const HULL = { length: 22, beam: 5, height: 1.6, colour: 0x1b2231 };
const CABIN = { x: [-8.5, 3.5], height: 1.9, beam: 4.2, wall: '#2a2830', window: '#ffc782' };
const CANOPY = { x: [-9.5, 4], y: 5.5, beam: 4.6 };
const MAST = { x: 5.5, top: 9.5 };
const BULB = { colour: 0xffd8a0, size: 3.2, spacing: 0.55, sag: 0.35 };
const NAV = { port: 0xff3b30, starboard: 0x3bff7a, mast: 0xffffff, size: 3.6 };
const ROCK = { bob: 0.08, roll: 0.015, pitch: 0.008 };

// The cabin's side: dark wall with a row of warm windows, a few dimmer.
function cabinTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = CABIN.wall;
  ctx.fillRect(0, 0, 256, 32);
  for (let i = 0; i < 12; i++) {
    ctx.globalAlpha = i % 5 === 3 ? 0.55 : 1;
    ctx.fillStyle = CABIN.window;
    ctx.fillRect(6 + i * 20.8, 8, 15, 14);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

// A round, soft-edged bulb for the points.
function bulbTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.9)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  return new CanvasTexture(canvas);
}

function hullGeometry() {
  const { length, beam, height } = HULL;
  const stern = -length / 2;
  const shoulder = length / 2 - 5;
  const shape = new Shape();
  shape.moveTo(stern, -beam / 2);
  shape.lineTo(shoulder, -beam / 2);
  shape.quadraticCurveTo(length / 2 - 1.2, -beam / 2.6, length / 2, 0);
  shape.quadraticCurveTo(length / 2 - 1.2, beam / 2.6, shoulder, beam / 2);
  shape.lineTo(stern, beam / 2);
  shape.lineTo(stern, -beam / 2);
  // Extruded upward: the shape's plane becomes the deck, its y the boat's z.
  return new ExtrudeGeometry(shape, { depth: height, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, -0.3, 0);
}

// Bulbs along a sagging string from a to b, `spacing` apart.
function string(points, a, b) {
  const middle = a.clone().lerp(b, 0.5);
  middle.y -= BULB.sag;
  const curve = new QuadraticBezierCurve3(a, middle, b);
  const count = Math.max(2, Math.round(curve.getLength() / BULB.spacing));
  for (let i = 0; i <= count; i++) points.push(...curve.getPoint(i / count).toArray());
}

function pointsMesh(positions, colour, size, map) {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  const material = new PointsMaterial({ color: colour, size, sizeAttenuation: false, map, transparent: true, depthWrite: false, toneMapped: false });
  const points = new Points(geometry, material);
  points.userData.noProbe = true;
  return points;
}

export function createHarbourBoat() {
  const boat = new Group();
  boat.name = 'harbourBoat';
  const dark = new MeshLambertMaterial({ color: HULL.colour });
  const hull = new Mesh(hullGeometry(), dark);

  const top = HULL.height - 0.3;
  const [c0, c1] = CABIN.x;
  const skin = cabinTexture();
  const cabin = new Mesh(
    new BoxGeometry(c1 - c0, CABIN.height, CABIN.beam).translate((c0 + c1) / 2, top + CABIN.height / 2, 0),
    new MeshLambertMaterial({ color: 0x3a3842, emissive: 0xffffff, emissiveMap: skin, map: skin }),
  );
  const [k0, k1] = CANOPY.x;
  const posts = [k0 + 0.3, (k0 + k1) / 2, k1 - 0.3].flatMap((x) =>
    [-1, 1].map((side) => new CylinderGeometry(0.06, 0.06, CANOPY.y - top - CABIN.height).translate(x, (top + CABIN.height + CANOPY.y) / 2, side * (CANOPY.beam / 2 - 0.2))),
  );
  const frame = new Mesh(
    mergeGeometries([
      new BoxGeometry(k1 - k0, 0.14, CANOPY.beam).translate((k0 + k1) / 2, CANOPY.y, 0),
      new CylinderGeometry(0.07, 0.09, MAST.top - top).translate(MAST.x, (MAST.top + top) / 2, 0),
      ...posts,
    ]),
    new MeshLambertMaterial({ color: 0xd8d4cc }),
  );

  // The strings: bow to masthead to the canopy's front, along both canopy
  // edges, and from the canopy's back down to the stern.
  const bulbs = [];
  const bow = new Vector3(HULL.length / 2 - 0.3, top + 0.4, 0);
  const masthead = new Vector3(MAST.x, MAST.top, 0);
  string(bulbs, bow, masthead);
  string(bulbs, masthead, new Vector3(k1, CANOPY.y + 0.1, 0));
  for (const side of [-1, 1]) {
    string(bulbs, new Vector3(k1, CANOPY.y + 0.05, side * CANOPY.beam / 2), new Vector3(k0, CANOPY.y + 0.05, side * CANOPY.beam / 2));
  }
  string(bulbs, new Vector3(k0, CANOPY.y + 0.1, 0), new Vector3(-HULL.length / 2 + 0.3, top + 0.4, 0));
  const map = bulbTexture();
  const lights = pointsMesh(bulbs, BULB.colour, BULB.size, map);
  const port = pointsMesh([c1 + 0.4, top + CABIN.height, CABIN.beam / 2], NAV.port, NAV.size, map);
  const starboard = pointsMesh([c1 + 0.4, top + CABIN.height, -CABIN.beam / 2], NAV.starboard, NAV.size, map);
  const mastLight = pointsMesh([MAST.x, MAST.top + 0.25, 0], NAV.mast, NAV.size, map);

  boat.add(hull, cabin, frame, lights, port, starboard, mastLight);
  boat.position.set(ROUTE.start.desktop, 0, ROUTE.z);

  let start = ROUTE.start.desktop;
  let travelled = -1; // metres since this arrival, or -1 while away
  let rocking = 0;

  function setBreakpoint(breakpoint) {
    start = ROUTE.start[breakpoint] ?? ROUTE.start.desktop;
    if (travelled <= 0) boat.position.x = start;
  }

  // level: the chapter's `boat` gate; it restarts on each arrival.
  // moving: false in reduced motion, where it holds at its start.
  function update(dt, level, moving) {
    if (level <= 0.001) {
      travelled = -1;
      return;
    }
    if (travelled < 0) travelled = 0;
    if (moving) {
      travelled += ROUTE.speed * dt;
      rocking += dt;
    }
    const span = ROUTE.to - ROUTE.from;
    boat.position.x = ROUTE.from + ((((start - ROUTE.from + travelled) % span) + span) % span);
    boat.position.y = ROCK.bob * Math.sin(rocking * 1.3);
    boat.rotation.x = ROCK.roll * Math.sin(rocking * 1.1 + 0.7);
    boat.rotation.z = ROCK.pitch * Math.sin(rocking * 0.9 + 1.9);
  }

  return { group: boat, setBreakpoint, update };
}
