// Development-only composition maths: landmark screen rectangles, target
// scoring, and a small Nelder–Mead pose solver. Imported by debug.js only.
import { Box3, Matrix4, PerspectiveCamera, Plane, Ray, Vector2, Vector3 } from 'three';

const v = new Vector3();
const m = new Matrix4();
const inverse = new Matrix4();
const instance = new Matrix4();
const box = new Box3();

// Bounding-box corners of every mesh under root, stored in root-local space.
export function collectPoints(root) {
  root.updateWorldMatrix(true, true);
  inverse.copy(root.matrixWorld).invert();
  const points = [];
  const pushCorners = (matrix) => {
    for (let i = 0; i < 8; i++) {
      v.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z);
      v.applyMatrix4(matrix);
      points.push(v.x, v.y, v.z);
    }
  };
  root.traverse((child) => {
    if (!child.geometry) return;
    if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
    box.copy(child.geometry.boundingBox);
    if (child.isInstancedMesh) {
      for (let i = 0; i < child.count; i++) {
        child.getMatrixAt(i, instance);
        pushCorners(m.multiplyMatrices(inverse, child.matrixWorld).multiply(instance));
      }
    } else {
      pushCorners(m.multiplyMatrices(inverse, child.matrixWorld));
    }
  });
  return new Float32Array(points);
}

// Screen rectangle of a landmark in % of the viewport (0–100, y down).
export function screenRect(root, points, camera) {
  root.updateWorldMatrix(true, false);
  camera.updateMatrixWorld();
  let left = Infinity;
  let right = -Infinity;
  let top = Infinity;
  let bottom = -Infinity;
  let behind = 0;
  for (let i = 0; i < points.length; i += 3) {
    v.set(points[i], points[i + 1], points[i + 2]).applyMatrix4(root.matrixWorld);
    v.applyMatrix4(camera.matrixWorldInverse);
    if (v.z > -camera.near) {
      behind += 1;
      continue;
    }
    v.applyMatrix4(camera.projectionMatrix);
    const x = (v.x * 0.5 + 0.5) * 100;
    const y = (0.5 - v.y * 0.5) * 100;
    left = Math.min(left, x);
    right = Math.max(right, x);
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
  }
  const total = points.length / 3;
  if (behind === total) return { offscreen: true, behind };
  const offscreen = right < 0 || left > 100 || bottom < 0 || top > 100;
  return { left, right, top, bottom, offscreen, behind, partial: behind > 0 };
}

// Screen y (%) of the true horizon straight ahead of the camera.
export function horizonY(camera) {
  camera.updateMatrixWorld();
  const forward = camera.getWorldDirection(new Vector3());
  forward.y = 0;
  if (forward.lengthSq() < 1e-6) return NaN;
  forward.normalize().multiplyScalar(1e5);
  v.copy(camera.position).add(forward);
  v.project(camera);
  return (0.5 - v.y * 0.5) * 100;
}

export function measure(landmarks, camera) {
  const rects = {};
  for (const [key, entry] of Object.entries(landmarks)) {
    rects[key] = screenRect(entry.object, entry.points, camera);
  }
  return { rects, horizon: horizonY(camera) };
}

function overlap1D(a0, a1, b0, b1) {
  return Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
}

// Returns { error, rows } comparing measurements with section 7 targets.
export function score(targets, measured, tolerance = 3) {
  let error = 0;
  const rows = [];
  for (const [key, target] of Object.entries(targets)) {
    if (key === 'horizon') {
      const h = measured.horizon;
      if (typeof target === 'number') {
        const d = h - target;
        error += 0.05 * d * d + 10 * Math.max(0, Math.abs(d) - tolerance) ** 2;
        rows.push({ key, side: 'y', target, actual: h, ok: Math.abs(d) <= tolerance });
      } else if (target.min != null) {
        const miss = Math.max(0, target.min - h);
        error += 10 * miss * miss;
        rows.push({ key, side: 'min', target: target.min, actual: h, ok: miss === 0 });
      }
      continue;
    }
    const rect = measured.rects[key];
    if (!rect) continue;
    if (target.offscreen) {
      const ox = rect.offscreen ? 0 : overlap1D(rect.left, rect.right, 0, 100);
      const oy = rect.offscreen ? 0 : overlap1D(rect.top, rect.bottom, 0, 100);
      let miss = ox > 0 && oy > 0 ? Math.min(ox, oy) + 2 : 0;
      // Hidden also counts when the rect sits inside a nearer occluder (e.g. IFC behind the tower in 02).
      const occluder = target.behind && measured.rects[target.behind];
      if (miss > 0 && occluder && !occluder.offscreen) {
        const outside = Math.max(
          0,
          occluder.left - rect.left,
          rect.right - occluder.right,
          occluder.top - rect.top,
          rect.bottom - occluder.bottom,
        );
        miss = Math.min(miss, outside);
      }
      error += 4 * miss * miss;
      rows.push({ key, side: 'offscreen', target: true, actual: miss < 0.5, ok: miss < 0.5 });
      continue;
    }
    for (const side of ['left', 'right', 'top', 'bottom']) {
      if (target[side] == null) continue;
      if (rect.offscreen) {
        error += 4000;
        rows.push({ key, side, target: target[side], actual: NaN, ok: false });
        continue;
      }
      const d = rect[side] - target[side];
      error += 0.05 * d * d + 10 * Math.max(0, Math.abs(d) - tolerance) ** 2;
      rows.push({ key, side, target: target[side], actual: rect[side], ok: Math.abs(d) <= tolerance });
    }
  }
  return { error, rows };
}

export function rectsIntersect(rect, region) {
  if (!rect || rect.offscreen) return false;
  return (
    overlap1D(Math.max(0, rect.left), Math.min(100, rect.right), region.left, region.right) > 0 &&
    overlap1D(Math.max(0, rect.top), Math.min(100, rect.bottom), region.top, region.bottom) > 0
  );
}

// ---- Pose helpers ---------------------------------------------------------

export function poseToParams(pose) {
  const [px, py, pz] = pose.position;
  const d = new Vector3().fromArray(pose.target).sub(new Vector3().fromArray(pose.position)).normalize();
  const yaw = Math.atan2(-d.x, -d.z);
  const pitch = Math.asin(d.y);
  return [px, py, pz, (yaw * 180) / Math.PI, (pitch * 180) / Math.PI, pose.fov];
}

export function paramsToPose([px, py, pz, yawDeg, pitchDeg, fov], distance = 400) {
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  const d = [-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)];
  const round = (n) => Math.round(n * 10) / 10;
  return {
    position: [round(px), round(py), round(pz)],
    target: [round(px + d[0] * distance), round(py + d[1] * distance), round(pz + d[2] * distance)],
    fov: round(fov),
  };
}

export function poseCamera(camera, pose, aspect) {
  camera.position.fromArray(pose.position);
  camera.up.set(0, 1, 0);
  camera.lookAt(v.fromArray(pose.target));
  camera.fov = pose.fov;
  camera.aspect = aspect;
  camera.near = 0.5;
  camera.far = 5000;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return camera;
}

// Ray from a screen point (in %) onto the horizontal plane y = planeY.
export function screenToPlane(camera, xPct, yPct, planeY = 0) {
  const ndc = new Vector2((xPct / 100) * 2 - 1, 1 - (yPct / 100) * 2);
  const origin = camera.position.clone();
  const dir = new Vector3(ndc.x, ndc.y, 0.5).unproject(camera).sub(origin).normalize();
  const hit = new Vector3();
  const ok = new Ray(origin, dir).intersectPlane(new Plane(new Vector3(0, 1, 0), -planeY), hit);
  return ok ? hit : null;
}

// ---- Nelder–Mead ----------------------------------------------------------

export function nelderMead(f, x0, steps, { iterations = 800, tolerance = 1e-6 } = {}) {
  const n = x0.length;
  let simplex = [x0.slice()];
  for (let i = 0; i < n; i++) {
    const x = x0.slice();
    x[i] += steps[i];
    simplex.push(x);
  }
  let values = simplex.map(f);

  for (let it = 0; it < iterations; it++) {
    const order = values.map((value, i) => [value, i]).sort((a, b) => a[0] - b[0]);
    simplex = order.map(([, i]) => simplex[i]);
    values = order.map(([value]) => value);
    if (Math.abs(values[n] - values[0]) < tolerance) break;

    const centroid = new Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) centroid[j] += simplex[i][j] / n;
    const along = (t) => centroid.map((c, j) => c + t * (simplex[n][j] - c));

    const reflected = along(-1);
    const fr = f(reflected);
    if (fr < values[0]) {
      const expanded = along(-2);
      const fe = f(expanded);
      if (fe < fr) {
        simplex[n] = expanded;
        values[n] = fe;
      } else {
        simplex[n] = reflected;
        values[n] = fr;
      }
    } else if (fr < values[n - 1]) {
      simplex[n] = reflected;
      values[n] = fr;
    } else {
      const contracted = fr < values[n] ? along(-0.5) : along(0.5);
      const fc = f(contracted);
      if (fc < Math.min(fr, values[n])) {
        simplex[n] = contracted;
        values[n] = fc;
      } else {
        for (let i = 1; i <= n; i++) {
          simplex[i] = simplex[i].map((x, j) => simplex[0][j] + 0.5 * (x - simplex[0][j]));
          values[i] = f(simplex[i]);
        }
      }
    }
  }
  const best = values.indexOf(Math.min(...values));
  return { x: simplex[best], value: values[best] };
}

export function createSolverCamera() {
  const camera = new PerspectiveCamera(40, 1.6, 0.5, 5000);
  camera.rotation.order = 'YXZ';
  return camera;
}
