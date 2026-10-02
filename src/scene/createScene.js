import {
  BackSide,
  BufferAttribute,
  Color,
  FogExp2,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector2,
  WebGLRenderer,
} from 'three';
import { PALETTE } from './palette.js';
import { createBloom, OVERLAY } from './bloom.js';

const SKY_RADIUS = 4000;
const GLOW = 0.3;

function createSky() {
  const geometry = new SphereGeometry(SKY_RADIUS, 32, 24);
  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);
  const below = new Color(PALETTE.fog);
  const horizon = new Color(PALETTE.skyHorizon);
  const mid = new Color(PALETTE.fog);
  const top = new Color(PALETTE.skyTop);
  const c = new Color();

  for (let i = 0; i < position.count; i++) {
    const t = position.getY(i) / SKY_RADIUS;
    // The glow band reaches ~17° so the mountain ridges silhouette against it.
    if (t <= 0) c.copy(below);
    else if (t < GLOW) c.copy(horizon).lerp(mid, t / GLOW);
    else c.copy(mid).lerp(top, Math.min(1, (t - GLOW) / 0.5));
    c.toArray(colors, i * 3);
  }

  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  const sky = new Mesh(
    geometry,
    new MeshBasicMaterial({ vertexColors: true, side: BackSide, fog: false, depthWrite: false }),
  );
  sky.renderOrder = -1;
  sky.frustumCulled = false;
  return sky;
}

export function createScene(canvas, { antialias }) {
  const renderer = new WebGLRenderer({ canvas, antialias, powerPreference: 'high-performance' });
  renderer.setClearColor(PALETTE.fog, 1);

  const scene = new Scene();
  scene.background = new Color(PALETTE.fog);
  scene.fog = new FogExp2(PALETTE.fog, 0.00045);

  const camera = new PerspectiveCamera(40, 1.6, 0.5, 5000);
  camera.rotation.order = 'YXZ';

  const sky = createSky();
  scene.add(sky);

  const bloom = createBloom(renderer);
  camera.layers.enable(OVERLAY);
  // Several renders per frame: counted together for the fps overlay.
  renderer.info.autoReset = false;

  function resize(width, height, pixelRatio) {
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    const size = renderer.getDrawingBufferSize(new Vector2());
    bloom.setSize(size.x, size.y);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function render() {
    sky.position.copy(camera.position);
    renderer.info.reset();
    if (!bloom.active) {
      renderer.render(scene, camera);
      return;
    }
    camera.layers.set(0);
    renderer.render(scene, camera);
    bloom.render();
    // The overlay on top, unglowed, without clearing or redrawing the sky
    // (matrices are already up to date from the first pass).
    camera.layers.set(OVERLAY);
    const background = scene.background;
    scene.background = null;
    scene.matrixWorldAutoUpdate = false;
    renderer.autoClear = false;
    renderer.render(scene, camera);
    renderer.autoClear = true;
    scene.matrixWorldAutoUpdate = true;
    scene.background = background;
    camera.layers.enable(0);
  }

  return { renderer, scene, camera, sky, resize, render, setBloom: bloom.setLook, setGrade: bloom.setGrade };
}
