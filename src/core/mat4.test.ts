import { describe, expect, it } from "vitest";
import {
  IDENTITY,
  inverseRigid,
  lookAt,
  type Mat4,
  multiply,
  perspective,
  translation,
  xRotation,
  yRotation,
} from "./mat4";
import type { Vec3 } from "./math";

// The point m sends p to, after the perspective divide.
function project(m: Mat4, p: Vec3): Vec3 {
  const w = m[3] * p.x + m[7] * p.y + m[11] * p.z + m[15];
  return {
    x: (m[0] * p.x + m[4] * p.y + m[8] * p.z + m[12]) / w,
    y: (m[1] * p.x + m[5] * p.y + m[9] * p.z + m[13]) / w,
    z: (m[2] * p.x + m[6] * p.y + m[10] * p.z + m[14]) / w,
  };
}

function expectMatrixCloseTo(actual: Mat4, expected: Mat4): void {
  expect(actual).toHaveLength(16);
  actual.forEach((value, i) => expect(value).toBeCloseTo(expected[i]));
}

function expectPointCloseTo(actual: Vec3, expected: Vec3): void {
  expect(actual.x).toBeCloseTo(expected.x);
  expect(actual.y).toBeCloseTo(expected.y);
  expect(actual.z).toBeCloseTo(expected.z);
}

describe("multiply", () => {
  it("leaves a matrix unchanged by the identity", () => {
    const m = translation({ x: 1, y: 2, z: 3 });

    expect(multiply(m, IDENTITY)).toEqual(m);
    expect(multiply(IDENTITY, m)).toEqual(m);
  });

  it("applies the right matrix first", () => {
    const turnThenMove = multiply(
      translation({ x: 5, y: 0, z: 0 }),
      yRotation(Math.PI / 2),
    );

    // A quarter turn about y takes +x to -z, then the move adds 5 to x.
    expectPointCloseTo(project(turnThenMove, { x: 1, y: 0, z: 0 }), {
      x: 5,
      y: 0,
      z: -1,
    });
  });
});

describe("rotations", () => {
  it("turn y toward z about x", () => {
    expectPointCloseTo(project(xRotation(Math.PI / 2), { x: 0, y: 1, z: 0 }), {
      x: 0,
      y: 0,
      z: 1,
    });
  });
});

describe("perspective", () => {
  const frustum = {
    fieldOfViewRadians: Math.PI / 3,
    aspect: 2,
    near: 1,
    far: 40,
  };
  const matrix = perspective(frustum);

  it("maps the near and far planes to clip z -1 and 1", () => {
    expect(project(matrix, { x: 0, y: 0, z: -1 }).z).toBeCloseTo(-1);
    expect(project(matrix, { x: 0, y: 0, z: -40 }).z).toBeCloseTo(1);
  });

  it("puts the top of the field of view at the top of the screen", () => {
    const depth = 10;
    const top = depth * Math.tan(frustum.fieldOfViewRadians / 2);

    expect(project(matrix, { x: 0, y: top, z: -depth }).y).toBeCloseTo(1);
  });
});

describe("lookAt and inverseRigid", () => {
  const eye = { x: 0, y: 0, z: 2 };
  const camera = lookAt(eye, { x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 });

  it("places a camera on the +z axis without turning it", () => {
    expectMatrixCloseTo(camera, translation(eye));
  });

  it("undo the camera transform", () => {
    const tilted = multiply(translation(eye), xRotation(0.3));

    expectMatrixCloseTo(multiply(tilted, inverseRigid(tilted)), IDENTITY);
  });
});
