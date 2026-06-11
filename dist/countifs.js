import { compactCriteria, formatCriterion } from "./helpers.js";
export function buildCountifsFormula(options) {
    const criteria = compactCriteria(options.criteria);
    const args = criteria.length
        ? criteria.flatMap((pair) => [pair.range, formatCriterion(pair.value)])
        : ["A2:A100", '"Complete"'];
    return `=COUNTIFS(${args.join(", ")})`;
}
//# sourceMappingURL=countifs.js.map