# Add Foundation Testing Attributes



**Category:** testing | **Tags:** testing, testid, automation, quality
**Variables:** `{COMPONENT}`
**Read first:** `.claude/testing-quick-ref.md`

---

Add data-testid attributes to {COMPONENT}.

READ FIRST: `.claude/testing-quick-ref.md`
REFERENCE: `src/flow/components/entity-templates/dialogs/ViewTemplateDialog.tsx` (gold standard)

## Layer Strategy

| Layer | Strategy | testId Source |
|-------|----------|---------------|
| ATOM | Pass-through props | Consumer provides |
| MOLECULE | Auto-generate | `{feature}-{element}-\${id}` |
| PAGE | Named regions | `{page}-{section}` |

## Naming Convention

Format: `{context}-{component}-{identifier}`

Examples:
- `tenant-wizard-company-input`
- `pricing-step-package-selector`
- `view-template-close-\${template.id}`

## MUST Have testId

- Form inputs (input, select, checkbox)
- Buttons (submit, cancel, navigation)
- Interactive elements (clickable cards, tabs)
- Container sections (for scoping)
- Dynamic items (cards, rows with IDs)

## JSDoc Template

```tsx
/**
 * @component MOLECULE
 * @testId Auto-generated: `{feature}-{element}-\${id}`
 *
 * Test IDs:
 * - `{feature}-container-\${id}` - Root
 * - `{feature}-{element}-\${id}` - Each interactive element
 */
```

## FORBIDDEN

- Generic: `data-testid="button"`
- Index-only: `data-testid="item-0"`
- CamelCase: `data-testid="submitButton"`
- Skipping form inputs or action buttons

OUTPUT: Component with testIds + JSDoc documentation.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
