# data-testid Quick Reference

**About `data-testid` implementation, NOT unit tests.**

## By Layer

| Layer | Strategy | Example |
|-------|----------|---------|
| **Atom** | Consumer provides | `<Button data-testid="login-submit">` |
| **Molecule** | Auto-generate | `lead-card-${lead.id}` |
| **Page** | Named regions | `dashboard-stats` |

## Naming: `{context}-{component}-{identifier}`

```
lead-card-123, login-submit-button, dashboard-stats-section
```

## Patterns

```tsx
// ATOM - pass through props
<Button data-testid="login-submit">Submit</Button>

// MOLECULE - auto-generate
function LeadCard({ lead, testId }: Props) {
  return (
    <div data-testid={testId || `lead-card-${lead.id}`}>
      <Badge data-testid={`lead-status-${lead.id}`} />
    </div>
  )
}

// PAGE - named regions
<main data-testid="dashboard-page">
  <section data-testid="dashboard-stats" />
</main>
```

## Selectors

| Do | Don't |
|----|-------|
| `getByTestId('lead-card-123')` | `getByClassName('lead-card')` |
| `getByRole('button', { name: /submit/i })` | `querySelector('.btn-primary')` |

## JSDoc

```tsx
/**
 * @component ATOM | MOLECULE | PAGE
 * @testId How testId is handled
 */
```
