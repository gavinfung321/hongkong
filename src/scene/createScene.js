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
// Share of the dome's height over which the horizon glow fades (aerialFog.js
// matches it).
export const SKY_GLOW = 0.3;

// The 02 afterglow (user choice, 2026-10-03: the storyboard's sky burns red
// and orange low on the right; ours was an even navy). A warm glow on the
// sky dome round a compass heading (degrees from north, i.e. −z, toward
// +x), `width` degrees wide, fading upward over `height` (share of the
// dome's height) and brightest just above the horizon. Per screen size, as
// the phone looks at the tower almost due north. Its level is the
// `afterglow` gate (02 only). A dusky rose close to the other chapters'
// plum horizon and coral clouds, not a bright orange (user request,
// 2026-10-03: the first version was too bright and matched no other scene).
const AFTERGLOW = {
  color: [0.7, 0.28, 0.34],
  strength: 0.3,
  height: 0.16,
  desktop: { heading: 72, width: 38 },
  mobile: { heading: 7, width: 14 },
};

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
    else if (t < SKY_GLOW) c.copy(horizon).lerp(mid, t / SKY_GLOW);
    else c.copy(mid).lerp(top, Math.min(1, (t - SKY_GLOW) / 0.5));
    c.toArray(colors, i * 3);
  }

  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  const material = new MeshBasicMaterial({ vertexColors: true, side: BackSide, fog: false, depthWrite: false });
  const glow = {
    uGlowColor: { value: new Color().fromArray(AFTERGLOW.color).multiplyScalar(AFTERGLOW.strength) },
    uGlowLevel: { value: 0 },
    uGlowHeading: { value: new Vector2(AFTERGLOW.desktop.heading, AFTERGLOW.desktop.width) },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, glow);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vSkyDir;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSkyDir = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vSkyDir;
        uniform vec3 uGlowColor;
        uniform float uGlowLevel;
        uniform vec2 uGlowHeading;`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        if ( uGlowLevel > 0.0 ) {
          vec3 dir = normalize( vSkyDir );
          float heading = degrees( atan( dir.x, -dir.z ) );
          float off = mod( heading - uGlowHeading.x + 540.0, 360.0 ) - 180.0;
          float across = exp( -off * off / ( uGlowHeading.y * uGlowHeading.y ) );
          float up = smoothstep( -0.01, 0.02, dir.y ) * exp( -max( dir.y, 0.0 ) / ${AFTERGLOW.height.toFixed(3)} );
          diffuseColor.rgb += uGlowColor * uGlowLevel * across * up;
        }`,
      );
  };
  const sky = new Mesh(geometry, material);
  sky.renderOrder = -1;
  sky.frustumCulled = false;
  // The water mirrors the glow with the same uniforms (createWater.js).
  sky.userData.glow = glow;
  sky.userData.setAfterglow = (value) => {
    glow.uGlowLevel.value = value;
  };
  sky.userData.setBreakpoint = (breakpoint) => {
    const { heading, width } = AFTERGLOW[breakpoint];
    glow.uGlowHeading.value.set(heading, width);
  };
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
