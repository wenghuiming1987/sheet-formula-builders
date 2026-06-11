import { cleanInput } from "./helpers.js";

export type DuplicateFormulaOptions = {
  range: string;
  currentCell: string;
  label?: string;
  mode?: "all" | "after-first";
  ignoreBlanks?: boolean;
};

function firstCellFromRange(range: string): string {
  const cleaned = cleanInput(range, "$A$2:$A$100");
  const match = cleaned.match(/^((?:'?[\w\s-]+'?!)?\$?[A-Z]{1,3}\$?\d+):/i);
  return match?.[1] || "$A$2";
}

export function buildDuplicateFormula(options: DuplicateFormulaOptions): string {
  const range = cleanInput(options.range, "$A$2:$A$100");
  const currentCell = cleanInput(options.currentCell, "A2");
  const label = cleanInput(options.label, "Duplicate").replaceAll('"', '""');
  const countRange = options.mode === "after-first" ? `${firstCellFromRange(range)}:${currentCell}` : range;
  const duplicateCheck = `IF(COUNTIF(${countRange}, ${currentCell})>1, "${label}", "")`;

  if (options.ignoreBlanks === false) return `=${duplicateCheck}`;
  return `=IF(${currentCell}="", "", ${duplicateCheck})`;
}
