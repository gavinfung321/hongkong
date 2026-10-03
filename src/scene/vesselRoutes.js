import { CatmullRomCurve3, Vector3 } from 'three';

// A vessel's route through the chapters for one breakpoint (chapters.js,
// `vessels`): its [x, z, heading] at each chapter's hold, any `via` points
// [x, z, heading] it passes on the way to the next chapter, and its `drift`
// [before, after], the metres it sails along its heading through each hold
// up to and on from the keyframe. Kept free of meshes so the routes can be
// checked outside the browser.

const tangent = new Vector3();
const lerpAngle = (a, b, t) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * t;
const headingFrom = (v) => Math.atan2(-v.z, v.x);

export function vesselRoute(chapters, breakpoint, key) {
  const points = [];
  const headings = [];
  const keyIndex = [];
  chapters.forEach((chapter, i) => {
    const vessels = chapter.vessels[breakpoint];
    keyIndex.push(points.length);
    const [x, z, heading] = vessels[key];
    points.push(new Vector3(x, 0, z));
    headings.push(heading);
    if (i === chapters.length - 1) return;
    for (const [vx, vz, vh] of vessels.via?.[key] ?? []) {
      points.push(new Vector3(vx, 0, vz));
      headings.push(vh);
    }
  });
  return {
    curve: new CatmullRomCurve3(points, false, 'centripetal'),
    headings,
    keyIndex,
    drift: chapters.map((chapter) => chapter.vessels[breakpoint].drift?.[key] ?? [0, 0]),
  };
}

// Places a vessel for the camera's segment ({ from, to, u, eased }; `hold`
// is SCROLL.hold): position on the water and heading. Vessels share the
// camera's held easing, so a hold's composition sits at its keyframe; the
// drift then carries the vessel on through the hold at an even pace and
// blends into the moves, so it never stops dead.
export function vesselPose(route, segment, hold, out) {
  const { curve, headings, keyIndex, drift } = route;
  const { from, to, u, eased } = segment;
  const last = curve.points.length - 1;
  const s = keyIndex[from] + (keyIndex[to] - keyIndex[from]) * eased;
  const t = Math.min(1, Math.max(0, s / last));
  curve.getPoint(t, out.position);
  curve.getTangent(Math.min(0.999, Math.max(0.001, t)), tangent);
  const along = tangent.lengthSq() > 1e-6 ? headingFrom(tangent) : 0;
  const i = Math.min(last - 1, Math.floor(s));
  out.heading = lerpAngle(headings[i] ?? along, headings[i + 1] ?? along, s - i);
  const sail = (drift[from][1] * u * (1 - eased) + drift[to][0] * (u - 1) * eased) / hold;
  out.position.x += Math.cos(out.heading) * sail;
  out.position.z -= Math.sin(out.heading) * sail;
  return out;
}
