import {
  Group,
  InstancedMesh,
  LatheGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  QuadraticBezierCurve3,
  Quaternion,
  TorusGeometry,
  Vector2,
  Vector3,
} from 'three';

// Chapter 05's harbour edge (atmospheric depth Priority 2, user choice,
// 2026-10-04): one dark mooring bollard with a short sagging chain in the
// lower right of the frame, its base cropped by the frame's bottom edge.
// Placed from the 05 pose per screen size: `ahead` metres along the view,
// `side` metres right of it, its head `rise` above eye height. On phones
// (user choice, 2026-10-04) it sits lower, under IFC's foot (the phone
// camera looks up less). It follows `follow` of the desktop mouse parallax
// shift, so it moves more than the skyline without swinging out of frame.
const BOLLARD = {
  desktop: { ahead: 1.9, side: 1.4, rise: 0.2 },
  mobile: { ahead: 3, side: 0.65, rise: -0.55 },
  follow: 0.92,
  colour: 0x26211d,
  chain: { link: 0.075, reach: 0.9, drop: 0.7, sag: 0.25 },
};

// Profile (radius, height) of a cast-iron bollard: flange, waisted body,
// a lipped head and a domed cap.
const PROFILE = [
  [0, 0], [0.3, 0], [0.3, 0.06], [0.22, 0.09], [0.17, 0.2], [0.15, 0.45],
  [0.17, 0.56], [0.27, 0.62], [0.29, 0.68], [0.27, 0.72], [0.2, 0.78], [0.1, 0.82], [0, 0.83],
];
const NECK = 0.55;

// `camera`: the 05 chapter's camera poses per screen size.
export function createBollard(camera) {
  const group = new Group();
  group.name = 'bollard';
  const material = new MeshLambertMaterial({ color: BOLLARD.colour, transparent: true });

  const body = new Mesh(new LatheGeometry(PROFILE.map(([r, y]) => new Vector2(r, y)), 24), material);
  const height = PROFILE.at(-1)[1];

  // The chain leaves the neck toward the camera's left and drops out of frame.
  const { link, reach, drop, sag } = BOLLARD.chain;
  const start = new Vector3(-0.18, NECK, 0);
  const end = new Vector3(-reach, NECK - drop, -0.15);
  const curve = new QuadraticBezierCurve3(start, start.clone().lerp(end, 0.5).setY(end.y - sag), end);
  const count = Math.floor(curve.getLength() / link);
  const links = new InstancedMesh(new TorusGeometry(0.035, 0.011, 6, 12).scale(1.5, 1, 1), material, count);
  const m = new Matrix4();
  const q = new Quaternion();
  const roll = new Quaternion();
  const x = new Vector3(1, 0, 0);
  const one = new Vector3(1, 1, 1);
  for (let i = 0; i < count; i++) {
    const u = (i + 0.5) / count;
    const tangent = curve.getTangentAt(u);
    q.setFromUnitVectors(x, tangent);
    roll.setFromAxisAngle(tangent, i % 2 ? Math.PI / 2 : 0);
    links.setMatrixAt(i, m.compose(curve.getPointAt(u), roll.multiply(q), one));
  }
  group.add(body, links);

  const base = new Vector3();
  function setBreakpoint(breakpoint) {
    const pose = camera[breakpoint];
    const { ahead, side, rise } = BOLLARD[breakpoint];
    const position = new Vector3().fromArray(pose.position);
    const forward = new Vector3().fromArray(pose.target).sub(position).setY(0).normalize();
    const right = new Vector3(-forward.z, 0, forward.x);
    base.copy(position)
      .addScaledVector(forward, ahead)
      .addScaledVector(right, side)
      .setY(position.y + rise - height);
    group.position.copy(base);
    group.rotation.y = Math.atan2(-forward.x, -forward.z);
  }
  setBreakpoint('desktop');

  function setOpacity(value) {
    group.visible = value > 0.001;
    material.opacity = value;
  }
  setOpacity(0);

  // `shift`: the camera's parallax offset this frame (null when stepped).
  function follow(shift) {
    group.position.copy(base);
    if (shift) group.position.addScaledVector(shift, BOLLARD.follow);
  }

  return { group, setOpacity, follow, setBreakpoint };
}
