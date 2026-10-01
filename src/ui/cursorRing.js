// A thin ring that trails the mouse pointer with a soft lag (desktop only).
// The system pointer stays visible; the ring is decoration and ignores input.

const FOLLOW = 12; // per second; higher catches up faster
const INTERACTIVE = 'a, button, [role="button"]';

export function createCursorRing() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches || reduced.matches) return;

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(ring);

  const target = { x: 0, y: 0 };
  const shown = { x: 0, y: 0 };
  let last = 0;
  let frame = 0;

  function tick(time) {
    const dt = last ? Math.min((time - last) / 1000, 0.1) : 0;
    last = time;
    const k = 1 - Math.exp(-FOLLOW * dt);
    shown.x += (target.x - shown.x) * k;
    shown.y += (target.y - shown.y) * k;
    ring.style.transform = `translate3d(${shown.x}px, ${shown.y}px, 0)`;
    // Sleeps once settled, so an idle mouse costs nothing.
    if (Math.abs(target.x - shown.x) + Math.abs(target.y - shown.y) > 0.1) frame = requestAnimationFrame(tick);
    else frame = 0;
  }

  function wake() {
    if (frame) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  }

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    target.x = event.clientX;
    target.y = event.clientY;
    if (!ring.classList.contains('is-visible')) {
      shown.x = target.x;
      shown.y = target.y;
      ring.classList.add('is-visible');
    }
    ring.classList.toggle('is-over-link', Boolean(event.target.closest?.(INTERACTIVE)));
    wake();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => ring.classList.remove('is-visible'));
  window.addEventListener('pointerdown', () => ring.classList.add('is-pressed'));
  window.addEventListener('pointerup', () => ring.classList.remove('is-pressed'));
}
