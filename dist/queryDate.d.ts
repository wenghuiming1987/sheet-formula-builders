export type QueryDateOptions = {
    dataRange: string;
    dateColumn: string;
    startDate?: string;
    endDate?: string;
    headerRows?: string | number;
    timestampMode?: boolean;
};
export type QueryDateResult = {
    formula: string;
    explanation: string;
};
export declare function isValidQueryDateInput(value: string): boolean;
export declare function buildQueryDateFormula(options: QueryDateOptions): QueryDateResult;
//# sourceMappingURL=queryDate.d.ts.map