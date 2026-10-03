// Light breathing (atmospheric depth Stage 3, user request, 2026-10-04): warm
// practical lights drift a few percent in brightness during holds, so a
// settled frame stays alive without anything blinking. Each source blends two
// slow sines on its own long period and phase (the second 1.618 times the
// first, so the sum never visibly repeats and no two sources pulse together).
// Held at exactly their base brightness in reduced motion and with
// ?off=light-motion. The IFC, office windows, LEDs, moon and text stay steady.

const TAU = Math.PI * 2;

// Shared with shaders: uTime in seconds, uDepth 1 while breathing, 0 when held.
export const breath = { uTime: { value: 0 }, uDepth: { value: 1 } };

// GLSL: `breathe( period, phase, amount )` around 1, matching the CPU version.
export const breatheGlsl = /* glsl */ `
  uniform float uBreathTime;
  uniform float uBreathDepth;
  float breathe( float period, float phase, float amount ) {
    float a = sin( ( uBreathTime / period + phase ) * ${TAU.toFixed(6)} );
    float b = sin( ( uBreathTime / ( period * 1.618 ) + phase * 2.3 ) * ${TAU.toFixed(6)} );
    return 1.0 + amount * uBreathDepth * ( 0.65 * a + 0.35 * b );
  }`;

export function breathe(period, phase, amount) {
  const t = breath.uTime.value;
  const a = Math.sin((t / period + phase) * TAU);
  const b = Math.sin((t / (period * 1.618) + phase * 2.3) * TAU);
  return 1 + amount * breath.uDepth.value * (0.65 * a + 0.35 * b);
}

const lights = [];

// A real light that breathes around its current intensity. Skipped while it
// is at 0, so a faded-out subject's light (gating.js) stays off.
export function breatheLight(light, { period, phase, amount = 0.03 }) {
  lights.push({ light, base: light.intensity, period, phase, amount });
}

function applyLights() {
  for (const { light, base, period, phase, amount } of lights) {
    if (light.intensity > 0) light.intensity = base * breathe(period, phase, amount);
  }
}

export function updateBreathing(time) {
  breath.uTime.value = time;
  applyLights();
}

export function setBreathing(enabled) {
  breath.uDepth.value = enabled ? 1 : 0;
  applyLights();
}
