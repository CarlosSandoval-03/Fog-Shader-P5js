import "./style.css";
import p5 from "p5";
import { loadAssets } from "./assets";
import { initLanguage } from "./i18n";
import { FogScene } from "./scenes/FogScene";

const MS_PER_SECOND = 1000;

// The checks cost time every frame, and minified names trip false warnings.
p5.disableFriendlyErrors = import.meta.env.PROD;

document.documentElement.lang = initLanguage(
  location.search,
  navigator.languages,
);

const frame = document.getElementById("scene");
if (!frame) throw new Error("#scene is missing from the DOM");

const sketch = (p: p5) => {
  let scene: FogScene | undefined;

  p.setup = async () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    scene = new FogScene(p, await loadAssets(p));
    scene.enter(p);
  };

  p.draw = () => {
    if (!scene) return;
    scene.update(p.millis() / MS_PER_SECOND);
    scene.draw(p);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    scene?.resize(p.width, p.height);
  };
};

new p5(sketch, frame);
