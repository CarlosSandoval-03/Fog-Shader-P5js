import type p5 from "p5";

// Relative, so the build runs under any path.
const F_TEXTURE_PATH = "assets/f-texture.png";

export interface Assets {
  readonly fTexture: p5.Image;
}

export async function loadAssets(p: p5): Promise<Assets> {
  return { fTexture: await p.loadImage(F_TEXTURE_PATH) };
}
