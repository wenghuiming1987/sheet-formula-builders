import { cleanInput } from "./helpers.js";

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

function isCellReference(value: string): boolean {
  return /^\$?[A-Z]{1,3}\$?\d+$/i.test(value.trim());
}

function isIsoDate(value: string): boolean {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function queryDateExpression(value: string): string {
  const cleaned = cleanInput(value);
  if (isCellReference(cleaned)) return `date '"&TEXT(${cleaned},"yyyy-mm-dd")&"'`;
  return `date '${cleaned}'`;
}

export function isValidQueryDateInput(value: string): boolean {
  const cleaned = cleanInput(value);
  return !cleaned || isIsoDate(cleaned) || isCellReference(cleaned);
}

export function buildQueryDateFormula(options: QueryDateOptions): QueryDateResult {
  const dataRange = cleanInput(options.dataRange, "A1:D");
  const dateColumn = cleanInput(options.dateColumn, "A").toUpperCase();
  const startDate = cleanInput(options.startDate);
  const endDate = cleanInput(options.endDate);
  const headerRows = cleanInput(options.headerRows, "1");
  const clauses: string[] = [];

  if (startDate) clauses.push(`${dateColumn} >= ${queryDateExpression(startDate)}`);
  if (endDate) clauses.push(`${dateColumn} <= ${queryDateExpression(endDate)}`);

  const where = clauses.length ? ` where ${clauses.join(" and ")}` : "";
  const formula = `=QUERY(${dataRange}, "select *${where}", ${headerRows})`;
  const explanation =
    options.timestampMode && startDate && endDate
      ? "This QUERY formula filters the date column between the selected boundaries. If the source column includes time values, use a next-day upper boundary for stricter timestamp handling."
      : "This QUERY formula filters rows by comparing the date column with QUERY date literals.";

  return { formula, explanation };
}
