import { MathUtils } from 'three';

// Gives an object its own fadeable copies of its materials and returns a
// setter that fades it and hides it completely at 0.
export function makeFadeable(object) {
  const materials = new Map();
  object.traverse((child) => {
    if (!child.material) return;
    const source = child.material;
    if (!materials.has(source)) {
      const copy = source.clone();
      // clone() drops shader patches such as the city windows.
      copy.onBeforeCompile = source.onBeforeCompile;
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

export function createGating(chapters, targets) {
  // Gates change within the first 40% of a transition: outgoing cards are gone
  // before they cross the copy, incoming subjects are ready while off-frame.
  function weight(fromValue, toValue, eased) {
    if (fromValue === toValue) return fromValue;
    return MathUtils.lerp(fromValue, toValue, Math.min(1, eased / 0.4));
  }

  function update(segment, breakpoint, stepped) {
    const from = chapters[segment.from].visibility[breakpoint];
    const to = chapters[segment.to].visibility[breakpoint];
    const eased = stepped ? Math.round(segment.eased) : segment.eased;
    for (const [key, setOpacity] of Object.entries(targets)) {
      setOpacity(weight(from[key] ?? 1, to[key] ?? 1, eased));
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
