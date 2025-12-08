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
      ],

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
