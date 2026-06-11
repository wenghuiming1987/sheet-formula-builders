import { cleanInput, formatValue } from "./helpers.js";
export function buildXlookupFormula(options) {
    const lookupValue = options.mode === "multiple" && options.criteria?.length
        ? "1"
        : formatValue(cleanInput(options.lookupValue, "A2"));
    const lookupArray = options.mode === "multiple" && options.criteria?.length
        ? options.criteria
            .map((criterion) => `(${cleanInput(criterion.range, "A2:A100")}=${formatValue(cleanInput(criterion.value, "H2"))})`)
            .join("*")
        : cleanInput(options.lookupArray, "A2:A100");
    const args = [
        lookupValue,
        lookupArray,
        cleanInput(options.returnArray, "D2:D100"),
    ];
    if (cleanInput(options.ifNotFound)) {
        args.push(formatValue(cleanInput(options.ifNotFound)));
    }
    const matchMode = options.mode === "multiple" ? "" : cleanInput(options.matchMode);
    if (matchMode) {
        if (!cleanInput(options.ifNotFound))
            args.push('""');
        args.push(matchMode);
    }
    return `=XLOOKUP(${args.join(", ")})`;
}
//# sourceMappingURL=xlookup.js.map