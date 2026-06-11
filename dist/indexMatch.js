import { cleanInput, formatValue } from "./helpers.js";
export function buildIndexMatchFormula(options) {
    const returnRange = cleanInput(options.returnRange, "D2:D100");
    const lookupValue = formatValue(cleanInput(options.lookupValue, "A2"));
    const lookupRange = cleanInput(options.lookupRange, "A2:A100");
    return `=INDEX(${returnRange}, MATCH(${lookupValue}, ${lookupRange}, 0))`;
}
//# sourceMappingURL=indexMatch.js.map