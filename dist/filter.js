import { buildComparison, cleanInput, compactCriteria, quoteFormulaText } from "./helpers.js";
export function buildExcelFilterFormula(options) {
    const dataRange = cleanInput(options.dataRange, "A2:D100");
    const conditions = compactCriteria(options.conditions);
    const include = conditions.map((condition) => `(${buildComparison(condition.range, condition.value)})`).join("*");
    const ifEmpty = cleanInput(options.ifEmpty, "No matches");
    return `=FILTER(${dataRange}, ${include || "TRUE"}, "${ifEmpty.replaceAll('"', '""')}")`;
}
export function buildGoogleSheetsFilterFormula(options) {
    const dataRange = cleanInput(options.dataRange, "A2:D100");
    const conditions = compactCriteria(options.conditions);
    const include = conditions.map((condition) => buildComparison(condition.range, condition.value)).join(", ");
    const formula = `FILTER(${dataRange}${include ? `, ${include}` : ""})`;
    const ifEmpty = cleanInput(options.ifEmpty, "No matches");
    return `=IFERROR(${formula}, "${ifEmpty.replaceAll('"', '""')}")`;
}
function quoteSheetName(sheetName) {
    const cleaned = cleanInput(sheetName, "Sheet1").replaceAll("'", "''");
    return `'${cleaned}'`;
}
function applySheetName(range, sheetName) {
    const cleaned = cleanInput(range);
    if (!sheetName || cleaned.includes("!"))
        return cleaned;
    return `${quoteSheetName(sheetName)}!${cleaned}`;
}
function parseIsoDate(value) {
    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match)
        return null;
    const [, yearText, monthText, dayText] = match;
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day)
        return null;
    return { year, month, day };
}
function formatFilterValue(value, type = "text") {
    const cleaned = cleanInput(value);
    if (type === "number")
        return cleaned || "0";
    if (type === "date") {
        const parsed = parseIsoDate(cleaned);
        return parsed ? `DATE(${parsed.year},${parsed.month},${parsed.day})` : quoteFormulaText(cleaned);
    }
    return quoteFormulaText(cleaned);
}
function comparisonOperator(operator) {
    const map = {
        equals: "=",
        "not-equals": "<>",
        "greater-than": ">",
        "greater-than-or-equal": ">=",
        "less-than": "<",
        "less-than-or-equal": "<=",
    };
    return map[operator] || "=";
}
function buildConditionExpression(condition, sheetName) {
    const range = applySheetName(condition.range, sheetName);
    const type = condition.type || "text";
    if (condition.operator === "contains")
        return `ISNUMBER(SEARCH(${quoteFormulaText(cleanInput(condition.value))},${range}))`;
    if (condition.operator === "does-not-contain")
        return `NOT(ISNUMBER(SEARCH(${quoteFormulaText(cleanInput(condition.value))},${range})))`;
    if (condition.operator === "is-blank")
        return `${range}=""`;
    if (condition.operator === "is-not-blank")
        return `${range}<>""`;
    return `${range}${comparisonOperator(condition.operator)}${formatFilterValue(cleanInput(condition.value), type)}`;
}
function rangeHeight(range) {
    const cleaned = range.trim().split("!").pop() || "";
    const match = cleaned.match(/^[A-Z]+\$?(\d+):[A-Z]+\$?(\d+)$/i);
    if (!match)
        return null;
    const start = Number(match[1]);
    const end = Number(match[2]);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start)
        return null;
    return end - start + 1;
}
function rangeColumn(range) {
    const cleaned = range.trim().split("!").pop() || "";
    const match = cleaned.match(/^\$?([A-Z]+)\$?\d+:\$?\1\$?\d+$/i);
    return match ? match[1].toUpperCase() : null;
}
function queryValue(condition) {
    const type = condition.type || "text";
    const value = cleanInput(condition.value);
    if (condition.operator === "is-blank")
        return "IS NULL";
    if (condition.operator === "is-not-blank")
        return "IS NOT NULL";
    if (condition.operator === "contains")
        return `contains '${value.replaceAll("'", "\\'")}'`;
    if (condition.operator === "does-not-contain")
        return null;
    if (type === "date") {
        const parsed = parseIsoDate(value);
        if (!parsed)
            return null;
        return `${comparisonOperator(condition.operator)} date '${value}'`;
    }
    if (type === "number")
        return `${comparisonOperator(condition.operator)} ${value}`;
    return `${comparisonOperator(condition.operator)} '${value.replaceAll("'", "\\'")}'`;
}
function buildQueryAlternative(dataRange, conditions, logic) {
    const whereParts = conditions.map((condition) => {
        const column = rangeColumn(condition.range);
        const value = queryValue(condition);
        return column && value ? `${column} ${value}` : "";
    });
    if (whereParts.some((part) => !part))
        return "Not generated for this condition set.";
    return `=QUERY(${dataRange}, "SELECT * WHERE ${whereParts.join(` ${logic} `)}", 0)`;
}
export function buildGoogleSheetsFilterGenerator(options) {
    const sheetName = options.anotherSheet ? cleanInput(options.sheetName) : "";
    const dataRange = applySheetName(cleanInput(options.dataRange, "A2:D100"), sheetName);
    const logic = options.logic === "OR" ? "OR" : "AND";
    const conditions = options.conditions
        .map((condition) => ({
        ...condition,
        range: cleanInput(condition.range),
        value: cleanInput(condition.value),
        type: condition.type || "text",
    }))
        .filter((condition) => condition.range);
    const expressions = conditions.map((condition) => buildConditionExpression(condition, sheetName));
    const include = logic === "OR"
        ? expressions.map((expression) => `(${expression})`).join("+")
        : expressions.join(",");
    const formula = `=FILTER(${dataRange}${include ? `,${include}` : ""})`;
    const warnings = [];
    const dataHeight = rangeHeight(dataRange);
    const conditionHeights = conditions.map((condition) => rangeHeight(condition.range)).filter((height) => height !== null);
    if (dataHeight && conditionHeights.some((height) => height !== dataHeight)) {
        warnings.push("Condition ranges should use the same row height as the data range.");
    }
    if (logic === "OR" && conditionHeights.length > 1 && new Set(conditionHeights).size > 1) {
        warnings.push("OR logic needs condition ranges with the same height.");
    }
    const explanation = logic === "OR"
        ? "FILTER returns rows from the data range when at least one condition is true. The plus signs combine condition arrays as OR logic in Google Sheets."
        : "FILTER returns rows from the data range when every condition is true. Separate condition arguments act like AND logic in Google Sheets.";
    return {
        formula,
        explanation,
        queryAlternative: buildQueryAlternative(dataRange, conditions, logic),
        warnings,
    };
}
export function isValidFilterIsoDate(value) {
    return parseIsoDate(value) !== null;
}
export function filterRangeHeight(range) {
    return rangeHeight(range);
}
//# sourceMappingURL=filter.js.map