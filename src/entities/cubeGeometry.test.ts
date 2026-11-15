import { describe, expect, it } from "vitest";
import { cross, dot, subtract, type Vec3 } from "../core/math";
import { CUBE_VERTICES } from "./cubeGeometry";

const TRIANGLE_CORNERS = 3;
const position = ([x, y, z]: readonly number[]): Vec3 => ({ x, y, z });

describe("the cube", () => {
  it("has two triangles on each of its six faces", () => {
    expect(CUBE_VERTICES).toHaveLength(6 * 2 * TRIANGLE_CORNERS);
  });

  it("sits on its corners and maps each corner to a texture corner", () => {
    for (const [x, y, z, u, v] of CUBE_VERTICES) {
      for (const coordinate of [x, y, z])
        expect(Math.abs(coordinate)).toBe(0.5);
      for (const texture of [u, v]) expect([0, 1]).toContain(texture);
    }
  });

  // The winding is what tells a front face from a back one.
  it("winds every triangle to face outward", () => {
    for (let i = 0; i < CUBE_VERTICES.length; i += TRIANGLE_CORNERS) {
      const [a, b, c] = CUBE_VERTICES.slice(i, i + TRIANGLE_CORNERS).map(
        position,
      );
      const normal = cross(subtract(b, a), subtract(c, a));

      expect(dot(normal, a)).toBeGreaterThan(0);
    }
  });
});
