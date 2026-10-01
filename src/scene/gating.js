import { MathUtils } from 'three';
import { smoothstep } from '../scroll/cameraRig.js';

// Gives an object its own fadeable copies of its materials and returns a
// setter that fades it and hides it completely at 0.
export function makeFadeable(object) {
  const materials = new Map();
  object.traverse((child) => {
    if (!child.material) return;
    const source = child.material;
    if (!materials.has(source)) {
      const copy = source.clone();
      copy.transparent = true;
      materials.set(source, copy);
    }
    child.material = materials.get(source);
  });
  const list = [...materials.values()];
  let current = -1;
  return function setOpacity(value) {
    if (value === current) return;
    current = value;
    object.visible = value > 0.001;
    for (const material of list) material.opacity = value;
  };
}

// Segment progress over which hold-only targets fade: out at the end of the
// outgoing hold and in at the start of the next, while the camera is at rest.
const HOLD_FADE = 0.06;

// `holdOnly` keys show only on holds: the near railing's posts strobe against
// the bright water when the camera sweeps past them at metres per frame.
export function createGating(chapters, targets, { holdOnly = [], hold = 0.2 } = {}) {
  // Gates change within the first 40% of a transition: outgoing cards are gone
  // before they cross the copy, incoming subjects are ready while off-frame.
  function weight(fromValue, toValue, eased) {
    if (fromValue === toValue) return fromValue;
    return MathUtils.lerp(fromValue, toValue, Math.min(1, eased / 0.4));
  }

  function holdWeight(u) {
    return u < 0.5
      ? 1 - smoothstep(hold - HOLD_FADE, hold, u)
      : smoothstep(1 - hold, 1 - hold + HOLD_FADE, u);
  }

  function update(segment, breakpoint, stepped) {
    const from = chapters[segment.from].visibility[breakpoint];
    const to = chapters[segment.to].visibility[breakpoint];
    const eased = stepped ? Math.round(segment.eased) : segment.eased;
    for (const [key, setOpacity] of Object.entries(targets)) {
      const value = weight(from[key] ?? 1, to[key] ?? 1, eased);
      setOpacity(holdOnly.includes(key) && !stepped ? value * holdWeight(segment.u) : value);
    }
  }

  function fogDensity(segment) {
    return MathUtils.lerp(
      chapters[segment.from].fogDensity,
      chapters[segment.to].fogDensity,
      segment.eased,
    );
  }

  return { update, fogDensity };
}
