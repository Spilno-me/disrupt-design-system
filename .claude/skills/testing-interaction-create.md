# Create Storybook Interaction Tests



**Category:** testing | **Tags:** testing, storybook, interaction, play, quality
**Variables:** `{STORY_OR_COMPONENT}`
**Read first:** `.claude/testing-quick-ref.md`

---

Create Storybook interaction tests for {STORY_OR_COMPONENT}.

## DDS Testing Ownership

DDS owns: Unit, Interaction, E2E, Visual Regression
Consumer owns: Integration (API + routing)

READ FIRST: `.claude/testing-quick-ref.md`

## What to Test (Interaction Tests)

| Test | Example |
|------|---------|
| User flows | Click button → dialog opens |
| Form interactions | Type → validate → submit |
| State changes | Tab switch, filter select |
| Error states | Invalid input → error message |

## Import Pattern

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect, waitFor } from 'storybook/test'
```

## Test Pattern

```typescript
export const HappyPath: Story = {
  args: { /* initial state */ },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for async elements (ALWAYS use findBy for initial queries)
    const input = await canvas.findByTestId('company-info-company-name')

    // Interact with elements
    await userEvent.clear(input)
    await userEvent.type(input, 'Acme Corp')

    // Click actions
    await userEvent.click(canvas.getByTestId('wizard-nav-next'))

    // Assert state changes
    await expect(canvas.getByTestId('contact-billing-step')).toBeVisible()
  },
}

export const ValidationError: Story = {
  args: { /* state that triggers validation */ },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Submit without required field
    await userEvent.click(await canvas.findByTestId('form-submit'))

    // Expect error message
    await waitFor(() => {
      expect(canvas.getByText(/required/i)).toBeVisible()
    })
  },
}
```

## Query Priority

| Priority | Method | Use When |
|----------|--------|----------|
| 1 | `findByTestId` | Initial async queries |
| 2 | `getByRole` | Accessible elements |
| 3 | `getByLabelText` | Form fields |
| 4 | `getByText` | Visible text |
| 5 | `getByTestId` | Sync queries |

## Run Commands

```bash
npm run test:storybook      # Watch mode (browser)
npm run test:storybook:run  # Single run
```

## FORBIDDEN

- Using `getBy` for elements that load async (use `findBy`)
- Testing API responses (use mocks in story args)
- Skipping `await` on userEvent calls
- Hard-coded waits (`sleep`) instead of `waitFor`

OUTPUT: Story with play() function following DDS interaction pattern.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
