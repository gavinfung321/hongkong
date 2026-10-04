import { MathUtils, Matrix4, Vector3 } from 'three';
import { createBauhiniaBranch } from './bauhinia.js';
import { silhouette } from './lamps.js';
import { poseFov } from '../scroll/cameraRig.js';

// 05's corner branch (user choice, 2026-10-04; Kage's cutouts at the frame
// edges, technique only: our own tree, built in code): a flowering bauhinia
// branch reaching into the top-right corner from outside the frame, close to
// the lens, dark against the sky with its flowers lit, dropping a petal now
// and then. Desktop only (on phones IFC's crown fills that corner).
// Placed from the 05 pose for the window's shape: its foot `ahead` metres
// along the view, just past the right edge (`side`, a share of the half
// width there) and `rise` of the half height up; scaled so its foliage
// reaches `reach` of the half width into the frame. It follows `follow` of
// the mouse parallax shift, so it moves a little more than the skyline,
// like the nearest layer, without swinging out of frame. It stays hidden
// while the camera travels, then slides in from off the top-right.
const BRANCH = {
  ahead: 3.4,
  side: 1.02,
  rise: 0.6,
  reach: 0.6,
  follow: 0.93,
  // Share of moon and sky fill kept, as for the promenade's tree.
  fill: 0.3,
};

// After the camera has settled on 05, the sprig slides in from off the
// top-right (user request, 2026-10-04). `side` and `rise` are extra shares
// of the half-frame, past the resting corner, so the whole sprig starts
// outside. It takes `enter` seconds to arrive and `leave` seconds to slip
// back out, and it stays hidden while the camera is still moving.
const ENTER = { side: 1.05, rise: 1.15, enter: 1.15, leave: 0.45 };

const forward = new Vector3();
const right = new Vector3();
const up = new Vector3();
const worldUp = new Vector3(0, 1, 0);
const basis = new Matrix4();
const axisRight = new Vector3();
const axisUp = new Vector3();

// `camera`: the 05 chapter's camera poses per screen size.
export function createCornerBranch(camera) {
  // The flowers turn toward a point down, left and in front, where the
  // camera sits (local frame: +x into the frame, +y up, +z away).
  const viewer = new Vector3(BRANCH.side, -BRANCH.rise, -BRANCH.ahead / 2).multiplyScalar(20);
  const branch = createBauhiniaBranch({ seed: 17, viewer });
  branch.group.name = 'cornerBranch';
  branch.group.visible = false;
  for (const material of branch.materials.slice(0, 2)) silhouette(material, BRANCH.fill);

  const base = new Vector3();
  let spanW = 1;
  let spanH = 1;
  let gate = 0;
  let slide = 0;
  let shift = null;
  let mode = 'hide';

  function place(breakpoint, aspect) {
    const pose = camera[breakpoint] ?? camera.desktop;
    const position = new Vector3().fromArray(pose.position);
    forward.fromArray(pose.target).sub(position).normalize();
    right.crossVectors(forward, worldUp).normalize();
    up.crossVectors(right, forward);
    const halfH = BRANCH.ahead * Math.tan(MathUtils.degToRad(poseFov(pose, aspect, breakpoint) / 2));
    const halfW = halfH * aspect;
    spanW = halfW;
    spanH = halfH;
    axisRight.copy(right);
    axisUp.copy(up);
    base.copy(position)
      .addScaledVector(forward, BRANCH.ahead)
      .addScaledVector(right, BRANCH.side * halfW)
      .addScaledVector(up, BRANCH.rise * halfH);
    // +x reaches left into the frame, +y is the view's up, +z away.
    basis.makeBasis(right.clone().negate(), up, forward);
    branch.group.quaternion.setFromRotationMatrix(basis);
    branch.group.scale.setScalar(((BRANCH.side - 1 + BRANCH.reach) * halfW) / branch.reach);
    branch.group.position.copy(base);
    seat();
  }

  // `next`: the camera's parallax shift this frame, or none. `travel` says
  // whether 05 is held (`show`), the hold is being left while the camera is
  // still still (`retreat`), or the camera is moving (`hide`).
  function follow(next, travel) {
    shift = next;
    if (travel.stepped) {
      slide = travel.show ? 1 : 0;
      mode = 'hold';
      seat();
      return;
    }
    mode = travel.show ? 'in' : travel.retreat ? 'out' : 'hide';
    if (mode === 'hide') slide = 0;
  }

  function setOpacity(value) {
    gate = value;
    if (mode === 'hold') seat();
  }

  function seat() {
    const t = slide * slide * (3 - 2 * slide);
    const out = 1 - t;
    branch.group.position.copy(base);
    if (shift) branch.group.position.addScaledVector(shift, BRANCH.follow);
    branch.group.position.addScaledVector(axisRight, out * ENTER.side * spanW);
    branch.group.position.addScaledVector(axisUp, out * ENTER.rise * spanH);
    const opacity = gate * t;
    branch.group.visible = opacity > 0.001;
    for (const material of branch.materials) material.opacity = opacity;
  }

  function update(seconds, dt = 0) {
    branch.update(seconds);
    if (mode === 'hold') return;
    if (mode === 'hide') slide = 0;
    else {
      const step = Math.min(dt, 0.05) / (mode === 'in' ? ENTER.enter : ENTER.leave);
      slide = MathUtils.clamp(slide + (mode === 'in' ? step : -step), 0, 1);
    }
    seat();
  }

  return { group: branch.group, place, follow, setOpacity, update };
}
