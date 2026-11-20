import { afterEach, describe, expect, it } from "vitest";
import { detectLanguage, initLanguage, t } from ".";
import { en } from "./en";
import { es } from "./es";

describe("detectLanguage", () => {
  it("prefers the URL, then the browser, then English", () => {
    expect(detectLanguage("?lang=es", ["en-US"])).toBe("es");
    expect(detectLanguage("", ["fr-FR", "es-CO"])).toBe("es");
    expect(detectLanguage("?lang=fr", ["de"])).toBe("en");
  });
});

describe("t", () => {
  afterEach(() => initLanguage("", []));

  it("reads the current language", () => {
    expect(t("fog.near")).toBe(en.fog.near);
    initLanguage("?lang=es", []);
    expect(t("fog.near")).toBe(es.fog.near);
  });
});

describe("the translations", () => {
  // The typecheck already demands every key; this catches an empty text.
  it("never leave a text empty", () => {
    const texts = (node: object): string[] =>
      Object.values(node).flatMap((value) =>
        typeof value === "string" ? [value] : texts(value),
      );

    for (const messages of [en, es])
      for (const text of texts(messages)) expect(text.trim()).not.toBe("");
  });
});
