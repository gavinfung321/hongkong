import { CanvasTexture, Color, RepeatWrapping, SRGBColorSpace } from 'three';
import { seededRandom } from './random.js';

// Original surface textures drawn in code (no image files): Clock Tower brick
// and granite, clock dials, ferry windows and hull, junk sail cloth and hull.
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

// One shaft face, 8 m × 34 m at 32 px per metre: red brick, granite bands and
// corner quoins, narrow arched windows. Returns colour, bump and glow maps.
export function clockTowerShaft() {
  const PX = 32;
  const W = 8 * PX;
  const H = 1088;
  const random = seededRandom(7);
  const [c, ctx] = canvas(W, H);
  const [b, bump] = canvas(W, H);
  const [e, glow] = canvas(W, H);
  const y = (metres) => H - metres * PX;

  const brick = 0x8a3a2a;
  ctx.fillStyle = shade(brick, -0.025);
  ctx.fillRect(0, 0, W, H);
  bump.fillStyle = '#808080';
  bump.fillRect(0, 0, W, H);
  glow.fillStyle = '#000';
  glow.fillRect(0, 0, W, H);

  // Bricks: 8 × 3 px courses, offset every other row, each with its own tone.
  // Bricks are ~2 px on screen, so mortar stays faint and flat (no bump):
  // sharp courses strobe while the camera moves.
  for (let row = 0; row * 3 < H; row++) {
    const offset = row % 2 ? 4 : 0;
    for (let col = -1; col * 8 < W; col++) {
      ctx.fillStyle = shade(brick, (random() - 0.5) * 0.06);
      ctx.fillRect(col * 8 + offset, row * 3, 7, 2);
    }
  }

  const granite = (x, top, w, h) => {
    ctx.fillStyle = shade(0xa8977e, (random() - 0.5) * 0.05);
    ctx.fillRect(x, top, w, h);
    bump.fillStyle = '#c0c0c0';
    bump.fillRect(x, top, w, h);
  };
  // A band at each storey (every 6.8 m) and a deeper base course.
  for (let m = 6.8; m < 34; m += 6.8) granite(0, y(m + 0.35), W, 0.35 * PX);
  granite(0, y(1.2), W, 1.2 * PX);
  // Quoins: alternating long and short blocks up both edges, with brick
  // courses between them so the corners don't read as solid stripes.
  for (let m = 1.2, i = 0; m < 34; m += 1.2, i++) {
    const w = (i % 2 ? 0.35 : 0.7) * PX;
    granite(0, y(m + 0.6), w, 0.6 * PX);
    granite(W - w, y(m + 0.6), w, 0.6 * PX);
  }

  // Narrow arched windows; two lit warm, the rest dark glass.
  const windows = [[6, true], [11.5, false], [17, true], [22.5, false]];
  for (const [base, lit] of windows) {
    const wx = W / 2 - 0.5 * PX;
    const ww = 1 * PX;
    const top = y(base + 2.6);
    const path = (g) => {
      g.beginPath();
      g.moveTo(wx, y(base));
      g.lineTo(wx, top + ww / 2);
      g.arc(wx + ww / 2, top + ww / 2, ww / 2, Math.PI, 0);
      g.lineTo(wx + ww, y(base));
      g.closePath();
    };
    granite(wx - 4, top - 4, ww + 8, y(base) - top + 8);
    path(ctx);
    ctx.fillStyle = lit ? '#e9a35c' : '#1a1820';
    ctx.fill();
    path(bump);
    bump.fillStyle = '#202020';
    bump.fill();
    if (lit) {
      path(glow);
      glow.fillStyle = '#c8873f';
      glow.fill();
    }
  }

  return {
    map: texture(c),
    bumpMap: texture(b, { srgb: false }),
    emissiveMap: texture(e),
  };
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

// A lit clock dial: warm glass, a dark ring, hour marks and hands.
export function clockDial() {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const r = S / 2;
  const glass = ctx.createRadialGradient(r, r, 0, r, r, r);
  glass.addColorStop(0, '#fff3d6');
  glass.addColorStop(0.75, '#ffd28c');
  glass.addColorStop(1, '#e79a4c');
  ctx.fillStyle = glass;
  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3b2a22';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(r, r, r - 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.lineWidth = i % 3 ? 5 : 9;
    ctx.beginPath();
    ctx.moveTo(r + Math.sin(a) * (r - 26), r - Math.cos(a) * (r - 26));
    ctx.lineTo(r + Math.sin(a) * (r - 48), r - Math.cos(a) * (r - 48));
    ctx.stroke();
  }
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