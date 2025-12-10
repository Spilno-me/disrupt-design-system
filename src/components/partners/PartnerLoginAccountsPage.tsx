"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
  Plus,
  Key,
  Trash2,
  Users,
  User,
  ArrowLeft,
  Search,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { DataTable, type ColumnDef } from "../ui/DataTable"
import { Pagination } from "../ui/Pagination"
import { ResetPasswordDialog } from "./ResetPasswordDialog"
import { CreateLoginAccountDialog } from "./CreateLoginAccountDialog"
import { DeleteLoginAccountDialog } from "./DeleteLoginAccountDialog"
import { StatusBadge, COMMON_STATUS_CONFIG } from "../ui/table"

// =============================================================================
// TYPES
// =============================================================================

export type LoginAccountStatus = "active" | "inactive" | "pending"

export interface LoginAccount {
  /** Unique identifier */
  id: string
  /** First name */
  firstName: string
  /** Last name */
  lastName: string
  /** Email address */
  email: string
  /** Current status */
  status: LoginAccountStatus
  /** Date created */
  createdAt: Date
}

export interface PartnerLoginAccountsPageProps {
  /** Partner name for display */
  partnerName?: string
  /** Partner ID for reference */
  partnerId?: string
  /** Initial login accounts data */
  loginAccounts?: LoginAccount[]
  /** Callback when "Back to Partners" is clicked */
  onBackClick?: () => void
  /** Callback when "Add Login Account" is clicked (if not provided, uses built-in dialog) */
  onAddLoginAccount?: () => void
  /** Callback when create form is submitted */
  onCreateLoginAccount?: (data: CreateLoginAccountData) => void | Promise<void>
  /** Callback when reset password is clicked */
  onResetPassword?: (account: LoginAccount, mode: "generate" | "custom", customPassword?: string) => void | Promise<void>
  /** Callback when delete is confirmed */
  onDeleteLoginAccount?: (account: LoginAccount) => void | Promise<void>
  /** Loading state */
  loading?: boolean
  /** Additional className for the container */
  className?: string
}

export interface CreateLoginAccountData {
  email: string
  firstName: string
  lastName: string
}

// =============================================================================
// MOCK DATA
// =============================================================================

export const MOCK_LOGIN_ACCOUNTS: LoginAccount[] = [
  {
    id: "1",
    firstName: "James",
    lastName: "Smith",
    email: "james@draxindustries.com.au",
    status: "active",
    createdAt: new Date("2024-08-15"),
  },
]

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/** User avatar with icon - fixed contrast */
function UserAvatar() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-bg">
      <User className="h-4 w-4 text-primary" />
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * PartnerLoginAccountsPage - A page for managing partner login accounts
 *
 * Features:
 * - Back link to partners list
 * - Header with icon, title, and subtitle showing count
 * - Add Login Account button
 * - Search input
 * - Data table with login account information
 * - Action buttons for reset password and delete
 * - Pagination
 *
 * @example
 * ```tsx
 * <PartnerLoginAccountsPage
 *   partnerName="Drax Industries"
 *   partnerId="DRX-2024-001"
 *   loginAccounts={accounts}
 *   onBackClick={() => navigate('/partners')}
 *   onResetPassword={(account, mode, password) => handleReset(account, mode, password)}
 *   onDeleteLoginAccount={(account) => handleDelete(account)}
 * />
 * ```
 */
export function PartnerLoginAccountsPage({
  partnerName: _partnerName = "Drax Industries",
  partnerId: _partnerId = "DRX-2024-001",
  loginAccounts = MOCK_LOGIN_ACCOUNTS,
  onBackClick,
  onAddLoginAccount,
  onCreateLoginAccount,
  onResetPassword,
  onDeleteLoginAccount,
  loading = false,
  className,
}: PartnerLoginAccountsPageProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Create Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Reset Password Dialog state
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<LoginAccount | null>(null)
  const [isResetting, setIsResetting] = useState(false)

  // Delete Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<LoginAccount | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Format date helper
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
  }

  // Filter accounts based on search
  const filteredAccounts = useMemo(() => {
    return loginAccounts.filter((account) => {
      const fullName = `${account.firstName} ${account.lastName}`.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        fullName.includes(searchQuery.toLowerCase()) ||
        account.email.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSearch
    })
  }, [loginAccounts, searchQuery])

  // Paginated accounts
  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredAccounts.slice(startIndex, startIndex + pageSize)
  }, [filteredAccounts, currentPage, pageSize])

  // Count active logins
  const activeCount = loginAccounts.filter((a) => a.status === "active").length

  // Handle add login account click
  const handleAddLoginAccountClick = React.useCallback(() => {
    if (onAddLoginAccount) {
      onAddLoginAccount()
    } else {
      setCreateDialogOpen(true)
    }
  }, [onAddLoginAccount])

  // Handle create submit
  const handleCreateSubmit = React.useCallback(async (data: CreateLoginAccountData) => {
    setIsCreating(true)
    try {
      if (onCreateLoginAccount) {
        await onCreateLoginAccount(data)
      }
      setCreateDialogOpen(false)
    } finally {
      setIsCreating(false)
    }
  }, [onCreateLoginAccount])

  // Handle reset password click
  const handleResetPasswordClick = React.useCallback((account: LoginAccount) => {
    setSelectedAccount(account)
    setResetDialogOpen(true)
  }, [])

  // Handle reset password confirm
  const handleResetPasswordConfirm = React.useCallback(async (mode: "generate" | "custom", customPassword?: string) => {
    if (!selectedAccount) return
    setIsResetting(true)
    try {
      if (onResetPassword) {
        await onResetPassword(selectedAccount, mode, customPassword)
      }
      setResetDialogOpen(false)
    } finally {
      setIsResetting(false)
    }
  }, [selectedAccount, onResetPassword])

  // Handle delete click
  const handleDeleteClick = React.useCallback((account: LoginAccount) => {
    setAccountToDelete(account)
    setDeleteDialogOpen(true)
  }, [])

  // Handle delete confirm
  const handleDeleteConfirm = React.useCallback(async (account: LoginAccount) => {
    setIsDeleting(true)
    try {
      if (onDeleteLoginAccount) {
        await onDeleteLoginAccount(account)
      }
      setDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }, [onDeleteLoginAccount])

  // Column definitions
  const columns: ColumnDef<LoginAccount>[] = [
    {
      id: "account",
      header: "Login Account",
      sortable: true,
      sortValue: (row) => `${row.firstName} ${row.lastName}`,
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <UserAvatar />
          <div className="flex flex-col">
            <span className="font-medium text-primary">
              {row.firstName} {row.lastName}
            </span>
            <span className="text-xs text-muted">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      accessor: (row) => <StatusBadge status={row.status} statusConfig={COMMON_STATUS_CONFIG} variant="pill" />,
    },
    {
      id: "created",
      header: "Created",
      sortable: true,
      sortValue: (row) => row.createdAt,
      accessor: (row) => (
        <span className="text-sm text-primary">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              handleResetPasswordClick(row)
            }}
            aria-label={`Reset password for ${row.firstName} ${row.lastName}`}
          >
            <Key className="h-4 w-4 text-muted" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-error-light hover:text-error"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteClick(row)
            }}
            aria-label={`Delete ${row.firstName} ${row.lastName}`}
          >
            <Trash2 className="h-4 w-4 text-error" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Back Link */}
      <button
        onClick={onBackClick}
        className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors self-start"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Partners
      </button>

      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted-bg">
            <Users className="h-6 w-6 text-muted" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Partner Login Accounts</h1>
            <p className="text-muted mt-1">
              {activeCount} active login{activeCount !== 1 ? "s" : ""} for this partner
            </p>
          </div>
        </div>
        <Button
          variant="accent"
          onClick={handleAddLoginAccountClick}
          className="self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Login Account
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          placeholder="Search login accounts by name or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="pl-10"
        />
      </div>

      {/* Data Table */}
      <DataTable
        data={paginatedAccounts}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        hoverable
        bordered
        emptyState={
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
              <Users className="h-8 w-8 text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {searchQuery
                ? "No login accounts found"
                : "No login accounts yet"}
            </h3>
            <p className="text-muted text-sm max-w-sm text-center">
              {searchQuery
                ? "No accounts match your search criteria. Try adjusting your search."
                : "Get started by adding your first login account for this partner."}
            </p>
          </div>
        }
      />

      {/* Pagination */}
      {filteredAccounts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredAccounts.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          showPageSizeSelector={false}
          showFirstLastButtons={false}
          resultsTextFormat={(start, end, total) =>
            `Showing ${start} to ${end} of ${total} results`
          }
        />
      )}

      {/* Create Login Account Dialog */}
      <CreateLoginAccountDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isSubmitting={isCreating}
      />

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        account={selectedAccount}
        onConfirm={handleResetPasswordConfirm}
        isResetting={isResetting}
      />

      {/* Delete Login Account Dialog */}
      <DeleteLoginAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        account={accountToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default PartnerLoginAccountsPage
