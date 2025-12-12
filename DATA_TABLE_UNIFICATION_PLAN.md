# DataTable Unification Plan
## Making DataTable Universal for Desktop & Mobile

> **Goal**: Create a truly universal data visualization component that handles all data types, follows UX/UI best practices, uses only design tokens, and works seamlessly on desktop and mobile without overengineering.

---

## 📊 Current State Analysis

### ✅ What's Working
- **Token-based styling** - Uses ALIAS tokens consistently
- **Solid foundation** - Sorting, selection, loading, empty states
- **Accessibility** - Keyboard navigation, ARIA attributes
- **Flexible columns** - Width, alignment, sticky positioning
- **Priority indicators** - Colored left borders for row severity

### ❌ Current Gaps

#### 1. **Mobile Responsiveness**
- No card/list view for mobile
- Tables break on small screens
- No responsive column hiding
- No touch-optimized interactions

#### 2. **Action Column Inconsistency**
```tsx
// HierarchyPage - 3 icon buttons, no labels
<Button variant="ghost" size="icon"><Eye /></Button>
<Button variant="ghost" size="icon"><Plus /></Button>
<Button variant="ghost" size="icon"><MoreHorizontal /></Button>

// TenantRequestsPage - 4 icon buttons, RBAC-based visibility
<Button variant="ghost" size="icon"><PencilIcon /></Button>
<Button variant="ghost" size="icon"><CheckIcon /></Button>
<Button variant="ghost" size="icon"><XMarkIcon /></Button>
<Button variant="ghost" size="icon"><TrashIcon /></Button>
```
**Problem**: No standard pattern, different icons, no tooltips, no overflow menu

#### 3. **Status Badge Inconsistency**
```tsx
// HierarchyPage - Custom colors, not using tokens
<span className="bg-green-100 text-green-800">active</span>

// TenantRequestsPage - Custom function
getStatusBadge(status) // Returns custom JSX with hardcoded colors
```
**Problem**: Not using DDS Badge component, hardcoded colors

#### 4. **Empty State Inconsistency**
- Each page implements custom empty states
- No reusable patterns
- Inconsistent messaging

---

## 🎯 Unified Approach: Balance Without Overengineering

### Philosophy
1. **Composition over Configuration** - Build from small, focused components
2. **Sensible Defaults** - Works great out of the box
3. **Escape Hatches** - Allow customization when needed
4. **Mobile-First** - Responsive by default
5. **Token-First** - Zero hardcoded values

---

## 🏗️ Proposed Architecture

### 1. Core DataTable (Minimal Changes)
Keep current functionality, add:
- **Responsive prop** `<DataTable responsive="auto" | "always-table" | "always-cards">`
- **Actions renderer** - Standardized callback pattern
- **Mobile breakpoint** - Token-based responsive behavior

### 2. New Composable Sub-Components

#### **DataTableActions** - Standardized Actions Column
```tsx
import { DataTableActions, type ActionItem } from '@adrozdenko/design-system'

const actions: ActionItem[] = [
  { id: 'edit', label: 'Edit', icon: Edit, onClick: handleEdit },
  { id: 'delete', label: 'Delete', icon: Trash, variant: 'destructive', onClick: handleDelete, requires: 'admin' },
  { id: 'approve', label: 'Approve', icon: Check, onClick: handleApprove, showWhen: (row) => row.status === 'pending' }
]

<DataTable
  columns={[
    ...otherColumns,
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <DataTableActions
          actions={actions}
          row={row}
          align="right"
          maxVisible={3}  // Show 3, rest in overflow menu
        />
      ),
      sticky: 'right'
    }
  ]}
/>
```

**Features**:
- Auto-overflow to dropdown menu (3 visible + "More")
- Conditional visibility (`showWhen`, `requires`)
- Consistent styling using tokens
- Built-in tooltips
- Mobile-optimized (larger touch targets)

#### **DataTableBadge** - Standardized Status Indicators
```tsx
import { DataTableBadge } from '@adrozdenko/design-system'

// Define status mappings once
const STATUS_MAP = {
  active: { variant: 'success', label: 'Active' },
  pending: { variant: 'warning', label: 'Pending' },
  failed: { variant: 'error', label: 'Failed' }
}

<DataTable
  columns={[
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <DataTableBadge
          status={row.status}
          mapping={STATUS_MAP}
        />
      )
    }
  ]}
/>
```

**Features**:
- Uses DDS Badge component
- Token-based colors
- Optional icons
- Consistent sizing

#### **DataTableMobileCard** - Mobile View Component
```tsx
// Automatically used when responsive="auto" and screen < md
<DataTableMobileCard
  data={row}
  fields={[
    { label: 'Company', value: row.companyName, primary: true },
    { label: 'Status', value: <DataTableBadge status={row.status} /> },
    { label: 'Revenue', value: formatCurrency(row.revenue) }
  ]}
  actions={<DataTableActions actions={actions} row={row} />}
  onTap={() => handleRowClick(row)}
/>
```

#### **DataTableFilters** - Standardized Filter Bar
```tsx
import { DataTableFilters, type FilterDef } from '@adrozdenko/design-system'

const filters: FilterDef[] = [
  { id: 'status', label: 'Status', type: 'multi-select', options: statusOptions },
  { id: 'tier', label: 'Tier', type: 'multi-select', options: tierOptions },
  { id: 'dateRange', label: 'Created', type: 'date-range' }
]

<DataTableFilters
  filters={filters}
  values={filterValues}
  onChange={setFilterValues}
  searchPlaceholder="Search partners..."
  onSearch={setSearchQuery}
/>
```

---

## 📱 Mobile-First Responsive Strategy

### Breakpoint System (Using Tokens)
```typescript
// src/constants/designTokens.ts
export const BREAKPOINTS = {
  mobile: '0px',      // < 640px
  tablet: '640px',    // 640px - 1024px
  desktop: '1024px',  // >= 1024px
} as const

export const RESPONSIVE = {
  datatable: {
    cardBreakpoint: 'md',  // Switch to cards below 768px
    hideColumnsBelow: {
      sm: ['createdAt', 'updatedAt'],  // Hide on mobile
      md: ['description']               // Hide on tablet
    }
  }
} as const
```

### Auto-Responsive Behavior
```tsx
<DataTable
  responsive="auto"  // Default - switches to cards on mobile
  mobileCardTemplate={(row) => (
    <DataTableMobileCard
      title={row.companyName}
      subtitle={row.contactEmail}
      status={<DataTableBadge status={row.status} />}
      fields={[
        { label: 'Leads', value: row.totalLeads },
        { label: 'Revenue', value: formatCurrency(row.revenue) }
      ]}
      actions={actions}
    />
  )}
/>
```

### Column Priority System
```tsx
columns={[
  { id: 'company', header: 'Company', priority: 1 },        // Always visible
  { id: 'status', header: 'Status', priority: 2 },          // Hide on mobile
  { id: 'revenue', header: 'Revenue', priority: 3 },        // Hide on tablet
  { id: 'created', header: 'Created', priority: 4 },        // Desktop only
  { id: 'actions', header: 'Actions', priority: 0 },        // Always visible
]}
```

---

## 🎨 Token-Based Design System

### All Values from Tokens
```typescript
// DataTable uses these tokens (no hardcoded values)
{
  background: {
    header: ALIAS.background.muted,
    row: ALIAS.background.surface,
    rowHover: ALIAS.background.surfaceHover,
    rowSelected: ALIAS.background.accentBg,
  },
  border: {
    default: ALIAS.border.default,
    focus: ALIAS.border.focus,
  },
  text: {
    header: ALIAS.text.primary,
    cell: ALIAS.text.primary,
    secondary: ALIAS.text.secondary,
  },
  spacing: {
    cellPadding: { default: SPACING.space[4], compact: SPACING.space[2] },
    rowHeight: { default: SPACING.space[12], compact: SPACING.space[10] },
  },
  priority: {
    critical: ALIAS.status.error,
    high: ALIAS.aging.primary,
    medium: ALIAS.status.warning,
    low: ALIAS.status.success,
  }
}
```

---

## 🛠️ Implementation Phases

### Phase 1: Foundation (No Breaking Changes)
- [x] Current DataTable remains unchanged
- [ ] Add `DataTableActions` component
- [ ] Add `DataTableBadge` component
- [ ] Add `DataTableFilters` component
- [ ] Add `DataTableMobileCard` component
- [ ] Add `responsive` prop to DataTable
- [ ] Export all from design system

**Result**: Partner can start migrating incrementally

### Phase 2: Enhanced Features
- [ ] Column priority/hiding system
- [ ] Row expansion for hierarchical data
- [ ] Bulk actions toolbar
- [ ] Column reordering
- [ ] Density modes (comfortable, compact, spacious)
- [ ] Export functionality (CSV, PDF)

### Phase 3: Advanced
- [ ] Virtual scrolling for 10K+ rows
- [ ] Server-side sort/filter/pagination helpers
- [ ] Saved views/preferences
- [ ] Drag-and-drop row reordering

---

## 📝 Migration Guide for Partner Central

### Before (Current - Inconsistent)
```tsx
// HierarchyPage.tsx - Custom everything
const columns = [
  {
    id: 'actions',
    header: 'Actions',
    accessor: (row) => (
      <div className="flex items-center justify-end gap-1">
        <Button variant="ghost" size="icon"><Eye /></Button>
        <Button variant="ghost" size="icon"><Plus /></Button>
        <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
      </div>
    ),
    width: '140px',
    sticky: 'right',
  }
]
```

### After (Unified - Consistent)
```tsx
import { DataTable, DataTableActions, DataTableBadge } from '@adrozdenko/design-system'

const actions = [
  { id: 'view', label: 'View Details', icon: Eye, onClick: handleView },
  { id: 'add-sub', label: 'Add Sub-Partner', icon: Plus, onClick: handleAddSub },
  { id: 'edit', label: 'Edit', icon: Edit, onClick: handleEdit, requires: 'admin' },
  { id: 'delete', label: 'Delete', icon: Trash, variant: 'destructive', onClick: handleDelete, requires: 'admin' },
]

const columns = [
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => (
      <DataTableBadge
        status={row.status}
        mapping={PARTNER_STATUS_MAP}
      />
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    accessor: (row) => (
      <DataTableActions
        actions={actions}
        row={row}
        maxVisible={2}
      />
    ),
    sticky: 'right',
  }
]

<DataTable
  data={partners}
  columns={columns}
  responsive="auto"
  mobileCardTemplate={(row) => (
    <PartnerMobileCard partner={row} actions={actions} />
  )}
/>
```

---

## ✅ Benefits of This Approach

### 1. **Consistency**
- All tables use same action pattern
- All status badges use same styling
- All mobile views use same card layout

### 2. **Maintainability**
- Change action styling once, applies everywhere
- Update mobile breakpoint in one place
- Token updates propagate automatically

### 3. **Accessibility**
- Consistent keyboard navigation
- Proper ARIA labels
- Touch-optimized mobile interactions

### 4. **Developer Experience**
```tsx
// Simple case - just works
<DataTable data={data} columns={columns} />

// Advanced case - full control
<DataTable
  data={data}
  columns={columns}
  responsive="auto"
  selectable
  sortable
  filterable
  onRowClick={handleClick}
  actions={standardActions}
  emptyState={<CustomEmpty />}
/>
```

### 5. **Performance**
- No overengineering - only load what you use
- Tree-shakeable exports
- Virtual scrolling optional

---

## 🎯 Success Metrics

- ✅ **Zero hardcoded colors** - All values from tokens
- ✅ **Mobile responsive** - Works on all screen sizes
- ✅ **Consistent actions** - Same pattern everywhere
- ✅ **Consistent badges** - Same styling everywhere
- ✅ **Simple API** - Easy to use, hard to misuse
- ✅ **Flexible** - Escape hatches for custom needs
- ✅ **Documented** - Storybook examples for all patterns

---

## 🚀 Next Steps

1. **Review this plan** - Gather feedback
2. **Create Storybook stories** - Document all patterns
3. **Implement Phase 1** - Core components
4. **Migrate one page** - Validate approach
5. **Roll out** - Migrate remaining pages
6. **Document** - Update CLAUDE.md with patterns

---

## 💡 Key Principle: Composition Over Configuration

Instead of:
```tsx
// ❌ BAD - Monolithic, hard to customize
<DataTable
  showActions
  actionVariant="dropdown"
  actionMaxVisible={3}
  statusBadgeColors={{ active: 'green', pending: 'yellow' }}
  mobileCardLayout="compact"
  mobileCardShowAvatar
  ...100 more props
/>
```

We use:
```tsx
// ✅ GOOD - Composable, flexible
<DataTable
  responsive="auto"
  mobileCard={MobileCard}
  columns={[
    statusColumn(<DataTableBadge />),
    actionsColumn(<DataTableActions maxVisible={3} />)
  ]}
/>
```

This gives us **infinite flexibility** without **infinite complexity**.
