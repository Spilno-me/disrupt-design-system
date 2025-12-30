/**
 * REAL EXAMPLE: Adapter Pattern Isolating Breaking Change
 *
 * Scenario: DDS v2 → v3 renamed props in EntityTemplatesPage
 * - `templates` → `items`
 * - `onTemplateDelete` → `onItemDelete`
 * - Added new required prop: `entityType`
 *
 * This file shows how an adapter isolates the breaking change.
 */

// ============================================================
// YOUR API TYPES (unchanged across DDS versions)
// ============================================================

interface ApiTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: { id: string; name: string };
  isSystem: boolean;
  fieldCount: number;
}

// ============================================================
// BEFORE: DDS v2 Adapter (adapters/templates.adapter.tsx)
// ============================================================

// import { EntityTemplatesPage, type EntityTemplate } from '@dds/design-system/flow';

/*
export function TemplatesPageAdapter({
  apiTemplates,
  onDelete,
  canUserDelete
}: {
  apiTemplates: ApiTemplate[];
  onDelete: (id: string) => void;
  canUserDelete: boolean;
}) {
  // Transform API data → DDS v2 interface
  const templates: EntityTemplate[] = apiTemplates.map(t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    createdAt: t.createdAt,
    author: t.createdBy.name,
    isSystem: t.isSystem,
    fieldsCount: t.fieldCount,
  }));

  return (
    <EntityTemplatesPage
      templates={templates}                              // v2 prop name
      onTemplateDelete={canUserDelete ? onDelete : undefined}  // v2 prop name
      canDelete={(t) => !t.isSystem}
    />
  );
}
*/

// ============================================================
// AFTER: DDS v3 Adapter (same file, updated)
// ============================================================

// Simulated DDS v3 imports
type EntityTemplate = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  author: string;
  isSystem: boolean;
  fieldsCount: number;
};

// Simulated component for example purposes
const EntityTemplatesPage = (_props: {
  items: EntityTemplate[];
  entityType: string;
  onItemDelete?: (id: string) => void;
  canDelete?: (item: EntityTemplate) => boolean;
}) => null;

export function TemplatesPageAdapter({
  apiTemplates,
  onDelete,
  canUserDelete
}: {
  apiTemplates: ApiTemplate[];
  onDelete: (id: string) => void;
  canUserDelete: boolean;
}) {
  // Transform API data → DDS v3 interface (SAME transformation logic)
  const items: EntityTemplate[] = apiTemplates.map(t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    createdAt: t.createdAt,
    author: t.createdBy.name,
    isSystem: t.isSystem,
    fieldsCount: t.fieldCount,
  }));

  return (
    <EntityTemplatesPage
      items={items}                                      // v3 prop name (was: templates)
      entityType="template"                              // v3 NEW required prop
      onItemDelete={canUserDelete ? onDelete : undefined}  // v3 prop name (was: onTemplateDelete)
      canDelete={(t) => !t.isSystem}
    />
  );
}

// ============================================================
// YOUR ROUTE FILE (unchanged across DDS versions!)
// ============================================================

/*
// routes/templates.tsx - THIS FILE DOESN'T CHANGE

import { useTemplates, useDeleteTemplate } from '../api/templates';
import { useAuth } from '../auth';
import { TemplatesPageAdapter } from '../adapters/templates.adapter';

export function TemplatesRoute() {
  const { data: templates, isLoading } = useTemplates();
  const { mutate: deleteTemplate } = useDeleteTemplate();
  const { user } = useAuth();

  if (isLoading) return <Loading />;

  return (
    <TemplatesPageAdapter
      apiTemplates={templates}                    // Your API data shape
      onDelete={(id) => deleteTemplate(id)}       // Your mutation
      canUserDelete={user.permissions.includes('template:delete')}  // Your auth
    />
  );
}
*/

// ============================================================
// WHAT CHANGED vs WHAT STAYED
// ============================================================

/*
┌─────────────────────────────────────────────────────────────┐
│ DDS v2 → v3 Breaking Change                                 │
├─────────────────────────────────────────────────────────────┤
│ CHANGED (1 file):                                           │
│   adapters/templates.adapter.tsx                            │
│     - templates → items                                     │
│     - onTemplateDelete → onItemDelete                       │
│     - Added entityType="template"                           │
│                                                             │
│ UNCHANGED:                                                  │
│   routes/templates.tsx          (imports adapter, not DDS)  │
│   api/templates.ts              (API layer untouched)       │
│   auth/index.ts                 (Auth untouched)            │
│   All other routes using TemplatesPageAdapter               │
└─────────────────────────────────────────────────────────────┘

The adapter is the ONLY file that knows about DDS prop names.
Your routes know about YOUR types (ApiTemplate, user.permissions).
Breaking change isolated to 1 file. TypeScript catches it at CI.
*/

// ============================================================
// WHAT ABOUT "NEW REQUIRED DATA"?
// ============================================================

/*
Q: "What if DDS v3 needs data I don't currently fetch?"

Example: DDS v3 now REQUIRES `lastModifiedAt` on each template.

SCENARIO A: Data exists in your API but you weren't using it
  → Update adapter mapping (add lastModifiedAt: t.updatedAt)
  → Still 1 file change

SCENARIO B: Data doesn't exist in your API
  → You need to update your API query to include it
  → This is unavoidable regardless of architecture
  → But the ROUTE still doesn't change - only adapter + API hook

SCENARIO C: You can't get the data
  → Report to DDS: "We can't provide lastModifiedAt"
  → DDS makes it optional OR provides sensible default
  → This is negotiation, not a blocker
*/
