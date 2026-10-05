// 03's departure board (user choices, 2026-10-04): split-flap tiles that
// flip through a few letters before landing, left to right, as the board
// comes in. The "due" row follows the route thresholds in copyLayer.js, so
// the marker and countdown always describe the same point in the crossing.
// It flips only the tiles that change. Leaving the chapter blanks the tiles
// so they flip in again on return. Stepped mode sets the words directly.
// English only in the tiles; the Chinese is in the labels and the route
// panel's "Central 中環" (user choice, 2026-10-04).
import { SCENE_03_BOARD } from '../story/scene03/config.js';

const { destination: TO, due: DUE, characters: LATIN, tickMs: TICK } = SCENE_03_BOARD;

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
    if (arriving) {
      to.forEach(({ tile, char }, k) => aim(tile, char, 4 + k + Math.floor(Math.random() * 3), instant));
    }
    const step = Math.min(DUE.length - 1, Math.max(0, routeStep));
    // The physical-style board counts forward while Scene 03 remains active;
    // reverse scrolling moves the route dot back without making the board
    // count backwards. Leaving the scene still blanks and resets it.
    if (!arriving && step <= status) return;
    const text = DUE[step];
    due.forEach((tile, k) => aim(tile, text[k], (arriving ? 6 + k : 3) + Math.floor(Math.random() * 3), instant));
    status = step;
  }

  return { update };
}
