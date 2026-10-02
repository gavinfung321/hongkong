import {
  AdditiveBlending,
  Color,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  SRGBColorSpace,
  ShaderMaterial,
  TextureLoader,
  Vector3,
} from 'three';
import { BURST_SHEET, FIREWORKS } from '../data/atmosphere.js';
import { aimCamera, poseFov } from '../scroll/cameraRig.js';

// Firework bursts over 06 (ATMOSPHERE-EFFECTS-BRIEF.md 6.7, step 1: still
// bursts, user choice 2026-10-02). Each burst is one flat card of the shared
// burst artwork, facing the 06 camera at its configured screen place, spun,
// mirrored and squashed so no two match. The sparks add light to the sky, so
// overlapping bursts brighten rather than show card edges; a small halo glows
// at each centre. IFC and the skyline stand in front of them.
const DEPTH = 1600; // metres in front of the 06 camera, past IFC

const vertexShader = `
  uniform float uReach;
  varying vec2 vUv;
  varying vec2 vPos;
  void main() {
    vUv = uv;
    vPos = position.xy / uReach;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`;

// The artwork is premultiplied, so its colour already carries its alpha.
const fragmentShader = `
  uniform sampler2D tBurst;
  uniform vec3 uTint;
  uniform float uRecolour; // 0: the artwork's own gold, 1: recoloured to uTint
  uniform vec3 uHaloColor;
  uniform vec2 uHalo; // radius (share of the reach), strength
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec2 vPos;
  void main() {
    vec4 c = texture2D( tBurst, vUv );
    float lum = dot( c.rgb, vec3( 0.2126, 0.7152, 0.0722 ) );
    float hot = smoothstep( 0.75, 1.0, lum / max( c.a, 1e-3 ) );
    vec3 sparks = mix( c.rgb, mix( uTint * lum * 1.6, vec3( lum ), hot ), uRecolour );
    float r = length( vPos ) / uHalo.x;
    float glow = exp( -r * r * 18.0 ) * 0.8 + pow( max( 1.0 - r, 0.0 ), 2.5 ) * 0.45;
    gl_FragColor = vec4( ( sparks + uHaloColor * glow * uHalo.y ) * uOpacity, 1.0 );
    #include <colorspace_fragment>
  }`;

const WARM_HALO = new Color(0xffe2b0);
const Z = new Vector3(0, 0, 1);
const placement = new PerspectiveCamera();
const position = new Vector3();
const target = new Vector3();
const ray = new Vector3();
const forward = new Vector3();
const spin = new Quaternion();

export function createFireworks(chapters, { onLoad } = {}) {
  const group = new Group();
  group.name = 'fireworks';
  const finale = chapters.find((chapter) => chapter.bursts);

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

  const count = Math.max(...Object.values(finale.bursts).map((list) => list.length));
  const bursts = Array.from({ length: count }, () => {
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        tBurst: { value: null },
        uReach: { value: reach },
        uTint: { value: new Color() },
        uRecolour: { value: 0 },
        uHaloColor: { value: new Color() },
        uHalo: { value: [FIREWORKS.halo.radius, FIREWORKS.halo.strength] },
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
    return mesh;
  });

  function apply() {
    bursts.forEach((mesh, i) => {
      const opacity = (specs[i]?.strength ?? 0) * level;
      mesh.material.uniforms.uOpacity.value = opacity;
      mesh.visible = loaded && opacity > 0.001;
    });
  }

  // Fetched once the first frame is up, long before anyone reaches 06.
  function load() {
    if (texture) return;
    texture = new TextureLoader().load(`${import.meta.env.BASE_URL}${BURST_SHEET.url}`, () => {
      loaded = true;
      apply();
      onLoad?.();
    });
    texture.colorSpace = SRGBColorSpace;
    texture.premultiplyAlpha = true;
    for (const mesh of bursts) mesh.material.uniforms.tBurst.value = texture;
  }

  // Frames each burst at the 06 hold pose for this screen. Every burst sits
  // at the same depth, so the lens shift doesn't enlarge high ones.
  function place(breakpoint, viewAspect) {
    specs = finale.bursts[breakpoint];
    const pose = finale.camera[breakpoint];
    placement.fov = poseFov(pose, viewAspect, breakpoint);
    placement.aspect = viewAspect;
    placement.near = 0.5;
    placement.far = 5000;
    aimCamera(placement, position.fromArray(pose.position), target.fromArray(pose.target));
    placement.updateMatrixWorld();
    placement.getWorldDirection(forward);
    const viewWidth = 2 * DEPTH * Math.tan(MathUtils.degToRad(placement.fov / 2)) * viewAspect;
    specs.forEach((spec, i) => {
      const mesh = bursts[i];
      ray.set((spec.x / 100) * 2 - 1, 1 - (spec.y / 100) * 2, 0.5).unproject(placement).sub(position).normalize();
      mesh.position.copy(position).addScaledVector(ray, DEPTH / ray.dot(forward));
      const scale = ((spec.size / 100) * viewWidth * 0.5) / reach;
      mesh.scale.set(spec.mirror ? -scale : scale, scale * (spec.squash ?? 1), 1);
      mesh.quaternion.copy(placement.quaternion).multiply(spin.setFromAxisAngle(Z, MathUtils.degToRad(spec.rotate ?? 0)));
      const { uniforms } = mesh.material;
      const tint = FIREWORKS.colors[spec.color];
      uniforms.uRecolour.value = tint === null ? 0 : 1;
      if (tint !== null) uniforms.uTint.value.setHex(tint);
      uniforms.uHaloColor.value.copy(tint === null ? WARM_HALO : uniforms.uTint.value);
    });
    apply();
  }

  function setLevel(value) {
    if (value === level) return;
    level = value;
    apply();
  }

  return { group, load, place, setLevel };
}
