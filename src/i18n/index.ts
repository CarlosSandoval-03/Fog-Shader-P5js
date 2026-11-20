import { en } from "./en";
import { es } from "./es";

// The shape of en.ts with every text widened to string, for the other languages to fill.
type Shape<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : Shape<T[K]>;
};
export type Messages = Shape<typeof en>;

// Every dotted path to a single text, so a misspelled key fails the typecheck.
type TextPath<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${TextPath<T[K]>}`;
}[keyof T & string];
export type MessagePath = TextPath<Messages>;

export const LANGUAGES = ["en", "es"] as const;
export type Language = (typeof LANGUAGES)[number];

const MESSAGES: Record<Language, Messages> = { en, es };

let current: Language = "en";

// From ?lang=, then the first browser language we have, else English.
export function detectLanguage(
  search: string,
  browserLanguages: readonly string[],
): Language {
  const requested = new URLSearchParams(search).get("lang");
  const candidates = [requested, ...browserLanguages.map(primarySubtag)];
  return candidates.map(asLanguage).find((found) => found !== null) ?? "en";
}

export function initLanguage(
  search: string,
  browserLanguages: readonly string[],
): Language {
  current = detectLanguage(search, browserLanguages);
  return current;
}

export function t(path: MessagePath): string {
  let node: unknown = MESSAGES[current];
  for (const key of path.split(".")) {
    if (typeof node !== "object" || node === null) break;
    node = Reflect.get(node, key);
  }
  // The typed path makes this unreachable; the path itself beats a crash.
  return typeof node === "string" ? node : path;
}

// "es-CO" and "es" both mean Spanish.
function primarySubtag(tag: string): string {
  return tag.split("-")[0].toLowerCase();
}

function asLanguage(value: string | null): Language | null {
  return LANGUAGES.find((language) => language === value) ?? null;
}
