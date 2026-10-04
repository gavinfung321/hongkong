import { CanvasTexture, Color, LinearFilter, Matrix4 } from 'three';
import { PALETTE } from './palette.js';
import { WORLD } from '../data/world.js';

// 05's touch light (user choice, 2026-10-04): a small map of the screen
// that the pointer paints and that fades (cityTouch.js). A few windows and
// curtain-wall rooms switch on where it is bright. It is looked up by world
// position through the main camera (uTouchMatrix), so the water's
// reflections light the same offices.
const TOUCH_SIZE = 128;
// Kept subtle (user request, 2026-10-04: "way too much"): at most `share`
// of the dark offices or rooms under the pointer switch on, at `level` of
// a lit office's brightness.
export const TOUCH_OFFICES = { share: 0.25, level: 0.5 };
const touchCanvas = document.createElement('canvas');
touchCanvas.width = TOUCH_SIZE;
touchCanvas.height = TOUCH_SIZE;
const touchTexture = new CanvasTexture(touchCanvas);
touchTexture.minFilter = LinearFilter;
touchTexture.generateMipmaps = false;
export const cityTouchMap = { canvas: touchCanvas, texture: touchTexture };

// Light the city throws on its own towers (user choice, 2026-10-02, the
// lighting pass): warm street light washing up the lowest floors, fading
// over a few storeys; and the dusk sky caught in the glass of the painted
// towers, strongest where a wall is seen edge-on (so each face and Bank of
// China facet catches it differently) and toward the tops, which see more
// sky. Lit offices keep their own colour.
const STREET = { color: 0xffa65e, power: 0.5, height: 16 };
const SKY = { low: PALETTE.skyHorizon, high: 0x343f68, gain: 1.6, floor: 0.1 };

export const cityLight = {
  uStreetColor: { value: new Color(STREET.color).multiplyScalar(STREET.power) },
  uStreetBase: { value: WORLD.island.slab[4] },
  uStreetHeight: { value: STREET.height },
  uSkyLow: { value: new Color(SKY.low) },
  uSkyHigh: { value: new Color(SKY.high) },
  uSkyGain: { value: SKY.gain },
  uSkyFloor: { value: SKY.floor },
  uTouchMap: { value: touchTexture },
  uTouchMatrix: { value: new Matrix4() },
  uTouchLevel: { value: 0 },
};

// streetLight( albedo, world y ): the street's warm light on a wall.
// skyInGlass( view normal, view direction, world y ): the sky it mirrors.
// cityTouch( world position ): the touch light there, 0–1.
export const cityLightGlsl = `
uniform sampler2D uTouchMap;
uniform mat4 uTouchMatrix;
uniform float uTouchLevel;
float cityTouch( vec3 world ) {
  if ( uTouchLevel <= 0.0 ) return 0.0;
  vec4 c = uTouchMatrix * vec4( world, 1.0 );
  if ( c.w <= 0.0 ) return 0.0;
  vec2 uv = c.xy / c.w * 0.5 + 0.5;
  if ( uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0 ) return 0.0;
  return texture2D( uTouchMap, uv ).r * uTouchLevel;
}
uniform vec3 uStreetColor;
uniform float uStreetBase;
uniform float uStreetHeight;
uniform vec3 uSkyLow;
uniform vec3 uSkyHigh;
uniform float uSkyGain;
uniform float uSkyFloor;
vec3 streetLight( vec3 albedo, float y ) {
  return albedo * uStreetColor * exp( -max( y - uStreetBase, 0.0 ) / uStreetHeight );
}
vec3 skyInGlass( vec3 n, vec3 v, float y ) {
  float c = clamp( dot( n, v ), 0.0, 1.0 );
  float fresnel = uSkyFloor + ( 1.0 - uSkyFloor ) * pow( 1.0 - c, 3.0 );
  vec3 r = inverseTransformDirection( reflect( -v, n ), viewMatrix );
  vec3 sky = r.y < 0.0 ? uSkyLow * 0.2 : mix( uSkyLow, uSkyHigh, smoothstep( 0.0, 0.6, r.y ) );
  float height = mix( 0.4, 1.0, smoothstep( 10.0, 250.0, y ) );
  return sky * fresnel * height * uSkyGain;
}`;
