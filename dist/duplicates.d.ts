export type DuplicateFormulaOptions = {
    range: string;
    currentCell: string;
    label?: string;
    mode?: "all" | "after-first";
    ignoreBlanks?: boolean;
};
export declare function buildDuplicateFormula(options: DuplicateFormulaOptions): string;
//# sourceMappingURL=duplicates.d.ts.map