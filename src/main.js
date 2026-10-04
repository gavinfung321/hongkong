import { chapters, HERO, SCROLL } from './data/chapters.js';
import { createScene, SKY_GLOW } from './scene/createScene.js';
import { useAerialFog } from './scene/aerialFog.js';
import { createLighting } from './scene/createLighting.js';
import { createWater } from './scene/createWater.js';
import { cityStrip, reflectionSources } from './scene/waterReflections.js';
import { createKowloonEdge } from './scene/createKowloonEdge.js';
import { createIsland } from './scene/createIsland.js';
import { createVessels } from './scene/createVessels.js';
import { createForeground } from './scene/createForeground.js';
import { createWordmark } from './scene/createWordmark.js';
import { createMoon } from './scene/createMoon.js';
import { createBuoy } from './scene/createBuoy.js';
import { createPetals } from './scene/createPetals.js';
import { burstLights, createAtmosphere } from './scene/createAtmosphere.js';
import { createFireworks } from './scene/createFireworks.js';
import { createSearchlights } from './scene/createSearchlights.js';
import { createLensBokeh } from './scene/createLensBokeh.js';
import { createCornerBranch } from './scene/createCornerBranch.js';
import { createHarbourBoat } from './scene/createHarbourBoat.js';
import { createStoryLayers } from './scene/createStoryLayers.js';
import { createCursorMotes } from './scene/createCursorMotes.js';
import { citySoft } from './scene/cityWindows.js';
import { facadeBias } from './scene/facades.js';
import { BLOOM } from './scene/bloom.js';
import { createGating, makeFadeable } from './scene/gating.js';
import { setBreathing, updateBreathing } from './scene/lightBreath.js';
import { createCameraRig, fovForAspect } from './scroll/cameraRig.js';
import { createScrollConductor } from './scroll/scrollConductor.js';
import { createCopyLayer } from './ui/copyLayer.js';
import { createMemoryPlates } from './ui/memoryPlate.js';
import { createPaperCards } from './ui/paperCard.js';
import { createTicket } from './ui/ticketCard.js';
import { createCityTouch } from './ui/cityTouch.js';
import { createSiteHeader } from './ui/siteHeader.js';
import { createSiteFooter } from './ui/siteFooter.js';
import { createCursorRing } from './ui/cursorRing.js';
import { createPointerParallax } from './ui/pointerParallax.js';
import { createPointerStir } from './ui/pointerStir.js';
import { enterFallback, supportsWebGL2, watchContext } from './ui/fallback.js';
import { createLoadingScreen } from './ui/loadingScreen.js';

const params = new URLSearchParams(window.location.search);
const root = document.documentElement;
const footerElement = document.querySelector('.site-footer');

const INIT_TIMEOUT = 8000;
const VEIL_IN = 150;
const VEIL_OUT = 200;
const MOBILE_ASPECT = 0.8;
// Phones turned sideways; the same query sizes the interface in styles.css.
const SHORT_LANDSCAPE = '(orientation: landscape) and (max-height: 500px)';
// Pixel ratio steps down when the 2 s average fps is under target. Phones aim
// high: on the iPhone 11 pixel count was the only cost that mattered (1.25 gave
// 02 +9 fps; glow, edge smoothing and water gave none; user choice, 2026-10-02).
const ADAPTIVE = {
  desktop: 45,
  mobile: 40,
  window: 2,
  settle: 2,
  step: 0.25,
  floor: { desktop: 1, mobile: 1.25 },
};
const NO_POINTER = { x: 0, y: 0 };
// Share of the petals that give way to the story dust in full memory mode.
const PETAL_YIELD = 0.6;
// Window edge blur on phones, in pixels (desktop 1).
const MOBILE_WINDOW_SOFT = 1.5;
// Painted facades on phones, in mipmap levels (desktop 0).
const MOBILE_FACADE_BIAS = 0.5;
// ?bloom=0 turns the glow off, ?bloom=2 doubles it: for side-by-side checks.
const BLOOM_SCALE = params.has('bloom') ? Math.max(0, Number(params.get('bloom')) || 0) : 1;
// ?haze=2 doubles the depth haze: for tuning.
const HAZE_SCALE = params.has('haze') ? Math.max(0, Number(params.get('haze')) || 0) : 1;
// ?grade=0 turns the film grade off: for side-by-side checks.
const GRADE = params.get('grade') !== '0';
// Phone measurement switches, live like ?fps: ?dpr=1.25 caps the pixel ratio,
// ?aa=0 turns off edge smoothing, ?off=water,clouds,mist,palms,petals,beams hides layers.
const DPR_CAP = Number(params.get('dpr')) || 0;
const OFF_LAYERS = { water: ['water'], clouds: ['cloud'], mist: ['mist', 'sea-mist'], haze: ['haze'], palms: ['palms'], petals: ['petals'], beams: ['searchlights'] };
const OFF = (params.get('off') ?? '').split(',').flatMap((key) => OFF_LAYERS[key.trim()] ?? []);
const OFF_KEYS = (params.get('off') ?? '').split(',').map((key) => key.trim());
// ?off=texture removes the screen vignette, for A/B checks.
if (OFF_KEYS.includes('texture')) document.querySelector('.vignette')?.remove();
// ?off=light-motion holds the practical lights at their base brightness.
const LIGHT_MOTION = !OFF_KEYS.includes('light-motion');
// ?off=aerial keeps the old single-colour fog, for A/B checks.
if (!OFF_KEYS.includes('aerial')) useAerialFog({ glow: SKY_GLOW });
// ?entrance=slow|hold|fail: entrance test switches (loadingScreen.js).
const ENTRANCE = params.get('entrance') ?? '';

// The scene is built in stages behind the entrance cover, which shows each
// one done; a fallback during a stage ends the start-up quietly.
async function start(initGuard, header, loading) {
  const canvas = document.getElementById('world');
  const veil = document.querySelector('.veil');
  const sections = [...document.querySelectorAll('.chapter')];
  root.style.setProperty('--chapter-length', `${SCROLL.chapterLength}svh`);
  sections.forEach((section, i) => {
    if (chapters[i].dwell) section.style.setProperty('--chapter-dwell', `${chapters[i].dwell}svh`);
  });
  const dwellShare = chapters.map((chapter) => (chapter.dwell ?? 0) / (SCROLL.chapterLength + (chapter.dwell ?? 0)));
  let needsRender = true;
  const stage = async (name) => {
    await loading.stage(name);
    if (root.classList.contains('is-fallback')) throw new Error('fallback during start-up');
  };

  // Phones too: without it IFC's 1–2 px piers, slots, bands and fins crawl
  // while scrolling (user report, 2026-10-02).
  const world = createScene(canvas, { antialias: params.get('aa') !== '0' });
  const { renderer, scene, camera } = world;
  world.setGrade(GRADE);
  await stage('renderer');

  scene.add(createLighting());
  const water = createWater(renderer, world.sky.userData.glow);
  scene.add(water.mesh);
  await stage('world');
  const kowloon = createKowloonEdge();
  const island = createIsland();
  await stage('harbour');
  if (ENTRANCE === 'fail') throw new Error('entrance test: start-up failure');
  const vessels = createVessels({ hold: SCROLL.hold });
  await stage('vessels');
  // The wordmark is drawn in its web font, so it waits for the fonts (or their deadline).
  await loading.fontsReady;
  const foreground = createForeground();
  const wordmark = createWordmark(renderer, HERO.wordmark.text, {
    onRepaint: () => {
      needsRender = true;
    },
  });
  const moon = createMoon();
  const petals = createPetals();
  const atmosphere = createAtmosphere(chapters, {
    onLoad: () => {
      needsRender = true;
    },
  });
  const fireworks = createFireworks(chapters, {
    onLoad: () => {
      needsRender = true;
    },
    lights: burstLights,
  });
  const searchlights = createSearchlights();
  const story = createStoryLayers(chapters, renderer, {
    onLoad: () => {
      needsRender = true;
    },
  });
  const buoy = createBuoy(chapters.find((chapter) => chapter.id === '03').camera);
  const cursorMotes = createCursorMotes(renderer);
  // 05's layers (user choices, 2026-10-04).
  const lens = createLensBokeh();
  const cornerBranch = createCornerBranch(chapters.find((chapter) => chapter.id === '05').camera);
  const boat = createHarbourBoat();
  scene.add(buoy.group, lens.group, cornerBranch.group, boat.group);
  scene.add(moon.group, atmosphere.group, searchlights.group, kowloon.group, island.group, vessels.group, foreground.group, fireworks.group, story.group, wordmark.mesh, petals.group, cursorMotes.points);
  await stage('foreground');
  water.setSources(reflectionSources({
    tower: kowloon.clockTower,
    ferry: vessels.ferry,
    junk: vessels.junk,
    boat: boat.group,
    wave: island.wave.marker,
  }));
  water.setCity(cityStrip(island.group.getObjectByName('skyline')));
  // Faded subjects fade their reflections too.
  const reflected = (key, setOpacity) => (value) => {
    setOpacity(value);
    water.setFade(key, value);
  };

  let petalLevel = 1;
  let boatLevel = 0;
  let waveLevel = 0;
  const boatFade = reflected('boat', makeFadeable(boat.group));
  const gating = createGating(chapters, {
    ferry: reflected('ferry', makeFadeable(vessels.ferry)),
    junk: reflected('junk', makeFadeable(vessels.junk)),
    ifc: reflected('ifc', makeFadeable(island.ifc)),
    wheel: reflected('wheel', makeFadeable(island.wheel)),
    deck: makeFadeable(kowloon.decks),
    railing: (value) => foreground.setOpacity('railing', value),
    palms: (value) => foreground.setOpacity('palms', value),
    bauhinia: (value) => foreground.setOpacity('bauhinia', value),
    bush: (value) => foreground.setOpacity('bush', value),
    bursts: (value) => fireworks.setLevel(value),
    petals: (value) => {
      petalLevel = value;
    },
    city: (value) => island.setCityLevel(value),
    slopeLights: (value) => island.setSlopeLights(value),
    accents: (value) => island.setAccentLevel(value),
    reflections: (value) => water.setBoost(value),
    mist: (value) => atmosphere.setMist(value),
    // Default window: gone early in the move to 06, before the fireworks lead.
    searchlights: (value) => searchlights.setLevel(value),
    // Default window: gone in the first 40% of the move to 03, before the camera nears them.
    seaMist: (value) => atmosphere.setSeaMist(value),
    haze: (value) => atmosphere.setHaze(value * HAZE_SCALE),
    afterglow: (value) => world.sky.userData.setAfterglow(value),
    buoy: (value) => buoy.setOpacity(value),
    moon: (value) => {
      moon.setLevel(value);
      water.setFade('moon', value);
    },
    junkGlow: (value) => water.setFade('junkGlow', value),
    branch: (value) => cornerBranch.setOpacity(value),
    lens: (value) => lens.setLevel(value),
    lensBusy: (value) => lens.setBusy(value),
    cloudBand: (value) => atmosphere.setCloudBand(value),
    wave: (value) => {
      waveLevel = value;
    },
    boat: (value) => {
      boatLevel = value;
      boatFade(value);
    },
  }, {
    // The 05 branch stays hidden until the camera has settled, then slides
    // in on its own. Quiet lens discs (03–04) and the boat come in over
    // the second half of the move; 05's denser pack (`lensBusy`) later;
    // the cloud band across most of it.
    branch: { in: [0.999, 1], out: [0, 0.02] },
    lens: { in: [0.6, 1], out: [0, 0.3] },
    lensBusy: { in: [0.75, 1], out: [0, 0.25] },
    boat: { in: [0.5, 1], out: [0, 0.4] },
    cloudBand: { in: [0.3, 1], out: [0, 0.6] },
    // The moon and the junk's sail reflection change gently across the whole move.
    moon: { in: [0, 1], out: [0, 1] },
    junkGlow: { in: [0, 1], out: [0, 1] },
    // The 03 buoy comes in over the second half of the move into 03 and is
    // gone early in the move to 04.
    buoy: { in: [0.5, 1], out: [0.2, 0.5] },
    // The afterglow warms and cools across the whole move.
    afterglow: { in: [0, 1], out: [0, 1] },
    // Mist and haze change gently across the whole move.
    mist: { in: [0, 1], out: [0, 1] },
    haze: { in: [0, 1], out: [0, 1] },
    // The city dims across the whole move into 05 (and stays dim in 06), not in its first 40%.
    city: { in: [0, 1], out: [0, 1] },
    slopeLights: { in: [0, 1], out: [0, 1] },
    accents: { in: [0, 1], out: [0, 1] },
    reflections: { in: [0, 1], out: [0, 1] },
    // The palms pass in front of the Clock Tower early in the 01 → 02 move
    // and, on mobile, early in the 02 → 03 move.
    palms: { in: [0.62, 0.9], out: [0, 0.1] },
    // The camera passes over the bush early in the 01 → 02 move: gone while
    // it is still 1.8 m clear of the crown.
    bush: { out: [0, 0.08] },
    // The junk fades only once it has left the frame in the move to 05 (and,
    // on phones, to 02); on desktop 01 → 02 it fades in the fastest part of the swing.
    junk: { out: [0.4, 0.5] },
    // Phones, 02 → 03: the ferry is shown before it enters the frame.
    ferry: { in: [0, 0.1] },
  }, { afterglow: 0, haze: 0, buoy: 0, branch: 0, lens: 0, lensBusy: 0, cloudBand: 0, wave: 0, boat: 0 });

  const rig = createCameraRig(camera, chapters, { hold: SCROLL.hold });
  const parallax = createPointerParallax();
  const stir = createPointerStir();
  let stirState = null;
  const conductor = createScrollConductor(sections, { ...SCROLL, dwell: dwellShare });
  const copy = createCopyLayer(sections, chapters, SCROLL);
  const memories = createMemoryPlates(sections);
  const photoCards = createPaperCards(sections);
  const ticket = createTicket(document);
  const cityTouch = createCityTouch();

  // ---- Motion mode ---------------------------------------------------------

  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const forcedReduced = params.get('motion') === 'reduced';
  let stepped = forcedReduced || reducedQuery.matches;
  let shownKeyframe = -1;

  function applyMotionMode() {
    root.classList.toggle('is-stepped', stepped);
    root.dataset.motion = stepped ? 'stepped' : 'continuous';
    petals.setEnabled(!stepped);
    lens.setEnabled(!stepped);
    // No light wave in reduced motion (it only runs in island.update).
    if (stepped) island.setWave(0);
    fireworks.setStill(stepped);
    searchlights.setStill(stepped);
    story.setStill(stepped);
    if (stepped) cursorMotes.update(0, null);
    setBreathing(LIGHT_MOTION && !stepped);
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
    const limit = DPR_CAP || (breakpoint === 'mobile' ? 1.5 : 2);
    return Math.max(1, Math.min(window.devicePixelRatio || 1, limit, adaptiveCap));
  }

  function applyGlow() {
    const look = BLOOM[breakpoint];
    world.setBloom({ ...look, strength: look.strength * BLOOM_SCALE });
  }

  const shortLandscape = window.matchMedia(SHORT_LANDSCAPE);

  function placeWordmark() {
    const short = breakpoint === 'desktop' && shortLandscape.matches;
    const spec = short ? { ...HERO.wordmark.desktop, ...HERO.wordmark.desktopShort } : HERO.wordmark[breakpoint];
    const opening = chapters[0].camera[breakpoint];
    const openingFov = fovForAspect(opening.fov, width / height, breakpoint);
    const intro = copy.copies[0];
    // Short screens can overflow the copy region, so clear the text itself there.
    const introHeight = short ? Math.max(intro.offsetHeight, intro.scrollHeight) : intro.offsetHeight;
    const clearTop = spec.clear === undefined ? undefined : ((intro.offsetTop + introHeight + spec.clear) / height) * 100;
    wordmark.place({ ...opening, fov: openingFov }, width / height, spec, clearTop);
    needsRender = true;
  }

  function rebuild() {
    rig.setBreakpoint(breakpoint);
    rig.setAspect(width / height);
    citySoft.value = breakpoint === 'mobile' ? MOBILE_WINDOW_SOFT : 1;
    facadeBias.value = breakpoint === 'mobile' ? MOBILE_FACADE_BIAS : 0;
    applyGlow();
    vessels.setPaths(chapters, breakpoint);
    petals.setBreakpoint(breakpoint);
    foreground.setBreakpoint(breakpoint);
    buoy.setBreakpoint(breakpoint);
    lens.setBreakpoint(breakpoint);
    cornerBranch.place(breakpoint, width / height);
    boat.setBreakpoint(breakpoint);
    copy.setBreakpoint(breakpoint);
    fireworks.place(breakpoint, width / height);
    placeWordmark();
    atmosphere.place(breakpoint, width / height);
    story.place(breakpoint, width / height);
    searchlights.setBreakpoint(breakpoint);
    world.sky.userData.setBreakpoint(breakpoint);
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
      if (ready && breakpoint !== 'mobile') memories.load();
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

  // Lowers the pixel ratio when the 2 s average fps drops below target,
  // ignoring the first seconds after load (texture uploads, late artwork).
  let adaptiveSettle = ADAPTIVE.settle;
  let adaptiveTime = 0;
  let adaptiveFrames = 0;
  function adaptResolution(dt) {
    if (adaptiveSettle > 0) {
      adaptiveSettle -= dt;
      return;
    }
    adaptiveTime += dt;
    adaptiveFrames += 1;
    if (adaptiveTime < ADAPTIVE.window) return;
    const average = adaptiveFrames / adaptiveTime;
    adaptiveTime = 0;
    adaptiveFrames = 0;
    if (average >= ADAPTIVE[breakpoint]) return;
    const floor = ADAPTIVE.floor[breakpoint];
    if (pixelRatio <= floor) return;
    adaptiveCap = Math.max(floor, pixelRatio - ADAPTIVE.step);
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
      // The logo, not the hero's hidden title, so the next Tab reaches the nav.
      title = document.querySelector('.brand');
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

  const branchChapter = chapters.findIndex((chapter) => chapter.id === '05');

  function applyPose(p, isStepped, time) {
    const segment = rig.update(p, { stepped: isStepped });
    const held = segment.from === branchChapter && segment.eased <= 0.001;
    const arrived = segment.to === branchChapter && segment.eased >= 0.999;
    // The camera stays still for the first part of the leave. Start the
    // slide back out then, so a fast scroll can hide it before the view moves.
    const leaving = held && segment.u >= 0.05;
    cornerBranch.follow(isStepped ? null : rig.shift, {
      show: (held && !leaving) || arrived,
      retreat: leaving,
      stepped: isStepped,
    });
    vessels.update(segment, time, !isStepped);
    gating.update(segment, breakpoint, isStepped);
    atmosphere.setSegment(segment, isStepped);
    scene.fog.density = gating.fogDensity(segment);
  }

  const switchedOff = OFF.flatMap((name) => scene.getObjectsByProperty('name', name));

  // Every object drawn, hidden or off screen, so every shader is built behind
  // the entrance cover rather than mid-scroll.
  function showEverything() {
    const restore = [];
    scene.traverse((object) => {
      restore.push([object, object.visible, object.frustumCulled]);
      object.visible = true;
      object.frustumCulled = false;
    });
    return () => {
      for (const [object, visible, culled] of restore) {
        object.visible = visible;
        object.frustumCulled = culled;
      }
    };
  }

  // Scene shaders, compiled in parallel where the browser allows
  // (KHR_parallel_shader_compile), otherwise one by one; the first frame's
  // warm-up then builds the few left (post-processing, reflections).
  async function compileShaders() {
    if (!renderer.compileAsync) return;
    const restore = showEverything();
    try {
      await renderer.compileAsync(scene, camera);
    } finally {
      restore();
    }
  }

  // One unseen frame with everything drawn.
  function warmUp() {
    const restore = showEverything();
    water.reflect(camera, breakpoint);
    world.render();
    restore();
  }

  const control = { free: false };
  let debug = null;
  let fpsOverlay = null;
  let last = 0;
  let time = 0;
  let lastRendered = 0;
  let ready = false;
  let glideStart = -1; // frame time the opening glide began, or -1

  function frame(now) {
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    const state = conductor.update(dt);
    state.breakpoint = breakpoint;
    state.motion = stepped ? 'stepped' : 'continuous';
    const hero = state.p < 0;
    const heroFadeEnd = HERO.wordmark[breakpoint]?.fadeEnd ?? HERO.fadeEnd;
    const heroFade = {
      from: state.pTop + (HERO.leaveEnd - state.pTop) * HERO.fadeStart,
      to: state.pTop + (HERO.leaveEnd - state.pTop) * heroFadeEnd,
    };
    const storyLevels = copy.update(state.p, { stepped, index: state.index, hero: heroFade, rendered: state.pRendered, dwell: state.dwell });
    if (story.setLevels(storyLevels)) needsRender = true;
    header.update(state.index, hero);
    // A chapter address follows the crossing, so a reload or a shared link lands
    // where the visitor is; pages opened without one never get one.
    if (location.hash) {
      const address = hero ? '' : `#${sections[state.index].id}`;
      if (location.hash !== address) history.replaceState(null, '', address || location.pathname + location.search);
    }
    // The fireworks soften into smoke over the first 60% of the footer's rise.
    const footerTop = footerElement.getBoundingClientRect().top;
    if (fireworks.setFooter(Math.min(Math.max((innerHeight - footerTop) / (innerHeight * 0.6), 0), 1))) needsRender = true;

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
      boat.update(0, boatLevel, false);
      if (!needsRender && !control.free) return;
    } else {
      if (state.jumped && !veilActive) runVeil(() => conductor.snap());
      time += dt;
      // Mouse only, and only on the desktop framings, which were checked at its extremes.
      const offset = parallax.update(dt);
      const parallaxOn = parallax.enabled && breakpoint === 'desktop';
      rig.setParallax(parallaxOn ? offset.x : 0, parallaxOn ? offset.y : 0);
      const glide = glideStart < 0 ? 0 : (1 - Math.min(1, Math.max(0, (now - glideStart) / (HERO.glide.duration * 1000)))) ** 3;
      rig.setGlide(HERO.glide.back * glide, HERO.glide.rise * glide);
      if (glide === 0) glideStart = -1;
      if (!control.free) applyPose(state.pRendered, false, time);
      camera.updateMatrixWorld();
      petals.setDensity(petalLevel * (1 - PETAL_YIELD * storyLevels.yield));
      wordmark.fadeAt(state.pRendered, heroFade.from, heroFade.to);
      water.update(dt);
      // The first wave waits for the entrance cover to lift.
      island.setWave(root.classList.contains('is-ready') ? waveLevel : 0);
      island.update(time, dt, camera, parallax.pointer);
      foreground.update(time);
      atmosphere.update(time);
      searchlights.update(time);
      cornerBranch.update(time, dt);
      boat.update(dt, boatLevel, true);
      fireworks.update(time);
      moon.update(time);
      buoy.update(time);
      updateBreathing(time);
      const speed = dt > 0 ? Math.abs(state.pRendered - lastRendered) / dt : 0;
      stirState = stir.enabled ? stir.update(dt) : null;
      petals.update(dt, camera, speed, stirState);
      cursorMotes.update(dt, stirState);
      photoCards.update(dt);
      ticket.update(dt);
      cityTouch.update(dt, storyLevels.touch, camera);
      lens.update(dt, camera, parallaxOn ? offset : NO_POINTER);
      lastRendered = state.pRendered;
    }

    story.update(time, camera, stepped ? null : stirState);
    needsRender = false;
    for (const object of switchedOff) object.visible = false;
    water.setFade('wave', island.wave.level);
    if (!ready) warmUp();
    water.reflect(camera, breakpoint);
    world.render();
    if (!stepped && ready) adaptResolution(dt);
    debug?.update(state, dt, pixelRatio);
    fpsOverlay?.sample(dt, pixelRatio);

    if (!ready) {
      ready = true;
      window.clearTimeout(initGuard);
      performance.mark('vh:first-frame');
      loading.finish(() => {
        // The opening glide, on visits from the top only: it starts under the
        // still-opaque cover and eases in as the cover fades.
        const fromTop = !/^#chapter-0[1-6]$/.test(location.hash) && window.scrollY <= 2;
        if (fromTop && !stepped) glideStart = performance.now();
        root.classList.add('is-ready');
        fireworks.load();
        memories.load();
        photoCards.load();
      });
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
  // 01's copy may grow once its fonts arrive; the phone wordmark keeps clear of it.
  document.fonts?.ready.then(placeWordmark);
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
        world,
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
        fireworks,
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

  // The images the first view shows (clouds, mist, bauhinia, petals; the
  // fireworks too when it opens on 06), then the shaders.
  if (conductor.state.index === chapters.length - 1) fireworks.load();
  await loading.textures();
  await compileShaders();
  await stage('shaders');
  play();
}

function boot() {
  // From here this script's own guards apply, not the inline 12 s timer.
  window.clearTimeout(window.__vhBootTimer);
  const reduced = params.get('motion') === 'reduced' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loading = createLoadingScreen({ mode: ENTRANCE, reduced });
  // The header works in the poster-only fallback too, where links scroll natively.
  const header = createSiteHeader();
  createSiteFooter();
  createCursorRing();
  if (params.has('fallback')) return enterFallback('requested');
  if (!supportsWebGL2()) return enterFallback('no-webgl2');

  root.classList.add('is-enhanced');
  const initGuard = window.setTimeout(() => enterFallback('init-timeout'), INIT_TIMEOUT);
  start(initGuard, header, loading).catch((error) => {
    window.clearTimeout(initGuard);
    if (root.classList.contains('is-fallback')) return;
    if (ENTRANCE !== 'fail') console.error(error);
    enterFallback('init-error');
  });
}

boot();
