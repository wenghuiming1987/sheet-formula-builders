import { cleanInput } from "./helpers.js";
export const regexPatterns = {
    domain: "^(?:https?:\\/\\/)?(?:www\\.)?([^\\/\\?#]+)",
    "email-domain": "@(.+)$",
    "first-number": "(\\d+(?:\\.\\d+)?)",
    parentheses: "\\(([^)]+)\\)",
};
export function buildRegexextractFormula(sourceCell, patternType, customPattern = "") {
    const pattern = patternType === "custom" ? cleanInput(customPattern, "your-pattern") : regexPatterns[patternType];
    const escapedPattern = pattern.replaceAll('"', '""');
    return `=REGEXEXTRACT(${cleanInput(sourceCell, "A2")}, "${escapedPattern}")`;
}
//# sourceMappingURL=regexextract.js.map