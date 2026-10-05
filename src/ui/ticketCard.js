// 03's ticket (user requests, 2026-10-04): a stiff card, not cloth. It
// sways about a degree in the plane, like a card on a pin; under a mouse it
// tilts toward the pointer as one flat piece, a band of light follows the
// pointer across it and the stub lifts at the perforation (styles.css reads
// --sway, --hover, --tilt-x and --tilt-y). On touch screens a tap plays the
// same for the configured tap duration (user choice, 2026-10-04). It flips in
// on its top edge (copyLayer.js). Continuous mode only; stepped mode keeps it still.
import { SCENE_03_TICKET } from '../story/scene03/config.js';

export function createTicket(root) {
  const figure = root.querySelector('.chapter__ticket');
  if (!figure) return { update() {} };
  const card = figure.querySelector('.chapter__ticket-card');
  const copy = figure.closest('.chapter__copy');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  let time = Math.random() * 100;
  let hover = 0;
  let hoverTarget = 0;
  let tap = 0;
  const pointer = [0.5, 0.5];
  const tilt = [0, 0];

  function aim(event) {
    const rect = card.getBoundingClientRect();
    pointer[0] = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    pointer[1] = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
  }

  function rest() {
    hoverTarget = 0;
    pointer[0] = 0.5;
    pointer[1] = 0.5;
  }

  card.addEventListener('pointerenter', (event) => {
    if (fine.matches && event.pointerType === 'mouse') hoverTarget = 1;
  });
  card.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') rest();
  });
  card.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'mouse') aim(event);
  });
  card.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    aim(event);
    hoverTarget = 1;
    tap = SCENE_03_TICKET.tapSeconds;
  });

  function update(dt) {
    if (figure.hasAttribute('data-enter-hidden') || copy.classList.contains('is-hidden')) {
      hover = 0;
      hoverTarget = 0;
      tap = 0;
      return;
    }
    time += dt;
    if (tap > 0) {
      tap -= dt;
      if (tap <= 0) rest();
    }
    const ease = (rate) => 1 - Math.exp(-dt * rate);
    hover += (hoverTarget - hover) * ease(6);
    tilt[0] += (pointer[0] * 2 - 1 - tilt[0]) * ease(8);
    tilt[1] += (pointer[1] * 2 - 1 - tilt[1]) * ease(8);
    const sway = 0.7 * Math.sin(0.55 * time) + 0.3 * Math.sin(1.3 * time + 1.1);
    card.style.setProperty('--sway', sway.toFixed(3));
    card.style.setProperty('--hover', hover.toFixed(3));
    card.style.setProperty('--tilt-x', tilt[0].toFixed(3));
    card.style.setProperty('--tilt-y', tilt[1].toFixed(3));
  }

  return { update };
}
