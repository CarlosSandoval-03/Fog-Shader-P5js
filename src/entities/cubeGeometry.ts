import type p5 from "p5";

// x, y, z, then the texture's u, v.
export type CubeVertex = readonly [number, number, number, number, number];

// A unit cube centered on the origin: two triangles per face, wound
// counterclockwise seen from outside, each face showing the whole texture.
// prettier-ignore
export const CUBE_VERTICES: readonly CubeVertex[] = [
  // back (-z)
  [-0.5, -0.5, -0.5, 0, 0],
  [-0.5,  0.5, -0.5, 0, 1],
  [ 0.5, -0.5, -0.5, 1, 0],
  [-0.5,  0.5, -0.5, 0, 1],
  [ 0.5,  0.5, -0.5, 1, 1],
  [ 0.5, -0.5, -0.5, 1, 0],
  // front (+z)
  [-0.5, -0.5,  0.5, 0, 0],
  [ 0.5, -0.5,  0.5, 1, 0],
  [-0.5,  0.5,  0.5, 0, 1],
  [-0.5,  0.5,  0.5, 0, 1],
  [ 0.5, -0.5,  0.5, 1, 0],
  [ 0.5,  0.5,  0.5, 1, 1],
  // top (+y)
  [-0.5,  0.5, -0.5, 0, 0],
  [-0.5,  0.5,  0.5, 0, 1],
  [ 0.5,  0.5, -0.5, 1, 0],
  [-0.5,  0.5,  0.5, 0, 1],
  [ 0.5,  0.5,  0.5, 1, 1],
  [ 0.5,  0.5, -0.5, 1, 0],
  // bottom (-y)
  [-0.5, -0.5, -0.5, 0, 0],
  [ 0.5, -0.5, -0.5, 1, 0],
  [-0.5, -0.5,  0.5, 0, 1],
  [-0.5, -0.5,  0.5, 0, 1],
  [ 0.5, -0.5, -0.5, 1, 0],
  [ 0.5, -0.5,  0.5, 1, 1],
  // left (-x)
  [-0.5, -0.5, -0.5, 0, 0],
  [-0.5, -0.5,  0.5, 0, 1],
  [-0.5,  0.5, -0.5, 1, 0],
  [-0.5, -0.5,  0.5, 0, 1],
  [-0.5,  0.5,  0.5, 1, 1],
  [-0.5,  0.5, -0.5, 1, 0],
  // right (+x)
  [ 0.5, -0.5, -0.5, 0, 0],
  [ 0.5,  0.5, -0.5, 1, 0],
  [ 0.5, -0.5,  0.5, 0, 1],
  [ 0.5, -0.5,  0.5, 0, 1],
  [ 0.5,  0.5, -0.5, 1, 0],
  [ 0.5,  0.5,  0.5, 1, 1],
];

// Built once, while no texture is set, so p5 keeps the u, v as given (0 to 1)
// instead of dividing them by an image's size.
export function buildCubeGeometry(p: p5): p5.Geometry {
  return p.buildGeometry(() => {
    p.beginShape(p.TRIANGLES);
    for (const vertex of CUBE_VERTICES) p.vertex(...vertex);
    p.endShape();
  });
}
