/**
 * Selection Materializer
 *
 * Renders selection intentions (choose-one, choose-many) as appropriate
 * UI components based on resolution constraints:
 *
 * - Mobile → Large touch-friendly buttons
 * - Desktop + few options → Radio/Checkbox group
 * - Compact density → Dropdown select
 * - Many options → Searchable select
 */

import * as React from 'react'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { cn } from '../../../lib/utils'
import type { PatternMaterializer, MaterializerProps } from './types'
import { getOptionsFromIntention, isMultiSelect, getFieldLabel } from './types'

// =============================================================================
// CONSTANTS
// =============================================================================

const DROPDOWN_THRESHOLD = 5 // Show dropdown if more than this many options

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Mobile-optimized touch buttons
 */
function MobileSelectionButtons({
  resolution,
  value,
  onChange,
  disabled,
}: MaterializerProps) {
  const options = getOptionsFromIntention(resolution.sourceIntention)
  const label = getFieldLabel(resolution.sourceIntention)

  return (
    <div
      className="flex flex-col gap-3"
      role="radiogroup"
      aria-label={label}
    >
      {options.map((option) => {
        const isSelected = value === option.value

        return (
          <motion.button
            key={option.value}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.value)}
            disabled={disabled || option.disabled}
            className={cn(
              'flex items-center gap-4 p-4 min-h-[72px] w-full text-left rounded-lg border-2 transition-all',
              isSelected
                ? 'border-accent bg-accent-bg shadow-sm'
                : 'border-default bg-surface hover:bg-page',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-checked={isSelected}
            role="radio"
          >
            {/* Selection indicator */}
            <div
              className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full border-2 shrink-0',
                isSelected
                  ? 'border-accent bg-accent-strong'
                  : 'border-muted bg-surface'
              )}
            >
              {isSelected && <Check className="w-4 h-4 text-inverse" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className={cn(
                'font-semibold text-base',
                isSelected ? 'text-accent' : 'text-primary'
              )}>
                {option.label}
              </div>
              {option.description && (
                <div className="text-sm text-secondary mt-0.5">
                  {option.description}
                </div>
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

/**
 * Desktop radio group
 */
function DesktopRadioGroup({
  resolution,
  value,
  onChange,
  disabled,
}: MaterializerProps) {
  const options = getOptionsFromIntention(resolution.sourceIntention)
  const label = getFieldLabel(resolution.sourceIntention)

  return (
    <div
      className="flex flex-col gap-2"
      role="radiogroup"
      aria-label={label}
    >
      {options.map((option) => {
        const isSelected = value === option.value

        return (
          <label
            key={option.value}
            className={cn(
              'flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all',
              isSelected
                ? 'border-accent bg-accent-bg'
                : 'border-default bg-surface hover:bg-page',
              (disabled || option.disabled) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              disabled={disabled || option.disabled}
              className="sr-only"
            />
            {/* Radio circle */}
            <div
              className={cn(
                'flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0',
                isSelected
                  ? 'border-accent'
                  : 'border-muted'
              )}
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              )}
            </div>
            {/* Content */}
            <div className="flex-1">
              <span className="font-medium text-primary">{option.label}</span>
              {option.description && (
                <span className="text-sm text-secondary block mt-0.5">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        )
      })}
    </div>
  )
}

/**
 * Desktop checkbox group (multi-select)
 */
function DesktopCheckboxGroup({
  resolution,
  value,
  onChange,
  disabled,
}: MaterializerProps) {
  const options = getOptionsFromIntention(resolution.sourceIntention)
  const label = getFieldLabel(resolution.sourceIntention)
  const selected = (value as string[]) ?? []

  const toggleOption = (optionValue: string) => {
    const newSelected = selected.includes(optionValue)
      ? selected.filter((v) => v !== optionValue)
      : [...selected, optionValue]
    onChange(newSelected)
  }

  return (
    <div
      className="flex flex-col gap-2"
      role="group"
      aria-label={label}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option.value)

        return (
          <label
            key={option.value}
            className={cn(
              'flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all',
              isSelected
                ? 'border-accent bg-accent-bg'
                : 'border-default bg-surface hover:bg-page',
              (disabled || option.disabled) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              type="checkbox"
              value={option.value}
              checked={isSelected}
              onChange={() => toggleOption(option.value)}
              disabled={disabled || option.disabled}
              className="sr-only"
            />
            {/* Checkbox */}
            <div
              className={cn(
                'flex items-center justify-center w-5 h-5 rounded border-2 shrink-0',
                isSelected
                  ? 'border-accent bg-accent-strong'
                  : 'border-muted bg-surface'
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-inverse" />}
            </div>
            {/* Content */}
            <div className="flex-1">
              <span className="font-medium text-primary">{option.label}</span>
              {option.description && (
                <span className="text-sm text-secondary block mt-0.5">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        )
      })}
    </div>
  )
}

/**
 * Compact dropdown select
 */
function DropdownSelect({
  resolution,
  value,
  onChange,
  disabled,
}: MaterializerProps) {
  const options = getOptionsFromIntention(resolution.sourceIntention)
  const label = getFieldLabel(resolution.sourceIntention)

  return (
    <Select
      value={value as string}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`Select ${label.toLowerCase()}...`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/**
 * Horizontal button group (few options, inline)
 */
function HorizontalButtonGroup({
  resolution,
  value,
  onChange,
  disabled,
}: MaterializerProps) {
  const options = getOptionsFromIntention(resolution.sourceIntention)
  const label = getFieldLabel(resolution.sourceIntention)

  return (
    <div
      className="flex flex-wrap gap-2"
      role="radiogroup"
      aria-label={label}
    >
      {options.map((option) => {
        const isSelected = value === option.value

        return (
          <Button
            key={option.value}
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(option.value)}
            disabled={disabled || option.disabled}
            className={cn(
              isSelected && 'ring-2 ring-accent ring-offset-2'
            )}
            aria-checked={isSelected}
            role="radio"
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}

// =============================================================================
// SELECTION MATERIALIZER
// =============================================================================

export const SelectionMaterializer: PatternMaterializer = {
  pattern: 'selection',

  canHandle: (resolution) => resolution.manifestation.pattern === 'selection',

  render: (props) => {
    const { resolution } = props
    const { appliedConstraints, sourceIntention } = resolution
    const options = getOptionsFromIntention(sourceIntention)
    const isMulti = isMultiSelect(sourceIntention)

    // Determine which variant to render based on constraints
    const isMobile = appliedConstraints.device.viewport === 'mobile'
    const isCompact = appliedConstraints.designSystem.density === 'compact'
    const manyOptions = options.length > DROPDOWN_THRESHOLD

    // Mobile: Large touch buttons
    if (isMobile && !isCompact) {
      return <MobileSelectionButtons {...props} />
    }

    // Compact or many options: Dropdown
    if (isCompact || manyOptions) {
      // Multi-select with dropdown not supported yet, fall back to checkboxes
      if (isMulti) {
        return <DesktopCheckboxGroup {...props} />
      }
      return <DropdownSelect {...props} />
    }

    // Multi-select: Checkboxes
    if (isMulti) {
      return <DesktopCheckboxGroup {...props} />
    }

    // Few options (<=3): Horizontal buttons
    if (options.length <= 3) {
      return <HorizontalButtonGroup {...props} />
    }

    // Default: Radio group
    return <DesktopRadioGroup {...props} />
  },
}
