# Defensive Component Design Rules

## Purpose

Components MUST be resilient to malformed data from broken adapters. When data validation fails, show clear error states that tell consumers **"this is your adapter problem"** instead of crashing.

---

## Validation Level: ORGANISM Only

Defensive validation lives at the **ORGANISM** level, not atoms or molecules.

```
┌─────────────────────────────────────────────────────────────┐
│  ORGANISM (IncidentManagementTable)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  🛡️ VALIDATION LAYER                                   │ │
│  │  isValidSeverity(), isValidString(), isValidAge()      │ │
│  │  Shows DataError if invalid                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                 │
│           ┌───────────────┼───────────────┐                 │
│           ▼               ▼               ▼                 │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│    │ MOLECULE │    │ MOLECULE │    │ MOLECULE │            │
│    │ AgeBadge │    │StatusBadge│   │ Actions  │            │
│    └──────────┘    └──────────┘    └──────────┘            │
│           │               │               │                 │
│           ▼               ▼               ▼                 │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│    │  ATOMS   │    │  ATOMS   │    │  ATOMS   │            │
│    │  Badge   │    │  Badge   │    │  Button  │            │
│    └──────────┘    └──────────┘    └──────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### Why ORGANISM?

| Level | Role | Validation? |
|-------|------|-------------|
| **Atom** | Dumb, reusable, no domain knowledge | ❌ Trust props |
| **Molecule** | Combines atoms, still generic | ❌ Trust props |
| **Organism** | Domain-aware, API boundary | ✅ **Validate here** |

### Reasoning

**1. Organisms are the API boundary**
```tsx
// Consumer code - this is where external data enters DDS
<IncidentManagementTable data={incidentsFromAdapter} />
//                            ↑ untrusted external data
```

**2. Only organisms know the domain**
```tsx
// Atom doesn't know what "valid severity" means
<Badge>{value}</Badge>  // Just renders whatever you give it

// Organism knows the domain rules
const VALID_SEVERITIES = ["critical", "high", "medium", "low", "none"]
```

**3. Atoms should stay simple**
```tsx
// ❌ BAD: Atom with validation bloat
function Badge({ value }) {
  if (!isValidSeverity(value)) return <Error />  // Atom shouldn't know this
  return <span>{value}</span>
}

// ✅ GOOD: Atom is dumb
function Badge({ children }) {
  return <span>{children}</span>  // Just render
}
```

**4. Error messages need context**
```tsx
// At organism level, we can say:
"Invalid severity: Check your data adapter"

// At atom level, we'd only know:
"Invalid prop"  // Not helpful
```

### The Analogy

- **Atoms** = Kitchen utensils (knife doesn't check if food is fresh)
- **Molecules** = Cooking stations (grill doesn't validate ingredients)
- **Organism** = The chef (inspects ingredients before cooking, rejects bad ones)

---

## The Problem

When a consumer's data adapter is out of sync with the API:

```
API returns:     { severity: 2, reporter: { name: "John" } }
Adapter expects: { severity: "high", reporter: "John" }
Result:          Component crashes or shows garbage
```

## The Solution: Defensive Components

### 1. Validation Helpers

Every component handling external data MUST include validation:

```typescript
// ============== DEFENSIVE VALIDATION ==============

/** Valid values for typed fields */
const VALID_SEVERITIES = ["critical", "high", "medium", "low", "none"]

/** Type guard for severity */
function isValidSeverity(value: unknown): value is Severity {
  return typeof value === "string" && VALID_SEVERITIES.includes(value)
}

/** Type guard for valid strings (not [object Object]) */
function isValidString(value: unknown): value is string {
  return typeof value === "string" && !value.includes("[object")
}

/** Type guard for valid numbers (not NaN) */
function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value)
}
```

### 2. DataError Component

Create a reusable error indicator:

```tsx
function DataError({ value, field }: { value: unknown; field: string }) {
  const displayValue = typeof value === "object" ? "[object]" : String(value)
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-error bg-error-tint text-error text-xs font-mono"
      title={`Invalid ${field}: "${displayValue}" - Check your data adapter`}
    >
      <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
      {displayValue}
    </span>
  )
}
```

### 3. Apply in Render Logic

```tsx
// ❌ BAD: Crashes on invalid data
accessor: (row) => row.reporter.toLowerCase()

// ✅ GOOD: Shows error state on invalid data
accessor: (row) => {
  if (!isValidString(row.reporter)) {
    return <DataError value={row.reporter} field="reporter" />
  }
  return row.reporter
}
```

### 4. Safe Defaults in Callbacks

```tsx
// ❌ BAD: Crashes if severity is a number
sortValue: (row) => SORT_ORDER[row.severity]

// ✅ GOOD: Returns safe default
sortValue: (row) => isValidSeverity(row.severity)
  ? SORT_ORDER[row.severity]
  : 0
```

## Required Validation by Field Type

| Field Type | Validation | Error Display |
|------------|------------|---------------|
| Enum strings | `isValidX(value)` | Show raw value + warning |
| Free text | `isValidString(value)` | Show "[object]" + warning |
| Numbers | `isValidNumber(value)` | Show "NaN" + warning |
| Dates | `isValidDate(value)` | Show raw value + warning |
| Arrays | `Array.isArray(value)` | Show "[]" + warning |

## Error State Styling

| Token | Purpose |
|-------|---------|
| `border-error` | Error border color |
| `bg-error-tint` | Light error background |
| `text-error` | Error text color |
| `animate-pulse` | Visual indicator of problem |

## Consumer Message

The error state MUST communicate:
1. **What field** has invalid data
2. **What value** was received
3. **Where to fix** it (hint: "Check your data adapter")

## Testing

Test components with malformed data:

```tsx
// Test with wrong types
const brokenData = {
  severity: 2,                    // number instead of string
  reporter: { name: "John" },     // object instead of string
  ageDays: NaN,                   // NaN instead of number
  status: "OPEN",                 // wrong enum value
}

// Component should NOT crash
// Component SHOULD show DataError indicators
```

## Implementation Checklist

Before PR, verify:

- [ ] All external data fields have validation
- [ ] Invalid data shows DataError, not crashes
- [ ] Sort/filter callbacks handle invalid values
- [ ] Tooltips explain "Check your data adapter"
- [ ] Mobile views also validate data
- [ ] Tests include malformed data scenarios

## Key Insight

> **Components should be like good waiters:** If the kitchen sends out bad food (broken adapter), don't drop the plate and run away (crash). Show the customer the problem clearly (DataError) so they know to talk to the chef (fix their adapter).
