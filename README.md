# sheet-formula-builders

Deterministic TypeScript builders for common Excel and Google Sheets formulas. The package returns copyable formulas as strings; it does not read files, upload spreadsheets, call AI APIs, or require a browser.

This package is extracted from the formula logic used by [SheetFormulaTools](https://sheetformulatools.top). The site consumes the same package source so the open-source library and website do not drift.

## Install

```bash
npm install sheet-formula-builders
```

## Usage

```ts
import {
  buildQueryFormula,
  buildSumifsFormula,
  buildXlookupFormula,
} from "sheet-formula-builders";

const revenueByRegion = buildSumifsFormula({
  sumRange: "D2:D100",
  criteria: [
    { range: "B2:B100", value: "East" },
    { range: "A2:A100", value: ">=DATE(2026,1,1)" },
  ],
});

// =SUMIFS(D2:D100, B2:B100, "East", A2:A100, ">="&DATE(2026,1,1))

const lookupPrice = buildXlookupFormula({
  lookupValue: "A2",
  lookupArray: "Products!A2:A100",
  returnArray: "Products!D2:D100",
  ifNotFound: "Not found",
  matchMode: "0",
});

// =XLOOKUP(A2, Products!A2:A100, Products!D2:D100, "Not found", 0)

const mayOrders = buildQueryFormula({
  dataRange: "Orders!A1:F",
  selectedColumns: "A, B, D, E",
  dateFilterMode: "between",
  dateColumn: "A",
  startDate: "2026-05-01",
  endDate: "2026-06-01",
  endBoundary: "<",
  orderBy: "A DESC",
  headerRows: 1,
});

// =QUERY(Orders!A1:F, "SELECT A, B, D, E WHERE A >= date '2026-05-01' AND A < date '2026-06-01' ORDER BY A DESC", 1)
```

## Builders

- `buildSumifsFormula`
- `buildCountifsFormula`
- `buildVlookupFormula`
- `buildXlookupFormula`
- `buildIndexMatchFormula`
- `buildQueryFormula`
- `buildQueryDateFormula`
- `buildExcelFilterFormula`
- `buildGoogleSheetsFilterFormula`
- `buildGoogleSheetsFilterGenerator`
- `buildRegexextractFormula`
- `buildDuplicateFormula`
- `buildGoogleSheetsCountUniqueFormula`
- `buildExcelCountUniqueFormula`
- `buildDateDifferenceFormula`
- `isoDateToExcelSerial`
- `excelSerialToIsoDate`

## Related interactive examples

For copyable examples, sample data, and browser-based builders, see:

- [SUMIFS between dates](https://sheetformulatools.top/formulas/sumifs-between-dates/)
- [Google Sheets QUERY date range example](https://sheetformulatools.top/examples/google-sheets-query-date-range/)

## Development

```bash
npm install
npm test
npm run build
npm pack --dry-run
```

The source files in `src/` are the package source of truth. The SheetFormulaTools site should depend on this package rather than keeping a separate copy of the same formula builders.

## License

MIT
