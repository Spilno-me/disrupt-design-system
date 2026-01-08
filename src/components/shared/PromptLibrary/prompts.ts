/**
 * DDS Prompt Library Data
 *
 * All prompts for agent operations in the design system.
 * Add new prompts here - they will automatically appear in the UI.
 */

import type { Prompt } from './PromptLibrary'

export const DDS_PROMPTS: Prompt[] = [
  // =============================================================================
  // META (Entry Points & Routing)
  // =============================================================================
  {
    id: 'prompt-router',
    title: 'Auto-Select Prompt from Context',
    description:
      'Analyze conversation context and automatically select the most appropriate prompt from the library to execute.',
    category: 'planning',
    variables: [],
    tags: ['meta', 'router', 'auto-select', 'intelligent', 'entry-point', 'universal'],
    prompt: `Analyze the current conversation context and automatically select the most appropriate prompt from the DDS Prompt Library to execute.

## STEP 1: CONTEXT ANALYSIS

Extract signals from the conversation:

### 1.1 Identify Keywords
Scan for specific terms that map directly to prompts:

| Keywords Present | Maps To Prompt |
|------------------|----------------|
| "plan", "design", "architect", "how should we" | \`plan-unified\` |
| "quick plan", "simple plan", "tiny plan" | \`plan-bulletproof\` |
| "iterate plan", "review plan agents" | \`plan-iterate\` |
| "create component", "new component", "build a" | \`component-create\` |
| "write story", "storybook", "create story" | \`story-full\` |
| "fix color", "contrast", "hover state" | \`mcp-contrast-check\` |
| "dark mode", "theme" | \`dark-mode-check\` |
| "review", "check code", "audit" | \`review-dds-compliance\` |
| "add token", "new color", "new token" | \`token-add-color\` |
| "stabilize", "clean code", "refactor" | \`component-stabilize\` |
| "pre-PR", "before merge" | \`review-pre-pr\` |
| "create prompt", "new prompt" | \`prompt-create\` |
| "ux", "usability", "user experience" | \`ux-apply-laws\` |
| "accessibility", "a11y", "semantic html" | \`a11y-semantic-html\` |
| "spacing", "padding", "margin", "gap" | \`styling-spacing\` |
| "typography", "font", "text size" | \`styling-typography\` |
| "depth", "elevation", "layers", "z-index" | \`styling-depth-layering\` |
| "icons", "emoji", "replace emoji" | \`icons-replace-emoji\` |
| "responsive", "mobile", "breakpoints" | \`responsive-mobile-first\` |
| "package", "deliver", "export", "publish" | \`delivery-package\` |
| "local dev", "start dev", "development server" | \`local-dev-start\` |
| "end session", "finish dev", "stop dev" | \`local-dev-end\` |

### 1.2 Identify Intent
What is the user trying to DO?

| Intent Type | Likely Prompts |
|-------------|----------------|
| **CREATE** something new | \`component-create\`, \`story-full\`, \`token-add-color\` |
| **FIX** an issue | \`mcp-contrast-check\`, \`dark-mode-check\`, \`review-find-violations\` |
| **REVIEW** existing code | \`review-dds-compliance\`, \`review-pre-pr\`, \`review-clean-code\` |
| **PLAN** before building | \`plan-unified\`, \`plan-bulletproof\` |
| **IMPROVE** existing code | \`component-stabilize\`, \`review-refactor-plan\` |
| **STYLE** a component | \`styling-*\` prompts based on what's being styled |
| **DOCUMENT** | \`docs-mdx-page\`, \`story-full\` |

### 1.3 Identify Artifacts
What files/components are being discussed?

| Artifact Type | Relevant Prompts |
|---------------|------------------|
| .tsx component files | \`component-*\`, \`review-*\` |
| .stories.tsx files | \`story-*\` |
| Color/token files | \`token-*\`, \`mcp-contrast-check\` |
| .md documentation | \`docs-*\` |
| CSS/styling | \`styling-*\` |

## STEP 2: MATCH TO BEST PROMPT

Apply this priority order:

1. **Exact keyword match** → Use that prompt directly
2. **Multiple keyword matches** → Pick based on PRIMARY intent (create > fix > review > plan)
3. **Intent-only match** → Use the most specific prompt for that intent
4. **No clear match** → Default to \`plan-unified\` if exploratory, or ask user

## STEP 3: OUTPUT SELECTION

\`\`\`
📋 PROMPT SELECTION
─────────────────────────────────────
Context signals detected:
- Keywords: [list matched keywords]
- Intent: [CREATE | FIX | REVIEW | PLAN | IMPROVE | STYLE | DOCUMENT]
- Artifacts: [list mentioned files/components]

Selected prompt: [prompt-id]
Reason: [1-line justification]
Confidence: [HIGH | MEDIUM | LOW]
─────────────────────────────────────
\`\`\`

## STEP 4: EXECUTE SELECTED PROMPT

After selection, IMMEDIATELY:

1. **Read the skill file**: \`.claude/skills/[prompt-id].md\`
2. **Run MCP tools FIRST** if the prompt includes a PRE-FLIGHT section
3. **Follow the prompt's instructions** exactly
4. **Deliver in the prompt's OUTPUT format**

## FALLBACK RULES

**If multiple prompts could apply:**
- Task involves code changes → prefer \`component-*\` or \`review-*\` prompts
- Task is exploratory/unclear → prefer \`plan-unified\`
- Task mentions specific styling aspect → prefer that \`styling-*\` prompt
- Still ambiguous → ask: "Should I use [prompt-a] or [prompt-b]?"

**If NO prompt matches:**
1. State: "No matching prompt found. Proceeding with general approach."
2. Suggest: "Consider creating a prompt for this pattern via \`prompt-create\`"
3. Apply DDS philosophy triad (Wu Wei, MAYA, QoE) directly

## ANTI-PATTERNS

FORBIDDEN:
- Skipping Step 1 context analysis
- Guessing without reading the skill file
- Executing without showing the selection output
- Combining multiple prompts in one pass (execute one at a time)
- Saying "I'll use prompt X" without reading \`.claude/skills/[X].md\``,
  },

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
    tags: ['storybook', 'documentation', 'testing', 'qoe'],
    prompt: `Create a complete Storybook story for {COMPONENT}.

## Quality of Engagement (QoE) Mindset
Before writing, apply these principles:
- **Make it smaller**: Start with Default story, then expand. Don't plan all variants at once.
- **Find the living question**: "What makes this component interesting to showcase?"
- **Allow ugliness**: First draft can be rough—refine after seeing it in Storybook.
- **Follow irritation**: If a story feels forced, ask what the component actually needs.

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
    tags: ['storybook', 'allstates', 'qoe'],
    prompt: `Create an AllStates story for {COMPONENT}.

## QoE Mindset
- **Stop at the peak**: Don't exhaust every possible combination—show meaningful states.
- **Body as barometer**: If listing states feels tedious, you're over-documenting.

Read \`.claude/storybook-rules.md\` and use infrastructure from \`src/stories/_infrastructure\`.

Structure:
- StorySection for each category (Variants, Sizes, States)
- StoryFlex or StoryGrid for layout
- Real component props (no CSS overrides)
- Include: default, hover (via decorator), focus, disabled, error states

Use withStoryContainer('{LEVEL}') decorator where LEVEL is atom, molecule, or organism.`,
  },
  {
    id: 'story-api-simulation',
    title: 'Use API Simulation in Stories',
    description:
      'Configure stories with proper API simulation using seed data factories. No hardcoded data in stories or components.',
    category: 'stories',
    variables: ['COMPONENT_OR_PAGE'],
    tags: ['storybook', 'api', 'simulation', 'seed-data', 'msw', 'zustand', 'qoe'],
    prompt: `Configure {COMPONENT_OR_PAGE} story with proper API simulation.

## Core Principle: Component Purity

**Components are PURE. Data is INJECTED.**

\`\`\`
❌ FORBIDDEN: Hardcoded data anywhere
   - No seed data in components
   - No inline mock arrays in stories
   - No "sampleData" or "dummyData" constants

✅ REQUIRED: Data from seed layer
   - Import from src/api/data/seed/
   - Use seed factories for dynamic data
   - Configure via props or store initialization
\`\`\`

## DDS API Simulation Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│ src/flow/data/             │ Raw mock data (58 users)  │
├─────────────────────────────────────────────────────────┤
│ src/api/data/seed/         │ Seed factories + exports  │
├─────────────────────────────────────────────────────────┤
│ src/api/core/store.ts      │ Zustand in-memory store   │
├─────────────────────────────────────────────────────────┤
│ src/api/services/*.api.ts  │ REST-like operations      │
├─────────────────────────────────────────────────────────┤
│ Stories                    │ Import seed, pass to props│
└─────────────────────────────────────────────────────────┘
\`\`\`

## Step 1: Identify Data Needs

What data does {COMPONENT_OR_PAGE} require?

| Data Type | Seed Source |
|-----------|-------------|
| Users | \`seedUsers\` (58 pre-configured) |
| Incidents | \`seedIncidents\`, \`generateManyIncidents(n)\` |
| Locations | \`seedLocations\` (27 hierarchical) |
| Steps/Tasks | \`seedSteps\` |
| Roles | \`seedRoles\` |
| KPIs/Metrics | \`seedEhsKpis\`, \`seedEhsAnalyticsKpis\` |

## Step 2: Import from Seed Layer

\`\`\`tsx
// ✅ CORRECT: Import from centralized seed layer
import {
  seedUsers,
  seedIncidents,
  seedLocations,
  generateManyIncidents,
  getIncidentsByStatus,
} from '../../api/data/seed'

// ❌ WRONG: Hardcoded inline data
const users = [
  { id: '1', name: 'John Doe' },  // NEVER DO THIS
]
\`\`\`

## Step 3: Story Configuration Patterns

### Pattern A: Props Injection (Preferred for Pages/Organisms)
\`\`\`tsx
import { seedIncidents, seedUsers } from '../../api/data/seed'
import { PAGE_META } from '../_infrastructure'

const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/Dashboard',
  component: DashboardPage,
  ...PAGE_META,
}

export const Default: Story = {
  render: () => (
    <DashboardPage
      incidents={seedIncidents}
      users={seedUsers}
    />
  ),
}

// With filtered data
export const EmptyState: Story = {
  render: () => (
    <DashboardPage
      incidents={[]}
      users={seedUsers}
    />
  ),
}

// With factory-generated data
export const HighVolume: Story = {
  render: () => (
    <DashboardPage
      incidents={generateManyIncidents(500)}
      users={seedUsers}
    />
  ),
}
\`\`\`

### Pattern B: Store Initialization (For Components Using Hooks)
\`\`\`tsx
import { useApiStore } from '../../api/core/store'
import { seedUsers, seedIncidents } from '../../api/data/seed'

// Decorator to initialize store
const withApiStore = (Story: StoryFn) => {
  useApiStore.getState().initialize({
    users: seedUsers,
    incidents: seedIncidents,
  })
  return <Story />
}

export const Default: Story = {
  decorators: [withApiStore],
}
\`\`\`

### Pattern C: API Config Override (For Testing Edge Cases)
\`\`\`tsx
import { setApiConfig } from '../../api/core/config'

// Disable delays for faster story rendering
const withFastApi = (Story: StoryFn) => {
  setApiConfig({
    delays: { enabled: false },
    errors: { enabled: false },
  })
  return <Story />
}

// Enable high failure rate for error state testing
const withUnstableApi = (Story: StoryFn) => {
  setApiConfig({
    errors: { networkFailureRate: 0.5, enabled: true },
  })
  return <Story />
}
\`\`\`

## Step 4: Seed Data Factories Reference

\`\`\`tsx
// Available in src/api/data/seed/index.ts

// Static data
seedUsers           // 58 users with roles, departments
seedIncidents       // Pre-defined incident scenarios
seedLocations       // 27 hierarchical locations
seedRoles           // Role definitions
seedSteps           // Task/step data

// Factory functions
generateManyIncidents(count)    // Generate N incidents
getIncidentsByStatus(status)    // Filter by status
getSeedDepartments()            // List departments
getSeedJobTitles()              // List job titles
getIncidentStats()              // Aggregated stats

// Dashboard-specific
seedEhsKpis
seedEhsAnalyticsKpis
seedEhsTrends
\`\`\`

## FORBIDDEN

\`\`\`tsx
// ❌ Inline mock data
const mockData = [{ id: 1, name: 'Test' }]

// ❌ Data defined in component files
// In Component.tsx:
const DEFAULT_ITEMS = [...]  // NEVER

// ❌ "sample" or "dummy" prefixes
const sampleUsers = [...]
const dummyIncidents = [...]

// ❌ Random data generation in stories
const randomUser = { id: Math.random(), ... }

// ❌ Importing from flow/data directly in stories
import { mockUsers } from '../../flow/data/mockUsers'  // Go through seed layer
\`\`\`

## REQUIRED

\`\`\`tsx
// ✅ Import from seed layer
import { seedUsers } from '../../api/data/seed'

// ✅ Use factories for dynamic needs
import { generateManyIncidents } from '../../api/data/seed'

// ✅ Components receive data as props
<DataTable data={seedIncidents} />

// ✅ Use store for hook-based components
useApiStore.getState().initialize({ users: seedUsers })

// ✅ Clear naming in stories
export const WithManyIncidents: Story = { ... }
export const EmptyState: Story = { ... }
export const LoadingState: Story = { ... }
\`\`\`

## QoE Checklist

Before committing:
- [ ] Zero hardcoded data in story file?
- [ ] Zero hardcoded data in component file?
- [ ] All data imported from \`src/api/data/seed/\`?
- [ ] Story names describe the DATA scenario, not the component?
- [ ] Seed factories used for large datasets?

OUTPUT: Story file using proper API simulation patterns with seed data injection.`,
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
    tags: ['component', 'ui', 'cva', 'mcp', 'wu-wei', 'maya'],
    prompt: `Create a new UI component: {COMPONENT}

## Philosophy Triad Mindset

**Wu Wei (Engineering):**
- Reuse existing patterns before inventing new ones
- Simple implementation over clever abstraction
- If fighting the codebase, step back and find the natural path

**MAYA (UX):**
- Users should immediately understand the component
- Familiar interaction patterns over novel ones
- Modern visuals, stable behaviors

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
    tags: ['stabilization', 'clean-code', 'refactoring', 'production-ready', 'mcp', 'wu-wei', 'qoe'],
    prompt: `Stabilize {COMPONENT} to Clean Code A+ standard.

## Philosophy Triad Mindset

**Wu Wei (Engineering):**
- Work WITH the existing code structure, not against it
- Simplify without over-engineering—delete > add
- If refactoring feels like a fight, scope may be too large

**QoE (Process):**
- Make it smaller: stabilize one aspect at a time
- Allow ugliness: functional first, polish after
- Stop at coherent points: don't refactor everything at once

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
    id: 'plan-unified',
    title: 'Unified Planning Protocol (Super Prompt)',
    description:
      'Complete adaptive planning protocol combining Discovery → Scoping → Drafting → Review → Agent Validation. Adapts depth based on task size.',
    category: 'planning',
    variables: ['FEATURE_OR_TASK'],
    tags: ['planning', 'architecture', 'review', 'qoe', 'unified', 'super-prompt'],
    prompt: `Execute the unified planning protocol for: {FEATURE_OR_TASK}

## PHASE 0: ORIENTATION (30 seconds)

### Determine Planning Depth

| Task Size | Phases to Use | Est. Time |
|-----------|---------------|-----------|
| **Tiny** (1 file, clear scope) | Skip to Phase 2 | 2 min |
| **Small** (2-5 files, known pattern) | Phase 1 → 2 → 3 | 5 min |
| **Medium** (cross-cutting, new pattern) | All phases, no agents | 15 min |
| **Large** (architecture, unknown territory) | All phases + agent iteration | 30 min |

**Your task:** {FEATURE_OR_TASK}
**Estimated size:** [TINY | SMALL | MEDIUM | LARGE]

---

## MODEL ROUTING: Three-Tier Intelligence

> **MCP first** (instant, free) → **Haiku second** (fast, cheap) → **Opus last** (reasoning only)

### Tier 1: MCP Tools ⚡ (ALWAYS TRY FIRST)
Instant, zero cost, deterministic. Use before ANY model call:

| Query Type | MCP Tool | Response Time |
|------------|----------|---------------|
| Component exists? | \`mcp__dds__search_components\` | ~50ms |
| Component details | \`mcp__dds__get_component\` | ~50ms |
| Token valid? | \`mcp__dds__check_token_usage\` | ~50ms |
| Contrast check | \`mcp__dds__check_contrast\` | ~50ms |
| Accessible colors | \`mcp__dds__get_accessible_colors\` | ~50ms |
| Color for context | \`mcp__dds__get_color_recommendation\` | ~50ms |
| Color harmony | \`mcp__dds__get_color_harmony\` | ~50ms |
| Glass/depth rules | \`mcp__dds__get_glass_rules\` | ~50ms |
| Design philosophy | \`mcp__dds__get_design_philosophy\` | ~50ms |

**MCP Decision Flow:**
\`\`\`
"Does Button component exist?"     → mcp__dds__search_components ⚡
"What variants does Card have?"    → mcp__dds__get_component ⚡
"Is CORAL[200] on ABYSS[900] ok?"  → mcp__dds__check_contrast ⚡
"What colors work on dark bg?"     → mcp__dds__get_accessible_colors ⚡
\`\`\`

### Tier 2: Haiku 🐦 (For scans MCP can't do)
Fast, cheap (~60x less than Opus). Use for codebase exploration:

| Task Type | Haiku Prompt Pattern |
|-----------|---------------------|
| **File pattern scan** | "List all files matching X pattern. Return paths only." |
| **Usage search** | "Find all imports of X. Return file:line list." |
| **Custom grep** | "Search for pattern Y in src/. Return matches." |
| **Checklist validation** | "Does plan mention X? Y? Z? Return yes/no each." |
| **Naming audit** | "Do these files follow kebab-case? Return violations." |
| **Dependency trace** | "What does file X import? List all." |
| **Impact count** | "How many files import X? Return count." |

**Haiku Delegation Syntax:**
\`\`\`
Task tool with:
- model: "haiku"
- subagent_type: "Explore"
- prompt: "[Scan/list/count/check task - NO reasoning]"
\`\`\`

### Tier 3: Opus 🧠 (Reasoning only)
Expensive but necessary for judgment. Use ONLY when MCP + Haiku insufficient:

| Task Type | Why Opus Required |
|-----------|-------------------|
| **Architectural decisions** | Trade-offs require judgment |
| **Kernel identification** | "What's essential?" needs understanding |
| **Risk assessment** | Reasoning about failure modes |
| **Plan synthesis** | Creative integration of findings |
| **Requirement interpretation** | Understanding nuance and intent |
| **Edge case analysis** | "What could go wrong?" |

### Decision Tree
\`\`\`
Before ANY task, ask in order:

1. Can MCP answer this? (component/token/color queries)
   └─ YES → Use MCP tool ⚡ (instant, free)

2. Is this a SCAN/COUNT/CHECK of the codebase?
   └─ YES → Delegate to Haiku 🐦 (fast, cheap)

3. Does this require REASONING/SYNTHESIS/JUDGMENT?
   └─ YES → Use Opus 🧠 (expensive but necessary)
\`\`\`

### Cost Comparison
| Tier | Cost | Speed | Use For |
|------|------|-------|---------|
| MCP ⚡ | FREE | ~50ms | DDS queries, tokens, colors |
| Haiku 🐦 | $0.25/1M | ~2s | File scans, greps, counts |
| Opus 🧠 | $15/1M | ~10s | Reasoning, synthesis |

**Savings Example (Large Plan):**
\`\`\`
Before: All Opus                    → $0.45
After:  MCP (40%) + Haiku (30%) + Opus (30%) → $0.14
        60% cost reduction
\`\`\`

---

## PHASE 1: DISCOVERY (QoE: Find the Living Question)

> "A 'living question' has energy and specificity. Dead questions are abstract."

### 1.1 What Already Exists? ⚡🐦 MCP + HAIKU

**Step 1: MCP Instant Queries ⚡** (run these first, parallel)
\`\`\`
mcp__dds__search_components({ query: "{FEATURE_OR_TASK}" })
mcp__dds__search_components({ type: "MOLECULE" })  // if building molecule
mcp__dds__get_design_tokens({ category: "colors" }) // if color-related
\`\`\`

**Step 2: Haiku Codebase Scan 🐦** (only for what MCP can't answer)
\`\`\`
Task tool with:
- model: "haiku"
- subagent_type: "Explore"
- prompt: "Find all files related to '{FEATURE_OR_TASK}'. Return:
  1. Existing implementations (paths only)
  2. Similar patterns (file:line)
  3. Related utilities
  Format: bullet list, no explanations"
\`\`\`

**Step 3: Opus Synthesis 🧠** (you do this)
- "What would we reinvent?" (reasoning)
- "What patterns should we follow?" (judgment)

| Source | Returns | Cost |
|--------|---------|------|
| MCP ⚡ | Component metadata, tokens | FREE |
| Haiku 🐦 | File paths, grep results | ~$0.001 |
| Opus 🧠 | "Should we build or reuse?" | ~$0.01 |

### 1.2 Ask Offering Questions (not Extracting)

| Extracting (avoid) | Offering (prefer) |
|-------------------|-------------------|
| "What do you want?" | "What problem are you solving?" |
| "Which option?" | "What does success look like?" |
| "Can I start?" | "What would make this delightful?" |

**Questions to answer:**
- What problem does this solve?
- Who benefits and how?
- What happens if we don't build this?
- What assumptions are we making?

### 1.3 Living Questions Found
[List specific, energized questions - NOT vague "should we..." questions]

**PHASE 1 OUTPUT:** Observations, living questions, NO solutions yet.

---

## PHASE 2: SCOPING (QoE: Make It Smaller)

> "Shrink scope until it becomes interesting. Boredom often means scope is too large."

### 2.1 Find the Kernel
What's the ONE thing that makes {FEATURE_OR_TASK} valuable?
Everything else is decoration.

**Kernel:** [the essential thing]

### 2.2 Vertical Slice
| Original Scope | Minimal Valuable Version |
|----------------|--------------------------|
| [full feature] | [smallest useful increment] |

### 2.3 Explicitly Remove
For each requirement:
- [ ] Essential for v1? → KEEP / FUTURE / UNNECESSARY
- [ ] Can be hardcoded? → YES (defer) / NO (implement)

**Removed from v1:**
- [thing 1] → reason
- [thing 2] → reason

**PHASE 2 OUTPUT:** Smallest interesting scope, clear kernel.

---

## PHASE 3: INITIAL DRAFT

### 3.1 Requirements & Acceptance Criteria
- [ ] Critical requirement 1
- [ ] Critical requirement 2

### 3.2 Technical Approach
[How will this work? Key decisions and rationale]

### 3.3 Files to Modify
| File | Action | Description |
|------|--------|-------------|
| path/to/file.tsx | CREATE/MODIFY | What changes |

### 3.4 Dependencies & Integration Points
- External: [packages, APIs]
- Internal: [other components]
- Integration: [how this connects]

### 3.5 Risk Areas
| Risk | Severity | Mitigation |
|------|----------|------------|
| Risk 1 | HIGH/MED/LOW | How to handle |

**PHASE 3 OUTPUT:** First draft of complete plan.

---

## PHASE 4: SELF-REVIEW ROUNDS

### Round A: Gaps & Assumptions 🧠 OPUS
- [ ] What assumptions am I making?
- [ ] What information is missing?
- [ ] Are there unstated requirements?
- [ ] What dependencies haven't I identified?

### Round B: Edge Cases & Failures 🧠 OPUS
- [ ] What could go wrong?
- [ ] What edge cases exist?
- [ ] What's the failure mode?
- [ ] How do we handle errors?

### Round C: Consistency 🐦 HAIKU SCAN + 🧠 OPUS REASON
\`\`\`
// Delegate pattern scan to Haiku:
Task tool with:
- model: "haiku"
- subagent_type: "Explore"
- prompt: "For plan affecting files: [list files from plan]
  1. Find existing patterns for similar functionality
  2. Check if any listed imports already exist
  3. Verify naming follows conventions
  Return: findings list, no recommendations"
\`\`\`

**Haiku returns:** Pattern matches, naming check results
**Opus reasons about:** "Does this integrate cleanly?" "Breaking changes?"

- [ ] Does this match existing codebase patterns? (Haiku scan → Opus interpret)
- [ ] Am I reinventing something that exists? (Haiku scan)
- [ ] Does this integrate cleanly with current architecture? (Opus reasoning)
- [ ] Will this cause breaking changes? (Opus reasoning)

### Continue rounds until:
1. ✅ Zero critical blockers or risks
2. ✅ All dependencies identified
3. ✅ All integration points specified
4. ✅ Clear success criteria defined
5. ✅ Zero open questions about requirements

**PHASE 4 OUTPUT:** Reviewed plan with all issues addressed.

---

## PHASE 5: AGENT VALIDATION (For LARGE tasks only)

> Fresh eyes eliminate confirmation bias.

### Critical Issue Criteria
| Category | Critical Issue |
|----------|---------------|
| **Requirements** | Missing acceptance criteria, unstated assumptions |
| **Technical** | Missing dependencies, unclear integration points |
| **Risk** | Unmitigated high-severity risk, no failure handling |
| **Completeness** | Missing files to modify, unclear success criteria |
| **Consistency** | Breaks existing patterns, reinvents existing solution |

### Two-Model Validation Strategy

**Step 1: Haiku Quick Scan 🐦** (run first, parallel)
\`\`\`
Task tool with:
- model: "haiku"
- subagent_type: "Explore"
- run_in_background: true
- prompt: "Validate plan completeness. Check:
  □ All files listed exist or have valid parent dirs?
  □ All imports mentioned are real packages?
  □ Naming follows kebab-case files, PascalCase exports?
  □ No duplicate component names in codebase?
  Return: PASS/FAIL for each + file paths if FAIL"
\`\`\`

**Step 2: Opus Deep Review 🧠** (after Haiku returns)
\`\`\`
Task tool with:
- model: "sonnet" (or default Opus)
- subagent_type: "Plan"
- run_in_background: true
- prompt: "Review plan for CRITICAL issues only:
  [Include Haiku's findings]
  Focus on: architectural trade-offs, risk assessment,
  integration complexity, unstated assumptions.
  Return: CRITICAL issues only (not style nits)"
\`\`\`

### Agent Iteration
Repeat Opus review until ZERO critical issues (max 5 iterations).
Haiku scan runs ONCE (it's deterministic).

---

## FINAL OUTPUT FORMAT

\`\`\`
## Plan: {FEATURE_OR_TASK}

### Status: [DRAFT | NEEDS_REVIEW | APPROVED]
### Confidence: [LOW | MEDIUM | HIGH]
### Planning Depth: [TINY | SMALL | MEDIUM | LARGE]
### Review Rounds: [N]
### Agent Iterations: [N or SKIPPED]

### Kernel (The ONE Thing)
[Single sentence]

### Critical Requirements
- [ ] Requirement 1
- [ ] Requirement 2

### Technical Approach
[Details]

### Files to Modify
| File | Action | Description |
|------|--------|-------------|

### Dependencies
- Item 1

### Risk Areas
| Risk | Mitigation |
|------|------------|

### Deferred to v2
- Item 1

### Open Questions
[If not empty, plan is NOT APPROVED]
\`\`\`

---

## EXECUTION SUPPORT

### When Stuck (QoE: Invite the Resistant Part)
| Blocker Type | Question |
|--------------|----------|
| Technical | "What specific info am I missing?" |
| Motivation | "Can I make this smaller?" |
| Fear | "What's the smallest safe step?" |

### Good Stopping Points (QoE: Stop at the Peak)
| Stop Now ✅ | Keep Going ⏳ |
|-------------|---------------|
| Know what's next | Unsure what's next |
| Energy high | Energy draining |
| Tests pass | Tests failing |

**Stopping ritual:** Write next step → Leave breadcrumb → Commit → Rate eagerness

---

## FORBIDDEN
- Saying "looks good" without completing review rounds
- Skipping phases for LARGE tasks
- Proceeding with open questions
- Assuming requirements without clarification
- Stopping mid-thought with no notes

---

## QoE PRINCIPLES EMBEDDED

| Phase | Principle |
|-------|-----------|
| Discovery | Find the living question, The offer |
| Scoping | Make it smaller |
| Draft | Allow ugliness |
| Review | Decrease effort, increase attention |
| Validation | Follow irritation |
| Execution | Stop at the peak, Invite resistant part |`,
  },

  // =============================================================================
  // PROCESS & ENGAGEMENT (QoE-Aligned)
  // =============================================================================
  {
    id: 'unblock-task',
    title: 'Get Unstuck on Task',
    description: 'Find what\'s blocking progress. QoE: Invite the resistant part.',
    category: 'planning',
    variables: ['TASK'],
    tags: ['unblock', 'stuck', 'qoe', 'resistance'],
    prompt: `I'm stuck on: {TASK}

## QoE Principle: Invite the Resistant Part

Resistance holds information. Don't override it—ask what it needs.

## Diagnostic Questions

1. **What's actually blocking?**
   - Technical blocker? (missing info, unclear API)
   - Motivation blocker? (boring, overwhelming, unclear purpose)
   - Fear blocker? (might break things, looks hard)

2. **What am I avoiding?**
   - What part of this task do I keep not doing?
   - What would I do if I "had to" finish in 10 minutes?

3. **Can we make scope smaller?** (QoE: Make it smaller)
   - What's the smallest useful increment?
   - What can I delete from requirements?

4. **What would "ugly but working" look like?** (QoE: Allow ugliness)
   - Skip validation, skip edge cases
   - Hardcode values
   - Copy-paste instead of abstract

## Output Format

| Blocker Type | Specific Block | Smallest Next Step |
|--------------|----------------|-------------------|
| [technical/motivation/fear] | [what exactly] | [5-minute task] |

OUTPUT: One small next step, NOT a full solution.`,
  },
  {
    id: 'draft-ugly',
    title: 'Create Ugly First Draft',
    description: 'Permission to write bad code first. QoE: Allow ugliness.',
    category: 'components',
    variables: ['COMPONENT'],
    tags: ['draft', 'ugly', 'qoe', 'iteration'],
    prompt: `Create ugly first draft of {COMPONENT}.

## QoE Principle: Allow Ugliness

> "Give permission to fail, be messy, be wrong. The need to be good kills curiosity."

## Rules for Ugly Draft

1. **No abstractions** - Inline everything
2. **Hardcode values** - Magic numbers are fine
3. **Skip edge cases** - Happy path only
4. **Copy-paste allowed** - Don't DRY yet
5. **No comments needed** - Code explains itself later
6. **Skip tests** - Verify manually

## What Makes This Different

| Normal Prompt | Ugly Draft |
|---------------|------------|
| MCP duplicate check | Skip it |
| Semantic tokens | Hardcode colors |
| CVA variants | Inline className |
| TypeScript strict | \`any\` is fine |
| Error handling | Let it crash |

## The Deal

After ugly draft works:
1. Show it working (screenshot/demo)
2. THEN refactor with proper patterns
3. THEN run \`component-stabilize\` prompt

## FORBIDDEN
- Perfectionism
- "But we should..."
- Premature optimization
- Checking if pattern exists

OUTPUT: Working ugly code. Refactor comes LATER.`,
  },
  {
    id: 'stop-at-peak',
    title: 'Find Good Stopping Point',
    description: 'Leave knowing what\'s next. QoE: Stop at the peak.',
    category: 'planning',
    tags: ['stopping', 'peak', 'qoe', 'energy'],
    prompt: `Find a good stopping point for current work.

## QoE Principle: Stop at the Peak

> "Stop when you know what comes next (Hemingway). Don't drain the well completely."

## Signs You Should Stop

| Stop Now | Keep Going |
|----------|------------|
| You know exactly what's next | You're unsure what's next |
| Energy is still high | Energy is draining |
| Code is in working state | Code is broken |
| Tests pass | Tests failing |
| Clean commit possible | Uncommittable state |

## Stopping Ritual

1. **Write down next step** (specific, not vague)
   \`\`\`
   NEXT: Implement error handling for API timeout case
   NOT: Continue working on error handling
   \`\`\`

2. **Leave a breadcrumb** (comment in code)
   \`\`\`tsx
   // TODO(next-session): Add retry logic here
   // Context: API sometimes times out, need exponential backoff
   \`\`\`

3. **Commit current state**
   - Even if incomplete
   - Mark as WIP if needed

4. **Rate your return eagerness**
   - 😊 Eager to return = good stop
   - 😐 Neutral = okay stop
   - 😫 Dreading return = stopped too late

## FORBIDDEN
- Stopping mid-thought with no notes
- "I'll remember where I was"
- Leaving broken/uncommittable code
- Working until exhausted

OUTPUT: Clear next step written down, code in committable state.`,
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
    tags: ['review', 'compliance', 'quality', 'mcp', 'wu-wei', 'maya', 'qoe'],
    prompt: `Review {FILE_PATH} for DDS compliance.

## Philosophy Triad Check (report violations)

| Philosophy | Check For | Violation Signal |
|------------|-----------|------------------|
| **Wu Wei** | Over-engineering, fighting patterns | Premature abstraction, ignoring existing utilities |
| **MAYA** | User confusion, broken conventions | Novel interactions where familiar ones work |
| **QoE** | Scope creep, forced solutions | Complexity growing unexpectedly, hacks over investigation |

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
    tags: ['review', 'pr', 'checklist', 'mcp', 'wu-wei', 'maya', 'qoe'],
    prompt: `Run pre-PR validation for my changes.

## Philosophy Triad Final Check

Before approving, verify NO violations:
- **Wu Wei**: Is code simple? Working WITH codebase? No premature abstractions?
- **MAYA**: Will users immediately understand? Familiar patterns used?
- **QoE**: Was scope appropriate? Clean completion point? No forced solutions?

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
    tags: ['review', 'clean-code', 'refactoring', 'quality', 'wu-wei'],
    prompt: `Review {FILE_PATH} against Uncle Bob's clean code principles.

## Wu Wei Mindset
- Simple over clever: complexity is a code smell
- Delete > add: if in doubt, remove it
- Work WITH patterns: don't fight the codebase structure

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
    tags: ['refactoring', 'clean-code', 'architecture', 'wu-wei', 'qoe'],
    prompt: `Create a refactoring plan for {FILE_PATH}.

## Wu Wei + QoE Mindset
- **Make it smaller**: Plan extraction in small, safe steps
- **Trust the flow**: Work with existing patterns, not against them
- **Stop at coherent points**: Each extraction should be independently mergeable
- **Allow ugliness**: First extraction can be rough—polish after it works

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
  {
    id: 'testing-attributes-add',
    title: 'Add Foundation Testing Attributes',
    description: 'Add data-testid attributes to components following DDS three-layer testing strategy.',
    category: 'testing',
    variables: ['COMPONENT'],
    tags: ['testing', 'testid', 'automation', 'quality'],
    prompt: `Add data-testid attributes to {COMPONENT}.

READ FIRST: \`.claude/testing-quick-ref.md\`
REFERENCE: \`src/flow/components/entity-templates/dialogs/ViewTemplateDialog.tsx\` (gold standard)

## Layer Strategy

| Layer | Strategy | testId Source |
|-------|----------|---------------|
| ATOM | Pass-through props | Consumer provides |
| MOLECULE | Auto-generate | \`{feature}-{element}-\${id}\` |
| PAGE | Named regions | \`{page}-{section}\` |

## Naming Convention

Format: \`{context}-{component}-{identifier}\`

Examples:
- \`tenant-wizard-company-input\`
- \`pricing-step-package-selector\`
- \`view-template-close-\${template.id}\`

## MUST Have testId

- Form inputs (input, select, checkbox)
- Buttons (submit, cancel, navigation)
- Interactive elements (clickable cards, tabs)
- Container sections (for scoping)
- Dynamic items (cards, rows with IDs)

## JSDoc Template

\`\`\`tsx
/**
 * @component MOLECULE
 * @testId Auto-generated: \`{feature}-{element}-\${id}\`
 *
 * Test IDs:
 * - \`{feature}-container-\${id}\` - Root
 * - \`{feature}-{element}-\${id}\` - Each interactive element
 */
\`\`\`

## FORBIDDEN

- Generic: \`data-testid="button"\`
- Index-only: \`data-testid="item-0"\`
- CamelCase: \`data-testid="submitButton"\`
- Skipping form inputs or action buttons

OUTPUT: Component with testIds + JSDoc documentation.`,
  },
  {
    id: 'testing-unit-create',
    title: 'Create Unit Tests for Component',
    description: 'Create unit tests for component utilities, transformations, and pure functions.',
    category: 'testing',
    variables: ['COMPONENT_OR_FEATURE'],
    tags: ['testing', 'unit', 'vitest', 'quality'],
    prompt: `Create unit tests for {COMPONENT_OR_FEATURE}.

## DDS Testing Ownership

DDS owns: Unit, Interaction, E2E, Visual Regression
Consumer owns: Integration (API + routing)

READ FIRST: \`.claude/testing-quick-ref.md\`

## What to Test (Unit Tests)

| Test | Example |
|------|---------|
| Pure transformations | \`formData → API\`, \`API → formData\` |
| Constants/mappings | Enum lookups, config objects |
| Utility functions | Formatters, validators, calculators |
| NO React dependencies | Test in Node environment |

## File Location

\`\`\`
src/components/{feature}/__tests__/
├── {feature}.utils.test.ts      # Transformation tests
├── {feature}.constants.test.ts  # Mapping tests
└── hooks/
    └── use{Feature}.test.ts     # Hook logic tests (if pure)
\`\`\`

## Test Pattern

\`\`\`typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { transformToApiRequest, transformFromApiResponse } from '../{feature}.utils'

describe('{featureName} transformations', () => {
  describe('transformToApiRequest', () => {
    it('should map form fields to API format', () => {
      const input = { companyName: 'Acme Corp', tier: 'pro' }
      const result = transformToApiRequest(input)

      expect(result.company_name).toBe('Acme Corp')
      expect(result.pricing_tier).toBe('professional')
    })

    it('should handle empty optional fields', () => {
      const input = { companyName: 'Acme Corp' }
      const result = transformToApiRequest(input)

      expect(result.pricing_tier).toBeUndefined()
    })
  })
})
\`\`\`

## Run Commands

\`\`\`bash
npm run test:unit           # Watch mode
npm run test:unit:run       # Single run
npm run test:unit -- {file} # Specific file
\`\`\`

## FORBIDDEN

- Testing React rendering (use interaction tests)
- Testing API calls (use integration tests)
- Mocking too much (test real logic)
- Testing implementation details (test behavior)

OUTPUT: Test file(s) following DDS pattern with describe blocks.`,
  },
  {
    id: 'testing-interaction-create',
    title: 'Create Storybook Interaction Tests',
    description: 'Create Storybook play() function tests for user flows and interactions.',
    category: 'testing',
    variables: ['STORY_OR_COMPONENT'],
    tags: ['testing', 'storybook', 'interaction', 'play', 'quality'],
    prompt: `Create Storybook interaction tests for {STORY_OR_COMPONENT}.

## DDS Testing Ownership

DDS owns: Unit, Interaction, E2E, Visual Regression
Consumer owns: Integration (API + routing)

READ FIRST: \`.claude/testing-quick-ref.md\`

## What to Test (Interaction Tests)

| Test | Example |
|------|---------|
| User flows | Click button → dialog opens |
| Form interactions | Type → validate → submit |
| State changes | Tab switch, filter select |
| Error states | Invalid input → error message |

## Import Pattern

\`\`\`typescript
import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect, waitFor } from 'storybook/test'
\`\`\`

## Test Pattern

\`\`\`typescript
export const HappyPath: Story = {
  args: { /* initial state */ },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for async elements (ALWAYS use findBy for initial queries)
    const input = await canvas.findByTestId('company-info-company-name')

    // Interact with elements
    await userEvent.clear(input)
    await userEvent.type(input, 'Acme Corp')

    // Click actions
    await userEvent.click(canvas.getByTestId('wizard-nav-next'))

    // Assert state changes
    await expect(canvas.getByTestId('contact-billing-step')).toBeVisible()
  },
}

export const ValidationError: Story = {
  args: { /* state that triggers validation */ },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Submit without required field
    await userEvent.click(await canvas.findByTestId('form-submit'))

    // Expect error message
    await waitFor(() => {
      expect(canvas.getByText(/required/i)).toBeVisible()
    })
  },
}
\`\`\`

## Query Priority

| Priority | Method | Use When |
|----------|--------|----------|
| 1 | \`findByTestId\` | Initial async queries |
| 2 | \`getByRole\` | Accessible elements |
| 3 | \`getByLabelText\` | Form fields |
| 4 | \`getByText\` | Visible text |
| 5 | \`getByTestId\` | Sync queries |

## Run Commands

\`\`\`bash
npm run test:storybook      # Watch mode (browser)
npm run test:storybook:run  # Single run
\`\`\`

## FORBIDDEN

- Using \`getBy\` for elements that load async (use \`findBy\`)
- Testing API responses (use mocks in story args)
- Skipping \`await\` on userEvent calls
- Hard-coded waits (\`sleep\`) instead of \`waitFor\`

OUTPUT: Story with play() function following DDS interaction pattern.`,
  },
  {
    id: 'testing-coverage-audit',
    title: 'Audit Testing Coverage',
    description: 'Audit test coverage for a component: testId attributes, unit tests, and interaction tests.',
    category: 'testing',
    variables: ['COMPONENT_OR_FEATURE'],
    tags: ['testing', 'audit', 'coverage', 'quality'],
    prompt: `Audit testing coverage for {COMPONENT_OR_FEATURE}.

## DDS Testing Ownership

| Owner | Test Type |
|-------|-----------|
| **DDS** | Unit, Interaction, E2E, Visual Regression |
| **Consumer** | Integration (API + routing) |

READ FIRST: \`.claude/testing-quick-ref.md\`

## Audit Checklist

### 1. testId Coverage

Check for data-testid on:
- [ ] All form inputs (input, select, checkbox)
- [ ] All action buttons (submit, cancel, close)
- [ ] Navigation controls (next, back, tabs)
- [ ] Interactive cards/rows with entity IDs
- [ ] Container sections (for test scoping)

Naming convention: \`{context}-{component}-{identifier}\`

### 2. Unit Test Coverage

Check for \`__tests__/\` directory with:
- [ ] Transformation functions (\`.utils.test.ts\`)
- [ ] Constants/mappings (\`.constants.test.ts\`)
- [ ] Custom hooks logic (\`use*.test.ts\`)

### 3. Interaction Test Coverage

Check story files for \`play()\` functions:
- [ ] Happy path flow
- [ ] Validation errors
- [ ] Edge cases (empty, loading, error states)
- [ ] User interactions (clicks, typing, selections)

## Output Format

\`\`\`
## Testing Coverage Audit: {COMPONENT_OR_FEATURE}

### testId Coverage: [X/Y] items
| Element | Has testId | testId Value |
|---------|------------|--------------|
| Submit button | ✅ | form-submit |
| Company input | ❌ | MISSING |

### Unit Test Coverage: [X/Y] functions
| Function | Has Test | File |
|----------|----------|------|
| transformToApi | ✅ | utils.test.ts |
| validateForm | ❌ | MISSING |

### Interaction Test Coverage: [X/Y] stories
| Story | Has play() | Tests |
|-------|------------|-------|
| Default | ✅ | Basic render |
| HappyPath | ❌ | MISSING |

### Recommendations
1. Add testId to: [list]
2. Add unit test for: [list]
3. Add interaction test for: [list]
\`\`\`

## FORBIDDEN

- Marking coverage as "good enough" without checking all items
- Skipping testId audit (consumers depend on these)
- Ignoring error/edge case stories

OUTPUT: Coverage audit report with specific recommendations.`,
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
    tags: ['depth', 'elevation', 'shadows', 'layering', 'maya'],
    prompt: `Apply depth layering rules to {COMPONENT}.

## MAYA Mindset
- Depth conveys meaning—users expect "closer = more prominent"
- Consistent shadows create familiar spatial understanding
- Modern visuals through subtle elevation, stable interaction through clear hierarchy

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
    tags: ['spacing', 'layout', 'tokens', 'maya'],
    prompt: `Apply spacing rules to {COMPONENT}.

## MAYA Mindset
- Consistent spacing creates rhythm—users feel "this is organized"
- Related elements close together, separate things farther apart
- Modern refinement through precise spacing, familiar layout patterns

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
    tags: ['typography', 'fonts', 'text', 'maya'],
    prompt: `Apply typography rules to {COMPONENT}.

## MAYA Mindset
- Clear hierarchy helps users scan—biggest = most important
- Consistent font creates professionalism users expect
- Modern type refinement, familiar reading patterns

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
    tags: ['colors', 'tokens', 'semantic', 'mcp', 'maya'],
    prompt: `Apply semantic color rules to {COMPONENT}.

## MAYA Mindset
- Semantic colors convey meaning—red = error, green = success, users already know
- Consistent token usage creates visual language users recognize
- Modern color palette, familiar meaning conventions

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
    tags: ['ux', 'usability', 'laws', 'maya'],
    prompt: `Apply UX laws to {COMPONENT}.

## MAYA Mindset (Core of UX)
- These laws ARE MAYA in practice—they ensure users immediately understand
- Familiar patterns (44px targets, 7±2 items) leverage learned behavior
- Modern visuals, stable interactions: look fresh but work exactly as expected

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
    tags: ['accessibility', 'a11y', 'semantic', 'mcp', 'maya'],
    prompt: `Fix accessibility in {COMPONENT}.

## MAYA Mindset
- Semantic HTML uses browser conventions users already know
- Screen reader expectations are established patterns—respect them
- Accessible = familiar to assistive technology users

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

## Step 1: Understand User Context (MAYA Principle)

Before deciding strategy, ask:
- Who uses this on mobile? What's their task?
- What's the *minimum viable mobile experience*?
- Can we simplify rather than block?

## Step 2: Choose Strategy

| UI Type | Strategy | Mobile Experience |
|---------|----------|-------------------|
| Lists, cards, content | Mobile-first | Full functionality |
| Dashboards, tables | Tablet-first | Simplified card view |
| Complex forms | Progressive | Core fields mobile, advanced desktop |
| Drag-and-drop | Desktop-enhanced | Alternative interaction on mobile |

**MAYA reminder:** "Desktop Required" is a last resort, not a default. Most users expect *some* mobile functionality. Anchor to familiar mobile patterns (swipe, tap-to-expand) before blocking.

## Step 3: Implement Pattern

### Mobile-First (default)
\`\`\`tsx
<div className="px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
\`\`\`

### Progressive Enhancement (complex UIs)
\`\`\`tsx
// Mobile: essential features
<div className="lg:hidden">
  <SimplifiedView data={data} />
  <p className="text-muted text-xs mt-2">More options on larger screens</p>
</div>
// Desktop: full features
<div className="hidden lg:block">
  <FullEditor data={data} />
</div>
\`\`\`

### Truly Desktop-Only (validate first!)
Only use if you've confirmed:
- [ ] Mobile users don't need this task
- [ ] No simplified alternative exists
- [ ] Users understand why (clear messaging)

## Breakpoints
| Prefix | Width | Use |
|--------|-------|-----|
| (none) | 0+ | Base mobile |
| \`sm:\` | 640px | Large phones |
| \`md:\` | 768px | Tablets |
| \`lg:\` | 1024px | Laptops |

## Universal Requirements
- Touch targets ≥44px
- Text ≥16px (prevents iOS zoom)
- No horizontal scroll

OUTPUT:
1. Strategy with user-context justification
2. Responsive component with progressive enhancement`,
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
  {
    id: 'mcp-sync-audit',
    title: 'Audit & Sync MCP Server Data',
    description: 'Audit MCP server data files for drift and sync with actual codebase.',
    category: 'mcp',
    variables: [],
    tags: ['mcp', 'sync', 'audit', 'maintenance', 'drift'],
    prompt: `Audit MCP server data for drift from actual codebase.

## MCP Data Architecture

The MCP server reads from these data files:

| File | Content | Location |
|------|---------|----------|
| \`agent-context.json\` | Component registry, tokens, philosophy | \`.claude/\` |
| \`color-matrix.json\` | Color categories and rules | \`.claude/\` |
| \`contrast-matrix.json\` | WCAG contrast data | \`.claude/\` |
| \`color-intelligence.json\` | Color harmony, contexts | \`src/data/\` |

## Step 1: Component Registry Drift Check

\`\`\`bash
# Count actual components (no stories)
ls src/components/ui/*.tsx | grep -v stories | wc -l

# Count registered components
cat .claude/agent-context.json | jq '.components.registry.ui | keys | length'

# List unregistered components
ls src/components/ui/*.tsx | grep -v stories | xargs -I{} basename {} .tsx | sort > /tmp/actual.txt
cat .claude/agent-context.json | jq -r '.components.registry.ui | keys[]' | sort > /tmp/registered.txt
comm -23 /tmp/actual.txt /tmp/registered.txt
\`\`\`

## Step 2: For Each Unregistered Component

Read the component file and extract:
1. **Type**: Look for ATOM/MOLECULE/ORGANISM in JSDoc
2. **Status**: Look for @status tag or STABILIZED/FROZEN/TODO
3. **Variants**: Look for CVA variants or union types
4. **Subs**: Look for compound component pattern (ComponentName.Sub)
5. **Features**: Key capabilities from JSDoc

Template for new component entry:
\`\`\`json
"{ComponentName}": {
  "path": "ui/{filename}.tsx",
  "type": "ATOM|MOLECULE|ORGANISM",
  "status": "TODO|STABILIZED|FROZEN",
  "testId": "TODO|ready|N/A",
  "variants": ["variant1", "variant2"],
  "subs": ["Sub1", "Sub2"],
  "features": ["feature1", "feature2"],
  "for": "Brief description of use case"
}
\`\`\`

## Step 3: Add to agent-context.json

Location: \`.claude/agent-context.json\` → \`components.registry.ui\`

\`\`\`bash
# After manual edits, validate
npm run health  # Runs all validators
\`\`\`

## Step 4: Color Data Sync

\`\`\`bash
# Regenerate color matrix from tokens
npm run sync:colors

# Regenerate contrast matrix
npm run sync:colors  # Same command

# Regenerate color intelligence types
npm run sync:color-intelligence
\`\`\`

## Step 5: Full Sync

\`\`\`bash
# Sync everything
npm run sync:all

# Validate
npm run health
\`\`\`

## Sync Scripts Reference

| Command | What It Syncs |
|---------|---------------|
| \`npm run sync-components\` | Component status from JSDoc (UPDATE only) |
| \`npm run sync:colors\` | Color matrix + contrast matrix |
| \`npm run sync:color-intelligence\` | color-intelligence.toon + types |
| \`npm run sync:prompts\` | Prompt library → skill files |
| \`npm run sync:all\` | All of the above |

## KNOWN LIMITATION

⚠️ \`sync-components\` only UPDATES existing entries - it does NOT add new components.
New components must be manually added to \`.claude/agent-context.json\`.

## Drift Prevention Checklist

When adding a new component:
- [ ] Create component file in \`src/components/ui/\`
- [ ] Add JSDoc with @component type and @status
- [ ] **MANUALLY** add entry to \`.claude/agent-context.json\`
- [ ] Run \`npm run sync-components\` to sync status
- [ ] Run \`npm run health\` to validate

## Expected Coverage

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Registry coverage | >90% | 70-90% | <70% |
| Status accuracy | 100% | >95% | <95% |
| Last sync | <7 days | 7-14 days | >14 days |

OUTPUT: Drift report + sync actions taken.`,
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

READ FIRST: \`src/stories/developers/AdapterPatterns.mdx\` (contains full examples)

## When to Use Adapters vs Wrappers

| Pattern | Use When |
|---------|----------|
| **Adapter Function** | Pure data transformation (types, formats) |
| **Wrapper Component** | Need to add behavior, state, or context |
| **Render Props** | Consumer needs granular control |
| **Composition** | Building complex UI from DDS primitives |

## Key Principles (details in MDX)
1. Type-safe exhaustive mapping
2. Safe fallbacks for unknown values
3. Keep adapters pure (no side effects)

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

READ FIRST: \`src/stories/developers/AdapterPatterns.mdx\` (contains full examples)

## Benefits of Wrapper Pattern

| Benefit | Example |
|---------|---------|
| **Isolation** | Single import point for DDS |
| **Custom behavior** | Analytics, permissions, logging |
| **Default props** | Consistent sizing across app |
| **Migration ease** | Swap underlying component in one place |

## Three-Layer Integration
\`\`\`
App Pages → App Wrappers → DDS Components
(features never import DDS directly)
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

  // =============================================================================
  // META: PROMPT CREATION
  // =============================================================================
  {
    id: 'prompt-create',
    title: 'Create New DDS Prompt',
    description: 'Generate a new prompt following DDS prompt library patterns and conventions.',
    category: 'documentation',
    variables: ['PROMPT_PURPOSE', 'CATEGORY'],
    tags: ['prompt', 'meta', 'documentation', 'template'],
    prompt: `Create a new DDS prompt for: {PROMPT_PURPOSE}
Category: {CATEGORY}

## STEP 1: Analyze Purpose & Category

Determine appropriate category from existing options:
| Category | Use When |
|----------|----------|
| \`stories\` | Storybook story generation |
| \`components\` | Creating/modifying UI components |
| \`tokens\` | Adding/auditing design tokens |
| \`documentation\` | MDX docs, CLAUDE.md updates |
| \`planning\` | Feature planning, architecture decisions |
| \`review\` | Code review, compliance checks |
| \`styling\` | CSS, colors, spacing, typography |
| \`responsive\` | Mobile-first, breakpoints |
| \`icons\` | Icon usage, emoji replacement |
| \`ux\` | UX laws, accessibility |
| \`mcp\` | MCP tool usage, contrast checks |
| \`delivery\` | Build, packaging, local dev |

## STEP 2: Check for Existing Prompts

Before creating, search for similar prompts:
\`\`\`bash
grep -i "{PROMPT_PURPOSE}" src/components/shared/PromptLibrary/prompts.ts
\`\`\`

## STEP 3: Design Prompt Structure

Every DDS prompt follows this pattern:

### 3.1 Header Section
\`\`\`typescript
{
  id: 'kebab-case-id',           // Unique, descriptive
  title: 'Human Readable Title',  // Action-oriented (verb first)
  description: 'One-line purpose statement.',
  category: '{CATEGORY}',
  variables: ['VAR1', 'VAR2'],    // SCREAMING_SNAKE, use {VAR} in prompt
  tags: ['relevant', 'keywords'], // For search/filtering
  prompt: \`...\`
}
\`\`\`

### 3.2 Prompt Body Structure

\`\`\`markdown
[One-line task statement with {VARIABLES}]

## PRE-FLIGHT (if MCP tools needed)
\\\`\\\`\\\`
mcp__dds__[relevant_tool]({ param: "value" })
\\\`\\\`\\\`

READ FIRST: [list applicable .claude/*.md rule files here]

## REQUIREMENTS (numbered list)
1. Specific requirement
2. Another requirement
3. Reference to DDS patterns

## PROCESS (if multi-step)
### Step 1: Action
Description

### Step 2: Action
Description

## FORBIDDEN (bullet list)
- Anti-pattern 1
- Anti-pattern 2
- Common mistake to avoid

## OUTPUT
[Describe expected deliverable format]
\`\`\`

## STEP 4: Include MCP Tools Where Relevant

| Task Type | MCP Tools to Include |
|-----------|---------------------|
| Components | \`search_components\`, \`get_component\`, \`check_contrast\` |
| Colors | \`check_contrast\`, \`get_accessible_colors\`, \`check_token_usage\` |
| Tokens | \`get_design_tokens\`, \`list_color_tokens\`, \`check_token_usage\` |
| Dark backgrounds | \`check_contrast\`, \`get_accessible_colors\` (MANDATORY) |
| Review | \`check_token_usage\`, \`get_color_guidance\` |

## STEP 5: Reference Relevant Rule Files

| Topic | Rule File |
|-------|-----------|
| Components | \`.claude/component-dev-rules.md\` |
| Clean code | \`.claude/clean-code-rules.md\` |
| UX | \`.claude/ux-laws-rules.md\` |
| Colors/tokens | \`.claude/css-styling-rules.md\` |
| Dark mode | \`.claude/dark-mode-mapping-rules.md\` |
| Spacing | \`.claude/spacing-rules.md\` |
| Typography | \`.claude/typography-rules.md\` |
| Icons | \`.claude/iconography-rules.md\` |
| Stories | \`.claude/storybook-rules.md\` |
| Depth/elevation | \`.claude/depth-layering-rules.md\` |

## REQUIREMENTS

1. **Variables** - Use \`{SCREAMING_SNAKE}\` for placeholders
2. **MCP-First** - Include MCP tools for any color/token/component work
3. **Rule References** - Link to relevant .claude/*.md files
4. **Clear Output** - Specify exact deliverable format
5. **Forbidden Section** - List common anti-patterns to avoid
6. **Terse Language** - Agent-optimized, not human prose
7. **Tables** - Use tables for lookups, mappings, options
8. **Code Examples** - Show ✅ correct and ❌ incorrect patterns

## FORBIDDEN

- Creating prompts without checking for existing similar ones
- Vague output descriptions ("make it good")
- Missing MCP tools for color/contrast operations
- Human-style prose (keep it agent-scannable)
- Hardcoded file paths that may change
- Assuming context without variables

## OUTPUT FORMAT

Generate TypeScript object to add to \`src/components/shared/PromptLibrary/prompts.ts\`:

\`\`\`typescript
{
  id: '[kebab-case-id]',
  title: '[Title]',
  description: '[One-line description]',
  category: '[category]',
  variables: ['VAR1', 'VAR2'],
  tags: ['tag1', 'tag2', 'tag3'],
  prompt: \\\`[Full prompt content with {VARIABLES}]

## PRE-FLIGHT
[MCP calls if needed]

READ FIRST: [Rule files]

## REQUIREMENTS
[Numbered list]

## FORBIDDEN
[Bullet list]

## OUTPUT
[Expected deliverable]\\\`,
},
\`\`\`

After adding, run:
\`\`\`bash
npm run sync:prompts      # Generate skill file
npm run validate:prompts  # Verify paths exist
\`\`\``,
  },
]
