import type p5 from "p5";
import { FOG_DEPTH } from "../config";
import { t } from "../i18n";
import { LabeledSlider } from "./LabeledSlider";

// The panel in the top right corner that sets where the fog starts and where
// it is total.
export class FogControls {
  readonly #panel: p5.Element;
  readonly #near: LabeledSlider;
  readonly #far: LabeledSlider;

  constructor(p: p5) {
    this.#panel = p.createDiv().class("fog-controls");
    const parent = this.#panel;
    this.#near = new LabeledSlider(p, {
      parent,
      label: t("fog.near"),
      initial: FOG_DEPTH.near,
    });
    this.#far = new LabeledSlider(p, {
      parent,
      label: t("fog.far"),
      initial: FOG_DEPTH.far,
    });
  }

  get near(): number {
    return this.#near.value;
  }

  get far(): number {
    return this.#far.value;
  }

  remove(): void {
    this.#panel.remove();
  }
}
