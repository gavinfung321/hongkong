// Logo, nav, chapter counter and the menu panel. Jumps are handled by the
// document-level anchor handler in main.js; this module only tracks state.

export function createSiteHeader() {
  const root = document.documentElement;
  const links = [...document.querySelectorAll('[data-nav-index]')];
  const compact = document.querySelector('.chapter-counter__current');
  const labels = [...document.querySelectorAll('[data-label-index]')];
  const button = document.querySelector('.menu-button');
  const menu = document.getElementById('site-menu');
  const closeButton = menu.querySelector('.site-menu__close');
  const background = ['.site-header', '#story', '.chapter-counter', '.side-pager', '.site-footer'].map((s) =>
    document.querySelector(s),
  );
  const card = buildCard(menu, closeButton);
  let current = null;
  let hero = null;
  let hideTimer = 0;

  function setOpen(open, { restoreFocus = true } = {}) {
    if (open === root.classList.contains('is-menu-open')) return;
    clearTimeout(hideTimer);
    if (open) {
      menu.hidden = false;
      // Commits the closed state first, so the card's opening transition runs.
      void menu.offsetWidth;
    }
    button.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-menu-open', open);
    for (const element of background) element.inert = open;
    if (open) closeButton.focus();
    else {
      // The phone card fades out before it is hidden; the desktop panel hides at once.
      const ms = parseFloat(getComputedStyle(menu).transitionDuration) * 1000;
      if (ms > 0) hideTimer = setTimeout(() => (menu.hidden = true), ms);
      else menu.hidden = true;
      if (restoreFocus) button.focus();
    }
  }

  button.addEventListener('click', () => setOpen(true));
  closeButton.addEventListener('click', () => setOpen(false));
  // Runs before the document-level jump handler, which then moves focus to the chapter.
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false, { restoreFocus: false });
    // On phones the card floats over a backdrop, and a tap on the backdrop
    // closes it; on desktop the card has no box and the panel stays open.
    else if (event.target === menu && card.getBoundingClientRect().width) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && root.classList.contains('is-menu-open')) setOpen(false);
  });

  // Slides away while scrolling down and comes back on any scroll up.
  const header = background[0];
  let lastY = window.scrollY;
  function onScroll() {
    // Clamped so iOS overscroll bounce at either end doesn't count as a direction change.
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = Math.min(Math.max(window.scrollY, 0), max);
    if (Math.abs(y - lastY) < 6) return;
    // A move of more than a screen is a jump (nav, menu, Return): the header stays.
    if (Math.abs(y - lastY) > window.innerHeight) {
      root.classList.remove('is-header-hidden');
      lastY = y;
      return;
    }
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
    // The hero shows chapter 01's copy, so it shows 01's label too.
    for (const label of labels) {
      const i = Number(label.dataset.labelIndex);
      label.classList.toggle('is-current', i === Math.max(0, current));
      label.classList.toggle('is-past', i < current);
    }
  }

  return { update, close: () => setOpen(false) };
}

// The close button and list move into a card with a small header; styles.css
// draws it as a floating card on phones and as the full-screen panel on desktop.
function buildCard(menu, closeButton) {
  const root = document.documentElement;
  if (!CSS.supports('backdrop-filter', 'blur(1px)') && !CSS.supports('-webkit-backdrop-filter', 'blur(1px)')) {
    root.classList.add('no-backdrop-blur');
  }
  const mark = document.querySelector('.brand__mark').cloneNode(true);
  mark.classList.add('site-menu__mark');
  const heading = document.createElement('p');
  heading.className = 'site-menu__heading';
  heading.setAttribute('aria-hidden', 'true');
  heading.textContent = 'Chapters';
  const head = document.createElement('div');
  head.className = 'site-menu__head';
  head.append(mark, heading, closeButton);
  const body = document.createElement('div');
  body.className = 'site-menu__card';
  body.append(head, menu.querySelector('.site-menu__list'));
  menu.append(body);
  return body;
}
