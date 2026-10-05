import {
  AdditiveBlending,
  Box3,
  BufferGeometry,
  CanvasTexture,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  Vector4,
} from 'three';
import { MIST_SHEET } from '../data/atmosphere.js';
import { aimCamera, poseFov } from '../scroll/cameraRig.js';
import {
  SCENE_02_DUST as DUST,
  SCENE_02_GHOST,
  SCENE_02_LAYOUT,
  SCENE_02_STEAM as STEAM,
  SCENE_02_STIR as STIR,
} from '../story/scene02/config.js';
import { seededRandom } from './random.js';

// Chapter 02's story layers in the scene (narrative spine, user choice,
// 2026-10-04). Their levels come from the copy layer (copyLayer.js):
//   ghost: a giant faint 1915. On desktop it is the full column in the
//          right-hand sky; the words shift left on a narrow window to leave
//          that room. The legs of the digits face the words. Phones keep it
//          right of the tower, turned the same way (user request, 2026-10-04).
//          It comes with the lead beat.
//   dust:  warm motes drifting up through the lamp-lit air, with the
//          darkening: thin in the open air, gathered round the tower's
//          floodlit foot and the promenade lamps, and a few large soft ones
//          close to the lens, out of focus, which come with the 1915. They
//          brighten, and the spare ones join, with the print (now with the
//          words). The desktop
//          mouse stirs them (pointerStir.js).
//   steam: two drifts of railway steam crossing the tower's foot, cut from
//          the harbour mist artwork, while the 1915 print shows.
// Each is authored on screen at the chapter's hold pose (x / y: % of the
// viewport, width: % of its width, depth: metres ahead of the camera) and
// then fixed in the world, so the mouse parallax still moves them against
// the tower.
const CHAPTER = '02';

const dustCount = (list) => list.reduce((sum, swarm) => sum + swarm.count, 0);
// Reduced motion holds this moment: both drifts half in.
const STILL_TIME = STEAM.period * 0.25;

const placementCamera = new PerspectiveCamera();
const ndc = new Vector3();
const forward = new Vector3();
const right = new Vector3();
const buffer = new Vector2();
const camRight = new Vector3();
const camUp = new Vector3();
const camBack = new Vector3();
const ghostBasis = new Matrix4();
const towerBounds = new Box3();
const towerCorner = new Vector3();

// The face's default figures are old-style, which wobble once turned
// upright, and canvas text cannot ask for lining ones; so the numerals are
// set in an SVG with the face embedded, then trimmed to their ink.
async function drawGhost() {
  const response = await fetch(`${import.meta.env.BASE_URL}${SCENE_02_GHOST.font}`);
  if (!response.ok) throw new Error('ghost font');
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  const size = 512;
  const [w, h] = [size * 3, size * 1.5];
  // Fading toward its start, the foot of the column, as if rising from haze.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <style>@font-face { font-family: Ghost; font-weight: 600; src: url(data:font/woff2;base64,${btoa(binary)}) format("woff2"); }</style>
      <linearGradient id="fade"><stop offset="0" stop-color="#fff" stop-opacity="0.45"/><stop offset="0.3" stop-color="#fff" stop-opacity="0.85"/><stop offset="1" stop-color="#fff"/></linearGradient>
    </defs>
    <text x="${size * 0.2}" y="${size}" font-family="Ghost" font-weight="600" font-size="${size}" style="font-variant-numeric: lining-nums" fill="url(#fade)">${SCENE_02_GHOST.text}</text>
  </svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  const image = new Image();
  image.src = url;
  try {
    await image.decode();
  } finally {
    URL.revokeObjectURL(url);
  }
  const sheet = document.createElement('canvas');
  [sheet.width, sheet.height] = [w, h];
  const ctx = sheet.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0);
  const alpha = ctx.getImageData(0, 0, w, h).data;
  let [x0, y0, x1, y1] = [w, h, 0, 0];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (alpha[(y * w + x) * 4 + 3] < 8) continue;
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    }
  }
  if (x1 <= x0) throw new Error('ghost blank');
  const pad = 8;
  const canvas = document.createElement('canvas');
  canvas.width = x1 - x0 + 1 + pad * 2;
  canvas.height = y1 - y0 + 1 + pad * 2;
  canvas.getContext('2d').drawImage(sheet, x0, y0, x1 - x0 + 1, y1 - y0 + 1, pad, pad, x1 - x0 + 1, y1 - y0 + 1);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return { texture, aspect: canvas.width / canvas.height };
}

// The mist sheet's band, feathered on all sides, drawn once it has loaded.
function steamTexture(onLoad) {
  const [y0, y1] = MIST_SHEET.bands[STEAM.band];
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = Math.round(((y1 - y0) * canvas.width) / MIST_SHEET.size[0]);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const image = new Image();
  image.onload = () => {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, y0, MIST_SHEET.size[0], y1 - y0, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-in';
    const [fx, fy] = STEAM.feather;
    const across = ctx.createLinearGradient(0, 0, canvas.width, 0);
    across.addColorStop(0, 'rgba(0, 0, 0, 0)');
    across.addColorStop(fx, '#000');
    across.addColorStop(1 - fx, '#000');
    across.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = across;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const down = ctx.createLinearGradient(0, 0, 0, canvas.height);
    down.addColorStop(0, 'rgba(0, 0, 0, 0)');
    down.addColorStop(fy, '#000');
    down.addColorStop(1 - fy, '#000');
    down.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = down;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    texture.needsUpdate = true;
    onLoad?.();
  };
  image.src = `${import.meta.env.BASE_URL}${MIST_SHEET.url}`;
  return { texture, aspect: canvas.width / canvas.height };
}

// aLook: size (m), gain, spare (1: only with the print), near (1: the
// out-of-focus layer). uStir: pointer (ndc) and its velocity (ndc/s).
const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform float uLevel;
  uniform float uNear;
  uniform float uSwell;
  uniform float uAspect;
  uniform vec2 uRise;
  uniform vec4 uStir;
  uniform vec3 uStirShape;
  uniform float uStirStrength;
  attribute vec3 aCentre;
  attribute vec3 aBox;
  attribute vec4 aSeed;
  attribute vec4 aLook;
  varying float vAlpha;
  varying float vSoft;

  void main() {
    float t = uTime * mix(1.0, 0.45, aLook.w);
    vec3 local = aSeed.xyz * aBox;
    local.y += t * mix(uRise.x, uRise.y, fract(aSeed.w * 7.31));
    local.x += sin(t * 0.23 + aSeed.w * 6.283) * 0.35 + t * 0.05;
    local.z += cos(t * 0.19 + aSeed.w * 4.1) * 0.35;
    local = mod(local, aBox) - 0.5 * aBox;
    vec4 mv = modelViewMatrix * vec4(aCentre + local, 1.0);
    gl_Position = projectionMatrix * mv;

    // Pushed aside and carried along by the moving pointer, then settling back.
    vec2 offset = gl_Position.xy / gl_Position.w - uStir.xy;
    offset.x *= uAspect;
    float gap = length(offset);
    float reach = max(0.0, 1.0 - gap / uStirShape.x);
    vec2 away = gap > 1e-4 ? offset / gap : vec2(0.0);
    vec2 push = (away * uStirShape.y + uStir.zw * vec2(uAspect, 1.0) * uStirShape.z) * uStirStrength * reach * reach;
    push.x /= uAspect;
    gl_Position.xy += push * gl_Position.w;

    // Softly gone near the box's faces, so a mote wrapping round never pops.
    vec3 edge = abs(local) / (0.5 * aBox);
    float inside = 1.0 - smoothstep(0.7, 1.0, max(max(edge.x, edge.y), edge.z));
    float twinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed.w) + aSeed.w * 40.0);
    float level = mix(uLevel, uNear, aLook.w) * mix(1.0, uSwell, aLook.z) * (0.85 + 0.3 * uSwell);
    vAlpha = level * aLook.y * inside * twinkle;
    vSoft = aLook.w;
    gl_PointSize = clamp(aLook.x * (0.6 + 0.8 * fract(aSeed.w * 13.7)) * uScale / -mv.z, 1.0, 64.0);
  }
`;

// Small motes are a tight glow; the near ones a broad soft disc.
const dustFragment = /* glsl */ `
  uniform vec3 uColour;
  varying float vAlpha;
  varying float vSoft;

  void main() {
    float glow = 1.0 - smoothstep(0.0, 1.0, length(gl_PointCoord - 0.5) * 2.0);
    gl_FragColor = vec4(uColour, mix(glow * glow, glow, vSoft) * vAlpha);
  }
`;

export function createStoryLayers(chapters, renderer, { onLoad, tower } = {}) {
  const chapter = chapters.find((c) => c.id === CHAPTER);
  const copyElement = document.querySelector('#chapter-02 .chapter__copy');
  const group = new Group();
  group.name = 'story';

  // ---- Ghost ---------------------------------------------------------------
  // Shown once its numerals are drawn; without them it stays out.
  let ghostArt = null;
  const ghostMaterial = new MeshBasicMaterial({
    color: SCENE_02_GHOST.colour,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    fog: false,
  });
  const ghost = new Mesh(new PlaneGeometry(1, 1), ghostMaterial);
  ghost.name = 'story-ghost';
  ghost.visible = false;
  group.add(ghost);

  // ---- Dust ----------------------------------------------------------------
  const random = seededRandom(1915);
  const dustMax = Math.max(dustCount(DUST.desktop), dustCount(DUST.mobile));
  const seeds = [];
  for (let i = 0; i < dustMax; i++) seeds.push(random(), random(), random(), random());
  const dustGeometry = new BufferGeometry();
  dustGeometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(dustMax * 3), 3));
  dustGeometry.setAttribute('aSeed', new Float32BufferAttribute(seeds, 4));
  const dustCentre = new Float32BufferAttribute(new Float32Array(dustMax * 3), 3);
  const dustBox = new Float32BufferAttribute(new Float32Array(dustMax * 3), 3);
  const dustLook = new Float32BufferAttribute(new Float32Array(dustMax * 4), 4);
  dustGeometry.setAttribute('aCentre', dustCentre);
  dustGeometry.setAttribute('aBox', dustBox);
  dustGeometry.setAttribute('aLook', dustLook);
  const dustUniforms = {
    uTime: { value: 0 },
    uScale: { value: 1 },
    uLevel: { value: 0 },
    uNear: { value: 0 },
    uSwell: { value: 0 },
    uAspect: { value: 1 },
    uRise: { value: new Vector2(...DUST.rise) },
    uStir: { value: new Vector4() },
    uStirShape: { value: new Vector3(STIR.radius, STIR.push, STIR.carry) },
    uStirStrength: { value: 0 },
    uColour: { value: new Vector3(...DUST.colour) },
  };
  const dust = new Points(
    dustGeometry,
    new ShaderMaterial({
      uniforms: dustUniforms,
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  );
  dust.name = 'story-dust';
  dust.frustumCulled = false;
  dust.visible = false;
  group.add(dust);

  // ---- Steam ---------------------------------------------------------------
  const steamArt = steamTexture(onLoad);
  const steam = [0, 1].map(() => {
    const mesh = new Mesh(
      new PlaneGeometry(1, 1),
      new MeshBasicMaterial({
        map: steamArt.texture,
        color: STEAM.colour,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: DoubleSide,
        fog: false,
      }),
    );
    mesh.name = 'story-steam';
    mesh.visible = false;
    group.add(mesh);
    return { mesh, spec: null, base: new Vector3(), right: new Vector3() };
  });

  const levels = { ghost: 0, dust: 0, steam: 0 };
  let still = false;
  let placed = null;
  let ghostOpacity = SCENE_02_GHOST.standard.opacity;

  // Screen point (x, y in %) at `depth` metres ahead, from the placement camera.
  function worldAt(position, x, y, depth) {
    ndc.set((x / 100) * 2 - 1, 1 - (y / 100) * 2, 0.5).unproject(placementCamera);
    const ray = ndc.sub(position).normalize();
    return position.clone().addScaledVector(ray, depth / ray.dot(forward));
  }

  function place(breakpoint, aspect) {
    placed = [breakpoint, aspect];
    const spec = breakpoint === 'mobile'
      ? SCENE_02_GHOST.mobile
      : aspect > 1.7
        ? SCENE_02_GHOST.ultrawide
        : aspect >= 1.35
          ? SCENE_02_GHOST.standard
          : SCENE_02_GHOST.compact;
    ghostOpacity = spec.opacity;
    ghostMaterial.opacity = levels.ghost * ghostOpacity;
    const pose = chapter.camera[breakpoint];
    const fov = poseFov(pose, aspect, breakpoint);
    const position = new Vector3().fromArray(pose.position);
    placementCamera.fov = fov;
    placementCamera.aspect = aspect;
    placementCamera.near = 0.5;
    placementCamera.far = 5000;
    aimCamera(placementCamera, position, new Vector3().fromArray(pose.target));
    placementCamera.updateMatrixWorld();
    forward.fromArray(pose.target).sub(position).setY(0).normalize();
    right.set(-forward.z, 0, forward.x);
    const yaw = Math.atan2(-forward.x, -forward.z);
    const viewHeight = (depth) => 2 * depth * Math.tan(MathUtils.degToRad(fov / 2));
    const viewWidth = (depth) => viewHeight(depth) * aspect;

    // Keep the DOM story and the world-space ghost in one responsive
    // composition. Measuring the tower at the authored hold pose avoids a
    // viewport formula that moves at a different rate from the 3D subject.
    let desktopLayout = null;
    if (breakpoint === 'desktop' && tower && copyElement) {
      tower.updateWorldMatrix(true, true);
      towerBounds.setFromObject(tower, true);
      let towerRight = -Infinity;
      for (let i = 0; i < 8; i++) {
        towerCorner.set(
          i & 1 ? towerBounds.max.x : towerBounds.min.x,
          i & 2 ? towerBounds.max.y : towerBounds.min.y,
          i & 4 ? towerBounds.max.z : towerBounds.min.z,
        ).project(placementCamera);
        towerRight = Math.max(towerRight, (towerCorner.x * 0.5 + 0.5) * 100);
      }
      const copyLeft = MathUtils.clamp(
        towerRight + SCENE_02_LAYOUT.towerGap,
        ...SCENE_02_LAYOUT.copyLeft,
      );
      const copyRight = Math.min(copyLeft + SCENE_02_LAYOUT.copyWidth, SCENE_02_LAYOUT.copyRight);
      copyElement.style.setProperty('--scene-02-copy-left', copyLeft.toFixed(2));
      copyElement.style.setProperty('--scene-02-copy-right', copyRight.toFixed(2));

      // Reserve the full visual width of the content, including the archival
      // print even before it reveals. This keeps the DOM photograph from
      // covering a digit while the ghost remains attached to the content.
      let contentRight = copyLeft;
      copyElement.querySelectorAll(
        '.chapter__label, .chapter__title, .chapter__beat, .chapter__memory-caption',
      ).forEach((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        for (const rect of range.getClientRects()) {
          contentRight = Math.max(contentRight, (rect.right / window.innerWidth) * 100);
        }
      });
      const memoryWidth = Math.min(
        copyRight - copyLeft,
        36,
        (50 * window.innerHeight) / window.innerWidth,
      );
      contentRight = Math.max(contentRight, copyLeft + memoryWidth);
      const ghostLeft = Math.min(
        contentRight + SCENE_02_LAYOUT.ghostGap,
        SCENE_02_LAYOUT.ghostRight,
      );
      desktopLayout = { copyLeft, copyRight, ghostLeft };
    }

    // The legs of the digits face screen-left, toward the words, and the
    // tops face right. Same turn on desktop and phones (user request, 2026-10-04).
    if (ghostArt) {
      let foot = spec.foot;
      let height = spec.height;
      let x = spec.x;
      if (desktopLayout) {
        const room = SCENE_02_LAYOUT.ghostRight - desktopLayout.ghostLeft;
        const naturalWidth = height / (ghostArt.aspect * aspect);
        const width = Math.min(naturalWidth, room);
        height = width * ghostArt.aspect * aspect;
        x = desktopLayout.ghostLeft + width / 2;
      }
      if (breakpoint === 'desktop') {
        const header = document.querySelector('.site-header')?.offsetHeight ?? 72;
        const room = foot - ((header + 16) / window.innerHeight) * 100;
        if (room > 0) height = Math.min(height, room);
      }
      const length = (height / 100) * viewHeight(spec.depth);
      ghost.scale.set(length, length / ghostArt.aspect, 1);
      ghost.position.copy(worldAt(position, x, foot - height / 2, spec.depth));
      camRight.setFromMatrixColumn(placementCamera.matrixWorld, 0);
      camUp.setFromMatrixColumn(placementCamera.matrixWorld, 1);
      camBack.setFromMatrixColumn(placementCamera.matrixWorld, 2);
      ghostBasis.makeBasis(camUp.clone().negate(), camRight, camBack);
      ghost.quaternion.setFromRotationMatrix(ghostBasis);
    }

    let index = 0;
    const centre = new Vector3();
    for (const swarm of DUST[breakpoint]) {
      if (swarm.at) centre.fromArray(swarm.at);
      else centre.copy(position).addScaledVector(forward, swarm.ahead).setY(position.y + swarm.lift);
      for (let k = 0; k < swarm.count; k++, index++) {
        dustCentre.setXYZ(index, centre.x, centre.y, centre.z);
        dustBox.setXYZ(index, ...swarm.box);
        const spare = k < swarm.count * (swarm.spare ?? 0) ? 1 : 0;
        dustLook.setXYZW(index, swarm.size, swarm.gain ?? 1, spare, swarm.near ? 1 : 0);
      }
    }
    dustCentre.needsUpdate = true;
    dustBox.needsUpdate = true;
    dustLook.needsUpdate = true;
    dustGeometry.setDrawRange(0, index);

    STEAM[breakpoint].forEach((spec, i) => {
      const card = steam[i];
      const cardWidth = (spec.width / 100) * viewWidth(spec.depth);
      const height = (cardWidth / steamArt.aspect) * STEAM.stretch;
      card.spec = spec;
      card.width = cardWidth;
      card.base.copy(worldAt(position, spec.x, spec.y, spec.depth));
      card.base.y += height / 2;
      card.right.copy(right);
      card.mesh.scale.set(spec.mirror ? -cardWidth : cardWidth, height, 1);
      card.mesh.rotation.set(0, yaw, 0);
      card.mesh.position.copy(card.base);
    });
  }

  drawGhost()
    .then((art) => {
      ghostArt = art;
      ghostMaterial.map = art.texture;
      ghostMaterial.needsUpdate = true;
      ghost.visible = levels.ghost > 0.001;
      if (placed) place(...placed);
      onLoad?.();
    })
    .catch(() => {});

  // Returns true when anything changed, for reduced motion's on-demand frames.
  function setLevels({ ghost: g = 0, dust: d = 0, steam: s = 0 }) {
    if (g === levels.ghost && d === levels.dust && s === levels.steam) return false;
    levels.ghost = g;
    levels.dust = d;
    levels.steam = s;
    ghostMaterial.opacity = g * ghostOpacity;
    ghost.visible = g > 0.001 && ghostArt !== null;
    dustUniforms.uLevel.value = d;
    dustUniforms.uNear.value = g;
    dustUniforms.uSwell.value = s;
    dust.visible = d > 0.001;
    for (const card of steam) card.mesh.visible = s > 0.001;
    return true;
  }

  // Reduced motion holds one moment.
  function setStill(value) {
    still = value;
  }

  // stir: the desktop pointer (pointerStir.js), or none.
  function update(time, camera, stir) {
    const t = still ? STILL_TIME : time;
    if (dust.visible) {
      renderer.getDrawingBufferSize(buffer);
      dustUniforms.uTime.value = t;
      dustUniforms.uScale.value = buffer.y / (2 * Math.tan(MathUtils.degToRad(camera.fov / 2)));
      dustUniforms.uAspect.value = camera.aspect;
      dustUniforms.uStirStrength.value = still || !stir ? 0 : stir.strength;
      if (stir) dustUniforms.uStir.value.set(stir.x, stir.y, stir.vx, stir.vy);
    }
    if (!steam[0].mesh.visible) return;
    for (const card of steam) {
      if (!card.spec) continue;
      const phase = (((t / STEAM.period + card.spec.phase) % 1) + 1) % 1;
      card.mesh.position.copy(card.base).addScaledVector(card.right, (phase - 0.5) * STEAM.travel * card.width);
      card.mesh.material.opacity = Math.sin(Math.PI * phase) * levels.steam * STEAM.opacity;
    }
  }

  return { group, place, setLevels, setStill, update };
}
