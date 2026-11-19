import type p5 from "p5";

export interface Scene {
  enter(p: p5): void;
  // Poses depend only on the time since the start, so a frame never drifts.
  update(elapsedSeconds: number): void;
  draw(p: p5): void;
  exit(): void;
}
