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
    tags: ['component', 'ui', 'cva', 'mcp'],
    prompt: `Create a new UI component: {COMPONENT}

BEFORE WRITING (MANDATORY - DO NOT SKIP):

## Step 1: MCP Duplicate Detection (REQUIRED)
\`\`\`
mcp__dds__search_components({ query: "{COMPONENT}" })
mcp__dds__search_components({ type: "ATOM" })  // or MOLECULE based on complexity
\`\`\`

## Step 2: If similar found, get details
\`\`\`
mcp__dds__get_component({ name: "SimilarComponent" })
\`\`\`

## Step 3: Read rules
- \`.claude/component-dev-rules.md\` (especially "Duplicate Detection" section)
- \`.claude/ux-laws-rules.md\` for UX principles

## Step 4: For any dark backgrounds, verify contrast
\`\`\`
mcp__dds__check_contrast({ background: "ABYSS[900]", foreground: "white" })
mcp__dds__get_accessible_colors({ background: "ABYSS[900]", minLevel: "AA" })
\`\`\`

DUPLICATE CHECK OUTPUT (required before proceeding):
\`\`\`
MCP search results: [list or "none"]
Decision: [USE_EXISTING | EXTEND_EXISTING | NEW_COMPONENT]
Reason: [brief justification]
\`\`\`

REQUIREMENTS:
- Use DDS tokens only (PRIMITIVES, ALIAS, SHADOWS, RADIUS)
- CVA for variants: \`class-variance-authority\`
- Forward ref pattern
- data-slot attributes for compound components
- TypeScript strict
- Verify contrast with MCP before using dark backgrounds

FORBIDDEN:
- Creating component without MCP duplicate search
- Hardcoded hex colors
- Tailwind standard colors (red-500, blue-600)
- Dark backgrounds without contrast verification

OUTPUT: Component file + story file + update to index.ts exports.`,
  },
  {
    id: 'component-stabilize',
    title: 'Stabilize Component to Clean Code A+',
    description:
      'Full stabilization workflow: analyze, refactor to Uncle Bob A+ standard, track, and document.',
    category: 'components',
    variables: ['COMPONENT'],
    tags: ['stabilization', 'clean-code', 'refactoring', 'production-ready', 'mcp'],
    prompt: `Stabilize {COMPONENT} to Clean Code A+ standard.

## PRE-FLIGHT: MCP Checks
\`\`\`
mcp__dds__get_component({ name: "{COMPONENT}" })  // Get current status/variants
mcp__dds__get_design_tokens({ category: "colors" })  // Reference for token fixes
\`\`\`

READ RULES:
- \`.claude/clean-code-rules.md\` (grading rubric)
- \`.claude/core-components-stabilization.md\` (tracking)

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

5. **Semantic tokens** - validate with MCP:
   \`\`\`
   mcp__dds__check_token_usage({ token: "bg-white" })  // Should suggest bg-surface
   mcp__dds__check_token_usage({ token: "text-gray-500" })  // Should suggest text-muted
   \`\`\`
   \`\`\`tsx
   // ❌ 'text-white', 'border-[var(--brand-abyss-300)]'
   // ✅ 'text-inverse', 'border-strong'
   \`\`\`

6. **Contrast verification** (for any dark backgrounds):
   \`\`\`
   mcp__dds__check_contrast({ background: "ABYSS[800]", foreground: "SLATE[200]" })
   \`\`\`

7. **Document primitive exceptions** (if primitives unavoidable, explain WHY)

## PHASE 3: TRACK

Update \`.claude/core-components-stabilization.md\`:
- Change status: \`⬜ TODO\` → \`✅ STABILIZED\`
- Add entry: \`**{COMPONENT}** - ATOM, clean code A+, semantic tokens\`

## PHASE 4: VERIFY

Run: \`npm run typecheck && npm run lint\`

OUTPUT:
- Clean code A+ component
- Updated tracking doc
- Grade improvement summary (e.g., "B → A+")
- MCP validation results`,
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
    tags: ['tokens', 'colors', 'sync', 'mcp'],
    prompt: `Add a new color token: {TOKEN_NAME} with value {HEX_VALUE}

## PRE-FLIGHT: MCP Contrast Verification (REQUIRED)
\`\`\`
// Check new color works on common backgrounds
mcp__dds__check_contrast({ background: "white", foreground: "{HEX_VALUE}" })
mcp__dds__check_contrast({ background: "ABYSS[900]", foreground: "{HEX_VALUE}" })
mcp__dds__check_contrast({ background: "{HEX_VALUE}", foreground: "white" })

// List existing tokens to avoid duplicates
mcp__dds__list_color_tokens({ category: "all" })
\`\`\`

MUST UPDATE ALL 3 FILES (manual sync required):
1. \`src/constants/designTokens.ts\` - TypeScript source
2. \`src/styles.css\` - @theme block
3. \`tailwind-preset.js\` - for NPM consumers

After changes, run:
- \`npm run validate:tokens\` - verify sync
- \`npm run health\` - full check

OUTPUT: Include MCP contrast results in commit message.`,
  },
  {
    id: 'token-audit',
    title: 'Audit Token Usage',
    description: 'Find and fix hardcoded values that should use tokens.',
    category: 'tokens',
    variables: ['COMPONENT'],
    tags: ['tokens', 'audit', 'compliance', 'mcp'],
    prompt: `Audit {COMPONENT} for token compliance.

## MCP-First Validation
For each suspected violation, run:
\`\`\`
mcp__dds__check_token_usage({ token: "bg-white" })
mcp__dds__check_token_usage({ token: "#FF5733" })
mcp__dds__check_token_usage({ token: "text-red-500" })
\`\`\`

## Check for:
1. Hardcoded hex colors -> MCP will suggest semantic token
2. Tailwind standard colors (red-500) -> MCP will suggest DDS equivalent
3. Hardcoded shadows -> use SHADOWS tokens
4. Hardcoded spacing -> use SPACING tokens
5. Hardcoded radius -> use RADIUS tokens

## Get Valid Tokens
\`\`\`
mcp__dds__get_design_tokens({ category: "colors" })
mcp__dds__get_design_tokens({ category: "shadows" })
mcp__dds__get_design_tokens({ category: "spacing" })
\`\`\`

Report findings in table format:
| Line | Violation | MCP Suggestion | Fix |
|------|-----------|----------------|-----|`,
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
  // PLANNING
  // =============================================================================
  {
    id: 'plan-bulletproof',
    title: 'Bulletproof Planning Protocol',
    description:
      'Multi-round self-review planning process that continues until plan has zero critical issues.',
    category: 'planning',
    variables: ['FEATURE_OR_TASK'],
    tags: ['planning', 'architecture', 'review', 'bulletproof'],
    prompt: `Create a bulletproof plan for: {FEATURE_OR_TASK}

## PROCESS (MANDATORY - DO NOT SHORTCUT)

### Round 1: Initial Draft
Create comprehensive plan covering:
- Requirements and acceptance criteria
- Technical approach
- Files to create/modify
- Dependencies and integration points
- Risk areas

### Round 2: Self-Review - Gaps & Assumptions
Ask yourself:
- What assumptions am I making?
- What information is missing?
- Are there unstated requirements?
- What dependencies haven't I identified?

### Round 3: Self-Review - Edge Cases & Failures
Ask yourself:
- What could go wrong?
- What edge cases exist?
- What's the failure mode?
- How do we handle errors?

### Round 4: Self-Review - Consistency
Ask yourself:
- Does this match existing patterns in the codebase?
- Am I reinventing something that exists?
- Does this integrate cleanly with current architecture?
- Will this cause breaking changes?

### Continue rounds until ALL conditions are met:
1. Zero critical blockers or risks
2. All dependencies identified
3. All integration points specified
4. Clear success criteria defined
5. YOU have zero open questions about requirements

## OUTPUT FORMAT

\`\`\`
## Plan: {FEATURE_OR_TASK}

### Status: [DRAFT | NEEDS_REVIEW | APPROVED]
### Confidence: [LOW | MEDIUM | HIGH]
### Review Rounds Completed: [N]

### Critical Requirements (Must Have)
- [ ] Requirement 1
- [ ] Requirement 2

### Technical Approach
[Detailed approach]

### Files to Modify
| File | Action | Description |
|------|--------|-------------|
| path/to/file.tsx | CREATE/MODIFY | What changes |

### Dependencies
- Dependency 1
- Dependency 2

### Risk Areas
| Risk | Mitigation |
|------|------------|
| Risk 1 | How to handle |

### Nice-to-Haves (User decides)
- [ ] Optional enhancement 1 (cost: low/medium/high)
- [ ] Optional enhancement 2 (cost: low/medium/high)

### Out of Scope (Future Roadmap)
- Item 1
- Item 2

### Open Questions (if any)
[If this section is not empty, plan is NOT APPROVED]
\`\`\`

## FORBIDDEN
- Saying "looks good" or "production ready" without completing all review rounds
- Skipping self-review rounds
- Proceeding with open questions
- Assuming requirements without clarification

## STOP CRITERIA
The plan is APPROVED only when:
1. All review rounds complete
2. Open Questions section is EMPTY
3. You can confidently say "I have no concerns about this plan"`,
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
    tags: ['review', 'compliance', 'quality', 'mcp'],
    prompt: `Review {FILE_PATH} for DDS compliance.

## MCP-First Validation (run for each color found)
\`\`\`
// Validate token usage
mcp__dds__check_token_usage({ token: "found-token-or-color" })

// Check contrast for any dark backgrounds
mcp__dds__check_contrast({ background: "bg-color", foreground: "text-color" })

// Get color guidance for context
mcp__dds__get_color_guidance({ category: "dark_backgrounds" })
\`\`\`

## Check Against Rules:
1. \`.claude/ux-laws-rules.md\` - UX principles (Fitts, Hick, Miller, etc.)
2. \`.claude/spacing-rules.md\` - spacing hierarchy
3. \`.claude/typography-rules.md\` - font usage (Fixel only)
4. \`.claude/iconography-rules.md\` - no emojis

Report format:
| Line | Issue | MCP Result | Severity | Fix |
|------|-------|------------|----------|-----|

Severity: CRITICAL (blocks), WARNING (should fix), INFO (suggestion)`,
  },
  {
    id: 'review-pre-pr',
    title: 'Pre-PR Checklist',
    description: 'Run full validation before submitting a pull request.',
    category: 'review',
    tags: ['review', 'pr', 'checklist', 'mcp'],
    prompt: `Run pre-PR validation for my changes.

## MCP Pre-Flight Checks
\`\`\`
// For any new/modified components
mcp__dds__get_component({ name: "ModifiedComponent" })

// Validate any color changes
mcp__dds__check_token_usage({ token: "new-color-class" })

// Check dark background contrast
mcp__dds__check_contrast({ background: "dark-bg", foreground: "text-color" })
\`\`\`

## Execute:
1. \`npm run health\` - must pass
2. MCP validate all color tokens in changed files
3. MCP verify contrast for dark backgrounds
4. Verify stories use infrastructure
5. Verify exports updated if new components

Report: READY or BLOCKED with specific issues + MCP validation results.`,
  },
  {
    id: 'review-find-violations',
    title: 'Find All Token Violations',
    description: 'Search entire codebase for hardcoded values.',
    category: 'review',
    tags: ['audit', 'search', 'violations', 'mcp'],
    prompt: `Find all token violations in src/components.

## MCP Validation Workflow
For each violation found, validate with:
\`\`\`
mcp__dds__check_token_usage({ token: "violation" })
\`\`\`

## Search for:
1. Hardcoded hex colors (#[0-9A-Fa-f]{6})
2. Tailwind standard colors (red-500, blue-600, etc.)
3. Hardcoded px values outside tokens
4. font-mono or font-serif (should use Fixel only)

## Get Replacement Suggestions
\`\`\`
mcp__dds__get_design_tokens({ category: "colors" })
mcp__dds__list_color_tokens({ category: "semantic" })
\`\`\`

Report:
| File | Line | Violation | MCP Suggestion | Fix |
|------|------|-----------|----------------|-----|

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
    tags: ['colors', 'tokens', 'semantic', 'mcp'],
    prompt: `Apply semantic color rules to {COMPONENT}.

## MCP-First Color Workflow (REQUIRED)
\`\`\`
// Step 1: Check if current token is valid
mcp__dds__check_token_usage({ token: "current-color-class" })

// Step 2: Get semantic alternatives
mcp__dds__list_color_tokens({ category: "semantic" })

// Step 3: Get color guidance for context
mcp__dds__get_color_guidance({ category: "light_backgrounds" })
mcp__dds__get_color_guidance({ category: "dark_backgrounds" })

// Step 4: Verify contrast for dark backgrounds
mcp__dds__check_contrast({ background: "ABYSS[900]", foreground: "text-color" })
mcp__dds__get_accessible_colors({ background: "ABYSS[900]", minLevel: "AA" })
\`\`\`

READ: \`.claude/css-styling-rules.md\`

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
- Dark backgrounds without MCP contrast verification

OUTPUT: Updated component with semantic-first color tokens + MCP validation results.`,
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
    tags: ['accessibility', 'a11y', 'semantic', 'mcp'],
    prompt: `Fix accessibility in {COMPONENT}.

## MCP Contrast Verification (REQUIRED for WCAG)
\`\`\`
// Check text contrast on backgrounds
mcp__dds__check_contrast({ background: "bg-surface", foreground: "text-primary" })
mcp__dds__check_contrast({ background: "ABYSS[900]", foreground: "SLATE[200]" })

// Find accessible color combinations
mcp__dds__get_accessible_colors({ background: "ABYSS[900]", minLevel: "AA" })
mcp__dds__get_accessible_colors({ background: "white", minLevel: "AAA" })

// Get guidance for specific contexts
mcp__dds__get_color_guidance({ category: "dark_backgrounds" })
\`\`\`

READ: \`.claude/hookify.accessibility-enforcement.md\`

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
- Contrast: Verify with MCP (4.5:1 AA, 7:1 AAA)
- Touch targets: min 44px (\`min-h-11\`)
- Labels: All inputs need labels

OUTPUT: Accessible component with semantic HTML + MCP contrast verification results.`,
  },

  // =============================================================================
  // RESPONSIVE & MOBILE
  // =============================================================================
  {
    id: 'responsive-mobile-first',
    title: 'Apply Responsive Patterns',
    description: 'Apply appropriate responsive strategy based on UI complexity.',
    category: 'responsive',
    variables: ['COMPONENT'],
    tags: ['responsive', 'mobile', 'tablet', 'breakpoints'],
    prompt: `Apply responsive patterns to {COMPONENT}.

## CRITICAL: First Determine the Right Strategy

**NOT everything should be mobile-first.** Complex configuration UIs should stay desktop-first.

### Decision Matrix (MANDATORY)

| UI Type | Strategy | Base Breakpoint | Mobile Behavior |
|---------|----------|-----------------|-----------------|
| Simple lists, cards, content | Mobile-first | (none) 0+ | Full functionality |
| Dashboards, data tables | Tablet-first | \`md:\` 768px | Simplified view or redirect |
| Form builders, entity templates | Desktop-only | \`lg:\` 1024px | Read-only preview or "Use desktop" message |
| Complex configuration UIs | Desktop-only | \`lg:\` 1024px | Hide or disable editing |
| Drag-and-drop interfaces | Desktop-only | \`lg:\` 1024px | Not supported on mobile |

### Strategy Decision Flow
\`\`\`
1. Is this a CRUD list/detail view? → Mobile-first
2. Is this a dashboard with charts/tables? → Tablet-first
3. Does it require drag-and-drop? → Desktop-only
4. Does it have complex nested forms? → Desktop-only
5. Is it a configuration/builder tool? → Desktop-only
\`\`\`

### Mobile Fallback Options (for desktop-only UIs)
\`\`\`tsx
// Option 1: Show simplified read-only version
<div className="lg:hidden">
  <ReadOnlyPreview data={data} />
  <p className="text-muted text-sm">Edit on desktop for full functionality</p>
</div>
<div className="hidden lg:block">
  <FullEditor data={data} />
</div>

// Option 2: Show "desktop required" message
<div className="lg:hidden flex flex-col items-center justify-center p-8 text-center">
  <Monitor className="w-12 h-12 text-muted mb-4" />
  <p className="text-primary font-medium">Desktop Required</p>
  <p className="text-muted text-sm">This feature requires a larger screen</p>
</div>
\`\`\`

## Breakpoints Reference
| Prefix | Width | Device |
|--------|-------|--------|
| (none) | 0+ | Mobile phones |
| \`sm:\` | 640px | Large phones |
| \`md:\` | 768px | Tablets (portrait) |
| \`lg:\` | 1024px | Tablets (landscape) / Laptops |
| \`xl:\` | 1280px | Desktops |

## Pattern Examples by Strategy

### Mobile-First (simple content)
\`\`\`tsx
<div className="px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
\`\`\`

### Tablet-First (dashboards)
\`\`\`tsx
<div className="hidden md:block">  {/* Hide on mobile */}
  <DataTable />
</div>
<div className="md:hidden">  {/* Mobile alternative */}
  <CardList />
</div>
\`\`\`

### Desktop-Only (complex config)
\`\`\`tsx
<div className="hidden lg:block">
  <FormBuilder />
</div>
<div className="lg:hidden">
  <DesktopRequiredMessage />
</div>
\`\`\`

## Universal Requirements
- Touch targets ≥44px on all devices
- Text ≥16px (prevents zoom on iOS)
- No horizontal scroll

OUTPUT:
1. Strategy decision with justification
2. Responsive component with appropriate fallbacks`,
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
:root { --color-primary: oklch(0.26 0.028 265); }

// ✅ CORRECT - generates bg-primary, text-primary
@theme { --color-primary: oklch(0.26 0.028 265); }
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
    tags: ['dark-mode', 'themes', 'colors', 'mcp'],
    prompt: `Verify dark mode compatibility for {COMPONENT}.

## MCP Dark Mode Contrast Checks (REQUIRED)
\`\`\`
// Verify text on dark backgrounds
mcp__dds__check_contrast({ background: "ABYSS[900]", foreground: "SLATE[100]" })
mcp__dds__check_contrast({ background: "ABYSS[800]", foreground: "SLATE[200]" })

// Find accessible colors for dark mode
mcp__dds__get_accessible_colors({ background: "ABYSS[900]", minLevel: "AA" })

// Get dark background guidance
mcp__dds__get_color_guidance({ category: "dark_backgrounds" })
\`\`\`

READ: \`.claude/dark-mode-mapping-rules.md\`

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
- Hardcoded: \`isDark ? 'abyss[950]' : 'cream'\`
- Raw hex in dark mode logic
- Dark backgrounds without MCP contrast verification

Use semantic tokens - they auto-switch themes.

OUTPUT: Dark mode compatible component + MCP contrast verification results.`,
  },

  // =============================================================================
  // MCP-FIRST TOOLS (NEW)
  // =============================================================================
  {
    id: 'mcp-contrast-check',
    title: 'Check Color Contrast (WCAG)',
    description: 'Verify color combinations meet WCAG accessibility standards using MCP.',
    category: 'mcp',
    variables: ['BACKGROUND', 'FOREGROUND'],
    tags: ['mcp', 'contrast', 'wcag', 'accessibility'],
    prompt: `Check WCAG contrast for {BACKGROUND} background with {FOREGROUND} text.

## MCP Contrast Verification
\`\`\`
// Primary check
mcp__dds__check_contrast({ background: "{BACKGROUND}", foreground: "{FOREGROUND}" })

// Find all accessible alternatives
mcp__dds__get_accessible_colors({ background: "{BACKGROUND}", minLevel: "AA" })
mcp__dds__get_accessible_colors({ background: "{BACKGROUND}", minLevel: "AAA" })
\`\`\`

## WCAG Requirements
| Level | Ratio | Use Case |
|-------|-------|----------|
| AA | 4.5:1 | Normal text (minimum) |
| AA Large | 3:1 | 18px+ or 14px bold |
| AAA | 7:1 | Enhanced accessibility |

## Common Dark Background Safe Colors
| Background | Safe Text |
|------------|-----------|
| ABYSS[900] | white, SLATE[100-200], CREAM |
| ABYSS[800] | white, SLATE[100-300] |
| DEEP_CURRENT[800] | white, DEEP_CURRENT[50-200] |

## If Contrast Fails
1. Use lighter text shade (e.g., SLATE[300] → SLATE[200])
2. Use white for maximum contrast
3. Consider different background

OUTPUT: MCP contrast result + recommendation.`,
  },
  {
    id: 'mcp-component-lookup',
    title: 'Lookup Component Metadata',
    description: 'Query component variants, status, and props using MCP.',
    category: 'mcp',
    variables: ['COMPONENT'],
    tags: ['mcp', 'component', 'metadata', 'lookup'],
    prompt: `Lookup metadata for {COMPONENT}.

## MCP Queries
\`\`\`
// Get full component details
mcp__dds__get_component({ name: "{COMPONENT}" })

// Search for related components
mcp__dds__search_components({ query: "{COMPONENT}" })

// Find by type
mcp__dds__search_components({ type: "ATOM" })
mcp__dds__search_components({ type: "MOLECULE" })
\`\`\`

## Information Retrieved
- **Status**: STABILIZED, TODO, FROZEN, DEPRECATED
- **Type**: ATOM, MOLECULE, ORGANISM, PAGE
- **Variants**: Available variant options
- **Props**: Component props and types
- **Usage**: Import path and example

## When to Use
| Scenario | MCP Tool |
|----------|----------|
| Check if component exists | \`search_components\` |
| Get variant options | \`get_component\` |
| Find similar components | \`search_components\` with query |
| Verify component status | \`get_component\` |

OUTPUT: Component metadata from MCP.`,
  },
  {
    id: 'mcp-color-recommendation',
    title: 'Get Color Recommendations',
    description: 'Get allowed colors for specific contexts using MCP.',
    category: 'mcp',
    variables: ['CONTEXT'],
    tags: ['mcp', 'colors', 'guidance', 'tokens'],
    prompt: `Get color recommendations for {CONTEXT}.

## MCP Color Queries
\`\`\`
// Get guidance for context
mcp__dds__get_color_guidance({ category: "{CONTEXT}" })

// List available tokens
mcp__dds__list_color_tokens({ category: "semantic" })
mcp__dds__list_color_tokens({ category: "contextual" })
mcp__dds__list_color_tokens({ category: "primitive" })

// Get all design tokens
mcp__dds__get_design_tokens({ category: "colors" })
\`\`\`

## Available Contexts
| Context | Use For |
|---------|---------|
| \`dark_backgrounds\` | Text/icons on ABYSS[700-900] |
| \`light_backgrounds\` | Text/icons on white/cream |
| \`accent_backgrounds\` | Text on colored backgrounds |
| \`semantic_error\` | Error states |
| \`semantic_success\` | Success states |
| \`semantic_warning\` | Warning states |

## Token Priority
1. **Semantic** (text-error, bg-warning) - conveys meaning
2. **Contextual** (text-primary, bg-surface) - UI structure
3. **Primitive** (text-abyss-500) - only when neither fits

OUTPUT: MCP color recommendations for context.`,
  },
  {
    id: 'mcp-token-validate',
    title: 'Validate Token Usage',
    description: 'Check if a token or color value is allowed in DDS.',
    category: 'mcp',
    variables: ['TOKEN'],
    tags: ['mcp', 'tokens', 'validation', 'compliance'],
    prompt: `Validate token usage: {TOKEN}

## MCP Validation
\`\`\`
// Check if token is valid
mcp__dds__check_token_usage({ token: "{TOKEN}" })

// If invalid, get alternatives
mcp__dds__list_color_tokens({ category: "semantic" })
mcp__dds__get_design_tokens({ category: "colors" })
\`\`\`

## Common Violations & Fixes
| Violation | MCP Suggestion |
|-----------|----------------|
| \`bg-white\` | \`bg-surface\` |
| \`text-gray-500\` | \`text-muted\` |
| \`#FF0000\` | \`text-error\` |
| \`bg-blue-500\` | \`bg-accent-strong\` |
| \`border-gray-300\` | \`border-default\` |

## Validation Workflow
1. Run \`check_token_usage\` for each suspect token
2. MCP returns: VALID, INVALID, or SUGGESTION
3. If invalid, use suggested semantic alternative
4. For contrast concerns, also run \`check_contrast\`

OUTPUT: MCP validation result + recommended replacement.`,
  },
  {
    id: 'mcp-design-philosophy',
    title: 'Get DDS Design Philosophy',
    description: 'Retrieve Wu Wei design principles and engineering guidelines.',
    category: 'mcp',
    tags: ['mcp', 'philosophy', 'principles', 'wu-wei'],
    prompt: `Get DDS design philosophy and principles.

## MCP Query
\`\`\`
mcp__dds__get_design_philosophy()
\`\`\`

## Core Principles (Wu Wei - Effortless Action)
| Principle | Meaning |
|-----------|---------|
| Simple over clever | Let solutions emerge naturally |
| Add only needed | 3 similar lines > premature abstraction |
| Trust the flow | Use existing patterns first |
| No force | Step back if fighting the system |
| Backwards compat | ADD new, DEPRECATE old, never REMOVE until v3 |

## Pre-Commit Questions
1. Am I adding unnecessary complexity?
2. Does this pattern already exist?
3. Can I delete code instead of adding?

## Component Philosophy
- Minimum viable props (≤12)
- Composition over configuration
- Semantic tokens over primitives
- Radix for accessibility

OUTPUT: Full DDS design philosophy from MCP.`,
  },
  {
    id: 'contrast-category-check',
    title: 'Check Contrast for Category',
    description: 'Comprehensive contrast check for a specific background category.',
    category: 'mcp',
    variables: ['CATEGORY'],
    tags: ['mcp', 'contrast', 'category', 'wcag'],
    prompt: `Check all contrast options for {CATEGORY} backgrounds.

## MCP Comprehensive Check
\`\`\`
// Get category-specific guidance
mcp__dds__get_color_guidance({ category: "{CATEGORY}" })

// Get all accessible colors for common backgrounds in category
// For dark_backgrounds:
mcp__dds__get_accessible_colors({ background: "ABYSS[900]", minLevel: "AA" })
mcp__dds__get_accessible_colors({ background: "ABYSS[800]", minLevel: "AA" })
mcp__dds__get_accessible_colors({ background: "DEEP_CURRENT[800]", minLevel: "AA" })

// For light_backgrounds:
mcp__dds__get_accessible_colors({ background: "white", minLevel: "AA" })
mcp__dds__get_accessible_colors({ background: "CREAM", minLevel: "AA" })
\`\`\`

## Category Reference
| Category | Common Backgrounds |
|----------|-------------------|
| \`dark_backgrounds\` | ABYSS[700-900], DEEP_CURRENT[700-900] |
| \`light_backgrounds\` | white, CREAM, SLATE[50-100] |
| \`accent_backgrounds\` | DEEP_CURRENT[500], HARBOR[500] |
| \`semantic_error\` | CORAL[500], CORAL[100] |

## Output Format
| Background | Foreground | Ratio | Level |
|------------|------------|-------|-------|
| ABYSS[900] | white | 12.5:1 | AAA ✓ |
| ABYSS[900] | SLATE[200] | 7.2:1 | AAA ✓ |
| ABYSS[900] | SLATE[400] | 4.1:1 | AA ✗ |

OUTPUT: Full contrast matrix for category.`,
  },

  // =============================================================================
  // INTEGRATION & DEVELOPER PATTERNS (NEW)
  // =============================================================================
  {
    id: 'integration-adapter-pattern',
    title: 'Create Adapter Functions',
    description: 'Create adapter functions to map application data to DDS component interfaces.',
    category: 'delivery',
    variables: ['COMPONENT', 'APP_DATA_TYPE'],
    tags: ['integration', 'adapter', 'mapping', 'typescript'],
    prompt: `Create adapter functions to map {APP_DATA_TYPE} to {COMPONENT} props.

READ FIRST: \`src/stories/developers/AdapterPatterns.mdx\`

## Adapter Pattern (Recommended for Data Transformation)

\`\`\`tsx
// adapters/statusAdapter.ts
import type { BadgeProps } from '@dds/design-system/core'

// Map your app's status to DDS Badge variants
export function adaptStatusToBadge(status: AppStatus): BadgeProps {
  const mapping: Record<AppStatus, BadgeProps> = {
    active: { variant: 'success', children: 'Active' },
    pending: { variant: 'warning', children: 'Pending' },
    inactive: { variant: 'muted', children: 'Inactive' },
  }
  return mapping[status] ?? { variant: 'muted', children: 'Unknown' }
}

// Usage in component
<Badge {...adaptStatusToBadge(user.status)} />
\`\`\`

## When to Use Adapters vs Wrappers

| Pattern | Use When |
|---------|----------|
| **Adapter Function** | Pure data transformation (types, formats) |
| **Wrapper Component** | Need to add behavior, state, or context |
| **Render Props** | Consumer needs granular control |
| **Composition** | Building complex UI from DDS primitives |

## Adapter Best Practices

1. **Type-safe mapping**
\`\`\`tsx
// ✅ Exhaustive mapping with TypeScript
function adaptStatus(s: AppStatus): BadgeVariant {
  switch (s) {
    case 'active': return 'success'
    case 'pending': return 'warning'
    case 'inactive': return 'muted'
    // TypeScript ensures all cases covered
  }
}
\`\`\`

2. **Handle edge cases**
\`\`\`tsx
// ✅ Safe fallback
return mapping[status] ?? { variant: 'muted', children: 'Unknown' }
\`\`\`

3. **Keep adapters pure**
\`\`\`tsx
// ❌ No side effects
function adaptData(d: Data): Props {
  console.log(d) // Don't do this
  return { ... }
}

// ✅ Pure transformation
function adaptData(d: Data): Props {
  return { ... }
}
\`\`\`

## Output
- Adapter function(s) in \`adapters/\` folder
- TypeScript types for input/output
- Usage example in consuming component`,
  },
  {
    id: 'integration-wrapper-component',
    title: 'Create Wrapper Component',
    description: 'Create a wrapper component to encapsulate DDS integration with app-specific behavior.',
    category: 'delivery',
    variables: ['COMPONENT', 'WRAPPER_NAME'],
    tags: ['integration', 'wrapper', 'encapsulation', 'isolation'],
    prompt: `Create wrapper component {WRAPPER_NAME} for {COMPONENT}.

READ FIRST: \`src/stories/developers/AdapterPatterns.mdx\`

## Wrapper Pattern (Recommended for Behavior/Isolation)

\`\`\`tsx
// components/AppButton.tsx
import { Button, type ButtonProps } from '@dds/design-system/core'
import { useAppContext } from '../context/AppContext'

interface AppButtonProps extends ButtonProps {
  trackingId?: string
}

export function AppButton({ trackingId, onClick, ...props }: AppButtonProps) {
  const { analytics } = useAppContext()

  const handleClick = (e: React.MouseEvent) => {
    if (trackingId) analytics.track(trackingId)
    onClick?.(e)
  }

  return <Button {...props} onClick={handleClick} />
}
\`\`\`

## Benefits of Wrapper Pattern

| Benefit | Example |
|---------|---------|
| **Isolation** | Single import point for DDS |
| **Custom behavior** | Analytics, permissions, logging |
| **Default props** | Consistent sizing across app |
| **Migration ease** | Swap underlying component in one place |

## Wrapper vs Direct Import

\`\`\`tsx
// ❌ Direct import everywhere (hard to migrate)
import { Button } from '@dds/design-system/core'

// ✅ Wrapper isolates DDS (easy to update)
import { AppButton } from '@/components/AppButton'
\`\`\`

## Three-Layer Integration

\`\`\`
┌─────────────────────────────────────────────┐
│ Application Pages & Features                │
│ (import from app wrappers)                  │
├─────────────────────────────────────────────┤
│ App Wrappers (adapters + behavior)          │
│ (import from DDS)                           │
├─────────────────────────────────────────────┤
│ DDS Components                              │
│ (never imported directly by features)       │
└─────────────────────────────────────────────┘
\`\`\`

## Output
- Wrapper component with typed props
- Extends original DDS props
- Adds app-specific behavior
- Exports from \`components/\` barrel`,
  },
  {
    id: 'version-publish',
    title: 'Version and Publish Package',
    description: 'Follow semantic versioning workflow to publish DDS package updates.',
    category: 'delivery',
    variables: ['VERSION_TYPE'],
    tags: ['versioning', 'semver', 'publishing', 'changelog'],
    prompt: `Publish DDS package with {VERSION_TYPE} version bump.

READ FIRST: \`src/stories/developers/VersioningUpdates.mdx\`

## Semantic Versioning Reference

| Bump | When | Example |
|------|------|---------|
| **PATCH** (x.x.1) | Bug fixes, no API changes | Fix tooltip positioning |
| **MINOR** (x.1.0) | New features, backward compatible | Add Button variant |
| **MAJOR** (1.0.0) | Breaking changes | Rename prop, remove component |

## Pre-Publish Checklist

\`\`\`bash
# 1. Run full validation
npm run health

# 2. Check for breaking changes
git diff HEAD~5 -- 'src/components/**/*.tsx'

# 3. Verify exports
npm run validate:exports

# 4. Build package
npm run build
\`\`\`

## Update Files (MANDATORY)

| Change Type | Update |
|-------------|--------|
| Any change | \`package.json\` version |
| Any change | \`changelog.json\` with entry |
| New component | \`README.md\` Package Architecture |
| Breaking change | \`v3-breaking-changes.md\` |

## Changelog Entry Format

\`\`\`json
{
  "version": "2.3.0",
  "date": "2024-01-15",
  "changes": [
    {
      "type": "feature",
      "component": "Button",
      "description": "Add 'outline' variant for secondary actions"
    }
  ]
}
\`\`\`

## Breaking Change Documentation

\`\`\`markdown
## Button.variant renamed

**Before:**
\`\`\`tsx
<Button variant="ghost" />
\`\`\`

**After:**
\`\`\`tsx
<Button variant="subtle" />
\`\`\`

**Migration:** Find/replace \`variant="ghost"\` → \`variant="subtle"\`
\`\`\`

## Output
- Updated package.json version
- Changelog entry with all changes
- README updates if architecture changed
- Breaking change documentation if MAJOR`,
  },
  {
    id: 'api-mock-data',
    title: 'Create Mock API Data',
    description: 'Create mock API layer with seed data for Storybook and testing.',
    category: 'review',
    variables: ['ENTITY'],
    tags: ['api', 'mock', 'seed-data', 'testing', 'storybook'],
    prompt: `Create mock API data for {ENTITY}.

READ FIRST: \`src/stories/developers/ApiSimulation.mdx\`

## Seed Data Structure

\`\`\`tsx
// lib/mock-data/entities/{entity}.ts

export interface {ENTITY} {
  id: string
  // ... entity fields
}

// Seed data - realistic examples
export const SEED_{ENTITY}S: {ENTITY}[] = [
  {
    id: '{entity}-001',
    // Realistic, not "Test 1", "Lorem ipsum"
  },
]

// Helper to get by ID
export function get{ENTITY}ById(id: string): {ENTITY} | undefined {
  return SEED_{ENTITY}S.find(e => e.id === id)
}

// Helper to filter/search
export function search{ENTITY}s(query: string): {ENTITY}[] {
  return SEED_{ENTITY}S.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase())
  )
}
\`\`\`

## Dual-ID Pattern (for related entities)

\`\`\`tsx
// ❌ Inconsistent IDs
{ id: '1', userId: 'u1' }  // Which is the user?

// ✅ Dual-ID pattern
{
  id: 'order-001',        // Entity's own ID
  userId: 'user-001',     // FK reference (matches User.id)
  user: SEED_USERS[0],    // Denormalized for convenience
}
\`\`\`

## Realistic Data Guidelines

| Field Type | Bad | Good |
|------------|-----|------|
| Name | "Test User" | "Sarah Chen" |
| Email | "test@test.com" | "sarah.chen@acme.io" |
| Status | "status1" | "active", "pending" |
| Date | "2024-01-01" | Relative: "2 hours ago" |

## Story Usage

\`\`\`tsx
// Component.stories.tsx
import { SEED_USERS, getUserById } from '@/lib/mock-data'

export const Default: Story = {
  args: {
    users: SEED_USERS.slice(0, 5),
  },
}

export const SingleUser: Story = {
  args: {
    user: getUserById('user-001'),
  },
}
\`\`\`

## Output
- Seed data file with realistic examples
- Helper functions (getById, search, filter)
- Types matching real API contract
- Story examples using mock data`,
  },
  {
    id: 'browser-ios-safari',
    title: 'Fix iOS Safari Compatibility',
    description: 'Apply iOS Safari-specific fixes and safe-area utilities.',
    category: 'ux',
    variables: ['COMPONENT'],
    tags: ['ios', 'safari', 'mobile', 'compatibility', 'safe-area'],
    prompt: `Fix iOS Safari compatibility issues in {COMPONENT}.

READ FIRST: \`src/stories/developers/BrowserCompatibility.mdx\`

## iOS Safari Common Issues

| Issue | Problem | Fix |
|-------|---------|-----|
| **100vh** | Excludes Safari UI | Use \`dvh\` or \`min-h-[100dvh]\` |
| **Safe Area** | Content under notch | Use \`safe-area-inset-*\` |
| **Momentum Scroll** | Janky overflow | \`-webkit-overflow-scrolling: touch\` |
| **Input Zoom** | Font <16px triggers zoom | Min font-size 16px |
| **Position Fixed** | Breaks with keyboard | Use absolute or transform |

## Viewport Height Units

\`\`\`css
/* ❌ Broken - doesn't account for Safari UI */
height: 100vh;

/* ✅ Fixed - dynamic viewport height */
height: 100dvh;
min-height: 100dvh;
\`\`\`

\`\`\`tsx
// Tailwind classes
<div className="min-h-[100dvh]">  {/* Dynamic */}
<div className="min-h-[100svh]">  {/* Small - keyboard up */}
<div className="min-h-[100lvh]">  {/* Large - keyboard down */}
\`\`\`

## Safe Area Utilities

\`\`\`tsx
// Bottom navigation - avoid home indicator
<nav className="pb-[env(safe-area-inset-bottom)]">

// Fullscreen modal - avoid notch
<div className="
  pt-[env(safe-area-inset-top)]
  pb-[env(safe-area-inset-bottom)]
  pl-[env(safe-area-inset-left)]
  pr-[env(safe-area-inset-right)]
">
\`\`\`

## iOS 26+ "Liquid Glass" Issues

\`\`\`tsx
// ❌ Colors may render incorrectly
<div className="bg-[#FF0000]">

// ✅ Use CSS variables for reliable colors
<div className="bg-error">  {/* Semantic token */}
\`\`\`

## Testing Checklist

| Device | Check |
|--------|-------|
| iPhone notch | Content not clipped |
| iPhone Dynamic Island | Header visible |
| iPad | Landscape safe areas |
| iOS keyboard | Input fields accessible |
| Portrait → Landscape | Layout reflows correctly |

## Quick Fixes

\`\`\`tsx
// Prevent input zoom
<input className="text-base" />  {/* 16px minimum */}

// Fix sticky header in Safari
<header className="sticky top-0 z-50 transform-gpu">

// Smooth scrolling container
<div className="overflow-y-auto -webkit-overflow-scrolling-touch">
\`\`\`

## Output
- Fixed viewport heights
- Safe area insets applied
- Input font sizes ≥16px
- Tested on iOS Safari`,
  },
  // =============================================================================
  // LOCAL DEVELOPMENT
  // =============================================================================
  {
    id: 'local-dev-start',
    title: 'Start Local Development',
    description: 'Set up local DDS development workflow with yalc for hot-reload or npm pack for verification.',
    category: 'delivery',
    variables: ['APP_PATH', 'METHOD'],
    tags: ['local', 'development', 'yalc', 'npm-pack', 'testing'],
    prompt: `Set up local DDS development for testing in consumer app at {APP_PATH}.

READ FIRST: \`src/stories/developers/LocalDevelopment.mdx\`

## Method: {METHOD}

### Option A: yalc (Best for Active Development - Hot Reload)

\`\`\`bash
# One-time setup (if not installed)
npm install -g yalc

# Step 1: Build and publish DDS to local store
cd ~/Desktop/DDS
npm run build
yalc publish

# Step 2: Link in your app (first time only)
cd {APP_PATH}
yalc add @adrozdenko/design-system

# Step 3: Start development
# Terminal 1 (DDS): Watch and auto-push
cd ~/Desktop/DDS
npm run build && yalc push --watch

# Terminal 2 (Your app): Dev server
cd {APP_PATH}
npm run dev
\`\`\`

**After each DDS change:**
\`\`\`bash
cd ~/Desktop/DDS
npm run build && yalc push
\`\`\`

### Option B: npm pack (Best for Final Verification)

\`\`\`bash
# Step 1: Build DDS
cd ~/Desktop/DDS
npm run build

# Step 2: Create package tarball
npm pack
# Creates: adrozdenko-design-system-X.X.X.tgz

# Step 3: Install in your app
cd {APP_PATH}
npm install ~/Desktop/DDS/adrozdenko-design-system-*.tgz

# Step 4: Start app
npm run dev
\`\`\`

**One-liner for updates:**
\`\`\`bash
cd ~/Desktop/DDS && npm run build && npm pack && cd {APP_PATH} && npm install ~/Desktop/DDS/*.tgz
\`\`\`

## Verification Checklist
- [ ] DDS components render correctly
- [ ] Styles/tokens applied properly
- [ ] No "Multiple React instances" error
- [ ] TypeScript types resolve

## Troubleshooting
| Issue | Solution |
|-------|----------|
| "Invalid hook call" | Use yalc, not npm link |
| Changes not reflecting | Clear node_modules/.cache, restart dev server |
| TypeScript errors | Run \`npm run build\` in DDS first |
| Styles missing | Import \`@adrozdenko/design-system/styles\` |

OUTPUT: Local development environment ready with DDS linked.`,
  },
  {
    id: 'local-dev-end',
    title: 'End Local Development',
    description: 'Clean up local DDS links and restore npm registry version before committing.',
    category: 'delivery',
    variables: ['APP_PATH'],
    tags: ['local', 'development', 'cleanup', 'yalc', 'restore'],
    prompt: `Clean up local DDS development and restore npm version in {APP_PATH}.

READ FIRST: \`src/stories/developers/LocalDevelopment.mdx\`

## Cleanup Steps

### If using yalc:

\`\`\`bash
# Step 1: Remove yalc link
cd {APP_PATH}
yalc remove @adrozdenko/design-system

# Step 2: Restore npm version
npm install

# Step 3: Verify package.json has no yalc references
cat package.json | grep -E "yalc|file:"
# Should return empty

# Step 4: Clean yalc store (optional)
yalc installations clean
\`\`\`

### If using npm pack / file path:

\`\`\`bash
# Step 1: Update package.json to npm version
cd {APP_PATH}
npm uninstall @adrozdenko/design-system
npm install @adrozdenko/design-system@latest

# Step 2: Verify package.json
cat package.json | grep "@adrozdenko/design-system"
# Should show npm version like "^2.7.0"

# Step 3: Remove tarball files from DDS
cd ~/Desktop/DDS
rm -f *.tgz
\`\`\`

## Pre-Commit Checklist
- [ ] No \`file:\` references in package.json
- [ ] No \`.yalc\` folder in app root
- [ ] No \`yalc.lock\` file in app root
- [ ] package-lock.json shows npm registry URL
- [ ] App builds successfully with npm version

## Verification

\`\`\`bash
# Verify clean package.json
cd {APP_PATH}
grep -E "yalc|file:" package.json
# Should return nothing

# Verify npm version works
rm -rf node_modules
npm install
npm run build
\`\`\`

## Common Issues
| Issue | Solution |
|-------|----------|
| yalc folder still exists | \`rm -rf .yalc yalc.lock\` |
| Old tarball path in lockfile | Delete package-lock.json, run \`npm install\` |
| Version mismatch | Specify exact version: \`npm install @adrozdenko/design-system@2.7.0\` |

## FORBIDDEN
- Committing with \`file:\` or yalc references in package.json
- Leaving .yalc folder in repository
- Pushing tarball files to git

OUTPUT: Clean package.json with npm registry version, ready to commit.`,
  },

  {
    id: 'migration-page',
    title: 'Migrate Page to DDS',
    description: 'Follow all-or-nothing page migration strategy to DDS components.',
    category: 'delivery',
    variables: ['PAGE_NAME'],
    tags: ['migration', 'page', 'integration', 'strategy'],
    prompt: `Migrate {PAGE_NAME} to DDS components.

READ FIRST:
- \`src/stories/developers/MigrationStrategy.mdx\`
- \`src/stories/developers/PageImplementationGuide.mdx\`

## Migration Strategy: All-or-Nothing Per Page

\`\`\`
❌ DON'T: Partial migration (mixed old + DDS)
   - Inconsistent UX
   - CSS conflicts
   - Double maintenance burden

✅ DO: Complete page migration
   - Consistent experience
   - Clean codebase
   - Clear ownership
\`\`\`

## Pre-Migration Audit

| Check | Command |
|-------|---------|
| Component count | \`grep -c "<Button" src/pages/{PAGE_NAME}.tsx\` |
| DDS equivalents | \`mcp__dds__search_components({ query: "Button" })\` |
| Custom styles | \`grep -c "className=" src/pages/{PAGE_NAME}.tsx\` |

## Migration Steps

### 1. Create Component Map
\`\`\`
| Old Component | DDS Equivalent | Notes |
|---------------|----------------|-------|
| CustomButton | Button | Use variant="primary" |
| OldModal | Dialog | New API |
| LegacyTable | DataTable | Different props |
\`\`\`

### 2. Create Wrapper Components (if needed)
\`\`\`tsx
// Preserve existing prop interface
export function LegacyButtonWrapper(props: OldButtonProps) {
  return <Button {...adaptOldPropsToNew(props)} />
}
\`\`\`

### 3. Replace in Order
1. **Layout** components first (containers, grids)
2. **Navigation** (headers, tabs)
3. **Content** components (cards, tables)
4. **Interactive** elements last (forms, modals)

### 4. Clean Up
\`\`\`bash
# Remove old imports
# Delete unused old components
# Remove legacy CSS
# Update tests
\`\`\`

## Validation

\`\`\`bash
npm run typecheck
npm run lint
npm run build

# Visual regression (if available)
npm run test:visual
\`\`\`

## Output
- Fully migrated page (no old components)
- Wrapper components if API differs
- Updated imports and tests
- No mixed styling`,
  },
]
