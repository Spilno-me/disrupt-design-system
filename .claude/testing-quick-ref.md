# data-testid Quick Reference

**Agent-only. data-testid attribute strategy by component type.**

> **Note:** This is about `data-testid` attribute implementation in components,
> NOT about unit tests. The goal is testability - making components ready for
> future test automation.

---

## testId by Layer

| Layer | Examples | Strategy | Default |
|-------|----------|----------|---------|
| **Atoms** | Button, Badge, Input | Accept via props | NONE |
| **Molecules** | LeadCard, StatsCard | Auto-generate | `{type}-{id}` |
| **Pages** | Dashboard, Settings | Named regions | Region-based |

---

## Atoms (Primitives)

```tsx
// NO default testId - consumer provides context
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>

// Usage
<Button data-testid="login-submit">Submit</Button>
```

---

## Molecules (Composed)

```tsx
interface LeadCardProps {
  lead: Lead
  testId?: string  // Optional override
}

function LeadCard({ lead, testId }: LeadCardProps) {
  return (
    <div data-testid={testId || `lead-card-${lead.id}`}>
      <Badge data-testid={`lead-status-${lead.id}`} />
      <Button data-testid={`lead-edit-${lead.id}`} />
    </div>
  )
}
```

---

## Pages/Templates

```tsx
<main data-testid="dashboard-page">
  <section data-testid="dashboard-stats" />
  <section data-testid="dashboard-table" />
</main>
```

---

## Naming Convention

```
{context}-{component}-{identifier}

Examples:
- lead-card-123
- login-submit-button
- dashboard-stats-section
- user-profile-avatar
```

---

## Testing Selectors

```tsx
// ✅ Preferred
getByTestId('lead-card-123')
getByRole('button', { name: /submit/i })

// ❌ Avoid
getByClassName('lead-card')
querySelector('.btn-primary')
```

---

## Quick Checklist

- [ ] Atoms: testId via spread props, no default
- [ ] Molecules: auto-generate with entity ID
- [ ] Pages: named regions/sections
- [ ] Follow naming convention

---

## Copy-Paste Patterns

### Atom Component (Button, Input, Badge)

```tsx
/**
 * Button - Primary action trigger
 *
 * @component ATOM
 * @testId Consumer provides via data-testid prop
 * @example <Button data-testid="login-submit">Submit</Button>
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => (
    <button ref={ref} className={cn(variants[variant], className)} {...props} />
  )
)
Button.displayName = 'Button'
```

### Molecule Component (LeadCard, StatsCard)

```tsx
/**
 * LeadCard - Displays lead information with actions
 *
 * @component MOLECULE
 * @testId Auto-generated: lead-card-{id}, lead-status-{id}, lead-edit-{id}
 * @example <LeadCard lead={lead} />
 */
interface LeadCardProps {
  lead: Lead
  testId?: string  // Optional override
}

function LeadCard({ lead, testId }: LeadCardProps) {
  const baseTestId = testId || `lead-card-${lead.id}`
  return (
    <div data-testid={baseTestId}>
      <Badge data-testid={`lead-status-${lead.id}`}>{lead.status}</Badge>
      <Button data-testid={`lead-edit-${lead.id}`}>Edit</Button>
    </div>
  )
}
```

### Page/Template Component

```tsx
/**
 * DashboardPage - Main dashboard layout
 *
 * @component PAGE
 * @testId Named regions: dashboard-page, dashboard-stats, dashboard-table
 */
function DashboardPage() {
  return (
    <main data-testid="dashboard-page">
      <header data-testid="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <section data-testid="dashboard-stats">
        <StatsCard stat={totalLeads} />
      </section>
      <section data-testid="dashboard-table">
        <DataTable data={leads} />
      </section>
    </main>
  )
}
```

### Test File Pattern

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeadCard } from './LeadCard'

describe('LeadCard', () => {
  const mockLead = { id: '123', name: 'Test Lead', status: 'new' }

  it('renders lead information', () => {
    render(<LeadCard lead={mockLead} />)

    expect(screen.getByTestId('lead-card-123')).toBeInTheDocument()
    expect(screen.getByTestId('lead-status-123')).toHaveTextContent('new')
  })

  it('handles edit action', async () => {
    const user = userEvent.setup()
    render(<LeadCard lead={mockLead} />)

    await user.click(screen.getByTestId('lead-edit-123'))
    // assertions...
  })
})
```

---

## JSDoc Template

Always include component type and testId documentation:

```tsx
/**
 * ComponentName - Brief description
 *
 * @component ATOM | MOLECULE | PAGE
 * @testId How testId is handled
 * @example Usage example
 */
```
