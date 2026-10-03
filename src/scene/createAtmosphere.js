import {
  Color,
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
  Vector4,
} from 'three';
import { CLOUD_SHEET, CLOUDS, HAZE, MIST, MIST_SHEET, SEA_MIST } from '../data/atmosphere.js';
import { WORLD } from '../data/world.js';
import { aimCamera, poseFov } from '../scroll/cameraRig.js';
import { seededRandom } from './random.js';

// Distant coral clouds (user choice, 2026-10-02): bands cut from the
// generated cloud sheet, each on a flat card a few kilometres out that faces
// the chapter it was framed for. Unfogged (the fog would erase them at this
// distance) and drawn before the moon, so they never cover it; the ridge and
// towers hide their lower edges. Cards stand upright, facing their chapter's
// camera across the ground. Every edge is feathered, so no card shows a
// rectangle.
//
// A cloud ceiling in every chapter (user request, 2026-10-02): a dim back
// layer and a brighter front layer. Each card shows in its own chapter and
// crossfades with its neighbour across the move. The wind carries the clouds
// through each card's fixed window (the art scrolls, the card stays), so they
// drift steadily without wandering over the copy, the moon or IFC; the front
// layer moves faster than the back. They hold still in reduced motion.
//
// Harbour mist (user request, 2026-10-02): the same kind of card, cut from
// the mist sheet, in separate drifts on the island's waterfront behind the
// piers, tinted like haze lit by the city. Fogged like the skyline behind
// it and depth tested, so everything in front of it stays crisp. Open-water
// wisps farther out on the harbour, for the hero and 01, face the 01 camera.
const FEATHER = [0.06, 0.18]; // edge fade, as a share of the card's width / height
// Moonlight on the clouds (user request, 2026-10-03): clouds near the moon
// warm up, their thin edges most, falling off with the angle from the moon's
// rim as seen from the camera (`reach`, radians). Clouds only, not the mist.
const MOONLIT = { color: 0xf6c46a, strength: 0.55, reach: 0.1, edge: 0.8 };
// Firework light on the clouds (user choice, 2026-10-03): the brightest live
// bursts (written each frame by createFireworks.js) tint the clouds near
// them in their own colour, thin edges most, falling off with the angle from
// the burst's centre in multiples of its own angular size (`reach`).
const BURSTLIT = { count: 4, strength: 1.6, reach: 1.5, edge: 0.85 };
export const burstLights = {
  uBursts: { value: Array.from({ length: BURSTLIT.count }, () => new Vector4()) },
  uBurstLight: { value: Array.from({ length: BURSTLIT.count }, () => new Color(0)) },
};

const vertexShader = `
  #include <fog_pars_vertex>
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vWorld = ( modelMatrix * vec4( position, 1.0 ) ).xyz;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`;

const fragmentShader = `
  #include <fog_pars_fragment>
  uniform sampler2D tSheet;
  uniform vec4 uBand; // v from, v to, feather x, feather y
  uniform vec2 uSpan; // u from, u to
  uniform float uScroll; // wind offset in u; the band wraps around
  uniform float uOpacity;
  uniform vec3 uTintLow; // colour at the card's foot
  uniform vec3 uTintHigh; // and at its top
  uniform vec4 uMoon; // world position, radius
  uniform vec3 uMoonLight; // colour × strength; black for the mist
  uniform vec4 uBursts[ ${BURSTLIT.count} ]; // world centre, radius
  uniform vec3 uBurstLight[ ${BURSTLIT.count} ]; // colour × live strength
  uniform float uSkyLit; // 1 for clouds, 0 for the mist
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    // The band's ends are clear, so the wrap shows no seam; the gradients of the
    // unwrapped coordinate keep the wrap from dropping to the smallest mip.
    vec2 st = vec2( mix( uSpan.x, uSpan.y, vUv.x ) + uScroll, mix( uBand.x, uBand.y, vUv.y ) );
    vec4 c = textureGrad( tSheet, vec2( fract( st.x ), st.y ), dFdx( st ), dFdy( st ) );
    vec2 edge = min( vUv, 1.0 - vUv );
    float feather = smoothstep( 0.0, uBand.z, edge.x ) * smoothstep( 0.0, uBand.w, edge.y );
    vec3 tint = mix( uTintLow, uTintHigh, smoothstep( 0.0, 0.8, vUv.y ) );
    vec3 colour = c.rgb * tint;
    vec3 toMoon = uMoon.xyz - cameraPosition;
    float rim = asin( clamp( uMoon.w / length( toMoon ), 0.0, 1.0 ) );
    float angle = acos( clamp( dot( normalize( vWorld - cameraPosition ), normalize( toMoon ) ), -1.0, 1.0 ) );
    float lit = exp( -max( angle - rim, 0.0 ) / ${MOONLIT.reach.toFixed(3)} );
    float thin = 1.0 - smoothstep( 0.15, 0.85, c.a );
    colour += uMoonLight * lit * ( 1.0 - ${MOONLIT.edge.toFixed(2)} + ${MOONLIT.edge.toFixed(2)} * thin );
    vec3 view = normalize( vWorld - cameraPosition );
    vec3 flash = vec3( 0.0 );
    for ( int i = 0; i < ${BURSTLIT.count}; i++ ) {
      vec3 toBurst = uBursts[ i ].xyz - cameraPosition;
      float size = asin( clamp( uBursts[ i ].w / max( length( toBurst ), 1.0 ), 0.0, 1.0 ) );
      float off = acos( clamp( dot( view, normalize( toBurst ) ), -1.0, 1.0 ) );
      flash += uBurstLight[ i ] * exp( -max( off - 0.5 * size, 0.0 ) / ( ${BURSTLIT.reach.toFixed(2)} * size + 1e-4 ) );
    }
    colour += flash * uSkyLit * ${BURSTLIT.strength.toFixed(2)} * ( 1.0 - ${BURSTLIT.edge.toFixed(2)} + ${BURSTLIT.edge.toFixed(2)} * thin );
    gl_FragColor = vec4( colour, c.a * feather * uOpacity );
    #include <colorspace_fragment>
    #include <fog_fragment>
  }`;

const moon = new Vector4(...WORLD.moon.position, WORLD.moon.radius);
const moonLight = new Color(MOONLIT.color).multiplyScalar(MOONLIT.strength);
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

  function makeCard(spec, sheet, texture, {
    fog,
    renderOrder,
    drift,
    name,
    tint = { low: [1, 1, 1], high: [1, 1, 1] },
    feather = FEATHER[0],
    moonlit = false,
  }) {
    const [r0, r1] = sheet.bands[spec.band];
    const [u0, u1] = spec.u ?? [0, 1];
    const height = sheet.size[1];
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...UniformsUtils.clone(UniformsLib.fog),
        tSheet: { value: texture },
        uBand: { value: [1 - r1 / height, 1 - r0 / height, feather, FEATHER[1]] },
        uSpan: { value: [u0, u1] },
        uScroll: { value: 0 },
        uOpacity: { value: 0 },
        uTintLow: { value: new Color(...tint.low) },
        uTintHigh: { value: new Color(...tint.high) },
        uMoon: { value: moon },
        uMoonLight: { value: moonlit ? moonLight : new Color(0) },
        uBursts: burstLights.uBursts,
        uBurstLight: burstLights.uBurstLight,
        uSkyLit: { value: moonlit ? 1 : 0 },
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
    const [p0, p1] = drift?.period ?? [1, 1];
    return {
      spec,
      mesh,
      texture,
      aspect: (Math.abs(u1 - u0) * sheet.size[0]) / (r1 - r0),
      base: new Vector3(),
      right: new Vector3(),
      sway: [MathUtils.lerp(p0, p1, random()), random() * Math.PI * 2, drift?.share ?? 0],
    };
  }

  const cards = {};
  for (const [breakpoint, specs] of Object.entries(CLOUDS.cards)) {
    cards[breakpoint] = specs.map((spec) => {
      const layer = CLOUDS.layers[spec.layer];
      const card = makeCard(spec, CLOUD_SHEET, cloudSheet, {
        fog: false,
        renderOrder: layer.renderOrder, // after the sky, before the moon
        name: 'cloud',
        tint: layer.tint,
        feather: CLOUDS.feather,
        moonlit: true,
      });
      const [u0, u1] = spec.u ?? [0, 1];
      card.layer = layer;
      card.phase = spec.phase ?? random();
      // u per second: the layer's speed is a share of the viewport width.
      card.wind = (layer.speed / (spec.width / 100)) * (u1 - u0);
      card.mesh.material.uniforms.uScroll.value = card.phase;
      return card;
    });
  }
  // Mist drifts the other way to the clouds.
  const mist = MIST.cards.map((spec) =>
    makeCard(spec, MIST_SHEET, mistSheet, {
      fog: true,
      renderOrder: 0,
      drift: { ...MIST.drift, share: -MIST.drift.share },
      name: 'mist',
      tint: MIST.tint,
    }),
  );
  const seaMist = SEA_MIST.cards.map((spec) =>
    makeCard(spec, MIST_SHEET, mistSheet, {
      fog: true,
      renderOrder: 0,
      drift: { ...MIST.drift, share: -MIST.drift.share },
      name: 'sea-mist',
      tint: SEA_MIST.tint,
      feather: SEA_MIST.feather,
    }),
  );
  // Depth haze: two bands of wisps, each band drifting its own way and pace.
  const haze = Object.values(HAZE.bands).flatMap((band) =>
    band.cards.map((spec) =>
      makeCard(spec, MIST_SHEET, mistSheet, {
        fog: true,
        renderOrder: 0,
        drift: band.drift,
        name: 'haze',
        tint: HAZE.tint,
        feather: HAZE.feather,
      }),
    ),
  );
  const [faceX, faceZ] = SEA_MIST.face;
  for (const card of [...mist, ...seaMist, ...haze]) {
    const { spec, mesh } = card;
    mesh.scale.set(spec.width, spec.width / card.aspect, 1);
    const foot = mist.includes(card) ? MIST.y : (spec.y ?? 0);
    card.base.set(spec.x, foot + mesh.scale.y / 2, spec.z);
    mesh.position.copy(card.base);
    if (seaMist.includes(card)) mesh.lookAt(faceX, card.base.y, faceZ);
    card.right.set(1, 0, 0).applyQuaternion(mesh.quaternion);
  }

  let active = [];
  const chapterWeight = chapters.map(() => 0);
  let mistLevel = 0;
  let seaLevel = 0;
  let hazeLevel = 0;

  function show(card, level) {
    const opacity = card.spec.opacity * level;
    card.mesh.material.uniforms.uOpacity.value = opacity;
    card.mesh.visible = loaded.has(card.texture) && opacity > 0.002;
  }

  function apply() {
    for (const list of Object.values(cards)) {
      for (const card of list) show(card, active.includes(card) ? chapterWeight[card.spec.chapter] : 0);
    }
    for (const card of mist) show(card, mistLevel);
    for (const card of seaMist) show(card, seaLevel);
    for (const card of haze) show(card, hazeLevel);
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
      placement.getWorldDirection(forward);
      card.base.copy(position).addScaledVector(ray, card.layer.distance);
      const depth = card.layer.distance * ray.dot(forward);
      const width = (spec.width / 100) * 2 * depth * Math.tan(MathUtils.degToRad(placement.fov / 2)) * viewAspect;
      mesh.scale.set(width, width / card.aspect, 1);
      mesh.position.copy(card.base);
      // Parallel to the chapter camera's image plane, so cards stay level and
      // undistorted in the corners of a frame that looks up.
      mesh.quaternion.copy(placement.quaternion);
    }
    apply();
  }

  // Clouds belong to their chapter: full at its hold, crossfading across the move.
  function setSegment({ from, to, eased }, stepped) {
    const t = stepped ? Math.round(eased) : eased;
    const next = chapterWeight.map((_, index) => (index === from ? 1 - t : 0) + (index === to ? t : 0));
    if (next.every((value, index) => value === chapterWeight[index])) return;
    next.forEach((value, index) => (chapterWeight[index] = value));
    apply();
  }

  function setMist(value) {
    if (value === mistLevel) return;
    mistLevel = value;
    apply();
  }

  function setSeaMist(value) {
    if (value === seaLevel) return;
    seaLevel = value;
    apply();
  }

  function setHaze(value) {
    if (value === hazeLevel) return;
    hazeLevel = value;
    apply();
  }

  function sway(card, time) {
    const [period, phase, share] = card.sway;
    const offset = Math.sin((time / period) * Math.PI * 2 + phase) * share * card.mesh.scale.x;
    card.mesh.position.copy(card.base).addScaledVector(card.right, offset);
  }

  function update(time) {
    for (const card of active) card.mesh.material.uniforms.uScroll.value = card.phase - time * card.wind;
    for (const card of mist) sway(card, time);
    for (const card of seaMist) sway(card, time);
    for (const card of haze) sway(card, time);
  }

  return { group, place, setSegment, setMist, setSeaMist, setHaze, update };
}
