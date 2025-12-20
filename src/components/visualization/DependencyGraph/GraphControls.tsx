/**
 * GraphControls Component
 * Filter and control panel for the dependency graph
 */

/* eslint-disable no-restricted-syntax */

import { Filter, RotateCcw } from 'lucide-react'
import { DEEP_CURRENT, DUSK_REEF, SLATE } from '../../../constants/designTokens'
import type { GraphControlsProps } from './types'

// Graph visualization colors (used in canvas/overlay contexts)
const GRAPH_COLORS = {
  accent: DEEP_CURRENT[500],    // #08A4BD - teal
  secondary: DUSK_REEF[500],    // #5E4F7E - purple
  neutral: SLATE[500],          // #64748B - gray
} as const

export function GraphControls({
  filters,
  onFilterChange,
  onReset,
  nodeCount,
  linkCount,
}: GraphControlsProps) {
  const toggleFilter = (key: keyof typeof filters) => {
    if (typeof filters[key] === 'boolean') {
      onFilterChange({
        ...filters,
        [key]: !filters[key],
      })
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'rgba(45, 49, 66, 0.9)',
        backdropFilter: 'blur(8px)',
        borderRadius: '10px',
        padding: '14px',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '12px',
        fontFamily: '"Fixel", system-ui, sans-serif',
        minWidth: '180px',
        zIndex: 100,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          paddingBottom: '10px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Filter size={14} color={GRAPH_COLORS.accent} />
        <span style={{ fontWeight: 600, color: GRAPH_COLORS.accent }}>Filters</span>
      </div>

      {/* Filter toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <FilterToggle
          label="Components"
          checked={filters.showComponents}
          onChange={() => toggleFilter('showComponents')}
          color={GRAPH_COLORS.accent}
        />
        <FilterToggle
          label="Alias Tokens"
          checked={filters.showAlias}
          onChange={() => toggleFilter('showAlias')}
          color={GRAPH_COLORS.accent}
        />
        <FilterToggle
          label="Primitive Tokens"
          checked={filters.showPrimitives}
          onChange={() => toggleFilter('showPrimitives')}
          color={GRAPH_COLORS.secondary}
        />
        <FilterToggle
          label="Other Tokens"
          checked={filters.showTokens}
          onChange={() => toggleFilter('showTokens')}
          color={GRAPH_COLORS.neutral}
        />
      </div>

      {/* Stats */}
      <div
        style={{
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        <span>{nodeCount} nodes</span>
        <span>{linkCount} links</span>
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        style={{
          marginTop: '12px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '11px',
          cursor: 'pointer',
          transition: 'all 150ms',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <RotateCcw size={12} />
        Reset View
      </button>

      {/* Instructions */}
      <div
        style={{
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.4)',
          lineHeight: 1.5,
        }}
      >
        <div>Drag to pan</div>
        <div>Scroll to zoom</div>
        <div>Click nodes for details</div>
        <div>Drag nodes to move</div>
      </div>
    </div>
  )
}

/** Individual filter toggle */
function FilterToggle({
  label,
  checked,
  onChange,
  color,
}: {
  label: string
  checked: boolean
  onChange: () => void
  color: string
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        padding: '4px 0',
      }}
    >
      <div
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '4px',
          border: `2px solid ${checked ? color : 'rgba(255, 255, 255, 0.3)'}`,
          background: checked ? color : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 150ms',
        }}
        onClick={onChange}
      >
        {checked && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 5l2 2 4-4" />
          </svg>
        )}
      </div>
      <span
        style={{
          color: checked ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
        }}
      >
        {label}
      </span>
    </label>
  )
}
