# DDS Storybook Organization Vision

> **Purpose**: Define the canonical structure for organizing DDS (Disrupt Design System) Storybook stories, components, and documentation.

---

## What is DDS?

DDS is a **Product Design System** - a single source of truth that includes:

- Design tokens (Foundation)
- Primitive components (Core)
- Shared cross-product components (Shared)
- Product-specific components and pages (Partner, Flow, Market)
- Marketing website components (Website)
- Brand guidelines (Brand)

---

## Core Principles

| Principle | Rule |
|-----------|------|
| **Composition flows DOWN** | Foundation → Core → Shared → Product → Pages |
| **No upward dependencies** | Core never imports from Shared. Shared never imports from Partner. |
| **Product owns its components** | LeadCard lives in Partner/, not Core/ - even if it could be generic |
| **Shared = used by 2+ products** | If only Partner uses it, it stays in Partner/ |
| **Pages demonstrate composition** | Partner/Pages shows how to compose Shared + Partner components |
| **Reusability is key** | Structure should make it obvious what can be reused |

---

## Target Structure

```
📁 DDS Storybook
│
├── 🎨 Foundation/                    ← Design decisions (tokens)
│   ├── Overview
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Shadows
│   ├── Radius
│   └── Animations
│
├── 🧱 Core/                          ← Primitives (no dependencies)
│   ├── Button
│   ├── Input
│   ├── Select
│   ├── Checkbox
│   ├── Card
│   ├── Dialog
│   ├── Sheet
│   ├── Tabs
│   ├── Tooltip
│   ├── Badge
│   ├── Skeleton
│   └── ... (all base components)
│
├── 🔗 Shared/                        ← Cross-product components
│   ├── App Shell/                    ← Layout system
│   │   ├── AppLayoutShell
│   │   ├── AppHeader
│   │   ├── AppSidebar
│   │   ├── AppFooter
│   │   └── BottomNav
│   ├── Data/                         ← Data display patterns
│   │   ├── DataTable
│   │   ├── Pagination
│   │   └── SearchFilter
│   ├── Auth/                         ← Authentication
│   │   ├── LoginPage
│   │   ├── ForgotPassword
│   │   └── ResetPassword
│   └── Feedback/                     ← User feedback
│       ├── ErrorState
│       └── GenericErrorPage
│
├── 🤝 Partner/                       ← Disrupt Partner application
│   ├── Overview                      ← What is Partner Portal?
│   ├── Components/                   ← Partner-specific components
│   │   ├── LeadCard
│   │   ├── StatsCard
│   │   ├── InvoiceCard
│   │   ├── PricingCalculator
│   │   └── ...
│   ├── Dialogs/                      ← Partner dialogs
│   │   ├── CreateLeadDialog
│   │   ├── EditPartnerDialog
│   │   ├── DeletePartnerDialog
│   │   └── ...
│   ├── Pages/                        ← Full page compositions
│   │   ├── Dashboard
│   │   ├── Leads
│   │   ├── Partners
│   │   ├── Invoices
│   │   ├── PartnerNetwork
│   │   ├── TenantProvisioning
│   │   └── ...
│   └── Complete App                  ← PartnerPortalPage (everything)
│
├── 🔄 Flow/                          ← Disrupt Flow (future)
│   ├── Overview
│   ├── Components/
│   ├── Pages/
│   └── Complete App
│
├── 🛒 Market/                        ← Disrupt Market (future)
│   ├── Overview
│   ├── Components/
│   ├── Pages/
│   └── Complete App
│
├── 🌐 Website/                       ← Marketing website
│   ├── Components/
│   ├── Sections/
│   └── Layout/
│
└── 📖 Brand/                         ← Non-technical guidelines
    ├── Logos
    ├── Guidelines
    ├── Iconography
    └── Downloads
```

---

## Composition Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                     Partner/Complete App                         │
│                    (PartnerPortalPage)                          │
└─────────────────────────────────────────────────────────────────┘
                              ▲ uses
┌─────────────────────────────────────────────────────────────────┐
│                      Partner/Pages/*                             │
│         Dashboard, Leads, Partners, Invoices, etc.              │
└─────────────────────────────────────────────────────────────────┘
                              ▲ uses
┌──────────────────────────┬──────────────────────────────────────┐
│  Partner/Components/*    │         Shared/*                      │
│  LeadCard, InvoiceCard   │  AppLayoutShell, DataTable, Auth     │
└──────────────────────────┴──────────────────────────────────────┘
                              ▲ uses
┌─────────────────────────────────────────────────────────────────┐
│                         Core/*                                   │
│        Button, Card, Dialog, Input, Badge, Tabs, etc.           │
└─────────────────────────────────────────────────────────────────┘
                              ▲ uses
┌─────────────────────────────────────────────────────────────────┐
│                      Foundation/*                                │
│           Colors, Typography, Spacing, Shadows                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Migration Rules

### What Stays in Core/
- Primitive UI components with no business logic
- Components that could exist in any application
- Examples: Button, Input, Card, Dialog, Badge, Tabs

### What Goes to Shared/
- Components used by 2+ products
- Layout shells (AppHeader, AppSidebar, AppFooter)
- Authentication flows
- Data patterns (DataTable, SearchFilter)

### What Goes to Partner/
- Components specific to Partner Portal
- Business-logic components (LeadCard, InvoiceCard)
- Partner-specific dialogs
- Partner page compositions

### What Gets Deleted
- Duplicate stories (keep one canonical location)
- Empty groups
- Orphaned single-story categories

---

## File Naming Conventions

| Type | File Pattern | Story Title Pattern |
|------|--------------|---------------------|
| Core component | `src/components/ui/*.stories.tsx` | `Core/ComponentName` |
| Shared component | `src/components/shared/*.stories.tsx` | `Shared/Category/ComponentName` |
| Partner component | `src/components/partners/*.stories.tsx` | `Partner/Components/ComponentName` |
| Partner page | `src/stories/partner/*.stories.tsx` | `Partner/Pages/PageName` |

---

## Atomic Design Classification

We use **domain-driven navigation** (Core, Shared, Partner) combined with **atomic design labels** in documentation.

### Navigation vs Documentation

| Aspect | System | Example |
|--------|--------|---------|
| **Sidebar navigation** | Domain-driven | `Core/Button`, `Shared/App Shell/AppHeader` |
| **Story docs label** | Atomic design | `Type: ATOM`, `Type: ORGANISM` |

### Atomic Levels

| Level | Definition | Domain Location | Examples |
|-------|------------|-----------------|----------|
| **ATOM** | Single UI element, no dependencies | Core/ | Button, Input, Badge, Label, Checkbox |
| **MOLECULE** | Simple group of atoms | Core/ | Form field (label + input), IconText |
| **ORGANISM** | Complex section with molecules + atoms | Shared/, Product/ | AppHeader, DataTable, Sidebar, Cards |
| **TEMPLATE** | Page layout structure | Shared/App Shell/ | AppLayoutShell, PageLayout |
| **PAGE** | Template + real data | Product/Pages/, Product/Complete App | LeadsPage, PartnerPortalPage |

### Story Documentation Pattern

```tsx
const meta: Meta<typeof ComponentName> = {
  title: 'Core/ComponentName',  // Domain-driven navigation
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        component: `
# ComponentName

**Type:** ATOM | MOLECULE | ORGANISM | TEMPLATE | PAGE

Description here...
        `,
      },
    },
  },
}
```

### Classification Guide

**Core/ components:**
- Single element, no children → ATOM (Button, Badge, Input)
- Compound with fixed parts → MOLECULE (Tabs, Accordion, Select)

**Shared/ components:**
- Layout shells → TEMPLATE (AppLayoutShell)
- Complex UI sections → ORGANISM (AppHeader, AppSidebar, DataTable)

**Product/ components:**
- Business cards/panels → ORGANISM (LeadCard, StatsCard)
- Full pages → PAGE (LeadsPage, Dashboard)

---

## Version History

| Date | Change |
|------|--------|
| 2025-12-16 | Initial vision document created |
