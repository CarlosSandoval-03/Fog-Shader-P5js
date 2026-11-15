import type p5 from "p5";

export abstract class Entity {
  abstract update(elapsedSeconds: number): void;
  abstract draw(p: p5): void;
}
