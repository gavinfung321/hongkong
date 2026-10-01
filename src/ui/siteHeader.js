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
