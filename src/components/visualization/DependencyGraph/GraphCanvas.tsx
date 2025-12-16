/**
 * GraphCanvas Component
 * SVG-based rendering of the force-directed graph with D3 zoom/pan
 */

/* eslint-disable no-restricted-syntax */

import { useRef, useEffect, useCallback, useState } from 'react'
import * as d3Selection from 'd3-selection'
import * as d3Zoom from 'd3-zoom'
import type { GraphNode, GraphLink, GraphConfig } from './types'
import { useForceSimulation } from './hooks/useForceSimulation'
import {
  getNodeColor,
  getNodeRadius,
  getLinkColor,
  getLinkDashArray,
  getLinkOpacity,
  getNodeShape,
} from './utils/nodeStyles'

interface GraphCanvasProps {
  nodes: GraphNode[]
  links: GraphLink[]
  config: GraphConfig
  selectedNode: GraphNode | null
  hoveredNode: GraphNode | null
  onNodeClick: (node: GraphNode) => void
  onNodeHover: (node: GraphNode | null) => void
  onBackgroundClick: () => void
}

export function GraphCanvas({
  nodes,
  links,
  config,
  selectedNode,
  hoveredNode,
  onNodeClick,
  onNodeHover,
  onBackgroundClick,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const [, forceUpdate] = useState(0)

  // Drag state
  const draggedNodeRef = useRef<GraphNode | null>(null)
  const transformRef = useRef<d3Zoom.ZoomTransform>(d3Zoom.zoomIdentity)
  const [isDragging, setIsDragging] = useState(false)

  // Force simulation
  const { simulation } = useForceSimulation({
    nodes,
    links,
    config,
    onTick: () => forceUpdate((n) => n + 1),
  })

  // Set up zoom/pan
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return

    const svg = d3Selection.select(svgRef.current)
    const g = d3Selection.select(gRef.current)

    const zoom = d3Zoom
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .filter((event) => {
        // Don't zoom when dragging a node
        if (draggedNodeRef.current) return false
        return !event.ctrlKey && !event.button
      })
      .on('zoom', (event) => {
        transformRef.current = event.transform
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Initial zoom to fit
    const initialTransform = d3Zoom.zoomIdentity
      .translate(config.width * 0.1, config.height * 0.1)
      .scale(0.8)
    svg.call(zoom.transform, initialTransform)
    transformRef.current = initialTransform

    return () => {
      svg.on('.zoom', null)
    }
  }, [config.width, config.height])

  // Convert screen coordinates to graph coordinates (accounting for zoom/pan)
  const screenToGraph = useCallback((screenX: number, screenY: number) => {
    const transform = transformRef.current
    return {
      x: (screenX - transform.x) / transform.k,
      y: (screenY - transform.y) / transform.k,
    }
  }, [])

  // Handle node drag start
  const handleDragStart = useCallback(
    (e: React.MouseEvent, node: GraphNode) => {
      if (!simulation) return

      e.preventDefault()
      e.stopPropagation()

      // Start dragging
      draggedNodeRef.current = node
      setIsDragging(true)
      simulation.alphaTarget(0.3).restart()
      node.fx = node.x
      node.fy = node.y
    },
    [simulation]
  )

  // Handle mouse move during drag
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const node = draggedNodeRef.current
      if (!node || !svgRef.current) return

      const rect = svgRef.current.getBoundingClientRect()
      const screenX = e.clientX - rect.left
      const screenY = e.clientY - rect.top

      const { x, y } = screenToGraph(screenX, screenY)
      node.fx = x
      node.fy = y

      forceUpdate((n) => n + 1)
    },
    [screenToGraph]
  )

  // Handle mouse up to end drag
  const handleMouseUp = useCallback(() => {
    const node = draggedNodeRef.current
    if (!node || !simulation) return

    simulation.alphaTarget(0)
    node.fx = null
    node.fy = null
    draggedNodeRef.current = null
    setIsDragging(false)
  }, [simulation])

  // Global mouse up listener (in case mouse leaves SVG)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      const node = draggedNodeRef.current
      if (!node || !simulation) return

      simulation.alphaTarget(0)
      node.fx = null
      node.fy = null
      draggedNodeRef.current = null
      setIsDragging(false)
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [simulation])

  // Get connected node IDs for highlighting
  const getConnectedIds = useCallback(
    (node: GraphNode | null): Set<string> => {
      if (!node) return new Set()
      const connected = new Set<string>([node.id])
      links.forEach((link) => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id
        const targetId = typeof link.target === 'string' ? link.target : link.target.id
        if (sourceId === node.id) connected.add(targetId)
        if (targetId === node.id) connected.add(sourceId)
      })
      return connected
    },
    [links]
  )

  const highlightedIds = getConnectedIds(hoveredNode || selectedNode)
  const hasHighlight = highlightedIds.size > 0

  return (
    <svg
      ref={svgRef}
      width={config.width}
      height={config.height}
      style={{
        background: 'transparent',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
        if (e.target === svgRef.current || e.target === gRef.current) {
          onBackgroundClick()
        }
      }}
    >
      <defs>
        {/* Arrow marker for links */}
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="20"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#757B87" />
        </marker>
      </defs>

      <g ref={gRef}>
        {/* Links */}
        <g className="links">
          {links.map((link, i) => {
            const source = link.source as GraphNode
            const target = link.target as GraphNode
            if (!source.x || !source.y || !target.x || !target.y) return null

            const sourceId = source.id
            const targetId = target.id
            const isHighlighted =
              hasHighlight &&
              (highlightedIds.has(sourceId) && highlightedIds.has(targetId))
            const isDimmed = hasHighlight && !isHighlighted

            return (
              <line
                key={`link-${i}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={getLinkColor(link.type)}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeDasharray={getLinkDashArray(link.type)}
                strokeOpacity={isDimmed ? 0.1 : getLinkOpacity(link.type)}
                style={{ transition: 'stroke-opacity 200ms, stroke-width 200ms' }}
              />
            )
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map((node) => {
            if (node.x === undefined || node.y === undefined) return null

            const isSelected = selectedNode?.id === node.id
            const isHovered = hoveredNode?.id === node.id
            const isHighlighted = highlightedIds.has(node.id)
            const isDimmed = hasHighlight && !isHighlighted

            const radius = getNodeRadius(node)
            const color = getNodeColor(node)
            const shape = getNodeShape(node.type)

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                style={{
                  cursor: 'pointer',
                  transition: 'opacity 200ms',
                  opacity: isDimmed ? 0.2 : 1,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onNodeClick(node)
                }}
                onMouseEnter={() => onNodeHover(node)}
                onMouseLeave={() => onNodeHover(null)}
                onMouseDown={(e) => handleDragStart(e, node)}
              >
                {/* Glow effect for selected/hovered */}
                {(isSelected || isHovered) && (
                  <circle
                    r={radius + 4}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeOpacity={0.4}
                  />
                )}

                {/* Node shape */}
                {shape === 'circle' && (
                  <circle
                    r={radius}
                    fill={color}
                    stroke={isSelected ? '#FFFFFF' : 'none'}
                    strokeWidth={isSelected ? 2 : 0}
                  />
                )}
                {shape === 'square' && (
                  <rect
                    x={-radius}
                    y={-radius}
                    width={radius * 2}
                    height={radius * 2}
                    fill={color}
                    stroke={isSelected ? '#FFFFFF' : '#2D3142'}
                    strokeWidth={isSelected ? 2 : 1}
                    rx={2}
                  />
                )}
                {shape === 'diamond' && (
                  <polygon
                    points={`0,${-radius} ${radius},0 0,${radius} ${-radius},0`}
                    fill={color}
                    stroke={isSelected ? '#FFFFFF' : 'none'}
                    strokeWidth={isSelected ? 2 : 0}
                  />
                )}
                {shape === 'hexagon' && (
                  <polygon
                    points={`${-radius * 0.5},${-radius * 0.87} ${radius * 0.5},${-radius * 0.87} ${radius},0 ${radius * 0.5},${radius * 0.87} ${-radius * 0.5},${radius * 0.87} ${-radius},0`}
                    fill={color}
                    stroke={isSelected ? '#FFFFFF' : '#2D3142'}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                )}

                {/* Label (show on hover, selected, or for parent nodes) */}
                {(isHovered || isSelected ||
                  node.type === 'color-scale' ||
                  node.type === 'alias-category' ||
                  node.type === 'primitive-base' ||
                  node.type === 'component' ||
                  (node.metadata?.dependencyCount ?? 0) > 3) && (
                  <text
                    y={-radius - 6}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize={node.type === 'color-scale' || node.type === 'alias-category' ? '11' : '10'}
                    fontFamily="Fixel, system-ui, sans-serif"
                    fontWeight={node.type === 'color-scale' || node.type === 'alias-category' ? 600 : 500}
                    style={{
                      pointerEvents: 'none',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    }}
                  >
                    {node.name}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </g>
    </svg>
  )
}
