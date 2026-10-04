// Places each chapter's copy inside its copy-safe region and fades it by the
// un-damped scroll progress, so text never lags the scrollbar, but no further
// in than the damped camera allows: on a quick scroll a chapter's copy waits
// for its scene instead of flashing over the previous one.
//
// A story chapter (`.chapter__copy--story`) arrives in layers (user request,
// 2026-10-04). As the camera comes in, the harbour darkens to DARK.arrive of
// memory mode (`--memory-mode` on the root); as it settles, the label and
// its hairline draw in; then, across the dwell (scrollConductor.js), the
// title, the lead beat, the second beat, the memory print and the timeline
// row come up one at a time, each fading in place without moving. The print
// takes memory mode the rest of the way; it and the timeline sink as the
// camera leaves, and the darkness lifts early in the move out. All of it is
// scroll-tied, so it reverses on the way back. The 3D story layers
// (createStoryLayers.js) take their levels from here.
import { smoothstep } from '../scroll/cameraRig.js';

const RISE = 48; // px travelled while fading: in from below, out through the top
// Shares of the dwell over which each layer comes up; the 1915 ghost behind
// the tower comes with the lead beat, which names the year.
const STORY = {
  title: [0, 0.1],
  lead: [0.08, 0.2],
  ghost: [0.04, 0.26],
  second: [0.32, 0.46],
  print: [0.46, 0.72],
  facts: [0.72, 0.86],
};
// Memory mode reaches `arrive` from `approach[0]` of the way into the chapter
// until the camera settles, and the rest with the print. Past the keyframe
// the print and timeline sink over `sink`, the darkness lifts over `lift`.
const DARK = { arrive: 0.55, approach: 0.1, sink: [0.02, 0.1], lift: [0.02, 0.14] };
// The label and hairline: progress into the chapter, as the camera settles.
const LABEL = [0.38, 0.5];

export function createCopyLayer(sections, chapters, { copyFull, copyFade }) {
  const copies = sections.map((section) => section.querySelector('.chapter__copy'));
  const opacities = copies.map(() => -1);
  const stories = copies.map((copy) =>
    copy.classList.contains('chapter__copy--story')
      ? {
          label: copy.querySelector('.chapter__label'),
          title: copy.querySelector('.chapter__title'),
          beats: [...copy.querySelectorAll('.chapter__beat')],
          memory: copy.querySelector('.chapter__memory'),
          facts: copy.querySelector('.chapter__facts'),
        }
      : null,
  );
  const shown = new Map();
  const root = document.documentElement;

  function setBreakpoint(breakpoint) {
    copies.forEach((copy, i) => {
      const { left, top, right, bottom } = chapters[i].copy[breakpoint];
      copy.style.setProperty('--copy-left', left);
      copy.style.setProperty('--copy-top', top);
      copy.style.setProperty('--copy-right', right);
      copy.style.setProperty('--copy-bottom', bottom);
    });
    shown.clear();
  }

  // Chapter 01's copy belongs to the hero: showing on load, leaving with the
  // wordmark from the first scroll (hero.from → hero.to).
  function opacityAt(p, i, hero) {
    if (i === 0) return 1 - smoothstep(hero.from, hero.to, p);
    const distance = Math.abs(p - (i + 0.5));
    if (distance <= copyFull) return 1;
    return Math.max(0, 1 - (distance - copyFull) / copyFade);
  }

  function setVar(element, name, value) {
    if (!element) return;
    const rounded = Math.round(value * 1000) / 1000;
    if (!shown.has(element)) shown.set(element, {});
    const current = shown.get(element);
    if (current[name] === rounded) return;
    current[name] = rounded;
    element.style.setProperty(name, String(rounded));
  }

  // Stepped mode: each layer is in or out, switching at the middle of its
  // range (styles.css fades it over 150 ms), and the darkness follows the
  // chapter shown.
  function updateStory(p, rendered, i, dwell, stepped, index) {
    const key = i + 0.5;
    const story = stories[i];
    const level = stepped
      ? ([from, to]) => (dwell >= (from + to) / 2 ? 1 : 0)
      : ([from, to]) => smoothstep(from, to, dwell);
    const label = stepped ? 1 : smoothstep(i + LABEL[0], i + LABEL[1], p);
    const sink = stepped ? 1 : 1 - smoothstep(DARK.sink[0], DARK.sink[1], p - key);
    const base = stepped
      ? (i === index ? 1 : 0)
      : smoothstep(i + DARK.approach, key - copyFull, rendered) * (1 - smoothstep(DARK.lift[0], DARK.lift[1], rendered - key));
    const lead = level(STORY.lead);
    const second = level(STORY.second);
    const print = level(STORY.print) * sink;

    setVar(story.label, '--enter', label);
    setVar(story.title, '--enter', level(STORY.title));
    setVar(story.beats[0], '--enter', lead);
    setVar(story.beats[1], '--enter', second);
    story.beats[0]?.toggleAttribute('data-enter-hidden', lead === 0);
    story.beats[1]?.toggleAttribute('data-enter-hidden', second === 0);
    setVar(story.memory, '--memory-reveal', print);
    setVar(story.facts, '--enter', level(STORY.facts) * sink);

    return {
      mode: base * (DARK.arrive + (1 - DARK.arrive) * print),
      ghost: level(STORY.ghost) * base,
      dust: base,
      steam: print * base,
    };
  }

  // In stepped mode only the active chapter's copy is shown. Returns the
  // story levels for the 3D layers.
  function update(p, { stepped = false, index = 0, hero, rendered = p, dwell = [] } = {}) {
    const levels = { mode: 0, ghost: 0, dust: 0, steam: 0 };
    copies.forEach((copy, i) => {
      if (stories[i]) {
        const story = updateStory(p, rendered, i, dwell[i] ?? 0, stepped, index);
        for (const name in levels) levels[name] = Math.max(levels[name], story[name]);
      }
      const shownValue = i === 0 ? opacityAt(p, i, hero) : Math.min(opacityAt(p, i, hero), opacityAt(rendered, i, hero));
      const value = stepped ? (i === index ? 1 : 0) : Math.round(shownValue * 100) / 100;
      if (value === opacities[i]) return;
      opacities[i] = value;
      const leaving = i === 0 || p > i + 0.5;
      // A story chapter's words sit still; only their opacity changes.
      const shift = stories[i] ? '0' : String((leaving ? -1 : 1) * (1 - value) * RISE);
      copy.style.setProperty('--copy-opacity', String(value));
      copy.style.setProperty('--copy-shift', shift);
      // The vertical 東方明珠 title moves with chapter 01's copy.
      if (i === 0) {
        root.style.setProperty('--intro-copy-opacity', String(value));
        root.style.setProperty('--intro-copy-shift', shift);
      }
      copy.classList.toggle('is-hidden', value === 0);
    });
    setVar(root, '--memory-mode', levels.mode);
    return levels;
  }

  function regionRect(index, breakpoint) {
    return chapters[index].copy[breakpoint];
  }

  return { copies, setBreakpoint, update, regionRect };
}
