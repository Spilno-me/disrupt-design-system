/**
 * TemplateConfigSection - Template metadata form fields
 *
 * Handles template name, category, and business key inputs.
 * Extracted from CreateTemplateDialog for single responsibility.
 *
 * @component MOLECULE
 */

import * as React from 'react'
import { HelpCircle } from 'lucide-react'
import { Input } from '../../../../../components/ui/input'
import { Label } from '../../../../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../components/ui/select'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../../../components/ui/tooltip'
import type { TemplateCategory } from '../../types'
import { TEMPLATE_CATEGORIES } from '../../types'

// =============================================================================
// TYPES
// =============================================================================

export interface TemplateConfigSectionProps {
  /** Template name value */
  name: string
  /** Callback when name changes */
  onNameChange: (value: string) => void
  /** Name validation error message */
  nameError?: string
  /** Selected category */
  category: TemplateCategory
  /** Callback when category changes */
  onCategoryChange: (value: TemplateCategory) => void
  /** Business key template pattern */
  businessKeyTemplate: string
  /** Callback when business key changes */
  onBusinessKeyChange: (value: string) => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TemplateConfigSection({
  name,
  onNameChange,
  nameError,
  category,
  onCategoryChange,
  businessKeyTemplate,
  onBusinessKeyChange,
}: TemplateConfigSectionProps) {
  return (
    <div className="rounded-lg border border-default p-4">
      <h3 className="font-semibold text-primary mb-4">
        Template Configuration
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Template Name */}
        <div className="space-y-2">
          <Label htmlFor="create-template-name">
            Template Name <span className="text-error">*</span>
          </Label>
          <Input
            id="create-template-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g., Safety Inspection"
            aria-invalid={!!nameError}
          />
          {nameError && (
            <p className="text-xs text-error">{nameError}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="create-template-category">Category</Label>
          <Select
            value={category}
            onValueChange={(value) => onCategoryChange(value as TemplateCategory)}
          >
            <SelectTrigger id="create-template-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATE_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Business Key Template */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="create-business-key">Business Key</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-secondary hover:text-primary"
                >
                  <HelpCircle className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Optional template for generating business keys. Use{' '}
                {'{code}'}, {'{sequence}'}, {'{date}'}, {'{id}'}.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="create-business-key"
            value={businessKeyTemplate}
            onChange={(e) => onBusinessKeyChange(e.target.value)}
            placeholder="e.g., SI-{sequence}"
            maxLength={100}
          />
        </div>
      </div>
    </div>
  )
}

TemplateConfigSection.displayName = 'TemplateConfigSection'

export default TemplateConfigSection
