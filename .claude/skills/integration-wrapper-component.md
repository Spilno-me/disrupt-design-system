# Create Wrapper Component



**Category:** delivery | **Tags:** integration, wrapper, encapsulation, isolation
**Variables:** `{COMPONENT}`, `{WRAPPER_NAME}`

---

Create wrapper component {WRAPPER_NAME} for {COMPONENT}.

READ FIRST: `src/stories/developers/AdapterPatterns.mdx` (contains full examples)

## Benefits of Wrapper Pattern

| Benefit | Example |
|---------|---------|
| **Isolation** | Single import point for DDS |
| **Custom behavior** | Analytics, permissions, logging |
| **Default props** | Consistent sizing across app |
| **Migration ease** | Swap underlying component in one place |

## Three-Layer Integration
```
App Pages → App Wrappers → DDS Components
(features never import DDS directly)
```

## Output
- Wrapper component with typed props
- Extends original DDS props
- Adds app-specific behavior
- Exports from `components/` barrel

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
