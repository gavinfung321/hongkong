import { cityLight, cityTouchMap } from '../scene/cityLight.js';
import { SCENE_05_CALLOUTS } from '../story/scene05/config.js';

// 05's touch light (user choice, 2026-10-04): under a mouse, a few office
// windows switch on around the pointer and off again just behind it; on
// touch screens a tap does the same round the finger. Kept small (user
// request, 2026-10-04: "way too much"; was 110 px, 150 px taps, 0.55 s).
// The pointer paints a soft spot into a small map of the screen, which
// fades every frame (cityLight.js turns it into windows). `level` comes
// from the chapter (copyLayer.js), so it only works in 05; off in stepped
// mode.
const TOUCH = {
  radius: 50, // px, the spot under a mouse
  tap: 80, // px, a tap's patch
  build: 6, // per second, how fast the spot under a still mouse fills
  fade: 0.3, // s, time constant of the fade
};

export function createCityTouch() {
  const { canvas, texture } = cityTouchMap;
  const ctx = canvas.getContext('2d');
  const sceneCopy = document.querySelector('#chapter-05 .chapter__copy');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let pointer = null; // [x, y] px while a mouse is over the page
  let painted = null; // where the last frame's spot went
  const taps = [];
  let live = 0; // s left before the map has surely faded out
  let active = false;
  let skylineHover = false;
  let skylineTouch = false;
  let sceneVisible = false;

  function overSkyline([x, y]) {
    const breakpoint = document.documentElement.dataset.breakpoint === 'mobile' ? 'mobile' : 'desktop';
    const bounds = SCENE_05_CALLOUTS.skylineHit[breakpoint];
    const px = (x / innerWidth) * 100;
    const py = (y / innerHeight) * 100;
    return px >= bounds.left && px <= bounds.right && py >= bounds.top && py <= bounds.bottom;
  }

  function sceneOpen() {
    return Boolean(sceneCopy && !sceneCopy.classList.contains('is-hidden'));
  }

  function setSkylineHover(next) {
    const value = sceneOpen() && next;
    if (skylineHover === value) return;
    skylineHover = value;
    window.dispatchEvent(new CustomEvent('citylighthover', { detail: value }));
  }

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'mouse' && fine.matches) {
      pointer = [event.clientX, event.clientY];
      setSkylineHover(overSkyline(pointer));
    }
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => {
    pointer = null;
    setSkylineHover(false);
  });
  window.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') {
      const tap = [event.clientX, event.clientY];
      taps.push(tap);
      skylineTouch = true;
      setSkylineHover(overSkyline(tap));
    }
  }, { passive: true });
  window.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'mouse') skylineTouch = false;
    setSkylineHover(skylineTouch || (pointer ? overSkyline(pointer) : false));
  });
  window.addEventListener('pointercancel', () => {
    skylineTouch = false;
    setSkylineHover(false);
  });

  function spot([x, y], radius, alpha) {
    const sx = canvas.width / innerWidth;
    const sy = canvas.height / innerHeight;
    ctx.save();
    ctx.translate(x * sx, y * sy);
    ctx.scale(sx, sy);
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    gradient.addColorStop(0.55, `rgba(255, 255, 255, ${alpha * 0.6})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }

  // camera: the main camera, after this frame's pose.
  function update(dt, level, camera) {
    const visible = sceneCopy && !sceneCopy.classList.contains('is-hidden');
    if (sceneVisible && !visible) {
      skylineTouch = false;
      setSkylineHover(false);
      window.dispatchEvent(new Event('citylightreset'));
    }
    sceneVisible = visible;
    if (visible && pointer && !skylineTouch) setSkylineHover(overSkyline(pointer));
    const uniforms = cityLight;
    active = level > 0;
    if (level <= 0) {
      taps.length = 0;
      painted = null;
      if (uniforms.uTouchLevel.value !== 0) uniforms.uTouchLevel.value = 0;
      if (live <= 0) return;
    }
    const painting = level > 0 && (pointer || taps.length);
    if (painting) live = TOUCH.fade * 6;
    if (live <= 0) return;
    live -= dt;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(0, 0, 0, ${live <= 0 ? 1 : 1 - Math.exp(-dt / TOUCH.fade)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (level > 0) {
      ctx.globalCompositeOperation = 'lighter';
      if (pointer) {
        // Spots along the way from the last frame's, so a quick move leaves
        // an unbroken trail.
        const from = painted ?? pointer;
        const steps = Math.max(1, Math.ceil(Math.hypot(pointer[0] - from[0], pointer[1] - from[1]) / (TOUCH.radius * 0.35)));
        const alpha = Math.min(1, TOUCH.build * dt) * Math.min(1, 3 / steps + 0.25);
        for (let k = 1; k <= steps; k++) {
          const t = k / steps;
          spot([from[0] + (pointer[0] - from[0]) * t, from[1] + (pointer[1] - from[1]) * t], TOUCH.radius, alpha);
        }
      }
      painted = pointer;
      for (const tap of taps) spot(tap, TOUCH.tap, 1);
      taps.length = 0;
    }
    texture.needsUpdate = true;
    uniforms.uTouchLevel.value = level;
    uniforms.uTouchMatrix.value.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  }

  return { update };
}
