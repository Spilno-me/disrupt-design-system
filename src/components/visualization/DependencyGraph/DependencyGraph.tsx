/**
 * DependencyGraph Component
 * Main wrapper for the interactive 2D force-directed dependency visualization
 */

/* eslint-disable no-restricted-syntax */

import { useState, useEffect, useMemo, useCallback } from 'react'
import type {
  DependencyGraphProps,
  DependencyData,
  GraphNode,
  GraphLink,
  GraphFilters,
  GraphConfig,
} from './types'
import { GraphCanvas } from './GraphCanvas'
import { GraphControls } from './GraphControls'
import { NodeDetailPanel } from './NodeDetailPanel'
import { DEEP_CURRENT, DUSK_REEF, SLATE, ABYSS } from '../../../constants/designTokens'

// Import the generated dependency data
import dependencyData from '../../../../data/dependency-graph.json'
// Import the token architecture data (comprehensive token hierarchy)
import tokenArchitectureData from '../../../../data/token-architecture-graph.json'

// Graph visualization colors (from design tokens)
const GRAPH_COLORS = {
  accent: DEEP_CURRENT[500],      // #08A4BD - teal (components, alias tokens)
  secondary: DUSK_REEF[500],      // #5E4F7E - purple (primitive tokens)
  neutral: SLATE[500],            // #64748B - gray (other tokens)
  linkPrimary: ABYSS[300],        // #757B87 - import links
  linkSecondary: DEEP_CURRENT[700], // #056271 - token links
} as const

/** Default configuration for component dependency view */
const DEFAULT_CONFIG: Omit<GraphConfig, 'width' | 'height'> = {
  nodeRadius: {
    component: 8,
    token: 6,
  },
  forces: {
    linkDistance: 80,
    chargeStrength: -200,
    collisionRadius: 5,
  },
  colors: {
    component: GRAPH_COLORS.accent,
    tokenScale: GRAPH_COLORS.secondary,
    tokenAlias: GRAPH_COLORS.accent,
    tokenOther: GRAPH_COLORS.neutral,
    linkImport: GRAPH_COLORS.linkPrimary,
    linkToken: GRAPH_COLORS.linkSecondary,
  },
}

/** Configuration for token architecture view (hierarchical) */
const TOKEN_ARCHITECTURE_CONFIG: Omit<GraphConfig, 'width' | 'height'> = {
  nodeRadius: {
    component: 10,
    token: 8,
  },
  forces: {
    linkDistance: 60, // Tighter links for hierarchy
    chargeStrength: -150, // Less repulsion
    collisionRadius: 8,
  },
  colors: {
    component: GRAPH_COLORS.accent,
    tokenScale: GRAPH_COLORS.secondary,
    tokenAlias: GRAPH_COLORS.accent,
    tokenOther: GRAPH_COLORS.neutral,
    linkImport: GRAPH_COLORS.linkPrimary,
    linkToken: GRAPH_COLORS.linkSecondary,
  },
}

/** Default filters */
const DEFAULT_FILTERS: GraphFilters = {
  showComponents: true,
  showTokens: true,
  showPrimitives: true,
  showAlias: true,
  selectedGroup: 'all',
}

export function DependencyGraph({
  data,
  height = '600px',
  className = '',
  onNodeSelect,
  initialFilters,
  useTokenArchitecture = false,
}: DependencyGraphProps) {
  // State
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [filters, setFilters] = useState<GraphFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  })
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // Use provided data or imported data (token architecture or component dependencies)
  const graphData = useMemo<DependencyData>(() => {
    if (data) return data
    // Use token architecture data for the hierarchical token view
    if (useTokenArchitecture) {
      return tokenArchitectureData as unknown as DependencyData
    }
    return dependencyData as DependencyData
  }, [data, useTokenArchitecture])

  // Select config based on view type
  const baseConfig = useTokenArchitecture ? TOKEN_ARCHITECTURE_CONFIG : DEFAULT_CONFIG

  // Filter nodes based on current filters
  const filteredData = useMemo(() => {
    const filteredNodes = graphData.nodes.filter((node) => {
      // Component filtering
      if (node.type === 'component' && !filters.showComponents) return false

      // Primitive filtering (scales, shades, base primitives)
      if ((node.type === 'token-scale' || node.type === 'color-scale' ||
           node.type === 'primitive-shade' || node.type === 'primitive-base') &&
          !filters.showPrimitives) return false

      // Alias filtering (categories and tokens)
      if ((node.type === 'token-alias' || node.type === 'alias-category' ||
           node.type === 'alias-token') && !filters.showAlias) return false

      if (node.type === 'token-other' && !filters.showTokens) return false

      if (filters.selectedGroup !== 'all' && node.group !== filters.selectedGroup) {
        return false
      }
      return true
    })

    const nodeIds = new Set(filteredNodes.map((n) => n.id))

    const filteredLinks = graphData.links.filter((link) => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id
      const targetId = typeof link.target === 'string' ? link.target : link.target.id
      return nodeIds.has(sourceId) && nodeIds.has(targetId)
    })

    return {
      nodes: filteredNodes,
      links: filteredLinks,
    }
  }, [graphData, filters])

  // Get connected nodes for selected node
  const connectedNodes = useMemo(() => {
    if (!selectedNode) return []
    const connected: GraphNode[] = []
    filteredData.links.forEach((link) => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id
      const targetId = typeof link.target === 'string' ? link.target : link.target.id
      if (sourceId === selectedNode.id) {
        const target = filteredData.nodes.find((n) => n.id === targetId)
        if (target) connected.push(target)
      }
      if (targetId === selectedNode.id) {
        const source = filteredData.nodes.find((n) => n.id === sourceId)
        if (source) connected.push(source)
      }
    })
    return connected
  }, [selectedNode, filteredData])

  // Config with current dimensions
  const config: GraphConfig = useMemo(
    () => ({
      ...baseConfig,
      width: dimensions.width,
      height: dimensions.height,
    }),
    [dimensions, baseConfig]
  )

  // Handle container resize
  useEffect(() => {
    const container = document.getElementById('dependency-graph-container')
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Handlers
  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      setSelectedNode(node)
      onNodeSelect?.(node)
    },
    [onNodeSelect]
  )

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node)
  }, [])

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null)
    onNodeSelect?.(null)
  }, [onNodeSelect])

  const handleFilterChange = useCallback((newFilters: GraphFilters) => {
    setFilters(newFilters)
    setSelectedNode(null)
  }, [])

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setSelectedNode(null)
    setHoveredNode(null)
  }, [])

  // Parse height
  const containerHeight = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      id="dependency-graph-container"
      className={className}
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : undefined,
        left: isFullscreen ? 0 : undefined,
        right: isFullscreen ? 0 : undefined,
        bottom: isFullscreen ? 0 : undefined,
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : containerHeight,
        background: 'linear-gradient(135deg, #1D1F2A 0%, #0C0D12 100%)',
        borderRadius: isFullscreen ? 0 : '12px',
        overflow: 'hidden',
        zIndex: isFullscreen ? 9999 : undefined,
      }}
    >
      {/* Graph Canvas */}
      <GraphCanvas
        nodes={filteredData.nodes as GraphNode[]}
        links={filteredData.links as GraphLink[]}
        config={config}
        selectedNode={selectedNode}
        hoveredNode={hoveredNode}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        onBackgroundClick={handleBackgroundClick}
      />

      {/* Controls */}
      <GraphControls
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        nodeCount={filteredData.nodes.length}
        linkCount={filteredData.links.length}
      />

      {/* Detail Panel */}
      <NodeDetailPanel
        node={selectedNode}
        connectedNodes={connectedNodes}
        onClose={handleBackgroundClick}
      />

      {/* Fullscreen Toggle */}
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(45, 49, 66, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '10px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '12px',
          fontFamily: '"Fixel", system-ui, sans-serif',
          fontWeight: 500,
          zIndex: 100,
          transition: 'all 150ms',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(45, 49, 66, 1)'
          e.currentTarget.style.borderColor = 'rgba(8, 164, 189, 0.5)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(45, 49, 66, 0.9)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
        }}
      >
        {isFullscreen ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            Exit Fullscreen
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            Fullscreen
          </>
        )}
      </button>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          background: 'rgba(45, 49, 66, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '10px',
          fontFamily: '"Fixel", system-ui, sans-serif',
          color: 'rgba(255, 255, 255, 0.7)',
          zIndex: 50,
        }}
      >
        <div style={{ marginBottom: '8px', fontWeight: 600, color: GRAPH_COLORS.accent }}>
          Legend
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <LegendItem color={GRAPH_COLORS.accent} shape="circle" label="Component" />
          <LegendItem color={GRAPH_COLORS.secondary} shape="square" label="Primitive Token" />
          <LegendItem color={GRAPH_COLORS.accent} shape="diamond" label="Alias Token" />
          <div
            style={{
              marginTop: '4px',
              paddingTop: '4px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <LegendLine label="imports" />
            <LegendLine dashed label="uses-token" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Legend item for node types */
function LegendItem({
  color,
  shape,
  label,
}: {
  color: string
  shape: 'circle' | 'square' | 'diamond'
  label: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg width="12" height="12" viewBox="0 0 12 12">
        {shape === 'circle' && <circle cx="6" cy="6" r="5" fill={color} />}
        {shape === 'square' && (
          <rect x="1" y="1" width="10" height="10" rx="1" fill={color} />
        )}
        {shape === 'diamond' && (
          <polygon points="6,1 11,6 6,11 1,6" fill={color} />
        )}
      </svg>
      <span>{label}</span>
    </div>
  )
}

/** Legend item for link types */
function LegendLine({ dashed, label }: { dashed?: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg width="20" height="8" viewBox="0 0 20 8">
        <line
          x1="0"
          y1="4"
          x2="20"
          y2="4"
          stroke="#757B87"
          strokeWidth="2"
          strokeDasharray={dashed ? '4,2' : 'none'}
        />
      </svg>
      <span>{label}</span>
    </div>
  )
}
