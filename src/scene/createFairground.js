import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  ConeGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Points,
  PointsMaterial,
  Quaternion,
  RepeatWrapping,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
} from 'three';

// 05 harbour-front fair (user request, 2026-10-04; the Central Observation
// Wheel carnival is a reference only). Original night versions of a wave
// swinger and a striped spiral-slide tower on a pad to the wheel's left,
// so 05's empty water reads as that small park. No sponsor lettering,
// banners or crowds. Metres in the wheel's local frame. Still in reduced
// motion (island.update is not called).
const PAD = { x: -42, z: 18, width: 52, depth: 20 };
const SLIDE = { x: -58, z: 17, height: 16, bottom: 3.2, top: 1.3, turns: 4.2 };
const SWING = {
  x: -28,
  z: 19,
  pole: 11.4,
  rim: 7.2,
  hang: 5.4,
  flare: 0.7,
  seats: 18,
  period: 18,
};

function stripeMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = i % 2 ? '#f2ebe0' : '#c42f32';
    ctx.fillRect(0, i * 16, 8, 16);
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function bulbMap() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const wash = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  wash.addColorStop(0, 'rgba(255,255,255,1)');
  wash.addColorStop(0.5, 'rgba(255,255,255,0.85)');
  wash.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, 32, 32);
  return new CanvasTexture(canvas);
}

function bulbs(positions, colour, size, map) {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  const points = new Points(
    geometry,
    new PointsMaterial({
      color: colour,
      size,
      map,
      sizeAttenuation: false,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  points.userData.noProbe = true;
  return points;
}

function slideTower(lightMap) {
  const group = new Group();
  group.position.set(SLIDE.x, 0, SLIDE.z);
  const map = stripeMap();
  const stripes = new MeshLambertMaterial({ map, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 0.22 });
  const tower = new Mesh(
    new CylinderGeometry(SLIDE.top, SLIDE.bottom, SLIDE.height, 20).translate(0, SLIDE.height / 2, 0),
    stripes,
  );
  const cap = new Mesh(
    new ConeGeometry(SLIDE.top + 0.35, 1.6, 16).translate(0, SLIDE.height + 0.7, 0),
    new MeshLambertMaterial({ color: 0xf0e6d8, emissive: 0x5a4030 }),
  );
  const helix = [];
  for (let i = 0; i <= 72; i++) {
    const t = i / 72;
    const a = t * SLIDE.turns * Math.PI * 2;
    const r = MathUtils.lerp(SLIDE.top + 0.55, SLIDE.bottom + 0.7, t);
    helix.push(new Vector3(Math.cos(a) * r, SLIDE.height * (1 - t) + 0.6, Math.sin(a) * r));
  }
  const chute = new Mesh(
    new TubeGeometry(new CatmullRomCurve3(helix), 72, 0.42, 5, false),
    new MeshLambertMaterial({ color: 0xf4eee4, emissive: 0x6a5040 }),
  );
  const crown = [];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    crown.push(Math.cos(a) * (SLIDE.top + 0.15), SLIDE.height + 0.15, Math.sin(a) * (SLIDE.top + 0.15));
  }
  group.add(tower, cap, chute, bulbs(crown, 0xffe08a, 4.5, lightMap));
  return group;
}

export function createFairground() {
  const group = new Group();
  group.name = 'fair';
  const lights = bulbMap();
  const pad = new Mesh(
    new BoxGeometry(PAD.width, 0.5, PAD.depth).translate(0, 0.25, 0),
    new MeshLambertMaterial({ color: 0x4a2030, emissive: 0x2a1018 }),
  );
  pad.position.set(PAD.x, 0, PAD.z);

  const booths = new InstancedMesh(
    new BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
    new MeshLambertMaterial({ color: 0xe8d4b8, emissive: 0x4a3828 }),
    3,
  );
  const m = new Matrix4();
  const q = new Quaternion();
  [[-64, 22, 3.2, 2.4], [-48, 24, 2.8, 2.2], [-16, 24, 3.4, 2.5]].forEach(([x, z, w, h], i) => {
    booths.setMatrixAt(i, m.compose(new Vector3(x, 0.5, z), q, new Vector3(w, h, w)));
  });

  const strings = [];
  const sag = (a, b) => {
    const n = 10;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      strings.push(
        a[0] + (b[0] - a[0]) * t,
        6.2 - 0.9 * Math.sin(t * Math.PI),
        a[1] + (b[1] - a[1]) * t,
      );
    }
  };
  sag([-64, 22], [-48, 24]);
  sag([-48, 24], [-16, 24]);
  sag([-58, 17], [-28, 19]);

  const swing = new Group();
  swing.position.set(SWING.x, 0, SWING.z);
  const pole = new Mesh(
    new CylinderGeometry(0.38, 0.55, SWING.pole, 10).translate(0, SWING.pole / 2, 0),
    new MeshLambertMaterial({ color: 0xe8dcc8, emissive: 0x5a4038 }),
  );
  const rotor = new Group();
  rotor.position.y = SWING.pole;
  rotor.rotation.x = 0.12;
  const canopy = new Mesh(
    new ConeGeometry(SWING.rim + 0.4, 2.4, 20).translate(0, 1.1, 0),
    new MeshLambertMaterial({ color: 0xf3ead8, emissive: 0x6a5040 }),
  );
  const rimLights = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    rimLights.push(Math.cos(a) * SWING.rim, 0.05, Math.sin(a) * SWING.rim);
  }
  rotor.add(canopy, bulbs(rimLights, 0xffe6a8, 4.2, lights));

  const chainGeom = new BufferGeometry();
  const chains = new LineSegments(chainGeom, new LineBasicMaterial({ color: 0xc8b8a0, toneMapped: false }));
  chains.userData.noProbe = true;
  const seats = new InstancedMesh(
    new BoxGeometry(0.7, 0.55, 0.7),
    new MeshLambertMaterial({ color: 0xc45a6a, emissive: 0x4a2030 }),
    SWING.seats,
  );
  const p = new Vector3();
  const unit = new Vector3(1, 1, 1);
  const chainPts = new Float32Array(SWING.seats * 6);
  chainGeom.setAttribute('position', new Float32BufferAttribute(chainPts, 3));

  function pose(spin) {
    rotor.rotation.y = spin;
    for (let i = 0; i < SWING.seats; i++) {
      const a = (i / SWING.seats) * Math.PI * 2;
      const ox = Math.cos(a) * SWING.rim;
      const oz = Math.sin(a) * SWING.rim;
      const k = i * 6;
      chainPts[k] = ox;
      chainPts[k + 1] = 0;
      chainPts[k + 2] = oz;
      const fx = ox * (1 + SWING.flare * 0.9);
      const fz = oz * (1 + SWING.flare * 0.9);
      const fy = -SWING.hang * 0.92;
      chainPts[k + 3] = fx;
      chainPts[k + 4] = fy;
      chainPts[k + 5] = fz;
      p.set(fx, fy, fz);
      seats.setMatrixAt(i, m.compose(p, q, unit));
    }
    chainGeom.attributes.position.needsUpdate = true;
    seats.instanceMatrix.needsUpdate = true;
  }
  rotor.add(chains, seats);
  swing.add(pole, rotor);
  pose(0);

  group.add(pad, booths, slideTower(lights), swing, bulbs(strings, 0xffd4a0, 4.2, lights));

  function update(time) {
    pose((time / SWING.period) * Math.PI * 2);
  }

  return { group, update };
}
