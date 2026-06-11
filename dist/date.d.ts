export type DateDifferenceUnit = "days" | "months" | "years";
export declare function buildDateDifferenceFormula(startDateCell: string, endDateCell: string, unit: DateDifferenceUnit): string;
export declare function isoDateToExcelSerial(isoDate: string): number;
export declare function excelSerialToIsoDate(serial: number): string;
//# sourceMappingURL=date.d.ts.map