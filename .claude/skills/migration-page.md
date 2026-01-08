# Migrate Page to DDS



**Category:** delivery | **Tags:** migration, page, integration, strategy
**Variables:** `{PAGE_NAME}`

---

Migrate {PAGE_NAME} to DDS components.

READ FIRST:
- `src/stories/developers/MigrationStrategy.mdx`
- `src/stories/developers/PageImplementationGuide.mdx`

## Migration Strategy: All-or-Nothing Per Page

```
❌ DON'T: Partial migration (mixed old + DDS)
   - Inconsistent UX
   - CSS conflicts
   - Double maintenance burden

✅ DO: Complete page migration
   - Consistent experience
   - Clean codebase
   - Clear ownership
```

## Pre-Migration Audit

| Check | Command |
|-------|---------|
| Component count | `grep -c "<Button" src/pages/{PAGE_NAME}.tsx` |
| DDS equivalents | `mcp__dds__search_components({ query: "Button" })` |
| Custom styles | `grep -c "className=" src/pages/{PAGE_NAME}.tsx` |

## Migration Steps

### 1. Create Component Map
```
| Old Component | DDS Equivalent | Notes |
|---------------|----------------|-------|
| CustomButton | Button | Use variant="primary" |
| OldModal | Dialog | New API |
| LegacyTable | DataTable | Different props |
```

### 2. Create Wrapper Components (if needed)
```tsx
// Preserve existing prop interface
export function LegacyButtonWrapper(props: OldButtonProps) {
  return <Button {...adaptOldPropsToNew(props)} />
}
```

### 3. Replace in Order
1. **Layout** components first (containers, grids)
2. **Navigation** (headers, tabs)
3. **Content** components (cards, tables)
4. **Interactive** elements last (forms, modals)

### 4. Clean Up
```bash
# Remove old imports
# Delete unused old components
# Remove legacy CSS
# Update tests
```

## Validation

```bash
npm run typecheck
npm run lint
npm run build

# Visual regression (if available)
npm run test:visual
```

## Output
- Fully migrated page (no old components)
- Wrapper components if API differs
- Updated imports and tests
- No mixed styling

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
