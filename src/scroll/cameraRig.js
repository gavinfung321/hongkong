import { CatmullRomCurve3, MathUtils, Vector3 } from 'three';

const AUTHORED_DESKTOP_ASPECT = 1.6;
const MAX_FOV_WIDENING = 15;
const LOOK_DISTANCE = 400;

export function smoothstep(edge0, edge1, x) {
  const t = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// Keyframe k sits at p = k + 0.5. Returns the segment and its held easing.
export function segmentAt(p, hold, count) {
  const s = MathUtils.clamp(p - 0.5, 0, count - 1);
  const from = Math.min(count - 2, Math.floor(s));
  const u = s - from;
  return { from, to: from + 1, u, eased: smoothstep(hold, 1 - hold, u) };
}

// Desktop keyframes are authored at 1.6; narrower landscape screens widen the
// vertical fov so the authored horizontal framing survives.
export function fovForAspect(fov, aspect, breakpoint) {
  if (breakpoint !== 'desktop' || aspect >= AUTHORED_DESKTOP_ASPECT) return fov;
  const half = MathUtils.degToRad(fov / 2);
  const widened = MathUtils.radToDeg(2 * Math.atan((Math.tan(half) * AUTHORED_DESKTOP_ASPECT) / aspect));
  return Math.min(widened, fov + MAX_FOV_WIDENING);
}

const levelTarget = new Vector3();

// Shift lens: the camera stays level (so verticals stay vertical) and the
// frustum slides up or down until `target` sits at the centre of the frame.
// Call after setting fov and aspect.
export function aimCamera(camera, position, target) {
  camera.position.copy(position);
  const dx = target.x - position.x;
  const dz = target.z - position.z;
  const tanPitch = (target.y - position.y) / Math.max(Math.hypot(dx, dz), 1e-6);
  camera.up.set(0, 1, 0);
  camera.lookAt(levelTarget.set(target.x, position.y, target.z));
  const halfHeight = Math.tan(MathUtils.degToRad(camera.fov / 2));
  // setViewOffset also sets aspect = fullWidth / fullHeight.
  camera.setViewOffset(camera.aspect, 1, 0, -tanPitch / (2 * halfHeight), camera.aspect, 1);
}

export function createCameraRig(camera, chapters, { hold }) {
  const count = chapters.length;
  let positionCurve;
  let targetCurve;
  let poses = [];
  let breakpoint = 'desktop';
  let aspect = 1.6;
  const dolly = new Vector3();
  const target = new Vector3();
  const direction = new Vector3();

  // Curve index of each keyframe; `via` waypoints sit between keyframes.
  let keyIndex = [];

  function setBreakpoint(next) {
    breakpoint = next;
    poses = chapters.map((c) => c.camera[breakpoint]);
    // Targets are normalised to a fixed distance so transitions turn smoothly
    // no matter how far away each authored target is.
    const directions = poses.map((pose) =>
      new Vector3().fromArray(pose.target).sub(new Vector3().fromArray(pose.position)).normalize(),
    );
    const positions = [];
    const targets = [];
    keyIndex = [];
    poses.forEach((pose, i) => {
      keyIndex.push(positions.length);
      const position = new Vector3().fromArray(pose.position);
      positions.push(position);
      targets.push(position.clone().addScaledVector(directions[i], LOOK_DISTANCE));
      const via = pose.via ?? [];
      via.forEach((point, j) => {
        const f = (j + 1) / (via.length + 1);
        const dir = directions[i].clone().lerp(directions[i + 1], f).normalize();
        const viaPosition = new Vector3().fromArray(point);
        positions.push(viaPosition);
        targets.push(viaPosition.clone().addScaledVector(dir, LOOK_DISTANCE));
      });
    });
    positionCurve = new CatmullRomCurve3(positions, false, 'centripetal');
    targetCurve = new CatmullRomCurve3(targets, false, 'centripetal');
  }

  function setAspect(value) {
    aspect = value;
  }

  function holdDollyOffset(p, segment, out) {
    const vector = poses[0].holdDolly;
    out.set(0, 0, 0);
    if (!vector) return out;
    const ramp = smoothstep(0.5 - hold, 0.5 + hold, p) - 0.5;
    const fade = segment.from === 0 ? 1 - segment.eased : 0;
    return out.fromArray(vector).multiplyScalar(ramp * fade);
  }

  // Poses the camera for global progress p. In stepped mode p is an integer
  // keyframe position (k + 0.5) and there is no hold dolly.
  function update(p, { stepped = false } = {}) {
    const segment = segmentAt(p, hold, count);
    const a = keyIndex[segment.from];
    const b = keyIndex[segment.to];
    const t = MathUtils.clamp((a + (b - a) * segment.eased) / (positionCurve.points.length - 1), 0, 1);
    positionCurve.getPoint(t, camera.position);
    targetCurve.getPoint(t, target);

    if (!stepped) {
      holdDollyOffset(p, segment, dolly);
      camera.position.add(dolly);
      target.add(dolly);
    }

    const fromFov = poses[segment.from].fov;
    const toFov = poses[segment.to].fov;
    const fov = MathUtils.lerp(fromFov, toFov, segment.eased);
    camera.fov = fovForAspect(fov, aspect, breakpoint);
    aimCamera(camera, camera.position, target);
    return segment;
  }

  function lookDirection(out = direction) {
    return out.copy(target).sub(camera.position).normalize();
  }

  return {
    setBreakpoint,
    setAspect,
    update,
    lookDirection,
    get breakpoint() {
      return breakpoint;
    },
    get poses() {
      return poses;
    },
  };
}
