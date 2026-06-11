import { type CriteriaPair } from "./helpers.js";
export type FilterOptions = {
    dataRange: string;
    conditions: CriteriaPair[];
    ifEmpty?: string;
};
export type FilterConditionOperator = "equals" | "not-equals" | "greater-than" | "greater-than-or-equal" | "less-than" | "less-than-or-equal" | "contains" | "does-not-contain" | "is-blank" | "is-not-blank";
export type FilterConditionType = "text" | "number" | "date" | "blank";
export type GoogleSheetsFilterCondition = {
    range: string;
    operator: FilterConditionOperator;
    value?: string;
    type?: FilterConditionType;
};
export type GoogleSheetsFilterGeneratorOptions = {
    dataRange: string;
    conditions: GoogleSheetsFilterCondition[];
    logic?: "AND" | "OR";
    anotherSheet?: boolean;
    sheetName?: string;
};
export type GoogleSheetsFilterGeneratorResult = {
    formula: string;
    explanation: string;
    queryAlternative: string;
    warnings: string[];
};
export declare function buildExcelFilterFormula(options: FilterOptions): string;
export declare function buildGoogleSheetsFilterFormula(options: FilterOptions): string;
export declare function buildGoogleSheetsFilterGenerator(options: GoogleSheetsFilterGeneratorOptions): GoogleSheetsFilterGeneratorResult;
export declare function isValidFilterIsoDate(value: string): boolean;
export declare function filterRangeHeight(range: string): number | null;
//# sourceMappingURL=filter.d.ts.map