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
  WebGLRenderer,
} from 'three';
import { PALETTE } from './palette.js';

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

  function resize(width, height, pixelRatio) {
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function render() {
    sky.position.copy(camera.position);
    renderer.render(scene, camera);
  }

  return { renderer, scene, camera, sky, resize, render };
}
