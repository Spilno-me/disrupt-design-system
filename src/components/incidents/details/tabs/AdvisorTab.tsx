/**
 * AdvisorTab - Placeholder for AI advisor recommendations
 *
 * @deprecated This component is deprecated as of v2.8.0.
 * The AI Advisor functionality has been moved to a global floating assistant
 * that's always accessible throughout the application.
 *
 * Use the new AIAssistant components instead:
 * ```tsx
 * import {
 *   AIAssistantProvider,
 *   AIAssistantFab,
 *   AIAssistantPanel
 * } from '@dds/design-system'
 *
 * <AIAssistantProvider>
 *   <App />
 *   <AIAssistantFab />
 *   <AIAssistantPanel />
 * </AIAssistantProvider>
 * ```
 *
 * This file is kept for backwards compatibility and will be removed in v3.0.0.
 */

import * as React from 'react'
import { Bot, Sparkles } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import type { PlaceholderTabProps } from '../types'

/**
 * AdvisorTab - AI advisor placeholder
 */
export function AdvisorTab({
  title = 'AI Advisor',
  description = 'This feature is coming soon. Get AI-powered insights, recommended actions, and similar incident analysis.',
  className,
}: PlaceholderTabProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-16 px-8',
        'bg-surface rounded-xl border border-default',
        className
      )}
    >
      {/* Icon with sparkle effect */}
      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-info/20 flex items-center justify-center mb-4">
        <Bot className="size-8 text-accent" />
        <Sparkles className="absolute -top-1 -right-1 size-5 text-warning" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-primary mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-secondary text-center max-w-md">
        {description}
      </p>

      {/* Feature preview */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs bg-muted-bg text-tertiary">
          Root Cause Analysis
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs bg-muted-bg text-tertiary">
          Similar Incidents
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs bg-muted-bg text-tertiary">
          Recommended Actions
        </span>
      </div>

      {/* Coming soon badge */}
      <div className="mt-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
          Coming Soon
        </span>
      </div>
    </div>
  )
}

export default AdvisorTab
