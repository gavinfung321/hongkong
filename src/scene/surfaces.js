import { CanvasTexture, ClampToEdgeWrapping, Color, RepeatWrapping, SRGBColorSpace } from 'three';
import { seededRandom } from './random.js';

// Original surface textures drawn in code (no image files): Clock Tower brick
// and granite, clock dials, ferry windows and hull, junk sail cloth and hull,
// the Observation Wheel's hub glow, the promenade railing's granite, the
// paving slabs and the palms' fronds and bark.
// Fine detail is kept to a few pixels per metre so mipmaps average it calmly.

function canvas(width, height) {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  return [c, c.getContext('2d')];
}

function texture(c, { srgb = true, repeat = [1, 1] } = {}) {
  const t = new CanvasTexture(c);
  if (srgb) t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = 4;
  return t;
}

function shade(hex, amount) {
  const c = new Color(hex);
  c.offsetHSL(0, 0, amount);
  return `#${c.getHexString()}`;
}

// ---- Clock Tower ------------------------------------------------------------

const TOWER_PX = 256 / 9; // shaft texture pixels per metre
const TOWER_BRICK = 0x8a3a2a;
const TOWER_GRANITE = 0xb8a68a;

// Floodlit from the foot: the glow map is the colour map tinted golden,
// brightest at the bottom and still warm at the top.
function floodGlow(c, bottom = 'rgb(255, 205, 140)', top = 'rgb(200, 140, 90)') {
  const [e, glow] = canvas(c.width, c.height);
  glow.drawImage(c, 0, 0);
  glow.globalCompositeOperation = 'multiply';
  const gradient = glow.createLinearGradient(0, c.height, 0, 0);
  gradient.addColorStop(0, bottom);
  gradient.addColorStop(1, top);
  glow.fillStyle = gradient;
  glow.fillRect(0, 0, c.width, c.height);
  glow.globalCompositeOperation = 'source-over';
  return [e, glow];
}

// Bricks: 8 × 3 px courses, offset every other row, each with its own tone.
// Bricks are ~2 px on screen, so mortar stays faint and flat: sharp courses
// strobe while the camera moves.
function brickwork(ctx, w, h, random) {
  ctx.fillStyle = shade(TOWER_BRICK, -0.025);
  ctx.fillRect(0, 0, w, h);
  for (let row = 0; row * 3 < h; row++) {
    const offset = row % 2 ? 4 : 0;
    for (let col = -1; col * 8 < w; col++) {
      ctx.fillStyle = shade(TOWER_BRICK, (random() - 0.5) * 0.06);
      ctx.fillRect(col * 8 + offset, row * 3, 7, 2);
    }
  }
}

// The brick panel of one shaft face, 9 m × 29.8 m (granite pilasters cover
// the outer 1.75 m each side): a base course, three stone-framed sash
// windows (the middle one lit), three narrow windows under the cornice and a
// granite frieze. Shared by all four faces. Returns colour and glow maps.
export function clockTowerShaft() {
  const PX = TOWER_PX;
  const W = 256;
  const H = 848;
  const random = seededRandom(7);
  const [c, ctx] = canvas(W, H);
  const y = (metres) => H - metres * PX;
  const cx = W / 2;
  brickwork(ctx, W, H, random);

  const granite = (x, top, w, h) => {
    ctx.fillStyle = shade(TOWER_GRANITE, (random() - 0.5) * 0.05);
    ctx.fillRect(x, top, w, h);
  };
  granite(0, y(0.5), W, 0.5 * PX);
  granite(0, y(29.8), W, 0.5 * PX);

  // [sill height, width, height, lit]
  const windows = [];
  for (const [sill, lit] of [[4.8, false], [10.3, true], [15.8, false]]) windows.push([cx, sill, 1.3, 2.3, lit]);
  for (const dx of [-0.85, 0, 0.85]) windows.push([cx + dx * PX, 27.3, 0.55, 1.6, false]);
  const lights = [];
  for (const [x, sill, w, h, lit] of windows) {
    const [left, top, ww, hh] = [x - (w / 2) * PX, y(sill + h), w * PX, h * PX];
    granite(left - 5, top - 5, ww + 10, hh + 10);
    granite(left - 8, y(sill) + 3, ww + 16, 6);
    ctx.fillStyle = lit ? '#e8a660' : '#1c1a22';
    ctx.fillRect(left, top, ww, hh);
    // Sash bars.
    ctx.fillStyle = lit ? 'rgba(90, 50, 25, 0.8)' : 'rgba(150, 140, 125, 0.5)';
    ctx.fillRect(left, top + hh / 2 - 1, ww, 2);
    ctx.fillRect(x - 1, top, 2, hh);
    if (lit) lights.push([left, top, ww, hh]);
  }

  const [e, glow] = floodGlow(c);
  for (const [left, top, ww, hh] of lights) {
    glow.fillStyle = '#d08a40';
    glow.fillRect(left, top, ww, hh);
  }
  return { map: texture(c), emissiveMap: texture(e) };
}

// One corner pilaster face, 1.9 m × 29.8 m: rusticated granite courses
// 0.6 m tall with an offset vertical joint. Returns colour and glow maps.
export function clockTowerPilaster() {
  const PX = TOWER_PX;
  const W = 54;
  const H = 848;
  const random = seededRandom(13);
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = shade(TOWER_GRANITE, -0.18);
  ctx.fillRect(0, 0, W, H);
  const course = 0.6 * PX;
  for (let i = 0; i * course < H; i++) {
    const top = H - (i + 1) * course;
    const joint = i % 2 ? W * 0.35 : W * 0.65;
    ctx.fillStyle = shade(TOWER_GRANITE, (random() - 0.5) * 0.07);
    ctx.fillRect(0, top + 1, joint - 1, course - 2);
    ctx.fillStyle = shade(TOWER_GRANITE, (random() - 0.5) * 0.07);
    ctx.fillRect(joint + 1, top + 1, W - joint - 1, course - 2);
  }
  const [e] = floodGlow(c);
  return { map: texture(c), emissiveMap: texture(e) };
}

// A crown stage face: brick with an arched opening in a stone frame and a
// faint warm light inside. Returns colour and glow maps.
export function clockTowerBelfry() {
  const W = 128;
  const H = 96;
  const random = seededRandom(17);
  const [c, ctx] = canvas(W, H);
  brickwork(ctx, W, H, random);
  const arch = (g, inset) => {
    const [x0, x1, y0, y1] = [W / 2 - 18 + inset, W / 2 + 18 - inset, 22 + inset, H - 8];
    g.beginPath();
    g.moveTo(x0, y1);
    g.lineTo(x0, y0 + (x1 - x0) / 2);
    g.arc((x0 + x1) / 2, y0 + (x1 - x0) / 2, (x1 - x0) / 2, Math.PI, 0);
    g.lineTo(x1, y1);
    g.closePath();
  };
  ctx.fillStyle = shade(TOWER_GRANITE, 0.02);
  arch(ctx, -5);
  ctx.fill();
  ctx.fillStyle = '#3a2418';
  arch(ctx, 0);
  ctx.fill();
  const [e, glow] = floodGlow(c, 'rgb(240, 190, 130)', 'rgb(220, 165, 110)');
  glow.fillStyle = 'rgba(200, 120, 50, 0.6)';
  arch(glow, 0);
  glow.fill();
  return { map: texture(c), emissiveMap: texture(e) };
}

// Light granite ashlar for the crown, one 4 m tile: 1 m × 0.5 m blocks.
export function graniteAshlar() {
  const PX = 64;
  const S = 4 * PX;
  const random = seededRandom(19);
  const [c, ctx] = canvas(S, S);
  const [b, bump] = canvas(S, S);
  ctx.fillStyle = '#8f8473';
  ctx.fillRect(0, 0, S, S);
  bump.fillStyle = '#404040';
  bump.fillRect(0, 0, S, S);
  for (let row = 0; row < 8; row++) {
    const offset = row % 2 ? PX / 2 : 0;
    for (let col = -1; col < 5; col++) {
      ctx.fillStyle = shade(0xc4b89f, (random() - 0.5) * 0.06);
      ctx.fillRect(col * PX + offset + 1, row * (PX / 2) + 1, PX - 2, PX / 2 - 2);
      bump.fillStyle = '#a0a0a0';
      bump.fillRect(col * PX + offset + 1, row * (PX / 2) + 1, PX - 2, PX / 2 - 2);
    }
  }
  return { map: texture(c), bumpMap: texture(b, { srgb: false }) };
}

// A lit clock dial: white glass, a dark rim, a minute track, Roman numerals
// and hands.
export function clockDial() {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const r = S / 2;
  const glass = ctx.createRadialGradient(r, r, 0, r, r, r);
  glass.addColorStop(0, '#fffdf6');
  glass.addColorStop(0.8, '#f4eedf');
  glass.addColorStop(1, '#ded3bb');
  ctx.fillStyle = glass;
  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1e1a17';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(r, r, r - 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  for (const radius of [r - 16, r - 26]) {
    ctx.beginPath();
    ctx.arc(r, r, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#1e1a17';
  ctx.font = 'bold 26px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const numerals = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  numerals.forEach((numeral, i) => {
    const a = (i / 12) * Math.PI * 2;
    ctx.save();
    ctx.translate(r + Math.sin(a) * (r - 46), r - Math.cos(a) * (r - 46));
    ctx.rotate(a);
    ctx.fillText(numeral, 0, 0);
    ctx.restore();
  });
  ctx.strokeStyle = '#1e1a17';
  ctx.lineCap = 'round';
  const hand = (turn, length, width) => {
    const a = turn * Math.PI * 2;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.lineTo(r + Math.sin(a) * length, r - Math.cos(a) * length);
    ctx.stroke();
  };
  hand(7.2 / 12, r * 0.5, 10); // about twelve past seven: dusk
  hand(0.2, r * 0.72, 6);
  return texture(c);
}

// ---- Star Ferry -------------------------------------------------------------

// A deck wall, eight window bays wide (2.4 m × 2.8 m each): big panes with
// rounded corners and thick frames, each bay lit a little differently.
// Returns colour and glow maps; set the repeat with `ferryDeckRepeat`.
export function ferryDeck(wall, seed) {
  const BAY = 64;
  const W = BAY * 8;
  const H = 64;
  const random = seededRandom(seed);
  const [c, ctx] = canvas(W, H);
  const [e, glow] = canvas(W, H);
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, H);
  // Deck lights and cabin spill keep the paint readable at night.
  glow.fillStyle = '#000';
  glow.fillRect(0, 0, W, H);
  glow.globalAlpha = 0.22;
  glow.fillStyle = wall;
  glow.fillRect(0, 0, W, H);
  glow.globalAlpha = 1;
  const pane = (g, x, brightness) => {
    const gradient = g.createLinearGradient(0, 10, 0, 50);
    gradient.addColorStop(0, `rgba(255, 228, 170, ${brightness})`);
    gradient.addColorStop(1, `rgba(240, 160, 80, ${brightness})`);
    g.fillStyle = gradient;
    g.beginPath();
    g.roundRect(x + 11, 11, BAY - 22, 37, 7);
    g.fill();
  };
  for (let i = 0; i < 8; i++) {
    const x = i * BAY;
    ctx.fillStyle = '#2a2420';
    ctx.beginPath();
    ctx.roundRect(x + 8, 8, BAY - 16, 43, 9);
    ctx.fill();
    const brightness = 0.7 + random() * 0.3;
    pane(ctx, x, brightness);
    pane(glow, x, brightness);
  }
  return { map: texture(c), emissiveMap: texture(e) };
}

export function ferryDeckRepeat(maps, bays) {
  const out = {};
  for (const [key, t] of Object.entries(maps)) {
    out[key] = t.clone();
    out[key].repeat.set(bays / 8, 1);
  }
  return out;
}

// Hull side, 10 m along × 2.8 m from the sheer (top) down to the keel: bright
// green paint, a pale line under the rubbing strip, a dark band at the
// waterline (1.9 m below the sheer), faint drips and plate seams.
export function ferryHull() {
  const W = 256;
  const H = 128;
  const PX = H / 2.8;
  const [c, ctx] = canvas(W, H);
  const random = seededRandom(23);
  ctx.fillStyle = '#2f7a4c';
  ctx.fillRect(0, 0, W, H);
  for (let x = 0; x < W; x += 51) {
    ctx.fillStyle = 'rgba(15, 40, 25, 0.12)';
    ctx.fillRect(x, 0, 1, H);
  }
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(15, 40, 25, ${0.08 + random() * 0.12})`;
    ctx.fillRect(random() * W, 0.5 * PX, 1 + random() * 2, 10 + random() * 40);
  }
  ctx.fillStyle = '#d9d3bf';
  ctx.fillRect(0, Math.round(0.36 * PX), W, 3);
  ctx.fillStyle = '#16231c';
  ctx.fillRect(0, Math.round(1.65 * PX), W, H);
  return texture(c);
}

// Upper deck wall, eight 2.4 m bays × 2.1 m: a white fascia, a row of
// paired rectangular windows in pale frames, and plain white below where
// the life rings hang. Panes glow warm, except the `bridge` bays: dark glass.
// Returns colour and glow maps; set the repeat with `ferryDeckRepeat`.
export function ferryUpper(seed, bridge = []) {
  const BAY = 64;
  const W = BAY * 8;
  const H = 56;
  const random = seededRandom(seed);
  const [c, ctx] = canvas(W, H);
  const [e, glow] = canvas(W, H);
  const wall = '#e9e6dc';
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, H);
  glow.fillStyle = '#000';
  glow.fillRect(0, 0, W, H);
  glow.globalAlpha = 0.5;
  glow.fillStyle = wall;
  glow.fillRect(0, 0, W, H);
  glow.globalAlpha = 1;
  for (let i = 0; i < 8; i++) {
    for (const x of [i * BAY + 4, i * BAY + 33]) {
      ctx.fillStyle = '#b9b4a8';
      ctx.fillRect(x, 6, 27, 25);
      glow.fillStyle = '#000';
      glow.fillRect(x, 6, 27, 25);
      if (!bridge.includes(i)) {
        const brightness = 0.65 + random() * 0.35;
        const hx = random() < 0.4 ? x + 5 + random() * 15 : null;
        for (const g of [ctx, glow]) {
          const gradient = g.createLinearGradient(0, 8, 0, 29);
          gradient.addColorStop(0, `rgba(255, 232, 180, ${brightness})`);
          gradient.addColorStop(1, `rgba(240, 165, 85, ${brightness})`);
          g.fillStyle = gradient;
          g.fillRect(x + 2, 8, 23, 21);
          // Seat backs and passengers against the light.
          g.fillStyle = 'rgba(40, 26, 18, 0.85)';
          g.fillRect(x + 2, 25, 23, 4);
          if (hx !== null) {
            g.beginPath();
            g.arc(hx, 22, 2.2, 0, Math.PI * 2);
            g.fill();
            g.fillRect(hx - 3, 24, 6, 2);
          }
        }
      } else {
        const gradient = ctx.createLinearGradient(0, 8, 0, 29);
        gradient.addColorStop(0, '#3e4a52');
        gradient.addColorStop(1, '#161d22');
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 2, 8, 23, 21);
        // Faint instrument lights on the console.
        const ix = x + 6 + random() * 12;
        for (const g of [ctx, glow]) {
          g.fillStyle = '#c9a060';
          g.fillRect(ix, 26, 2, 1);
        }
      }
    }
  }
  return { map: texture(c), emissiveMap: texture(e) };
}

// The lit lower deck seen between its posts, eight 2.4 m bays × 2.6 m: a
// warm cabin under strip lights, seat backs and a few passengers showing
// above the waist-high bulwark (0.95 m above the floor, about row 36).
export function ferryCabin() {
  const BAY = 64;
  const W = BAY * 8;
  const H = 64;
  const random = seededRandom(57);
  const [c, ctx] = canvas(W, H);
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, '#fff1cf');
  gradient.addColorStop(0.5, '#f0bd78');
  gradient.addColorStop(1, '#9a6a3c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fffbe8';
  ctx.fillRect(0, 2, W, 2);
  for (let i = 0; i < 8; i++) {
    const x = i * BAY;
    // Casing panels between the windows of the inner cabin.
    ctx.fillStyle = 'rgba(120, 80, 45, 0.5)';
    ctx.fillRect(x, 5, 4, 40);
    // Bench backs, about 0.55 m a seat.
    for (let s = 0; s < 4; s++) {
      const sx = x + 6 + s * 14;
      ctx.fillStyle = '#4a3020';
      ctx.beginPath();
      ctx.roundRect(sx, 31, 12, 10, 3);
      ctx.fill();
      if (random() < 0.3) {
        ctx.fillStyle = '#2a1c14';
        ctx.beginPath();
        ctx.arc(sx + 6, 27, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(sx + 2, 29, 8, 3);
      }
    }
  }
  return texture(c);
}

// White water churned along the hull at the waterline: opaque at the
// water, thinning upward, broken into streaks.
export function waterlineFoam() {
  const [c, ctx] = canvas(256, 32);
  const random = seededRandom(41);
  for (let i = 0; i < 160; i++) {
    const x = random() * 256;
    const h = 3 + random() * 14;
    const streak = ctx.createLinearGradient(0, 32 - h, 0, 32);
    streak.addColorStop(0, 'rgba(200, 215, 225, 0)');
    streak.addColorStop(1, `rgba(200, 215, 225, ${0.15 + random() * 0.3})`);
    ctx.fillStyle = streak;
    ctx.fillRect(x, 32 - h, 2 + random() * 10, h);
  }
  return texture(c, { repeat: [6, 1] });
}

// ---- Observation Wheel --------------------------------------------------------

// Soft round halo for the wheel's lit hub, white fading to clear.
export function hubGlow() {
  const S = 64;
  const [c, ctx] = canvas(S, S);
  const glow = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  glow.addColorStop(0, 'rgba(255, 250, 245, 0.9)');
  glow.addColorStop(0.3, 'rgba(255, 220, 230, 0.35)');
  glow.addColorStop(1, 'rgba(255, 120, 160, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, S, S);
  return texture(c);
}

// ---- Promenade railing ----------------------------------------------------------

const GRANITE = 0x515258;

function speckle(ctx, w, h, random, count) {
  for (let i = 0; i < count; i++) {
    const light = random() < 0.45;
    ctx.fillStyle = shade(GRANITE, light ? 0.03 + random() * 0.04 : -0.03 - random() * 0.03);
    ctx.fillRect(Math.floor(random() * w), Math.floor(random() * h), 1, 1);
  }
}

// Dark speckled granite, one 1 m tile (2 cm specks, kept low in contrast so
// they don't sparkle while the camera moves).
export function promenadeGranite() {
  const S = 64;
  const random = seededRandom(23);
  const [c, ctx] = canvas(S, S);
  ctx.fillStyle = shade(GRANITE, 0);
  ctx.fillRect(0, 0, S, S);
  speckle(ctx, S, S, random, 900);
  return texture(c);
}

// One face of a big railing post, 0.44 m × 0.67 m: granite with a recessed
// panel and three carved waves.
export function railingPanel() {
  const W = 64;
  const H = 96;
  const random = seededRandom(29);
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = shade(GRANITE, 0);
  ctx.fillRect(0, 0, W, H);
  speckle(ctx, W, H, random, 1300);
  const [x0, y0, x1, y1] = [8, 10, W - 8, H - 12];
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.moveTo(x0, y1);
  ctx.lineTo(x0, y0);
  ctx.lineTo(x1, y0);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.beginPath();
  ctx.moveTo(x1, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x0, y1);
  ctx.stroke();
  for (let k = 0; k < 3; k++) {
    const y = H * 0.4 + k * 9;
    for (const [offset, colour] of [[0, 'rgba(0, 0, 0, 0.5)'], [1.5, 'rgba(255, 255, 255, 0.12)']]) {
      ctx.strokeStyle = colour;
      ctx.beginPath();
      for (let x = x0 + 5; x <= x1 - 5; x++) {
        const wy = y + offset + Math.sin(((x - x0) / (x1 - x0)) * Math.PI * 3) * 2.5;
        if (x === x0 + 5) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }
  }
  return texture(c);
}

// Promenade paving, one 2.4 m tile: 1.2 m × 0.6 m granite slabs in running
// bond, each with its own tone, thin dark joints (about 1.5 cm) and a faint
// grain. The wet look (darkening and reflections) is added in the shader.
export function promenadePaving() {
  const S = 240;
  const SLAB = S / 3;
  const random = seededRandom(31);
  const [c, ctx] = canvas(S, S);
  const base = 0x4a4950;
  ctx.fillStyle = '#121116';
  ctx.fillRect(0, 0, S, S);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      ctx.fillStyle = shade(base, (random() - 0.5) * 0.08);
      ctx.fillRect(col * SLAB + 1, row * SLAB + 1, SLAB - 2, SLAB - 2);
    }
  }
  for (let i = 0; i < 2200; i++) {
    ctx.fillStyle = shade(base, (random() - 0.5) * 0.08);
    const x = Math.floor(random() * S);
    const y = Math.floor(random() * S);
    if (x % SLAB > 1 && x % SLAB < SLAB - 1 && y % SLAB > 1 && y % SLAB < SLAB - 1) ctx.fillRect(x, y, 1, 1);
  }
  const t = texture(c);
  t.anisotropy = 8;
  return t;
}

// ---- Palms ------------------------------------------------------------------

// The palms' shared atlas, 256 × 256, light grey so vertex colours tint it.
// u 0–0.75: one frond, base at the bottom, tip at the top: a midrib with
// leaflets slanting toward the tip, transparent between them (cut out in
// the shader). u 0.78–1: opaque bark with leaf-scar rings.
export const PALM_FROND_U = 0.74;
export const PALM_BARK_U = [0.8, 0.98];

export function palmAtlas() {
  const S = 256;
  const random = seededRandom(37);
  const [c, ctx] = canvas(S, S);
  const mid = 96;
  ctx.lineCap = 'round';
  for (let y = 226; y > 6; y -= 7 + random() * 2) {
    for (const side of [-1, 1]) {
      const reach = 88 * (0.82 + random() * 0.18);
      const tone = 200 + Math.floor(random() * 40);
      ctx.strokeStyle = `rgb(${tone}, ${tone}, ${tone})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(mid, y);
      ctx.quadraticCurveTo(mid + side * reach * 0.5, y - 10, mid + side * reach, y - 22 - random() * 6);
      ctx.stroke();
    }
  }
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(mid, S);
  ctx.lineTo(mid, 2);
  ctx.stroke();

  const x0 = Math.floor(S * 0.78);
  ctx.fillStyle = '#9a8b7d';
  ctx.fillRect(x0, 0, S - x0, S);
  for (let y = 3; y < S; y += 6 + random() * 3) {
    ctx.fillStyle = `rgba(60, 50, 42, ${0.5 + random() * 0.3})`;
    ctx.fillRect(x0, Math.floor(y), S - x0, 2);
  }
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = `rgba(${random() < 0.5 ? '40, 32, 26' : '190, 175, 160'}, 0.25)`;
    ctx.fillRect(x0 + Math.floor(random() * (S - x0)), Math.floor(random() * S), 1, 2);
  }
  const t = texture(c);
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  return t;
}

// ---- Bauhinia ---------------------------------------------------------------

// A Bauhinia blakeana leaf: broad, two-lobed with a cleft at the tip and a
// heart-shaped base, veins fanning from the stalk. Drawn with its stalk at
// (0, 0) and its tip toward −y, `size` px tall.
function bauhiniaLeaf(ctx, x, y, size, angle, tone = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(size / 230, size / 230);
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.bezierCurveTo(-58, 0, -114, -50, -110, -120);
  ctx.bezierCurveTo(-106, -190, -58, -232, -24, -220);
  ctx.bezierCurveTo(-10, -214, -4, -196, 0, -178);
  ctx.bezierCurveTo(4, -196, 10, -214, 24, -220);
  ctx.bezierCurveTo(58, -232, 106, -190, 110, -120);
  ctx.bezierCurveTo(114, -50, 58, 0, 0, -14);
  ctx.closePath();
  const fill = ctx.createLinearGradient(0, 0, 0, -230);
  fill.addColorStop(0, shade(0x2d5a2a, (tone - 1) * 0.3));
  fill.addColorStop(1, shade(0x4b7d3c, (tone - 1) * 0.3));
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.clip();
  ctx.strokeStyle = 'rgba(170, 205, 140, 0.45)';
  ctx.lineWidth = 4;
  for (const a of [-1.15, -0.75, -0.38, 0, 0.38, 0.75, 1.15]) {
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.quadraticCurveTo(Math.sin(a) * 50, -18 - Math.cos(a) * 90, Math.sin(a) * 120, -18 - Math.cos(a) * 170);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = '#3a2a1e';
  ctx.lineWidth = Math.max(2, size / 40);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - Math.sin(angle) * size * 0.04, y + Math.cos(angle) * size * 0.04);
  ctx.stroke();
}

// One open flower, centred: five wavy magenta petals with pale veins, the
// top one darker with a crimson heart, and long pale curved stamens.
function bauhiniaFlower(ctx, cx, cy, r) {
  const petals = [-Math.PI / 2, -0.25, 0.85, 2.3, 3.4];
  petals.forEach((angle, i) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle + Math.PI / 2);
    const len = r * (i === 0 ? 0.92 : 1);
    const w = len * 0.36;
    ctx.beginPath();
    ctx.moveTo(0, -len * 0.08);
    ctx.bezierCurveTo(-w * 0.5, -len * 0.3, -w * 1.1, -len * 0.62, -w * 0.8, -len * 0.9);
    for (let k = 0; k <= 6; k++) {
      const t = k / 6;
      const px = -w * 0.8 + t * w * 1.6;
      const py = -len * (0.93 + 0.06 * Math.sin(t * Math.PI)) + (k % 2 ? len * 0.025 : 0);
      ctx.lineTo(px, py);
    }
    ctx.bezierCurveTo(w * 1.1, -len * 0.62, w * 0.5, -len * 0.3, 0, -len * 0.08);
    ctx.closePath();
    const fill = ctx.createLinearGradient(0, 0, 0, -len);
    fill.addColorStop(0, i === 0 ? '#7e0f42' : '#a01866');
    fill.addColorStop(0.5, i === 0 ? '#b0185e' : '#c4237d');
    fill.addColorStop(1, '#dd4a9c');
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.clip();
    ctx.strokeStyle = 'rgba(255, 225, 240, 0.4)';
    ctx.lineWidth = 2;
    for (const s of [-0.6, -0.3, 0, 0.3, 0.6]) {
      ctx.beginPath();
      ctx.moveTo(0, -len * 0.1);
      ctx.quadraticCurveTo(s * w * 0.4, -len * 0.5, s * w * 1.1, -len * 0.9);
      ctx.stroke();
    }
    ctx.restore();
  });
  ctx.strokeStyle = '#f3dce8';
  ctx.lineWidth = 2.5;
  for (let k = 0; k < 5; k++) {
    const end = 0.35 + k * 0.16;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(cx + r * 0.25, cy + r * (0.15 + k * 0.05), cx + r * 0.75 * Math.cos(end), cy + r * 0.75 * Math.sin(end));
    ctx.stroke();
    ctx.fillStyle = '#e8c890';
    ctx.fillRect(cx + r * 0.75 * Math.cos(end) - 3, cy + r * 0.75 * Math.sin(end) - 3, 6, 6);
  }
}

// Three slim buds, magenta over a green calyx, on a twig rising from the
// bottom of the bud cell.
function bauhiniaBuds(ctx) {
  ctx.strokeStyle = '#4a3324';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(128, 504);
  ctx.quadraticCurveTo(120, 420, 128, 330);
  ctx.moveTo(124, 420);
  ctx.lineTo(96, 372);
  ctx.moveTo(126, 430);
  ctx.lineTo(160, 384);
  ctx.stroke();
  for (const [x, y, angle, len] of [[128, 300, 0, 70], [90, 350, -0.5, 60], [166, 360, 0.55, 64]]) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const bud = ctx.createLinearGradient(0, len * 0.5, 0, -len * 0.5);
    bud.addColorStop(0, '#5f7d3a');
    bud.addColorStop(0.35, '#8e2e5e');
    bud.addColorStop(1, '#b84a82');
    ctx.fillStyle = bud;
    ctx.beginPath();
    ctx.ellipse(0, 0, len * 0.22, len * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// The bauhinia's shared atlas, 512 × 512 in four 256 px cells (each drawn
// inside a margin so mipmaps don't bleed): u 0–0.5, v 0.5–1 one leaf, stalk
// at the bottom; u 0.5–1, v 0.5–1 one open flower, centred; u 0–0.5,
// v 0–0.5 three buds on a twig, base at the bottom; u 0.5–1, v 0–0.5 a
// clump of five leaves, base at the bottom.
export function bauhiniaAtlas() {
  const random = seededRandom(41);
  const [c, ctx] = canvas(512, 512);
  ctx.lineCap = 'round';
  const cell = (x, y, draw) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x + 4, y + 4, 248, 248);
    ctx.clip();
    draw();
    ctx.restore();
  };

  cell(0, 0, () => bauhiniaLeaf(ctx, 128, 244, 228, 0));
  cell(256, 0, () => bauhiniaFlower(ctx, 384, 128, 112));
  cell(0, 256, () => bauhiniaBuds(ctx));
  cell(256, 256, () => {
    for (let i = 0; i < 5; i++) {
      const angle = -0.6 + i * 0.3 + (random() - 0.5) * 0.15;
      bauhiniaLeaf(ctx, 384, 500, 95 + random() * 25, angle, 0.85 + random() * 0.3);
    }
  });

  const t = texture(c);
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  return t;
}

// ---- Junk -------------------------------------------------------------------

// Red sail cloth, normalised UVs over the whole sail. The light and the
// pockets between battens are vertex colours on the sail mesh; this only
// adds faint vertical cloth seams and mottling.
export function junkCloth() {
  const W = 128;
  const H = 128;
  const random = seededRandom(31);
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#e8432a';
  ctx.fillRect(0, 0, W, H);
  for (let x = 9; x < W; x += 16) {
    ctx.fillStyle = 'rgba(90, 10, 5, 0.12)';
    ctx.fillRect(x, 0, 1, H);
  }
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(${random() < 0.5 ? '255, 190, 150' : '60, 0, 0'}, 0.05)`;
    ctx.fillRect(random() * W, random() * H, 2 + random() * 6, 1 + random() * 3);
  }
  return texture(c);
}

// Junk hull side, 8 m per tile. V runs from 1.2 m under the waterline to the
// sheer, with the strakes bent to follow the sheer (createVessels.js): a
// salmon waterline stripe, varnished planks, a gold line and a dark rail cap.
export function junkHull() {
  const W = 256;
  const H = 128;
  const random = seededRandom(37);
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#5c361d';
  ctx.fillRect(0, 0, W, H);
  const cap = 7;
  const stripeTop = 80; // 0.35 m above the waterline
  const strakes = 8;
  const plank = (stripeTop - cap - 3) / strakes;
  for (let s = 0; s < strakes; s++) {
    const y = cap + 3 + s * plank;
    let x = -random() * 80;
    while (x < W) {
      const len = 50 + random() * 90;
      ctx.fillStyle = shade(0x6e4224, (random() - 0.5) * 0.1);
      ctx.fillRect(x, y, len - 1, plank - 1);
      x += len;
    }
  }
  for (let i = 0; i < 120; i++) {
    ctx.fillStyle = `rgba(${random() < 0.5 ? '255, 200, 140' : '20, 8, 0'}, 0.08)`;
    ctx.fillRect(random() * W, cap + 3 + random() * (stripeTop - cap - 6), 8 + random() * 30, 1);
  }
  ctx.fillStyle = '#2a170d';
  ctx.fillRect(0, 0, W, cap);
  ctx.fillStyle = '#c99a4a';
  ctx.fillRect(0, cap, W, 2);
  ctx.fillStyle = '#d98b5c';
  ctx.fillRect(0, stripeTop, W, H - stripeTop);
  ctx.fillStyle = '#3a2214';
  ctx.fillRect(0, stripeTop, W, 2);
  return texture(c);
}