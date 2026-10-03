import { Color, MeshBasicMaterial, MeshLambertMaterial } from 'three';

export const PALETTE = {
  // Near-black navy (was 0x141833; atmospheric depth Priority E, user
  // choice, 2026-10-04).
  skyTop: 0x0a0d1e,
  skyHorizon: 0x3a2342,
  fog: 0x1e1b36,
  proxyDark: 0x2a2d3a,
  proxyMid: 0x5b6070,
  proxyLight: 0x9ca1ae,
  warm: 0xf2b36b,
  sail: 0xe4573d,
  cream: 0xf3e9d2,
  rim: 0x6fd3e0,
  water: 0x15142b,
  wheel: 0xc2456a,
};

const cache = new Map();

export function lambert(color) {
  const key = `l${color}`;
  if (!cache.has(key)) cache.set(key, new MeshLambertMaterial({ color }));
  return cache.get(key);
}

export function basic(color, options = {}) {
  const key = `b${color}${JSON.stringify(options)}`;
  if (!cache.has(key)) cache.set(key, new MeshBasicMaterial({ color, ...options }));
  return cache.get(key);
}

export function toColor(hex) {
  return new Color(hex);
}
