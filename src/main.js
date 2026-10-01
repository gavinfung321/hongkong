import { chapters, HERO, SCROLL } from './data/chapters.js';
import { createScene } from './scene/createScene.js';
import { createLighting } from './scene/createLighting.js';
import { createWater } from './scene/createWater.js';
import { createKowloonEdge } from './scene/createKowloonEdge.js';
import { createIsland } from './scene/createIsland.js';
import { createVessels } from './scene/createVessels.js';
import { createForeground } from './scene/createForeground.js';
import { createWordmark } from './scene/createWordmark.js';
import { createMoon } from './scene/createMoon.js';
import { createGating, makeFadeable } from './scene/gating.js';
import { createCameraRig, fovForAspect } from './scroll/cameraRig.js';
import { createScrollConductor } from './scroll/scrollConductor.js';
import { createCopyLayer } from './ui/copyLayer.js';
import { createSiteHeader } from './ui/siteHeader.js';
import { createCursorRing } from './ui/cursorRing.js';
import { enterFallback, supportsWebGL2, watchContext } from './ui/fallback.js';

const params = new URLSearchParams(window.location.search);
const root = document.documentElement;

const INIT_TIMEOUT = 8000;
const VEIL_IN = 150;
const VEIL_OUT = 200;
const MOBILE_ASPECT = 0.8;
const ADAPTIVE = { desktop: 45, mobile: 28, window: 2, step: 0.25, floor: 1 };

function start(initGuard, header) {
  const canvas = document.getElementById('world');
  const veil = document.querySelector('.veil');
  const sections = [...document.querySelectorAll('.chapter')];
  root.style.setProperty('--chapter-length', `${SCROLL.chapterLength}svh`);

  const antialias = window.matchMedia('(pointer: fine)').matches;
  const world = createScene(canvas, { antialias });
  const { renderer, scene, camera } = world;

  scene.add(createLighting());
  const water = createWater(renderer);
  scene.add(water.mesh);
  const kowloon = createKowloonEdge();
  const island = createIsland();
  const vessels = createVessels();
  const foreground = createForeground();
  const wordmark = createWordmark(renderer, HERO.wordmark.text);
  const moon = createMoon();
  scene.add(moon.group, kowloon.group, island.group, vessels.group, foreground.group, wordmark.mesh);

  const gating = createGating(chapters, {
    ferry: makeFadeable(vessels.ferry),
    junk: makeFadeable(vessels.junk),
    ifc: makeFadeable(island.ifc),
    wheel: makeFadeable(island.wheel),
    deck: makeFadeable(kowloon.decks),
    railing: (value) => foreground.setOpacity('railing', value),
    palms: (value) => foreground.setOpacity('palms', value),
    bursts: (value) => foreground.setOpacity('bursts', value),
  });

  const rig = createCameraRig(camera, chapters, { hold: SCROLL.hold });
  const conductor = createScrollConductor(sections, SCROLL);
  const copy = createCopyLayer(sections, chapters, SCROLL);

  // ---- Motion mode ---------------------------------------------------------

  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const forcedReduced = params.get('motion') === 'reduced';
  let stepped = forcedReduced || reducedQuery.matches;
  let shownKeyframe = -1;
  let needsRender = true;

  function applyMotionMode() {
    root.classList.toggle('is-stepped', stepped);
    root.dataset.motion = stepped ? 'stepped' : 'continuous';
    shownKeyframe = -1;
    conductor.snap();
    needsRender = true;
  }
  reducedQuery.addEventListener('change', () => {
    stepped = forcedReduced || reducedQuery.matches;
    applyMotionMode();
  });

  // ---- Size, breakpoint, pixel ratio ---------------------------------------

  let breakpoint = '';
  let width = 0;
  let height = 0;
  let adaptiveCap = Infinity;
  let pixelRatio = 1;

  function targetPixelRatio() {
    const limit = breakpoint === 'mobile' ? 1.5 : 2;
    return Math.max(ADAPTIVE.floor, Math.min(window.devicePixelRatio || 1, limit, adaptiveCap));
  }

  function rebuild() {
    rig.setBreakpoint(breakpoint);
    rig.setAspect(width / height);
    vessels.setPaths(chapters, breakpoint);
    copy.setBreakpoint(breakpoint);
    const finale = chapters[chapters.length - 1];
    const pose = finale.camera[breakpoint];
    const fov = fovForAspect(pose.fov, width / height, breakpoint);
    foreground.placeBursts({ ...pose, fov }, width / height, finale.bursts[breakpoint]);
    const opening = chapters[0].camera[breakpoint];
    const openingFov = fovForAspect(opening.fov, width / height, breakpoint);
    wordmark.place({ ...opening, fov: openingFov }, width / height, HERO.wordmark[breakpoint]);
    needsRender = true;
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const next = window.innerWidth / window.innerHeight < MOBILE_ASPECT ? 'mobile' : 'desktop';
    const breakpointChanged = next !== breakpoint;
    if (breakpointChanged) {
      breakpoint = next;
      root.dataset.breakpoint = breakpoint;
    }
    const ratio = targetPixelRatio();
    if (w !== width || h !== height || breakpointChanged || ratio !== pixelRatio) {
      pixelRatio = ratio;
      width = w;
      height = h;
      world.resize(width, height, pixelRatio);
      rebuild();
    }
    if (conductor.measure(breakpointChanged)) {
      conductor.readScroll();
      rig.setStart(conductor.state.pTop);
    }
    if (breakpointChanged) conductor.snap();
    needsRender = true;
  }

  // Lowers the pixel ratio when the 2 s average fps drops below target.
  let adaptiveTime = 0;
  let adaptiveFrames = 0;
  function adaptResolution(dt) {
    adaptiveTime += dt;
    adaptiveFrames += 1;
    if (adaptiveTime < ADAPTIVE.window) return;
    const average = adaptiveFrames / adaptiveTime;
    adaptiveTime = 0;
    adaptiveFrames = 0;
    if (average >= ADAPTIVE[breakpoint] || pixelRatio <= ADAPTIVE.floor) return;
    adaptiveCap = Math.max(ADAPTIVE.floor, pixelRatio - ADAPTIVE.step);
    pixelRatio = targetPixelRatio();
    world.resize(width, height, pixelRatio);
    debug?.log(`dpr → ${pixelRatio.toFixed(2)} (${average.toFixed(0)} fps)`);
  }

  // ---- Veil ----------------------------------------------------------------

  let veilActive = false;
  function runVeil(atOpaque) {
    veilActive = true;
    veil.style.transitionDuration = `${VEIL_IN}ms`;
    veil.classList.add('is-active');
    window.setTimeout(() => {
      atOpaque();
      needsRender = true;
      veil.style.transitionDuration = `${VEIL_OUT}ms`;
      veil.classList.remove('is-active');
      window.setTimeout(() => {
        veilActive = false;
      }, VEIL_OUT);
    }, VEIL_IN);
  }

  // ---- Scroll targets: anchors, focus, initial hash -------------------------

  function scrollToChapter(index) {
    window.scrollTo({ top: conductor.scrollForKeyframe(index), behavior: 'auto' });
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href^="#chapter-"], a[href="#top"]');
    if (!link) return;
    const href = link.getAttribute('href');
    let title;
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      title = document.getElementById('site-title');
    } else {
      const index = sections.findIndex((s) => `#${s.id}` === href);
      if (index < 0) return;
      // Chapter 01's copy only shows in the hero (see copyLayer).
      if (index === 0) window.scrollTo({ top: 0, behavior: 'auto' });
      else scrollToChapter(index);
      title = sections[index].querySelector('.chapter__title');
      title.setAttribute('tabindex', '-1');
    }
    event.preventDefault();
    history.replaceState(null, '', href);
    title.focus({ preventScroll: true });
  });

  document.addEventListener('focusin', (event) => {
    const index = sections.findIndex((s) => s.contains(event.target));
    if (index >= 0 && index !== conductor.state.index && event.target.matches('a, button')) {
      scrollToChapter(index);
    }
  });

  // ---- Frame ---------------------------------------------------------------

  function applyPose(p, isStepped, time) {
    const segment = rig.update(p, { stepped: isStepped });
    vessels.update(segment, time, !isStepped);
    gating.update(segment, breakpoint, isStepped);
    scene.fog.density = gating.fogDensity(segment);
  }

  const control = { free: false };
  let debug = null;
  let fpsOverlay = null;
  let last = 0;
  let time = 0;
  let ready = false;

  function frame(now) {
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    const state = conductor.update(dt);
    state.breakpoint = breakpoint;
    state.motion = stepped ? 'stepped' : 'continuous';
    const hero = state.p < 0;
    const heroFadeTo = state.pTop + (HERO.sinkEnd - state.pTop) * HERO.fadeEnd;
    copy.update(state.p, { stepped, index: state.index, hero: { from: state.pTop, to: heroFadeTo } });
    header.update(state.index, hero);

    if (stepped) {
      if (wordmark.fadeTo(hero ? 1 : 0, dt)) needsRender = true;
      if (state.index !== shownKeyframe) {
        if (shownKeyframe < 0) {
          shownKeyframe = state.index;
          conductor.setRendered(state.index + 0.5);
          applyPose(state.index + 0.5, true, 0);
          needsRender = true;
        } else if (!veilActive) {
          runVeil(() => {
            shownKeyframe = conductor.state.index;
            conductor.setRendered(shownKeyframe + 0.5);
            applyPose(shownKeyframe + 0.5, true, 0);
          });
        }
      }
      if (!needsRender && !control.free) return;
    } else {
      if (state.jumped && !veilActive) runVeil(() => conductor.snap());
      time += dt;
      if (!control.free) applyPose(state.pRendered, false, time);
      wordmark.sinkAt(state.pRendered, state.pTop, HERO.sinkEnd, HERO.fadeEnd);
      water.update(dt);
    }

    needsRender = false;
    world.render();
    if (!stepped && ready) adaptResolution(dt);
    debug?.update(state, dt, pixelRatio);
    fpsOverlay?.sample(dt, pixelRatio);

    if (!ready) {
      ready = true;
      window.clearTimeout(initGuard);
      performance.mark('vh:first-frame');
      requestAnimationFrame(() => root.classList.add('is-ready'));
    }
  }

  // ---- Lifecycle -----------------------------------------------------------

  function play() {
    last = 0;
    needsRender = true;
    renderer.setAnimationLoop(frame);
  }
  function pause() {
    renderer.setAnimationLoop(null);
  }

  document.addEventListener('visibilitychange', () => {
    if (root.classList.contains('is-fallback')) return;
    if (document.hidden) pause();
    else play();
  });

  watchContext(canvas, {
    onLost: pause,
    onRestored: play,
    onFailed: () => {
      pause();
      enterFallback('context-lost');
    },
  });

  window.addEventListener('harbourfallback', pause);
  window.addEventListener('resize', resize);
  resize();
  applyMotionMode();

  // Deep links land on a chapter's hold pose rather than its section top.
  const hash = window.location.hash.match(/^#chapter-0([1-6])$/);
  const hold = import.meta.env.DEV ? Number(params.get('hold')) : 0;
  const initial = hold >= 1 && hold <= 6 ? hold - 1 : hash ? Number(hash[1]) - 1 : -1;
  if (initial >= 0) {
    history.scrollRestoration = 'manual';
    const land = () => {
      conductor.measure(true);
      scrollToChapter(initial);
      conductor.reset();
    };
    land();
    window.addEventListener('load', land, { once: true });
  }
  conductor.readScroll();

  if (import.meta.env.DEV && params.has('debug')) {
    import('./ui/debug.js').then(({ createDebug }) => {
      debug = createDebug({
        renderer,
        scene,
        camera,
        rig,
        conductor,
        chapters,
        copy,
        control,
        vessels,
        foreground,
        landmarks: {
          tower: kowloon.clockTower,
          ferry: vessels.ferry,
          junk: vessels.junk,
          ifc: island.ifc,
          wheel: island.wheel,
        },
        breakpoint: () => breakpoint,
        rebuild,
        requestRender: () => {
          needsRender = true;
        },
      });
    });
  }

  if (params.has('fps')) {
    import('./ui/fpsOverlay.js').then(({ createFpsOverlay }) => {
      fpsOverlay = createFpsOverlay(renderer);
    });
  }

  play();
}

function boot() {
  // The header works in the poster-only fallback too, where links scroll natively.
  const header = createSiteHeader();
  createCursorRing();
  if (params.has('fallback')) return enterFallback('requested');
  if (!supportsWebGL2()) return enterFallback('no-webgl2');

  root.classList.add('is-enhanced');
  const initGuard = window.setTimeout(() => enterFallback('init-timeout'), INIT_TIMEOUT);
  try {
    start(initGuard, header);
  } catch (error) {
    window.clearTimeout(initGuard);
    console.error(error);
    enterFallback('init-error');
  }
}

boot();
