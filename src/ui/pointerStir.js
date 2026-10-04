// Desktop pointer stir (user choice, 2026-10-04): the moving mouse pushes the
// petals and the story's motes aside and carries them along a little; they
// settle again once it rests. No glow or trail of its own. Gives the pointer
// in ndc (-1..1, +y up), its smoothed velocity (ndc per second), a strength
// 0..1 that rises with speed and dies away when it stops, and whether the
// pointer is over the page (`present`; the cursor motes follow it).

const FOLLOW = 12; // per second: velocity smoothing
const FULL_SPEED = 1.5; // ndc per second for full strength
const DECAY = 1.6; // per second

export function createPointerStir() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const state = { x: 0, y: 0, vx: 0, vy: 0, strength: 0, present: false };
  const moved = { x: 0, y: 0 };
  let seen = false;

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = 1 - (event.clientY / window.innerHeight) * 2;
    if (seen) {
      moved.x += x - state.x;
      moved.y += y - state.y;
    }
    state.x = x;
    state.y = y;
    seen = true;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => {
    seen = false;
    moved.x = moved.y = 0;
  });

  function update(dt) {
    if (dt > 0) {
      const k = 1 - Math.exp(-FOLLOW * dt);
      state.vx += (moved.x / dt - state.vx) * k;
      state.vy += (moved.y / dt - state.vy) * k;
    }
    moved.x = moved.y = 0;
    state.present = seen;
    const speed = Math.hypot(state.vx, state.vy);
    state.strength = Math.max(Math.min(1, speed / FULL_SPEED), state.strength * Math.exp(-DECAY * dt));
    if (!seen) state.strength *= Math.exp(-DECAY * 2 * dt);
    return state;
  }

  return {
    update,
    get enabled() {
      return fine.matches;
    },
  };
}
