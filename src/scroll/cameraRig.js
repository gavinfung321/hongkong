import { CatmullRomCurve3, MathUtils, Vector3 } from 'three';

const AUTHORED_DESKTOP_ASPECT = 1.6;
const MAX_FOV_WIDENING = 15;
const LOOK_DISTANCE = 400;
// Arc-length samples per curve span; keyframes fall exactly on samples.
const ARC_SAMPLES = 200;
// Camera swing in metres at full mouse travel (pointerParallax.js). The camera
// orbits a point LOOK_DISTANCE ahead, so the foreground slides one way and the
// far skyline the other. Vertical stays small: raising or lowering the eye
// changes the angle onto the water, which only the glassy water hides.
export const PARALLAX = { x: 1.6, y: 0.6 };

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

// Poses with `keepHeight` keep their vertical framing on narrow screens and
// lose the sides instead.
export function poseFov(pose, aspect, breakpoint) {
  return pose.keepHeight ? pose.fov : fovForAspect(pose.fov, aspect, breakpoint);
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
  const shift = new Vector3();
  const parallax = { x: 0, y: 0 };

  // Curve index of each keyframe; `via` waypoints sit between keyframes.
  let keyIndex = [];
  // Arc length along the camera path at each keyframe.
  let keyLength = [];

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
      const via = (pose.via ?? []).map((point) => new Vector3().fromArray(point));
      if (!via.length) return;
      // The look turns with distance travelled, matching the arc-length pacing.
      const stops = [position, ...via, new Vector3().fromArray(poses[i + 1].position)];
      const legs = stops.slice(1).map((stop, j) => stop.distanceTo(stops[j]));
      const total = legs.reduce((sum, leg) => sum + leg, 0);
      let travelled = 0;
      via.forEach((viaPosition, j) => {
        travelled += legs[j];
        const f = pose.viaTurn?.[j] ?? travelled / total;
        const dir = directions[i].clone().lerp(directions[i + 1], f).normalize();
        positions.push(viaPosition);
        targets.push(viaPosition.clone().addScaledVector(dir, LOOK_DISTANCE));
      });
    });
    positionCurve = new CatmullRomCurve3(positions, false, 'centripetal');
    targetCurve = new CatmullRomCurve3(targets, false, 'centripetal');
    const spans = positions.length - 1;
    positionCurve.arcLengthDivisions = spans * ARC_SAMPLES;
    const lengths = positionCurve.getLengths();
    keyLength = keyIndex.map((index) => lengths[index * ARC_SAMPLES]);
  }

  // Curve parameter at `eased` of the way from keyframe `from` to `to`, by
  // distance, so the camera keeps an even pace through via waypoints.
  function curveParam(segment) {
    const a = keyLength[segment.from];
    const b = keyLength[segment.to];
    if (segment.eased <= 0) return keyIndex[segment.from] / (positionCurve.points.length - 1);
    if (segment.eased >= 1) return keyIndex[segment.to] / (positionCurve.points.length - 1);
    return positionCurve.getUtoTmapping(0, a + (b - a) * segment.eased);
  }

  function setAspect(value) {
    aspect = value;
  }

  // x, y in -1..1 (+x right, +y up).
  function setParallax(x, y) {
    parallax.x = x;
    parallax.y = y;
  }

  // Moves the camera sideways; the target stays put. Full strength on holds,
  // zero halfway through a transition.
  // Each hold's own share applies; the switch happens at zero strength.
  function parallaxOffset(segment, out) {
    const e = segment.eased;
    const share = poses[e < 0.5 ? segment.from : segment.to].parallax ?? 1;
    const strength = (1 - 4 * e * (1 - e)) * share;
    direction.set(target.x - camera.position.x, 0, target.z - camera.position.z).normalize();
    return out
      .set(-direction.z, 0, direction.x)
      .multiplyScalar(parallax.x * PARALLAX.x * strength)
      .setY(parallax.y * PARALLAX.y * strength);
  }

  // Progress at the top of the page; the opening push starts there.
  let start = 0.5 - hold;
  function setStart(value) {
    start = Math.min(value, 0.5 - hold);
  }

  // A steady push that starts on the first scroll and passes through zero at
  // keyframe 01, so the authored pose is exact at p = 0.5.
  function holdDollyOffset(p, segment, out) {
    const vector = poses[0].holdDolly;
    out.set(0, 0, 0);
    if (!vector) return out;
    const ramp = (MathUtils.clamp((p - 0.5) / (0.5 - start), -1, 1)) * 0.5;
    const fade = segment.from === 0 ? 1 - segment.eased : 0;
    return out.fromArray(vector).multiplyScalar(ramp * fade);
  }

  // Poses the camera for global progress p. In stepped mode p is an integer
  // keyframe position (k + 0.5) and there is no hold dolly.
  function update(p, { stepped = false } = {}) {
    const segment = segmentAt(p, hold, count);
    const t = MathUtils.clamp(curveParam(segment), 0, 1);
    positionCurve.getPoint(t, camera.position);
    targetCurve.getPoint(t, target);

    if (!stepped) {
      holdDollyOffset(p, segment, dolly);
      camera.position.add(dolly);
      target.add(dolly);
      parallaxOffset(segment, shift);
      camera.position.add(shift);
    }

    const fromFov = poseFov(poses[segment.from], aspect, breakpoint);
    const toFov = poseFov(poses[segment.to], aspect, breakpoint);
    camera.fov = MathUtils.lerp(fromFov, toFov, segment.eased);
    aimCamera(camera, camera.position, target);
    return segment;
  }

  function lookDirection(out = direction) {
    return out.copy(target).sub(camera.position).normalize();
  }

  return {
    setBreakpoint,
    setAspect,
    setParallax,
    setStart,
    update,
    lookDirection,
    // The mouse parallax offset applied this frame.
    get shift() {
      return shift;
    },
    get breakpoint() {
      return breakpoint;
    },
    get poses() {
      return poses;
    },
  };
}
