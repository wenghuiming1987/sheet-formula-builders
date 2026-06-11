import { cleanInput, formatValue } from "./helpers.js";

export type VlookupOptions = {
  lookupValue: string;
  tableRange: string;
  columnIndex: string | number;
  exactMatch: boolean;
};

export function buildVlookupFormula(options: VlookupOptions): string {
  const args = [
    formatValue(cleanInput(options.lookupValue, "A2")),
    cleanInput(options.tableRange, "A:D"),
    cleanInput(options.columnIndex, "2"),
    options.exactMatch ? "FALSE" : "TRUE",
  ];

  return `=VLOOKUP(${args.join(", ")})`;
}
