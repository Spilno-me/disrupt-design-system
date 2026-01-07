#!/usr/bin/env node
/**
 * @dds/mcp - MCP Server for Disrupt Design System
 *
 * Provides AI assistants with intelligent access to:
 * - Component metadata (props, variants, status)
 * - Design tokens (colors, spacing, typography)
 * - Color guidance (semantic colors, contrast requirements)
 * - Design philosophy (Wu Wei engineering + MAYA UX principles)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Import color intelligence tools
import { registerColorRecommendationTool } from "./tools/colorRecommendation.js";
import { registerColorHarmonyTool } from "./tools/colorHarmony.js";
import { registerColorValidationTool } from "./tools/colorValidation.js";
import { registerGlassRulesTool } from "./tools/glassRules.js";

// =============================================================================
// SETUP
// =============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find the DDS root directory (parent of mcp/)
const DDS_ROOT = join(__dirname, "../..");
const CLAUDE_DIR = join(DDS_ROOT, ".claude");
const DATA_DIR = join(DDS_ROOT, "src/data");

// Load JSON files from .claude directory
function loadJSON<T>(filename: string): T | null {
  const filepath = join(CLAUDE_DIR, filename);
  if (!existsSync(filepath)) {
    console.error(`File not found: ${filepath}`);
    return null;
  }
  try {
    const content = readFileSync(filepath, "utf-8");
    return JSON.parse(content) as T;
  } catch (e) {
    console.error(`Error loading ${filename}:`, e);
    return null;
  }
}

// Load JSON files from src/data directory
function loadDataJSON<T>(filename: string): T | null {
  const filepath = join(DATA_DIR, filename);
  if (!existsSync(filepath)) {
    console.error(`File not found: ${filepath}`);
    return null;
  }
  try {
    const content = readFileSync(filepath, "utf-8");
    return JSON.parse(content) as T;
  } catch (e) {
    console.error(`Error loading ${filename}:`, e);
    return null;
  }
}

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface ComponentInfo {
  path: string;
  type: "ATOM" | "MOLECULE" | "ORGANISM" | "PAGE";
  status: string;
  testId?: string;
  variants?: string[];
  subs?: string[];
  features?: string[];
  for?: string;
}

interface PhilosophyRules {
  name: string;
  principle: string;
  rules: Record<string, { do: string; dont: string; test: string }>;
  quote: string;
}

interface EngineeringPhilosophy extends PhilosophyRules {
  preCommitChecklist: string[];
}

interface UXPhilosophy extends PhilosophyRules {
  origin: string;
  applicationAreas: string[];
  preDesignChecklist: string[];
}

interface EngagementPhilosophy extends PhilosophyRules {
  fullGuide: string;
  preWorkChecklist: string[];
  duringWorkChecklist: string[];
  endingChecklist: string[];
  metaPrinciple: string;
}

interface AgentContext {
  meta: {
    project: string;
    version: string;
    designPhilosophy: string;
    engineeringPhilosophy: string;
    uxPhilosophy: string;
    engagementPhilosophy?: string;
  };
  criticalRules: {
    engineeringPhilosophy: EngineeringPhilosophy;
    uxPhilosophy: UXPhilosophy;
    engagementPhilosophy?: EngagementPhilosophy;
    tokens: {
      forbidden: string[];
      required: string;
      colorMatrix: {
        workflow: string[];
        goldenRule: string;
      };
    };
  };
  colors: {
    brand: Record<string, { class: string; hex: string; name: string }>;
    semantic: Record<string, { class: string; hex: string }>;
    surfaces: Record<string, { class: string; hex: string }>;
    text: Record<string, { class: string; hex: string }>;
    border: Record<string, { class: string; hex: string }>;
  };
  shadows: {
    rule: string;
    lookup: Record<string, { use: string; examples: string }>;
    values: Record<string, string>;
  };
  radius: Record<string, string>;
  motion: {
    duration: {
      productive: Record<string, { value: string; use: string }>;
      expressive: Record<string, { value: string; use: string }>;
    };
    easing: Record<string, { value: string; use: string }>;
    delay: Record<string, { value: string; use: string }>;
    cssVars: {
      duration: string[];
      easing: string[];
      delay: string[];
    };
    guidelines: Record<string, string>;
  };
  typography: Record<string, unknown>;
  spacing: Record<string, unknown>;
  components: {
    registry: {
      ui: Record<string, ComponentInfo>;
      statusLegend: Record<string, string>;
    };
  };
}

interface ColorMatrixEntry {
  backgrounds: string[];
  text: string[];
  icons: string[];
  borders: string[];
  forbidden?: string[];
}

interface ColorMatrix {
  categories: Record<string, ColorMatrixEntry>;
  goldenRule: string;
}

interface ContrastEntry {
  foreground?: string;
  background?: string;
  ratio: number;
  level: string;
  pass: boolean;
}

interface ContrastMatrix {
  _meta: {
    generated: string;
    source: string;
    originalCount: number;
    deduplicatedCount: number;
    note: string;
  };
  wcagRequirements: {
    "AA-normal-text": number;
    "AA-large-text": number;
    "AAA-normal-text": number;
  };
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

// Color Intelligence types (from src/data/color-intelligence.json)
interface ColorIntelligence {
  _meta: Record<string, unknown>;
  contexts: Record<string, unknown>;
  boundaries: Record<string, unknown>;
  harmony_principles: Record<string, unknown>;
  color_properties: Record<string, {
    temperature: string;
    semantic: string | null;
    role: string;
    compatible_temps: string[];
    note?: string;
  }>;
  harmony_lookup: Record<string, {
    companions: string[];
    accents: string[];
    avoid: string[];
    avoid_reason: string;
  }>;
  glass: {
    depth1_elevated: GlassDepthConfig;
    depth2_card: GlassDepthConfig;
    depth3_surface: GlassDepthConfig;
    rules: {
      minOpacityForDirectText: number;
      minOpacityForSemanticText: number;
      belowMinOpacity: string;
      backdropBlurRequired: boolean;
      nestedGlass: string;
      textPlacementDecisionTree: string[];
    };
    examples: {
      correct: string[];
      forbidden: string[];
    };
  };
  forbidden: Array<{
    pattern: string;
    examples: string[];
    reason: string;
    exceptions?: Array<{ pattern: string; context: string; reason: string }>;
  }>;
  escapeHatch: Record<string, unknown>;
  composite_rules: Record<string, unknown>;
}

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

// =============================================================================
// DATA LOADERS
// =============================================================================

const agentContext = loadJSON<AgentContext>("agent-context.json");
const colorMatrix = loadJSON<ColorMatrix>("color-matrix.json");
const contrastMatrix = loadJSON<ContrastMatrix>("contrast-matrix.json");
const colorIntelligence = loadDataJSON<ColorIntelligence>("color-intelligence.json");

// =============================================================================
// MCP SERVER
// =============================================================================

const server = new McpServer({
  name: "dds-mcp",
  version: "1.0.0",
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatComponentResponse(name: string, component: ComponentInfo) {
  const statusLegend = agentContext?.components.registry.statusLegend || {};
  const statusDesc = statusLegend[component.status] || component.status;

  let response = `# ${name}\n\n`;
  response += `**Path:** src/components/${component.path}\n`;
  response += `**Type:** ${component.type}\n`;
  response += `**Status:** ${component.status} - ${statusDesc}\n`;

  if (component.testId) {
    response += `**Test ID:** ${component.testId}\n`;
  }

  if (component.variants) {
    response += `\n## Variants\n${component.variants.map((v) => `- ${v}`).join("\n")}\n`;
  }

  if (component.subs) {
    response += `\n## Sub-components\n${component.subs.map((s) => `- ${s}`).join("\n")}\n`;
  }

  if (component.features) {
    response += `\n## Features\n${component.features.map((f) => `- ${f}`).join("\n")}\n`;
  }

  if (component.for) {
    response += `\n**Use case:** ${component.for}\n`;
  }

  return {
    content: [{ type: "text" as const, text: response }],
  };
}

// =============================================================================
// TOOL: get_component
// =============================================================================

server.tool(
  "get_component",
  "Get detailed information about a DDS component including its props, variants, status, and usage guidelines.",
  { name: z.string().describe("Component name (e.g., 'Button', 'Dialog', 'AppCard')") },
  async (args) => {
    if (!agentContext) {
      return { content: [{ type: "text" as const, text: "Error: Agent context not loaded" }] };
    }

    const registry = agentContext.components.registry.ui;
    const component = registry[args.name];

    if (!component) {
      const normalizedName = args.name.toLowerCase();
      const found = Object.entries(registry).find(
        ([key]) => key.toLowerCase() === normalizedName
      );

      if (!found) {
        const available = Object.keys(registry).join(", ");
        return {
          content: [{ type: "text" as const, text: `Component "${args.name}" not found. Available components: ${available}` }],
        };
      }

      const [actualName, actualComponent] = found;
      return formatComponentResponse(actualName, actualComponent);
    }

    return formatComponentResponse(args.name, component);
  }
);

// =============================================================================
// TOOL: search_components
// =============================================================================

server.tool(
  "search_components",
  "Search DDS components by name, type (ATOM/MOLECULE), or status",
  {
    query: z.string().optional().describe("Search term for component name"),
    type: z.enum(["ATOM", "MOLECULE", "ORGANISM", "PAGE"]).optional().describe("Filter by component type"),
    status: z.string().optional().describe("Filter by status (STABILIZED, TODO, FROZEN, etc.)"),
  },
  async (args) => {
    if (!agentContext) {
      return { content: [{ type: "text" as const, text: "Error: Agent context not loaded" }] };
    }

    const registry = agentContext.components.registry.ui;
    let results = Object.entries(registry);

    if (args.query) {
      const q = args.query.toLowerCase();
      results = results.filter(([name]) => name.toLowerCase().includes(q));
    }

    if (args.type) {
      results = results.filter(([, comp]) => comp.type === args.type);
    }

    if (args.status) {
      const s = args.status.toUpperCase();
      results = results.filter(([, comp]) => comp.status === s);
    }

    if (results.length === 0) {
      return { content: [{ type: "text" as const, text: "No components found matching your criteria." }] };
    }

    let response = `# Search Results (${results.length} components)\n\n`;
    for (const [name, comp] of results) {
      response += `## ${name}\n`;
      response += `- Type: ${comp.type}\n`;
      response += `- Status: ${comp.status}\n`;
      if (comp.variants) {
        response += `- Variants: ${comp.variants.join(", ")}\n`;
      }
      response += "\n";
    }

    return { content: [{ type: "text" as const, text: response }] };
  }
);

// =============================================================================
// TOOL: get_color_guidance
// =============================================================================

server.tool(
  "get_color_guidance",
  "Get color usage guidance for a specific background type or semantic meaning. Returns allowed text, icon, and border colors.",
  {
    category: z.string().describe("Color category (e.g., 'dark_backgrounds', 'light_backgrounds', 'accent_backgrounds', 'semantic_error')"),
  },
  async (args) => {
    if (!colorMatrix) {
      if (!agentContext) {
        return { content: [{ type: "text" as const, text: "Error: Color data not loaded" }] };
      }

      const colors = agentContext.colors;
      let response = "# DDS Color Palette\n\n";

      response += "## Brand Colors\n";
      for (const [name, info] of Object.entries(colors.brand)) {
        response += `- **${name}**: ${info.class} (${info.name}, ${info.hex})\n`;
      }

      response += "\n## Semantic Colors\n";
      for (const [name, info] of Object.entries(colors.semantic)) {
        response += `- **${name}**: ${info.class} (${info.hex})\n`;
      }

      response += "\n## Text Colors\n";
      for (const [name, info] of Object.entries(colors.text)) {
        response += `- **${name}**: ${info.class} (${info.hex})\n`;
      }

      return { content: [{ type: "text" as const, text: response }] };
    }

    const normalizedCategory = args.category.toLowerCase().replace(/\s+/g, "_");
    const entry = colorMatrix.categories?.[normalizedCategory];

    if (!entry) {
      const available = Object.keys(colorMatrix.categories || {}).join(", ");
      return {
        content: [{ type: "text" as const, text: `Category "${args.category}" not found. Available: ${available}` }],
      };
    }

    let response = `# Color Guidance: ${args.category}\n\n`;
    response += `**Golden Rule:** ${colorMatrix.goldenRule}\n\n`;

    if (entry.backgrounds) {
      response += `## Backgrounds\n${entry.backgrounds.map((b) => `- ${b}`).join("\n")}\n\n`;
    }

    if (entry.text) {
      response += `## Text Colors\n${entry.text.map((t) => `- ${t}`).join("\n")}\n\n`;
    }

    if (entry.icons) {
      response += `## Icon Colors\n${entry.icons.map((i) => `- ${i}`).join("\n")}\n\n`;
    }

    if (entry.borders) {
      response += `## Border Colors\n${entry.borders.map((b) => `- ${b}`).join("\n")}\n\n`;
    }

    if (entry.forbidden) {
      response += `## FORBIDDEN\n${entry.forbidden.map((f) => `- ${f}`).join("\n")}\n`;
    }

    return { content: [{ type: "text" as const, text: response }] };
  }
);

// =============================================================================
// TOOL: get_design_tokens
// =============================================================================

server.tool(
  "get_design_tokens",
  "Get design token values for colors, shadows, radius, motion, spacing, or typography",
  {
    category: z.enum(["colors", "shadows", "radius", "motion", "typography", "spacing"]).describe("Token category to retrieve"),
  },
  async (args) => {
    if (!agentContext) {
      return { content: [{ type: "text" as const, text: "Error: Agent context not loaded" }] };
    }

    let response = `# DDS ${args.category.charAt(0).toUpperCase() + args.category.slice(1)} Tokens\n\n`;

    switch (args.category) {
      case "colors": {
        const colors = agentContext.colors;
        response += "## Brand\n";
        for (const [name, info] of Object.entries(colors.brand)) {
          response += `- **${name}**: \`${info.class}\` -> ${info.hex} (${info.name})\n`;
        }
        response += "\n## Semantic\n";
        for (const [name, info] of Object.entries(colors.semantic)) {
          response += `- **${name}**: \`${info.class}\` -> ${info.hex}\n`;
        }
        response += "\n## Surfaces\n";
        for (const [name, info] of Object.entries(colors.surfaces)) {
          response += `- **${name}**: \`${info.class}\` -> ${info.hex}\n`;
        }
        response += "\n## Text\n";
        for (const [name, info] of Object.entries(colors.text)) {
          response += `- **${name}**: \`${info.class}\` -> ${info.hex}\n`;
        }
        break;
      }

      case "shadows": {
        const shadows = agentContext.shadows;
        response += `**Rule:** ${shadows.rule}\n\n`;
        for (const [name, info] of Object.entries(shadows.lookup)) {
          response += `## shadow-${name}\n`;
          response += `- **Use for:** ${info.use}\n`;
          response += `- **Examples:** ${info.examples}\n`;
          response += `- **Value:** \`${shadows.values[name]}\`\n\n`;
        }
        break;
      }

      case "radius": {
        response += "| Token | Value |\n|-------|-------|\n";
        for (const [name, value] of Object.entries(agentContext.radius)) {
          response += `| rounded-${name} | ${value} |\n`;
        }
        break;
      }

      case "motion": {
        const motion = agentContext.motion;
        response += "## Duration: Productive (functional)\n";
        response += "| Token | Value | Use Case |\n|-------|-------|----------|\n";
        for (const [name, info] of Object.entries(motion.duration.productive)) {
          response += `| --motion-duration-productive-${name} | ${info.value} | ${info.use} |\n`;
        }

        response += "\n## Duration: Expressive (delightful)\n";
        response += "| Token | Value | Use Case |\n|-------|-------|----------|\n";
        for (const [name, info] of Object.entries(motion.duration.expressive)) {
          response += `| --motion-duration-expressive-${name} | ${info.value} | ${info.use} |\n`;
        }

        response += "\n## Easing Curves\n";
        response += "| Token | Value | Use Case |\n|-------|-------|----------|\n";
        for (const [name, info] of Object.entries(motion.easing)) {
          response += `| --motion-easing-${name} | ${info.value} | ${info.use} |\n`;
        }

        response += "\n## Delay\n";
        response += "| Token | Value | Use Case |\n|-------|-------|----------|\n";
        for (const [name, info] of Object.entries(motion.delay)) {
          response += `| --motion-delay-${name} | ${info.value} | ${info.use} |\n`;
        }

        response += "\n## Guidelines\n";
        for (const [name, guideline] of Object.entries(motion.guidelines)) {
          response += `- **${name}**: ${guideline}\n`;
        }
        break;
      }

      case "typography": {
        const typo = agentContext.typography;
        response += JSON.stringify(typo, null, 2);
        break;
      }

      case "spacing": {
        const spacing = agentContext.spacing;
        response += JSON.stringify(spacing, null, 2);
        break;
      }
    }

    return { content: [{ type: "text" as const, text: response }] };
  }
);

// =============================================================================
// TOOL: get_design_philosophy
// =============================================================================

server.tool(
  "get_design_philosophy",
  "Get DDS design philosophy and principles (Wu Wei engineering + MAYA UX + Quality of Engagement)",
  {},
  async () => {
    if (!agentContext) {
      return { content: [{ type: "text" as const, text: "Error: Agent context not loaded" }] };
    }

    let response = "# DDS Design Philosophy\n\n";
    response += "DDS is guided by three complementary principles:\n";
    response += "- **Wu Wei (無為)** - Engineering philosophy: work with the grain\n";
    response += "- **MAYA** - UX philosophy: innovate within acceptance\n";
    response += "- **Quality of Engagement (QoE)** - Process philosophy: how we work\n\n";
    response += "---\n\n";

    // Wu Wei - Engineering Philosophy
    const wuWei = agentContext.criticalRules.engineeringPhilosophy;
    response += `# ${wuWei.name}\n\n`;
    response += `**Principle:** ${wuWei.principle}\n\n`;
    response += `> "${wuWei.quote}"\n\n`;

    response += "## Rules\n\n";
    for (const [name, rule] of Object.entries(wuWei.rules)) {
      response += `### ${name}\n`;
      response += `- **Do:** ${rule.do}\n`;
      response += `- **Dont:** ${rule.dont}\n`;
      response += `- **Test:** ${rule.test}\n\n`;
    }

    response += "## Pre-Commit Checklist\n";
    for (const item of wuWei.preCommitChecklist) {
      response += `- [ ] ${item}\n`;
    }

    response += "\n---\n\n";

    // MAYA - UX Philosophy
    const maya = agentContext.criticalRules.uxPhilosophy;
    response += `# ${maya.name}\n\n`;
    response += `**Principle:** ${maya.principle}\n\n`;
    response += `**Origin:** ${maya.origin}\n\n`;
    response += `> "${maya.quote}"\n\n`;

    response += "## Rules\n\n";
    for (const [name, rule] of Object.entries(maya.rules)) {
      response += `### ${name}\n`;
      response += `- **Do:** ${rule.do}\n`;
      response += `- **Dont:** ${rule.dont}\n`;
      response += `- **Test:** ${rule.test}\n\n`;
    }

    response += "## Application Areas\n";
    for (const area of maya.applicationAreas) {
      response += `- ${area}\n`;
    }

    response += "\n## Pre-Design Checklist\n";
    for (const item of maya.preDesignChecklist) {
      response += `- [ ] ${item}\n`;
    }

    response += "\n---\n\n";

    // Quality of Engagement - Process Philosophy
    const qoe = agentContext.criticalRules.engagementPhilosophy;
    if (qoe) {
      response += `# ${qoe.name}\n\n`;
      response += `**Principle:** ${qoe.principle}\n\n`;
      response += `> "${qoe.quote}"\n\n`;
      response += `**Full Guide:** ${qoe.fullGuide}\n\n`;

      response += "## 13 Principles\n\n";
      for (const [name, rule] of Object.entries(qoe.rules)) {
        response += `### ${name}\n`;
        response += `- **Do:** ${rule.do}\n`;
        response += `- **Dont:** ${rule.dont}\n`;
        response += `- **Test:** ${rule.test}\n\n`;
      }

      response += "## Pre-Work Checklist\n";
      for (const item of qoe.preWorkChecklist) {
        response += `- [ ] ${item}\n`;
      }

      response += "\n## During Work Checklist\n";
      for (const item of qoe.duringWorkChecklist) {
        response += `- [ ] ${item}\n`;
      }

      response += "\n## Ending Checklist\n";
      for (const item of qoe.endingChecklist) {
        response += `- [ ] ${item}\n`;
      }

      response += `\n## Meta-Principle\n${qoe.metaPrinciple}\n`;
    }

    return { content: [{ type: "text" as const, text: response }] };
  }
);

// =============================================================================
// TOOL: check_token_usage
// =============================================================================

server.tool(
  "check_token_usage",
  "Check if a color/token usage is valid according to DDS rules. Returns whether it is allowed and suggestions if not.",
  {
    token: z.string().describe("The token or class to check (e.g., 'bg-blue-500', 'text-primary', '#FF0000')"),
  },
  async (args) => {
    if (!agentContext) {
      return { content: [{ type: "text" as const, text: "Error: Agent context not loaded" }] };
    }

    const forbidden = agentContext.criticalRules.tokens.forbidden;
    const isForbidden = forbidden.some(
      (f) =>
        args.token.includes(f) ||
        (f.includes("bg-") &&
          /bg-[a-z]+-\d+/.test(args.token) &&
          !args.token.startsWith("bg-surface") &&
          !args.token.startsWith("bg-accent") &&
          !args.token.startsWith("bg-error")) ||
        (f.includes("text-") &&
          /text-[a-z]+-\d+/.test(args.token) &&
          !args.token.startsWith("text-primary") &&
          !args.token.startsWith("text-secondary"))
    );

    if (isForbidden || /^#[0-9A-Fa-f]{3,8}$/.test(args.token) || /^rgb/.test(args.token) || /^hsl/.test(args.token)) {
      return {
        content: [{
          type: "text" as const,
          text: `**FORBIDDEN**: "${args.token}" is not allowed in DDS.\n\n**Reason:** ${agentContext.criticalRules.tokens.required}\n\n**Forbidden patterns:** ${forbidden.join(", ")}\n\n**Use semantic tokens instead:** bg-surface, bg-accent, text-primary, text-error, etc.`,
        }],
      };
    }

    return {
      content: [{
        type: "text" as const,
        text: `**ALLOWED**: "${args.token}" appears to be a valid DDS token.\n\n**Remember:**\n- Semantic first (text-warning, bg-error)\n- Contextual second (text-primary, bg-surface)\n- Primitive last (only when no semantic fit)`,
      }],
    };
  }
);

// =============================================================================
// TOOL: check_contrast
// =============================================================================

server.tool(
  "check_contrast",
  "Check WCAG contrast ratio between two colors. Returns ratio, compliance level (AAA/AA/FAIL), and pass status.",
  {
    background: z.string().describe("Background color token (e.g., 'ABYSS[900]', 'PRIMITIVES.white', 'SLATE[50]')"),
    foreground: z.string().describe("Foreground/text color token (e.g., 'PRIMITIVES.white', 'ABYSS[900]')"),
  },
  async (args) => {
    if (!contrastMatrix) {
      return { content: [{ type: "text" as const, text: "Error: Contrast matrix not loaded" }] };
    }

    const { background, foreground } = args;

    // Try direct lookup in byBackground
    const bgEntries = contrastMatrix.byBackground[background];
    if (bgEntries) {
      const match = bgEntries.find((e) => e.foreground === foreground);
      if (match) {
        const emoji = match.pass ? (match.level === "AAA" ? "✅" : "✓") : "❌";
        return {
          content: [{
            type: "text" as const,
            text: `# Contrast Check: ${background} → ${foreground}\n\n` +
              `${emoji} **Ratio:** ${match.ratio}:1\n` +
              `**Level:** ${match.level}\n` +
              `**WCAG Pass:** ${match.pass ? "Yes" : "No"}\n\n` +
              `## WCAG Requirements\n` +
              `- AA (normal text): 4.5:1\n` +
              `- AA (large text): 3.0:1\n` +
              `- AAA (normal text): 7.0:1`,
          }],
        };
      }
    }

    // Try reverse lookup (colors might be swapped)
    const fgEntries = contrastMatrix.byForeground[background];
    if (fgEntries) {
      const match = fgEntries.find((e) => e.background === foreground);
      if (match) {
        const emoji = match.pass ? (match.level === "AAA" ? "✅" : "✓") : "❌";
        return {
          content: [{
            type: "text" as const,
            text: `# Contrast Check: ${background} → ${foreground}\n\n` +
              `${emoji} **Ratio:** ${match.ratio}:1 (same as ${foreground} → ${background})\n` +
              `**Level:** ${match.level}\n` +
              `**WCAG Pass:** ${match.pass ? "Yes" : "No"}\n\n` +
              `## WCAG Requirements\n` +
              `- AA (normal text): 4.5:1\n` +
              `- AA (large text): 3.0:1\n` +
              `- AAA (normal text): 7.0:1`,
          }],
        };
      }
    }

    // Not found - list available colors
    const availableBgs = Object.keys(contrastMatrix.byBackground).slice(0, 20).join(", ");
    return {
      content: [{
        type: "text" as const,
        text: `**Not Found:** No contrast data for "${background}" → "${foreground}"\n\n` +
          `**Available backgrounds (sample):** ${availableBgs}...\n\n` +
          `**Tip:** Use exact token names like ABYSS[900], PRIMITIVES.white, SLATE[50]`,
      }],
    };
  }
);

// =============================================================================
// TOOL: get_accessible_colors
// =============================================================================

server.tool(
  "get_accessible_colors",
  "Find all colors that meet WCAG contrast requirements with a given background. Returns foreground colors sorted by contrast ratio.",
  {
    background: z.string().describe("Background color token (e.g., 'ABYSS[900]', 'PRIMITIVES.white')"),
    minLevel: z.enum(["AA", "AAA"]).optional().describe("Minimum WCAG level required (default: AA)"),
    limit: z.number().optional().describe("Maximum number of results (default: 10)"),
  },
  async (args) => {
    if (!contrastMatrix) {
      return { content: [{ type: "text" as const, text: "Error: Contrast matrix not loaded" }] };
    }

    const { background, minLevel = "AA", limit = 10 } = args;
    const minRatio = minLevel === "AAA" ? 7.0 : 4.5;

    // Try direct lookup
    let entries = contrastMatrix.byBackground[background];

    // If not found, try as foreground (since contrast is symmetric)
    if (!entries) {
      const fgEntries = contrastMatrix.byForeground[background];
      if (fgEntries) {
        entries = fgEntries.map((e) => ({
          foreground: e.background,
          ratio: e.ratio,
          level: e.level,
          pass: e.pass,
        }));
      }
    }

    if (!entries) {
      const availableBgs = Object.keys(contrastMatrix.byBackground).slice(0, 20).join(", ");
      return {
        content: [{
          type: "text" as const,
          text: `**Not Found:** No data for background "${background}"\n\n` +
            `**Available backgrounds (sample):** ${availableBgs}...`,
        }],
      };
    }

    // Filter by minimum level and limit
    const filtered = entries
      .filter((e) => e.ratio >= minRatio)
      .slice(0, limit);

    if (filtered.length === 0) {
      return {
        content: [{
          type: "text" as const,
          text: `**No colors found** meeting ${minLevel} requirements (${minRatio}:1) for background "${background}"\n\n` +
            `Try lowering to AA level or check if the background token is correct.`,
        }],
      };
    }

    let response = `# Accessible Colors for ${background}\n\n`;
    response += `**Minimum Level:** ${minLevel} (${minRatio}:1)\n`;
    response += `**Results:** ${filtered.length} colors\n\n`;
    response += `| Foreground | Ratio | Level |\n|------------|-------|-------|\n`;

    for (const entry of filtered) {
      const emoji = entry.level === "AAA" ? "✅" : "✓";
      response += `| ${entry.foreground} | ${emoji} ${entry.ratio}:1 | ${entry.level} |\n`;
    }

    response += `\n**Tip:** Higher ratios provide better readability and accessibility.`;

    return { content: [{ type: "text" as const, text: response }] };
  }
);

// =============================================================================
// TOOL: list_color_tokens
// =============================================================================

server.tool(
  "list_color_tokens",
  "List all available color tokens in the contrast matrix. Useful for discovering valid token names.",
  {
    filter: z.string().optional().describe("Filter tokens by name (e.g., 'ABYSS', 'PRIMITIVE', '900')"),
  },
  async (args) => {
    if (!contrastMatrix) {
      return { content: [{ type: "text" as const, text: "Error: Contrast matrix not loaded" }] };
    }

    let tokens = Object.keys(contrastMatrix.byBackground);

    if (args.filter) {
      const f = args.filter.toUpperCase();
      tokens = tokens.filter((t) => t.toUpperCase().includes(f));
    }

    if (tokens.length === 0) {
      return {
        content: [{
          type: "text" as const,
          text: `No tokens found matching "${args.filter}"`,
        }],
      };
    }

    // Group by family
    const families: Record<string, string[]> = {};
    for (const token of tokens) {
      const family = token.split("[")[0].split(".")[0];
      if (!families[family]) families[family] = [];
      families[family].push(token);
    }

    let response = `# Available Color Tokens\n\n`;
    response += `**Total:** ${tokens.length} tokens\n\n`;

    for (const [family, members] of Object.entries(families)) {
      response += `## ${family}\n`;
      response += members.map((m) => `- ${m}`).join("\n") + "\n\n";
    }

    return { content: [{ type: "text" as const, text: response }] };
  }
);

// =============================================================================
// COLOR INTELLIGENCE TOOLS
// =============================================================================

// Register color intelligence tools (from src/data/color-intelligence.json)
// These provide context-aware color recommendations, harmony rules, validation, and glass styling

// Cast to the expected types for the tool modules
const colorIntelligenceForTools = colorIntelligence as unknown as Parameters<typeof registerColorRecommendationTool>[1];
const colorIntelligenceForHarmony = colorIntelligence as unknown as Parameters<typeof registerColorHarmonyTool>[1];
const colorIntelligenceForValidation = colorIntelligence as unknown as Parameters<typeof registerColorValidationTool>[1];
const contrastMatrixForValidation = contrastMatrix as unknown as Parameters<typeof registerColorValidationTool>[2];
const colorIntelligenceForGlass = colorIntelligence as unknown as Parameters<typeof registerGlassRulesTool>[1];

// get_color_recommendation: Context-aware color token recommendations
registerColorRecommendationTool(server, colorIntelligenceForTools);

// get_color_harmony: Color harmony rules (companions, accents, avoid)
registerColorHarmonyTool(server, colorIntelligenceForHarmony);

// validate_color_choice: Validate foreground/background combinations
registerColorValidationTool(server, colorIntelligenceForValidation, contrastMatrixForValidation);

// get_glass_rules: Glass/frosted UI styling rules by depth
registerGlassRulesTool(server, colorIntelligenceForGlass);

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DDS MCP Server running on stdio");
}

main().catch(console.error);
