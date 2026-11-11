import "./style.css";
import p5 from "p5";

// The checks cost time every frame, and minified names trip false warnings.
p5.disableFriendlyErrors = import.meta.env.PROD;

const frame = document.getElementById("scene");
if (!frame) throw new Error("#scene is missing from the DOM");

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch, frame);
