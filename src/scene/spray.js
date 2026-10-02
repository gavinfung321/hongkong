import { Color, Mesh, PlaneGeometry, ShaderMaterial, UniformsLib, UniformsUtils, Vector3 } from 'three';
import { SPRAY } from '../data/atmosphere.js';

// White water thrown up at a boat's bow (ATMOSPHERE-EFFECTS-BRIEF.md 6.4;
// user choice, 2026-10-03): one upright card of the spray artwork, a child
// of the boat at its bow so it rides the bob, turned about the vertical to
// face the camera and set out on the hull's side toward it. A flat card
// would sink behind the hull's near side wherever the boat is seen at an
// angle, so its depth (only) is pulled `pull` metres toward the camera: it
// clears its own hull but stays behind anything nearer, such as the railing
// or the other boat. The art's foam edge sits on the waterline. Calmer at a
// hold, fuller while the boat moves; a slow irregular swell; still in
// reduced motion. Fogged like the boats.
const vertexShader = `
  #include <fog_pars_vertex>
  uniform vec2 uSize;
  uniform float uToward;
  uniform float uSink;
  uniform float uPulse;
  uniform float uPull;
  varying vec2 vUv;
  void main() {
    vec3 centre = ( modelMatrix * vec4( 0.0, 0.0, 0.0, 1.0 ) ).xyz;
    vec3 toCamera = cameraPosition - centre;
    toCamera.y = 0.0;
    toCamera = normalize( toCamera );
    vec3 right = vec3( toCamera.z, 0.0, -toCamera.x );
    centre += toCamera * uToward;
    vec3 point = centre + ( right * position.x * uSize.x + vec3( 0.0, ( position.y + 0.5 - uSink ) * uSize.y, 0.0 ) ) * uPulse;
    vUv = uv;
    vec4 mvPosition = viewMatrix * vec4( point, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    vec4 nearer = projectionMatrix * viewMatrix * vec4( point + normalize( cameraPosition - point ) * uPull, 1.0 );
    gl_Position.z = nearer.z / nearer.w * gl_Position.w;
    #include <fog_vertex>
  }`;

const fragmentShader = `
  #include <fog_pars_fragment>
  uniform sampler2D tSpray;
  uniform vec3 uTint;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D( tSpray, vUv );
    gl_FragColor = vec4( c.rgb * uTint, c.a * uOpacity );
    #include <colorspace_fragment>
    #include <fog_fragment>
  }`;

const geometry = new PlaneGeometry(1, 1);
const tint = new Color(...SPRAY.tint);

export function createSpray(texture, { bow, toward, pull, width, opacity }) {
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      ...UniformsUtils.clone(UniformsLib.fog),
      tSpray: { value: texture },
      uSize: { value: [width, (width * SPRAY.size[1]) / SPRAY.size[0]] },
      uToward: { value: toward },
      uSink: { value: SPRAY.sink },
      uPulse: { value: 1 },
      uPull: { value: pull },
      uTint: { value: tint },
      uOpacity: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    fog: true,
  });
  const mesh = new Mesh(geometry, material);
  mesh.name = 'spray';
  mesh.position.set(bow, 0, 0);
  mesh.frustumCulled = false; // the shader places the card
  mesh.userData.noProbe = true;

  const last = new Vector3();
  let lastTime = 0;
  let speed = 0;

  // `boat`'s world position gives its speed; the fadeable copy of the
  // material (gating.js) carries the boat's fade in its opacity.
  function update(boat, time, animate) {
    const { uniforms } = mesh.material;
    if (animate && time > lastTime) {
      const measured = boat.position.distanceTo(last) / (time - lastTime);
      speed += (Math.min(measured / SPRAY.fullSpeed, 1) - speed) * Math.min(1, (time - lastTime) * 2);
    } else if (!animate) {
      speed = 0;
    }
    last.copy(boat.position);
    lastTime = time;
    const [a, b] = SPRAY.pulse.size;
    const [pa, pb] = SPRAY.pulse.period;
    uniforms.uPulse.value = animate ? 1 + a * Math.sin((time / pa) * Math.PI * 2) + b * Math.sin((time / pb) * Math.PI * 2 + 1.3) : 1;
    uniforms.uOpacity.value = mesh.material.opacity * (opacity[0] + (opacity[1] - opacity[0]) * speed);
  }

  return { mesh, update };
}
