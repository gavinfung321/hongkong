// Production-safe performance readout, loaded only when ?fps is in the URL.

// Ring buffer of the last 600 frame times: 10 s at 60 fps.
const WINDOW_FRAMES = 600;
// The measurement switches in the address, shown so each screenshot says what was off.
const switches = [...new URLSearchParams(window.location.search)]
  .filter(([key]) => ['bloom', 'dpr', 'aa', 'off'].includes(key))
  .map(([key, value]) => `${key}=${value}`)
  .join('  ');

export function createFpsOverlay(renderer) {
  const panel = document.createElement('div');
  panel.className = 'fps-overlay';
  panel.setAttribute('aria-hidden', 'true');
  const readout = document.createElement('pre');
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.textContent = 'reset';
  panel.append(readout, reset);
  document.body.append(panel);
  readout.textContent = 'measuring…\n(stepped mode renders on demand)';

  const frames = new Float32Array(WINDOW_FRAMES);
  let count = 0;
  let head = 0;
  let secondFrames = 0;
  let secondTime = 0;
  let average = 0;
  let worstAverage = Infinity;
  let elapsed = 0;

  function clear() {
    count = 0;
    head = 0;
    secondFrames = 0;
    secondTime = 0;
    average = 0;
    worstAverage = Infinity;
    elapsed = 0;
  }
  reset.addEventListener('click', clear);

  function onePercentLow() {
    if (count < 20) return 0;
    const sorted = Array.from(frames.subarray(0, count)).sort((a, b) => b - a);
    const slice = sorted.slice(0, Math.max(1, Math.floor(count * 0.01)));
    const worst = slice.reduce((sum, v) => sum + v, 0) / slice.length;
    return 1 / worst;
  }

  // dt in seconds for frames that actually rendered.
  function sample(dt, pixelRatio) {
    if (dt <= 0 || dt > 0.5) return;
    frames[head] = dt;
    head = (head + 1) % frames.length;
    count = Math.min(count + 1, frames.length);
    secondFrames += 1;
    secondTime += dt;
    elapsed += dt;
    if (secondTime < 1) return;

    average = secondFrames / secondTime;
    if (elapsed > 2) worstAverage = Math.min(worstAverage, average);
    secondFrames = 0;
    secondTime = 0;

    const { calls, triangles } = renderer.info.render;
    readout.textContent = [
      `fps ${average.toFixed(0)}  1% low ${onePercentLow().toFixed(0)}`,
      `worst 1s ${Number.isFinite(worstAverage) ? worstAverage.toFixed(0) : '–'}`,
      `dpr ${pixelRatio.toFixed(2)}  calls ${calls}  tris ${(triangles / 1000).toFixed(1)}k`,
      ...(switches ? [switches] : []),
    ].join('\n');
  }

  return { sample };
}
