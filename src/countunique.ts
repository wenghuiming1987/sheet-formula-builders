import { cleanInput } from "./helpers.js";

export type CountUniqueOptions = {
  range: string;
  ignoreBlanks?: boolean;
  returnZeroOnEmpty?: boolean;
};

function blankFilter(range: string): string {
  return `FILTER(${range}, ${range}<>"")`;
}

export function buildGoogleSheetsCountUniqueFormula(options: CountUniqueOptions): string {
  const range = cleanInput(options.range, "B2:B100");
  const source = options.ignoreBlanks === false ? range : blankFilter(range);
  const formula = `COUNTUNIQUE(${source})`;
  return options.returnZeroOnEmpty === false ? `=${formula}` : `=IFERROR(${formula}, 0)`;
}

export function buildExcelCountUniqueFormula(options: CountUniqueOptions): string {
  const range = cleanInput(options.range, "B2:B100");
  const source = options.ignoreBlanks === false ? range : blankFilter(range);
  const formula = `COUNTA(UNIQUE(${source}))`;
  return options.returnZeroOnEmpty === false ? `=${formula}` : `=IFERROR(${formula}, 0)`;
}
