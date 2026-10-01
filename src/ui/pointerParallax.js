// Desktop mouse parallax: a damped pointer position, -1..1 on each axis
// (+x right, +y up). The camera rig turns it into a small camera shift.

const FOLLOW = 1.5; // per second; lower drifts more lazily (and the water shimmers less)

export function createPointerParallax() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const target = { x: 0, y: 0 };
  const value = { x: 0, y: 0 };
  const clamp = (v) => Math.max(-1, Math.min(1, v));

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    target.x = clamp((event.clientX / window.innerWidth) * 2 - 1);
    target.y = clamp(1 - (event.clientY / window.innerHeight) * 2);
  }, { passive: true });
  // Drifts back to the authored pose when the pointer leaves the window.
  document.documentElement.addEventListener('pointerleave', () => {
    target.x = 0;
    target.y = 0;
  });

  function update(dt) {
    const k = 1 - Math.exp(-FOLLOW * dt);
    value.x += (target.x - value.x) * k;
    value.y += (target.y - value.y) * k;
    return value;
  }

  return {
    update,
    get enabled() {
      return fine.matches;
    },
  };
}
