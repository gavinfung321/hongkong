// Places each chapter's copy inside its copy-safe region and fades it by the
// un-damped scroll progress, so text never lags the scrollbar, but no further
// in than the damped camera allows: on a quick scroll a chapter's copy waits
// for its scene instead of flashing over the previous one.
//
// A story chapter (`.chapter__copy--story`) arrives in two steps (user
// requests, 2026-10-04). As the camera comes in, the harbour darkens to
// DARK.arrive of memory mode (`--memory-mode` on the root); as it settles,
// the label, title and beats (and 02's 1915 ghost) fade in together; then,
// part-way through the dwell (scrollConductor.js), the memory print and the
// timeline come up together, taking memory mode the rest of the way. They
// sink as the camera leaves, and the darkness lifts early in the move out.
// All of it is scroll-tied, so it reverses on the way back. The 3D story
// layers (createStoryLayers.js) take their levels from here.
//
// 03 (`data-story="crossing"`) is an index of panels instead: the harbour
// darkens further (CROSSING.dark), the panels come with the title, and the
// route dot runs from Tsim Sha Tsui to Central across the dwell. On the
// shortest phones the second panel takes the first one's place.
import { smoothstep } from '../scroll/cameraRig.js';
const RISE = 48; // px travelled while fading: in from below, out through the top
// Shares of the dwell: 02's print and timeline wait about half a screen.
const STORY = { print: [0.5, 0.8] };
const CROSSING = { route: [0.1, 0.9], swap: [0.4, 0.6], dark: 0.7 };
// Memory mode reaches `arrive` from `approach[0]` of the way into the chapter
// until the camera settles, and the rest with the print. Past the keyframe
// the print and timeline sink over `sink`, the darkness lifts over `lift`.
const DARK = { arrive: 0.55, approach: 0.1, sink: [0.02, 0.1], lift: [0.02, 0.14] };
// The first step: progress into the chapter, as the camera settles.
const LABEL = [0.38, 0.5];

export function createCopyLayer(sections, chapters, { copyFull, copyFade }) {
  const copies = sections.map((section) => section.querySelector('.chapter__copy'));
  const opacities = copies.map(() => -1);
  const stories = copies.map((copy) => {
    if (!copy.classList.contains('chapter__copy--story')) return null;
    return {
      crossing: copy.dataset.story === 'crossing',
      label: copy.querySelector('.chapter__label'),
      title: copy.querySelector('.chapter__title'),
      standfirst: copy.querySelector('.chapter__standfirst'),
      beats: [...copy.querySelectorAll('.chapter__beat')],
      panels: [...copy.querySelectorAll('.chapter__panel')],
      route: copy.querySelector('.chapter__route'),
      memory: copy.querySelector('.chapter__memory'),
      facts: copy.querySelector('.chapter__facts'),
    };
  });
  const shown = new Map();
  const root = document.documentElement;
  let phone = false;
  // The shortest phones can't stack 03's panels; styles.css uses the same query.
  const shortPhone = matchMedia('(max-height: 619px)');

  function setBreakpoint(breakpoint) {
    phone = breakpoint === 'mobile';
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
    const base = stepped
      ? (i === index ? 1 : 0)
      : smoothstep(i + DARK.approach, key - copyFull, rendered) * (1 - smoothstep(DARK.lift[0], DARK.lift[1], rendered - key));
    for (const element of [story.label, story.title, story.standfirst, ...story.beats]) setVar(element, '--enter', label);
    for (const beat of story.beats) beat.toggleAttribute('data-enter-hidden', label === 0);
    if (story.crossing) {
      const enter = story.panels.map(() => label);
      if (phone && shortPhone.matches) {
        enter[1] *= level(CROSSING.swap);
        enter[0] *= 1 - enter[1];
      }
      story.panels.forEach((panel, k) => {
        setVar(panel, '--enter', enter[k]);
        panel.toggleAttribute('data-enter-hidden', !enter[k]);
      });
      setVar(story.route, '--route', level(CROSSING.route));
      return { mode: base * CROSSING.dark };
    }
    const sink = stepped ? 1 : 1 - smoothstep(DARK.sink[0], DARK.sink[1], p - key);
    const print = level(STORY.print) * sink;

    setVar(story.memory, '--memory-reveal', print);
    setVar(story.facts, '--enter', print);

    return {
      mode: base * (DARK.arrive + (1 - DARK.arrive) * print),
      ghost: label * base,
      dust: base,
      steam: print * base,
    };
  }

  // In stepped mode only the active chapter's copy is shown. Returns the
  // story levels for the 3D layers.
  function update(p, { stepped = false, index = 0, hero, rendered = p, dwell = [] } = {}) {
    const levels = { mode: 0, ghost: 0, dust: 0, steam: 0 };
    let crossing = false;
    copies.forEach((copy, i) => {
      if (stories[i]) {
        const story = updateStory(p, rendered, i, dwell[i] ?? 0, stepped, index);
        if (story.mode > levels.mode) crossing = stories[i].crossing;
        for (const name in story) levels[name] = Math.max(levels[name], story[name]);
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
    if (levels.mode > 0) root.toggleAttribute('data-veil-crossing', crossing);
    return levels;
  }

  function regionRect(index, breakpoint) {
    return chapters[index].copy[breakpoint];
  }

  return { copies, setBreakpoint, update, regionRect };
}
