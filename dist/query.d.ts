export type QueryOptions = {
    dataRange: string;
    selectColumns?: string;
    selectedColumns?: string;
    whereCondition?: string;
    dateFilterMode?: "single" | "between";
    dateColumn?: string;
    dateOperator?: string;
    dateValue?: string;
    startDate?: string;
    endDate?: string;
    endBoundary?: "<" | "<=";
    orderBy?: string;
    headerRows?: string | number;
};
export declare function buildQueryFormula(options: QueryOptions): string;
//# sourceMappingURL=query.d.ts.map