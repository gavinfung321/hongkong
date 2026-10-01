// Development-only tuning tools, loaded with ?debug on the Vite dev server.
// Keys: O overlay, [ ] overlay opacity, R copy region, P probe, C log pose,
// F free camera, 1–6 jump to a hold.
import { Matrix4, Vector3 } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SCROLL } from '../data/chapters.js';
import { createCameraRig } from '../scroll/cameraRig.js';
import {
  collectPoints,
  createSolverCamera,
  measure,
  nelderMead,
  paramsToPose,
  poseCamera,
  poseToParams,
  rectsIntersect,
  score,
  screenToPlane,
} from './composition.js';
import { WORLD } from '../data/world.js';

const ASPECT = { desktop: 1.6, mobile: 390 / 844 };

function el(tag, className, parent = document.body) {
  const node = document.createElement(tag);
  node.className = className;
  parent.append(node);
  return node;
}

const CSS = `
.debug-panel { position: fixed; top: 8px; right: 8px; z-index: 100; margin: 0; padding: 6px 8px;
  background: rgb(0 0 0 / 0.72); color: #9ff; font: 11px/1.35 ui-monospace, Consolas, monospace;
  pointer-events: none; white-space: pre; }
.debug-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100lvh; z-index: 60;
  object-fit: fill; pointer-events: none; }
.debug-region { position: fixed; z-index: 70; outline: 2px dashed #ff0; pointer-events: none; }
.debug-probe { position: fixed; top: 0; left: 0; width: 100vw; height: 100lvh; z-index: 80; pointer-events: none; }
.debug-probe__box { position: absolute; outline: 1px solid #0f0; }
.debug-probe__box::before { content: attr(data-label); position: absolute; top: -14px; left: 0;
  color: #0f0; font: 10px ui-monospace, Consolas, monospace; }
.debug-probe__list { position: absolute; left: 8px; bottom: 8px; margin: 0; padding: 6px 8px;
  background: rgb(0 0 0 / 0.72); color: #cfc; font: 11px/1.35 ui-monospace, Consolas, monospace; }
.is-free-camera .world { z-index: 40; pointer-events: auto; }
`;

export function createDebug(ctx) {
  const { renderer, camera, chapters, conductor, control } = ctx;
  const root = document.documentElement;
  el('style', '', document.head).textContent = CSS;

  const panel = el('pre', 'debug-panel');
  const overlay = el('img', 'debug-overlay');
  overlay.alt = '';
  overlay.hidden = true;
  const region = el('div', 'debug-region');
  region.hidden = true;
  const probeLayer = el('div', 'debug-probe');
  probeLayer.hidden = true;
  const probeList = el('pre', 'debug-probe__list', probeLayer);

  let overlayOpacity = 0.5;
  let fpsTime = 0;
  let fpsFrames = 0;
  let fps = 0;
  let panelTime = 0;
  const frameTimes = [];
  const log = [];

  const landmarks = {};
  function refreshLandmarks() {
    for (const [key, object] of Object.entries(ctx.landmarks)) {
      landmarks[key] = { object, points: collectPoints(object) };
    }
  }
  refreshLandmarks();

  function onePercentLow() {
    if (frameTimes.length < 20) return 0;
    const sorted = [...frameTimes].sort((a, b) => b - a);
    const n = Math.max(1, Math.floor(sorted.length * 0.01));
    return n / sorted.slice(0, n).reduce((s, t) => s + t, 0);
  }

  // ---- Overlays ----------------------------------------------------------

  function updateOverlay(state) {
    if (overlay.hidden) return;
    const src = chapters[state.index].storyboard[ctx.breakpoint()];
    if (!overlay.src.endsWith(src)) overlay.src = src;
    overlay.style.opacity = String(overlayOpacity);
  }

  function updateRegion(state) {
    if (region.hidden) return;
    const r = chapters[state.index].copy[ctx.breakpoint()];
    Object.assign(region.style, {
      left: `${r.left}vw`,
      top: `${r.top}lvh`,
      width: `${r.right - r.left}vw`,
      height: `${r.bottom - r.top}lvh`,
    });
  }

  const boxes = {};
  function updateProbe(state) {
    if (probeLayer.hidden) return;
    const bp = ctx.breakpoint();
    const chapter = chapters[state.index];
    const targets = chapter.probes[bp];
    const measured = measure(visibleLandmarks(), camera);
    const result = score(targets, measured);
    const copyRegion = chapter.copy[bp];

    const lines = [`probe ${chapter.id} ${bp}  error ${result.error.toFixed(1)}`];
    for (const row of result.rows) {
      const actual = typeof row.actual === 'number' ? row.actual.toFixed(1) : String(row.actual);
      lines.push(`${row.ok ? '  ' : '✗ '}${row.key}.${row.side}  ${actual}  (target ${row.target})`);
    }
    for (const [key, rect] of Object.entries(measured.rects)) {
      if (rectsIntersect(rect, copyRegion) && state.phase === 'hold') lines.push(`✗ ${key} intersects copy region`);
    }
    const overflow = copyOverflow(state.index);
    if (overflow > 0) lines.push(`✗ copy overflows its region by ${overflow.toFixed(0)}px`);
    probeList.textContent = lines.join('\n');

    for (const [key, rect] of Object.entries(measured.rects)) {
      const box = (boxes[key] ??= el('div', 'debug-probe__box', probeLayer));
      box.dataset.label = key;
      box.hidden = rect.offscreen;
      if (rect.offscreen) continue;
      Object.assign(box.style, {
        left: `${rect.left}%`,
        top: `${rect.top}%`,
        width: `${rect.right - rect.left}%`,
        height: `${rect.bottom - rect.top}%`,
      });
    }
  }

  // Pixels by which a chapter's copy content exceeds its copy-safe region.
  function copyOverflow(index) {
    const copy = ctx.copy.copies[index];
    return Math.max(0, copy.scrollHeight - copy.clientHeight, copy.scrollWidth - copy.clientWidth);
  }

  function visibleLandmarks() {
    const out = {};
    for (const [key, entry] of Object.entries(landmarks)) if (entry.object.visible) out[key] = entry;
    return out;
  }

  // ---- Free camera ---------------------------------------------------------

  let orbit = null;
  function toggleFree() {
    control.free = !control.free;
    root.classList.toggle('is-free-camera', control.free);
    if (control.free) {
      camera.clearViewOffset();
      orbit = new OrbitControls(camera, renderer.domElement);
      orbit.target.copy(camera.position).add(camera.getWorldDirection(new Vector3()).multiplyScalar(100));
      orbit.update();
    } else {
      orbit?.dispose();
      orbit = null;
    }
  }

  function currentPose() {
    const direction = camera.getWorldDirection(new Vector3());
    // A level camera with a lens shift looks along the shifted frame centre.
    if (camera.view?.enabled) direction.y = -camera.view.offsetY * 2 * Math.tan((camera.fov * Math.PI) / 360);
    const target = camera.position.clone().add(direction.normalize().multiplyScalar(400));
    const round = (n) => Math.round(n * 10) / 10;
    return {
      position: camera.position.toArray().map(round),
      target: target.toArray().map(round),
      fov: round(camera.fov),
    };
  }

  function logPose() {
    const json = JSON.stringify(currentPose());
    console.log(`[pose] ${json}`);
    navigator.clipboard?.writeText(json).catch(() => {});
  }

  function jumpTo(k) {
    window.scrollTo({ top: conductor.scrollForKeyframe(k), behavior: 'auto' });
  }

  window.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement) return;
    const key = event.key.toLowerCase();
    if (key === 'o') overlay.hidden = !overlay.hidden;
    else if (key === '[') overlayOpacity = Math.max(0.1, overlayOpacity - 0.1);
    else if (key === ']') overlayOpacity = Math.min(1, overlayOpacity + 0.1);
    else if (key === 'r') region.hidden = !region.hidden;
    else if (key === 'p') probeLayer.hidden = !probeLayer.hidden;
    else if (key === 'h') panel.hidden = !panel.hidden;
    else if (key === 'c') logPose();
    else if (key === 'f') toggleFree();
    else if (key >= '1' && key <= '6') jumpTo(Number(key) - 1);
    else return;
    ctx.requestRender();
  });

  // ---- Solver API (window.__vh) ------------------------------------------

  const solverCamera = createSolverCamera();

  // Scores a pose with the vessels placed at that chapter's keyframe.
  function evaluate(index, bp, pose, keys) {
    poseCamera(solverCamera, pose, ASPECT[bp]);
    const targets = chapters[index].probes[bp];
    const filtered = keys ? Object.fromEntries(Object.entries(targets).filter(([k]) => keys.includes(k))) : targets;
    const subset = {};
    for (const key of Object.keys(filtered)) if (landmarks[key]) subset[key] = landmarks[key];
    const saved = ['ferry', 'junk'].map((k) => {
      const object = landmarks[k].object;
      const before = [object.position.clone(), object.rotation.clone()];
      const [x, z, h = 0] = chapters[index].vessels[bp][k];
      object.position.set(x, 0, z);
      object.rotation.set(0, h, 0);
      object.updateMatrixWorld(true);
      return [object, before];
    });
    const result = score(filtered, measure(subset, solverCamera));
    for (const [object, [position, rotation]] of saved) {
      object.position.copy(position);
      object.rotation.copy(rotation);
      object.updateMatrixWorld(true);
    }
    return result;
  }

  function groundAt(x, z) {
    let top = 0;
    for (const [x0, x1, z0, z1, t] of WORLD.kowloon.blocks) {
      if (x >= x0 && x <= x1 && z >= z0 && z <= z1) top = Math.max(top, t);
    }
    for (const { points, top: t } of WORLD.kowloon.decks) {
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, zi] = points[i];
        const [xj, zj] = points[j];
        if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
      }
      if (inside) top = Math.max(top, t);
    }
    const [a, b, c, d, t] = WORLD.island.slab;
    if (x >= a && x <= b && z >= c && z <= d) top = Math.max(top, t);
    return top;
  }

  const HULL = { ferry: [44, 14], junk: [32, 11] };

  // Solves a camera pose (and the hold positions of any vessel with an
  // on-screen target) against the chapter's composition targets.
  // Options: box [xMin, xMax, zMin, zMax] for the camera, minEye, maxHeight,
  // minFov, maxFov, minPitch, maxPitch (degrees),
  // headings { ferry: true } to free vessel headings,
  // start pose, restarts, iterations.
  function solve(index, bp, opts = {}) {
    const chapter = chapters[index];
    const targets = chapter.probes[bp];
    const keys = Object.keys(targets).filter((k) => !opts.keys || opts.keys.includes(k));
    const vesselKeys = ['ferry', 'junk'].filter((k) => keys.includes(k) && !targets[k].offscreen);
    const freeHeading = vesselKeys.map((k) => Boolean(opts.headings?.[k]));
    const x0 = [...poseToParams(opts.start ?? chapter.camera[bp])];
    const layout = vesselKeys.map((k, i) => {
      const [x, z, h = 0] = chapter.vessels[bp][k];
      const offset = x0.length;
      x0.push(x, z);
      if (freeHeading[i]) x0.push(h);
      return { key: k, offset, heading: freeHeading[i] ? null : h };
    });
    const saved = vesselKeys.map((k) => [landmarks[k].object.position.clone(), landmarks[k].object.rotation.clone()]);

    function placeVessels(x) {
      for (const { key, offset, heading } of layout) {
        const object = landmarks[key].object;
        object.position.set(x[offset], 0, x[offset + 1]);
        object.rotation.set(0, heading ?? x[offset + 2], 0);
        object.updateMatrixWorld(true);
      }
    }

    function run(x) {
      placeVessels(x);
      const pose = paramsToPose(x.slice(0, 6));
      poseCamera(solverCamera, pose, ASPECT[bp]);
      const sub = {};
      const tg = {};
      for (const k of keys) {
        tg[k] = targets[k];
        if (landmarks[k]) sub[k] = landmarks[k];
      }
      return { pose, result: score(tg, measure(sub, solverCamera)) };
    }

    function f(x) {
      const [px, py, pz, , pitch, fov] = x;
      let e = run(x).result.error;
      const minH = (opts.minEye ?? 1.6) + groundAt(px, pz);
      if (py < minH) e += 50 * (minH - py) ** 2;
      if (opts.maxHeight && py > opts.maxHeight) e += 50 * (py - opts.maxHeight) ** 2;
      const [minFov, maxFov] = [opts.minFov ?? 24, opts.maxFov ?? 80];
      if (fov < minFov) e += 50 * (minFov - fov) ** 2;
      if (fov > maxFov) e += 50 * (fov - maxFov) ** 2;
      if (Math.abs(pitch) > 60) e += 50 * (Math.abs(pitch) - 60) ** 2;
      if (opts.minPitch != null && pitch < opts.minPitch) e += 50 * (opts.minPitch - pitch) ** 2;
      if (opts.maxPitch != null && pitch > opts.maxPitch) e += 50 * (pitch - opts.maxPitch) ** 2;
      if (opts.box) {
        const [a, b, c, d] = opts.box;
        e += 50 * (Math.max(0, a - px) ** 2 + Math.max(0, px - b) ** 2 + Math.max(0, c - pz) ** 2 + Math.max(0, pz - d) ** 2);
      }
      for (const { key, offset } of layout) {
        const [length, beam] = HULL[key];
        let land = 0;
        for (const u of [-0.5, 0, 0.5]) {
          for (const w of [-0.5, 0, 0.5]) if (groundAt(x[offset] + u * length, x[offset + 1] + w * beam) > 0) land += 1;
        }
        e += land * 200;
      }
      return e;
    }

    const steps = [25, 4, 25, 4, 3, 4];
    for (const { heading } of layout) steps.push(30, 30, ...(heading === null ? [0.3] : []));
    let best = { x: x0, value: f(x0) };
    for (let r = 0; r < (opts.restarts ?? 6); r++) {
      const scaled = steps.map((s) => s / (1 + r * 0.7));
      const result = nelderMead(f, best.x, scaled, { iterations: opts.iterations ?? 3000, tolerance: 1e-9 });
      if (result.value < best.value) best = result;
    }

    const { pose, result } = run(best.x);
    vesselKeys.forEach((k, i) => {
      landmarks[k].object.position.copy(saved[i][0]);
      landmarks[k].object.rotation.copy(saved[i][1]);
    });
    const round = (n) => Math.round(n * 10) / 10;
    const vessels = {};
    for (const { key, offset, heading } of layout) {
      vessels[key] = [round(best.x[offset]), round(best.x[offset + 1])];
      const h = heading ?? best.x[offset + 2];
      if (h) vessels[key].push(Math.round(h * 100) / 100);
    }
    const fmt = (v) => (typeof v === 'number' ? v.toFixed(1) : String(v));
    return {
      pose,
      vessels,
      value: Math.round(best.value * 100) / 100,
      fails: result.rows.filter((r) => !r.ok).map((r) => `${r.key}.${r.side} ${fmt(r.actual)} vs ${r.target}`),
    };
  }

  function applySolution(index, bp, solution) {
    Object.assign(chapters[index].vessels[bp], solution.vessels);
    apply(index, bp, solution.pose);
    if (bp === ctx.breakpoint()) ctx.rebuild();
    return 'applied';
  }

  // Applies a pose to the in-memory config and rebuilds the camera curves.
  function apply(index, bp, pose) {
    Object.assign(chapters[index].camera[bp], pose);
    if (bp === ctx.breakpoint()) ctx.rebuild();
    return chapters[index].camera[bp];
  }

  // Places a point on the water (or a deck plane) under a screen point, as seen
  // from chapter index's pose at the reference aspect.
  function pick(index, bp, xPct, yPct, planeY = 0) {
    poseCamera(solverCamera, chapters[index].camera[bp], ASPECT[bp]);
    const hit = screenToPlane(solverCamera, xPct, yPct, planeY);
    return hit ? [Math.round(hit.x * 10) / 10, Math.round(hit.z * 10) / 10] : null;
  }

  function report(index, bp) {
    const { error, rows } = evaluate(index, bp, chapters[index].camera[bp]);
    return { error: Math.round(error * 10) / 10, rows };
  }

  // Samples the camera path for both breakpoints and lists every stretch where
  // the eye comes within `margin` metres of a static mesh (per instance) or
  // less than `eye` metres above the ground. Vessels are ignored.
  function clearance({ step = 0.002, margin = 3, eye = 1.5 } = {}) {
    const moving = new Set();
    for (const k of ['ferry', 'junk']) landmarks[k].object.traverse((o) => moving.add(o));
    const boxes = [];
    const m = new Matrix4();
    ctx.scene.updateMatrixWorld(true);
    ctx.scene.traverse((o) => {
      if (!o.isMesh || moving.has(o) || !o.visible || o.name === 'wordmark' || o.name === 'petals') return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      const names = [];
      for (let p = o; p && p !== ctx.scene; p = p.parent) if (p.name) names.push(p.name);
      const name = names.join('<') || 'mesh';
      const count = o.isInstancedMesh ? o.count : 1;
      for (let i = 0; i < count; i++) {
        if (o.isInstancedMesh) o.getMatrixAt(i, m).premultiply(o.matrixWorld);
        else m.copy(o.matrixWorld);
        const box = o.geometry.boundingBox.clone().applyMatrix4(m);
        // Ground-level slabs and water are covered by the ground check; the sky
        // dome and mountain range are skipped by size.
        const wide = box.max.x - box.min.x > 1000 || box.max.z - box.min.z > 1000;
        if (box.max.y > 3 && !wide) boxes.push({ box, name: o.isInstancedMesh ? `${name}#${i}` : name });
      }
    });
    const camera = ctx.camera.clone();
    const rig = createCameraRig(camera, chapters, { hold: SCROLL.hold });
    const pTop = ctx.conductor.state.pTop;
    rig.setStart(pTop);
    const out = {};
    for (const bp of ['desktop', 'mobile']) {
      rig.setBreakpoint(bp);
      rig.setAspect(ASPECT[bp]);
      const groups = {};
      const hit = (what, p, d) => {
        const g = (groups[what] ??= { from: p, to: p, min: Infinity });
        g.to = p;
        g.min = Math.min(g.min, Math.round(d * 100) / 100);
      };
      // From the top of the page, including the opening push.
      for (let p = pTop; p <= chapters.length - 0.5; p += step) {
        const q = Math.round(p * 1000) / 1000;
        rig.update(p);
        const pos = camera.position;
        const above = pos.y - groundAt(pos.x, pos.z);
        if (above < eye) hit('ground', q, above);
        for (const { box, name } of boxes) {
          const d = box.distanceToPoint(pos);
          if (d < margin) hit(name, q, d);
        }
      }
      out[bp] = groups;
    }
    return out;
  }

  window.__vh = {
    ...ctx,
    landmarks,
    refreshLandmarks,
    solve,
    apply,
    applySolution,
    groundAt,
    pick,
    report,
    clearance,
    copyOverflow,
    currentPose,
    evaluate,
    jumpTo,
    log,
  };

  function update(state, dt, pixelRatio) {
    fpsFrames += 1;
    fpsTime += dt;
    frameTimes.push(dt);
    if (frameTimes.length > 600) frameTimes.shift();
    if (fpsTime >= 1) {
      fps = fpsFrames / fpsTime;
      fpsFrames = 0;
      fpsTime = 0;
    }
    if (orbit) orbit.update();

    updateOverlay(state);
    updateRegion(state);
    updateProbe(state);

    panelTime += dt;
    if (panelTime < 0.25) return;
    panelTime = 0;
    const info = renderer.info;
    panel.textContent = [
      `chapter ${chapters[state.index].id}  ${state.phase}`,
      `p ${state.p.toFixed(3)}  pR ${state.pRendered.toFixed(3)}  local ${state.local.toFixed(2)}`,
      `${ctx.breakpoint()}  ${state.motion}${control.free ? '  FREE' : ''}`,
      `fps ${fps.toFixed(0)}  1% ${onePercentLow().toFixed(0)}  dpr ${pixelRatio.toFixed(2)}`,
      `calls ${info.render.calls}  tris ${(info.render.triangles / 1000).toFixed(1)}k`,
      `geo ${info.memory.geometries}  tex ${info.memory.textures}`,
      ...log.slice(-3),
    ].join('\n');
  }

  return { update, log: (line) => log.push(line) };
}
