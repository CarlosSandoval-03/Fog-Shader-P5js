// aPosition and aTexCoord are the names p5 fills from a p5.Geometry.
attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uWorldView;
uniform mat4 uProjection;

varying vec2 vTexCoord;

void main() {
  gl_Position = uProjection * uWorldView * vec4(aPosition, 1.0);
  vTexCoord = aTexCoord;
}
