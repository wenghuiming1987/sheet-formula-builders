import { cleanInput, compactCriteria, formatCriterion, type CriteriaPair } from "./helpers.js";

export type SumifsOptions = {
  sumRange: string;
  criteria: CriteriaPair[];
  monthMode?: boolean;
};

export function buildSumifsFormula(options: SumifsOptions): string {
  const sumRange = cleanInput(options.sumRange, "D2:D100");
  const criteria = compactCriteria(options.criteria);

  if (options.monthMode && criteria.length > 0) {
    const [dateCriteria, ...rest] = criteria;
    const monthValue = cleanInput(dateCriteria.value, "F1");
    const args = [
      sumRange,
      dateCriteria.range,
      `">="&DATE(YEAR(${monthValue}),MONTH(${monthValue}),1)`,
      dateCriteria.range,
      `"<"&EOMONTH(${monthValue},0)+1`,
      ...rest.flatMap((pair) => [pair.range, formatCriterion(pair.value)]),
    ];
    return `=SUMIFS(${args.join(", ")})`;
  }

  const args = [sumRange, ...criteria.flatMap((pair) => [pair.range, formatCriterion(pair.value)])];
  return `=SUMIFS(${args.join(", ")})`;
}
