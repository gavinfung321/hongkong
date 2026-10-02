import {
  Group,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  ShaderMaterial,
  TextureLoader,
  UniformsLib,
  UniformsUtils,
  Vector3,
} from 'three';
import { CLOUD_SHEET, CLOUDS, MIST, MIST_SHEET } from '../data/atmosphere.js';
import { aimCamera, poseFov } from '../scroll/cameraRig.js';
import { seededRandom } from './random.js';

// Distant coral clouds (user choice, 2026-10-02): bands cut from the
// generated cloud sheet, each on a flat card a few kilometres out that faces
// the chapter it was framed for. Unfogged (the fog would erase them at this
// distance) and drawn before the moon, so they never cover it; the ridge and
// towers hide their lower edges. Cards stand upright, facing their chapter's
// camera across the ground. Every edge is feathered, so no card shows a
// rectangle. They sway slowly sideways, and hold still in reduced motion.
//
// Harbour mist (user request, 2026-10-02): the same kind of card, cut from
// the mist sheet, standing on the water off the island's waterfront. Fogged
// like the skyline behind it and depth tested, so everything in front of it
// stays crisp.
const FEATHER = [0.06, 0.18]; // edge fade, as a share of the card's width / height

const vertexShader = `
  #include <fog_pars_vertex>
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`;

const fragmentShader = `
  #include <fog_pars_fragment>
  uniform sampler2D tSheet;
  uniform vec4 uBand; // v from, v to, feather x, feather y
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D( tSheet, vec2( vUv.x, mix( uBand.x, uBand.y, vUv.y ) ) );
    vec2 edge = min( vUv, 1.0 - vUv );
    float feather = smoothstep( 0.0, uBand.z, edge.x ) * smoothstep( 0.0, uBand.w, edge.y );
    gl_FragColor = vec4( c.rgb, c.a * feather * uOpacity );
    #include <colorspace_fragment>
    #include <fog_fragment>
  }`;

const placement = new PerspectiveCamera();
const position = new Vector3();
const target = new Vector3();
const ray = new Vector3();
const forward = new Vector3();

export function createAtmosphere(chapters, { onLoad } = {}) {
  const group = new Group();
  group.name = 'atmosphere';
  const geometry = new PlaneGeometry(1, 1);
  const random = seededRandom(83);
  const loader = new TextureLoader();
  const loaded = new Set();

  function loadSheet(sheet) {
    const texture = loader.load(`${import.meta.env.BASE_URL}${sheet.url}`, () => {
      loaded.add(texture);
      apply();
      onLoad?.();
    });
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }
  const cloudSheet = loadSheet(CLOUD_SHEET);
  const mistSheet = loadSheet(MIST_SHEET);

  function makeCard(spec, sheet, texture, { fog, renderOrder, drift, name }) {
    const [r0, r1] = sheet.bands[spec.band];
    const height = sheet.size[1];
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...UniformsUtils.clone(UniformsLib.fog),
        tSheet: { value: texture },
        uBand: { value: [1 - r1 / height, 1 - r0 / height, FEATHER[0], FEATHER[1]] },
        uOpacity: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      fog,
    });
    const mesh = new Mesh(geometry, material);
    mesh.name = name;
    mesh.renderOrder = renderOrder;
    mesh.userData.noProbe = true;
    mesh.visible = false;
    group.add(mesh);
    const [p0, p1] = drift.period;
    return {
      spec,
      mesh,
      texture,
      aspect: sheet.size[0] / (r1 - r0),
      base: new Vector3(),
      right: new Vector3(),
      sway: [MathUtils.lerp(p0, p1, random()), random() * Math.PI * 2, drift.share],
    };
  }

  const cards = {};
  for (const [breakpoint, specs] of Object.entries(CLOUDS.cards)) {
    cards[breakpoint] = specs.map((spec) =>
      makeCard(spec, CLOUD_SHEET, cloudSheet, {
        fog: false,
        renderOrder: -0.95, // after the sky, before the moon
        drift: CLOUDS.drift,
        name: 'cloud',
      }),
    );
  }
  // Mist drifts the other way to the clouds.
  const mist = MIST.cards.map((spec) =>
    makeCard(spec, MIST_SHEET, mistSheet, {
      fog: true,
      renderOrder: 0,
      drift: { ...MIST.drift, share: -MIST.drift.share },
      name: 'mist',
    }),
  );
  for (const card of mist) {
    const { spec, mesh } = card;
    mesh.scale.set(spec.width, spec.width / card.aspect, 1);
    card.base.set(spec.x, mesh.scale.y / 2, spec.z);
    mesh.position.copy(card.base);
    card.right.set(1, 0, 0);
  }

  let active = [];
  let cloudLevel = 0;
  let mistLevel = 0;

  function show(card, level) {
    const opacity = card.spec.opacity * level;
    card.mesh.material.uniforms.uOpacity.value = opacity;
    card.mesh.visible = loaded.has(card.texture) && opacity > 0.002;
  }

  function apply() {
    for (const list of Object.values(cards)) {
      for (const card of list) show(card, active.includes(card) ? cloudLevel : 0);
    }
    for (const card of mist) show(card, mistLevel);
  }

  // Frames each cloud card at its chapter's hold pose for this screen.
  function place(breakpoint, viewAspect) {
    active = cards[breakpoint] ?? [];
    for (const card of active) {
      const { spec, mesh } = card;
      const pose = chapters[spec.chapter].camera[breakpoint];
      placement.fov = poseFov(pose, viewAspect, breakpoint);
      placement.aspect = viewAspect;
      placement.near = 0.5;
      placement.far = 5000;
      aimCamera(placement, position.fromArray(pose.position), target.fromArray(pose.target));
      placement.updateMatrixWorld();
      ray.set((spec.x / 100) * 2 - 1, 1 - (spec.y / 100) * 2, 0.5).unproject(placement).sub(position).normalize();
      forward.copy(target).sub(position).setY(0).normalize();
      card.base.copy(position).addScaledVector(ray, CLOUDS.distance);
      const depth = CLOUDS.distance * ray.dot(forward);
      const width = (spec.width / 100) * 2 * depth * Math.tan(MathUtils.degToRad(placement.fov / 2)) * viewAspect;
      mesh.scale.set(width, width / card.aspect, 1);
      mesh.position.copy(card.base);
      // Upright, like the level camera's image plane, so high cards don't stretch.
      mesh.lookAt(position.x, card.base.y, position.z);
      card.right.set(1, 0, 0).applyQuaternion(mesh.quaternion);
    }
    apply();
  }

  function setLevel(value) {
    if (value === cloudLevel) return;
    cloudLevel = value;
    apply();
  }

  function setMist(value) {
    if (value === mistLevel) return;
    mistLevel = value;
    apply();
  }

  function sway(card, time) {
    const [period, phase, share] = card.sway;
    const offset = Math.sin((time / period) * Math.PI * 2 + phase) * share * card.mesh.scale.x;
    card.mesh.position.copy(card.base).addScaledVector(card.right, offset);
  }

  function update(time) {
    for (const card of active) sway(card, time);
    for (const card of mist) sway(card, time);
  }

  return { group, place, setLevel, setMist, update };
}
