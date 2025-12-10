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
A generic, reusable data table component with:
- Sortable columns with visual indicators
- Row selection with checkboxes
- Loading state with skeleton rows
- Empty state
- Sticky header support
- Configurable column widths and alignment
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

export const Default: Story = {
  render: () => (
    <DataTable
      data={sampleUsers}
      columns={columns}
      getRowId={(row) => row.id}
    />
  ),
}

export const WithSelection: Story = {
  render: function SelectionExample() {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

    return (
      <div className="space-y-4">
        <div className="text-sm text-secondary">
          Selected: {selectedRows.size > 0 ? Array.from(selectedRows).join(', ') : 'None'}
        </div>
        <DataTable
          data={sampleUsers}
          columns={columns}
          getRowId={(row) => row.id}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
        />
      </div>
    )
  },
}

export const WithSorting: Story = {
  render: function SortingExample() {
    const [sortColumn, setSortColumn] = useState<string | null>('name')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('asc')

    return (
      <div className="space-y-4">
        <div className="text-sm text-secondary">
          Sort: {sortColumn ? `${sortColumn} (${sortDirection})` : 'None'}
        </div>
        <DataTable
          data={sampleUsers}
          columns={columns}
          getRowId={(row) => row.id}
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

export const Loading: Story = {
  render: () => (
    <DataTable
      data={[]}
      columns={columns}
      getRowId={(row) => row.id}
      loading
      loadingRows={5}
    />
  ),
}

export const Empty: Story = {
  render: () => (
    <DataTable
      data={[]}
      columns={columns}
      getRowId={(row) => row.id}
      emptyState={
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 mb-3 rounded-full bg-muted-bg flex items-center justify-center">
            <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-primary mb-1">No users found</h3>
          <p className="text-sm text-secondary">Get started by adding your first user.</p>
        </div>
      }
    />
  ),
}

export const WithRowClick: Story = {
  render: function RowClickExample() {
    const [clickedUser, setClickedUser] = useState<User | null>(null)

    return (
      <div className="space-y-4">
        <div className="text-sm text-secondary">
          Clicked: {clickedUser ? clickedUser.name : 'None'}
        </div>
        <DataTable
          data={sampleUsers}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={setClickedUser}
        />
      </div>
    )
  },
}

export const StickyHeader: Story = {
  render: () => (
    <DataTable
      data={[...sampleUsers, ...sampleUsers, ...sampleUsers]}
      columns={columns}
      getRowId={(row) => row.id}
      stickyHeader
      maxHeight="300px"
    />
  ),
}

export const Striped: Story = {
  render: () => (
    <DataTable
      data={sampleUsers}
      columns={columns}
      getRowId={(row) => row.id}
      striped
    />
  ),
}

export const Compact: Story = {
  render: () => (
    <DataTable
      data={sampleUsers}
      columns={columns}
      getRowId={(row) => row.id}
      compact
    />
  ),
}

export const FullFeatured: Story = {
  render: function FullFeaturedExample() {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set(['1', '3']))
    const [sortColumn, setSortColumn] = useState<string | null>('name')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('asc')

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary">
            {selectedRows.size} selected
          </div>
          <div className="text-sm text-secondary">
            Sort: {sortColumn} ({sortDirection})
          </div>
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
          stickyHeader
          hoverable
          bordered
        />
      </div>
    )
  },
}

// =============================================================================
// PRIORITY BORDERS - Based on Figma design
// =============================================================================

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
    accessor: (row) => (
      <span className="text-primary font-medium">{row.incidentId}</span>
    ),
    sortable: true,
    sortValue: (row) => row.incidentId,
    minWidth: '160px',
  },
  {
    id: 'title',
    header: 'Title',
    accessor: (row) => (
      <span className="text-primary font-medium truncate block max-w-[300px]">{row.title}</span>
    ),
    sortable: true,
    sortValue: (row) => row.title.toLowerCase(),
    minWidth: '300px',
  },
  {
    id: 'location',
    header: 'Location',
    accessor: (row) => (
      <span className="text-primary font-medium">{row.location}</span>
    ),
    sortable: true,
    sortValue: (row) => row.location.toLowerCase(),
    minWidth: '150px',
  },
  {
    id: 'reporter',
    header: 'Reporter',
    accessor: (row) => (
      <span className="text-primary font-medium">{row.reporter}</span>
    ),
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
    accessor: (row) => (
      <span className="text-emphasis font-semibold">{row.duration}</span>
    ),
    sortable: true,
    sortValue: (row) => parseInt(row.duration),
    minWidth: '80px',
    align: 'center',
  },
]

export const WithPriorityBorders: Story = {
  render: function PriorityBordersExample() {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-primary">Incident Management Table</h3>
          <p className="text-sm text-secondary">
            This table demonstrates priority-based colored left borders on rows.
            The border color indicates the incident priority level.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-error" /> Critical
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-aging" /> High
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-warning" /> Medium
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-success" /> Low
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-accent-strong" /> None
            </span>
            <span className="inline-flex items-center gap-1.5">
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

export const PriorityBordersNoSelection: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Without Selection Column</h3>
        <p className="text-sm text-secondary">
          When selection is disabled, the priority border appears on the first data column.
        </p>
      </div>
      <DataTable
        data={incidentData}
        columns={incidentColumns}
        getRowId={(row) => row.id}
        hoverable
        bordered
        getRowPriority={(row) => row.priority}
      />
    </div>
  ),
}
