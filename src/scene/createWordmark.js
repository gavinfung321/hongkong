import {
  CanvasTexture,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Vector3,
} from 'three';
import { PALETTE } from './palette.js';
import { OVERLAY } from './bloom.js';
import { aimCamera, smoothstep } from '../scroll/cameraRig.js';

// Self-hosted Noto Serif TC 700 (styles.css), so Windows and iPhone draw the
// same glyphs; the system serifs only paint until it arrives.
const FAMILY = 'Noto Serif TC';
const FONT = `"${FAMILY}", "Songti TC", "PMingLiU", serif`;
const FONT_SIZE = 640;
const GAP = 0.14; // extra space between characters, as a fraction of the font size
const PAD = 16;
// [fraction of glyph height, colour]; the shading begins a third of the way down.
// The feet are a dark cream, not dusk violet, so the strokes stay visible
// over the water and the moon (user request, 2026-10-05).
const SHADE = [
  [0, '#fff'],
  [0.32, '#fff'],
  [0.7, 'rgb(196, 174, 148)'],
  [1, 'rgba(118, 92, 68, 0.95)'],
];
const STEPPED_FADE = 0.3; // seconds

function drawText(text) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const font = `700 ${FONT_SIZE}px ${FONT}`;
  ctx.font = font;
  const chars = [...text];
  const metrics = chars.map((c) => ctx.measureText(c));
  const ascent = Math.max(...metrics.map((m) => m.actualBoundingBoxAscent));
  const descent = Math.max(...metrics.map((m) => m.actualBoundingBoxDescent));
  const gap = GAP * FONT_SIZE;
  const width = metrics.reduce((sum, m) => sum + m.width, 0) + gap * (chars.length - 1);

  canvas.width = Math.ceil(width + PAD * 2);
  canvas.height = Math.ceil(ascent + descent + PAD * 2);
  ctx.font = font;
  // Lit from above: full strength on top, sinking into a dark cream at the feet.
  // The material colour (cream) multiplies these values.
  const shade = ctx.createLinearGradient(0, PAD, 0, PAD + ascent + descent);
  for (const [stop, colour] of SHADE) shade.addColorStop(stop, colour);
  ctx.fillStyle = shade;
  let x = PAD;
  chars.forEach((c, i) => {
    ctx.fillText(c, x, PAD + ascent);
    x += metrics[i].width + gap;
  });

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return { texture, aspect: canvas.width / canvas.height, padBottom: (PAD + descent) / canvas.height, padTop: PAD / canvas.height };
}

const placementCamera = new PerspectiveCamera();
const ndc = new Vector3();
const forward = new Vector3();

export function createWordmark(renderer, text, { onRepaint } = {}) {
  // The face's own status: Chromium's fonts.check() reports true while it is still loading.
  const face = document.fonts && [...document.fonts].find((f) => f.family.replace(/"/g, '') === FAMILY && f.weight === '700');
  const fontReady = face?.status === 'loaded';
  let { texture, aspect, padBottom, padTop } = drawText(text);
  texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

  // Drawn last and without depth testing, so it sits in front of the whole scene.
  const material = new MeshBasicMaterial({
    map: texture,
    color: PALETTE.cream,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const geometry = new PlaneGeometry(1, 1);
  geometry.translate(0, 0.5, 0);
  const mesh = new Mesh(geometry, material);
  mesh.name = 'wordmark';
  mesh.renderOrder = 10;
  mesh.layers.set(OVERLAY); // drawn after the glow, so it stays crisp

  let opacity = 1;
  let placed = null; // last place() arguments, reused after the repaint

  // If the web font was not ready for the first paint, repaint once when it
  // is. A failed or blocked font keeps the fallback; nothing waits on it.
  if (face && !fontReady) {
    face
      .load()
      .then(() => {
        const next = drawText(text);
        next.texture.anisotropy = texture.anisotropy;
        material.map = next.texture;
        texture.dispose();
        ({ texture, aspect, padBottom, padTop } = next);
        mesh.userData.fontRepaints = (mesh.userData.fontRepaints ?? 0) + 1;
        if (placed) place(...placed);
        onRepaint?.();
      })
      .catch(() => {});
  }

  function apply(value) {
    opacity = value;
    material.opacity = value;
    mesh.visible = value > 0.001;
  }

  // Fills spec.width % of the screen with its feet at (spec.x, spec.foot) %
  // as seen from chapter 01's opening pose: standing on the water, or, with
  // spec.depth (metres ahead of the camera), floating there.
  // clearTop (% of the screen height): the glyph tops stay below it, the feet
  // moving down to spec.maxFoot at most, then the word shrinking instead.
  function place(pose, viewAspect, spec, clearTop) {
    placed = [pose, viewAspect, spec, clearTop];
    let footPct = spec.foot;
    let widthPct = spec.width;
    if (clearTop !== undefined) {
      const glyph = (spec.width * viewAspect / aspect) * (1 - padBottom - padTop);
      footPct = Math.max(footPct, clearTop + glyph);
      if (footPct > spec.maxFoot) {
        widthPct *= Math.max(0, spec.maxFoot - clearTop) / glyph;
        footPct = spec.maxFoot;
      }
    }
    const position = new Vector3().fromArray(pose.position);
    // The hold dolly starts half a vector back (see holdDollyOffset).
    if (pose.holdDolly) position.addScaledVector(new Vector3().fromArray(pose.holdDolly), -0.5);
    placementCamera.fov = pose.fov;
    placementCamera.aspect = viewAspect;
    placementCamera.near = 0.5;
    placementCamera.far = 5000;
    aimCamera(placementCamera, position, new Vector3().fromArray(pose.target));
    placementCamera.updateMatrixWorld();

    ndc.set((spec.x / 100) * 2 - 1, 1 - (footPct / 100) * 2, 0.5).unproject(placementCamera);
    const ray = ndc.sub(position).normalize();
    forward.fromArray(pose.target).sub(position).setY(0).normalize();
    let foot;
    if (spec.depth) {
      foot = position.clone().addScaledVector(ray, spec.depth / ray.dot(forward));
    } else {
      if (ray.y >= -1e-3) return;
      foot = position.clone().addScaledVector(ray, -position.y / ray.y);
    }

    const depth = foot.clone().sub(position).dot(forward);
    const viewWidth = 2 * depth * Math.tan(MathUtils.degToRad(pose.fov / 2)) * viewAspect;
    const width = (widthPct / 100) * viewWidth;
    const height = width / aspect;

    mesh.scale.set(width, height, 1);
    mesh.position.set(foot.x, foot.y - height * padBottom, foot.z);
    mesh.rotation.y = Math.atan2(-forward.x, -forward.z);
  }

  // Continuous mode: it stays where it stands, a fixed object the camera
  // moves past (after the Kage reference's word; user choice, 2026-10-04),
  // fading between progress `from` and `to`.
  function fadeAt(p, from, to) {
    apply(1 - smoothstep(from, to, p));
  }

  // Stepped mode: a short fade. Returns true when it changed, so the caller
  // renders every step including the last.
  function fadeTo(target, dt) {
    const before = opacity;
    const step = dt / STEPPED_FADE;
    const next = target > opacity ? Math.min(target, opacity + step) : Math.max(target, opacity - step);
    apply(dt > 0 ? next : target);
    return opacity !== before;
  }

  return { mesh, place, fadeAt, fadeTo };
}
