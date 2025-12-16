/**
 * NodeDetailPanel Component
 * Overlay panel showing details of selected node
 *
 * Note: This visualization overlay uses some hardcoded sizes for
 * precise 3D canvas positioning. Design tokens are used where applicable.
 */

/* eslint-disable no-restricted-syntax */

import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
import type { NodeDetailPanelProps } from './types'
import { isColorValue } from './utils/colorUtils'
import { RADIUS, SPACING, SHADOWS, ALIAS } from '@/constants/designTokens'

export function NodeDetailPanel({ node, onClose, onCopyValue }: NodeDetailPanelProps) {
  const [copied, setCopied] = useState(false)

  if (!node) return null

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopyValue?.(text)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('Failed to copy')
    }
  }

  const hasColorValue = node.value && isColorValue(node.value)
  const tokenPath = node.metadata?.tokenPath

  return (
    <div
      style={{
        position: 'absolute',
        bottom: SPACING.px.comfortable,
        left: SPACING.px.comfortable,
        background: ALIAS.overlay.darkStrong,
        backdropFilter: 'blur(12px)',
        borderRadius: RADIUS.md,
        padding: SPACING.px.cardPadding,
        minWidth: '280px',
        maxWidth: '360px',
        color: ALIAS.text.inverse,
        fontFamily: '"Fixel", system-ui, sans-serif',
        boxShadow: SHADOWS.xl,
        border: `1px solid ${ALIAS.border.accentDark}`,
        zIndex: 100,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: SPACING.px.base,
        }}
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: ALIAS.brand.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: SPACING.px.micro,
            }}
          >
            {node.type}
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: ALIAS.text.inverse,
            }}
          >
            {node.name}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: ALIAS.overlay.white15,
            border: 'none',
            borderRadius: RADIUS.xs,
            padding: SPACING.px.micro,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: ALIAS.text.inverse,
            transition: 'background 150ms',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = ALIAS.overlay.white50)}
          onMouseOut={(e) => (e.currentTarget.style.background = ALIAS.overlay.white15)}
        >
          <X size={16} />
        </button>
      </div>

      {/* Color preview */}
      {hasColorValue && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.px.tight,
            padding: SPACING.px.tight,
            background: ALIAS.overlay.medium,
            borderRadius: RADIUS.sm,
            marginBottom: SPACING.px.base,
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: RADIUS.sm,
              background: node.value,
              border: `2px solid ${ALIAS.overlay.white50}`,
              boxShadow: SHADOWS.md,
            }}
          />
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'ui-monospace, monospace',
                color: ALIAS.text.inverse,
              }}
            >
              {node.value}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: ALIAS.overlay.white60,
                marginTop: '2px',
              }}
            >
              Click to copy
            </div>
          </div>
          <button
            onClick={() => handleCopy(node.value!)}
            style={{
              marginLeft: 'auto',
              background: copied ? ALIAS.status.success : ALIAS.background.accentDark,
              border: 'none',
              borderRadius: RADIUS.xs,
              padding: SPACING.px.tight,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: ALIAS.text.inverse,
              transition: 'all 150ms',
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      )}

      {/* Token path */}
      {tokenPath && (
        <div style={{ marginBottom: SPACING.px.tight }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: ALIAS.overlay.white50,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: SPACING.px.micro,
            }}
          >
            Token Path
          </div>
          <div
            onClick={() => handleCopy(tokenPath)}
            style={{
              fontSize: '13px',
              fontFamily: 'ui-monospace, monospace',
              background: ALIAS.overlay.medium,
              padding: `${SPACING.px.tight} ${SPACING.px.tight}`,
              borderRadius: RADIUS.xs,
              color: ALIAS.brand.secondary,
              cursor: 'pointer',
              transition: 'background 150ms',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{tokenPath}</span>
            <Copy size={14} style={{ opacity: 0.5 }} />
          </div>
        </div>
      )}

      {/* Usage description */}
      {node.metadata?.usage && (
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: ALIAS.overlay.white50,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: SPACING.px.micro,
            }}
          >
            Usage
          </div>
          <div
            style={{
              fontSize: '13px',
              color: ALIAS.overlay.white60,
              lineHeight: 1.5,
            }}
          >
            {node.metadata.usage}
          </div>
        </div>
      )}

      {/* Tier indicator */}
      {node.metadata?.tier && (
        <div
          style={{
            marginTop: SPACING.px.base,
            paddingTop: SPACING.px.base,
            borderTop: `1px solid ${ALIAS.overlay.white15}`,
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: `${SPACING.px.micro} ${SPACING.px.tight}`,
              borderRadius: RADIUS.xs,
              background: node.metadata.tier === 1 ? ALIAS.background.muted : ALIAS.background.accentDark,
              color: node.metadata.tier === 1 ? ALIAS.text.secondary : ALIAS.brand.secondary,
            }}
          >
            Tier {node.metadata.tier}: {node.metadata.tier === 1 ? 'Primitive' : 'Alias'}
          </span>
        </div>
      )}

      {/* Child count */}
      {node.children.length > 0 && (
        <div
          style={{
            marginTop: SPACING.px.tight,
            fontSize: '12px',
            color: ALIAS.overlay.white50,
          }}
        >
          {node.expanded
            ? `${node.children.length} children visible`
            : `Click to expand ${node.children.length} children`}
        </div>
      )}
    </div>
  )
}
