import { MathUtils } from 'three';

// Gives an object its own fadeable copies of its materials and returns a
// setter that fades it and hides it completely at 0.
export function makeFadeable(object) {
  const materials = new Map();
  const fadeable = (source) => {
    if (!materials.has(source)) {
      const copy = source.clone();
      // clone() drops shader patches such as the city windows, and their
      // program cache keys.
      copy.onBeforeCompile = source.onBeforeCompile;
      copy.customProgramCacheKey = source.customProgramCacheKey;
      copy.transparent = true;
      materials.set(source, copy);
    }
    return materials.get(source);
  };
  object.traverse((child) => {
    if (!child.material) return;
    child.material = Array.isArray(child.material) ? child.material.map(fadeable) : fadeable(child.material);
  });
  const list = [...materials.values()];
  // Its lights (direct children) stay in the scene at zero while it is hidden:
  // a change in the scene's light count rebuilds every lit shader mid-scroll.
  const lights = object.children.filter((child) => child.isLight).map((light) => [light, light.intensity]);
  const parts = lights.length ? object.children.filter((child) => !child.isLight) : [object];
  let current = -1;
  return function setOpacity(value) {
    if (value === current) return;
    current = value;
    const shown = value > 0.001;
    for (const part of parts) part.visible = shown;
    for (const [light, intensity] of lights) light.intensity = shown ? intensity : 0;
    for (const material of list) material.opacity = value;
  };
}

// `windows`: per key, { in, out } as the [start, end] of the transition over
// which the gate opens or closes instead, for subjects that are in frame
// mid-transition and would otherwise show while crossing something.
export function createGating(chapters, targets, windows = {}) {
  // Gates change within the first 40% of a transition: outgoing cards are gone
  // before they cross the copy, incoming subjects are ready while off-frame.
  function weight(key, fromValue, toValue, eased) {
    if (fromValue === toValue) return fromValue;
    const [start, end] = windows[key]?.[toValue > fromValue ? 'in' : 'out'] ?? [0, 0.4];
    return MathUtils.lerp(fromValue, toValue, MathUtils.clamp((eased - start) / (end - start), 0, 1));
  }

  function update(segment, breakpoint, stepped) {
    const from = chapters[segment.from].visibility[breakpoint];
    const to = chapters[segment.to].visibility[breakpoint];
    const eased = stepped ? Math.round(segment.eased) : segment.eased;
    for (const [key, setOpacity] of Object.entries(targets)) {
      setOpacity(weight(key, from[key] ?? 1, to[key] ?? 1, eased));
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
