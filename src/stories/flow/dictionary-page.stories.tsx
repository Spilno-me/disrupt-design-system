/**
 * DictionaryPage Stories
 *
 * Storybook stories for the Dictionary Management page.
 * Showcases parent-child hierarchy, tree view, and cascade delete functionality.
 */

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DictionaryPage } from '../../flow/components/dictionary'
import type { DictionaryPageProps } from '../../flow/components/dictionary'
import {
  mockCategories,
  mockInjuryIllnessTypeEntries,
  mockBodyPartEntries,
  mockIncidentTypeEntries,
  mockIncidentSeverityEntries,
  mockActionTypeEntries,
  getEntriesByCategoryId,
} from '../../flow/components/dictionary/data/mock-data'

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

/**
 * Wrapper component that manages state for interactive stories
 */
function InteractiveDictionaryPage({
  initialCategoryId,
  ...props
}: Omit<DictionaryPageProps, 'selectedCategoryId' | 'entries' | 'onCategorySelect'> & {
  initialCategoryId?: string
}) {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | undefined>(
    initialCategoryId
  )

  // Get entries for selected category
  const entries = React.useMemo(() => {
    if (!selectedCategoryId) return []
    return getEntriesByCategoryId(selectedCategoryId)
  }, [selectedCategoryId])

  return (
    <DictionaryPage
      {...props}
      selectedCategoryId={selectedCategoryId}
      entries={entries}
      onCategorySelect={setSelectedCategoryId}
    />
  )
}

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof DictionaryPage> = {
  title: 'Flow/Dictionary Management',
  component: DictionaryPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Dictionary Management Page

A comprehensive dictionary management interface for EHS (Environment, Health, Safety) lookup values.

## Features

- **Categories sidebar**: Browse and select dictionary categories
- **Entries table**: View, edit, and manage dictionary entries
- **Parent-child hierarchy**: Entries can have nested children (up to 3 levels)
- **Tree view toggle**: Switch between flat table and hierarchical tree view
- **Cascade delete**: Deleting a parent removes all descendants
- **Mobile-responsive**: Card-based layout on mobile with touch-friendly interactions

## Hierarchy Support

Entries support parent-child relationships:
- **Max depth**: 3 levels (Parent → Child → Grandchild)
- **Parent selector**: Create/edit dialogs show hierarchy-aware dropdown
- **Tree view**: Toggle to see visual hierarchy with expand/collapse
- **Cascade delete**: Warning shows affected child entries before deletion

## Testing the Hierarchy

1. Select **"Injury/Illness Types"** category from sidebar
2. Click the **Tree** toggle button in the toolbar
3. Expand **"Fractures"** to see children
4. Try editing or deleting a parent to see the cascade warnings
        `,
      },
    },
  },
  argTypes: {
    categories: { control: false },
    entries: { control: false },
    selectedCategoryId: { control: false },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading skeleton state',
    },
  },
}

export default meta
type Story = StoryObj<typeof DictionaryPage>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Interactive dictionary page - click categories in the sidebar to switch.
 * Select "Injury/Illness Types" and toggle Tree view to see hierarchy.
 */
export const Interactive: Story = {
  render: () => (
    <InteractiveDictionaryPage
      categories={mockCategories}
      initialCategoryId="cat-injury-illness-type"
      onCategoryCreate={async (data) => {
        console.log('Category created:', data)
        alert(`Created category: ${data.name}`)
      }}
      onCategoryDelete={async (id) => {
        console.log('Category deleted:', id)
        alert(`Deleted category: ${id}`)
      }}
      onEntryCreate={async (data) => {
        console.log('Entry created:', data)
        alert(`Created entry: ${data.value}\nParent ID: ${data.parentId || 'None (root)'}`)
      }}
      onEntryUpdate={async (data) => {
        console.log('Entry updated:', data)
        alert(`Updated entry: ${data.value}\nParent ID: ${data.parentId || 'None (root)'}`)
      }}
      onEntryDelete={async (id) => {
        console.log('Entry deleted:', id)
        alert(`Deleted entry: ${id}`)
      }}
      onEntryStatusChange={async (id, status) => {
        console.log('Status changed:', id, status)
      }}
      onEntriesReorder={async (entries) => {
        console.log('Entries reordered:', entries)
      }}
      onBulkStatusChange={async (ids, status) => {
        console.log('Bulk status change:', ids, status)
      }}
      onBulkDelete={async (ids) => {
        console.log('Bulk delete:', ids)
        alert(`Deleted ${ids.length} entries`)
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `
**Fully interactive story** - click categories in the sidebar to navigate.

### To test hierarchy:
1. Select **"Injury/Illness Types"** category (default)
2. Click the **Tree** button in the toolbar to toggle tree view
3. Expand **"Fractures"** → see "Open Fracture" and "Closed Fracture"
4. Expand **"Closed Fracture"** → see "Hairline Fracture" (3rd level)
5. Click **Edit** on a parent entry to see parent selector dropdown
6. Click **Delete** on "Fractures" to see cascade delete warning
        `,
      },
    },
  },
}

/**
 * Default static view with Injury/Illness Types category selected.
 * This category has hierarchical entries demonstrating the tree structure.
 */
export const Default: Story = {
  args: {
    categories: mockCategories,
    entries: mockInjuryIllnessTypeEntries,
    selectedCategoryId: 'cat-injury-illness-type',
    isLoading: false,
    onCategorySelect: (id) => console.log('Category selected:', id),
    onEntryCreate: async (data) => console.log('Entry created:', data),
    onEntryUpdate: async (data) => console.log('Entry updated:', data),
    onEntryDelete: async (id) => console.log('Entry deleted:', id),
    onEntryStatusChange: async (id, status) => console.log('Status changed:', id, status),
  },
}

/**
 * Body Parts category - flat structure without hierarchy.
 * Shows how the table looks for non-hierarchical data.
 */
export const FlatEntries: Story = {
  name: 'Flat Structure (No Hierarchy)',
  args: {
    categories: mockCategories,
    entries: mockBodyPartEntries,
    selectedCategoryId: 'cat-body-part',
    isLoading: false,
    onCategorySelect: (id) => console.log('Category selected:', id),
    onEntryCreate: async (data) => console.log('Entry created:', data),
    onEntryUpdate: async (data) => console.log('Entry updated:', data),
    onEntryDelete: async (id) => console.log('Entry deleted:', id),
  },
  parameters: {
    docs: {
      description: {
        story: 'A category with flat (non-hierarchical) entries. The tree view toggle is still available but all entries appear at root level.',
      },
    },
  },
}

/**
 * Incident Types with various status entries.
 */
export const IncidentTypes: Story = {
  args: {
    categories: mockCategories,
    entries: mockIncidentTypeEntries,
    selectedCategoryId: 'cat-incident-type',
    isLoading: false,
    onCategorySelect: (id) => console.log('Category selected:', id),
    onEntryCreate: async (data) => console.log('Entry created:', data),
    onEntryUpdate: async (data) => console.log('Entry updated:', data),
    onEntryDelete: async (id) => console.log('Entry deleted:', id),
  },
}

/**
 * Loading state while fetching data.
 */
export const Loading: Story = {
  args: {
    categories: mockCategories,
    entries: [],
    selectedCategoryId: 'cat-injury-illness-type',
    isLoading: true,
    onCategorySelect: (id) => console.log('Category selected:', id),
  },
}

/**
 * Empty state when no category is selected.
 */
export const NoSelection: Story = {
  name: 'No Category Selected',
  args: {
    categories: mockCategories,
    entries: [],
    selectedCategoryId: undefined,
    isLoading: false,
    onCategorySelect: (id) => console.log('Category selected:', id),
  },
}

/**
 * Mobile viewport - shows card-based layout.
 */
export const MobileView: Story = {
  render: () => (
    <InteractiveDictionaryPage
      categories={mockCategories}
      initialCategoryId="cat-injury-illness-type"
      onEntryCreate={async (data) => console.log('Entry created:', data)}
      onEntryUpdate={async (data) => console.log('Entry updated:', data)}
      onEntryDelete={async (id) => console.log('Entry deleted:', id)}
      onEntryStatusChange={async (id, status) => console.log('Status changed:', id, status)}
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: `
Mobile-responsive layout features:
- Card-based entry display instead of table
- Bottom sheet for category selection
- Touch-friendly 44px targets
- Indented cards for hierarchical entries
- Expand/collapse for parent entries
        `,
      },
    },
  },
}

/**
 * Tablet viewport - hybrid layout.
 */
export const TabletView: Story = {
  render: () => (
    <InteractiveDictionaryPage
      categories={mockCategories}
      initialCategoryId="cat-injury-illness-type"
      onEntryCreate={async (data) => console.log('Entry created:', data)}
      onEntryUpdate={async (data) => console.log('Entry updated:', data)}
      onEntryDelete={async (id) => console.log('Entry deleted:', id)}
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}
