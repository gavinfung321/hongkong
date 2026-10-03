import { CanvasTexture, Color, Euler, MeshLambertMaterial, Mesh, PlaneGeometry, Quaternion, RepeatWrapping, SRGBColorSpace } from 'three';
import { seededRandom } from './random.js';

// White water round a boat under way, lying on the harbour (user choice,
// 2026-10-02; it was a foam band standing round the ferry's hull, unlit,
// which read as a light under the boat): a bow wave, a thin wash hugging
// the hull, the churned trail behind the stern and the two arms of the V
// wake. A fixed mask shapes it while foam streams through it from bow to
// stern, so the boat reads as sailing even when the scroll stops. Lit by
// the scene, so the cabin lights warm it near the hull.
//
// The mask is painted from soft, seeded foam patches with gaps, so the V
// arms and the trail read as broken, dissipating foam rather than painted
// lines or a wedge (user request, 2026-10-03).
//
// Behind the stern (user request, 2026-10-03): the mask's second channel is
// disturbed water, a darker, rippled patch where the propellers break the
// mirror, so the reflections behind the boat break up; in it, restrained
// white highlights in broken patches. A second, slower foam layer crosses
// the first, so the white water churns instead of only sliding.

const PX = 4; // mask texels per metre
const FOAM_TILE = [16, 8]; // metres per foam tile, along and across
const SURFACE = 0.12; // height above the water
// The second foam layer: its scale against the first and its speed as a
// share of the first's. Disturbed water: its colour, opacity at the stern,
// and the sparkle of its ripples.
const CHURN = { scale: [0.62, 1.37], speed: 0.55, water: 0x0d1226, opacity: 0.55, sparkle: 0.3 };

function canvas(width, height) {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  return [c, c.getContext('2d')];
}

// Streaks of foam drawn out along the flow, over a faint even film.
function foamTexture(seed) {
  const [W, H] = [256, 128];
  const [c, ctx] = canvas(W, H);
  const random = seededRandom(seed);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) {
    const [x, y] = [random() * W, random() * H];
    const [rx, ry] = [6 + random() * 26, 1 + random() * 3];
    ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + random() * 0.65})`;
    for (const dx of [-W, 0, W]) {
      for (const dy of [-H, 0, H]) {
        ctx.beginPath();
        ctx.ellipse(x + dx, y + dy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

// halfWidthAt(x): the hull's half width at the waterline (0 off the hull),
// bow along +X, scanned over `span`. trail: metres of wake behind the
// stern; spread: tangent of the V's half angle; speed: metres per second
// the foam streams past; strength: overall opacity; glow: the white
// water's own light, so it reads at night.
export function createWake({ halfWidthAt, span, trail, spread = 0.34, speed, strength = 1, glow = 0x161b24, seed }) {
  let [stern, bow, beam] = [Infinity, -Infinity, 0];
  for (let x = span[0]; x <= span[1]; x += 0.25) {
    const hw = halfWidthAt(x);
    if (hw <= 0.05) continue;
    stern = Math.min(stern, x);
    bow = Math.max(bow, x);
    beam = Math.max(beam, hw);
  }
  const ahead = 6;
  const [x0, x1] = [stern - trail, bow + ahead];
  const half = beam + (bow - x0) * spread + 2;
  const [W, H] = [Math.ceil((x1 - x0) * PX), Math.ceil(2 * half * PX)];
  const px = (x) => (x - x0) * PX;
  const pz = (z) => (z + half) * PX;
  const random = seededRandom(seed + 1);

  // A soft-edged patch: an ellipse of radii rx, rz metres turned by `angle`,
  // fading from `alpha` at its centre to nothing at its rim, so overlapping
  // patches never leave a hard boundary.
  const patch = (c, x, z, rx, rz, angle, alpha) => {
    if (alpha <= 0.004) return;
    c.save();
    c.translate(px(x), pz(z));
    c.rotate(angle);
    c.scale(rx * PX, rz * PX);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, alpha)})`);
    g.addColorStop(0.5, `rgba(255, 255, 255, ${Math.min(1, alpha) * 0.75})`);
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, 1, 0, Math.PI * 2);
    c.fill();
    c.restore();
  };
  const jitter = (amount) => (random() * 2 - 1) * amount;

  // ---- White water (red channel) ----
  const [white, ctx] = canvas(W, H);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  // Trail (user request, 2026-10-03: no solid wedge): overlapping churned
  // patches along the track, crowded near the stern, then larger, fainter
  // and sparser as they spread aft into the disturbed water.
  const sternHalf = Math.max(halfWidthAt(stern + 1), beam * 0.6);
  const trailPatches = Math.round(150 * Math.min(1, trail / 90)); // even density
  for (let i = 0; i < trailPatches; i++) {
    const a = random() ** 1.5;
    const x = stern + 1.5 - a * trail;
    const z = jitter(sternHalf * (0.55 + 1.1 * a));
    const alpha = 0.32 * strength * (1 - a) ** 1.5 * (0.45 + random() * 0.55);
    patch(ctx, x, z, (1.4 + a * 6) * (0.6 + random() * 0.8), (0.5 + a * 2.2) * (0.6 + random() * 0.8), jitter(0.12), alpha);
  }

  // Propeller wash: dense, broken churn close behind the stern, patches of
  // mixed sizes thinning and spreading aft.
  const wash = Math.min(trail * 0.5, 22);
  for (let i = 0; i < 110; i++) {
    const a = random() ** 1.7; // more of them near the stern
    const x = stern + 1 - a * wash;
    const z = jitter(sternHalf * (0.45 + 0.6 * a));
    const big = random() < 0.25;
    const alpha = (0.22 + random() * 0.38) * (1 - a) ** 1.2 * strength;
    patch(ctx, x, z, (big ? 2.2 : 0.8) + random() * (big ? 3 : 1.6), (big ? 0.8 : 0.3) + random() * 0.6, jitter(0.25), alpha);
  }

  // The V (user request, 2026-10-03: broken foam, not a painted line): each
  // arm is a run of overlapping clusters of foam patches from the bow
  // shoulder, with seeded gaps. Near the hull the clusters are tight, bright
  // and close to the line; aft they hold more, larger patches scattered
  // wider across the line, gaps open up and the foam fades into the harbour.
  const start = bow - 3;
  const arm = start - x0;
  for (const side of [1, -1]) {
    const angle = Math.atan2(side * spread, -1);
    let a = 0;
    let run = 0; // clusters drawn in a row; never more than three
    while (a < 1) {
      const len = (2.5 + a * 7) * (0.6 + random() * 0.8); // metres along the arm
      const mid = Math.min(1, a + len / 2 / arm);
      const drawn = random() > 0.16 + 0.36 * mid && run < 3;
      run = drawn ? run + 1 : 0;
      if (drawn) {
        const x = start - mid * arm;
        const line = side * (halfWidthAt(start) + mid * arm * spread + 0.3);
        const alpha = 0.95 * strength * (1 - mid) ** 1.5;
        // A faint, wider film of foam binds the cluster's patches together.
        patch(ctx, x, line + jitter(0.1 + mid), len * 0.75, 0.6 + mid * 3, angle + jitter(0.05), alpha * 0.3);
        const count = 1 + Math.floor(random() * (1.5 + mid * 3));
        for (let k = 0; k < count; k++) {
          const width = (0.35 + mid * 1.8) * (0.5 + random());
          const share = k === 0 ? 0.6 + random() * 0.4 : 0.3 + random() * 0.4;
          patch(ctx, x + jitter(len * 0.35), line + jitter(0.35 + mid * 3.5), len * (0.4 + random() * 0.4), width, angle + jitter(0.1), alpha * share);
        }
      }
      a += (len * (0.4 + random() * 0.3)) / arm;
    }
  }

  // Wash hugging the hull at the waterline (inside it is hidden by the hull).
  ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * strength})`;
  ctx.beginPath();
  for (let x = stern; x <= bow; x += 0.5) ctx.lineTo(px(x), pz(halfWidthAt(x) + 0.7));
  for (let x = bow; x >= stern; x -= 0.5) ctx.lineTo(px(x), pz(-halfWidthAt(x) - 0.7));
  ctx.closePath();
  ctx.fill();

  // Bow wave: pushed out round the stem.
  const bowWave = ctx.createRadialGradient(px(bow - 1.5), pz(0), 0, px(bow - 1.5), pz(0), 6 * PX);
  bowWave.addColorStop(0, `rgba(255, 255, 255, ${0.75 * strength})`);
  bowWave.addColorStop(0.55, `rgba(255, 255, 255, ${0.35 * strength})`);
  bowWave.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = bowWave;
  ctx.fillRect(px(bow - 8), pz(-8), 16 * PX, 16 * PX);

  // ---- Disturbed water (green channel) ----
  const [rough, rctx] = canvas(W, H);
  rctx.fillStyle = '#000';
  rctx.fillRect(0, 0, W, H);
  // Overlapping soft patches widening aft, so the patch has ragged, soft
  // sides; a faint ruffle along each V arm under its foam.
  for (let i = 0; i < 90; i++) {
    const a = random() ** 1.2;
    const x = stern + 1 - a * trail;
    const reach = sternHalf * 1.2 + a * trail * spread * 0.7;
    const alpha = 0.22 * (1 - a) ** 1.1 * (0.6 + random() * 0.4);
    patch(rctx, x, jitter(reach * 0.55), (3 + a * 9) * (0.7 + random() * 0.6), reach * (0.35 + random() * 0.3), jitter(0.1), alpha);
  }
  for (const side of [1, -1]) {
    for (let i = 0; i < 24; i++) {
      const a = random();
      const x = start - a * arm;
      const z = side * (halfWidthAt(start) + a * arm * spread + 0.3) + jitter(0.5 + a);
      patch(rctx, x, z, 2.5 + a * 5, 0.8 + a * 2.5, Math.atan2(side * spread, -1), 0.12 * (1 - a) ** 1.3);
    }
  }

  const merged = ctx.getImageData(0, 0, W, H);
  const roughData = rctx.getImageData(0, 0, W, H).data;
  for (let i = 0; i < merged.data.length; i += 4) {
    merged.data[i + 1] = roughData[i];
    merged.data[i + 2] = 0;
  }
  ctx.putImageData(merged, 0, 0);

  const mask = new CanvasTexture(white);
  mask.anisotropy = 4;
  const foam = foamTexture(seed);
  foam.repeat.set((x1 - x0) / FOAM_TILE[0], (2 * half) / FOAM_TILE[1]);

  const geometry = new PlaneGeometry(x1 - x0, 2 * half).rotateX(-Math.PI / 2).translate((x0 + x1) / 2, 0, 0);
  const material = new MeshLambertMaterial({
    color: 0xb4c0cc,
    emissive: glow,
    map: foam,
    alphaMap: mask,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  const churn = {
    wakeChurn: { value: 0 }, // the second layer's offset along the flow
    wakeRepeat: { value: foam.repeat },
    wakeWater: { value: new Color(CHURN.water) },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, churn);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float wakeChurn;
        uniform vec2 wakeRepeat;
        uniform vec3 wakeWater;`,
      )
      .replace(
        '#include <map_fragment>',
        `float foamA = texture2D( map, vMapUv ).a;
        float foamB = texture2D( map, vAlphaMapUv * wakeRepeat * vec2( ${CHURN.scale[0]}, ${CHURN.scale[1]} ) + vec2( wakeChurn, 0.37 ) ).a;
        float foam = foamA * ( 0.45 + 0.75 * foamB );`,
      )
      .replace(
        '#include <alphamap_fragment>',
        `vec2 wakeMask = texture2D( alphaMap, vAlphaMapUv ).rg;
        float sparkle = smoothstep( 0.78, 1.0, foamB ) * ${CHURN.sparkle.toFixed(2)};
        float whiteWater = clamp( wakeMask.r * foam + wakeMask.g * sparkle, 0.0, 1.0 );
        float disturbed = wakeMask.g * ${CHURN.opacity.toFixed(2)} * ( 0.7 + 0.3 * foamB );
        float wakeShare = whiteWater / max( whiteWater + disturbed * ( 1.0 - whiteWater ), 1e-4 );
        diffuseColor.rgb = mix( wakeWater * ( 0.85 + 0.4 * foamB ), diffuseColor.rgb, wakeShare );
        diffuseColor.a *= whiteWater + disturbed * ( 1.0 - whiteWater );`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        totalEmissiveRadiance *= wakeShare;`,
      );
  };
  const mesh = new Mesh(geometry, material);
  mesh.name = 'wake';
  // White water lies outside the hull; the composition probe frames the boat.
  mesh.userData.noProbe = true;

  const tilt = new Euler(0, 0, 0, 'YXZ');
  const undo = new Quaternion();
  // Holds the wake flat on the surface under the boat's bob and roll, and
  // streams the foam aft.
  function update(boat, time, animate) {
    tilt.set(boat.rotation.x, 0, boat.rotation.z);
    undo.setFromEuler(tilt).invert();
    mesh.quaternion.copy(undo);
    mesh.position.set(0, SURFACE - boat.position.y, 0).applyQuaternion(undo);
    if (!animate) return;
    const flow = (time * speed) / FOAM_TILE[0];
    foam.offset.x = flow % 1;
    churn.wakeChurn.value = (CHURN.speed * CHURN.scale[0] * flow) % 1;
  }

  return { mesh, update };
}
