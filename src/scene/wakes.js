import { CanvasTexture, Euler, MeshLambertMaterial, Mesh, PlaneGeometry, Quaternion, RepeatWrapping, SRGBColorSpace } from 'three';
import { seededRandom } from './random.js';

// White water round a boat under way, lying on the harbour (user choice,
// 2026-10-02; it was a foam band standing round the ferry's hull, unlit,
// which read as a light under the boat): a bow wave, a thin wash hugging
// the hull, the churned trail behind the stern and the two arms of the V
// wake. A fixed mask shapes it while foam streams through it from bow to
// stern, so the boat reads as sailing even when the scroll stops. Lit by
// the scene, so the cabin lights warm it near the hull.

const PX = 4; // mask texels per metre
const FOAM_TILE = [16, 8]; // metres per foam tile, along and across
const SURFACE = 0.12; // height above the water

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
// the foam streams past; strength: overall opacity.
export function createWake({ halfWidthAt, span, trail, spread = 0.34, speed, strength = 1, seed }) {
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
  const [c, ctx] = canvas(W, H);
  const px = (x) => (x - x0) * PX;
  const pz = (z) => (z + half) * PX;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff';

  // Trail: churned water widening and fading behind the stern, in soft layers.
  const sternHalf = Math.max(halfWidthAt(stern + 1), beam * 0.6);
  for (let k = 0; k < 4; k++) {
    const grow = 1 + k * 0.35;
    const g = ctx.createLinearGradient(px(stern + 2), 0, px(x0), 0);
    g.addColorStop(0, `rgba(255, 255, 255, ${0.3 * strength})`);
    g.addColorStop(0.35, `rgba(255, 255, 255, ${0.16 * strength})`);
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(px(stern + 2), pz(-sternHalf * (0.7 + 0.1 * k)));
    ctx.lineTo(px(x0), pz(-sternHalf * 1.4 * grow));
    ctx.lineTo(px(x0), pz(sternHalf * 1.4 * grow));
    ctx.lineTo(px(stern + 2), pz(sternHalf * (0.7 + 0.1 * k)));
    ctx.closePath();
    ctx.fill();
  }

  // The V: two arms from the bow shoulders, widening and fading aft.
  const start = bow - 3;
  const arm = start - x0;
  const steps = 40;
  for (const side of [1, -1]) {
    for (let i = 0; i < steps; i++) {
      const [a, b] = [i / steps, (i + 1) / steps];
      const xa = start - a * arm;
      const xb = start - b * arm;
      const za = side * (halfWidthAt(start) + a * arm * spread + 0.3);
      const zb = side * (halfWidthAt(start) + b * arm * spread + 0.3);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * strength * (1 - a) ** 1.6})`;
      ctx.lineWidth = (0.7 + a * 3) * PX;
      ctx.beginPath();
      ctx.moveTo(px(xa), pz(za));
      ctx.lineTo(px(xb), pz(zb));
      ctx.stroke();
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

  const mask = new CanvasTexture(c);
  mask.anisotropy = 4;
  const foam = foamTexture(seed);
  foam.repeat.set((x1 - x0) / FOAM_TILE[0], (2 * half) / FOAM_TILE[1]);

  const geometry = new PlaneGeometry(x1 - x0, 2 * half).rotateX(-Math.PI / 2).translate((x0 + x1) / 2, 0, 0);
  const material = new MeshLambertMaterial({
    color: 0xb4c0cc,
    emissive: 0x161b24,
    map: foam,
    alphaMap: mask,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
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
    if (animate) foam.offset.x = ((time * speed) / FOAM_TILE[0]) % 1;
  }

  return { mesh, update };
}
