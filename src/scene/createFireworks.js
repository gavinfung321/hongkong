import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  Group,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Quaternion,
  SRGBColorSpace,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';
import { BURST_SHEET, FIREWORKS, SMOKE_SHEET } from '../data/atmosphere.js';
import { aimCamera, poseFov } from '../scroll/cameraRig.js';
import { seededRandom } from './random.js';

// Firework show over 06 (ATMOSPHERE-EFFECTS-BRIEF.md 6.7; user choices,
// 2026-10-02). Each burst is one flat card of the shared burst artwork,
// facing the 06 camera at its configured screen place, spun, mirrored and
// squashed so no two match. In a fixed loop a rocket rises from behind the
// skyline, the card ignites at 70% size with a soft flare, opens, cools and
// fades while sinking, and sparks shed from its tips fall in drooping arcs;
// the biggest bursts leave violet-coral smoke that swells and drifts.
// Everything is a pure function of the show time, so reduced motion simply
// holds one composed moment. Rockets and sparks are one set of points in
// the cards' plane. All of it adds light to the sky; IFC and the skyline
// stand in front.
const DEPTH = 1600; // metres in front of the 06 camera, past IFC
const ROCKET_LEAN = 3; // % of the frame width the rocket's start may stray sideways
const RISE_FROM = 104; // % of the frame height: rockets start below the frame edge

const cardVertexShader = `
  uniform float uReach;
  varying vec2 vUv;
  varying vec2 vPos;
  void main() {
    vUv = uv;
    vPos = position.xy / uReach;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`;

// The artwork is premultiplied, so its colour already carries its alpha.
const cardFragmentShader = `
  uniform sampler2D tBurst;
  uniform vec3 uTint;
  uniform float uRecolour; // 0: the artwork's own gold, 1: recoloured to uTint
  uniform float uHeat; // 1 at ignition, 0 once cooled
  uniform vec3 uHaloColor;
  uniform vec2 uHalo; // radius (share of the reach), strength
  uniform float uFlare; // halo boost at ignition
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec2 vPos;
  void main() {
    vec4 c = texture2D( tBurst, vUv );
    float lum = dot( c.rgb, vec3( 0.2126, 0.7152, 0.0722 ) );
    float hot = smoothstep( 0.75, 1.0, lum / max( c.a, 1e-3 ) ) * mix( 0.35, 1.0, uHeat );
    vec3 gold = c.rgb * mix( vec3( 1.0, 0.52, 0.22 ), vec3( 1.0 ), mix( 0.2, 1.0, uHeat ) );
    vec3 sparks = mix( gold, mix( uTint * lum * 1.6, vec3( lum ), hot ), uRecolour );
    float r = length( vPos ) / uHalo.x;
    float glow = exp( -r * r * 18.0 ) * 0.8 + pow( max( 1.0 - r, 0.0 ), 2.5 ) * 0.45;
    gl_FragColor = vec4( ( sparks + uHaloColor * glow * uHalo.y * uFlare ) * uOpacity, 1.0 );
    #include <colorspace_fragment>
  }`;

// Sizes are world sizes. Below 2 px a point shimmers as it moves, so it is
// held at 2 px and dimmed by its lost area instead.
const pointVertexShader = `
  attribute vec3 aColor;
  attribute float aAlpha;
  attribute float aSize;
  uniform float uHalfHeight;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    float size = aSize * projectionMatrix[ 1 ][ 1 ] * uHalfHeight / -mvPosition.z;
    vAlpha = aAlpha * min( size * size * 0.25, 1.0 );
    vColor = aColor;
    gl_PointSize = aAlpha > 0.0 ? max( size, 2.0 ) : 0.0;
  }`;

const pointFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length( gl_PointCoord - 0.5 ) * 2.0;
    float shape = exp( -d * d * 3.0 ) * ( 1.0 - smoothstep( 0.75, 1.0, d ) );
    vec3 color = mix( vColor, vec3( 1.0 ), exp( -d * d * 12.0 ) * 0.6 );
    gl_FragColor = vec4( color * shape * vAlpha, 1.0 );
    #include <colorspace_fragment>
  }`;

// Smoke: one puff of the sheet per card, feathered so no edge shows, laid
// over the sky normally (not added as light, so overlaps never turn white).
const smokeVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`;

const smokeFragmentShader = `
  uniform sampler2D tSmoke;
  uniform vec4 uCell; // u from, v from, u to, v to
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D( tSmoke, mix( uCell.xy, uCell.zw, vUv ) );
    vec2 edge = min( vUv, 1.0 - vUv );
    float feather = smoothstep( 0.0, 0.08, edge.x ) * smoothstep( 0.0, 0.14, edge.y );
    gl_FragColor = c * ( uOpacity * feather );
    #include <colorspace_fragment>
  }`;

const WARM_HALO = new Color(0xffe2b0);
const WHITE = new Color(0xffffff);
const Z = new Vector3(0, 0, 1);
const placement = new PerspectiveCamera();
const position = new Vector3();
const target = new Vector3();
const ray = new Vector3();
const forward = new Vector3();
const spin = new Quaternion();
const point = new Vector3();
const color = new Color();
const bufferSize = new Vector2();

const easeOut = (u) => 1 - (1 - u) ** 3;
const lerpRange = ([a, b], u) => a + (b - a) * u;

// lights: { uBursts, uBurstLight } uniforms (createAtmosphere.js) that get the
// brightest live bursts each pose, so the clouds pick up their colour.
export function createFireworks(chapters, { onLoad, lights } = {}) {
  const group = new Group();
  group.name = 'fireworks';
  const finale = chapters.find((chapter) => chapter.bursts);
  const { card, rocket, sparks: sparkSpec, loop } = FIREWORKS;

  // The card in image-height units, shifted so the burst's core is the origin.
  const [width, height] = BURST_SHEET.size;
  const [coreX, coreY] = BURST_SHEET.core;
  const aspect = width / height;
  const reach = BURST_SHEET.reach / height;
  const geometry = new PlaneGeometry(aspect, 1).translate(-(coreX / width - 0.5) * aspect, coreY / height - 0.5, 0);

  let texture = null;
  let loaded = false;
  let level = 0;
  let specs = [];
  let sparkCount = 0;
  let held = null; // a fixed show time, or null while the show runs
  let clock = null;
  let lastTime = null;
  const right = new Vector3();
  const up = new Vector3();

  const count = Math.max(...Object.values(finale.bursts).map((list) => list.length));
  const maxSparks = Math.max(...Object.values(sparkSpec.count));
  const trail = rocket.trail + 1;
  const stride = trail + maxSparks * sparkSpec.tail;

  // Fixed per burst slot, so every visit sees the same show.
  const random = seededRandom(1706);
  const bursts = Array.from({ length: count }, () => {
    const material = new ShaderMaterial({
      vertexShader: cardVertexShader,
      fragmentShader: cardFragmentShader,
      uniforms: {
        tBurst: { value: null },
        uReach: { value: reach },
        uTint: { value: new Color() },
        uRecolour: { value: 0 },
        uHeat: { value: 1 },
        uHaloColor: { value: new Color() },
        uHalo: { value: [FIREWORKS.halo.radius, FIREWORKS.halo.strength] },
        uFlare: { value: 1 },
        uOpacity: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      premultipliedAlpha: true,
      side: DoubleSide, // mirrored cards are flipped
    });
    const mesh = new Mesh(geometry, material);
    mesh.name = 'burst';
    mesh.userData.noProbe = true;
    mesh.visible = false;
    group.add(mesh);
    return {
      mesh,
      core: new Vector3(),
      start: new Vector3(),
      scale: new Vector2(),
      radius: 0, // world radius of the reach
      duration: 1,
      lean: random() * 2 - 1,
      sparkColor: new Color(),
      sparks: Array.from({ length: maxSparks }, () => ({
        angle: random() * Math.PI * 2,
        start: lerpRange(sparkSpec.start, random()),
        delay: lerpRange(sparkSpec.delay, random()),
        life: lerpRange(sparkSpec.life, random()),
        speed: lerpRange(sparkSpec.speed, random()),
      })),
    };
  });

  const pointGeometry = new BufferGeometry();
  const attribute = (name, size) => {
    const buffer = new BufferAttribute(new Float32Array(count * stride * size), size);
    buffer.setUsage(DynamicDrawUsage);
    pointGeometry.setAttribute(name, buffer);
    return buffer;
  };
  const positions = attribute('position', 3);
  const colors = attribute('aColor', 3);
  const alphas = attribute('aAlpha', 1);
  const sizes = attribute('aSize', 1);
  const pointMaterial = new ShaderMaterial({
    vertexShader: pointVertexShader,
    fragmentShader: pointFragmentShader,
    uniforms: { uHalfHeight: { value: 400 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    premultipliedAlpha: true,
  });
  const points = new Points(pointGeometry, pointMaterial);
  points.name = 'firework-sparks';
  points.frustumCulled = false;
  points.userData.noProbe = true;
  points.visible = false;
  points.onBeforeRender = (renderer) => {
    renderer.getDrawingBufferSize(bufferSize);
    pointMaterial.uniforms.uHalfHeight.value = bufferSize.y / 2;
  };
  group.add(points);

  // Smoke wisps, drawn before the bursts so every burst lights over them.
  let smokeTexture = null;
  let smokeLoaded = false;
  let smokeSpecs = [];
  const smokeGeometry = new PlaneGeometry(1, 1);
  const smokeCount = Math.max(...Object.values(finale.smoke).map((list) => list.length));
  const smokes = Array.from({ length: smokeCount }, () => {
    const material = new ShaderMaterial({
      vertexShader: smokeVertexShader,
      fragmentShader: smokeFragmentShader,
      uniforms: { tSmoke: { value: null }, uCell: { value: [0, 0, 1, 1] }, uOpacity: { value: 0 } },
      transparent: true,
      depthWrite: false,
      premultipliedAlpha: true,
    });
    const mesh = new Mesh(smokeGeometry, material);
    mesh.name = 'smoke';
    mesh.renderOrder = -0.5; // after the clouds (-0.95), before the bursts
    mesh.userData.noProbe = true;
    mesh.visible = false;
    group.add(mesh);
    return { mesh, base: new Vector3(), width: 0, height: 0 };
  });

  let sparkSize = 1;
  let rocketSize = 1;

  function setPoint(index, at, rgb, alpha, size) {
    positions.setXYZ(index, at.x, at.y, at.z);
    colors.setXYZ(index, rgb.r, rgb.g, rgb.b);
    alphas.setX(index, alpha);
    sizes.setX(index, size);
  }

  // Lays out the whole show at show time `t` (seconds).
  const live = [];
  let footer = 0; // setFooter
  function shareLights() {
    if (!lights) return;
    live.sort((a, b) => b.light - a.light);
    lights.uBursts.value.forEach((slot, k) => {
      const entry = live[k];
      const colour = lights.uBurstLight.value[k];
      if (!entry) {
        colour.setRGB(0, 0, 0);
        return;
      }
      const { core, radius, sparkColor } = bursts[entry.i];
      slot.set(core.x, core.y, core.z, radius);
      colour.copy(sparkColor).multiplyScalar(entry.light);
    });
  }

  function pose(t) {
    alphas.array.fill(0);
    live.length = 0;
    let anyPoint = false;
    specs.forEach((spec, i) => {
      const burst = bursts[i];
      const { mesh, core, radius } = burst;
      const p = MathUtils.euclideanModulo(t - spec.at, loop);
      const strength = spec.strength * level * (1 - 0.5 * footer);
      const { uniforms } = mesh.material;

      // The card: ignites at 70% size, opens, then cools, sinks and fades.
      const life = card.reveal + card.open + card.fade;
      let opacity = 0;
      if (p < life) {
        const reveal = easeOut(Math.min(p / card.reveal, 1));
        const opened = easeOut(Math.min(p / (card.reveal + card.open), 1));
        const fading = MathUtils.clamp((p - card.reveal - card.open) / card.fade, 0, 1);
        // Steep at the end: faint light reads brighter on screen than it is.
        opacity = strength * reveal * (1 - fading) ** 2.2;
        const grow = card.startScale + (1 - card.startScale) * opened + 0.04 * fading;
        mesh.scale.set(burst.scale.x * grow, burst.scale.y * grow, 1);
        mesh.position.copy(core).addScaledVector(up, -card.sink * fading * fading * radius);
        uniforms.uFlare.value = 1 + card.flare * Math.exp(-p / 0.12);
        uniforms.uHeat.value = 1 - Math.min(p / (card.reveal + card.open + card.fade * 0.5), 1);
      }
      uniforms.uOpacity.value = opacity;
      mesh.visible = loaded && opacity > 0.001;
      if (mesh.visible) live.push({ i, light: opacity * uniforms.uFlare.value ** 0.5 });
      if (!loaded) return;

      const base = i * stride;
      // The rocket: decelerating as it climbs, its trail a dense streak that
      // shortens as it slows.
      const toIgnition = loop - p;
      if (toIgnition <= burst.duration) {
        const u = 1 - toIgnition / burst.duration;
        const climbed = 1 - (1 - u) ** 2;
        const length = Math.min(climbed, rocket.length * (1 - u) + 0.015);
        const brightness = Math.max(strength, 0.6 * level);
        for (let k = 0; k < trail; k++) {
          const along = k / (trail - 1);
          point.lerpVectors(burst.start, core, climbed - along * length);
          color.copy(burst.sparkColor).lerp(WHITE, k === 0 ? 0.7 : 0.35 * (1 - along));
          const alpha = k === 0 ? 1 : 0.55 * (1 - along) ** 1.5;
          setPoint(base + k, point, color, brightness * alpha, rocketSize * (k === 0 ? 1.3 : 1 - 0.5 * along));
        }
        anyPoint = true;
      }

      // The sparks: shed from the tips, slowing outward, falling and fading,
      // each with a short tail of its own earlier places.
      const squash = spec.squash ?? 1;
      for (let k = 0; k < sparkCount; k++) {
        const spark = burst.sparks[k];
        for (let j = 0; j < sparkSpec.tail; j++) {
          const s = p - spark.delay - j * sparkSpec.tailSpacing;
          if (s < 0 || s > spark.life) continue;
          const out = spark.start + (spark.speed * (1 - Math.exp(-sparkSpec.drag * s))) / sparkSpec.drag;
          const dx = Math.cos(spark.angle) * out;
          const dy = Math.sin(spark.angle) * out * squash - 0.5 * sparkSpec.gravity * s * s;
          point.copy(core).addScaledVector(right, dx * radius).addScaledVector(up, dy * radius);
          const age = (p - spark.delay) / spark.life;
          const tailFade = 1 - j / sparkSpec.tail;
          color.copy(WHITE).lerp(burst.sparkColor, Math.min(s / 0.5, 1));
          const alpha = FIREWORKS.sparkGain * strength * Math.min(s / 0.15, 1) * Math.max(1 - age, 0) ** 1.2 * tailFade * tailFade;
          setPoint(base + trail + k * sparkSpec.tail + j, point, color, alpha, sparkSize * (1 - 0.4 * Math.min(age, 1)) * (0.6 + 0.4 * tailFade));
          anyPoint = true;
        }
      }
    });
    points.visible = anyPoint;
    for (const buffer of [positions, colors, alphas, sizes]) buffer.needsUpdate = true;
    shareLights();

    // The smoke: gathers after its burst, swells, drifts with the wind, fades.
    const { smoke } = FIREWORKS;
    smokeSpecs.forEach((spec, i) => {
      const { mesh, base, width: w, height: h } = smokes[i];
      const s = MathUtils.euclideanModulo(t - specs[spec.burst].at - smoke.delay, loop);
      let opacity = 0;
      if (s < smoke.life) {
        const u = s / smoke.life;
        opacity = spec.opacity * level * (1 - 0.3 * footer) * MathUtils.smoothstep(s, 0, smoke.fadeIn) * (1 - u) ** 1.5;
        const grow = lerpRange(smoke.grow, 1 - (1 - u) ** 2);
        mesh.scale.set(w * grow, h * grow, 1);
        mesh.position.copy(base).addScaledVector(right, smoke.drift[0] * w * u).addScaledVector(up, smoke.drift[1] * w * u);
      }
      mesh.material.uniforms.uOpacity.value = opacity;
      mesh.visible = smokeLoaded && opacity > 0.002;
    });
  }

  function refresh() {
    pose(held ?? clock ?? FIREWORKS.entry);
  }

  function loadTexture(url, onReady) {
    const map = new TextureLoader().load(`${import.meta.env.BASE_URL}${url}`, () => {
      onReady();
      refresh();
      onLoad?.();
    });
    map.colorSpace = SRGBColorSpace;
    map.premultiplyAlpha = true;
    return map;
  }

  // Fetched once the first frame is up, long before anyone reaches 06.
  function load() {
    if (texture) return;
    texture = loadTexture(BURST_SHEET.url, () => {
      loaded = true;
    });
    for (const { mesh } of bursts) mesh.material.uniforms.tBurst.value = texture;
    smokeTexture = loadTexture(SMOKE_SHEET.url, () => {
      smokeLoaded = true;
    });
    for (const { mesh } of smokes) mesh.material.uniforms.tSmoke.value = smokeTexture;
  }

  // Frames each burst at the 06 hold pose for this screen. Every burst sits
  // at the same depth, so the lens shift doesn't enlarge high ones.
  function place(breakpoint, viewAspect) {
    specs = finale.bursts[breakpoint];
    sparkCount = sparkSpec.count[breakpoint];
    pointGeometry.setDrawRange(0, specs.length * stride);
    const pose06 = finale.camera[breakpoint];
    placement.fov = poseFov(pose06, viewAspect, breakpoint);
    placement.aspect = viewAspect;
    placement.near = 0.5;
    placement.far = 5000;
    aimCamera(placement, position.fromArray(pose06.position), target.fromArray(pose06.target));
    placement.updateMatrixWorld();
    placement.getWorldDirection(forward);
    right.set(1, 0, 0).applyQuaternion(placement.quaternion);
    up.set(0, 1, 0).applyQuaternion(placement.quaternion);
    const viewHeight = 2 * DEPTH * Math.tan(MathUtils.degToRad(placement.fov / 2));
    const viewWidth = viewHeight * viewAspect;
    sparkSize = FIREWORKS.size.spark * viewHeight;
    rocketSize = FIREWORKS.size.rocket * viewHeight;
    const atDepth = (x, y, out) => {
      ray.set((x / 100) * 2 - 1, 1 - (y / 100) * 2, 0.5).unproject(placement).sub(position).normalize();
      return out.copy(position).addScaledVector(ray, DEPTH / ray.dot(forward));
    };
    specs.forEach((spec, i) => {
      const burst = bursts[i];
      const { mesh } = burst;
      atDepth(spec.x, spec.y, burst.core);
      atDepth(spec.x + burst.lean * ROCKET_LEAN, RISE_FROM, burst.start);
      burst.duration = lerpRange(rocket.duration, MathUtils.clamp((RISE_FROM - spec.y) / 90, 0, 1));
      const scale = ((spec.size / 100) * viewWidth * 0.5) / reach;
      burst.radius = scale * reach;
      burst.scale.set(spec.mirror ? -scale : scale, scale * (spec.squash ?? 1));
      mesh.position.copy(burst.core);
      mesh.quaternion.copy(placement.quaternion).multiply(spin.setFromAxisAngle(Z, MathUtils.degToRad(spec.rotate ?? 0)));
      const { uniforms } = mesh.material;
      const tint = FIREWORKS.colors[spec.color];
      uniforms.uRecolour.value = tint === null ? 0 : 1;
      if (tint !== null) uniforms.uTint.value.setHex(tint);
      uniforms.uHaloColor.value.copy(tint === null ? WARM_HALO : uniforms.uTint.value);
      burst.sparkColor.setHex(FIREWORKS.sparkColors[spec.color]);
    });
    for (let i = specs.length; i < count; i++) bursts[i].mesh.visible = false;

    smokeSpecs = finale.smoke[breakpoint] ?? [];
    const [sheetW, sheetH] = SMOKE_SHEET.size;
    smokeSpecs.forEach((spec, i) => {
      const wisp = smokes[i];
      const owner = specs[spec.burst];
      const [x0, y0, x1, y1] = SMOKE_SHEET.cells[spec.cell];
      atDepth(owner.x + spec.dx, owner.y + spec.dy, wisp.base);
      wisp.width = (spec.size / 100) * viewWidth;
      wisp.height = (wisp.width * (y1 - y0)) / (x1 - x0);
      wisp.mesh.quaternion.copy(placement.quaternion);
      wisp.mesh.material.uniforms.uCell.value = [x0 / sheetW, 1 - y1 / sheetH, x1 / sheetW, 1 - y0 / sheetH];
    });
    for (let i = smokeSpecs.length; i < smokeCount; i++) smokes[i].mesh.visible = false;
    refresh();
  }

  function setLevel(value) {
    if (value === level) return;
    level = value;
    refresh();
  }

  // 0..1 as the footer rises over 06 (user choice, 2026-10-03): the bursts
  // dim to half and their smoke to 70%, so the show stays on but quieter
  // behind the footer text. True when it changed.
  function setFooter(value) {
    if (Math.abs(value - footer) < 0.002) return false;
    footer = value;
    refresh();
    return true;
  }

  // Holds the show at time `t` (null runs it again).
  function hold(t) {
    held = t;
    clock = null;
    refresh();
  }

  // Reduced motion holds the composed `still` moment.
  function setStill(value) {
    hold(value ? FIREWORKS.still : null);
  }

  // The show clock runs only while the fireworks show, and restarts at the
  // composed `entry` moment each time 06 comes into view.
  function update(time) {
    const dt = lastTime === null ? 0 : Math.min(Math.max(time - lastTime, 0), 0.1);
    lastTime = time;
    if (held !== null) return;
    if (level <= 0.001) {
      clock = null;
      return;
    }
    clock = clock === null ? FIREWORKS.entry : clock + dt;
    pose(clock);
  }

  return { group, hold, load, place, setLevel, setFooter, setStill, update };
}
