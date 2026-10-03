// Places each chapter's copy inside its copy-safe region and fades it by the
// un-damped scroll progress, so text never lags the scrollbar, but no further
// in than the damped camera allows: on a quick scroll a chapter's copy waits
// for its scene instead of flashing over the previous one.
import { smoothstep } from '../scroll/cameraRig.js';

const RISE = 48; // px travelled while fading: in from below, out through the top

export function createCopyLayer(sections, chapters, { copyFull, copyFade }) {
  const copies = sections.map((section) => section.querySelector('.chapter__copy'));
  const opacities = copies.map(() => -1);
  const root = document.documentElement;

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
  function update(p, { stepped = false, index = 0, hero, rendered = p } = {}) {
    copies.forEach((copy, i) => {
      const shown = i === 0 ? opacityAt(p, i, hero) : Math.min(opacityAt(p, i, hero), opacityAt(rendered, i, hero));
      const value = stepped ? (i === index ? 1 : 0) : Math.round(shown * 100) / 100;
      if (value === opacities[i]) return;
      opacities[i] = value;
      const leaving = i === 0 || p > i + 0.5;
      const shift = String((leaving ? -1 : 1) * (1 - value) * RISE);
      copy.style.setProperty('--copy-opacity', String(value));
      copy.style.setProperty('--copy-shift', shift);
      // The vertical 東方明珠 title moves with chapter 01's copy.
      if (i === 0) {
        root.style.setProperty('--intro-copy-opacity', String(value));
        root.style.setProperty('--intro-copy-shift', shift);
      }
      copy.classList.toggle('is-hidden', value === 0);
    });
  }

  function regionRect(index, breakpoint) {
    return chapters[index].copy[breakpoint];
  }

  return { copies, setBreakpoint, update, regionRect };
}
