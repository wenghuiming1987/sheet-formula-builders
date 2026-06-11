import { cleanInput } from "./helpers.js";

export type DateDifferenceUnit = "days" | "months" | "years";

export function buildDateDifferenceFormula(startDateCell: string, endDateCell: string, unit: DateDifferenceUnit): string {
  const start = cleanInput(startDateCell, "A2");
  const end = cleanInput(endDateCell, "B2");

  if (unit === "months") return `=DATEDIF(${start}, ${end}, "M")`;
  if (unit === "years") return `=DATEDIF(${start}, ${end}, "Y")`;
  return `=${end}-${start}`;
}

export function isoDateToExcelSerial(isoDate: string): number {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid ISO date");
  const epoch = Date.UTC(1899, 11, 31);
  const oneDay = 24 * 60 * 60 * 1000;
  const dayCount = Math.floor((date.getTime() - epoch) / oneDay);
  return dayCount >= 60 ? dayCount + 1 : dayCount;
}

export function excelSerialToIsoDate(serial: number): string {
  if (!Number.isFinite(serial) || serial < 1) throw new Error("Invalid Excel serial");
  if (serial === 60) return "1900-02-29";
  const adjustedSerial = serial > 60 ? serial - 1 : serial;
  const epoch = Date.UTC(1899, 11, 31);
  const oneDay = 24 * 60 * 60 * 1000;
  const date = new Date(epoch + adjustedSerial * oneDay);
  return date.toISOString().slice(0, 10);
}
