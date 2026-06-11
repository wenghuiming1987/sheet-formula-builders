import { cleanInput, compactCriteria, formatCriterion } from "./helpers.js";
export function buildSumifsFormula(options) {
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
//# sourceMappingURL=sumifs.js.map