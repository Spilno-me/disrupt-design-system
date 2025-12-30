/**
 * DDS Prompt Library Data
 *
 * All prompts for agent operations in the design system.
 * Add new prompts here - they will automatically appear in the UI.
 */

import type { Prompt } from './PromptLibrary'

export const DDS_PROMPTS: Prompt[] = [
  // =============================================================================
  // STORIES
  // =============================================================================
  {
    id: 'story-full',
    title: 'Create Full Story for Component',
    description:
      'Generate a complete Storybook story with Default, AllStates, and contextual variants.',
    category: 'stories',
    variables: ['COMPONENT'],
    tags: ['storybook', 'documentation', 'testing'],
    prompt: `Create a complete Storybook story for {COMPONENT}.

REQUIREMENTS:
1. Read \`.claude/storybook-rules.md\` first
2. Import from \`src/stories/_infrastructure\`:
   - Meta preset: ATOM_META, MOLECULE_META, or ORGANISM_META
   - Decorators: withStoryContainer, withDarkBackground
   - Components: StorySection, StoryFlex, StoryGrid
3. Stories to include:
   - Default (basic usage)
   - AllStates (all variants, sizes, states in sections)
   - WithForm (if form-related)
   - OnDarkBackground (if applicable)

FORBIDDEN:
- Inline decorators like \`(Story) => <div>...</div>\`
- Hardcoded colors or spacing
- Custom wrapper functions
- Emojis in code

OUTPUT: Single .stories.tsx file ready to use.`,
  },
  {
    id: 'story-allstates',
    title: 'Create AllStates Story Only',
    description:
      'Generate an AllStates story showcasing all variants, sizes, and states.',
    category: 'stories',
    variables: ['COMPONENT', 'LEVEL'],
    tags: ['storybook', 'allstates'],
    prompt: `Create an AllStates story for {COMPONENT}.

Read \`.claude/storybook-rules.md\` and use infrastructure from \`src/stories/_infrastructure\`.

Structure:
- StorySection for each category (Variants, Sizes, States)
- StoryFlex or StoryGrid for layout
- Real component props (no CSS overrides)
- Include: default, hover (via decorator), focus, disabled, error states

Use withStoryContainer('{LEVEL}') decorator where LEVEL is atom, molecule, or organism.`,
  },

  // =============================================================================
  // COMPONENTS
  // =============================================================================
  {
    id: 'component-create',
    title: 'Create New UI Component',
    description:
      'Generate a new UI component following DDS patterns with CVA variants.',
    category: 'components',
    variables: ['COMPONENT'],
    tags: ['component', 'ui', 'cva'],
    prompt: `Create a new UI component: {COMPONENT}

BEFORE WRITING (MANDATORY - DO NOT SKIP):
1. Read \`.claude/component-dev-rules.md\` - especially "Duplicate Detection" section
2. Complete ALL 4 duplicate detection steps:
   - Search for similar components by concept + synonyms
   - Check \`agent-context.json\` registry
   - Check existing Storybook stories
   - Document your decision (exact match? 80% match? no match?)
3. Read \`.claude/ux-laws-rules.md\` for UX principles
4. Read \`.claude/color-matrix.json\` for allowed colors

DUPLICATE CHECK OUTPUT (required before proceeding):
\`\`\`
Similar components found: [list or "none"]
Decision: [USE_EXISTING | EXTEND_EXISTING | NEW_COMPONENT]
Reason: [brief justification]
\`\`\`

REQUIREMENTS:
- Use DDS tokens only (PRIMITIVES, ALIAS, SHADOWS, RADIUS)
- CVA for variants: \`class-variance-authority\`
- Forward ref pattern
- data-slot attributes for compound components
- TypeScript strict

FORBIDDEN:
- Creating component without completing duplicate detection
- Hardcoded hex colors
- Tailwind standard colors (red-500, blue-600)
- Custom CSS outside tokens

OUTPUT: Component file + story file + update to index.ts exports.`,
  },
  {
    id: 'component-stabilize',
    title: 'Stabilize Component to Clean Code A+',
    description:
      'Full stabilization workflow: analyze, refactor to Uncle Bob A+ standard, track, and document.',
    category: 'components',
    variables: ['COMPONENT'],
    tags: ['stabilization', 'clean-code', 'refactoring', 'production-ready'],
    prompt: `Stabilize {COMPONENT} to Clean Code A+ standard.

READ FIRST:
- \`.claude/clean-code-rules.md\` (grading rubric)
- \`.claude/core-components-stabilization.md\` (tracking)
- \`.claude/color-matrix.json\` (token selection)

## PHASE 1: ANALYZE

1. Read component file
2. Grade current state (A+ to F):
   | Grade | Criteria |
   |-------|----------|
   | A+ | Functions <30 lines, single responsibility, named constants, semantic tokens |
   | A | Functions <40 lines, minor naming issues |
   | B | Functions <60 lines, some magic numbers |
   | C | Functions >60 lines, multiple responsibilities |
   | D/F | God functions, hardcoded values, no structure |

## PHASE 2: REFACTOR (apply in order)

1. **Extract constants** (top of file, SCREAMING_SNAKE)
   \`\`\`tsx
   const ANIMATION_DURATION_MS = 1500
   const BORDER_RADIUS = '12px'
   \`\`\`

2. **Add section headers**
   \`\`\`tsx
   // =============================================================================
   // CONSTANTS | VARIANTS | TYPES | HOOKS | SUB-COMPONENTS | MAIN COMPONENT
   // =============================================================================
   \`\`\`

3. **Extract hooks** (custom logic → \`useXxx\` function)

4. **Extract sub-components** (repeated JSX → named function with props interface)

5. **Semantic tokens** (priority: semantic > contextual > primitive)
   \`\`\`tsx
   // ❌ 'text-white', 'border-[var(--brand-abyss-300)]'
   // ✅ 'text-inverse', 'border-strong'
   \`\`\`

6. **Document primitive exceptions** (if primitives unavoidable, explain WHY)

## PHASE 3: TRACK

Update \`.claude/core-components-stabilization.md\`:
- Change status: \`⬜ TODO\` → \`✅ STABILIZED\`
- Add entry: \`**{COMPONENT}** - ATOM, clean code A+, semantic tokens\`

## PHASE 4: VERIFY

Run: \`npm run typecheck && npm run lint\`

OUTPUT:
- Clean code A+ component
- Updated tracking doc
- Grade improvement summary (e.g., "B → A+")`,
  },

  // =============================================================================
  // TOKENS
  // =============================================================================
  {
    id: 'token-add-color',
    title: 'Add New Color Token',
    description: 'Add a new color token to all three token files with sync.',
    category: 'tokens',
    variables: ['TOKEN_NAME', 'HEX_VALUE'],
    tags: ['tokens', 'colors', 'sync'],
    prompt: `Add a new color token: {TOKEN_NAME} with value {HEX_VALUE}

MUST UPDATE ALL 3 FILES (manual sync required):
1. \`src/constants/designTokens.ts\` - TypeScript source
2. \`src/styles.css\` - @theme block
3. \`tailwind-preset.js\` - for NPM consumers

After changes, run:
- \`npm run validate:tokens\` - verify sync
- \`npm run health\` - full check

Read \`.claude/color-matrix.json\` to verify contrast compliance.`,
  },
  {
    id: 'token-audit',
    title: 'Audit Token Usage',
    description: 'Find and fix hardcoded values that should use tokens.',
    category: 'tokens',
    variables: ['COMPONENT'],
    tags: ['tokens', 'audit', 'compliance'],
    prompt: `Audit {COMPONENT} for token compliance.

Check for:
1. Hardcoded hex colors -> replace with tokens
2. Tailwind standard colors (red-500) -> replace with DDS palette
3. Hardcoded shadows -> use SHADOWS tokens
4. Hardcoded spacing -> use SPACING tokens
5. Hardcoded radius -> use RADIUS tokens

Reference: \`src/constants/designTokens.ts\` for available tokens.
Report findings in table format: Line | Issue | Fix`,
  },

  // =============================================================================
  // DOCUMENTATION
  // =============================================================================
  {
    id: 'docs-mdx-page',
    title: 'Create MDX Documentation Page',
    description: 'Generate an MDX documentation page for Storybook.',
    category: 'documentation',
    variables: ['TOPIC'],
    tags: ['documentation', 'mdx', 'storybook'],
    prompt: `Create MDX documentation for {TOPIC} in \`src/stories/foundation/\`.

REQUIREMENTS:
1. Read \`.claude/storybook-rules.md\` - especially MDX Paragraph Bug
2. Import from infrastructure: \`import { DocSection } from '../_infrastructure'\`
3. Use \`<span>\` inside colored divs (MDX bug workaround)
4. Use Lucide icons, not emojis
5. Live component demos where applicable

Structure:
- Overview section
- Usage examples with code
- Do/Don't examples
- Token reference table`,
  },
  {
    id: 'docs-update-claude',
    title: 'Update CLAUDE.md',
    description: 'Add a new rule or section to CLAUDE.md agent instructions.',
    category: 'documentation',
    variables: ['RULE_DESCRIPTION'],
    tags: ['documentation', 'claude', 'rules'],
    prompt: `Update CLAUDE.md with new rule: {RULE_DESCRIPTION}

REQUIREMENTS:
1. Keep format terse (for agents, not humans)
2. Use table format for lookups
3. Include code examples
4. Add to appropriate section
5. Update lazy load references if new file created

Run \`npm run health\` to verify docs sync.`,
  },

  // =============================================================================
  // REVIEW
  // =============================================================================
  {
    id: 'review-dds-compliance',
    title: 'Code Review for DDS Compliance',
    description: 'Review code against all DDS rules and report violations.',
    category: 'review',
    variables: ['FILE_PATH'],
    tags: ['review', 'compliance', 'quality'],
    prompt: `Review {FILE_PATH} for DDS compliance.

Check against:
1. \`.claude/ux-laws-rules.md\` - UX principles (Fitts, Hick, Miller, etc.)
2. \`.claude/color-matrix.json\` - color combinations
3. \`.claude/contrast-matrix.json\` - WCAG compliance
4. \`.claude/spacing-rules.md\` - spacing hierarchy
5. \`.claude/typography-rules.md\` - font usage (Fixel only)
6. \`.claude/iconography-rules.md\` - no emojis

Report format:
| Line | Issue | Severity | Fix |
|------|-------|----------|-----|

Severity: CRITICAL (blocks), WARNING (should fix), INFO (suggestion)`,
  },
  {
    id: 'review-pre-pr',
    title: 'Pre-PR Checklist',
    description: 'Run full validation before submitting a pull request.',
    category: 'review',
    tags: ['review', 'pr', 'checklist'],
    prompt: `Run pre-PR validation for my changes.

Execute:
1. \`npm run health\` - must pass
2. Check modified files against DDS rules
3. Verify no hardcoded colors/spacing
4. Verify stories use infrastructure
5. Verify exports updated if new components

Report: READY or BLOCKED with specific issues.`,
  },
  {
    id: 'review-find-violations',
    title: 'Find All Token Violations',
    description: 'Search entire codebase for hardcoded values.',
    category: 'review',
    tags: ['audit', 'search', 'violations'],
    prompt: `Find all token violations in src/components.

Search for:
1. Hardcoded hex colors (#[0-9A-Fa-f]{6})
2. Tailwind standard colors (red-500, blue-600, etc.)
3. Hardcoded px values outside tokens
4. font-mono or font-serif (should use Fixel only)

Report:
| File | Line | Violation | Suggested Fix |
|------|------|-----------|---------------|

Group by severity and provide fix commands where possible.`,
  },
  {
    id: 'review-clean-code',
    title: 'Clean Code Review (Uncle Bob A+ Standard)',
    description: 'Review code against Uncle Bob clean code principles for production readiness.',
    category: 'review',
    variables: ['FILE_PATH'],
    tags: ['review', 'clean-code', 'refactoring', 'quality'],
    prompt: `Review {FILE_PATH} against Uncle Bob's clean code principles.

READ FIRST: \`.claude/clean-code-rules.md\`

GRADING RUBRIC:
| Category | Check |
|----------|-------|
| Naming | Names express intent? No abbreviations? |
| Functions | Each function does ONE thing? <30 lines? |
| Comments | JSDoc for public APIs? Design notes for WHY? |
| Structure | Helpers first, then main component? |
| Errors | No silent failures? Users see feedback? |
| Cleanliness | No magic numbers? No dead code? No duplication? |
| SOLID | Single responsibility? Clear abstractions? |

FILE SIZE LIMITS:
| Type | Max Lines | Action |
|------|-----------|--------|
| Component | 300 | Extract sub-components |
| Dialog | 400 | Extract content sections |
| Types | 400 | Move utilities to utils.ts |
| Any file | 500 | GOD FILE - split immediately |

EXTRACT TRIGGERS:
- Function >30 lines → extract helper
- Repeated calculation → memoize
- Same logic 2+ places → extract utility
- Complex conditional → named function

REPORT FORMAT:
| Category | Grade | Issues | Action |
|----------|-------|--------|--------|
| Naming | A-F | List | Fix suggestion |
| Functions | A-F | List | Fix suggestion |
...

FINAL GRADE: A+ to F with summary.
VERDICT: SHIP IT or NEEDS WORK with specific fixes.`,
  },
  {
    id: 'review-refactor-plan',
    title: 'Create Refactoring Plan',
    description: 'Analyze a God File (>500 lines) and create extraction plan.',
    category: 'review',
    variables: ['FILE_PATH'],
    tags: ['refactoring', 'clean-code', 'architecture'],
    prompt: `Create a refactoring plan for {FILE_PATH}.

READ FIRST: \`.claude/clean-code-rules.md\`

ANALYSIS STEPS:
1. Count total lines
2. Identify internal sub-components
3. Find repeated logic
4. Locate helper functions
5. Check for dead code

EXTRACTION CANDIDATES:
| Pattern | Extract To |
|---------|------------|
| Repeated JSX | sub-component same file |
| Reusable form fields | form-components/ folder |
| View-specific display | view-components/ folder |
| Pure utility functions | utils.ts |

OUTPUT FORMAT:
## Current State
- Lines: X
- Internal components: X
- Helper functions: X

## Extraction Plan
1. Create \`component-name/utils.ts\` for: [list functions]
2. Extract \`SubComponentA\` to \`view-components/\`
3. Extract \`SubComponentB\` to \`form-components/\`

## Expected Result
- Main file: ~Y lines (was X)
- New files: Z
- LOC reduction: X%

## Migration Steps
1. Step 1...
2. Step 2...`,
  },

  // =============================================================================
  // STYLING (Applying foundational rules)
  // =============================================================================
  {
    id: 'styling-depth-layering',
    title: 'Apply Depth/Elevation Layering',
    description: 'Apply correct depth layering with elevation, shadows, and backgrounds.',
    category: 'styling',
    variables: ['COMPONENT'],
    tags: ['depth', 'elevation', 'shadows', 'layering'],
    prompt: `Apply depth layering rules to {COMPONENT}.

READ FIRST: \`.claude/depth-layering-rules.md\`

CORE RULE: Closer = Lighter (both themes, no exceptions)

Layer Hierarchy:
| Depth | Layer | Token | Shadow |
|-------|-------|-------|--------|
| 1 | Elevated | \`bg-elevated\` | \`shadow-lg\` |
| 2 | Card | \`bg-elevated\` | \`shadow-md\` |
| 3 | Surface | \`bg-surface\` | \`shadow-sm\` |
| 4 | Page | \`bg-page\` | — |

Decision Table:
| Element | Classes |
|---------|---------|
| Modal/Dropdown | \`bg-elevated shadow-lg\` |
| Card on page | \`bg-elevated shadow-md\` |
| Sidebar/panel | \`bg-surface shadow-sm\` |
| Main background | \`bg-page\` |
| Nested same-shade | Add \`border border-default\` |

FORBIDDEN:
- Elevated without shadow
- Page lighter than card
- Raw colors (\`bg-white\`, \`bg-gray-*\`)
- Skip >2 shade steps

OUTPUT: Updated component with correct depth tokens.`,
  },
  {
    id: 'styling-spacing',
    title: 'Apply Spacing Tokens',
    description: 'Apply correct spacing using DDS spacing tokens.',
    category: 'styling',
    variables: ['COMPONENT'],
    tags: ['spacing', 'layout', 'tokens'],
    prompt: `Apply spacing rules to {COMPONENT}.

READ FIRST: \`.claude/spacing-rules.md\`

CORE RULE: Base 4px. NEVER arbitrary values. ALWAYS tokens.

Quick Reference:
| Relationship | px | Tailwind |
|--------------|-----|----------|
| Icon↔Text | 8 | \`gap-2\` |
| Label↔Input | 8 | \`mb-2\` |
| Input↔Input | 16 | \`space-y-4\` |
| Card↔Card | 16-24 | \`gap-4\`/\`gap-6\` |
| Section↔Section | 48-64 | \`py-12\`/\`py-16\` |

Decision:
| Relationship | Token |
|--------------|-------|
| Directly related | tight (8px) |
| Same group | base (16px) |
| Separate components | comfortable (24px) |
| Different sections | spacious (32-48px) |

FORBIDDEN:
- Arbitrary values: \`gap-[18px]\`, \`p-[23px]\`
- Inline styles: \`style={{ marginTop: '32px' }}\`

OUTPUT: Updated component with DDS spacing tokens.`,
  },
  {
    id: 'styling-typography',
    title: 'Apply Typography Rules',
    description: 'Apply correct typography using DDS font scale and weights.',
    category: 'styling',
    variables: ['COMPONENT'],
    tags: ['typography', 'fonts', 'text'],
    prompt: `Apply typography rules to {COMPONENT}.

READ FIRST: \`.claude/typography-rules.md\`

FONTS: Fixel (UI) + JetBrains Mono (code only)

Scale:
| Role | Tailwind |
|------|----------|
| Page Title | \`text-2xl font-semibold\` |
| Section Title | \`text-lg font-semibold\` |
| Card Title | \`text-base font-semibold\` |
| Body | \`text-sm\` |
| Label | \`text-sm font-medium\` |
| Caption | \`text-xs text-muted\` |
| Code | \`font-mono text-sm\` |

Colors:
| Element | Token |
|---------|-------|
| Primary | \`text-primary\` |
| Secondary | \`text-secondary\` |
| Muted | \`text-muted\` |
| Error | \`text-error\` |
| Link | \`text-link\` |

FORBIDDEN:
- \`font-serif\`, \`font-display\`
- Non-Fixel UI text
- \`font-mono\` for non-code text
- Font sizes below 12px

OUTPUT: Updated component with DDS typography.`,
  },
  {
    id: 'styling-colors-semantic',
    title: 'Apply Semantic Color Tokens',
    description: 'Apply correct color token priority: semantic > contextual > primitive.',
    category: 'styling',
    variables: ['COMPONENT'],
    tags: ['colors', 'tokens', 'semantic'],
    prompt: `Apply semantic color rules to {COMPONENT}.

READ FIRST: \`.claude/css-styling-rules.md\` and \`.claude/color-matrix.json\`

TOKEN PRIORITY (ALWAYS follow this order):
| Priority | Type | Example | When |
|----------|------|---------|------|
| 1st | Semantic | \`text-warning\`, \`bg-error\` | Color conveys meaning |
| 2nd | Contextual | \`text-primary\`, \`bg-surface\` | UI structure |
| 3rd | Primitive | \`text-abyss-500\` | ONLY when neither fits |

Examples:
\`\`\`tsx
// ✅ Semantic - self-documenting
<Badge className="border-warning text-warning">Investigation</Badge>

// ❌ Primitive - meaning unclear
<Badge className="border-amber-500 text-amber-600">Investigation</Badge>
\`\`\`

FORBIDDEN:
- Standard Tailwind colors (\`red-500\`, \`blue-600\`)
- Hardcoded hex values
- Same color family on itself (invisible: \`bg-abyss-500 text-abyss-400\`)

OUTPUT: Updated component with semantic-first color tokens.`,
  },

  // =============================================================================
  // UX & ACCESSIBILITY
  // =============================================================================
  {
    id: 'ux-apply-laws',
    title: 'Apply UX Laws to Component',
    description: 'Apply Fitts, Hick, Miller, and Gestalt principles to UI.',
    category: 'ux',
    variables: ['COMPONENT'],
    tags: ['ux', 'usability', 'laws'],
    prompt: `Apply UX laws to {COMPONENT}.

READ FIRST: \`.claude/ux-laws-rules.md\`

Core Laws:
| Law | Rule | Value |
|-----|------|-------|
| Fitts | Target size | \`min-h-11\` (44px mobile) |
| Hick | Options limit | 5-7 max choices |
| Miller | Memory limit | 7±2 items |
| Doherty | Response time | <400ms or spinner |

Action Overflow Rule (CRITICAL):
- ≤3 actions = Visible buttons
- ≥4 actions = Overflow menu (ActionSheet/Dropdown)

By Component:
| Type | Requirements |
|------|--------------|
| Button | 44px touch, primary distinct |
| Form | 5-7 fields max, grouped sections |
| Nav | ≤7 items, key at start/end |
| Modal | Reachable close, single purpose |
| List | 7 visible, grouped items |

OUTPUT: Updated component following UX laws.`,
  },
  {
    id: 'a11y-semantic-html',
    title: 'Fix Accessibility Issues',
    description: 'Replace inaccessible patterns with semantic HTML and Radix.',
    category: 'ux',
    variables: ['COMPONENT'],
    tags: ['accessibility', 'a11y', 'semantic'],
    prompt: `Fix accessibility in {COMPONENT}.

READ FIRST: \`.claude/hookify.accessibility-enforcement.md\`

Replace These Patterns:
| Bad | Fix |
|-----|-----|
| \`<div onClick>\` | \`<button>\` |
| \`<span onClick>\` | \`<button>\` |
| \`role="button"\` | \`<button>\` |
| \`tabIndex={0}\` workaround | Semantic element |

For Complex Interactions → Use Radix:
\`\`\`tsx
// ✅ Radix handles a11y
<Dialog.Trigger asChild><Button>Open</Button></Dialog.Trigger>
\`\`\`

Requirements:
- Focus visible: \`focus:ring-2 focus:ring-accent\`
- Contrast: Check \`.claude/contrast-matrix.json\`
- Touch targets: min 44px (\`min-h-11\`)
- Labels: All inputs need labels

OUTPUT: Accessible component with semantic HTML.`,
  },

  // =============================================================================
  // RESPONSIVE & MOBILE
  // =============================================================================
  {
    id: 'responsive-mobile-first',
    title: 'Apply Mobile-First Responsive',
    description: 'Convert to mobile-first responsive patterns.',
    category: 'responsive',
    variables: ['COMPONENT'],
    tags: ['responsive', 'mobile', 'breakpoints'],
    prompt: `Apply mobile-first responsive patterns to {COMPONENT}.

READ FIRST: \`.claude/hookify.responsive-patterns.md\`

Breakpoints:
| Prefix | Width | Usage |
|--------|-------|-------|
| (none) | 0+ | Mobile base |
| \`sm:\` | 640px | Large phones |
| \`md:\` | 768px | Tablets |
| \`lg:\` | 1024px | Laptops |
| \`xl:\` | 1280px | Desktops |

Pattern:
\`\`\`tsx
// ❌ Desktop-first
<div className="px-8 max-sm:px-4">

// ✅ Mobile-first
<div className="px-4 sm:px-6 lg:px-8">

// ✅ Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
\`\`\`

Mobile Requirements:
- Touch targets ≥44px
- Text ≥16px (no zoom)
- No horizontal scroll

OUTPUT: Mobile-first responsive component.`,
  },

  // =============================================================================
  // ICONS
  // =============================================================================
  {
    id: 'icons-replace-emoji',
    title: 'Replace Emojis with Lucide Icons',
    description: 'Convert emoji usage to Lucide React icons.',
    category: 'icons',
    variables: ['COMPONENT'],
    tags: ['icons', 'lucide', 'emoji'],
    prompt: `Replace emojis with Lucide icons in {COMPONENT}.

READ FIRST: \`.claude/iconography-rules.md\`

RULE: NEVER emojis. ALWAYS Lucide React.

Common Replacements:
| Emoji | Lucide |
|-------|--------|
| 🎨 | \`Palette\` |
| 📱 | \`Smartphone\` |
| 💡 | \`Lightbulb\` |
| ⚠️ | \`AlertTriangle\` |
| ✨ | \`Sparkles\` |
| ⚡ | \`Zap\` |
| 🌙 | \`Moon\` |
| ☀️ | \`Sun\` |

Sizes:
| Size | px | Use |
|------|-----|-----|
| XS | 16 | Inline, badges |
| SM | 20 | Buttons, inputs |
| MD | 24 | Navigation (default) |
| LG | 32 | Feature highlights |
| XL | 48 | Empty states, heroes |

Browse: https://lucide.dev

OUTPUT: Component with Lucide icons, zero emojis.`,
  },

  // =============================================================================
  // DELIVERY
  // =============================================================================
  {
    id: 'delivery-package',
    title: 'Create Delivery Package',
    description: 'Create a standalone delivery package for a component.',
    category: 'delivery',
    variables: ['COMPONENT'],
    tags: ['delivery', 'package', 'standalone'],
    prompt: `Create delivery package for {COMPONENT}.

READ FIRST: \`.claude/delivery-package-guide.md\`

Package Structure:
\`\`\`
[package-name]/
├── setup.sh
├── [Component].tsx
├── tokens.css          # WITH @theme block
├── README.md
├── example-usage.tsx
├── lib/utils.ts        # cn()
└── ui/*.tsx            # dependencies
\`\`\`

Steps:
1. Find deps: \`grep "from './ui" src/components/{COMPONENT}.tsx\`
2. Copy component + ui deps + lib/utils.ts
3. Fix import paths: \`@/components/ui/x\` → \`./ui/x\`
4. Create tokens.css with @theme block (CRITICAL)
5. Create setup.sh supporting npm/yarn/pnpm
6. Test all package managers

CRITICAL - tokens.css:
\`\`\`css
// ❌ BROKEN - no utilities generated
:root { --color-primary: #2D3142; }

// ✅ CORRECT - generates bg-primary, text-primary
@theme { --color-primary: #2D3142; }
\`\`\`

Validation:
- Colors render
- Hover states work
- All package managers work
- No missing imports

OUTPUT: Complete delivery package ready to zip.`,
  },

  // =============================================================================
  // DARK MODE
  // =============================================================================
  {
    id: 'dark-mode-check',
    title: 'Verify Dark Mode Compatibility',
    description: 'Ensure component works correctly in dark mode.',
    category: 'styling',
    variables: ['COMPONENT'],
    tags: ['dark-mode', 'themes', 'colors'],
    prompt: `Verify dark mode compatibility for {COMPONENT}.

READ FIRST: \`.claude/dark-mode-mapping-rules.md\`

Formula: Dark = 950 - Light
| Light | Dark |
|-------|------|
| 50 | 900 |
| 100 | 800 |
| 500 | 400 |

Semantic Tokens (auto-switch):
| Token | Light | Dark |
|-------|-------|------|
| \`bg-page\` | cream | ABYSS[900] |
| \`bg-surface\` | white | ABYSS[800] |
| \`text-primary\` | ABYSS[500] | SLATE[100] |
| \`border-default\` | SLATE[300] | SLATE[600] |

Status Colors (shift 1 step lighter in dark):
| Token | Light | Dark |
|-------|-------|------|
| \`error\` | CORAL[500] | CORAL[400] |
| \`success\` | HARBOR[500] | HARBOR[400] |

FORBIDDEN:
- Hardcoded: \`isDark ? '#0C0D12' : '#FBFBF3'\`
- Raw hex in dark mode logic

Use semantic tokens - they auto-switch themes.

OUTPUT: Dark mode compatible component (test in Storybook).`,
  },
]
