# Clean Code Rules (Uncle Bob's A+ Standard)

**Philosophy: Code that reads like prose. Functions that do one thing. No surprises.**

## Grading Rubric

Every component/module should pass this rubric to be production-ready:

| Category | A+ Standard |
|----------|-------------|
| **Naming** | Names express intent. No abbreviations. No mental mapping required. |
| **Function Design** | Each function does ONE thing. <20 lines ideal. Extract when >30. |
| **Comments** | JSDoc for public APIs. Design notes for WHY. No apologetic comments. |
| **Structure** | Logical top-to-bottom flow. Helpers first, then main component. |
| **Error Handling** | No silent failures. Users see feedback. Structured error returns. |
| **Cleanliness** | No magic numbers. No duplication. No dead code. |
| **SOLID** | Single Responsibility. Open for extension. Clear abstractions. |

---

## File Size Limits

| File Type | Lines | Action If Exceeded |
|-----------|-------|-------------------|
| Component | <300 | Extract sub-components |
| Dialog | <400 | Extract content sections |
| Types file | <400 | Move utilities to utils.ts |
| Utils file | <150 | Split by domain |

**God File Rule**: Any file >500 lines is a "God File" - split immediately.

---

## Function Design

### Single Responsibility

```tsx
// ❌ Function doing too much
function processField(key, prop, required) {
  const extended = prop as ExtendedType
  const title = prop.title || key
  const type = prop.type || 'string'
  // ... 30 more lines of mapping
  return { name, title, type, ... }
}

// ✅ Extract to named helper
function parseSchemaField(key, prop, isRequired): ParsedSchemaField {
  const extended = prop as ExtendedSchemaProperty
  return {
    name: key,
    title: prop.title || key,
    type: prop.type || 'string',
    isRequired,
    // ... clean property extraction
  }
}
```

### Extract Triggers

| Signal | Action |
|--------|--------|
| Function >30 lines | Extract helper function |
| Repeated calculation | Extract to memoized variable |
| Same logic in 2+ places | Extract shared utility |
| Complex conditional | Extract to named function |

---

## Error Handling

### No Silent Failures

```tsx
// ❌ Silent failure - user has no idea it failed
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(text)
    setCopied(true)
  } catch (err) {
    console.error('Failed to copy:', err) // Only devs see this
  }
}

// ✅ Visible feedback for success AND failure
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setCopyError(false)
    setTimeout(() => setCopied(false), 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
    setCopyError(true) // User sees error icon
    setTimeout(() => setCopyError(false), 2000)
  }
}
```

### Structured Error Returns

```tsx
// ✅ Validation with structured return
function validateTemplateName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim()

  if (trimmed.length < 5) {
    return { valid: false, error: 'Name must be at least 5 characters' }
  }

  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return { valid: false, error: 'Name must contain only letters and spaces' }
  }

  return { valid: true }
}
```

---

## Constants & Magic Numbers

### Forbidden

```tsx
// ❌ Magic numbers
if (window.innerWidth < 1024) { ... }
if (name.length >= 5) { ... }
setTimeout(() => {}, 2000)

// ✅ Named constants
import { BREAKPOINTS } from '@/constants/appConstants'
import { validateTemplateName } from './utils'

if (window.innerWidth < BREAKPOINTS.LG) { ... }
if (validateTemplateName(name).valid) { ... }
setTimeout(() => {}, FEEDBACK_DURATION_MS)
```

### Constant Location

| Constant Type | Location |
|---------------|----------|
| App-wide (breakpoints, z-index) | `src/constants/appConstants.ts` |
| Module-specific | `module/constants.ts` or top of file |
| Validation rules | Inside validation function |

---

## File Organization

### Types vs Utils Separation

```
module/
├── types.ts      # Type definitions, interfaces, constants
├── utils.ts      # Pure utility functions
├── index.ts      # Barrel exports
└── components/   # React components
```

**Rule**: types.ts defines shapes. utils.ts transforms data. Keep them separate.

```tsx
// types.ts - re-export for backwards compatibility
export {
  validateTemplateName,
  formatJson,
} from './utils'
```

### Component Extraction

| Signal | Extract To |
|--------|------------|
| Repeated JSX block | Sub-component in same file |
| Reusable form fields | `form-components/` folder |
| View-specific display | `view-components/` folder |
| Shared across dialogs | Parent `components/` folder |

---

## Component Structure

### Internal Sub-Components

When a component has multiple render modes (mobile/desktop, states), use internal sub-components:

```tsx
// ✅ Clean internal structure
interface MobileContentProps {
  template: Template
  schema: JSONSchema
}

function MobileContent({ template, schema }: MobileContentProps) {
  return (/* mobile-specific JSX */)
}

function DesktopContent({ template, schema, onClose }: DesktopContentProps) {
  return (/* desktop-specific JSX */)
}

export function ViewTemplateDialog({ template, open, onOpenChange }) {
  const isMobile = useIsMobile(BREAKPOINTS.LG)

  if (isMobile) {
    return <Sheet><MobileContent {...} /></Sheet>
  }
  return <Dialog><DesktopContent {...} /></Dialog>
}
```

### Barrel Exports

```tsx
// components/view-components/index.ts
export { SchemaFieldsList } from './SchemaFieldsList'
export { EnhancedSchemaFields } from './EnhancedSchemaFields'
export { JsonSchemaViewer } from './JsonSchemaViewer'
```

---

## Documentation

### JSDoc for Public APIs

```tsx
/**
 * ViewTemplateDialog - Read-only view of entity template details
 *
 * Displays template configuration and visual schema preview.
 * Responsive: Full-screen sheet on mobile, centered dialog on desktop.
 *
 * @component MOLECULE
 * @testId Auto-generated: view-template-{element}-${template.id}
 */
```

### Design Notes for WHY

```tsx
/**
 * Design Note: This component handles two states (system rejection + delete confirm)
 * via internal sub-components (SystemTemplateContent, DeleteConfirmContent).
 * This is intentional - both states share the same dialog shell and responsive
 * behavior, making extraction premature. Split only if requirements diverge.
 */
```

### When to Document

| Document | Don't Document |
|----------|----------------|
| Public component purpose | Implementation details |
| Design decisions (WHY) | What code does (readable code) |
| Complex algorithms | Simple functions |
| Deprecation warnings | Obvious behavior |

---

## Refactoring Checklist

Before PR, verify:

| Check | Command/Action |
|-------|----------------|
| No dead code | Search for unused imports/functions |
| No magic numbers | Grep for hardcoded values |
| No silent errors | Check all catch blocks have UI feedback |
| Functions <30 lines | Review function lengths |
| Files <300 lines | Check file sizes |
| Memoized calculations | Repeated `.filter()`, `.map()` in render |
| Named constants | Numbers/strings used multiple times |
| Types separated | utils.ts for functions, types.ts for shapes |

---

## Anti-Patterns

### Dead Code
```tsx
// ❌ Remove completely - don't comment out
// function _oldFormatDateTime() { ... }
const _unusedVariable = 'delete me'
```

### Duplicated Validation
```tsx
// ❌ Duplicated logic
if (name.trim().length >= 5) { ... }  // in component A
if (name.trim().length >= 5) { ... }  // in component B

// ✅ Single source of truth
if (validateTemplateName(name).valid) { ... }
```

### Repeated Calculations
```tsx
// ❌ Recalculates on every render
<span>{fields.filter(f => f.isRequired).length} required</span>

// ✅ Memoized
const requiredCount = React.useMemo(
  () => fields.filter(f => f.isRequired).length,
  [fields]
)
<span>{requiredCount} required</span>
```

---

## Quick Reference

### File Size Targets

| Size | Status | Action |
|------|--------|--------|
| <200 lines | Ideal | Maintain |
| 200-300 lines | Acceptable | Monitor |
| 300-400 lines | Warning | Plan extraction |
| >400 lines | Critical | Extract now |

### Function Size Targets

| Size | Status | Action |
|------|--------|--------|
| <15 lines | Ideal | Maintain |
| 15-25 lines | Acceptable | Monitor |
| 25-35 lines | Warning | Consider extraction |
| >35 lines | Critical | Extract immediately |

### Naming Conventions

| Thing | Convention | Example |
|-------|------------|---------|
| Component | PascalCase | `TemplateConfigSection` |
| Helper function | camelCase, verb | `parseSchemaField`, `formatJson` |
| Constant | SCREAMING_SNAKE | `BREAKPOINTS`, `FEEDBACK_DURATION_MS` |
| Type/Interface | PascalCase | `ParsedSchemaField` |
| Boolean | is/has/should prefix | `isRequired`, `hasFields` |

---

## The Goal

> "This code reflects craftsmanship. It can be maintained by someone who did not write it."
> — Uncle Bob

**Ship code that reads like prose. Functions that tell stories. No surprises.**
