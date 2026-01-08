# Auto-Select Prompt from Context



**Category:** planning | **Tags:** meta, router, auto-select, intelligent, entry-point, universal

---

Analyze the current conversation context and automatically select the most appropriate prompt from the DDS Prompt Library to execute.

## STEP 1: CONTEXT ANALYSIS

Extract signals from the conversation:

### 1.1 Identify Keywords
Scan for specific terms that map directly to prompts:

| Keywords Present | Maps To Prompt |
|------------------|----------------|
| "plan", "design", "architect", "how should we" | `plan-unified` |
| "quick plan", "simple plan", "tiny plan" | `plan-bulletproof` |
| "iterate plan", "review plan agents" | `plan-iterate` |
| "create component", "new component", "build a" | `component-create` |
| "write story", "storybook", "create story" | `story-full` |
| "fix color", "contrast", "hover state" | `mcp-contrast-check` |
| "dark mode", "theme" | `dark-mode-check` |
| "review", "check code", "audit" | `review-dds-compliance` |
| "add token", "new color", "new token" | `token-add-color` |
| "stabilize", "clean code", "refactor" | `component-stabilize` |
| "pre-PR", "before merge" | `review-pre-pr` |
| "create prompt", "new prompt" | `prompt-create` |
| "ux", "usability", "user experience" | `ux-apply-laws` |
| "accessibility", "a11y", "semantic html" | `a11y-semantic-html` |
| "spacing", "padding", "margin", "gap" | `styling-spacing` |
| "typography", "font", "text size" | `styling-typography` |
| "depth", "elevation", "layers", "z-index" | `styling-depth-layering` |
| "icons", "emoji", "replace emoji" | `icons-replace-emoji` |
| "responsive", "mobile", "breakpoints" | `responsive-mobile-first` |
| "package", "deliver", "export", "publish" | `delivery-package` |
| "local dev", "start dev", "development server" | `local-dev-start` |
| "end session", "finish dev", "stop dev" | `local-dev-end` |

### 1.2 Identify Intent
What is the user trying to DO?

| Intent Type | Likely Prompts |
|-------------|----------------|
| **CREATE** something new | `component-create`, `story-full`, `token-add-color` |
| **FIX** an issue | `mcp-contrast-check`, `dark-mode-check`, `review-find-violations` |
| **REVIEW** existing code | `review-dds-compliance`, `review-pre-pr`, `review-clean-code` |
| **PLAN** before building | `plan-unified`, `plan-bulletproof` |
| **IMPROVE** existing code | `component-stabilize`, `review-refactor-plan` |
| **STYLE** a component | `styling-*` prompts based on what's being styled |
| **DOCUMENT** | `docs-mdx-page`, `story-full` |

### 1.3 Identify Artifacts
What files/components are being discussed?

| Artifact Type | Relevant Prompts |
|---------------|------------------|
| .tsx component files | `component-*`, `review-*` |
| .stories.tsx files | `story-*` |
| Color/token files | `token-*`, `mcp-contrast-check` |
| .md documentation | `docs-*` |
| CSS/styling | `styling-*` |

## STEP 2: MATCH TO BEST PROMPT

Apply this priority order:

1. **Exact keyword match** → Use that prompt directly
2. **Multiple keyword matches** → Pick based on PRIMARY intent (create > fix > review > plan)
3. **Intent-only match** → Use the most specific prompt for that intent
4. **No clear match** → Default to `plan-unified` if exploratory, or ask user

## STEP 3: OUTPUT SELECTION

```
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
```

## STEP 4: EXECUTE SELECTED PROMPT

After selection, IMMEDIATELY:

1. **Read the skill file**: `.claude/skills/[prompt-id].md`
2. **Run MCP tools FIRST** if the prompt includes a PRE-FLIGHT section
3. **Follow the prompt's instructions** exactly
4. **Deliver in the prompt's OUTPUT format**

## FALLBACK RULES

**If multiple prompts could apply:**
- Task involves code changes → prefer `component-*` or `review-*` prompts
- Task is exploratory/unclear → prefer `plan-unified`
- Task mentions specific styling aspect → prefer that `styling-*` prompt
- Still ambiguous → ask: "Should I use [prompt-a] or [prompt-b]?"

**If NO prompt matches:**
1. State: "No matching prompt found. Proceeding with general approach."
2. Suggest: "Consider creating a prompt for this pattern via `prompt-create`"
3. Apply DDS philosophy triad (Wu Wei, MAYA, QoE) directly

## ANTI-PATTERNS

FORBIDDEN:
- Skipping Step 1 context analysis
- Guessing without reading the skill file
- Executing without showing the selection output
- Combining multiple prompts in one pass (execute one at a time)
- Saying "I'll use prompt X" without reading `.claude/skills/[X].md`

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
