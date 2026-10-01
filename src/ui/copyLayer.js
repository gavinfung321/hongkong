// Places each chapter's copy inside its copy-safe region and fades it by the
// un-damped scroll progress, so text never lags the scrollbar.
import { smoothstep } from '../scroll/cameraRig.js';

const RISE = 48; // px travelled while fading: in from below, out through the top

export function createCopyLayer(sections, chapters, { copyFull, copyFade }) {
  const copies = sections.map((section) => section.querySelector('.chapter__copy'));
  const opacities = copies.map(() => -1);

  function setBreakpoint(breakpoint) {
    copies.forEach((copy, i) => {
      const { left, top, right, bottom } = chapters[i].copy[breakpoint];
      copy.style.setProperty('--copy-left', left);
      copy.style.setProperty('--copy-top', top);
      copy.style.setProperty('--copy-right', right);
      copy.style.setProperty('--copy-bottom', bottom);
    });
  }

  // Chapter 01's copy belongs to the hero: showing on load, leaving with the
  // wordmark from the first scroll (hero.from → hero.to).
  function opacityAt(p, i, hero) {
    if (i === 0) return 1 - smoothstep(hero.from, hero.to, p);
    const distance = Math.abs(p - (i + 0.5));
    if (distance <= copyFull) return 1;
    return Math.max(0, 1 - (distance - copyFull) / copyFade);
  }

  // In stepped mode only the active chapter's copy is shown.
  function update(p, { stepped = false, index = 0, hero } = {}) {
    copies.forEach((copy, i) => {
      const value = stepped ? (i === index ? 1 : 0) : Math.round(opacityAt(p, i, hero) * 100) / 100;
      if (value === opacities[i]) return;
      opacities[i] = value;
      const leaving = i === 0 || p > i + 0.5;
      copy.style.setProperty('--copy-opacity', String(value));
      copy.style.setProperty('--copy-shift', String((leaving ? -1 : 1) * (1 - value) * RISE));
      copy.classList.toggle('is-hidden', value === 0);
    });
  }

  function regionRect(index, breakpoint) {
    return chapters[index].copy[breakpoint];
  }

  return { copies, setBreakpoint, update, regionRect };
}
