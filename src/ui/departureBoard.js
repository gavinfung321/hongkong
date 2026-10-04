// 03's departure board (user choices, 2026-10-04): split-flap tiles that
// flip through a few letters before landing, left to right, as the board
// comes in. The "due" row counts down on its own clock, reaching ARRIVING
// about 4 s after the board arrives, as visitors stay only a few seconds;
// scrolling the route dot (copyLayer.js) can run it ahead, never back (user
// choice, 2026-10-04). It flips only the tiles that change. Leaving the
// chapter blanks the tiles so they flip in again on return. Stepped mode
// sets the words directly.
// English only in the tiles; the Chinese is in the labels and the route
// panel's "Central 中環" (user choice, 2026-10-04).
const TO = 'CENTRAL';
const DUE = ['   3 MIN', '   2 MIN', '   1 MIN', 'ARRIVING'];
const LATIN = 'ABCDEFGHIJKLMNOPRSTUVWXYZ0123456789';
const TICK = 55; // ms per flip
const DUE_LEAD = 400; // ms before the clock starts, so 3 MIN lands and reads
const DUE_STEP = 1200; // ms per countdown step

export function createDepartureBoard(element) {
  const tiles = [];
  const make = (row) => {
    const el = document.createElement('span');
    el.className = 'chapter__board-tile';
    row.append(el);
    const tile = { el, shown: ' ', target: ' ', flips: 0, odd: false };
    tiles.push(tile);
    return tile;
  };
  const toRow = element.querySelector('[data-board="to"]');
  const dueRow = element.querySelector('[data-board="due"]');
  const to = [...TO].map((char) => ({ tile: make(toRow), char }));
  const due = [...DUE[0]].map(() => make(dueRow));
  let on = false;
  let status = -1;
  let timer = 0;
  let elapsed = 0; // ms the board has been in, with frame stalls capped
  let lastNow = 0;
  const root = document.documentElement;

  function show(tile, char) {
    tile.shown = char;
    tile.el.textContent = char;
    tile.odd = !tile.odd;
    tile.el.dataset.flip = tile.odd ? 'a' : 'b';
  }

  function aim(tile, char, flips, instant) {
    if (instant) {
      tile.target = char;
      tile.flips = 0;
      if (tile.shown !== char) show(tile, char);
      return;
    }
    if (tile.target === char) return;
    tile.target = char;
    tile.flips = flips;
    if (!timer) timer = setInterval(tick, TICK);
  }

  function tick() {
    let busy = false;
    for (const tile of tiles) {
      if (tile.shown === tile.target && tile.flips === 0) continue;
      if (tile.flips > 0) {
        show(tile, LATIN[Math.floor(Math.random() * LATIN.length)]);
        tile.flips -= 1;
        busy = true;
      } else {
        show(tile, tile.target);
      }
    }
    if (!busy) {
      clearInterval(timer);
      timer = 0;
    }
  }

  function blank() {
    clearInterval(timer);
    timer = 0;
    for (const tile of tiles) {
      tile.target = ' ';
      tile.flips = 0;
      tile.shown = ' ';
      tile.el.textContent = '';
      delete tile.el.dataset.flip;
    }
    status = -1;
  }

  // shown: the board is in; routeStep: 0–3 along DUE from the route dot;
  // instant: stepped mode.
  // The board waits for the entrance cover to lift, so a link straight to
  // 03 doesn't spend the countdown behind it.
  function update(shown, routeStep, instant) {
    if (!shown || !root.classList.contains('is-ready')) {
      if (on) blank();
      on = false;
      return;
    }
    const arriving = !on;
    on = true;
    const now = performance.now();
    if (arriving) {
      elapsed = 0;
      to.forEach(({ tile, char }, k) => aim(tile, char, 4 + k + Math.floor(Math.random() * 3), instant));
    } else {
      elapsed += Math.min(now - lastNow, 100);
    }
    lastNow = now;
    const clockStep = Math.max(0, Math.floor((elapsed - DUE_LEAD) / DUE_STEP));
    const step = Math.min(DUE.length - 1, Math.max(status, routeStep, clockStep));
    if (step === status) return;
    const text = DUE[step];
    due.forEach((tile, k) => aim(tile, text[k], (arriving ? 6 + k : 3) + Math.floor(Math.random() * 3), instant));
    status = step;
  }

  return { update };
}
