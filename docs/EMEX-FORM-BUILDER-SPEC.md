# EMEX Form Builder - Technical Specification

## 1. Overview

The EMEX Form Builder is a production-ready, dynamic form rendering and building system built on **Formily** (JSON Schema-based form engine). It provides drag-and-drop form creation, real-time preview, and supports business-specific field types for environmental, health, and safety (EHS) applications.

### Key Technologies
- **Formily** (`@formily/json-schema`) - Core form rendering engine
- **React** - UI framework
- **Zustand** - State management with undo/redo support
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling

---

## 2. Architecture

### 2.1 Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                      FORM BUILDER                           │
├────────────────┬─────────────────────┬─────────────────────┤
│ Component      │    Preview/         │   Configuration     │
│ Palette        │    Designer         │   Panel            │
│ (Left)         │    (Center)         │   (Right)          │
├────────────────┼─────────────────────┼─────────────────────┤
│ - Basic Fields │ - Live Form Preview │ - Form Structure   │
│ - Business     │ - Drag/Drop Canvas  │ - Field Properties │
│   Entities     │ - Field Selection   │ - Validation Rules │
│ - Dictionary   │                     │ - Conditional Logic│
│   Selects      │                     │                    │
└────────────────┴─────────────────────┴─────────────────────┘
```

### 2.2 Component Hierarchy

```
FormBuilder (Page Component)
├── FormBuilderHeader
│   ├── Navigation (Back button)
│   ├── Form Title
│   ├── Tab Navigation (Designer | JSON | Preview)
│   └── Save Actions
├── FormBuilderContent
│   └── ThreePanelLayout
│       ├── ComponentPalette (Left)
│       │   └── Accordion Categories
│       │       ├── Basic Form Fields
│       │       ├── Business Entities
│       │       └── Dictionary & References
│       ├── PreviewContainer (Center)
│       │   └── FormilyFormRenderer
│       └── DesignerWorkspace (Right)
│           ├── FormStructurePanel
│           └── FieldPropertiesPanel
└── FormBuilderModals
    ├── SaveSuccessModal
    ├── UnsavedChangesModal
    └── NameConflictModal
```

---

## 3. Data Models

### 3.1 Form Template (Backend Model)

```typescript
interface FormTemplateResponse {
  id: string;                          // UUID
  moduleId: string;                    // Parent module UUID
  entityTemplateCode: string;          // Associated entity template
  code: string;                        // Auto-generated unique code
  name: string;                        // Display name (3-100 chars)
  description?: string;                // Optional description
  version: number;                     // Auto-incremented on updates
  schemaJson: ISchema;                 // Formily JSON Schema
  uiSchema?: Record<string, unknown>;  // Optional UI customization
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}
```

### 3.2 Form Schema (Formily ISchema)

```typescript
interface ISchema {
  type: 'object';
  properties: Record<string, SchemaProperty>;
  title?: string;
  description?: string;
  required?: string[];
}

interface SchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'void';
  title?: string;                      // Field label
  description?: string;                // Help text
  required?: boolean;
  default?: unknown;

  // Formily-specific properties
  'x-component'?: string;              // Component type (Input, Select, etc.)
  'x-component-props'?: Record<string, unknown>;  // Component props
  'x-decorator'?: string;              // Wrapper component (FormItem)
  'x-decorator-props'?: Record<string, unknown>;
  'x-validator'?: ValidationRule[];    // Validation rules
  'x-reactions'?: ReactionConfig;      // Conditional logic
  'x-index'?: number;                  // Display order
  'x-custom-name'?: boolean;           // Manual name flag

  // Standard JSON Schema
  enum?: unknown[];                    // Options for Select/Radio
  format?: string;                     // Format validation (email, url)
  minimum?: number;
  maximum?: number;
  properties?: Record<string, SchemaProperty>;  // Nested fields
  items?: SchemaProperty;              // Array item schema
}
```

### 3.3 Form Submission

```typescript
interface FormSubmissionResponse {
  id: string;
  formTemplateId: string;
  entityId: string | null;
  taskId?: string | null;
  submissionData: Record<string, unknown>;  // Field values
  isPrimarySubmission: boolean;
  submittedAt: Date;
  submittedBy: string;
}
```

### 3.4 Form Field Blueprint (Component Palette)

```typescript
interface FormComponentBlueprint {
  key: string;           // Unique identifier
  name: string;          // Display name
  icon: ReactNode;       // Lucide icon
  category: 'form' | 'data' | 'dictionary';
  description: string;   // Tooltip text
  schema: SchemaProperty; // Default schema for field
}
```

---

## 4. Available Field Types

### 4.1 Basic Form Fields

| Field Type | Component | Data Type | Description |
|------------|-----------|-----------|-------------|
| Label | `FormText` | `void` | Static text display |
| Text Input | `Input` | `string` | Single-line text |
| Textarea | `TextArea` | `string` | Multi-line text |
| Number | `NumberPicker` | `number` | Numeric input |
| Select | `Select` | `string` | Single selection dropdown |
| Radio Group | `RadioGroup` | `string` | Radio button selection |
| Checkbox | `Checkbox` | `boolean` | Boolean toggle |
| Date Picker | `DatePicker` | `string` | Date selection |
| File Upload | `Upload` | `array` | File attachment |

### 4.2 Business Entity Fields

| Field Type | Component | Description |
|------------|-----------|-------------|
| Location Select | `LocationSelect` | Hierarchical location tree |
| User Select | `UserSelect` | Single user selection with search |
| User Multi-Select | `UserMultiSelect` | Multiple user selection |
| Role-Filtered User | `RoleFilteredUserSelect` | User selection filtered by role |
| Asset Select | `AssetSelect` | Asset selection with type filtering |
| Vehicle Select | `VehicleSelect` | Vehicle-specific selection |
| Entity Select | `GenericEntitySelect` | Dynamic entity selection |
| Incident Select | `IncidentSelect` | Incident reference selection |
| Signature Pad | `SignaturePad` | Digital signature capture |

### 4.3 Dictionary Fields

| Field Type | Component | Description |
|------------|-----------|-------------|
| Dictionary Select | `DictionarySelect` | Configurable dictionary dropdown |
| Cascading Dictionary | `DictionarySelect` | Parent-child dictionary filtering |

---

## 5. State Management

### 5.1 Store Structure

```typescript
// Main Form Designer Store (Zustand)
interface FormDesignerState {
  // Schema State
  schema: ISchema;
  schemaHistory: SchemaHistory[];
  currentHistoryIndex: number;
  maxHistorySize: number;

  // Form Metadata
  formMetadata: {
    name: string;
    description: string;
    category?: string;
    entityTemplateCode?: string;
    lastModified: Date;
  };

  // Button Configuration
  buttonConfig: ButtonConfiguration;

  // Selection State
  selectedField: { path: string[]; timestamp: number } | null;
  selectionHistory: FieldSelection[];

  // UI State
  uiState: {
    activeTab: 'designer' | 'json' | 'preview';
    rightPanelValue: string[];
    addingToSection: string[] | null;
    previewMode: boolean;
    isDark: boolean;
  };

  // Validation
  validationErrors: Record<string, string[]>;
  isValid: boolean;

  // Mode
  formMode: 'create' | 'edit';
  templateId: string | null;

  // Actions
  updateSchema(schema: ISchema, action?: string): void;
  resetSchema(): void;
  selectField(path: string[]): void;
  updateFieldProperties(path: string[], updates: Record<string, unknown>): void;
  deleteField(path: string[]): void;
  addField(blueprint: FormFieldBlueprint, targetPath?: string[]): void;
  reorderField(activeId: string, overId: string): void;
  undo(): void;
  redo(): void;
  // ... more actions
}
```

### 5.2 History/Undo System

```typescript
interface SchemaHistory {
  schema: ISchema;
  timestamp: number;
  action: string;  // Description of change
}

// Limits
const FORM_LIMITS = {
  MAX_SCHEMA_HISTORY_SIZE: 50,
  MAX_SELECTION_HISTORY_SIZE: 10,
};
```

---

## 6. Validation System

### 6.1 Validation Rule Types

```typescript
type ValidationRuleType =
  | 'required'
  | 'minLength' | 'maxLength'
  | 'pattern'
  | 'email'
  | 'number'
  | 'custom'
  | 'conditional'
  | 'crossField';

interface BaseValidationRule {
  type: ValidationRuleType;
  message: string;
  severity: 'error' | 'warning';
  enabled: boolean;
}
```

### 6.2 Formily x-validator Format

```typescript
// Schema with validation
{
  email: {
    type: 'string',
    title: 'Email',
    'x-component': 'Input',
    'x-validator': [
      { required: true, message: 'Email is required' },
      { format: 'email', message: 'Invalid email format' }
    ]
  }
}
```

---

## 7. Conditional Visibility

### 7.1 Visibility Rule Types

```typescript
type VisibilityCondition = 'equals' | 'notEquals' | 'hasValue' | 'isEmpty';
type VisibilityAction = 'show' | 'hide' | 'disable';

interface ConditionalVisibilityRule {
  parentField: string;        // Field to watch
  condition: VisibilityCondition;
  targetValue?: string | boolean | number;
  action: VisibilityAction;
}
```

### 7.2 Formily x-reactions Format

```typescript
// Conditional field example
{
  hasCompany: {
    type: 'boolean',
    title: 'Do you have a company?',
    'x-component': 'Checkbox'
  },
  companyName: {
    type: 'string',
    title: 'Company Name',
    'x-component': 'Input',
    'x-reactions': {
      dependencies: ['hasCompany'],
      fulfill: {
        state: {
          visible: '{{$deps[0]}}'
        }
      }
    }
  }
}
```

---

## 8. API Endpoints

### 8.1 Form Templates (Module-Scoped)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/modules/{moduleId}/form-templates` | List templates |
| GET | `/api/v1/modules/{moduleId}/form-templates/{id}` | Get template |
| POST | `/api/v1/modules/{moduleId}/form-templates` | Create template |
| PUT | `/api/v1/modules/{moduleId}/form-templates/{id}` | Update template |
| DELETE | `/api/v1/modules/{moduleId}/form-templates/{id}` | Delete template |
| POST | `/api/v1/modules/{moduleId}/form-templates/{id}/clone` | Clone template |

### 8.2 Form Submissions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/forms/submissions` | List submissions |
| GET | `/api/v1/forms/submissions/{id}` | Get submission |
| POST | `/api/v1/forms/submissions` | Create submission |

---

## 9. Configuration Objects

### 9.1 Form Render Configuration

```typescript
interface FormRenderConfig {
  mode: 'preview' | 'edit' | 'readonly';
  dataSource: {
    formTemplateId?: string;
    formTemplate?: FormTemplate;
    schema?: ISchema;
    initialValues?: FormValues;
  };
  validation: {
    enabled: boolean;
    showRealTime: boolean;
    debounceMs?: number;
  };
  actions: {
    showActions: boolean;
    primaryAction?: ActionButton;
    secondaryActions: ActionButton[];
    onCancel?: () => void;
  };
  ui: {
    layout: 'compact' | 'standard' | 'full' | 'modal';
    context: 'modal' | 'page' | 'compact' | 'full';
    compact: boolean;
    loading: boolean;
    className?: string;
  };
  preview: {
    enabled: boolean;
    onFieldClick?: (fieldPath: string[], fieldSchema: ISchema) => void;
  };
}
```

### 9.2 Button Configuration

```typescript
interface ButtonConfiguration {
  primaryButton: {
    label: string;
    action: 'submit' | 'submit-for-review';
    enabled: boolean;
    endpoint: string;
    method: 'POST' | 'PUT' | 'PATCH';
  };
  secondaryButton?: {
    label: string;
    action: 'submit' | 'submit-for-review';
    enabled: boolean;
    endpoint?: string;
    method?: 'POST' | 'PUT' | 'PATCH';
  };
  cancelButton: {
    enabled: boolean;
  };
}
```

---

## 10. Services

### 10.1 FormSaveService

Handles form template persistence with validation.

```typescript
class FormSaveService {
  async saveForm(
    formData: SaveFormData,
    moduleId: string,
    templateId: string | undefined,
    existingTemplate: FormTemplate | null
  ): Promise<FormTemplate>;

  private validateAndOptimizeSchema(schema: ISchema): ISchema;
  private createFormMetadata(formData: SaveFormData): FormMetadata;
}
```

### 10.2 SchemaValidationService

Validates schema structure and field configurations.

### 10.3 SchemaManipulationService

Handles schema CRUD operations (add, update, delete, reorder fields).

---

## 11. Feature Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Drag-and-drop | ✅ | Add fields from palette |
| Field reordering | ✅ | Reorder via structure panel |
| Field properties | ✅ | Edit labels, validation, etc. |
| Required validation | ✅ | With custom messages |
| Conditional visibility | ✅ | Show/hide based on field values |
| Dictionary integration | ✅ | Cascading dictionary selects |
| Entity selectors | ✅ | User, Location, Asset, etc. |
| Undo/Redo | ✅ | 50-step history |
| Live preview | ✅ | Real-time form rendering |
| JSON editor | ✅ | Direct schema editing |
| Template cloning | ✅ | Duplicate existing forms |
| Auto-save | ⏳ | Not yet implemented |
| Form versioning | ✅ | Auto-increment on save |
| File uploads | ✅ | With size/type limits |
| Signature capture | ✅ | Digital signature pad |
