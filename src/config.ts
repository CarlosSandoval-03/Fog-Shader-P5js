import type { Vec3 } from "./core/math";

// RGBA from 0 to 1, as the shader reads it. The background is cleared to the
// same color, so a cube deep in the fog melts into the sky.
export const FOG_COLOR = { red: 0.8, green: 0.9, blue: 1, alpha: 1 } as const;

// Where the fog starts and where it is total, as depth-buffer values: 0 at the
// camera's near plane, 1 at its far plane.
export const FOG_DEPTH = { near: 0.7, far: 0.9 } as const;

// The sliders that tune FOG_DEPTH span the whole depth buffer.
export const FOG_SLIDER = { min: 0, max: 1, step: 0.001, decimals: 3 } as const;

export const CAMERA = {
  position: { x: 0, y: 0, z: 2 },
  target: { x: 0, y: 0, z: 0 },
  up: { x: 0, y: 1, z: 0 },
  fieldOfViewDegrees: 60,
  near: 1,
  far: 40,
} as const satisfies Record<string, Vec3 | number>;

// A row of unit cubes running to the right and away from the camera.
export const CUBES = {
  count: 41,
  first: { x: -2, y: 0, z: 0 },
  spacing: { x: 1.1, y: 0, z: -1.4 },
  // Each cube's spin runs this many radians ahead of the one before it.
  phaseStep: 0.1,
} as const;

// Radians per second about each axis.
export const SPIN = { x: -0.4, y: -0.7 } as const;
