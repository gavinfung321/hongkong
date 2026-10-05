// Places each chapter's copy inside its copy-safe region and fades it by the
// un-damped scroll progress, so text never lags the scrollbar, but no further
// in than the damped camera allows: on a quick scroll a chapter's copy waits
// for its scene instead of flashing over the previous one.
//
// Scene 02 reveals progressively: label, title and first paragraph; second
// paragraph; archive print and caption; then the complete timeline. They sink
// as the camera leaves, and the darkness lifts early in the move out. All of
// it is scroll-tied, so it reverses on the way back. The 3D story layers
// (createStoryLayers.js) take their levels from here.
//
// 03 (`data-story="crossing"`) is an index of panels instead: the harbour
// darkens further (SCENE_03_CROSSING.dark), then the opening, board, ticket
// with the first panel, daily-crossing panel and route panel arrive in order.
// The route dot starts once its panel is available. Phones
// leave the index off and keep the full departure card under the
// standfirst. The ticket sits low in the open water (user request,
// 2026-10-04).
// The sea haze drifts at the ferry's waterline
// with the panels (`--wind`). The panels flip over on their top edge as
// they come, like the seat backs, and the ticket (ticketCard.js) flips in
// with them while the departure board (departureBoard.js) flips its
// letters in; the board then counts down with the route (user choices,
// 2026-10-04).
//
// 04 (`data-story="statement"`): the label and title establish Red Sails,
// followed by the historical card, contemporary card, quote and statement
// intro. The harbour darkens around an opening on the sails, and the existing
// sea haze builds with the two cards (`--wind`); the petals stay.
//
// 05 (`data-story="lights"`): the label, title and words come as the camera
// settles, with no darkening; cityLights.js sweeps the title, and `touch`
// runs the office-window touch light (cityTouch.js) while it shows.
import { smoothstep } from '../scroll/cameraRig.js';
import { SCENE_02_REVEAL, SCENE_02_STEAM } from '../story/scene02/config.js';
import { SCENE_03_CROSSING } from '../story/scene03/config.js';
import { SCENE_04_STORY } from '../story/scene04/config.js';
import { createDepartureBoard } from './departureBoard.js';
import { createCityLights } from './cityLights.js';
const RISE = 48; // px travelled while fading: in from below, out through the top
// Memory mode reaches `arrive` from `approach[0]` of the way into the chapter
// until the camera settles, and the rest with the print. Past the keyframe
// the print and timeline sink over `sink`, the darkness lifts over `lift`.
const DARK = { arrive: 0.55, approach: 0.1, sink: [0.02, 0.1], lift: [0.02, 0.14] };
// Other story scenes use scene 02's established approach timing.
const LABEL = SCENE_02_REVEAL.intro;

export function createCopyLayer(sections, chapters, { copyFull, copyFade }) {
  const copies = sections.map((section) => section.querySelector('.chapter__copy'));
  const opacities = copies.map(() => -1);
  const measures = [];
  const stories = copies.map((copy) => {
    if (!copy.classList.contains('chapter__copy--story')) return null;
    const board = copy.querySelector('.chapter__board');
    // The ticket hangs just above the panels row on desktop (--panels-height).
    const panels = copy.querySelector('.chapter__panels');
    if (panels) {
      const measure = () => {
        copy.style.setProperty('--panels-height', `${panels.offsetHeight}px`);
      };
      const observer = new ResizeObserver(measure);
      observer.observe(panels);
      observer.observe(copy);
      window.addEventListener('resize', measure);
      measures.push(measure);
    }
    return {
      board,
      flaps: board && createDepartureBoard(board),
      ticket: copy.querySelector('.chapter__ticket'),
      crossing: copy.dataset.story === 'crossing',
      lights: copy.dataset.story === 'lights' ? createCityLights(copy) : null,
      statement: copy.querySelector('.chapter__statement'),
      statementIntro: copy.querySelector('.chapter__statement-intro'),
      photos: copy.querySelector('.chapter__photos'),
      figures: [...copy.querySelectorAll('.chapter__photo')],
      quote: copy.querySelector('.chapter__quote'),
      label: copy.querySelector('.chapter__label'),
      title: copy.querySelector('.chapter__title'),
      standfirst: copy.querySelector('.chapter__standfirst'),
      since: copy.querySelector('.chapter__since'),
      beats: [...copy.querySelectorAll('.chapter__beat')],
      panels: [...copy.querySelectorAll('.chapter__panel')],
      route: copy.querySelector('.chapter__route'),
      memory: copy.querySelector('.chapter__memory'),
      facts: copy.querySelector('.chapter__facts'),
      factItems: [...copy.querySelectorAll('.chapter__facts > div')],
    };
  });
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
    // After the breakpoint attribute is set, so the phone card is in the column.
    measures.forEach((measure) => measure());
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
    const opening = story.crossing
      ? SCENE_03_CROSSING.reveal.opening
      : story.statement
        ? SCENE_04_STORY.reveal.opening
        : LABEL;
    const label = stepped ? 1 : smoothstep(i + opening[0], i + opening[1], p);
    const base = stepped
      ? (i === index ? 1 : 0)
      : smoothstep(i + DARK.approach, key - copyFull, rendered) * (1 - smoothstep(DARK.lift[0], DARK.lift[1], rendered - key));
    for (const element of [story.label, story.title, story.standfirst, story.since, ...story.beats]) setVar(element, '--enter', label);
    for (const beat of story.beats) beat.toggleAttribute('data-enter-hidden', label === 0);
    const sink = stepped ? 1 : 1 - smoothstep(DARK.sink[0], DARK.sink[1], p - key);
    if (story.crossing) {
      const board = level(SCENE_03_CROSSING.reveal.board);
      const human = level(SCENE_03_CROSSING.reveal.humanCrossing);
      const daily = level(SCENE_03_CROSSING.reveal.dailyCrossing);
      const routePanel = level(SCENE_03_CROSSING.reveal.routePanel);
      const enter = [human, daily, routePanel];
      story.panels.forEach((panel, k) => {
        setVar(panel, '--enter', enter[k]);
        panel.toggleAttribute('data-enter-hidden', !enter[k]);
        if (enter[k] >= SCENE_03_CROSSING.flip) panel.toggleAttribute('data-flipped', true);
        else if (enter[k] === 0) panel.toggleAttribute('data-flipped', false);
      });
      const route = level(SCENE_03_CROSSING.route);
      setVar(story.route, '--route', route);
      setVar(story.route?.closest('.chapter__panel'), '--route', route);
      setVar(story.board, '--enter', board);
      story.flaps?.update(board > 0 && base > 0, SCENE_03_CROSSING.due.filter((share) => route >= share).length, stepped);
      if (story.ticket) {
        setVar(story.ticket, '--enter', human);
        story.ticket.toggleAttribute('data-enter-hidden', human === 0);
        if (human >= SCENE_03_CROSSING.flip) story.ticket.toggleAttribute('data-flipped', true);
        else if (human === 0) story.ticket.toggleAttribute('data-flipped', false);
      }
      return { mode: base * SCENE_03_CROSSING.dark, yield: base * SCENE_03_CROSSING.dark, wind: human * base };
    }
    if (story.lights) {
      story.lights.update(label > 0 && base > 0, stepped);
      return { mode: 0, touch: stepped ? 0 : base };
    }
    if (story.statement) {
      setVar(story.statement, '--enter', label);
      const historical = level(SCENE_04_STORY.reveal.historical) * sink;
      const contemporary = level(SCENE_04_STORY.reveal.contemporary) * sink;
      const quote = level(SCENE_04_STORY.reveal.quote) * sink;
      const statement = level(SCENE_04_STORY.reveal.statement) * sink;
      const cards = [historical, contemporary];
      setVar(story.photos, '--enter', historical);
      story.figures.forEach((figure, k) => {
        const enter = cards[k] ?? 0;
        setVar(figure, '--enter', enter);
        figure.toggleAttribute('data-enter-hidden', enter === 0);
      });
      setVar(story.quote, '--enter', quote);
      story.quote?.toggleAttribute('data-enter-hidden', quote === 0);
      setVar(story.statementIntro, '--enter', statement);
      story.statementIntro?.toggleAttribute('data-enter-hidden', statement === 0);
      const wind = historical * SCENE_04_STORY.windAtHistorical
        + contemporary * (1 - SCENE_04_STORY.windAtHistorical);
      return {
        mode: base * SCENE_04_STORY.dark,
        wind: wind * base,
      };
    }
    const [firstBeat, secondBeat] = story.beats;
    setVar(firstBeat, '--enter', label);
    firstBeat?.toggleAttribute('data-enter-hidden', label === 0);
    const historical = level(SCENE_02_REVEAL.historical) * sink;
    setVar(secondBeat, '--enter', historical);
    secondBeat?.toggleAttribute('data-enter-hidden', historical === 0);
    setVar(story.memory, '--memory-reveal', historical);

    const timeline = level(SCENE_02_REVEAL.timeline.reveal) * sink;
    setVar(story.facts, '--enter', timeline);
    const changes = SCENE_02_REVEAL.timeline.transitions.map(level);
    const active = [
      1 - changes[0],
      changes[0] * (1 - changes[1]),
      changes[1] * (1 - changes[2]),
      changes[2],
    ];
    story.factItems.forEach((item, k) => {
      setVar(item, '--active', active[k] ?? 0);
      setVar(item, '--past', k < changes.length ? changes[k] : 0);
    });
    const lateSteam = Math.min(1, active[2] + active[3]);

    const mode = base * (DARK.arrive + (1 - DARK.arrive) * historical);
    return {
      mode,
      yield: mode,
      ghost: label * base,
      dust: label * base,
      steam: historical * base * (1 + timeline * lateSteam * SCENE_02_STEAM.milestoneBoost),
    };
  }

  // In stepped mode only the active chapter's copy is shown. Returns the
  // story levels for the 3D layers; `yield` thins the petals.
  function update(p, { stepped = false, index = 0, hero, rendered = p, dwell = [] } = {}) {
    const levels = { mode: 0, ghost: 0, dust: 0, steam: 0, wind: 0, yield: 0, touch: 0 };
    let veil = '';
    let wind = '';
    let words = 0;
    copies.forEach((copy, i) => {
      if (stories[i]) {
        const story = updateStory(p, rendered, i, dwell[i] ?? 0, stepped, index);
        if (story.mode > levels.mode) veil = copy.dataset.story ?? '';
        if (story.wind > levels.wind) wind = copy.dataset.story;
        for (const name in story) levels[name] = Math.max(levels[name], story[name]);
      }
      const shownValue = i === 0 ? opacityAt(p, i, hero) : Math.min(opacityAt(p, i, hero), opacityAt(rendered, i, hero));
      const value = stepped ? (i === index ? 1 : 0) : Math.round(shownValue * 100) / 100;
      if (stories[i]?.lights) {
        const enter = stepped ? value : smoothstep(i + LABEL[0], i + LABEL[1], p);
        words = enter * value;
      }
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
    // The veil's shape follows the darkest chapter (styles.css); it keeps
    // its last shape while fading out.
    if (levels.mode > 0 && root.dataset.veil !== veil) root.dataset.veil = veil;
    // The haze's placement follows the windiest chapter (styles.css).
    setVar(root, '--wind', levels.wind);
    if (levels.wind > 0) {
      if (root.dataset.wind !== wind) root.dataset.wind = wind;
    } else if ('wind' in root.dataset) {
      delete root.dataset.wind;
    }
    levels.words = words;
    return levels;
  }

  function regionRect(index, breakpoint) {
    return chapters[index].copy[breakpoint];
  }

  return { copies, setBreakpoint, update, regionRect };
}
