# Create Refactoring Plan



**Category:** review | **Tags:** refactoring, clean-code, architecture, wu-wei, qoe
**Variables:** `{FILE_PATH}`
**Read first:** `.claude/clean-code-rules.md`

---

Create a refactoring plan for {FILE_PATH}.

## Wu Wei + QoE Mindset
- **Make it smaller**: Plan extraction in small, safe steps
- **Trust the flow**: Work with existing patterns, not against them
- **Stop at coherent points**: Each extraction should be independently mergeable
- **Allow ugliness**: First extraction can be rough—polish after it works

READ FIRST: `.claude/clean-code-rules.md`

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
1. Create `component-name/utils.ts` for: [list functions]
2. Extract `SubComponentA` to `view-components/`
3. Extract `SubComponentB` to `form-components/`

## Expected Result
- Main file: ~Y lines (was X)
- New files: Z
- LOC reduction: X%

## Migration Steps
1. Step 1...
2. Step 2...

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
