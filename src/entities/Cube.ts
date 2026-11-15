import type p5 from "p5";
import { CUBES, SPIN } from "../config";
import {
  type Mat4,
  multiply,
  translation,
  xRotation,
  yRotation,
} from "../core/mat4";
import { add, scale } from "../core/math";
import { Entity } from "./Entity";

// What every cube shares: one shader and one mesh.
export interface CubeLook {
  readonly shader: p5.Shader;
  readonly geometry: p5.Geometry;
}

export interface CubeOptions {
  readonly index: number;
  readonly view: Mat4;
  readonly look: CubeLook;
}

export class Cube extends Entity {
  readonly #index: number;
  readonly #view: Mat4;
  readonly #look: CubeLook;
  #worldView: Mat4;

  constructor({ index, view, look }: CubeOptions) {
    super();
    this.#index = index;
    this.#view = view;
    this.#look = look;
    this.#worldView = cubeWorldView(view, index, 0);
  }

  update(elapsedSeconds: number): void {
    this.#worldView = cubeWorldView(this.#view, this.#index, elapsedSeconds);
  }

  draw(p: p5): void {
    // p5's setUniform takes a mutable array, so it gets a copy.
    this.#look.shader.setUniform("uWorldView", [...this.#worldView]);
    p.model(this.#look.geometry);
  }
}

// The transform from the cube's own space to the camera's: placed along the
// row, then tilted about x, then turned about y, each cube a phase ahead.
export function cubeWorldView(
  view: Mat4,
  index: number,
  elapsedSeconds: number,
): Mat4 {
  const offset = add(CUBES.first, scale(CUBES.spacing, index));
  const phase = index * CUBES.phaseStep;

  const placed = multiply(view, translation(offset));
  const tilted = multiply(placed, xRotation(SPIN.x * elapsedSeconds + phase));
  return multiply(tilted, yRotation(SPIN.y * elapsedSeconds + phase));
}
