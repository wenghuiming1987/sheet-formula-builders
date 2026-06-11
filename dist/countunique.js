import { cleanInput } from "./helpers.js";
function blankFilter(range) {
    return `FILTER(${range}, ${range}<>"")`;
}
export function buildGoogleSheetsCountUniqueFormula(options) {
    const range = cleanInput(options.range, "B2:B100");
    const source = options.ignoreBlanks === false ? range : blankFilter(range);
    const formula = `COUNTUNIQUE(${source})`;
    return options.returnZeroOnEmpty === false ? `=${formula}` : `=IFERROR(${formula}, 0)`;
}
export function buildExcelCountUniqueFormula(options) {
    const range = cleanInput(options.range, "B2:B100");
    const source = options.ignoreBlanks === false ? range : blankFilter(range);
    const formula = `COUNTA(UNIQUE(${source}))`;
    return options.returnZeroOnEmpty === false ? `=${formula}` : `=IFERROR(${formula}, 0)`;
}
//# sourceMappingURL=countunique.js.map