# Create New UI Component



**Category:** components | **Tags:** component, ui, cva, mcp, wu-wei, maya
**Variables:** `{COMPONENT}`
**Read first:** `.claude/component-dev-rules.md`, `.claude/ux-laws-rules.md`

---

Create a new UI component: {COMPONENT}

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
```
mcp__dds__search_components({ query: "{COMPONENT}" })
mcp__dds__search_components({ type: "ATOM" })  // or MOLECULE based on complexity
```

## Step 2: If similar found, get details
```
mcp__dds__get_component({ name: "SimilarComponent" })
```

## Step 3: Read rules
- `.claude/component-dev-rules.md` (especially "Duplicate Detection" section)
- `.claude/ux-laws-rules.md` for UX principles

## Step 4: For any dark backgrounds, verify contrast
```
mcp__dds__check_contrast({ background: "ABYSS[900]", foreground: "white" })
mcp__dds__get_accessible_colors({ background: "ABYSS[900]", minLevel: "AA" })
```

DUPLICATE CHECK OUTPUT (required before proceeding):
```
MCP search results: [list or "none"]
Decision: [USE_EXISTING | EXTEND_EXISTING | NEW_COMPONENT]
Reason: [brief justification]
```

REQUIREMENTS:
- Use DDS tokens only (PRIMITIVES, ALIAS, SHADOWS, RADIUS)
- CVA for variants: `class-variance-authority`
- Forward ref pattern
- data-slot attributes for compound components
- TypeScript strict
- Verify contrast with MCP before using dark backgrounds

FORBIDDEN:
- Creating component without MCP duplicate search
- Hardcoded hex colors
- Tailwind standard colors (red-500, blue-600)
- Dark backgrounds without contrast verification

OUTPUT: Component file + story file + update to index.ts exports.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
