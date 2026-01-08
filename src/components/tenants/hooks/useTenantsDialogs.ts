/**
 * useTenantsDialogs - Hook for managing tenant dialog states
 *
 * Centralizes dialog state management for view, edit, suspend, and activate dialogs.
 *
 * @module tenants/hooks
 */

import { useState, useCallback, useRef, useEffect } from "react"
import type { Tenant, TenantFormData } from "../types"

interface UseTenantsDialogsOptions {
  onViewTenant?: (tenant: Tenant) => void
  onEditTenant?: (tenant: Tenant, data: TenantFormData) => Promise<void>
  onSuspendTenant?: (tenant: Tenant) => Promise<void>
  onActivateTenant?: (tenant: Tenant) => Promise<void>
}

interface UseTenantsDialogsReturn {
  viewDialogOpen: boolean
  setViewDialogOpen: (open: boolean) => void
  selectedTenant: Tenant | null
  editDialogOpen: boolean
  setEditDialogOpen: (open: boolean) => void
  tenantToEdit: Tenant | null
  isSubmitting: boolean
  suspendDialogOpen: boolean
  setSuspendDialogOpen: (open: boolean) => void
  tenantToSuspend: Tenant | null
  isSuspending: boolean
  activateDialogOpen: boolean
  setActivateDialogOpen: (open: boolean) => void
  tenantToActivate: Tenant | null
  isActivating: boolean
  handleViewTenantClick: (tenant: Tenant) => void
  handleEditTenantClick: (tenant: Tenant) => void
  handleEditSubmit: (data: TenantFormData) => Promise<void>
  handleSuspendTenantClick: (tenant: Tenant) => void
  handleSuspendConfirm: (tenant: Tenant) => Promise<void>
  handleActivateTenantClick: (tenant: Tenant) => void
  handleActivateConfirm: (tenant: Tenant) => Promise<void>
  updateSelectedTenant: (tenant: Tenant) => void
}

export function useTenantsDialogs({
  onViewTenant,
  onEditTenant,
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

  // Suspend Dialog state
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [tenantToSuspend, setTenantToSuspend] = useState<Tenant | null>(null)
  const [isSuspending, setIsSuspending] = useState(false)

  // Activate Dialog state
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

  // Update selected tenant (for external state sync)
  const updateSelectedTenant = useCallback((tenant: Tenant) => {
    if (selectedTenant?.id === tenant.id) {
      setSelectedTenant(tenant)
    }
  }, [selectedTenant])

  return {
    viewDialogOpen,
    setViewDialogOpen,
    selectedTenant,
    editDialogOpen,
    setEditDialogOpen,
    tenantToEdit,
    isSubmitting,
    suspendDialogOpen,
    setSuspendDialogOpen,
    tenantToSuspend,
    isSuspending,
    activateDialogOpen,
    setActivateDialogOpen,
    tenantToActivate,
    isActivating,
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
