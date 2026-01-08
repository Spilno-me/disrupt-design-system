# UX Laws Reference

**Source:** [lawsofux.com](https://lawsofux.com)

---

## Core Laws

| Law | Rule | Value |
|-----|------|-------|
| **Fitts** | Target size + distance | `min-h-11` (44px mobile) |
| **Hick** | Decision time ∝ options | 5-7 max |
| **Miller** | Working memory | 7±2 items |
| **Doherty** | Response time | <400ms or spinner |
| **Von Restorff** | Isolation effect | Primary = distinct |
| **Jakob** | Mental models | Follow conventions |

---

## Gestalt (Grouping)

| Principle | Meaning | Token |
|-----------|---------|-------|
| Proximity | Close = related | `gap-2` in, `gap-6` out |
| Similarity | Same = related | Consistent style |
| Common Region | Bounded = grouped | Cards, borders |
| Prägnanz | Simple preferred | Reduce noise |

---

## By Component

| Component | Laws | Requirements |
|-----------|------|--------------|
| **Button** | Fitts, Von Restorff | 44px touch, primary distinct, green=feedback only |
| **Form** | Miller, Chunking | 5-7 fields, grouped sections |
| **Nav** | Hick, Serial Position | ≤7 items, key at start/end |
| **Modal** | Fitts, Cognitive Load | Reachable close, single purpose |
| **List** | Miller, Proximity | 7 visible, grouped items |
| **Loading** | Doherty, Zeigarnik | >400ms spinner, show progress |

---

## Tokens

```
Touch:    min-h-11 (44px) | min-h-8 (32px desktop)
Spacing:  gap-2 (in-group) | gap-6 (between) | gap-12 (sections)
Timing:   <100ms instant | >400ms spinner | >1s progress
```

---

## Action Overflow Rule (CRITICAL)

**≤3 actions = Visible buttons | ≥4 actions = Overflow menu**

| Actions | Display | Rationale |
|---------|---------|-----------|
| 1-3 | Individual buttons | Quick scan, immediate access |
| 4+ | ActionSheet/DropdownMenu | Hick's Law - reduce decision load |

```tsx
// ❌ WRONG: 3 actions in menu (hiding unnecessarily)
<ActionSheet>
  <ActionSheetItem>Edit</ActionSheetItem>
  <ActionSheetItem>Copy</ActionSheetItem>
  <ActionSheetItem>Delete</ActionSheetItem>
</ActionSheet>

// ✅ CORRECT: 3 actions as buttons
<ActionTile variant="info">Edit</ActionTile>
<ActionTile variant="neutral">Copy</ActionTile>
<ActionTile variant="destructive">Delete</ActionTile>

// ✅ CORRECT: 4+ actions in menu
<ActionSheet>
  <ActionSheetItem>Edit</ActionSheetItem>
  <ActionSheetItem>Copy</ActionSheetItem>
  <ActionSheetItem>Share</ActionSheetItem>
  <ActionSheetItem>Archive</ActionSheetItem>
  <ActionSheetItem variant="destructive">Delete</ActionSheetItem>
</ActionSheet>
```

---

## Button Color Semantics (CRITICAL)

**Primary for action, Green for confirmation.**

| Color | Use For | NOT For |
|-------|---------|---------|
| **Primary (dark)** | Main CTA, Save, Submit, Confirm | Success states |
| **Green (success)** | Success feedback, status badges, completion | Action buttons |
| **Red (error)** | Destructive actions (Delete, Remove) | Warnings |
| **Outline/Ghost** | Secondary actions, Cancel, Back | Primary CTA |

### Why Primary for "Save" (not green)

1. **Green fatigue** - If every positive button is green, users develop "green blindness"
2. **Reserve green for feedback** - Success toast after save has more impact when button wasn't green
3. **Hierarchy > Semantics** - Filled vs outline already signals primary vs secondary
4. **Industry convention** - Apple, Google, Figma use brand color for main CTA

### Color Decision Tree

```
Is it destructive (delete, remove)?
├─ Yes → variant="destructive" (red)
└─ No → Is it the primary action?
         ├─ Yes → variant="default" (primary/dark)
         └─ No → Is it secondary/escape?
                  ├─ Yes → variant="outline" or "ghost"
                  └─ No → variant="secondary"
```

### Green Usage (Correct)

```tsx
// ✅ Success feedback after action
<Toast variant="success">Changes saved successfully</Toast>

// ✅ Status indicators
<Badge variant="success">Active</Badge>
<Badge variant="success">Connected</Badge>

// ✅ Completion states
<Icon className="text-success" /> Task complete
```

### Green Usage (Incorrect)

```tsx
// ❌ WRONG: Green for action buttons
<Button variant="success">Save Changes</Button>
<Button className="bg-success">Submit</Button>

// ✅ CORRECT: Primary for action buttons
<Button variant="default">Save Changes</Button>
<Button>Submit</Button>
```

---

## Permission-Based Button Visibility (CRITICAL)

**Disable don't hide. No gaps. All or nothing.**

### Rules

| Scenario | Action | Why |
|----------|--------|-----|
| User lacks permission for ONE action | **Disable** the button | Maintains layout, teaches capability exists |
| User lacks permission for ALL actions | **Remove** entire group | Don't show what user can't use |
| Mixed permissions in group | **Disable** unavailable, show available | No gaps/holes |

### Decision Tree

```
Does user have permission for ANY action in group?
├─ No → Remove entire action group (user shouldn't see admin controls)
└─ Yes → For each action:
          ├─ Has permission → Show enabled
          └─ No permission → Show DISABLED (not hidden)
```

### Visual Examples

```tsx
// ✅ CORRECT: Mixed permissions - disable unavailable
<Button>View</Button>           {/* Has permission */}
<Button>Edit</Button>           {/* Has permission */}
<Button disabled>Delete</Button> {/* No permission - DISABLED not hidden */}

// ❌ WRONG: Hiding creates gaps
<Button>View</Button>
<Button>Edit</Button>
{/* Delete hidden - creates visual gap! */}

// ❌ WRONG: Empty placeholder
<Button>View</Button>
<Button>Edit</Button>
<div className="w-10" /> {/* Invisible spacer - confusing */}

// ✅ CORRECT: No permissions at all - remove group
{canPerformAnyAction && (
  <div className="flex gap-2">
    <Button disabled={!canView}>View</Button>
    <Button disabled={!canEdit}>Edit</Button>
    <Button disabled={!canDelete}>Delete</Button>
  </div>
)}
```

### Implementation Pattern

```tsx
// Check if user can see the action group at all
const hasAnyPermission = canView || canEdit || canDelete

// Only render if user has at least one permission
{hasAnyPermission && (
  <ActionGroup>
    <Button disabled={!canView}>View</Button>
    <Button disabled={!canEdit}>Edit</Button>
    <Button disabled={!canDelete} variant="destructive">Delete</Button>
  </ActionGroup>
)}
```

### Why This Matters

1. **Consistent layout** - Buttons stay in predictable positions (Fitts's Law)
2. **Discoverability** - Users learn what actions exist even if unavailable
3. **No confusion** - Gaps make users think UI is broken
4. **Security by obscurity is bad** - Hiding buttons doesn't add security
5. **Clear feedback** - Disabled state + tooltip explains why unavailable

### Tooltip on Disabled

Always explain WHY a button is disabled:

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button disabled={!canDelete}>Delete</Button>
  </TooltipTrigger>
  <TooltipContent>
    {canDelete ? 'Delete this item' : 'You need admin permissions to delete'}
  </TooltipContent>
</Tooltip>
```

---

## Red Flags

| Signal | Fix |
|--------|-----|
| >7 nav items | Progressive disclosure |
| Touch <44px | `min-h-11 min-w-11` |
| No loading | Skeleton/spinner |
| Wall of text | Chunk into sections |
| Same-style buttons | Visual hierarchy |
| >7 form fields | Multi-step |
| 3 actions in menu | Show as buttons |
| >3 visible actions | Move to overflow menu |
| Green "Save" button | Use primary (dark) |
| Hidden button = gap | Disable, don't hide |
| No permission tooltip | Explain why disabled |
