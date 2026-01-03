/**
 * Color Recommendation Tool
 *
 * Provides context-aware color recommendations based on the
 * color-intelligence.json data.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// =============================================================================
// TYPES
// =============================================================================

interface ColorIntelligence {
  contexts: Record<string, ContextDefinition>;
  boundaries: Record<string, unknown>;
  harmony_principles: Record<string, unknown>;
  color_properties: Record<string, ColorProperty>;
  harmony_lookup: Record<string, HarmonyEntry>;
  glass: Record<string, unknown>;
  forbidden: ForbiddenPattern[];
}

interface ContextDefinition {
  description: string;
  depth?: number;
  solid?: {
    light?: { bg: string; hex: string };
    dark?: { bg: string; hex: string };
  };
  light?: { bg: string; hex: string };
  dark?: { bg: string; hex: string };
  glass?: {
    light?: string;
    dark?: string;
  };
  text?: Record<string, string>;
  border?: string;
  shadow?: string;
  note?: string;
  variants?: Record<string, Record<string, string>>;
  states?: Record<string, Record<string, string>>;
  transition?: Record<string, string>;
  default?: Record<string, string>;
  placeholder?: Record<string, string>;
  focus?: Record<string, string>;
  error?: Record<string, string>;
  disabled?: Record<string, string>;
  readonly?: Record<string, string>;
  item?: Record<string, Record<string, string>>;
  divider?: string;
  scrim?: string;
  hover?: Record<string, string>;
  selected?: Record<string, string>;
  striped?: Record<string, string>;
  loading?: Record<string, string>;
  sizes?: Record<string, string>;
  // DataViz specific
  categorical?: {
    description: string;
    palette: Array<{ token: string; hex: string; role: string }>;
    rules: Record<string, unknown>;
  };
  sequential?: Record<string, {
    family: string;
    scale: string[];
    hexScale: string[];
    usage: string;
  }>;
  diverging?: {
    description: string;
    scale: Array<{ token: string; hex: string; meaning: string }>;
    neutralPoint: string;
    usage: string;
  };
  accessibility?: Record<string, string>;
}

interface ColorProperty {
  temperature: string;
  semantic: string | null;
  role: string;
  compatible_temps: string[];
  note?: string;
}

interface HarmonyEntry {
  companions: string[];
  accents: string[];
  avoid: string[];
  avoid_reason: string;
}

interface ForbiddenPattern {
  pattern: string;
  examples: string[];
  reason: string;
  exceptions?: Array<{ pattern: string; context: string; reason: string }>;
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
    suggestion: "Use 'default' for unknown contexts",
    valid_contexts: VALID_CONTEXTS,
  };
}

function createMissingParamError(param: string): ErrorResponse {
  return {
    error: `Missing required parameter: ${param}`,
    code: "MISSING_REQUIRED_PARAM",
    example: `{ "context": "card", "theme": "light" }`,
  };
}

// =============================================================================
// RECOMMENDATION BUILDERS
// =============================================================================

interface Recommendation {
  context: string;
  theme: string;
  description: string;
  tokens: TokenRecommendation[];
  note?: string;
  accessibility?: Record<string, string>;
}

interface TokenRecommendation {
  category: string;
  token: string;
  hex?: string;
  rationale: string;
  priority: "primary" | "secondary" | "optional";
}

function buildDataVizRecommendation(
  contextData: ContextDefinition,
  element?: string
): Recommendation {
  const tokens: TokenRecommendation[] = [];

  if (!element || element === "categorical") {
    // Return categorical palette
    if (contextData.categorical?.palette) {
      for (const color of contextData.categorical.palette) {
        tokens.push({
          category: "categorical",
          token: color.token,
          hex: color.hex,
          rationale: `${color.role} - distinct category color`,
          priority: "primary",
        });
      }
    }
  }

  if (element === "sequential" || (!element && contextData.sequential)) {
    // Return sequential scales
    for (const [name, scale] of Object.entries(contextData.sequential || {})) {
      tokens.push({
        category: `sequential-${name}`,
        token: scale.scale.join(" -> "),
        rationale: scale.usage,
        priority: name === "cool" ? "primary" : "secondary",
      });
    }
  }

  if (element === "diverging" || (!element && contextData.diverging)) {
    // Return diverging scale
    const diverging = contextData.diverging;
    if (diverging) {
      const scaleTokens = diverging.scale.map((s) => s.token).join(" -> ");
      tokens.push({
        category: "diverging",
        token: scaleTokens,
        rationale: diverging.usage,
        priority: "primary",
      });
    }
  }

  return {
    context: "dataViz",
    theme: "both",
    description: contextData.description,
    tokens,
    note:
      element === "sequential"
        ? "Use cool (DEEP_CURRENT) for neutral data, warm (CORAL) for urgent/negative, success (HARBOR) for positive"
        : element === "diverging"
          ? "Centered on neutral (SLATE[200]) with red=negative, green=positive"
          : "Max 6 categories; use patterns for more",
    accessibility: contextData.accessibility,
  };
}

function buildContextRecommendation(
  context: ValidContext,
  contextData: ContextDefinition,
  theme: "light" | "dark"
): Recommendation {
  const tokens: TokenRecommendation[] = [];

  // Background tokens
  if (contextData.solid) {
    const themeBg = contextData.solid[theme];
    if (themeBg) {
      tokens.push({
        category: "background",
        token: themeBg.bg,
        hex: themeBg.hex,
        rationale: `Solid ${theme} mode background for ${context}`,
        priority: "primary",
      });
    }
  } else if (contextData[theme]) {
    const themeBg = contextData[theme] as { bg: string; hex: string };
    tokens.push({
      category: "background",
      token: themeBg.bg,
      hex: themeBg.hex,
      rationale: `${theme} mode background for ${context}`,
      priority: "primary",
    });
  }

  // Glass alternative (if available)
  if (contextData.glass?.[theme]) {
    tokens.push({
      category: "glass",
      token: contextData.glass[theme] as string,
      rationale: `Glass/frosted ${theme} mode alternative`,
      priority: "secondary",
    });
  }

  // Text tokens
  if (contextData.text) {
    for (const [role, token] of Object.entries(contextData.text)) {
      tokens.push({
        category: `text-${role}`,
        token: token as string,
        rationale: `${role} text color`,
        priority: role === "primary" ? "primary" : "secondary",
      });
    }
  }

  // Border tokens
  if (contextData.border) {
    tokens.push({
      category: "border",
      token: contextData.border,
      rationale: "Default border styling",
      priority: "secondary",
    });
  }

  // Shadow tokens
  if (contextData.shadow) {
    tokens.push({
      category: "shadow",
      token: contextData.shadow,
      rationale: `Elevation shadow for depth ${contextData.depth || "default"}`,
      priority: "optional",
    });
  }

  // Handle button variants
  if (context === "button" && contextData.variants) {
    for (const [variant, styles] of Object.entries(contextData.variants)) {
      const variantTokens = Object.entries(styles)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      tokens.push({
        category: `variant-${variant}`,
        token: variantTokens,
        rationale: `${variant} button variant`,
        priority: variant === "primary" ? "primary" : "secondary",
      });
    }
  }

  // Handle badge variants
  if (context === "badge" && contextData.variants) {
    for (const [variant, styles] of Object.entries(contextData.variants)) {
      const variantTokens = Object.entries(styles)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      tokens.push({
        category: `variant-${variant}`,
        token: variantTokens,
        rationale: `${variant} badge variant (requires AAA 7:1 for small text)`,
        priority: variant === "default" ? "primary" : "secondary",
      });
    }
  }

  // Handle input states
  if (context === "input") {
    if (contextData.default) {
      tokens.push({
        category: "default-state",
        token: Object.entries(contextData.default)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", "),
        rationale: "Default input state",
        priority: "primary",
      });
    }
    if (contextData.focus) {
      tokens.push({
        category: "focus-state",
        token: Object.entries(contextData.focus)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", "),
        rationale: "Focus state styling",
        priority: "primary",
      });
    }
    if (contextData.error) {
      tokens.push({
        category: "error-state",
        token: Object.entries(contextData.error)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", "),
        rationale: "Error state styling",
        priority: "secondary",
      });
    }
  }

  // Handle navigation items
  if (context === "navigation" && contextData.item) {
    for (const [state, styles] of Object.entries(contextData.item)) {
      tokens.push({
        category: `nav-${state}`,
        token: Object.entries(styles)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", "),
        rationale: `Navigation item ${state} state`,
        priority: state === "active" ? "primary" : "secondary",
      });
    }
  }

  // Handle table row states
  if (context === "tableRow") {
    if (contextData.default) {
      tokens.push({
        category: "default",
        token: Object.entries(contextData.default)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", "),
        rationale: "Default row state",
        priority: "primary",
      });
    }
    if (contextData.hover) {
      tokens.push({
        category: "hover",
        token: Object.entries(contextData.hover)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", "),
        rationale: "Hover state",
        priority: "primary",
      });
    }
    if (contextData.selected) {
      tokens.push({
        category: "selected",
        token: Object.entries(contextData.selected)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", "),
        rationale: "Selected row state",
        priority: "primary",
      });
    }
  }

  // Handle status semantic colors
  if (context === "status") {
    for (const [status, styles] of Object.entries(contextData)) {
      if (typeof styles === "object" && status !== "description") {
        const statusStyles = styles as Record<string, string>;
        tokens.push({
          category: status,
          token: Object.entries(statusStyles)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", "),
          rationale: `${status} status indicator`,
          priority: status === "error" ? "primary" : "secondary",
        });
      }
    }
  }

  return {
    context,
    theme,
    description: contextData.description,
    tokens,
    note: contextData.note,
  };
}

// =============================================================================
// TOOL REGISTRATION
// =============================================================================

export function registerColorRecommendationTool(
  server: McpServer,
  colorIntelligence: ColorIntelligence | null
) {
  server.tool(
    "get_color_recommendation",
    "Get context-aware color recommendations. Supports 13 contexts: default, page, card, surface, modal, button, input, navigation, tooltip, tableRow, badge, status, dataViz. For dataViz, specify element as 'categorical', 'sequential', or 'diverging'.",
    {
      context: z
        .string()
        .describe(
          "UI context: default, page, card, surface, modal, button, input, navigation, tooltip, tableRow, badge, status, dataViz"
        ),
      theme: z
        .enum(["light", "dark"])
        .optional()
        .describe("Color theme (default: light)"),
      element: z
        .string()
        .optional()
        .describe(
          "For dataViz: categorical, sequential, diverging. For button/badge: variant name"
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

      const { context, theme = "light", element } = args;

      // Validate context
      if (!VALID_CONTEXTS.includes(context as ValidContext)) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(createUnknownContextError(context), null, 2),
            },
          ],
        };
      }

      const validContext = context as ValidContext;
      const contextData = colorIntelligence.contexts[validContext];

      if (!contextData) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(createUnknownContextError(context), null, 2),
            },
          ],
        };
      }

      // Handle dataViz specially
      if (validContext === "dataViz") {
        const recommendation = buildDataVizRecommendation(contextData, element);
        return {
          content: [
            { type: "text" as const, text: JSON.stringify(recommendation, null, 2) },
          ],
        };
      }

      // Build recommendation for other contexts
      const recommendation = buildContextRecommendation(
        validContext,
        contextData,
        theme
      );

      return {
        content: [
          { type: "text" as const, text: JSON.stringify(recommendation, null, 2) },
        ],
      };
    }
  );
}
