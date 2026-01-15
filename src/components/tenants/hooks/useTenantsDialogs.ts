/**
 * useTenantsDialogs - Hook for managing tenant dialog states
 *
 * Centralizes dialog state management for view, edit, and change status dialogs.
 * Also maintains backwards compatibility with legacy suspend/activate dialogs.
 *
 * @module tenants/hooks
 */

import { useState, useCallback, useRef, useEffect } from "react"
import type { Tenant, TenantFormData, ChangeStatusFormData } from "../types"

export interface UseTenantsDialogsOptions {
  onViewTenant?: (tenant: Tenant) => void
  onEditTenant?: (tenant: Tenant, data: TenantFormData) => void | Promise<void>
  /** New unified change status handler */
  onChangeStatus?: (tenant: Tenant, data: ChangeStatusFormData) => void | Promise<void>
  /** Setter for updating tenants list (for optimistic updates) */
  setTenants?: React.Dispatch<React.SetStateAction<Tenant[]>>
  /** @deprecated Use onChangeStatus instead */
  onSuspendTenant?: (tenant: Tenant) => void | Promise<void>
  /** @deprecated Use onChangeStatus instead */
  onActivateTenant?: (tenant: Tenant) => void | Promise<void>
}

export interface UseTenantsDialogsReturn {
  // View Dialog
  viewDialogOpen: boolean
  setViewDialogOpen: (open: boolean) => void
  selectedTenant: Tenant | null

  // Edit Dialog
  editDialogOpen: boolean
  setEditDialogOpen: (open: boolean) => void
  tenantToEdit: Tenant | null
  isSubmitting: boolean

  // Change Status Dialog (new unified approach)
  changeStatusDialogOpen: boolean
  setChangeStatusDialogOpen: (open: boolean) => void
  tenantToChangeStatus: Tenant | null
  isChangingStatus: boolean
  handleChangeStatusClick: (tenant: Tenant) => void
  handleChangeStatusConfirm: (tenant: Tenant, data: ChangeStatusFormData) => Promise<void>

  // Legacy Suspend Dialog (deprecated)
  /** @deprecated Use changeStatusDialogOpen instead */
  suspendDialogOpen: boolean
  /** @deprecated Use setChangeStatusDialogOpen instead */
  setSuspendDialogOpen: (open: boolean) => void
  /** @deprecated Use tenantToChangeStatus instead */
  tenantToSuspend: Tenant | null
  /** @deprecated Use isChangingStatus instead */
  isSuspending: boolean

  // Legacy Activate Dialog (deprecated)
  /** @deprecated Use changeStatusDialogOpen instead */
  activateDialogOpen: boolean
  /** @deprecated Use setChangeStatusDialogOpen instead */
  setActivateDialogOpen: (open: boolean) => void
  /** @deprecated Use tenantToChangeStatus instead */
  tenantToActivate: Tenant | null
  /** @deprecated Use isChangingStatus instead */
  isActivating: boolean

  // Handlers
  handleViewTenantClick: (tenant: Tenant) => void
  handleEditTenantClick: (tenant: Tenant) => void
  handleEditSubmit: (data: TenantFormData) => Promise<void>
  /** @deprecated Use handleChangeStatusClick instead */
  handleSuspendTenantClick: (tenant: Tenant) => void
  /** @deprecated Use handleChangeStatusConfirm instead */
  handleSuspendConfirm: (tenant: Tenant) => Promise<void>
  /** @deprecated Use handleChangeStatusClick instead */
  handleActivateTenantClick: (tenant: Tenant) => void
  /** @deprecated Use handleChangeStatusConfirm instead */
  handleActivateConfirm: (tenant: Tenant) => Promise<void>
  updateSelectedTenant: (tenant: Tenant) => void
}

export function useTenantsDialogs({
  onViewTenant,
  onEditTenant,
  onChangeStatus,
  setTenants,
  onSuspendTenant,
  onActivateTenant,
}: UseTenantsDialogsOptions = {}): UseTenantsDialogsReturn {
  // View Dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)

  // Edit Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [tenantToEdit, setTenantToEdit] = useState<Tenant | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Change Status Dialog state (new unified approach)
  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false)
  const [tenantToChangeStatus, setTenantToChangeStatus] = useState<Tenant | null>(null)
  const [isChangingStatus, setIsChangingStatus] = useState(false)

  // Legacy Suspend Dialog state (deprecated)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [tenantToSuspend, setTenantToSuspend] = useState<Tenant | null>(null)
  const [isSuspending, setIsSuspending] = useState(false)

  // Legacy Activate Dialog state (deprecated)
  const [activateDialogOpen, setActivateDialogOpen] = useState(false)
  const [tenantToActivate, setTenantToActivate] = useState<Tenant | null>(null)
  const [isActivating, setIsActivating] = useState(false)

  // Timeout refs for cleanup - prevents memory leaks if component unmounts during delay
  const timeoutRefs = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  // Cleanup all pending timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((id) => clearTimeout(id))
      timeoutRefs.current.clear()
    }
  }, [])

  // Helper to schedule dialog open with cleanup tracking
  // The 150ms delay allows the previous dialog's exit animation to complete
  // before opening the new dialog, preventing visual glitches
  const scheduleDialogOpen = useCallback((openFn: () => void) => {
    const id = setTimeout(() => {
      timeoutRefs.current.delete(id)
      openFn()
    }, 150)
    timeoutRefs.current.add(id)
  }, [])

  // Handle view tenant click
  const handleViewTenantClick = useCallback((tenant: Tenant) => {
    if (onViewTenant) {
      onViewTenant(tenant)
    } else {
      setSelectedTenant(tenant)
      scheduleDialogOpen(() => setViewDialogOpen(true))
    }
  }, [onViewTenant, scheduleDialogOpen])

  // Handle edit tenant click
  const handleEditTenantClick = useCallback((tenant: Tenant) => {
    setTenantToEdit(tenant)
    scheduleDialogOpen(() => setEditDialogOpen(true))
  }, [scheduleDialogOpen])

  // Handle edit dialog submit
  const handleEditSubmit = useCallback(async (data: TenantFormData) => {
    setIsSubmitting(true)
    try {
      if (tenantToEdit && onEditTenant) {
        await onEditTenant(tenantToEdit, data)
      }
      setEditDialogOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }, [tenantToEdit, onEditTenant])

  // Handle suspend tenant click
  const handleSuspendTenantClick = useCallback((tenant: Tenant) => {
    setTenantToSuspend(tenant)
    scheduleDialogOpen(() => setSuspendDialogOpen(true))
  }, [scheduleDialogOpen])

  // Handle suspend confirmation
  const handleSuspendConfirm = useCallback(async (tenant: Tenant) => {
    setIsSuspending(true)
    try {
      if (onSuspendTenant) {
        await onSuspendTenant(tenant)
      }
      setSuspendDialogOpen(false)
    } finally {
      setIsSuspending(false)
    }
  }, [onSuspendTenant])

  // Handle activate tenant click
  const handleActivateTenantClick = useCallback((tenant: Tenant) => {
    setTenantToActivate(tenant)
    scheduleDialogOpen(() => setActivateDialogOpen(true))
  }, [scheduleDialogOpen])

  // Handle activate confirmation
  const handleActivateConfirm = useCallback(async (tenant: Tenant) => {
    setIsActivating(true)
    try {
      if (onActivateTenant) {
        await onActivateTenant(tenant)
      }
      setActivateDialogOpen(false)
      setViewDialogOpen(false)
    } finally {
      setIsActivating(false)
    }
  }, [onActivateTenant])

  // ==========================================================================
  // CHANGE STATUS HANDLERS (new unified approach)
  // ==========================================================================

  // Handle change status click
  const handleChangeStatusClick = useCallback((tenant: Tenant) => {
    setTenantToChangeStatus(tenant)
    scheduleDialogOpen(() => setChangeStatusDialogOpen(true))
  }, [scheduleDialogOpen])

  // Handle change status confirmation
  const handleChangeStatusConfirm = useCallback(
    async (tenant: Tenant, data: ChangeStatusFormData) => {
      setIsChangingStatus(true)
      try {
        if (onChangeStatus) {
          await onChangeStatus(tenant, data)
        }
        // Optimistic update of internal state if setTenants is provided
        if (setTenants) {
          setTenants((prev) =>
            prev.map((t) =>
              t.id === tenant.id
                ? {
                    ...t,
                    status: data.status,
                    monthlyPayment: data.status === "suspended" ? 0 : t.monthlyPayment,
                    monthlyRevenue: data.status === "suspended" ? 0 : t.monthlyRevenue,
                  }
                : t
            )
          )
        }
        // Update selected tenant if currently viewing
        if (selectedTenant?.id === tenant.id) {
          setSelectedTenant({
            ...tenant,
            status: data.status,
            monthlyPayment: data.status === "suspended" ? 0 : tenant.monthlyPayment,
          })
        }
        setChangeStatusDialogOpen(false)
      } finally {
        setIsChangingStatus(false)
      }
    },
    [onChangeStatus, selectedTenant, setTenants]
  )

  // Update selected tenant (for external state sync)
  const updateSelectedTenant = useCallback((tenant: Tenant) => {
    if (selectedTenant?.id === tenant.id) {
      setSelectedTenant(tenant)
    }
  }, [selectedTenant])

  return {
    // View Dialog
    viewDialogOpen,
    setViewDialogOpen,
    selectedTenant,

    // Edit Dialog
    editDialogOpen,
    setEditDialogOpen,
    tenantToEdit,
    isSubmitting,

    // Change Status Dialog (new)
    changeStatusDialogOpen,
    setChangeStatusDialogOpen,
    tenantToChangeStatus,
    isChangingStatus,
    handleChangeStatusClick,
    handleChangeStatusConfirm,

    // Legacy Suspend Dialog (deprecated)
    suspendDialogOpen,
    setSuspendDialogOpen,
    tenantToSuspend,
    isSuspending,

    // Legacy Activate Dialog (deprecated)
    activateDialogOpen,
    setActivateDialogOpen,
    tenantToActivate,
    isActivating,

    // Handlers
    handleViewTenantClick,
    handleEditTenantClick,
    handleEditSubmit,
    handleSuspendTenantClick,
    handleSuspendConfirm,
    handleActivateTenantClick,
    handleActivateConfirm,
    updateSelectedTenant,
  }
}
