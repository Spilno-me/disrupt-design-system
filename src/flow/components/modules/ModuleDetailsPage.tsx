/**
 * ModuleDetailsPage - Detailed view of a module with configuration tabs
 *
 * Displays module information with tabbed sections for:
 * - Entity Configuration (primary entity and related templates)
 * - Process Definitions (workflow definitions)
 * - Form Templates (available forms)
 * - Form Mappings (form-entity-workflow mappings)
 * - User Groups (access control)
 *
 * Features:
 * - Responsive tab layout (scrollable on mobile)
 * - URL-sync ready for deep linking
 * - Back navigation
 * - Glass-morphism styling
 *
 * @component PAGE
 */

import * as React from 'react'
import { useState, useCallback, useMemo } from 'react'
import {
  ArrowLeft,
  Package,
  Layers,
  GitBranch,
  FileText,
  Link2,
  Users,
  RefreshCw,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../../components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip'
import { ModuleStatusBadge } from './ModuleStatusBadge'
import { EntityTemplatesTab } from './tabs/EntityTemplatesTab'
import { ProcessDefinitionsTab } from './tabs/ProcessDefinitionsTab'
import { FormTemplatesTab } from './tabs/FormTemplatesTab'
import { FormMappingsTab } from './tabs/FormMappingsTab'
import { UserGroupsTab } from './tabs/UserGroupsTab'
import type { ModuleItem, ModulePermissions } from './ModuleCard'
import type { ProcessDefinitionItem } from './tabs/ProcessDefinitionsTab'
import type { FormTemplateItem } from './tabs/FormTemplatesTab'
import type { FormMappingItem } from './tabs/FormMappingsTab'
import type { UserGroupItem } from './tabs/UserGroupsTab'

// =============================================================================
// TYPES
// =============================================================================

export type ModuleDetailTab =
  | 'entity-config'
  | 'process-definitions'
  | 'form-templates'
  | 'form-mappings'
  | 'user-groups'

export interface ModuleDetailsPageProps {
  /** Module to display */
  module: ModuleItem
  /** Currently active tab */
  activeTab?: ModuleDetailTab
  /** Callback when tab changes */
  onTabChange?: (tab: ModuleDetailTab) => void
  /** Callback for back navigation */
  onBack?: () => void
  /** Callback when refresh is clicked */
  onRefresh?: () => void
  /** Process definitions for the module */
  processDefinitions?: ProcessDefinitionItem[]
  /** Form templates for the module */
  formTemplates?: FormTemplateItem[]
  /** Form mappings for the module */
  formMappings?: FormMappingItem[]
  /** User groups for the module */
  userGroups?: UserGroupItem[]
  /** Whether data is loading */
  isLoading?: boolean
  /** Permission flags */
  permissions?: ModulePermissions
  /** Callback when entity template is clicked */
  onEntityTemplateClick?: (entityId: string) => void
  /** Callback when process definition is clicked */
  onProcessDefinitionClick?: (processId: string) => void
  /** Callback when edit process definition is clicked */
  onEditProcessDefinition?: (processId: string) => void
  /** Callback when deploy process definition is clicked */
  onDeployProcessDefinition?: (processId: string) => void
  /** Callback when form template is clicked */
  onFormTemplateClick?: (formId: string) => void
  /** Callback when edit form template is clicked */
  onEditFormTemplate?: (formId: string) => void
  /** Callback when form mapping is clicked */
  onFormMappingClick?: (mappingId: string) => void
  /** Callback when edit form mapping is clicked */
  onEditFormMapping?: (mappingId: string) => void
  /** Callback when user group is clicked */
  onUserGroupClick?: (groupId: string) => void
  /** Callback when edit user group is clicked */
  onEditUserGroup?: (groupId: string) => void
  /** Callback for creating new process definition */
  onCreateProcessDefinition?: () => void
  /** Callback for creating new form template */
  onCreateFormTemplate?: () => void
  /** Callback for creating new form mapping */
  onCreateFormMapping?: () => void
  /** Callback for creating new user group */
  onCreateUserGroup?: () => void
  /** Additional class names */
  className?: string
}

// =============================================================================
// TAB CONFIGURATION
// =============================================================================

interface TabConfig {
  id: ModuleDetailTab
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const TAB_CONFIG: TabConfig[] = [
  {
    id: 'entity-config',
    label: 'Entity Configuration',
    icon: Layers,
    description: 'Primary entity and related templates',
  },
  {
    id: 'process-definitions',
    label: 'Process Definitions',
    icon: GitBranch,
    description: 'Workflow definitions',
  },
  {
    id: 'form-templates',
    label: 'Form Templates',
    icon: FileText,
    description: 'Available forms',
  },
  {
    id: 'form-mappings',
    label: 'Form Mappings',
    icon: Link2,
    description: 'Form-entity mappings',
  },
  {
    id: 'user-groups',
    label: 'User Groups',
    icon: Users,
    description: 'Access control',
  },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function ModuleDetailsPage({
  module,
  activeTab = 'entity-config',
  onTabChange,
  onBack,
  onRefresh,
  processDefinitions = [],
  formTemplates = [],
  formMappings = [],
  userGroups = [],
  isLoading = false,
  permissions,
  onEntityTemplateClick,
  onProcessDefinitionClick,
  onEditProcessDefinition,
  onDeployProcessDefinition,
  onFormTemplateClick,
  onEditFormTemplate,
  onFormMappingClick,
  onEditFormMapping,
  onUserGroupClick,
  onEditUserGroup,
  onCreateProcessDefinition,
  onCreateFormTemplate,
  onCreateFormMapping,
  onCreateUserGroup,
  className,
}: ModuleDetailsPageProps) {
  const [localTab, setLocalTab] = useState<ModuleDetailTab>(activeTab)

  // Handle tab changes
  const handleTabChange = useCallback(
    (value: string) => {
      const tab = value as ModuleDetailTab
      setLocalTab(tab)
      onTabChange?.(tab)
    },
    [onTabChange]
  )

  // Get counts for badges
  const counts = useMemo(
    () => ({
      entities: module.entityTemplates?.length ?? 0,
      processes: processDefinitions.length,
      forms: formTemplates.length,
      mappings: formMappings.length,
      groups: userGroups.length,
    }),
    [module, processDefinitions, formTemplates, formMappings, userGroups]
  )

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 p-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 shrink-0">
            <Package className="size-5 text-accent" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-semibold text-primary truncate">
                {module.name}
              </h1>
              <Badge variant="outline" size="sm" className="font-mono">
                v{module.version}
              </Badge>
              <ModuleStatusBadge status={module.status} />
            </div>
            <p className="text-sm text-tertiary font-mono mt-0.5">
              {module.code}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onBack && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={onBack}
                  >
                    <ArrowLeft className="size-4" />
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to modules list</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {onRefresh && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9"
                    onClick={onRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={cn('size-4', isLoading && 'animate-spin')}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh module data</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={localTab}
        onValueChange={handleTabChange}
        className="flex flex-col"
      >
        {/* Tab List - Scrollable on mobile */}
        <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList variant="accent" animated className="min-w-max sm:w-full">
            {TAB_CONFIG.map((tab) => {
              const Icon = tab.icon
              const count =
                tab.id === 'entity-config'
                  ? counts.entities
                  : tab.id === 'process-definitions'
                    ? counts.processes
                    : tab.id === 'form-templates'
                      ? counts.forms
                      : tab.id === 'form-mappings'
                        ? counts.mappings
                        : counts.groups

              return (
                <TooltipProvider key={tab.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        variant="accent"
                        value={tab.id}
                        className="gap-2"
                      >
                        <Icon className="size-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        {count > 0 && (
                          <Badge
                            variant={localTab === tab.id ? 'secondary' : 'outline'}
                            size="sm"
                            className="ml-1"
                          >
                            {count}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="sm:hidden">
                      {tab.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {/* Entity Configuration */}
          <TabsContent value="entity-config" className="mt-0">
            <EntityTemplatesTab
              module={module}
              isLoading={isLoading}
              onEntityClick={onEntityTemplateClick}
              permissions={permissions}
            />
          </TabsContent>

          {/* Process Definitions */}
          <TabsContent value="process-definitions" className="mt-0">
            <ProcessDefinitionsTab
              moduleId={module.id}
              processDefinitions={processDefinitions}
              isLoading={isLoading}
              onProcessClick={onProcessDefinitionClick}
              onEdit={onEditProcessDefinition}
              onDeploy={onDeployProcessDefinition}
              onCreate={onCreateProcessDefinition}
              permissions={permissions}
            />
          </TabsContent>

          {/* Form Templates */}
          <TabsContent value="form-templates" className="mt-0">
            <FormTemplatesTab
              moduleId={module.id}
              formTemplates={formTemplates}
              isLoading={isLoading}
              onFormClick={onFormTemplateClick}
              onEdit={onEditFormTemplate}
              onCreate={onCreateFormTemplate}
              permissions={permissions}
            />
          </TabsContent>

          {/* Form Mappings */}
          <TabsContent value="form-mappings" className="mt-0">
            <FormMappingsTab
              moduleId={module.id}
              formMappings={formMappings}
              isLoading={isLoading}
              onMappingClick={onFormMappingClick}
              onEdit={onEditFormMapping}
              onCreate={onCreateFormMapping}
              permissions={permissions}
            />
          </TabsContent>

          {/* User Groups */}
          <TabsContent value="user-groups" className="mt-0">
            <UserGroupsTab
              moduleId={module.id}
              userGroups={userGroups}
              isLoading={isLoading}
              onGroupClick={onUserGroupClick}
              onEdit={onEditUserGroup}
              onCreate={onCreateUserGroup}
              permissions={permissions}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

ModuleDetailsPage.displayName = 'ModuleDetailsPage'

export default ModuleDetailsPage
