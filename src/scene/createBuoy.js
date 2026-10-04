import {
  CylinderGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshLambertMaterial,
  Vector2,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { SCENE_03_BUOY } from '../story/scene03/config.js';
import { rimLight } from './rimLight.js';

// Chapter 03's open-water cue (atmospheric depth Priority 2, user choice,
// 2026-10-04): one dark red port-hand channel buoy on the water. Placed from
// the 03 pose per screen size: `ahead` metres along the view, `side` metres
// right of it, at `scale`. Desktop: in the lower right, right of the ferry
// and clear of IFC's and the wheel's water columns. Phones (user choice,
// 2026-10-04): the lower right is the ticket's, so a smaller buoy sits
// further left, under the ferry's hull (user request, 2026-10-04). It heaves,
// rolls and pitches slowly with the swell ([amplitude, rad/s] pairs) and
// holds still in reduced motion. Lit only by the moon and sky, so it reads
// as a dark shape on the water.
// Float profile (radius, height above the waterline): a fendered drum
// tapering to a deck.
const FLOAT = [
  [0, -0.5], [0.6, -0.5], [0.75, -0.2], [0.78, 0.05], [0.82, 0.12], [0.78, 0.2],
  [0.7, 0.55], [0.3, 0.62], [0, 0.62],
];

function buoyGeometry() {
  return mergeGeometries([
    new LatheGeometry(FLOAT.map(([r, y]) => new Vector2(r, y)), 20),
    new CylinderGeometry(0.2, 0.3, 1.4, 12).translate(0, 1.3, 0),
    new CylinderGeometry(0.12, 0.12, 0.25, 8).translate(0, 2.12, 0),
    // Can topmark (port hand).
    new CylinderGeometry(0.2, 0.2, 0.32, 12).translate(0, 2.42, 0),
  ]);
}

// `camera`: the 03 chapter's camera poses per screen size.
export function createBuoy(camera) {
  const group = new Group();
  group.name = 'buoy';
  const material = rimLight(new MeshLambertMaterial({ color: SCENE_03_BUOY.colour, transparent: true }), ...SCENE_03_BUOY.rim);
  const body = new Mesh(buoyGeometry(), material);
  group.add(body);

  function setBreakpoint(breakpoint) {
    const pose = camera[breakpoint];
    const { ahead, side, scale } = SCENE_03_BUOY[breakpoint];
    const position = new Vector3().fromArray(pose.position);
    const forward = new Vector3().fromArray(pose.target).sub(position).setY(0).normalize();
    const right = new Vector3(-forward.z, 0, forward.x);
    group.position.copy(position).addScaledVector(forward, ahead).addScaledVector(right, side).setY(0);
    group.scale.setScalar(scale);
  }
  setBreakpoint('desktop');

  function setOpacity(value) {
    group.visible = value > 0.001;
    material.opacity = value;
  }
  setOpacity(0);

  function update(seconds) {
    const wave = ([amount, speed], phase = 0) => amount * Math.sin(seconds * speed + phase);
    body.position.y = wave(SCENE_03_BUOY.heave);
    body.rotation.z = wave(SCENE_03_BUOY.roll, 1.3);
    body.rotation.x = wave(SCENE_03_BUOY.pitch, 2.1);
  }

  return { group, setOpacity, update, setBreakpoint };
}
