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

BEFORE WRITING:
1. Read \`.claude/component-dev-rules.md\`
2. Read \`.claude/color-matrix.json\` for allowed colors
3. Check existing similar components in \`src/components/ui/\`

REQUIREMENTS:
- Use DDS tokens only (PRIMITIVES, ALIAS, SHADOWS, RADIUS)
- CVA for variants: \`class-variance-authority\`
- Forward ref pattern
- data-slot attributes for compound components
- TypeScript strict

FORBIDDEN:
- Hardcoded hex colors
- Tailwind standard colors (red-500, blue-600)
- Custom CSS outside tokens

OUTPUT: Component file + story file + update to index.ts exports.`,
  },
  {
    id: 'component-stabilize',
    title: 'Stabilize Existing Component',
    description:
      'Audit and update a component to meet DDS stabilization standards.',
    category: 'components',
    variables: ['COMPONENT'],
    tags: ['stabilization', 'audit', 'quality'],
    prompt: `Stabilize {COMPONENT} per DDS standards.

CHECKLIST:
1. Read \`.claude/core-components-stabilization.md\`
2. Verify all colors use DDS tokens
3. Add AllStates story if missing
4. Add data-testid or data-slot attributes
5. Update \`.claude/agent-context.json\` registry

Run \`npm run health\` after changes.`,
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
1. \`.claude/color-matrix.json\` - color combinations
2. \`.claude/contrast-matrix.json\` - WCAG compliance
3. \`.claude/spacing-rules.md\` - spacing hierarchy
4. \`.claude/typography-rules.md\` - font usage (Fixel only)
5. \`.claude/iconography-rules.md\` - no emojis

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
]
