// Auto-generated - DO NOT EDIT
// Generated from: src/data/color-intelligence.json
// Generated at: 2026-01-03T13:00:07.403Z

/** All available context names (13 total) */
export type ContextName = 'default' | 'page' | 'card' | 'surface' | 'modal' | 'button' | 'input' | 'navigation' | 'tooltip' | 'tableRow' | 'badge' | 'status' | 'dataViz';

/** Theme variants */
export type Theme = 'light' | 'dark';

/** Color families (11 total) */
export type ColorFamily = 'ABYSS' | 'DEEP_CURRENT' | 'WAVE' | 'HARBOR' | 'CORAL' | 'SUNRISE' | 'ORANGE' | 'SLATE' | 'LINEN' | 'IVORY' | 'DUSK_REEF';

/** Color temperature classifications */
export type Temperature = 'cool' | 'neutral-cool' | 'neutral' | 'neutral-warm' | 'warm';

/** Semantic color meanings */
export type SemanticMeaning = 'brand' | 'error' | 'warning' | 'success' | 'info' | 'highlight' | null;

/** Glass morphism rules */
export interface GlassRules {
  minOpacityForDirectText: number;
  minOpacityForSemanticText: number;
  belowMinOpacity: string;
  backdropBlurRequired: boolean;
  nestedGlass: string;
  textPlacementDecisionTree: string[];
}

/** Individual glass depth configuration */
export interface GlassDepth {
  opacity: number;
  blur: string;
  light: string;
  dark: string;
  textStrategy: string;
  textColor: string;
  notes: string;
  border?: string;
}

/** Harmony lookup entry for a color family */
export interface HarmonyEntry {
  companions: ColorFamily[];
  accents: ColorFamily[];
  avoid: ColorFamily[];
  avoid_reason: string;
}

/** Full harmony lookup table */
export interface HarmonyLookup {
  _note?: string;
  [family: string]: HarmonyEntry | string | undefined;
}

/** Color context configuration */
export interface ColorContext {
  description: string;
  depth?: number;
  solid?: {
    light: { bg: string; hex: string };
    dark: { bg: string; hex: string };
  };
  glass?: {
    light: string;
    dark: string;
  };
  text?: {
    primary: string;
    secondary?: string;
    muted?: string;
  };
  border?: string;
  shadow?: string;
  note?: string;
  [key: string]: unknown;
}

/** Main color intelligence structure */
export interface ColorIntelligence {
  _meta: {
    version: string;
    generated: string;
    source: string;
    schemaVersion: string;
    description: string;
  };
  contexts: Record<ContextName, ColorContext>;
  boundaries: {
    _note: string;
    dark_backgrounds: Record<string, unknown>;
    light_backgrounds: Record<string, unknown>;
    semantic_backgrounds: Record<string, unknown>;
  };
  harmony_principles: Record<string, unknown>;
  color_properties: Record<ColorFamily, {
    temperature: Temperature;
    semantic: SemanticMeaning;
    role: string;
    compatible_temps: Temperature[];
    note?: string;
  }>;
  harmony_lookup: HarmonyLookup;
  glass: {
    depth1_elevated: GlassDepth;
    depth2_card: GlassDepth;
    depth3_surface: GlassDepth;
    rules: GlassRules;
    examples: {
      correct: string[];
      forbidden: string[];
    };
  };
  forbidden: Array<{
    pattern: string;
    examples: string[];
    reason: string;
    exceptions: Array<{ pattern: string; context: string; reason: string }> | [];
  }>;
  escapeHatch: {
    attribute: string;
    usage: string;
    example: string;
    note: string;
    validReasons: string[];
  };
  composite_rules: {
    _note: string;
    valid_nesting: Record<string, {
      description: string;
      behavior: string;
      example: string;
    }>;
    forbidden_nesting: Array<{
      pattern: string;
      reason: string;
      fix: string;
    }>;
    decision_rule: string;
  };
}
