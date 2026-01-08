# DDS Testing Quick Reference

**DDS owns UI testing per Q4-Testing FAQ: Unit, Interaction, E2E, Visual Regression**

## Testing Ownership Model

| Owner | Test Type | What's Tested |
|-------|-----------|---------------|
| **DDS** | Unit | Pure functions, transformations, utilities |
| **DDS** | Interaction | User flows via Storybook play() functions |
| **DDS** | Visual Regression | Chromatic snapshot testing |
| **Consumer** | Integration | API + routing with real backend |

## Running Tests

```bash
npm run test              # All tests (unit + storybook)
npm run test:unit         # Unit tests only (fast, node-based)
npm run test:unit:run     # Unit tests one-time run
npm run test:storybook    # Storybook interaction tests (browser)
npm run test:storybook:run # Storybook tests one-time run
```

## Unit Tests

**Location:** `src/components/{feature}/__tests__/`

**What to test:**
- Pure transformation functions (formData → API, API → formData)
- Constants and mappings
- Utility functions with no React dependencies

**Pattern:**
```ts
// src/components/provisioning/__tests__/tenant-provisioning.utils.test.ts
import { describe, it, expect } from 'vitest'
import { transformToApiRequest } from '../tenant-provisioning.utils'

describe('transformToApiRequest', () => {
  it('should map form fields to API format', () => {
    const result = transformToApiRequest(mockFormData)
    expect(result.pricingTier).toBe('professional')
  })
})
```

## Interaction Tests (Storybook play functions)

**Location:** Story files with `play()` functions

**Import:** `import { within, userEvent, expect } from 'storybook/test'`

**Pattern:**
```tsx
// src/stories/partner/partner-portal.stories.tsx
import { within, userEvent, expect } from 'storybook/test'

export const HappyPath: Story = {
  args: { initialPage: 'tenant-provisioning' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for element
    const input = await canvas.findByTestId('company-info-company-name')

    // Interact
    await userEvent.type(input, 'Acme Corp')
    await userEvent.click(canvas.getByTestId('wizard-nav-next'))

    // Assert
    await expect(canvas.getByTestId('contact-billing-step')).toBeVisible()
  },
}
```

## data-testid Conventions

### By Layer

| Layer | Strategy | Example |
|-------|----------|---------|
| **Atom** | Consumer provides | `<Button data-testid="login-submit">` |
| **Molecule** | Auto-generate | `lead-card-${lead.id}` |
| **Wizard Step** | Named sections | `company-info-step`, `pricing-step` |
| **Form Field** | `{step}-{field}` | `company-info-company-name` |
| **Navigation** | `wizard-nav-{action}` | `wizard-nav-next`, `wizard-nav-back` |

### Naming Convention

```
{context}-{component}-{identifier}
```

Examples:
- `company-info-company-name` - Company info step, company name field
- `wizard-nav-next` - Wizard navigation, next button
- `review-pay-terms-checkbox` - Review step, terms checkbox

### Selectors Priority

| Do | Don't |
|----|-------|
| `getByTestId('company-info-step')` | `getByClassName('step')` |
| `getByRole('button', { name: /continue/i })` | `querySelector('.btn-primary')` |
| `findByTestId()` for async | `getByTestId()` before render |

## File Structure

```
src/components/provisioning/
├── __tests__/
│   ├── tenant-provisioning.utils.test.ts    # Transformation tests
│   ├── tenant-provisioning.constants.test.ts # Mapping tests
│   └── hooks/
│       └── usePricingData.test.ts           # Hook logic tests
├── tenant-provisioning.utils.ts
├── tenant-provisioning.constants.ts
└── hooks/
    └── usePricingData.ts
```

## JSDoc for Components

```tsx
/**
 * @component MOLECULE
 * @testId Auto-generated: `wizard-nav-{element}`
 *
 * Test IDs:
 * - `wizard-nav` - Root container
 * - `wizard-nav-cancel` - Cancel button
 * - `wizard-nav-back` - Back button
 * - `wizard-nav-next` - Next/Continue button
 * - `wizard-nav-submit` - Submit button (last step)
 */
```

## Vitest Configuration

Multi-project setup in `vitest.config.ts`:
- **unit** project: Node environment, fast, no browser
- **storybook** project: Browser (Playwright), interaction tests

## Q4-Testing SLA

| Severity | Response Time |
|----------|---------------|
| Critical (P1) | 24 hours |
| High (P2) | 3 business days |
| Medium (P3) | 1 week |
| Low (P4) | Next sprint |
