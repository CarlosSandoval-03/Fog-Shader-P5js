import { cross, dot, normalize, subtract, type Vec3 } from "./math";

// A 4x4 matrix in column-major order, the layout WebGL uniforms expect: element
// (row, column) is at index column * 4 + row. The literals below are written
// one column per line, so they read transposed, with the translation last.
export type Mat4 = readonly number[];

const SIZE = 4;

// prettier-ignore
export const IDENTITY: Mat4 = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
];

// The product a * b: applied to a point, b acts first, then a.
export function multiply(a: Mat4, b: Mat4): Mat4 {
  const product: number[] = [];
  for (let column = 0; column < SIZE; column++) {
    for (let row = 0; row < SIZE; row++) {
      let sum = 0;
      for (let k = 0; k < SIZE; k++) {
        sum += a[k * SIZE + row] * b[column * SIZE + k];
      }
      product.push(sum);
    }
  }
  return product;
}

export function translation(offset: Vec3): Mat4 {
  const { x, y, z } = offset;
  // prettier-ignore
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1,
  ];
}

export function xRotation(radians: number): Mat4 {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  // prettier-ignore
  return [
    1,  0, 0, 0,
    0,  c, s, 0,
    0, -s, c, 0,
    0,  0, 0, 1,
  ];
}

export function yRotation(radians: number): Mat4 {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  // prettier-ignore
  return [
    c, 0, -s, 0,
    0, 1,  0, 0,
    s, 0,  c, 0,
    0, 0,  0, 1,
  ];
}

export interface Frustum {
  readonly fieldOfViewRadians: number;
  readonly aspect: number;
  readonly near: number;
  readonly far: number;
}

// A right-handed perspective looking down -z: depths from near to far land in
// clip-space z from -1 to 1, which the depth buffer stores as 0 to 1.
export function perspective(frustum: Frustum): Mat4 {
  const { fieldOfViewRadians, aspect, near, far } = frustum;
  const f = 1 / Math.tan(fieldOfViewRadians / 2);
  const depthScale = (near + far) / (near - far);
  const depthOffset = (2 * near * far) / (near - far);
  // prettier-ignore
  return [
    f / aspect, 0, 0,           0,
    0,          f, 0,           0,
    0,          0, depthScale, -1,
    0,          0, depthOffset, 0,
  ];
}

// The camera's own transform: placed at eye, its -z axis facing target.
export function lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
  const zAxis = normalize(subtract(eye, target));
  const xAxis = normalize(cross(up, zAxis));
  // Already unit length: the cross of two perpendicular unit vectors.
  const yAxis = cross(zAxis, xAxis);
  // prettier-ignore
  return [
    xAxis.x, xAxis.y, xAxis.z, 0,
    yAxis.x, yAxis.y, yAxis.z, 0,
    zAxis.x, zAxis.y, zAxis.z, 0,
    eye.x,   eye.y,   eye.z,   1,
  ];
}

// Inverts a rotation plus a translation, which is all a camera transform is:
// the rotation's inverse is its transpose, and the translation is undone in the
// rotated frame. Matrices that scale or skew need a general inverse instead.
export function inverseRigid(m: Mat4): Mat4 {
  const xAxis = { x: m[0], y: m[1], z: m[2] };
  const yAxis = { x: m[4], y: m[5], z: m[6] };
  const zAxis = { x: m[8], y: m[9], z: m[10] };
  const position = { x: m[12], y: m[13], z: m[14] };
  const undone = {
    x: -dot(xAxis, position),
    y: -dot(yAxis, position),
    z: -dot(zAxis, position),
  };
  // prettier-ignore
  return [
    xAxis.x, yAxis.x, zAxis.x, 0,
    xAxis.y, yAxis.y, zAxis.y, 0,
    xAxis.z, yAxis.z, zAxis.z, 0,
    undone.x, undone.y, undone.z, 1,
  ];
}
