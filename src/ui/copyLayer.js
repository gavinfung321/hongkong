// Places each chapter's copy inside its copy-safe region and fades it by the
// un-damped scroll progress, so text never lags the scrollbar.

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

  // Chapter 01's copy is already showing in the hero, from the moment the page loads.
  function opacityAt(p, i) {
    if (i === 0 && p < 0.5) return 1;
    const distance = Math.abs(p - (i + 0.5));
    if (distance <= copyFull) return 1;
    return Math.max(0, 1 - (distance - copyFull) / copyFade);
  }

  // In stepped mode only the active chapter's copy is shown.
  function update(p, { stepped = false, index = 0 } = {}) {
    copies.forEach((copy, i) => {
      const value = stepped ? (i === index ? 1 : 0) : Math.round(opacityAt(p, i) * 100) / 100;
      if (value === opacities[i]) return;
      opacities[i] = value;
      copy.style.setProperty('--copy-opacity', String(value));
      copy.classList.toggle('is-hidden', value === 0);
    });
  }

  function regionRect(index, breakpoint) {
    return chapters[index].copy[breakpoint];
  }

  return { copies, setBreakpoint, update, regionRect };
}
