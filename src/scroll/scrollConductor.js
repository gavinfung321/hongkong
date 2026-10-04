import { MathUtils } from 'three';
import { segmentAt } from './cameraRig.js';

const HEIGHT_CHANGE_THRESHOLD = 150;

// config.dwell: per section, the share of its height that is a dwell, where
// progress stays on the keyframe and state.dwell[i] runs 0..1 instead;
// config.dwellLand: how far into a dwell links land.
export function createScrollConductor(sections, config) {
  const dwellShare = sections.map((_, i) => config.dwell?.[i] ?? 0);
  const root = document.documentElement;
  let tops = [];
  let heights = [];
  let measuredWidth = 0;
  let measuredHeight = 0;
  let scrollY = window.scrollY;
  let pRendered = null;
  let lastIndex = -1;
  let lastPhase = '';

  const state = {
    p: 0,
    pRendered: 0,
    pTop: 0, // progress at the top of the page (negative: the hero)
    index: 0,
    local: 0,
    phase: 'hold',
    segment: { from: 0, to: 1, u: 0, eased: 0 },
    breakpoint: 'desktop',
    motion: 'continuous',
    jumped: false,
    dwell: sections.map(() => 0),
  };

  function measure(force = false) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const heightChanged = Math.abs(height - measuredHeight) > HEIGHT_CHANGE_THRESHOLD;
    // Chapters are sized in svh, so a desktop window resize can change them
    // even when the height change is below the URL-bar threshold.
    const sectionsChanged = sections[0].offsetHeight !== heights[0];
    if (!force && width === measuredWidth && !heightChanged && !sectionsChanged) return false;
    measuredWidth = width;
    measuredHeight = height;
    const scrollTop = window.scrollY;
    tops = sections.map((s) => s.getBoundingClientRect().top + scrollTop);
    heights = sections.map((s) => s.offsetHeight);
    state.pTop = progressAt(0);
    return true;
  }

  function onScroll() {
    scrollY = window.scrollY;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Share of section i's height covered by the read line, 0..1.
  function sectionShare(i, line) {
    return MathUtils.clamp((line - tops[i]) / heights[i], 0, 1);
  }

  // Local progress in section i (0..1, keyframe at 0.5) for a share of its
  // height; a dwell holds it at 0.5.
  function localAt(i, share) {
    const d = dwellShare[i];
    const half = (1 - d) / 2;
    if (share < half) return (0.5 * share) / half;
    if (share < half + d) return 0.5;
    return 0.5 + (0.5 * (share - half - d)) / half;
  }

  // Negative above chapter 01 (the hero), measured in chapter-01 lengths.
  function progressAt(y) {
    const line = y + measuredHeight / 2;
    const count = sections.length;
    if (line < tops[0]) return (line - tops[0]) / heights[0];
    for (let i = 0; i < count; i++) {
      if (line < tops[i] + heights[i]) return i + localAt(i, sectionShare(i, line));
    }
    return count;
  }

  function updateDwell(y) {
    const line = y + measuredHeight / 2;
    dwellShare.forEach((d, i) => {
      if (!d) return;
      const half = (1 - d) / 2;
      state.dwell[i] = MathUtils.clamp((sectionShare(i, line) - half) / d, 0, 1);
    });
  }

  // Scroll position that puts keyframe k (p = k + 0.5) on the read line;
  // config.dwellLand of the way into a dwell.
  function scrollForKeyframe(k) {
    const d = dwellShare[k];
    return tops[k] + heights[k] * ((1 - d) / 2 + d * (config.dwellLand ?? 0)) - measuredHeight / 2;
  }

  function publish() {
    const { index, phase } = state;
    if (index === lastIndex && phase === lastPhase) return;
    const changedChapter = index !== lastIndex;
    lastIndex = index;
    lastPhase = phase;
    root.dataset.chapter = String(index + 1).padStart(2, '0');
    root.dataset.phase = phase;
    sections.forEach((s, i) => {
      if (i === index) s.setAttribute('aria-current', 'step');
      else s.removeAttribute('aria-current');
    });
    window.dispatchEvent(
      new CustomEvent('chapterchange', { detail: { index, phase, changedChapter } }),
    );
  }

  // Advances the damped progress. Returns the shared state object.
  function update(dt) {
    const count = sections.length;
    const p = progressAt(scrollY);
    state.p = p;
    updateDwell(scrollY);
    state.index = MathUtils.clamp(Math.floor(p), 0, count - 1);
    state.local = p - state.index;
    state.phase = Math.abs(p - (state.index + 0.5)) <= config.hold ? 'hold' : 'transition';
    state.jumped = false;

    if (pRendered === null) {
      pRendered = p;
    } else if (Math.abs(p - pRendered) > config.jumpThreshold) {
      state.jumped = true;
    } else {
      pRendered = MathUtils.damp(pRendered, p, config.damping, Math.min(dt, 0.1));
      if (Math.abs(pRendered - p) < 1e-4) pRendered = p;
    }

    state.pRendered = pRendered;
    state.segment = segmentAt(pRendered, config.hold, count);
    publish();
    return state;
  }

  function snap() {
    pRendered = state.p;
    state.pRendered = pRendered;
    state.segment = segmentAt(pRendered, config.hold, sections.length);
  }

  function setRendered(value) {
    pRendered = value;
    state.pRendered = value;
    state.segment = segmentAt(value, config.hold, sections.length);
  }

  function isSettled() {
    return pRendered === state.p;
  }

  // The next update adopts the scroll position directly (no damping, no veil).
  function reset() {
    scrollY = window.scrollY;
    pRendered = null;
  }

  return {
    state,
    measure,
    update,
    snap,
    setRendered,
    isSettled,
    reset,
    scrollForKeyframe,
    readScroll: onScroll,
  };
}
