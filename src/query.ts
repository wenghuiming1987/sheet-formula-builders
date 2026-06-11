import { cleanInput } from "./helpers.js";

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

type QuerySegment = { kind: "text"; value: string } | { kind: "formula"; value: string };

function text(value: string): QuerySegment {
  return { kind: "text", value };
}

function formula(value: string): QuerySegment {
  return { kind: "formula", value };
}

function looksLikeCellReference(value: string): boolean {
  return /^\$?[A-Z]{1,3}\$?\d+$/i.test(value.trim());
}

function dateValueSegments(value: string): QuerySegment[] {
  const cleaned = cleanInput(value);
  if (looksLikeCellReference(cleaned)) {
    return [formula(`TEXT(${cleaned},"yyyy-mm-dd")`)];
  }
  return [text(cleaned)];
}

function dateConditionSegments(column: string, operator: string, value: string): QuerySegment[] {
  return [text(`${column} ${operator} date '`), ...dateValueSegments(value), text("'")];
}

function appendSegments(target: QuerySegment[], segments: QuerySegment[]): void {
  segments.forEach((segment) => target.push(segment));
}

function queryArgument(segments: QuerySegment[]): string {
  const compacted: QuerySegment[] = [];

  for (const segment of segments) {
    const previous = compacted.at(-1);
    if (segment.kind === "text" && previous?.kind === "text") {
      previous.value += segment.value;
    } else if (segment.value) {
      compacted.push({ ...segment });
    }
  }

  return compacted
    .map((segment) => {
      if (segment.kind === "formula") return segment.value;
      return `"${segment.value.replaceAll('"', '""')}"`;
    })
    .join("&");
}

export function buildQueryFormula(options: QueryOptions): string {
  const segments: QuerySegment[] = [text(`SELECT ${cleanInput(options.selectedColumns || options.selectColumns, "A, B, C")}`)];
  const whereParts: QuerySegment[][] = [];

  if (cleanInput(options.whereCondition)) {
    whereParts.push([text(cleanInput(options.whereCondition))]);
  }

  const dateColumn = cleanInput(options.dateColumn);
  const mode = options.dateFilterMode === "between" ? "between" : "single";

  if (mode === "between" && dateColumn) {
    if (cleanInput(options.startDate)) {
      whereParts.push(dateConditionSegments(dateColumn, ">=", cleanInput(options.startDate)));
    }

    if (cleanInput(options.endDate)) {
      whereParts.push(dateConditionSegments(dateColumn, cleanInput(options.endBoundary, "<"), cleanInput(options.endDate)));
    }
  }

  if (mode === "single" && dateColumn && cleanInput(options.dateValue)) {
    const operator = cleanInput(options.dateOperator, ">=");
    whereParts.push(dateConditionSegments(dateColumn, operator, cleanInput(options.dateValue)));
  }

  if (whereParts.length) {
    segments.push(text(" WHERE "));
    whereParts.forEach((part, index) => {
      if (index > 0) segments.push(text(" AND "));
      appendSegments(segments, part);
    });
  }

  if (cleanInput(options.orderBy)) {
    segments.push(text(` ORDER BY ${cleanInput(options.orderBy)}`));
  }

  return `=QUERY(${cleanInput(options.dataRange, "A1:D100")}, ${queryArgument(segments)}, ${cleanInput(
    options.headerRows,
    "1",
  )})`;
}
