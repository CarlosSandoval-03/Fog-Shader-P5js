import type p5 from "p5";
import type { Assets } from "../assets";
import { CAMERA, CUBES, FOG_COLOR, FOG_DEPTH } from "../config";
import { inverseRigid, lookAt, type Mat4, perspective } from "../core/mat4";
import { degToRad } from "../core/math";
import type { Scene } from "../core/Scene";
import { Cube } from "../entities/Cube";
import { buildCubeGeometry } from "../entities/cubeGeometry";
import { FogControls } from "../ui/FogControls";
import fogFragment from "../shaders/fog.frag?raw";
import fogVertex from "../shaders/fog.vert?raw";

// A row of textured cubes fading into the fog by their depth, with sliders for
// the fog's depths. The camera and the projection are this scene's own
// matrices, not p5's, so the shader sees exactly the space and depth range the
// fog is tuned for.
export class FogScene implements Scene {
  readonly #shader: p5.Shader;
  readonly #texture: p5.Image;
  readonly #cubes: readonly Cube[];
  #projection: Mat4;
  // Only between enter() and exit(); without them the fog keeps its defaults.
  #controls: FogControls | undefined;

  constructor(p: p5, assets: Assets) {
    this.#shader = p.createShader(fogVertex, fogFragment);
    this.#texture = assets.fTexture;
    this.#cubes = createCubes(this.#shader, buildCubeGeometry(p));
    this.#projection = projectionFor(p.width, p.height);
  }

  enter(p: p5): void {
    this.#controls = new FogControls(p);
  }

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

  exit(): void {
    this.#controls?.remove();
    this.#controls = undefined;
  }

  #setSharedUniforms(): void {
    const { red, green, blue, alpha } = FOG_COLOR;
    this.#shader.setUniform("uProjection", [...this.#projection]);
    this.#shader.setUniform("uTexture", this.#texture);
    this.#shader.setUniform("uFogColor", [red, green, blue, alpha]);
    this.#shader.setUniform("uFogNear", this.#controls?.near ?? FOG_DEPTH.near);
    this.#shader.setUniform("uFogFar", this.#controls?.far ?? FOG_DEPTH.far);
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
