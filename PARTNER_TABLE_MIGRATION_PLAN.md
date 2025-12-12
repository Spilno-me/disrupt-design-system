# Partner Central - DataTable Migration Plan
## Complete Migration Strategy for Unified Table System

> **Based on comprehensive analysis of:**
> `/Users/adrozdenko/Documents/Partner/emex-x-prototype/services/partner-central/apps/frontend`

---

## 📊 Current State Summary

### Table Implementations Found: 7 Total

| Page | Implementation | Priority | Complexity |
|------|---------------|----------|------------|
| **HierarchyPage** | DDS DataTable | 🟡 Medium | ⭐⭐ Medium (hierarchical data) |
| **TenantRequestsPage** | DDS DataTable | 🟡 Medium | ⭐ Low (already good) |
| **LeadsDashboard** | Custom HTML Table | 🔴 High | ⭐⭐⭐ High (real-time updates) |
| **PartnerUsersPage** | Custom HTML Table | 🟡 Medium | ⭐ Low (simple dataset) |
| **LeadsPage** | DDS Wrapper | 🟢 Low | N/A (already unified) |
| **PartnersPage** | DDS Wrapper | 🟢 Low | N/A (already unified) |
| **InvoicesPage** | DDS Wrapper + Cards | 🟢 Low | N/A (cards appropriate) |

### Hardcoded Values Found: ~30+ Instances

- ❌ Status badge colors: `bg-green-100`, `text-green-800`, etc.
- ❌ Tier icon colors: `text-blue-600`, `bg-blue-50`
- ❌ Priority labels: `bg-red-100`, `bg-orange-100`
- ❌ Action button styling: custom gap, padding

---

## 🎯 Migration Strategy: 3-Phase Approach

### Phase 1: Foundation (Week 1)
**Goal:** Build unified components in DDS, zero breaking changes

#### Tasks:
1. ✅ **Create DataTableBadge** (Status indicator with token-based variants)
2. ✅ **Create DataTableActions** (Action buttons with overflow menu + RBAC)
3. ✅ **Create DataTableMobileCard** (Mobile-responsive card view)
4. ✅ **Enhance Badge** (Add success, warning, info variants)
5. ✅ **Build & Test** (Ensure TypeScript compilation)
6. ⬜ **Create Storybook Documentation** (Show all patterns)
7. ⬜ **Publish DDS v2.3.0** (New components available)

**Deliverables:**
- New DDS components exported and ready
- Comprehensive Storybook docs
- Migration examples documented

---

### Phase 2: Easy Wins (Week 2)
**Goal:** Migrate simple pages, establish patterns

#### Task 2.1: Migrate PartnerUsersPage ⭐ LOW COMPLEXITY
**Current:** Custom HTML table (130 lines)
**After:** DDS DataTable (~50 lines)

**Benefits:**
- 60% code reduction
- Adds consistency with other pages
- Future-ready for sorting/filtering
- Better accessibility

**Migration Steps:**
1. Define columns using `ColumnDef<PartnerUser>[]`
2. Replace `getStatusColor()` with `<DataTableBadge mapping={USER_STATUS_MAP} />`
3. Replace action buttons with `<DataTableActions />`
4. Add `loading` and `emptyState` props
5. Test RBAC: password reset, user deletion

**Before:**
```tsx
<table className="min-w-full divide-y divide-gray-200">
  // Custom HTML with hardcoded colors
</table>
```

**After:**
```tsx
const USER_STATUS_MAP = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'secondary', label: 'Inactive' }
}

const actions = [
  { id: 'reset', label: 'Reset Password', icon: Key, onClick: handleReset },
  { id: 'remove', label: 'Remove', icon: Trash, variant: 'destructive', onClick: handleRemove, requires: 'admin' }
]

<DataTable
  data={users}
  columns={[
    { id: 'email', header: 'Email', accessor: (row) => row.email },
    { id: 'status', header: 'Status', accessor: (row) => <DataTableBadge status={row.status} mapping={USER_STATUS_MAP} /> },
    { id: 'actions', header: 'Actions', accessor: (row) => <DataTableActions actions={actions} row={row} /> }
  ]}
  getRowId={(row) => row.id}
/>
```

**Estimated Time:** 2-3 hours
**Risk:** Low
**Testing:** Manual testing of password reset, user removal flows

---

#### Task 2.2: Refactor TenantRequestsPage ⭐ LOW COMPLEXITY
**Current:** DDS DataTable with hardcoded badge colors
**After:** DDS DataTable with unified badge component

**Changes:**
1. Remove `getStatusBadge()` function (59 lines)
2. Add `TENANT_REQUEST_STATUS_MAP` constant
3. Use `<DataTableBadge />`
4. Use `<DataTableActions />` with `showWhen` for approval actions

**Before (Lines 59-85):**
```tsx
function getStatusBadge(status: string) {
  const styles = { draft: 'bg-gray-100 text-gray-800', ... }
  const icons = { draft: PencilIcon, ... }
  return <span className={...}>...</span>
}
```

**After (Lines 59-65):**
```tsx
const TENANT_STATUS_MAP = {
  draft: { variant: 'secondary', label: 'Draft', icon: PencilIcon },
  submitted: { variant: 'warning', label: 'Submitted', icon: ClockIcon },
  provisioning: { variant: 'info', label: 'Provisioning', icon: CalendarIcon },
  completed: { variant: 'success', label: 'Completed', icon: CheckCircleIcon },
  failed: { variant: 'destructive', label: 'Failed', icon: XCircleIcon },
}
```

**Benefits:**
- 76% code reduction for status badges
- Token-based colors
- Reusable across other components
- Standard DDS pattern

**Estimated Time:** 1-2 hours
**Risk:** Very Low
**Testing:** Verify all status states render correctly

---

### Phase 3: Complex Migrations (Week 3)

#### Task 3.1: Migrate LeadsDashboard ⭐⭐⭐ HIGH COMPLEXITY
**Current:** Custom HTML table with real-time updates
**After:** DDS DataTable with unified components

**Complexity Factors:**
- 9 different lead statuses (NEW, ASSIGNED, CONTACTED, etc.)
- 4 priority levels (LOW, MEDIUM, HIGH, URGENT)
- Real-time polling (30s interval)
- Custom lead detail modal
- Marketplace lead identification
- Custom filtering logic

**Migration Approach:**

1. **Status Mappings (Create constants)**
```tsx
const LEAD_STATUS_MAP: StatusMapping = {
  NEW: { variant: 'info', label: 'New', icon: Sparkles },
  ASSIGNED: { variant: 'warning', label: 'Assigned', icon: UserCheck },
  CONTACTED: { variant: 'info', label: 'Contacted', icon: Phone },
  QUALIFIED: { variant: 'info', label: 'Qualified', icon: CheckCircle },
  PROPOSAL_SENT: { variant: 'warning', label: 'Proposal Sent', icon: FileText },
  NEGOTIATION: { variant: 'warning', label: 'Negotiation', icon: MessageSquare },
  CLOSED_WON: { variant: 'success', label: 'Closed Won', icon: Trophy },
  CLOSED_LOST: { variant: 'destructive', label: 'Closed Lost', icon: XCircle },
  NURTURING: { variant: 'secondary', label: 'Nurturing', icon: Heart },
}

const LEAD_PRIORITY_MAP: StatusMapping = {
  LOW: { variant: 'secondary', label: 'Low' },
  MEDIUM: { variant: 'info', label: 'Medium' },
  HIGH: { variant: 'warning', label: 'High' },
  URGENT: { variant: 'destructive', label: 'Urgent' },
}
```

2. **Define Actions**
```tsx
const leadActions: ActionItem[] = [
  {
    id: 'view',
    label: 'View Details',
    icon: Eye,
    onClick: (lead) => setSelectedLead(lead),
  },
  {
    id: 'assign',
    label: 'Assign to Me',
    icon: UserCheck,
    onClick: handleAssign,
    showWhen: (lead) => lead.status === 'NEW',
  },
  {
    id: 'contact',
    label: 'Mark Contacted',
    icon: Phone,
    onClick: handleContact,
    showWhen: (lead) => lead.status === 'ASSIGNED',
  },
  {
    id: 'qualify',
    label: 'Mark Qualified',
    icon: CheckCircle,
    onClick: handleQualify,
    showWhen: (lead) => lead.status === 'CONTACTED',
  },
  {
    id: 'close-won',
    label: 'Close as Won',
    icon: Trophy,
    variant: 'accent',
    onClick: handleCloseWon,
    confirm: 'Mark this lead as closed won?',
  },
  {
    id: 'close-lost',
    label: 'Close as Lost',
    icon: XCircle,
    variant: 'destructive',
    onClick: handleCloseLost,
    confirm: 'Mark this lead as closed lost?',
  },
]
```

3. **Replace Table Rendering**
```tsx
// Before (200+ lines of custom HTML)
<table className="min-w-full divide-y divide-gray-200">...</table>

// After (50 lines with DDS DataTable)
<DataTable
  data={leads}
  columns={[
    { id: 'contact', header: 'Contact', accessor: (row) => row.contactName },
    { id: 'company', header: 'Company', accessor: (row) => row.companyName },
    { id: 'status', header: 'Status', accessor: (row) => <DataTableBadge status={row.status} mapping={LEAD_STATUS_MAP} /> },
    { id: 'priority', header: 'Priority', accessor: (row) => <DataTableBadge status={row.priority} mapping={LEAD_PRIORITY_MAP} /> },
    { id: 'value', header: 'Value', accessor: (row) => formatCurrency(row.estimatedValue), align: 'right' },
    { id: 'source', header: 'Source', accessor: (row) => row.source },
    { id: 'created', header: 'Created', accessor: (row) => formatDate(row.createdAt) },
    { id: 'actions', header: 'Actions', accessor: (row) => <DataTableActions actions={leadActions} row={row} maxVisible={2} />, sticky: 'right' }
  ]}
  getRowId={(row) => row.id}
  onRowClick={(lead) => setSelectedLead(lead)}
  stickyHeader
  hoverable
  bordered
/>
```

4. **Keep Real-Time Logic**
```tsx
// Keep existing polling - just update data
useEffect(() => {
  const interval = setInterval(async () => {
    const updated = await fetchLeads()
    setLeads(updated)
  }, 30000)
  return () => clearInterval(interval)
}, [])
```

**Estimated Time:** 6-8 hours
**Risk:** Medium (critical feature, needs thorough testing)
**Testing:**
- All lead status transitions
- Real-time updates still work
- Filters still function
- Modal integration intact
- Mobile responsiveness

---

#### Task 3.2: Polish HierarchyPage ⭐⭐ MEDIUM COMPLEXITY
**Current:** DDS DataTable with hardcoded colors
**Goal:** Use design tokens consistently

**Changes Required:**

1. **Replace Status Badge Colors**
```tsx
// Before
const getStatusColor = (status: string) => ({
  active: 'bg-green-100 text-green-800',
  // ...hardcoded
});

// After
const PARTNER_STATUS_MAP = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'secondary', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  suspended: { variant: 'destructive', label: 'Suspended' },
}

// In column accessor
<DataTableBadge status={row.status} mapping={PARTNER_STATUS_MAP} />
```

2. **Replace Tier Icon Colors**
```tsx
// Before (Lines 323-328 - hardcoded blue colors)
<div className={`p-2 rounded-lg flex-shrink-0 ${
  isSubPartner ? 'bg-blue-100' : 'bg-blue-50'
}`}>
  <TierIcon className={`h-4 w-4 ${
    isSubPartner ? 'text-blue-700' : 'text-blue-600'
  }`} />
</div>

// After (use design tokens)
<div className={cn(
  "p-2 rounded-lg flex-shrink-0",
  isSubPartner ? "bg-info/20" : "bg-info/10"
)}>
  <TierIcon className={cn(
    "h-4 w-4",
    isSubPartner ? "text-info" : "text-info/80"
  )} />
</div>
```

3. **Replace Sub-Partner Badge Colors**
```tsx
// Before (Lines 335-343)
<span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
  Sub-partner
</span>
<span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
  {row.children.length}
</span>

// After (use DDS Badge)
<Badge variant="info" size="sm">
  Sub-partner
</Badge>
<Badge variant="success" size="sm">
  {row.children.length}
</Badge>
```

4. **Refactor Actions Column** (Optional but Recommended)
```tsx
// Before (Lines 426-471 - 45 lines of conditional action buttons)

// After (15 lines with DataTableActions)
const hierarchyActions: ActionItem[] = [
  {
    id: 'view',
    label: 'View/Edit',
    icon: Eye,
    onClick: (row) => { setSelectedPartner(row.id); setShowModal(true); },
    showWhen: (row, user) => canEdit(row, user),
  },
  {
    id: 'add-sub',
    label: 'Add Sub-Partner',
    icon: Plus,
    onClick: (row) => { setAddPartnerParent(row.id); setShowModal(true); },
  },
  {
    id: 'more',
    label: 'More Options',
    icon: MoreHorizontal,
    onClick: () => {},  // Placeholder for future actions
  },
]

// In column accessor
<DataTableActions actions={hierarchyActions} row={row} user={user} maxVisible={3} />
```

**Code Reduction:**
- Status badge: 10 lines → 1 line
- Actions column: 45 lines → 15 lines
- **Total Savings:** 39 lines (~32%)

**Estimated Time:** 3-4 hours
**Risk:** Low (non-breaking refactor)
**Testing:** Verify all expand/collapse, action buttons, RBAC still works

---

### Phase 4: Documentation & Rollout (Week 4)

#### Task 4.1: Update Partner Central Documentation
1. Create `DATA_TABLE_PATTERNS.md` in Partner Central docs
2. Document standard status mappings
3. Document standard action patterns
4. Show mobile-responsive examples

#### Task 4.2: Team Training
1. Demo unified DataTable system in team meeting
2. Show before/after code comparison
3. Share Storybook link for reference

---

## 📋 Detailed Migration Checklist

### HierarchyPage Migration

- [ ] **Create status mapping constant**
  ```tsx
  const PARTNER_STATUS_MAP = { ... }
  ```

- [ ] **Replace status badge in column accessor**
  ```tsx
  accessor: (row) => <DataTableBadge status={row.status} mapping={PARTNER_STATUS_MAP} />
  ```

- [ ] **Replace tier icon colors with tokens**
  ```tsx
  className={cn("bg-info/10 text-info")}
  ```

- [ ] **Replace sub-partner badge with DDS Badge**
  ```tsx
  <Badge variant="info" size="sm">Sub-partner</Badge>
  ```

- [ ] **Replace action buttons with DataTableActions** (Optional)
  ```tsx
  accessor: (row) => <DataTableActions actions={hierarchyActions} row={row} user={user} />
  ```

- [ ] **Test all functionality**
  - [ ] Partner status displays correctly
  - [ ] Expand/collapse works
  - [ ] Add sub-partner flow
  - [ ] Edit partner flow
  - [ ] RBAC permissions enforced
  - [ ] Mobile view acceptable (or add mobileCardTemplate)

- [ ] **Update imports**
  ```tsx
  import { DataTableBadge, PARTNER_STATUS_MAP, Badge } from '@adrozdenko/design-system'
  ```

---

### TenantRequestsPage Migration

- [ ] **Create status mapping constant with icons**
  ```tsx
  const TENANT_STATUS_MAP = {
    draft: { variant: 'secondary', label: 'Draft', icon: PencilIcon },
    submitted: { variant: 'warning', label: 'Submitted', icon: ClockIcon },
    provisioning: { variant: 'info', label: 'Provisioning', icon: CalendarIcon },
    completed: { variant: 'success', label: 'Completed', icon: CheckCircleIcon },
    failed: { variant: 'destructive', label: 'Failed', icon: XCircleIcon },
  }
  ```

- [ ] **Remove getStatusBadge function** (lines 59-85)

- [ ] **Replace status column accessor**
  ```tsx
  accessor: (row) => <DataTableBadge status={row.status} mapping={TENANT_STATUS_MAP} showIcon />
  ```

- [ ] **Create actions array with conditional visibility**
  ```tsx
  const tenantActions: ActionItem[] = [
    { id: 'edit', label: 'Edit', icon: PencilIcon, onClick: handleView, showWhen: (row, user) => canEdit(row, user) },
    { id: 'approve', label: 'Approve', icon: CheckIcon, variant: 'accent', onClick: handleApprove, showWhen: (row) => row.status === 'submitted' },
    { id: 'reject', label: 'Reject', icon: XMarkIcon, onClick: handleReject, showWhen: (row) => row.status === 'submitted' },
    { id: 'delete', label: 'Delete', icon: TrashIcon, variant: 'destructive', onClick: handleDelete, requires: 'admin', confirm: true },
  ]
  ```

- [ ] **Replace actions column accessor**
  ```tsx
  accessor: (row) => <DataTableActions actions={tenantActions} row={row} user={user} maxVisible={2} />
  ```

- [ ] **Test all functionality**
  - [ ] All status badges render correctly
  - [ ] Approve/reject buttons show only for submitted requests
  - [ ] Delete button shows only for admins
  - [ ] Confirmation dialogs work
  - [ ] Navigation to detail page works
  - [ ] Pagination still functions

- [ ] **Update imports**
  ```tsx
  import { DataTableBadge, DataTableActions, type ActionItem } from '@adrozdenko/design-system'
  ```

---

### LeadsDashboard Migration

- [ ] **Create comprehensive status mappings**
  ```tsx
  const LEAD_STATUS_MAP = { NEW: {...}, ASSIGNED: {...}, ... } // 9 statuses
  const LEAD_PRIORITY_MAP = { LOW: {...}, MEDIUM: {...}, HIGH: {...}, URGENT: {...} }
  ```

- [ ] **Define lead actions with workflow**
  ```tsx
  const leadActions: ActionItem[] = [
    { id: 'view', label: 'View', icon: Eye, onClick: handleView },
    { id: 'assign', label: 'Assign to Me', icon: UserCheck, onClick: handleAssign, showWhen: (lead) => lead.status === 'NEW' },
    { id: 'contact', label: 'Mark Contacted', icon: Phone, onClick: handleContact, showWhen: (lead) => lead.status === 'ASSIGNED' },
    { id: 'qualify', label: 'Qualify', icon: CheckCircle, onClick: handleQualify, showWhen: (lead) => lead.status === 'CONTACTED' },
    { id: 'close-won', label: 'Close Won', icon: Trophy, variant: 'accent', onClick: handleCloseWon },
    { id: 'close-lost', label: 'Close Lost', icon: XCircle, variant: 'destructive', onClick: handleCloseLost },
  ]
  ```

- [ ] **Create columns with unified components**
  ```tsx
  const columns: ColumnDef<Lead>[] = [
    { id: 'contact', header: 'Contact', accessor: (row) => row.contactName, sortable: true },
    { id: 'company', header: 'Company', accessor: (row) => row.companyName, sortable: true },
    { id: 'status', header: 'Status', accessor: (row) => <DataTableBadge status={row.status} mapping={LEAD_STATUS_MAP} showIcon />, sortable: true },
    { id: 'priority', header: 'Priority', accessor: (row) => <DataTableBadge status={row.priority} mapping={LEAD_PRIORITY_MAP} />, sortable: true },
    { id: 'value', header: 'Estimated Value', accessor: (row) => formatCurrency(row.estimatedValue), align: 'right', sortable: true },
    { id: 'source', header: 'Source', accessor: (row) => row.source },
    { id: 'created', header: 'Created', accessor: (row) => formatDate(row.createdAt), sortable: true },
    { id: 'actions', header: 'Actions', accessor: (row) => <DataTableActions actions={leadActions} row={row} maxVisible={2} />, sticky: 'right' }
  ]
  ```

- [ ] **Replace custom table with DataTable**
  ```tsx
  <DataTable
    data={leads}
    columns={columns}
    getRowId={(row) => row.id}
    onRowClick={(lead) => setSelectedLead(lead)}
    loading={isLoading}
    stickyHeader
    hoverable
    bordered
  />
  ```

- [ ] **Keep real-time polling logic unchanged**

- [ ] **Comprehensive testing**
  - [ ] All 9 status badges display correctly
  - [ ] All 4 priority levels display correctly
  - [ ] Action buttons show/hide based on lead status
  - [ ] Real-time updates still work (30s polling)
  - [ ] Lead detail modal opens correctly
  - [ ] Sorting works on all sortable columns
  - [ ] Filters integrate properly
  - [ ] Mobile responsiveness

---

### PartnerUsersPage Migration

- [ ] **Create user status mapping**
  ```tsx
  const USER_STATUS_MAP = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'secondary', label: 'Inactive' },
  }
  ```

- [ ] **Define user actions**
  ```tsx
  const userActions: ActionItem[] = [
    {
      id: 'reset-password',
      label: 'Reset Password',
      icon: Key,
      onClick: (user) => handleResetPassword(user),
    },
    {
      id: 'remove',
      label: 'Remove User',
      icon: Trash2,
      variant: 'destructive',
      onClick: (user) => handleRemove(user),
      requires: 'admin',
      confirm: 'Remove this user from the partner organization?',
    },
  ]
  ```

- [ ] **Create columns**
  ```tsx
  const columns: ColumnDef<PartnerUser>[] = [
    { id: 'email', header: 'Login Account', accessor: (row) => <div className="font-medium text-primary">{row.email}</div> },
    { id: 'role', header: 'Role', accessor: (row) => row.role },
    { id: 'status', header: 'Status', accessor: (row) => <DataTableBadge status={row.status} mapping={USER_STATUS_MAP} /> },
    { id: 'created', header: 'Created', accessor: (row) => formatDate(row.createdAt), sortable: true },
    { id: 'actions', header: 'Actions', accessor: (row) => <DataTableActions actions={userActions} row={row} user={currentUser} />, align: 'right' }
  ]
  ```

- [ ] **Replace custom HTML table**
  ```tsx
  <DataTable
    data={users}
    columns={columns}
    getRowId={(row) => row.id}
    loading={isLoading}
    hoverable
    bordered
    emptyState={<CustomEmptyState />}
  />
  ```

- [ ] **Test functionality**
  - [ ] Password reset dialog opens
  - [ ] User removal confirmation works
  - [ ] RBAC enforced (only admins can remove)
  - [ ] Sorting by created date

---

## 🚀 Migration Execution Plan

### Week 1: Foundation Complete ✅
- [x] Create DataTableBadge
- [x] Create DataTableActions
- [x] Create DataTableMobileCard
- [x] Enhance Badge component
- [x] Build and test DDS
- [ ] Publish DDS v2.3.0

### Week 2: Easy Wins
**Monday-Tuesday:**
- Migrate PartnerUsersPage (2-3 hours)
- Test thoroughly

**Wednesday-Thursday:**
- Refactor TenantRequestsPage (1-2 hours)
- Test approval/rejection flows

**Friday:**
- Code review
- Documentation updates

### Week 3: Complex Migration
**Monday-Wednesday:**
- Migrate LeadsDashboard (6-8 hours)
- Extensive testing

**Thursday:**
- Polish HierarchyPage (3-4 hours)
- Test hierarchical features

**Friday:**
- Integration testing
- Bug fixes

### Week 4: Polish & Documentation
**Monday-Tuesday:**
- Update Partner Central docs
- Create migration guide for future tables

**Wednesday:**
- Team demo/training

**Thursday-Friday:**
- Buffer for issues/polish

---

## ⚠️ Risk Assessment

### Low Risk
- PartnerUsersPage (simple table, low traffic)
- TenantRequestsPage (already DDS, just refactoring)

### Medium Risk
- HierarchyPage (complex, but non-breaking refactor)

### High Risk
- LeadsDashboard (critical feature, real-time updates, complex state)

### Mitigation Strategies:
1. **Feature flags** - Enable new table behind flag, gradual rollout
2. **A/B testing** - Show old vs new to different users
3. **Comprehensive testing** - Test all workflows thoroughly
4. **Rollback plan** - Keep old code for 1 sprint before deletion

---

## 📊 Success Metrics

### Code Quality
- ✅ Zero hardcoded colors (100% token-based)
- ✅ 60%+ code reduction in table rendering
- ✅ Consistent patterns across all pages

### User Experience
- ✅ Mobile-responsive tables
- ✅ Consistent action button placement
- ✅ Consistent status badge styling
- ✅ Better accessibility (tooltips, keyboard nav)

### Developer Experience
- ✅ Faster feature development (copy/paste patterns)
- ✅ Easier maintenance (change once, update everywhere)
- ✅ Clear documentation (Storybook + guides)

---

## 🎯 Final Recommendation

### Immediate Actions:
1. **Publish DDS v2.3.0** with unified components
2. **Migrate PartnerUsersPage first** (prove the pattern works)
3. **Refactor TenantRequestsPage** (quick win)
4. **Plan LeadsDashboard carefully** (high value, high risk)

### Dependencies:
- DDS v2.3.0 must be published before migrations
- Testing environment for Partner Central
- QA signoff for LeadsDashboard changes

### Timeline:
- **Optimistic:** 2 weeks
- **Realistic:** 3 weeks
- **Conservative:** 4 weeks (includes buffer)

---

**Migration Plan Complete** ✅

Next Step: Review this plan, then publish DDS v2.3.0 and begin Phase 2 migrations.
