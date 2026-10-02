import {
  AdditiveBlending,
  FramebufferTexture,
  HalfFloatType,
  LinearFilter,
  Mesh,
  NoBlending,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
} from 'three';

// A soft glow round the brightest lights (user choice, 2026-10-02: realism
// step 5). The scene renders to the screen as before; that frame is copied,
// its brightest parts are halved down a chain of smaller images and added
// back up on the way out (a wide, soft blur for little cost), and only the
// glow is added onto the screen, in linear light. The first halving
// averages the brightest pixels down, so lone sub-pixel lights can't sparkle
// in it. Weaker and tighter on phones. Objects on the OVERLAY layer (the 香港
// wordmark, the near petals) are drawn afterwards, so they stay crisp.
export const OVERLAY = 1;
export const BLOOM = {
  threshold: 0.72, // brightness (linear, 0–1) where the glow starts
  knee: 0.2, // soft start below the threshold
  desktop: { strength: 0.6, levels: 5 },
  mobile: { strength: 0.35, levels: 4 },
};
const MAX_LEVELS = 6;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4( position.xy, 0.0, 1.0 );
  }`;

// The copied frame holds screen (sRGB) values.
const srgb = `
  vec3 toLinear( vec3 c ) {
    return mix( c / 12.92, pow( ( c + 0.055 ) / 1.055, vec3( 2.4 ) ), step( 0.04045, c ) );
  }
  vec3 toScreen( vec3 c ) {
    return mix( c * 12.92, 1.055 * pow( c, vec3( 1.0 / 2.4 ) ) - 0.055, step( 0.0031308, c ) );
  }`;

// 13 taps in five overlapping 2 × 2 boxes (the centre box counts half).
const downShader = `
  uniform sampler2D tSource;
  uniform vec2 uTexel;
  uniform float uFirst;
  uniform vec2 uThreshold;
  varying vec2 vUv;
  ${srgb}
  vec3 tap( float x, float y ) {
    vec3 c = texture2D( tSource, vUv + vec2( x, y ) * uTexel ).rgb;
    return uFirst > 0.5 ? toLinear( c ) : c;
  }
  float karis( vec3 c ) { return 1.0 / ( 1.0 + dot( c, vec3( 0.2126, 0.7152, 0.0722 ) ) ); }
  void main() {
    vec3 a = tap( -2.0, 2.0 ), b = tap( 0.0, 2.0 ), c = tap( 2.0, 2.0 );
    vec3 d = tap( -2.0, 0.0 ), e = tap( 0.0, 0.0 ), f = tap( 2.0, 0.0 );
    vec3 g = tap( -2.0, -2.0 ), h = tap( 0.0, -2.0 ), i = tap( 2.0, -2.0 );
    vec3 j = tap( -1.0, 1.0 ), k = tap( 1.0, 1.0 ), l = tap( -1.0, -1.0 ), m = tap( 1.0, -1.0 );
    vec3 b0 = ( j + k + l + m ) * 0.25;
    vec3 b1 = ( a + b + d + e ) * 0.25;
    vec3 b2 = ( b + c + e + f ) * 0.25;
    vec3 b3 = ( d + e + g + h ) * 0.25;
    vec3 b4 = ( e + f + h + i ) * 0.25;
    vec3 color;
    if ( uFirst > 0.5 ) {
      // Boxes weighted down by their brightness, then the soft threshold.
      vec4 w = vec4( karis( b1 ), karis( b2 ), karis( b3 ), karis( b4 ) ) * 0.125;
      float w0 = karis( b0 ) * 0.5;
      color = ( b0 * w0 + b1 * w.x + b2 * w.y + b3 * w.z + b4 * w.w ) / ( w0 + w.x + w.y + w.z + w.w );
      float bright = max( color.r, max( color.g, color.b ) );
      float soft = clamp( bright - uThreshold.x + uThreshold.y, 0.0, 2.0 * uThreshold.y );
      soft = soft * soft / ( 4.0 * uThreshold.y + 1e-4 );
      color *= max( soft, bright - uThreshold.x ) / max( bright, 1e-4 );
    } else {
      color = b0 * 0.5 + ( b1 + b2 + b3 + b4 ) * 0.125;
    }
    gl_FragColor = vec4( color, 1.0 );
  }`;

// 3 × 3 tent, added onto the next larger image.
const upShader = `
  uniform sampler2D tSource;
  uniform vec2 uTexel;
  varying vec2 vUv;
  vec3 tap( float x, float y ) { return texture2D( tSource, vUv + vec2( x, y ) * uTexel ).rgb; }
  void main() {
    vec3 sum = tap( -1.0, -1.0 ) + tap( 1.0, -1.0 ) + tap( -1.0, 1.0 ) + tap( 1.0, 1.0 );
    sum += 2.0 * ( tap( 0.0, -1.0 ) + tap( -1.0, 0.0 ) + tap( 1.0, 0.0 ) + tap( 0.0, 1.0 ) );
    sum += 4.0 * tap( 0.0, 0.0 );
    gl_FragColor = vec4( sum / 16.0, 1.0 );
  }`;

// Added onto the screen: the difference the glow makes once summed in linear
// light, so the frame itself is untouched (and a failed copy adds nothing).
const compositeShader = `
  uniform sampler2D tFrame;
  uniform sampler2D tBloom;
  uniform float uStrength;
  varying vec2 vUv;
  ${srgb}
  void main() {
    vec3 frame = texture2D( tFrame, vUv ).rgb;
    vec3 glow = texture2D( tBloom, vUv ).rgb * uStrength;
    gl_FragColor = vec4( toScreen( min( toLinear( frame ) + glow, 1.0 ) ) - frame, 1.0 );
  }`;

export function createBloom(renderer) {
  const { extensions } = renderer;
  // Phones without float targets go without the glow.
  const supported = extensions.has('EXT_color_buffer_float') || extensions.has('EXT_color_buffer_half_float');
  const pass = (fragmentShader, uniforms, blending = NoBlending) =>
    new ShaderMaterial({ vertexShader, fragmentShader, uniforms, blending, depthTest: false, depthWrite: false });

  const down = pass(downShader, {
    tSource: { value: null },
    uTexel: { value: new Vector2() },
    uFirst: { value: 0 },
    uThreshold: { value: new Vector2(BLOOM.threshold, BLOOM.knee) },
  });
  const up = pass(upShader, { tSource: { value: null }, uTexel: { value: new Vector2() } }, AdditiveBlending);
  const composite = pass(
    compositeShader,
    { tFrame: { value: null }, tBloom: { value: null }, uStrength: { value: 0 } },
    AdditiveBlending,
  );

  const quad = new Mesh(new PlaneGeometry(2, 2), down);
  quad.frustumCulled = false;
  const quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  let frame = null;
  const size = new Vector2();
  const mips = Array.from(
    { length: MAX_LEVELS },
    () => new WebGLRenderTarget(1, 1, { type: HalfFloatType, depthBuffer: false }),
  );
  let levels = BLOOM.desktop.levels;

  function draw(material, output) {
    quad.material = material;
    renderer.setRenderTarget(output);
    renderer.render(quad, quadCamera);
  }

  return {
    get active() {
      return supported && frame !== null && composite.uniforms.uStrength.value > 0;
    },
    setSize(width, height) {
      if (size.x === width && size.y === height) return;
      size.set(width, height);
      frame?.dispose();
      frame = new FramebufferTexture(width, height);
      frame.minFilter = frame.magFilter = LinearFilter;
      mips.forEach((mip, i) => mip.setSize(Math.max(1, width >> (i + 1)), Math.max(1, height >> (i + 1))));
    },
    setLook({ strength, levels: count }) {
      composite.uniforms.uStrength.value = strength;
      levels = Math.min(MAX_LEVELS, count);
    },
    // Adds the glow to the frame just drawn on screen.
    render() {
      renderer.setRenderTarget(null);
      renderer.copyFramebufferToTexture(frame);
      for (let i = 0; i < levels; i++) {
        const source = i === 0 ? null : mips[i - 1];
        down.uniforms.tSource.value = source ? source.texture : frame;
        down.uniforms.uTexel.value.set(1 / (source ? source.width : size.x), 1 / (source ? source.height : size.y));
        down.uniforms.uFirst.value = i === 0 ? 1 : 0;
        draw(down, mips[i]);
      }
      const autoClear = renderer.autoClear;
      renderer.autoClear = false;
      for (let i = levels - 1; i > 0; i--) {
        up.uniforms.tSource.value = mips[i].texture;
        up.uniforms.uTexel.value.set(1 / mips[i].width, 1 / mips[i].height);
        draw(up, mips[i - 1]);
      }
      composite.uniforms.tFrame.value = frame;
      composite.uniforms.tBloom.value = mips[0].texture;
      draw(composite, null);
      renderer.autoClear = autoClear;
    },
  };
}
