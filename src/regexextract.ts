import { cleanInput } from "./helpers.js";

export type RegexPatternType = "domain" | "email-domain" | "first-number" | "parentheses" | "custom";

export const regexPatterns: Record<Exclude<RegexPatternType, "custom">, string> = {
  domain: "^(?:https?:\\/\\/)?(?:www\\.)?([^\\/\\?#]+)",
  "email-domain": "@(.+)$",
  "first-number": "(\\d+(?:\\.\\d+)?)",
  parentheses: "\\(([^)]+)\\)",
};

export function buildRegexextractFormula(sourceCell: string, patternType: RegexPatternType, customPattern = ""): string {
  const pattern = patternType === "custom" ? cleanInput(customPattern, "your-pattern") : regexPatterns[patternType];
  const escapedPattern = pattern.replaceAll('"', '""');
  return `=REGEXEXTRACT(${cleanInput(sourceCell, "A2")}, "${escapedPattern}")`;
}
