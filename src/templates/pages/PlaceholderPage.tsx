/**
 * PlaceholderPage - Temporary page for routes under development
 *
 * Use this as a placeholder while building out your app.
 */

import * as React from 'react'
import { Construction, ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'

export interface PlaceholderPageProps {
  /** Page title */
  title: string
  /** Description text */
  description?: string
  /** Custom icon */
  icon?: React.ReactNode
  /** Show back button */
  showBackButton?: boolean
  /** Back button handler */
  onBack?: () => void
  /** Custom class name */
  className?: string
  /** Children to render below description */
  children?: React.ReactNode
}

/**
 * PlaceholderPage - Shows a placeholder for pages under construction
 *
 * @example
 * ```tsx
 * <PlaceholderPage
 *   title="Settings"
 *   description="This page is coming soon"
 *   icon={<Settings className="w-12 h-12" />}
 *   showBackButton
 *   onBack={() => navigate('dashboard')}
 * />
 * ```
 */
export function PlaceholderPage({
  title,
  description = 'This page is part of the prototype. Content coming soon.',
  icon,
  showBackButton = false,
  onBack,
  className,
  children,
}: PlaceholderPageProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[400px] h-full p-6',
        className
      )}
    >
      {showBackButton && onBack && (
        <div className="absolute top-6 left-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      )}

      <div className="text-center max-w-md">
        <div className="mb-4 text-teal">
          {icon || <Construction className="w-12 h-12 mx-auto" />}
        </div>
        <h1 className="text-2xl font-semibold text-primary mb-2">{title}</h1>
        <p className="text-secondary">{description}</p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  )
}

export default PlaceholderPage
