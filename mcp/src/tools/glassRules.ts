/**
 * Glass Rules Tool
 *
 * Provides glass/frosted UI styling rules for different depth levels.
 * Based on the glass section of color-intelligence.json
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// =============================================================================
// TYPES
// =============================================================================

interface GlassDepthConfig {
  opacity: number;
  blur: string;
  light: string;
  dark: string;
  border?: string;
  textStrategy: string;
  textColor: string;
  notes: string;
}

interface GlassRules {
  minOpacityForDirectText: number;
  minOpacityForSemanticText: number;
  belowMinOpacity: string;
  backdropBlurRequired: boolean;
  nestedGlass: string;
  textPlacementDecisionTree: string[];
}

interface GlassExamples {
  correct: string[];
  forbidden: string[];
}

interface GlassConfig {
  depth1_elevated: GlassDepthConfig;
  depth2_card: GlassDepthConfig;
  depth3_surface: GlassDepthConfig;
  rules: GlassRules;
  examples: GlassExamples;
}

interface ColorIntelligence {
  glass: GlassConfig;
}

// Valid depths
const VALID_DEPTHS = [1, 2, 3] as const;
type ValidDepth = (typeof VALID_DEPTHS)[number];

// Depth to config key mapping
const DEPTH_KEY_MAP: Record<ValidDepth, keyof GlassConfig> = {
  1: "depth1_elevated",
  2: "depth2_card",
  3: "depth3_surface",
};

// =============================================================================
// ERROR RESPONSES
// =============================================================================

interface ErrorResponse {
  error: string;
  code: string;
  valid_depths?: readonly number[];
  suggestion?: string;
  example?: string;
}

function createInvalidDepthError(depth: number): ErrorResponse {
  return {
    error: `Invalid depth: ${depth}`,
    code: "INVALID_DEPTH",
    valid_depths: VALID_DEPTHS,
    suggestion: "Use depth 1, 2, or 3",
    example: '{ "depth": 1 } for elevated modal/tooltip, { "depth": 2 } for cards, { "depth": 3 } for nested surfaces',
  };
}

function createMissingParamError(): ErrorResponse {
  return {
    error: "Missing required parameter: depth",
    code: "MISSING_REQUIRED_PARAM",
    valid_depths: VALID_DEPTHS,
    example: '{ "depth": 2 }',
  };
}

// =============================================================================
// RESPONSE BUILDING
// =============================================================================

interface GlassRulesResponse {
  depth: number;
  name: string;
  classes: {
    light: string;
    dark: string;
  };
  blur: string;
  opacity: number;
  border?: string;
  textStrategy: string;
  textGuidance: string;
  rationale: string;
  rules: {
    directTextMinOpacity: number;
    semanticTextMinOpacity: number;
    backdropBlurRequired: boolean;
    nestedGlassForbidden: boolean;
  };
  decisionTree: string[];
  examples: {
    correct: string[];
    forbidden: string[];
  };
}

function getDepthName(depth: ValidDepth): string {
  switch (depth) {
    case 1:
      return "Elevated (modals, tooltips, popovers)";
    case 2:
      return "Card (content cards, panels)";
    case 3:
      return "Surface (nested containers inside cards)";
  }
}

function buildGlassResponse(
  depth: ValidDepth,
  config: GlassDepthConfig,
  rules: GlassRules,
  examples: GlassExamples
): GlassRulesResponse {
  return {
    depth,
    name: getDepthName(depth),
    classes: {
      light: config.light,
      dark: config.dark,
    },
    blur: config.blur,
    opacity: config.opacity,
    border: config.border,
    textStrategy: config.textStrategy,
    textGuidance: config.textColor,
    rationale: config.notes,
    rules: {
      directTextMinOpacity: rules.minOpacityForDirectText,
      semanticTextMinOpacity: rules.minOpacityForSemanticText,
      backdropBlurRequired: rules.backdropBlurRequired,
      nestedGlassForbidden: true, // Always forbidden
    },
    decisionTree: rules.textPlacementDecisionTree,
    examples: {
      correct: examples.correct.filter((e) => e.includes(`/${config.opacity}`)),
      forbidden: examples.forbidden,
    },
  };
}

// =============================================================================
// TOOL REGISTRATION
// =============================================================================

export function registerGlassRulesTool(
  server: McpServer,
  colorIntelligence: ColorIntelligence | null
) {
  server.tool(
    "get_glass_rules",
    "Get glass/frosted UI styling rules for a specific depth level. Returns opacity, blur, border classes, and text placement strategy.",
    {
      depth: z
        .number()
        .int()
        .min(1)
        .max(3)
        .describe("Glass depth level: 1 (elevated/modal), 2 (card), 3 (surface)"),
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

      const { depth } = args;

      // Validate depth
      if (depth === undefined || depth === null) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(createMissingParamError(), null, 2),
            },
          ],
        };
      }

      if (!VALID_DEPTHS.includes(depth as ValidDepth)) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(createInvalidDepthError(depth), null, 2),
            },
          ],
        };
      }

      const validDepth = depth as ValidDepth;
      const configKey = DEPTH_KEY_MAP[validDepth];
      const glassConfig = colorIntelligence.glass;

      if (!glassConfig || !glassConfig[configKey]) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { error: "Glass configuration not found", code: "CONFIG_NOT_FOUND" },
                null,
                2
              ),
            },
          ],
        };
      }

      const depthConfig = glassConfig[configKey] as GlassDepthConfig;
      const rules = glassConfig.rules;
      const examples = glassConfig.examples;

      const response = buildGlassResponse(validDepth, depthConfig, rules, examples);

      // Format as readable text
      let text = `# Glass Rules: Depth ${response.depth}\n\n`;
      text += `**Name:** ${response.name}\n\n`;

      text += `## CSS Classes\n`;
      text += `- **Light mode:** \`${response.classes.light}\`\n`;
      text += `- **Dark mode:** \`${response.classes.dark}\`\n\n`;

      text += `## Properties\n`;
      text += `- **Opacity:** ${response.opacity}%\n`;
      text += `- **Blur:** ${response.blur}\n`;
      if (response.border) {
        text += `- **Border:** \`${response.border}\`\n`;
      }

      text += `\n## Text Strategy\n`;
      text += `**Strategy:** ${response.textStrategy}\n`;
      text += `**Guidance:** ${response.textGuidance}\n`;
      text += `**Rationale:** ${response.rationale}\n`;

      text += `\n## Text Placement Decision Tree\n`;
      for (const rule of response.decisionTree) {
        text += `- ${rule}\n`;
      }

      text += `\n## Rules\n`;
      text += `- Direct text requires opacity >= ${response.rules.directTextMinOpacity}%\n`;
      text += `- Semantic tokens require opacity >= ${response.rules.semanticTextMinOpacity}%\n`;
      text += `- Backdrop blur: ${response.rules.backdropBlurRequired ? "REQUIRED" : "optional"}\n`;
      text += `- Nested glass: ${response.rules.nestedGlassForbidden ? "FORBIDDEN" : "allowed"}\n`;

      if (response.examples.correct.length > 0) {
        text += `\n## Correct Examples\n`;
        for (const ex of response.examples.correct) {
          text += `- \`${ex}\`\n`;
        }
      }

      if (response.examples.forbidden.length > 0) {
        text += `\n## Forbidden Examples\n`;
        for (const ex of response.examples.forbidden) {
          text += `- \`${ex}\`\n`;
        }
      }

      return {
        content: [{ type: "text" as const, text }],
      };
    }
  );
}
