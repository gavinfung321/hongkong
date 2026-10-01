import { Matrix4, Quaternion, Vector3 } from 'three';

const UP = new Vector3(0, 1, 0);

// Matrix that stretches a unit cylinder standing on y = 0 (height 1, radius
// 1) from a to b, for instanced struts, masts and legs.
export function strut(a, b, radius) {
  const from = new Vector3(...a);
  const direction = new Vector3(...b).sub(from);
  const length = direction.length();
  return new Matrix4().compose(from, new Quaternion().setFromUnitVectors(UP, direction.normalize()), new Vector3(radius, length, radius));
}
