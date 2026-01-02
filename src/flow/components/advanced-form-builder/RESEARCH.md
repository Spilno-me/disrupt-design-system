# Advanced Form Builder - Research & Architecture

> Research findings and implementation roadmap for EHS-focused form building capabilities.

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [EHS Form Patterns](#ehs-form-patterns)
3. [Conditional Logic Patterns](#conditional-logic-patterns)
4. [Formily Integration](#formily-integration)
5. [UX Best Practices](#ux-best-practices)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Schema Extensions](#schema-extensions)
8. [Sources](#sources)

---

## Executive Summary

The Advanced Form Builder extends the basic Form Builder with features specifically designed for **Environmental Health & Safety (EHS)** applications. Key capabilities include:

- **Repeating sections** for multi-item inspections
- **Advanced conditional logic** with AND/OR conditions
- **Scoring fields** (pass/fail, risk matrices)
- **Section grouping** for complex form organization
- **Calculated fields** for automatic risk scoring

### Architecture Decision

| Aspect | Decision |
|--------|----------|
| **Base** | Copy of `form-builder/` |
| **Name** | `advanced-form-builder/` |
| **Formily** | Schema-compatible, no direct dependency |
| **Components** | DDS components with adapter pattern |

---

## EHS Form Patterns

### Inspection & Checklist Forms

Based on industry-leading EHS software (CheckProof, HSI, SafetyCulture):

| Pattern | Description | Implementation |
|---------|-------------|----------------|
| **Repeating Sections** | Inspect N hazards/items | `type: 'array'` with `items` |
| **Photo Attachments** | Evidence per item | Upload field in array items |
| **Scoring Systems** | Pass/fail, 1-5 ratings | Custom score field type |
| **Corrective Actions** | Triggered on failures | Conditional section visibility |
| **Signatures** | Verification capture | Canvas signature component |
| **Offline Support** | Field work capability | Consumer app responsibility |

### Common EHS Form Types

```
┌─────────────────────────────────────────────────────────────┐
│                    EHS FORM TYPES                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INSPECTIONS          INCIDENTS           COMPLIANCE        │
│  ─────────────        ─────────           ──────────        │
│  • Safety walkthrough • Accident report   • Permit forms    │
│  • Equipment check    • Near-miss         • Training logs   │
│  • PPE inspection     • Investigation     • Audit forms     │
│  • Fire safety        • Root cause        • Certifications  │
│                                                             │
│  ASSESSMENTS          OBSERVATIONS        MAINTENANCE       │
│  ───────────          ────────────        ───────────       │
│  • Risk assessment    • Behavior-based    • Work orders     │
│  • JSA/JHA forms      • Positive safety   • Asset tracking  │
│  • Ergonomic eval     • Hazard reports    • Calibration     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Scoring Patterns

```typescript
// Pass/Fail
{ 'x-score-type': 'pass-fail', enum: ['pass', 'fail', 'na'] }

// Rating Scale
{ 'x-score-type': 'rating', 'x-score-max': 5 }

// Risk Matrix (Likelihood × Severity)
{
  'x-score-type': 'risk-matrix',
  'x-score-dimensions': {
    likelihood: [1, 2, 3, 4, 5],
    severity: [1, 2, 3, 4, 5]
  }
}

// Weighted Scoring
{ 'x-score-weight': 2.5 }  // This field counts 2.5× in total
```

---

## Conditional Logic Patterns

### Basic Patterns (Already Supported)

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **Show/Hide Field** | Single field visibility | Show "Other" when selected |
| **Show/Hide Section** | Group visibility | PPE section for hazardous tasks |
| **Disable Field** | Prevent editing | Lock approved fields |

### Advanced Patterns (To Implement)

| Pattern | Description | Schema |
|---------|-------------|--------|
| **Multi-Condition AND** | All conditions must match | `conditions: [{...}, {...}], operator: 'AND'` |
| **Multi-Condition OR** | Any condition matches | `conditions: [{...}, {...}], operator: 'OR'` |
| **Nested Conditions** | Complex logic trees | `conditions: [{ conditions: [...] }]` |
| **Page Branching** | Skip pages based on answers | `x-page-condition` |
| **Conditional Validation** | Dynamic required rules | `x-validator` with conditions |
| **Calculated Fields** | Auto-computed values | `x-calculate: '{{field1 * field2}}'` |

### Condition Operators

```typescript
type ConditionOperator =
  | 'equals'          // field === value
  | 'notEquals'       // field !== value
  | 'hasValue'        // !!field
  | 'isEmpty'         // !field
  | 'contains'        // field.includes(value)
  | 'greaterThan'     // field > value
  | 'lessThan'        // field < value
  | 'between'         // value1 <= field <= value2
  | 'matches'         // regex match
  | 'isOneOf';        // field in [values]
```

### Condition Group Structure

```typescript
interface ConditionGroup {
  operator: 'AND' | 'OR';
  conditions: (Condition | ConditionGroup)[];
}

interface Condition {
  field: string;      // Field path
  operator: ConditionOperator;
  value?: unknown;
  value2?: unknown;   // For 'between'
}
```

---

## Formily Integration

### Adapter Pattern

DDS components remain framework-agnostic. Consumer apps (Flow, EMEX) use adapters:

```typescript
// In consumer app (Flow)
import { createSchemaField, connect, mapProps } from '@formily/react';
import { Input, Select, Checkbox } from '@anthropic/dds-design-system';

// Adapt DDS components for Formily
const FormilyInput = connect(
  Input,
  mapProps({ value: true, onChange: true })
);

const FormilySelect = connect(
  Select,
  mapProps({
    value: true,
    // Map Formily's onChange to DDS's onValueChange
    onChange: (onChange) => (value) => onChange(value),
  })
);

const FormilyCheckbox = connect(
  Checkbox,
  mapProps({
    checked: 'value',
    onCheckedChange: 'onChange',
  })
);

// Register with schema field
const SchemaField = createSchemaField({
  components: {
    Input: FormilyInput,
    Select: FormilySelect,
    Checkbox: FormilyCheckbox,
    FormItem,
    // ... other components
  },
});
```

### x-reactions Schema

```typescript
// Active Linkage (field controls another)
{
  "fieldA": {
    "x-reactions": {
      "target": "fieldB",
      "when": "{{$self.value === 'yes'}}",
      "fulfill": {
        "state": { "visible": true }
      },
      "otherwise": {
        "state": { "visible": false }
      }
    }
  }
}

// Passive Linkage (field reacts to dependencies)
{
  "fieldB": {
    "x-reactions": {
      "dependencies": ["fieldA"],
      "fulfill": {
        "state": {
          "visible": "{{$deps[0] === 'yes'}}"
        }
      }
    }
  }
}

// Array Item Relative Paths
{
  "items": {
    "properties": {
      "trigger": {
        "x-reactions": {
          "target": ".dependent",  // Relative path within array item
          "fulfill": { "state": { "visible": "{{!!$self.value}}" } }
        }
      }
    }
  }
}
```

### Component Mapping

| DDS Component | Formily x-component | Notes |
|---------------|---------------------|-------|
| `Input` | `Input` | Direct mapping |
| `Textarea` | `TextArea` | Direct mapping |
| `Select` | `Select` | Map `onValueChange` → `onChange` |
| `Checkbox` | `Checkbox` | Map `checked`/`onCheckedChange` |
| `RadioGroup` | `RadioGroup` | Direct mapping |
| `DatePicker` | `DatePicker` | Direct mapping |
| `Upload` | `Upload` | Custom implementation |

---

## UX Best Practices

### Form Layout

| Practice | Recommendation |
|----------|----------------|
| **Column Layout** | Single column for mobile, 2-column max for desktop |
| **Progress Indicator** | Required for multi-step forms |
| **Section Headers** | Clear visual hierarchy |
| **Field Grouping** | Related fields together |

### Validation UX

| Pattern | Implementation |
|---------|----------------|
| **"Reward Early, Punish Late"** | Show errors onBlur, clear onChange |
| **Specific Messages** | "Enter email like user@example.com" |
| **Inline Validation** | Real-time feedback after field exit |
| **Summary at Top** | List all errors when submitting |

### Complex Form Patterns

| Pattern | When to Use |
|---------|-------------|
| **Autosave** | Forms > 10 fields or critical data |
| **Save as Draft** | Long forms, mobile usage |
| **Section Collapse** | > 5 sections visible |
| **Floating Actions** | Long scrolling forms |

---

## Implementation Roadmap

### Phase 1: Foundation (Current Sprint)

```
□ Copy form-builder → advanced-form-builder
□ Update imports and exports
□ Create Storybook story
□ Document component structure
```

### Phase 2: Repeating Sections

```
□ Add ArrayField blueprint
□ Create ArrayFieldCanvas component
□ Add/remove row UI
□ Nested field support
□ Array item conditional logic
```

### Phase 3: Enhanced Conditional Logic

```
□ Multi-condition UI (AND/OR)
□ Condition group builder
□ More operators (contains, between, etc.)
□ Calculated field expressions
□ Section-level conditions
```

### Phase 4: EHS-Specific Fields

```
□ Pass/Fail score field
□ Rating scale field
□ Risk matrix field
□ Signature capture
□ Photo attachment with annotations
```

### Phase 5: Form Organization

```
□ Section/group component
□ Collapsible sections
□ Multi-page/step forms
□ Progress indicator
□ Page branching logic
```

### Phase 6: Polish & Integration

```
□ Autosave functionality
□ Form validation preview
□ Schema import/export
□ Template library
□ Flow app integration tests
```

---

## Schema Extensions

### Current Schema (Basic Form Builder)

```typescript
interface SchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'void';
  title?: string;
  description?: string;
  default?: unknown;
  enum?: EnumOption[];

  // Formily extensions
  'x-component': string;
  'x-component-props'?: Record<string, unknown>;
  'x-decorator'?: string;
  'x-decorator-props'?: Record<string, unknown>;
  'x-validator'?: ValidatorRule[];
  'x-reactions'?: ConditionalReaction;
  'x-index'?: number;
}
```

### Extended Schema (Advanced Form Builder)

```typescript
interface AdvancedSchemaProperty extends SchemaProperty {
  // Array/Repeating sections
  items?: SchemaProperty;
  minItems?: number;
  maxItems?: number;

  // Calculated fields
  'x-calculate'?: string;  // Expression like '{{field1 * field2}}'

  // Scoring
  'x-score-type'?: 'pass-fail' | 'rating' | 'risk-matrix';
  'x-score-max'?: number;
  'x-score-weight'?: number;
  'x-score-dimensions'?: {
    likelihood: number[];
    severity: number[];
  };

  // Section grouping
  'x-group'?: string;
  'x-group-title'?: string;
  'x-collapsible'?: boolean;
  'x-collapsed-default'?: boolean;

  // Page/Step
  'x-page'?: number;
  'x-page-condition'?: ConditionGroup;

  // Enhanced conditional
  'x-reactions'?: AdvancedConditionalReaction;
}

interface AdvancedConditionalReaction {
  dependencies?: string[];
  conditions?: ConditionGroup;  // Enhanced: AND/OR groups
  fulfill?: {
    state?: Partial<FieldState>;
    schema?: Partial<SchemaProperty>;
  };
  otherwise?: {
    state?: Partial<FieldState>;
    schema?: Partial<SchemaProperty>;
  };
  _conditionalVisibility?: ConditionalVisibilityMetadata;
}
```

---

## Sources

### EHS Software Research
- [CheckProof EHS Software](https://www.checkproof.com/ehs-software/)
- [HSI Checklist & Inspections](https://hsi.com/solutions/ehs-environmental-health-and-safety/checklist-inspections)
- [SafetyCulture EHS Software](https://safetyculture.com/app/ehs-software/)
- [EcoOnline Inspections Software](https://www.ecoonline.com/en-us/ehs-software/audits-inspections/inspections-software/)

### Form Builder Patterns
- [Valuecase - Advanced Forms with Conditional Logic](https://www.valuecase.com/articles/advanced-forms-with-conditional-logic-tables---october-2025-update)
- [Growform - Form Builder with Conditional Logic](https://www.growform.co/form-builder-with-conditional-logic/)
- [Jotform - Forms with Conditional Logic](https://www.jotform.com/blog/forms-with-conditional-logic/)
- [Budibase - How to Build Conditional Logic Forms](https://budibase.com/blog/tutorials/conditional-logic-forms/)

### UX Best Practices
- [Formsort - Form Design for UX/UI Designers](https://formsort.com/article/form-design-for-ux-ui-designers/)
- [Buildform - Form Design Best Practices 2025](https://buildform.ai/blog/form-design-best-practices/)
- [IvyForms - Form Validation Best Practices](https://ivyforms.io/blog/form-validation-best-practices/)
- [LogRocket - UX of Form Validation](https://blog.logrocket.com/ux-design/ux-form-validation-inline-after-submission/)

### Formily Documentation
- [Formily Official Site](https://formilyjs.org/)
- [Formily Vue Schema API](https://vue.formilyjs.org/api/shared/schema)
- [Formily GitHub](https://github.com/alibaba/formily)

---

*Document created: January 2026*
*Last updated: January 2026*
