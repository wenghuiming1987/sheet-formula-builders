export type CriteriaPair = {
  range: string;
  value: string;
};

export function cleanInput(value: string | number | undefined | null, fallback = ""): string {
  if (value === undefined || value === null) return fallback;
  const cleaned = String(value).trim();
  return cleaned || fallback;
}

export function quoteFormulaText(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function isCellReference(value: string): boolean {
  const cleaned = value.trim();
  return /^(?:'?[\w\s-]+'?!)?\$?[A-Z]{1,3}\$?\d+$/i.test(cleaned);
}

export function isRangeReference(value: string): boolean {
  const cleaned = value.trim();
  return /^(?:'?[\w\s-]+'?!)?\$?[A-Z]{1,3}\$?\d+:\$?[A-Z]{1,3}\$?\d+$/i.test(cleaned);
}

export function isNumberLiteral(value: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(value.trim());
}

export function isFormulaExpression(value: string): boolean {
  const cleaned = value.trim();
  return (
    cleaned.startsWith('"') ||
    cleaned.startsWith("{") ||
    cleaned.startsWith("DATE(") ||
    cleaned.startsWith("TODAY(") ||
    cleaned.startsWith("EOMONTH(") ||
    cleaned.includes("&") ||
    isCellReference(cleaned) ||
    isRangeReference(cleaned) ||
    isNumberLiteral(cleaned)
  );
}

export function formatValue(value: string): string {
  const cleaned = cleanInput(value);
  if (!cleaned) return '""';
  if (isFormulaExpression(cleaned)) return cleaned;
  return quoteFormulaText(cleaned);
}

export function formatCriterion(value: string): string {
  const cleaned = cleanInput(value);
  if (!cleaned) return '""';
  const operatorMatch = cleaned.match(/^(>=|<=|<>|>|<|=)\s*(.+)$/);
  if (operatorMatch) {
    const [, operator, rawValue] = operatorMatch;
    const criteriaValue = rawValue.trim();

    if (criteriaValue.startsWith('"&')) return `${quoteFormulaText(operator)}${criteriaValue.slice(1)}`;
    if (isCellReference(criteriaValue) || (isFormulaExpression(criteriaValue) && !isNumberLiteral(criteriaValue))) {
      return `${quoteFormulaText(operator)}&${criteriaValue}`;
    }

    return quoteFormulaText(`${operator}${criteriaValue}`);
  }
  if (isFormulaExpression(cleaned)) return cleaned;
  return quoteFormulaText(cleaned);
}

export function buildComparison(range: string, value: string): string {
  const cleanRange = cleanInput(range, "A2:A100");
  const cleaned = cleanInput(value, "value");
  const operatorMatch = cleaned.match(/^(>=|<=|<>|>|<|=)\s*(.+)$/);

  if (operatorMatch) {
    const [, operator, rawValue] = operatorMatch;
    return `${cleanRange}${operator}${formatValue(rawValue)}`;
  }

  return `${cleanRange}=${formatValue(cleaned)}`;
}

export function compactCriteria(pairs: CriteriaPair[]): CriteriaPair[] {
  return pairs
    .map((pair) => ({
      range: cleanInput(pair.range),
      value: cleanInput(pair.value),
    }))
    .filter((pair) => pair.range && pair.value);
}
