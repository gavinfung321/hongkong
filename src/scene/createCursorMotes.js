import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial, Vector3 } from 'three';
import { OVERLAY } from './bloom.js';

// A trail of warm motes shed by the desktop mouse across the whole site
// (user choices, 2026-10-04; the technique studied from the Kage reference,
// rebuilt with our own code and values). Motes are released by distance
// travelled, spaced along the path, so a slow hand lays a thread and a quick
// one throws them wide; standing still releases almost nothing. Each lives a
// couple of seconds: it drifts back from the hand, frays on a slow curl,
// rises a little, and softens as it fades. A resting pointer breathes out a
// faint one now and then, so it keeps a glow. Drawn in screen space after
// the bloom, over the scene and under all page text. Mouse only; off in
// reduced motion (main.js).
//
// Lengths are shares of the window height, so the trail reads the same at
// any size.
const TRAIL = {
  // A third of the first build's (user request, 2026-10-04: too many).
  pool: 60,
  colour: [1, 0.84, 0.6], // scene 02's dust; the core runs paler
  core: [1, 0.96, 0.88],
  step: 0.032, // released every this far along the path
  burst: 6, // at most this many per frame
  follow: 16, // per second: the release point trails the pointer
  scatter: 0.035, // released within ± this of the path
  back: 0.035, // initial drift away from the hand's direction, per second
  jitter: [0.07, 0.06], // random initial drift, per second (x, y)
  curl: [0.06, 0.05], // fraying sway, per second
  rise: 0.02, // buoyancy, per second²
  drag: 0.6, // per second
  life: [0.9, 1.8], // seconds
  size: [0.007, 0.016], // diameter with halo
  soften: 0.5, // grows this much over its life as it fades
  brightness: 0.9,
  idle: { every: 0.45, life: [2, 3.2], brightness: 0.45 },
};

const vertex = /* glsl */ `
  attribute float aAlpha;
  attribute float aSize;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    gl_Position = vec4(position.xy, 0.0, 1.0);
    gl_PointSize = aSize;
  }
`;

// A small pale core in a faint warm halo.
const fragment = /* glsl */ `
  uniform vec3 uColour;
  uniform vec3 uCore;
  varying float vAlpha;

  void main() {
    if (vAlpha <= 0.0) discard;
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float halo = 1.0 - smoothstep(0.0, 1.0, r);
    float core = 1.0 - smoothstep(0.05, 0.3, r);
    gl_FragColor = vec4(mix(uColour, uCore, core), min(1.0, 0.55 * halo * halo + core) * vAlpha);
  }
`;

const smoothstep = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const between = ([a, b]) => a + (b - a) * Math.random();
const spread = () => Math.random() + Math.random() - 1; // -1..1, most near 0

export function createCursorMotes(renderer) {
  const { pool } = TRAIL;
  const motes = Array.from({ length: pool }, () => ({ x: 0, y: 0, vx: 0, vy: 0, age: 1, life: 1, size: 0, glow: 0, phase: 0 }));
  const positions = new Float32Array(pool * 3);
  const alphas = new Float32Array(pool);
  const sizes = new Float32Array(pool);
  const geometry = new BufferGeometry();
  const position = new BufferAttribute(positions, 3);
  const alpha = new BufferAttribute(alphas, 1);
  const size = new BufferAttribute(sizes, 1);
  geometry.setAttribute('position', position);
  geometry.setAttribute('aAlpha', alpha);
  geometry.setAttribute('aSize', size);
  const points = new Points(
    geometry,
    new ShaderMaterial({
      uniforms: { uColour: { value: new Vector3(...TRAIL.colour) }, uCore: { value: new Vector3(...TRAIL.core) } },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  );
  points.name = 'cursor-motes';
  points.frustumCulled = false;
  points.renderOrder = 12; // after the near petals (11)
  points.layers.set(OVERLAY);
  points.visible = false;

  // Positions in shares of the window height from its top-left corner.
  const emitter = { x: 0, y: 0, lastX: 0, lastY: 0, travelled: 0, idle: 0, seen: false };
  let next = 0;
  let time = 0;
  let alive = 0;

  function release(x, y, angle, idle) {
    const mote = motes[next];
    next = (next + 1) % pool;
    mote.x = x + spread() * TRAIL.scatter;
    mote.y = y + spread() * TRAIL.scatter;
    mote.vx = -Math.cos(angle) * TRAIL.back + (Math.random() - 0.5) * 2 * TRAIL.jitter[0];
    mote.vy = -Math.sin(angle) * TRAIL.back + (Math.random() - 0.5) * 2 * TRAIL.jitter[1];
    mote.age = 0;
    mote.life = between(idle ? TRAIL.idle.life : TRAIL.life);
    mote.size = between(TRAIL.size) * (idle ? 0.8 : 1);
    mote.glow = idle ? TRAIL.idle.brightness : TRAIL.brightness;
    mote.phase = Math.random() * Math.PI * 2;
  }

  function clear() {
    for (const mote of motes) mote.age = mote.life;
    emitter.seen = false;
    alive = 0;
    points.visible = false;
  }

  // pointer: pointerStir.js state, or null when the effect is off (gone at once).
  function update(dt, pointer) {
    if (!pointer) {
      clear();
      return;
    }
    time += dt;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    if (pointer.present) {
      const px = ((pointer.x + 1) / 2) * aspect;
      const py = (1 - pointer.y) / 2;
      if (!emitter.seen) {
        emitter.x = emitter.lastX = px;
        emitter.y = emitter.lastY = py;
        emitter.seen = true;
      }
      const k = 1 - Math.exp(-TRAIL.follow * dt);
      emitter.x += (px - emitter.x) * k;
      emitter.y += (py - emitter.y) * k;
      const dx = emitter.x - emitter.lastX;
      const dy = emitter.y - emitter.lastY;
      const moved = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      // Spaced along the stretch actually travelled this frame.
      emitter.travelled += moved;
      let count = 0;
      while (emitter.travelled >= TRAIL.step && count < TRAIL.burst) {
        emitter.travelled -= TRAIL.step;
        count++;
        const t = moved > 1e-6 ? Math.min(1, (count * TRAIL.step) / moved) : 0;
        release(emitter.lastX + dx * t, emitter.lastY + dy * t, angle, false);
      }
      if (count === TRAIL.burst) emitter.travelled = 0;
      emitter.idle += dt;
      if (emitter.idle > TRAIL.idle.every) {
        emitter.idle = 0;
        release(emitter.x, emitter.y, Math.random() * Math.PI * 2, true);
      }
      emitter.lastX = emitter.x;
      emitter.lastY = emitter.y;
    } else {
      emitter.seen = false;
    }

    const drag = 1 - TRAIL.drag * dt;
    const pixels = height * renderer.getPixelRatio();
    alive = 0;
    motes.forEach((mote, i) => {
      if (mote.age >= mote.life) {
        alphas[i] = 0;
        return;
      }
      alive++;
      mote.age += dt;
      const u = Math.min(1, mote.age / mote.life);
      mote.x += (mote.vx + Math.sin(time * 1.3 + mote.phase) * TRAIL.curl[0]) * dt;
      mote.y += (mote.vy + Math.cos(time * 1.1 + mote.phase * 1.7) * TRAIL.curl[1]) * dt;
      mote.vx *= drag;
      mote.vy = mote.vy * drag - TRAIL.rise * dt;
      positions[i * 3] = (mote.x / aspect) * 2 - 1;
      positions[i * 3 + 1] = 1 - mote.y * 2;
      alphas[i] = smoothstep(0, 0.12, u) * (1 - smoothstep(0.25, 1, u)) * mote.glow;
      sizes[i] = mote.size * (1 + TRAIL.soften * u) * pixels;
    });
    points.visible = alive > 0;
    if (!points.visible) return;
    position.needsUpdate = true;
    alpha.needsUpdate = true;
    size.needsUpdate = true;
  }

  return { points, update };
}
