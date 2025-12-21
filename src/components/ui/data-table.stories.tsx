import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  ORGANISM_META,
  organismDescription,
} from '@/stories/_infrastructure'
import { DataTable, ColumnDef, RowPriority } from './DataTable'
import {
  EmailLink,
  DataTableSeverity,
  DataTableMobileCard,
  IncidentStatusBadge,
  CopyableId,
  TruncatedText,
  type IncidentStatus,
  type IncidentSeverity,
} from './table'
import { ActionTile } from './ActionTile'
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip'
import { NextStepButton, type NextStepSeverity } from '../../flow/components/next-step-button'
import { Pencil, Trash2, Rocket, CircleCheck, CircleX, CircleDot } from 'lucide-react'
import { cn } from '../../lib/utils'
import { formatAge, getAgingStyles } from '../../lib/date-utils'
import { useIsMobile } from '../../hooks/useIsMobile'

// =============================================================================
// USER STATUS BADGE (Outline style matching IncidentStatusBadge)
// =============================================================================

type UserStatus = 'active' | 'inactive' | 'pending'

const userStatusConfig: Record<UserStatus, {
  label: string
  icon: React.ComponentType<{ className?: string }>
  text: string
}> = {
  active: {
    label: 'Active',
    icon: CircleCheck,  // Stroke-based circle with checkmark
    text: 'text-success-strong dark:text-success',  // Green
  },
  inactive: {
    label: 'Inactive',
    icon: CircleX,  // Stroke-based circle with X
    text: 'text-muted',  // Gray
  },
  pending: {
    label: 'Pending',
    icon: CircleDot,  // Stroke-based circle with dot (waiting)
    text: 'text-warning-dark dark:text-warning',  // Amber
  },
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  const config = userStatusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        // No border - just icon + label with semantic color
        'inline-flex items-center gap-1.5',
        'text-sm font-medium',
        config.text
      )}
    >
      {/* size-4 (16px) for consistent visual weight across all circle icons */}
      <Icon className="size-4 flex-shrink-0" />
      {config.label}
    </span>
  )
}

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
    accessor: (row) => <span className="font-medium">{row.name}</span>,
    sortable: true,
    sortValue: (row) => row.name.toLowerCase(),
    // Name column can grow to fill available space
  },
  {
    id: 'email',
    header: 'Email',
    accessor: (row) => <EmailLink email={row.email} />,
    sortable: true,
    sortValue: (row) => row.email.toLowerCase(),
    // Email can also grow
  },
  {
    id: 'role',
    header: 'Role',
    accessor: (row) => row.role,
    sortable: true,
    sortValue: (row) => row.role.toLowerCase(),
    // Hug content
    width: '1%',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => <UserStatusBadge status={row.status} />,
    sortable: true,
    sortValue: (row) => row.status,
    // Hug content
    width: '1%',
    cellClassName: 'whitespace-nowrap',
    align: 'left',
  },
  {
    id: 'createdAt',
    header: 'Created',
    accessor: (row) => (
      <span className="text-secondary tabular-nums">
        {row.createdAt.toLocaleDateString()}
      </span>
    ),
    sortable: true,
    sortValue: (row) => row.createdAt,
    // Hug content
    width: '1%',
    cellClassName: 'whitespace-nowrap',
    align: 'right',
    headerClassName: 'text-right',
  },
]

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof DataTable> = {
  title: 'Shared/Data/DataTable',
  component: DataTable,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    docs: {
      description: {
        component: organismDescription(
          `Generic, reusable data table component with sortable columns, row selection, loading states, and priority borders.

**Features:**
- Sortable columns with visual indicators
- Row selection with checkboxes
- Loading/Empty state support
- Sticky header
- Priority-based colored row borders
- Configurable column widths and alignment
- Mobile-responsive with horizontal scrolling`
        ),
      },
    },
  },
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
    <div className="p-6">
      <DataTable
        data={sampleUsers}
        columns={columns}
        getRowId={(row) => row.id}
      />
    </div>
  ),
}

/**
 * Interactive table with row selection and sorting.
 * Checkboxes are hidden by default and appear when "Bulk Actions" mode is enabled.
 */
export const Interactive: Story = {
  render: function InteractiveExample() {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
    const [sortColumn, setSortColumn] = useState<string | null>('name')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('asc')
    const [bulkActionsMode, setBulkActionsMode] = useState(false)

    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setBulkActionsMode(!bulkActionsMode)
              if (bulkActionsMode) setSelectedRows(new Set())
            }}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-md border transition-colors',
              bulkActionsMode
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-transparent text-secondary border-default hover:bg-muted-bg'
            )}
          >
            {bulkActionsMode ? 'Exit Bulk Actions' : 'Bulk Actions'}
          </button>
          <div className="flex items-center gap-4 text-sm text-secondary">
            {bulkActionsMode && <span>{selectedRows.size} row(s) selected</span>}
            <span>Sort: {sortColumn ? `${sortColumn} (${sortDirection})` : 'None'}</span>
          </div>
        </div>
        <DataTable
          data={sampleUsers}
          columns={columns}
          getRowId={(row) => row.id}
          selectable={bulkActionsMode}
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
 * Table with priority-based severity framing: colored left border AND bottom border.
 * This creates a visual hierarchy where each row is "framed" by its severity color.
 *
 * **Responsive Behavior:**
 * - Desktop (≥640px): Full table with sorting and bulk actions
 * - Mobile (<640px): Card view with severity framing
 *
 * Resize the browser window to test responsive behavior.
 */
export const WithPriorityBorders: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: function PriorityBordersExample() {
    interface Incident {
      id: string
      incidentId: string
      title: string
      location: string
      reporter: string
      priority: RowPriority  // For row border color
      severity: IncidentSeverity  // For severity indicator
      status: IncidentStatus  // For status badge
      ageDays: number  // Age in days (from API: createdAt → now)
      overdue?: boolean  // Flag from backend when incident exceeds SLA
    }

    // Severity mapping for incident table (5 levels: critical → none)
    // Order: critical (highest) → high → medium → low → none (unassigned)
    const INCIDENT_TABLE_SEVERITY_MAP = {
      critical: { level: 'critical' as const, label: 'Critical' },
      high: { level: 'high' as const, label: 'High' },
      medium: { level: 'medium' as const, label: 'Medium' },
      low: { level: 'low' as const, label: 'Low' },
      none: { level: 'none' as const, label: 'None' },
    }

    // Numeric sort order for severity (higher = more severe)
    const SEVERITY_SORT_ORDER: Record<IncidentSeverity, number> = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      none: 1,
    }

    const incidentData: Incident[] = [
      // OVERDUE - flagged by backend (3 months old critical incident) - VERY LONG TITLE for truncation testing
      { id: '1', incidentId: 'INC-516344565333', title: 'Critical Chemical Spill in Warehouse B Section 4 - Hazardous Materials Containment Protocol Required Immediately', location: 'Warehouse B - Section 4', reporter: 'Patricia Davis', priority: 'critical', severity: 'critical', status: 'investigation', ageDays: 95, overdue: true },
      // OVERDUE - 6 weeks old high priority - LONG TITLE
      { id: '7', incidentId: 'INC-516344565339', title: 'Major Ventilation System Failure Affecting Multiple Production Areas - Air Quality Below Safety Standards', location: 'Production Floor - Building A', reporter: 'Sarah Connor', priority: 'high', severity: 'high', status: 'investigation', ageDays: 42, overdue: true },
      // OVERDUE - 2 weeks old medium (exceeded SLA)
      { id: '9', incidentId: 'INC-516344565341', title: 'Electrical Panel Inspection Overdue - Potential Fire Hazard in Main Distribution Center', location: 'Utility Room 3B', reporter: 'Mike Chen', priority: 'medium', severity: 'medium', status: 'review', ageDays: 14, overdue: true },
      // Old but NOT overdue (low priority has longer SLA)
      { id: '2', incidentId: 'INC-516344565334', title: 'Equipment Malfunction Near Assembly Line - Non-Critical Component Replacement Needed', location: 'Assembly Line 3', reporter: 'Michael Johnson', priority: 'low', severity: 'low', status: 'review', ageDays: 21 },
      // Urgent (4-6 days) - semibold orange
      { id: '8', incidentId: 'INC-516344565340', title: 'Fire Extinguisher Expired', location: 'Storage Room C', reporter: 'John Martinez', priority: 'medium', severity: 'medium', status: 'review', ageDays: 5 },
      // Aging (2-3 days) - medium amber
      { id: '3', incidentId: 'INC-516344565335', title: 'Minor Injury Report - Slip Hazard Due to Water Leak Near Loading Dock Emergency Exit', location: 'Loading Dock - East Wing', reporter: 'Linda Smith', priority: 'medium', severity: 'medium', status: 'investigation', ageDays: 3 },
      // Aging (2-3 days) - medium amber
      { id: '4', incidentId: 'INC-516344565336', title: 'Safety Equipment Inspection Due', location: 'Main Office', reporter: 'James Brown', priority: 'low', severity: 'low', status: 'review', ageDays: 2 },
      // Fresh (0-1 days) - newly reported, severity not assigned yet
      { id: '5', incidentId: 'INC-516344565337', title: 'Near Miss Reported at Entrance', location: 'Building Entrance', reporter: 'Patricia Taylor', priority: 'none', severity: 'none', status: 'reported', ageDays: 1 },
      // Fresh (0 days) - draft not yet published
      { id: '6', incidentId: 'INC-516344565338', title: 'New Incident Draft', location: 'TBD', reporter: 'Robert Wilson', priority: 'draft', severity: 'none', status: 'draft', ageDays: 0 },
    ]

    const incidentColumns: ColumnDef<Incident>[] = [
      {
        id: 'incidentId',
        header: 'ID',
        accessor: (row) => <CopyableId id={row.incidentId} />,
        sortable: true,
        sortValue: (row) => row.incidentId,
        // Fixed width to fit "INC-XXXXXXXXXXXX" + copy button + padding
        width: '190px',
        cellClassName: 'whitespace-nowrap',
      },
      {
        id: 'title',
        header: 'Title',
        accessor: (row) => (
          <TruncatedText className="font-medium">
            {row.title}
          </TruncatedText>
        ),
        sortable: true,
        sortValue: (row) => row.title.toLowerCase(),
        // FLEXIBLE COLUMN: No width = takes ALL remaining space after fixed columns
        // With table-layout: fixed, this is the only column that compresses/expands
        cellClassName: 'overflow-hidden',
      },
      {
        id: 'location',
        header: 'Location',
        accessor: (row) => (
          <button
            type="button"
            onClick={() => console.log('Navigate to location:', row.location)}
            className="text-link hover:text-link-hover hover:underline transition-colors text-left"
          >
            {row.location}
          </button>
        ),
        sortable: true,
        sortValue: (row) => row.location.toLowerCase(),
        // Fixed width for typical location names (e.g., "Production Floor - Building A")
        width: '220px',
        cellClassName: 'whitespace-nowrap overflow-hidden text-ellipsis',
      },
      {
        id: 'reporter',
        header: 'Reporter',
        accessor: (row) => (
          <button
            type="button"
            onClick={() => console.log('Navigate to profile:', row.reporter)}
            className="text-link hover:text-link-hover hover:underline transition-colors text-left"
          >
            {row.reporter}
          </button>
        ),
        sortable: true,
        sortValue: (row) => row.reporter.toLowerCase(),
        // Fixed width for typical names (e.g., "Patricia Taylor")
        width: '140px',
        cellClassName: 'whitespace-nowrap overflow-hidden text-ellipsis',
      },
      {
        id: 'status',
        header: 'Status',
        accessor: (row) => (
          <IncidentStatusBadge
            status={row.status}
            severity={row.severity}
          />
        ),
        sortable: true,
        sortValue: (row) => row.status,
        // Fixed width for status badges (e.g., "Investigation") + border padding
        width: '145px',
        cellClassName: 'whitespace-nowrap',
        align: 'left',
      },
      {
        id: 'severity',
        header: 'Severity',
        accessor: (row) => (
          <DataTableSeverity
            value={row.severity}
            mapping={INCIDENT_TABLE_SEVERITY_MAP}
            size="sm"
            showLabel
          />
        ),
        sortable: true,
        // Sort by severity order (critical=5 highest → none=1 lowest)
        sortValue: (row) => SEVERITY_SORT_ORDER[row.severity],
        // Fixed width for severity indicator (dot + "Critical")
        width: '100px',
        cellClassName: 'whitespace-nowrap',
        align: 'left',
      },
      {
        id: 'age',
        header: 'Age',
        accessor: (row) => {
          const days = row.ageDays
          const label = formatAge(days)

          // OVERDUE: Backend-flagged, show danger badge with glowing beacon animation
          if (row.overdue) {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error text-on-status text-xs font-bold tabular-nums overdue-pulse">
                {label}
              </span>
            )
          }

          return (
            <span className={`text-sm tabular-nums ${getAgingStyles(days)}`}>
              {label}
            </span>
          )
        },
        sortable: true,
        sortValue: (row) => row.ageDays,
        // Fixed width for age badge (e.g., "3 months")
        width: '100px',
        cellClassName: 'whitespace-nowrap',
        align: 'center',
        headerClassName: 'text-center',
      },
      {
        id: 'actions',
        header: 'Actions',
        accessor: (row) => {
          // Map priority to NextStepSeverity (excluding 'draft' and 'info')
          const getSeverity = (priority: RowPriority): NextStepSeverity => {
            if (priority === 'critical') return 'critical'
            if (priority === 'high') return 'high'
            if (priority === 'medium') return 'medium'
            if (priority === 'low') return 'low'
            return 'none'
          }

          if (row.status === 'draft') {
            // Draft rows show ActionTile buttons (Submit, Edit, Delete)
            return (
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ActionTile
                      variant="success"
                      appearance="filled"
                      size="xs"
                      onClick={() => console.log('Submit', row.id)}
                      aria-label="Submit incident"
                    >
                      <Rocket className="size-4" />
                    </ActionTile>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={4}>
                    Submit incident
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ActionTile
                      variant="neutral"
                      appearance="filled"
                      size="xs"
                      onClick={() => console.log('Edit', row.id)}
                      aria-label="Edit incident"
                    >
                      <Pencil className="size-4" />
                    </ActionTile>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={4}>
                    Edit incident
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ActionTile
                      variant="destructive"
                      appearance="filled"
                      size="xs"
                      onClick={() => console.log('Delete', row.id)}
                      aria-label="Delete incident"
                    >
                      <Trash2 className="size-4" />
                    </ActionTile>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={4}>
                    Delete draft
                  </TooltipContent>
                </Tooltip>
              </div>
            )
          }

          // Normal rows show "Next Step" button with severity color
          return (
            <NextStepButton
              severity={getSeverity(row.priority)}
              size="sm"
              onClick={() => console.log('Next step', row.id)}
            />
          )
        },
        // Fixed width for action buttons + right padding for table edge spacing
        width: '140px',
        cellClassName: 'whitespace-nowrap pr-4',
        align: 'left',
        headerClassName: 'pr-4',
      },
    ]

    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)
    // Bulk actions mode: checkboxes are hidden by default, shown when enabled
    const [bulkActionsMode, setBulkActionsMode] = useState(false)
    // Responsive: detect mobile viewport for card view
    const isMobile = useIsMobile()

    // Priority border color mapping for mobile cards
    const getPriorityBorderClass = (priority: RowPriority) => {
      const map: Record<string, string> = {
        critical: 'border-l-4 border-l-error',
        high: 'border-l-4 border-l-aging',
        medium: 'border-l-4 border-l-warning',
        low: 'border-l-4 border-l-success',
        none: 'border-l-4 border-l-info',
        draft: 'border-l-4 border-l-secondary border-dashed',
      }
      return priority ? map[priority] || '' : ''
    }

    return (
      <div className="space-y-4 p-4 sm:p-6 w-full max-w-full min-w-0">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Incident Management Table</h3>
          <p className="text-sm text-secondary">
            {isMobile
              ? 'Mobile view: Cards with severity framing. Resize window to see table view.'
              : 'Severity framing: colored left border (6px) + bottom border (2px) per row priority.'
            }
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
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
              <span className="w-3 h-3 rounded-sm bg-info" /> None
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm border border-dashed border-default bg-muted-bg" /> Draft
            </span>
          </div>
        </div>

        {/* Bulk Actions Panel - hidden on mobile */}
        {!isMobile && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setBulkActionsMode(!bulkActionsMode)
                // Clear selection when exiting bulk mode
                if (bulkActionsMode) setSelectedRows(new Set())
              }}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md border transition-colors',
                bulkActionsMode
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-transparent text-secondary border-default hover:bg-muted-bg'
              )}
            >
              {bulkActionsMode ? 'Exit Bulk Actions' : 'Bulk Actions'}
            </button>

            {/* Bulk action buttons - only visible when items are selected */}
            {bulkActionsMode && selectedRows.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary">
                  {selectedRows.size} selected
                </span>
                <button
                  type="button"
                  onClick={() => console.log('Delete selected:', [...selectedRows])}
                  className="px-3 py-1.5 text-sm font-medium rounded-md bg-error text-on-status hover:bg-error/90 transition-colors"
                >
                  Delete Selected
                </button>
                <button
                  type="button"
                  onClick={() => console.log('Export selected:', [...selectedRows])}
                  className="px-3 py-1.5 text-sm font-medium rounded-md border border-default bg-transparent text-primary hover:bg-muted-bg transition-colors"
                >
                  Export
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Card View */}
        {isMobile ? (
          <div className="space-y-3">
            {incidentData.map((incident) => (
              <DataTableMobileCard
                key={incident.id}
                title={incident.title}
                subtitle={incident.incidentId}
                status={
                  <IncidentStatusBadge
                    status={incident.status}
                    severity={incident.severity}
                  />
                }
                fields={[
                  { label: 'Location', value: incident.location },
                  { label: 'Reporter', value: incident.reporter },
                  {
                    label: 'Severity',
                    value: (
                      <DataTableSeverity
                        value={incident.severity}
                        mapping={INCIDENT_TABLE_SEVERITY_MAP}
                        size="sm"
                        showLabel
                      />
                    ),
                  },
                  {
                    label: 'Age',
                    value: incident.overdue ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error text-on-status text-xs font-bold">
                        {formatAge(incident.ageDays)}
                      </span>
                    ) : (
                      <span className="text-sm tabular-nums">
                        {formatAge(incident.ageDays)}
                      </span>
                    ),
                  },
                ]}
                className={getPriorityBorderClass(incident.priority)}
                onTap={() => console.log('Navigate to incident:', incident.id)}
              />
            ))}
          </div>
        ) : (
          /* Desktop Table View */
          <DataTable
            data={incidentData}
            columns={incidentColumns}
            getRowId={(row) => row.id}
            selectable={bulkActionsMode}
            selectedRows={selectedRows}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSortChange={(column, direction) => {
              setSortColumn(direction ? column : null)
              setSortDirection(direction)
            }}
            onSelectionChange={setSelectedRows}
            hoverable
            bordered
            getRowPriority={(row) => row.priority}
          />
        )}
      </div>
    )
  },
}

/**
 * All possible states of the DataTable component.
 */
export const AllStates: Story = {
  render: () => (
    <div className="p-6 space-y-12">
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
