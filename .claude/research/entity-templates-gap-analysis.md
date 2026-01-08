# Entity Templates: Gap Analysis Research

> **Date:** 2024-12-29
> **Status:** Research Complete
> **Scope:** Entity Templates UI only (Modules, Forms, Dictionaries out of scope)

---

## Executive Summary

The DDS Entity Templates UI implements **~15% of the EMEX backend's configuration capabilities**. However, for the **Entity Templates feature specifically**, the implementation is solid and well-aligned with the backend schema.

**Decision:** Focus on Entity Templates standalone. Module/Form/Dictionary management are separate future initiatives.

---

## Documentation References

**Sources:**
1. `/Users/adrozdenko/Documents/EMEX/emex-x/emex-x-application/.claude/case-studies/business-logic/modules-and-entity-templates.md`
2. `/Users/adrozdenko/Documents/EMEX/emex-x/emex-x-application/.claude/case-studies/business-logic/modules-deep-dive.md`

### Key Concepts from Documentation

| Concept | Definition |
|---------|------------|
| **Entity Template** | Blueprint defining data structure, validation rules, business key patterns |
| **Entity** | Instance/record created from an Entity Template (Template ≠ Instance) |
| **Module** | Complete domain package (templates + forms + workflows + dictionaries) |
| **Form Template** | UI layer separate from entity structure; multiple forms per entity |
| **Dictionary** | Configurable reference data (severity levels, categories, priorities) |
| **ModuleEntityTemplate** | Bridge table linking modules to templates with primary form designation |
| **Primary Entity Template** | Module's navigation anchor (`primaryEntityTemplateCode`) |

### Critical Distinction: Template vs Entity

From deep dive documentation:
> "Entity Templates are **static definitions**, not instances. The template 'incident' defines what ALL incidents look like. Individual incidents are separate records that reference this template."

```
EntityTemplate (definition)     vs     Entity (instance)
─────────────────────────────          ──────────────────
"Incident Report" schema               INC-2024-001
Defines 50 fields                      Actual record
One per type                           Many per template
Rarely changes                         Created constantly
```

---

## Backend Architecture (EMEX)

### Database Schema Locations

| Model | File Path |
|-------|-----------|
| Module | `/packages/emex-prisma/prisma/schema/module.prisma` |
| EntityTemplate | `/packages/emex-prisma/prisma/schema/entityTemplate.prisma` |
| ModuleEntityTemplate | `/packages/emex-prisma/prisma/schema/moduleEntityTemplate.prisma` |
| FormTemplate | `/packages/emex-prisma/prisma/schema/formTemplate.prisma` |
| FormEntityMapping | `/packages/emex-prisma/prisma/schema/formEntityMapping.prisma` |
| Dictionary | `/packages/emex-prisma/prisma/schema/dictionary.prisma` |
| DictionaryCategory | `/packages/emex-prisma/prisma/schema/dictionaryCategory.prisma` |
| EntityActionProcessTrigger | `/packages/emex-prisma/prisma/schema/entityActionProcessTrigger.prisma` |
| ProcessDefinitionTemplate | `/packages/emex-prisma/prisma/schema/processDefinitionTemplate.prisma` |

### Backend Capabilities Summary

```
✅ Modules - Full CRUD, status management, primary entity template
✅ Entity Templates - Schema definition, versioning, business keys
✅ Form Templates - Multiple forms per entity, cloning, module-scoped
✅ Form-Entity Mappings - Field-level mapping configuration
✅ Dictionaries - Configurable per module via CSV seeding
✅ Entity Action Triggers - Auto-start workflows on CRUD events
✅ Process Definitions - BPMN workflow storage
✅ Multi-Tenant - Company/location-based scoping
```

### Module Hierarchy (from Deep Dive)

```
Module (Container)
│
├── Entity Templates
│   ├── Primary Entity Template (main entity type, used for navigation)
│   ├── Secondary Entity Templates (additional entities this module manages)
│   └── Properties: name, code, version, JSON schema, business key pattern
│
├── Forms
│   ├── Primary Form (default entry point for creating entities)
│   ├── Workflow Task Forms (specific to workflow stages)
│   └── Properties: schema JSON, UI schema, entity binding
│
├── Dictionaries
│   ├── Dictionary Categories (groups like "IncidentTypes", "Priority")
│   ├── Dictionary Items (values within categories)
│   └── Properties: code, value, display order, active state
│
├── Module User Groups
│   ├── Role-based groups (e.g., "Investigators", "Approvers")
│   ├── User assignments
│   └── Properties: code, description, member list
│
├── Workflows
│   ├── Process Definition Templates (BPMN XML)
│   ├── Process Instances (running workflows)
│   └── Process Tasks (human tasks within workflows)
│
├── Form-Entity Mappings
│   └── Rules for transforming form data into entity data
│
├── Form-Workflow Mappings
│   └── Which form renders for which workflow task
│
└── Entity Action Triggers
    └── Auto-start workflows when entities are created/updated/deleted
```

### Module Lifecycle States

| State | Description | User Visibility |
|-------|-------------|-----------------|
| **draft** | Under development, not deployed | Admins/developers only |
| **active** | In production, users can interact | All authorized users |
| **inactive** | Archived, read-only mode | Hidden or read-only |

### ModuleEntityTemplate Configuration

The bridge between Modules and Entity Templates includes module-specific settings:

```typescript
ModuleEntityTemplate {
  moduleId: string
  entityTemplateCode: string
  primaryFormTemplateId: string      // Default form for creating
  configurationJson: {
    "requiresRca": true,             // Module-specific business logic
    "maxDaysToClose": 14,
    "autoAssignOnCreate": false,
    "locationFieldMapping": "..."    // Field path for location
  }
}
```

---

## DDS UI Implementation

### Current Components

| Component | Location | Purpose |
|-----------|----------|---------|
| EntityTemplatesPage | `src/flow/components/entity-templates/EntityTemplatesPage.tsx` | List page with category sidebar |
| CreateTemplatePage | `src/flow/components/entity-templates/pages/CreateTemplatePage.tsx` | Full-page create with SchemaStudio |
| EditTemplatePage | `src/flow/components/entity-templates/pages/EditTemplatePage.tsx` | Full-page edit with SchemaStudio |
| EntityTemplatesTable | `src/flow/components/entity-templates/table/EntityTemplatesTable.tsx` | Sortable, paginated data table |
| TemplateCategorySidebar | `src/flow/components/entity-templates/sidebar/TemplateCategorySidebar.tsx` | Category filter panel |
| ViewTemplateDialog | `src/flow/components/entity-templates/dialogs/ViewTemplateDialog.tsx` | Read-only template viewer |
| DeleteTemplateDialog | `src/flow/components/entity-templates/dialogs/DeleteTemplateDialog.tsx` | Deletion confirmation |

### Data Model (types.ts)

```typescript
interface EntityTemplate {
  id: string
  name: string
  code: string
  category: TemplateCategory
  version: number
  isSystem: boolean
  businessKeyTemplate?: string
  jsonSchema: string
  createdAt: string
  updatedAt?: string
  description?: string
  fieldCount?: number
}

type TemplateCategory =
  | 'incident'
  | 'inspection'
  | 'audit'
  | 'corrective_action'
  | 'permit'
  | 'training'
  | 'custom'
```

---

## Gap Analysis: Entity Templates Specific

### What's Aligned

| Feature | DDS UI | Backend | Status |
|---------|--------|---------|--------|
| Template name/code | ✅ | ✅ | Aligned |
| JSON Schema storage | ✅ | ✅ | Aligned |
| Business key template | ✅ | ✅ | Aligned |
| Version tracking | ✅ | ✅ | Aligned |
| System vs Custom flag | ✅ | ✅ | Aligned |
| Created/Updated timestamps | ✅ | ✅ | Aligned |
| Visual schema editor | ✅ SchemaStudio | N/A (backend stores JSON) | UI enhancement |

### What's Different

| Feature | DDS UI | Backend | Gap |
|---------|--------|---------|-----|
| Categories | Hardcoded enum | No category field on EntityTemplate | **UI-only concept** |
| Module ownership | Not shown | Via ModuleEntityTemplate bridge | Out of scope |
| Primary form | Not shown | Via ModuleEntityTemplate.primaryFormTemplateId | Out of scope |
| Description field | ✅ In UI | ❓ Check backend schema | Verify |

### Categories Discrepancy

**DDS UI:** Categories are a UI-side organizational feature
```typescript
type TemplateCategory = 'incident' | 'inspection' | 'audit' | ...
```

**Backend:** EntityTemplate has no `category` field. Organization is via:
- Module ownership (which module uses the template)
- Naming conventions (template codes like `incident`, `corrective-action`)

**Recommendation:** Keep categories in UI for organization, but understand they're not persisted to backend. Consider adding a `tags` or `category` field to backend if needed.

---

## Feature Completeness for Entity Templates

### Core CRUD: ✅ Complete
- [x] List templates with pagination
- [x] Search by name, code, business key
- [x] Filter by type (system/custom)
- [x] Filter by category (UI-side)
- [x] Sort by columns
- [x] View template details
- [x] Create new template
- [x] Edit template (full-page with SchemaStudio)
- [x] Delete template (with confirmation)
- [x] System template protection (no delete)

### Schema Editing: ✅ Complete
- [x] Visual field editor (SchemaStudio)
- [x] JSON Schema validation
- [x] Field types (string, number, date, enum, array, object)
- [x] Required field marking
- [x] Field ordering (ui:order)
- [x] Code view toggle

### UX Polish: ✅ Complete
- [x] Collapsible category sidebar
- [x] Responsive layout (mobile sidebar)
- [x] Loading states
- [x] Empty states
- [x] Copy-to-clipboard for codes
- [x] Dirty state warning on navigation
- [x] Refresh functionality

---

## Out of Scope (Future Work)

These features exist in backend but are NOT part of Entity Templates UI:

| Feature | Backend Support | Priority for Future |
|---------|-----------------|---------------------|
| Module Management | ✅ Full | High |
| Module → Template assignment | ✅ ModuleEntityTemplate | High |
| Primary form per module | ✅ primaryFormTemplateId | Medium |
| Form Templates | ✅ Full | High |
| Form-Entity Mapping | ✅ Full | Medium |
| Dictionary Management | ✅ Full | High |
| Workflow Triggers | ✅ EntityActionProcessTrigger | Low |
| Process Definitions | ✅ BPMN storage | Low |

---

## Recommendations for Entity Templates UI

### Keep As-Is
1. **Category sidebar** - Good UX even if backend doesn't persist categories
2. **SchemaStudio integration** - Excellent visual editing experience
3. **System template protection** - Prevents accidental deletion
4. **Full-page create/edit** - Better than dialogs for complex schemas

### Consider Adding
1. **Template cloning** - Backend pattern exists for forms, could add for templates
2. **Template import/export** - JSON download/upload for backup/migration
3. **Schema diff view** - Compare versions when version > 1
4. **Field usage stats** - Show which fields are actually used in entities (requires backend)

### Technical Debt
1. **Categories not persisted** - Decide if backend should store category or keep UI-only
2. **Description field alignment** - Verify backend schema supports description
3. **No API integration** - Current UI uses mock data; needs real API connection

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         EMEX BACKEND                            │
├─────────────────────────────────────────────────────────────────┤
│  Module ──────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  ModuleEntityTemplate ←──── primaryFormTemplateId          │ │
│  │  │                                                         │ │
│  │  └──► EntityTemplate ◄─────────────────────────────────────┼─┼── DDS UI SCOPE
│  │       ├── code                                             │ │
│  │       ├── name                                             │ │
│  │       ├── version                                          │ │
│  │       ├── isSystem                                         │ │
│  │       ├── businessKeyTemplate                              │ │
│  │       └── jsonSchema                                       │ │
│  │                                                            │ │
│  │  FormTemplate (multiple per entity) ──────────────────────►│ │  OUT OF SCOPE
│  │  │                                                         │ │
│  │  └──► FormEntityMapping                                    │ │
│  │                                                            │ │
│  │  Dictionary / DictionaryCategory ─────────────────────────►│ │  OUT OF SCOPE
│  │                                                            │ │
│  │  ProcessDefinitionTemplate ───────────────────────────────►│ │  OUT OF SCOPE
│  │  │                                                         │ │
│  │  └──► EntityActionProcessTrigger                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Files Reference

### DDS UI Components
```
src/flow/components/entity-templates/
├── EntityTemplatesPage.tsx          # Main list page
├── types.ts                         # TypeScript interfaces
├── index.ts                         # Exports
├── dialogs/
│   ├── CreateTemplateDialog.tsx
│   ├── DeleteTemplateDialog.tsx
│   ├── EditTemplateDialog.tsx
│   └── ViewTemplateDialog.tsx
├── pages/
│   ├── CreateTemplatePage.tsx       # Full-page create
│   ├── EditTemplatePage.tsx         # Full-page edit
│   └── index.ts
├── panels/
│   ├── EditTemplatePanel.tsx
│   ├── EditTemplatePane.tsx
│   └── index.ts
├── sidebar/
│   ├── TemplateCategoryCard.tsx
│   ├── TemplateCategorySidebar.tsx
│   └── index.ts
└── table/
    └── EntityTemplatesTable.tsx
```

### Storybook
```
src/stories/flow/entity-templates-page.stories.tsx
```

### Backend (EMEX)
```
/Users/adrozdenko/Documents/EMEX/emex-x/emex-x-application/
├── packages/emex-prisma/prisma/schema/
│   ├── entityTemplate.prisma
│   ├── module.prisma
│   ├── moduleEntityTemplate.prisma
│   ├── formTemplate.prisma
│   └── ...
├── apps/backend/src/api/modules/
│   ├── modules.service.ts
│   ├── entityTemplates/
│   └── formTemplates/
└── modules/
    ├── carus-incident-management/
    └── carus-corrective-actions/
```

---

## UX/UI Design Implications (from Deep Dive)

These guidelines from the documentation inform future UI development:

### Navigation
- Organize by module (module card dashboard)
- Primary entity drives navigation within module
- Module status visually indicated (draft/active/inactive)

### Forms
- Dynamically load dictionaries (no hardcoding)
- Primary form = default action
- Workflow task forms show context

### Entity Views
- Display workflow status (current stage, responsible user)
- Cross-module links visible
- Action buttons based on group membership

### Configuration
- Module status clearly shown (active/inactive/draft)
- Dictionary management per module
- User group assignment interface

---

## Glossary (from Deep Dive)

| Term | Definition |
|------|------------|
| **Module** | Self-contained business domain package |
| **Entity Template** | Data model/schema definition |
| **Entity** | Instance of entity template |
| **Form Template** | Data capture interface schema |
| **Form Submission** | Completed form with submitted data |
| **Dictionary Category** | Group of reference values |
| **Dictionary Item** | Individual reference value |
| **Process Template** | BPMN workflow definition |
| **Process Instance** | Running instance of workflow |
| **Process Task** | Human task in workflow |
| **Module User Group** | Role-based access within module |
| **PBAC** | Permission-Based Access Control |
| **Form-Entity Mapping** | Form → Entity data transformation |
| **Form-Workflow Mapping** | Form → Task binding |
| **Entity Action Trigger** | Auto-start workflow on action |
| **Primary Entity Template** | Main entity type for module navigation |
| **Primary Form** | Default form for entity creation |

---

## Conclusion

The Entity Templates UI in DDS is **feature-complete for standalone template management**. The implementation aligns well with the backend EntityTemplate schema and provides excellent UX for schema editing via SchemaStudio.

The main architectural difference is that the UI treats templates as top-level entities with UI-side categories, while the backend organizes them through Modules. This is acceptable for Phase 1, with Module Management being a natural Phase 2 extension.

**Next Steps:** Focus on API integration and any UX refinements for Entity Templates. Module/Form/Dictionary management are separate initiatives.

---

## Appendix: Future Phase Roadmap

Based on documentation analysis, recommended order for future UI development:

| Phase | Feature | Rationale |
|-------|---------|-----------|
| ✅ **1** | Entity Templates | Foundation - defines data structure |
| 2 | Module Management | Organizational layer - bundles everything |
| 3 | Dictionary Management | Reference data - needed by forms |
| 4 | Form Templates | Data entry UX - multiple per entity |
| 5 | Form-Entity Mappings | Field translation rules |
| 6 | Workflow Configuration | Process automation |
| 7 | Entity Action Triggers | Auto-start workflows |

**Seed Execution Order (from deep dive):**
1. Dictionaries → 2. Entity Templates → 3. Forms → 4. Module Definition → 5. Module Entity Templates → 6. Process Definitions → 7. Mappings → 8. Triggers → 9. User Groups
