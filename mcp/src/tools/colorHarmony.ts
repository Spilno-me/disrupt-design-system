/**
 * Color Harmony Tool
 *
 * Provides color harmony recommendations based on color family
 * using harmony_lookup from color-intelligence.json
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// =============================================================================
// TYPES
// =============================================================================

interface HarmonyEntry {
  companions: string[];
  accents: string[];
  avoid: string[];
  avoid_reason: string;
}

interface ColorProperty {
  temperature: string;
  semantic: string | null;
  role: string;
  compatible_temps: string[];
  note?: string;
}

interface ColorIntelligence {
  harmony_lookup: Record<string, HarmonyEntry>;
  color_properties: Record<string, ColorProperty>;
}

// Valid color families
const VALID_FAMILIES = [
  "ABYSS",
  "DEEP_CURRENT",
  "WAVE",
  "HARBOR",
  "CORAL",
  "SUNRISE",
  "ORANGE",
  "SLATE",
  "LINEN",
  "IVORY",
  "DUSK_REEF",
] as const;

type ValidFamily = (typeof VALID_FAMILIES)[number];

// =============================================================================
// ERROR RESPONSES
// =============================================================================

interface ErrorResponse {
  error: string;
  code: string;
  did_you_mean?: string;
  valid_families?: readonly string[];
  suggestion?: string;
}

function findClosestFamily(input: string): string | undefined {
  const normalized = input.toUpperCase().replace(/[-_\s]/g, "_");

  // Exact match
  if (VALID_FAMILIES.includes(normalized as ValidFamily)) {
    return normalized;
  }

  // Partial match
  for (const family of VALID_FAMILIES) {
    if (family.includes(normalized) || normalized.includes(family)) {
      return family;
    }
  }

  // Fuzzy match (simple Levenshtein-like)
  const distances = VALID_FAMILIES.map((f) => ({
    family: f,
    distance: levenshteinDistance(normalized, f),
  }));
  const closest = distances.sort((a, b) => a.distance - b.distance)[0];

  if (closest.distance <= 3) {
    return closest.family;
  }

  return undefined;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function createUnknownColorError(color: string): ErrorResponse {
  const didYouMean = findClosestFamily(color);

  return {
    error: `Unknown color family: "${color}"`,
    code: "UNKNOWN_COLOR",
    did_you_mean: didYouMean,
    valid_families: VALID_FAMILIES,
    suggestion: didYouMean
      ? `Did you mean "${didYouMean}"?`
      : "Use one of the valid color families",
  };
}

function createMissingParamError(): ErrorResponse {
  return {
    error: "Missing required parameter: color",
    code: "MISSING_REQUIRED_PARAM",
    valid_families: VALID_FAMILIES,
    suggestion: 'Provide a color family name like "CORAL" or "DEEP_CURRENT"',
  };
}

// =============================================================================
// HARMONY RESPONSE
// =============================================================================

interface HarmonyResponse {
  color: string;
  temperature: string;
  semantic: string | null;
  role: string;
  companions: CompanionInfo[];
  accents: AccentInfo[];
  avoid: AvoidInfo[];
}

interface CompanionInfo {
  family: string;
  relationship: string;
}

interface AccentInfo {
  family: string;
  usage: string;
}

interface AvoidInfo {
  family: string;
  reason: string;
}

function buildHarmonyResponse(
  family: string,
  harmony: HarmonyEntry,
  properties: ColorProperty
): HarmonyResponse {
  return {
    color: family,
    temperature: properties.temperature,
    semantic: properties.semantic,
    role: properties.role,
    companions: harmony.companions.map((c) => ({
      family: c,
      relationship: "Temperature-compatible, visually harmonious",
    })),
    accents: harmony.accents.map((a) => ({
      family: a,
      usage: "Accent/highlight color (< 20% of composition)",
    })),
    avoid: harmony.avoid.map((a) => ({
      family: a,
      reason: harmony.avoid_reason,
    })),
  };
}

// =============================================================================
// TOOL REGISTRATION
// =============================================================================

export function registerColorHarmonyTool(
  server: McpServer,
  colorIntelligence: ColorIntelligence | null
) {
  server.tool(
    "get_color_harmony",
    "Get color harmony information for a color family. Returns compatible companions, accent colors, and colors to avoid with reasons.",
    {
      color: z
        .string()
        .describe(
          'Color family name (e.g., "CORAL", "DEEP_CURRENT", "ABYSS", "HARBOR")'
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

      const { color } = args;

      if (!color) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(createMissingParamError(), null, 2),
            },
          ],
        };
      }

      // Normalize input
      const normalizedColor = color.toUpperCase().replace(/[-\s]/g, "_");

      // Check if valid family
      const harmonyEntry = colorIntelligence.harmony_lookup[normalizedColor];
      const colorProps = colorIntelligence.color_properties[normalizedColor];

      if (!harmonyEntry || !colorProps) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(createUnknownColorError(color), null, 2),
            },
          ],
        };
      }

      // Build response
      const response = buildHarmonyResponse(
        normalizedColor,
        harmonyEntry,
        colorProps
      );

      // Format as readable text
      let text = `# Color Harmony: ${response.color}\n\n`;
      text += `**Temperature:** ${response.temperature}\n`;
      text += `**Semantic:** ${response.semantic || "none"}\n`;
      text += `**Role:** ${response.role}\n\n`;

      text += `## Companions (harmonious combinations)\n`;
      for (const comp of response.companions) {
        text += `- **${comp.family}**: ${comp.relationship}\n`;
      }

      text += `\n## Accents (highlight colors)\n`;
      for (const acc of response.accents) {
        text += `- **${acc.family}**: ${acc.usage}\n`;
      }

      if (response.avoid.length > 0) {
        text += `\n## Avoid (problematic combinations)\n`;
        for (const av of response.avoid) {
          text += `- **${av.family}**: ${av.reason}\n`;
        }
      } else {
        text += `\n## Avoid\nNo restrictions - neutral color works with all temperatures.\n`;
      }

      return {
        content: [{ type: "text" as const, text }],
      };
    }
  );
}
