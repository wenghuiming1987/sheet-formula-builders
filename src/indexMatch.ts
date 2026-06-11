import { cleanInput, formatValue } from "./helpers.js";

export type IndexMatchOptions = {
  lookupValue: string;
  lookupRange: string;
  returnRange: string;
};

export function buildIndexMatchFormula(options: IndexMatchOptions): string {
  const returnRange = cleanInput(options.returnRange, "D2:D100");
  const lookupValue = formatValue(cleanInput(options.lookupValue, "A2"));
  const lookupRange = cleanInput(options.lookupRange, "A2:A100");

  return `=INDEX(${returnRange}, MATCH(${lookupValue}, ${lookupRange}, 0))`;
}
