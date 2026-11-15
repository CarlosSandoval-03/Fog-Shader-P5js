import { describe, expect, it } from "vitest";
import { add, cross, degToRad, dot, normalize, scale, subtract } from "./math";

describe("degToRad", () => {
  it("turns a half turn into pi", () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI);
  });
});

describe("vectors", () => {
  const x = { x: 1, y: 0, z: 0 };
  const y = { x: 0, y: 1, z: 0 };

  it("add, scale, and subtract per component", () => {
    expect(add({ x: 1, y: 2, z: 3 }, { x: 1, y: 1, z: 1 })).toEqual({
      x: 2,
      y: 3,
      z: 4,
    });
    expect(scale({ x: 1, y: -2, z: 3 }, 2)).toEqual({ x: 2, y: -4, z: 6 });
    expect(subtract({ x: 3, y: 2, z: 1 }, { x: 1, y: 1, z: 1 })).toEqual({
      x: 2,
      y: 1,
      z: 0,
    });
  });

  it("cross x with y into z, by the right-hand rule", () => {
    expect(cross(x, y)).toEqual({ x: 0, y: 0, z: 1 });
  });

  it("dot to zero when perpendicular", () => {
    expect(dot(x, y)).toBe(0);
  });

  it("normalize to unit length, and keep zero as zero", () => {
    const unit = normalize({ x: 3, y: 0, z: 4 });

    expect(Math.hypot(unit.x, unit.y, unit.z)).toBeCloseTo(1);
    expect(normalize({ x: 0, y: 0, z: 0 })).toEqual({ x: 0, y: 0, z: 0 });
  });
});
