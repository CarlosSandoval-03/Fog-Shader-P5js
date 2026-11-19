precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform vec4 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

void main() {
  vec4 color = texture2D(uTexture, vTexCoord);

  // gl_FragCoord.z is this pixel's value in the depth buffer: 0 at the near
  // plane, 1 at the far plane. Under a perspective it is not linear in the
  // distance, so most of its range is spent close to the camera.
  float fogAmount = smoothstep(uFogNear, uFogFar, gl_FragCoord.z);

  gl_FragColor = mix(color, uFogColor, fogAmount);
}
