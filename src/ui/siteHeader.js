// Logo, nav, chapter counter and the menu panel. Jumps are handled by the
// document-level anchor handler in main.js; this module only tracks state.

export function createSiteHeader() {
  const root = document.documentElement;
  const links = [...document.querySelectorAll('[data-nav-index]')];
  const compact = document.querySelector('.chapter-counter__current');
  const button = document.querySelector('.menu-button');
  const menu = document.getElementById('site-menu');
  const closeButton = menu.querySelector('.site-menu__close');
  const background = ['.site-header', '#story', '.chapter-counter', '.site-footer'].map((s) =>
    document.querySelector(s),
  );
  let current = null;
  let hero = null;

  function setOpen(open, { restoreFocus = true } = {}) {
    if (open === !menu.hidden) return;
    menu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-menu-open', open);
    for (const element of background) element.inert = open;
    if (open) closeButton.focus();
    else if (restoreFocus) button.focus();
  }

  button.addEventListener('click', () => setOpen(true));
  closeButton.addEventListener('click', () => setOpen(false));
  // Runs before the document-level jump handler, which then moves focus to the chapter.
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false, { restoreFocus: false });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) setOpen(false);
  });

  // Slides away while scrolling down and comes back on any scroll up.
  const header = background[0];
  let lastY = window.scrollY;
  function onScroll() {
    // Clamped so iOS overscroll bounce at either end doesn't count as a direction change.
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = Math.min(Math.max(window.scrollY, 0), max);
    if (Math.abs(y - lastY) < 6) return;
    root.classList.toggle('is-header-hidden', y > lastY && y > header.offsetHeight);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  header.addEventListener('focusin', () => root.classList.remove('is-header-hidden'));

  // `hero` is true above chapter 01's copy, where no chapter is current yet.
  function update(index, inHero) {
    if (inHero !== hero) {
      hero = inHero;
      root.dataset.hero = String(inHero);
    }
    const next = inHero ? -1 : index;
    if (next === current) return;
    current = next;
    for (const link of links) {
      if (Number(link.dataset.navIndex) === current) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    }
    compact.textContent = String(Math.max(0, current) + 1).padStart(2, '0');
  }

  return { update, close: () => setOpen(false) };
}
