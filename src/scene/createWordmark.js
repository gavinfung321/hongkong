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
import { aimCamera, smoothstep } from '../scroll/cameraRig.js';

// System Traditional Chinese fonts: Windows, then iOS / macOS, then Android.
const FONT = '"Microsoft JhengHei", "PingFang TC", "Heiti TC", "Noto Sans TC", sans-serif';
const FONT_SIZE = 640;
const GAP = 0.14; // extra space between characters, as a fraction of the font size
const PAD = 16;
// [fraction of glyph height, colour]; the shading begins a third of the way down.
const SHADE = [
  [0, '#fff'],
  [0.32, '#fff'],
  [0.7, 'rgb(140, 130, 165)'],
  [1, 'rgba(44, 38, 74, 0.95)'],
];
const DROP = 1.4; // heights it moves down while leaving, enough to clear the frame
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
  // Lit from above: full strength on top, sinking into dusk violet at the feet.
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
  return { texture, aspect: canvas.width / canvas.height, padBottom: (PAD + descent) / canvas.height };
}

const placementCamera = new PerspectiveCamera();
const ndc = new Vector3();
const forward = new Vector3();

export function createWordmark(renderer, text) {
  const { texture, aspect, padBottom } = drawText(text);
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

  let restY = 0;
  let height = 1;
  let opacity = 1;

  function apply(sink, value) {
    opacity = value;
    material.opacity = value;
    mesh.visible = value > 0.001;
    mesh.position.y = restY - sink * height * DROP;
  }

  // Fills spec.width % of the screen with its feet at (spec.x, spec.foot) %
  // as seen from chapter 01's opening pose: standing on the water, or, with
  // spec.depth (metres ahead of the camera), floating in the sky.
  function place(pose, viewAspect, spec) {
    const position = new Vector3().fromArray(pose.position);
    // The hold dolly starts half a vector back (see holdDollyOffset).
    if (pose.holdDolly) position.addScaledVector(new Vector3().fromArray(pose.holdDolly), -0.5);
    placementCamera.fov = pose.fov;
    placementCamera.aspect = viewAspect;
    placementCamera.near = 0.5;
    placementCamera.far = 5000;
    aimCamera(placementCamera, position, new Vector3().fromArray(pose.target));
    placementCamera.updateMatrixWorld();

    ndc.set((spec.x / 100) * 2 - 1, 1 - (spec.foot / 100) * 2, 0.5).unproject(placementCamera);
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
    const width = (spec.width / 100) * viewWidth;
    height = width / aspect;
    restY = foot.y - height * padBottom;

    mesh.scale.set(width, height, 1);
    mesh.position.set(foot.x, restY, foot.z);
    mesh.rotation.y = Math.atan2(-forward.x, -forward.z);
  }

  // Continuous mode: moves down from the first scroll (from = progress at the
  // top of the page), fully faded by fadeEnd of the way down.
  function sinkAt(p, from, to, fadeEnd) {
    const u = MathUtils.clamp((p - from) / (to - from), 0, 1);
    apply(u * (2 - u), 1 - smoothstep(0, fadeEnd, u));
  }

  // Stepped mode: no sinking, just a short fade. Returns true when it changed,
  // so the caller renders every step including the last.
  function fadeTo(target, dt) {
    const before = opacity;
    const sunk = mesh.position.y !== restY;
    const step = dt / STEPPED_FADE;
    const next = target > opacity ? Math.min(target, opacity + step) : Math.max(target, opacity - step);
    apply(0, dt > 0 ? next : target);
    return opacity !== before || sunk;
  }

  return { mesh, place, sinkAt, fadeTo };
}
