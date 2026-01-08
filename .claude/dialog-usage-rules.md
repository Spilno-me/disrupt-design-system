# Dialog vs Page vs Wizard: UX Decision Rules

> **Rule:** Choose container pattern based on complexity, not convenience.

## Quick Reference

| Fields | Complexity | Pattern | Example |
|--------|------------|---------|---------|
| 1-3 | Low | **Dialog** | Delete confirmation, password reset |
| 4-7 | Medium | **Dialog** or **Sheet** | Create login account |
| 8-12 | High | **Page** | Edit Partner, Edit Invoice |
| 13+ | Very High | **Wizard** | Tenant provisioning |

## Decision Tree

```
Is it a confirmation/acknowledgment?
├── YES → Dialog
└── NO → How many fields?
    ├── 1-3 → Dialog
    ├── 4-7 → Dialog (simple) or Sheet (contextual)
    ├── 8-12 → Page
    └── 13+ → Does it have logical steps?
        ├── YES → Wizard
        └── NO → Page with sections
```

---

## Pattern Rules

### USE Dialog for:
- Confirmations (delete, archive, publish)
- Simple forms (1-7 fields)
- Password/credential entry
- Quick inline creation
- Acknowledgments
- User expects <30 sec completion

### USE Page for:
- Complex forms (8+ fields)
- Primary CRUD workflows
- Data entry with sections
- Forms needing full keyboard navigation
- Anything user might spend >1 minute on
- Primary workflows (not secondary)

### USE Wizard for:
- Multi-step processes (13+ fields)
- Onboarding flows
- Provisioning/setup
- Natural step divisions exist
- Progress saving needed

### USE Sheet for:
- Preview/detail views
- Mobile interactions
- Filters and quick settings
- Contextual information
- Desktop Dialog → Mobile Sheet pattern

---

## UX Principles

### Miller's Law (7±2)
Working memory holds ~7 items. Forms >7 fields exceed cognitive capacity.

| Fields | Cognitive Load |
|--------|---------------|
| ≤5 | Low - scan and complete |
| 6-9 | Medium - needs focus |
| 10+ | High - overwhelm risk |

### Modal Interruption Cost
Dialogs **interrupt** user flow. Cost justified only for:
- Quick confirmations
- Low-complexity actions
- Secondary tasks

Complex primary workflows deserve full-page focus.

---

## Anti-Patterns

```
❌ 11-field form in a dialog (use Page)
❌ Multi-step wizard in a dialog (use dedicated Wizard)
❌ Primary workflow in dialog (use Page)
❌ Dialog for data entry >1 minute (use Page)
✅ Delete confirmation in dialog (0 fields)
✅ Password reset in dialog (2 fields)
✅ Quick create in dialog (3-5 fields)
```

---

## Implementation Pattern

### Routed Pages (Recommended)
```tsx
// routes.tsx
<Route path="/partners/:id/edit" element={<EditPartnerPage />} />

// Usage
<Button onClick={() => navigate(`/partners/${id}/edit`)}>Edit</Button>
```

### Inline Panel (Alternative)
```tsx
<div className="flex">
  <PartnerDataTable onEdit={setEditing} />
  {editing && (
    <EditPartnerPanel partner={editing} onClose={() => setEditing(null)} />
  )}
</div>
```

---

## DDS Component Usage

| Pattern | Component | Notes |
|---------|-----------|-------|
| Dialog | `<Dialog>` | DDS wrapper with gradient border |
| Sheet | `<Sheet>` | Side panel, bottom on mobile |
| Page | Custom | Full page layout component |
| Wizard | `<WizardStepper>` | Multi-step with progress |
