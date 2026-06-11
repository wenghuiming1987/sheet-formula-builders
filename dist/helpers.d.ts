export type CriteriaPair = {
    range: string;
    value: string;
};
export declare function cleanInput(value: string | number | undefined | null, fallback?: string): string;
export declare function quoteFormulaText(value: string): string;
export declare function isCellReference(value: string): boolean;
export declare function isRangeReference(value: string): boolean;
export declare function isNumberLiteral(value: string): boolean;
export declare function isFormulaExpression(value: string): boolean;
export declare function formatValue(value: string): string;
export declare function formatCriterion(value: string): string;
export declare function buildComparison(range: string, value: string): string;
export declare function compactCriteria(pairs: CriteriaPair[]): CriteriaPair[];
//# sourceMappingURL=helpers.d.ts.map