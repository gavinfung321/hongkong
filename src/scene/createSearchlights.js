import { AdditiveBlending, Color, DoubleSide, Group, MathUtils, Mesh, PlaneGeometry, ShaderMaterial, Vector3 } from 'three';
import { SEARCHLIGHTS } from '../data/atmosphere.js';

// Searchlights over Central (ATMOSPHERE-EFFECTS-BRIEF.md 6.5; user choice,
// 2026-10-03). Each beam is one strip from its rooftop lamp, turned about its
// own axis to face the camera and widening with distance, brightest along
// its core and fading to nothing at its sides and far end. It adds light, so
// it brightens the clouds it crosses; towers in front hide its foot. Each
// sweeps slowly from side to side within its own range, and holds one dim
// pose in reduced motion. No real light is cast.
const vertexShader = `
  uniform vec3 uBase;
  uniform vec3 uDir;
  uniform float uLength;
  uniform vec2 uWidth; // at the lamp, at the far end
  varying vec2 vBeam; // across (-1 to 1), along (0 at the lamp to 1)
  void main() {
    float along = position.y + 0.5;
    vec3 point = uBase + uDir * ( uLength * along );
    vec3 side = normalize( cross( uDir, cameraPosition - point ) );
    point += side * position.x * mix( uWidth.x, uWidth.y, along );
    vBeam = vec2( position.x * 2.0, along );
    gl_Position = projectionMatrix * viewMatrix * vec4( point, 1.0 );
  }`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uFalloff;
  varying vec2 vBeam;
  void main() {
    float across = max( exp( -3.0 * vBeam.x * vBeam.x ) - 0.05, 0.0 ) / 0.95;
    float along = smoothstep( 0.0, 0.02, vBeam.y ) * pow( 1.0 - vBeam.y, uFalloff );
    gl_FragColor = vec4( uColor, across * along * uOpacity );
    #include <colorspace_fragment>
  }`;

export function createSearchlights() {
  const group = new Group();
  group.name = 'searchlights';
  const geometry = new PlaneGeometry(1, 1, 1, 24);
  const color = new Color(SEARCHLIGHTS.color);

  const beams = SEARCHLIGHTS.beams.map((spec) => {
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uBase: { value: new Vector3(...spec.base) },
        uDir: { value: new Vector3(0, 1, 0) },
        uLength: { value: SEARCHLIGHTS.length },
        uWidth: { value: SEARCHLIGHTS.width },
        uColor: { value: color },
        uOpacity: { value: 0 },
        uFalloff: { value: SEARCHLIGHTS.falloff },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide,
    });
    const mesh = new Mesh(geometry, material);
    mesh.name = 'searchlight';
    mesh.renderOrder = -0.4; // after the clouds, moon and mountain haze
    mesh.frustumCulled = false; // the shader places the strip
    mesh.userData.noProbe = true;
    mesh.visible = false;
    group.add(mesh);
    return { spec, mesh };
  });

  let level = 0;
  let breakpoint = 'desktop';
  let still = false;

  // Leans the beam to the share `t` (0–1) of its sweep range.
  function aim(beam, t) {
    const [from, to] = beam.spec.lean;
    const lean = MathUtils.degToRad(MathUtils.lerp(from, to, t));
    beam.mesh.material.uniforms.uDir.value.set(Math.sin(lean), Math.cos(lean), -SEARCHLIGHTS.recede).normalize();
  }

  function apply() {
    const strength = level * SEARCHLIGHTS.opacity * (still ? SEARCHLIGHTS.still.dim : 1);
    for (const beam of beams) {
      const shown = !beam.spec.only || beam.spec.only === breakpoint;
      beam.mesh.material.uniforms.uOpacity.value = shown ? strength : 0;
      beam.mesh.visible = shown && strength > 0.002;
    }
  }

  function setLevel(value) {
    if (value === level) return;
    level = value;
    apply();
  }

  function setBreakpoint(value) {
    breakpoint = value;
    apply();
  }

  function setStill(value) {
    still = value;
    if (still) for (const beam of beams) aim(beam, SEARCHLIGHTS.still.phase);
    apply();
  }

  // An eased swing there and back, each beam on its own period and phase.
  function update(time) {
    for (const beam of beams) {
      const { period, phase } = beam.spec;
      aim(beam, 0.5 - 0.5 * Math.cos(((time / period + phase) % 1) * Math.PI * 2));
    }
  }

  for (const beam of beams) aim(beam, beam.spec.phase);
  return { group, setBreakpoint, setLevel, setStill, update };
}
