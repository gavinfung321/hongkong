// Tracks how far the footer has risen: --footer-in goes 0 → 1 over its first
// half screen (or its full height, if shorter). The chapter copy, vertical
// label and side pager fade with it; past halfway they stop taking clicks.

export function createSiteFooter() {
  const root = document.documentElement;
  const footer = document.querySelector('.site-footer');
  let current = -1;

  function update() {
    const rise = Math.min(footer.offsetHeight, window.innerHeight * 0.5);
    const risen = window.innerHeight - footer.getBoundingClientRect().top;
    const value = Math.round(Math.min(Math.max(risen / rise, 0), 1) * 100) / 100;
    if (value === current) return;
    current = value;
    root.style.setProperty('--footer-in', String(value));
    root.classList.toggle('is-at-footer', value > 0.5);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}
