import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DataTable, ColumnDef, RowPriority } from './DataTable'
import { StatusBadge, COMMON_STATUS_CONFIG, REQUEST_STATUS_CONFIG, EmailLink } from './table'

// =============================================================================
// SAMPLE DATA
// =============================================================================

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: Date
}

const sampleUsers: User[] = [
  { id: '1', name: 'Alice Thompson', email: 'alice@example.com', role: 'Admin', status: 'active', createdAt: new Date('2024-01-15') },
  { id: '2', name: 'Bob Rodriguez', email: 'bob@example.com', role: 'Editor', status: 'active', createdAt: new Date('2024-02-20') },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', role: 'Viewer', status: 'inactive', createdAt: new Date('2024-03-10') },
  { id: '4', name: 'David Chen', email: 'david@example.com', role: 'Editor', status: 'pending', createdAt: new Date('2024-04-05') },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', role: 'Admin', status: 'active', createdAt: new Date('2024-05-12') },
  { id: '6', name: 'Frank Wilson', email: 'frank@example.com', role: 'Viewer', status: 'active', createdAt: new Date('2024-06-08') },
  { id: '7', name: 'Grace Lee', email: 'grace@example.com', role: 'Editor', status: 'inactive', createdAt: new Date('2024-07-22') },
  { id: '8', name: 'Henry Brown', email: 'henry@example.com', role: 'Viewer', status: 'pending', createdAt: new Date('2024-08-30') },
]

const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: (row) => row.name,
    sortable: true,
    sortValue: (row) => row.name.toLowerCase(),
    minWidth: '150px',
  },
  {
    id: 'email',
    header: 'Email',
    accessor: (row) => <EmailLink email={row.email} />,
    sortable: true,
    sortValue: (row) => row.email.toLowerCase(),
    minWidth: '200px',
  },
  {
    id: 'role',
    header: 'Role',
    accessor: (row) => row.role,
    sortable: true,
    minWidth: '100px',
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => <StatusBadge status={row.status} statusConfig={COMMON_STATUS_CONFIG} />,
    sortable: true,
    sortValue: (row) => row.status,
    minWidth: '100px',
    align: 'center',
  },
  {
    id: 'createdAt',
    header: 'Created',
    accessor: (row) => row.createdAt.toLocaleDateString(),
    sortable: true,
    sortValue: (row) => row.createdAt,
    minWidth: '120px',
    align: 'right',
  },
]

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof DataTable> = {
  title: 'Core/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A generic, reusable data table component with sortable columns, row selection, loading states, and priority borders.

**Features:**
- Sortable columns with visual indicators
- Row selection with checkboxes (select all, individual)
- Loading state with skeleton rows
- Empty state support
- Sticky header
- Priority-based colored row borders
- Configurable column widths and alignment
- Mobile-responsive with horizontal scrolling
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DataTable<User>>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default table with sortable columns. Click column headers to sort.
 */
export const Default: Story = {
  render: () => (
    <DataTable
      data={sampleUsers}
      columns={columns}
      getRowId={(row) => row.id}
    />
  ),
}

/**
 * Interactive table with row selection and sorting.
 */
export const Interactive: Story = {
  render: function InteractiveExample() {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
    const [sortColumn, setSortColumn] = useState<string | null>('name')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('asc')

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-secondary">
          <span>{selectedRows.size} row(s) selected</span>
          <span>Sort: {sortColumn ? `${sortColumn} (${sortDirection})` : 'None'}</span>
        </div>
        <DataTable
          data={sampleUsers}
          columns={columns}
          getRowId={(row) => row.id}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSortChange={(column, direction) => {
            setSortColumn(direction ? column : null)
            setSortDirection(direction)
          }}
        />
      </div>
    )
  },
}

/**
 * Table with priority-based colored left borders for visual hierarchy.
 */
export const WithPriorityBorders: Story = {
  render: function PriorityBordersExample() {
    interface Incident {
      id: string
      incidentId: string
      title: string
      location: string
      reporter: string
      priority: RowPriority
      status: 'draft' | 'reported' | 'investigation' | 'review' | 'closed'
      duration: string
    }

    const incidentData: Incident[] = [
      { id: '1', incidentId: 'INC-516344565333', title: 'Unusual Odor Reported Near Loading Area', location: 'Loading Dock - East', reporter: 'Patricia Davis', priority: 'critical', status: 'investigation', duration: '1D' },
      { id: '2', incidentId: 'INC-516344565334', title: 'Equipment Malfunction in Production Line', location: 'Production Floor - B', reporter: 'Michael Johnson', priority: 'high', status: 'review', duration: '2D' },
      { id: '3', incidentId: 'INC-516344565335', title: 'Minor Spill in Storage Area', location: 'Warehouse - North', reporter: 'Linda Smith', priority: 'medium', status: 'investigation', duration: '1D' },
      { id: '4', incidentId: 'INC-516344565336', title: 'Safety Signage Missing', location: 'Parking Lot - A', reporter: 'James Brown', priority: 'low', status: 'review', duration: '3D' },
      { id: '5', incidentId: 'INC-516344565337', title: 'Routine Inspection Finding', location: 'Office Building - 2', reporter: 'Patricia Taylor', priority: 'none', status: 'reported', duration: '1D' },
      { id: '6', incidentId: 'INC-516344565338', title: 'New Incident Report (Pending)', location: 'Loading Dock - West', reporter: 'Robert Wilson', priority: 'draft', status: 'draft', duration: '0D' },
    ]

    const incidentColumns: ColumnDef<Incident>[] = [
      {
        id: 'incidentId',
        header: 'ID',
        accessor: (row) => <span className="font-medium">{row.incidentId}</span>,
        sortable: true,
        sortValue: (row) => row.incidentId,
        minWidth: '160px',
      },
      {
        id: 'title',
        header: 'Title',
        accessor: (row) => <span className="font-medium truncate block max-w-[300px]">{row.title}</span>,
        sortable: true,
        sortValue: (row) => row.title.toLowerCase(),
        minWidth: '300px',
      },
      {
        id: 'location',
        header: 'Location',
        accessor: (row) => row.location,
        sortable: true,
        sortValue: (row) => row.location.toLowerCase(),
        minWidth: '150px',
      },
      {
        id: 'reporter',
        header: 'Reporter',
        accessor: (row) => row.reporter,
        sortable: true,
        sortValue: (row) => row.reporter.toLowerCase(),
        minWidth: '140px',
      },
      {
        id: 'status',
        header: 'Status',
        accessor: (row) => <StatusBadge status={row.status} statusConfig={REQUEST_STATUS_CONFIG} />,
        sortable: true,
        sortValue: (row) => row.status,
        minWidth: '120px',
      },
      {
        id: 'duration',
        header: 'Duration',
        accessor: (row) => <span className="font-semibold">{row.duration}</span>,
        sortable: true,
        sortValue: (row) => parseInt(row.duration),
        minWidth: '80px',
        align: 'center',
      },
    ]

    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Incident Management Table</h3>
          <p className="text-sm text-secondary">
            Priority-based colored left borders indicate incident severity levels.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-error" /> Critical
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-aging" /> High
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-warning" /> Medium
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-success" /> Low
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-accent-strong" /> None
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm border border-dashed border-default bg-muted-bg" /> Draft
            </span>
          </div>
        </div>
        <DataTable
          data={incidentData}
          columns={incidentColumns}
          getRowId={(row) => row.id}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          hoverable
          bordered
          getRowPriority={(row) => row.priority}
        />
      </div>
    )
  },
}

/**
 * All possible states of the DataTable component.
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-12">
      {/* Default state */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Default</h3>
        <DataTable
          data={sampleUsers.slice(0, 3)}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </div>

      {/* Loading state */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Loading</h3>
        <DataTable
          data={[]}
          columns={columns}
          getRowId={(row) => row.id}
          loading
          loadingRows={3}
        />
      </div>

      {/* Empty state */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Empty</h3>
        <DataTable
          data={[]}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </div>

      {/* With selection */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">With Selection</h3>
        <DataTable
          data={sampleUsers.slice(0, 3)}
          columns={columns}
          getRowId={(row) => row.id}
          selectable
          selectedRows={new Set(['1', '2'])}
        />
      </div>

      {/* Compact mode */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Compact</h3>
        <DataTable
          data={sampleUsers.slice(0, 3)}
          columns={columns}
          getRowId={(row) => row.id}
          compact
        />
      </div>

      {/* Striped rows */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Striped</h3>
        <DataTable
          data={sampleUsers.slice(0, 4)}
          columns={columns}
          getRowId={(row) => row.id}
          striped
        />
      </div>

      {/* Sticky header with scrolling */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Sticky Header (scroll to see effect)</h3>
        <DataTable
          data={[...sampleUsers, ...sampleUsers]}
          columns={columns}
          getRowId={(row) => row.id}
          stickyHeader
          maxHeight="300px"
        />
      </div>
    </div>
  ),
}
