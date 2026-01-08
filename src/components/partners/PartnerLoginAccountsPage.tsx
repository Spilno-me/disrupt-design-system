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

// Extracted modules
import type {
  LoginAccount,
  LoginAccountStatus,
  PartnerLoginAccountsPageProps,
  CreateLoginAccountData,
} from "./types"
import { MOCK_LOGIN_ACCOUNTS } from "./data"
import { formatDate } from "./utils"
import { GLASS_CARD_CLASSES } from "./constants"
import { Avatar, AvatarFallback } from "../ui/avatar"

// UI components
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { DataTable, type ColumnDef } from "../ui/DataTable"
import { Pagination } from "../ui/Pagination"
import { ResetPasswordDialog } from "./ResetPasswordDialog"
import { CreateLoginAccountDialog } from "./CreateLoginAccountDialog"
import { DeleteLoginAccountDialog } from "./DeleteLoginAccountDialog"
import { DataTableStatusDot, LOGIN_ACCOUNT_DOT_STATUS_MAP } from "../ui/table"
import { ActionTile } from "../ui/ActionTile"
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"
import { PageActionPanel } from "../ui/PageActionPanel"

// Re-export types for external consumers
export type { LoginAccountStatus, LoginAccount, PartnerLoginAccountsPageProps, CreateLoginAccountData }
export { MOCK_LOGIN_ACCOUNTS }

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

  // Render login account actions using ActionTile pattern (≤3 actions = visible buttons)
  const renderLoginAccountActions = React.useCallback((account: LoginAccount) => (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <ActionTile
            variant="info"
            appearance="filled"
            size="xs"
            onClick={(e) => {
              e.stopPropagation()
              handleResetPasswordClick(account)
            }}
            aria-label="Reset password"
          >
            <Key className="size-4" />
          </ActionTile>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={4}>
          Reset Password
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ActionTile
            variant="destructive"
            appearance="filled"
            size="xs"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteClick(account)
            }}
            aria-label="Delete account"
          >
            <Trash2 className="size-4" />
          </ActionTile>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={4}>
          Delete Account
        </TooltipContent>
      </Tooltip>
    </div>
  ), [handleResetPasswordClick, handleDeleteClick])

  // Column definitions
  /* eslint-disable no-restricted-syntax */
  const columns: ColumnDef<LoginAccount>[] = [
    {
      id: "account",
      header: "Login Account",
      sortable: true,
      sortValue: (row) => `${row.firstName} ${row.lastName}`,
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback size="sm">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
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
      accessor: (row) => <DataTableStatusDot status={row.status} mapping={LOGIN_ACCOUNT_DOT_STATUS_MAP} />,
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
      width: "90px",
      sticky: "right",
      accessor: (row) => renderLoginAccountActions(row),
    },
  ]
  /* eslint-enable no-restricted-syntax */

  return (
    <main
      data-slot="partner-accounts-page"
      data-testid="partner-accounts-page"
      className={cn("min-h-screen", className)}
    >
      {/* Content - no extra background, page background comes from shell */}
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Back Link */}
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors self-start"
          data-testid="partner-accounts-back-button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Partners
        </button>

        {/* Page Action Panel - replaces manual header */}
        <PageActionPanel
          icon={<Users className="w-6 h-6 md:w-8 md:h-8" />}
          iconClassName="text-accent"
          title="Partner Login Accounts"
          subtitle={`${activeCount} active login${activeCount !== 1 ? "s" : ""} for this partner`}
          primaryAction={
            <Button
              variant="accent"
              size="sm"
              onClick={handleAddLoginAccountClick}
              data-testid="partner-accounts-add-button"
            >
              <Plus className="h-4 w-4" />
              Add Login Account
            </Button>
          }
        />

        {/* Glass container for main content */}
        <section className={cn("rounded-xl", GLASS_CARD_CLASSES)}>
          <div className="flex flex-col gap-4 p-4 md:p-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
              <Input
                placeholder="Search login accounts by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 bg-surface border border-default rounded-lg"
                data-testid="partner-accounts-search-input"
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
              data-testid="partner-accounts-table"
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
          </div>
        </section>

        {/* Pagination - outside glass container */}
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
            data-testid="partner-accounts-pagination"
          />
        )}
      </div>

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
    </main>
  )
}

export default PartnerLoginAccountsPage
