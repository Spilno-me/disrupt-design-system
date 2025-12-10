import js from '@eslint/js'
import tseslint from 'typescript-eslint'

/**
 * ESLint Configuration for Disrupt Design System
 *
 * This config enforces the use of design tokens instead of hardcoded values.
 * See CLAUDE.md for the complete design token guidelines.
 */

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'storybook-static/**',
      '*.config.js',
      '*.config.ts',
      '.storybook/**',
      'src/**/*.css',
      'src/**/_archive/**',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // =================================================================
      // DESIGN TOKEN ENFORCEMENT RULES
      // =================================================================

      // Catch hardcoded hex colors in string literals
      'no-restricted-syntax': [
        'error',
        // -----------------------------------------------------------------
        // COLOR RULES
        // -----------------------------------------------------------------
        {
          // Matches hex colors like '#2D3142', '#fff', '#FF0000FF'
          selector: 'Literal[value=/^#[0-9A-Fa-f]{3,8}$/]',
          message:
            '🚫 Hardcoded hex color detected. Use design tokens instead:\n' +
            '   - Tailwind: text-dark, bg-teal, bg-cream\n' +
            '   - TypeScript: ALIAS.text.primary, ALIAS.brand.secondary\n' +
            '   See CLAUDE.md for token reference.',
        },
        {
          // Matches template literals containing hex colors
          selector: 'TemplateLiteral[quasis.0.value.raw=/.*#[0-9A-Fa-f]{3,8}.*/]',
          message:
            '🚫 Hardcoded hex color in template literal. Use design tokens instead.\n' +
            '   See CLAUDE.md for token reference.',
        },
        {
          // Matches simple rgba() as a standalone color (not in gradients)
          // Allows: linear-gradient(...rgba...) but catches: background: 'rgba(0,0,0,0.5)'
          selector: 'Literal[value=/^rgba?\\s*\\([^)]+\\)$/]',
          message:
            '🚫 Hardcoded rgba() color detected. Use ALIAS.overlay tokens instead:\n' +
            '   - ALIAS.overlay.light (glass effect)\n' +
            '   - ALIAS.overlay.dark (modal overlay)\n' +
            '   - ALIAS.overlay.medium (semi-transparent)\n' +
            '   See CLAUDE.md for token reference.',
        },
        {
          // Catch direct imports from PRIMITIVES (Tier 1)
          selector: 'ImportSpecifier[imported.name=/^(ABYSS|DEEP_CURRENT|DUSK_REEF|CORAL|WAVE|SUNRISE|HARBOR|ORANGE|SLATE|PRIMITIVES)$/]',
          message:
            '🚫 Direct import of Tier 1 PRIMITIVES is not allowed in components.\n' +
            '   Use Tier 2 (ALIAS) or Tier 3 (MAPPED) tokens instead:\n' +
            '   - import { ALIAS } from "@/constants/designTokens"\n' +
            '   - import { MAPPED } from "@/constants/designTokens"\n' +
            '   See CLAUDE.md for the 3-tier architecture.',
        },
        {
          // Catch deprecated BRAND import
          selector: 'ImportSpecifier[imported.name="BRAND"]',
          message:
            '🚫 BRAND tokens are DEPRECATED. Use ALIAS equivalents:\n' +
            '   - BRAND.abyss → ALIAS.brand.primary\n' +
            '   - BRAND.deepCurrent → ALIAS.brand.secondary\n' +
            '   - BRAND.redCoral → ALIAS.status.error\n' +
            '   See CLAUDE.md for full migration guide.',
        },

        // -----------------------------------------------------------------
        // BORDER-RADIUS RULES
        // -----------------------------------------------------------------
        {
          // Catches: borderRadius: '4px', borderRadius: '16px', etc.
          selector: 'Property[key.name="borderRadius"][value.type="Literal"][value.value=/^\\d+px$/]',
          message:
            '🚫 Hardcoded border-radius detected. Use RADIUS tokens instead:\n' +
            '   - RADIUS.xs (4px), RADIUS.sm (8px), RADIUS.md (12px)\n' +
            '   - RADIUS.lg (16px), RADIUS.xl (20px), RADIUS.full (9999px)\n' +
            '   Or use Tailwind: rounded-xs, rounded-sm, rounded-md, rounded-lg',
        },
        {
          // Catches: borderRadius: 4, borderRadius: 16, etc. (number values)
          selector: 'Property[key.name="borderRadius"][value.type="Literal"][value.raw=/^\\d+$/]',
          message:
            '🚫 Hardcoded border-radius number detected. Use RADIUS tokens instead:\n' +
            '   - RADIUS.xs (4px), RADIUS.sm (8px), RADIUS.md (12px)\n' +
            '   - RADIUS.lg (16px), RADIUS.xl (20px), RADIUS.full (9999px)\n' +
            '   Or use Tailwind: rounded-xs, rounded-sm, rounded-md, rounded-lg',
        },
        {
          // Catches borderTopLeftRadius, borderTopRightRadius, etc.
          selector: 'Property[key.name=/^border(Top|Bottom)(Left|Right)Radius$/][value.type="Literal"][value.value=/^\\d+px$/]',
          message:
            '🚫 Hardcoded border-radius detected. Use RADIUS tokens instead:\n' +
            '   - RADIUS.xs (4px), RADIUS.sm (8px), RADIUS.md (12px)\n' +
            '   Or use Tailwind: rounded-tl-md, rounded-tr-lg, etc.',
        },

        // -----------------------------------------------------------------
        // BOX-SHADOW RULES
        // -----------------------------------------------------------------
        {
          // Catches: boxShadow: '0 1px 2px rgba(...)' or any shadow string
          selector: 'Property[key.name="boxShadow"][value.type="Literal"][value.value=/^\\d+.*px/]',
          message:
            '🚫 Hardcoded box-shadow detected. Use SHADOWS tokens instead:\n' +
            '   - SHADOWS.sm, SHADOWS.md, SHADOWS.lg, SHADOWS.xl\n' +
            '   - SHADOWS.realistic, SHADOWS.image, SHADOWS.header\n' +
            '   Or use Tailwind: shadow-sm, shadow-md, shadow-lg',
        },
        {
          // Catches template literal shadows
          selector: 'Property[key.name="boxShadow"][value.type="TemplateLiteral"]',
          message:
            '🚫 Hardcoded box-shadow in template literal. Use SHADOWS tokens instead:\n' +
            '   - SHADOWS.sm, SHADOWS.md, SHADOWS.lg, SHADOWS.xl\n' +
            '   Or use Tailwind: shadow-sm, shadow-md, shadow-lg',
        },

        // -----------------------------------------------------------------
        // Z-INDEX RULES
        // -----------------------------------------------------------------
        {
          // Catches: zIndex: 100, zIndex: 50, etc.
          selector: 'Property[key.name="zIndex"][value.type="Literal"][value.raw=/^\\d+$/]',
          message:
            '🚫 Hardcoded z-index detected. Use Z_INDEX tokens instead:\n' +
            '   - Z_INDEX.background (0), Z_INDEX.content (1)\n' +
            '   - Z_INDEX.dropdown (10), Z_INDEX.sticky (20)\n' +
            '   - Z_INDEX.header (50), Z_INDEX.modal (100), Z_INDEX.tooltip (150)\n' +
            '   Or use Tailwind: z-0, z-10, z-20, z-50',
        },
        {
          // Catches: zIndex: '100'
          selector: 'Property[key.name="zIndex"][value.type="Literal"][value.value=/^\\d+$/]',
          message:
            '🚫 Hardcoded z-index string detected. Use Z_INDEX tokens instead:\n' +
            '   - Z_INDEX.background (0), Z_INDEX.content (1)\n' +
            '   - Z_INDEX.dropdown (10), Z_INDEX.sticky (20)\n' +
            '   - Z_INDEX.header (50), Z_INDEX.modal (100), Z_INDEX.tooltip (150)\n' +
            '   Or use Tailwind: z-0, z-10, z-20, z-50',
        },

        // -----------------------------------------------------------------
        // FONT-SIZE RULES
        // -----------------------------------------------------------------
        {
          // Catches: fontSize: '14px', fontSize: '16px', etc.
          selector: 'Property[key.name="fontSize"][value.type="Literal"][value.value=/^\\d+px$/]',
          message:
            '🚫 Hardcoded font-size detected. Use TYPOGRAPHY tokens instead:\n' +
            '   - TYPOGRAPHY.fontSize.xs (12px), TYPOGRAPHY.fontSize.sm (14px)\n' +
            '   - TYPOGRAPHY.fontSize.base (16px), TYPOGRAPHY.fontSize.lg (18px)\n' +
            '   Or use Tailwind: text-xs, text-sm, text-base, text-lg',
        },
        {
          // Catches: fontSize: '1rem', fontSize: '0.875rem', etc.
          selector: 'Property[key.name="fontSize"][value.type="Literal"][value.value=/^[\\d.]+rem$/]',
          message:
            '🚫 Hardcoded font-size in rem detected. Use TYPOGRAPHY tokens instead:\n' +
            '   - TYPOGRAPHY.fontSize.xs, TYPOGRAPHY.fontSize.sm\n' +
            '   - TYPOGRAPHY.fontSize.base, TYPOGRAPHY.fontSize.lg\n' +
            '   Or use Tailwind: text-xs, text-sm, text-base, text-lg',
        },

        // -----------------------------------------------------------------
        // SPACING RULES (inline styles)
        // -----------------------------------------------------------------
        {
          // Catches: padding: '16px', margin: '24px', gap: '8px', etc.
          selector: 'Property[key.name=/^(padding|margin|gap|top|left|right|bottom|width|height|maxWidth|minWidth|maxHeight|minHeight)$/][value.type="Literal"][value.value=/^\\d+px$/]',
          message:
            '🚫 Hardcoded spacing value detected. Use Tailwind spacing classes instead:\n' +
            '   - p-1, p-2, p-4, p-6, p-8 (padding)\n' +
            '   - m-1, m-2, m-4, m-6, m-8 (margin)\n' +
            '   - gap-1, gap-2, gap-4, gap-6, gap-8 (gap)\n' +
            '   Or use SPACING/SIZES constants for layout values.',
        },
        {
          // Catches paddingTop, paddingRight, marginLeft, etc.
          selector: 'Property[key.name=/^(padding|margin)(Top|Right|Bottom|Left)$/][value.type="Literal"][value.value=/^\\d+px$/]',
          message:
            '🚫 Hardcoded spacing value detected. Use Tailwind spacing classes instead:\n' +
            '   - pt-4, pr-4, pb-4, pl-4 (padding)\n' +
            '   - mt-4, mr-4, mb-4, ml-4 (margin)\n' +
            '   Or use SPACING constants for layout values.',
        },

        // -----------------------------------------------------------------
        // STANDARD TAILWIND COLOR BLOCKING (in className strings)
        // -----------------------------------------------------------------
        {
          // Catches: bg-gray-*, bg-slate-*, bg-zinc-*, bg-neutral-*, bg-stone-*
          selector: 'Literal[value=/\\bbg-(gray|zinc|neutral|stone)-\\d{2,3}\\b/]',
          message:
            '🚫 Standard Tailwind gray color detected. Use DDS tokens instead:\n' +
            '   - bg-surface, bg-page, bg-cream, bg-mutedBg, bg-lightPurple\n' +
            '   - bg-dark, bg-inverseBg for dark backgrounds\n' +
            '   See CLAUDE.md for full color reference.',
        },
        {
          // Catches: bg-red-*, bg-orange-*, bg-amber-*, bg-yellow-*
          selector: 'Literal[value=/\\bbg-(red|orange|amber|yellow)-\\d{2,3}\\b/]',
          message:
            '🚫 Standard Tailwind warm color detected. Use DDS tokens instead:\n' +
            '   - bg-error, bg-errorLight, bg-errorMuted (red)\n' +
            '   - bg-warning, bg-warningLight, bg-warningMuted (yellow)\n' +
            '   - bg-aging, bg-agingLight (orange)\n' +
            '   See CLAUDE.md for full color reference.',
        },
        {
          // Catches: bg-green-*, bg-emerald-*, bg-teal-*, bg-cyan-*
          selector: 'Literal[value=/\\bbg-(green|emerald|cyan)-\\d{2,3}\\b/]',
          message:
            '🚫 Standard Tailwind cool color detected. Use DDS tokens instead:\n' +
            '   - bg-success, bg-successLight, bg-successMuted (green)\n' +
            '   - bg-teal, bg-accentBg, bg-tealLight (teal/cyan)\n' +
            '   See CLAUDE.md for full color reference.',
        },
        {
          // Catches: bg-blue-*, bg-indigo-*, bg-violet-*, bg-purple-*
          selector: 'Literal[value=/\\bbg-(blue|indigo|violet|purple)-\\d{2,3}\\b/]',
          message:
            '🚫 Standard Tailwind blue/purple color detected. Use DDS tokens instead:\n' +
            '   - bg-info, bg-infoLight, bg-infoMuted (blue)\n' +
            '   - bg-lightPurple, bg-mutedBg (purple)\n' +
            '   - bg-featureBlue (feature indicator)\n' +
            '   See CLAUDE.md for full color reference.',
        },
        {
          // Catches: bg-pink-*, bg-rose-*, bg-fuchsia-*
          selector: 'Literal[value=/\\bbg-(pink|rose|fuchsia)-\\d{2,3}\\b/]',
          message:
            '🚫 Standard Tailwind pink color detected. Use DDS tokens instead:\n' +
            '   - bg-error, bg-errorLight (for error states)\n' +
            '   - bg-featureRed (for feature indicators)\n' +
            '   See CLAUDE.md for full color reference.',
        },
        {
          // Catches: text-gray-*, text-slate-*, text-zinc-*, etc.
          selector: 'Literal[value=/\\btext-(gray|zinc|neutral|stone)-\\d{2,3}\\b/]',
          message:
            '🚫 Standard Tailwind gray text color detected. Use DDS tokens instead:\n' +
            '   - text-primary, text-secondary, text-tertiary, text-muted\n' +
            '   - text-disabled, text-emphasis\n' +
            '   See CLAUDE.md for full color reference.',
        },
        {
          // Catches: text-red-*, text-green-*, text-blue-*, etc.
          selector: 'Literal[value=/\\btext-(red|orange|amber|yellow|green|emerald|teal|cyan|blue|indigo|violet|purple|pink|rose|fuchsia)-\\d{2,3}\\b/]',
          message:
            '🚫 Standard Tailwind colored text detected. Use DDS tokens instead:\n' +
            '   - text-error, text-success, text-warning, text-info (status)\n' +
            '   - text-teal, text-link, text-linkHover (accent)\n' +
            '   See CLAUDE.md for full color reference.',
        },
        {
          // Catches: border-gray-*, border-slate-*, etc.
          selector: 'Literal[value=/\\bborder-(gray|zinc|neutral|stone)-\\d{2,3}\\b/]',
          message:
            '🚫 Standard Tailwind gray border detected. Use DDS tokens instead:\n' +
            '   - border-default, border-slate, border-subtle, border-strong\n' +
            '   See CLAUDE.md for full color reference.',
        },
        {
          // Catches: border-red-*, border-green-*, border-blue-*, etc.
          selector: 'Literal[value=/\\bborder-(red|orange|amber|yellow|green|emerald|teal|cyan|blue|indigo|violet|purple|pink|rose|fuchsia)-\\d{2,3}\\b/]',
          message:
            '🚫 Standard Tailwind colored border detected. Use DDS tokens instead:\n' +
            '   - border-error, border-success, border-warning, border-info (status)\n' +
            '   - border-accent, border-teal, border-focus (accent)\n' +
            '   See CLAUDE.md for full color reference.',
        },
        {
          // Also catch bg-slate-* specifically (common mistake)
          selector: 'Literal[value=/\\bbg-slate-\\d{2,3}\\b/]',
          message:
            '🚫 Standard Tailwind slate color detected. Use DDS tokens instead:\n' +
            '   - bg-surface, bg-page, bg-cream (light backgrounds)\n' +
            '   - bg-mutedBg, bg-lightPurple (muted backgrounds)\n' +
            '   Note: border-slate IS allowed (it maps to DDS border-default).\n' +
            '   See CLAUDE.md for full color reference.',
        },
      ],

      // -----------------------------------------------------------------
      // STANDARD TAILWIND COLOR BLOCKING
      // Block usage of standard Tailwind colors in className strings
      // These rules catch common Tailwind color patterns that should use DDS tokens
      // -----------------------------------------------------------------

      // Note: We extend no-restricted-syntax above to also catch Tailwind colors
      // Adding more patterns to catch standard Tailwind colors in class strings

      // =================================================================
      // GENERAL TYPESCRIPT RULES
      // =================================================================

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',

      // Allow empty interfaces for component prop extensions
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    // Special rules for story files - more lenient
    files: ['src/**/*.stories.{ts,tsx}'],
    rules: {
      // Stories may need to demonstrate tokens, so we're more lenient
      'no-restricted-syntax': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    // Token definition files are allowed to have raw values
    files: ['src/constants/designTokens.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    // Demo/showcase components that need full palette access for demonstrations
    // These are NOT production components - they exist only to showcase the design system
    files: [
      'src/stories/**/*.tsx',
      'src/stories/**/*.ts',
    ],
    rules: {
      'no-restricted-syntax': 'off',
    },
  }
)
