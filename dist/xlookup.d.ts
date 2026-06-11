export type XlookupOptions = {
    lookupValue: string;
    lookupArray: string;
    returnArray: string;
    ifNotFound?: string;
    matchMode?: string;
    mode?: "single" | "multiple";
    criteria?: Array<{
        range: string;
        value: string;
    }>;
};
export declare function buildXlookupFormula(options: XlookupOptions): string;
//# sourceMappingURL=xlookup.d.ts.map