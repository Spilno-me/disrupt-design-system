/**
 * TenantProvisioningContent - Tenant provisioning tab content for Partner Portal
 *
 * Handles both chat and wizard provisioning methods.
 */

import * as React from 'react'
import { useState } from 'react'
import { cn } from '../../../lib/utils'
import {
  ProvisioningMethodSelector,
  ProvisioningMethod,
} from '../../../components/provisioning/ProvisioningMethodSelector'
import {
  TenantProvisioningChat,
  TenantChatFormData,
} from '../../../components/provisioning/TenantProvisioningChat'
import {
  TenantProvisioningWizard,
  TenantFormData as WizardTenantFormData,
  transformToApiRequest,
} from '../../../components/provisioning/TenantProvisioningWizard'

export interface TenantProvisioningContentProps {
  /** Callback when provisioning is completed */
  onComplete?: (data: TenantChatFormData | WizardTenantFormData) => void
}

export function TenantProvisioningContent({
  onComplete,
}: TenantProvisioningContentProps) {
  const [selectedMethod, setSelectedMethod] = useState<ProvisioningMethod | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle wizard form submission
  const handleWizardSubmit = async (data: WizardTenantFormData) => {
    setIsSubmitting(true)
    try {
      // Transform form data to API format
      const apiRequest = transformToApiRequest(data)

      // Simulate API call (replace with real API in consumer app)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log('API Request:', apiRequest)

      onComplete?.(data)
      setSelectedMethod(null)
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Method selection screen
  if (!selectedMethod) {
    return (
      <div className="p-6 h-full flex flex-col">
        <h1 className="text-2xl font-semibold text-primary mb-6">
          Tenant Provisioning
        </h1>
        <div className="flex-1 flex items-center justify-center">
          <ProvisioningMethodSelector
            onSelectMethod={setSelectedMethod}
            className="min-h-0"
          />
        </div>
      </div>
    )
  }

  // Chat-based provisioning
  if (selectedMethod === 'chat') {
    return (
      <div className="h-full">
        <TenantProvisioningChat
          onComplete={(data) => {
            onComplete?.(data)
            setSelectedMethod(null)
          }}
          onCancel={() => setSelectedMethod(null)}
        />
      </div>
    )
  }

  // Wizard-based provisioning
  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center min-h-0">
        {/* Glass Card - Depth 1 (Elevated) */}
        <div
          className={cn(
            'w-full max-w-5xl mb-8',
            'rounded-xl',
            'bg-white/60 dark:bg-black/60 backdrop-blur-[8px]',
            'border-2 border-accent shadow-lg',
            'flex flex-col'
          )}
        >
          <TenantProvisioningWizard
            onSubmit={handleWizardSubmit}
            onCancel={() => setSelectedMethod(null)}
            commissionPercentage={15}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}
