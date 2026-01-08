# Get DDS Design Philosophy



**Category:** mcp | **Tags:** mcp, philosophy, principles, wu-wei

---

Get DDS design philosophy and principles.

## MCP Query
```
mcp__dds__get_design_philosophy()
```

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

OUTPUT: Full DDS design philosophy from MCP.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
