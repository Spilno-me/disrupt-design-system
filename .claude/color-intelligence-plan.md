# Color Intelligence System - Implementation Plan

**Created:** 2026-01-03
**Updated:** 2026-01-03 (v2.3)
**Status:** ✅ Ready for Implementation (10/10)
**Priority:** High - Foundation for agent-assisted design

---

## Executive Summary

Build an intelligent color system that tells agents **exactly what colors to use** in any context, eliminating guesswork and ensuring design consistency across all apps.

### The Problem

| Current State | Impact |
|---------------|--------|
| 7+ color-related files scattered | Agent confusion, drift risk |
| 53K line contrast-matrix.json | Overkill, slow to query |
| Manual boundary arrays in MDX | Drift from source of truth |
| No "best choice" guidance | Agent picks any passing color |
| No context awareness | Same answer for card, glass, button |
| No harmony rules | Colors that "pass" may look bad together |

### The Solution

Single source of truth (`color-intelligence.json`) that provides:
- **Context-aware recommendations** (card, glass, modal, button states)
- **Ranked choices** (best → acceptable, not just "passes")
- **Harmony guidance** (which colors look good together)
- **Theme support** (light/dark mode mappings)
- **Glass rules** (opacity, backdrop, text readability)

---

## Architecture

### File Location Strategy

| File | Location | Purpose |
|------|----------|---------|
| `src/data/color-intelligence.json` | Source tree | **Single source of truth** - importable by React components, MDX |
| `.claude/color-intelligence.toon` | Agent context | Compressed version for agent consumption (~100 lines) |
| `scripts/generate-color-intelligence.js` | Scripts | Generates .toon from source JSON |

**Decision rationale:** Source in `src/data/` allows direct ESM imports in MDX and components. Generated `.toon` in `.claude/` follows existing agent context pattern (like `sync:prompts`).

### Data Flow

```
designTokens.ts (primitives - hex values)
         │
         ▼  npm run sync:color-intelligence
┌─────────────────────────────────────────────────────────────────┐
│         src/data/color-intelligence.json                        │
│              (SINGLE SOURCE OF TRUTH - ~600 lines)              │
├─────────────────────────────────────────────────────────────────┤
│  _meta        → schema version, generation timestamp            │
│  contexts     → UI element types + their color mappings         │
│  boundaries   → minimum passing foregrounds per background      │
│  harmony      → principles (P1-P5) + pre-computed pairings      │
│  glass        → transparency rules + text requirements          │
│  forbidden    → patterns that should never be used              │
└─────────────────────────────────────────────────────────────────┘
         │
    ┌────┴────┬──────────┬──────────────┬─────────────┐
    ▼         ▼          ▼              ▼             ▼
MCP Tools   MDX Docs   .toon file   Hookify      Tailwind
(queries)   (imports)  (agent ctx)  (validates)  (preset)
```

---

## Schema Design

### 0. Schema Metadata

```json
{
  "_meta": {
    "version": "1.0.0",
    "generated": "2026-01-03T00:00:00Z",
    "source": "designTokens.ts",
    "schemaVersion": "1.0"
  }
}
```

### 1. Contexts (UI Element Types)

```json
{
  "contexts": {
    "default": {
      "description": "Fallback for custom/unknown components outside standard contexts",
      "solid": {
        "light": { "bg": "bg-surface", "hex": "#FAF8F3" },
        "dark": { "bg": "bg-surface", "hex": "#1D1F2A" }
      },
      "text": {
        "primary": "text-primary",
        "secondary": "text-secondary",
        "muted": "text-muted"
      },
      "border": "border border-default",
      "note": "Use when building components outside standard 12 contexts. Inherits surface-level styling."
    },
    "page": {
      "description": "Main page background",
      "light": { "bg": "bg-page", "hex": "#F0EDE6" },
      "dark": { "bg": "bg-page", "hex": "#0C0D12" },
      "text": {
        "primary": "text-primary",
        "secondary": "text-secondary",
        "muted": "text-muted"
      }
    },
    "card": {
      "description": "Content cards, panels",
      "depth": 2,
      "solid": {
        "light": { "bg": "bg-elevated", "hex": "#FFFEF9" },
        "dark": { "bg": "bg-elevated", "hex": "#2D3142" }
      },
      "glass": {
        "light": "bg-white/40 backdrop-blur-[4px]",
        "dark": "bg-black/40 backdrop-blur-[4px]"
      },
      "border": "border-2 border-accent",
      "shadow": "shadow-md",
      "text": {
        "primary": "text-primary",
        "secondary": "text-secondary"
      }
    },
    "surface": {
      "description": "Nested containers inside cards",
      "depth": 3,
      "solid": {
        "light": { "bg": "bg-surface", "hex": "#FAF8F3" },
        "dark": { "bg": "bg-surface", "hex": "#1D1F2A" }
      },
      "border": "border border-default",
      "shadow": "shadow-sm"
    },
    "modal": {
      "description": "Dialogs, overlays",
      "depth": 1,
      "solid": {
        "light": { "bg": "bg-elevated", "hex": "#FFFEF9" },
        "dark": { "bg": "bg-elevated", "hex": "#2D3142" }
      },
      "glass": {
        "light": "bg-white/60 backdrop-blur-[8px]",
        "dark": "bg-black/60 backdrop-blur-[8px]"
      },
      "shadow": "shadow-lg"
    },
    "button": {
      "description": "Interactive button variants and states",
      "variants": {
        "primary": { "bg": "bg-accent-strong", "text": "text-inverse", "border": "border-transparent" },
        "secondary": { "bg": "bg-surface", "text": "text-primary", "border": "border border-default" },
        "destructive": { "bg": "bg-error", "text": "text-inverse", "border": "border-transparent" },
        "ghost": { "bg": "bg-transparent", "text": "text-primary", "border": "border-transparent" },
        "outline": { "bg": "bg-transparent", "text": "text-accent", "border": "border border-accent" },
        "link": { "bg": "bg-transparent", "text": "text-accent", "decoration": "underline-offset-4 hover:underline" }
      },
      "states": {
        "hover": { "modifier": "hover:brightness-95 dark:hover:brightness-110" },
        "active": { "modifier": "active:scale-[0.98]", "brightness": "brightness-90" },
        "focus": { "ring": "ring-2 ring-offset-2 ring-accent", "outline": "outline-none" },
        "loading": { "opacity": "opacity-70", "cursor": "cursor-wait" },
        "disabled": { "bg": "bg-muted-bg", "text": "text-disabled", "cursor": "cursor-not-allowed", "opacity": "opacity-50" }
      },
      "transition": {
        "default": "transition-colors duration-150 ease-in-out",
        "withScale": "transition-all duration-150 ease-in-out",
        "note": "Use 'withScale' when active state includes scale transform"
      }
    },
    "input": {
      "description": "Form inputs, selects, textareas",
      "default": { "bg": "bg-surface", "border": "border border-default", "text": "text-primary" },
      "placeholder": { "text": "text-muted" },
      "focus": { "ring": "ring-2 ring-accent", "border": "border-accent" },
      "error": { "border": "border-error", "ring": "ring-2 ring-error/20", "text": "text-error" },
      "disabled": { "bg": "bg-muted-bg", "text": "text-disabled", "cursor": "cursor-not-allowed" },
      "readonly": { "bg": "bg-muted-bg/50", "cursor": "cursor-default" }
    },
    "navigation": {
      "description": "Sidebars, nav panels, menus",
      "solid": {
        "light": { "bg": "bg-surface", "hex": "#FAF8F3" },
        "dark": { "bg": "bg-surface", "hex": "#1D1F2A" }
      },
      "item": {
        "default": { "bg": "bg-transparent", "text": "text-secondary" },
        "hover": { "bg": "bg-surfaceHover", "text": "text-primary" },
        "active": { "bg": "bg-accent-bg", "text": "text-accent" },
        "disabled": { "text": "text-disabled" }
      },
      "divider": "border-default"
    },
    "tooltip": {
      "description": "Tooltips, popovers, small overlays",
      "depth": 1,
      "solid": {
        "light": { "bg": "bg-elevated", "text": "text-primary" },
        "dark": { "bg": "bg-elevated", "text": "text-primary" }
      },
      "shadow": "shadow-lg",
      "border": "border border-default"
    },
    "tableRow": {
      "description": "Data table rows (DataTable, lists)",
      "default": { "bg": "bg-transparent", "text": "text-primary" },
      "hover": { "bg": "bg-surfaceHover" },
      "selected": { "bg": "bg-accent-bg", "text": "text-primary", "border": "border-l-2 border-accent" },
      "striped": { "bg": "odd:bg-muted-bg/50" },
      "disabled": { "bg": "bg-muted-bg", "text": "text-disabled", "cursor": "cursor-not-allowed" },
      "loading": { "bg": "animate-pulse bg-muted-bg" }
    },
    "badge": {
      "description": "Status badges, tags, chips, pills",
      "note": "Small text (12-14px) requires AAA compliance (7:1 ratio) for readability",
      "variants": {
        "default": { "bg": "bg-muted-bg", "text": "text-secondary" },
        "success": { "bg": "bg-success-tint", "text": "text-success-strong dark:text-white" },
        "warning": { "bg": "bg-warning-tint", "text": "text-warning-dark dark:text-white" },
        "error": { "bg": "bg-error-tint", "text": "text-error-strong dark:text-white" },
        "info": { "bg": "bg-info-light", "text": "text-info" },
        "accent": { "bg": "bg-accent-bg", "text": "text-accent" }
      },
      "sizes": {
        "sm": "px-1.5 py-0.5 text-xs rounded",
        "md": "px-2 py-1 text-sm rounded-md",
        "lg": "px-3 py-1.5 text-base rounded-lg"
      }
    },
    "status": {
      "success": {
        "bg": "bg-success-tint",
        "text": "text-success-strong",
        "darkText": "dark:text-white",
        "icon": "text-success"
      },
      "warning": {
        "bg": "bg-warning-tint",
        "text": "text-warning-dark",
        "darkText": "dark:text-white",
        "icon": "text-warning"
      },
      "error": {
        "bg": "bg-error-tint",
        "text": "text-error-strong",
        "darkText": "dark:text-white",
        "icon": "text-error"
      },
      "info": {
        "bg": "bg-info-light",
        "text": "text-info",
        "icon": "text-info"
      }
    },
    "dataViz": {
      "description": "Charts, graphs, heatmaps, and data visualization",
      "categorical": {
        "description": "Distinct categories (pie slices, bar groups, legend items)",
        "palette": [
          { "token": "DEEP_CURRENT[500]", "hex": "#08A4BD", "role": "primary/brand" },
          { "token": "WAVE[500]", "hex": "#3B82F6", "role": "secondary" },
          { "token": "HARBOR[500]", "hex": "#22C55E", "role": "positive" },
          { "token": "CORAL[500]", "hex": "#F70D1A", "role": "negative" },
          { "token": "SUNRISE[500]", "hex": "#EAB308", "role": "warning" },
          { "token": "DUSK_REEF[500]", "hex": "#5E4F7E", "role": "neutral" }
        ],
        "rules": {
          "maxDistinct": 6,
          "overflow": "Use patterns (stripes, dots) for >6 categories",
          "a11y": "Never rely on color alone - add labels, patterns, or shapes"
        }
      },
      "sequential": {
        "description": "Single-variable intensity (heatmaps, density, progress)",
        "cool": {
          "family": "DEEP_CURRENT",
          "scale": ["DEEP_CURRENT[100]", "DEEP_CURRENT[300]", "DEEP_CURRENT[500]", "DEEP_CURRENT[700]", "DEEP_CURRENT[900]"],
          "usage": "Default for most data (neutral connotation)"
        },
        "warm": {
          "family": "CORAL",
          "scale": ["CORAL[100]", "CORAL[300]", "CORAL[500]", "CORAL[700]", "CORAL[900]"],
          "usage": "Heat, urgency, intensity (negative connotation)"
        },
        "success": {
          "family": "HARBOR",
          "scale": ["HARBOR[100]", "HARBOR[300]", "HARBOR[500]", "HARBOR[700]", "HARBOR[900]"],
          "usage": "Progress, completion, positive metrics"
        }
      },
      "diverging": {
        "description": "Positive/negative values centered on neutral (profit/loss, above/below target)",
        "scale": [
          { "token": "CORAL[600]", "meaning": "strong negative" },
          { "token": "CORAL[300]", "meaning": "weak negative" },
          { "token": "SLATE[200]", "meaning": "neutral/zero" },
          { "token": "HARBOR[300]", "meaning": "weak positive" },
          { "token": "HARBOR[600]", "meaning": "strong positive" }
        ],
        "neutralPoint": "SLATE[200]",
        "usage": "Financial data, variance from target, sentiment"
      },
      "accessibility": {
        "colorBlindSafe": "Categorical palette tested for deuteranopia, protanopia, tritanopia",
        "patterns": "Always provide texture/pattern alternative for charts",
        "labels": "Direct labeling preferred over legend-only"
      }
    }
  }
}
```

### 2. Boundaries (Minimum Passing Colors)

**Coverage:** All ~15 common background scenarios for light/dark themes.

```json
{
  "boundaries": {
    "_note": "Organized by theme, then by common usage",

    "dark_backgrounds": {
      "ABYSS[900]": {
        "hex": "#0C0D12",
        "usage": "Dark mode page background",
        "minPassingForegrounds": [
          { "token": "CORAL[500]", "ratio": 4.65, "level": "AA", "type": "accent" },
          { "token": "WAVE[500]", "ratio": 5.28, "level": "AA", "type": "accent" },
          { "token": "PRIMITIVES.white", "ratio": 19.41, "level": "AAA", "type": "neutral" }
        ],
        "subtleNeutrals": [
          { "token": "ABYSS[300]", "ratio": 4.57, "level": "AA" },
          { "token": "SLATE[300]", "ratio": 5.12, "level": "AA" }
        ],
        "recommended": {
          "primary": "PRIMITIVES.white",
          "secondary": "SLATE[200]",
          "muted": "SLATE[400]",
          "accent": "DEEP_CURRENT[400]"
        }
      },
      "ABYSS[800]": {
        "hex": "#1D1F2A",
        "usage": "Dark mode elevated surfaces (cards)",
        "recommended": {
          "primary": "PRIMITIVES.white",
          "secondary": "SLATE[200]",
          "muted": "SLATE[400]",
          "accent": "DEEP_CURRENT[400]"
        }
      },
      "ABYSS[700]": {
        "hex": "#2D3142",
        "usage": "Dark mode surface (nested containers)",
        "recommended": {
          "primary": "PRIMITIVES.white",
          "secondary": "SLATE[200]",
          "muted": "SLATE[400]",
          "accent": "DEEP_CURRENT[400]"
        }
      },
      "DEEP_CURRENT[700]": {
        "hex": "#056271",
        "usage": "Accent background (CTAs, highlights)",
        "recommended": {
          "primary": "PRIMITIVES.white",
          "secondary": "DEEP_CURRENT[100]",
          "accent": "WAVE[300]"
        }
      },
      "CORAL[600]": {
        "hex": "#DC2626",
        "usage": "Error/danger button background",
        "recommended": {
          "primary": "PRIMITIVES.white",
          "secondary": "CORAL[100]"
        }
      }
    },

    "light_backgrounds": {
      "PRIMITIVES.white": {
        "hex": "#FFFFFF",
        "usage": "Light mode surface, cards, inputs",
        "minPassingForegrounds": [
          { "token": "LINEN[600]", "ratio": 4.65, "level": "AA", "type": "neutral" },
          { "token": "SLATE[500]", "ratio": 4.76, "level": "AA", "type": "neutral" },
          { "token": "ABYSS[900]", "ratio": 19.41, "level": "AAA", "type": "neutral" }
        ],
        "recommended": {
          "primary": "ABYSS[900]",
          "secondary": "DUSK_REEF[600]",
          "muted": "SLATE[500]",
          "accent": "DEEP_CURRENT[600]"
        }
      },
      "IVORY[200]": {
        "hex": "#F0EDE6",
        "usage": "Light mode page background",
        "recommended": {
          "primary": "ABYSS[900]",
          "secondary": "DUSK_REEF[600]",
          "muted": "SLATE[500]",
          "accent": "DEEP_CURRENT[600]"
        }
      },
      "IVORY[300]": {
        "hex": "#E5E2DB",
        "usage": "Light mode muted/disabled background, hover states",
        "recommended": {
          "primary": "ABYSS[900]",
          "secondary": "SLATE[600]",
          "muted": "SLATE[500]"
        }
      },
      "SLATE[100]": {
        "hex": "#F1F5F9",
        "usage": "Light mode hover states, zebra striping",
        "recommended": {
          "primary": "ABYSS[900]",
          "secondary": "SLATE[600]",
          "accent": "DEEP_CURRENT[600]"
        }
      },
      "DEEP_CURRENT[100]": {
        "hex": "#CCEFF5",
        "usage": "Accent tint background (selected rows, highlights)",
        "recommended": {
          "primary": "ABYSS[900]",
          "secondary": "DEEP_CURRENT[700]",
          "accent": "DEEP_CURRENT[600]"
        }
      }
    },

    "semantic_backgrounds": {
      "SUCCESS_TINT": {
        "usage": "Success/positive states",
        "light": { "bg": "bg-success-tint", "text": "text-success-strong" },
        "dark": { "bg": "bg-success-tint", "text": "text-white" }
      },
      "WARNING_TINT": {
        "usage": "Warning/caution states",
        "light": { "bg": "bg-warning-tint", "text": "text-warning-dark" },
        "dark": { "bg": "bg-warning-tint", "text": "text-white" }
      },
      "ERROR_TINT": {
        "usage": "Error/danger states",
        "light": { "bg": "bg-error-tint", "text": "text-error-strong" },
        "dark": { "bg": "bg-error-tint", "text": "text-white" }
      },
      "INFO_TINT": {
        "usage": "Informational states",
        "light": { "bg": "bg-info-light", "text": "text-info" },
        "dark": { "bg": "bg-info-light", "text": "text-info" }
      }
    }
  }
}
```

### 3. Harmony (Teachable Principles + Lookup)

**Goal:** Agent learns *why* colors work together, not just *which* ones.

#### 3.1 Core Principles (Agent Must Learn These)

```json
{
  "harmony_principles": {
    "_teaching_note": "These rules let agents DERIVE harmony, not just memorize",

    "P1_temperature_compatibility": {
      "rule": "Accent temperature should match or be neutral to base",
      "formula": "base.temp ∈ {cool, neutral-cool} → accent.temp ∈ {cool, neutral}",
      "why": "Warm colors advance, cool recede. Mixing creates visual competition.",
      "exception": "Single warm accent on cool base OK for emphasis (error badge on dark card)"
    },

    "P2_semantic_separation": {
      "rule": "Colors with semantic meaning must not be adjacent or competing",
      "formula": "IF both have semantic AND semantics differ → avoid adjacent",
      "why": "User's brain assigns meaning. CORAL (error) next to DEEP_CURRENT (brand) = confusion",
      "semantics": {
        "error": ["CORAL"],
        "warning": ["SUNRISE", "ORANGE"],
        "success": ["HARBOR"],
        "info": ["WAVE"],
        "brand": ["DEEP_CURRENT"],
        "neutral": ["ABYSS", "SLATE", "LINEN", "IVORY", "DUSK_REEF"]
      }
    },

    "P3_family_contrast": {
      "rule": "Same color family requires 400+ step difference",
      "formula": "IF family1 == family2 → require |step1 - step2| >= 400",
      "why": "ABYSS[500] on ABYSS[600] = invisible. Same hue, insufficient contrast.",
      "example": {
        "bad": "ABYSS[200] on ABYSS[500] (300 step gap)",
        "good": "ABYSS[100] on ABYSS[900] (800 step gap)"
      }
    },

    "P4_dominance": {
      "rule": "One temperature must dominate; other is accent only",
      "formula": "primary_area.temp == base.temp; accent_area < 20% of composition",
      "why": "Equal warm/cool creates tension. Hierarchy creates harmony.",
      "example": {
        "good": "ABYSS base (90%) + CORAL error badge (5%)",
        "bad": "ABYSS (50%) + CORAL (50%) competing"
      }
    },

    "P5_semantic_priority": {
      "rule": "Semantic meaning ALWAYS takes precedence over temperature harmony",
      "formula": "IF element.semantic != null → use semantic color, ignore P1",
      "why": "User safety and clarity > aesthetic harmony. Error MUST look like error.",
      "priority_order": ["semantic meaning", "accessibility (WCAG)", "temperature harmony"],
      "example": {
        "acceptable": "CORAL[500] error badge on ABYSS[900] page (warm on cool)",
        "reason": "P5 override: error semantic requires CORAL regardless of P1 temperature clash"
      },
      "override_cases": [
        { "case": "Error state", "use": "CORAL family", "even_on": "cool ABYSS base" },
        { "case": "Warning state", "use": "SUNRISE family", "even_on": "cool ABYSS base" },
        { "case": "Success state", "use": "HARBOR family", "even_on": "warm LINEN base" },
        { "case": "Brand accent", "use": "DEEP_CURRENT family", "even_on": "any base" }
      ]
    }
  }
}
```

#### 3.2 Decision Tree (How Agent Picks Colors)

```
Agent task: "Pick accent for [context]"
         │
         ▼
┌─────────────────────────────────────────┐
│ STEP 1: Check semantic requirement (P5) │
│ → Is this error/warning/success state?  │
│ → YES → Use semantic color, skip P1     │
│ → NO → Continue to temperature check    │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ STEP 2: Identify base temperature       │
│ → Read base color's temp property       │
│ → ABYSS = cool-neutral                  │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ STEP 3: Filter by temperature (P1)      │
│ → cool base → {cool, neutral} accents   │
│ → warm base → {warm, neutral} accents   │
│ → neutral base → any accent OK          │
│ → UNLESS P5 override applies            │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ STEP 4: Select accent color             │
│ (Only if STEP 1 was NO - non-semantic)  │
│ → Brand emphasis? → DEEP_CURRENT        │
│ → Decorative accent? → temperature-     │
│   compatible from STEP 3 filter         │
│ → Neutral? → SLATE or DUSK_REEF         │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ STEP 5: Exclude semantic conflicts (P2) │
│ → Already using CORAL on page?          │
│ → Don't add DEEP_CURRENT adjacent       │
│ → (error ≠ brand confusion)             │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ STEP 6: Check family contrast (P3)      │
│ → Same family? Need 400+ step gap       │
│ → Different family? OK                  │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ STEP 7: Verify dominance (P4)           │
│ → Is accent < 20% of area?              │
│ → If larger, use neutral instead        │
└─────────────────────────────────────────┘
         │
         ▼
       RESULT
```

#### 3.3 Color Properties (Lookup Table)

```json
{
  "color_properties": {
    "ABYSS": {
      "temperature": "neutral-cool",
      "semantic": null,
      "role": "Dark theme base",
      "compatible_temps": ["cool", "neutral-cool", "neutral"]
    },
    "DEEP_CURRENT": {
      "temperature": "cool",
      "semantic": "brand",
      "role": "Primary accent, CTAs, links",
      "compatible_temps": ["cool", "neutral-cool", "neutral"]
    },
    "WAVE": {
      "temperature": "cool",
      "semantic": "info",
      "role": "Info states, secondary teal accent",
      "compatible_temps": ["cool", "neutral"]
    },
    "HARBOR": {
      "temperature": "cool",
      "semantic": "success",
      "role": "Success states, confirmations",
      "compatible_temps": ["cool", "neutral"]
    },
    "CORAL": {
      "temperature": "warm",
      "semantic": "error",
      "role": "Error states, destructive actions",
      "compatible_temps": ["warm", "neutral-warm", "neutral"]
    },
    "SUNRISE": {
      "temperature": "warm",
      "semantic": "warning",
      "role": "Warning states, caution",
      "compatible_temps": ["warm", "neutral-warm", "neutral"]
    },
    "ORANGE": {
      "temperature": "warm",
      "semantic": "highlight",
      "role": "Energy, attention, badges",
      "compatible_temps": ["warm", "neutral-warm", "neutral"]
    },
    "SLATE": {
      "temperature": "neutral",
      "semantic": null,
      "role": "Universal gray, borders, muted text",
      "compatible_temps": ["cool", "warm", "neutral"]
    },
    "LINEN": {
      "temperature": "cool",
      "semantic": null,
      "role": "Cool blue-white scale, subtle cool tints",
      "compatible_temps": ["cool", "neutral-cool", "neutral"],
      "note": "Use for cool/clinical contexts (data viz, technical UI). NOT for main backgrounds - use IVORY."
    },
    "IVORY": {
      "temperature": "neutral-warm",
      "semantic": null,
      "role": "Light theme depth layering (page/surface/elevated)",
      "compatible_temps": ["warm", "neutral-warm", "neutral", "cool"],
      "note": "PRIMARY light mode backgrounds. LINEN is cool (blue tints), IVORY is warm (cream/beige)."
    },
    "DUSK_REEF": {
      "temperature": "neutral-cool",
      "semantic": null,
      "role": "Sophisticated neutral, secondary text",
      "compatible_temps": ["cool", "neutral-cool", "neutral"]
    }
  }
}
```

#### 3.4 Pre-computed Pairings (Quick Lookup)

```json
{
  "harmony_lookup": {
    "_note": "Derived from principles above - use for quick reference",

    "ABYSS": {
      "companions": ["SLATE", "DUSK_REEF", "DEEP_CURRENT"],
      "accents": ["DEEP_CURRENT", "WAVE", "HARBOR"],
      "avoid": ["CORAL", "ORANGE"],
      "avoid_reason": "P1: warm on cool-neutral base; P2: semantic clash if brand context"
    },
    "DEEP_CURRENT": {
      "companions": ["WAVE", "HARBOR", "SLATE", "ABYSS"],
      "accents": ["HARBOR", "WAVE"],
      "avoid": ["CORAL", "SUNRISE", "ORANGE"],
      "avoid_reason": "P1: warm temps; P2: error/warning ≠ brand semantic"
    },
    "WAVE": {
      "companions": ["DEEP_CURRENT", "HARBOR", "SLATE"],
      "accents": ["DEEP_CURRENT", "HARBOR"],
      "avoid": ["CORAL", "SUNRISE"],
      "avoid_reason": "P1: warm temps clash; P2: info ≠ error/warning semantic"
    },
    "HARBOR": {
      "companions": ["WAVE", "DEEP_CURRENT", "SLATE", "ABYSS"],
      "accents": ["DEEP_CURRENT", "WAVE"],
      "avoid": ["CORAL", "ORANGE", "SUNRISE"],
      "avoid_reason": "P1: warm temps; P2: success ≠ error/warning"
    },
    "CORAL": {
      "companions": ["SUNRISE", "ORANGE", "IVORY"],
      "accents": ["SUNRISE"],
      "avoid": ["HARBOR", "DEEP_CURRENT", "WAVE"],
      "avoid_reason": "P2: error semantic ≠ brand/success/info semantics"
    },
    "SUNRISE": {
      "companions": ["CORAL", "ORANGE", "IVORY"],
      "accents": ["ORANGE"],
      "avoid": ["DEEP_CURRENT", "HARBOR"],
      "avoid_reason": "P2: warning semantic ≠ brand/success"
    },
    "ORANGE": {
      "companions": ["SUNRISE", "CORAL", "IVORY"],
      "accents": ["SUNRISE"],
      "avoid": ["ABYSS", "HARBOR", "DEEP_CURRENT"],
      "avoid_reason": "P1: warm on cool-neutral; P4: high-energy needs dominance"
    },
    "SLATE": {
      "companions": ["ABYSS", "IVORY", "DUSK_REEF", "DEEP_CURRENT"],
      "accents": ["DEEP_CURRENT", "CORAL"],
      "avoid": [],
      "avoid_reason": "Neutral works with all temperatures"
    },
    "LINEN": {
      "companions": ["SLATE", "ABYSS", "DEEP_CURRENT", "WAVE"],
      "accents": ["DEEP_CURRENT", "HARBOR"],
      "avoid": ["CORAL", "ORANGE"],
      "avoid_reason": "P1: cool family; warm colors clash"
    },
    "IVORY": {
      "companions": ["SLATE", "DUSK_REEF", "SUNRISE", "LINEN"],
      "accents": ["DEEP_CURRENT", "CORAL"],
      "avoid": [],
      "avoid_reason": "Warm-neutral accepts all accents - primary light mode base"
    },
    "DUSK_REEF": {
      "companions": ["ABYSS", "SLATE", "DEEP_CURRENT"],
      "accents": ["DEEP_CURRENT", "HARBOR"],
      "avoid": ["ORANGE", "SUNRISE"],
      "avoid_reason": "P1: cool-neutral base; warm oranges clash"
    }
  }
}
```

### 4. Glass Rules

**Clarification:** Text readability depends on opacity + backdrop blur working together.

```json
{
  "glass": {
    "depth1_elevated": {
      "opacity": 60,
      "blur": "8px",
      "light": "bg-white/60",
      "dark": "bg-black/60",
      "textStrategy": "direct",
      "textColor": "High-contrast text directly on glass (white on dark, ABYSS[900] on light)",
      "notes": "60%+ opacity with 8px blur = sufficient contrast for text"
    },
    "depth2_card": {
      "opacity": 40,
      "blur": "4px",
      "light": "bg-white/40",
      "dark": "bg-black/40",
      "border": "border-2 border-accent",
      "textStrategy": "semantic-or-nested",
      "textColor": "Semantic tokens (text-primary) OR place text on nested solid surface",
      "notes": "40% opacity acceptable when: (1) semantic tokens used, (2) blur provides sufficient uniformity"
    },
    "depth3_surface": {
      "opacity": 20,
      "blur": "2px",
      "light": "bg-white/20",
      "dark": "bg-black/20",
      "textStrategy": "nested-solid-required",
      "textColor": "MUST place text on nested solid surface (bg-surface)",
      "notes": "20% opacity = too transparent for direct text; use for decorative layers only"
    },

    "rules": {
      "minOpacityForDirectText": 60,
      "minOpacityForSemanticText": 40,
      "belowMinOpacity": "Text must be on nested solid surface (bg-surface)",
      "backdropBlurRequired": true,
      "nestedGlass": "FORBIDDEN - use solid bg-surface inside glass containers",
      "textPlacementDecisionTree": [
        "opacity >= 60% → direct text OK (high contrast colors)",
        "opacity 40-59% → semantic tokens OR nested solid surface",
        "opacity < 40% → nested solid surface REQUIRED"
      ]
    },

    "examples": {
      "correct": [
        "bg-white/60 backdrop-blur-[8px] + text-abyss-900 (direct)",
        "bg-white/40 backdrop-blur-[4px] + text-primary (semantic)",
        "bg-white/40 backdrop-blur-[4px] > div.bg-surface > text-primary (nested)",
        "bg-white/20 backdrop-blur-[2px] > div.bg-surface > content (nested required)"
      ],
      "forbidden": [
        "bg-white/20 + text-primary (no nested surface, too transparent)",
        "bg-white/40 without backdrop-blur (blur required)",
        "bg-white/40 > bg-white/20 (nested glass forbidden)"
      ]
    }
  }
}
```

### 5. Forbidden Patterns

```json
{
  "forbidden": [
    {
      "pattern": "Same family on itself",
      "examples": ["ABYSS[200] on ABYSS[500]", "CORAL[300] on CORAL[600]"],
      "reason": "Insufficient contrast, colors blend"
    },
    {
      "pattern": "Raw hex colors",
      "examples": ["#FF0000", "rgb(255,0,0)"],
      "reason": "Breaks themes, not maintainable"
    },
    {
      "pattern": "Standard Tailwind colors",
      "examples": ["bg-blue-500", "text-red-600"],
      "reason": "Not DDS tokens, inconsistent"
    },
    {
      "pattern": "Opacity on semantic tokens",
      "examples": ["bg-muted-bg/30", "text-primary/50"],
      "reason": "Use glass patterns or solid tokens",
      "exceptions": [
        {
          "pattern": "ring-error/20",
          "context": "input error state focus ring",
          "reason": "Subtle error indication without overwhelming the input; 20% opacity provides visual feedback while maintaining readability"
        },
        {
          "pattern": "ring-accent/20",
          "context": "focus rings on interactive elements",
          "reason": "Soft focus indication that doesn't compete with content"
        }
      ]
    },
    {
      "pattern": "Text on low-opacity glass without backdrop",
      "examples": ["bg-white/20 (no blur)", "bg-black/30"],
      "reason": "Text unreadable on varied backgrounds"
    }
  ],

  "escapeHatch": {
    "attribute": "data-dds-override",
    "usage": "Intentional rule break with documented reason",
    "example": "<div data-dds-override=\"brand-partnership-purple\" className=\"bg-purple-600\">",
    "hookifyBehavior": "Warn but don't block when attribute present",
    "requiresComment": true,
    "validReasons": [
      "brand-partnership-*",
      "legacy-migration-*",
      "experimental-*",
      "third-party-*"
    ],
    "note": "Override attribute must have a reason prefix. Hookify logs all overrides for audit."
  }
}
```

---

## MCP Tools

### New Tools to Add

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `get_color_recommendation` | Best color for context | `{context: "card", theme: "dark", element: "text"}` | Ranked recommendations with rationale |
| `get_color_harmony` | Colors that pair well | `{color: "DEEP_CURRENT"}` | Companions, accents, avoid list |
| `validate_color_choice` | Check if choice is appropriate | `{bg: "CORAL[500]", text: "white", context: "button"}` | Pass/fail + suggestions |
| `get_glass_rules` | Glass implementation for depth | `{depth: 2}` | Classes, blur, border, shadow |

### Example Queries & Response Schema

**All responses include `rationale` explaining the recommendation with principle references.**

```bash
# Agent building dark mode card
mcp__dds__get_color_recommendation({
  context: "card",
  theme: "dark",
  element: "primaryText"
})
# Returns:
{
  "recommended": "text-primary",
  "resolvedToken": "SLATE[100]",
  "hex": "#F8FAFC",
  "ratio": 17.4,
  "level": "AAA",
  "rationale": {
    "summary": "High contrast on ABYSS[700], neutral temp, AAA compliant",
    "principles": ["P1: neutral compatible with cool-neutral base", "P4: primary text dominates"]
  },
  "alternatives": [
    { "token": "text-secondary", "resolvedToken": "SLATE[300]", "use": "Supporting text" },
    { "token": "text-muted", "resolvedToken": "SLATE[400]", "use": "De-emphasized text" }
  ]
}

# Agent checking color harmony
mcp__dds__get_color_harmony({ color: "CORAL" })
# Returns:
{
  "color": "CORAL",
  "temperature": "warm",
  "semantic": "error",
  "companions": ["SUNRISE", "ORANGE", "IVORY"],
  "accents": ["SUNRISE"],
  "avoid": ["HARBOR", "DEEP_CURRENT", "WAVE"],
  "rationale": {
    "companions_reason": "P1: warm temps compatible; P2: no semantic conflict",
    "avoid_reason": "P1: cool temps clash; P2: error ≠ brand/success semantic"
  }
}

# Agent validating a choice
mcp__dds__validate_color_choice({
  background: "CORAL[500]",
  foreground: "white",
  context: "error-badge"
})
# Returns:
{
  "valid": false,
  "ratio": 4.18,
  "requiredRatio": 4.5,
  "level": "FAIL",
  "context": "error-badge",
  "rationale": {
    "failure": "4.18:1 fails AA (badges require AAA for small text)",
    "note": "P5 confirms CORAL is correct semantic choice; contrast is the issue"
  },
  "suggestion": {
    "foreground": "ABYSS[900]",
    "ratio": 4.65,
    "level": "AA",
    "note": "Or use CORAL[600] background for 5.2:1 with white"
  }
}

# Agent getting glass rules for card depth
mcp__dds__get_glass_rules({ depth: 2 })
# Returns:
{
  "depth": 2,
  "name": "depth2_card",
  "classes": {
    "light": "bg-white/40 backdrop-blur-[4px]",
    "dark": "bg-black/40 backdrop-blur-[4px]"
  },
  "border": "border-2 border-accent",
  "shadow": "shadow-md",
  "textStrategy": "semantic-or-nested",
  "rationale": {
    "opacity": "40% requires semantic tokens or nested solid surface for text",
    "blur": "4px provides uniform background for readability",
    "border": "Accent border defines glass container edge"
  }
}
```

### MCP Error Handling

All tools return structured errors with recovery guidance:

```json
{
  "error_responses": {
    "unknown_context": {
      "error": "UNKNOWN_CONTEXT",
      "input": "fancy-card",
      "message": "Context 'fancy-card' not found",
      "valid_contexts": ["default", "page", "card", "surface", "modal", "button", "input", "navigation", "tooltip", "tableRow", "badge", "status", "dataViz"],
      "suggestion": "Use 'default' for custom components, or 'card' if this is a container"
    },
    "unknown_color": {
      "error": "UNKNOWN_COLOR",
      "input": "DEEP-CURRENT",
      "message": "Color family 'DEEP-CURRENT' not found",
      "did_you_mean": "DEEP_CURRENT",
      "valid_families": ["ABYSS", "DEEP_CURRENT", "WAVE", "HARBOR", "CORAL", "SUNRISE", "ORANGE", "SLATE", "LINEN", "IVORY", "DUSK_REEF"]
    },
    "invalid_depth": {
      "error": "INVALID_DEPTH",
      "input": 5,
      "message": "Depth must be 1, 2, or 3",
      "valid_depths": [1, 2, 3],
      "suggestion": "Use depth 1 for overlays, depth 2 for cards, depth 3 for nested surfaces"
    },
    "missing_required": {
      "error": "MISSING_REQUIRED_PARAM",
      "missing": ["context"],
      "message": "Required parameter 'context' is missing",
      "example": "get_color_recommendation({ context: 'card', theme: 'dark', element: 'text' })"
    }
  }
}
```

**Agent fallback behavior:** When MCP tool returns error, agent should:
1. Check `did_you_mean` for typo corrections
2. Use `default` context for unknown UI elements
3. Log error for human review if suggestion doesn't apply

---

### Composite Context Rules

When contexts are nested (card inside modal, surface inside card), follow these rules:

```json
{
  "composite_rules": {
    "_note": "Inner context rules take precedence; outer provides backdrop only",

    "modal > card": {
      "description": "Card inside modal dialog",
      "behavior": "Card uses depth 2 rules; modal provides scrim + blur backdrop",
      "example": "Modal with bg-black/60 contains Card with bg-elevated"
    },
    "card > surface": {
      "description": "Surface nested inside card (most common)",
      "behavior": "Surface uses depth 3 rules; inherits card's theme context",
      "example": "Card contains SearchFilter with bg-surface border-default"
    },
    "page > card": {
      "description": "Card on page background",
      "behavior": "Card uses depth 2 rules; may use glass on page bg",
      "example": "bg-page contains Card with bg-white/40 backdrop-blur"
    },

    "forbidden_nesting": [
      {
        "pattern": "glass > glass",
        "reason": "Nested glass creates unpredictable blur stacking",
        "fix": "Use solid bg-surface inside glass containers"
      },
      {
        "pattern": "surface > card",
        "reason": "Inverted depth hierarchy (surface is depth 3, card is depth 2)",
        "fix": "Card should contain surface, not vice versa"
      },
      {
        "pattern": "badge > badge",
        "reason": "Nested badges create visual noise",
        "fix": "Combine into single badge with compound status"
      }
    ],

    "decision_rule": "When in doubt: inner element's context rules apply for colors/borders; outer element provides only background/backdrop"
  }
}
```

---

## Implementation Phases

### Phase 1: Foundation (Day 1)
- [ ] Create `color-intelligence.json` schema
- [ ] Populate contexts from EntityTemplatesPage reference
- [ ] Add boundaries from existing contrast-matrix.json (filtered to minimums)
- [ ] Add forbidden patterns

### Phase 2: Generation Script (Day 1-2)
- [ ] Create `scripts/generate-color-intelligence.js`
- [ ] Auto-generate boundaries from contrast-matrix.json
- [ ] Add `npm run sync:color-intelligence` command
- [ ] Add validation for drift detection

### Phase 3: MCP Integration (Day 2)
- [ ] Add new MCP tools to `/mcp/src/tools/`
- [ ] Implement `get_color_recommendation`
- [ ] Implement `get_color_harmony`
- [ ] Implement `validate_color_choice`
- [ ] Implement `get_glass_rules`
- [ ] Update existing `check_contrast` to use new data

### Phase 3.5: MCP Tool Testing (Day 2)
- [ ] Create test queries for each tool (happy path + edge cases)
- [ ] Verify `get_color_recommendation` returns correct tokens for all 13 contexts
- [ ] Verify `validate_color_choice` catches forbidden patterns
- [ ] Verify badge context enforces AAA (7:1) not just AA
- [ ] Test dataViz context specifically:
  - [ ] Categorical palette returns 6 distinct colors with semantic roles
  - [ ] Sequential scales return correct family (cool/warm/success)
  - [ ] Diverging scale returns symmetric positive/negative with neutral center
- [ ] Manual smoke test in Claude Code session

### Phase 4: Documentation Update (Day 2-3)
- [ ] Update ContrastMatrix.mdx to import from color-intelligence.json
- [ ] Remove hardcoded BOUNDARY_COLORS arrays
- [ ] Generate `.claude/color-intelligence.toon` for agent context
- [ ] Update CLAUDE.md with new workflow
- [ ] Create `ColorIntelligence.stories.tsx` - visual reference showing all 13 contexts
  - Side-by-side light/dark theme comparison
  - Interactive context switcher for agents/designers to validate
  - Links to MCP tool documentation

### Phase 5: Cleanup (Day 3)
- [ ] Delete `.claude/contrast-matrix.json` (53K lines, redundant)
- [ ] Delete `.claude/contrast-matrix.toon` (119KB, redundant)
- [ ] Merge `.claude/color-matrix.json` into new system
- [ ] Consolidate 7 hookify color rules → 2 rules
- [ ] Add hookify color validation to CI pipeline (optional)

### Phase 6: Taste Feedback Loop (Post-Launch)
- [ ] Create `TasteTest.stories.tsx` - side-by-side color comparison UI
- [ ] Add feedback capture (preference + reasoning)
- [ ] Build `taste_journal` in color-intelligence.json
- [ ] Human reviews agent proposals, provides feedback
- [ ] Extract new principles (P6, P7...) from patterns
- [ ] Refine harmony rules based on learned taste

---

## Rollback Plan

| Phase | Rollback Action |
|-------|-----------------|
| Phase 1-2 | Delete new files (`src/data/color-intelligence.json`, `scripts/generate-color-intelligence.js`), no impact on existing system |
| Phase 3 | Revert MCP tool registrations in `mcp/src/index.ts`, delete new tool files |
| Phase 3.5 | No rollback needed (testing only) |
| Phase 4 | Restore MDX from git: `git checkout -- src/stories/foundation/ContrastMatrix.mdx` |
| Phase 5 | **⚠️ DANGER ZONE** - Cannot easily rollback deletions. Create safety checkpoint first |

**Safety Protocol for Phase 5:**
```bash
# Before ANY deletions in Phase 5:
git tag pre-color-intelligence-cleanup
git push origin pre-color-intelligence-cleanup

# If rollback needed:
git checkout pre-color-intelligence-cleanup -- .claude/contrast-matrix.json
git checkout pre-color-intelligence-cleanup -- .claude/contrast-matrix.toon
git checkout pre-color-intelligence-cleanup -- .claude/color-matrix.json
```

---

## Files to Create/Modify

### Create New
| File | Purpose | Est. Lines |
|------|---------|------------|
| `src/data/color-intelligence.json` | Single source of truth | ~600 |
| `src/data/color-intelligence.types.ts` | TypeScript types for type-safe imports | ~80 |
| `scripts/generate-color-intelligence.js` | Generation script + validation + type generation | ~180 |
| `.claude/color-intelligence.toon` | Compressed agent context (generated) | ~100 |
| `mcp/src/tools/colorRecommendation.ts` | `get_color_recommendation` tool | ~80 |
| `mcp/src/tools/colorHarmony.ts` | `get_color_harmony` tool | ~60 |
| `mcp/src/tools/colorValidation.ts` | `validate_color_choice` tool | ~70 |
| `mcp/src/tools/glassRules.ts` | `get_glass_rules` tool | ~50 |

### TypeScript Types (Generated)

The generation script produces `src/data/color-intelligence.types.ts`:

```typescript
// Auto-generated from color-intelligence.json - DO NOT EDIT
export type ContextName = 'default' | 'page' | 'card' | 'surface' | 'modal' |
  'button' | 'input' | 'navigation' | 'tooltip' | 'tableRow' | 'badge' | 'status' | 'dataViz';

export type Theme = 'light' | 'dark';

export interface ThemeColor {
  bg: string;
  hex: string;
}

export interface TextTokens {
  primary: string;
  secondary?: string;
  muted?: string;
}

export interface ColorContext {
  description: string;
  depth?: number;
  solid?: { light: ThemeColor; dark: ThemeColor };
  glass?: { light: string; dark: string };
  border?: string;
  shadow?: string;
  text?: TextTokens;
  note?: string;
}

export interface ColorIntelligence {
  _meta: {
    version: string;
    generated: string;
    source: string;
    schemaVersion: string;
  };
  contexts: Record<ContextName, ColorContext>;
  boundaries: BoundaryMap;
  harmony_principles: HarmonyPrinciples;
  harmony_lookup: HarmonyLookup;
  color_properties: ColorProperties;
  glass: GlassRules;
  forbidden: ForbiddenPattern[];
  escapeHatch: EscapeHatch;
}

// Usage in components:
// import type { ColorIntelligence, ContextName } from '@/data/color-intelligence.types';
// import colorData from '@/data/color-intelligence.json';
// const data = colorData as ColorIntelligence;
```

**Benefit:** MDX and React components get autocomplete + compile-time checking when importing from JSON.

### Modify
| File | Change |
|------|--------|
| `src/stories/foundation/ContrastMatrix.mdx` | Import from JSON, remove hardcoded BOUNDARY_COLORS arrays |
| `CLAUDE.md` | Add color intelligence workflow, update lazy load table |
| `package.json` | Add `sync:color-intelligence` script |
| `mcp/src/index.ts` | Register 5 new tools |

### Delete
| File | Reason |
|------|--------|
| `.claude/contrast-matrix.json` | Redundant (53K lines → replaced by MCP tools) |
| `.claude/contrast-matrix.toon` | Replaced by color-intelligence.toon |
| `.claude/color-matrix.json` | Merged into color-intelligence.json |
| `.claude/color-matrix.toon` | Merged |

### Hookify Rules Consolidation

**Current:** 7 color-related rules scattered across hookify config

**Target:** 2 focused rules

| Rule | Validates | Patterns Caught |
|------|-----------|-----------------|
| `color-forbidden-patterns` | Forbidden list from color-intelligence.json | Raw hex (`#FF0000`), standard Tailwind (`bg-blue-500`), opacity on semantic (`bg-muted-bg/30`), same-family-on-self |
| `color-harmony-validation` | Harmony rules P1-P5 | Temperature clashes, semantic conflicts, family contrast violations |

```javascript
// Example hookify rule (color-forbidden-patterns)
{
  "name": "color-forbidden-patterns",
  "event": "PostToolUse",
  "tools": ["Edit", "Write"],
  "match": {
    "file": "**/*.{tsx,jsx,css}",
    "content": "#[0-9A-Fa-f]{3,8}|\\bbg-(red|blue|green|yellow|purple|pink|gray)-\\d{2,3}\\b|\\b(bg|text|border)-(muted|primary|secondary|accent)/\\d+"
  },
  "action": "warn",
  "message": "Forbidden color pattern detected. Use DDS semantic tokens. Query mcp__dds__get_color_recommendation for guidance."
}
```

---

## Agent Workflow (After Implementation)

```
Agent receives task: "Build a dark mode card"
         │
         ▼
Agent queries: mcp__dds__get_color_recommendation({
  context: "card",
  theme: "dark"
})
         │
         ▼
System returns: {
  background: {
    solid: "bg-elevated",
    glass: "bg-black/40 backdrop-blur-[4px]"
  },
  text: {
    primary: "text-primary",      // Maps to SLATE[100] in dark
    secondary: "text-secondary"   // Maps to SLATE[300] in dark
  },
  border: "border-2 border-accent",
  shadow: "shadow-md"
}
         │
         ▼
Agent writes code with EXACT tokens - no guessing
         │
         ▼
Hookify validates on save - catches any violations
```

### MCP Tool Selection Guide

**Which tool should the agent use?** Decision tree for color-related queries:

```
                    ┌─────────────────────────────────────────────┐
                    │         AGENT COLOR QUERY                   │
                    └─────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
        "What color should I use?"            "Is this color valid?"
                    │                                       │
                    ▼                                       ▼
┌───────────────────────────────────┐   ┌───────────────────────────────────┐
│ Need token for UI context?        │   │ Check a specific combo?           │
│ → get_color_recommendation        │   │ → validate_color_choice           │
│                                   │   │                                   │
│ Input: {context, theme, element}  │   │ Input: {bg, fg, context}          │
│ Output: ranked recommendations    │   │ Output: pass/fail + suggestion    │
│                                   │   │                                   │
│ Examples:                         │   │ Examples:                         │
│ • "card bg in dark mode"          │   │ • "CORAL on ABYSS for badge"      │
│ • "button text color"             │   │ • "white on DEEP_CURRENT[700]"    │
│ • "badge error variant"           │   │ • "check my input focus ring"     │
└───────────────────────────────────┘   └───────────────────────────────────┘
                    │
        "Do these colors work together?"
                    │
                    ▼
┌───────────────────────────────────┐   ┌───────────────────────────────────┐
│ Check harmony/pairing?            │   │ Pure WCAG contrast ratio?         │
│ → get_color_harmony               │   │ → check_contrast (existing)       │
│                                   │   │                                   │
│ Input: {color}                    │   │ Input: {background, foreground}   │
│ Output: companions, avoid list    │   │ Output: ratio, AA/AAA level       │
│                                   │   │                                   │
│ Examples:                         │   │ Examples:                         │
│ • "What pairs with CORAL?"        │   │ • "ratio of white on ABYSS[900]"  │
│ • "Avoid list for DEEP_CURRENT"   │   │ • "does SLATE[400] pass on white" │
│ • "Temperature-compatible colors" │   │ • "minimum passing on IVORY[200]" │
└───────────────────────────────────┘   └───────────────────────────────────┘
                    │
        "How do I implement glass?"
                    │
                    ▼
┌───────────────────────────────────┐   ┌───────────────────────────────────┐
│ Glass/transparency rules?         │   │ Data visualization colors?        │
│ → get_glass_rules                 │   │ → get_color_recommendation        │
│                                   │   │                                   │
│ Input: {depth}                    │   │ Input: {context: "dataViz", ...}  │
│ Output: classes, blur, text rules │   │ Output: categorical, sequential,  │
│                                   │   │         diverging palettes        │
│ Examples:                         │   │                                   │
│ • "glass for depth 2 card"        │   │ Examples:                         │
│ • "modal overlay opacity"         │   │ • "chart categorical palette"     │
│ • "text placement on glass"       │   │ • "heatmap color scale"           │
└───────────────────────────────────┘   └───────────────────────────────────┘
```

**Quick Reference:**

| Question | Tool | Key Input |
|----------|------|-----------|
| "What color for X?" | `get_color_recommendation` | `context`, `theme`, `element` |
| "Do A and B work together?" | `get_color_harmony` | `color` |
| "Is A on B valid?" | `validate_color_choice` | `bg`, `fg`, `context` |
| "What's the contrast ratio?" | `check_contrast` | `background`, `foreground` |
| "How do I make glass?" | `get_glass_rules` | `depth` |
| "Chart colors?" | `get_color_recommendation` | `context: "dataViz"` |

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Color-related files | 7+ | 3 (source, generated, .toon) |
| Agent color questions | Many | Zero (system answers all) |
| Color drift incidents | Occasional | Zero (automated validation) |
| Context lines for colors | 53K+ | ~500 |
| MCP tool coverage | Contrast only | Contrast + Harmony + Context |

---

## Definition of Done

**Phase 5 is complete when ALL of the following are true:**

| Acceptance Criteria | Verification Method | Status |
|---------------------|---------------------|--------|
| Agent can answer "what color for [any context]?" via MCP | Test all 13 contexts with `get_color_recommendation` | ⬜ |
| MCP response time < 100ms for all tools | Benchmark during Phase 3.5 testing | ⬜ |
| Zero color violations in codebase | `npm run lint` + hookify passes | ⬜ |
| ContrastMatrix.mdx imports from JSON (no hardcoded arrays) | Visual inspection of MDX | ⬜ |
| `.claude/` folder reduced by 50K+ lines | `wc -l .claude/*.json` before/after | ⬜ |
| All 5 MCP tools have test coverage | Happy path + error case tests pass | ⬜ |
| ColorIntelligence.stories.tsx renders all contexts | Storybook visual review | ⬜ |
| CLAUDE.md updated with new workflow | Mentions `color-intelligence.json` | ⬜ |
| Hookify consolidated to 2 color rules | Count rules in hookify config | ⬜ |
| Rollback tag created | `git tag -l | grep pre-color-intelligence` | ⬜ |

**Sign-off required before marking Phase 5 complete.**

---

## Reference Implementations

### Gold Standard: EntityTemplatesPage
```tsx
// Page layout
<main className="bg-page">
  <GridBlobBackground />

  // Content panel - Depth 2 glass
  <section className="bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md">

    // Nested surface - Depth 3 solid
    <SearchFilter className="bg-surface border border-default shadow-sm" />

    // Content
    <DataTable />
  </section>
</main>
```

### Status States: KPICard
```tsx
// Success state
className="bg-success-tint text-success-strong dark:text-white"

// Warning state
className="bg-warning-tint text-warning-dark dark:text-white"

// Error state
className="bg-error-tint text-error-strong dark:text-white"
```

---

## Pre-Implementation Checklist

**Must verify before Phase 5 (Cleanup):**

| Check | Action | Status |
|-------|--------|--------|
| **Deletion safety** | Before deleting `contrast-matrix.json` (53K lines), verify all 5 new MCP tools can answer any query the old file supported | ⬜ Pending |
| **Badge AAA enforcement** | Ensure MCP tools automatically enforce 7:1 ratio for small text (12-14px) in badge context | ⬜ Pending |
| **Existing code audit** | Run hookify on codebase to identify existing forbidden patterns before cleanup | ⬜ Pending |
| **Document audit results** | Record hookify audit findings in `changelog.json` under "color-intelligence-audit" entry (even if 0 violations found) | ⬜ Pending |

**Deferred to v2:**

| Feature | Rationale |
|---------|-----------|
| **Custom brand colors** | Consuming apps may need to extend with their own brand palette. Add `customColors` section that inherits from base principles |
| **Migration warnings** | Add deprecation notices for code using forbidden patterns (hookify catches new violations, but legacy code needs audit tooling) |
| **High-contrast theme** | Accessibility mode beyond light/dark - extend `themes` object when needed |

---

## Questions to Resolve

1. ~~**Harmony rules** - Should these be manually curated or algorithmically derived?~~ ✅ **Resolved:** Manually curated with temperature-based rationale (see Section 3)
2. ~~**Theme variants** - Do we need more than light/dark (e.g., high-contrast)?~~ ✅ **Resolved:** Defer to v2. Current light/dark is sufficient for MVP. High-contrast mode can be added later by extending `themes` object.
3. ~~**Animation colors** - Should motion/transition states have color guidance?~~ ✅ **Resolved:** Not needed. Motion uses same tokens with opacity/scale/transform transitions. Color stays constant during animation.
4. ~~**Print colors** - Any considerations for print stylesheets?~~ ✅ **Resolved:** Out of scope for v1. Add `@media print` rules in separate future effort if needed.

---

## Next Steps

1. ~~Review and approve this plan~~ ✅ **Done:** Plan reviewed and updated (v1.8)
2. **START HERE →** Phase 1: Create `src/data/color-intelligence.json` schema
3. Populate with reference data from EntityTemplatesPage
4. Build generation script (`scripts/generate-color-intelligence.js`)
5. Add 5 MCP tools to `/mcp/src/tools/`
6. Update MDX to import from JSON
7. Clean up obsolete files (53K+ lines removed)

**Estimated Agent Time:** 5.5-6.5 hours total

| Phase | Task | Est. Time |
|-------|------|-----------|
| 1 | Create JSON schema with all contexts + types | 55 min |
| 2 | Build generation script + validation + type generation | 70 min |
| 3 | Implement 5 MCP tools (includes `get_glass_rules`) | 90 min |
| 3.5 | Test MCP tools (all contexts, edge cases) | 30 min |
| 4 | Update MDX, remove hardcoded arrays | 30 min |
| 5 | Delete obsolete files, update CLAUDE.md, git tag | 30 min |
| 6 | Taste feedback loop (post-launch) | Future |

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-03 | Initial plan |
| 1.1 | 2026-01-03 | **Review fixes applied:** |
| | | • Added schema metadata with versioning |
| | | • Expanded button states (active, focus, loading) |
| | | • Added input context (focus, error, disabled, readonly) |
| | | • Added navigation context (item states, dividers) |
| | | • Added tooltip context |
| | | • Expanded boundaries to ~15 common backgrounds |
| | | • Added all 10 color families to harmony map |
| | | • Clarified glass rules with text placement decision tree |
| | | • Added temperature property to harmony rules |
| 1.2 | 2026-01-03 | **Teachable harmony system:** |
| | | • Added 4 core principles (P1-P4) agents can derive from |
| | | • Added 6-step decision tree for color selection |
| | | • Added color_properties with temperature, semantic, role |
| | | • Added avoid_reason to lookup table (principle references) |
| | | • Separated "why" from "what" - agents learn reasoning |
| 1.3 | 2026-01-03 | **Phase 6 added:** Taste feedback loop (post-launch) |
| | | • Human-in-the-loop refinement via visual comparison |
| | | • TasteTest.stories.tsx for side-by-side evaluation |
| | | • taste_journal for capturing feedback → new principles |
| 1.4 | 2026-01-03 | **10/10 polish - All gaps addressed:** |
| | | • Added `tableRow` context (default, hover, selected, striped, disabled, loading) |
| | | • Added `badge` context with variants and sizes (AAA for small text) |
| | | • Added P5: Semantic Priority principle (semantic > temperature) |
| | | • Updated decision tree to 7 steps with P5 first |
| | | • Clarified file location: `src/data/` source + `.claude/` generated |
| 1.5 | 2026-01-03 | **Data integrity fixes (3rd review):** |
| | | • Added IVORY family (actual warm light-mode backgrounds) |
| | | • Fixed LINEN temperature: "neutral-warm" → "cool" (it's blue tints) |
| | | • Fixed WAVE semantic: "success-alt" → "info" |
| | | • Fixed DEEP_CURRENT[700] hex: #0D4D51 → #056271 |
| | | • Fixed decision tree STEP 4 redundancy (now non-semantic selection) |
| | | • Fixed raw Tailwind: striped/loading/badge use semantic tokens |
| | | • Updated harmony_lookup for IVORY + corrected LINEN |
| | | • Enhanced MCP tool responses with full `rationale` object |
| | | • Specified 2 consolidated hookify rules with example |
| | | • Resolved all 4 questions |
| | | • Revised time estimate to 4-5 hours with breakdown |
| | | • Added line estimates for all new files |
| 1.6 | 2026-01-03 | **Final hex validation (4th review):** |
| | | • Fixed boundaries: LINEN[100/200] → IVORY[200/300] (warm beige, not blue) |
| | | • Fixed surface hex: #FFFFFF → #FAF8F3 (actual IVORY[100]) |
| | | • Fixed CORAL[600] hex: #D94242 → #DC2626 |
| | | • All hex values now match designTokens.ts source of truth |
| 1.7 | 2026-01-03 | **Implementation safeguards (5th review):** |
| | | • Added Pre-Implementation Checklist with 3 verification gates |
| | | • Added Phase 3.5: MCP Tool Testing (happy path + edge cases) |
| | | • Added missing `get_glass_rules` to Phase 3 checklist |
| | | • Added Rollback Plan with git tag safety protocol for Phase 5 |
| | | • Added CI hookify integration to Phase 5 (optional) |
| | | • Documented v2 deferrals: custom brand colors, migration warnings, high-contrast theme |
| | | • Updated time estimate: 4-5hr → 5-6hr (includes testing phase) |
| 1.8 | 2026-01-03 | **P2 semantic alignment (6th review):** |
| | | • Fixed WAVE semantic: moved from "success" to "info" category in P2 |
| | | • Added IVORY to "neutral" category in P2 semantics |
| | | • P2 semantics now fully aligned with color_properties definitions |
| 1.9 | 2026-01-03 | **Pre-implementation polish (7th review):** |
| | | • Added `default` fallback context for custom/unknown components |
| | | • Added `escapeHatch` with `data-dds-override` attribute for intentional rule breaks |
| | | • Added TypeScript types generation (`color-intelligence.types.ts`) |
| | | • Updated generation script to include type generation (~180 lines) |
| | | • Updated time estimates: 5-6hr → 5.5-6.5hr |
| | | • Total contexts now 12 (default + 11 standard) |
| 2.0 | 2026-01-03 | **Data visualization & tool clarity (8th review):** |
| | | • Added `dataViz` context with categorical, sequential, and diverging palettes |
| | | • Categorical: 6-color palette with semantic roles (brand, secondary, positive, negative, warning, neutral) |
| | | • Sequential: cool (DEEP_CURRENT), warm (CORAL), success (HARBOR) scales |
| | | • Diverging: CORAL→SLATE→HARBOR for positive/negative value visualization |
| | | • Added accessibility guidance: colorblind-safe, patterns, direct labels |
| | | • Added MCP Tool Selection Guide with visual decision tree |
| | | • Added Quick Reference table mapping questions to tools |
| | | • Total contexts now 13 (default + 12 standard including dataViz) |
| | | • No time estimate change (dataViz uses existing tool infrastructure) |
| 2.1 | 2026-01-03 | **MCP robustness & composite rules (9th review):** |
| | | • Added MCP Error Handling section with structured error responses |
| | | • Added `did_you_mean` typo correction for unknown colors |
| | | • Added Composite Context Rules for nested contexts (modal > card, card > surface) |
| | | • Added forbidden nesting patterns (glass > glass, surface > card, badge > badge) |
| | | • Added Definition of Done section with 10 acceptance criteria |
| | | • Added `ColorIntelligence.stories.tsx` to Phase 4 for visual reference |
| 2.2 | 2026-01-03 | **Minor suggestions from review (10th review):** |
| | | • Added dataViz-specific test cases to Phase 3.5 (categorical, sequential, diverging) |
| | | • Added `transition` property to button context (default + withScale variants) |
| | | • Added "Document audit results" to Pre-Implementation Checklist (changelog entry) |
| 2.3 | 2026-01-03 | **Schema consistency fixes (11th review):** |
| | | • Fixed TypeScript `ContextName` type to include `'dataViz'` |
| | | • Added `exceptions` to "Opacity on semantic tokens" forbidden pattern (`ring-error/20`, `ring-accent/20`) |
| | | • Fixed `navigation.solid` schema to use `ThemeColor` objects (was string, now matches other contexts) |

### Review Scores (v2.3)

| Category | Score | Notes |
|----------|-------|-------|
| Completeness | 10/10 | 13 contexts (default + page, card, surface, modal, button, input, nav, tooltip, tableRow, badge, status, dataViz) |
| Clarity | 10/10 | Principles + 7-step decision tree + MCP tool selection guide + rationale in responses |
| Feasibility | 10/10 | Realistic 5.5-6.5hr estimate with phase breakdown |
| Maintainability | 10/10 | Schema versioning, generation script, TypeScript types, drift detection, hookify validation |
| Teachability | 10/10 | P1-P5 principles let agent derive answers + rationale explains why |
| Safety | 10/10 | Pre-implementation gates, rollback plan, escape hatch, git tag protocol for Phase 5 |
| **Overall** | **10/10** | Ready for implementation |
