/**
 * Modules Interactive Stories
 *
 * Fully interactive module management with working navigation,
 * search, filters, and all CRUD operations.
 */

import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ModulesPage } from '../../../flow/components/modules/ModulesPage'
import { ModuleDetailsPage } from '../../../flow/components/modules/ModuleDetailsPage'
import { ModuleConfigSheet } from '../../../flow/components/modules/ModuleConfigSheet'
import { CreateEntitySheet } from '../../../flow/components/modules/CreateEntitySheet'
import type { ModuleDetailTab } from '../../../flow/components/modules/ModuleDetailsPage'
import type { ModuleItem } from '../../../flow/components/modules/ModuleCard'
import type { ModuleStatus } from '../../../flow/components/modules/helpers'
import type { ProcessDefinitionItem } from '../../../flow/components/modules/tabs/ProcessDefinitionsTab'
import type { FormTemplateItem } from '../../../flow/components/modules/tabs/FormTemplatesTab'
import type { FormMappingItem } from '../../../flow/components/modules/tabs/FormMappingsTab'
import type { UserGroupItem } from '../../../flow/components/modules/tabs/UserGroupsTab'
import { GridBlobBackground } from '../../../components/ui/GridBlobCanvas'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import {
  mockModules,
  mockProcessDefinitions,
  mockFormTemplates,
  mockFormMappings,
  mockUserGroups,
  fullPermissions,
  filterModulesByStatus,
  filterModulesBySearch,
} from '../../../flow/data/mockModules'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

// =============================================================================
// TOAST NOTIFICATION SYSTEM
// =============================================================================

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null

  const getToastStyles = (type: ToastType) => {
    if (type === 'success') return 'bg-success/10 border-success/30 text-success'
    if (type === 'error') return 'bg-error/10 border-error/30 text-error'
    return 'bg-info/10 border-info/30 text-info'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div key={toast.id} className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm animate-in slide-in-from-right-full duration-300 ${getToastStyles(toast.type)}`}>
          {toast.type === 'success' && <CheckCircle2 className="size-5 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="size-5 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="size-5 shrink-0 mt-0.5" />}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{toast.title}</p>
            {toast.description && <p className="text-xs mt-0.5 opacity-80">{toast.description}</p>}
          </div>
          <button onClick={() => onDismiss(toast.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, title: string, description?: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, type, title, description }])
    setTimeout(() => { setToasts((prev) => prev.filter((t) => t.id !== id)) }, 4000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, dismissToast }
}

// =============================================================================
// CONFIRMATION DIALOG
// =============================================================================

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  confirmVariant?: 'default' | 'destructive'
  onConfirm: () => void
}

function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = 'Confirm', confirmVariant = 'default', onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant={confirmVariant} onClick={() => { onConfirm(); onOpenChange(false) }}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


// =============================================================================
// CREATE DIALOGS
// =============================================================================

function CreateProcessDialog({ open, onOpenChange, onSubmit }: {
  open: boolean; onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string; key: string; description: string }) => void
}) {
  const [name, setName] = useState('')
  const [key, setKey] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    onSubmit({ name, key, description })
    setName(''); setKey(''); setDescription('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Process Definition</DialogTitle>
          <DialogDescription>Add a new BPMN workflow process definition.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="process-name">Process Name</Label>
            <Input id="process-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Incident Approval Process" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="process-key">Process Key</Label>
            <Input id="process-key" value={key} onChange={(e) => setKey(e.target.value)} placeholder="e.g., incident-approval-v1" className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="process-desc">Description</Label>
            <Input id="process-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name || !key}>Create Process</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CreateFormDialog({ open, onOpenChange, onSubmit }: {
  open: boolean; onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string; code: string; description: string }) => void
}) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    onSubmit({ name, code, description })
    setName(''); setCode(''); setDescription('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Form Template</DialogTitle>
          <DialogDescription>Add a new form template for data capture.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="form-name">Form Name</Label>
            <Input id="form-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Safety Inspection Form" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-code">Form Code</Label>
            <Input id="form-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g., safety-inspection" className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-desc">Description</Label>
            <Input id="form-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this form is used for" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name || !code}>Create Form</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CreateMappingDialog({ open, onOpenChange, forms, onSubmit }: {
  open: boolean; onOpenChange: (open: boolean) => void; forms: FormTemplateItem[]
  onSubmit: (data: { name: string; formId: string; targetType: 'entity' | 'workflow' }) => void
}) {
  const [name, setName] = useState('')
  const [formId, setFormId] = useState('')
  const [targetType, setTargetType] = useState<'entity' | 'workflow'>('entity')

  const handleSubmit = () => {
    onSubmit({ name, formId, targetType })
    setName(''); setFormId(''); setTargetType('entity')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Form Mapping</DialogTitle>
          <DialogDescription>Map a form to an entity or workflow.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="mapping-name">Mapping Name</Label>
            <Input id="mapping-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Inspection to Entity" />
          </div>
          <div className="space-y-2">
            <Label>Source Form</Label>
            <Select value={formId} onValueChange={setFormId}>
              <SelectTrigger><SelectValue placeholder="Select a form" /></SelectTrigger>
              <SelectContent>
                {forms.map((form) => (<SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Target Type</Label>
            <Select value={targetType} onValueChange={(v) => setTargetType(v as 'entity' | 'workflow')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="entity">Entity</SelectItem>
                <SelectItem value="workflow">Workflow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name || !formId}>Create Mapping</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CreateGroupDialog({ open, onOpenChange, onSubmit }: {
  open: boolean; onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string; description: string; accessLevel: 'view' | 'edit' | 'admin' }) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit' | 'admin'>('view')

  const handleSubmit = () => {
    onSubmit({ name, description, accessLevel })
    setName(''); setDescription(''); setAccessLevel('view')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User Group</DialogTitle>
          <DialogDescription>Add a new user group for access control.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input id="group-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Safety Officers" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-desc">Description</Label>
            <Input id="group-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this group is for" />
          </div>
          <div className="space-y-2">
            <Label>Access Level</Label>
            <Select value={accessLevel} onValueChange={(v) => setAccessLevel(v as 'view' | 'edit' | 'admin')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View - Read only access</SelectItem>
                <SelectItem value="edit">Edit - Can modify data</SelectItem>
                <SelectItem value="admin">Admin - Full access</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name}>Create Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


// =============================================================================
// MAIN INTERACTIVE COMPONENT
// =============================================================================

type View = 'list' | 'details'

function FullyInteractiveModules() {
  const { toasts, addToast, dismissToast } = useToast()

  // Navigation state
  const [view, setView] = useState<View>('list')
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null)
  const [activeTab, setActiveTab] = useState<ModuleDetailTab>('entity-config')

  // List view state
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ModuleStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Module data (mutable for demo)
  const [modules, setModules] = useState<ModuleItem[]>(mockModules)
  const [processDefinitions, setProcessDefinitions] = useState<ProcessDefinitionItem[]>(mockProcessDefinitions)
  const [formTemplates, setFormTemplates] = useState<FormTemplateItem[]>(mockFormTemplates)
  const [formMappings, setFormMappings] = useState<FormMappingItem[]>(mockFormMappings)
  const [userGroups, setUserGroups] = useState<UserGroupItem[]>(mockUserGroups)

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean; title: string; description: string; confirmLabel: string; confirmVariant: 'default' | 'destructive'; onConfirm: () => void
  }>({ open: false, title: '', description: '', confirmLabel: 'Confirm', confirmVariant: 'default', onConfirm: () => {} })

  const [createProcessOpen, setCreateProcessOpen] = useState(false)
  const [createFormOpen, setCreateFormOpen] = useState(false)
  const [createMappingOpen, setCreateMappingOpen] = useState(false)
  const [createGroupOpen, setCreateGroupOpen] = useState(false)

  // Sheet states
  const [configSheetOpen, setConfigSheetOpen] = useState(false)
  const [createEntitySheetOpen, setCreateEntitySheetOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<ModuleItem | null>(null)

  // Filtered and paginated modules
  const filteredModules = useMemo(() => {
    let result = modules
    if (statusFilter !== 'all') result = filterModulesByStatus(result, statusFilter)
    if (search) result = filterModulesBySearch(result, search)
    return result
  }, [modules, search, statusFilter])

  const paginatedModules = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredModules.slice(start, start + pageSize)
  }, [filteredModules, page, pageSize])

  React.useEffect(() => { setPage(1) }, [search, statusFilter])

  // Module list actions
  const handleOpenModule = (module: ModuleItem) => {
    setSelectedModule(module)
    setActiveTab('entity-config')
    setView('details')
    addToast('info', 'Opened ' + module.name, 'Navigate through tabs to configure')
  }

  const handleEditModule = (module: ModuleItem) => {
    setEditingModule(module)
    setConfigSheetOpen(true)
  }

  const handleToggleModuleStatus = (module: ModuleItem) => {
    const newStatus = module.status === 'active' ? 'inactive' : 'active'
    setConfirmDialog({
      open: true,
      title: (newStatus === 'active' ? 'Activate' : 'Deactivate') + ' Module',
      description: 'Are you sure you want to ' + (newStatus === 'active' ? 'activate' : 'deactivate') + ' "' + module.name + '"?',
      confirmLabel: newStatus === 'active' ? 'Activate' : 'Deactivate',
      confirmVariant: newStatus === 'active' ? 'default' : 'destructive',
      onConfirm: () => {
        setModules((prev) => prev.map((m) => m.id === module.id ? { ...m, status: newStatus, updatedAt: new Date() } : m))
        addToast('success', 'Module ' + newStatus, module.name + ' is now ' + newStatus)
      },
    })
  }

  const handleCreateEntity = (module: ModuleItem) => {
    setEditingModule(module)
    setCreateEntitySheetOpen(true)
  }

  const handleSaveModuleConfig = (moduleId: string, config: { status: ModuleStatus; primaryFormTemplateId: string | null }) => {
    setModules((prev) => prev.map((m) => m.id === moduleId ? { ...m, status: config.status, updatedAt: new Date() } : m))
    setConfigSheetOpen(false)
    const mod = modules.find((m) => m.id === moduleId)
    addToast('success', 'Module Updated', (mod?.name || 'Module') + ' configuration saved')
  }

  const handleEntityCreated = () => {
    setCreateEntitySheetOpen(false)
    addToast('success', 'Entity Created', 'New entity created from template')
  }

  // Detail view actions
  const handleBack = () => { setView('list'); setSelectedModule(null) }
  const handleRefresh = () => { addToast('info', 'Refreshing...', 'Data has been refreshed') }

  // Process definition actions
  const handleDeployProcess = (processId: string) => {
    const process = processDefinitions.find((p) => p.id === processId)
    if (!process) return
    setConfirmDialog({
      open: true, title: 'Deploy Process',
      description: 'Deploy "' + process.name + '" to production? This will make it available for use.',
      confirmLabel: 'Deploy', confirmVariant: 'default',
      onConfirm: () => {
        setProcessDefinitions((prev) => prev.map((p) => p.id === processId ? { ...p, status: 'deployed', version: p.version + 1, updatedAt: new Date() } : p))
        addToast('success', 'Process Deployed', process.name + ' v' + (process.version + 1) + ' is now live')
      },
    })
  }

  const handleCreateProcess = (data: { name: string; key: string; description: string }) => {
    const newProcess: ProcessDefinitionItem = {
      id: 'pd-' + Date.now(), name: data.name, processDefinitionKey: data.key, description: data.description,
      version: 1, status: 'draft', createdAt: new Date(), updatedAt: new Date(),
    }
    setProcessDefinitions((prev) => [newProcess, ...prev])
    addToast('success', 'Process Created', data.name + ' is ready to configure')
  }

  const handleCreateForm = (data: { name: string; code: string; description: string }) => {
    const newForm: FormTemplateItem = {
      id: 'ft-' + Date.now(), name: data.name, code: data.code, description: data.description,
      version: 1, status: 'draft', fieldCount: 0, createdAt: new Date(), updatedAt: new Date(),
    }
    setFormTemplates((prev) => [newForm, ...prev])
    addToast('success', 'Form Created', data.name + ' is ready for field configuration')
  }

  const handleCreateMapping = (data: { name: string; formId: string; targetType: 'entity' | 'workflow' }) => {
    const form = formTemplates.find((f) => f.id === data.formId)
    const newMapping: FormMappingItem = {
      id: 'fm-' + Date.now(), name: data.name, formName: form?.name || 'Unknown', formId: data.formId,
      targetName: data.targetType === 'entity' ? 'New Entity' : 'New Workflow', targetId: 'target-' + Date.now(),
      mappingType: data.targetType, isActive: false, createdAt: new Date(), updatedAt: new Date(),
    }
    setFormMappings((prev) => [newMapping, ...prev])
    addToast('success', 'Mapping Created', data.name + ' mapping added')
  }

  const handleCreateGroup = (data: { name: string; description: string; accessLevel: 'view' | 'edit' | 'admin' }) => {
    const newGroup: UserGroupItem = {
      id: 'ug-' + Date.now(), name: data.name, code: data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description, userCount: 0, accessLevel: data.accessLevel,
      isSystemGroup: false, createdAt: new Date(), updatedAt: new Date(),
    }
    setUserGroups((prev) => [newGroup, ...prev])
    addToast('success', 'Group Created', data.name + ' is ready for members')
  }

  // Edit/click handlers
  const handleEditProcess = (id: string) => { const p = processDefinitions.find((x) => x.id === id); addToast('info', 'Edit Process', 'Opening editor for ' + p?.name) }
  const handleEditForm = (id: string) => { const f = formTemplates.find((x) => x.id === id); addToast('info', 'Edit Form', 'Opening form builder for ' + f?.name) }
  const handleEditMapping = (id: string) => { const m = formMappings.find((x) => x.id === id); addToast('info', 'Edit Mapping', 'Opening mapping editor for ' + m?.name) }
  const handleEditGroup = (id: string) => { const g = userGroups.find((x) => x.id === id); addToast('info', 'Edit Group', 'Opening group settings for ' + g?.name) }
  const handleEntityClick = () => { addToast('info', 'Entity Template', 'Viewing entity template configuration') }
  const handleProcessClick = (id: string) => { const p = processDefinitions.find((x) => x.id === id); addToast('info', 'Process Details', 'Viewing ' + p?.name + ' workflow diagram') }
  const handleFormClick = (id: string) => { const f = formTemplates.find((x) => x.id === id); addToast('info', 'Form Preview', 'Previewing ' + f?.name) }
  const handleMappingClick = (id: string) => { const m = formMappings.find((x) => x.id === id); addToast('info', 'Mapping Details', 'Viewing ' + m?.name + ' field mappings') }
  const handleGroupClick = (id: string) => { const g = userGroups.find((x) => x.id === id); addToast('info', 'Group Members', 'Viewing ' + g?.userCount + ' members in ' + g?.name) }


  return (
    <div className="relative min-h-screen bg-page overflow-hidden">
      <GridBlobBackground scale={1.2} blobCount={2} />
      <div className="relative z-10 p-4 sm:p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-secondary mb-4">
          <button onClick={() => setView('list')} className={`hover:text-primary transition-colors ${view === 'list' ? 'text-primary font-medium' : ''}`}>
            Modules
          </button>
          {view === 'details' && selectedModule && (
            <><span>/</span><span className="text-primary font-medium">{selectedModule.name}</span></>
          )}
        </div>

        {/* Views */}
        {view === 'list' ? (
          <ModulesPage
            modules={paginatedModules} totalModules={filteredModules.length} currentPage={page} pageSize={pageSize}
            onSearchChange={setSearch} onStatusChange={setStatusFilter} onPageChange={setPage} onPageSizeChange={setPageSize}
            onOpenModule={handleOpenModule} onEditModule={handleEditModule} onToggleModuleStatus={handleToggleModuleStatus}
            onCreateEntity={handleCreateEntity} onAddModule={() => addToast('info', 'Add Module', 'Module creation wizard would open here')}
            onRefresh={() => addToast('info', 'Refreshed', 'Module list has been refreshed')}
            permissions={fullPermissions} title="Modules Configuration" description="Manage system modules, workflows, forms, and access control"
          />
        ) : selectedModule ? (
          <ModuleDetailsPage
            module={selectedModule} activeTab={activeTab} onTabChange={setActiveTab}
            processDefinitions={processDefinitions} formTemplates={formTemplates} formMappings={formMappings} userGroups={userGroups}
            permissions={fullPermissions} onBack={handleBack} onRefresh={handleRefresh}
            onEntityTemplateClick={handleEntityClick} onProcessDefinitionClick={handleProcessClick}
            onEditProcessDefinition={handleEditProcess} onDeployProcessDefinition={handleDeployProcess}
            onFormTemplateClick={handleFormClick} onEditFormTemplate={handleEditForm}
            onFormMappingClick={handleMappingClick} onEditFormMapping={handleEditMapping}
            onUserGroupClick={handleGroupClick} onEditUserGroup={handleEditGroup}
            onCreateProcessDefinition={() => setCreateProcessOpen(true)} onCreateFormTemplate={() => setCreateFormOpen(true)}
            onCreateFormMapping={() => setCreateMappingOpen(true)} onCreateUserGroup={() => setCreateGroupOpen(true)}
          />
        ) : null}
      </div>

      {/* Dialogs */}
      <ConfirmDialog {...confirmDialog} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))} />
      <CreateProcessDialog open={createProcessOpen} onOpenChange={setCreateProcessOpen} onSubmit={handleCreateProcess} />
      <CreateFormDialog open={createFormOpen} onOpenChange={setCreateFormOpen} onSubmit={handleCreateForm} />
      <CreateMappingDialog open={createMappingOpen} onOpenChange={setCreateMappingOpen} forms={formTemplates} onSubmit={handleCreateMapping} />
      <CreateGroupDialog open={createGroupOpen} onOpenChange={setCreateGroupOpen} onSubmit={handleCreateGroup} />

      {/* Sheets */}
      {editingModule && (
        <>
          <ModuleConfigSheet open={configSheetOpen} onOpenChange={setConfigSheetOpen} module={editingModule}
            formTemplates={formTemplates.map((f) => ({ id: f.id, name: f.name, code: f.code }))} onSave={handleSaveModuleConfig} />
          <CreateEntitySheet open={createEntitySheetOpen} onOpenChange={setCreateEntitySheetOpen}
            module={editingModule} onCreateEntity={handleEntityCreated} />
        </>
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

// =============================================================================
// META
// =============================================================================

const meta: Meta = {
  title: 'Flow/Modules/Interactive Demo',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Fully Interactive Modules Demo

Complete module management experience with all buttons and interactions working.

## Features

- **Navigation**: Click Open on a module card → Details page → Back to list
- **Search & Filter**: Filter by name/code and status
- **Pagination**: Navigate through pages
- **CRUD Operations**: Create/Edit/Deploy with confirmation dialogs
- **Toast Notifications**: Feedback for all actions
- **Tab Navigation**: All 5 configuration tabs fully functional
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

export const FullyInteractive: Story = {
  render: () => <FullyInteractiveModules />,
}
