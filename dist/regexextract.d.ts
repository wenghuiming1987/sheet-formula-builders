export type RegexPatternType = "domain" | "email-domain" | "first-number" | "parentheses" | "custom";
export declare const regexPatterns: Record<Exclude<RegexPatternType, "custom">, string>;
export declare function buildRegexextractFormula(sourceCell: string, patternType: RegexPatternType, customPattern?: string): string;
//# sourceMappingURL=regexextract.d.ts.map