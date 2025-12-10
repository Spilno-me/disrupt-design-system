import * as React from 'react'
import { useState } from 'react'
import { MessageSquare, ClipboardList } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Card, CardContent } from '../ui/card'

// =============================================================================
// TYPES
// =============================================================================

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
}: MethodCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex flex-col items-center p-6 rounded-xl border-2 bg-surface',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2',
        selected
          ? 'border-teal shadow-md -translate-y-1'
          : 'border-transparent hover:border-subtle'
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
      <p className="text-sm text-emphasis text-center mb-4">{description}</p>

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
 * ProvisioningMethodSelector - Allows users to choose between Chat Assistant
 * or Classic Wizard for creating new tenants.
 *
 * @example
 * ```tsx
 * <ProvisioningMethodSelector
 *   onSelectMethod={(method) => {
 *     if (method === 'chat') {
 *       router.push('/tenant-provisioning/chat')
 *     } else {
 *       router.push('/tenant-provisioning/wizard')
 *     }
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
    <div className={cn('flex items-center justify-center min-h-[calc(100vh-200px)]', className)}>
      <Card className="max-w-2xl w-full border border-default" shadow="lg">
        <CardContent className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Create New Tenant
          </h2>
          <p className="text-emphasis">
            Choose how you&apos;d like to proceed
          </p>
        </div>

        {/* Method Cards */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Chat Assistant Option */}
          <MethodCard
            icon={<MessageSquare className="w-8 h-8 text-info" strokeWidth={1.5} />}
            iconBgClass="bg-info-light"
            title="Chat Assistant"
            description="Answer questions conversationally with AI guidance"
            badge="Best for: Quick setup, guidance"
            badgeBgClass="bg-info-muted"
            badgeTextClass="text-info"
            selected={selectedMethod === 'chat'}
            onClick={() => handleMethodClick('chat')}
          />

          {/* Classic Wizard Option */}
          <MethodCard
            icon={<ClipboardList className="w-8 h-8 text-success" strokeWidth={1.5} />}
            iconBgClass="bg-success-light"
            title="Classic Wizard"
            description="Fill out forms step by step with full control"
            badge="Best for: Detailed control, review"
            badgeBgClass="bg-success-muted"
            badgeTextClass="text-success"
            selected={selectedMethod === 'wizard'}
            onClick={() => handleMethodClick('wizard')}
          />
        </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProvisioningMethodSelector
