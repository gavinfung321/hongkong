// The entrance cover (`.entrance` in index.html): shown by the inline boot
// script, filled by real start-up work, then faded into the page. Decorative
// and hidden from assistive technology; the page title and H1 name the site.
//
// Progress is the weighted share of registered tasks done. Every task is
// registered up front so the total never changes, the shown value only rises,
// and it stops at 99% until the last task (the first rendered frame) is done.
//
// Test switches (explicit only; ordinary visits never wait on them):
//   ?entrance=slow  each stage waits 500 ms, to see the mid states
//   ?entrance=hold  stays on the completed state instead of leaving
//   ?entrance=fail  the scene start-up throws, to see the fallback handoff
import { DefaultLoadingManager } from 'three';

const MIN_VISIBLE = 800; // ms since navigation, for visits that begin at the top
const DONE_PAUSE = 250; // ms on the completed state before the fade
const FADE = { entrance: 800, direct: 500, reduced: 300 };
// A slow or failed font or image never holds the cover: past these times
// (ms since this script started) the scene starts without it and swaps it in
// later. Both end well inside main.js's 8 s start-up guard.
const FONT_DEADLINE = 3000;
const TEXTURE_DEADLINE = 5000;
const SLOW_STAGE = 500;

// [name, weight]: weights follow the measured cost of each step on a laptop
// production build, so the line moves at a roughly even pace.
const TASKS = [
  ['fonts', 8],
  ['renderer', 10],
  ['world', 8],
  ['harbour', 22],
  ['vessels', 10],
  ['foreground', 16],
  ['textures', 10],
  ['shaders', 12],
  ['frame', 4],
];

// The faces the hero and the cover use, with the glyphs they show.
const FONTS = [
  ['700 1em "Noto Serif TC"', '維港夜色香港'],
  ['600 1em "Noto Serif TC"', '東方之珠'],
  ['500 1em "Noto Sans TC"', '維港'],
  ['600 1em "Cormorant Garamond"', 'A'],
  ['400 1em Inter', 'A'],
];

const BLOCKED_KEYS = new Set([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End']);

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
const until = (time) => wait(Math.max(0, time - performance.now()));

export function createLoadingScreen({ mode = '', reduced = false } = {}) {
  const root = document.documentElement;
  const started = performance.now();
  const cover = document.querySelector('.entrance');
  const line = cover?.querySelector('.entrance__line');
  const value = cover?.querySelector('.entrance__value');
  cover?.classList.toggle('is-reduced', reduced);
  const tasks = new Map(TASKS.map(([name, weight]) => [name, { weight, done: 0 }]));
  let shown = 0;
  let finished = false;

  function draw() {
    let total = 0;
    let done = 0;
    for (const task of tasks.values()) {
      total += task.weight;
      done += task.weight * task.done;
    }
    const all = [...tasks.values()].every((task) => task.done >= 1);
    const percent = all ? 100 : Math.min(99, Math.floor((done / total) * 100));
    if (percent <= shown) return;
    shown = percent;
    if (value) value.textContent = `${percent}%`;
    line?.style.setProperty('--progress', String(percent / 100));
  }

  function progress(name, fraction) {
    const task = tasks.get(name);
    if (!task || finished) return;
    task.done = Math.max(task.done, Math.min(1, fraction));
    draw();
  }

  // Marks a stage done and hands the main thread back so the line can repaint
  // and the phone stays responsive before the next stage.
  async function stage(name) {
    progress(name, 1);
    await (mode === 'slow' ? wait(SLOW_STAGE) : wait(0));
  }

  // Scrolling waits while the cover is up; the scroll position itself is
  // left alone, so restored positions and deep links survive.
  const block = (event) => {
    if (event.type !== 'keydown' || BLOCKED_KEYS.has(event.key)) event.preventDefault();
  };
  const lockOptions = { passive: false, capture: true };
  window.addEventListener('wheel', block, lockOptions);
  window.addEventListener('touchmove', block, lockOptions);
  window.addEventListener('keydown', block, lockOptions);
  function unlock() {
    window.removeEventListener('wheel', block, lockOptions);
    window.removeEventListener('touchmove', block, lockOptions);
    window.removeEventListener('keydown', block, lockOptions);
  }

  // Fonts: the faces above, or the deadline, whichever comes first.
  const fontsReady = document.fonts
    ? Promise.race([
        Promise.all(
          FONTS.map(([font, text]) =>
            document.fonts
              .load(font, text)
              .catch(() => {})
              .then(() => progress('fonts', tasks.get('fonts').done + 1 / FONTS.length)),
          ),
        ),
        until(started + FONT_DEADLINE),
      ]).then(() => progress('fonts', 1))
    : Promise.resolve(progress('fonts', 1));

  // Images fetched through three's loaders while the scene is built. Counted
  // once construction is over, so the total is known; failures count as done.
  let images = { loaded: 0, total: 0 };
  let imagesSettled = null;
  DefaultLoadingManager.onProgress = (url, loaded, total) => {
    images = { loaded, total };
    if (imagesSettled) imagesSettled();
  };

  function textures() {
    return Promise.race([
      new Promise((resolve) => {
        imagesSettled = () => {
          progress('textures', images.total ? images.loaded / images.total : 1);
          if (images.loaded >= images.total) resolve();
        };
        imagesSettled();
      }),
      until(started + TEXTURE_DEADLINE),
    ]).then(() => {
      imagesSettled = null;
      DefaultLoadingManager.onProgress = undefined;
      progress('textures', 1);
    });
  }

  function remove() {
    unlock();
    DefaultLoadingManager.onProgress = undefined;
    cover?.remove();
  }

  let left = false;
  function leave(duration) {
    if (left) return;
    left = true;
    if (!cover) return remove();
    cover.style.setProperty('--entrance-fade', `${duration}ms`);
    cover.classList.add('is-leaving');
    root.classList.remove('is-booting');
    unlock();
    window.setTimeout(remove, duration + 50);
  }

  // The first frame is drawn: show 100%, keep the cover up for the minimum
  // time on visits from the top, then reveal() and fade into the page.
  async function finish(reveal) {
    progress('frame', 1);
    if (finished) return;
    finished = true;
    const direct = /^#chapter-0[1-6]$/.test(window.location.hash) || window.scrollY > 2;
    if (!direct) await until(MIN_VISIBLE);
    if (mode === 'hold') return;
    if (!direct && !reduced) await wait(DONE_PAUSE);
    if (left) return;
    reveal();
    // One frame with the scene showing under the opaque cover, then the fade.
    requestAnimationFrame(() => leave(reduced ? FADE.reduced : direct ? FADE.direct : FADE.entrance));
  }

  // Any fallback (no WebGL 2, start-up error, timeout, lost context while
  // loading) fades the cover straight into the readable story.
  window.addEventListener(
    'harbourfallback',
    () => {
      finished = true;
      leave(reduced ? FADE.reduced : FADE.direct);
    },
    { once: true },
  );

  return { stage, progress, fontsReady, textures, finish };
}
