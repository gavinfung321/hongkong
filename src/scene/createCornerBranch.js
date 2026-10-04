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
// like the nearest layer, without swinging out of frame.
const BRANCH = {
  ahead: 3.4,
  side: 1.02,
  rise: 0.6,
  reach: 0.6,
  follow: 0.93,
  // Share of moon and sky fill kept, as for the promenade's tree.
  fill: 0.3,
};

const forward = new Vector3();
const right = new Vector3();
const up = new Vector3();
const worldUp = new Vector3(0, 1, 0);
const basis = new Matrix4();

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
  function place(breakpoint, aspect) {
    const pose = camera[breakpoint] ?? camera.desktop;
    const position = new Vector3().fromArray(pose.position);
    forward.fromArray(pose.target).sub(position).normalize();
    right.crossVectors(forward, worldUp).normalize();
    up.crossVectors(right, forward);
    const halfH = BRANCH.ahead * Math.tan(MathUtils.degToRad(poseFov(pose, aspect, breakpoint) / 2));
    const halfW = halfH * aspect;
    base.copy(position)
      .addScaledVector(forward, BRANCH.ahead)
      .addScaledVector(right, BRANCH.side * halfW)
      .addScaledVector(up, BRANCH.rise * halfH);
    // +x reaches left into the frame, +y is the view's up, +z away.
    basis.makeBasis(right.clone().negate(), up, forward);
    branch.group.quaternion.setFromRotationMatrix(basis);
    branch.group.scale.setScalar(((BRANCH.side - 1 + BRANCH.reach) * halfW) / branch.reach);
    branch.group.position.copy(base);
  }

  // shift: the camera's parallax shift this frame (cameraRig.js), or none.
  function follow(shift) {
    branch.group.position.copy(base);
    if (shift) branch.group.position.addScaledVector(shift, BRANCH.follow);
  }

  function setOpacity(value) {
    branch.group.visible = value > 0.001;
    for (const material of branch.materials) material.opacity = value;
  }

  return { group: branch.group, place, follow, setOpacity, update: branch.update };
}
