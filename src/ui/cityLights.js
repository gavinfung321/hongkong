// 05's arrival (user choices, 2026-10-04; progressive pass, 2026-10-05):
// a band of light crosses the title with scroll, like the searchlights behind
// IFC. It reverses with the scroll; stepped mode shows the plain title.
import { SCENE_05_CALLOUTS } from '../story/scene05/config.js';

export function createCityLights(copy) {
  const title = copy.querySelector('.chapter__title--sweep');
  const hints = [...(copy.closest('.chapter')?.querySelectorAll('[data-light-hint]') ?? [])];
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
  let shown = -1;
  let breakpoint = '';

  function syncHints() {
    const nextBreakpoint = root.dataset.breakpoint === 'mobile' ? 'mobile' : 'desktop';
    if (breakpoint === nextBreakpoint) return;
    breakpoint = nextBreakpoint;
    for (const hint of hints) {
      const key = hint.dataset.lightHint === 'wheel' ? 'wheel' : 'skyline';
      const position = SCENE_05_CALLOUTS.positions[breakpoint][key];
      const label = hint.querySelector('[data-light-hint-label]');
      hint.style.setProperty('--cue-x', String(position.x));
      hint.style.setProperty('--cue-y', String(position.y));
      hint.style.setProperty('--cue-angle', `${position.angle}deg`);
      if (label) label.textContent = hint.dataset[breakpoint] ?? '';
    }
  }

  function hintFor(key) {
    return hints.find((hint) => hint.dataset.lightHint === key);
  }

  function setDim(key, dim) {
    hintFor(key)?.toggleAttribute('data-dim', dim);
  }

  syncHints();
  window.addEventListener('citylighthover', (event) => setDim('skyline', event.detail));
  window.addEventListener('wheelridehover', (event) => setDim('wheel', event.detail));
  window.addEventListener('citylightreset', () => {
    setDim('skyline', false);
    setDim('wheel', false);
  });

  function update(level, instant) {
    syncHints();
    const value = instant || !root.classList.contains('is-ready')
      ? 0
      : Math.round(Math.min(1, Math.max(0, level)) * 1000) / 1000;
    if (value === shown) return;
    shown = value;
    title?.style.setProperty('--sweep', String(value));
    title?.style.setProperty('--sweep-position', `${(1 - value) * 100}%`);
  }

  return { update };
}
