# Form Builder UI Implementation Specification

## 1. Overview

This document provides a comprehensive UI implementation specification for building a form builder component using the DDS (Design System). The spec is based on proven patterns from the EMEX form builder implementation.

---

## 2. Layout Architecture

### 2.1 Three-Panel Layout

The form builder uses a **three-panel horizontal layout**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            HEADER                                       │
│ [← Back]  Form Name                    [Designer|JSON|Preview]  [Save] │
├─────────────┬────────────────────────────────────┬─────────────────────┤
│             │                                    │                     │
│  COMPONENT  │                                    │   CONFIGURATION     │
│  PALETTE    │           CANVAS / PREVIEW         │   PANEL            │
│             │                                    │                     │
│  (~280px)   │           (flex-grow)              │   (~320px)         │
│             │                                    │                     │
│  - Basic    │   ┌────────────────────────┐       │   Form Structure   │
│    Fields   │   │                        │       │   └─ Field List    │
│             │   │    Live Form Preview   │       │                    │
│  - Business │   │                        │       │   Field Properties │
│    Entities │   │    (renders schema)    │       │   └─ Label         │
│             │   │                        │       │   └─ Required      │
│  - Dict &   │   │                        │       │   └─ Validation    │
│    Refs     │   └────────────────────────┘       │   └─ Conditional   │
│             │                                    │                     │
└─────────────┴────────────────────────────────────┴─────────────────────┘
```

### 2.2 Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| `≥1280px` | Three panels visible |
| `1024-1279px` | Collapsible left panel |
| `768-1023px` | Collapsible side panels, toggle mode |
| `<768px` | Full-screen mode switching |

---

## 3. Component Specifications

### 3.1 Header Component

**Purpose:** Navigation, form metadata, tab switching, actions

```tsx
interface FormBuilderHeaderProps {
  templateId?: string;
  formName: string;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  activeTab: 'designer' | 'json' | 'preview';
  isSaving: boolean;
  onBackClick: () => void;
  onTabChange: (tab: string) => void;
  onSave: () => void;
}
```

**UI Elements:**
- **Back Button** - Icon button with tooltip, triggers unsaved changes check
- **Form Title** - Editable text or badge showing form name
- **Tab Group** - Segmented control: Designer | JSON | Preview
- **Save Button** - Primary action button with loading state

**DDS Components:**
```tsx
<header className="flex items-center justify-between h-16 px-6 border-b border-border bg-surface">
  <div className="flex items-center gap-4">
    <Button variant="ghost" size="icon" onClick={onBackClick}>
      <ArrowLeft className="h-4 w-4" />
    </Button>
    <h1 className="text-lg font-semibold text-foreground">{formName}</h1>
    {hasUnsavedChanges && (
      <Badge variant="outline" className="text-warning">Unsaved</Badge>
    )}
  </div>

  <Tabs value={activeTab} onValueChange={onTabChange}>
    <TabsList>
      <TabsTrigger value="designer">Designer</TabsTrigger>
      <TabsTrigger value="json">JSON</TabsTrigger>
      <TabsTrigger value="preview">Preview</TabsTrigger>
    </TabsList>
  </Tabs>

  <Button onClick={onSave} disabled={isSaving}>
    {isSaving ? <Spinner /> : <Save className="mr-2 h-4 w-4" />}
    Save
  </Button>
</header>
```

---

### 3.2 Component Palette (Left Panel)

**Purpose:** Library of available form fields organized by category

```tsx
interface ComponentPaletteProps {
  onAddField: (blueprint: FieldBlueprint) => void;
  componentMode: 'all' | 'basic' | 'extended';
  isDark?: boolean;
}

interface FieldBlueprint {
  key: string;        // Unique identifier
  name: string;       // Display name
  icon: ReactNode;    // Icon component
  category: string;   // Category for grouping
  description: string; // Tooltip description
  schema: FieldSchema; // Default schema
}
```

**Category Configuration:**
```typescript
const CATEGORIES = {
  form: {
    label: 'Basic Form Fields',
    description: 'Essential form input components',
    order: 1,
    color: 'emerald',
  },
  data: {
    label: 'Business Entities',
    description: 'Business-specific data selection',
    order: 2,
    color: 'amber',
  },
  dictionary: {
    label: 'Dictionary & References',
    description: 'Dictionary-based selections',
    order: 3,
    color: 'orange',
  },
};
```

**Component Card:**
```tsx
const ComponentCard = ({ blueprint, onAdd }) => (
  <Card
    className="cursor-pointer hover:border-primary transition-colors"
    onClick={() => onAdd(blueprint)}
  >
    <CardContent className="py-2 px-3">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-muted">
          {blueprint.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-sm">{blueprint.name}</span>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-3 w-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>{blueprint.description}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
```

**Accordion Structure:**
```tsx
<Accordion type="multiple" className="space-y-2">
  {Object.entries(groupedComponents).map(([category, components]) => (
    <AccordionItem key={category} value={category}>
      <AccordionTrigger className="px-4 py-3">
        <span className="text-sm font-semibold">{CATEGORIES[category].label}</span>
        <Badge variant="secondary">{components.length}</Badge>
      </AccordionTrigger>
      <AccordionContent className="space-y-2 px-4 pb-4">
        {components.map(blueprint => (
          <ComponentCard key={blueprint.key} blueprint={blueprint} onAdd={onAddField} />
        ))}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

---

### 3.3 Canvas / Preview (Center Panel)

**Purpose:** Live form preview with field selection

```tsx
interface FormPreviewProps {
  schema: FormSchema;
  selectedFieldPath: string[];
  onFieldClick: (path: string[]) => void;
  previewMode: boolean;
  initialValues?: Record<string, unknown>;
}
```

**Empty State:**
```tsx
const EmptyFormState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
      <FileText className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">Start Building Your Form</h3>
    <p className="text-muted-foreground max-w-sm">
      Click on components from the palette or drag them here to start building your form.
    </p>
  </div>
);
```

**Field Selection Highlight:**
```css
/* Selected field styling */
.field-selected {
  @apply ring-2 ring-primary ring-offset-2;
}

/* Hoverable field styling */
.field-hoverable:hover {
  @apply ring-1 ring-primary/50 cursor-pointer;
}
```

**Form Renderer Integration:**
```tsx
<div className="flex-1 overflow-auto p-6 bg-muted/30">
  <div className="max-w-2xl mx-auto bg-surface rounded-lg shadow-sm border border-border p-6">
    {hasFields ? (
      <FormRenderer
        schema={schema}
        mode={previewMode ? 'preview' : 'edit'}
        onFieldClick={onFieldClick}
        selectedPath={selectedFieldPath}
      />
    ) : (
      <EmptyFormState />
    )}
  </div>
</div>
```

---

### 3.4 Configuration Panel (Right Panel)

**Purpose:** Form structure view and field property editing

#### 3.4.1 Form Structure Panel

```tsx
interface FormStructurePanelProps {
  schema: FormSchema;
  selectedFieldPath: string[];
  onFieldSelect: (path: string[]) => void;
  onFieldReorder: (activeId: string, overId: string) => void;
  onFieldDelete: (path: string[]) => void;
}
```

**Field List Item:**
```tsx
const FieldListItem = ({ field, path, isSelected, onSelect, onDelete }) => (
  <div
    className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer",
      "hover:bg-muted transition-colors",
      isSelected && "bg-primary/10 border-l-2 border-primary"
    )}
    onClick={() => onSelect(path)}
  >
    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
    <FieldTypeIcon type={field['x-component']} />
    <span className="flex-1 truncate text-sm">{field.title || path.join('.')}</span>
    {field.required && <span className="text-destructive">*</span>}
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 opacity-0 group-hover:opacity-100"
      onClick={(e) => { e.stopPropagation(); onDelete(path); }}
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  </div>
);
```

#### 3.4.2 Field Properties Panel

```tsx
interface FieldPropertiesPanelProps {
  selectedFieldPath: string[];
  schema: FormSchema;
  onFieldUpdate: (path: string[], updates: FieldUpdate) => void;
  onFieldRename?: (path: string[], newKey: string) => void;
}
```

**Property Sections:**

1. **Basic Properties** (always shown for input fields)
   - Field Label (text input, max 50 chars)
   - Required toggle (checkbox)
   - Validation message (when required)

2. **Component-Specific Properties** (conditional)
   - Options editor (Select, Radio)
   - Dictionary selector (DictionarySelect)
   - Role filters (UserSelect)
   - Upload limits (FileUpload)
   - Text styling (FormText/Label)

3. **Advanced Properties** (collapsible)
   - Conditional visibility editor
   - Dynamic property bindings
   - Custom validation rules

**Empty State:**
```tsx
const NoFieldSelected = () => (
  <div className="flex flex-col items-center justify-center h-48 text-center">
    <Settings className="h-8 w-8 text-muted-foreground opacity-50 mb-4" />
    <p className="text-sm text-muted-foreground">No field selected</p>
    <p className="text-xs text-muted-foreground">
      Click on a field to edit its properties
    </p>
  </div>
);
```

**Property Form:**
```tsx
<div className="space-y-4">
  {/* Field Label */}
  <div>
    <Label htmlFor="fieldLabel">Field Label</Label>
    <Input
      id="fieldLabel"
      value={field?.title || ''}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Enter field label"
      maxLength={50}
    />
    <p className="text-xs text-muted-foreground mt-1">
      {(field?.title || '').length}/50 characters
    </p>
  </div>

  {/* Required Toggle */}
  <div className="flex items-center space-x-2">
    <Checkbox
      id="required"
      checked={Boolean(field?.required)}
      onCheckedChange={(checked) => onUpdate({ required: checked })}
    />
    <Label htmlFor="required">Required field</Label>
  </div>

  {/* Validation Message (shown when required) */}
  {field?.required && (
    <div>
      <Label htmlFor="validationMessage">Validation Message</Label>
      <Input
        id="validationMessage"
        value={getValidationMessage(field)}
        onChange={(e) => onUpdateValidation(e.target.value)}
        placeholder={`${field.title} is required`}
      />
    </div>
  )}

  {/* Component-specific editors */}
  {renderComponentSpecificEditor(field)}

  {/* Conditional Visibility */}
  <ConditionalVisibilityEditor
    schema={schema}
    fieldPath={selectedFieldPath}
    onUpdate={onUpdate}
  />
</div>
```

---

### 3.5 Conditional Visibility Editor

```tsx
interface ConditionalVisibilityEditorProps {
  schema: FormSchema;
  selectedFieldPath: string[];
  onFieldUpdate: (path: string[], updates: FieldUpdate) => void;
}

interface VisibilityRule {
  parentField: string;
  condition: 'equals' | 'notEquals' | 'hasValue' | 'isEmpty';
  targetValue?: string | boolean | number;
  action: 'show' | 'hide' | 'disable';
}
```

**UI Layout:**
```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-sm">Conditional Visibility</CardTitle>
    <CardDescription>Show, hide, or disable this field based on other field values</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Parent Field Selector */}
    <Select value={rule.parentField} onValueChange={handleParentChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select parent field" />
      </SelectTrigger>
      <SelectContent>
        {availableParentFields.map(field => (
          <SelectItem key={field.path} value={field.path}>
            {field.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    {/* Condition Selector */}
    <Select value={rule.condition} onValueChange={handleConditionChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select condition" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="equals">Equals</SelectItem>
        <SelectItem value="notEquals">Not Equals</SelectItem>
        <SelectItem value="hasValue">Has Value</SelectItem>
        <SelectItem value="isEmpty">Is Empty</SelectItem>
      </SelectContent>
    </Select>

    {/* Target Value Input (for equals/notEquals) */}
    {showTargetValue && (
      <ConditionalValueInput
        parentField={parentFieldSchema}
        value={rule.targetValue}
        onChange={handleTargetChange}
      />
    )}

    {/* Action Selector */}
    <Select value={rule.action} onValueChange={handleActionChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select action" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="show">Show field</SelectItem>
        <SelectItem value="hide">Hide field</SelectItem>
        <SelectItem value="disable">Disable field</SelectItem>
      </SelectContent>
    </Select>
  </CardContent>
</Card>
```

---

### 3.6 Options Editor (Select/Radio/Checkbox)

```tsx
interface OptionsEditorProps {
  options: Array<{ label: string; value: string }>;
  onChange: (options: Array<{ label: string; value: string }>) => void;
}
```

**UI Layout:**
```tsx
<div className="space-y-2">
  <Label>Options</Label>
  <div className="space-y-2">
    {options.map((option, index) => (
      <div key={index} className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
        <Input
          value={option.label}
          onChange={(e) => updateOption(index, 'label', e.target.value)}
          placeholder="Label"
          className="flex-1"
        />
        <Input
          value={option.value}
          onChange={(e) => updateOption(index, 'value', e.target.value)}
          placeholder="Value"
          className="flex-1"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeOption(index)}
          disabled={options.length <= 1}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
  <Button variant="outline" size="sm" onClick={addOption}>
    <Plus className="h-4 w-4 mr-2" />
    Add Option
  </Button>
</div>
```

---

## 4. State Management

### 4.1 Store Structure (Zustand)

```typescript
interface FormBuilderStore {
  // Schema state
  schema: FormSchema;
  schemaHistory: SchemaHistoryEntry[];
  historyIndex: number;

  // UI state
  selectedFieldPath: string[];
  activeTab: 'designer' | 'json' | 'preview';
  rightPanelSections: string[];

  // Form metadata
  formMetadata: {
    name: string;
    description: string;
    entityTemplateCode?: string;
  };

  // Flags
  hasUnsavedChanges: boolean;
  isValid: boolean;
  isSaving: boolean;

  // Actions
  setSchema: (schema: FormSchema, action?: string) => void;
  selectField: (path: string[]) => void;
  updateFieldProperties: (path: string[], updates: Record<string, unknown>) => void;
  deleteField: (path: string[]) => void;
  addField: (blueprint: FieldBlueprint, targetPath?: string[]) => void;
  reorderFields: (fromPath: string[], toPath: string[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}
```

### 4.2 History Management

```typescript
interface SchemaHistoryEntry {
  schema: FormSchema;
  timestamp: number;
  action: string;  // 'add field: email', 'delete field: phone', etc.
}

const MAX_HISTORY_SIZE = 50;

const addToHistory = (state: FormBuilderStore, newSchema: FormSchema, action: string) => {
  const entry = { schema: structuredClone(newSchema), timestamp: Date.now(), action };

  // Truncate future history if we're not at the end
  let history = state.schemaHistory.slice(0, state.historyIndex + 1);
  history.push(entry);

  // Limit history size
  if (history.length > MAX_HISTORY_SIZE) {
    history = history.slice(-MAX_HISTORY_SIZE);
  }

  return { schemaHistory: history, historyIndex: history.length - 1 };
};
```

---

## 5. Schema Operations

### 5.1 Add Field

```typescript
const addField = (schema: FormSchema, blueprint: FieldBlueprint, targetPath?: string[]): FormSchema => {
  const newSchema = structuredClone(schema);
  const target = targetPath ? getNestedObject(newSchema, targetPath) : newSchema;

  if (!target.properties) target.properties = {};

  // Generate unique field key
  const existingKeys = Object.keys(target.properties);
  const baseKey = generateFieldKey(blueprint.schema.title || blueprint.key);
  const fieldKey = ensureUniqueKey(baseKey, existingKeys);

  // Calculate x-index for ordering
  const maxIndex = Math.max(
    -1,
    ...Object.values(target.properties).map(f => f['x-index'] ?? -1)
  );

  // Add field with incremented index
  target.properties[fieldKey] = {
    ...structuredClone(blueprint.schema),
    'x-index': maxIndex + 1,
  };

  return newSchema;
};
```

### 5.2 Update Field Properties

```typescript
const updateFieldProperties = (
  schema: FormSchema,
  path: string[],
  updates: Record<string, unknown>
): FormSchema => {
  const newSchema = structuredClone(schema);
  const field = getFieldByPath(newSchema, path);

  if (!field) return schema;

  // Merge updates
  Object.assign(field, updates);

  // Handle special cases
  if ('title' in updates && !field['x-custom-name']) {
    // Auto-generate field key from title
    const newKey = generateFieldKey(updates.title as string);
    renameFieldKey(newSchema, path, newKey);
  }

  return newSchema;
};
```

### 5.3 Delete Field

```typescript
const deleteField = (schema: FormSchema, path: string[]): FormSchema => {
  if (path.length === 0) return schema;

  const newSchema = structuredClone(schema);
  const parentPath = path.slice(0, -1);
  const fieldKey = path[path.length - 1];

  const parent = parentPath.length > 0
    ? getFieldByPath(newSchema, parentPath)
    : newSchema;

  if (parent?.properties?.[fieldKey]) {
    delete parent.properties[fieldKey];
  }

  return newSchema;
};
```

### 5.4 Reorder Fields

```typescript
const reorderFields = (
  schema: FormSchema,
  activeId: string,
  overId: string
): FormSchema => {
  const newSchema = structuredClone(schema);
  const properties = newSchema.properties;

  if (!properties) return schema;

  // Get current indexes
  const entries = Object.entries(properties).sort(
    ([, a], [, b]) => (a['x-index'] ?? 0) - (b['x-index'] ?? 0)
  );

  const activeIndex = entries.findIndex(([key]) => key === activeId);
  const overIndex = entries.findIndex(([key]) => key === overId);

  if (activeIndex === -1 || overIndex === -1) return schema;

  // Reorder
  const [moved] = entries.splice(activeIndex, 1);
  entries.splice(overIndex, 0, moved);

  // Update x-index values
  entries.forEach(([key], index) => {
    properties[key]['x-index'] = index;
  });

  return newSchema;
};
```

---

## 6. Validation

### 6.1 Schema Validation

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  path: string[];
  message: string;
  code: string;
}

const validateSchema = (schema: FormSchema): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check root type
  if (schema.type !== 'object') {
    errors.push({
      path: [],
      message: 'Root schema must have type "object"',
      code: 'INVALID_ROOT_TYPE',
    });
  }

  // Validate each field
  if (schema.properties) {
    Object.entries(schema.properties).forEach(([key, field]) => {
      validateField(key, field, [key], errors, warnings);
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

const validateField = (
  key: string,
  field: FieldSchema,
  path: string[],
  errors: ValidationError[],
  warnings: ValidationWarning[]
) => {
  // Check required properties
  if (!field.type && field.type !== 'void') {
    errors.push({
      path,
      message: `Field "${key}" is missing required "type" property`,
      code: 'MISSING_TYPE',
    });
  }

  // Check x-component for input fields
  if (field.type !== 'void' && field.type !== 'object' && !field['x-component']) {
    warnings.push({
      path,
      message: `Field "${key}" has no x-component defined`,
      code: 'MISSING_COMPONENT',
    });
  }

  // Validate nested properties
  if (field.properties) {
    Object.entries(field.properties).forEach(([nestedKey, nestedField]) => {
      validateField(nestedKey, nestedField, [...path, nestedKey], errors, warnings);
    });
  }
};
```

---

## 7. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save form |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Delete` / `Backspace` | Delete selected field |
| `Escape` | Deselect field |
| `Tab` | Next field |
| `Shift + Tab` | Previous field |

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMod = e.metaKey || e.ctrlKey;

    if (isMod && e.key === 's') {
      e.preventDefault();
      handleSave();
    } else if (isMod && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedFieldPath.length > 0 && !isInputFocused()) {
        e.preventDefault();
        deleteField(selectedFieldPath);
      }
    } else if (e.key === 'Escape') {
      clearSelection();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [selectedFieldPath, undo, redo, handleSave, deleteField]);
```

---

## 8. Accessibility

### 8.1 Requirements

- All interactive elements must be keyboard accessible
- Focus indicators must be visible
- Screen reader announcements for state changes
- Proper ARIA labels and roles

### 8.2 ARIA Attributes

```tsx
// Component Palette
<div role="tree" aria-label="Form component library">
  <div role="treeitem" aria-expanded={isExpanded} aria-label={category.label}>
    {/* Category content */}
  </div>
</div>

// Form Structure (reorderable list)
<ul role="listbox" aria-label="Form fields" aria-activedescendant={selectedId}>
  <li
    role="option"
    aria-selected={isSelected}
    aria-label={`${field.title}, ${field.type} field${field.required ? ', required' : ''}`}
  >
    {/* Field item */}
  </li>
</ul>

// Field Properties
<form aria-label="Field properties editor">
  {/* Property inputs */}
</form>
```

---

## 9. Error Handling

### 9.1 Error States

```tsx
// Schema loading error
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Failed to load form</AlertTitle>
  <AlertDescription>
    {error.message}
    <Button variant="link" onClick={retry}>Try again</Button>
  </AlertDescription>
</Alert>

// Save error
<Toast variant="destructive">
  <ToastTitle>Save failed</ToastTitle>
  <ToastDescription>{error.message}</ToastDescription>
  <ToastAction altText="Retry" onClick={handleSave}>Retry</ToastAction>
</Toast>

// Validation error
<Alert variant="warning">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Form has validation issues</AlertTitle>
  <AlertDescription>
    <ul>
      {errors.map((error, i) => (
        <li key={i}>{error.message}</li>
      ))}
    </ul>
  </AlertDescription>
</Alert>
```

---

## 10. File Structure

```
src/features/form-builder/
├── components/
│   ├── FormBuilder.tsx              # Main page component
│   ├── FormBuilderHeader.tsx        # Header with nav/tabs/actions
│   ├── FormBuilderContent.tsx       # Three-panel layout wrapper
│   ├── palette/
│   │   ├── ComponentPalette.tsx     # Left panel
│   │   ├── ComponentCard.tsx        # Individual component card
│   │   └── index.ts
│   ├── canvas/
│   │   ├── FormCanvas.tsx           # Center preview area
│   │   ├── FieldRenderer.tsx        # Individual field renderer
│   │   └── EmptyState.tsx
│   ├── properties/
│   │   ├── ConfigurationPanel.tsx   # Right panel container
│   │   ├── FormStructure.tsx        # Field tree view
│   │   ├── FieldProperties.tsx      # Property editor
│   │   ├── ConditionalVisibility.tsx
│   │   ├── OptionsEditor.tsx
│   │   └── index.ts
│   └── modals/
│       ├── SaveSuccessModal.tsx
│       ├── UnsavedChangesModal.tsx
│       └── DeleteConfirmModal.tsx
├── hooks/
│   ├── useFormBuilderState.ts       # Main state management
│   ├── useFieldOperations.ts        # CRUD operations
│   ├── useSchemaValidation.ts       # Validation logic
│   └── useKeyboardShortcuts.ts
├── stores/
│   └── form-builder.store.ts        # Zustand store
├── services/
│   ├── schema-operations.ts         # Schema manipulation
│   └── form-api.ts                  # API calls
├── types/
│   ├── schema.types.ts              # Schema interfaces
│   ├── component.types.ts           # Component blueprints
│   └── index.ts
├── utils/
│   ├── field-key-generator.ts
│   ├── schema-navigation.ts
│   └── validation.ts
├── constants/
│   ├── field-blueprints.ts          # Available components
│   └── categories.ts
└── index.ts                         # Public exports
```

---

## 11. Implementation Phases

### Phase 1: Core Infrastructure
- [ ] Set up store and state management
- [ ] Create three-panel layout shell
- [ ] Implement basic schema operations

### Phase 2: Component Palette
- [ ] Create component card UI
- [ ] Implement accordion categories
- [ ] Add field to schema on click

### Phase 3: Form Preview
- [ ] Integrate form renderer
- [ ] Add field click selection
- [ ] Show selected field highlight

### Phase 4: Field Properties
- [ ] Basic properties (label, required)
- [ ] Options editor for select/radio
- [ ] Validation message editor

### Phase 5: Advanced Features
- [ ] Conditional visibility
- [ ] Undo/redo history
- [ ] Keyboard shortcuts

### Phase 6: Polish
- [ ] Error handling
- [ ] Loading states
- [ ] Accessibility audit
- [ ] Performance optimization
