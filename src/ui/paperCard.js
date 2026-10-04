// Photo cards (04, user requests, 2026-10-04): each photo hangs like cloth
// pinned along its top edge, drawn in WebGL on its own small canvas.
//
// The cloth is a height field (GRID × GRID nodes) stepped as a damped wave:
// gusts of wind travel across it and its folds spread, cross and settle, so
// the motion never repeats like a loop. From the heights come the sheet's
// depth, its normals and a crease term; the sides and foot draw in as the
// cloth tilts (it cannot stretch), so its outline ripples. The light comes
// only from the folds: slopes catch a sheen, creases darken, flat cloth is
// left as the photo, and a thin hem inside the edge catches the light. On
// the night page the card casts light rather than shadow: a soft cream glow
// down and right of it, moving with the cloth. Under a mouse the pointer
// lifts the cloth toward the viewer and leaves ripples behind it; the
// outline, drawn on the cloth so it follows the folds, brightens, and a
// warm pool of light sits under the pointer, shaded by the folds like the
// rest of the photo (user choice, 2026-10-04). The technique follows Kage's photo cards, written
// from scratch (no Kage code, values or assets). Touch screens, reduced
// motion (styles.css) and browsers without WebGL2 keep the still photo.

const GRID = 96;
const NODES = GRID + 1;
const STEP = 1 / 120; // s, fixed simulation step
const WAVE = 24; // nodes per second
const SPRING = 0.6; // pull back to flat
const DAMP = 1.1; // per second
// Shares of the card's width: the bulge at full height, the lean of the
// foot toward the viewer, and the canvas margin for both and the shadow.
const AMPLITUDE = 0.07;
const LEAN = 0.06;
const BLEED = 0.16;
const LIFT = { radius: 0.3, height: 1.3 }; // radius: share of the width; height in height units
const OUTLINE = { rest: 0.06, hover: 0.22 };
const LANTERN = { radius: 0.38, gain: 0.45 }; // radius: share of the width; gain at the centre
const CORNER = 0.05; // share of the card's width (user request, 2026-10-04)

const SDF = /* glsl */ `
uniform float uRadius;
float sheetDistance(vec2 local, vec2 size) {
  vec2 extent = size * 0.5;
  float r = min(uRadius, min(extent.x, extent.y));
  vec2 q = abs(local - extent) - extent + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}`;

const SHEET_VS = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aUv;
layout(location = 1) in vec4 aSurface; // depth (px), normal x, normal y, crease
layout(location = 2) in vec2 aDraw; // draw-in (px)
uniform vec2 uSize;
uniform vec4 uFrame; // bleed x, bleed y, canvas width, canvas height (px)
uniform float uDepth;
out vec2 vUv;
out vec2 vLocal;
out vec3 vNormal;
out float vCrease;
void main() {
  vec2 local = aUv * uSize;
  vec2 centre = uSize * 0.5;
  vec2 p = local + aDraw;
  p = centre + (p - centre) * uDepth / (uDepth - aSurface.x);
  vec2 c = (p + uFrame.xy) / uFrame.zw;
  gl_Position = vec4(c.x * 2.0 - 1.0, 1.0 - c.y * 2.0, 0.0, 1.0);
  vUv = aUv;
  vLocal = local;
  vNormal = vec3(aSurface.yz, sqrt(max(1.0 - dot(aSurface.yz, aSurface.yz), 0.0)));
  vCrease = aSurface.w;
}`;

const SHEET_FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vLocal;
in vec3 vNormal;
in float vCrease;
uniform sampler2D uMap;
uniform vec2 uSize;
uniform float uOutline;
uniform vec4 uLantern; // pointer (px), radius (px), gain
out vec4 outColor;
${SDF}
void main() {
  vec3 n = normalize(vNormal);
  vec3 light = normalize(vec3(-0.35, -0.5, 0.8));
  vec3 halfway = normalize(light + vec3(0.0, 0.0, 1.0));
  vec3 colour = texture(uMap, vUv).rgb;
  // Lit relative to flat cloth, so only the folds change the photo.
  float flatLight = 0.6 + 0.4 * light.z;
  float lit = (0.6 + 0.4 * dot(n, light)) / flatLight * vCrease;
  colour *= mix(1.0, lit, 0.65);
  float pool = 1.0 - smoothstep(0.0, uLantern.z, distance(vLocal, uLantern.xy));
  pool *= pool * uLantern.w;
  vec3 warm = vec3(1.0, 0.92, 0.78);
  // A little added light too, so the photo's darkest parts lift as well.
  colour = colour * (1.0 + pool * warm) + 0.06 * pool * lit * warm;
  float tight = pow(halfway.z, 30.0);
  float glint = max(pow(max(dot(n, halfway), 0.0), 30.0) - tight, 0.0) / (1.0 - tight);
  float broadFlat = pow(halfway.z, 5.0);
  float broad = max(pow(max(dot(n, halfway), 0.0), 5.0) - broadFlat, 0.0) / (1.0 - broadFlat);
  colour += mix(vec3(0.95, 0.92, 0.86), colour, 0.4) * (0.08 * glint + 0.03 * broad);
  float d = sheetDistance(vLocal, uSize);
  colour += 0.07 * (1.0 - smoothstep(0.0, 6.0, -d));
  float rim = smoothstep(1.1, 0.2, abs(d + 0.7));
  colour += rim * uOutline * vec3(0.95, 0.91, 0.82);
  float alpha = clamp(0.5 - d, 0.0, 1.0);
  outColor = vec4(clamp(colour, 0.0, 1.0) * alpha, alpha);
}`;

// The glow under the card (user request, 2026-10-04): the sheet's own
// outline in soft cream, shifted down and right with its depth, fading in
// from the edge and fainter where the cloth lifts off the page; the cloth
// covers most of it, so it shows past the lower and right edges.
const SHADOW_VS = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aUv;
layout(location = 1) in vec4 aSurface;
layout(location = 2) in vec2 aDraw;
uniform vec2 uSize;
uniform vec4 uFrame;
out vec2 vLocal;
out float vLift;
void main() {
  vLocal = aUv * uSize;
  vLift = aSurface.x;
  vec2 p = vLocal + aDraw + vec2(10.0, 14.0) + vec2(0.3, 0.42) * aSurface.x;
  vec2 c = (p + uFrame.xy) / uFrame.zw;
  gl_Position = vec4(c.x * 2.0 - 1.0, 1.0 - c.y * 2.0, 0.0, 1.0);
}`;

const SHADOW_FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 vLocal;
in float vLift;
uniform vec2 uSize;
out vec4 outColor;
${SDF}
void main() {
  float d = sheetDistance(vLocal, uSize);
  float a = 0.24 * smoothstep(0.0, 22.0, -d) * mix(1.0, 0.55, clamp(vLift / 50.0, 0.0, 1.0));
  outColor = vec4(vec3(0.95, 0.91, 0.82) * a, a);
}`;

function compile(gl, vsSource, fsSource) {
  const program = gl.createProgram();
  for (const [type, source] of [[gl.VERTEX_SHADER, vsSource], [gl.FRAGMENT_SHADER, fsSource]]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  const uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const { name } = gl.getActiveUniform(program, i);
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return { program, uniforms };
}

// The cloth's motion, in height units (the drawn depth is AMPLITUDE × tanh).
function createCloth() {
  const size = NODES * NODES;
  let now = new Float32Array(size);
  let before = new Float32Array(size);
  let next = new Float32Array(size);
  const across = new Float32Array(NODES);
  const down = new Float32Array(NODES);
  const hang = new Float32Array(NODES);
  for (let y = 0; y < NODES; y++) hang[y] = (y / GRID) ** 1.4;
  let time = Math.random() * 100;
  let gust = 0.6;
  let gustTo = 0.6;
  let gustWait = 0;

  function step(wind) {
    time += STEP;
    gustWait -= STEP;
    if (gustWait <= 0) {
      gustTo = 0.35 + 0.65 * Math.random();
      gustWait = 2 + 3 * Math.random();
    }
    gust += (gustTo - gust) * (1 - Math.exp(-STEP * 0.8));
    const force = 6 * wind * gust;
    const drift = 1.6 * Math.sin(0.21 * time);
    for (let x = 0; x < NODES; x++) {
      across[x] = Math.sin(0.1 * x - 2.3 * time + drift) + 0.5 * Math.sin(0.24 * x + 1.6 * time + 2.1);
    }
    for (let y = 0; y < NODES; y++) down[y] = (0.7 + 0.3 * Math.sin(0.15 * y - 1.5 * time)) * hang[y];
    const c2 = WAVE * WAVE;
    const dt2 = STEP * STEP;
    const keep = Math.exp(-DAMP * STEP);
    for (let y = 1; y < NODES; y++) {
      const row = y * NODES;
      const up = row - NODES;
      const below = Math.min(y + 1, GRID) * NODES;
      for (let x = 0; x < NODES; x++) {
        const i = row + x;
        const h = now[i];
        const lap = now[row + Math.max(x - 1, 0)] + now[row + Math.min(x + 1, GRID)] + now[up + x] + now[below + x] - 4 * h;
        const target = 2 * h - before[i] + dt2 * (c2 * lap - SPRING * h + force * across[x] * down[y]);
        next[i] = Math.max(-3, Math.min(3, h + (target - h) * keep));
      }
    }
    for (let x = 0; x < NODES; x++) next[x] = 0;
    [before, now, next] = [now, next, before];
  }

  // Pulls the cloth toward a soft mound round the pointer (grid units).
  function press(gx, gy, radius, depth, rate) {
    const x0 = Math.max(0, Math.ceil(gx - 2.4 * radius));
    const x1 = Math.min(GRID, Math.floor(gx + 2.4 * radius));
    const y0 = Math.max(1, Math.ceil(gy - 2.4 * radius));
    const y1 = Math.min(GRID, Math.floor(gy + 2.4 * radius));
    for (let y = y0; y <= y1; y++) {
      const oy = (y - gy) / radius;
      for (let x = x0; x <= x1; x++) {
        const ox = (x - gx) / radius;
        const g = Math.exp(-(ox * ox + oy * oy));
        if (g < 0.02) continue;
        const i = y * NODES + x;
        const pull = rate * g;
        const goal = depth * g;
        now[i] += (goal - now[i]) * pull;
        before[i] += (goal - before[i]) * pull;
      }
    }
  }

  return { step, press, heights: () => now, hang, gust: () => gust };
}

function createSheet(figure, frame, image) {
  const canvas = document.createElement('canvas');
  canvas.className = 'chapter__photo-sheet';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true, depth: false, stencil: false });
  if (!gl) return null;
  let sheetProgram;
  let shadowProgram;
  try {
    sheetProgram = compile(gl, SHEET_VS, SHEET_FS);
    shadowProgram = compile(gl, SHADOW_VS, SHADOW_FS);
  } catch (error) {
    console.warn('[paperCard]', error);
    return null;
  }

  const uvs = new Float32Array(NODES * NODES * 2);
  for (let y = 0; y < NODES; y++) {
    for (let x = 0; x < NODES; x++) {
      uvs[(y * NODES + x) * 2] = x / GRID;
      uvs[(y * NODES + x) * 2 + 1] = y / GRID;
    }
  }
  const indices = new Uint16Array(GRID * GRID * 6);
  let o = 0;
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const a = y * NODES + x;
      indices.set([a, a + NODES, a + 1, a + 1, a + NODES, a + NODES + 1], o);
      o += 6;
    }
  }
  const surface = new Float32Array(NODES * NODES * 4);
  const drawIn = new Float32Array(NODES * NODES * 2);
  const depth = new Float32Array(NODES * NODES);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const attribute = (location, data, width, usage) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, width, gl.FLOAT, false, 0, 0);
    return buffer;
  };
  attribute(0, uvs, 2, gl.STATIC_DRAW);
  const surfaceBuffer = attribute(1, surface, 4, gl.DYNAMIC_DRAW);
  const drawBuffer = attribute(2, drawIn, 2, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindVertexArray(null);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  frame.append(canvas);

  const cloth = createCloth();
  const card = {
    figure,
    copy: figure.closest('.chapter__copy'),
    shown: false,
    lost: false,
    kick: 0,
    hover: 0,
    hoverTarget: 0,
    pointer: [0.5, 0.5],
    size: null,
    pending: 0,
  };

  new ResizeObserver(() => {
    card.size = null;
  }).observe(frame);
  frame.addEventListener('pointerenter', () => {
    card.hoverTarget = 1;
  });
  frame.addEventListener('pointerleave', () => {
    card.hoverTarget = 0;
  });
  frame.addEventListener('pointermove', (event) => {
    if (event.target !== frame) return;
    card.pointer = [event.offsetX / frame.offsetWidth, event.offsetY / frame.offsetHeight];
  });
  canvas.addEventListener('webglcontextlost', () => {
    card.lost = true;
    figure.classList.remove('has-sheet');
  });

  function measure() {
    const w = frame.offsetWidth;
    const h = frame.offsetHeight;
    const bleed = Math.round(BLEED * w);
    const cw = w + 2 * bleed;
    const ch = h + 2 * bleed;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    Object.assign(canvas.style, { left: `${-bleed}px`, top: `${-bleed}px`, width: `${cw}px`, height: `${ch}px` });
    canvas.width = Math.round(cw * ratio);
    canvas.height = Math.round(ch * ratio);
    card.size = { w, h, bleed, cw, ch };
  }

  // Depth, normals and creases from the heights, then the draw-in: down
  // each column from the pins and out from the middle of each row, each
  // node moves in by the length the slope before it has used up.
  function compose(w, h) {
    const heights = cloth.heights();
    const amplitude = AMPLITUDE * w;
    const lean = LEAN * w * (0.4 + 0.6 * cloth.gust());
    const sx = w / GRID;
    const sy = h / GRID;
    for (let y = 0; y < NODES; y++) {
      const tilt = lean * cloth.hang[y];
      for (let x = 0; x < NODES; x++) {
        const i = y * NODES + x;
        depth[i] = amplitude * Math.tanh(heights[i]) + tilt;
      }
    }
    for (let y = 0; y < NODES; y++) {
      const row = y * NODES;
      const up = Math.max(y - 1, 0) * NODES;
      const below = Math.min(y + 1, GRID) * NODES;
      for (let x = 0; x < NODES; x++) {
        const i = row + x;
        const left = row + Math.max(x - 1, 0);
        const right = row + Math.min(x + 1, GRID);
        const dx = (depth[right] - depth[left]) / (2 * sx);
        const dy = (depth[below + x] - depth[up + x]) / (2 * sy);
        const inverse = 1 / Math.hypot(dx, dy, 1);
        const curve = depth[left] + depth[right] + depth[up + x] + depth[below + x] - 4 * depth[i];
        surface[i * 4] = depth[i];
        surface[i * 4 + 1] = -dx * inverse;
        surface[i * 4 + 2] = -dy * inverse;
        surface[i * 4 + 3] = Math.max(0.85, Math.min(1.06, 1 - curve * 0.012));
      }
    }
    for (let x = 0; x < NODES; x++) {
      let used = 0;
      drawIn[x * 2 + 1] = 0;
      for (let y = 1; y < NODES; y++) {
        const dz = depth[y * NODES + x] - depth[(y - 1) * NODES + x];
        used += sy - Math.sqrt(Math.max(sy * sy - dz * dz, 0));
        drawIn[(y * NODES + x) * 2 + 1] = -used;
      }
    }
    const mid = GRID / 2;
    for (let y = 0; y < NODES; y++) {
      const row = y * NODES;
      drawIn[(row + mid) * 2] = 0;
      for (const [from, to, sign] of [[mid + 1, NODES, -1], [mid - 1, -1, 1]]) {
        let used = 0;
        for (let x = from; x !== to; x -= sign) {
          const dz = depth[row + x] - depth[row + x + sign];
          used += sx - Math.sqrt(Math.max(sx * sx - dz * dz, 0));
          drawIn[(row + x) * 2] = sign * used;
        }
      }
    }
  }

  card.advance = (dt) => {
    card.pending = Math.min(card.pending + dt, 0.1);
    const wind = 1 + 0.9 * card.kick + 0.35 * card.hover;
    while (card.pending >= STEP) {
      cloth.step(wind);
      if (card.hover > 0.01) {
        cloth.press(card.pointer[0] * GRID, card.pointer[1] * GRID, LIFT.radius * GRID, LIFT.height * card.hover, Math.min(STEP * 4, 1));
      }
      card.pending -= STEP;
    }
  };

  card.draw = () => {
    if (!card.size) measure();
    const { w, h, bleed, cw, ch } = card.size;
    compose(w, h);
    gl.bindBuffer(gl.ARRAY_BUFFER, surfaceBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, surface);
    gl.bindBuffer(gl.ARRAY_BUFFER, drawBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, drawIn);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindVertexArray(vao);
    for (const { program, uniforms } of [shadowProgram, sheetProgram]) {
      gl.useProgram(program);
      gl.uniform2f(uniforms.uSize, w, h);
      gl.uniform4f(uniforms.uFrame, bleed, bleed, cw, ch);
      gl.uniform1f(uniforms.uRadius, CORNER * w);
      if (uniforms.uDepth) gl.uniform1f(uniforms.uDepth, 4 * w);
      if (uniforms.uOutline) gl.uniform1f(uniforms.uOutline, OUTLINE.rest + (OUTLINE.hover - OUTLINE.rest) * card.hover);
      if (uniforms.uLantern) gl.uniform4f(uniforms.uLantern, card.pointer[0] * w, card.pointer[1] * h, LANTERN.radius * w, LANTERN.gain * card.hover);
      if (uniforms.uMap) gl.uniform1i(uniforms.uMap, 0);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }
    gl.bindVertexArray(null);
  };

  figure.classList.add('has-sheet');
  return card;
}

export function createPaperCards(sections) {
  const groups = sections.map((section) => section.querySelector('.chapter__photos')).filter(Boolean);
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const cards = [];
  let loaded = false;

  function load() {
    if (loaded) return;
    loaded = true;
    for (const group of groups) {
      const figures = [...group.querySelectorAll('.chapter__photo')];
      let pending = figures.length;
      for (const figure of figures) {
        const frame = figure.querySelector('.chapter__photo-frame');
        const image = frame.querySelector('img');
        image.addEventListener(
          'load',
          () => {
            if (fine.matches) {
              const card = createSheet(figure, frame, image);
              if (card) cards.push(card);
            }
            pending -= 1;
            if (pending === 0) group.classList.add('is-loaded');
          },
          { once: true },
        );
        image.addEventListener('error', () => group.remove(), { once: true });
        image.src = `${import.meta.env.BASE_URL}${image.dataset.src}`;
      }
    }
  }

  // Continuous mode only; each card moves and draws while its chapter shows it.
  function update(dt) {
    const ease = (rate) => 1 - Math.exp(-dt * rate);
    for (const card of cards) {
      if (card.lost) continue;
      if (card.figure.hasAttribute('data-enter-hidden') || card.copy.classList.contains('is-hidden')) {
        card.shown = false;
        card.hoverTarget = 0;
        card.hover = 0;
        continue;
      }
      if (!card.shown) {
        card.shown = true;
        card.kick = 1;
      }
      card.kick *= Math.exp(-dt / 1.6);
      card.hover += (card.hoverTarget - card.hover) * ease(5);
      card.advance(dt);
      card.draw();
    }
  }

  return { load, update };
}
