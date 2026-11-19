import type p5 from "p5";
import type { Assets } from "../assets";
import { CAMERA, CUBES, FOG_COLOR, FOG_DEPTH } from "../config";
import { inverseRigid, lookAt, type Mat4, perspective } from "../core/mat4";
import { degToRad } from "../core/math";
import type { Scene } from "../core/Scene";
import { Cube } from "../entities/Cube";
import { buildCubeGeometry } from "../entities/cubeGeometry";
import fogFragment from "../shaders/fog.frag?raw";
import fogVertex from "../shaders/fog.vert?raw";

export class FogScene implements Scene {
  readonly #shader: p5.Shader;
  readonly #texture: p5.Image;
  readonly #cubes: readonly Cube[];
  #projection: Mat4;

  constructor(p: p5, assets: Assets) {
    this.#shader = p.createShader(fogVertex, fogFragment);
    this.#texture = assets.fTexture;
    this.#cubes = createCubes(this.#shader, buildCubeGeometry(p));
    this.#projection = projectionFor(p.width, p.height);
  }

  enter(): void {}

  update(elapsedSeconds: number): void {
    for (const cube of this.#cubes) cube.update(elapsedSeconds);
  }

  resize(width: number, height: number): void {
    this.#projection = projectionFor(width, height);
  }

  // Clears to the fog color, binds the fog shader with what every cube
  // shares, then draws each cube with its own transform.
  draw(p: p5): void {
    const { red, green, blue, alpha } = FOG_COLOR;
    p.clear(red, green, blue, alpha);

    // p5 would outline each triangle with its own line shader.
    p.noStroke();
    p.shader(this.#shader);
    this.#setSharedUniforms();

    for (const cube of this.#cubes) cube.draw(p);
  }

  exit(): void {}

  #setSharedUniforms(): void {
    const { red, green, blue, alpha } = FOG_COLOR;
    this.#shader.setUniform("uProjection", [...this.#projection]);
    this.#shader.setUniform("uTexture", this.#texture);
    this.#shader.setUniform("uFogColor", [red, green, blue, alpha]);
    this.#shader.setUniform("uFogNear", FOG_DEPTH.near);
    this.#shader.setUniform("uFogFar", FOG_DEPTH.far);
  }
}

function createCubes(shader: p5.Shader, geometry: p5.Geometry): Cube[] {
  const camera = lookAt(CAMERA.position, CAMERA.target, CAMERA.up);
  const view = inverseRigid(camera);
  const look = { shader, geometry };
  return Array.from(
    { length: CUBES.count },
    (_, index) => new Cube({ index, view, look }),
  );
}

function projectionFor(width: number, height: number): Mat4 {
  return perspective({
    fieldOfViewRadians: degToRad(CAMERA.fieldOfViewDegrees),
    aspect: width / height,
    near: CAMERA.near,
    far: CAMERA.far,
  });
}
