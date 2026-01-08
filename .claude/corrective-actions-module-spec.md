# Corrective Actions Module - Complete Specification

> Extracted from EMEX X Application for DDS component design

## Overview

The Corrective Actions module manages the lifecycle of corrective and preventive actions (CAPAs) triggered by incidents, audits, inspections, complaints, near-misses, or observations. It provides full workflow management from assignment through completion and closure approval.

---

## 1. Data Model

### Core Entity Schema

```typescript
interface CorrectiveAction {
  // Identity
  id: string;                          // UUID
  businessKey: string;                 // CA-{rowNum} format
  entityTemplateCode: 'corrective-action';

  // Required Core Fields
  title: string;                       // max 255 chars
  description: string;                 // Detailed action description
  due_date: string;                    // ISO date-time
  status: CorrectiveActionStatus;
  priority: Priority;

  // Classification
  action_type_id: string;              // UUID -> ACTION_TYPE dictionary
  category_id: string;                 // UUID -> CORRECTIVE_ACTION_CATEGORY
  source_type_id: string;              // UUID -> SOURCE_TYPE
  source_reference_number?: string;    // Reference from source entity

  // Assignment
  location_id: string;                 // UUID -> Location
  action_owner_id: string;             // UUID -> User (assigned to)
  assigned_date?: string;              // ISO date-time
  responsible_department_id?: string;  // UUID -> DEPARTMENT

  // Implementation Details
  implementation_plan?: string;
  root_cause_analysis?: string;
  root_cause_category_id?: string;     // UUID -> ROOT_CAUSE_CATEGORY
  verification_method?: string;
  success_criteria?: string;
  estimated_cost?: number;
  specific_location_details?: string;

  // Completion
  completion_notes?: string;
  completion_evidence?: FileAttachment[];
  completed_date?: string;
  effectiveness_assessment?: EffectivenessRating;

  // Extension Management
  extension_requested?: boolean;
  requested_due_date?: string;
  extension_justification?: string;
  extension_approved?: boolean;
  approved_due_date?: string;

  // Closure Approval
  closure_approved?: boolean;
  closure_approved_by?: string;        // UUID -> User
  closure_date?: string;
  closure_comments?: string;

  // Related Data
  related_incident_id?: string;        // UUID -> Incident
  deferred_reason?: string;
  rejection_reason?: string;

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
}
```

### Enums & Types

```typescript
type CorrectiveActionStatus =
  | 'assigned'           // Initial state after creation
  | 'in-progress'        // Work has started
  | 'pending-approval'   // Awaiting closure approval
  | 'completed'          // Action completed, awaiting closure
  | 'closed'             // Fully closed and approved
  | 'deferred';          // Temporarily postponed

type Priority = 'low' | 'medium' | 'high' | 'urgent';

type EffectivenessRating =
  | 'highly-effective'
  | 'effective'
  | 'partially-effective'
  | 'not-effective'
  | 'too-early';         // Too early to assess

interface FileAttachment {
  file_name: string;
  file_url: string;
  file_type: string;
}
```

---

## 2. Dictionary Data (Lookup Tables)

### ACTION_TYPE
| Code | Name | Description |
|------|------|-------------|
| `DOCUMENT_ACTION` | Document Action | Document processes/findings |
| `GENERAL_ACTION` | General Action | Standard tasks/activities |
| `INCIDENT_CORRECTIVE_ACTION` | Incident Corrective Action | Response to incidents |

### CORRECTIVE_ACTION_CATEGORY
| Code | Name | Description |
|------|------|-------------|
| `SAFETY` | Safety | Workplace health/safety |
| `QUALITY` | Quality | Product/service quality |
| `ENVIRONMENTAL` | Environmental | Environmental protection |
| `PROCESS_IMPROVEMENT` | Process Improvement | Operational improvement |
| `TRAINING` | Training | Personnel training |

### SOURCE_TYPE
| Code | Name | Description |
|------|------|-------------|
| `incident` | Incident | From incident report |
| `audit` | Audit | From audit finding |
| `inspection` | Inspection | From inspection/assessment |
| `complaint` | Complaint | From customer/employee |
| `near-miss` | Near Miss | From near miss event |
| `observation` | Observation | From safety/quality observation |

### ROOT_CAUSE_CATEGORY
| Code | Name | Description |
|------|------|-------------|
| `HUMAN_ERROR` | Human Error | Human error/mistake |
| `EQUIPMENT_FAILURE` | Equipment Failure | Equipment malfunction |
| `PROCESS_DEFICIENCY` | Process Deficiency | Inadequate process |
| `TRAINING_GAP` | Training Gap | Insufficient training |
| `DESIGN_FLAW` | Design Flaw | Design deficiency |
| `EXTERNAL_FACTORS` | External Factors | External circumstances |

---

## 3. Workflow States & Transitions

### State Machine Diagram

```
                    ┌─────────────────────────────────────────────┐
                    │                                             │
                    ▼                                             │
┌──────────┐   ┌─────────────┐   ┌───────────────┐   ┌────────┐  │
│ ASSIGNED │──▶│ IN-PROGRESS │──▶│ PENDING-APPR. │──▶│ CLOSED │  │
└──────────┘   └─────────────┘   └───────────────┘   └────────┘  │
     │               │                  │                        │
     │               │                  │ [Rejected]             │
     │               │                  └────────────────────────┘
     │               │
     │               ▼
     │         ┌──────────┐
     │         │ DEFERRED │ (wait for resume)
     │         └──────────┘
     │               │
     │               ▼
     │    ┌─────────────────────┐
     └───▶│ EXTENSION REQUESTED │
          └─────────────────────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     [Approved]          [Rejected]
          │                   │
          ▼                   ▼
   Update Due Date    Return to Work
          │                   │
          └───────────────────┘
```

### Workflow Tasks

| Task | Assignee | Form | Next States |
|------|----------|------|-------------|
| Complete Action Item | Action Owner | complete-action-item | completed, needsExtension, deferred |
| Request Date Extension | Action Owner | request-date-extension | Awaiting Review |
| Review Extension Request | Safety Manager | review-extension-request | Approved → Work, Rejected → Re-request |
| Approve Action Closure | Safety Manager | approve-action-closure | Approved → Closed, Rejected → Rework |

---

## 4. Forms Specification

### Form 1: Create Corrective Action (Main Form)

**Purpose:** Create new corrective action entry

| Field | Type | Required | Validation | Dictionary |
|-------|------|----------|------------|------------|
| `location` | LocationSelect | ✅ | Valid location | - |
| `actionTitle` | Input | ✅ | 1-255 chars | - |
| `detailedDescription` | TextArea | ✅ | Non-empty | - |
| `category` | DictionarySelect | ✅ | Valid value | CORRECTIVE_ACTION_CATEGORY |
| `priority` | Select | ✅ | low\|medium\|high\|urgent | - |
| `actionType` | DictionarySelect | ✅ | Valid value | ACTION_TYPE |
| `sourceType` | DictionarySelect | ✅ | Valid value | SOURCE_TYPE |
| `sourceReferenceNumber` | GenericEntitySelect | ✅ | Dynamic based on sourceType | - |
| `actionOwner` | UserSelect | ✅ | Valid user | - |
| `dueDate` | DatePicker | ✅ | Future date | - |
| `implementationPlan` | TextArea | ✅ | Non-empty | - |
| `verificationMethod` | TextArea | ✅ | Non-empty | - |
| `successCriteria` | TextArea | ❌ | - | - |
| `estimatedCost` | NumberPicker | ❌ | >= 0 | - |
| `specificLocationDetails` | Input | ❌ | - | - |

---

### Form 2: Complete Action Item

**Purpose:** Report completion status and decision

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `completionDate` | DatePicker | ✅ | Valid date |
| `completionNotes` | TextArea | ❌ | - |
| `effectiveness` | Select | ❌ | EffectivenessRating enum |
| `challengesFaced` | TextArea | ❌ | - |
| `followUpDetails` | TextArea | ❌ | - |
| `actionDecision` | Select | ✅ | completed\|needsExtension\|deferred |

**Routing Logic:**
- `completed` → Approval workflow
- `needsExtension` → Extension request
- `deferred` → Wait state

---

### Form 3: Request Date Extension

**Purpose:** Request new due date with justification

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `currentDueDate` | DatePicker (readonly) | ✅ | Pre-filled |
| `requestDate` | DatePicker (readonly) | ✅ | Auto: today |
| `newDueDate` | DatePicker | ✅ | Future date |
| `reasonCategory` | Select | ✅ | resource-constraints\|technical-challenges\|external-dependencies\|other |
| `justification` | TextArea | ✅ | Min 20 chars |
| `urgency` | Select | ❌ | low\|medium\|high\|critical |
| `mitigationActions` | TextArea | ❌ | - |

---

### Form 4: Review Extension Request

**Purpose:** Manager approval/rejection of extension

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `dateChangeApproved` | Select | ✅ | true\|false |
| `newDueDate` | DatePicker | Conditional | Required if approved |
| `approvedBy` | UserSelect (readonly) | ✅ | Current user |
| `approvalComments` | TextArea | ❌ | - |

---

### Form 5: Approve Action Closure

**Purpose:** Final closure decision

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `actionApproved` | Select | ✅ | true\|false |
| `evidenceReview` | TextArea | ❌ | - |
| `additionalRequirements` | TextArea | Conditional | If rejected |

---

## 5. API Endpoints

### Entity Operations

```
GET    /api/v1/modules/{moduleId}/entities
       Query: status, priority, location_id, action_owner_id, due_date_from, due_date_to
       Response: Paginated list of corrective actions

GET    /api/v1/modules/{moduleId}/entities/{entityId}
       Response: Full corrective action with related data

POST   /api/v1/modules/{moduleId}/entities
       Body: Form submission data
       Response: Created entity with businessKey

PUT    /api/v1/modules/{moduleId}/entities/{entityId}
       Body: Partial update data
       Response: Updated entity

DELETE /api/v1/modules/{moduleId}/entities/{entityId}
       Response: Soft delete confirmation
```

### Workflow Operations

```
GET    /api/v1/tasks
       Query: assignee, candidateGroup, category=corrective-action
       Response: List of pending workflow tasks

POST   /api/v1/tasks/{taskId}/complete
       Body: Form data with task variables
       Response: Task completion confirmation

GET    /api/v1/process-instances/{processInstanceId}
       Response: Process state and history
```

### File Operations

```
POST   /api/v1/entities/{entityId}/files
       Body: multipart/form-data
       Response: File attachment record

GET    /api/v1/entities/{entityId}/files
       Response: List of attachments

DELETE /api/v1/entities/{entityId}/files/{fileId}
       Response: Deletion confirmation
```

---

## 6. Permissions (PBAC)

### Roles

| Role | Permissions |
|------|-------------|
| **Corrective Action Manager** | Full CRUD on all corrective actions |
| **Corrective Action Creator** | Create + Read all, Update own |
| **User** | Read own, Update own assigned tasks |
| **Safety Manager** | Approve extensions, Approve closures |

### Permission Matrix

| Action | Manager | Creator | User | Safety Manager |
|--------|---------|---------|------|----------------|
| List All | ✅ | ✅ | Own Only | ✅ |
| View Details | ✅ | ✅ | Own Only | ✅ |
| Create | ✅ | ✅ | ❌ | ❌ |
| Update | ✅ | Own Only | Own Tasks | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ |
| Complete Task | ✅ | Own Tasks | Own Tasks | ❌ |
| Approve Extension | ✅ | ❌ | ❌ | ✅ |
| Approve Closure | ✅ | ❌ | ❌ | ✅ |

---

## 7. Business Rules

### Validation Rules

1. **Due Date**: Must be future date on creation
2. **Extension Request**: New date must be after current due date
3. **Completion Date**: Cannot be future date
4. **System Actions**: Cannot be deleted if linked to incidents
5. **Closure**: Requires all evidence fields populated

### Status Transition Rules

| From | To | Condition |
|------|-----|-----------|
| assigned | in-progress | First update by owner |
| in-progress | pending-approval | actionDecision = completed |
| in-progress | deferred | actionDecision = deferred |
| pending-approval | closed | closureApproved = true |
| pending-approval | in-progress | closureApproved = false |
| * | extension-requested | actionDecision = needsExtension |

### Auto-Triggers

- **On Create**: Auto-start workflow process
- **On Extension Approved**: Update due_date to approved_due_date
- **On Closure Approved**: Set status to 'closed', closure_date to now

---

## 8. Notifications

| Event | Recipients | Channel |
|-------|------------|---------|
| Action Assigned | Action Owner | In-app, Email |
| Due Date Approaching (7d) | Action Owner | In-app |
| Due Date Approaching (1d) | Action Owner | In-app, Email |
| Extension Requested | Safety Managers | In-app |
| Extension Approved | Action Owner | In-app |
| Extension Rejected | Action Owner | In-app, Email |
| Closure Pending | Safety Managers | In-app |
| Closure Approved | Action Owner | In-app |
| Closure Rejected | Action Owner | In-app, Email |
| Overdue | Action Owner, Manager | In-app, Email |

---

## 9. Metrics & KPIs

### Dashboard Metrics

| Metric | Calculation |
|--------|-------------|
| Total Open Actions | count(status NOT IN ['closed', 'deferred']) |
| Overdue Actions | count(due_date < today AND status != 'closed') |
| Actions by Priority | group by priority |
| Actions by Category | group by category_id |
| Actions by Status | group by status |
| Avg Time to Close | avg(closure_date - created_at) |
| Extension Rate | count(extension_requested) / total |
| First-Pass Closure Rate | count(closures without rejection) / total_closures |

### Filters

- Date Range (created, due, closed)
- Location
- Category
- Priority
- Status
- Assigned To
- Source Type

---

## 10. Integration Points

### Incident Management

- Corrective actions can be created from incidents
- Source reference links back to incident businessKey
- Location inherited from incident
- Related incident ID maintained for traceability

### Audit Management (Future)

- Actions from audit findings
- Finding reference as source

### Document Management

- Evidence file attachments
- Completion documentation
- Audit trail exports

---

## 11. File Structure Reference

```
/modules/carus-corrective-actions/
├── src/
│   ├── constants.ts
│   ├── seed.ts
│   ├── seeds/
│   │   ├── dictionaries.seed.ts
│   │   ├── entityTemplates.seed.ts
│   │   ├── forms.seed.ts
│   │   ├── modules.seed.ts
│   │   ├── roles.seed.ts
│   │   └── ...
│   └── files/
│       ├── forms/
│       │   ├── corrective-action-main.json
│       │   ├── complete-action-item.json
│       │   ├── request-date-extension.json
│       │   ├── review-extension-request.json
│       │   └── approve-action-closure.json
│       ├── workflows/
│       │   └── correctiveActions.bpmn
│       └── formEntityMapping/
└── module.yml
```

---

*Document Version: 1.0.0*
*Extracted: 2025-12-31*
*Source: EMEX X Application*
