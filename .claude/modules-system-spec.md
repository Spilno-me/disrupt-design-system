# Modules System - Complete Specification

> Extracted from EMEX X Application - The module infrastructure for packaging EHS features

## Overview

The Module System is the core infrastructure for packaging and deploying EHS management features (Incident Management, Corrective Actions, Audits, etc.) as self-contained, versioned units. Each module bundles its own data definitions, workflows, forms, user groups, and permissions.

---

## 1. Data Model

### 1.1 Core Module Entity

```typescript
interface Module {
  // Identity
  id: string;                           // UUID
  name: string;                         // Display name
  code: string;                         // Unique identifier (kebab-case)
  version: string;                      // Semantic version (e.g., "1.0.0")

  // Configuration
  status: ModuleStatus;
  primaryEntityTemplateCode?: string;   // Main entity template for this module

  // Audit
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;

  // Soft Delete
  isDeleted: boolean;
  deletedAt?: Date;
  deletedById?: string;
}

type ModuleStatus = 'draft' | 'active' | 'inactive';
```

### 1.2 Module Entity Template (Junction)

```typescript
interface ModuleEntityTemplate {
  // Composite Key
  moduleId: string;                     // FK → Module
  entityTemplateCode: string;           // FK → EntityTemplate

  // Configuration
  primaryFormTemplateId?: string;       // Default form for creating entities
  configurationJson?: ModuleEntityTemplateConfig;
}

interface ModuleEntityTemplateConfig {
  locationField?: string;               // Form field for extracting location ID
  // Extensible for future module-specific settings
}
```

### 1.3 Module User Group

```typescript
interface ModuleUserGroup {
  id: string;                           // UUID
  moduleId: string;                     // FK → Module (scoped)
  name: string;
  code: string;                         // Unique within module
  description?: string;

  // Relationships
  users: ModuleUserGroupUser[];

  // Audit
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedById?: string;
}

interface ModuleUserGroupUser {
  // Composite Key
  moduleUserGroupId: string;
  userId: string;

  // Audit
  createdAt: Date;
  createdBy?: string;
}
```

### 1.4 Process Definition Template

```typescript
interface ProcessDefinitionTemplate {
  id: string;                           // UUID
  moduleId: string;                     // FK → Module

  // Identity
  processDefinitionKey: string;         // Unique per module (used in BPMN)
  name: string;
  description?: string;

  // BPMN Content
  bpmnXml: string;                      // Full BPMN 2.0 XML

  // Deployment State
  status: ProcessStatus;
  deployedAt?: Date;
  flowableDeploymentId?: string;        // Reference to Flowable engine

  // Flags
  isSystem: boolean;                    // System-defined vs user-created

  // Audit
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;
  isDeleted: boolean;
}

type ProcessStatus = 'draft' | 'deployed' | 'suspended';
```

### 1.5 Entity Action Process Trigger

```typescript
interface EntityActionProcessTrigger {
  id: string;                           // UUID

  // Trigger Configuration
  moduleId: string;                     // FK → Module
  entityTemplateCode: string;           // Which entity triggers this
  processDefinitionTemplateId: string;  // Which workflow to start

  // Trigger Conditions
  action: TriggerAction;                // When to trigger
  isActive: boolean;

  // Variable Mapping
  mappingJson: TriggerMapping;          // Entity → Process variables
}

type TriggerAction = 'create' | 'update' | 'delete';

interface TriggerMapping {
  variables: Record<string, string>;    // Handlebars templates
  // Example: { "actionOwner": "{{entity.action_owner_id}}" }
}
```

### 1.6 Form Template

```typescript
interface FormTemplate {
  id: string;                           // UUID
  moduleId: string;                     // FK → Module
  entityTemplateCode?: string;          // FK → EntityTemplate

  // Identity
  code: string;                         // Unique within module
  name: string;
  description?: string;
  version: number;

  // Schema
  schemaJson: FormSchema;               // JSON Schema for fields
  uiSchema?: UISchema;                  // Optional UI hints

  // Audit & Soft Delete
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

interface FormSchema {
  type: 'object';
  properties: Record<string, FieldSchema>;
  required?: string[];
}
```

---

## 2. Module Components

A complete module packages these components:

| Component | Table | Purpose |
|-----------|-------|---------|
| **Entity Templates** | `module_entity_templates` | Data models with JSON Schema |
| **Forms** | `form_templates` | UI schemas for data entry |
| **Form-Entity Mappings** | `form_entity_mappings` | Map form fields → entity properties |
| **Workflows** | `process_definition_templates` | BPMN 2.0 process definitions |
| **Form-Workflow Mappings** | `form_workflow_mappings` | Link forms to workflow tasks |
| **Triggers** | `entity_action_process_triggers` | Auto-start workflows on entity actions |
| **User Groups** | `module_user_groups` | Task assignment groups |
| **Dictionaries** | `dictionaries` | Dropdown/select options |
| **Roles** | `user_roles` | Permission statements |

### Component Relationships

```
Module
├── Entity Templates (1:N via ModuleEntityTemplate)
│   ├── Forms (1:N)
│   │   ├── Form-Entity Mappings (1:N)
│   │   └── Form-Workflow Mappings (1:N)
│   └── Triggers (1:N)
│       └── Process Definition Template (N:1)
├── Process Definition Templates (1:N)
├── User Groups (1:N)
│   └── Users (N:M via ModuleUserGroupUser)
├── Dictionaries (via category)
└── Roles (via statement scope)
```

---

## 3. API Endpoints

### 3.1 Module CRUD

```
GET    /api/v1/modules
       Query: page, pageSize, status, search, sortField, sortDirection
       Response: PaginatedModuleResponse

GET    /api/v1/modules/:id
       Response: ModuleItemResponse (includes entityTemplates)

POST   /api/v1/modules
       Body: CreateModuleRequest
       Response: ModuleItemResponse

PATCH  /api/v1/modules/:id
       Body: UpdateModuleRequest
       Response: ModuleItemResponse

DELETE /api/v1/modules/:id
       Response: 204 No Content (soft delete)
```

### 3.2 Module Entity Templates

```
GET    /api/v1/modules/:moduleId/entity-templates
       Response: ModuleEntityTemplateResponse[]

PATCH  /api/v1/modules/:moduleId/entity-templates/:entityTemplateCode
       Body: { primaryFormTemplateId?, configurationJson? }
       Response: ModuleEntityTemplateResponse
```

### 3.3 Module User Groups

```
GET    /api/v1/modules/:moduleId/user-groups
       Query: page, pageSize, search
       Response: ListModuleUserGroupsResponse

GET    /api/v1/modules/:moduleId/user-groups/:groupId
       Response: ModuleUserGroupDetailResponse (includes users)

POST   /api/v1/modules/:moduleId/user-groups
       Body: { name, code, description?, userIds? }
       Response: ModuleUserGroupDetailResponse

PATCH  /api/v1/modules/:moduleId/user-groups/:groupId
       Body: { name?, description?, userIds? }
       Response: ModuleUserGroupDetailResponse

DELETE /api/v1/modules/:moduleId/user-groups/:groupId
       Response: 204 No Content
```

### 3.4 Process Definitions

```
GET    /api/v1/modules/:moduleId/process-definitions
       Response: ProcessDefinitionTemplateResponse[]

GET    /api/v1/modules/:moduleId/process-definitions/:id
       Response: ProcessDefinitionTemplateResponse

POST   /api/v1/modules/:moduleId/process-definitions
       Body: { processDefinitionKey, name, description?, bpmnXml }
       Response: ProcessDefinitionTemplateResponse

PATCH  /api/v1/modules/:moduleId/process-definitions/:id
       Body: { name?, description?, bpmnXml? }
       Response: ProcessDefinitionTemplateResponse

DELETE /api/v1/modules/:moduleId/process-definitions/:id
       Response: 204 No Content

POST   /api/v1/modules/:moduleId/process-definitions/:id/deploy
       Response: ProcessDefinitionTemplateResponse (status: deployed)

POST   /api/v1/modules/:moduleId/process-definitions/:id/suspend
       Response: ProcessDefinitionTemplateResponse (status: suspended)

POST   /api/v1/modules/:moduleId/process-definitions/:id/resume
       Response: ProcessDefinitionTemplateResponse (status: deployed)
```

---

## 4. Response Models

### 4.1 Module Responses

```typescript
interface ModuleItemResponse {
  id: string;
  name: string;
  code: string;
  version: string;
  status: ModuleStatus;
  createdAt: string;
  updatedAt: string;
  entityTemplates?: EntityTemplateResponse[];
  primaryEntityTemplate?: EntityTemplateResponse;
}

interface PaginatedModuleResponse {
  modules: ModuleItemResponse[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}
```

### 4.2 Module Entity Template Response

```typescript
interface ModuleEntityTemplateResponse {
  moduleId: string;
  moduleCode: string;
  entityTemplateId: string;
  entityTemplateCode: string;
  entityTemplateName: string;
  primaryFormTemplateId?: string;
  primaryFormTemplateCode?: string;
  configurationJson?: ModuleEntityTemplateConfig;
}
```

### 4.3 User Group Responses

```typescript
interface ModuleUserGroupResponse {
  id: string;
  name: string;
  code: string;
  description?: string;
  memberCount: number;
}

interface ModuleUserGroupDetailResponse extends ModuleUserGroupResponse {
  users: UserSummary[];
}

interface UserSummary {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
```

### 4.4 Process Definition Response

```typescript
interface ProcessDefinitionTemplateResponse {
  id: string;
  processDefinitionKey: string;
  name: string;
  description?: string;
  status: ProcessStatus;
  isSystem: boolean;
  deployedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Module Lifecycle

### 5.1 State Machine

```
┌─────────┐     activate      ┌─────────┐
│  DRAFT  │ ─────────────────▶│ ACTIVE  │
└─────────┘                   └─────────┘
     │                             │
     │                             │ deactivate
     │                             ▼
     │                       ┌──────────┐
     └──────────────────────▶│ INACTIVE │
           deactivate        └──────────┘
                                   │
                                   │ activate
                                   ▼
                             ┌─────────┐
                             │ ACTIVE  │
                             └─────────┘
```

### 5.2 Installation Flow (Seeding)

```
1. Build Docker Image
   └── MODULE_VERSION env var set from package.json

2. Container Starts
   └── Runs dist/index.js (compiled from seed.ts)

3. Module Installer Executes
   ├── Connects to PostgreSQL
   ├── Wraps in transaction
   └── Calls seed(prisma, fileUtils, version)

4. Seed Function Runs
   ├── Read files from src/files/
   ├── Upsert dictionaries (CSV)
   ├── Upsert entity templates
   ├── Upsert module record
   ├── Upsert forms (JSON)
   ├── Upsert process definitions (BPMN)
   ├── Upsert triggers
   ├── Upsert user groups
   └── Upsert roles

5. Transaction Commits
   └── Exit 0 (success) or Exit 1 (rollback on error)
```

### 5.3 Workflow Deployment Flow

```
1. Create Process Definition Template (status: draft)
   ↓
2. Edit BPMN XML (visual editor or text)
   ↓
3. Validate BPMN Structure
   ↓
4. Deploy to Flowable (POST .../deploy)
   ├── BPMN sent to Flowable engine
   ├── flowableDeploymentId stored
   └── status → deployed
   ↓
5. Active - Workflows can be triggered
   ↓
6. Optional: Suspend (POST .../suspend)
   └── Pauses new instances, existing continue
   ↓
7. Optional: Resume (POST .../resume)
   └── Re-enables new instances
```

---

## 6. Permissions (PBAC)

### 6.1 Module Resource Permissions

| Resource | Action | Description |
|----------|--------|-------------|
| `module` | `ManageModule:create` | Create new modules |
| `module` | `ManageModule:read` | List/view modules |
| `module` | `ManageModule:update` | Edit module settings |
| `module` | `ManageModule:delete` | Soft delete modules |

### 6.2 Permission Statement Example

```json
{
  "module": {
    "ManageModule": {
      "Action": ["create", "read", "update", "delete"],
      "Effect": "Allow"
    }
  },
  "process-definition": {
    "ManageProcessDefinition": {
      "Action": ["create", "read", "update", "delete", "deploy"],
      "Effect": "Allow"
    }
  }
}
```

### 6.3 Role Hierarchy

| Role | Module Permissions |
|------|-------------------|
| **Super Admin** | Full access to all modules |
| **Module Admin** | Full access to assigned modules |
| **Module User** | Read access, entity operations only |

---

## 7. Module Package Structure

### 7.1 Directory Layout

```
modules/{module-name}/
├── package.json              # @disrupt/module-{name}
├── tsconfig.json
├── Dockerfile               # FROM module-installer base
├── module.yml               # Module metadata (optional)
├── README.md
└── src/
    ├── index.ts             # Entry point (calls seed)
    ├── seed.ts              # Main seed function
    ├── constants.ts         # Form IDs, codes, etc.
    ├── seeds/               # Individual seeders
    │   ├── dictionaries.seed.ts
    │   ├── entityTemplates.seed.ts
    │   ├── modules.seed.ts
    │   ├── forms.seed.ts
    │   ├── processDefinitionTemplate.seed.ts
    │   ├── entityActionProcessTrigger.seed.ts
    │   ├── formEntityMapping.seed.ts
    │   ├── formWorkflowMapping.seed.ts
    │   ├── moduleUserGroups.seed.ts
    │   └── roles.seed.ts
    └── files/               # Static assets
        ├── forms/           # JSON form schemas
        ├── workflows/       # BPMN XML files
        ├── formEntityMapping/
        ├── formWorkflowMapping/
        ├── entityWorkflowActionMappings/
        ├── dictionaryCategories.csv
        └── dictionaries.csv
```

### 7.2 Package.json Example

```json
{
  "name": "@disrupt/module-carus-corrective-actions",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@disrupt/module-installer": "workspace:*",
    "@disrupt/emex-prisma": "workspace:*"
  }
}
```

### 7.3 Seed Function Signature

```typescript
import { installModule, FileUtils } from '@disrupt/module-installer';
import { PrismaClient } from '@disrupt/emex-prisma';

async function seed(
  prisma: PrismaClient,
  fileUtils: FileUtils,
  version: string
): Promise<void> {
  // 1. Seed dictionaries
  await seedDictionaries(prisma, fileUtils);

  // 2. Seed entity templates
  await seedEntityTemplates(prisma);

  // 3. Seed module
  const module = await seedModule(prisma, version);

  // 4. Seed forms
  await seedForms(prisma, fileUtils, module.id);

  // 5. Seed process definitions
  await seedProcessDefinitions(prisma, fileUtils, module.id);

  // 6. Seed triggers
  await seedTriggers(prisma, fileUtils, module.id);

  // 7. Seed mappings
  await seedFormEntityMappings(prisma, fileUtils);
  await seedFormWorkflowMappings(prisma, fileUtils);

  // 8. Seed user groups
  await seedUserGroups(prisma, module.id);

  // 9. Seed roles
  await seedRoles(prisma);
}

// Self-executing entry point
installModule(seed, { transactional: true });
```

---

## 8. File Utilities API

```typescript
interface FileUtils {
  // Read JSON with type safety
  readJsonFile<T>(relativePath: string): Promise<T>;

  // Read YAML configuration
  readYmlFile<T>(relativePath: string): Promise<T>;

  // Read text (BPMN, SQL, etc.)
  readTextFile(relativePath: string): Promise<string>;

  // Read CSV with auto type-casting
  readCsvFile(relativePath: string): Promise<Record<string, unknown>[]>;

  // Check file existence
  fileExists(relativePath: string): Promise<boolean>;

  // List directory contents
  listFiles(relativeDir: string): Promise<string[]>;
}

// Usage in seed:
const bpmnXml = await fileUtils.readTextFile('workflows/myProcess.bpmn');
const formSchema = await fileUtils.readJsonFile<FormSchema>('forms/myForm.json');
const dictItems = await fileUtils.readCsvFile('dictionaries.csv');
```

---

## 9. Trigger Mapping Syntax

### 9.1 Handlebars Templates

```json
{
  "variables": {
    "actionOwner": "{{entity.action_owner_id}}",
    "actionTitle": "{{entity.title}}",
    "dueDate": "{{entity.due_date}}",
    "priority": "{{entity.priority}}",
    "locationId": "{{entity.location_id}}"
  }
}
```

### 9.2 Form-Entity Mapping

```json
{
  "variables": {
    "title": "{{form.actionTitle}}",
    "description": "{{form.detailedDescription}}",
    "status": "assigned",
    "location_id": "{{form.location}}",
    "estimated_cost": "{{#if form.estimatedCost}}{{form.estimatedCost}}{{/if}}"
  }
}
```

### 9.3 Form-Workflow Mapping

```json
{
  "variables": {
    "actionStatus": "{{form.actionDecision}}",
    "completionDate": "{{form.completionDate}}"
  }
}
```

---

## 10. User Group Integration with BPMN

### 10.1 Candidate Group Assignment

In BPMN XML:
```xml
<userTask id="Task_ReviewExtension"
          name="Review Extension Request"
          flowable:candidateGroups="corrective-actions-safety-manager">
  <!-- Task assigned to user group -->
</userTask>
```

### 10.2 User Assignment via Variable

```xml
<userTask id="Task_CompleteAction"
          name="Complete Action Item"
          flowable:assignee="${actionOwner}">
  <!-- Task assigned to specific user from process variable -->
</userTask>
```

### 10.3 Group Code Format

```
{module-code}-{group-name}
Example: corrective-actions-safety-manager
```

---

## 11. Existing Modules

| Module | Code | Primary Entity | Description |
|--------|------|----------------|-------------|
| **Incident Management** | `incident-management` | `incident` | Safety incident reporting & investigation |
| **Corrective Actions** | `corrective-actions` | `corrective-action` | CAPA tracking & approval workflows |
| **Default Configuration** | `default-configuration` | - | System defaults, base dictionaries |
| **Test Users** | `test-users` | - | Development test accounts |

---

## 12. Design Patterns

### 12.1 Soft Delete Pattern

All module-related entities use:
```typescript
{
  isDeleted: boolean;
  deletedAt?: Date;
  deletedById?: string;
}
```

Query filter: `WHERE isDeleted = false`

### 12.2 Module Scoping Pattern

All features are scoped to a module via `moduleId`:
- Forms belong to one module
- Workflows belong to one module
- User groups belong to one module
- Triggers belong to one module

### 12.3 Composite Key Pattern

`ModuleEntityTemplate` uses composite key:
```typescript
@@id([moduleId, entityTemplateCode])
```

Enables efficient queries without additional joins.

### 12.4 JSONB Configuration Pattern

Flexible configuration without schema migration:
```typescript
configurationJson: {
  locationField: "location",
  customSetting: "value"
}
```

---

## 13. Security Considerations

### 13.1 Audit Trail

All operations are logged:
- `createdAt`, `createdBy` on creation
- `updatedAt`, `updatedBy` on updates
- `deletedAt`, `deletedById` on soft delete
- Security events logged for deployments

### 13.2 Transaction Safety

Module installation runs in database transaction:
- All-or-nothing seeding
- Automatic rollback on error
- Prevents partial installations

### 13.3 Input Validation

- Form schemas validated against JSON Schema
- BPMN validated before deployment
- User IDs validated against user table
- Code uniqueness enforced at database level

---

## 14. Integration Points

### 14.1 Flowable Engine

- Process definitions deployed to Flowable
- Task management via Flowable REST API
- Process instance tracking

### 14.2 Entity System

- Modules link to entity templates
- Triggers start workflows on entity events
- Forms create/update entities

### 14.3 Authentication

- JWT tokens for API access
- User context injected via `@CurrentUser()`
- PBAC policy evaluation

---

*Document Version: 1.0.0*
*Extracted: 2025-12-31*
*Source: EMEX X Application*
