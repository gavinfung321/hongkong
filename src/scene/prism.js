import { ExtrudeGeometry } from 'three';

// A plan shape extruded upward from y0 to y1. Side walls get UVs in metres:
// u along the plan, v down from the base (1 − height).
export function prism(shape, y0, y1) {
  const geometry = new ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, y0, 0);
  return geometry;
}
