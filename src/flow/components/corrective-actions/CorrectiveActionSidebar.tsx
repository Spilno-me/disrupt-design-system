/**
 * CorrectiveActionSidebar
 *
 * Sidebar for corrective action details showing metadata,
 * classification, implementation details, and quick actions.
 */

import {
  User,
  Building2,
  MapPin,
  Tag,
  FileText,
  Clock,
  DollarSign,
  CheckSquare,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { EFFECTIVENESS_CONFIG, formatDate, getUserDisplayName } from './helpers'
import type { CorrectiveAction, CorrectiveActionPermissions } from './types'
import { cn } from '@/lib/utils'

export interface CorrectiveActionSidebarProps {
  /** Corrective action data */
  action: CorrectiveAction
  /** User permissions */
  permissions?: CorrectiveActionPermissions
  /** Submit completion handler */
  onSubmitCompletion?: () => void
  /** Request extension handler */
  onRequestExtension?: () => void
  /** Request closure handler */
  onRequestClosure?: () => void
  /** Additional CSS classes */
  className?: string
}

interface SidebarSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

function SidebarSection({ title, children, className }: SidebarSectionProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-semibold text-primary">{title}</h3>
      {children}
    </div>
  )
}

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}

function SidebarItem({ icon: Icon, label, value }: SidebarItemProps) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-tertiary shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-xs text-secondary">{label}</div>
        <div className="text-sm text-primary">{value}</div>
      </div>
    </div>
  )
}

export function CorrectiveActionSidebar({
  action,
  permissions = {
    canView: true,
    canEdit: true,
    canCreate: false,
    canDelete: false,
    canApprove: false,
    canRequestExtension: true,
  },
  onSubmitCompletion,
  onRequestExtension,
  onRequestClosure,
  className,
}: CorrectiveActionSidebarProps) {
  const canSubmitCompletion =
    action.status === 'in-progress' && permissions.canEdit
  const canRequestExtension =
    !action.extensionRequested &&
    action.status !== 'completed' &&
    action.status !== 'closed' &&
    permissions.canRequestExtension
  const canRequestClosure =
    action.status === 'completed' && permissions.canApprove

  return (
    <div className={cn('space-y-6', className)}>
      {/* Quick Actions */}
      {(canSubmitCompletion || canRequestExtension || canRequestClosure) && (
        <>
          <SidebarSection title="Actions">
            <div className="space-y-2">
              {canSubmitCompletion && onSubmitCompletion && (
                <Button
                  className="w-full justify-start"
                  onClick={onSubmitCompletion}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Submit Completion
                </Button>
              )}
              {canRequestExtension && onRequestExtension && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={onRequestExtension}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Request Extension
                </Button>
              )}
              {canRequestClosure && onRequestClosure && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={onRequestClosure}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Request Closure
                </Button>
              )}
            </div>
          </SidebarSection>
          <Separator />
        </>
      )}

      {/* Assignment */}
      <SidebarSection title="Assignment">
        <div className="space-y-3">
          <SidebarItem
            icon={User}
            label="Action Owner"
            value={getUserDisplayName(action.actionOwner)}
          />
          <SidebarItem
            icon={Building2}
            label="Department"
            value={action.responsibleDepartment?.name}
          />
          <SidebarItem
            icon={MapPin}
            label="Location"
            value={action.location?.name}
          />
          {action.specificLocationDetails && (
            <SidebarItem
              icon={MapPin}
              label="Location Details"
              value={action.specificLocationDetails}
            />
          )}
        </div>
      </SidebarSection>

      <Separator />

      {/* Classification */}
      <SidebarSection title="Classification">
        <div className="space-y-3">
          <SidebarItem
            icon={Tag}
            label="Action Type"
            value={action.actionType?.name}
          />
          <SidebarItem
            icon={Tag}
            label="Category"
            value={action.category?.name}
          />
          <SidebarItem
            icon={FileText}
            label="Source"
            value={
              action.sourceType ? (
                <div>
                  <div>{action.sourceType.name}</div>
                  {action.sourceReferenceNumber && (
                    <div className="text-xs text-secondary font-mono">
                      {action.sourceReferenceNumber}
                    </div>
                  )}
                </div>
              ) : undefined
            }
          />
        </div>
      </SidebarSection>

      {/* Root Cause */}
      {(action.rootCauseCategory || action.rootCauseAnalysis) && (
        <>
          <Separator />
          <SidebarSection title="Root Cause">
            <div className="space-y-3">
              <SidebarItem
                icon={AlertTriangle}
                label="Category"
                value={action.rootCauseCategory?.name}
              />
              {action.rootCauseAnalysis && (
                <div className="text-sm text-primary bg-muted-bg rounded p-3">
                  {action.rootCauseAnalysis}
                </div>
              )}
            </div>
          </SidebarSection>
        </>
      )}

      {/* Implementation */}
      {(action.implementationPlan ||
        action.verificationMethod ||
        action.estimatedCost) && (
        <>
          <Separator />
          <SidebarSection title="Implementation">
            <div className="space-y-3">
              {action.implementationPlan && (
                <div>
                  <div className="text-xs text-secondary mb-1">Plan</div>
                  <div className="text-sm text-primary bg-muted-bg rounded p-3">
                    {action.implementationPlan}
                  </div>
                </div>
              )}
              {action.verificationMethod && (
                <div>
                  <div className="text-xs text-secondary mb-1">
                    Verification Method
                  </div>
                  <div className="text-sm text-primary">
                    {action.verificationMethod}
                  </div>
                </div>
              )}
              {action.successCriteria && (
                <div>
                  <div className="text-xs text-secondary mb-1">
                    Success Criteria
                  </div>
                  <div className="text-sm text-primary">
                    {action.successCriteria}
                  </div>
                </div>
              )}
              <SidebarItem
                icon={DollarSign}
                label="Estimated Cost"
                value={
                  action.estimatedCost
                    ? `$${action.estimatedCost.toLocaleString()}`
                    : undefined
                }
              />
            </div>
          </SidebarSection>
        </>
      )}

      {/* Completion & Effectiveness */}
      {action.status === 'completed' || action.status === 'closed' ? (
        <>
          <Separator />
          <SidebarSection title="Completion">
            <div className="space-y-3">
              {action.completionNotes && (
                <div>
                  <div className="text-xs text-secondary mb-1">Notes</div>
                  <div className="text-sm text-primary bg-muted-bg rounded p-3">
                    {action.completionNotes}
                  </div>
                </div>
              )}
              {action.effectivenessAssessment && (
                <div>
                  <div className="text-xs text-secondary mb-1">
                    Effectiveness
                  </div>
                  <Badge
                    variant={
                      EFFECTIVENESS_CONFIG[action.effectivenessAssessment]
                        .variant
                    }
                  >
                    {
                      EFFECTIVENESS_CONFIG[action.effectivenessAssessment]
                        .label
                    }
                  </Badge>
                </div>
              )}
              {action.completionEvidence &&
                action.completionEvidence.length > 0 && (
                  <div>
                    <div className="text-xs text-secondary mb-1">
                      Evidence ({action.completionEvidence.length} files)
                    </div>
                    <div className="space-y-1">
                      {action.completionEvidence.map((file) => (
                        <a
                          key={file.id}
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-accent hover:underline truncate"
                        >
                          {file.fileName}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </SidebarSection>
        </>
      ) : null}

      {/* Extension Request */}
      {action.extensionRequested && (
        <>
          <Separator />
          <SidebarSection title="Extension Request">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary">Requested Date:</span>
                <span className="text-primary">
                  {formatDate(action.requestedDueDate)}
                </span>
              </div>
              {action.extensionJustification && (
                <div className="bg-muted-bg rounded p-3">
                  {action.extensionJustification}
                </div>
              )}
              <Badge
                variant={
                  action.extensionApproved === true
                    ? 'success'
                    : action.extensionApproved === false
                    ? 'destructive'
                    : 'warning'
                }
              >
                {action.extensionApproved === true
                  ? 'Approved'
                  : action.extensionApproved === false
                  ? 'Rejected'
                  : 'Pending'}
              </Badge>
              {action.extensionApproved === false && action.rejectionReason && (
                <div className="text-error text-xs">
                  {action.rejectionReason}
                </div>
              )}
            </div>
          </SidebarSection>
        </>
      )}

      {/* Metadata */}
      <Separator />
      <SidebarSection title="Metadata">
        <div className="space-y-2 text-xs text-tertiary">
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{formatDate(action.createdAt)}</span>
          </div>
          {action.createdBy && (
            <div className="flex justify-between">
              <span>By:</span>
              <span>{getUserDisplayName(action.createdBy)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Updated:</span>
            <span>{formatDate(action.updatedAt)}</span>
          </div>
        </div>
      </SidebarSection>
    </div>
  )
}

export default CorrectiveActionSidebar
