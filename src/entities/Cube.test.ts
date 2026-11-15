import { describe, expect, it } from "vitest";
import { CUBES } from "../config";
import { IDENTITY, translation } from "../core/mat4";
import { cubeWorldView } from "./Cube";

describe("cubeWorldView", () => {
  it("leaves the first cube unturned at the start", () => {
    expect(cubeWorldView(IDENTITY, 0, 0)).toEqual(translation(CUBES.first));
  });

  it("moves each cube one spacing further along the row", () => {
    const position = (index: number) => cubeWorldView(IDENTITY, index, 0);

    expect(position(3)[12] - position(2)[12]).toBeCloseTo(CUBES.spacing.x);
    expect(position(3)[14] - position(2)[14]).toBeCloseTo(CUBES.spacing.z);
  });

  it("spins each cube about its own center", () => {
    const position = (seconds: number) =>
      cubeWorldView(IDENTITY, 5, seconds).slice(12, 15);

    position(2.5).forEach((value, i) =>
      expect(value).toBeCloseTo(position(0)[i]),
    );
  });

  it("turns as time passes", () => {
    expect(cubeWorldView(IDENTITY, 0, 1)).not.toEqual(
      cubeWorldView(IDENTITY, 0, 0),
    );
  });
});
