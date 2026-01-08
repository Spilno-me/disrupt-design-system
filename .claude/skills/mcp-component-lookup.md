# Lookup Component Metadata



**Category:** mcp | **Tags:** mcp, component, metadata, lookup
**Variables:** `{COMPONENT}`

---

Lookup metadata for {COMPONENT}.

## MCP Queries
```
// Get full component details
mcp__dds__get_component({ name: "{COMPONENT}" })

// Search for related components
mcp__dds__search_components({ query: "{COMPONENT}" })

// Find by type
mcp__dds__search_components({ type: "ATOM" })
mcp__dds__search_components({ type: "MOLECULE" })
```

## Information Retrieved
- **Status**: STABILIZED, TODO, FROZEN, DEPRECATED
- **Type**: ATOM, MOLECULE, ORGANISM, PAGE
- **Variants**: Available variant options
- **Props**: Component props and types
- **Usage**: Import path and example

## When to Use
| Scenario | MCP Tool |
|----------|----------|
| Check if component exists | `search_components` |
| Get variant options | `get_component` |
| Find similar components | `search_components` with query |
| Verify component status | `get_component` |

OUTPUT: Component metadata from MCP.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
