import type p5 from "p5";
import { FOG_SLIDER } from "../config";

export interface LabeledSliderOptions {
  readonly parent: p5.Element;
  readonly label: string;
  readonly initial: number;
}

// A fog depth slider: its name, the range input, and the value it is set to.
export class LabeledSlider {
  readonly #input: p5.Element;

  constructor(p: p5, { parent, label, initial }: LabeledSliderOptions) {
    // A <label> around the input names it for screen readers too.
    const row = p.createElement("label").class("slider").parent(parent);
    p.createSpan(label).class("slider-name").parent(row);
    const { min, max, step } = FOG_SLIDER;
    this.#input = p.createSlider(min, max, initial, step).parent(row);
    const readout = p
      .createSpan(formatDepth(initial))
      .class("slider-value")
      .parent(row);

    this.#input.input(() => readout.html(formatDepth(this.value)));
  }

  get value(): number {
    return Number(this.#input.value());
  }
}

function formatDepth(depth: number): string {
  return depth.toFixed(FOG_SLIDER.decimals);
}
