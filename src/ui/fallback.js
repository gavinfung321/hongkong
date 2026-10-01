const root = document.documentElement;

export function supportsWebGL2() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false });
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

// Switches permanently to the poster + document-flow story. Never shows an error.
export function enterFallback(reason) {
  root.classList.remove('is-enhanced', 'is-ready');
  root.classList.add('is-fallback');
  root.dataset.fallback = reason;
  const canvas = document.getElementById('world');
  if (canvas) canvas.hidden = true;
  window.dispatchEvent(new Event('harbourfallback'));
  if (import.meta.env.DEV) console.info(`[harbour] fallback: ${reason}`);
}

// Context loss falls back unless the browser restores the context within 2 s.
export function watchContext(canvas, { onLost, onRestored, onFailed }) {
  let timer = 0;
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    onLost();
    timer = window.setTimeout(onFailed, 2000);
  });
  canvas.addEventListener('webglcontextrestored', () => {
    window.clearTimeout(timer);
    onRestored();
  });
}
