# Create Unit Tests for Component



**Category:** testing | **Tags:** testing, unit, vitest, quality
**Variables:** `{COMPONENT_OR_FEATURE}`
**Read first:** `.claude/testing-quick-ref.md`

---

Create unit tests for {COMPONENT_OR_FEATURE}.

## DDS Testing Ownership

DDS owns: Unit, Interaction, E2E, Visual Regression
Consumer owns: Integration (API + routing)

READ FIRST: `.claude/testing-quick-ref.md`

## What to Test (Unit Tests)

| Test | Example |
|------|---------|
| Pure transformations | `formData → API`, `API → formData` |
| Constants/mappings | Enum lookups, config objects |
| Utility functions | Formatters, validators, calculators |
| NO React dependencies | Test in Node environment |

## File Location

```
src/components/{feature}/__tests__/
├── {feature}.utils.test.ts      # Transformation tests
├── {feature}.constants.test.ts  # Mapping tests
└── hooks/
    └── use{Feature}.test.ts     # Hook logic tests (if pure)
```

## Test Pattern

```typescript
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
```

## Run Commands

```bash
npm run test:unit           # Watch mode
npm run test:unit:run       # Single run
npm run test:unit -- {file} # Specific file
```

## FORBIDDEN

- Testing React rendering (use interaction tests)
- Testing API calls (use integration tests)
- Mocking too much (test real logic)
- Testing implementation details (test behavior)

OUTPUT: Test file(s) following DDS pattern with describe blocks.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
