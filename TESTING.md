# Disrupt Design System - Testing Guide (QA)

**Last Updated:** 2025-12-13
**Version:** 2.5.0
**For:** QA Team & Test Automation Agents

---

## 🎯 Overview

This design system implements a **3-tier testId strategy** that provides predictable, stable selectors for Playwright testing while minimizing developer overhead.

**Key Principle:** testIds follow a **hierarchical naming pattern** where page-level naming propagates down to all nested components.

---

## 📊 The 3-Tier Strategy

### Tier 1: ATOMS (Primitives)
**What:** Basic building blocks (Button, Badge, Input, Skeleton, etc.)
**testId Strategy:** Accept from parent/consumer (NO defaults)
**Why:** Context-agnostic, reusable everywhere

### Tier 2: MOLECULES (Composed Components)
**What:** Components made from atoms (LeadCard, InvoiceCard, StatsCard, etc.)
**testId Strategy:** Auto-generate from props with optional override
**Why:** Know their context, can generate meaningful defaults

### Tier 3: PAGES (Top-level)
**What:** Full pages (LeadsPage, PartnersPage, InvoicesPage, etc.)
**testId Strategy:** Hardcoded on major sections
**Why:** Not reusable, testIds are stable and predictable

---

## 🔗 Naming Propagation (CRITICAL CONCEPT)

### The Propagation Chain

testIds flow from **Page → Section → Molecule → Atoms** in a hierarchical pattern:

```
Page Level (Hardcoded)
├─ data-testid="leads-page"
│
├─ Section Level (Hardcoded)
│  ├─ data-testid="leads-header"
│  ├─ data-testid="leads-filters"
│  └─ data-testid="leads-table"
│
├─ Molecule Level (Auto-generated from data)
│  └─ data-testid="lead-card-123"
│     ├─ data-testid="lead-card-123-priority"
│     ├─ data-testid="lead-card-123-status"
│     ├─ data-testid="lead-card-123-edit-button"
│     └─ data-testid="lead-card-123-delete-button"
│
└─ Atom Level (Provided by molecule)
   ├─ <SeverityIndicator data-testid="lead-card-123-priority" />
   ├─ <Badge data-testid="lead-card-123-status" />
   └─ <Button data-testid="lead-card-123-edit-button" />
```

---

## 📋 Naming Convention

### Format
**Pattern:** `section-element-type` (kebab-case)

### Examples by Tier

#### Page Level
```typescript
data-testid="leads-page"
data-testid="partners-page"
data-testid="invoices-page"
data-testid="settings-page"
```

#### Section Level (within page)
```typescript
data-testid="leads-header"
data-testid="leads-filters"
data-testid="leads-stats"
data-testid="leads-table"
data-testid="leads-pagination"
```

#### Molecule Level (auto-generated)
```typescript
data-testid="lead-card-123"
data-testid="invoice-card-456"
data-testid="partner-card-789"
data-testid="stats-card-revenue"
data-testid="notification-item-101"
```

#### Atom Level (within molecule)
```typescript
data-testid="lead-card-123-priority"
data-testid="lead-card-123-status"
data-testid="lead-card-123-edit-button"
data-testid="lead-card-123-delete-button"
data-testid="invoice-card-456-amount"
data-testid="invoice-card-456-download-button"
```

---

## 🎬 Real-World Example: Leads Page

### Page Structure
```tsx
function LeadsPage() {
  return (
    <div data-testid="leads-page">                    {/* ← PAGE */}

      {/* Header Section */}
      <header data-testid="leads-header">             {/* ← SECTION */}
        <h1>Leads Management</h1>
        <Button data-testid="leads-create-button">    {/* ← ATOM (context from page) */}
          Create Lead
        </Button>
      </header>

      {/* Filters Section */}
      <div data-testid="leads-filters">               {/* ← SECTION */}
        <Input data-testid="leads-search-input" />    {/* ← ATOM */}
        <Select data-testid="leads-status-filter" />  {/* ← ATOM */}
      </div>

      {/* Stats Section */}
      <div data-testid="leads-stats">                 {/* ← SECTION */}
        <StatsCard testId="leads-stats-total" />      {/* ← MOLECULE (optional override) */}
        <StatsCard testId="leads-stats-converted" />  {/* ← MOLECULE */}
      </div>

      {/* Table Section */}
      <div data-testid="leads-table">                 {/* ← SECTION */}
        {leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} />      {/* ← MOLECULE (auto-generates) */}
        ))}
      </div>
    </div>
  )
}
```

### Generated testIds

When a lead with `id: "123"` is rendered, **LeadCard automatically generates:**

```tsx
<LeadCard lead={{ id: "123", ... }} />

// Generates this structure:
<div data-testid="lead-card-123">
  <SeverityIndicator data-testid="lead-card-123-priority" level="high" />
  <Badge data-testid="lead-card-123-status">Active</Badge>
  <Button data-testid="lead-card-123-edit-button">Edit</Button>
  <Button data-testid="lead-card-123-delete-button">Delete</Button>
  <Button data-testid="lead-card-123-assign-button">Assign</Button>
</div>
```

**QA can now test:**
```typescript
// Find specific lead card
await page.getByTestId('lead-card-123').click()

// Test priority indicator
await expect(page.getByTestId('lead-card-123-priority')).toBeVisible()

// Click edit button on specific lead
await page.getByTestId('lead-card-123-edit-button').click()

// Find all lead cards
const allLeads = await page.getByTestId(/^lead-card-/).all()
expect(allLeads).toHaveLength(10)
```

---

## 🔍 Naming Propagation Examples

### Example 1: Partners Page

**Page naming sets the foundation:**

```
partners-page                              (PAGE)
├─ partners-header                         (SECTION)
│  └─ partners-create-button               (ATOM - context from page)
│
├─ partners-filters                        (SECTION)
│  ├─ partners-search-input                (ATOM)
│  └─ partners-tier-filter                 (ATOM)
│
└─ partners-table                          (SECTION)
   └─ partner-card-789                     (MOLECULE - auto-generated)
      ├─ partner-card-789-tier-badge       (ATOM - from molecule)
      ├─ partner-card-789-edit-button      (ATOM - from molecule)
      └─ partner-card-789-delete-button    (ATOM - from molecule)
```

**Notice the pattern:**
- Page prefix: `partners-`
- Sections: `partners-header`, `partners-filters`, `partners-table`
- Atoms in page sections: `partners-search-input`, `partners-create-button`
- Molecules: `partner-card-${id}` (singular, with ID)
- Atoms in molecules: `partner-card-${id}-element-type`

---

### Example 2: Invoices Page

**Page naming propagates throughout:**

```
invoices-page                              (PAGE)
├─ invoices-header                         (SECTION)
│  └─ invoices-export-button               (ATOM)
│
├─ invoices-filters                        (SECTION)
│  ├─ invoices-date-range-picker           (ATOM)
│  └─ invoices-status-filter               (ATOM)
│
└─ invoices-table                          (SECTION)
   └─ invoice-card-456                     (MOLECULE - auto-generated)
      ├─ invoice-card-456-amount           (ATOM - from molecule)
      ├─ invoice-card-456-status-badge     (ATOM - from molecule)
      ├─ invoice-card-456-download-button  (ATOM - from molecule)
      └─ invoice-card-456-edit-button      (ATOM - from molecule)
```

---

### Example 3: Dialog/Modal Propagation

**Dialogs follow the same pattern:**

```
delete-lead-dialog                         (ATOM/MOLECULE)
├─ delete-lead-dialog-title                (ATOM - from parent)
├─ delete-lead-dialog-description          (ATOM - from parent)
├─ delete-lead-dialog-confirm-button       (ATOM - from parent)
└─ delete-lead-dialog-cancel-button        (ATOM - from parent)
```

**When dialog is opened from a specific lead:**
```tsx
<DeleteLeadDialog
  lead={lead}
  testId={`delete-lead-dialog-${lead.id}`}
/>

// Generates:
data-testid="delete-lead-dialog-123"
data-testid="delete-lead-dialog-123-confirm-button"
data-testid="delete-lead-dialog-123-cancel-button"
```

---

## 🧪 Writing Tests with Propagated testIds

### Predictable Navigation Pattern

```typescript
// Test: Create a new lead
await page.getByTestId('leads-page').waitFor()
await page.getByTestId('leads-header').isVisible()
await page.getByTestId('leads-create-button').click()

// Dialog appears
await page.getByTestId('create-lead-dialog').waitFor()
await page.getByTestId('create-lead-dialog-name-input').fill('John Doe')
await page.getByTestId('create-lead-dialog-company-input').fill('Acme Corp')
await page.getByTestId('create-lead-dialog-submit-button').click()

// Verify lead appears in table
await expect(page.getByTestId(/^lead-card-/)).toHaveCount(11)
```

---

### Testing Specific Items in Lists

```typescript
// Test: Edit a specific lead
await page.getByTestId('lead-card-123').scrollIntoViewIfNeeded()
await page.getByTestId('lead-card-123-edit-button').click()

// Edit dialog opens
await page.getByTestId('edit-lead-dialog-123').waitFor()
await page.getByTestId('edit-lead-dialog-123-status-select').selectOption('converted')
await page.getByTestId('edit-lead-dialog-123-save-button').click()

// Verify status updated
const statusBadge = page.getByTestId('lead-card-123-status')
await expect(statusBadge).toHaveText('Converted')
```

---

### Testing with Regex Patterns

```typescript
// Find all lead cards
const allLeads = await page.getByTestId(/^lead-card-\d+$/).all()
expect(allLeads).toHaveLength(10)

// Find all edit buttons across leads
const editButtons = await page.getByTestId(/^lead-card-\d+-edit-button$/).all()
expect(editButtons).toHaveLength(10)

// Find all priority indicators
const priorities = await page.getByTestId(/^lead-card-\d+-priority$/).all()
expect(priorities).toHaveLength(10)
```

---

## 📐 testId Naming Rules

### Rule 1: Use kebab-case
```
✅ GOOD: leads-page, lead-card-123, leads-create-button
❌ BAD:  leadsPage, leadCard123, LeadsCreateButton
```

### Rule 2: Follow section-element-type pattern
```
✅ GOOD: leads-header, leads-create-button, lead-card-123-edit-button
❌ BAD:  header, button, edit
```

### Rule 3: Page prefix propagates to sections
```
✅ GOOD:
  leads-page
  leads-header
  leads-filters
  leads-table

❌ BAD:
  leads-page
  header           (missing page prefix)
  filters          (missing page prefix)
  table            (missing page prefix)
```

### Rule 4: Molecule prefix propagates to atoms
```
✅ GOOD:
  lead-card-123
  lead-card-123-priority
  lead-card-123-status
  lead-card-123-edit-button

❌ BAD:
  lead-card-123
  priority         (missing parent prefix)
  status           (missing parent prefix)
  edit-button      (missing parent prefix)
```

### Rule 5: Use entity ID for dynamic items
```
✅ GOOD: lead-card-123, invoice-card-456, partner-card-789
❌ BAD:  lead-card-0, lead-card-1, lead-card-2 (index-based, unstable)
```

---

## 🗺️ Complete testId Map by Page

### Leads Page

```
leads-page
├─ leads-header
│  ├─ leads-title
│  └─ leads-create-button
│
├─ leads-filters
│  ├─ leads-search-input
│  ├─ leads-status-filter
│  ├─ leads-priority-filter
│  └─ leads-source-filter
│
├─ leads-stats
│  ├─ leads-stats-total
│  ├─ leads-stats-new
│  ├─ leads-stats-contacted
│  └─ leads-stats-converted
│
└─ leads-table
   └─ lead-card-{id}                          (Dynamic: lead-card-123)
      ├─ lead-card-{id}-priority              (SeverityIndicator)
      ├─ lead-card-{id}-status                (Badge)
      ├─ lead-card-{id}-company               (Text)
      ├─ lead-card-{id}-contact               (Text)
      ├─ lead-card-{id}-amount                (Text)
      ├─ lead-card-{id}-edit-button           (Button)
      ├─ lead-card-{id}-delete-button         (Button)
      └─ lead-card-{id}-assign-button         (Button)
```

**Dialogs triggered from leads:**
```
create-lead-dialog
├─ create-lead-dialog-name-input
├─ create-lead-dialog-company-input
├─ create-lead-dialog-email-input
├─ create-lead-dialog-phone-input
├─ create-lead-dialog-priority-select
├─ create-lead-dialog-submit-button
└─ create-lead-dialog-cancel-button

edit-lead-dialog-{id}                       (Dynamic: edit-lead-dialog-123)
├─ edit-lead-dialog-{id}-name-input
├─ edit-lead-dialog-{id}-status-select
├─ edit-lead-dialog-{id}-save-button
└─ edit-lead-dialog-{id}-cancel-button

delete-lead-dialog-{id}                     (Dynamic: delete-lead-dialog-123)
├─ delete-lead-dialog-{id}-confirm-button
└─ delete-lead-dialog-{id}-cancel-button
```

---

### Partners Page

```
partners-page
├─ partners-header
│  └─ partners-create-button
│
├─ partners-filters
│  ├─ partners-search-input
│  └─ partners-tier-filter
│
└─ partners-table
   └─ partner-card-{id}                     (Dynamic: partner-card-789)
      ├─ partner-card-{id}-tier-badge
      ├─ partner-card-{id}-status-badge
      ├─ partner-card-{id}-name
      ├─ partner-card-{id}-email
      ├─ partner-card-{id}-edit-button
      └─ partner-card-{id}-delete-button
```

---

### Invoices Page

```
invoices-page
├─ invoices-header
│  ├─ invoices-export-button
│  └─ invoices-create-button
│
├─ invoices-filters
│  ├─ invoices-search-input
│  ├─ invoices-date-range-picker
│  └─ invoices-status-filter
│
└─ invoices-table
   └─ invoice-card-{id}                     (Dynamic: invoice-card-456)
      ├─ invoice-card-{id}-number
      ├─ invoice-card-{id}-amount
      ├─ invoice-card-{id}-status-badge
      ├─ invoice-card-{id}-due-date
      ├─ invoice-card-{id}-download-button
      ├─ invoice-card-{id}-edit-button
      └─ invoice-card-{id}-pay-button
```

---

## 🎯 The Dependency on Page Naming

### ⚠️ CRITICAL: Page Name is the Foundation

**The page-level name sets the pattern for ALL nested elements:**

```
If page is: "leads-page"
Then:
├─ Sections MUST start with "leads-"
│  ✅ leads-header
│  ✅ leads-filters
│  ✅ leads-table
│  ❌ header (WRONG - missing page prefix)
│
├─ Atoms in sections MUST use "leads-"
│  ✅ leads-create-button
│  ✅ leads-search-input
│  ❌ create-button (WRONG - missing page prefix)
│
└─ Molecules use singular entity name
   ✅ lead-card-123 (singular "lead")
   ✅ lead-card-123-edit-button
   ❌ leads-card-123 (WRONG - should be singular)
```

### Why This Matters

1. **Predictability:** QA can predict all testIds from page name
2. **Uniqueness:** Page prefix ensures no collisions across pages
3. **Discoverability:** `page.getByTestId(/^leads-/)` finds all leads page elements
4. **Maintenance:** Changing page name requires updating all nested testIds
5. **Consistency:** Same pattern across entire application

---

## 📝 testId Patterns Reference

### Pattern 1: Page-level Element
```
Format: {page}-{element}
Example: leads-create-button, partners-export-button
```

### Pattern 2: Section Container
```
Format: {page}-{section}
Example: leads-header, leads-filters, leads-table
```

### Pattern 3: Element in Section
```
Format: {page}-{element}-{type}
Example: leads-search-input, partners-status-filter
```

### Pattern 4: Molecule (Auto-generated)
```
Format: {entity}-card-{id}
Example: lead-card-123, invoice-card-456, partner-card-789
```

### Pattern 5: Atom in Molecule (Auto-generated)
```
Format: {entity}-card-{id}-{element}-{type}
Example: lead-card-123-edit-button, invoice-card-456-amount
```

### Pattern 6: Dialog/Modal
```
Format: {action}-{entity}-dialog[-{id}]
Example: create-lead-dialog, edit-lead-dialog-123, delete-partner-dialog-789
```

### Pattern 7: Dialog Elements
```
Format: {dialog-testid}-{element}-{type}
Example: create-lead-dialog-submit-button, edit-lead-dialog-123-name-input
```

---

## 🧪 Playwright Test Examples

### Test 1: Page Navigation
```typescript
test('Navigate to leads page', async ({ page }) => {
  await page.goto('/leads')

  // Verify page loaded
  await expect(page.getByTestId('leads-page')).toBeVisible()

  // Verify sections exist
  await expect(page.getByTestId('leads-header')).toBeVisible()
  await expect(page.getByTestId('leads-filters')).toBeVisible()
  await expect(page.getByTestId('leads-table')).toBeVisible()
})
```

### Test 2: Filter and Search
```typescript
test('Filter leads by status', async ({ page }) => {
  await page.goto('/leads')

  // Use filters
  await page.getByTestId('leads-search-input').fill('Acme Corp')
  await page.getByTestId('leads-status-filter').selectOption('active')

  // Verify results
  const leadCards = await page.getByTestId(/^lead-card-/).all()
  expect(leadCards.length).toBeGreaterThan(0)
})
```

### Test 3: CRUD Operations on Specific Item
```typescript
test('Edit specific lead', async ({ page }) => {
  await page.goto('/leads')

  // Find and click edit on lead-123
  await page.getByTestId('lead-card-123-edit-button').click()

  // Dialog opens
  await expect(page.getByTestId('edit-lead-dialog-123')).toBeVisible()

  // Update status
  await page.getByTestId('edit-lead-dialog-123-status-select').selectOption('converted')
  await page.getByTestId('edit-lead-dialog-123-save-button').click()

  // Verify dialog closed
  await expect(page.getByTestId('edit-lead-dialog-123')).not.toBeVisible()

  // Verify status updated
  const status = page.getByTestId('lead-card-123-status')
  await expect(status).toHaveText('Converted')
})
```

### Test 4: Bulk Operations
```typescript
test('Select multiple leads', async ({ page }) => {
  await page.goto('/leads')

  // Select first 3 leads
  for (let i = 1; i <= 3; i++) {
    const leadCards = await page.getByTestId(/^lead-card-/).all()
    const leadId = await leadCards[i - 1].getAttribute('data-testid')
    await page.getByTestId(`${leadId}-checkbox`).check()
  }

  // Verify bulk actions appear
  await expect(page.getByTestId('leads-bulk-actions')).toBeVisible()
  await expect(page.getByTestId('leads-bulk-delete-button')).toBeVisible()
})
```

### Test 5: Testing Across Pages
```typescript
test('Create partner and verify in partners page', async ({ page }) => {
  // Create from leads page
  await page.goto('/leads')
  await page.getByTestId('leads-create-button').click()
  await page.getByTestId('create-lead-dialog-name-input').fill('New Partner')
  await page.getByTestId('create-lead-dialog-submit-button').click()

  // Navigate to partners
  await page.goto('/partners')
  await expect(page.getByTestId('partners-page')).toBeVisible()

  // Verify partner exists
  const partnerCards = await page.getByTestId(/^partner-card-/).all()
  expect(partnerCards.length).toBeGreaterThan(0)
})
```

---

## 🔑 Key Concepts for QA

### 1. Page Prefix is the Root
**Every testId starts with the page name (except molecules):**
- `leads-page` → `leads-header`, `leads-filters`, `leads-search-input`
- `partners-page` → `partners-header`, `partners-create-button`

### 2. Molecules Use Singular Entity Name
**Entity cards use singular + ID:**
- `lead-card-123` (not `leads-card-123`)
- `invoice-card-456` (not `invoices-card-456`)
- `partner-card-789` (not `partners-card-789`)

### 3. Child Elements Inherit Parent testId
**Children extend parent testId:**
- Parent: `lead-card-123`
- Children: `lead-card-123-priority`, `lead-card-123-edit-button`

### 4. Dialogs Include Context
**Dialogs include action and entity:**
- `create-lead-dialog` (no ID - creates new)
- `edit-lead-dialog-123` (includes ID - edits existing)
- `delete-partner-dialog-789` (includes ID - deletes specific)

### 5. Stable vs Dynamic testIds

**Stable (hardcoded):**
- Page: `leads-page`
- Sections: `leads-header`, `leads-filters`
- Actions: `leads-create-button`

**Dynamic (auto-generated):**
- Entities: `lead-card-${lead.id}`
- Entity children: `lead-card-${lead.id}-edit-button`
- Context dialogs: `edit-lead-dialog-${lead.id}`

---

## 🎓 Testing Strategies

### Strategy 1: Top-Down Testing
```typescript
// Start from page, drill down to specific elements
await page.getByTestId('leads-page').waitFor()           // Page
await page.getByTestId('leads-table').scrollIntoView()   // Section
await page.getByTestId('lead-card-123').click()          // Molecule
await page.getByTestId('lead-card-123-edit-button').click() // Atom
```

### Strategy 2: Regex-Based Discovery
```typescript
// Find all items of a type
const allCards = await page.getByTestId(/^lead-card-\d+$/).all()
const allEditButtons = await page.getByTestId(/^lead-card-\d+-edit-button$/).all()
const allStatuses = await page.getByTestId(/^lead-card-\d+-status$/).all()
```

### Strategy 3: Context-Aware Testing
```typescript
// Test specific item in context
const leadId = '123'
await page.getByTestId(`lead-card-${leadId}-priority`).click()
await page.getByTestId(`lead-card-${leadId}-edit-button`).click()
await page.getByTestId(`edit-lead-dialog-${leadId}`).waitFor()
```

---

## 📚 Component Type Reference

### ATOMS (Accept data-testid from consumer)
- Button
- Badge
- Input, Textarea, Checkbox, Select
- Skeleton, SkeletonImage, SkeletonText
- SeverityIndicator
- Separator, Label
- Dialog primitives (DialogContent, DialogTitle, etc.)
- Sheet primitives

**Usage in tests:**
```typescript
// Consumer provides testId
await page.getByTestId('leads-create-button').click()
await page.getByTestId('leads-search-input').fill('search term')
```

---

### MOLECULES (Auto-generate testId)
- LeadCard
- InvoiceCard
- PartnerCard
- StatsCard
- NotificationsPanel
- QuickFilter

**Auto-generated testIds:**
```typescript
// LeadCard with id="123"
<LeadCard lead={{ id: "123" }} />

// Generates:
data-testid="lead-card-123"
data-testid="lead-card-123-priority"
data-testid="lead-card-123-status"
data-testid="lead-card-123-edit-button"
data-testid="lead-card-123-delete-button"
```

**Usage in tests:**
```typescript
// Predictable - no need to inspect DOM
await page.getByTestId('lead-card-123').click()
await page.getByTestId('lead-card-123-edit-button').click()
```

---

### PAGES (Hardcoded testIds)
- LeadsPage
- PartnersPage
- InvoicesPage
- SettingsPage
- DashboardPage

**Hardcoded testIds:**
```typescript
// Always the same, predictable
await page.getByTestId('leads-page').waitFor()
await page.getByTestId('leads-header').isVisible()
await page.getByTestId('leads-filters').click()
```

---

## ⚡ Quick Reference for QA Agents

### Finding Elements

```typescript
// Page-level
page.getByTestId('{page}-page')              // leads-page

// Section-level
page.getByTestId('{page}-{section}')         // leads-header

// Page-level action
page.getByTestId('{page}-{action}-button')   // leads-create-button

// Specific entity card
page.getByTestId('{entity}-card-{id}')       // lead-card-123

// Element in entity card
page.getByTestId('{entity}-card-{id}-{element}') // lead-card-123-edit-button

// Dialog
page.getByTestId('{action}-{entity}-dialog[-{id}]') // edit-lead-dialog-123

// Dialog element
page.getByTestId('{dialog-id}-{element}')    // edit-lead-dialog-123-save-button

// All items of type (regex)
page.getByTestId(/^lead-card-\d+$/)          // All lead cards
page.getByTestId(/^lead-card-\d+-edit-button$/) // All edit buttons
```

---

## 🚨 Important Notes for QA

### 1. Page Name Changes Affect All Nested testIds
If a page is renamed from `leads-page` to `sales-leads-page`, ALL nested testIds change:
```
BEFORE:
leads-page
leads-header
leads-create-button
lead-card-123-edit-button

AFTER:
sales-leads-page
sales-leads-header
sales-leads-create-button
lead-card-123-edit-button  (molecules unchanged - use entity name)
```

### 2. Entity IDs Come from Database
**testIds use actual database IDs, not array indices:**
```
✅ GOOD: lead-card-a1b2c3 (UUID from DB)
✅ GOOD: lead-card-123 (Integer ID from DB)
❌ BAD:  lead-card-0 (array index - unstable)
```

### 3. Molecules Generate testIds Automatically
**QA doesn't need to inspect code to know testId structure:**
```typescript
// LeadCard ALWAYS generates this pattern:
lead-card-{id}
lead-card-{id}-priority
lead-card-{id}-status
lead-card-{id}-edit-button
lead-card-{id}-delete-button

// InvoiceCard ALWAYS generates this pattern:
invoice-card-{id}
invoice-card-{id}-number
invoice-card-{id}-amount
invoice-card-{id}-status-badge
invoice-card-{id}-download-button
```

### 4. Use Regex for Dynamic Lists
```typescript
// Don't rely on specific IDs
❌ BAD:  await page.getByTestId('lead-card-123').click()

// Use regex to find ANY lead card
✅ GOOD: await page.getByTestId(/^lead-card-/).first().click()

// Or find all and loop
const leads = await page.getByTestId(/^lead-card-\d+$/).all()
for (const lead of leads) {
  await expect(lead).toBeVisible()
}
```

---

## 📖 Glossary

- **ATOM:** Basic component (Button, Input, Badge) - accepts testId from parent
- **MOLECULE:** Composed component (LeadCard, InvoiceCard) - auto-generates testId
- **PAGE:** Top-level route (LeadsPage, PartnersPage) - hardcoded testIds
- **Page Prefix:** First part of testId matching page name (e.g., "leads-")
- **Entity ID:** Unique identifier from database (not array index)
- **Base testId:** Root testId of molecule (e.g., "lead-card-123")
- **Child testId:** testId of atom within molecule (e.g., "lead-card-123-edit-button")

---

## 🔗 Developer Resources

For developers implementing components:
- Agent Guidelines: `.claude/testing-quick-ref.md`
- Agent Context: `.claude/agent-context.json` → `components.testing`
- Examples: See molecule implementations (LeadCard, InvoiceCard)

---

## 📞 Questions?

**Common Questions:**

**Q: What if a molecule doesn't have an ID?**
A: Use a semantic name: `<StatsCard testId="revenue-stats" />`

**Q: What if testId is too long?**
A: Abbreviate middle parts: `lead-card-123-btn-edit` (but prefer full names for clarity)

**Q: Can I use text selectors instead?**
A: No - text changes, testIds are stable. Always use testIds.

**Q: What if the same component appears twice on a page?**
A: Use different contexts: `leads-header-create-button` vs `leads-footer-create-button`

---

**Last Updated:** 2025-12-13
**For Questions:** Contact Design System Team
**Technical Reference:** `.claude/testing-quick-ref.md`
