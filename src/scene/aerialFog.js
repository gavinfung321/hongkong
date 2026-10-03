import { Color, ShaderChunk } from 'three';
import { PALETTE } from './palette.js';

// Aerial perspective (atmospheric depth Priority A, user choice, 2026-10-04).
// Fog takes the sky dome's colour in the direction of each pixel instead of
// one dark colour, so far towers and ridges pale into the plum glow behind
// them rather than going dark. Below the horizon (the water) it stays the
// old fog colour. The gradient matches createSky in createScene.js: horizon
// to `fog` over the lowest `glow` of the dome, then on to `skyTop`.
// On top of the chapter fog, `DEPTH` fades everything behind Central's
// front row into that colour (user request, 2026-10-04: the skyline should
// recede in planes): nothing nearer than `from` metres north (world −z, so
// IFC stays crisp), rising to `amount` at `to` along a `curve`, and a
// `topKeep` share less on tower tops between `top` heights.
// Must run before any material compiles. `?off=aerial` skips it.
const DEPTH = { from: 1220, to: 1920, amount: 0.55, curve: 0.8, top: [40, 300], topKeep: 0.35 };

export function useAerialFog({ glow }) {
  const v = (hex) => {
    const c = new Color(hex);
    return `vec3( ${c.r.toFixed(4)}, ${c.g.toFixed(4)}, ${c.b.toFixed(4)} )`;
  };
  const f = (n) => n.toFixed(3);
  ShaderChunk.fog_pars_vertex = ShaderChunk.fog_pars_vertex.replace(
    'varying float vFogDepth;',
    'varying float vFogDepth;\n\tvarying vec3 vFogView;',
  );
  ShaderChunk.fog_vertex = ShaderChunk.fog_vertex.replace(
    'vFogDepth = - mvPosition.z;',
    'vFogDepth = - mvPosition.z;\n\tvFogView = mvPosition.xyz;',
  );
  ShaderChunk.fog_pars_fragment = ShaderChunk.fog_pars_fragment.replace(
    'varying float vFogDepth;',
    `varying float vFogDepth;
	varying vec3 vFogView;
	vec3 aerialSky( float t ) {
		vec3 horizon = mix( ${v(PALETTE.fog)}, ${v(PALETTE.skyHorizon)}, smoothstep( -0.02, 0.0, t ) );
		vec3 sky = mix( horizon, ${v(PALETTE.fog)}, clamp( t / ${f(glow)}, 0.0, 1.0 ) );
		return mix( sky, ${v(PALETTE.skyTop)}, clamp( ( t - ${f(glow)} ) / 0.5, 0.0, 1.0 ) );
	}
	float aerialDepth( vec3 world ) {
		float far = pow( clamp( ( - world.z - ${f(DEPTH.from)} ) / ${f(DEPTH.to - DEPTH.from)}, 0.0, 1.0 ), ${f(DEPTH.curve)} );
		return ${f(DEPTH.amount)} * far * ( 1.0 - ${f(DEPTH.topKeep)} * smoothstep( ${f(DEPTH.top[0])}, ${f(DEPTH.top[1])}, world.y ) );
	}`,
  );
  ShaderChunk.fog_fragment = ShaderChunk.fog_fragment.replace(
    'gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );',
    `vec3 aerialRay = transpose( mat3( viewMatrix ) ) * vFogView;
	fogFactor = 1.0 - ( 1.0 - fogFactor ) * ( 1.0 - aerialDepth( cameraPosition + aerialRay ) );
	gl_FragColor.rgb = mix( gl_FragColor.rgb, aerialSky( normalize( aerialRay ).y ), fogFactor );`,
  );
}
