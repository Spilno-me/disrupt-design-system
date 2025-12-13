# Testing Quick Reference (Agents)

**Last Updated:** 2025-12-13

---

## 🎯 testId Strategy by Component Type

Design systems have **3 component layers** - each needs different testId handling:

### 1. ATOMS (Primitives)
**Examples:** Button, Badge, Input, Skeleton, Separator
**Strategy:** Accept data-testid, NO defaults
**Why:** Context-agnostic, reusable everywhere

```tsx
// Component accepts via HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>

// Consumer provides context
<Button data-testid="login-submit-button">Submit</Button>
<Button data-testid="cancel-modal-button">Cancel</Button>
```

---

### 2. MOLECULES (Composed Components)
**Examples:** LeadCard, InvoiceCard, StatsCard, NotificationsPanel
**Strategy:** Auto-generate default, allow override
**Why:** Know their context, can generate meaningful defaults

```tsx
// Component has optional testId prop + auto-generation
interface LeadCardProps {
  lead: Lead
  testId?: string  // Optional override
}

export function LeadCard({ lead, testId, ...props }: LeadCardProps) {
  return (
    <div data-testid={testId || `lead-card-${lead.id}`} {...props}>
      {/* Internal atoms get context-specific testIds */}
      <SeverityIndicator
        level={lead.priority}
        data-testid={`lead-priority-${lead.id}`}
      />
      <Badge data-testid={`lead-status-${lead.id}`}>
        {lead.status}
      </Badge>
      <Button data-testid={`lead-edit-button-${lead.id}`}>
        Edit
      </Button>
    </div>
  )
}

// Usage: QA gets testIds automatically! ✅
<LeadCard lead={lead} />
// Generates: data-testid="lead-card-123"
//           data-testid="lead-priority-123"
//           data-testid="lead-status-123"
//           data-testid="lead-edit-button-123"
```

---

### 3. PAGES (Top-level)
**Examples:** LeadsPage, PartnersPage, InvoicesPage
**Strategy:** Hardcoded data-testids on major sections
**Why:** Not reusable, testIds are stable

```tsx
export function LeadsPage() {
  return (
    <div data-testid="leads-page">
      <header data-testid="leads-header">...</header>
      <div data-testid="leads-filters">...</div>
      <div data-testid="leads-table-container">
        {leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  )
}
```

---

## 📋 Quick Decision Tree

```
Is it reusable in multiple contexts?
├─ YES → Is it composed of multiple atoms?
│  ├─ YES → MOLECULE → Auto-generate testId from props
│  └─ NO  → ATOM → Accept data-testid from consumer
└─ NO  → PAGE → Hardcode data-testid
```

---

## 🧪 Naming Convention (All Types)

**Format:** `section-element-type` (kebab-case)

```typescript
// Pages
data-testid="leads-page"
data-testid="partners-page"

// Sections within pages
data-testid="leads-header"
data-testid="leads-filters"
data-testid="leads-table-container"

// Molecules (auto-generated)
data-testid="lead-card-123"
data-testid="invoice-card-456"
data-testid="stats-card-revenue"

// Atoms (context-specific)
data-testid="login-submit-button"
data-testid="settings-email-input"
data-testid="user-role-select"

// Repeating elements
data-testid="lead-card-${id}"
data-testid="lead-priority-${id}"
data-testid="lead-edit-button-${id}"
```

---

## 📋 Component Checklist

**When creating/editing components:**

1. ✅ Add `data-testid` to interactive elements
2. ✅ Use kebab-case naming
3. ✅ Add to actual DOM node (not wrapper)
4. ✅ Include context in name (`login-submit-button`, not just `button`)
5. ✅ For lists: use dynamic IDs (`item-${id}`)

---

## ✅ Implementation Examples by Type

### ATOMS - Accept data-testid (Context from Consumer)

```tsx
// Component code - accepts data-testid
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string
  // data-testid comes from HTMLButtonHTMLAttributes
}

function Button({ variant, ...props }: ButtonProps) {
  return <button {...props} className={...} />  // Spreads data-testid
}

// Consumer usage - provides context
<Button data-testid="login-submit-button">Submit</Button>
<Button data-testid="cancel-modal-button">Cancel</Button>

// Other atoms
<Input data-testid="login-email-input" type="email" />
<Badge data-testid="user-status-badge">Active</Badge>
<Skeleton data-testid="profile-skeleton" />
```

---

### MOLECULES - Auto-generate with Override

```tsx
// Component code - auto-generates default
interface LeadCardProps {
  lead: Lead
  testId?: string  // Optional override
  onEdit?: () => void
  onDelete?: () => void
}

export function LeadCard({ lead, testId, onEdit, onDelete }: LeadCardProps) {
  const baseTestId = testId || `lead-card-${lead.id}`

  return (
    <div data-testid={baseTestId}>
      {/* Auto-generate child testIds from base */}
      <SeverityIndicator
        level={lead.priority}
        data-testid={`${baseTestId}-priority`}
      />
      <Badge data-testid={`${baseTestId}-status`}>
        {lead.status}
      </Badge>
      <Button
        data-testid={`${baseTestId}-edit-button`}
        onClick={onEdit}
      >
        Edit
      </Button>
      <Button
        data-testid={`${baseTestId}-delete-button`}
        onClick={onDelete}
      >
        Delete
      </Button>
    </div>
  )
}

// Consumer usage - QA gets testIds automatically!
<LeadCard lead={lead} />
// Generates:
// data-testid="lead-card-123"
// data-testid="lead-card-123-priority"
// data-testid="lead-card-123-status"
// data-testid="lead-card-123-edit-button"
// data-testid="lead-card-123-delete-button"

// Can override if needed
<LeadCard lead={lead} testId="featured-lead" />
// Generates:
// data-testid="featured-lead"
// data-testid="featured-lead-priority"
// data-testid="featured-lead-status"
```

**Pattern for other molecules:**
```tsx
// InvoiceCard
<InvoiceCard invoice={invoice} />
→ data-testid="invoice-card-456"

// StatsCard with semantic ID
<StatsCard testId="revenue-stats" />
→ data-testid="revenue-stats"

// NotificationsPanel
<NotificationsPanel />
→ data-testid="notifications-panel"
```

---

### PAGES - Hardcoded testIds

```tsx
export function LeadsPage() {
  return (
    <div data-testid="leads-page">
      <header data-testid="leads-header">
        <h1>Leads</h1>
      </header>

      <div data-testid="leads-filters">
        <SearchFilter />
        <QuickFilter />
      </div>

      <div data-testid="leads-stats">
        <StatsCard testId="leads-stats-total" />
        <StatsCard testId="leads-stats-converted" />
      </div>

      <div data-testid="leads-table-container">
        <LeadsDataTable data={leads} />
      </div>
    </div>
  )
}

// QA can now test predictably:
await page.getByTestId('leads-page').waitFor()
await page.getByTestId('leads-filters').click()
await page.getByTestId('leads-stats-total').textContent()
```

---

## 🚫 Common Mistakes

```tsx
// ❌ BAD: Adding default testId to atoms
function Button({ ...props }) {
  return <button data-testid="button" {...props} />  // Too generic!
}

// ✅ GOOD: Accept from consumer
function Button({ ...props }) {
  return <button {...props} />  // Consumer provides context
}
<Button data-testid="login-submit-button">Submit</Button>

// ❌ BAD: Molecule without auto-generation
function LeadCard({ lead }) {
  return <div>{lead.name}</div>  // QA can't test!
}

// ✅ GOOD: Auto-generate from props
function LeadCard({ lead, testId }) {
  return <div data-testid={testId || `lead-card-${lead.id}`}>
    {lead.name}
  </div>
}

// ❌ BAD: camelCase
<button data-testid="loginSubmitButton">Submit</button>

// ✅ GOOD: kebab-case
<button data-testid="login-submit-button">Submit</button>

// ❌ BAD: On wrapper div
<div data-testid="submit-button">
  <button>Submit</button>
</div>

// ✅ GOOD: On actual interactive element
<button data-testid="submit-button">Submit</button>
```

---

## 🔍 Where to Find

- **Full guidelines:** `.claude/agent-context.json` → `components.testing.dataTestId`
- **Hookify enforcement:** `.claude/hookify/agent-assist.yaml`
- **This file:** `.claude/testing-quick-ref.md`

---

**Total read time: 30 seconds ⚡**
