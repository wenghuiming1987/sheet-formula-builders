import { cleanInput, formatValue } from "./helpers.js";
export function buildVlookupFormula(options) {
    const args = [
        formatValue(cleanInput(options.lookupValue, "A2")),
        cleanInput(options.tableRange, "A:D"),
        cleanInput(options.columnIndex, "2"),
        options.exactMatch ? "FALSE" : "TRUE",
    ];
    return `=VLOOKUP(${args.join(", ")})`;
}
//# sourceMappingURL=vlookup.js.map