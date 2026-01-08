# Create Adapter Functions



**Category:** delivery | **Tags:** integration, adapter, mapping, typescript
**Variables:** `{COMPONENT}`, `{APP_DATA_TYPE}`

---

Create adapter functions to map {APP_DATA_TYPE} to {COMPONENT} props.

READ FIRST: `src/stories/developers/AdapterPatterns.mdx` (contains full examples)

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
- Adapter function(s) in `adapters/` folder
- TypeScript types for input/output
- Usage example in consuming component

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
