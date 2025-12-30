#!/usr/bin/env node

/**
 * Design Token Generator - Exports ALL DDS semantic tokens
 *
 * GENERATES: src/styles/tokens.css
 * - CSS custom properties for consumer projects
 * - Utility classes for components
 *
 * Run via: npm run generate-tokens
 */

import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

// =============================================================================
// DESIGN TOKENS (synced from designTokens.ts and styles.css @theme)
// =============================================================================

const TOKENS = {
  IVORY: {
    50: '#FFFEF9',
    100: '#FAF8F3',
    200: '#F0EDE6',
    300: '#E5E2DB',
    400: '#D5D2CB',
  },
  DUSK_REEF: {
    50: '#EFEDF3',
    300: '#9F93B7',
    400: '#7F6F9F',
    500: '#5E4F7E',
  },
  ABYSS: {
    100: '#D1D3D7',
    200: '#A3A7AF',
    300: '#757B87',
    400: '#474F5F',
    500: '#2D3142',
    600: '#252836',
    700: '#1D1F2A',
    800: '#14161E',
    900: '#0C0D12',
  },
  DEEP_CURRENT: {
    50: '#E6F7FA',
    100: '#CCEFF5',
    200: '#99DFEB',
    300: '#66CFE1',
    400: '#33BFD7',
    500: '#08A4BD',
    600: '#068397',
    700: '#056271',
    800: '#03424B',
    900: '#022125',
  },
  HARBOR: {
    500: '#22C55E',
    700: '#15803D',
    800: '#166534',
  },
  SUNRISE: {
    500: '#EAB308',
    700: '#A16207',
    800: '#92400E',
  },
  CORAL: {
    450: '#EF4444',
    500: '#F70D1A',
    700: '#B91C1C',
  },
  WAVE: {
    500: '#3B82F6',
  },
  ORANGE: {
    500: '#F97316',
    900: '#7C2D12',
  },
}

function generateTokensCSS() {
  return `/**
 * Disrupt Design System - CSS Design Tokens
 *
 * AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated from: src/constants/designTokens.ts
 * To update: Edit designTokens.ts, then run: npm run generate-tokens
 *
 * Last generated: ${new Date().toISOString()}
 */

/* =============================================================================
 * CSS Custom Properties (required by DDS components)
 * Import this file in your consumer project BEFORE design-system.css
 * ============================================================================= */

:root {
  /* --- Focus ring --- */
  --ring: oklch(0.647 0.145 205.36);

  /* --- Brand Colors --- */
  --color-dark: ${TOKENS.ABYSS[500]};
  --color-teal: ${TOKENS.DEEP_CURRENT[700]};
  --color-teal-light: ${TOKENS.DEEP_CURRENT[300]};
  --color-cream: #FBFBF3;

  /* --- Text Colors --- */
  --color-primary: ${TOKENS.ABYSS[500]};
  --color-secondary: ${TOKENS.DUSK_REEF[500]};
  --color-tertiary: ${TOKENS.DUSK_REEF[400]};
  --color-muted: ${TOKENS.DUSK_REEF[500]};
  --color-emphasis: ${TOKENS.ABYSS[400]};
  --color-disabled: ${TOKENS.DUSK_REEF[300]};
  --color-inverse: #FFFFFF;
  --color-link: ${TOKENS.DEEP_CURRENT[500]};
  --color-link-hover: ${TOKENS.DEEP_CURRENT[600]};
  --color-text-accent: ${TOKENS.DEEP_CURRENT[700]};

  /* --- Background Colors --- */
  --color-page: ${TOKENS.IVORY[200]};
  --color-surface: #FFFFFF;
  --color-surface-hover: ${TOKENS.DEEP_CURRENT[50]};
  --color-surface-active: #D4F2F6;
  --color-elevated: ${TOKENS.IVORY[50]};
  --color-muted-bg: ${TOKENS.DUSK_REEF[50]};
  --color-inverse-bg: ${TOKENS.ABYSS[500]};
  --color-inverse-subtle: ${TOKENS.ABYSS[700]};
  --color-accent-bg: ${TOKENS.DEEP_CURRENT[50]};
  --color-accent-strong: ${TOKENS.DEEP_CURRENT[600]};
  --color-accent-dark: ${TOKENS.DEEP_CURRENT[800]};

  /* --- Border Colors --- */
  --color-default: ${TOKENS.IVORY[300]};
  --color-slate: ${TOKENS.IVORY[300]};
  --color-subtle: ${TOKENS.ABYSS[100]};
  --color-strong: ${TOKENS.ABYSS[300]};
  --color-focus: ${TOKENS.DEEP_CURRENT[500]};
  --color-accent: ${TOKENS.DEEP_CURRENT[500]};

  /* --- Status Colors --- */
  --color-error: ${TOKENS.CORAL[500]};
  --color-error-light: #FEF2F2;
  --color-error-muted: #FEE2E2;
  --color-error-strong: ${TOKENS.CORAL[700]};
  --color-success: ${TOKENS.HARBOR[500]};
  --color-success-light: #F0FDF4;
  --color-success-muted: #DCFCE7;
  --color-success-strong: ${TOKENS.HARBOR[700]};
  --color-success-dark: ${TOKENS.HARBOR[800]};
  --color-warning: ${TOKENS.SUNRISE[500]};
  --color-warning-light: #FFFBEB;
  --color-warning-muted: #FEF3C7;
  --color-warning-dark: ${TOKENS.SUNRISE[800]};
  --color-warning-strong: ${TOKENS.SUNRISE[800]};
  --color-info: ${TOKENS.WAVE[500]};
  --color-info-light: #EFF6FF;
  --color-info-muted: #DBEAFE;

  /* --- Feature Colors --- */
  --color-featureBlue: ${TOKENS.WAVE[500]};
  --color-featureRed: ${TOKENS.CORAL[450]};
  --color-featureYellow: ${TOKENS.SUNRISE[500]};
  --color-featureGreen: ${TOKENS.HARBOR[500]};
  --color-circleBlue: ${TOKENS.WAVE[500]};
  --color-circleRed: ${TOKENS.CORAL[450]};
  --color-circleYellow: ${TOKENS.SUNRISE[500]};
  --color-circleGreen: ${TOKENS.HARBOR[500]};

  /* --- Purple Shades --- */
  --color-light-purple: ${TOKENS.DUSK_REEF[50]};
  --color-dark-purple: ${TOKENS.DUSK_REEF[500]};

  /* --- Aging/Urgent --- */
  --color-aging: ${TOKENS.ORANGE[500]};
  --color-aging-dark: ${TOKENS.ORANGE[900]};

  /* --- Shadcn/UI Required Variables --- */
  --background: ${TOKENS.IVORY[200]};
  --foreground: ${TOKENS.ABYSS[500]};
  --border: ${TOKENS.IVORY[300]};

  /* --- Brand Palette (for primitives) --- */
  --brand-coral-600: #DC2626;
  --brand-coral-800: #991B1B;
  --brand-harbor-800: ${TOKENS.HARBOR[800]};
  --brand-deep-current-700: ${TOKENS.DEEP_CURRENT[700]};
}

.dark {
  --ring: oklch(0.730 0.135 205.36);

  /* --- Text Colors (dark mode) --- */
  --color-primary: ${TOKENS.IVORY[50]};
  --color-secondary: ${TOKENS.IVORY[300]};
  --color-tertiary: ${TOKENS.IVORY[400]};
  --color-muted: ${TOKENS.IVORY[300]};
  --color-emphasis: ${TOKENS.IVORY[100]};
  --color-disabled: ${TOKENS.ABYSS[400]};
  --color-inverse: ${TOKENS.ABYSS[500]};
  --color-text-accent: ${TOKENS.DEEP_CURRENT[300]};

  /* --- Background Colors (dark mode) --- */
  --color-page: ${TOKENS.ABYSS[900]};
  --color-surface: ${TOKENS.ABYSS[700]};
  --color-surface-hover: ${TOKENS.ABYSS[600]};
  --color-elevated: ${TOKENS.ABYSS[500]};
  --color-muted-bg: ${TOKENS.ABYSS[800]};
  --color-inverse-bg: ${TOKENS.IVORY[100]};
  --color-accent-bg: ${TOKENS.ABYSS[800]};

  /* --- Border Colors (dark mode) --- */
  --color-default: ${TOKENS.ABYSS[400]};
  --color-slate: ${TOKENS.ABYSS[400]};
  --color-subtle: ${TOKENS.ABYSS[600]};
  --color-strong: ${TOKENS.ABYSS[300]};

  /* --- Shadcn/UI Required Variables (dark mode) --- */
  --background: ${TOKENS.ABYSS[900]};
  --foreground: ${TOKENS.IVORY[50]};
  --border: ${TOKENS.ABYSS[400]};
}

/* =============================================================================
 * Utility Classes (for components that use CVA variants)
 * These classes reference the CSS variables above
 * ============================================================================= */

/* Background utilities */
.bg-page { background-color: var(--color-page); }
.bg-surface { background-color: var(--color-surface); }
.bg-elevated { background-color: var(--color-elevated); }
.bg-muted { background-color: var(--color-muted-bg); }
.bg-inverse-bg { background-color: var(--color-inverse-bg); }
.bg-muted-bg { background-color: var(--color-muted-bg); }
.bg-accent-strong { background-color: var(--color-accent-strong); }

/* Text utilities */
.text-primary { color: var(--color-primary); }
.text-secondary { color: var(--color-secondary); }
.text-muted { color: var(--color-muted); }
.text-inverse { color: var(--color-inverse); }
.text-accent { color: var(--color-text-accent); }

/* Border utilities */
.border-default { border-color: var(--color-default); }
.border-subtle { border-color: var(--color-subtle); }

/* Status utilities */
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-error { color: var(--color-error); }
.text-info { color: var(--color-info); }
.bg-success { background-color: var(--color-success); }
.bg-warning { background-color: var(--color-warning); }
.bg-error { background-color: var(--color-error); }
.bg-info { background-color: var(--color-info); }
.bg-error-strong { background-color: var(--color-error-strong); }

/* Hover variants */
.hover\\:bg-inverse-bg\\/90:hover { background-color: color-mix(in srgb, var(--color-inverse-bg) 90%, transparent); }
.hover\\:bg-muted-bg\\/80:hover { background-color: color-mix(in srgb, var(--color-muted-bg) 80%, transparent); }
.hover\\:bg-accent-strong\\/90:hover { background-color: color-mix(in srgb, var(--color-accent-strong) 90%, transparent); }
.hover\\:bg-error-strong\\/90:hover { background-color: color-mix(in srgb, var(--color-error-strong) 90%, transparent); }
.hover\\:bg-page:hover { background-color: var(--color-page); }

/* Focus utilities */
.focus-visible\\:ring-accent\\/30:focus-visible {
  --tw-ring-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
  box-shadow: var(--tw-ring-inset, ) 0 0 0 3px var(--tw-ring-color);
}
.focus-visible\\:border-accent:focus-visible { border-color: var(--color-accent); }

/* Text on status (always white for colored backgrounds) */
.text-on-status { color: #FFFFFF; }


/* =============================================================================
 * Essential Tailwind Utilities (missing from library build)
 * These are needed because Tailwind v4 doesn't preserve them in library mode
 * Plain CSS (not @layer) ensures these override Tailwind's base reset
 * ============================================================================= */

/* Border width */
.border { border-width: 1px; }
.border-0 { border-width: 0px; }
.border-2 { border-width: 2px; }
.border-t { border-top-width: 1px; }
.border-b { border-bottom-width: 1px; }
.border-l { border-left-width: 1px; }
.border-r { border-right-width: 1px; }

/* Border radius */
.rounded { border-radius: 0.25rem; }
.rounded-md { border-radius: 0.375rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-2xl { border-radius: 1rem; }
.rounded-full { border-radius: 9999px; }

/* Box shadow */
.shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }
.shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
`
}

// =============================================================================
// MAIN
// =============================================================================

console.log('DDS Token Generator\n')
console.log('Generating src/styles/tokens.css with ALL semantic tokens...')

try {
  const tokensCSS = generateTokensCSS()
  const tokensPath = resolve(rootDir, 'src/styles/tokens.css')
  writeFileSync(tokensPath, tokensCSS)
  console.log('Generated tokens.css with comprehensive token set')
  console.log('\nToken generation complete!')
} catch (error) {
  console.error('\nToken generation failed:', error.message)
  process.exit(1)
}
