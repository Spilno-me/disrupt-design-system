/**
 * Color Validation Tool
 *
 * Validates color choices for accessibility and design rules.
 * Checks forbidden patterns and enforces AAA for badge context.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// =============================================================================
// TYPES
// =============================================================================

interface ForbiddenPattern {
  pattern: string;
  examples: string[];
  reason: string;
  exceptions?: Array<{ pattern: string; context: string; reason: string }>;
}

interface ContrastEntry {
  foreground?: string;
  background?: string;
  ratio: number;
  level: string;
  pass: boolean;
}

interface ContrastMatrix {
  byBackground: Record<string, ContrastEntry[]>;
  byForeground: Record<string, ContrastEntry[]>;
  combinations: Array<{
    background: string;
    foreground: string;
    ratio: number;
    level: string;
    pass: boolean;
  }>;
}

interface ColorIntelligence {
  forbidden: ForbiddenPattern[];
  color_properties: Record<string, ColorProperty>;
  harmony_lookup: Record<string, HarmonyEntry>;
}

interface ColorProperty {
  temperature: string;
  semantic: string | null;
  role: string;
  compatible_temps: string[];
}

interface HarmonyEntry {
  companions: string[];
  accents: string[];
  avoid: string[];
  avoid_reason: string;
}

// Valid contexts
const VALID_CONTEXTS = [
  "default",
  "page",
  "card",
  "surface",
  "modal",
  "button",
  "input",
  "navigation",
  "tooltip",
  "tableRow",
  "badge",
  "status",
  "dataViz",
] as const;

type ValidContext = (typeof VALID_CONTEXTS)[number];

// =============================================================================
// ERROR RESPONSES
// =============================================================================

interface ErrorResponse {
  error: string;
  code: string;
  suggestion?: string;
  valid_contexts?: readonly string[];
  example?: string;
}

function createUnknownContextError(context: string): ErrorResponse {
  return {
    error: `Unknown context: "${context}"`,
    code: "UNKNOWN_CONTEXT",
    suggestion: "Use 'default' if context is unknown",
    valid_contexts: VALID_CONTEXTS,
  };
}

function createMissingParamError(params: string[]): ErrorResponse {
  return {
    error: `Missing required parameters: ${params.join(", ")}`,
    code: "MISSING_REQUIRED_PARAM",
    example: '{ "background": "ABYSS[900]", "foreground": "PRIMITIVES.white" }',
  };
}

// =============================================================================
// VALIDATION LOGIC
// =============================================================================

interface ValidationResult {
  valid: boolean;
  ratio?: number;
  level?: "AAA" | "AA" | "FAIL";
  issues: ValidationIssue[];
  suggestion?: string;
}

interface ValidationIssue {
  type: "forbidden_pattern" | "contrast" | "harmony" | "same_family";
  severity: "error" | "warning";
  message: string;
  fix?: string;
}

function extractColorFamily(token: string): string | null {
  // Handle tokens like ABYSS[900], CORAL[500], etc.
  const bracketMatch = token.match(/^([A-Z_]+)\[\d+\]$/);
  if (bracketMatch) {
    return bracketMatch[1];
  }

  // Handle tokens like PRIMITIVES.white
  const dotMatch = token.match(/^([A-Z_]+)\./);
  if (dotMatch) {
    return dotMatch[1];
  }

  // Handle semantic tokens (text-primary, bg-surface, etc.)
  return null;
}

function extractColorStep(token: string): number | null {
  const match = token.match(/\[(\d+)\]$/);
  return match ? parseInt(match[1], 10) : null;
}

function checkSameFamilyContrast(
  bg: string,
  fg: string
): ValidationIssue | null {
  const bgFamily = extractColorFamily(bg);
  const fgFamily = extractColorFamily(fg);

  if (!bgFamily || !fgFamily || bgFamily !== fgFamily) {
    return null;
  }

  const bgStep = extractColorStep(bg);
  const fgStep = extractColorStep(fg);

  if (bgStep === null || fgStep === null) {
    return null;
  }

  const stepDiff = Math.abs(bgStep - fgStep);

  if (stepDiff < 400) {
    return {
      type: "same_family",
      severity: "error",
      message: `Same family (${bgFamily}) with insufficient step difference: ${stepDiff} (minimum 400 required)`,
      fix: `Use colors at least 400 steps apart, e.g., ${bgFamily}[100] on ${bgFamily}[900]`,
    };
  }

  return null;
}

function checkForbiddenPatterns(
  bg: string,
  fg: string,
  forbidden: ForbiddenPattern[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const pattern of forbidden) {
    // Check raw hex
    if (pattern.pattern === "Raw hex colors") {
      if (/^#[0-9A-Fa-f]{3,8}$/.test(bg) || /^#[0-9A-Fa-f]{3,8}$/.test(fg)) {
        issues.push({
          type: "forbidden_pattern",
          severity: "error",
          message: "Raw hex colors are forbidden",
          fix: "Use semantic tokens (bg-surface, text-primary) or primitive tokens (ABYSS[900])",
        });
      }
    }

    // Check standard Tailwind colors
    if (pattern.pattern === "Standard Tailwind colors") {
      const tailwindPattern = /^(bg|text|border)-(red|blue|green|yellow|purple|pink|gray|slate)-\d+$/;
      if (tailwindPattern.test(bg) || tailwindPattern.test(fg)) {
        issues.push({
          type: "forbidden_pattern",
          severity: "error",
          message: "Standard Tailwind colors are forbidden",
          fix: "Use DDS tokens instead (CORAL for red, WAVE for blue, etc.)",
        });
      }
    }
  }

  return issues;
}

function checkHarmonyViolation(
  bg: string,
  fg: string,
  harmonyLookup: Record<string, HarmonyEntry>,
  colorProperties: Record<string, ColorProperty>
): ValidationIssue | null {
  const bgFamily = extractColorFamily(bg);
  const fgFamily = extractColorFamily(fg);

  if (!bgFamily || !fgFamily) {
    return null;
  }

  const bgHarmony = harmonyLookup[bgFamily];
  if (!bgHarmony) {
    return null;
  }

  if (bgHarmony.avoid.includes(fgFamily)) {
    return {
      type: "harmony",
      severity: "warning",
      message: `${fgFamily} should be avoided on ${bgFamily}: ${bgHarmony.avoid_reason}`,
      fix: `Use one of these instead: ${bgHarmony.companions.join(", ")}`,
    };
  }

  return null;
}

function lookupContrastRatio(
  bg: string,
  fg: string,
  contrastMatrix: ContrastMatrix | null
): { ratio: number; level: string } | null {
  if (!contrastMatrix) {
    return null;
  }

  // Try direct lookup
  const bgEntries = contrastMatrix.byBackground[bg];
  if (bgEntries) {
    const match = bgEntries.find((e) => e.foreground === fg);
    if (match) {
      return { ratio: match.ratio, level: match.level };
    }
  }

  // Try reverse lookup (contrast is symmetric)
  const fgEntries = contrastMatrix.byForeground[bg];
  if (fgEntries) {
    const match = fgEntries.find((e) => e.background === fg);
    if (match) {
      return { ratio: match.ratio, level: match.level };
    }
  }

  return null;
}

// =============================================================================
// TOOL REGISTRATION
// =============================================================================

export function registerColorValidationTool(
  server: McpServer,
  colorIntelligence: ColorIntelligence | null,
  contrastMatrix: ContrastMatrix | null
) {
  server.tool(
    "validate_color_choice",
    "Validate a foreground/background color combination. Checks WCAG contrast, forbidden patterns, and harmony rules. Enforces AAA (7:1) for badge context.",
    {
      background: z
        .string()
        .describe(
          'Background color token (e.g., "ABYSS[900]", "PRIMITIVES.white", "bg-surface")'
        ),
      foreground: z
        .string()
        .describe(
          'Foreground/text color token (e.g., "PRIMITIVES.white", "text-primary")'
        ),
      context: z
        .string()
        .optional()
        .describe(
          'UI context for stricter rules (e.g., "badge" requires AAA 7:1)'
        ),
    },
    async (args) => {
      // Validate data loaded
      if (!colorIntelligence) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { error: "Color intelligence data not loaded", code: "DATA_NOT_LOADED" },
                null,
                2
              ),
            },
          ],
        };
      }

      const { background, foreground, context } = args;

      // Validate required params
      const missing: string[] = [];
      if (!background) missing.push("background");
      if (!foreground) missing.push("foreground");

      if (missing.length > 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(createMissingParamError(missing), null, 2),
            },
          ],
        };
      }

      // Validate context if provided
      if (context && !VALID_CONTEXTS.includes(context as ValidContext)) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(createUnknownContextError(context), null, 2),
            },
          ],
        };
      }

      // Build validation result
      const result: ValidationResult = {
        valid: true,
        issues: [],
      };

      // Check same family contrast (P3: Family Contrast rule)
      const sameFamilyIssue = checkSameFamilyContrast(background, foreground);
      if (sameFamilyIssue) {
        result.issues.push(sameFamilyIssue);
        result.valid = false;
      }

      // Check forbidden patterns
      const forbiddenIssues = checkForbiddenPatterns(
        background,
        foreground,
        colorIntelligence.forbidden
      );
      result.issues.push(...forbiddenIssues);
      if (forbiddenIssues.some((i) => i.severity === "error")) {
        result.valid = false;
      }

      // Check harmony violations
      const harmonyIssue = checkHarmonyViolation(
        background,
        foreground,
        colorIntelligence.harmony_lookup,
        colorIntelligence.color_properties
      );
      if (harmonyIssue) {
        result.issues.push(harmonyIssue);
        // Harmony violations are warnings, not errors
      }

      // Lookup contrast ratio
      const contrastInfo = lookupContrastRatio(
        background,
        foreground,
        contrastMatrix
      );

      if (contrastInfo) {
        result.ratio = contrastInfo.ratio;
        result.level = contrastInfo.level as "AAA" | "AA" | "FAIL";

        // Check context-specific requirements
        const requiredRatio = context === "badge" ? 7.0 : 4.5;
        const requiredLevel = context === "badge" ? "AAA" : "AA";

        if (contrastInfo.ratio < requiredRatio) {
          result.valid = false;
          result.issues.push({
            type: "contrast",
            severity: "error",
            message: `Contrast ratio ${contrastInfo.ratio}:1 does not meet ${requiredLevel} requirement (${requiredRatio}:1)${context === "badge" ? " for small badge text" : ""}`,
            fix: `Use a higher contrast foreground color on ${background}`,
          });
        }
      }

      // Build suggestion if invalid
      if (!result.valid) {
        const fixes = result.issues
          .filter((i) => i.fix)
          .map((i) => i.fix)
          .join("; ");
        result.suggestion = fixes || "Review the issues and adjust color choices";
      }

      // Format response
      let text = `# Color Validation: ${background} + ${foreground}\n\n`;
      text += `**Valid:** ${result.valid ? "Yes" : "No"}\n`;

      if (result.ratio !== undefined) {
        const emoji =
          result.level === "AAA" ? "AAA" : result.level === "AA" ? "AA" : "FAIL";
        text += `**Contrast Ratio:** ${result.ratio}:1 (${emoji})\n`;
      }

      if (context) {
        text += `**Context:** ${context}${context === "badge" ? " (requires AAA 7:1)" : ""}\n`;
      }

      if (result.issues.length > 0) {
        text += `\n## Issues\n`;
        for (const issue of result.issues) {
          const icon = issue.severity === "error" ? "ERROR" : "WARN";
          text += `\n### ${icon}: ${issue.type}\n`;
          text += `${issue.message}\n`;
          if (issue.fix) {
            text += `**Fix:** ${issue.fix}\n`;
          }
        }
      } else {
        text += `\n## No Issues\nThis color combination is valid.\n`;
      }

      if (result.suggestion) {
        text += `\n## Suggestion\n${result.suggestion}\n`;
      }

      return {
        content: [{ type: "text" as const, text }],
      };
    }
  );
}
