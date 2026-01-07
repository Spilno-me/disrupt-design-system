import * as React from 'react'
import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

/**
 * @deprecated 'chat' method removed per MVP spec.
 * Tenant Request creation should use wizard only.
 */
export type ProvisioningMethod = 'chat' | 'wizard'

export interface ProvisioningMethodSelectorProps {
  /** Callback when a method is selected */
  onSelectMethod: (method: ProvisioningMethod) => void
  /** Additional className */
  className?: string
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface MethodCardProps {
  icon: React.ReactNode
  iconBgClass: string
  title: string
  description: string
  badge: string
  badgeBgClass: string
  badgeTextClass: string
  selected: boolean
  onClick: () => void
  'data-testid'?: string
}

function MethodCard({
  icon,
  iconBgClass,
  title,
  description,
  badge,
  badgeBgClass,
  badgeTextClass,
  selected,
  onClick,
  'data-testid': testId,
}: MethodCardProps) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={cn(
        'flex-1 flex flex-col items-center p-6 rounded-xl bg-surface',
        'border border-default shadow-sm',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-md hover:border-subtle',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        selected && 'border-accent shadow-md -translate-y-1 ring-2 ring-accent/20'
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center mb-4',
          iconBgClass
        )}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-secondary text-center mb-4">{description}</p>

      {/* Badge */}
      <span
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
          badgeBgClass,
          badgeTextClass
        )}
      >
        {badge}
      </span>
    </button>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * ProvisioningMethodSelector - Direct entry to Classic Wizard for creating new tenants.
 *
 * NOTE: Per MVP spec (Section 14.2), Chat Assistant option has been removed.
 * Tenant Request creation opens manual wizard directly.
 *
 * @deprecated Consider bypassing this selector entirely and going directly to wizard.
 *
 * @example
 * ```tsx
 * <ProvisioningMethodSelector
 *   onSelectMethod={(method) => {
 *     // method will always be 'wizard' in MVP
 *     router.push('/tenant-requests/new')
 *   }}
 * />
 * ```
 */
export function ProvisioningMethodSelector({
  onSelectMethod,
  className,
}: ProvisioningMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<ProvisioningMethod | null>(null)

  const handleMethodClick = (method: ProvisioningMethod) => {
    setSelectedMethod(method)
    onSelectMethod(method)
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {/* Glass Card - Depth 1 (Elevated) */}
      <div className={cn(
        "max-w-md w-full",
        "rounded-xl p-8",
        "bg-white/60 dark:bg-black/60 backdrop-blur-[8px]",
        "border-2 border-accent shadow-lg"
      )}>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Create New Tenant Request
          </h2>
          <p className="text-secondary">
            Fill out the form to submit a new tenant request
          </p>
        </div>

        {/* Single Method Card - Wizard Only (MVP) */}
        <div className="flex justify-center mb-8" data-testid="provisioning-method-cards">
          {/* Classic Wizard Option - Only option in MVP */}
          <MethodCard
            icon={<ClipboardList className="w-8 h-8 text-success" strokeWidth={1.5} />}
            iconBgClass="bg-success-light"
            title="Start Wizard"
            description="Fill out forms step by step with full control"
            badge="Guided form workflow"
            badgeBgClass="bg-success-muted"
            badgeTextClass="text-success"
            selected={selectedMethod === 'wizard'}
            onClick={() => handleMethodClick('wizard')}
            data-testid="provisioning-method-wizard"
          />
        </div>
      </div>
    </div>
  )
}

export default ProvisioningMethodSelector
