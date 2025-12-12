# DataTable: Before vs After Comparison
## Real Example from Partner Central - HierarchyPage

---

## 🔴 BEFORE: Current Implementation (Inconsistent)

### Problems:
1. ❌ Hardcoded colors (`bg-green-100`, `text-green-800`)
2. ❌ Custom action buttons with no tooltips
3. ❌ No mobile support
4. ❌ Inconsistent patterns across pages
5. ❌ No reusability

```tsx
// HierarchyPage.tsx - Lines 166-174, 291-476
const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-100 text-green-800',      // ❌ Hardcoded
    inactive: 'bg-gray-100 text-gray-800',      // ❌ Hardcoded
    pending: 'bg-yellow-100 text-yellow-800',   // ❌ Hardcoded
    suspended: 'bg-red-100 text-red-800',       // ❌ Hardcoded
  };
  return colors[status as keyof typeof colors] || colors.inactive;
};

const columns: ColumnDef<any>[] = [
  // ... other columns
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => (
      // ❌ Not using DDS Badge component
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
        {row.status}
      </span>
    ),
    width: '120px',
  },
  {
    id: 'actions',
    header: 'Actions',
    accessor: (row) => (
      // ❌ No tooltips, no overflow menu, no conditional visibility pattern
      <div className="flex items-center justify-end gap-1">
        {(user?.isAdmin || user?.role === 'admin' || /* ...long RBAC check... */) && (
          <Button variant="ghost" size="icon" title="View/Edit">
            <Eye className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" title="Add Sub-Partner">
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="More Options">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    ),
    width: '140px',
    sticky: 'right',
  },
]

// ❌ Breaks on mobile - no responsive handling
<DataTable
  data={flattenedPartners}
  columns={columns}
  getRowId={(row) => row.id}
  loading={isLoading}
  stickyHeader
  hoverable
  bordered
/>
```

---

## 🟢 AFTER: Unified Implementation (Consistent)

### Benefits:
1. ✅ All colors from design tokens
2. ✅ Standardized actions with tooltips
3. ✅ Mobile-responsive automatically
4. ✅ Reusable across all pages
5. ✅ Conditional visibility built-in

```tsx
// HierarchyPage.tsx - Unified approach
import {
  DataTable,
  DataTableActions,
  DataTableBadge,
  type ActionItem,
  type StatusMapping,
} from '@adrozdenko/design-system'

// ✅ Define status mapping once (uses tokens internally)
const PARTNER_STATUS_MAP: StatusMapping = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'secondary', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  suspended: { variant: 'destructive', label: 'Suspended' },
}

// ✅ Define actions once, reuse everywhere
const partnerActions: ActionItem[] = [
  {
    id: 'view',
    label: 'View/Edit',
    icon: Eye,
    onClick: (row) => handleViewEdit(row),
    showWhen: (row, user) => canEdit(row, user),  // ✅ Built-in conditional visibility
  },
  {
    id: 'add-sub',
    label: 'Add Sub-Partner',
    icon: Plus,
    onClick: (row) => handleAddSubPartner(row),
  },
  {
    id: 'edit',
    label: 'Edit Details',
    icon: Edit,
    onClick: (row) => handleEdit(row),
    showWhen: (row, user) => user?.isAdmin,
  },
  {
    id: 'delete',
    label: 'Delete Partner',
    icon: Trash,
    variant: 'destructive',
    onClick: (row) => handleDelete(row),
    showWhen: (row, user) => user?.isAdmin,
    confirm: true,  // ✅ Built-in confirmation
  },
]

const columns: ColumnDef<any>[] = [
  // ... other columns
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => (
      // ✅ Uses DDS Badge, consistent styling, token-based colors
      <DataTableBadge
        status={row.status}
        mapping={PARTNER_STATUS_MAP}
      />
    ),
    width: '120px',
  },
  {
    id: 'actions',
    header: 'Actions',
    accessor: (row) => (
      // ✅ Standardized actions with tooltips, overflow menu, RBAC built-in
      <DataTableActions
        actions={partnerActions}
        row={row}
        user={user}
        maxVisible={2}  // Shows 2 buttons + "More" dropdown
        align="right"
      />
    ),
    width: '120px',  // ✅ Narrower - more space efficient
    sticky: 'right',
  },
]

// ✅ Automatically responsive - switches to cards on mobile
<DataTable
  data={flattenedPartners}
  columns={columns}
  getRowId={(row) => row.id}
  loading={isLoading}
  stickyHeader
  hoverable
  bordered
  responsive="auto"
  mobileCardTemplate={(row) => (
    <PartnerMobileCard
      partner={row}
      statusMapping={PARTNER_STATUS_MAP}
      actions={partnerActions}
      user={user}
    />
  )}
/>
```

---

## 📱 Mobile Experience (NEW)

### Auto-Generated Mobile Card
```tsx
// Automatically shown when screen < 768px
<PartnerMobileCard>
  <Card>
    {/* Header */}
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-50">
          <Building2 className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-primary">Acme Corp</h3>
          <p className="text-sm text-secondary">John Doe</p>
        </div>
      </div>
      <DataTableBadge status="active" mapping={PARTNER_STATUS_MAP} />
    </div>

    {/* Details Grid */}
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        <p className="text-xs text-secondary">Tier</p>
        <p className="text-sm font-medium">Premium</p>
      </div>
      <div>
        <p className="text-xs text-secondary">Leads</p>
        <p className="text-sm font-medium">156</p>
      </div>
      <div>
        <p className="text-xs text-secondary">Conversion</p>
        <p className="text-sm font-medium">12.5%</p>
      </div>
      <div>
        <p className="text-xs text-secondary">Revenue</p>
        <p className="text-sm font-medium">$45,200</p>
      </div>
    </div>

    {/* Actions */}
    <div className="mt-4 pt-4 border-t border-default">
      <DataTableActions
        actions={partnerActions}
        row={partner}
        user={user}
        layout="horizontal"  // Mobile layout
        size="lg"           // Larger touch targets
      />
    </div>
  </Card>
</PartnerMobileCard>
```

---

## 📊 Code Reduction

### Lines of Code
- **Before**: ~120 lines for status + actions
- **After**: ~40 lines for status + actions
- **Saved**: **67% reduction** ✅

### Maintenance
- **Before**: Change status colors → Update 4 places (Hierarchy, Tenants, Partners, Leads)
- **After**: Change status colors → Update 1 place (`PARTNER_STATUS_MAP`)

### Consistency
- **Before**: Each page has different action button spacing, tooltips, icons
- **After**: All pages use same `DataTableActions` component

---

## 🎯 Real-World Usage Comparison

### Status Badges Across All Pages

#### Before (Inconsistent)
```tsx
// HierarchyPage.tsx
<span className="bg-green-100 text-green-800">active</span>

// TenantRequestsPage.tsx
<span className="bg-yellow-100 text-yellow-800">
  <ClockIcon className="w-3 h-3 mr-1" />
  Submitted
</span>

// LeadsPage.tsx
<Badge variant="success">Active</Badge>

// ❌ Different everywhere, hardcoded colors, no pattern
```

#### After (Consistent)
```tsx
// ALL pages use the same pattern
<DataTableBadge status={row.status} mapping={STATUS_MAP} />

// ✅ Consistent everywhere, token-based, standardized
```

---

## 💰 Value Proposition

### For Developers
- **Faster development** - Copy/paste standard patterns
- **Less code** - Reusable components
- **Fewer bugs** - Consistent behavior

### For Users
- **Better UX** - Mobile-optimized automatically
- **Consistency** - Same interactions everywhere
- **Accessibility** - Built-in tooltips, keyboard nav

### For Design System
- **Maintainable** - Change once, update everywhere
- **Token-based** - All values from design system
- **Documented** - Clear patterns in Storybook

---

## 🚀 Migration Path

### Step 1: Add New Components (No Breaking Changes)
```bash
# New exports from @adrozdenko/design-system
- DataTableActions
- DataTableBadge
- DataTableMobileCard
- DataTableFilters
```

### Step 2: Migrate One Page
Start with **TenantRequestsPage** (simplest)
- Replace status badges → `DataTableBadge`
- Replace action buttons → `DataTableActions`
- Add `responsive="auto"`
- Test on mobile

### Step 3: Migrate Remaining Pages
- HierarchyPage
- PartnersPage
- LeadsPage
- InvoicesPage

### Step 4: Remove Old Patterns
- Delete `getStatusColor()` functions
- Delete custom action button code
- Update documentation

---

## ✅ Decision: Composition Over Configuration

This approach gives us:
1. **Flexibility** - Customize when needed
2. **Simplicity** - Simple by default
3. **Consistency** - Standard patterns
4. **No Overengineering** - Only what's needed

**The key**: Small, focused components that compose together naturally.
