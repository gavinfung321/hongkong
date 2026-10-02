import { Color } from 'three';
import { PALETTE } from './palette.js';
import { WORLD } from '../data/world.js';

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
};

// streetLight( albedo, world y ): the street's warm light on a wall.
// skyInGlass( view normal, view direction, world y ): the sky it mirrors.
export const cityLightGlsl = `
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
