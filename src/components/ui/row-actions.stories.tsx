/**
 * Table Enhancements Stories
 *
 * Demonstrates Phase 4 table improvements:
 * - RowActions with overflow menu
 * - TruncatedId with copy
 * - Responsive column utilities
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  Edit,
  Eye,
  Copy,
  Trash2,
  Download,
  Share2,
  Archive,
  RefreshCw,
} from 'lucide-react'
import { RowActions, type RowAction } from './RowActions'
import { TruncatedId } from './TruncatedId'
import { DataTable, type ColumnDef } from './DataTable'
import { Badge } from './badge'
import {
  responsiveColumn,
  createActionsColumn,
  createDateColumn,
  RESPONSIVE_CLASSES,
} from './column-utils'

// =============================================================================
// ROW ACTIONS STORIES
// =============================================================================

const rowActionsMeta: Meta<typeof RowActions> = {
  title: 'Components/RowActions',
  component: RowActions,
  parameters: {
    docs: {
      description: {
        component: `
RowActions intelligently displays action buttons using ActionTile with color grading:

**Overflow Rule:**
- **≤3 actions**: All displayed inline as ActionTile buttons
- **4+ actions**: First 2 inline + overflow menu for the rest

**Color Grading by Intent:**
- \`success\` (green): Positive actions (download, approve, submit)
- \`info\` (teal): Modify actions (edit, copy, share)
- \`neutral\` (gray): Passive actions (view, preview)
- \`destructive\` (red): Dangerous actions (delete, remove)

This follows UX best practices for keeping action columns compact while maintaining visual hierarchy.
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default rowActionsMeta

type RowActionsStory = StoryObj<typeof RowActions>

// Color grading by action intent:
// - success (green): positive actions (download, approve)
// - info (teal): modify actions (edit, copy)
// - neutral (gray): passive actions (view)
// - destructive (red): dangerous actions (delete)

const twoActions: RowAction[] = [
  { id: 'edit', label: 'Edit', icon: Edit, onClick: () => console.log('Edit'), variant: 'info' },
  { id: 'delete', label: 'Delete', icon: Trash2, onClick: () => console.log('Delete'), variant: 'destructive' },
]

const threeActions: RowAction[] = [
  { id: 'view', label: 'View', icon: Eye, onClick: () => console.log('View'), variant: 'neutral' },
  { id: 'edit', label: 'Edit', icon: Edit, onClick: () => console.log('Edit'), variant: 'info' },
  { id: 'delete', label: 'Delete', icon: Trash2, onClick: () => console.log('Delete'), variant: 'destructive' },
]

const fiveActions: RowAction[] = [
  { id: 'view', label: 'View', icon: Eye, onClick: () => console.log('View'), variant: 'neutral' },
  { id: 'edit', label: 'Edit', icon: Edit, onClick: () => console.log('Edit'), variant: 'info' },
  { id: 'copy', label: 'Duplicate', icon: Copy, onClick: () => console.log('Copy'), variant: 'info' },
  { id: 'download', label: 'Download', icon: Download, onClick: () => console.log('Download'), variant: 'success' },
  { id: 'delete', label: 'Delete', icon: Trash2, onClick: () => console.log('Delete'), variant: 'destructive', separatorBefore: true },
]

const sevenActions: RowAction[] = [
  { id: 'view', label: 'View Details', icon: Eye, onClick: () => console.log('View'), variant: 'neutral' },
  { id: 'edit', label: 'Edit', icon: Edit, onClick: () => console.log('Edit'), variant: 'info' },
  { id: 'copy', label: 'Duplicate', icon: Copy, onClick: () => console.log('Copy'), variant: 'info' },
  { id: 'share', label: 'Share', icon: Share2, onClick: () => console.log('Share'), variant: 'info' },
  { id: 'download', label: 'Download', icon: Download, onClick: () => console.log('Download'), variant: 'success' },
  { id: 'archive', label: 'Archive', icon: Archive, onClick: () => console.log('Archive'), variant: 'neutral', separatorBefore: true },
  { id: 'delete', label: 'Delete', icon: Trash2, onClick: () => console.log('Delete'), variant: 'destructive' },
]

export const TwoActions: RowActionsStory = {
  args: {
    actions: twoActions,
  },
}

export const ThreeActions: RowActionsStory = {
  args: {
    actions: threeActions,
  },
}

export const FiveActionsWithOverflow: RowActionsStory = {
  args: {
    actions: fiveActions,
  },
}

export const SevenActionsWithOverflow: RowActionsStory = {
  args: {
    actions: sevenActions,
  },
}

export const WithDisabledAction: RowActionsStory = {
  args: {
    actions: [
      { id: 'view', label: 'View', icon: Eye, onClick: () => {}, variant: 'neutral', disabled: true },
      { id: 'edit', label: 'Edit', icon: Edit, onClick: () => {}, variant: 'info' },
      { id: 'delete', label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'destructive' },
    ],
  },
}

export const WithConditionallyHiddenAction: RowActionsStory = {
  args: {
    actions: [
      { id: 'view', label: 'View', icon: Eye, onClick: () => {}, variant: 'neutral' },
      { id: 'edit', label: 'Edit', icon: Edit, onClick: () => {}, variant: 'info', hidden: true }, // Hidden
      { id: 'delete', label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'destructive' },
    ],
  },
}

// =============================================================================
// TRUNCATED ID STORIES
// =============================================================================

export const TruncatedIdDefault: StoryObj<typeof TruncatedId> = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-secondary mb-2">Standard UUID:</p>
        <TruncatedId value="d1577519-cf6d-4a8b-9c3e-123456782aa38" />
      </div>

      <div>
        <p className="text-sm text-secondary mb-2">Short ID (no truncation):</p>
        <TruncatedId value="abc123" />
      </div>

      <div>
        <p className="text-sm text-secondary mb-2">Custom truncation (4...3):</p>
        <TruncatedId value="d1577519-cf6d-4a8b-9c3e-123456782aa38" startChars={4} endChars={3} />
      </div>

      <div>
        <p className="text-sm text-secondary mb-2">Without copy button:</p>
        <TruncatedId value="d1577519-cf6d-4a8b-9c3e-123456782aa38" showCopy={false} />
      </div>
    </div>
  ),
}

// =============================================================================
// DATATABLE WITH ENHANCEMENTS STORY
// =============================================================================

interface MockRecord {
  id: string
  name: string
  status: 'active' | 'inactive' | 'pending'
  createdBy: string
  createdAt: string
  modifiedAt: string
}

const mockData: MockRecord[] = [
  {
    id: 'd1577519-cf6d-4a8b-9c3e-123456782aa38',
    name: 'Incident Report Form',
    status: 'active',
    createdBy: 'John Doe',
    createdAt: '2024-01-15T10:30:00Z',
    modifiedAt: '2024-01-20T14:45:00Z',
  },
  {
    id: 'a2b3c4d5-e6f7-8901-2345-67890abcdef0',
    name: 'Safety Checklist',
    status: 'active',
    createdBy: 'Jane Smith',
    createdAt: '2024-01-10T09:00:00Z',
    modifiedAt: '2024-01-18T11:20:00Z',
  },
  {
    id: 'f1e2d3c4-b5a6-7890-1234-567890fedcba',
    name: 'Equipment Inspection',
    status: 'pending',
    createdBy: 'Bob Wilson',
    createdAt: '2024-01-05T08:15:00Z',
    modifiedAt: '2024-01-05T08:15:00Z',
  },
  {
    id: '12345678-90ab-cdef-1234-567890abcdef',
    name: 'Training Completion',
    status: 'inactive',
    createdBy: 'Alice Brown',
    createdAt: '2023-12-20T16:00:00Z',
    modifiedAt: '2024-01-02T10:30:00Z',
  },
]

const STATUS_VARIANTS = {
  active: 'success',
  inactive: 'secondary',
  pending: 'warning',
} as const

function DataTableWithEnhancements() {
  const getRowActions = (row: MockRecord): RowAction[] => [
    { id: 'view', label: 'View', icon: Eye, onClick: () => console.log('View', row.id), variant: 'neutral' },
    { id: 'edit', label: 'Edit', icon: Edit, onClick: () => console.log('Edit', row.id), variant: 'info' },
    { id: 'copy', label: 'Duplicate', icon: Copy, onClick: () => console.log('Copy', row.id), variant: 'info' },
    { id: 'refresh', label: 'Refresh', icon: RefreshCw, onClick: () => console.log('Refresh', row.id), variant: 'success' },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: () => console.log('Delete', row.id),
      variant: 'destructive',
      separatorBefore: true,
    },
  ]

  const columns: ColumnDef<MockRecord>[] = [
    // ID column with truncation
    {
      id: 'id',
      header: 'ID',
      accessor: (row) => <TruncatedId value={row.id} />,
      width: '180px',
    },
    // Name - always visible
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => row.name,
      sortable: true,
    },
    // Status
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge variant={STATUS_VARIANTS[row.status]} size="sm">
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
      sortable: true,
      sortValue: (row) => row.status,
    },
    // Created By - hidden on tablet
    responsiveColumn({
      id: 'createdBy',
      header: 'Created By',
      accessor: (row) => row.createdBy,
      sortable: true,
      hideOn: 'tablet',
    }),
    // Modified - hidden on mobile
    responsiveColumn(
      createDateColumn<MockRecord>((row) => row.modifiedAt, {
        id: 'modifiedAt',
        header: 'Modified',
        format: 'relative',
        hideOn: 'mobile',
      })
    ),
    // Actions with overflow
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => <RowActions actions={getRowActions(row)} />,
      width: '120px',
      align: 'right',
    },
  ]

  return (
    <DataTable
      data={mockData}
      columns={columns}
      getRowId={(row) => row.id}
      hoverable
      bordered
    />
  )
}

export const DataTableIntegration: StoryObj = {
  render: () => <DataTableWithEnhancements />,
  parameters: {
    docs: {
      description: {
        story: `
Complete DataTable example with all Phase 4 enhancements:

1. **TruncatedId** in the ID column with copy functionality
2. **RowActions** with overflow menu (5 actions → 2 inline + overflow)
3. **Responsive columns** - "Created By" hidden on tablet, "Modified" hidden on mobile
4. Standard sortable columns and status badges

Resize your browser to see responsive column hiding in action.
        `,
      },
    },
  },
}

// =============================================================================
// RESPONSIVE CLASSES REFERENCE
// =============================================================================

export const ResponsiveClassesReference: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Responsive CSS Classes</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-default rounded-lg">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Breakpoint</th>
              <th className="px-4 py-2 text-left text-sm font-medium">CSS Class</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Hidden Below</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-default">
              <td className="px-4 py-2 font-mono text-sm">mobile</td>
              <td className="px-4 py-2 font-mono text-sm text-secondary">{RESPONSIVE_CLASSES.mobile}</td>
              <td className="px-4 py-2 text-sm">640px (sm)</td>
            </tr>
            <tr className="border-t border-default">
              <td className="px-4 py-2 font-mono text-sm">tablet</td>
              <td className="px-4 py-2 font-mono text-sm text-secondary">{RESPONSIVE_CLASSES.tablet}</td>
              <td className="px-4 py-2 text-sm">1024px (lg)</td>
            </tr>
            <tr className="border-t border-default">
              <td className="px-4 py-2 font-mono text-sm">desktop</td>
              <td className="px-4 py-2 font-mono text-sm text-secondary">{RESPONSIVE_CLASSES.desktop}</td>
              <td className="px-4 py-2 text-sm">1280px (xl)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
        <p className="text-sm">
          <strong>Usage:</strong> Use <code>responsiveColumn()</code> helper to automatically
          apply these classes to column cells and headers.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Reference table showing the CSS classes used for responsive column visibility.',
      },
    },
  },
}
