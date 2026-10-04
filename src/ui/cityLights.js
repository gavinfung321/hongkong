// 05's arrival (user choices, 2026-10-04): a band of light sweeps once
// across the title, like the searchlights behind IFC, when the copy comes.
// Leaving resets it; stepped mode shows the title without it. It waits for
// the entrance cover to lift.
export function createCityLights(copy) {
  const title = copy.querySelector('.chapter__title--sweep');
  const root = document.documentElement;
  // The sweep is a copy of the title laid over it (styles.css), hidden from
  // screen readers.
  if (title) {
    const sweep = document.createElement('span');
    sweep.className = 'chapter__title-sweep';
    sweep.setAttribute('aria-hidden', 'true');
    sweep.textContent = title.textContent;
    title.append(sweep);
  }
  let on = false;

  // shown: the copy is in.
  function update(shown, instant) {
    if (!shown || !root.classList.contains('is-ready')) {
      if (on) title?.removeAttribute('data-swept');
      on = false;
      return;
    }
    if (on) return;
    on = true;
    if (!instant) title?.setAttribute('data-swept', '');
  }

  return { update };
}
