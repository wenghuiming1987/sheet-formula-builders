import { cleanInput, compactCriteria, formatCriterion, type CriteriaPair } from "./helpers.js";

export type CountifsOptions = {
  criteria: CriteriaPair[];
};

export function buildCountifsFormula(options: CountifsOptions): string {
  const criteria = compactCriteria(options.criteria);
  const args = criteria.length
    ? criteria.flatMap((pair) => [pair.range, formatCriterion(pair.value)])
    : ["A2:A100", '"Complete"'];
  return `=COUNTIFS(${args.join(", ")})`;
}
