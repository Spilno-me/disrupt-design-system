/**
 * NodeDetailPanel Component
 * Shows details about the selected node in the dependency graph
 */

/* eslint-disable no-restricted-syntax */

import { X, FileCode, Layers, ArrowRight } from 'lucide-react'
import type { NodeDetailPanelProps } from './types'
import { getNodeTypeLabel } from './utils/nodeStyles'

export function NodeDetailPanel({
  node,
  connectedNodes,
  onClose,
}: NodeDetailPanelProps) {
  if (!node) return null

  const outgoingNodes = connectedNodes.filter(
    (n) => n.id !== node.id
  )

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        background: 'rgba(45, 49, 66, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRadius: '12px',
        padding: '20px',
        minWidth: '280px',
        maxWidth: '360px',
        color: '#FFFFFF',
        fontFamily: '"Fixel", system-ui, sans-serif',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(8, 164, 189, 0.3)',
        zIndex: 100,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#08A4BD',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {node.type === 'component' ? (
              <FileCode size={12} />
            ) : (
              <Layers size={12} />
            )}
            {getNodeTypeLabel(node.type)}
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#FFFFFF',
              wordBreak: 'break-word',
            }}
          >
            {node.name}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '6px',
            padding: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            transition: 'background 150ms',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')
          }
        >
          <X size={16} />
        </button>
      </div>

      {/* File path */}
      {node.filePath && (
        <div style={{ marginBottom: '12px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '4px',
            }}
          >
            File
          </div>
          <div
            style={{
              fontSize: '12px',
              fontFamily: 'ui-monospace, monospace',
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '8px 12px',
              borderRadius: '6px',
              color: 'rgba(255, 255, 255, 0.8)',
              wordBreak: 'break-all',
            }}
          >
            {node.filePath}
          </div>
        </div>
      )}

      {/* Group */}
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px',
          }}
        >
          Group
        </div>
        <span
          style={{
            fontSize: '12px',
            padding: '4px 10px',
            borderRadius: '4px',
            background:
              node.group === 'ui'
                ? 'rgba(8, 164, 189, 0.2)'
                : node.group === 'primitives'
                  ? 'rgba(94, 79, 126, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
            color:
              node.group === 'ui'
                ? '#08A4BD'
                : node.group === 'primitives'
                  ? '#9F93B7'
                  : 'rgba(255, 255, 255, 0.8)',
          }}
        >
          {node.group}
        </span>
      </div>

      {/* Connected nodes */}
      {outgoingNodes.length > 0 && (
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowRight size={12} />
            Connections ({outgoingNodes.length})
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              maxHeight: '120px',
              overflowY: 'auto',
            }}
          >
            {outgoingNodes.slice(0, 12).map((n) => (
              <span
                key={n.id}
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background:
                    n.type === 'component'
                      ? 'rgba(8, 164, 189, 0.15)'
                      : 'rgba(94, 79, 126, 0.15)',
                  color:
                    n.type === 'component' ? '#33BFD7' : '#BFB7CF',
                  border: `1px solid ${
                    n.type === 'component'
                      ? 'rgba(8, 164, 189, 0.3)'
                      : 'rgba(94, 79, 126, 0.3)'
                  }`,
                }}
              >
                {n.name}
              </span>
            ))}
            {outgoingNodes.length > 12 && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                +{outgoingNodes.length - 12} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Dependency count */}
      {node.metadata?.dependencyCount !== undefined && (
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {node.metadata.dependencyCount} direct dependencies
        </div>
      )}
    </div>
  )
}
