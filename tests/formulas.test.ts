import { describe, expect, it } from "vitest";
import {
  buildComparison,
  buildCountifsFormula,
  buildDuplicateFormula,
  buildExcelFilterFormula,
  buildGoogleSheetsFilterGenerator,
  buildIndexMatchFormula,
  buildQueryFormula,
  buildRegexextractFormula,
  buildSumifsFormula,
  buildVlookupFormula,
  buildXlookupFormula,
  formatCriterion,
  formatValue,
} from "../src/index";

describe("sheet formula builders", () => {
  it("builds SUMIFS and COUNTIFS with safe criteria quoting", () => {
    expect(
      buildSumifsFormula({
        sumRange: "D2:D100",
        criteria: [
          { range: "B2:B100", value: "East" },
          { range: "C2:C100", value: "Widget" },
        ],
      }),
    ).toBe('=SUMIFS(D2:D100, B2:B100, "East", C2:C100, "Widget")');

    expect(buildCountifsFormula({ criteria: [{ range: "D2:D100", value: ">=F1" }] })).toBe('=COUNTIFS(D2:D100, ">="&F1)');
    expect(formatCriterion('<"&TODAY()')).toBe('"<"&TODAY()');
  });

  it("builds lookup formulas", () => {
    expect(buildVlookupFormula({ lookupValue: "A2", tableRange: "Products!A:D", columnIndex: 4, exactMatch: true })).toBe(
      "=VLOOKUP(A2, Products!A:D, 4, FALSE)",
    );
    expect(buildIndexMatchFormula({ lookupValue: "A2", lookupRange: "Products!A2:A100", returnRange: "Products!D2:D100" })).toBe(
      "=INDEX(Products!D2:D100, MATCH(A2, Products!A2:A100, 0))",
    );
    expect(
      buildXlookupFormula({
        lookupValue: "A2",
        lookupArray: "Products!A2:A100",
        returnArray: "Products!D2:D100",
        ifNotFound: "Not found",
        matchMode: "0",
      }),
    ).toBe('=XLOOKUP(A2, Products!A2:A100, Products!D2:D100, "Not found", 0)');
  });

  it("builds QUERY, FILTER, REGEXEXTRACT, and duplicate helper formulas", () => {
    expect(
      buildQueryFormula({
        dataRange: "A1:D100",
        selectColumns: "A, B, D",
        whereCondition: "B = 'East'",
        dateColumn: "A",
        dateOperator: ">=",
        dateValue: "2026-01-01",
        orderBy: "A DESC",
        headerRows: 1,
      }),
    ).toBe('=QUERY(A1:D100, "SELECT A, B, D WHERE B = \'East\' AND A >= date \'2026-01-01\' ORDER BY A DESC", 1)');

    expect(buildExcelFilterFormula({ dataRange: "A2:D100", conditions: [], ifEmpty: 'No "rows"' })).toBe(
      '=FILTER(A2:D100, TRUE, "No ""rows""")',
    );
    expect(
      buildGoogleSheetsFilterGenerator({
        dataRange: "A2:D100",
        logic: "OR",
        conditions: [
          { range: "B2:B100", operator: "equals", type: "text", value: "Paid" },
          { range: "B2:B100", operator: "equals", type: "text", value: "Pending" },
        ],
      }).formula,
    ).toBe('=FILTER(A2:D100,(B2:B100="Paid")+(B2:B100="Pending"))');

    expect(buildRegexextractFormula("A2", "domain")).toBe('=REGEXEXTRACT(A2, "^(?:https?:\\/\\/)?(?:www\\.)?([^\\/\\?#]+)")');
    expect(buildDuplicateFormula({ range: "$A$2:$A$100", currentCell: "A2", label: 'Review "again"' })).toBe(
      '=IF(A2="", "", IF(COUNTIF($A$2:$A$100, A2)>1, "Review ""again""", ""))',
    );
  });

  it("formats values and comparisons", () => {
    expect(formatValue("East")).toBe('"East"');
    expect(formatValue("123")).toBe("123");
    expect(formatValue("F1")).toBe("F1");
    expect(formatValue('Team "A"')).toBe('"Team ""A"""');
    expect(buildComparison("D2:D100", ">=300")).toBe("D2:D100>=300");
    expect(buildComparison("B2:B100", "East")).toBe('B2:B100="East"');
  });
});
