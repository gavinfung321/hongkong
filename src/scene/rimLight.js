import { Color } from 'three';

// A faint edge light on a Lambert material, strongest where its surface
// turns away from the camera, so a dark object separates from the dark
// behind it (Priority 3 balance, user choice, 2026-10-04). Patch before the
// first compile.
export function rimLight(material, colour, strength) {
  const previous = material.onBeforeCompile;
  const key = `${material.customProgramCacheKey()}|rim`;
  material.customProgramCacheKey = () => key;
  material.onBeforeCompile = (shader, renderer) => {
    previous?.(shader, renderer);
    shader.uniforms.rimColour = { value: new Color(colour).multiplyScalar(strength) };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 rimColour;')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        totalEmissiveRadiance += rimColour * pow( 1.0 - saturate( dot( normal, normalize( vViewPosition ) ) ), 3.0 );`,
      );
  };
  return material;
}
